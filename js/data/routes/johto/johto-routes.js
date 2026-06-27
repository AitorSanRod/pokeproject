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

// Cambia a false para mostrar Johto como "PRONTO" sin eliminar el código.
var JOHTO_ENABLED = false;

Object.assign(ROUTE_DATA, {

  // ─────────────────────────────────────────────────────────────────────
  // COMIENZO HASTA PRIMER GIMASIO
  // ─────────────────────────────────────────────────────────────────────

  'ruta-29': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    wild: [
      { name: POKEMON.sentret, rate: 40, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.hoothoot, rate: 30, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.pidgey, rate: 10, minLv: 2, maxLv: 4, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.hoppip, rate: 20, minLv: 2, maxLv: 4, moveId: MOVES.flying.physical.peck },
    ],
    trainer: [
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 30, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 15, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.hoppip, minLv: 2, maxLv: 4, moveId: MOVES.grass.special.absorb },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 15, pokemon: [
          { name: POKEMON.pidgey, minLv: 2, maxLv: 3, moveId: MOVES.flying.physical.peck },
          { name: POKEMON.hoothoot, minLv: 3, maxLv: 4, moveId: MOVES.flying.special.gust },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 40, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.hoothoot, minLv: 3, maxLv: 4, moveId: MOVES.flying.special.gust },
        ]
      },
    ],
  },

  'ruta-29-info-espera': {
    type: 'information',
    bg: BG.JOTHO.ruta29,
    title: 'Esperar...',
    description: '¿Quieres esperar a la noche?<br>Puede que aparezcan otros pokémon',
    optional: {
      btnName: 'Esperar',
      area: 'ruta-29-noche',
    },
  },

  'ruta-46': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    wild: [
      { name: POKEMON.jigglypuff, rate: 33, minLv: 2, maxLv: 4, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.geodude, rate: 33, minLv: 2, maxLv: 4, moveId: MOVES.rock.physical.rock_throw },
      { name: POKEMON.phanpy, rate: 35, minLv: 2, maxLv: 4, moveId: MOVES.ground.physical.bulldoze },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
    ],
  },

  'ciudad-cerezo': {
    bg: BG.JOTHO.ciudadCerezo,
    combatBg: COMBAT_BG.agua,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.corsola],
    wild: [
      { name: POKEMON.tentacool, rate: 25, minLv: 3, maxLv: 6, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.staryu, rate: 25, minLv: 3, maxLv: 6, moveId: MOVES.water.special.bubble_beam },
      { name: POKEMON.corsola, rate: 50, minLv: 3, maxLv: 6, moveId: MOVES.water.special.bubble_beam },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
    ],
  },

  'ciudad-cerezo-info': {
    type: 'information',
    bg: BG.JOTHO.ciudadCerezo,
    title: 'Vuelva a Casa',
    description: 'El Profesor Elm necesita verte antes de seguir',
  },

  'pueblo-primavera': {
    bg: BG.JOTHO.puebloPrimavera,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [],
    get wild() {
      const [primerInicial, segundoInicial] = ObtenerSegundoInicial(GameState.starterName ?? POKEMON.chikorita);
      return [
        { name: primerInicial, rate: 50, minLv: 5, maxLv: 7 },
        { name: segundoInicial, rate: 50, minLv: 5, maxLv: 7 },
      ];
    },
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Plata.name, img: ENTRENADORES.Plata.img, pokemon: [
        { name: 'RIVAL_STARTER', minLv: 5, maxLv: 7 },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }, { type: PATH_TYPE.Wild }],
    ],
  },

  'ruta-30': {
    bg: BG.JOTHO.ruta30,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.poliwag, POKEMON.heracross],
    wild: [
      { name: POKEMON.spinarak, rate: 25, minLv: 6, maxLv: 9, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.ledyba, rate: 25, minLv: 6, maxLv: 9, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.caterpie, rate: 25, minLv: 6, maxLv: 9, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.weedle, rate: 25, minLv: 6, maxLv: 9, moveId: MOVES.bug.physical.bug_bite },
    ],
    trainer: [
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 33, pokemon: [
          { name: POKEMON.caterpie, minLv: 6, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 33, pokemon: [
          { name: POKEMON.pidgey, minLv: 6, maxLv: 10, moveId: MOVES.flying.physical.peck },
          { name: POKEMON.rattata, minLv: 6, maxLv: 10, moveId: MOVES.normal.physical.tackle },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 34, pokemon: [
          { name: POKEMON.rattata, minLv: 6, maxLv: 10, moveId: MOVES.normal.physical.tackle },
        ]
      },
    ],
  },

  'ciudad-malva-info': {
    type: 'information',
    bg: BG.JOTHO.ciudadMalva,
    title: 'Ciudad Malva',
    description: '',
    optional: {
      btnName: 'Entrar en la Torre Bellsprout',
      area: 'torre-bellsprout',
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // CIUDAD MALVA — Gimnasio de Pegaso (Volador)
  // ─────────────────────────────────────────────────────────────────────

  'ciudad-malva-gym': {
    bg: BG.JOTHO.ciudadMalvaGym,
    combatBg: COMBAT_BG.interior,
    trainerBg: COMBAT_BG.interior,
    gymLeader: 'Pegaso',
    gymType: 'flying',
    badgeId: 'zephyr-badge',
    gymLeaderImg: TRAINER_IMG.pegaso,
    welcome: { title: 'Ciudad Malva', subtitle: 'Gimnasio de Tipo Volador', img: BG.JOTHO.ciudadMalva },
    wild: [],
    trainer: [
      {
        name: ENTRENADORES.Ornitologo.name, img: ENTRENADORES.Ornitologo.img, rate: 33, pokemon: [
          { name: POKEMON.pidgey, minLv: 9, maxLv: 12, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.Ornitologo.name, img: ENTRENADORES.Ornitologo.img, rate: 33, pokemon: [
          { name: POKEMON.spearow, minLv: 9, maxLv: 12, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.Ornitologo.name, img: ENTRENADORES.Ornitologo.img, rate: 34, pokemon: [
          { name: POKEMON.pidgey, minLv: 9, maxLv: 12, moveId: MOVES.flying.physical.peck },
          { name: POKEMON.pidgey, minLv: 9, maxLv: 12, moveId: MOVES.flying.physical.peck },
        ]
      },
    ],
    gym: {
      leader: [
        { name: POKEMON.pidgey, level: 14, moveId: MOVES.flying.physical.peck },
        { name: POKEMON.pidgeotto, level: 16, moveId: [MOVES.flying.physical.wing_attack, MOVES.normal.physical.extreme_speed] },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // PUEBLO AZALEA — Gimnasio de Antón (Bicho)
  // ─────────────────────────────────────────────────────────────────────

  //RUTA 32
  //RUINAS ALFA
  //OPCIONAL CUEVA UNION
  //RUTA 33
  //PUEBLO AZALEA

  // ─────────────────────────────────────────────────────────────────────
  // OPCIONALES
  // ─────────────────────────────────────────────────────────────────────

  'ruta-29-noche': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    wild: [
      { name: POKEMON.aipom, rate: 40, minLv: 3, maxLv: 5, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.spearow, rate: 30, minLv: 3, maxLv: 5, moveId: [MOVES.normal.physical.tackle, MOVES.flying.physical.peck] },
      { name: POKEMON.pineco, rate: 20, minLv: 3, maxLv: 5, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.heracross, rate: 5, minLv: 3, maxLv: 5, moveId: [MOVES.bug.physical.bug_bite, MOVES.fighting.physical.karate_chop] },
      { name: POKEMON.exeggcute, rate: 5, minLv: 3, maxLv: 5, moveId: [MOVES.psychic.special.confusion, MOVES.grass.special.absorb] },
    ],
    trainer: [
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 33, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 33, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.hoppip, minLv: 2, maxLv: 4, moveId: MOVES.grass.special.absorb },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 34, pokemon: [
          { name: POKEMON.sentret, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.hoothoot, minLv: 3, maxLv: 4, moveId: MOVES.flying.special.gust },
        ]
      },
    ],
    pathLength: 4
  },

  'torre-bellsprout': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    wild: [
      { name: POKEMON.bellsprout, rate: 40, minLv: 6, maxLv: 9, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
      { name: POKEMON.rattata, rate: 40, minLv: 6, maxLv: 9, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.gastly, rate: 20, minLv: 6, maxLv: 9, moveId: MOVES.ghost.special.hex },
    ],
    trainer: [
      {
        name: ENTRENADORES.Pensador.name, img: ENTRENADORES.Pensador.img, rate: 33, pokemon: [
          { name: POKEMON.bellsprout, rate: 40, minLv: 7, maxLv: 11, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
        ]
      },
      {
        name: ENTRENADORES.Pensador.name, img: ENTRENADORES.Pensador.img, rate: 33, pokemon: [
          { name: POKEMON.bellsprout, rate: 40, minLv: 7, maxLv: 11, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
          { name: POKEMON.hoothoot, rate: 40, minLv: 7, maxLv: 11, moveId: MOVES.flying.special.gust },
        ]
      },
      {
        name: ENTRENADORES.Pensador.name, img: ENTRENADORES.Pensador.img, rate: 34, pokemon: [
          { name: POKEMON.hoothoot, rate: 40, minLv: 7, maxLv: 11, moveId: MOVES.flying.special.gust },
        ]
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // EXTRAS
  // ─────────────────────────────────────────────────────────────────────

});

// ─────────────────────────────────────────────────────────────────────────────
// JOHTO_ROUTES — orden de la aventura
//
// El campo 'area' debe coincidir con una clave de ROUTE_DATA.
//
// Campo opcional 'condition': función (GameState) => boolean.
// Si la condición devuelve false, la ruta se omite automáticamente
// y el juego pasa a la siguiente. El índice sigue avanzando para
// no romper las partidas guardadas.
// ─────────────────────────────────────────────────────────────────────────────

// Condiciones reutilizables — uso: condition: JOHTO_COND.hasBadge('zephyr-badge')
const JOHTO_COND = {
  hasBadge: (id) => (state) => state.badges.includes(id),
  hasBadges: (ids) => (state) => ids.every(id => state.badges.includes(id)),
};

var JOHTO_ROUTES = [
  { name: 'Ruta 29', area: 'ruta-29' },
  { name: 'Ruta 29', area: 'ruta-29-info-espera', condition: JOHTO_COND.hasBadges(['zephyr-badge', 'hive-badge']) },
  { name: 'Ruta 46', area: 'ruta-46' },
  { name: 'Ciudad Cerezo', area: 'ciudad-cerezo' },
  { name: 'Ciudad Cerezo', area: 'ciudad-cerezo-info' },
  { name: 'Pueblo Primavera', area: 'pueblo-primavera' },
  { name: 'Ruta 30', area: 'ruta-30' },
  { name: 'Ciudad Malva', area: 'ciudad-malva-info' },
  { name: 'Gimnasio Ciudad Malva', area: 'ciudad-malva-gym' },


  // Ejemplo — ruta solo disponible tras conseguir la Medalla Ascua:
  // { name: 'Ruta 31', area: 'ruta-31', condition: JOHTO_COND.hasBadge('zephyr-badge') },

  // TODO: continuar con el resto de Johto
  //   Pueblo Nogal, Ruta 30/31, Ciudad Dorada, Ruta 33...
  //   Ciudad Incienso, Ciudad Nogal, Ciudad Olivina, Pueblo Caoba,
  //   Ciudad Amatista → Liga Johto
];

// ── Helpers específicos de Kanto ───────────────────────────────────────────

function ObtenerSegundoInicial(playerPokemon) {
  if (playerPokemon === POKEMON.chikorita) return [POKEMON.cyndaquil, POKEMON.totodile];
  if (playerPokemon === POKEMON.totodile) return [POKEMON.chikorita, POKEMON.cyndaquil];
  if (playerPokemon === POKEMON.cyndaquil) return [POKEMON.chikorita, POKEMON.totodile];
  return [POKEMON.togepi, POKEMON.eevee];
}

function johtoPickRival(playerPokemon) {
  if (playerPokemon === POKEMON.chikorita) return POKEMON.cyndaquil;
  if (playerPokemon === POKEMON.totodile) return POKEMON.chikorita;
  if (playerPokemon === POKEMON.cyndaquil) return POKEMON.totodile;
  return POKEMON.eevee;
}

function johtoPickRivalSecond(playerPokemon) {
  if (playerPokemon === POKEMON.chikorita) return POKEMON.quilava;
  if (playerPokemon === POKEMON.totodile) return POKEMON.bayleef;
  if (playerPokemon === POKEMON.cyndaquil) return POKEMON.croconaw;
  return POKEMON.eevee;
}

function johtoPickRivalThird(playerPokemon) {
  if (playerPokemon === POKEMON.chikorita) return POKEMON.typhlosion;
  if (playerPokemon === POKEMON.totodile) return POKEMON.meganium;
  if (playerPokemon === POKEMON.cyndaquil) return POKEMON.feraligatr;
  return POKEMON.eevee;
}

