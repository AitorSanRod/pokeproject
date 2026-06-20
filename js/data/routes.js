// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE RUTAS
//
// Usa POKEMON_LIST (de pokemon-db.js) y MOVE_LIST (de move-pool.js)
// para referencias sin hardcodear strings.
//
// POKEMON_LIST.rattata          → 'rattata'
// MOVE_LIST.normal.physical.tackle → 'tackle'
// MOVE_LIST.fire.special.ember     → 'ember'
//
// Cada pokemon puede tener:
//   name   : POKEMON_LIST.nombre
//   rate   : probabilidad (wild, suma 100 por tabla)
//   minLv  : nivel mínimo
//   maxLv  : nivel máximo
//   level  : nivel fijo (gym leaders)
//   moveId : MOVE_LIST.tipo.clase.nombre — ataque exclusivo
// ─────────────────────────────────────────────────────────────────────────────

const MOVES = MOVE_LIST;
const POKEMON = POKEMON_LIST;
const PATH_TYPE = {
  Trainer: 'trainer',
  Wild: 'wild',
  Special: 'special',
  Heal: 'heal',
  Lider: 'leader'
};
const ENTRENADORES = {
  Rival: {
    name: 'Azul',
    img: 'assets/sprites/trainers/rival_kanto.png',
  },
  Cazabichos: {
    name: 'Cazabichos',
    img: 'assets/sprites/trainers/cazabichos.png',
  },
  EntrenadorJoven: {
    name: 'Entrenador joven',
    img: 'assets/sprites/trainers/entrenadorjoven.png',
  },
  Campista: {
    name: 'Campista',
    img: 'assets/sprites/trainers/campista.png',
  },
  Montanero: {
    name: 'Montañero',
    img: 'assets/sprites/trainers/montanero.png',
  },
  Dominguera: {
    name: 'Dominguera',
    img: 'assets/sprites/trainers/dominguera.png',
  },
  Nadador: {
    name: 'Nadador',
    img: 'assets/sprites/trainers/nadador.png',
  },
  Caballero: {
    name: 'Caballero',
    img: 'assets/sprites/trainers/caballero.png',
  },
  Mecanico: {
    name: 'Mecanico',
    img: 'assets/sprites/trainers/mecanico.png',
  },
  Pokemaniaco: {
    name: 'Pokemaniaco',
    img: 'assets/sprites/trainers/pokemaniaco.png'
  },
  Rojo: {
    name: 'Rojo',
    img: 'assets/sprites/trainers/rojo.png'
  },
  Cientifico: {
    name: 'Cientifico',
    img: 'assets/sprites/trainers/cientifico.png'
  }
  ,
  Marinero: {
    name: 'Marinero',
    img: 'assets/sprites/trainers/marinero.png'
  },
  Rocket: {
    name: 'Rocket',
    img: 'assets/sprites/trainers/soldado-rocket.png'
  },
  Giovanni: {
    name: 'Giovanni',
    img: 'assets/sprites/trainers/giovanni.png',
    gif: 'assets/sprites/others/giovani.gif'
  },
  ChicoGuay: {
    name: 'Entrenador Guay',
    img: 'assets/sprites/trainers/entrenador-guay.png'
  },
  ChicaGuay: {
    name: 'Entrenadora Guay',
    img: 'assets/sprites/trainers/entrenadora-guay.png'
  },
  Chica: {
    name: 'Chica',
    img: 'assets/sprites/trainers/chica.png'
  },
}
var SHINY_RATE = 0.005;
//var SHINY_RATE = 0.05; //5%
// Probabilidad (0–1) de que un Pokémon salvaje aparezca como shiny.
// 0.001 = 1 de cada 1000 (equivale a 1/1024, similar a los juegos principales).

