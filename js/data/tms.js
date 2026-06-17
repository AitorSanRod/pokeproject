// tms.js — catálogo de Máquinas Técnicas (MTs)
// types:    tipos de pokemon que pueden aprenderla
// pokemons: pokemon específicos que pueden aprenderla (independientemente del tipo)
// moveId:   id del movimiento en MOVE_POOL (debe tener mt:true)
const MT_SPRITES = {
  normal: 'assets/sprites/mts/tm-normal.png',
  fire: 'assets/sprites/mts/tm-fire.png',
  water: 'assets/sprites/mts/tm-water.png',
  grass: 'assets/sprites/mts/tm-grass.png',
  electric: 'assets/sprites/mts/tm-electric.png',
  ice: 'assets/sprites/mts/tm-ice.png',
  fighting: 'assets/sprites/mts/tm-fighting.png',
  poison: 'assets/sprites/mts/tm-poison.png',
  ground: 'assets/sprites/mts/tm-ground.png',
  fliying: 'assets/sprites/mts/tm-fly.png',
  pyschic: 'assets/sprites/mts/tm-psi.png',
  bug: 'assets/sprites/mts/tm-bug.png',
  rock: 'assets/sprites/mts/tm-rock.png',
  ghost: 'assets/sprites/mts/tm-ghost.png',
  dragon: 'assets/sprites/mts/tm-dragon.png',
  dark: 'assets/sprites/mts/tm-dark.png',
  steel: 'assets/sprites/mts/tm-steel.png',
  fairy: 'assets/sprites/mts/tm-fairy.png',
}

var TM_LIST = {
  'tm-surf': {
    id: 'tm-surf',
    name: 'MT Surf',
    moveId: 'surf',
    types: ['water'],
    pokemons: [],
    desc: 'Enseña Surf.',
    sprite: MT_SPRITES.water,
    fallbackIcon: '💧',
  },
  'tm-thunderbolt': {
    id: 'tm-thunderbolt',
    name: 'MT Rayo',
    moveId: 'thunderbolt',
    types: ['electric'],
    pokemons: [],
    desc: 'Enseña Rayo.',
    sprite: MT_SPRITES.electric,
    fallbackIcon: '⚡',
  },
  'tm-ice-beam': {
    id: 'tm-ice-beam',
    name: 'MT Rayo Hielo',
    moveId: 'ice-beam',
    types: ['ice', 'water'],
    pokemons: [],
    desc: 'Enseña Rayo Hielo.',
    sprite: MT_SPRITES.ice,
    fallbackIcon: '❄️',
  },
  'stomping-tantrum': {
    id: 'stomping-tantrum',
    name: 'MT Pataleta',
    moveId: 'stomping-tantrum',
    types: ['ground', 'rock'],
    pokemons: ['charmander'],
    desc: 'Enseña Pataleta.',
    sprite: MT_SPRITES.ground,
    fallbackIcon: '🌍',
  },
  'tm-giga-drain': {
    id: 'giga-drain',
    name: 'MT Gigadrenado',
    moveId: 'giga-drain',
    types: ['grass'],
    pokemons: [],
    desc: 'Enseña Gigadrenado',
    sprite: MT_SPRITES.grass,
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
  if (pokemon.moves.some(m => m.id === tm.moveId)) return false; // ya conoce el movimiento (natural o MT)
  const m = MOVE_BY_ID[tm.moveId];
  if (!m) return false;
  Storage.addLearnedMT(pokemon.name, tm.moveId);
  pokemon.learnedMTs.push(tm.moveId);
  pokemon.moves.push({ ...m, maxPp: m.pp });
  console.log(`[MT] ${pokemon.displayName} aprendió ${m.name}`);
  return true;
}
