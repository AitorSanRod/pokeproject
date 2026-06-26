// ─────────────────────────────────────────────────────────────────────────────
// RUTAS DE JOHTO
//
// Requiere routes-constants.js, routes-assets.js y kanto/kanto-routes.js
// cargados antes que este archivo (ROUTE_DATA ya debe existir como global).
//
// Este archivo extiende ROUTE_DATA con las áreas de Johto y define
// JOHTO_ROUTES como array ordenado de paradas de la aventura.
//
// Globals disponibles: MOVES, PATH_TYPE, SHINY_RATE, POKEMON, ITEM,
//                      BG, COMBAT_BG, ENTRENADORES, pickWildEncounter,
//                      pickTrainer, rollLevel, generatePaths
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA — igual que kanto-routes.js
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

Object.assign(ROUTE_DATA, {

  // ═══════════════════════════════════════════════════════════════════════
  // PUEBLO RAÍZ (New Bark Town) — inicio de la aventura Johto
  // ═══════════════════════════════════════════════════════════════════════

  'johto-inicio-info': {
    type: 'information',
    bg: BG.ruta1,           // TODO: reemplazar por BG de Pueblo Raíz
    title: 'Pueblo Raíz',
    description: `<p>El viento que sopla desde este pequeño pueblo marca el comienzo de una nueva aventura.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────────
  // RUTA 29
  // ─────────────────────────────────────────────────────────────────────

  'johto-ruta-29': {
    bg: BG.ruta1,           // TODO: reemplazar por BG de Ruta 29
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    wild: [
      { name: POKEMON.sentret,  rate: 50, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.hoothoot, rate: 30, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.pidgey,   rate: 20, minLv: 2, maxLv: 4, moveId: MOVES.flying.physical.peck },
    ],
    trainer: [
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 100, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
        ]
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CIUDAD FRESNO (Cherrygrove City) — primera ciudad, sin gimnasio
  // ─────────────────────────────────────────────────────────────────────

  'johto-ciudad-fresno-info': {
    type: 'information',
    bg: BG.ciudadVerde,     // TODO: reemplazar por BG de Ciudad Fresno
    title: 'Ciudad Fresno',
    description: `<p>Una tranquila ciudad costera. El aroma a cerezas flota en el aire.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────────
  // CIUDAD MALVA (Violet City) — Gimnasio de Falkner (Volador)
  // ─────────────────────────────────────────────────────────────────────

  'johto-ciudad-malva': {
    bg: BG.ciudadPlateada,  // TODO: reemplazar por BG de Ciudad Malva
    combatBg: COMBAT_BG.default,
    gymLeader:    'Falkner',
    gymType:      'flying',
    badgeId:      'zephyr-badge',
    gymLeaderImg: TRAINER_IMG.rival, // TODO: añadir sprite de Falkner
    welcome: { title: 'Ciudad Malva', subtitle: 'Gimnasio de Tipo Volador' },
    wild: [],
    trainer: [],
    gym: {
      leader: [
        { name: POKEMON.pidgey,   level: 7,  moveId: MOVES.flying.physical.peck },
        { name: POKEMON.pidgeotto, level: 9,  moveId: MOVES.flying.physical.wing_attack },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

});

// ─────────────────────────────────────────────────────────────────────────────
// JOHTO_ROUTES — orden de la aventura
//
// El campo 'area' debe coincidir con una clave de ROUTE_DATA.
// ─────────────────────────────────────────────────────────────────────────────

var JOHTO_ROUTES = [

  { name: 'Pueblo Raíz',     area: 'johto-inicio-info'        },
  { name: 'Ruta 29',         area: 'johto-ruta-29'            },
  { name: 'Ciudad Fresno',   area: 'johto-ciudad-fresno-info' },
  { name: 'Ciudad Malva',    area: 'johto-ciudad-malva'       },

  // TODO: continuar con el resto de Johto
  //   Pueblo Nogal, Ruta 30/31, Ciudad Dorada, Ruta 33...
  //   Ciudad Incienso, Ciudad Nogal, Ciudad Olivina, Pueblo Caoba,
  //   Ciudad Amatista → Liga Johto
];
