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