var ROUTE_DATA = {

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio de Brock (Ciudad Plateada)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-1': {
    bg: 'assets/bg/route-1.png',
    combatBg: 'assets/bg/combate.png',
    rewardPokemon: [POKEMON.rattata, POKEMON.pidgey, POKEMON.pikachu],
    // Objetos equipables que pueden aparecer como recompensa de fin de ruta,
    // junto a las 3 opciones base (pokemon, vitamina, rare candy). Opcional —
    // si se omite o es [], solo aparecen las 3 opciones base (sección 11).
    wild: [
      { name: POKEMON.rattata, rate: 45, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.pidgey, rate: 45, minLv: 2, maxLv: 3, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.pikachu, rate: 10, minLv: 2, maxLv: 4, moveId: MOVES.electric.special.thunder_shock },
    ],
    trainer: [
      {
        name: 'Youngster Joey', img: ENTRENADORES.EntrenadorJoven.img, rate: 30, pokemon: [
          { name: POKEMON.rattata, minLv: 2, maxLv: 3, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.rattata, minLv: 3, maxLv: 3, moveId: MOVES.normal.physical.tackle },
        ]
      },
      {
        name: 'Youngster Joey', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 40, pokemon: [
          { name: POKEMON.rattata, minLv: 2, maxLv: 2, moveId: MOVES.normal.physical.tackle },
          { name: POKEMON.pidgey, minLv: 2, maxLv: 3, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: 'Youngster Joey', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 30, pokemon: [
          { name: POKEMON.rattata, minLv: 2, maxLv: 2, moveId: MOVES.normal.physical.tackle },
        ]
      },
    ]
  },

  'ciudad-verde-info': {
    type: 'information',
    bg: 'assets/bg/ciudad-verde.png',
    title: 'Ciudad Verde',
    description: 'Es el momento de volver sí<br>se te ha olvidado algo...',
    optional: {
      btnName: 'Volver a Pueblo Paleta',
      area: 'pueblo-paleta-1',
    },
  },

  'ruta-22': {
    bg: 'assets/bg/route-22.png',
    combatBg: 'assets/bg/combate.png',
    rewardPokemon: [POKEMON.mankey, POKEMON.nidoran_f, POKEMON.nidoran_m],
    wild: [
      { name: POKEMON.nidoran_m, rate: 30, minLv: 3, maxLv: 5, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_f, rate: 30, minLv: 3, maxLv: 5, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.mankey, rate: 20, minLv: 4, maxLv: 5, moveId: MOVES.fighting.physical.karate_chop },
      { name: POKEMON.goldeen, rate: 20, minLv: 3, maxLv: 4, moveId: MOVES.water.physical.waterfall },
    ],
    trainer: [],
    specialTrainer: {
      name: 'Azul', img: 'assets/sprites/trainers/rival_kanto.png', pokemon: [
        { name: 'RIVAL_STARTER', minLv: 5, maxLv: 8 },
      ]
    },
    paths: [
      [{ type: 'wild' }, { type: 'wild' }, { type: 'special' }],
    ],
  },

  'ruta-2': {
    bg: 'assets/bg/route-2.png',
    combatBg: 'assets/bg/combate.png',
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
        name: 'Entrenador joven', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 50, pokemon: [
          { name: POKEMON.pidgey, minLv: 4, maxLv: 5, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: 'Bug Catcher Jr', img: 'assets/sprites/trainers/cazabichos.png', rate: 50, pokemon: [
          { name: POKEMON.metapod, minLv: 7, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
    ],
    paths: [
      [
        { type: 'wild' }, { type: 'wild' }
      ],
      [
        { type: 'wild' }, { type: 'trainer' }
      ],
    ]
  },

  'bosque-verde': {
    bg: 'assets/bg/bosque-verde.png',
    combatBg: 'assets/bg/combate.png',
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
        name: 'Bug Catcher', img: 'assets/sprites/trainers/cazabichos.png', rate: 40, pokemon: [
          { name: POKEMON.caterpie, minLv: 8, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 9, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
      {
        name: 'Bug Catcher', img: 'assets/sprites/trainers/cazabichos.png', rate: 45, pokemon: [
          { name: POKEMON.caterpie, minLv: 8, maxLv: 10, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.weedle, minLv: 8, maxLv: 10, moveId: MOVES.poison.physical.poison_sting },
        ]
      },
      {
        name: 'Bug Catcher', img: 'assets/sprites/trainers/cazabichos.png', rate: 15, pokemon: [
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.caterpie, minLv: 6, maxLv: 12, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
    ],
    paths: [
      [{ type: 'wild' }, { type: 'wild' }, { type: 'wild' }, { type: 'wild' }],
      [{ type: 'wild' }, { type: 'trainer' }, { type: 'trainer' }, { type: 'heal' }, { type: 'wild' }],
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'heal' }, { type: 'trainer' }, { type: 'trainer' }],
      [{ type: 'trainer' }, { type: 'wild' }, { type: 'trainer' },]
    ],
  },

  'ciudad-plateada': {
    bg: 'assets/bg/ciudad-plateada.png',
    combatBg: 'assets/bg/combate.png',
    wild: [],
    welcome: {
      title: 'Ciudad Plateada',
      subtitle: 'Gimnasio Pokemon de tipo Roca',
      img: 'assets/bg/ciudad-plateada.png',
    },
    gymLeader: 'Brock',
    gymType: 'rock',
    badgeId: 'boulder-badge',
    gymLeaderImg: 'assets/sprites/trainers/brock.png',
    rewardExtras: [ITEM.leftovers],
    trainer: [
      {
        name: 'Hiker Rocko', img: 'assets/sprites/trainers/campista.png', rate: 100,
        pokemon: [
          { name: POKEMON.geodude, minLv: 11, maxLv: 12, moveId: MOVES.rock.physical.rock_throw }
        ]
      }
    ],
    gym: {
      leader: [
        {
          name: POKEMON.geodude, level: 12, moveId: MOVES.rock.physical.rock_throw,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32 },
          },
        },
        {
          name: POKEMON.onix, level: 14, moveId: MOVES.rock.physical.rock_throw,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32 },
          },
        },
      ]
    },
    paths: [
      [{ type: 'trainer' }, { type: 'leader' }],
      [{ type: 'leader' }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio de Misty (Ciudad Celeste)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-3': {
    bg: 'assets/bg/ruta-3.png',
    combatBg: 'assets/bg/combate.png',
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
        name: 'Entrenador joven', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 45, pokemon: [
          { name: POKEMON.pidgey, minLv: 12, maxLv: 16, moveId: MOVES.flying.physical.peck },
          { name: POKEMON.pidgey, minLv: 12, maxLv: 16, moveId: MOVES.flying.physical.peck },
        ]
      },
      {
        name: 'Bug Catcher', img: 'assets/sprites/trainers/cazabichos.png', rate: 45, pokemon: [
          { name: POKEMON.caterpie, minLv: 12, maxLv: 18, moveId: MOVES.bug.physical.bug_bite },
          { name: POKEMON.metapod, minLv: 12, maxLv: 18, moveId: MOVES.bug.physical.bug_bite },
        ]
      },
      {
        name: 'Entrenadora joven', img: 'assets/sprites/trainers/cazabichos.png', rate: 10, pokemon: [
          { name: POKEMON.jigglypuff, minLv: 16, maxLv: 20, moveId: MOVES.fairy.special.disarming_voice },
        ]
      },
    ],
    paths: [
      [{ type: 'wild' }, { type: 'trainer' }, { type: 'wild' }, { type: 'wild' }],
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'wild' }, { type: 'wild' }],
      [{ type: 'trainer' }, { type: 'wild' }, { type: 'trainer' }, { type: 'wild' }],
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'heal' }, { type: 'trainer' }],
    ],
  },

  'mt-moon': {
    bg: 'assets/bg/mt-moon.png',
    combatBg: 'assets/bg/combate-cueva.png',
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
        name: 'Montañero', img: 'assets/sprites/trainers/montanero.png', rate: 100, pokemon: [
          { name: POKEMON.geodude, minLv: 14, maxLv: 16, moveId: MOVES.rock.physical.rock_throw },
          { name: POKEMON.geodude, minLv: 12, maxLv: 16, moveId: MOVES.rock.physical.rock_throw },
          { name: POKEMON.onix, minLv: 12, maxLv: 17, moveId: MOVES.ground.physical.bulldoze },
        ]
      },
    ]
  },

  'ruta-4': {
    bg: 'assets/bg/ruta-4.png',
    combatBg: 'assets/bg/combate.png',
    rewardPokemon: [POKEMON.spearow, POKEMON.pidgey],
    wild: [
      { name: POKEMON.pidgey, rate: 40, minLv: 10, maxLv: 14, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.spearow, rate: 40, minLv: 11, maxLv: 15, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.sandshrew, rate: 20, minLv: 11, maxLv: 15, moveId: MOVES.ground.physical.bulldoze },
    ],
    trainer: [],
    paths: [
      [{ type: 'wild' }, { type: 'wild' }],
    ],
  },

  'ciudad-celeste': {
    bg: 'assets/bg/ciudad-celeste.png',
    combatBg: 'assets/bg/combate-agua.png',
    wild: [],
    welcome: {
      title: 'Ciudad Celeste',
      subtitle: 'Gimnasio Pokemon de tipo Agua',
      img: 'assets/bg/ciudad-celeste.png',
    },
    gymLeader: 'Misty',
    gymType: 'water',
    badgeId: 'cascade-badge',
    gymLeaderImg: 'assets/sprites/trainers/misty.png',
    rewardExtras: [ITEM.choice_scarf],
    trainer: [
      {
        name: 'Nadador', img: 'assets/sprites/trainers/nadador.png', rate: 50, pokemon: [
          { name: POKEMON.horsea, minLv: 18, maxLv: 20, moveId: MOVES.water.special.water_gun },
          { name: POKEMON.shellder, minLv: 18, maxLv: 21, moveId: MOVES.ice.special.ice_beam },
        ]
      },
      {
        name: 'Dominguera', img: 'assets/sprites/trainers/dominguera.png', rate: 50, pokemon: [
          { name: POKEMON.goldeen, minLv: 22, maxLv: 23, moveId: MOVES.water.physical.crabhammer },
        ]
      },
    ],
    gym: {
      leader: [
        {
          name: POKEMON.staryu, level: 20, moveId: MOVES.water.special.surf,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spa: 32 },
          },
        },
        {
          name: POKEMON.starmie, level: 22, moveId: MOVES.psychic.special.confusion,
          overrides: {
            evs: { hp: 0, def: 0, spd: 0, spa: 20 },
            ivs: { hp: 0, def: 0, spd: 0, spa: 31 },
          },
        },
      ]
    },
    paths: [
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'leader' }],
      [{ type: 'trainer' }, { type: 'leader' }],
    ],
  },

  'ruta-24-1': {
    bg: 'assets/bg/ruta-24.png',
    combatBg: 'assets/bg/combate.png',
    rewardPokemon: [POKEMON.abra],
    wild: [],
    specialTrainer: {
      name: 'Azul', img: 'assets/sprites/trainers/rival_kanto.png', pokemon: [
        { name: POKEMON.abra, minLv: 14, maxLv: 14, moveId: MOVES.psychic.special.teleport },
        { name: POKEMON.pidgeotto, minLv: 16, maxLv: 20, moveId: MOVES.flying.physical.wing_attack },
        { name: 'RIVAL_STARTER_2', minLv: 18, maxLv: 24 },
      ]
    },
    trainer: [],
    paths: [
      [{ type: 'special' }]
    ],
  },

  'ruta-24-2': {
    bg: 'assets/bg/ruta-24.png',
    combatBg: 'assets/bg/combate.png',
    rewardPokemon: [POKEMON.oddish, POKEMON.onix, POKEMON.ivysaur, POKEMON.charmeleon, POKEMON.wartortle],
    wild: [
      { name: POKEMON.pidgey, rate: 40, minLv: 10, maxLv: 14, moveId: MOVES.flying.physical.peck },
    ],
    specialTrainer: {
      name: 'Soldado Rocket', img: 'assets/sprites/trainers/soldado-rocket.png', pokemon: [
        { name: POKEMON.golbat, minLv: 22, maxLv: 24, moveId: MOVES.poison.physical.poison_jab },
        { name: POKEMON.porygon, minLv: 24, maxLv: 26, moveId: MOVES.normal.special.tri_attack, heldItem: ITEM.assault_vest },
      ]
    },
    trainer: [
      {
        name: 'Cazabichos', img: 'assets/sprites/trainers/cazabichos.png', rate: 20, pokemon: [
          { name: POKEMON.metapod, minLv: 22, maxLv: 26, moveId: MOVES.bug.physical.bug_bite }
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name} aburrido`, img: ENTRENADORES.Campista.img, rate: 20, pokemon: [
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
        name: `${ENTRENADORES.Campista.name} fumao`, img: ENTRENADORES.Campista.img, rate: 10, pokemon: [
          { name: POKEMON.ivysaur, minLv: 22, maxLv: 26, moveId: MOVES.grass.special.magical_leaf }
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name} fogoso`, img: ENTRENADORES.Campista.img, rate: 10, pokemon: [
          { name: POKEMON.charmeleon, minLv: 22, maxLv: 26, moveId: MOVES.fire.special.flamethrower }
        ]
      },
      {
        name: `${ENTRENADORES.Campista.name} mojado`, img: ENTRENADORES.Campista.img, rate: 10, pokemon: [
          { name: POKEMON.wartortle, minLv: 22, maxLv: 26, moveId: MOVES.water.special.surf }
        ]
      },
    ],
    paths: [
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'trainer' }, { type: 'heal' }, { type: 'trainer' }, { type: 'trainer' }, { type: 'special' }]
    ],
  },

  'info-bill': {
    type: 'information',
    bg: 'assets/bg/ruta-25.png',
    title: 'Laboratorio de Bill',
    description: '<div style="display: flex; justify-content: center;"><img src="assets/sprites/others/bill.gif"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">Tienes una charla con Bill y vuelves al camino</p>',
    optional: {
      btnName: 'Visita el jardín de Bill',
      area: 'jardin-bill',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Gimasio de Lt. Surge (Ciudad Carmín)
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-5': {
    bg: 'assets/bg/ruta-5.png',
    combatBg: 'assets/bg/combate.png',
    rewardPokemon: [POKEMON.bellsprout, POKEMON.meowth],
    wild: [
      { name: POKEMON.bellsprout, rate: 45, minLv: 18, maxLv: 24, moveId: MOVES.grass.special.absorb },
      { name: POKEMON.meowth, rate: 45, minLv: 18, maxLv: 25, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.growlithe, rate: 10, minLv: 18, maxLv: 22, moveId: MOVES.normal.physical.extreme_speed },
    ],
    trainer: [],
    paths: [
      [{ type: 'wild' }, { type: 'wild' }, { type: 'wild' }],
      [{ type: 'wild' }, { type: 'wild' }, { type: 'wild' }],
      [{ type: 'wild' }, { type: 'wild' }, { type: 'wild' }]
    ],
  },

  'ruta-6': {
    bg: 'assets/bg/ruta-6.png',
    combatBg: 'assets/bg/combate.png',
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
    bg: 'assets/bg/ss-anne.png',
    title: 'SS Anne',
    description: '<div style="display: flex; justify-content: center;"><img src="assets/sprites/others/rojo.gif"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">¿Quien es ese tío?</p>',
  },

  'ss-anne': {
    bg: 'assets/bg/ss-anne.png',
    combatBg: 'assets/bg/combate-electrico.png',
    rewardPokemon: [POKEMON.magikarp, POKEMON.meowth],
    wild: [],
    specialTrainer: {
      name: `${ENTRENADORES.Pokemaniaco.name} Cgoob`, img: ENTRENADORES.Rojo.img, pokemon: [
        { name: POKEMON.butterfree, minLv: 25, maxLv: 31, moveId: MOVES.bug.special.signal_beam },
        { name: POKEMON.flareon, minLv: 25, maxLv: 29, moveId: MOVES.fire.special.flamethrower },
        { name: POKEMON.gyarados, minLv: 28, maxLv: 32, moveId: MOVES.water.physical.wave_crash, heldItem: ITEM.choice_scarf },
      ]
    },
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Special }]
    ],
  },

  'ciudad-carmin': {
    bg: 'assets/bg/ciudad-carmin.png',
    combatBg: 'assets/bg/combate-electrico.png',
    wild: [],
    welcome: {
      title: 'Ciudad Carmin',
      subtitle: 'Gimnasio Pokemon de tipo Eléctrico',
      img: 'assets/bg/ciudad-carmin.png',
    },
    gymLeader: 'Lt. Surge',
    gymType: 'electric',
    badgeId: 'thunder-badge',
    gymLeaderImg: 'assets/sprites/trainers/surge.png',
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
        {
          name: POKEMON.pikachu, level: 28, moveId: MOVES.electric.special.thunder_shock, heldItem: ITEM.light_ball
        },
        {
          name: POKEMON.voltorb, level: 30, moveId: MOVES.normal.special.hyper_voice
        },
        {
          name: POKEMON.raichu, level: 34, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs
        }
      ]
    },
    paths: [
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'trainer' }, { type: 'leader' }],
      [{ type: 'trainer' }, { type: 'trainer' }, { type: 'leader' }],
      [{ type: 'trainer' }, { type: 'leader' }]
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Guarida Rocket
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-9': {
    bg: 'assets/bg/ruta-9.png',
    combatBg: 'assets/bg/combate.png',
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
    bg: 'assets/bg/ruta-10.png',
    combatBg: 'assets/bg/combate.png',
    wild: [
      { name: POKEMON.voltorb, rate: 40, minLv: 22, maxLv: 26, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.spearow, rate: 15, minLv: 22, maxLv: 26, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.spearow, rate: 20, minLv: 22, maxLv: 26, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.ekans, rate: 25, minLv: 22, maxLv: 26, moveId: MOVES.poison.physical.poison_jab },
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
    bg: 'assets/bg/tunel-roca.png',
    title: 'Entrada del Tunel Roca',
    description: '<div style="display: flex; justify-content: center;"><img src="assets/sprites/others/montanero.gif"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">Un montañero bloquea la entrada al Tunel Roca</p>',
  },

  'entrada-tunel-roca': {
    bg: 'assets/bg/tunel-roca.png',
    combatBg: 'assets/bg/combate-cueva.png',
    rewardPokemon: [POKEMON.snorlax],
    wild: [],
    trainer: [],
    specialTrainer: {
      name: 'Montañero Ninja David', img: ENTRENADORES.Montanero.img, pokemon: [
        { name: POKEMON.slowpoke, minLv: 25, maxLv: 35, moveId: MOVES.water.special.surf },
        { name: POKEMON.psyduck, minLv: 22, maxLv: 31, moveId: MOVES.psychic.special.confusion },
        { name: POKEMON.drowzee, minLv: 25, maxLv: 35, moveId: MOVES.psychic.special.psychic },
        { name: POKEMON.snorlax, minLv: 25, maxLv: 35, moveId: MOVES.normal.physical.false_swipe, heldItem: ITEM.leftovers },
        { name: POKEMON.voltorb, minLv: 35, maxLv: 40, moveId: MOVES.normal.physical.self_destruct },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'tunel-roca': {
    bg: 'assets/bg/tunel-roca.png',
    combatBg: 'assets/bg/combate-cueva.png',
    rewardExtras: [ITEM.miracle_seed, ITEM.carbon, ITEM.assault_vest],
    wild: [
      { name: POKEMON.onix, rate: 40, minLv: 24, maxLv: 30, moveId: MOVES.rock.physical.rock_slide },
      { name: POKEMON.geodude, rate: 40, minLv: 24, maxLv: 30, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.machoke, rate: 30, minLv: 26, maxLv: 35, moveId: MOVES.fighting.physical.close_combat },
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
    bg: 'assets/bg/ciudad-azulona.png',
    combatBg: 'assets/bg/combate.png',
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
    bg: 'assets/bg/guarida-rocket.png',
    combatBg: 'assets/bg/combate-electrico.png',
    wild: [
      { name: POKEMON.voltorb, rate: 30, minLv: 30, maxLv: 32, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.electrode, rate: 30, minLv: 31, maxLv: 33, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.electrode, rate: 30, minLv: 31, maxLv: 33, moveId: MOVES.normal.physical.self_destruct },
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
    bg: 'assets/bg/oficina-rocket.png',
    title: 'Última planta Rocket',
    description: `<div style="display: flex; justify-content: center;"><img src="${ENTRENADORES.Giovanni.gif}"></div><br><p style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;font-family: var(--font-pixel);font-size: 8px;color: rgba(255, 255, 255, .85);line-height: 1.8;">¡Prepárate para el combate!</p>`,
  },

  'combate-giovanni': {
    bg: 'assets/bg/oficina-rocket.png',
    combatBg: 'assets/bg/combate-rocket.png',
    wild: [],
    trainer: [],
    specialTrainer: {
      name: 'Jefe Giovanni', img: ENTRENADORES.Giovanni.img, pokemon: [
        {
          name: POKEMON.onix, minLv: 32, maxLv: 37, moveId: MOVES.rock.physical.rock_slide,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 },
          },
        },
        {
          name: POKEMON.rhyhorn, minLv: 32, maxLv: 40, moveId: MOVES.ground.physical.earthquake,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 },
          },
        },
        {
          name: POKEMON.kangaskhan, minLv: 40, maxLv: 45, moveId: MOVES.normal.physical.extreme_speed,
          heldItem: ITEM.lifeorb,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32 },
          },
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
    bg: 'assets/bg/ciudad-azulona.png',
    combatBg: 'assets/bg/combate-electrico.png',
    wild: [],
    welcome: {
      title: 'Gimnasio de Ciudad Azulona',
      subtitle: 'Gimnasio Pokemon de tipo Planta',
      img: 'assets/bg/ciudad-azulona.png',
    },
    gymLeader: 'Erika',
    gymType: 'grass',
    badgeId: 'rainbow-badge',
    gymLeaderImg: 'assets/sprites/trainers/erika.png',
    rewardPokemon: [POKEMON.tangela],
    rewardExtras: [],
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
            overrides: {
              evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
            },
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
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
          },
        },
        {
          name: POKEMON.exeggutor, level: 39, moveId: MOVES.psychic.special.psychic,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
          },
        },
        {
          name: POKEMON.tangela, level: 38, moveId: MOVES.grass.physical.wood_hammer,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
          },
        },
        {
          name: POKEMON.vileplume, level: 42, moveId: MOVES.grass.special.giga_drain,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
          },
        }
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }],
      [{ type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Trainer }, { type: PATH_TYPE.Lider }]
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Torre Pokémon
  // ═══════════════════════════════════════════════════════════════════════

  'torre-pokemon': {
    bg: 'assets/bg/torre-pokemon.png',
    combatBg: 'assets/bg/combate-interior.png',
    pathLength: 5,
    wild: [
      { name: POKEMON.gastly, rate: 30, minLv: 35, maxLv: 42, moveId: MOVES.ghost.special.shadow_ball },
      { name: POKEMON.gastly, rate: 30, minLv: 35, maxLv: 42, moveId: MOVES.ghost.special.hex },
      { name: POKEMON.haunter, rate: 30, minLv: 35, maxLv: 42, moveId: MOVES.ghost.special.shadow_ball },
      { name: POKEMON.cubone, rate: 10, minLv: 35, maxLv: 42, moveId: MOVES.ground.physical.earthquake },
    ],
    trainer: [
      {
        name: `${ENTRENADORES.Rocket.name}`, img: ENTRENADORES.Rocket.img, rate: 20, pokemon: [
          { name: POKEMON.voltorb, minLv: 35, maxLv: 42, moveId: MOVES.electric.special.thunder },
          { name: POKEMON.electrode, minLv: 35, maxLv: 42, moveId: MOVES.normal.special.hyper_voice },
        ]
      },
    ],
  },

  'ultima-planta-torre-pokemon': {
    type: 'information',
    bg: 'assets/bg/torre-pokemon.png',
    title: 'Última planta',
    description: '<div style="display:flex;justify-content:center"><img src="assets/sprites/others/gastly.gif"></div><br><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">Ya has terminado aquí, pero hay una planta mas...</p>',
    optional: {
      btnName: 'Subir a la última planta',
      area: 'combate-victor',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Ciudad Fucsia
  // ═══════════════════════════════════════════════════════════════════════

  'ruta-15': {
    bg: 'assets/bg/ruta-15.png',
    combatBg: 'assets/bg/combate-hierba-alta.png',
    wild: [
      { name: POKEMON.pidgeotto, rate: 25, minLv: 38, maxLv: 44, moveId: MOVES.flying.physical.brave_bird },
      { name: POKEMON.venonat, rate: 25, minLv: 38, maxLv: 44, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.gloom, rate: 25, minLv: 38, maxLv: 44, moveId: MOVES.grass.special.magical_leaf },
      { name: POKEMON.weepinbell, rate: 20, minLv: 38, maxLv: 44, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.ditto, rate: 5, minLv: 38, maxLv: 44, moveId: MOVES.normal.special.tri_attack },
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }],
      [{ type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }, { type: PATH_TYPE.Wild }]
    ]
  },

  'ciudad-fucsia': {
    type: 'information',
    bg: 'assets/bg/ciudad-fucsia.png',
    title: 'Ciudad Fucsia',
    description: 'Puedes ir directo al gimnasio o también podrías...',
    optional: {
      btnName: 'Explorar la Zona Safari',
      area: 'zona-safari',
    },
  },

  'ciudad-fucsia-gym': {
    bg: 'assets/bg/ciudad-fucsia.png',
    combatBg: 'assets/bg/combate-interior.png',
    wild: [],
    welcome: {
      title: 'Ciudad Fucsia',
      subtitle: 'Gimnasio Pokemon de tipo Veneno',
      img: 'assets/bg/ciudad-fucsia.png',
    },
    gymLeader: 'Koga',
    gymType: 'poison',
    badgeId: 'soul-badge',
    gymLeaderImg: 'assets/sprites/trainers/koga.png',
    trainer: [],
    gym: {
      leader: [
        {
          name: POKEMON.koffing, level: 47, moveId: MOVES.poison.special.sludge_bomb,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32 },
          },
        },
        {
          name: POKEMON.koffing, level: 45, moveId: MOVES.normal.physical.self_destruct,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32 },
          },
        },
        {
          name: POKEMON.muk, level: 47, moveId: MOVES.dark.special.dark_pulse,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32 },
          },
        },
        {
          name: POKEMON.weezing, level: 52, moveId: MOVES.poison.special.sludge_wave,
          heldItem: ITEM.safety_goggles,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32 },
          },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Lider }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Extra
  // ═══════════════════════════════════════════════════════════════════════

  'espacio-raro': {
    bg: 'assets/bg/espacio-raro.png',
    combatBg: 'assets/bg/combate-espacio-raro.png',
    rewardPokemon: [POKEMON.mew],
    wild: [
      {
        name: POKEMON.mewtwo, rate: 100, minLv: 60, maxLv: 70, moveId: [MOVES.psychic.special.trick, MOVES.fighting.special.focus_blast],
        overrides: {
          evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
        },
      }
    ],
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  // ── Ejemplo de ruta type:'information' ────────────────────────────────
  // Sin caminos ni combates. Se muestra título + descripción + un botón
  // "CONTINUAR" que avanza directamente a la siguiente ruta de KANTO_ROUTES.
  // Para usarla, añade su 'area' (p.ej. 'info-ejemplo') a KANTO_ROUTES en
  // la posición donde quieras que aparezca.
  'info-final': {
    type: 'information',
    bg: 'assets/bg/final.png',
    title: '¡Enhorabuena!',
    description: 'Has superado este tramo de tu aventura.<br>En el futuro se desbloqueará nuevo contenido.',
  },
  // ═══════════════════════════════════════════════════════════════════════
  // OPCIONALES
  // ═══════════════════════════════════════════════════════════════════════

  'pueblo-paleta-1': {
    bg: 'assets/bg/pueblo-paleta.png',
    combatBg: 'assets/bg/combate.png',
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
      name: 'Azul', img: 'assets/sprites/trainers/rival_kanto.png', pokemon: [
        { name: 'RIVAL_STARTER', minLv: 5, maxLv: 7 },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }, { type: PATH_TYPE.Wild }],
    ],
  },

  'jardin-bill': {
    bg: 'assets/bg/ruta-25.png',
    combatBg: 'assets/bg/combate.png',
    title: 'Jardín de Bill',
    rewardPokemon: [POKEMON.pinsir],
    rewardExtras: [ITEM.flame_orb, ITEM.safety_goggles],
    wild: [],
    trainer: [
      {
        name: 'Adrián el dominguero', img: 'assets/sprites/trainers/campista.png', rate: 100, pokemon: [
          { name: POKEMON.mr_mime, minLv: 25, maxLv: 30, moveId: MOVES.psychic.special.psychic },
          { name: POKEMON.pinsir, minLv: 26, maxLv: 34, moveId: MOVES.bug.physical.megahorn, shiny: true },
        ]
      },
    ],
    paths: [
      [{ type: 'trainer' }],
    ],
  },

  'combate-victor': {
    bg: 'assets/bg/torre-pokemon.png',
    combatBg: 'assets/bg/combate-interior.png',
    title: 'Última planta de la torre',
    wild: [],
    trainer: [],
    rewardPokemon: [POKEMON.kangaskhan],
    rewardExtras: [ITEM.lifeorb],
    specialTrainer: {
      name: 'Atlético Víctor', img: ENTRENADORES.ChicoGuay.img, pokemon: [
        {
          name: POKEMON.marowak, minLv: 38, maxLv: 43, moveId: MOVES.normal.physical.extreme_speed
        },
        {
          name: POKEMON.pikachu, minLv: 38, maxLv: 43, moveId: MOVES.electric.special.thunder
        },
        {
          name: POKEMON.chansey, minLv: 38, maxLv: 43, moveId: MOVES.normal.special.hyper_voice
        },
        {
          name: POKEMON.charizard, minLv: 38, maxLv: 43, moveId: MOVES.fire.special.fire_blast
        },
        {
          name: POKEMON.gengar, minLv: 40, maxLv: 45, moveId: MOVES.ghost.special.astral_barrage,
          heldItem: ITEM.sitrus_berry,
          overrides: {
            evs: { hp: 32, def: 32, spd: 32, spe: 32, atk: 32, spa: 32 },
          },
        },
      ]
    },
    paths: [
      [{ type: PATH_TYPE.Special }],
    ],
  },

  'zona-safari': {
    bg: 'assets/bg/zona-safari.png',
    combatBg: 'assets/bg/combate.png',
    title: 'Zona Safari',
    rewardExtras: [ITEM.lifeorb],
    wildExclude: [
      POKEMON.mewtwo,
      POKEMON.mew,
      POKEMON.zapdos,
      POKEMON.moltres,
      POKEMON.articuno,
      POKEMON.dragonite,
      POKEMON.dragonair
    ],
    wildLevel: { min: 30, max: 45 },
    get wild() {
      const exclude = this.wildExclude ?? [];
      const { min, max } = this.wildLevel ?? { min: 30, max: 45 };
      return Object.keys(POKEMON_DB)
        .filter(name => !exclude.includes(name))
        .map(name => ({ name, rate: 1, minLv: min, maxLv: max }));
    },
    trainer: [],
    paths: [
      [{ type: PATH_TYPE.Wild }],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Ejemplos
  // ═══════════════════════════════════════════════════════════════════════

  'dev-ruta-opcional': {
    type: 'information',
    bg: 'assets/bg/bosque-verde.png',
    title: 'Cruce de Caminos',
    description: '<div style="display:flex;justify-content:center"><img src="assets/sprites/others/montanero.gif"></div><br><p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">El camino principal sigue al norte. Al este se oye algo en el bosque...</p>',
    optional: {
      btnName: 'Explorar el bosque',
      area: 'route-22',
    },
  },

};

// ── Pantalla final ────────────────────────────────────────
// Personaliza título, subtítulo (HTML permitido), fondo y texto del botón
// de la pantalla de victoria final (Screens.victory). Si se omite o se
// dejan campos sin definir, se usan los valores por defecto.
var FINAL_SCREEN = {
  title: '¡HAS GANADO!',
  subtitle: 'Enhorabuena, gracias por jugar!', // opcional — si se omite, usa la última medalla obtenida
  bg: 'assets/bg/final.png',
  btnText: 'NUEVA PARTIDA',
};

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

  //Final
  { name: '???', area: 'espacio-raro' },
  { name: 'Final', area: 'info-final' }
];

