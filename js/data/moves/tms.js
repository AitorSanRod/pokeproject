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
};

var TM_LIST = {
  // ═══════════════════════════════════════════════════════════════════════
  // WATER
  // ═══════════════════════════════════════════════════════════════════════
  'tm-bubble-beam': {
    id: 'tm-bubble-beam',
    name: 'MT Rayo Burbuja',
    moveId: 'bubble-beam',
    types: ['water'],
    pokemons: [POKEMON.mew],
    desc: 'Enseña Rayo Burbuja.',
    sprite: MT_SPRITES.water,
    fallbackIcon: '💧',
  },
  'tm-scald': {
    id: 'tm-scald',
    name: 'MT Escaldar',
    moveId: 'scald',
    types: ['water'],
    pokemons: [POKEMON.mew],
    desc: 'Enseña Escaldar.',
    sprite: MT_SPRITES.water,
    fallbackIcon: '💧',
  },
  'tm-surf': {
    id: 'tm-surf',
    name: 'MT Surf',
    moveId: 'surf',
    types: [],
    pokemons: [POKEMON.pikachu, POKEMON.rhydon, POKEMON.rhyhorn, POKEMON.mew],
    desc: 'Enseña Surf.',
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
    pokemons: [POKEMON.rhydon, POKEMON.mew],
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
    pokemons: [POKEMON.abra, POKEMON.kadabra, POKEMON.alakazam, POKEMON.gastly, POKEMON.haunter, POKEMON.gengar, POKEMON.mew],
    desc: 'Enseña Viento Hielo.',
    sprite: MT_SPRITES.ice,
    fallbackIcon: '❄️',
  },
  'tm-ice-beam': {
    id: 'tm-ice-beam',
    name: 'MT Rayo Hielo',
    moveId: 'ice-beam',
    types: ['ice'],
    pokemons: [POKEMON.porygon, POKEMON.porygon2, POKEMON.dragonite, POKEMON.dragonair, POKEMON.dratini, POKEMON.mewtwo, POKEMON.mew],
    desc: 'Enseña Rayo Hielo.',
    sprite: MT_SPRITES.ice,
    fallbackIcon: '❄️',
  },
  'tm-ice-fang': {
    id: 'tm-ice-fang',
    name: 'MT Colmillo Hielo',
    moveId: 'ice-fang',
    types: ['ice'],
    pokemons: [POKEMON.aerodactyl, POKEMON.rattata, POKEMON.raticate, POKEMON.nidoking, POKEMON.nidoqueen, POKEMON.gyarados, POKEMON.mew],
    desc: 'Enseña Colmillo Hielo.',
    sprite: MT_SPRITES.ice,
    fallbackIcon: '❄️',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // GROUND
  // ═══════════════════════════════════════════════════════════════════════
  'tm-stomping-tantrum': {
    id: 'tm-stomping-tantrum',
    name: 'MT Pataleta',
    moveId: 'stomping-tantrum',
    types: ['ground', 'rock'],
    pokemons: [POKEMON.charmander, POKEMON.charmeleon, POKEMON.charizard, POKEMON.mew],
    desc: 'Enseña Pataleta.',
    sprite: MT_SPRITES.ground,
    fallbackIcon: '🌍',
  },
  'tm-earth-power': {
    id: 'tm-earth-power',
    name: 'MT Tierra Viva',
    moveId: 'earth-power',
    types: [],
    pokemons: [POKEMON.bulbasaur, POKEMON.ivysaur, POKEMON.venusaur, POKEMON.mewtwo, POKEMON.mew],
    desc: 'Enseña Tierra Viva.',
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
    pokemons: [POKEMON.mew],
    desc: 'Enseña Gigadrenado',
    sprite: MT_SPRITES.grass,
    fallbackIcon: '🌿',
  },
  'tm-flower-trick': {
    id: 'tm-flower-trick',
    name: 'MT Truco Floral',
    moveId: 'flower-trick',
    types: ['grass'],
    pokemons: [POKEMON.mew],
    desc: 'Enseña Truco Floral',
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
    pokemons: [POKEMON.charmander, POKEMON.charmeleon, POKEMON.charizard, POKEMON.mew],
    desc: 'Enseña Garra Metal',
    sprite: MT_SPRITES.steel,
    fallbackIcon: '',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // NORMAL
  // ═══════════════════════════════════════════════════════════════════════
  'tm-facade': {
    id: 'tm-facade',
    name: 'MT Fachada',
    moveId: 'facade',
    types: ['fighting'],
    pokemons: [POKEMON.kangaskhan, POKEMON.marowak, POKEMON.scyther, POKEMON.snorlax, POKEMON.dragonite, POKEMON.mew],
    desc: 'Enseña Fachada',
    sprite: MT_SPRITES.normal,
    fallbackIcon: '',
  },
  'tm-tri-attack': {
    id: 'tm-tri-attack',
    name: 'MT Triataque',
    moveId: 'substitute', //Este movimiento en el juego no puede usarse, así que lo usamos para crear otro.
    types: [],
    pokemons: [POKEMON.porygon, POKEMON.porygon2, POKEMON.mew],
    desc: 'Enseña Triataque',
    sprite: MT_SPRITES.normal,
    fallbackIcon: '',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // DARK
  // ═══════════════════════════════════════════════════════════════════════
  'tm-crunch': {
    id: 'tm-crunch',
    name: 'MT Triturar',
    moveId: 'crunch',
    types: ['dark'],
    pokemons: [POKEMON.kangaskhan, POKEMON.snorlax, POKEMON.gyarados, POKEMON.pinsir, POKEMON.squirtle, POKEMON.wartortle, POKEMON.blastoise, POKEMON.mew],
    desc: 'Enseña Triturar',
    sprite: MT_SPRITES.dark,
    fallbackIcon: '',
  },
};

// Devuelve true si el pokemon puede aprender la MT indicada
function canLearnTM(pokemon, tmId) {
  const tm = TM_LIST[tmId];
  if (!tm) return false;
  const move = MOVE_BY_ID[tm.moveId];
  if (move?.pokemon?.length > 0 && !move.pokemon.includes(pokemon.name)) return false;
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
