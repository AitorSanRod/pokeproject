// ─────────────────────────────────────────────────────────────────────────────
// RUTAS DE HOENN
//
// Requiere routes-constants.js, routes-assets.js y kanto/kanto-routes.js
// cargados antes que este archivo (ROUTE_DATA ya debe existir como global).
//
// Este archivo extiende ROUTE_DATA con las áreas de Hoenn y define
// HOENN_ROUTES como array ordenado de paradas de la aventura.
//
// Globals disponibles: MOVES, PATH_TYPE, SHINY_RATE, POKEMON, ITEM,
//                      BG, COMBAT_BG, ENTRENADORES, pickWildEncounter,
//                      pickTrainer, rollLevel, generatePaths
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA — igual que kanto-routes.js / johto-routes.js
// ═══════════════════════════════════════════════════════════════════════════
//
// Ruta de combate:
//   bg, combatBg, trainerBg (opcional), wild[], trainer[], paths (opcional),
//   specialTrainer (opcional), rewardPokemon (opcional), rewardExtras (opcional),
//   welcome (opcional), gymLeader/gymType/badgeId/gymLeaderImg/gym (opcional)
//
// Ruta de información:
//   type: 'information', bg, title, description (opcional), optional (opcional)
//
// ─────────────────────────────────────────────────────────────────────────────

// Cambia a true para activar Hoenn en el selector de regiones.
var HOENN_ENABLED = false;

// Cambia a true para desbloquear la opción de elegir cualquier Pokémon de la
// Pokédex como inicial en la aventura de Hoenn.
var HOENN_CUSTOM_STARTER_ENABLED = false;

// ─────────────────────────────────────────────────────────────────────────────
// Medallas de Hoenn — para condiciones de rutas opcionales
// ─────────────────────────────────────────────────────────────────────────────

const HOENN_ALL_BADGES = [
  'stone-badge', 'knuckle-badge', 'dynamo-badge', 'heat-badge',
  'balance-badge', 'feather-badge', 'mind-badge', 'rain-badge',
];

// ─────────────────────────────────────────────────────────────────────────────
// MOs de Hoenn — Movimientos Ocultos
//
// Se desbloquean de forma permanente (Storage.unlockHM) al completar
// ciertas rutas o gimnasios. Una vez obtenidas valen para todas las runs.
//
// Uso en rutas:
//   rewardHM: 'surf'                        → se otorga al salir de esa ruta
//   condition: HOENN_COND.hasHM('surf')     → ruta/opción solo visible si ya tienes la MO
// ─────────────────────────────────────────────────────────────────────────────

const HOENN_HM_DATA = {
  corte: { name: 'MO01 Corte', desc: 'Abre caminos bloqueados por arbustos.', icon: '✂️' },
  surf: { name: 'MO03 Surf', desc: 'Permite surfear sobre el agua.', icon: '🌊' },
  fuerza: { name: 'MO04 Fuerza', desc: 'Empuja rocas para desbloquear rutas.', icon: '💪' },
  buceo: { name: 'MO08 Buceo', desc: 'Accede a rutas submarinas.', icon: '🤿' },
};

