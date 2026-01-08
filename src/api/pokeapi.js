/**
 * Fetch Pokémon data from the PokeAPI by name or ID.
 * @param {string|number} nameOrId - The Pokémon name or ID.
 * @returns {Promise<Object>} The Pokémon data object.
 * @throws {Error} If the fetch fails or the Pokémon is not found.
 */
export async function getPokemon(nameOrId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nameOrId)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pokémon not found: ${nameOrId}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch Pokémon: ${error.message}`);
  }
}

/**
 * Mega Evolution mappings - Pokemon that can Mega Evolve
 * Maps base Pokemon name to their Mega form names in PokeAPI
 */
export const megaEvolutions = {
  'venusaur': ['venusaur-mega'],
  'charizard': ['charizard-mega-x', 'charizard-mega-y'],
  'blastoise': ['blastoise-mega'],
  'alakazam': ['alakazam-mega'],
  'gengar': ['gengar-mega'],
  'kangaskhan': ['kangaskhan-mega'],
  'pinsir': ['pinsir-mega'],
  'gyarados': ['gyarados-mega'],
  'aerodactyl': ['aerodactyl-mega'],
  'mewtwo': ['mewtwo-mega-x', 'mewtwo-mega-y'],
  'ampharos': ['ampharos-mega'],
  'scizor': ['scizor-mega'],
  'heracross': ['heracross-mega'],
  'houndoom': ['houndoom-mega'],
  'tyranitar': ['tyranitar-mega'],
  'blaziken': ['blaziken-mega'],
  'gardevoir': ['gardevoir-mega'],
  'mawile': ['mawile-mega'],
  'aggron': ['aggron-mega'],
  'medicham': ['medicham-mega'],
  'manectric': ['manectric-mega'],
  'banette': ['banette-mega'],
  'absol': ['absol-mega'],
  'garchomp': ['garchomp-mega'],
  'lucario': ['lucario-mega'],
  'abomasnow': ['abomasnow-mega'],
  'beedrill': ['beedrill-mega'],
  'pidgeot': ['pidgeot-mega'],
  'slowbro': ['slowbro-mega'],
  'steelix': ['steelix-mega'],
  'sceptile': ['sceptile-mega'],
  'swampert': ['swampert-mega'],
  'sableye': ['sableye-mega'],
  'sharpedo': ['sharpedo-mega'],
  'camerupt': ['camerupt-mega'],
  'altaria': ['altaria-mega'],
  'glalie': ['glalie-mega'],
  'salamence': ['salamence-mega'],
  'metagross': ['metagross-mega'],
  'latias': ['latias-mega'],
  'latios': ['latios-mega'],
  'rayquaza': ['rayquaza-mega'],
  'lopunny': ['lopunny-mega'],
  'gallade': ['gallade-mega'],
  'audino': ['audino-mega'],
  'diancie': ['diancie-mega'],
};

/**
 * Check if a Pokemon can Mega Evolve
 * @param {string} name - The Pokemon name
 * @returns {string[]|null} Array of mega form names or null
 */
export function getMegaForms(name) {
  const baseName = name.toLowerCase().split('-')[0];
  return megaEvolutions[baseName] || null;
}

/**
 * Fetch Mega Evolution data for a Pokemon
 * @param {string} megaFormName - The mega form name (e.g., 'charizard-mega-x')
 * @returns {Promise<Object|null>} The mega form data or null if not found
 */
export async function getMegaEvolutionData(megaFormName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaFormName}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Get display name for a mega form
 * @param {string} megaFormName - The API form name
 * @returns {string} Human readable name
 */
export function getMegaDisplayName(megaFormName) {
  if (megaFormName.includes('-mega-x')) {
    return 'Mega X';
  } else if (megaFormName.includes('-mega-y')) {
    return 'Mega Y';
  } else if (megaFormName.includes('-mega')) {
    return 'Mega';
  }
  return megaFormName;
}
