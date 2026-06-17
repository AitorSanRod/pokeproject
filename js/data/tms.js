// tms.js — catálogo de Máquinas Técnicas (MTs)
// types:    tipos de pokemon que pueden aprenderla
// pokemons: pokemon específicos que pueden aprenderla (independientemente del tipo)
// moveId:   id del movimiento en MOVE_POOL (debe tener mt:true)
const MT_SPRITES = {
  normal: 'assets/sprites/mts/tm-water.png',
  fire: 'assets/sprites/mts/tm-water.png',
  water: 'assets/sprites/mts/tm-water.png',
  grass: 'assets/sprites/mts/tm-water.png',
  electric: 'assets/sprites/mts/tm-water.png',
  ice: 'assets/sprites/mts/tm-water.png',
  fighting: 'assets/sprites/mts/tm-water.png',
  poison: 'assets/sprites/mts/tm-water.png',
  ground: 'assets/sprites/mts/tm-water.png',
  fliying: 'assets/sprites/mts/tm-water.png',
  pyschic: 'assets/sprites/mts/tm-water.png',
  bug: 'assets/sprites/mts/tm-water.png',
  rock: 'assets/sprites/mts/tm-water.png',
  ghost: 'assets/sprites/mts/tm-water.png',
  dragon: 'assets/sprites/mts/tm-water.png',
  dark: 'assets/sprites/mts/tm-water.png',
  steel: 'assets/sprites/mts/tm-water.png',
  fairy: 'assets/sprites/mts/tm-water.png',
}

var TM_LIST = {
  'tm-surf': {
    id: 'tm-surf',
    name: 'MT Surf',
    moveId: 'surf',
    types: ['water'],
    pokemons: [],
    desc: 'Enseña Surf a pokemon de tipo Agua o a Snorlax.',
    sprite: 'assets/sprites/items/tm-water.png',
    fallbackIcon: '💧',
  },
  'tm-thunderbolt': {
    id: 'tm-thunderbolt',
    name: 'MT Rayo',
    moveId: 'thunderbolt',
    types: ['electric'],
    pokemons: [],
    desc: 'Enseña Rayo a pokemon de tipo Eléctrico.',
    sprite: 'assets/sprites/items/tm-electric.png',
    fallbackIcon: '⚡',
  },
  'tm-ice-beam': {
    id: 'tm-ice-beam',
    name: 'MT Rayo Hielo',
    moveId: 'ice-beam',
    types: ['ice', 'water'],
    pokemons: [],
    desc: 'Enseña Rayo Hielo a pokemon de tipo Hielo o Agua.',
    sprite: 'assets/sprites/items/tm-ice.png',
    fallbackIcon: '❄️',
  },
  'tm-earthquake': {
    id: 'tm-earthquake',
    name: 'MT Terremoto',
    moveId: 'earthquake',
    types: ['ground', 'rock'],
    pokemons: ['bulbasaur', 'ivysaur'],
    desc: 'Enseña Terremoto a pokemon de tipo Tierra o Roca, Snorlax o Kangaskhan.',
    sprite: 'assets/sprites/items/tm-ground.png',
    fallbackIcon: '🌍',
  },
  'tm-solar-beam': {
    id: 'tm-solar-beam',
    name: 'MT Rayo Solar',
    moveId: 'solar-beam',
    types: ['grass'],
    pokemons: [],
    desc: 'Enseña Rayo Solar a pokemon de tipo Planta.',
    sprite: 'assets/sprites/items/tm-grass.png',
    fallbackIcon: '🌿',
  },
};

// Devuelve true si el pokemon puede aprender la MT indicada
function canLearnTM(pokemon, tmId) {
  const tm = TM_LIST[tmId];
  if (!tm) return false;
  const pTypes = pokemon.types ?? POKEMON_DB[pokemon.name]?.types ?? [];
  return tm.types.some(t => pTypes.includes(t)) || tm.pokemons.includes(pokemon.name);
}

// Enseña el movimiento de la MT al pokemon. Devuelve true si tuvo éxito.
// Persiste en Storage (ligado al reset de pokédex) y actualiza el objeto en memoria.
function teachTM(pokemon, tmId) {
  const tm = TM_LIST[tmId];
  if (!tm || !canLearnTM(pokemon, tmId)) return false;
  if (!pokemon.learnedMTs) pokemon.learnedMTs = [];
  if (pokemon.learnedMTs.includes(tm.moveId)) return false; // ya aprendido
  const m = MOVE_BY_ID[tm.moveId];
  if (!m) return false;
  Storage.addLearnedMT(pokemon.name, tm.moveId);
  pokemon.learnedMTs.push(tm.moveId);
  pokemon.moves.push({ ...m, maxPp: m.pp });
  console.log(`[MT] ${pokemon.displayName} aprendió ${m.name}`);
  return true;
}
