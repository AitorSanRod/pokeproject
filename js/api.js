// API layer — usa PokeAPI cuando esta disponible, fallback a datos locales
// Misma interfaz que el sistema Node para que game/pokemon.js no cambie

const PokeAPI = {
  _cache: {},

  async getPokemon(name) {
    const key = name.toLowerCase();
    if (this._cache[key]) return this._cache[key];

    // Intentar PokeAPI
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);
      if (res.ok) {
        const data = await res.json();
        const normalized = this._normalizePokeAPIData(data);
        this._cache[key] = normalized;
        console.log(`[API] ${key} cargado desde PokeAPI`);
        return normalized;
      }
    } catch (e) {
      console.log(`[API] PokeAPI no disponible, usando datos locales para ${key}`);
    }

    // Fallback a datos locales
    const local = POKEMON_STATS[key];
    if (!local) throw new Error(`Pokemon "${key}" no encontrado en datos locales ni en PokeAPI`);

    const dbEntry = POKEMON_DB[key];
    const types   = dbEntry?.types ?? ['normal'];

    const normalized = {
      id:   local.id,
      name: key,
      types: types.map(t => ({ type: { name: t } })),
      stats: [
        { stat: { name: 'hp' },              base_stat: local.hp  },
        { stat: { name: 'attack' },          base_stat: local.atk },
        { stat: { name: 'defense' },         base_stat: local.def },
        { stat: { name: 'special-attack' },  base_stat: local.spa },
        { stat: { name: 'special-defense' }, base_stat: local.spd },
        { stat: { name: 'speed' },           base_stat: local.spe },
      ],
      sprites: {
        front_default: getSpriteUrl(key),
        back_default:  getBackSpriteUrl(key),
        front_shiny:   getShinySpriteUrl(key),
        back_shiny:    getBackShinySpriteUrl(key),
      },
    };
    this._cache[key] = normalized;
    return normalized;
  },

  // Normaliza respuesta de PokeAPI al mismo shape que nuestros datos locales
  _normalizePokeAPIData(data) {
    return {
      id:    data.id,
      name:  data.name,
      types: data.types,
      stats: data.stats,
      sprites: {
        front_default: data.sprites.front_default,
        back_default:  data.sprites.back_default,
        front_shiny:   data.sprites.front_shiny,
        back_shiny:    data.sprites.back_shiny,
      },
    };
  },
};
