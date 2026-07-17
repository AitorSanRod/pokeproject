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
var JOHTO_ENABLED = true;

// Condiciones reutilizables — uso: condition: JOHTO_COND.hasBadge('zephyr-badge')
const JOHTO_ALL_BADGES = [
  'zephyr-badge', 'hive-badge', 'plain-badge', 'fog-badge',
  'storm-badge', 'mineral-badge', 'glacier-badge', 'rising-badge',
];

const JOHTO_COND = {
  // Comprueba si algún pokemon de la pokédex tiene la medalla (no la partida actual).
  hasBadge: (id) => () => Object.values(Storage.getAllBadges()).some(list => list.includes(id)),
  hasBadges: (ids) => () => Object.values(Storage.getAllBadges()).some(list => ids.every(b => list.includes(b))),
  hasAllBadges: () => () => Object.values(Storage.getAllBadges()).some(list => JOHTO_ALL_BADGES.every(b => list.includes(b))),
};

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
      condition: JOHTO_COND.hasBadges(['zephyr-badge', 'hive-badge']),
    },
  },

  'ruta-46': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.houndour, POKEMON.hoothoot],
    wild: [
      { name: POKEMON.jigglypuff, rate: 25, minLv: 4, maxLv: 6, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.geodude, rate: 25, minLv: 4, maxLv: 6, moveId: MOVES.rock.physical.rock_throw },
      { name: POKEMON.phanpy, rate: 25, minLv: 4, maxLv: 6, moveId: MOVES.ground.physical.bulldoze },
      { name: POKEMON.houndour, rate: 25, minLv: 4, maxLv: 6, moveId: [MOVES.fire.physical.fire_fang, MOVES.dark.physical.bite] },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
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
      const [primerInicial, segundoInicial] = johtoObtenerSegundoInicial(GameState.starterName ?? POKEMON.chikorita);
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
          { name: POKEMON.pidgey, minLv: 12, maxLv: 14, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.Ornitologo.name, img: ENTRENADORES.Ornitologo.img, rate: 33, pokemon: [
          { name: POKEMON.spearow, minLv: 12, maxLv: 14, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.Ornitologo.name, img: ENTRENADORES.Ornitologo.img, rate: 34, pokemon: [
          { name: POKEMON.pidgey, minLv: 12, maxLv: 14, moveId: MOVES.flying.physical.peck },
          { name: POKEMON.pidgey, minLv: 12, maxLv: 14, moveId: MOVES.flying.physical.peck },
        ]
      },
    ],
    gym: {
      leader: [
        { name: POKEMON.pidgey, level: 16, moveId: MOVES.flying.physical.peck },
        {
          name: POKEMON.pidgeotto,
          level: 18,
          moveId: [MOVES.flying.physical.wing_attack, MOVES.normal.physical.extreme_speed],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // PUEBLO AZALEA — Gimnasio de Antón (Bicho)
  // ─────────────────────────────────────────────────────────────────────

  'ruta-32': { //Ruta 32
    bg: BG.JOTHO.ruta32,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.wooper, POKEMON.qwilfish],
    wild: [
      { name: POKEMON.mareep, rate: 15, minLv: 12, maxLv: 14, moveId: [MOVES.electric.special.thunderbolt, MOVES.normal.physical.tackle] },
      { name: POKEMON.hoppip, rate: 15, minLv: 12, maxLv: 14, moveId: [MOVES.grass.special.absorb, MOVES.fairy.special.disarming_voice] },
      { name: POKEMON.bellsprout, rate: 15, minLv: 12, maxLv: 14, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
      { name: POKEMON.ekans, rate: 15, minLv: 12, maxLv: 14, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.gastly, rate: 15, minLv: 12, maxLv: 14, moveId: [MOVES.poison.special.poison_powder, MOVES.ghost.special.hex] },
      { name: POKEMON.wooper, rate: 15, minLv: 12, maxLv: 14, moveId: [MOVES.water.special.water_gun, MOVES.ground.special.mud_shot] },
      { name: POKEMON.tentacool, rate: 10, minLv: 12, maxLv: 14, moveId: [MOVES.water.physical.waterfall, MOVES.poison.physical.poison_sting] },
    ],
    trainer: [
      {
        name: ENTRENADORES.Ornitologo.name, img: ENTRENADORES.Ornitologo.img, rate: 20, pokemon: [
          { name: POKEMON.pidgey, minLv: 12, maxLv: 15, moveId: [MOVES.flying.physical.peck, MOVES.normal.physical.tackle] },
          { name: POKEMON.pidgey, minLv: 12, maxLv: 15, moveId: [MOVES.flying.physical.peck, MOVES.normal.physical.tackle] },
          { name: POKEMON.spearow, minLv: 12, maxLv: 15, moveId: [MOVES.flying.physical.peck, MOVES.normal.physical.tackle] },
        ]
      },
      {
        name: ENTRENADORES.Nadador.name, img: ENTRENADORES.Nadador.img, rate: 25, pokemon: [
          { name: POKEMON.poliwag, minLv: 12, maxLv: 17, moveId: MOVES.water.special.water_gun },
          { name: POKEMON.politoed, minLv: 12, maxLv: 17, moveId: MOVES.water.special.scald },
        ]
      },
      {
        name: ENTRENADORES.ChicaGuay.name, img: ENTRENADORES.ChicaGuay.img, rate: 25, pokemon: [
          { name: POKEMON.nidoran_f, minLv: 12, maxLv: 18, moveId: MOVES.poison.physical.poison_sting },
        ]
      },
      {
        name: ENTRENADORES.Dominguera.name, img: ENTRENADORES.Dominguera.img, rate: 30, pokemon: [
          { name: POKEMON.rattata, minLv: 12, maxLv: 17, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.zubat, minLv: 12, maxLv: 17, moveId: MOVES.poison.physical.poison_sting },
        ]
      },
    ],
  },

  'ruta-32-info-espera': { //Opcional ruta 32 noche
    type: 'information',
    bg: BG.JOTHO.ruta32,
    title: 'Esperar...',
    description: '¿Quieres esperar a la noche?<br>Puede que aparezcan otros pokémon',
    optional: {
      btnName: 'Esperar',
      area: 'ruta-32-noche',
      condition: JOHTO_COND.hasBadges(['zephyr-badge', 'hive-badge']),
    },
  },

  //RUINAS ALFA
  'ruinas-alfa': { //Ruinal alfa
    bg: BG.JOTHO.ruinasAlfa,
    combatBg: COMBAT_BG.cueva,
    trainerBg: COMBAT_BG.noche,
    rewardPokemon: [POKEMON.smeargle],
    wild: [
      { name: POKEMON.natu, rate: 30, minLv: 15, maxLv: 19, moveId: [MOVES.psychic.special.confusion, MOVES.flying.special.gust] },
      { name: POKEMON.smeargle, rate: 30, minLv: 15, maxLv: 19, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.wooper, rate: 30, minLv: 15, maxLv: 19, moveId: [MOVES.water.special.water_gun, MOVES.ground.special.mud_shot] },
      { name: POKEMON.unown, rate: 10, minLv: 15, maxLv: 19, moveId: MOVES.psychic.special.confusion },
    ],
    trainer: [
      {
        name: ENTRENADORES.Caballero.name, img: ENTRENADORES.Caballero.img, rate: 70, pokemon: [
          { name: POKEMON.geodude, minLv: 15, maxLv: 20, moveId: [MOVES.ground.physical.bulldoze, MOVES.rock.physical.rock_throw] },
          { name: POKEMON.geodude, minLv: 15, maxLv: 20, moveId: [MOVES.ground.physical.bulldoze, MOVES.rock.physical.rock_throw] },
        ]
      },
      {
        name: ENTRENADORES.Caballero.name, img: ENTRENADORES.Caballero.img, rate: 30, pokemon: [
          { name: POKEMON.girafarig, minLv: 17, maxLv: 21, moveId: [MOVES.normal.special.swift, MOVES.psychic.special.confusion] },
        ]
      },
    ],
  },

  'pueblo-azalea-gym': {
    bg: BG.JOTHO.puebloAzalea,
    combatBg: COMBAT_BG.interior,
    trainerBg: COMBAT_BG.interior,
    gymLeader: 'Anton',
    gymType: 'bug',
    badgeId: 'hive-badge',
    gymLeaderImg: TRAINER_IMG.anton,
    welcome: { title: 'Pueblo Azalea', subtitle: 'Gimnasio de Tipo Bicho', img: BG.JOTHO.puebloAzalea },
    wild: [],
    trainer: [
      {
        name: ENTRENADORES.ChicoGuay.name, img: ENTRENADORES.ChicoGuay.img, rate: 50, pokemon: [
          { name: POKEMON.rattata, minLv: 16, maxLv: 18, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.butterfree, minLv: 17, maxLv: 19, moveId: [MOVES.bug.special.bug_buzz, MOVES.psychic.special.confusion] },
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 50, pokemon: [
          { name: POKEMON.kakuna, level: 19, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.beedrill, minLv: 17, maxLv: 19, moveId: MOVES.bug.physical.megahorn },
        ]
      },
    ],
    gym: {
      leader: [
        { name: POKEMON.metapod, level: 21, moveId: MOVES.bug.physical.bug_bite, overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
        { name: POKEMON.kakuna, level: 21, moveId: MOVES.bug.physical.bug_bite, overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
        {
          name: POKEMON.scyther, level: 23,
          heldItem: ITEM.eviolite,
          moveId: [MOVES.bug.physical.x_scissor, MOVES.normal.physical.extreme_speed],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CIUDAD TRIGAL — Gimnasio de Blanca (Normal)
  // ─────────────────────────────────────────────────────────────────────

  'camino-ciudad-trigal-info': {
    type: 'information',
    bg: BG.JOTHO.puebloAzalea,
    title: 'Rival Plata',
    description: 'Te han cortado el paso.<br>Gana el combate para continuar',
  },

  'camino-ciudad-trigal': {
    bg: BG.JOTHO.ciudadTrigal,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [],
    wild: [],
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Plata.name, img: ENTRENADORES.Plata.img, pokemon: [
        { name: POKEMON.gastly, level: 23, moveId: [MOVES.poison.special.sludge_bomb, MOVES.ghost.special.shadow_ball], overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
        { name: POKEMON.zubat, level: 22, moveId: [MOVES.bug.physical.bug_bite, MOVES.flying.physical.wing_attack], overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
        { name: 'RIVAL_STARTER_2', heldItem: ITEM.assault_vest, minLv: 23, maxLv: 25, overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'encinar': {
    bg: BG.JOTHO.encinar,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.noche,
    rewardPokemon: [],
    wild: [
      { name: POKEMON.drowzee, rate: 25, minLv: 22, maxLv: 27, moveId: MOVES.psychic.special.confusion },
      { name: POKEMON.snubbull, rate: 25, minLv: 22, maxLv: 27, moveId: MOVES.fairy.physical.play_rough },
      { name: POKEMON.abra, rate: 25, minLv: 22, maxLv: 27, moveId: MOVES.psychic.special.teleport },
      { name: POKEMON.magikarp, rate: 25, minLv: 22, maxLv: 27, moveId: MOVES.water.special.scald },
    ],
    trainer: [
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 100, pokemon: [
          { name: POKEMON.butterfree, minLv: 22, maxLv: 26, moveId: MOVES.bug.special.infestation },
          { name: POKEMON.ariados, minLv: 22, maxLv: 26, moveId: MOVES.bug.physical.x_scissor },
        ]
      }
    ],
  },

  'ciudad-trigal-gym': {
    bg: BG.JOTHO.ciudadTrigal,
    combatBg: COMBAT_BG.interior,
    trainerBg: COMBAT_BG.interior,
    gymLeader: 'Blanca',
    gymType: 'normal',
    badgeId: 'plain-badge',
    gymLeaderImg: TRAINER_IMG.blanca,
    welcome: { title: 'Ciudad Trigal', subtitle: 'Gimnasio de Tipo Normal', img: BG.JOTHO.ciudadTrigal },
    wild: [],
    trainer: [
      {
        name: ENTRENADORES.Chica.name, img: ENTRENADORES.Chica.img, rate: 100, pokemon: [
          { name: POKEMON.teddiursa, minLv: 22, maxLv: 24, moveId: MOVES.normal.physical.hyper_fang, overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
          { name: POKEMON.smeargle, minLv: 22, maxLv: 24, moveId: MOVES.normal.physical.tackle, overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } }, },
        ]
      }
    ],
    gym: {
      leader: [
        {
          name: POKEMON.clefairy, level: 26,
          heldItem: ITEM.eviolite,
          moveId: MOVES.fairy.special.disarming_voice,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'cloud-nine' },
        },
        {
          name: POKEMON.miltank, level: 30,
          heldItem: ITEM.lifeorb,
          moveId: [MOVES.normal.physical.hyper_fang, MOVES.normal.special.hyper_voice, MOVES.normal.special.milk_drink],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'rough-skin' },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Arbol extraño - ruta 36
  // ─────────────────────────────────────────────────────────────────────

  'ruta-36-arbol': {
    bg: BG.JOTHO.ruta36,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [],
    wild: [
      { name: POKEMON.sudowoodo, rate: 100, minLv: 30, maxLv: 34, moveId: MOVES.rock.physical.rock_slide },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CIUDAD IRIS — Gimnasio de Morti (Fantasma)
  // ─────────────────────────────────────────────────────────────────────

  'ruta-36': {
    bg: BG.JOTHO.ruta36,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [],
    wild: [
      { name: POKEMON.growlithe, rate: 20, minLv: 31, maxLv: 36, moveId: MOVES.fire.physical.flame_wheel },
      { name: POKEMON.stantler, rate: 10, minLv: 31, maxLv: 36, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.ledyba, rate: 10, minLv: 31, maxLv: 36, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.vulpix, rate: 10, minLv: 31, maxLv: 36, moveId: MOVES.fire.special.flamethrower },
      { name: POKEMON.nidoran_f, rate: 20, minLv: 31, maxLv: 36, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_m, rate: 20, minLv: 31, maxLv: 36, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.pichu, rate: 10, minLv: 31, maxLv: 36, moveId: MOVES.electric.special.thunderbolt },
    ],
    trainer: [
      {
        name: ENTRENADORES.Medium.name, img: ENTRENADORES.Medium.img, rate: 40, pokemon: [
          { name: POKEMON.abra, level: 32, moveId: MOVES.psychic.special.psychic },
          { name: POKEMON.abra, level: 32, moveId: MOVES.psychic.special.psychic },
          { name: POKEMON.kadabra, level: 34, moveId: MOVES.psychic.special.psychic },
        ]
      },
      {
        name: ENTRENADORES.Chica.name, img: ENTRENADORES.Chica.img, rate: 40, pokemon: [
          { name: POKEMON.tangela, level: 34, moveId: MOVES.grass.physical.vine_whip },
        ]
      },
      {
        name: ENTRENADORES.Chica.name, img: ENTRENADORES.Chica.img, rate: 20, pokemon: [
          { name: POKEMON.xatu, level: 32, moveId: [MOVES.flying.special.gust, MOVES.psychic.special.psychic] },
          { name: POKEMON.tangela, level: 32, moveId: MOVES.grass.physical.vine_whip },
          { name: POKEMON.quagsire, level: 34, moveId: MOVES.ground.special.earth_power },
          { name: POKEMON.yanma, level: 35, moveId: MOVES.bug.physical.x_scissor },
        ]
      },
    ],
    pathLength: 5
  },

  'torre-quemada': {
    bg: BG.JOTHO.torreQuemada,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.teddiursa],
    wild: [],
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Plata.name, img: ENTRENADORES.Plata.img, pokemon: [
        {
          name: POKEMON.haunter, level: 30,
          heldItem: ITEM.eviolite,
          moveId: MOVES.ghost.special.shadow_ball,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'levitate' },
        },
        {
          name: POKEMON.zubat, level: 32,
          moveId: [MOVES.poison.physical.poison_jab, MOVES.flying.physical.wing_attack],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: 'RIVAL_STARTER_2',
          heldItem: ITEM.shell_bell,
          level: 34,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.magnemite,
          heldItem: ITEM.choice_scarf,
          level: 32,
          moveId: MOVES.electric.special.thunderbolt,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'levitate' },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'ciudad-iris': {
    bg: BG.JOTHO.ciudadIris,
    combatBg: COMBAT_BG.interior,
    trainerBg: COMBAT_BG.interior,
    gymLeader: 'Morti',
    gymType: 'ghost',
    badgeId: 'fog-badge',
    gymLeaderImg: ENTRENADORES.Morti.img,
    welcome: { title: 'Ciudad Iris', subtitle: 'Gimnasio de Tipo Fantasma', img: BG.JOTHO.ciudadIris },
    wild: [],
    trainer: [
      {
        name: ENTRENADORES.Medium.name, img: ENTRENADORES.Medium.img, rate: 20, pokemon: [
          { name: POKEMON.haunter, level: 33, moveId: MOVES.ghost.special.astral_barrage },
          { name: POKEMON.haunter, level: 35, moveId: [MOVES.ghost.special.shadow_ball, MOVES.dark.special.dark_pulse] },
        ]
      },
      {
        name: ENTRENADORES.Medium.name, img: ENTRENADORES.Medium.img, rate: 20, pokemon: [
          { name: POKEMON.gastly, level: 32, moveId: MOVES.ghost.special.shadow_ball },
          { name: POKEMON.gastly, level: 32, moveId: MOVES.fire.special.flamethrower },
          { name: POKEMON.gastly, level: 32, moveId: MOVES.dark.special.dark_pulse },
          { name: POKEMON.gastly, level: 32, moveId: MOVES.poison.special.sludge_bomb },
        ]
      },
      {
        name: ENTRENADORES.Medium.name, img: ENTRENADORES.Medium.img, rate: 20, pokemon: [
          { name: POKEMON.haunter, level: 35, moveId: [MOVES.ghost.special.shadow_ball, MOVES.dark.special.dark_pulse], ability: 'levitate' },
        ]
      },
      {
        name: ENTRENADORES.Medium.name, img: ENTRENADORES.Medium.img, rate: 20, pokemon: [
          { name: POKEMON.gastly, level: 34, moveId: MOVES.dark.special.dark_pulse },
          { name: POKEMON.haunter, level: 35, moveId: [MOVES.ghost.special.shadow_ball, MOVES.dark.special.dark_pulse] },
          { name: POKEMON.gastly, level: 34, moveId: MOVES.poison.special.sludge_bomb },
        ]
      },
      {
        name: ENTRENADORES.Medium.name, img: ENTRENADORES.Medium.img, rate: 20, pokemon: [
          { name: POKEMON.misdreavus, level: 34, moveId: MOVES.dark.special.dark_pulse },
          { name: POKEMON.misdreavus, level: 35, moveId: [MOVES.ghost.special.shadow_ball, MOVES.dark.special.dark_pulse], ability: 'levitate' },
        ]
      },
    ],
    gym: {
      leader: [
        {
          name: POKEMON.gastly,
          level: 37,
          heldItem: ITEM.focus_sash,
          moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'cursed-body' },
        },
        {
          name: POKEMON.gastly,
          level: 37,
          heldItem: ITEM.assault_vest,
          moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'levitate' },
        },
        {
          name: POKEMON.haunter,
          level: 38,
          heldItem: ITEM.eviolite,
          moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'cursed-body' },
        },
        {
          name: POKEMON.gengar,
          level: 40,
          heldItem: ITEM.choice_specs,
          moveId: [MOVES.ghost.special.shadow_ball, MOVES.dark.special.fiery_wrath, MOVES.poison.special.sludge_wave],
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 }, ability: 'levitate' },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CIUDAD OLIVO — Gimnasio de Yasmina (Acero)
  // ─────────────────────────────────────────────────────────────────────

  //Ruta 38
  //Ruta 39
  //Faro ciudad olivo (Enfrentamiento contra Ampharos importante)
  //Gimnasio

  // ─────────────────────────────────────────────────────────────────────
  // OPCIONALES
  // ─────────────────────────────────────────────────────────────────────

  'ruta-29-noche': {
    bg: BG.JOTHO.ruta29,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    title: 'Ruta 29 (Noche)',
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
    combatBg: COMBAT_BG.interior,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.sentret, POKEMON.hoothoot],
    title: 'Torre Bellsprout',
    wild: [
      { name: POKEMON.bellsprout, rate: 40, minLv: 6, maxLv: 9, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
      { name: POKEMON.rattata, rate: 40, minLv: 6, maxLv: 9, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.gastly, rate: 20, minLv: 6, maxLv: 9, moveId: MOVES.ghost.special.hex },
    ],
    trainer: [
      {
        name: ENTRENADORES.Pensador.name, img: ENTRENADORES.Pensador.img, rate: 33, pokemon: [
          { name: POKEMON.bellsprout, minLv: 7, maxLv: 11, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
        ]
      },
      {
        name: ENTRENADORES.Pensador.name, img: ENTRENADORES.Pensador.img, rate: 33, pokemon: [
          { name: POKEMON.bellsprout, minLv: 7, maxLv: 11, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
          { name: POKEMON.hoothoot, minLv: 7, maxLv: 11, moveId: MOVES.flying.special.gust },
        ]
      },
      {
        name: ENTRENADORES.Pensador.name, img: ENTRENADORES.Pensador.img, rate: 34, pokemon: [
          { name: POKEMON.hoothoot, minLv: 7, maxLv: 11, moveId: MOVES.flying.special.gust },
        ]
      },
    ],
  },

  'ruta-32-noche': {
    bg: BG.JOTHO.ruta32,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.qwilfish],
    title: 'Ruta 32 (Noche)',
    wild: [
      { name: POKEMON.mareep, rate: 25, minLv: 15, maxLv: 18, moveId: [MOVES.electric.special.thunderbolt, MOVES.normal.physical.tackle] },
      { name: POKEMON.hoppip, rate: 25, minLv: 15, maxLv: 18, moveId: [MOVES.grass.special.absorb, MOVES.fairy.special.disarming_voice] },
      { name: POKEMON.bellsprout, rate: 25, minLv: 15, maxLv: 18, moveId: [MOVES.grass.special.absorb, MOVES.poison.special.poison_powder] },
      { name: POKEMON.qwilfish, rate: 25, minLv: 15, maxLv: 18, moveId: MOVES.poison.physical.poison_sting },],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
    ],
  },

  'torre-quemada-noche': {
    bg: BG.JOTHO.torreQuemada,
    combatBg: COMBAT_BG.hierbaAlta,
    trainerBg: COMBAT_BG.default,
    rewardPokemon: [],
    wild: [
      { name: POKEMON.suicune, rate: 33, minLv: 60, maxLv: 65, moveId: [MOVES.ice.special.blizzard, MOVES.water.special.scald] },
      { name: POKEMON.raikou, rate: 33, minLv: 60, maxLv: 65, moveId: [MOVES.electric.special.thunder, MOVES.electric.physical.wild_charge] },
      { name: POKEMON.entei, rate: 34, minLv: 60, maxLv: 65, moveId: [MOVES.fire.special.fire_blast, MOVES.fire.physical.flare_blitz] },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // EXTRAS
  // ─────────────────────────────────────────────────────────────────────

  'espacio-raro-johto': {
    bg: BG.espacioRaro,
    combatBg: COMBAT_BG.espacioRaro,
    rewardPokemon: [POKEMON.celebi],
    wild: [],
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Mewtwo.name, img: ENTRENADORES.Mewtwo.img, pokemon: [
        {
          name: POKEMON.mewtwo, minLv: 55, maxLv: 65, moveId: [MOVES.psychic.special.trick, MOVES.fairy.special.moonblast, MOVES.grass.special.giga_drain],
          heldItem: ITEM.choice_specs, img: POKEMON_SPRITE.armoredMewtwo,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        }
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },
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

var JOHTO_ROUTES = [
  { name: 'Ruta 29', area: 'ruta-29' },
  { name: 'Ruta 29 (Descanso)', area: 'ruta-29-info-espera' },
  { name: 'Ruta 46', area: 'ruta-46' },
  { name: 'Ciudad Cerezo', area: 'ciudad-cerezo' },
  { name: 'Ciudad Cerezo', area: 'ciudad-cerezo-info' },
  { name: 'Pueblo Primavera', area: 'pueblo-primavera' },
  { name: 'Ruta 30', area: 'ruta-30' },
  { name: 'Ciudad Malva', area: 'ciudad-malva-info' },
  { name: 'Gimnasio Ciudad Malva', area: 'ciudad-malva-gym' },
  { name: 'Ruta 32', area: 'ruta-32' },
  { name: 'Ruta 32', area: 'ruta-32-info-espera' },
  { name: 'Ruinas Alfa', area: 'ruinas-alfa' },
  { name: 'Pueblo Azalea', area: 'pueblo-azalea-gym' },
  { name: 'Camino a Ciudad Trigal', area: 'camino-ciudad-trigal-info' },
  { name: 'Camino a Ciudad Trigal (Combate)', area: 'camino-ciudad-trigal' },
  { name: 'Encinar', area: 'encinar' },
  { name: 'Ciudad Trigal', area: 'ciudad-trigal-gym' },
  { name: 'Árbol Extraño', area: 'ruta-36-arbol' },
  { name: 'Ruta 36', area: 'ruta-36' },
  { name: 'Torre Quemada', area: 'torre-quemada' },
  { name: 'Torre Quemada', area: 'torre-quemada-noche', condition: JOHTO_COND.hasAllBadges() },
  { name: 'Ciudad Iris', area: 'ciudad-iris' },


  //Hasta aquí todo esta funcionando.


  // Ejemplo — ruta solo disponible tras conseguir la Medalla Ascua:
  // { name: 'Ruta 31', area: 'ruta-31', condition: JOHTO_COND.hasBadge('zephyr-badge') },

  // TODO: continuar con el resto de Johto
  //   Pueblo Nogal, Ruta 30/31, Ciudad Dorada, Ruta 33...
  //   Ciudad Incienso, Ciudad Nogal, Ciudad Olivina, Pueblo Caoba,
  //   Ciudad Amatista → Liga Johto

  { name: '???', area: 'espacio-raro-johto' }
];

// ── Helpers específicos de Kanto ───────────────────────────────────────────

function johtoObtenerSegundoInicial(playerPokemon) {
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