// Condiciones reutilizables
const HOENN_COND = {
  hasBadge: (id) => () => Storage.getAllBadges()?.hoenn?.includes(id) ?? false,
  hasBadges: (ids) => () => ids.every(id => Storage.getAllBadges()?.hoenn?.includes(id)),
  hasAllBadges: () => () => HOENN_ALL_BADGES.every(id => Storage.getAllBadges()?.hoenn?.includes(id)),
  hasHM: (id) => () => Storage.hasHM('hoenn', id),
  hasHMs: (ids) => () => ids.every(id => Storage.hasHM('hoenn', id)),
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE_DATA — áreas de Hoenn
// ─────────────────────────────────────────────────────────────────────────────

Object.assign(ROUTE_DATA, {

  // ── Pantalla narrativa: llegada a Ciudad Olivo ────────────────────────────
  'hoenn-ciudad-olivo': {
    type: 'information',
    bg: BG.JOTHO.ciudadOlivo,
    title: 'Ciudad Olivo',
    description: 'Llegas a Ciudad Olivo. Una entrenadora te desafía a atravesar el Bosque Petalburg. Si la vences, te promete algo especial.',
    optional: {
      area: 'hoenn-bosque-petalburg',
      btnName: 'Bosque Petalburg',
      condition: HOENN_COND.hasHM('corte'),
    },
  },

  // ── Bosque Petalburg: al terminarlo se consigue MO01 Corte ───────────────
  'hoenn-bosque-petalburg': {
    bg: BG.JOTHO.encinar,
    combatBg: COMBAT_BG.default,
    wild: [
      { name: POKEMON.wurmple,  rate: 35, minLv:  8, maxLv: 11, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.shroomish, rate: 35, minLv:  8, maxLv: 11, moveId: MOVES.grass.special.absorb },
      { name: POKEMON.taillow,  rate: 30, minLv:  9, maxLv: 12, moveId: MOVES.flying.physical.peck },
    ],
    trainer: [
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 100, pokemon: [
          { name: POKEMON.nuzleaf, minLv: 12, maxLv: 14, moveId: MOVES.grass.special.absorb },
        ],
      },
    ],
    rewardHM: 'corte',
  },

  // ── Pantalla narrativa: Ciudad Cuna ───────────────────────────────────────
  'hoenn-ciudad-cuna': {
    type: 'information',
    bg: BG.JOTHO.ciudadOrquidea,
    title: 'Ciudad Cuna',
    description: 'El señor Briney, el viejo marinero, te pide que derrotes a los Magma que rondan la costa. Si lo consigues, te recompensará.',
    optional: {
      area: 'hoenn-ruta-105',
      btnName: 'Ruta 105 (Surf)',
      condition: HOENN_COND.hasHM('surf'),
    },
  },

  // ── Ruta 105: al terminarla se consigue MO03 Surf ─────────────────────────
  'hoenn-ruta-105': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.agua,
    wild: [
      { name: POKEMON.wingull,   rate: 50, minLv: 1, maxLv: 2, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.tentacool, rate: 50, minLv: 1, maxLv: 2, moveId: MOVES.water.special.water_gun },
    ],
    trainer: [
      {
        name: ENTRENADORES.Nadador.name, img: ENTRENADORES.Nadador.img, rate: 100, pokemon: [
          { name: POKEMON.pelipper, minLv: 1, maxLv: 2, moveId: [MOVES.flying.physical.wing_attack, MOVES.water.special.water_gun] },
        ],
      },
    ],
    rewardHM: 'surf',
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

});

// ─────────────────────────────────────────────────────────────────────────────
// HOENN_ROUTES — orden de la aventura
// ─────────────────────────────────────────────────────────────────────────────

var HOENN_ROUTES = [

  // Las rutas opcionales (bosque-petalburg, ruta-105) no aparecen aquí:
  // se accede a ellas desde el botón opcional de la pantalla de información.
  { area: 'hoenn-ciudad-olivo', name: 'Ciudad Olivo' },
  { area: 'hoenn-ruta-105', name: 'Ruta 105' },
  { area: 'hoenn-ciudad-cuna', name: 'Ciudad Cuna' },
  { area: 'hoenn-ruta-105', name: 'Ruta 105' },
];

// ── Helpers específicos de Hoenn ──────────────────────────────────────────────

function hoennObtenerSegundoInicial(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return [POKEMON.torchic, POKEMON.mudkip];
  if (playerPokemon === POKEMON.torchic) return [POKEMON.treecko, POKEMON.mudkip];
  if (playerPokemon === POKEMON.mudkip) return [POKEMON.treecko, POKEMON.torchic];
  return [POKEMON.eevee, POKEMON.pikachu];
}

function hoennPickRival(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return POKEMON.torchic;
  if (playerPokemon === POKEMON.torchic) return POKEMON.mudkip;
  if (playerPokemon === POKEMON.mudkip) return POKEMON.treecko;
  return POKEMON.eevee;
}

function hoennPickRivalSecond(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return POKEMON.combusken;
  if (playerPokemon === POKEMON.torchic) return POKEMON.marshtomp;
  if (playerPokemon === POKEMON.mudkip) return POKEMON.grovyle;
  return POKEMON.eevee;
}

function hoennPickRivalThird(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return POKEMON.blaziken;
  if (playerPokemon === POKEMON.torchic) return POKEMON.swampert;
  if (playerPokemon === POKEMON.mudkip) return POKEMON.sceptile;
  return POKEMON.eevee;
}
