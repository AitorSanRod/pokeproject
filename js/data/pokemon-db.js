// pokemon-db.js — tipos, clase de daño, moveLines y cadenas de evolución
// evolvesAt: nivel de evolución | evolvesInto: nombre PokeAPI de la forma siguiente

var POKEMON_DB = {
  // ── Starters ──────────────────────────────────────────────────────────────
  bulbasaur: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'ivysaur' },
  ivysaur: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 32, evolvesInto: 'venusaur' },
  venusaur: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },
  charmander: { types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'charmeleon' },
  charmeleon: { types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'charizard' },
  charizard: { types: ['fire', 'flying'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  squirtle: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'wartortle' },
  wartortle: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'blastoise' },
  blastoise: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }] },

  // ── Bug / Poison ──────────────────────────────────────────────────────────
  caterpie: { types: ['bug'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }], evolvesAt: 7, evolvesInto: 'metapod' },
  metapod: { types: ['bug'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }], evolvesAt: 10, evolvesInto: 'butterfree' },
  butterfree: { types: ['bug', 'flying'], damageClass: 'special', moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  weedle: { types: ['bug', 'poison'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }], evolvesAt: 7, evolvesInto: 'kakuna' },
  kakuna: { types: ['bug', 'poison'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }], evolvesAt: 10, evolvesInto: 'beedrill' },
  beedrill: { types: ['bug', 'poison'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }] },

  // ── Flying / Normal ───────────────────────────────────────────────────────
  pidgey: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 18, evolvesInto: 'pidgeotto' },
  pidgeotto: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'pidgeot' },
  pidgeot: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },
  rattata: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }], evolvesAt: 20, evolvesInto: 'raticate' },
  raticate: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },
  spearow: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 20, evolvesInto: 'fearow' },
  fearow: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Poison / Snake ────────────────────────────────────────────────────────
  ekans: { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 22, evolvesInto: 'arbok' },
  arbok: { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Electric ──────────────────────────────────────────────────────────────
  pikachu: { types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }], evolvesAt: 40, evolvesInto: 'raichu' },
  raichu: { types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },

  // ── Ground ────────────────────────────────────────────────────────────────
  sandshrew: { types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 22, evolvesInto: 'sandslash' },
  sandslash: { types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Nidoran ───────────────────────────────────────────────────────────────
  'nidoran-f': { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 16, evolvesInto: 'nidorina' },
  nidorina: { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'nidoqueen' },
  nidoqueen: { types: ['poison', 'ground'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },
  'nidoran-m': { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 16, evolvesInto: 'nidorino' },
  nidorino: { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'nidoking' },
  nidoking: { types: ['poison', 'ground'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },

  // ── Fairy / Normal ────────────────────────────────────────────────────────
  clefairy: { types: ['fairy'], damageClass: 'special', moveLines: [{ type: 'fairy', damageClass: 'special' }, { type: 'normal', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'clefable' },
  clefable: { types: ['fairy'], damageClass: 'special', moveLines: [{ type: 'fairy', damageClass: 'special' }, { type: 'normal', damageClass: 'special' }] },
  jigglypuff: { types: ['normal', 'fairy'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'wigglytuff' },
  wigglytuff: { types: ['normal', 'fairy'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }] },

  // ── Fire fox ──────────────────────────────────────────────────────────────
  vulpix: { types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }], evolvesAt: 25, evolvesInto: 'ninetales' },
  ninetales: { types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }] },

  // ── Poison / Flying ───────────────────────────────────────────────────────
  zubat: { types: ['poison', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }], evolvesAt: 22, evolvesInto: 'golbat' },
  golbat: { types: ['poison', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }] },

  // ── Grass / Poison ────────────────────────────────────────────────────────
  oddish: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 21, evolvesInto: 'gloom' },
  gloom: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'vileplume' },
  vileplume: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },
  paras: { types: ['bug', 'grass'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'grass', damageClass: 'physical' }], evolvesAt: 24, evolvesInto: 'parasect' },
  parasect: { types: ['bug', 'grass'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'grass', damageClass: 'physical' }] },

  // ── Bug / Poison ──────────────────────────────────────────────────────────
  venonat: { types: ['bug', 'poison'], damageClass: 'special', moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 31, evolvesInto: 'venomoth' },
  venomoth: { types: ['bug', 'poison'], damageClass: 'special', moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Ground ────────────────────────────────────────────────────────────────
  diglett: { types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }], evolvesAt: 26, evolvesInto: 'dugtrio' },
  dugtrio: { types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  meowth: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'persian' },
  persian: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  psyduck: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }], evolvesAt: 33, evolvesInto: 'golduck' },
  golduck: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Fighting ──────────────────────────────────────────────────────────────
  mankey: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'primeape' },
  primeape: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Fire ──────────────────────────────────────────────────────────────────
  growlithe: { types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }], evolvesAt: 30, evolvesInto: 'arcanine' },
  arcanine: { types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  poliwag: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 25, evolvesInto: 'poliwhirl' },
  poliwhirl: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'poliwrath' },
  poliwrath: { types: ['water', 'fighting'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'fighting', damageClass: 'physical' }] },

  // ── Psychic ───────────────────────────────────────────────────────────────
  abra: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'kadabra' },
  kadabra: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'alakazam' },
  alakazam: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },

  // ── Fighting ──────────────────────────────────────────────────────────────
  machop: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'machoke' },
  machoke: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'machamp' },
  machamp: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }] },

  // ── Grass / Poison ────────────────────────────────────────────────────────
  bellsprout: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 21, evolvesInto: 'weepinbell' },
  weepinbell: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'victreebel' },
  victreebel: { types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Water / Poison ────────────────────────────────────────────────────────
  tentacool: { types: ['water', 'poison'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 30, evolvesInto: 'tentacruel' },
  tentacruel: { types: ['water', 'poison'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Rock / Ground ─────────────────────────────────────────────────────────
  geodude: { types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }], evolvesAt: 25, evolvesInto: 'graveler' },
  graveler: { types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'golem' },
  golem: { types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },

  // ── Fire ──────────────────────────────────────────────────────────────────
  ponyta: { types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }], evolvesAt: 40, evolvesInto: 'rapidash' },
  rapidash: { types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }] },

  // ── Water / Psychic ───────────────────────────────────────────────────────
  slowpoke: { types: ['water', 'psychic'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }], evolvesAt: 37, evolvesInto: 'slowbro' },
  slowbro: { types: ['water', 'psychic'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Electric / Steel ──────────────────────────────────────────────────────
  magnemite: { types: ['electric', 'steel'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }], evolvesAt: 30, evolvesInto: 'magneton' },
  magneton: { types: ['electric', 'steel'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },

  // ── Normal / Flying ───────────────────────────────────────────────────────
  "farfetch-d": { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },
  doduo: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 31, evolvesInto: 'dodrio' },
  dodrio: { types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Water / Ice ───────────────────────────────────────────────────────────
  seel: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }], evolvesAt: 34, evolvesInto: 'dewgong' },
  dewgong: { types: ['water', 'ice'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }] },

  // ── Poison ────────────────────────────────────────────────────────────────
  grimer: { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }], evolvesAt: 38, evolvesInto: 'muk' },
  muk: { types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }] },

  // ── Water / Ice ───────────────────────────────────────────────────────────
  shellder: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'cloyster' },
  cloyster: { types: ['water', 'ice'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }] },

  // ── Ghost / Poison ────────────────────────────────────────────────────────
  gastly: { types: ['ghost', 'poison'], damageClass: 'special', moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 25, evolvesInto: 'haunter' },
  haunter: { types: ['ghost', 'poison'], damageClass: 'special', moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'gengar' },
  gengar: { types: ['ghost', 'poison'], damageClass: 'special', moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Rock / Ground ─────────────────────────────────────────────────────────
  onix: { types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },

  // ── Psychic ───────────────────────────────────────────────────────────────
  drowzee: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }], evolvesAt: 26, evolvesInto: 'hypno' },
  hypno: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  krabby: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'kingler' },
  kingler: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Electric ──────────────────────────────────────────────────────────────
  voltorb: { types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }], evolvesAt: 30, evolvesInto: 'electrode' },
  electrode: { types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },

  // ── Grass / Psychic ───────────────────────────────────────────────────────
  exeggcute: { types: ['grass', 'psychic'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'exeggutor' },
  exeggutor: { types: ['grass', 'psychic'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Ground ────────────────────────────────────────────────────────────────
  cubone: { types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'marowak' },
  marowak: { types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }] },

  // ── Fighting ──────────────────────────────────────────────────────────────
  hitmonlee: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }] },
  hitmonchan: { types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  lickitung: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Poison ────────────────────────────────────────────────────────────────
  koffing: { types: ['poison'], damageClass: 'special', moveLines: [{ type: 'poison', damageClass: 'special' }], evolvesAt: 35, evolvesInto: 'weezing' },
  weezing: { types: ['poison'], damageClass: 'special', moveLines: [{ type: 'poison', damageClass: 'special' }] },

  // ── Ground / Rock ─────────────────────────────────────────────────────────
  rhyhorn: { types: ['ground', 'rock'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }], evolvesAt: 42, evolvesInto: 'rhydon' },
  rhydon: { types: ['ground', 'rock'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  chansey: { types: ['normal'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }] },
  tangela: { types: ['grass'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }] },
  kangaskhan: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  horsea: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 32, evolvesInto: 'seadra' },
  seadra: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }] },
  goldeen: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }], evolvesAt: 33, evolvesInto: 'seaking' },
  seaking: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }] },
  staryu: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'starmie' },
  starmie: { types: ['water', 'psychic'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Psychic / Fairy ───────────────────────────────────────────────────────
  'mr-mime': { types: ['psychic', 'fairy'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }] },

  // ── Bug / Flying ──────────────────────────────────────────────────────────
  scyther: { types: ['bug', 'flying'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }] },

  // ── Ice / Psychic ─────────────────────────────────────────────────────────
  jynx: { types: ['ice', 'psychic'], damageClass: 'special', moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Electric / Fire ───────────────────────────────────────────────────────
  electabuzz: { types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },
  magmar: { types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }] },

  // ── Bug ───────────────────────────────────────────────────────────────────
  pinsir: { types: ['bug'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  tauros: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  magikarp: { types: ['water'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }], evolvesAt: 20, evolvesInto: 'gyarados' },
  gyarados: { types: ['water', 'flying'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }] },
  lapras: { types: ['water', 'ice'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  ditto: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Eevee line ────────────────────────────────────────────────────────────
  eevee: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },
  vaporeon: { types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }] },
  jolteon: { types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },
  flareon: { types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  porygon: { types: ['normal'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }] },

  // ── Rock / Water ──────────────────────────────────────────────────────────
  omanyte: { types: ['rock', 'water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }], evolvesAt: 40, evolvesInto: 'omastar' },
  omastar: { types: ['rock', 'water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }] },
  kabuto: { types: ['rock', 'water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }], evolvesAt: 40, evolvesInto: 'kabutops' },
  kabutops: { types: ['rock', 'water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }] },

  // ── Rock / Flying ─────────────────────────────────────────────────────────
  aerodactyl: { types: ['rock', 'flying'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  snorlax: { types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Legendarios ───────────────────────────────────────────────────────────
  articuno: { types: ['ice', 'flying'], damageClass: 'special', moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  zapdos: { types: ['electric', 'flying'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  moltres: { types: ['fire', 'flying'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },

  // ── Dragon ────────────────────────────────────────────────────────────────
  dratini: { types: ['dragon'], damageClass: 'special', moveLines: [{ type: 'dragon', damageClass: 'special' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 30, evolvesInto: 'dragonair' },
  dragonair: { types: ['dragon'], damageClass: 'special', moveLines: [{ type: 'dragon', damageClass: 'special' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 55, evolvesInto: 'dragonite' },
  dragonite: { types: ['dragon', 'flying'], damageClass: 'special', moveLines: [{ type: 'dragon', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },

  // ── Psychic ───────────────────────────────────────────────────────────────
  mewtwo: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },
  mew: { types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },
};

// ── POKEMON_LIST ──────────────────────────────────────────────────────────────
function _buildPokemonList() {
  const list = {};
  const names = Object.keys(POKEMON_DB);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    list[name.replace(/-/g, '_')] = name;
  }
  list.nidoran_m = 'nidoran-m';
  list.nidoran_f = 'nidoran-f';
  list.mr_mime = 'mr-mime';
  return list;
}
var POKEMON_LIST = _buildPokemonList();
