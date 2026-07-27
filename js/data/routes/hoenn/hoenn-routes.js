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

// Condiciones reutilizables — uso: condition: HOENN_COND.hasBadge('stone-badge')
const HOENN_COND = {
  hasBadge:    (id)  => () => Storage.getAllBadges()?.hoenn?.includes(id) ?? false,
  hasBadges:   (ids) => () => ids.every(id => Storage.getAllBadges()?.hoenn?.includes(id)),
  hasAllBadges: ()   => () => HOENN_ALL_BADGES.every(id => Storage.getAllBadges()?.hoenn?.includes(id)),
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE_DATA — áreas de Hoenn
// ─────────────────────────────────────────────────────────────────────────────

Object.assign(ROUTE_DATA, {

  // TODO: añadir rutas de Hoenn aquí

});

// ─────────────────────────────────────────────────────────────────────────────
// HOENN_ROUTES — orden de la aventura
// ─────────────────────────────────────────────────────────────────────────────

var HOENN_ROUTES = [

  // TODO: añadir secuencia de rutas aquí

];

// ── Helpers específicos de Hoenn ──────────────────────────────────────────────

function hoennObtenerSegundoInicial(playerPokemon) {
  if (playerPokemon === POKEMON.treecko)  return [POKEMON.torchic, POKEMON.mudkip];
  if (playerPokemon === POKEMON.torchic)  return [POKEMON.treecko, POKEMON.mudkip];
  if (playerPokemon === POKEMON.mudkip)   return [POKEMON.treecko, POKEMON.torchic];
  return [POKEMON.eevee, POKEMON.pikachu];
}

function hoennPickRival(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return POKEMON.torchic;
  if (playerPokemon === POKEMON.torchic) return POKEMON.mudkip;
  if (playerPokemon === POKEMON.mudkip)  return POKEMON.treecko;
  return POKEMON.eevee;
}

function hoennPickRivalSecond(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return POKEMON.combusken;
  if (playerPokemon === POKEMON.torchic) return POKEMON.marshtomp;
  if (playerPokemon === POKEMON.mudkip)  return POKEMON.grovyle;
  return POKEMON.eevee;
}

function hoennPickRivalThird(playerPokemon) {
  if (playerPokemon === POKEMON.treecko) return POKEMON.blaziken;
  if (playerPokemon === POKEMON.torchic) return POKEMON.swampert;
  if (playerPokemon === POKEMON.mudkip)  return POKEMON.sceptile;
  return POKEMON.eevee;
}
