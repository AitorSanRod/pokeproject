// ─────────────────────────────────────────────────────────────────────────────
// RUTAS DE KANTO
//
// Requiere routes-constants.js cargado antes que este archivo.
// Globals disponibles: MOVES, PATH_TYPE, SHINY_RATE, pickWildEncounter,
//                      pickTrainer, rollLevel, generatePaths
//
// ═══════════════════════════════════════════════════════════════════════════
// REFERENCIAS RÁPIDAS
// ═══════════════════════════════════════════════════════════════════════════
//
//   POKEMON.rattata                          → id de pokemon ('rattata')
//   MOVES.normal.physical.tackle             → id de movimiento ('tackle')
//   MOVES.fire.special.flamethrower          → id de movimiento ('flamethrower')
//   ITEM.leftovers                           → id de objeto ('leftovers')
//   PATH_TYPE.Trainer / Wild / Heal / Special / Lider
//   ENTRENADORES.Campista.name / .img        → nombre y sprite del entrenador
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE ROUTE_DATA
// ═══════════════════════════════════════════════════════════════════════════
//
// Cada clave es el area id que referencia KANTO_ROUTES.
// Existen dos tipos de ruta: combate e información.
//
// ── RUTA DE COMBATE ────────────────────────────────────────────────────────
//
//   bg         (requerido) : imagen de fondo de la ruta
//   combatBg   (requerido) : imagen de fondo del combate
//   wild       (requerido) : array de entradas de pokemon salvaje (ver abajo)
//   trainer    (requerido) : array de pools de entrenador (ver abajo)
//
//   paths      (opcional)  : array de caminos hardcodeados. Si se omite,
//                            generatePaths() genera 3 combinaciones aleatorias
//                            usando pathLength como longitud de cada camino.
//   pathLength (opcional)  : longitud de paths auto-generados. Por defecto 3.
//
//   specialTrainer (opcional) : entrenador único que aparece en casillas
//                               PATH_TYPE.Special. No tiene rate (siempre
//                               se muestra). Ver estructura de entrenador abajo.
//
//   rewardPokemon (opcional) : array de POKEMON.xxx disponibles como
//                              recompensa de fin de ruta (opción pokemon).
//   rewardExtras  (opcional) : array de ITEM.xxx disponibles como recompensa
//                              adicional junto a las 3 opciones base.
//
//   welcome    (opcional)  : { title, subtitle, img } — pantalla de bienvenida
//                            que aparece al llegar a una ciudad/gimnasio.
//   gymLeader  (opcional)  : nombre del líder de gimnasio (string).
//   gymType    (opcional)  : tipo del gimnasio (string, p.ej. 'rock').
//   badgeId    (opcional)  : id de medalla definida en kanto-badges.js.
//   gymLeaderImg (opcional): sprite del líder de gimnasio.
//   gym        (opcional)  : { leader: [...] } — array de pokemon del líder.
//                            Aparece en casillas PATH_TYPE.Lider.
//
// ── RUTA DE INFORMACIÓN ────────────────────────────────────────────────────
//
//   type        : 'information'  (requerido para activar este modo)
//   bg          (requerido) : imagen de fondo
//   title       (requerido) : título mostrado en la pantalla
//   description (opcional)  : HTML mostrado bajo el título
//   optional    (opcional)  : { btnName, area } — añade un botón secundario
//                             que redirige a una ruta opcional.
//
// ═══════════════════════════════════════════════════════════════════════════
// ENTRADAS DE POKEMON  (wild · trainer.pokemon · gym.leader · specialTrainer.pokemon)
// ═══════════════════════════════════════════════════════════════════════════
//
//   name     (requerido) : POKEMON.xxx  — id del pokemon
//   minLv    (requerido) : nivel mínimo (excluir si se usa level)
//   maxLv    (requerido) : nivel máximo (excluir si se usa level)
//   level    (requerido) : nivel fijo — reemplaza minLv/maxLv (gym leaders)
//   rate     (requerido en wild) : peso de aparición. La suma de todos los
//                                  rate de la tabla no tiene que ser 100,
//                                  el sistema los normaliza automáticamente.
//
//   moveId   (opcional) : MOVES.tipo.clase.nombre — movimiento exclusivo que
//                         el pokemon usará en combate automático. Puede ser
//                         un array de dos ids para alternar entre ellos.
//                         Si se omite, el pokemon usa su movimiento por defecto.
//   heldItem (opcional) : ITEM.xxx — objeto equipado al pokemon.
//   shiny    (opcional) : true — fuerza la aparición shiny (ignora SHINY_RATE).
//   img      (opcional) : ruta a sprite personalizado (sobreescribe el sprite
//                         por defecto de la PokeAPI).
//   overrides (opcional): personaliza IVs y/o EVs del pokemon generado.
//                         Solo se aplican las stats que se indiquen.
//                         { ivs: { hp, atk, def, spa, spd, spe },
//                           evs: { hp, atk, def, spa, spd, spe } }
//
// ── Marcadores especiales en name ──────────────────────────────────────────
//
//   'RIVAL_STARTER'   → sustituido en runtime por el contra-tipo del starter
//                       del jugador (primera forma).
//   'RIVAL_STARTER_2' → segunda forma del contra-tipo.
//   'RIVAL_STARTER_3' → forma final del contra-tipo.
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE ENTRENADOR  (trainer[] · specialTrainer)
// ═══════════════════════════════════════════════════════════════════════════
//
//   name    (requerido) : nombre mostrado en combate
//   img     (requerido) : ruta al sprite del entrenador
//   rate    (requerido en trainer[]) : peso de selección cuando hay varios
//                                      entrenadores en el pool.
//   pokemon (requerido) : array de entradas de pokemon (ver arriba)
//
// ── PATH_TYPE — tipos de casilla ──────────────────────────────────────────
//
//   PATH_TYPE.Trainer → combate contra entrenador aleatorio de trainer[]
//   PATH_TYPE.Wild    → encuentro con pokemon salvaje de wild[]
//   PATH_TYPE.Special → combate contra specialTrainer (único, siempre igual)
//   PATH_TYPE.Heal    → recuperación automática del equipo
//   PATH_TYPE.Lider   → combate contra el líder de gimnasio (gym.leader)
//
// ─────────────────────────────────────────────────────────────────────────────

// ENTRENADORES definido en routes-assets.js

