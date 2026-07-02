// pokemon-db.js — tipos, clase de daño, moveLines, cadenas de evolución y stage
// stage: 1=1er mov por línea | 2=2 primeros | 3=los 3
// evolvesAt: nivel de evolución | evolvesInto: nombre PokeAPI de la forma siguiente

var POKEMON_DB = {

  // ── Starters ──────────────────────────────────────────────────────────────
  bulbasaur: {
    stage: 1, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 16, evolvesInto: 'ivysaur',
    // ability: 'intimidate',
    // hideAbility: 'poison-point'
  },
  ivysaur: {
    stage: 2, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 32, evolvesInto: 'venusaur',
  },
  venusaur: {
    stage: 3, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    ability: 'cloud-nine'
  },
  charmander: {
    stage: 1, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 16, evolvesInto: 'charmeleon',
  },
  charmeleon: {
    stage: 2, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'charizard',
  },
  charizard: {
    stage: 3, types: ['fire', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
    ability: 'drought',
  },
  squirtle: {
    stage: 1, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 16, evolvesInto: 'wartortle',
  },
  wartortle: {
    stage: 2, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'blastoise',
  },
  blastoise: {
    stage: 3, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    ability: 'drizzle'
  },

  // ── Bug / Poison ──────────────────────────────────────────────────────────
  caterpie: {
    stage: 1, types: ['bug'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }],
    evolvesAt: 7, evolvesInto: 'metapod',
  },
  metapod: {
    stage: 2, types: ['bug'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }],
    evolvesAt: 10, evolvesInto: 'butterfree',
  },
  butterfree: {
    stage: 3, types: ['bug', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
    ability: 'speed-boost'
  },
  weedle: {
    stage: 1, types: ['bug', 'poison'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
    evolvesAt: 7, evolvesInto: 'kakuna',
  },
  kakuna: {
    stage: 2, types: ['bug', 'poison'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
    evolvesAt: 10, evolvesInto: 'beedrill',
  },
  beedrill: {
    stage: 3, types: ['bug', 'poison'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
    ability: 'speed-boost'
  },

  // ── Flying / Normal ───────────────────────────────────────────────────────
  pidgey: {
    stage: 1, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
    evolvesAt: 18, evolvesInto: 'pidgeotto',
    ability: 'vital-spirit'
  },
  pidgeotto: {
    stage: 2, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
    evolvesAt: 36, evolvesInto: 'pidgeot',
    ability: 'vital-spirit'
  },
  pidgeot: {
    stage: 3, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
    ability: 'vital-spirit'
  },
  rattata: {
    stage: 1, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    evolvesAt: 20, evolvesInto: 'raticate',
    ability: 'guts'
  },
  raticate: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    ability: 'guts'
  },
  spearow: {
    stage: 1, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
    evolvesAt: 20, evolvesInto: 'fearow',
    ability: 'vital-spirit'
  },
  fearow: {
    stage: 2, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
    ability: 'vital-spirit'
  },

  // ── Poison / Snake ────────────────────────────────────────────────────────
  ekans: {
    stage: 1, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    evolvesAt: 22, evolvesInto: 'arbok',
    ability: 'poison-point'
  },
  arbok: {
    stage: 3, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    ability: 'poison-point'
  },

  // ── Electric ──────────────────────────────────────────────────────────────
  pikachu: {
    stage: 1, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 40, evolvesInto: 'raichu',
    ability: 'static',
  },
  raichu: {
    stage: 3, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    ability: 'static',
  },

  // ── Ground ────────────────────────────────────────────────────────────────
  sandshrew: {
    stage: 1, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
    evolvesAt: 22, evolvesInto: 'sandslash',
    ability: 'rough-skin'
  },
  sandslash: {
    stage: 3, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
    ability: 'rough-skin'
  },

  // ── Nidoran ───────────────────────────────────────────────────────────────
  'nidoran-f': {
    stage: 1, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    evolvesAt: 16, evolvesInto: 'nidorina',
    ability: 'poison-point',
  },
  nidorina: {
    stage: 2, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    evolvesAt: 36, evolvesInto: 'nidoqueen',
    ability: 'poison-point',
  },
  nidoqueen: {
    stage: 3, types: ['poison', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    ability: 'poison-point',
  },
  'nidoran-m': {
    stage: 1, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    evolvesAt: 16, evolvesInto: 'nidorino',
    ability: 'poison-point',
  },
  nidorino: {
    stage: 2, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    evolvesAt: 36, evolvesInto: 'nidoking',
    ability: 'poison-point',
  },
  nidoking: {
    stage: 3, types: ['poison', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    ability: 'poison-point',
  },

  // ── Fairy / Normal ────────────────────────────────────────────────────────
  clefairy: {
    stage: 1, types: ['fairy'], damageClass: 'special',
    moveLines: [{ type: 'fairy', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'clefable',
  },
  clefable: {
    stage: 2, types: ['fairy'], damageClass: 'special',
    moveLines: [{ type: 'fairy', damageClass: 'special' }],
  },
  jigglypuff: {
    stage: 1, types: ['normal', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'wigglytuff',
  },
  wigglytuff: {
    stage: 2, types: ['normal', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
  },

  // ── Fire fox ──────────────────────────────────────────────────────────────
  vulpix: {
    stage: 1, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 25, evolvesInto: 'ninetales',
  },
  ninetales: {
    stage: 3, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
  },

  // ── Poison / Flying ───────────────────────────────────────────────────────
  zubat: {
    stage: 1, types: ['poison', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
    evolvesAt: 22, evolvesInto: 'golbat',
  },
  golbat: {
    stage: 2, types: ['poison', 'flying'], damageClass: 'physical', evolvesInto: '',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
  },

  // ── Grass / Poison ────────────────────────────────────────────────────────
  oddish: {
    stage: 1, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 21, evolvesInto: 'gloom',
  },
  gloom: {
    stage: 2, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'vileplume',
  },
  vileplume: {
    stage: 3, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
  },
  paras: {
    stage: 1, types: ['bug', 'grass'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'grass', damageClass: 'physical' }],
    evolvesAt: 24, evolvesInto: 'parasect',
  },
  parasect: {
    stage: 2, types: ['bug', 'grass'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'grass', damageClass: 'physical' }],
  },

  // ── Bug / Poison ──────────────────────────────────────────────────────────
  venonat: {
    stage: 1, types: ['bug', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 31, evolvesInto: 'venomoth',
  },
  venomoth: {
    stage: 3, types: ['bug', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
  },

  // ── Ground ────────────────────────────────────────────────────────────────
  diglett: {
    stage: 1, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
    evolvesAt: 26, evolvesInto: 'dugtrio',
  },
  dugtrio: {
    stage: 2, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  meowth: {
    stage: 1, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    evolvesAt: 28, evolvesInto: 'persian',
    ability: 'speed-boost'
  },
  persian: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    ability: 'speed-boost'
  },

  // ── Water ─────────────────────────────────────────────────────────────────
  psyduck: {
    stage: 1, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
    evolvesAt: 33, evolvesInto: 'golduck',
    ability: 'cloud-nine'
  },
  golduck: {
    stage: 2, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
    ability: 'cloud-nine'
  },

  // ── Fighting ──────────────────────────────────────────────────────────────
  mankey: {
    stage: 1, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
    evolvesAt: 28, evolvesInto: 'primeape',
  },
  primeape: {
    stage: 3, types: ['fighting'], damageClass: 'physical', evolvesInto: '',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
  },

  // ── Fire ──────────────────────────────────────────────────────────────────
  growlithe: {
    stage: 1, types: ['fire'], damageClass: 'physical',
    moveLines: [{ type: 'fire', damageClass: 'physical' }],
    evolvesAt: 30, evolvesInto: 'arcanine',
    ability: 'intimidate',
  },
  arcanine: {
    stage: 3, types: ['fire'], damageClass: 'physical',
    moveLines: [{ type: 'fire', damageClass: 'physical' }],
    ability: 'intimidate',
  },

  // ── Water ─────────────────────────────────────────────────────────────────
  poliwag: {
    stage: 1, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 25, evolvesInto: 'poliwhirl',
  },
  poliwhirl: {
    stage: 2, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'poliwrath',
  },
  poliwrath: {
    stage: 3, types: ['water', 'fighting'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'fighting', damageClass: 'physical' }],
  },

  // ── Psychic ───────────────────────────────────────────────────────────────
  abra: {
    stage: 1, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
    evolvesAt: 16, evolvesInto: 'kadabra',
  },
  kadabra: {
    stage: 2, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
    evolvesAt: 40, evolvesInto: 'alakazam',
  },
  alakazam: {
    stage: 3, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
  },

  // ── Fighting ──────────────────────────────────────────────────────────────
  machop: {
    stage: 1, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
    evolvesAt: 28, evolvesInto: 'machoke',
    ability: 'guts'
  },
  machoke: {
    stage: 2, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
    evolvesAt: 36, evolvesInto: 'machamp',
    ability: 'guts'
  },
  machamp: {
    stage: 3, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
    ability: 'guts'
  },

  // ── Grass / Poison ────────────────────────────────────────────────────────
  bellsprout: {
    stage: 1, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 21, evolvesInto: 'weepinbell',
  },
  weepinbell: {
    stage: 2, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'victreebel',
  },
  victreebel: {
    stage: 3, types: ['grass', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
  },

  // ── Water / Poison ────────────────────────────────────────────────────────
  tentacool: {
    stage: 1, types: ['water', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'tentacruel',
  },
  tentacruel: {
    stage: 3, types: ['water', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
  },

  // ── Rock / Ground ─────────────────────────────────────────────────────────
  geodude: {
    stage: 1, types: ['rock', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    evolvesAt: 25, evolvesInto: 'graveler',
  },
  graveler: {
    stage: 2, types: ['rock', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    evolvesAt: 36, evolvesInto: 'golem',
  },
  golem: {
    stage: 3, types: ['rock', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
  },

  // ── Fire ──────────────────────────────────────────────────────────────────
  ponyta: {
    stage: 1, types: ['fire'], damageClass: 'physical',
    moveLines: [{ type: 'fire', damageClass: 'physical' }],
    evolvesAt: 40, evolvesInto: 'rapidash',
    ability: 'speed-boost'
  },
  rapidash: {
    stage: 2, types: ['fire'], damageClass: 'physical',
    moveLines: [{ type: 'fire', damageClass: 'physical' }],
    ability: 'speed-boost'
  },

  // ── Water / Psychic ───────────────────────────────────────────────────────
  slowpoke: {
    stage: 1, types: ['water', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
    evolvesAt: 40, evolvesInto: 'slowbro',
  },
  slowbro: {
    stage: 3, types: ['water', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
  },

  // ── Electric / Steel ──────────────────────────────────────────────────────
  magnemite: {
    stage: 1, types: ['electric', 'steel'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'magneton',
    ability: 'levitate'
  },
  magneton: {
    stage: 3, types: ['electric', 'steel'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    ability: 'levitate'
  },

  // ── Normal / Flying ───────────────────────────────────────────────────────
  farfetchd: {
    stage: 2, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
  },
  doduo: {
    stage: 1, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
    evolvesAt: 31, evolvesInto: 'dodrio',
  },
  dodrio: {
    stage: 2, types: ['normal', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }],
  },

  // ── Water / Ice ───────────────────────────────────────────────────────────
  seel: {
    stage: 1, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }],
    evolvesAt: 34, evolvesInto: 'dewgong',
    ability: 'drizzle'
  },
  dewgong: {
    stage: 2, types: ['water', 'ice'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }],
    ability: 'drizzle'
  },

  // ── Poison ────────────────────────────────────────────────────────────────
  grimer: {
    stage: 1, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
    evolvesAt: 38, evolvesInto: 'muk',
  },
  muk: {
    stage: 3, types: ['poison'], damageClass: 'physical',
    moveLines: [{ type: 'poison', damageClass: 'physical' }],
  },

  // ── Water / Ice ───────────────────────────────────────────────────────────
  shellder: {
    stage: 1, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'cloyster',
  },
  cloyster: {
    stage: 3, types: ['water', 'ice'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }],
  },

  // ── Ghost / Poison ────────────────────────────────────────────────────────
  gastly: {
    stage: 1, types: ['ghost', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 25, evolvesInto: 'haunter',
  },
  haunter: {
    stage: 2, types: ['ghost', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'gengar',
  },
  gengar: {
    stage: 3, types: ['ghost', 'poison'], damageClass: 'special',
    moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }],
  },

  // ── Rock / Ground ─────────────────────────────────────────────────────────
  onix: {
    stage: 2, types: ['rock', 'ground'], damageClass: 'physical', evolvesInto: '',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
  },

  // ── Psychic ───────────────────────────────────────────────────────────────
  drowzee: {
    stage: 1, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
    evolvesAt: 26, evolvesInto: 'hypno',
  },
  hypno: {
    stage: 2, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
  },

  // ── Water ─────────────────────────────────────────────────────────────────
  krabby: {
    stage: 1, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
    evolvesAt: 28, evolvesInto: 'kingler',
  },
  kingler: {
    stage: 2, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
  },

  // ── Electric ──────────────────────────────────────────────────────────────
  voltorb: {
    stage: 1, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'electrode',
  },
  electrode: {
    stage: 2, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
  },

  // ── Grass / Psychic ───────────────────────────────────────────────────────
  exeggcute: {
    stage: 1, types: ['grass', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'exeggutor',
  },
  exeggutor: {
    stage: 2, types: ['grass', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
  },

  // ── Ground ────────────────────────────────────────────────────────────────
  cubone: {
    stage: 1, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
    evolvesAt: 28, evolvesInto: 'marowak',
  },
  marowak: {
    stage: 2, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
  },

  // ── Fighting ──────────────────────────────────────────────────────────────
  hitmonlee: {
    stage: 2, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
  },
  hitmonchan: {
    stage: 2, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  lickitung: {
    stage: 3, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Poison ────────────────────────────────────────────────────────────────
  koffing: {
    stage: 1, types: ['poison'], damageClass: 'special',
    moveLines: [{ type: 'poison', damageClass: 'special' }],
    evolvesAt: 35, evolvesInto: 'weezing',
    ability: 'levitate',
  },
  weezing: {
    stage: 2, types: ['poison'], damageClass: 'special',
    moveLines: [{ type: 'poison', damageClass: 'special' }],
    ability: 'levitate',
  },

  // ── Ground / Rock ─────────────────────────────────────────────────────────
  rhyhorn: {
    stage: 1, types: ['ground', 'rock'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }],
    evolvesAt: 42, evolvesInto: 'rhydon',
  },
  rhydon: {
    stage: 2, types: ['ground', 'rock'], damageClass: 'physical', evolvesInto: '',
    moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  chansey: {
    stage: 2, types: ['normal'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'normal', damageClass: 'special' }],
  },
  tangela: {
    stage: 2, types: ['grass'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
  },
  kangaskhan: {
    stage: 3, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    ability: 'versatil'
  },

  // ── Water ─────────────────────────────────────────────────────────────────
  horsea: {
    stage: 1, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 32, evolvesInto: 'seadra',
    ability: 'drizzle'
  },
  seadra: {
    stage: 2, types: ['water'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    ability: 'drizzle'
  },
  goldeen: {
    stage: 1, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
    evolvesAt: 33, evolvesInto: 'seaking',
  },
  seaking: {
    stage: 2, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
  },
  staryu: {
    stage: 1, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'starmie',
  },
  starmie: {
    stage: 2, types: ['water', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: ['special', 'physical'] }, { type: 'psychic', damageClass: 'special' }],
    ability: 'huge-power'
  },

  // ── Psychic / Fairy ───────────────────────────────────────────────────────
  'mr-mime': {
    stage: 2, types: ['psychic', 'fairy'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
  },

  // ── Bug / Flying ──────────────────────────────────────────────────────────
  scyther: {
    stage: 2, types: ['bug', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
    evolvesAt: 45, evolvesInto: 'scizor'
  },

  // ── Ice / Psychic ─────────────────────────────────────────────────────────
  jynx: {
    stage: 2, types: ['ice', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
  },

  // ── Electric / Fire ───────────────────────────────────────────────────────
  electabuzz: {
    stage: 2, types: ['electric'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
  },
  magmar: {
    stage: 2, types: ['fire'], damageClass: 'special', evolvesInto: '',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    ability: 'flame-body',
  },

  // ── Bug ───────────────────────────────────────────────────────────────────
  pinsir: {
    stage: 3, types: ['bug'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  tauros: {
    stage: 3, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Water ─────────────────────────────────────────────────────────────────
  magikarp: {
    stage: 1, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
    evolvesAt: 40, evolvesInto: 'gyarados',
  },
  gyarados: {
    stage: 2, types: ['water', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
  },
  lapras: {
    stage: 3, types: ['water', 'ice'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  ditto: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Eevee line ────────────────────────────────────────────────────────────
  eevee: {
    stage: 1, types: ['normal'], damageClass: 'physical', evolvesInto: '',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },
  vaporeon: {
    stage: 2, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    ability: 'drizzle'
  },
  jolteon: {
    stage: 2, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
  },
  flareon: {
    stage: 2, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  porygon: {
    stage: 2, types: ['normal'], damageClass: 'special', evolvesInto: 'porygon2',
    evolvesAt: 40, ability: 'download',
    moveLines: [{ type: 'normal', damageClass: 'special' }],
  },

  // ── Rock / Water ──────────────────────────────────────────────────────────
  omanyte: {
    stage: 1, types: ['rock', 'water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }],
    evolvesAt: 40, evolvesInto: 'omastar',
  },
  omastar: {
    stage: 2, types: ['rock', 'water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }],
  },
  kabuto: {
    stage: 1, types: ['rock', 'water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }],
    evolvesAt: 40, evolvesInto: 'kabutops',
  },
  kabutops: {
    stage: 2, types: ['rock', 'water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }],
  },

  // ── Rock / Flying ─────────────────────────────────────────────────────────
  aerodactyl: {
    stage: 3, types: ['rock', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────
  snorlax: {
    stage: 3, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Legendarios ───────────────────────────────────────────────────────────
  articuno: {
    stage: 3, types: ['ice', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },
  zapdos: {
    stage: 3, types: ['electric', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },
  moltres: {
    stage: 3, types: ['fire', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },

  // ── Dragon ────────────────────────────────────────────────────────────────
  dratini: {
    stage: 1, types: ['dragon'], damageClass: 'physical',
    moveLines: [{ type: 'dragon', damageClass: 'physical' }],
    evolvesAt: 30, evolvesInto: 'dragonair',
  },
  dragonair: {
    stage: 2, types: ['dragon'], damageClass: 'physical',
    moveLines: [{ type: 'dragon', damageClass: 'physical' }],
    evolvesAt: 55, evolvesInto: 'dragonite',
  },
  dragonite: {
    stage: 3, types: ['dragon', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'dragon', damageClass: 'physical' }, { type: 'flying', damageClass: 'special' }],
  },

  // ── Psychic ───────────────────────────────────────────────────────────────
  mewtwo: {
    stage: 3, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
  },
  mew: {
    stage: 3, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
  },

  //══════════════════════════════════════════════════════════════════════════════
  //══════════════════════════════════════════════════════════════════════════════
  // GEN II — JOHTO 
  //══════════════════════════════════════════════════════════════════════════════
  //══════════════════════════════════════════════════════════════════════════════

  // ── Starters ─────────────────────────────────────────────────────────────────
  chikorita: {
    stage: 1, types: ['grass'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
    evolvesAt: 16, evolvesInto: 'bayleef',
    ability: 'overgrow'
  },
  bayleef: {
    stage: 2, types: ['grass'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
    evolvesAt: 32, evolvesInto: 'meganium',
    ability: 'overgrow'
  },
  meganium: {
    stage: 3, types: ['grass'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
    ability: 'overgrow'
  },
  cyndaquil: {
    stage: 1, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 14, evolvesInto: 'quilava',
    ability: 'blaze'
  },
  quilava: {
    stage: 2, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 36, evolvesInto: 'typhlosion',
    ability: 'blaze'
  },
  typhlosion: {
    stage: 3, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    ability: 'blaze'
  },
  totodile: {
    stage: 1, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
    evolvesAt: 18, evolvesInto: 'croconaw',
    ability: 'prisa-acuatica'
  },
  croconaw: {
    stage: 2, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
    evolvesAt: 30, evolvesInto: 'feraligatr',
    ability: 'prisa-acuatica'
  },
  feraligatr: {
    stage: 3, types: ['water'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }],
    ability: 'prisa-acuatica'
  },

  // ── Normal ────────────────────────────────────────────────────────────────────
  sentret: {
    stage: 1, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    evolvesAt: 15, evolvesInto: 'furret',
  },
  furret: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Normal / Flying ───────────────────────────────────────────────────────────
  hoothoot: {
    stage: 1, types: ['normal', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'flying', damageClass: 'special' }, { type: 'normal', damageClass: 'special' }],
    evolvesAt: 20, evolvesInto: 'noctowl',
  },
  noctowl: {
    stage: 2, types: ['normal', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'flying', damageClass: 'special' }, { type: 'normal', damageClass: 'special' }],
  },

  // ── Bug / Flying ─────────────────────────────────────────────────────────────
  ledyba: {
    stage: 1, types: ['bug', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
    evolvesAt: 18, evolvesInto: 'ledian',
    ability: 'speed-boost'
  },
  ledian: {
    stage: 2, types: ['bug', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
    ability: 'speed-boost'
  },

  // ── Bug / Poison ─────────────────────────────────────────────────────────────
  spinarak: {
    stage: 1, types: ['bug', 'poison'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
    evolvesAt: 22, evolvesInto: 'ariados',
  },
  ariados: {
    stage: 2, types: ['bug', 'poison'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
  },

  // ── Poison / Flying ──────────────────────────────────────────────────────────
  crobat: {
    stage: 3, types: ['poison', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
  },

  // ── Water / Electric ─────────────────────────────────────────────────────────
  chinchou: {
    stage: 1, types: ['water', 'electric'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'electric', damageClass: 'special' }],
    evolvesAt: 27, evolvesInto: 'lanturn',
  },
  lanturn: {
    stage: 2, types: ['water', 'electric'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'electric', damageClass: 'special' }],
  },

  // ── Baby Pokémon ─────────────────────────────────────────────────────────────
  pichu: {
    stage: 1, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 12, evolvesInto: 'pikachu',
  },
  cleffa: {
    stage: 1, types: ['normal', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
    evolvesAt: 12, evolvesInto: 'clefairy',
  },
  igglybuff: {
    stage: 1, types: ['normal', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
    evolvesAt: 12, evolvesInto: 'jigglypuff',
  },

  // ── Fairy ─────────────────────────────────────────────────────────────────────
  togepi: {
    stage: 1, types: ['normal', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
    evolvesAt: 18, evolvesInto: 'togetic',
  },
  togetic: {
    stage: 2, types: ['normal', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
  },

  // ── Psychic / Flying ─────────────────────────────────────────────────────────
  natu: {
    stage: 1, types: ['psychic', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
    evolvesAt: 25, evolvesInto: 'xatu',
  },
  xatu: {
    stage: 2, types: ['psychic', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },

  // ── Electric ─────────────────────────────────────────────────────────────────
  mareep: {
    stage: 1, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 15, evolvesInto: 'flaaffy',
    ability: 'static'
  },
  flaaffy: {
    stage: 2, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'ampharos',
    ability: 'static'
  },
  ampharos: {
    stage: 3, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    ability: 'static'
  },

  // ── Grass ─────────────────────────────────────────────────────────────────────
  bellossom: {
    stage: 3, types: ['grass'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
  },
  sunkern: {
    stage: 1, types: ['grass'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
    evolvesAt: 25, evolvesInto: 'sunflora',
  },
  sunflora: {
    stage: 2, types: ['grass'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }],
  },

  // ── Water / Fairy ─────────────────────────────────────────────────────────────
  marill: {
    stage: 1, types: ['water', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
    evolvesAt: 18, evolvesInto: 'azumarill',
    ability: 'huge-power',
  },
  azumarill: {
    stage: 2, types: ['water', 'fairy'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }],
    ability: 'huge-power',
  },

  // ── Rock ──────────────────────────────────────────────────────────────────────
  sudowoodo: {
    stage: 2, types: ['rock'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }],
  },

  // ── Water ─────────────────────────────────────────────────────────────────────
  politoed: {
    stage: 3, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
  },

  // ── Grass / Flying ────────────────────────────────────────────────────────────
  hoppip: {
    stage: 1, types: ['grass', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
    evolvesAt: 18, evolvesInto: 'skiploom',
  },
  skiploom: {
    stage: 2, types: ['grass', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
    evolvesAt: 27, evolvesInto: 'jumpluff',
  },
  jumpluff: {
    stage: 3, types: ['grass', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────────
  aipom: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Bug / Flying ─────────────────────────────────────────────────────────────
  yanma: {
    stage: 2, types: ['bug', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
    ability: 'speed-boost',
  },

  // ── Water / Ground ────────────────────────────────────────────────────────────
  wooper: {
    stage: 1, types: ['water', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    evolvesAt: 20, evolvesInto: 'quagsire',
  },
  quagsire: {
    stage: 2, types: ['water', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
  },

  // ── Eeveeluciones ─────────────────────────────────────────────────────────────
  espeon: {
    stage: 2, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
  },
  umbreon: {
    stage: 2, types: ['dark'], damageClass: 'physical',
    moveLines: [{ type: 'dark', damageClass: 'physical' }],
  },

  // ── Dark / Flying ─────────────────────────────────────────────────────────────
  murkrow: {
    stage: 2, types: ['dark', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'dark', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
  },

  // ── Water / Psychic ───────────────────────────────────────────────────────────
  slowking: {
    stage: 3, types: ['water', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
  },

  // ── Ghost ─────────────────────────────────────────────────────────────────────
  misdreavus: {
    stage: 2, types: ['ghost'], damageClass: 'special',
    moveLines: [{ type: 'ghost', damageClass: 'special' }],
    ability: 'cursed-body'
  },

  // ── Psychic ───────────────────────────────────────────────────────────────────
  unown: {
    stage: 2, types: ['psychic'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }],
  },
  wobbuffet: {
    stage: 2, types: ['psychic'], damageClass: 'physical',
    moveLines: [{ type: 'psychic', damageClass: 'physical' }],
    ability: 'cursed-body'
  },

  // ── Normal / Psychic ─────────────────────────────────────────────────────────
  girafarig: {
    stage: 2, types: ['normal', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
  },

  // ── Bug / Steel ───────────────────────────────────────────────────────────────
  pineco: {
    stage: 1, types: ['bug'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }],
    evolvesAt: 31, evolvesInto: 'forretress',
    ability: 'rough-skin'
  },
  forretress: {
    stage: 2, types: ['bug', 'steel'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'steel', damageClass: 'physical' }],
    ability: 'rough-skin'
  },

  // ── Normal ────────────────────────────────────────────────────────────────────
  dunsparce: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },

  // ── Ground / Flying ───────────────────────────────────────────────────────────
  gligar: {
    stage: 2, types: ['ground', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
    ability: 'poison-point'
  },

  // ── Steel / Ground ────────────────────────────────────────────────────────────
  steelix: {
    stage: 2, types: ['steel', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'steel', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
  },

  // ── Fairy ─────────────────────────────────────────────────────────────────────
  snubbull: {
    stage: 1, types: ['fairy'], damageClass: 'physical',
    moveLines: [{ type: 'fairy', damageClass: 'physical' }],
    evolvesAt: 23, evolvesInto: 'granbull',
    ability: 'intimidate'
  },
  granbull: {
    stage: 2, types: ['fairy'], damageClass: 'physical',
    moveLines: [{ type: 'fairy', damageClass: 'physical' }],
    ability: 'intimidate'
  },

  // ── Water / Poison ────────────────────────────────────────────────────────────
  qwilfish: {
    stage: 2, types: ['water', 'poison'], damageClass: 'physical',
    moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }],
    ability: 'poison-point'
  },

  // ── Bug / Steel ───────────────────────────────────────────────────────────────
  scizor: {
    stage: 3, types: ['bug', 'steel'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'steel', damageClass: 'physical' }],
  },

  // ── Bug / Rock ────────────────────────────────────────────────────────────────
  shuckle: {
    stage: 2, types: ['bug', 'rock'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }],
  },

  // ── Bug / Fighting ────────────────────────────────────────────────────────────
  heracross: {
    stage: 2, types: ['bug', 'fighting'], damageClass: 'physical',
    moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'fighting', damageClass: 'physical' }],
  },

  // ── Dark / Ice ────────────────────────────────────────────────────────────────
  sneasel: {
    stage: 2, types: ['dark', 'ice'], damageClass: 'physical',
    moveLines: [{ type: 'dark', damageClass: 'physical' }, { type: 'ice', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────────
  teddiursa: {
    stage: 1, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    evolvesAt: 30, evolvesInto: 'ursaring',
    ability: 'guts'
  },
  ursaring: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    ability: 'guts'
  },
  stantler: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },
  smeargle: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
  },
  miltank: {
    stage: 2, types: ['normal'], damageClass: 'physical',
    moveLines: [{ type: 'normal', damageClass: 'physical' }],
    ability: 'rough-skin'
  },
  blissey: {
    stage: 3, types: ['normal'], damageClass: 'special',
    moveLines: [{ type: 'normal', damageClass: 'special' }],
  },

  // ── Fire / Rock ───────────────────────────────────────────────────────────────
  slugma: {
    stage: 1, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 38, evolvesInto: 'magcargo',
    ability: 'flame-body'
  },
  magcargo: {
    stage: 2, types: ['fire', 'rock'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }],
    ability: 'flame-body'
  },

  // ── Ice / Ground ─────────────────────────────────────────────────────────────
  swinub: {
    stage: 1, types: ['ice', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'ice', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    evolvesAt: 33, evolvesInto: 'piloswine',
  },
  piloswine: {
    stage: 2, types: ['ice', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'ice', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
  },

  // ── Water / Rock ─────────────────────────────────────────────────────────────
  corsola: {
    stage: 2, types: ['water', 'rock'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }],
    ability: 'cursed-body'
  },

  // ── Water ─────────────────────────────────────────────────────────────────────
  remoraid: {
    stage: 1, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
    evolvesAt: 25, evolvesInto: 'octillery',
  },
  octillery: {
    stage: 2, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
  },

  // ── Ice / Flying ─────────────────────────────────────────────────────────────
  delibird: {
    stage: 2, types: ['ice', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },

  // ── Water / Flying ────────────────────────────────────────────────────────────
  mantine: {
    stage: 2, types: ['water', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },

  // ── Steel / Flying ────────────────────────────────────────────────────────────
  skarmory: {
    stage: 2, types: ['steel', 'flying'], damageClass: 'physical',
    moveLines: [{ type: 'steel', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }],
  },

  // ── Dark / Fire ───────────────────────────────────────────────────────────────
  houndour: {
    stage: 1, types: ['dark', 'fire'], damageClass: 'special',
    moveLines: [{ type: 'dark', damageClass: 'physical' }, { type: 'fire', damageClass: 'special' }],
    evolvesAt: 24, evolvesInto: 'houndoom',
    ability: 'intimidate'
  },
  houndoom: {
    stage: 2, types: ['dark', 'fire'], damageClass: 'special',
    moveLines: [{ type: 'dark', damageClass: 'physical' }, { type: 'fire', damageClass: 'special' }],
    ability: 'intimidate'
  },

  // ── Water / Dragon ────────────────────────────────────────────────────────────
  kingdra: {
    stage: 3, types: ['water', 'dragon'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'dragon', damageClass: 'special' }],
  },

  // ── Ground ────────────────────────────────────────────────────────────────────
  phanpy: {
    stage: 1, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
    evolvesAt: 25, evolvesInto: 'donphan',
  },
  donphan: {
    stage: 2, types: ['ground'], damageClass: 'physical',
    moveLines: [{ type: 'ground', damageClass: 'physical' }],
  },

  // ── Normal ────────────────────────────────────────────────────────────────────
  porygon2: {
    stage: 3, types: ['normal'], damageClass: 'special', ability: 'download',
    moveLines: [{ type: 'normal', damageClass: 'special' }],
  },

  // ── Fighting ─────────────────────────────────────────────────────────────────
  tyrogue: {
    stage: 1, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
    evolvesAt: 20, evolvesInto: 'hitmontop',
  },
  hitmontop: {
    stage: 2, types: ['fighting'], damageClass: 'physical',
    moveLines: [{ type: 'fighting', damageClass: 'physical' }],
  },

  // ── Ice / Psychic ─────────────────────────────────────────────────────────────
  smoochum: {
    stage: 1, types: ['ice', 'psychic'], damageClass: 'special',
    moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'jynx',
  },

  // ── Baby eléctrico / fuego ────────────────────────────────────────────────────
  elekid: {
    stage: 1, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'electabuzz',
  },
  magby: {
    stage: 1, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
    evolvesAt: 30, evolvesInto: 'magmar',
    ability: 'flame-body',
  },

  // ── Legendarios ───────────────────────────────────────────────────────────────
  raikou: {
    stage: 3, types: ['electric'], damageClass: 'special',
    moveLines: [{ type: 'electric', damageClass: 'special' }],
  },
  entei: {
    stage: 3, types: ['fire'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }],
  },
  suicune: {
    stage: 3, types: ['water'], damageClass: 'special',
    moveLines: [{ type: 'water', damageClass: 'special' }],
  },

  // ── Rock / Dark ───────────────────────────────────────────────────────────────
  larvitar: {
    stage: 1, types: ['rock', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    evolvesAt: 30, evolvesInto: 'pupitar',
  },
  pupitar: {
    stage: 2, types: ['rock', 'ground'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }],
    evolvesAt: 55, evolvesInto: 'tyranitar',
  },
  tyranitar: {
    stage: 3, types: ['rock', 'dark'], damageClass: 'physical',
    moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'dark', damageClass: 'physical' }],
  },

  // ── Legendarios ───────────────────────────────────────────────────────────────
  lugia: {
    stage: 3, types: ['psychic', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },
  'ho-oh': {
    stage: 3, types: ['fire', 'flying'], damageClass: 'special',
    moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }],
  },
  celebi: {
    stage: 3, types: ['psychic', 'grass'], damageClass: 'special',
    moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'grass', damageClass: 'special' }],
  },
};

// ── POKEMON_LIST / POKEMON ────────────────────────────────────────────────────
// Catálogo completo de Gen 1. Usar como POKEMON.nombre en routes.js y tms.js.
// El valor es el nombre exacto de la PokeAPI (string que recibe createPokemon).
var POKEMON_LIST = {
  // Starters
  bulbasaur: 'bulbasaur',
  ivysaur: 'ivysaur',
  venusaur: 'venusaur',
  charmander: 'charmander',
  charmeleon: 'charmeleon',
  charizard: 'charizard',
  squirtle: 'squirtle',
  wartortle: 'wartortle',
  blastoise: 'blastoise',
  // Bug
  caterpie: 'caterpie',
  metapod: 'metapod',
  butterfree: 'butterfree',
  weedle: 'weedle',
  kakuna: 'kakuna',
  beedrill: 'beedrill',
  // Flying / Normal
  pidgey: 'pidgey',
  pidgeotto: 'pidgeotto',
  pidgeot: 'pidgeot',
  rattata: 'rattata',
  raticate: 'raticate',
  spearow: 'spearow',
  fearow: 'fearow',
  // Poison
  ekans: 'ekans',
  arbok: 'arbok',
  // Electric
  pikachu: 'pikachu',
  raichu: 'raichu',
  // Ground
  sandshrew: 'sandshrew',
  sandslash: 'sandslash',
  // Nidoran (guión requerido por la PokeAPI)
  nidoran_f: 'nidoran-f',
  nidorina: 'nidorina',
  nidoqueen: 'nidoqueen',
  nidoran_m: 'nidoran-m',
  nidorino: 'nidorino',
  nidoking: 'nidoking',
  // Fairy / Normal
  clefairy: 'clefairy',
  clefable: 'clefable',
  jigglypuff: 'jigglypuff',
  wigglytuff: 'wigglytuff',
  // Fire
  vulpix: 'vulpix',
  ninetales: 'ninetales',
  // Poison / Flying
  zubat: 'zubat',
  golbat: 'golbat',
  // Grass / Poison
  oddish: 'oddish',
  gloom: 'gloom',
  vileplume: 'vileplume',
  paras: 'paras',
  parasect: 'parasect',
  // Bug / Poison
  venonat: 'venonat',
  venomoth: 'venomoth',
  // Ground
  diglett: 'diglett',
  dugtrio: 'dugtrio',
  // Normal
  meowth: 'meowth',
  persian: 'persian',
  // Water
  psyduck: 'psyduck',
  golduck: 'golduck',
  // Fighting
  mankey: 'mankey',
  primeape: 'primeape',
  // Fire
  growlithe: 'growlithe',
  arcanine: 'arcanine',
  // Water
  poliwag: 'poliwag',
  poliwhirl: 'poliwhirl',
  poliwrath: 'poliwrath',
  // Psychic
  abra: 'abra',
  kadabra: 'kadabra',
  alakazam: 'alakazam',
  // Fighting
  machop: 'machop',
  machoke: 'machoke',
  machamp: 'machamp',
  // Grass / Poison
  bellsprout: 'bellsprout',
  weepinbell: 'weepinbell',
  victreebel: 'victreebel',
  // Water / Poison
  tentacool: 'tentacool',
  tentacruel: 'tentacruel',
  // Rock / Ground
  geodude: 'geodude',
  graveler: 'graveler',
  golem: 'golem',
  // Fire
  ponyta: 'ponyta',
  rapidash: 'rapidash',
  // Water / Psychic
  slowpoke: 'slowpoke',
  slowbro: 'slowbro',
  // Electric / Steel
  magnemite: 'magnemite',
  magneton: 'magneton',
  // Normal / Flying
  farfetch_d: 'farfetchd',
  doduo: 'doduo',
  dodrio: 'dodrio',
  // Water / Ice
  seel: 'seel',
  dewgong: 'dewgong',
  // Poison
  grimer: 'grimer',
  muk: 'muk',
  // Water / Ice
  shellder: 'shellder',
  cloyster: 'cloyster',
  // Ghost / Poison
  gastly: 'gastly',
  haunter: 'haunter',
  gengar: 'gengar',
  // Rock / Ground
  onix: 'onix',
  // Psychic
  drowzee: 'drowzee',
  hypno: 'hypno',
  // Water
  krabby: 'krabby',
  kingler: 'kingler',
  // Electric
  voltorb: 'voltorb',
  electrode: 'electrode',
  // Grass / Psychic
  exeggcute: 'exeggcute',
  exeggutor: 'exeggutor',
  // Ground
  cubone: 'cubone',
  marowak: 'marowak',
  // Fighting
  hitmonlee: 'hitmonlee',
  hitmonchan: 'hitmonchan',
  // Normal
  lickitung: 'lickitung',
  // Poison
  koffing: 'koffing',
  weezing: 'weezing',
  // Ground / Rock
  rhyhorn: 'rhyhorn',
  rhydon: 'rhydon',
  // Normal
  chansey: 'chansey',
  tangela: 'tangela',
  kangaskhan: 'kangaskhan',
  // Water
  horsea: 'horsea',
  seadra: 'seadra',
  goldeen: 'goldeen',
  seaking: 'seaking',
  staryu: 'staryu',
  starmie: 'starmie',
  // Psychic / Fairy
  mr_mime: 'mr-mime',
  // Bug / Flying
  scyther: 'scyther',
  // Ice / Psychic
  jynx: 'jynx',
  // Electric / Fire
  electabuzz: 'electabuzz',
  magmar: 'magmar',
  // Bug
  pinsir: 'pinsir',
  // Normal
  tauros: 'tauros',
  // Water
  magikarp: 'magikarp',
  gyarados: 'gyarados',
  lapras: 'lapras',
  // Normal
  ditto: 'ditto',
  // Eevee
  eevee: 'eevee',
  vaporeon: 'vaporeon',
  jolteon: 'jolteon',
  flareon: 'flareon',
  // Normal
  porygon: 'porygon',
  // Rock / Water (fósiles)
  omanyte: 'omanyte',
  omastar: 'omastar',
  kabuto: 'kabuto',
  kabutops: 'kabutops',
  // Rock / Flying
  aerodactyl: 'aerodactyl',
  // Normal
  snorlax: 'snorlax',
  // Legendarios
  articuno: 'articuno',
  zapdos: 'zapdos',
  moltres: 'moltres',
  // Dragon
  dratini: 'dratini',
  dragonair: 'dragonair',
  dragonite: 'dragonite',
  // Psychic
  mewtwo: 'mewtwo',
  mew: 'mew',

  // ── Gen II — Johto ────────────────────────────────────────────────────────────
  chikorita: 'chikorita',
  bayleef: 'bayleef',
  meganium: 'meganium',
  cyndaquil: 'cyndaquil',
  quilava: 'quilava',
  typhlosion: 'typhlosion',
  totodile: 'totodile',
  croconaw: 'croconaw',
  feraligatr: 'feraligatr',
  sentret: 'sentret',
  furret: 'furret',
  hoothoot: 'hoothoot',
  noctowl: 'noctowl',
  ledyba: 'ledyba',
  ledian: 'ledian',
  spinarak: 'spinarak',
  ariados: 'ariados',
  crobat: 'crobat',
  chinchou: 'chinchou',
  lanturn: 'lanturn',
  pichu: 'pichu',
  cleffa: 'cleffa',
  igglybuff: 'igglybuff',
  togepi: 'togepi',
  togetic: 'togetic',
  natu: 'natu',
  xatu: 'xatu',
  mareep: 'mareep',
  flaaffy: 'flaaffy',
  ampharos: 'ampharos',
  bellossom: 'bellossom',
  marill: 'marill',
  azumarill: 'azumarill',
  sudowoodo: 'sudowoodo',
  politoed: 'politoed',
  hoppip: 'hoppip',
  skiploom: 'skiploom',
  jumpluff: 'jumpluff',
  aipom: 'aipom',
  sunkern: 'sunkern',
  sunflora: 'sunflora',
  yanma: 'yanma',
  wooper: 'wooper',
  quagsire: 'quagsire',
  espeon: 'espeon',
  umbreon: 'umbreon',
  murkrow: 'murkrow',
  slowking: 'slowking',
  misdreavus: 'misdreavus',
  unown: 'unown',
  wobbuffet: 'wobbuffet',
  girafarig: 'girafarig',
  pineco: 'pineco',
  forretress: 'forretress',
  dunsparce: 'dunsparce',
  gligar: 'gligar',
  steelix: 'steelix',
  snubbull: 'snubbull',
  granbull: 'granbull',
  qwilfish: 'qwilfish',
  scizor: 'scizor',
  shuckle: 'shuckle',
  heracross: 'heracross',
  sneasel: 'sneasel',
  teddiursa: 'teddiursa',
  ursaring: 'ursaring',
  slugma: 'slugma',
  magcargo: 'magcargo',
  swinub: 'swinub',
  piloswine: 'piloswine',
  corsola: 'corsola',
  remoraid: 'remoraid',
  octillery: 'octillery',
  delibird: 'delibird',
  mantine: 'mantine',
  skarmory: 'skarmory',
  houndour: 'houndour',
  houndoom: 'houndoom',
  kingdra: 'kingdra',
  phanpy: 'phanpy',
  donphan: 'donphan',
  porygon2: 'porygon2',
  stantler: 'stantler',
  smeargle: 'smeargle',
  tyrogue: 'tyrogue',
  hitmontop: 'hitmontop',
  smoochum: 'smoochum',
  elekid: 'elekid',
  magby: 'magby',
  miltank: 'miltank',
  blissey: 'blissey',
  raikou: 'raikou',
  entei: 'entei',
  suicune: 'suicune',
  larvitar: 'larvitar',
  pupitar: 'pupitar',
  tyranitar: 'tyranitar',
  lugia: 'lugia',
  ho_oh: 'ho-oh',
  celebi: 'celebi',
};

// Alias global — disponible en routes.js, tms.js y cualquier archivo cargado después
const POKEMON = POKEMON_LIST;

// ── ABILITY_DATA ──────────────────────────────────────────────────────────────
// Alias directo a ABILITIES (move-effects.js) — nombre y desc se mantienen
// en un solo sitio. Requiere que move-effects.js se cargue antes que este archivo.
var ABILITY_DATA = ABILITIES;
