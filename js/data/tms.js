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
  // ═══════════════════════════════════════════════════════════════════════
  // WATER
  // ═══════════════════════════════════════════════════════════════════════
  'tm-bubble-beam': {
    id: 'tm-bubble-beam',
    name: 'MT Rayo Burbuja',
    moveId: 'bubble-beam',
    types: ['water'],
    pokemons: [],
    desc: 'Enseña Rayo Burbuja.',
    sprite: MT_SPRITES.water,
    fallbackIcon: '💧',
  },
  'tm-scald': {
    id: 'tm-scald',
    name: 'MT Escaldar',
    moveId: 'scald',
    types: ['water'],
    pokemons: [],
    desc: 'Enseña Escaldar.',
    sprite: MT_SPRITES.water,
    fallbackIcon: '💧',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // ELECTRIC
  // ═══════════════════════════════════════════════════════════════════════
  'tm-thunderbolt': {
    id: 'tm-thunderbolt',
    name: 'MT Rayo',
    moveId: 'thunderbolt',
    types: ['electric'],
    pokemons: ['rhydon'],
    desc: 'Enseña Rayo.',
    sprite: MT_SPRITES.electric,
    fallbackIcon: '⚡',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // ICE
  // ═══════════════════════════════════════════════════════════════════════
  'tm-icy-wind': {
    id: 'tm-icy-wind',
    name: 'MT Viento Hielo',
    moveId: 'icy-wind',
    types: ['ice', 'water'],
    pokemons: ['abra', 'kadabra', 'alakazam', 'gastly', 'haunter', 'gengar'],
    desc: 'Enseña Viento Hielo.',
    sprite: MT_SPRITES.ice,
    fallbackIcon: '❄️',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // GROUND
  // ═══════════════════════════════════════════════════════════════════════
  'stomping-tantrum': {
    id: 'stomping-tantrum',
    name: 'MT Pataleta',
    moveId: 'stomping-tantrum',
    types: ['ground', 'rock'],
    pokemons: ['charmander', 'charmeleon', 'charizard'],
    desc: 'Enseña Pataleta.',
    sprite: MT_SPRITES.ground,
    fallbackIcon: '🌍',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // GRASS
  // ═══════════════════════════════════════════════════════════════════════
  'tm-giga-drain': {
    id: 'tm-giga-drain',
    name: 'MT Gigadrenado',
    moveId: 'giga-drain',
    types: ['grass'],
    pokemons: [],
    desc: 'Enseña Gigadrenado',
    sprite: MT_SPRITES.grass,
    fallbackIcon: '🌿',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // STEEL
  // ═══════════════════════════════════════════════════════════════════════
  'tm-metal-claw': {
    id: 'tm-metal-claw',
    name: 'MT Garra Metal',
    moveId: 'metal-claw',
    types: [],
    pokemons: ['charmander', 'charmeleon', 'charizard'],
    desc: 'Enseña Garra Metal',
    sprite: MT_SPRITES.steel,
    fallbackIcon: '',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // NORMAL
  // ═══════════════════════════════════════════════════════════════════════
  'tm-take-down': {
    id: 'tm-take-down',
    name: 'MT Derribo',
    moveId: 'take-down',
    types: ['fighting'],
    pokemons: ['kangaskhan', 'marowak', 'scyther', 'snorlax', 'dragonite'],
    desc: 'Enseña Derribo',
    sprite: MT_SPRITES.normal,
    fallbackIcon: '',
    // ═══════════════════════════════════════════════════════════════════════
    // DARK
    // ═══════════════════════════════════════════════════════════════════════
    'tm-crunch': {
      id: 'tm-crunch',
      name: 'MT Triturar',
      moveId: 'crunch',
      types: ['dark'],
      pokemons: ['kangaskhan','snorlax', 'gyarados', 'pinsir'],
      desc: 'Enseña Triturar',
      sprite: MT_SPRITES.dark,
      fallbackIcon: '',
    }
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
