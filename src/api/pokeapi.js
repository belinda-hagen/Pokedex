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

export const excludedPatterns = [
  '-mega',
  '-gmax',
  '-totem',
  '-starter',
  '-cosplay',
  '-cap',
  '-original-cap',
  '-hoenn-cap',
  '-sinnoh-cap',
  '-unova-cap',
  '-kalos-cap',
  '-alola-cap',
  '-partner-cap',
  '-world-cap',
  '-rock-star',
  '-belle',
  '-pop-star',
  '-phd',
  '-libre',
  '-busted',
  '-hangry',
  '-eternamax',
  '-crowned',
  '-ice-rider',
  '-shadow-rider',
  '-bloodmoon',
  '-roaming',
  '-combat',
  '-blaze',
  '-aqua',
  '-low-key',
  '-noice',
  '-antique',
  '-family-of-three',
  '-family-of-four',
  '-three-segment',
  '-two-segment',
  '-stretchy',
  '-droopy',
  '-curly',
  '-zero',
  '-hero',
  '-artisan',
  '-matron',
  '-ordinary',
  '-resolute',
  '-aria',
  '-pirouette',
  '-therian',
  '-black',
  '-white',
  '-school',
  '-meteor',
  '-ash',
  '-primal',
  '-origin',
  '-sky',
  '-ultra',
  '-dusk-mane',
  '-dawn-wings',
  '-gulping',
  '-gorging',
  '-rapid-strike',
  '-single-strike',
  '-dada',
  '-wellspring',
  '-hearthflame',
  '-cornerstone',
  '-teal',
  '-small',
  '-large',
  '-super',
];

export function shouldFilterPokemon(name) {
  const lowerName = name.toLowerCase();
  return excludedPatterns.some(pattern => lowerName.includes(pattern));
}

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

export const gigantamaxEvolutions = {
  'charizard': ['charizard-gmax'],
  'butterfree': ['butterfree-gmax'],
  'pikachu': ['pikachu-gmax'],
  'meowth': ['meowth-gmax'],
  'machamp': ['machamp-gmax'],
  'gengar': ['gengar-gmax'],
  'kingler': ['kingler-gmax'],
  'lapras': ['lapras-gmax'],
  'eevee': ['eevee-gmax'],
  'snorlax': ['snorlax-gmax'],
  'garbodor': ['garbodor-gmax'],
  'melmetal': ['melmetal-gmax'],
  'rillaboom': ['rillaboom-gmax'],
  'cinderace': ['cinderace-gmax'],
  'inteleon': ['inteleon-gmax'],
  'corviknight': ['corviknight-gmax'],
  'orbeetle': ['orbeetle-gmax'],
  'drednaw': ['drednaw-gmax'],
  'coalossal': ['coalossal-gmax'],
  'flapple': ['flapple-gmax'],
  'appletun': ['appletun-gmax'],
  'sandaconda': ['sandaconda-gmax'],
  'toxtricity': ['toxtricity-amped-gmax', 'toxtricity-low-key-gmax'],
  'centiskorch': ['centiskorch-gmax'],
  'hatterene': ['hatterene-gmax'],
  'grimmsnarl': ['grimmsnarl-gmax'],
  'alcremie': ['alcremie-gmax'],
  'copperajah': ['copperajah-gmax'],
  'duraludon': ['duraludon-gmax'],
  'urshifu': ['urshifu-single-strike-gmax', 'urshifu-rapid-strike-gmax'],
  'venusaur': ['venusaur-gmax'],
  'blastoise': ['blastoise-gmax'],
};

export function getMegaForms(name) {
  const baseName = name.toLowerCase().split('-')[0];
  return megaEvolutions[baseName] || null;
}

export function getGmaxForms(name) {
  const baseName = name.toLowerCase().split('-')[0];
  return gigantamaxEvolutions[baseName] || null;
}

export function getAllSpecialForms(name) {
  return {
    mega: getMegaForms(name),
    gmax: getGmaxForms(name),
  };
}

export async function getMegaEvolutionData(megaFormName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaFormName}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function getGmaxEvolutionData(gmaxFormName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${gmaxFormName}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

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

export function getGmaxDisplayName(gmaxFormName) {
  if (gmaxFormName.includes('-amped-gmax')) {
    return 'G-Max (Amped)';
  } else if (gmaxFormName.includes('-low-key-gmax')) {
    return 'G-Max (Low Key)';
  } else if (gmaxFormName.includes('-single-strike-gmax')) {
    return 'G-Max (Single Strike)';
  } else if (gmaxFormName.includes('-rapid-strike-gmax')) {
    return 'G-Max (Rapid Strike)';
  } else if (gmaxFormName.includes('-gmax')) {
    return 'Gigantamax';
  }
  return gmaxFormName;
}

// Zygarde special forms
export const zygardeFormsMap = {
  'zygarde': ['zygarde-10', 'zygarde-50', 'zygarde-complete']
};

export function getZygardeForms(name) {
  const baseName = name.toLowerCase().split('-')[0];
  return zygardeFormsMap[baseName] || null;
}

export async function getZygardeFormData(formName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formName}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function getZygardeDisplayName(formName) {
  if (formName === 'zygarde-10') {
    return '10% Forme';
  } else if (formName === 'zygarde-50') {
    return '50% Forme';
  } else if (formName === 'zygarde-complete') {
    return 'Complete Forme';
  }
  return formName;
}

// Check if a pokemon is a Zygarde variant (not the base form for display)
export function isZygardeVariant(name) {
  const lowerName = name.toLowerCase();
  return lowerName === 'zygarde-10' || lowerName === 'zygarde-complete' || lowerName === 'zygarde-10-power-construct' || lowerName === 'zygarde-50-power-construct';
}