// ── Helpers ────────────────────────────────────────────────────────────────

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

function ObtenerSegundoInicial(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return [POKEMON.charmander, POKEMON.squirtle];
  if (playerPokemon === POKEMON.charmander) return [POKEMON.bulbasaur, POKEMON.squirtle];
  if (playerPokemon === POKEMON.squirtle) return [POKEMON.bulbasaur, POKEMON.charmander];
  return [POKEMON.eevee, POKEMON.pikachu];
}

function pickInitialPokemonRival(playerPokemon) { //Debe elegirse el pokemon inicial del rival según el inicial del jugador
  if (playerPokemon === POKEMON.bulbasaur) return POKEMON.charmander;
  if (playerPokemon === POKEMON.charmander) return POKEMON.squirtle;
  if (playerPokemon === POKEMON.squirtle) return POKEMON.bulbasaur;
  return POKEMON.eevee; // Default fallback
}

// Segunda forma del contra-tipo del starter del jugador.
// Usar con el marcador 'RIVAL_STARTER_2' en specialTrainer.pokemon (ver README sección 2).
function pickRivalSecondForm(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return POKEMON.charmeleon;
  if (playerPokemon === POKEMON.charmander) return POKEMON.wartortle;
  if (playerPokemon === POKEMON.squirtle) return POKEMON.ivysaur;
  return POKEMON.eevee; // fallback
}

