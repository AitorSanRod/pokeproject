// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES COMPARTIDAS ENTRE REGIONES
//
// Este archivo se carga ANTES de cualquier archivo de ruta regional.
// Contiene aliases, constantes y helpers usados por todas las regiones.
//
// Uso en archivos de ruta:
//   MOVES.fire.special.ember       → id del movimiento
//   PATH_TYPE.Trainer / .Wild / .Heal / .Special / .Lider
//   POKEMON.bulbasaur              → nombre de la PokeAPI
//   SHINY_RATE                     → probabilidad de shiny (modificable por región)
// ─────────────────────────────────────────────────────────────────────────────

/** @type {MoveList} */
const MOVES = MOVE_LIST;

const PATH_TYPE = Object.freeze({
  Trainer: 'trainer',
  Wild: 'wild',
  Special: 'special',
  Heal: 'heal',
  Lider: 'leader',
});

var SHINY_RATE = 0.005;
// var SHINY_RATE = 0.05; // 5% para pruebas

// Tasa de shiny aumentada cuando se tienen los 151 Pokémon de Kanto capturados
const SHINY_RATE_COMPLETE_DEX = 0.1;

// Devuelve la tasa de shiny activa según el estado de la Pokédex de Kanto
function getActiveShinyRate() {
  if (typeof KANTO_DEX === 'undefined' || typeof Storage === 'undefined') return SHINY_RATE;
  if (KANTO_DEX.every(e => Storage.isCaught(e.name))) return SHINY_RATE_COMPLETE_DEX;
  return SHINY_RATE;
}

// ── Helpers compartidos ────────────────────────────────────────────────────

function pickWildEncounter(wildTable) {
  const total = wildTable.reduce(function (s, e) { return s + e.rate; }, 0);
  const roll = Math.floor(Math.random() * total);
  var acc = 0;
  for (var i = 0; i < wildTable.length; i++) {
    acc += wildTable[i].rate;
    if (roll < acc) return wildTable[i];
  }
  return wildTable[wildTable.length - 1];
}

function pickTrainer(trainerData) {
  if (!trainerData) return null;
  const pool = Array.isArray(trainerData) ? trainerData : [trainerData];
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  const hasRates = pool.every(function (t) { return typeof t.rate === 'number'; });
  if (hasRates) {
    const total = pool.reduce(function (s, t) { return s + t.rate; }, 0);
    const roll = Math.floor(Math.random() * total);
    var acc = 0;
    for (var i = 0; i < pool.length; i++) {
      acc += pool[i].rate;
      if (roll < acc) return pool[i];
    }
    return pool[pool.length - 1];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function rollLevel(entry) {
  if (entry.level !== undefined) return entry.level;
  return Math.floor(Math.random() * (entry.maxLv - entry.minLv + 1)) + entry.minLv;
}

// generatePaths lee ROUTE_DATA, que cada región define como global propio.
function generatePaths(area) {
  const data = ROUTE_DATA[area];
  if (!data) return [];

  if (data.paths) return data.paths;

  const len = data.pathLength ?? 3;

  var templates = [];
  if (len === 2) {
    templates = [
      [PATH_TYPE.Trainer, PATH_TYPE.Wild],
      [PATH_TYPE.Wild, PATH_TYPE.Trainer],
      [PATH_TYPE.Trainer, PATH_TYPE.Trainer],
      [PATH_TYPE.Wild, PATH_TYPE.Wild],
    ];
  } else if (len === 3) {
    templates = [
      [PATH_TYPE.Wild, PATH_TYPE.Wild, PATH_TYPE.Wild],
      [PATH_TYPE.Trainer, PATH_TYPE.Wild, PATH_TYPE.Wild],
      [PATH_TYPE.Wild, PATH_TYPE.Trainer, PATH_TYPE.Wild],
      [PATH_TYPE.Wild, PATH_TYPE.Wild, PATH_TYPE.Trainer],
      [PATH_TYPE.Trainer, PATH_TYPE.Trainer, PATH_TYPE.Wild],
      [PATH_TYPE.Wild, PATH_TYPE.Trainer, PATH_TYPE.Trainer],
      [PATH_TYPE.Trainer, PATH_TYPE.Trainer, PATH_TYPE.Trainer],
      [PATH_TYPE.Trainer, PATH_TYPE.Heal, PATH_TYPE.Trainer],
    ];
  } else {
    var types = [PATH_TYPE.Trainer, PATH_TYPE.Wild, PATH_TYPE.Heal];
    for (var t = 0; t < 6; t++) {
      var combo = [];
      for (var i = 0; i < len; i++) {
        combo.push(types[Math.floor(Math.random() * 2)]);
      }
      templates.push(combo);
    }
  }

  var shuffled = templates.slice().sort(function () { return Math.random() - .5; });
  return shuffled.slice(0, 3).map(function (types) {
    return types.map(function (type) { return { type: type }; });
  });
}