var ROUTE_DATA = {

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio de Brock (Ciudad Plateada)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-1': {
    bg: BG.ruta1,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.rattata, POKEMON.pidgey],
    wild: [
      { name: POKEMON.rattata, rate: 45, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.pidgey, rate: 45, minLv: 2, maxLv: 3, moveId: MOVES.flying.physical.peck },
    ],
    trainer: [
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 30, pokemon: [
          { name: POKEMON.rattata, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.rattata, minLv: 3, maxLv: 3, moveId: MOVES.normal.physical.tackle },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 40, pokemon: [
          { name: POKEMON.rattata, minLv: 2, maxLv: 2, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.pidgey, minLv: 2, maxLv: 3, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 30, pokemon: [
          { name: POKEMON.rattata, minLv: 2, maxLv: 2, moveId: MOVES.normal.physical.tackle },
        ]
      },
    ]
  },

  'ciudad-verde-info': {
    type: 'information',
    bg: BG.ciudadVerde,
    title: 'Ciudad Verde',
    description: 'Es el momento de volver sí<br>se te ha olvidado algo...',
    optional: {
      btnName: 'Volver a Pueblo Paleta',
      area: 'pueblo-paleta-1',
    },
  },

  'ruta-22': {
    bg: BG.ruta22,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.mankey, POKEMON.nidoran_f, POKEMON.nidoran_m],
    wild: [
      { name: POKEMON.nidoran_m, rate: 30, minLv: 3, maxLv: 5, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_f, rate: 30, minLv: 3, maxLv: 5, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.mankey, rate: 20, minLv: 4, maxLv: 5, moveId: MOVES.fighting.physical.karate_chop },
      { name: POKEMON.goldeen, rate: 20, minLv: 3, maxLv: 4, moveId: MOVES.water.physical.waterfall },
    ],
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Rival.name, img: ENTRENADORES.Rival.img, pokemon: [
        { name: 'RIVAL_STARTER', minLv: 5, maxLv: 8 },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Special }],
    ],
  },

  'ruta-2': {
    bg: BG.ruta2,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.caterpie, POKEMON.weedle, POKEMON.pidgey, POKEMON.rattata],
    wild: [
      { name: POKEMON.rattata, rate: 35, minLv: 3, maxLv: 5, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.pidgey, rate: 30, minLv: 3, maxLv: 5, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.caterpie, rate: 25, minLv: 3, maxLv: 5, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.weedle, rate: 15, minLv: 3, maxLv: 5, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.mr_mime, rate: 5, minLv: 3, maxLv: 5, moveId: MOVES.psychic.special.confusion },
    ],
    trainer: [
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 50, pokemon: [
          { name: POKEMON.pidgey, minLv: 4, maxLv: 5, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 50, pokemon: [
          { name: POKEMON.metapod, minLv: 7, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
    ],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Trainer }],
    ]
  },

  'bosque-verde': {
    bg: BG.bosqueVerde,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.pikachu, POKEMON.jigglypuff, POKEMON.caterpie, POKEMON.weedle],
    wild: [
      { name: POKEMON.caterpie, rate: 30, minLv: 6, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.weedle, rate: 30, minLv: 6, maxLv: 10, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.pidgey, rate: 20, minLv: 7, maxLv: 10, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.pikachu, rate: 15, minLv: 7, maxLv: 11, moveId: MOVES.electric.special.thunder_shock },
      { name: POKEMON.jigglypuff, rate: 5, minLv: 8, maxLv: 12, moveId: MOVES.fairy.special.disarming_voice },
    ],
    trainer: [
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 40, pokemon: [
          { name: POKEMON.caterpie, minLv: 8, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 9, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 20, pokemon: [
          { name: POKEMON.caterpie, minLv: 8, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.weedle, minLv: 8, maxLv: 10, moveId: MOVES.poison.physical.poison_sting },
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 15, pokemon: [
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.x_scissor },
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 20, pokemon: [
          { name: POKEMON.metapod, minLv: 6, maxLv: 12, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.metapod, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.metapod, minLv: 6, maxLv: 12, moveId: MOVES.bug.special.infestation },
          { name: POKEMON.metapod, minLv: 6, maxLv: 12, moveId: MOVES.normal.physical.tackle },
        ]
      },
    ],
    pathLength: 5
  },

  'ciudad-plateada': {
    bg: BG.ciudadPlateada,
    combatBg: COMBAT_BG.default,
    wild: [],
    welcome: {
      title: 'Ciudad Plateada',
      subtitle: 'Gimnasio Pokemon de tipo Roca',
      img: BG.ciudadPlateada,
    },
    gymLeader: 'Brock',
    gymType: 'rock',
    badgeId: 'boulder-badge',
    gymLeaderImg: TRAINER_IMG.brock,
    rewardExtras: [ITEM.leftovers],
    trainer: [
      {
        name: ENTRENADORES.Campista.name, img: ENTRENADORES.Campista.img, rate: 100,
        pokemon: [
          { name: POKEMON.geodude, minLv: 11, maxLv: 12, moveId: MOVES.rock.physical.rock_throw }
        ]
      }
    ],
    gym: {
      leader: [
        {
          name: POKEMON.geodude, level: 12, moveId: MOVES.rock.physical.rock_throw,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.onix, level: 14, moveId: MOVES.rock.physical.rock_throw,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Lider }],
    ],
  },

  'ruta-3': {
    bg: BG.ruta3,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.magikarp],
    wild: [
      { name: POKEMON.pidgey, rate: 20, minLv: 10, maxLv: 14, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.spearow, rate: 20, minLv: 11, maxLv: 15, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.nidoran_m, rate: 20, minLv: 10, maxLv: 14, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_f, rate: 20, minLv: 10, maxLv: 14, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.jigglypuff, rate: 10, minLv: 10, maxLv: 12, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.mankey, rate: 10, minLv: 14, maxLv: 18, moveId: MOVES.fighting.physical.karate_chop },
    ],
    trainer: [
      {
        name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img, rate: 45, pokemon: [
          { name: POKEMON.pidgey, minLv: 12, maxLv: 16, moveId: MOVES.flying.physical.peck },
          { name: POKEMON.pidgey, minLv: 12, maxLv: 16, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 45, pokemon: [
          { name: POKEMON.caterpie, minLv: 12, maxLv: 18, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.metapod, minLv: 12, maxLv: 18, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
      {
        name: ENTRENADORES.Chica.name, img: ENTRENADORES.Chica.img, rate: 10, pokemon: [
          { name: POKEMON.jigglypuff, minLv: 16, maxLv: 20, moveId: MOVES.fairy.special.disarming_voice },
        ]
      },
    ],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Heal }, { type: PATH_TYPE.Trainer }],
    ],
  },

  'mt-moon': {
    bg: BG.mtMoon,
    combatBg: COMBAT_BG.cueva,
    rewardPokemon: [POKEMON.zubat, POKEMON.clefairy, POKEMON.geodude],
    rewardExtras: [ITEM.sitrus_berry],
    wild: [
      { name: POKEMON.zubat, rate: 30, minLv: 10, maxLv: 14, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.zubat, rate: 30, minLv: 11, maxLv: 14, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.geodude, rate: 25, minLv: 11, maxLv: 13, moveId: MOVES.rock.physical.rock_throw },
      { name: POKEMON.paras, rate: 5, minLv: 14, maxLv: 17, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.clefairy, rate: 10, minLv: 16, maxLv: 20, moveId: MOVES.fairy.special.disarming_voice },
    ],
    trainer: [
      {
        name: ENTRENADORES.Montanero.name, img: ENTRENADORES.Montanero.img, rate: 100, pokemon: [
          { name: POKEMON.geodude, minLv: 14, maxLv: 16, moveId: MOVES.rock.physical.rock_throw },
          { name: POKEMON.geodude, minLv: 12, maxLv: 16, moveId: MOVES.rock.physical.rock_throw },
          { name: POKEMON.onix, minLv: 12, maxLv: 17, moveId: MOVES.ground.physical.bulldoze },
        ]
      },
    ]
  },

  'ruta-4': {
    bg: BG.ruta4,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.spearow, POKEMON.pidgey],
    wild: [
      { name: POKEMON.pidgey, rate: 40, minLv: 10, maxLv: 14, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.spearow, rate: 40, minLv: 11, maxLv: 15, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.sandshrew, rate: 20, minLv: 11, maxLv: 15, moveId: MOVES.ground.physical.bulldoze },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio de Misty (Ciudad Celeste)
  // ═══════════════════════════════════════════════════════════════════════

  'ciudad-celeste': {
    bg: BG.ciudadCeleste,
    combatBg: COMBAT_BG.agua,
    wild: [],
    welcome: {
      title: 'Ciudad Celeste',
      subtitle: 'Gimnasio Pokemon de tipo Agua',
      img: BG.ciudadCeleste,
    },
    gymLeader: 'Misty',
    gymType: 'water',
    badgeId: 'cascade-badge',
    gymLeaderImg: TRAINER_IMG.misty,
    rewardExtras: [ITEM.mystic_water],
    trainer: [
      {
        name: ENTRENADORES.Nadador.name, img: ENTRENADORES.Nadador.img, rate: 50, pokemon: [
          { name: POKEMON.horsea, minLv: 18, maxLv: 20, moveId: MOVES.water.special.water_gun },
          { name: POKEMON.shellder, minLv: 18, maxLv: 21, moveId: MOVES.ice.special.ice_beam },
        ]
      },
      {
        name: ENTRENADORES.Dominguera.name, img: ENTRENADORES.Dominguera.img, rate: 50, pokemon: [
          { name: POKEMON.goldeen, minLv: 22, maxLv: 23, moveId: MOVES.water.physical.crabhammer },
        ]
      },
    ],
    gym: {
      leader: [
        {
          name: POKEMON.staryu, level: 20, moveId: MOVES.water.special.surf,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spa: 32 } },
        },
        {
          name: POKEMON.starmie, level: 22, moveId: [MOVES.psychic.special.confusion, MOVES.water.special.scald],
          overrides: {
            evs: { hp: 32, def: 0, spd: 32, spa: 14 },
            ivs: { hp: 31, def: 0, spd: 0, spa: 31 },
          },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  'ruta-24-1': {
    bg: BG.ruta24,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.abra],
    wild: [],
    specialTrainer: {
      name: ENTRENADORES.Rival.name, img: ENTRENADORES.Rival.img, pokemon: [
        { name: POKEMON.abra, minLv: 14, maxLv: 14, moveId: MOVES.psychic.special.teleport },
        { name: POKEMON.pidgeotto, minLv: 16, maxLv: 20, moveId: MOVES.flying.physical.wing_attack },
        { name: 'RIVAL_STARTER_2', minLv: 18, maxLv: 24 },
      ]
    },
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Special }]
    ],
  },

  'ruta-24-2': {
    bg: BG.ruta24,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.oddish, POKEMON.onix, POKEMON.ivysaur, POKEMON.charmeleon, POKEMON.wartortle],
    wild: [
      { name: POKEMON.pidgey, rate: 40, minLv: 10, maxLv: 14, moveId: MOVES.flying.physical.peck },
    ],
    specialTrainer: {
      name: 'Soldado Rocket', img: ENTRENADORES.Rocket.img, pokemon: [
        { name: POKEMON.grimer, minLv: 22, maxLv: 24, moveId: MOVES.poison.special.poison_powder },
        { name: POKEMON.golbat, minLv: 22, maxLv: 24, moveId: MOVES.poison.physical.poison_jab },
        { name: POKEMON.porygon, minLv: 24, maxLv: 26, moveId: MOVES.normal.special.tri_attack, heldItem: ITEM.assault_vest },
      ]
    },
    trainer: [
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 20, pokemon: [
          { name: POKEMON.metapod, minLv: 22, maxLv: 26, moveId: MOVES.bug.physical.bug_bite }
        ]
      },
      {
        name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img, rate: 20, pokemon: [
          { name: POKEMON.metapod, minLv: 20, maxLv: 24, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 20, maxLv: 24, moveId: MOVES.bug.physical.bug_bite }
        ]
      },
      {
        name: `${ENTRENADORES.Dominguera.name}`, img: ENTRENADORES.Dominguera.img, rate: 15, pokemon: [
          { name: POKEMON.oddish, minLv: 20, maxLv: 24, moveId: MOVES.grass.special.absorb },
          { name: POKEMON.butterfree, minLv: 20, maxLv: 25, moveId: MOVES.bug.special.infestation }
        ]
      },
      {
        name: `${ENTRENADORES.Montanero.name}`, img: ENTRENADORES.Montanero.img, rate: 15, pokemon: [
          { name: POKEMON.onix, minLv: 22, maxLv: 26, moveId: MOVES.rock.physical.rock_throw },
          { name: POKEMON.onix, minLv: 22, maxLv: 28, moveId: MOVES.ground.physical.bulldoze }
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name} verde`, img: ENTRENADORES.Campista.img, rate: 10, pokemon: [
          { name: POKEMON.ivysaur, minLv: 22, maxLv: 26, moveId: MOVES.grass.special.magical_leaf }
        ]
      },
      {
        name: `${ENTRENADORES.DomingueroFuego.name} rojo`, img: ENTRENADORES.DomingueroFuego.img, rate: 10, pokemon: [
          { name: POKEMON.charmeleon, minLv: 22, maxLv: 26, moveId: MOVES.fire.special.flamethrower }
        ]
      },
      {
        name: `${ENTRENADORES.DomingueroAgua.name} azul`, img: ENTRENADORES.DomingueroAgua.img, rate: 10, pokemon: [
          { name: POKEMON.wartortle, minLv: 22, maxLv: 26, moveId: MOVES.water.special.surf }
        ]
      },
    ],
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Special }]
    ],
  },

  'info-bill': {
    type: 'information',
    bg: BG.ruta25,
    title: 'Laboratorio de Bill',
    description: `<div style="display: flex; justify-content: center;"><img src="${GIF.bill}"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">Tienes una charla con Bill y vuelves al camino</p>`,
    optional: {
      btnName: 'Visita el jardín de Bill',
      area: 'jardin-bill',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio de Lt. Surge (Ciudad Carmín)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-5': {
    bg: BG.ruta5,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.bellsprout, POKEMON.meowth, POKEMON.poliwag],
    wild: [
      { name: POKEMON.bellsprout, rate: 25, minLv: 18, maxLv: 24, moveId: MOVES.grass.special.absorb },
      { name: POKEMON.meowth, rate: 25, minLv: 18, maxLv: 25, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.poliwag, rate: 15, minLv: 18, maxLv: 25, moveId: MOVES.water.physical.waterfall },
      { name: POKEMON.krabby, rate: 20, minLv: 18, maxLv: 25, moveId: MOVES.water.physical.waterfall },
      { name: POKEMON.growlithe, rate: 10, minLv: 18, maxLv: 22, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.farfetch_d, rate: 5, minLv: 18, maxLv: 22, moveId: MOVES.normal.physical.take_down },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }]
    ],
  },

  'ruta-6': {
    bg: BG.ruta6,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.magikarp, POKEMON.meowth],
    wild: [
      { name: POKEMON.magikarp, rate: 65, minLv: 18, maxLv: 24, moveId: MOVES.water.special.water_gun },
      { name: POKEMON.gyarados, rate: 5, minLv: 18, maxLv: 25, moveId: MOVES.water.physical.crabhammer },
      { name: POKEMON.psyduck, rate: 30, minLv: 18, maxLv: 22, moveId: MOVES.water.special.water_gun },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Campista.name}`, img: ENTRENADORES.Campista.img, rate: 50, pokemon: [
          { name: POKEMON.rattata, minLv: 22, maxLv: 25, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.pikachu, minLv: 24, maxLv: 27, moveId: MOVES.electric.special.thunderbolt }
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name}`, img: ENTRENADORES.Campista.img, rate: 50, pokemon: [
          { name: POKEMON.squirtle, minLv: 22, maxLv: 25, moveId: MOVES.water.special.water_gun },
          { name: POKEMON.butterfree, minLv: 24, maxLv: 27, moveId: MOVES.psychic.special.confusion }
        ]
      },
    ],
  },

  'info-cgoob': {
    type: 'information',
    bg: BG.ssAnne,
    title: 'SS Anne',
    description: `<div style="display: flex; justify-content: center;"><img src="${GIF.rojo}"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">¿Quien es ese tío?</p>`,
  },

  'ss-anne': {
    bg: BG.ssAnne,
    combatBg: COMBAT_BG.electrico,
    rewardPokemon: [POKEMON.magikarp, POKEMON.meowth],
    wild: [],
    specialTrainer: {
      name: `${ENTRENADORES.Pokemaniaco.name} Cgoob`, img: ENTRENADORES.Rojo.img, pokemon: [
        { name: POKEMON.butterfree, minLv: 25, maxLv: 31, moveId: MOVES.bug.special.signal_beam },
        { name: POKEMON.flareon, minLv: 25, maxLv: 29, moveId: MOVES.fire.special.flamethrower },
        { name: POKEMON.gyarados, minLv: 28, maxLv: 32, moveId: [MOVES.water.physical.wave_crash, MOVES.dark.physical.bite], heldItem: ITEM.mystic_water },
      ]
    },
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Special }]
    ],
  },

  'ciudad-carmin': {
    bg: BG.ciudadCarmin,
    combatBg: COMBAT_BG.electrico,
    wild: [],
    welcome: {
      title: 'Ciudad Carmin',
      subtitle: 'Gimnasio Pokemon de tipo Eléctrico',
      img: BG.ciudadCarmin,
    },
    gymLeader: 'Lt. Surge',
    gymType: 'electric',
    badgeId: 'thunder-badge',
    gymLeaderImg: TRAINER_IMG.surge,
    rewardPokemon: [POKEMON.voltorb, POKEMON.pikachu, POKEMON.raichu, POKEMON.porygon],
    rewardExtras: [ITEM.choice_band, ITEM.light_ball],
    trainer: [
      {
        name: ENTRENADORES.Caballero.name, img: ENTRENADORES.Caballero.img, rate: 50, pokemon: [
          { name: POKEMON.pikachu, minLv: 28, maxLv: 30, moveId: MOVES.electric.special.thunder_shock },
          { name: POKEMON.pikachu, minLv: 28, maxLv: 30, moveId: MOVES.electric.special.thunderbolt }
        ]
      },
      {
        name: ENTRENADORES.Mecanico.name, img: ENTRENADORES.Mecanico.img, rate: 50, pokemon: [
          { name: POKEMON.raichu, minLv: 28, maxLv: 30, moveId: MOVES.electric.special.thunder },
        ]
      },
    ],
    gym: {
      leader: [
        { name: POKEMON.pikachu, level: 28, moveId: MOVES.electric.special.thunder_shock, heldItem: ITEM.light_ball },
        { name: POKEMON.voltorb, level: 30, moveId: MOVES.normal.special.hyper_voice },
        { name: POKEMON.raichu, level: 34, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Guarida Rocket
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-9': {
    bg: BG.ruta9,
    combatBg: COMBAT_BG.default,
    rewardPokemon: [POKEMON.rattata, POKEMON.spearow, POKEMON.ekans, POKEMON.sandshrew],
    rewardExtras: [ITEM.miracle_seed],
    wild: [
      { name: POKEMON.rattata, rate: 35, minLv: 22, maxLv: 26, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.spearow, rate: 15, minLv: 22, maxLv: 26, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.spearow, rate: 10, minLv: 22, maxLv: 26, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.ekans, rate: 20, minLv: 22, maxLv: 26, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.sandshrew, rate: 20, minLv: 22, maxLv: 26, moveId: MOVES.ground.physical.stomping_tantrum },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Dominguera.name}`, img: ENTRENADORES.Dominguera.img, rate: 25, pokemon: [
          { name: POKEMON.oddish, minLv: 22, maxLv: 25, moveId: MOVES.grass.special.magical_leaf },
          { name: POKEMON.bellsprout, minLv: 24, maxLv: 27, moveId: MOVES.poison.special.poison_powder },
          { name: POKEMON.oddish, minLv: 22, maxLv: 27, moveId: MOVES.grass.special.magical_leaf },
          { name: POKEMON.bellsprout, minLv: 24, maxLv: 27, moveId: MOVES.poison.special.sludge_bomb }
        ]
      },
      {
        name: `${ENTRENADORES.Montanero.name}`, img: ENTRENADORES.Montanero.img, rate: 25, pokemon: [
          { name: POKEMON.machop, minLv: 22, maxLv: 27, moveId: MOVES.fighting.physical.karate_chop },
          { name: POKEMON.onix, minLv: 24, maxLv: 27, moveId: MOVES.rock.physical.rock_slide },
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name}`, img: ENTRENADORES.Campista.img, rate: 25, pokemon: [
          { name: POKEMON.growlithe, minLv: 22, maxLv: 25, moveId: MOVES.fire.physical.fire_fang },
          { name: POKEMON.charmeleon, minLv: 24, maxLv: 27, moveId: MOVES.fire.special.flamethrower },
        ]
      },
      {
        name: `${ENTRENADORES.Montanero.name}`, img: ENTRENADORES.Montanero.img, rate: 25, pokemon: [
          { name: POKEMON.machop, minLv: 28, maxLv: 37, moveId: MOVES.fighting.physical.brick_break },
        ]
      }
    ],
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Heal }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Trainer }]
    ],
  },

  'ruta-10': {
    bg: BG.ruta10,
    combatBg: COMBAT_BG.default,
    wild: [
      { name: POKEMON.voltorb, rate: 40, minLv: 22, maxLv: 26, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.spearow, rate: 20, minLv: 22, maxLv: 26, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.ekans, rate: 25, minLv: 22, maxLv: 26, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.drowzee, rate: 20, minLv: 22, maxLv: 26, moveId: MOVES.psychic.special.psychic },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Dominguera.name}`, img: ENTRENADORES.Dominguera.img, rate: 35, pokemon: [
          { name: POKEMON.pikachu, minLv: 22, maxLv: 25, moveId: MOVES.electric.special.thunderbolt },
          { name: POKEMON.clefairy, minLv: 24, maxLv: 27, moveId: MOVES.normal.special.hyper_voice },
        ]
      },
      {
        name: `${ENTRENADORES.Montanero.name}`, img: ENTRENADORES.Montanero.img, rate: 35, pokemon: [
          { name: POKEMON.onix, minLv: 24, maxLv: 30, moveId: MOVES.rock.physical.rock_slide },
          { name: POKEMON.graveler, minLv: 24, maxLv: 32, moveId: MOVES.rock.physical.rock_slide },
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name}`, img: ENTRENADORES.Campista.img, rate: 15, pokemon: [
          { name: POKEMON.growlithe, minLv: 22, maxLv: 25, moveId: MOVES.fire.physical.fire_fang },
          { name: POKEMON.charmeleon, minLv: 24, maxLv: 27, moveId: MOVES.fire.special.flamethrower },
        ]
      },
      {
        name: `${ENTRENADORES.Montanero.name}`, img: ENTRENADORES.Montanero.img, rate: 15, pokemon: [
          { name: POKEMON.machop, minLv: 28, maxLv: 37, moveId: MOVES.fighting.physical.brick_break },
        ]
      }
    ]
  },

  'entrada-tunel-roca-info': {
    type: 'information',
    bg: BG.tunelRoca,
    title: 'Entrada del Tunel Roca',
    description: `<div style="display: flex; justify-content: center;"><img src="${GIF.montanero}"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">Un montañero bloquea la entrada al Tunel Roca</p>`,
  },

  'entrada-tunel-roca': {
    bg: BG.tunelRoca,
    combatBg: COMBAT_BG.cueva,
    rewardPokemon: [POKEMON.snorlax],
    wild: [],
    trainer: [],
    specialTrainer: {
      name: 'Montañero Ninja David', img: ENTRENADORES.Montanero.img, pokemon: [
        { name: POKEMON.slowpoke, minLv: 25, maxLv: 35, moveId: MOVES.water.special.surf },
        { name: POKEMON.psyduck, minLv: 22, maxLv: 31, moveId: MOVES.psychic.special.confusion },
        { name: POKEMON.drowzee, minLv: 25, maxLv: 35, moveId: MOVES.psychic.special.psychic },
        {
          name: POKEMON.snorlax, minLv: 25, maxLv: 35, moveId: MOVES.normal.physical.false_swipe, heldItem: ITEM.leftovers,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        { name: POKEMON.voltorb, minLv: 35, maxLv: 40, moveId: MOVES.normal.physical.self_destruct },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'tunel-roca': {
    bg: BG.tunelRoca,
    combatBg: COMBAT_BG.cueva,
    rewardExtras: [ITEM.moon_stone],
    wild: [
      { name: POKEMON.onix, rate: 40, minLv: 24, maxLv: 30, moveId: MOVES.rock.physical.rock_slide },
      { name: POKEMON.geodude, rate: 40, minLv: 24, maxLv: 30, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.machop, rate: 20, minLv: 26, maxLv: 35, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.diglett, rate: 10, minLv: 26, maxLv: 35, moveId: MOVES.ground.physical.bulldoze },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Montanero.name}`, img: ENTRENADORES.Montanero.img, rate: 100, pokemon: [
          { name: POKEMON.bellsprout, minLv: 24, maxLv: 27, moveId: MOVES.poison.special.poison_powder },
          { name: POKEMON.clefairy, minLv: 24, maxLv: 27, moveId: MOVES.normal.special.hyper_voice },
        ]
      }
    ],
  },

  'ciudad-azulona': {
    bg: BG.ciudadAzulona,
    combatBg: COMBAT_BG.default,
    wild: [
      { name: POKEMON.eevee, rate: 5, minLv: 10, maxLv: 30, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.growlithe, rate: 5, minLv: 22, maxLv: 25, moveId: MOVES.fire.physical.fire_fang },
      { name: POKEMON.raticate, rate: 90, minLv: 28, maxLv: 32, moveId: MOVES.normal.physical.hyper_fang },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Cientifico.name}`, img: ENTRENADORES.Cientifico.img, rate: 100, pokemon: [
          { name: POKEMON.voltorb, minLv: 32, maxLv: 35, moveId: MOVES.electric.special.thunder },
          { name: POKEMON.electrode, minLv: 30, maxLv: 36, moveId: MOVES.normal.special.hyper_voice },
        ]
      }
    ]
  },

  'guarida-rocket': {
    bg: BG.guaridaRocket,
    combatBg: COMBAT_BG.electrico,
    wild: [
      { name: POKEMON.voltorb, rate: 30, minLv: 30, maxLv: 32, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.electrode, rate: 30, minLv: 31, maxLv: 33, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.lickitung, rate: 15, minLv: 31, maxLv: 33, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.magnemite, rate: 15, minLv: 31, maxLv: 33, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.porygon, rate: 10, minLv: 31, maxLv: 33, moveId: MOVES.normal.special.tri_attack },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.voltorb, minLv: 32, maxLv: 35, moveId: MOVES.electric.special.thunder },
          { name: POKEMON.electrode, minLv: 30, maxLv: 36, moveId: MOVES.normal.special.hyper_voice },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.sandslash, minLv: 32, maxLv: 35, moveId: MOVES.ground.physical.earthquake },
          { name: POKEMON.sandshrew, minLv: 30, maxLv: 36, moveId: MOVES.normal.physical.extreme_speed },
          { name: POKEMON.ekans, minLv: 30, maxLv: 36, moveId: MOVES.poison.physical.gunk_shot },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.grimer, minLv: 32, maxLv: 35, moveId: MOVES.poison.special.sludge_bomb },
          { name: POKEMON.muk, minLv: 30, maxLv: 36, moveId: MOVES.poison.special.sludge_wave },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.grimer, minLv: 32, maxLv: 35, moveId: MOVES.poison.special.sludge_bomb },
          { name: POKEMON.koffing, minLv: 30, maxLv: 36, moveId: MOVES.poison.special.sludge_wave },
          { name: POKEMON.koffing, minLv: 30, maxLv: 36, moveId: MOVES.dark.special.dark_pulse },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.rattata, minLv: 32, maxLv: 35, moveId: MOVES.normal.physical.hyper_fang },
          { name: POKEMON.rattata, minLv: 32, maxLv: 35, moveId: MOVES.fighting.physical.brick_break },
          { name: POKEMON.rattata, minLv: 32, maxLv: 35, moveId: MOVES.normal.physical.extreme_speed },
          { name: POKEMON.rattata, minLv: 32, maxLv: 35, moveId: MOVES.normal.physical.hyper_fang },
        ]
      }
    ],
  },

  'ultima-planta-rocket-info': {
    type: 'information',
    bg: BG.oficinaRocket,
    title: 'Última planta Rocket',
    description: `<div style="display: flex; justify-content: center;"><img src="${ENTRENADORES.Giovanni.gif}"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">¡Prepárate para el combate!</p>`,
  },

  'combate-giovanni': {
    bg: BG.oficinaRocket,
    combatBg: COMBAT_BG.rocket,
    wild: [],
    trainer: [],
    rewardPokemon: [POKEMON.hitmonlee, POKEMON.hitmonchan],
    specialTrainer: {
      name: 'Jefe Giovanni', img: ENTRENADORES.Giovanni.img, pokemon: [
        {
          name: POKEMON.onix, minLv: 32, maxLv: 37, moveId: MOVES.rock.physical.rock_slide,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.rhyhorn, minLv: 32, maxLv: 40, moveId: MOVES.ground.physical.earthquake,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.kangaskhan, minLv: 40, maxLv: 45, moveId: MOVES.normal.physical.extreme_speed,
          heldItem: ITEM.lifeorb,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimnasio Erika (Ciudad Azulona)
  // ═══════════════════════════════════════════════════════════════════════

  'ciudad-azulona-gym': {
    bg: BG.ciudadAzulona,
    combatBg: COMBAT_BG.electrico,
    wild: [],
    welcome: {
      title: 'Gimnasio de Ciudad Azulona',
      subtitle: 'Gimnasio Pokemon de tipo Planta',
      img: BG.ciudadAzulona,
    },
    gymLeader: 'Erika',
    gymType: 'grass',
    badgeId: 'rainbow-badge',
    gymLeaderImg: TRAINER_IMG.erika,
    rewardPokemon: [POKEMON.tangela],
    rewardExtras: [ITEM.miracle_seed],
    trainer: [
      {
        name: ENTRENADORES.ChicaGuay.name, img: ENTRENADORES.ChicaGuay.img, rate: 25, pokemon: [
          { name: POKEMON.exeggcute, minLv: 32, maxLv: 37, moveId: MOVES.psychic.special.psychic },
        ]
      },
      {
        name: ENTRENADORES.ChicoGuay.name, img: ENTRENADORES.ChicoGuay.img, rate: 25, pokemon: [
          { name: POKEMON.bellsprout, minLv: 32, maxLv: 36, moveId: MOVES.grass.special.solar_beam },
          { name: POKEMON.bellsprout, minLv: 32, maxLv: 36, moveId: MOVES.poison.special.sludge_bomb },
        ]
      },
      {
        name: ENTRENADORES.Chica.name, img: ENTRENADORES.Chica.img, rate: 25, pokemon: [
          {
            name: POKEMON.venusaur, minLv: 36, maxLv: 40, moveId: MOVES.grass.special.solar_beam,
            overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
          },
        ]
      },
      {
        name: ENTRENADORES.ChicaGuay.name, img: ENTRENADORES.ChicaGuay.img, rate: 25, pokemon: [
          { name: POKEMON.exeggcute, minLv: 32, maxLv: 37, moveId: MOVES.psychic.special.psychic },
        ]
      },
    ],
    gym: {
      leader: [
        {
          name: POKEMON.victreebel, level: 41, moveId: MOVES.poison.special.sludge_wave,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.exeggutor, level: 39, moveId: MOVES.psychic.special.psychic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.tangela, level: 38, moveId: MOVES.grass.physical.wood_hammer,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.vileplume, level: 42, moveId: MOVES.grass.special.giga_drain,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Torre Pokémon
  // ═══════════════════════════════════════════════════════════════════════

  'torre-pokemon': {
    bg: BG.torrePokemon,
    combatBg: COMBAT_BG.interior,
    pathLength: 4,
    wild: [
      { name: POKEMON.gastly, rate: 30, minLv: 35, maxLv: 42, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
      { name: POKEMON.gastly, rate: 30, minLv: 35, maxLv: 42, moveId: [MOVES.ghost.special.hex, MOVES.poison.special.sludge_bomb] },
      { name: POKEMON.haunter, rate: 30, minLv: 35, maxLv: 42, moveId: [MOVES.ghost.special.shadow_ball, MOVES.dark.special.dark_pulse] },
      { name: POKEMON.cubone, rate: 10, minLv: 35, maxLv: 42, moveId: MOVES.ground.physical.earthquake },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Medium.name}`, img: ENTRENADORES.Medium.img, rate: 33, pokemon: [
          { name: POKEMON.gastly, level: 38, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
          { name: POKEMON.gastly, level: 40, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
        ]
      },
      {
        name: `${ENTRENADORES.Medium.name}`, img: ENTRENADORES.Medium.img, rate: 33, pokemon: [
          { name: POKEMON.gastly, level: 38, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
          { name: POKEMON.cubone, level: 34, moveId: MOVES.ground.physical.earthquake },
        ]
      },
      {
        name: `${ENTRENADORES.Medium.name}`, img: ENTRENADORES.Medium.img, rate: 34, pokemon: [
          { name: POKEMON.gastly, level: 34, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
          { name: POKEMON.gastly, level: 32, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
          { name: POKEMON.gastly, level: 35, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
          { name: POKEMON.gastly, level: 38, moveId: [MOVES.ghost.special.shadow_ball, MOVES.poison.special.sludge_bomb] },
        ]
      },
    ],
  },

  'ultima-planta-torre-pokemon': {
    type: 'information',
    bg: BG.torrePokemon,
    title: 'Última planta',
    description: `<div style="display:flex;justify-content:center"><img src="${GIF.gastly}"></div><br><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Ya has terminado aquí, pero hay una planta mas...</p>`,
    optional: {
      btnName: 'Subir a la última planta',
      area: 'combate-victor',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Pueblo Lavanda
  // ═══════════════════════════════════════════════════════════════════════

  'pueblo-lavanda': {
    bg: BG.puebloLavanda,
    combatBg: COMBAT_BG.noche,
    wild: [],
    trainer: [],
    rewardExtras: [ITEM.thunder_stone, ITEM.water_stone, ITEM.fire_stone],
    specialTrainer: {
      name: ENTRENADORES.Rival.name, img: ENTRENADORES.Rival.img, pokemon: [
        {
          name: POKEMON.pidgeot, level: 34, moveId: MOVES.flying.physical.wing_attack,
        },
        {
          name: POKEMON.exeggcute, level: 33, moveId: MOVES.psychic.special.confusion,
        },
        {
          name: POKEMON.gyarados, level: 32, moveId: MOVES.dark.physical.crunch,
        },
        {
          name: POKEMON.kadabra, level: 35, moveId: MOVES.psychic.special.psychic,
        },
        {
          name: 'RIVAL_STARTER_3', level: 38,
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio Koga (Ciudad Fucsia)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-15': {
    bg: BG.ruta15,
    combatBg: COMBAT_BG.hierbaAlta,
    wild: [
      { name: POKEMON.pidgeotto, rate: 25, minLv: 38, maxLv: 44, moveId: MOVES.flying.physical.brave_bird },
      { name: POKEMON.venonat, rate: 25, minLv: 38, maxLv: 44, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.gloom, rate: 25, minLv: 38, maxLv: 44, moveId: MOVES.grass.special.magical_leaf },
      { name: POKEMON.weepinbell, rate: 10, minLv: 38, maxLv: 44, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.scyther, rate: 10, minLv: 38, maxLv: 44, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.ditto, rate: 5, minLv: 38, maxLv: 44, moveId: MOVES.normal.special.tri_attack },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Heal }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Heal }, { type: PATH_TYPE.Wild }],
    ],
  },

  'ciudad-fucsia': {
    type: 'information',
    bg: BG.ciudadFucsia,
    title: 'Ciudad Fucsia',
    description: 'Puedes ir directo al gimnasio o también podrías...',
    optional: {
      btnName: 'Explorar la Zona Safari',
      area: 'zona-safari',
    },
  },

  'ciudad-fucsia-gym': {
    bg: BG.ciudadFucsia,
    combatBg: COMBAT_BG.interior,
    wild: [],
    rewardPokemon: [POKEMON.exeggcute],
    welcome: {
      title: 'Ciudad Fucsia',
      subtitle: 'Gimnasio Pokemon de tipo Veneno',
      img: BG.ciudadFucsia,
    },
    gymLeader: 'Koga',
    gymType: 'poison',
    badgeId: 'soul-badge',
    gymLeaderImg: TRAINER_IMG.koga,
    trainer: [
      {
        name: `${ENTRENADORES.Malabarista.name}`, img: ENTRENADORES.Malabarista.img, rate: 25, pokemon: [
          { name: POKEMON.arbok, level: 43, moveId: MOVES.poison.physical.poison_jab },
          { name: POKEMON.sandslash, level: 42, moveId: MOVES.ground.physical.stomping_tantrum },
        ]
      },
      {
        name: `${ENTRENADORES.Malabarista.name}`, img: ENTRENADORES.Malabarista.img, rate: 25, pokemon: [
          { name: POKEMON.drowzee, level: 43, moveId: MOVES.psychic.special.confusion },
          { name: POKEMON.kadabra, level: 43, moveId: MOVES.psychic.special.confusion },
        ]
      },
      {
        name: `${ENTRENADORES.Malabarista.name}`, img: ENTRENADORES.Malabarista.img, rate: 25, pokemon: [
          { name: POKEMON.arbok, level: 43, moveId: MOVES.poison.physical.poison_jab },
          { name: POKEMON.kadabra, level: 43, moveId: MOVES.psychic.special.confusion },
        ]
      },
      {
        name: `${ENTRENADORES.Malabarista.name}`, img: ENTRENADORES.Malabarista.img, rate: 25, pokemon: [
          { name: POKEMON.hypno, level: 43, moveId: MOVES.psychic.special.confusion },
          { name: POKEMON.kadabra, level: 43, moveId: MOVES.psychic.special.psychic },
          { name: POKEMON.sandslash, level: 44, moveId: MOVES.ground.physical.stomping_tantrum },
        ]
      },
    ],
    gym: {
      leader: [
        {
          name: POKEMON.koffing, level: 47, moveId: MOVES.poison.special.sludge_bomb,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.koffing, level: 45, moveId: MOVES.normal.physical.self_destruct,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.muk, level: 47, moveId: MOVES.dark.special.dark_pulse,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.weezing, level: 52, moveId: MOVES.poison.special.sludge_wave,
          heldItem: ITEM.safety_goggles,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Lider }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio Sabrina (Ciudad Azafrán)
  // ═══════════════════════════════════════════════════════════════════════

  'info-ciudad-azafran': {
    type: 'information',
    bg: BG.ciudadAzafran,
    title: 'Ciudad Azafrán',
    description: 'Llegas a Ciudad Azafrán',
    optional: {
      btnName: 'Silph S.A.',
      area: 'silph',
    },
  },

  'ciudad-azafran-gym': {
    bg: BG.ciudadAzafran,
    combatBg: COMBAT_BG.interior,
    welcome: {
      title: 'Ciudad Azafrán',
      subtitle: 'Gimnasio Pokemon de tipo Psiquico',
      img: BG.ciudadAzafran,
    },
    gymLeader: 'Sabrina',
    gymType: 'psychic',
    badgeId: 'marsh-badge',
    gymLeaderImg: TRAINER_IMG.sabrina,
    rewardPokemon: [POKEMON.rhyhorn],
    gym: {
      leader: [
        {
          name: POKEMON.kadabra, level: 50, moveId: MOVES.psychic.special.psychic,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.mr_mime, level: 48, moveId: MOVES.fairy.special.moonblast,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.venomoth, level: 49, moveId: MOVES.bug.special.signal_beam,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.alakazam, level: 52, moveId: [MOVES.psychic.special.confusion, MOVES.ghost.special.shadow_ball],
          heldItem: ITEM.safety_goggles,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Lider }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimnasio Blaine (Isla Canela)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-20': {
    bg: BG.ruta20,
    combatBg: COMBAT_BG.agua,
    wild: [
      { name: POKEMON.slowbro, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.water.special.scald },
      { name: POKEMON.tentacool, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.poison.special.sludge_wave },
      { name: POKEMON.horsea, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.water.special.surf },
      { name: POKEMON.psyduck, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.psychic.special.confusion },
      { name: POKEMON.staryu, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.water.special.hydro_pump },
      { name: POKEMON.seel, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.water.special.surf },
      { name: POKEMON.shellder, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.ice.special.ice_beam },
      { name: POKEMON.kabuto, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.water.physical.crabhammer },
      { name: POKEMON.omanyte, rate: 10, minLv: 42, maxLv: 47, moveId: MOVES.rock.physical.stone_edge },
      { name: POKEMON.aerodactyl, rate: 10, minLv: 42, maxLv: 47, moveId: [MOVES.rock.physical.stone_edge, MOVES.flying.physical.brave_bird] },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Nadador.name}`, img: ENTRENADORES.Nadador.img, rate: 50, pokemon: [
          { name: POKEMON.krabby, level: 46, moveId: MOVES.water.physical.crabhammer },
          { name: POKEMON.cloyster, level: 47, moveId: MOVES.ice.special.ice_beam },
        ]
      },
      {
        name: `${ENTRENADORES.Nadador.name}`, img: ENTRENADORES.Nadador.img, rate: 50, pokemon: [
          { name: POKEMON.krabby, level: 43, moveId: MOVES.water.physical.crabhammer },
          { name: POKEMON.kingler, level: 48, moveId: MOVES.water.physical.crabhammer },
        ]
      },
    ],
    pathLength: 6
  },

  'mansion-pokemon': {
    bg: BG.mansionPokemon,
    combatBg: COMBAT_BG.interior,
    wild: [
      { name: POKEMON.growlithe, rate: 15, minLv: 45, maxLv: 50, moveId: MOVES.fire.physical.flame_wheel },
      { name: POKEMON.vulpix, rate: 15, minLv: 45, maxLv: 50, moveId: MOVES.fire.special.flamethrower },
      { name: POKEMON.ponyta, rate: 15, minLv: 45, maxLv: 50, moveId: MOVES.fire.physical.fire_fang },
      { name: POKEMON.grimer, rate: 15, minLv: 45, maxLv: 50, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.koffing, rate: 15, minLv: 45, maxLv: 50, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.ditto, rate: 15, minLv: 45, maxLv: 50, moveId: MOVES.normal.special.boomburst },
      { name: POKEMON.doduo, rate: 10, minLv: 45, maxLv: 50, moveId: MOVES.flying.physical.wing_attack },
    ],
    trainer: [
      {
        name: ENTRENADORES.Ladron.name, img: ENTRENADORES.Ladron.img, rate: 50, pokemon: [
          { name: POKEMON.growlithe, level: 50, moveId: MOVES.fire.physical.flame_wheel },
          { name: POKEMON.vulpix, level: 47, moveId: MOVES.fire.special.fire_blast },
        ]
      },
      {
        name: ENTRENADORES.Ladron.name, img: ENTRENADORES.Ladron.img, rate: 50, pokemon: [
          { name: POKEMON.rapidash, level: 52, moveId: MOVES.fire.physical.flare_blitz },
        ]
      },
    ],
    pathLength: 5
  },

  'isla-canela-gym': {
    bg: BG.islaCanela,
    combatBg: COMBAT_BG.interior,
    welcome: {
      title: 'Isla Canela',
      subtitle: 'Gimnasio Pokemon de tipo Fuego',
      img: BG.islaCanela,
    },
    gymLeader: 'Blaine',
    gymType: 'fire',
    badgeId: 'volcano-badge',
    gymLeaderImg: TRAINER_IMG.blaine,
    rewardExtras: [ITEM.choice_band],
    gym: {
      leader: [
        {
          name: POKEMON.growlithe, level: 52, moveId: MOVES.fire.physical.flame_wheel,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.ponyta, level: 52, moveId: MOVES.fire.physical.flame_wheel,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.rapidash, level: 55, moveId: [MOVES.fire.physical.flame_wheel, MOVES.dragon.physical.dragon_tail],
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
        {
          name: POKEMON.arcanine, level: 57, moveId: [MOVES.fire.physical.flare_blitz, MOVES.normal.physical.extreme_speed],
          heldItem: ITEM.carbon,
          overrides: { evs: { hp: 32, def: 32, spd: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Lider }],
    ],
  },


  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio Giovanni (Ciudad Verde)
  // ═══════════════════════════════════════════════════════════════════════

  'ciudad-verde-info-2': {
    type: 'information',
    bg: BG.ciudadVerde,
    title: 'Ciudad Verde',
    description: 'Te acercas al último gimnasio de la región.',
  },

  'ciudad-verde-gym': {
    bg: BG.ciudadVerde,
    combatBg: COMBAT_BG.interior,
    welcome: {
      title: 'Ciudad Verde',
      subtitle: 'Gimnasio Pokemon de tipo Tierra',
      img: BG.ciudadVerde,
    },
    gymLeader: 'Giovanni',
    gymType: 'ground',
    badgeId: 'earth-badge',
    gymLeaderImg: TRAINER_IMG.giovanni,
    rewardPokemon: [POKEMON.jynx],
    rewardExtras: [ITEM.choice_band],
    gym: {
      leader: [
        {
          name: POKEMON.rhyhorn, level: 57, moveId: MOVES.rock.physical.stone_edge,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.dugtrio, level: 55, moveId: MOVES.ground.physical.earthquake,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.nidoking, level: 57, moveId: MOVES.poison.physical.poison_jab,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.nidoqueen, level: 57, moveId: MOVES.poison.physical.gunk_shot,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.kangaskhan, level: 60, moveId: MOVES.normal.physical.extreme_speed,
          heldItem: ITEM.lifeorb,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Lider }],
    ],
  },

  'mensaje-medallas': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'ENHORABUENA',
    description: 'Has conseguido todas las medallas de Kanto.<br>El alto mando te espera.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Calle Victoria
  // ═══════════════════════════════════════════════════════════════════════

  'calle-victoria': {
    bg: BG.calleVictoria,
    combatBg: COMBAT_BG.cueva,
    rewardExtras: [ITEM.assault_vest],
    rewardPokemon: [POKEMON.electabuzz, POKEMON.magmar, POKEMON.chansey],
    wild: [
      { name: POKEMON.moltres, rate: 25, minLv: 60, maxLv: 65, moveId: MOVES.fire.special.fire_blast },
      { name: POKEMON.articuno, rate: 25, minLv: 60, maxLv: 65, moveId: MOVES.ice.special.blizzard },
      { name: POKEMON.zapdos, rate: 25, minLv: 60, maxLv: 65, moveId: MOVES.electric.physical.wild_charge },
      { name: POKEMON.dratini, rate: 25, minLv: 60, maxLv: 65, moveId: MOVES.dragon.physical.dragon_claw },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Alto Mando
  // ═══════════════════════════════════════════════════════════════════════

  'alto-mando-info': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'ALTO MANDO',
    description: '¡Preparate, el reto te espera!',
  },

  //LORELEI

  'alto-mando-lorelei': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'Lorelei',
    description: `<div style="display:flex;justify-content:center;align-items:flex-end;">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png" alt="Cloyster" style="position: relative;transform: translateX(157px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/87.png" alt="Dewgong" style="position: relative;transform: translateX(101px);z-index: 2;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/80.png" alt="Slowbro" style="position: relative;transform: rotateY(175deg) translateX(-78px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png" alt="Jynx" style="position: relative;transform: rotateY(175deg) translateX(-19px);z-index: 0;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png" alt="Lapras" style="position: relative;transform: rotateY(175deg) translateX(80px) translateY(-13px);scale: 2;z-index: -3;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="${TRAINER_IMG.loreleiBig}" style="position: relative;z-index: 3;height: 96px;object-fit: contain;right: 245px;">
    </div><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Alto Mando de tipo Hielo</p>`,
  },

  'combate-lorelei': {
    bg: BG.mesetaAnil,
    combatBg: COMBAT_BG.altoMando,
    specialTrainer: {
      name: 'Lorelei', img: TRAINER_IMG.lorelei, pokemon: [
        {
          name: POKEMON.dewgong, level: 62, moveId: MOVES.water.special.surf
        },
        {
          name: POKEMON.cloyster, level: 61, moveId: MOVES.ice.physical.icicle_crash
        },
        {
          name: POKEMON.slowbro, level: 63, moveId: [MOVES.psychic.special.psychic, MOVES.water.special.hydro_pump]
        },
        {
          name: POKEMON.jynx, level: 65, moveId: MOVES.ice.special.blizzard
        },
        {
          name: POKEMON.lapras, level: 65, moveId: [MOVES.ice.special.ice_beam, MOVES.water.special.scald]
        }
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  //BRUNO

  'alto-mando-bruno': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'Bruno',
    description: `<div style="display:flex;justify-content:center;align-items:flex-end;">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" alt="" style="position: relative;transform: translateX(157px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/107.png" alt="" style="position: relative;transform: translateX(101px);z-index: 2;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(-78px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(-19px);z-index: 0;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(80px) translateY(-13px);scale: 2;z-index: -3;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="${GIF.bruno}" style="position: relative;z-index: 3;height: 70px;object-fit: contain;right: 238px;">
    </div><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Alto Mando de tipo Lucha</p>`,
  },

  'combate-bruno': {
    bg: BG.mesetaAnil,
    combatBg: COMBAT_BG.altoMando,
    specialTrainer: {
      name: 'Bruno', img: TRAINER_IMG.bruno, pokemon: [
        {
          name: POKEMON.onix, level: 64, moveId: MOVES.rock.physical.rock_slide
        },
        {
          name: POKEMON.hitmonlee, level: 64, moveId: MOVES.fighting.physical.brick_break
        },
        {
          name: POKEMON.hitmonchan, level: 63, moveId: MOVES.fighting.physical.brick_break
        },
        {
          name: POKEMON.onix, level: 65, moveId: MOVES.ground.physical.earthquake
        },
        {
          name: POKEMON.machamp, level: 66, moveId: MOVES.fighting.physical.close_combat
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  //AGATHA

  'alto-mando-agatha': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'Agatha',
    description: `<div style="display:flex;justify-content:center;align-items:flex-end;">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" alt="" style="position: relative;transform: translateX(157px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" alt="" style="position: relative;transform: translateX(101px);z-index: 2;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(-78px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(-19px);z-index: 0;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(80px) translateY(-13px);scale: 2;z-index: -3;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="${GIF.agatha}" style="position: relative;z-index: 3;height: 70px;object-fit: contain;right: 238px;">
    </div><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Alto Mando de tipo Veneno</p>`,
  },

  'combate-agatha': {
    bg: BG.mesetaAnil,
    combatBg: COMBAT_BG.altoMando,
    specialTrainer: {
      name: 'Agatha', img: TRAINER_IMG.agatha, pokemon: [
        {
          name: POKEMON.gengar, level: 65, moveId: MOVES.ghost.physical.shadow_claw
        },
        {
          name: POKEMON.golbat, level: 64, moveId: MOVES.poison.physical.gunk_shot
        },
        {
          name: POKEMON.haunter, level: 66, moveId: MOVES.ghost.special.shadow_ball
        },
        {
          name: POKEMON.arbok, level: 67, moveId: MOVES.poison.physical.gunk_shot
        },
        {
          name: POKEMON.gengar, level: 67, moveId: [MOVES.ghost.special.shadow_ball, MOVES.psychic.special.confusion]
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  //LANCE

  'alto-mando-lance': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'Lance',
    description: `<div style="display:flex;justify-content:center;align-items:flex-end;">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" alt="" style="position: relative;transform: translateX(157px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png" alt="" style="position: relative;transform: translateX(101px);z-index: 2;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(-48px);z-index: 1;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(4px);z-index: 0;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png" alt="" style="position: relative;transform: rotateY(175deg) translateX(80px) translateY(-13px);scale: 2;z-index: -3;image-rendering: pixelated;" onerror="this.style.opacity=0.2">
    <img src="${GIF.lance}" style="position: relative;z-index: 3;height: 70px;object-fit: contain;right: 238px;">
    </div><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Alto Mando de tipo Dragon</p>`,
  },

  'combate-lance': {
    bg: BG.mesetaAnil,
    combatBg: COMBAT_BG.altoMando,
    specialTrainer: {
      name: 'Lance', img: TRAINER_IMG.lance, pokemon: [
        {
          name: POKEMON.gyarados, level: 65, moveId: MOVES.water.physical.wave_crash
        },
        {
          name: POKEMON.dragonair, level: 66, moveId: MOVES.dragon.physical.dragon_claw
        },
        {
          name: POKEMON.dragonair, level: 68, moveId: MOVES.dragon.physical.dragon_tail
        },
        {
          name: POKEMON.aerodactyl, level: 68, moveId: [MOVES.rock.physical.stone_edge, MOVES.ice.physical.ice_fang]
        },
        {
          name: POKEMON.dragonite, level: 70, moveId: MOVES.dragon.physical.outrage
        }
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  //RIVAL

  'campeon-pokemon-info': {
    type: 'information',
    bg: BG.kantoLeague,
    title: 'AZUL',
    description: `<div style="display:flex;justify-content:center"><img src="${GIF.azul}"></div><br><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Campeón de la Liga Pokémon</p>`,
  },

  'campeon-pokemon': {
    bg: BG.mesetaAnil,
    combatBg: COMBAT_BG.altoMando,
    rewardPokemon: [POKEMON.tauros],
    specialTrainer: {
      name: 'AZUL', img: TRAINER_IMG.rival, pokemon: [
        {
          name: POKEMON.pidgeot, level: 70, moveId: MOVES.flying.physical.brave_bird
        },
        {
          name: POKEMON.alakazam, level: 70, moveId: MOVES.psychic.special.confusion
        },
        {
          name: POKEMON.rhydon, level: 71, moveId: [MOVES.ground.physical.earthquake, MOVES.electric.special.thunder]
        },
        {
          name: POKEMON.exeggutor, level: 72, moveId: MOVES.grass.special.solar_beam
        },
        {
          name: POKEMON.gyarados, level: 72, moveId: MOVES.water.physical.wave_crash
        },
        {
          name: POKEMON.charizard, level: 75, moveId: MOVES.fire.physical.flare_blitz
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'info-final-kanto': {
    type: 'information',
    bg: BG.final,
    title: '¡Enhorabuena!',
    description: 'Has superado la aventura.<br>¡Gracias por jugar!',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Extras
  // ═══════════════════════════════════════════════════════════════════════

  'espacio-raro': {
    bg: BG.espacioRaro,
    combatBg: COMBAT_BG.espacioRaro,
    rewardPokemon: [POKEMON.mew],
    wild: [
      {
        name: POKEMON.mewtwo, rate: 100, minLv: 60, maxLv: 70, moveId: [MOVES.psychic.special.trick, MOVES.fighting.special.focus_blast],
        overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
      }
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  'info-combate-final': {
    type: 'information',
    bg: BG.cuevaPlateada,
    title: 'Fondo de la cueva',
    description: `<div style="display:flex;justify-content:center"><img src="${GIF.rojoClassic}"></div><br><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">...</p>`,
  },

  'combate-rojo': {
    bg: BG.cuevaPlateada,
    combatBg: COMBAT_BG.altoMando,
    wild: [],
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Rojo.name, img: ENTRENADORES.Rojo.img, pokemon: [
        {
          name: POKEMON.snorlax, level: 70, moveId: MOVES.normal.physical.hyper_fang,
          heldItem: ITEM.leftovers, img: POKEMON_SPRITE.snorlaxClassic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.charizard, level: 70, moveId: MOVES.fire.physical.flare_blitz,
          img: POKEMON_SPRITE.charizardClassic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.venusaur, level: 70, moveId: MOVES.grass.special.magical_leaf,
          heldItem: ITEM.miracle_seed, img: POKEMON_SPRITE.venusaurClassic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.blastoise, level: 70, moveId: MOVES.water.special.hydro_pump,
          heldItem: ITEM.mystic_water, img: POKEMON_SPRITE.blastoiseClassic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.lapras, level: 70, moveId: MOVES.ice.special.blizzard,
          heldItem: ITEM.choice_specs, img: POKEMON_SPRITE.laprasClassic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
        {
          name: POKEMON.pikachu, level: 70, moveId: MOVES.electric.physical.volt_tackle,
          heldItem: ITEM.light_ball, img: POKEMON_SPRITE.pikachuClassic,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'info-final': {
    type: 'information',
    bg: BG.final,
    title: '¡Enhorabuena!',
    description: '¡Has superado el contenido extra!',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // OPCIONALES
  // ═══════════════════════════════════════════════════════════════════════

  'pueblo-paleta-1': {
    bg: BG.puebloPaleta,
    combatBg: COMBAT_BG.default,
    title: 'Pueblo Paleta',
    get wild() {
      const [primerInicial, segundoInicial] = ObtenerSegundoInicial(GameState.starterName ?? POKEMON.bulbasaur);
      return [
        { name: primerInicial, rate: 50, minLv: 5, maxLv: 7 },
        { name: segundoInicial, rate: 50, minLv: 5, maxLv: 7 },
      ];
    },
    rewardExtras: [ITEM.carbon, ITEM.mystic_water, ITEM.miracle_seed],
    trainer: [],
    specialTrainer: {
      name: ENTRENADORES.Rival.name, img: ENTRENADORES.Rival.img, pokemon: [
        { name: 'RIVAL_STARTER', minLv: 5, maxLv: 7 },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }, { type: PATH_TYPE.Wild }],
    ],
  },

  'jardin-bill': {
    bg: BG.ruta25,
    combatBg: COMBAT_BG.default,
    title: 'Jardín de Bill',
    rewardPokemon: [POKEMON.pinsir],
    rewardExtras: [ITEM.flame_orb, ITEM.safety_goggles],
    wild: [],
    trainer: [
      {
        name: 'Adrián el dominguero', img: ENTRENADORES.Campista.img, rate: 100, pokemon: [
          { name: POKEMON.mr_mime, minLv: 25, maxLv: 30, moveId: MOVES.psychic.special.psychic },
          { name: POKEMON.pinsir, minLv: 26, maxLv: 34, moveId: MOVES.bug.physical.megahorn, shiny: true },
        ]
      },
    ],
    paths: [
      [{ type: PATH_TYPE.Trainer }],
    ],
  },

  'combate-victor': {
    bg: BG.torrePokemon,
    combatBg: COMBAT_BG.interior,
    title: 'Última planta de la torre',
    wild: [],
    trainer: [],
    rewardPokemon: [POKEMON.kangaskhan],
    rewardExtras: [ITEM.lifeorb],
    specialTrainer: {
      name: 'Atlético Víctor', img: ENTRENADORES.ChicoGuay.img, pokemon: [
        { name: POKEMON.marowak, minLv: 38, maxLv: 43, moveId: MOVES.normal.physical.extreme_speed },
        { name: POKEMON.pikachu, minLv: 38, maxLv: 43, moveId: MOVES.electric.special.thunder },
        { name: POKEMON.chansey, minLv: 38, maxLv: 43, moveId: MOVES.normal.special.hyper_voice },
        { name: POKEMON.charizard, minLv: 38, maxLv: 43, moveId: MOVES.fire.special.fire_blast },
        { name: POKEMON.gengar, minLv: 40, maxLv: 45, moveId: [MOVES.ghost.special.astral_barrage, MOVES.dark.physical.crunch], heldItem: ITEM.safety_goggles },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'silph': {
    bg: BG.silph,
    combatBg: COMBAT_BG.interior,
    title: 'Silph S.A.',
    wild: [],
    rewardPokemon: [POKEMON.lapras],
    rewardExtras: [ITEM.choice_specs],
    trainer: [
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.voltorb, minLv: 35, maxLv: 40, moveId: MOVES.electric.special.thunder },
          { name: POKEMON.electrode, minLv: 35, maxLv: 40, moveId: MOVES.normal.special.hyper_voice },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.sandslash, minLv: 35, maxLv: 40, moveId: MOVES.ground.physical.earthquake },
          { name: POKEMON.sandshrew, minLv: 35, maxLv: 40, moveId: MOVES.normal.physical.extreme_speed },
          { name: POKEMON.ekans, minLv: 35, maxLv: 40, moveId: MOVES.poison.physical.gunk_shot },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.grimer, minLv: 35, maxLv: 40, moveId: MOVES.poison.special.sludge_bomb },
          { name: POKEMON.muk, minLv: 35, maxLv: 40, moveId: MOVES.poison.special.sludge_wave },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.grimer, minLv: 35, maxLv: 40, moveId: MOVES.poison.special.sludge_bomb },
          { name: POKEMON.koffing, minLv: 35, maxLv: 40, moveId: MOVES.poison.special.sludge_wave },
          { name: POKEMON.koffing, minLv: 35, maxLv: 40, moveId: MOVES.dark.special.dark_pulse },
        ]
      },
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.magnemite, minLv: 35, maxLv: 40, moveId: MOVES.electric.physical.thunder_punch },
          { name: POKEMON.magneton, minLv: 35, maxLv: 40, moveId: MOVES.electric.special.thunderbolt },
        ]
      }
    ],
    specialTrainer: {
      name: 'Jefe Giovanni', img: ENTRENADORES.Giovanni.img, pokemon: [
        {
          name: POKEMON.nidorino, level: 37, moveId: MOVES.poison.physical.poison_jab,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.rhyhorn, level: 43, moveId: MOVES.ground.physical.earthquake,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.nidoqueen, level: 45, moveId: MOVES.poison.physical.gunk_shot,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
        {
          name: POKEMON.kangaskhan, level: 48, moveId: MOVES.normal.physical.hyper_fang,
          heldItem: ITEM.lifeorb,
          overrides: { evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 } },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Special }],
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'zona-safari': {
    bg: BG.zonaSafari,
    combatBg: COMBAT_BG.default,
    title: 'Zona Safari',
    rewardExtras: [],
    wildExclude: [
      POKEMON.mewtwo,
      POKEMON.mew,
      POKEMON.zapdos,
      POKEMON.moltres,
      POKEMON.articuno,
      POKEMON.dragonite,
      POKEMON.dragonair,
    ],
    wildLevel: { min: 30, max: 45 },
    get wild() {
      const exclude = this.wildExclude ?? [];
      const { min, max } = this.wildLevel ?? { min: 30, max: 45 };
      return Object.keys(POKEMON_DB)
        .filter(name => !exclude.includes(name) && (POKEMON_STATS[name]?.id ?? 0) <= 151)
        .map(name => ({ name, rate: 1, minLv: min, maxLv: max }));
    },
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  'dev-ruta-opcional': {
    type: 'information',
    bg: BG.bosqueVerde,
    title: 'Cruce de Caminos',
    description: `<div style="display:flex;justify-content:center"><img src="${GIF.montanero}"></div><br><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">El camino principal sigue al norte. Al este se oye algo en el bosque...</p>`,
    optional: {
      btnName: 'Explorar el bosque',
      area: 'ruta-22',
    },
  },

};

// ── Pantalla final ────────────────────────────────────────
var FINAL_SCREEN = {
  title: '¡HAS GANADO!',
  subtitle: 'Enhorabuena, gracias por jugar!',
  bg: BG.final,
  btnText: 'NUEVA PARTIDA',
};

// ═══════════════════════════════════════════════════════════════════════
// KANTO
// ═══════════════════════════════════════════════════════════════════════

var KANTO_ROUTES = [
  { name: 'Ruta 1', area: 'ruta-1' },
  { name: 'Ciudad Verde', area: 'ciudad-verde-info' },
  { name: 'Ruta 22', area: 'ruta-22' },
  { name: 'Ruta 2', area: 'ruta-2' },
  { name: 'Bosque Verde', area: 'bosque-verde' },
  { name: 'Ciudad Plateada', area: 'ciudad-plateada' },
  { name: 'Ruta 3', area: 'ruta-3' },
  { name: 'Mt. Moon', area: 'mt-moon' },
  { name: 'Ruta 4', area: 'ruta-4' },
  { name: 'Ciudad Celeste', area: 'ciudad-celeste' },
  { name: 'Ruta 24 (Entrada)', area: 'ruta-24-1' },
  { name: 'Ruta 24 (Puente)', area: 'ruta-24-2' },
  { name: 'Laboratorio de Bill', area: 'info-bill' },
  { name: 'Ruta 6', area: 'ruta-6' },
  { name: 'Llega un barco', area: 'info-cgoob' },
  { name: 'SS Anne', area: 'ss-anne' },
  { name: 'Ciudad Carmín', area: 'ciudad-carmin' },
  { name: 'Ruta 9', area: 'ruta-9' },
  { name: 'Ruta 10', area: 'ruta-10' },
  { name: 'Tunel Roca', area: 'entrada-tunel-roca-info' },
  { name: 'Tunel Roca', area: 'entrada-tunel-roca' },
  { name: 'Tunel Roca', area: 'tunel-roca' },
  { name: 'Ciudad Azulona', area: 'ciudad-azulona' },
  { name: 'Guarida Rocket', area: 'guarida-rocket' },
  { name: 'Oficina Rocket', area: 'ultima-planta-rocket-info' },
  { name: 'Líder Rocket Giovanni', area: 'combate-giovanni' },
  { name: 'Gimnasio de Ciudad Azulona', area: 'ciudad-azulona-gym' },
  { name: 'Torre Pokémon', area: 'torre-pokemon' },
  { name: 'Torre Pokémon', area: 'ultima-planta-torre-pokemon' },
  { name: 'Ruta 15', area: 'ruta-15' },
  { name: 'Ciudad Fucsia', area: 'ciudad-fucsia' },
  { name: 'Gimnasio de Ciudad Fucsia', area: 'ciudad-fucsia-gym' },
  { name: 'Ciudad Azafrán', area: 'info-ciudad-azafran' },
  { name: 'Gimnasio de Ciudad Azafrán', area: 'ciudad-azafran-gym' },
  { name: 'Ruta 20', area: 'ruta-20' },
  { name: 'Mansión Pokémon', area: 'mansion-pokemon' },
  { name: 'Gimnasio de Isla Canela', area: 'isla-canela-gym' },
  { name: 'Ciudad Verde', area: 'ciudad-verde-info-2' },
  { name: 'Gimnasio de Ciudad Verde', area: 'ciudad-verde-gym' },
  { name: '¡Enhorabuena!', area: 'mensaje-medallas' },
  { name: 'Calle Victoria', area: 'calle-victoria' },

  //ALTO MANDO
  { name: 'ALTO MANDO', area: 'alto-mando-info' },

  { name: 'LORELEI', area: 'alto-mando-lorelei' },
  { name: 'ALTO MANDO LORELEI', area: 'combate-lorelei' },

  { name: 'BRUNO', area: 'alto-mando-bruno' },
  { name: 'ALTO MANDO BRUNO', area: 'combate-bruno' },

  { name: 'AGATHA', area: 'alto-mando-agatha' },
  { name: 'ALTO MANDO AGATHA', area: 'combate-agatha' },

  { name: 'LANCE', area: 'alto-mando-lance' },
  { name: 'ALTO MANDO LANCE', area: 'combate-lance' },

  { name: 'AZUL', area: 'campeon-pokemon-info' },
  { name: 'CAMPEÓN DE LA LIGA POKÉMON', area: 'campeon-pokemon' },

  { name: 'CAMPEÓN DE LA LIGA', area: 'info-final-kanto' },

  //Extra
  { name: '???', area: 'espacio-raro' },
  { name: 'Cueva Plateada', area: 'info-combate-final' },
  { name: 'Final del camino', area: 'combate-rojo' },
  { name: 'Final', area: 'info-final' },
];

// ── Helpers específicos de Kanto ───────────────────────────────────────────

function ObtenerSegundoInicial(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return [POKEMON.charmander, POKEMON.squirtle];
  if (playerPokemon === POKEMON.charmander) return [POKEMON.bulbasaur, POKEMON.squirtle];
  if (playerPokemon === POKEMON.squirtle) return [POKEMON.bulbasaur, POKEMON.charmander];
  return [POKEMON.eevee, POKEMON.pikachu];
}

function pickInitialPokemonRival(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return POKEMON.charmander;
  if (playerPokemon === POKEMON.charmander) return POKEMON.squirtle;
  if (playerPokemon === POKEMON.squirtle) return POKEMON.bulbasaur;
  return POKEMON.eevee;
}

// Segunda forma del contra-tipo del starter del jugador.
// Usar con el marcador 'RIVAL_STARTER_2' en specialTrainer.pokemon.
function pickRivalSecondForm(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return POKEMON.charmeleon;
  if (playerPokemon === POKEMON.charmander) return POKEMON.wartortle;
  if (playerPokemon === POKEMON.squirtle) return POKEMON.ivysaur;
  return POKEMON.eevee;
}

// Tercera forma (evolución final) del contra-tipo del starter del jugador.
// Usar con el marcador 'RIVAL_STARTER_3' en specialTrainer.pokemon.
function pickRivalThirdForm(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return POKEMON.charizard;
  if (playerPokemon === POKEMON.charmander) return POKEMON.blastoise;
  if (playerPokemon === POKEMON.squirtle) return POKEMON.venusaur;
  return POKEMON.eevee;
}