// Tercera forma (evolución final) del contra-tipo del starter del jugador.
// Usar con el marcador 'RIVAL_STARTER_3' en specialTrainer.pokemon.
function pickRivalThirdForm(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur) return POKEMON.charizard;
  if (playerPokemon === POKEMON.charmander) return POKEMON.blastoise;
  if (playerPokemon === POKEMON.squirtle) return POKEMON.venusaur;
  return POKEMON.eevee; // fallback
}

function generatePaths(area) {
  const data = ROUTE_DATA[area];
  if (!data) return [];

  // Paths hardcodeados — pueden tener cualquier longitud
  if (data.paths) return data.paths;

  // Longitud configurable por ruta (por defecto 3)
  const len = data.pathLength ?? 3;

  // Genera combinaciones con al menos 1 entrenador y 1 salvaje si len >= 2
  // Para len == 1 o len > 4 simplifica a combinaciones aleatorias
  var templates = [];
  if (len === 2) {
    templates = [
      ['trainer', 'wild'],
      ['wild', 'trainer'],
      ['trainer', 'trainer'],
      ['wild', 'wild'],
    ];
  } else if (len === 3) {
    templates = [
      ['wild', 'wild', 'wild'],
      ['trainer', 'wild', 'wild'],
      ['wild', 'trainer', 'wild'],
      ['wild', 'wild', 'trainer'],
      ['trainer', 'trainer', 'wild'],
      ['wild', 'trainer', 'trainer'],
      ['trainer', 'trainer', 'trainer'],
      ['trainer', 'heal', 'trainer'],
    ];
  } else {
    // Para cualquier otra longitud, genera combinaciones aleatorias
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
