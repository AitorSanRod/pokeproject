// pokemon-db.js — tipos, clase de daño, moveLines, cadenas de evolución y stage
// stage: 1=1er mov por línea | 2=2 primeros | 3=los 3
// evolvesAt: nivel de evolución | evolvesInto: nombre PokeAPI de la forma siguiente

var POKEMON_DB = {
  // ── Starters ──────────────────────────────────────────────────────────────
  bulbasaur:  { stage: 1, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'ivysaur' },
  ivysaur:    { stage: 2, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 32, evolvesInto: 'venusaur' },
  venusaur:   { stage: 3, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },
  charmander: { stage: 1, types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'charmeleon' },
  charmeleon: { stage: 2, types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'charizard' },
  charizard:  { stage: 3, types: ['fire', 'flying'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  squirtle:   { stage: 1, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'wartortle' },
  wartortle:  { stage: 2, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'blastoise' },
  blastoise:  { stage: 3, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }] },

  // ── Bug / Poison ──────────────────────────────────────────────────────────
  caterpie:   { stage: 1, types: ['bug'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }], evolvesAt: 7, evolvesInto: 'metapod' },
  metapod:    { stage: 2, types: ['bug'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }], evolvesAt: 10, evolvesInto: 'butterfree' },
  butterfree: { stage: 3, types: ['bug', 'flying'], damageClass: 'special', moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  weedle:     { stage: 1, types: ['bug', 'poison'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }], evolvesAt: 7, evolvesInto: 'kakuna' },
  kakuna:     { stage: 2, types: ['bug', 'poison'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }], evolvesAt: 10, evolvesInto: 'beedrill' },
  beedrill:   { stage: 3, types: ['bug', 'poison'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }] },

  // ── Flying / Normal ───────────────────────────────────────────────────────
  pidgey:     { stage: 1, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 18, evolvesInto: 'pidgeotto' },
  pidgeotto:  { stage: 2, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'pidgeot' },
  pidgeot:    { stage: 3, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },
  rattata:    { stage: 1, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }], evolvesAt: 20, evolvesInto: 'raticate' },
  raticate:   { stage: 2, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },
  spearow:    { stage: 1, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 20, evolvesInto: 'fearow' },
  fearow:     { stage: 2, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Poison / Snake ────────────────────────────────────────────────────────
  ekans:      { stage: 1, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 22, evolvesInto: 'arbok' },
  arbok:      { stage: 3, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Electric ──────────────────────────────────────────────────────────────
  pikachu:    { stage: 1, types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }], evolvesAt: 40, evolvesInto: 'raichu' },
  raichu:     { stage: 3, types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },

  // ── Ground ────────────────────────────────────────────────────────────────
  sandshrew:  { stage: 1, types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 22, evolvesInto: 'sandslash' },
  sandslash:  { stage: 3, types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Nidoran ───────────────────────────────────────────────────────────────
  'nidoran-f': { stage: 1, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 16, evolvesInto: 'nidorina' },
  nidorina:    { stage: 2, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'nidoqueen' },
  nidoqueen:   { stage: 3, types: ['poison', 'ground'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },
  'nidoran-m': { stage: 1, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 16, evolvesInto: 'nidorino' },
  nidorino:    { stage: 2, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'nidoking' },
  nidoking:    { stage: 3, types: ['poison', 'ground'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },

  // ── Fairy / Normal ────────────────────────────────────────────────────────
  clefairy:   { stage: 1, types: ['fairy'], damageClass: 'special', moveLines: [{ type: 'fairy', damageClass: 'special' }, { type: 'normal', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'clefable' },
  clefable:   { stage: 2, types: ['fairy'], damageClass: 'special', moveLines: [{ type: 'fairy', damageClass: 'special' }, { type: 'normal', damageClass: 'special' }] },
  jigglypuff: { stage: 1, types: ['normal', 'fairy'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'wigglytuff' },
  wigglytuff: { stage: 2, types: ['normal', 'fairy'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }] },

  // ── Fire fox ──────────────────────────────────────────────────────────────
  vulpix:     { stage: 1, types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }], evolvesAt: 25, evolvesInto: 'ninetales' },
  ninetales:  { stage: 3, types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }] },

  // ── Poison / Flying ───────────────────────────────────────────────────────
  zubat:      { stage: 1, types: ['poison', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }], evolvesAt: 22, evolvesInto: 'golbat' },
  golbat:     { stage: 2, types: ['poison', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'poison', damageClass: 'physical' }] },

  // ── Grass / Poison ────────────────────────────────────────────────────────
  oddish:     { stage: 1, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 21, evolvesInto: 'gloom' },
  gloom:      { stage: 2, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'vileplume' },
  vileplume:  { stage: 3, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },
  paras:      { stage: 1, types: ['bug', 'grass'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'grass', damageClass: 'physical' }], evolvesAt: 24, evolvesInto: 'parasect' },
  parasect:   { stage: 2, types: ['bug', 'grass'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'grass', damageClass: 'physical' }] },

  // ── Bug / Poison ──────────────────────────────────────────────────────────
  venonat:    { stage: 1, types: ['bug', 'poison'], damageClass: 'special', moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 31, evolvesInto: 'venomoth' },
  venomoth:   { stage: 3, types: ['bug', 'poison'], damageClass: 'special', moveLines: [{ type: 'bug', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Ground ────────────────────────────────────────────────────────────────
  diglett:    { stage: 1, types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }], evolvesAt: 26, evolvesInto: 'dugtrio' },
  dugtrio:    { stage: 2, types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  meowth:     { stage: 1, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'persian' },
  persian:    { stage: 2, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  psyduck:    { stage: 1, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }], evolvesAt: 33, evolvesInto: 'golduck' },
  golduck:    { stage: 2, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Fighting ──────────────────────────────────────────────────────────────
  mankey:     { stage: 1, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'primeape' },
  primeape:   { stage: 3, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Fire ──────────────────────────────────────────────────────────────────
  growlithe:  { stage: 1, types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }], evolvesAt: 30, evolvesInto: 'arcanine' },
  arcanine:   { stage: 3, types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  poliwag:    { stage: 1, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 25, evolvesInto: 'poliwhirl' },
  poliwhirl:  { stage: 2, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'poliwrath' },
  poliwrath:  { stage: 3, types: ['water', 'fighting'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'fighting', damageClass: 'physical' }] },

  // ── Psychic ───────────────────────────────────────────────────────────────
  abra:       { stage: 1, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }], evolvesAt: 16, evolvesInto: 'kadabra' },
  kadabra:    { stage: 2, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }], evolvesAt: 40, evolvesInto: 'alakazam' },
  alakazam:   { stage: 3, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },

  // ── Fighting ──────────────────────────────────────────────────────────────
  machop:     { stage: 1, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'machoke' },
  machoke:    { stage: 2, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'machamp' },
  machamp:    { stage: 3, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }] },

  // ── Grass / Poison ────────────────────────────────────────────────────────
  bellsprout: { stage: 1, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 21, evolvesInto: 'weepinbell' },
  weepinbell: { stage: 2, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'victreebel' },
  victreebel: { stage: 3, types: ['grass', 'poison'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Water / Poison ────────────────────────────────────────────────────────
  tentacool:  { stage: 1, types: ['water', 'poison'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 30, evolvesInto: 'tentacruel' },
  tentacruel: { stage: 3, types: ['water', 'poison'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Rock / Ground ─────────────────────────────────────────────────────────
  geodude:    { stage: 1, types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }], evolvesAt: 25, evolvesInto: 'graveler' },
  graveler:   { stage: 2, types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }], evolvesAt: 36, evolvesInto: 'golem' },
  golem:      { stage: 3, types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },

  // ── Fire ──────────────────────────────────────────────────────────────────
  ponyta:     { stage: 1, types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }], evolvesAt: 40, evolvesInto: 'rapidash' },
  rapidash:   { stage: 2, types: ['fire'], damageClass: 'physical', moveLines: [{ type: 'fire', damageClass: 'physical' }] },

  // ── Water / Psychic ───────────────────────────────────────────────────────
  slowpoke:   { stage: 1, types: ['water', 'psychic'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }], evolvesAt: 37, evolvesInto: 'slowbro' },
  slowbro:    { stage: 3, types: ['water', 'psychic'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Electric / Steel ──────────────────────────────────────────────────────
  magnemite:  { stage: 1, types: ['electric', 'steel'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }], evolvesAt: 30, evolvesInto: 'magneton' },
  magneton:   { stage: 3, types: ['electric', 'steel'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },

  // ── Normal / Flying ───────────────────────────────────────────────────────
  "farfetch-d": { stage: 2, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },
  doduo:      { stage: 1, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 31, evolvesInto: 'dodrio' },
  dodrio:     { stage: 2, types: ['normal', 'flying'], damageClass: 'physical', moveLines: [{ type: 'flying', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Water / Ice ───────────────────────────────────────────────────────────
  seel:       { stage: 1, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }], evolvesAt: 34, evolvesInto: 'dewgong' },
  dewgong:    { stage: 2, types: ['water', 'ice'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }] },

  // ── Poison ────────────────────────────────────────────────────────────────
  grimer:     { stage: 1, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }], evolvesAt: 38, evolvesInto: 'muk' },
  muk:        { stage: 3, types: ['poison'], damageClass: 'physical', moveLines: [{ type: 'poison', damageClass: 'physical' }] },

  // ── Water / Ice ───────────────────────────────────────────────────────────
  shellder:   { stage: 1, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'cloyster' },
  cloyster:   { stage: 3, types: ['water', 'ice'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }] },

  // ── Ghost / Poison ────────────────────────────────────────────────────────
  gastly:     { stage: 1, types: ['ghost', 'poison'], damageClass: 'special', moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 25, evolvesInto: 'haunter' },
  haunter:    { stage: 2, types: ['ghost', 'poison'], damageClass: 'special', moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'gengar' },
  gengar:     { stage: 3, types: ['ghost', 'poison'], damageClass: 'special', moveLines: [{ type: 'ghost', damageClass: 'special' }, { type: 'poison', damageClass: 'special' }] },

  // ── Rock / Ground ─────────────────────────────────────────────────────────
  onix:       { stage: 2, types: ['rock', 'ground'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'ground', damageClass: 'physical' }] },

  // ── Psychic ───────────────────────────────────────────────────────────────
  drowzee:    { stage: 1, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }], evolvesAt: 26, evolvesInto: 'hypno' },
  hypno:      { stage: 2, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  krabby:     { stage: 1, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'kingler' },
  kingler:    { stage: 2, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Electric ──────────────────────────────────────────────────────────────
  voltorb:    { stage: 1, types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }], evolvesAt: 30, evolvesInto: 'electrode' },
  electrode:  { stage: 2, types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },

  // ── Grass / Psychic ───────────────────────────────────────────────────────
  exeggcute:  { stage: 1, types: ['grass', 'psychic'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'exeggutor' },
  exeggutor:  { stage: 2, types: ['grass', 'psychic'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Ground ────────────────────────────────────────────────────────────────
  cubone:     { stage: 1, types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }], evolvesAt: 28, evolvesInto: 'marowak' },
  marowak:    { stage: 2, types: ['ground'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }] },

  // ── Fighting ──────────────────────────────────────────────────────────────
  hitmonlee:  { stage: 2, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }] },
  hitmonchan: { stage: 2, types: ['fighting'], damageClass: 'physical', moveLines: [{ type: 'fighting', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  lickitung:  { stage: 3, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Poison ────────────────────────────────────────────────────────────────
  koffing:    { stage: 1, types: ['poison'], damageClass: 'special', moveLines: [{ type: 'poison', damageClass: 'special' }], evolvesAt: 35, evolvesInto: 'weezing' },
  weezing:    { stage: 2, types: ['poison'], damageClass: 'special', moveLines: [{ type: 'poison', damageClass: 'special' }] },

  // ── Ground / Rock ─────────────────────────────────────────────────────────
  rhyhorn:    { stage: 1, types: ['ground', 'rock'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }], evolvesAt: 42, evolvesInto: 'rhydon' },
  rhydon:     { stage: 2, types: ['ground', 'rock'], damageClass: 'physical', moveLines: [{ type: 'ground', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  chansey:    { stage: 2, types: ['normal'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }] },
  tangela:    { stage: 2, types: ['grass'], damageClass: 'special', moveLines: [{ type: 'grass', damageClass: 'special' }] },
  kangaskhan: { stage: 3, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  horsea:     { stage: 1, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 32, evolvesInto: 'seadra' },
  seadra:     { stage: 2, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }] },
  goldeen:    { stage: 1, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }], evolvesAt: 33, evolvesInto: 'seaking' },
  seaking:    { stage: 2, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }] },
  staryu:     { stage: 1, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }], evolvesAt: 36, evolvesInto: 'starmie' },
  starmie:    { stage: 3, types: ['water', 'psychic'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Psychic / Fairy ───────────────────────────────────────────────────────
  'mr-mime':  { stage: 2, types: ['psychic', 'fairy'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }, { type: 'fairy', damageClass: 'special' }] },

  // ── Bug / Flying ──────────────────────────────────────────────────────────
  scyther:    { stage: 2, types: ['bug', 'flying'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }] },

  // ── Ice / Psychic ─────────────────────────────────────────────────────────
  jynx:       { stage: 2, types: ['ice', 'psychic'], damageClass: 'special', moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'psychic', damageClass: 'special' }] },

  // ── Electric / Fire ───────────────────────────────────────────────────────
  electabuzz: { stage: 2, types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },
  magmar:     { stage: 2, types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }] },

  // ── Bug ───────────────────────────────────────────────────────────────────
  pinsir:     { stage: 3, types: ['bug'], damageClass: 'physical', moveLines: [{ type: 'bug', damageClass: 'physical' }, { type: 'normal', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  tauros:     { stage: 3, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Water ─────────────────────────────────────────────────────────────────
  magikarp:   { stage: 1, types: ['water'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }], evolvesAt: 20, evolvesInto: 'gyarados' },
  gyarados:   { stage: 2, types: ['water', 'flying'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }] },
  lapras:     { stage: 3, types: ['water', 'ice'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'ice', damageClass: 'special' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  ditto:      { stage: 2, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Eevee line ────────────────────────────────────────────────────────────
  eevee:      { stage: 1, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },
  vaporeon:   { stage: 2, types: ['water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }] },
  jolteon:    { stage: 2, types: ['electric'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }] },
  flareon:    { stage: 2, types: ['fire'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  porygon:    { stage: 2, types: ['normal'], damageClass: 'special', moveLines: [{ type: 'normal', damageClass: 'special' }] },

  // ── Rock / Water ──────────────────────────────────────────────────────────
  omanyte:    { stage: 1, types: ['rock', 'water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }], evolvesAt: 40, evolvesInto: 'omastar' },
  omastar:    { stage: 2, types: ['rock', 'water'], damageClass: 'special', moveLines: [{ type: 'water', damageClass: 'special' }, { type: 'rock', damageClass: 'physical' }] },
  kabuto:     { stage: 1, types: ['rock', 'water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }], evolvesAt: 40, evolvesInto: 'kabutops' },
  kabutops:   { stage: 2, types: ['rock', 'water'], damageClass: 'physical', moveLines: [{ type: 'water', damageClass: 'physical' }, { type: 'rock', damageClass: 'physical' }] },

  // ── Rock / Flying ─────────────────────────────────────────────────────────
  aerodactyl: { stage: 3, types: ['rock', 'flying'], damageClass: 'physical', moveLines: [{ type: 'rock', damageClass: 'physical' }, { type: 'flying', damageClass: 'physical' }] },

  // ── Normal ────────────────────────────────────────────────────────────────
  snorlax:    { stage: 3, types: ['normal'], damageClass: 'physical', moveLines: [{ type: 'normal', damageClass: 'physical' }] },

  // ── Legendarios ───────────────────────────────────────────────────────────
  articuno:   { stage: 3, types: ['ice', 'flying'], damageClass: 'special', moveLines: [{ type: 'ice', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  zapdos:     { stage: 3, types: ['electric', 'flying'], damageClass: 'special', moveLines: [{ type: 'electric', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },
  moltres:    { stage: 3, types: ['fire', 'flying'], damageClass: 'special', moveLines: [{ type: 'fire', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },

  // ── Dragon ────────────────────────────────────────────────────────────────
  dratini:    { stage: 1, types: ['dragon'], damageClass: 'special', moveLines: [{ type: 'dragon', damageClass: 'special' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 30, evolvesInto: 'dragonair' },
  dragonair:  { stage: 2, types: ['dragon'], damageClass: 'special', moveLines: [{ type: 'dragon', damageClass: 'special' }, { type: 'normal', damageClass: 'physical' }], evolvesAt: 55, evolvesInto: 'dragonite' },
  dragonite:  { stage: 3, types: ['dragon', 'flying'], damageClass: 'special', moveLines: [{ type: 'dragon', damageClass: 'special' }, { type: 'flying', damageClass: 'special' }] },

  // ── Psychic ───────────────────────────────────────────────────────────────
  mewtwo:     { stage: 3, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },
  mew:        { stage: 3, types: ['psychic'], damageClass: 'special', moveLines: [{ type: 'psychic', damageClass: 'special' }] },
};

// ── POKEMON_LIST ──────────────────────────────────────────────────────────────
// Catálogo completo de Gen 1. Usar como POKEMON.nombre en routes.js.
// El valor es el nombre exacto de la PokeAPI (string que recibe createPokemon).
var POKEMON_LIST = {
  // Starters
  bulbasaur:   'bulbasaur',
  ivysaur:     'ivysaur',
  venusaur:    'venusaur',
  charmander:  'charmander',
  charmeleon:  'charmeleon',
  charizard:   'charizard',
  squirtle:    'squirtle',
  wartortle:   'wartortle',
  blastoise:   'blastoise',
  // Bug
  caterpie:    'caterpie',
  metapod:     'metapod',
  butterfree:  'butterfree',
  weedle:      'weedle',
  kakuna:      'kakuna',
  beedrill:    'beedrill',
  // Flying / Normal
  pidgey:      'pidgey',
  pidgeotto:   'pidgeotto',
  pidgeot:     'pidgeot',
  rattata:     'rattata',
  raticate:    'raticate',
  spearow:     'spearow',
  fearow:      'fearow',
  // Poison
  ekans:       'ekans',
  arbok:       'arbok',
  // Electric
  pikachu:     'pikachu',
  raichu:      'raichu',
  // Ground
  sandshrew:   'sandshrew',
  sandslash:   'sandslash',
  // Nidoran (guión requerido por la PokeAPI)
  nidoran_f:   'nidoran-f',
  nidorina:    'nidorina',
  nidoqueen:   'nidoqueen',
  nidoran_m:   'nidoran-m',
  nidorino:    'nidorino',
  nidoking:    'nidoking',
  // Fairy / Normal
  clefairy:    'clefairy',
  clefable:    'clefable',
  jigglypuff:  'jigglypuff',
  wigglytuff:  'wigglytuff',
  // Fire
  vulpix:      'vulpix',
  ninetales:   'ninetales',
  // Poison / Flying
  zubat:       'zubat',
  golbat:      'golbat',
  // Grass / Poison
  oddish:      'oddish',
  gloom:       'gloom',
  vileplume:   'vileplume',
  paras:       'paras',
  parasect:    'parasect',
  // Bug / Poison
  venonat:     'venonat',
  venomoth:    'venomoth',
  // Ground
  diglett:     'diglett',
  dugtrio:     'dugtrio',
  // Normal
  meowth:      'meowth',
  persian:     'persian',
  // Water
  psyduck:     'psyduck',
  golduck:     'golduck',
  // Fighting
  mankey:      'mankey',
  primeape:    'primeape',
  // Fire
  growlithe:   'growlithe',
  arcanine:    'arcanine',
  // Water
  poliwag:     'poliwag',
  poliwhirl:   'poliwhirl',
  poliwrath:   'poliwrath',
  // Psychic
  abra:        'abra',
  kadabra:     'kadabra',
  alakazam:    'alakazam',
  // Fighting
  machop:      'machop',
  machoke:     'machoke',
  machamp:     'machamp',
  // Grass / Poison
  bellsprout:  'bellsprout',
  weepinbell:  'weepinbell',
  victreebel:  'victreebel',
  // Water / Poison
  tentacool:   'tentacool',
  tentacruel:  'tentacruel',
  // Rock / Ground
  geodude:     'geodude',
  graveler:    'graveler',
  golem:       'golem',
  // Fire
  ponyta:      'ponyta',
  rapidash:    'rapidash',
  // Water / Psychic
  slowpoke:    'slowpoke',
  slowbro:     'slowbro',
  // Electric / Steel
  magnemite:   'magnemite',
  magneton:    'magneton',
  // Normal / Flying
  farfetch_d:  'farfetch-d',
  doduo:       'doduo',
  dodrio:      'dodrio',
  // Water / Ice
  seel:        'seel',
  dewgong:     'dewgong',
  // Poison
  grimer:      'grimer',
  muk:         'muk',
  // Water / Ice
  shellder:    'shellder',
  cloyster:    'cloyster',
  // Ghost / Poison
  gastly:      'gastly',
  haunter:     'haunter',
  gengar:      'gengar',
  // Rock / Ground
  onix:        'onix',
  // Psychic
  drowzee:     'drowzee',
  hypno:       'hypno',
  // Water
  krabby:      'krabby',
  kingler:     'kingler',
  // Electric
  voltorb:     'voltorb',
  electrode:   'electrode',
  // Grass / Psychic
  exeggcute:   'exeggcute',
  exeggutor:   'exeggutor',
  // Ground
  cubone:      'cubone',
  marowak:     'marowak',
  // Fighting
  hitmonlee:   'hitmonlee',
  hitmonchan:  'hitmonchan',
  // Normal
  lickitung:   'lickitung',
  // Poison
  koffing:     'koffing',
  weezing:     'weezing',
  // Ground / Rock
  rhyhorn:     'rhyhorn',
  rhydon:      'rhydon',
  // Normal
  chansey:     'chansey',
  tangela:     'tangela',
  kangaskhan:  'kangaskhan',
  // Water
  horsea:      'horsea',
  seadra:      'seadra',
  goldeen:     'goldeen',
  seaking:     'seaking',
  staryu:      'staryu',
  starmie:     'starmie',
  // Psychic / Fairy
  mr_mime:     'mr-mime',
  // Bug / Flying
  scyther:     'scyther',
  // Ice / Psychic
  jynx:        'jynx',
  // Electric / Fire
  electabuzz:  'electabuzz',
  magmar:      'magmar',
  // Bug
  pinsir:      'pinsir',
  // Normal
  tauros:      'tauros',
  // Water
  magikarp:    'magikarp',
  gyarados:    'gyarados',
  lapras:      'lapras',
  // Normal
  ditto:       'ditto',
  // Eevee
  eevee:       'eevee',
  vaporeon:    'vaporeon',
  jolteon:     'jolteon',
  flareon:     'flareon',
  // Normal
  porygon:     'porygon',
  // Rock / Water (fósiles)
  omanyte:     'omanyte',
  omastar:     'omastar',
  kabuto:      'kabuto',
  kabutops:    'kabutops',
  // Rock / Flying
  aerodactyl:  'aerodactyl',
  // Normal
  snorlax:     'snorlax',
  // Legendarios
  articuno:    'articuno',
  zapdos:      'zapdos',
  moltres:     'moltres',
  // Dragon
  dratini:     'dratini',
  dragonair:   'dragonair',
  dragonite:   'dragonite',
  // Psychic
  mewtwo:      'mewtwo',
  mew:         'mew',
};
