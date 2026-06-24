// ─────────────────────────────────────────────────────────────────────────────
// BATTLE FRONTIER — FLOORS
//
// Requiere routes-assets.js y routes-constants.js cargados antes.
// Globals disponibles: MOVES, POKEMON, ENTRENADORES, TRAINER_IMG, COMBAT_BG,
//                      ITEM, TM_LIST
//
// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES GLOBALES
// ═══════════════════════════════════════════════════════════════════════════
//
//   BF_SHINY_RATE     — ratio de shiny para recompensas de piso (aumentado)
//   BF_NO_EXP         — los combates del Frente Batalla no dan experiencia
//   BF_TRAINER_POOL   — pool global de entrenadores aleatorios (niveles 1-10)
//   BF_FLOORS         — array de definiciones de piso
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE BF_TRAINER_POOL
// ═══════════════════════════════════════════════════════════════════════════
//
//   level   {number}  — dificultad del entrenador (1 = fácil, 10 = difícil)
//   rate    {number}  — peso de selección entre entrenadores del mismo nivel
//   name    {string}  — nombre visible en combate
//   img     {string}  — ruta al sprite del entrenador
//   pokemon {Array}   — equipo del entrenador (TODOS con level: 50 fijo)
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE BF_FLOORS
// ═══════════════════════════════════════════════════════════════════════════
//
//   id                {string}  — identificador único del piso
//   name              {string}  — nombre mostrado en pantalla
//   battleRange       {[n, n]}  — [primerCombate, últimoCombate] (inclusivo)
//   trainerLevelRange {[n, n]}  — niveles del pool a usar en este piso
//   combatBg          {string}  — fondo de combate (COMBAT_BG.xxx)
//
//   specialTrainer  (opcional) — reemplaza al entrenador aleatorio en un
//                                combate concreto
//     .battleNumber {number}   — número de combate que ocupa (dentro del piso)
//     .name / .img / .pokemon  — igual que un entrenador del pool
//
//   reward          (opcional) — recompensa al terminar el piso.
//                                Solo en pisos cuyo últimoCombate es múltiplo de 10.
//     .pokemon {Array}  — POKEMON.xxx disponibles como recompensa de pokemon
//     .tm      {Array}  — objetos TM_LIST['tm-xxx'] disponibles como recompensa
//     .item    {Array}  — ids de objeto via ITEM.xxx disponibles como recompensa
//
// Nota: BF_NO_EXP = true → ningún combate del Frente Batalla otorga EXP.
// ─────────────────────────────────────────────────────────────────────────────

const BF_SHINY_RATE = 1 / 10;
const BF_NO_EXP = true;

// ═══════════════════════════════════════════════════════════════════════════════
// POOL DE ENTRENADORES
// Todos los Pokémon usan level: 50 fijo.
// El nivel del entrenador (1-10) indica su dificultad, no el nivel de sus mons.
// ═══════════════════════════════════════════════════════════════════════════════

const BF_TRAINER_POOL = [

  // ── Nivel 1 — Un Pokémon básico ───────────────────────────────────────────
  {
    level: 1, rate: 35, 
    name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img,
    pokemon: [
      { name: POKEMON.rattata, level: 50, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.rattata, level: 50, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.rattata, level: 50, moveId: MOVES.normal.physical.tackle },
    ]
  },
  {
    level: 1, rate: 35,
    name: ENTRENADORES.Cazabichos.name, img: ENTRENADORES.Cazabichos.img,
    pokemon: [
      { name: POKEMON.caterpie, level: 50, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.caterpie, level: 50, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.caterpie, level: 50, moveId: MOVES.bug.physical.bug_bite },
    ]
  },
  {
    level: 1, rate: 30,
    name: ENTRENADORES.Chica.name, img: ENTRENADORES.Chica.img,
    pokemon: [
      { name: POKEMON.pidgey, level: 50, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.pidgey, level: 50, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.pidgey, level: 50, moveId: MOVES.flying.physical.peck },
    ]
  },

  // ── Nivel 2 — Dos Pokémon básicos ─────────────────────────────────────────
  {
    level: 2, rate: 35,
    name: ENTRENADORES.Campista.name, img: ENTRENADORES.Campista.img,
    pokemon: [
      { name: POKEMON.nidoran_m, level: 50, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_f, level: 50, moveId: MOVES.poison.physical.poison_sting },
    ]
  },
  {
    level: 2, rate: 35,
    name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img,
    pokemon: [
      { name: POKEMON.rattata, level: 50, moveId: MOVES.normal.physical.hyper_fang },
      { name: POKEMON.spearow, level: 50, moveId: MOVES.flying.physical.wing_attack },
    ]
  },
  {
    level: 2, rate: 30,
    name: ENTRENADORES.Dominguera.name, img: ENTRENADORES.Dominguera.img,
    pokemon: [
      { name: POKEMON.clefairy, level: 50, moveId: MOVES.normal.special.hyper_voice },
      { name: POKEMON.jigglypuff, level: 50, moveId: MOVES.fairy.special.disarming_voice },
    ]
  },

  // ── Nivel 3 — Pokémon intermedios, dos en equipo ──────────────────────────
  {
    level: 3, rate: 35,
    name: ENTRENADORES.Montanero.name, img: ENTRENADORES.Montanero.img,
    pokemon: [
      { name: POKEMON.geodude, level: 50, moveId: MOVES.rock.physical.rock_throw },
      { name: POKEMON.onix, level: 50, moveId: MOVES.rock.physical.rock_slide },
    ]
  },
  {
    level: 3, rate: 35,
    name: ENTRENADORES.Campista.name, img: ENTRENADORES.Campista.img,
    pokemon: [
      { name: POKEMON.sandshrew, level: 50, moveId: MOVES.ground.physical.bulldoze },
      { name: POKEMON.ekans, level: 50, moveId: MOVES.poison.physical.poison_jab },
    ]
  },
  {
    level: 3, rate: 30,
    name: ENTRENADORES.EntrenadorJoven.name, img: ENTRENADORES.EntrenadorJoven.img,
    pokemon: [
      { name: POKEMON.mankey, level: 50, moveId: MOVES.fighting.physical.karate_chop },
      { name: POKEMON.meowth, level: 50, moveId: MOVES.normal.physical.extreme_speed },
    ]
  },

  // ── Nivel 4 — Pokémon evolucionados intermedios ───────────────────────────
  {
    level: 4, rate: 35,
    name: ENTRENADORES.Caballero.name, img: ENTRENADORES.Caballero.img,
    pokemon: [
      { name: POKEMON.machop, level: 50, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.graveler, level: 50, moveId: MOVES.rock.physical.rock_slide },
    ]
  },
  {
    level: 4, rate: 35,
    name: ENTRENADORES.Dominguera.name, img: ENTRENADORES.Dominguera.img,
    pokemon: [
      { name: POKEMON.oddish, level: 50, moveId: MOVES.grass.special.magical_leaf },
      { name: POKEMON.bellsprout, level: 50, moveId: MOVES.poison.special.sludge_bomb },
    ]
  },
  {
    level: 4, rate: 30,
    name: ENTRENADORES.ChicoGuay.name, img: ENTRENADORES.ChicoGuay.img,
    pokemon: [
      { name: POKEMON.pikachu, level: 50, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.jigglypuff, level: 50, moveId: MOVES.normal.special.hyper_voice },
    ]
  },

  // ── Nivel 5 — Dos Pokémon de buena base, movimientos fuertes ──────────────
  {
    level: 5, rate: 35,
    name: ENTRENADORES.Mecanico.name, img: ENTRENADORES.Mecanico.img,
    pokemon: [
      { name: POKEMON.magnemite, level: 50, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.voltorb, level: 50, moveId: MOVES.electric.special.thunderbolt },
    ]
  },
  {
    level: 5, rate: 35,
    name: ENTRENADORES.Pokemaniaco.name, img: ENTRENADORES.Pokemaniaco.img,
    pokemon: [
      { name: POKEMON.drowzee, level: 50, moveId: MOVES.psychic.special.psychic },
      { name: POKEMON.slowpoke, level: 50, moveId: MOVES.water.special.surf },
    ]
  },
  {
    level: 5, rate: 30,
    name: ENTRENADORES.ChicaGuay.name, img: ENTRENADORES.ChicaGuay.img,
    pokemon: [
      { name: POKEMON.paras, level: 50, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.scyther, level: 50, moveId: MOVES.bug.physical.x_scissor },
    ]
  },

  // ── Nivel 6 — Tres Pokémon evolucionados ──────────────────────────────────
  {
    level: 6, rate: 35,
    name: ENTRENADORES.Montanero.name, img: ENTRENADORES.Montanero.img,
    pokemon: [
      { name: POKEMON.graveler, level: 50, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.machoke, level: 50, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.rhydon, level: 50, moveId: MOVES.ground.physical.earthquake },
    ]
  },
  {
    level: 6, rate: 35,
    name: ENTRENADORES.Ladron.name, img: ENTRENADORES.Ladron.img,
    pokemon: [
      { name: POKEMON.grimer, level: 50, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.koffing, level: 50, moveId: MOVES.poison.special.sludge_wave },
      { name: POKEMON.muk, level: 50, moveId: MOVES.dark.special.dark_pulse },
    ]
  },
  {
    level: 6, rate: 30,
    name: ENTRENADORES.Mecanico.name, img: ENTRENADORES.Mecanico.img,
    pokemon: [
      { name: POKEMON.electrode, level: 50, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.magneton, level: 50, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.voltorb, level: 50, moveId: MOVES.normal.physical.self_destruct },
    ]
  },

  // ── Nivel 7 — Tres Pokémon especiales, alta potencia ──────────────────────
  {
    level: 7, rate: 35,
    name: ENTRENADORES.Mecanico.name, img: ENTRENADORES.Mecanico.img,
    pokemon: [
      { name: POKEMON.electabuzz, level: 50, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.jynx, level: 50, moveId: MOVES.ice.special.ice_beam },
      { name: POKEMON.magmar, level: 50, moveId: MOVES.fire.special.flamethrower },
    ]
  },
  {
    level: 7, rate: 35,
    name: ENTRENADORES.Cientifico.name, img: ENTRENADORES.Cientifico.img,
    pokemon: [
      { name: POKEMON.haunter, level: 50, moveId: MOVES.ghost.special.shadow_ball },
      { name: POKEMON.hypno, level: 50, moveId: MOVES.psychic.special.psychic },
      { name: POKEMON.drowzee, level: 50, moveId: MOVES.psychic.special.psychic },
    ]
  },
  {
    level: 7, rate: 30,
    name: ENTRENADORES.ChicoGuay.name, img: ENTRENADORES.ChicoGuay.img,
    pokemon: [
      { name: POKEMON.scyther, level: 50, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.pinsir, level: 50, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.tauros, level: 50, moveId: MOVES.normal.physical.take_down },
    ]
  },

  // ── Nivel 8 — Tres finales de evolución o pseudo-legendarios ──────────────
  {
    level: 8, rate: 35,
    name: ENTRENADORES.Caballero.name, img: ENTRENADORES.Caballero.img,
    pokemon: [
      { name: POKEMON.golem, level: 50, moveId: MOVES.ground.physical.earthquake },
      { name: POKEMON.nidoking, level: 50, moveId: MOVES.ground.physical.earthquake },
      { name: POKEMON.nidoqueen, level: 50, moveId: MOVES.poison.physical.gunk_shot },
    ]
  },
  {
    level: 8, rate: 35,
    name: ENTRENADORES.ChicaGuay.name, img: ENTRENADORES.ChicaGuay.img,
    pokemon: [
      { name: POKEMON.vaporeon, level: 50, moveId: MOVES.water.special.surf },
      { name: POKEMON.jolteon, level: 50, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.flareon, level: 50, moveId: MOVES.fire.special.flamethrower },
    ]
  },
  {
    level: 8, rate: 30,
    name: ENTRENADORES.Cientifico.name, img: ENTRENADORES.Cientifico.img,
    pokemon: [
      { name: POKEMON.alakazam, level: 50, moveId: MOVES.psychic.special.psychic },
      { name: POKEMON.gengar, level: 50, moveId: MOVES.ghost.special.shadow_ball },
      { name: POKEMON.starmie, level: 50, moveId: MOVES.water.special.surf },
    ]
  },

  // ── Nivel 9 — Finales poderosos con objetos ───────────────────────────────
  {
    level: 9, rate: 35,
    name: ENTRENADORES.Pokemaniaco.name, img: ENTRENADORES.Pokemaniaco.img,
    pokemon: [
      { name: POKEMON.machamp, level: 50, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.choice_band },
      { name: POKEMON.arcanine, level: 50, moveId: MOVES.normal.physical.extreme_speed, heldItem: ITEM.lifeorb },
      { name: POKEMON.lapras, level: 50, moveId: MOVES.ice.special.ice_beam, heldItem: ITEM.leftovers },
    ]
  },
  {
    level: 9, rate: 35,
    name: ENTRENADORES.Cientifico.name, img: ENTRENADORES.Cientifico.img,
    pokemon: [
      { name: POKEMON.alakazam, level: 50, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs },
      { name: POKEMON.gengar, level: 50, moveId: MOVES.ghost.special.shadow_ball, heldItem: ITEM.lifeorb },
      { name: POKEMON.dragonair, level: 50, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf },
    ]
  },
  {
    level: 9, rate: 30,
    name: ENTRENADORES.ChicoGuay.name, img: ENTRENADORES.ChicoGuay.img,
    pokemon: [
      { name: POKEMON.charizard, level: 50, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.lifeorb },
      { name: POKEMON.blastoise, level: 50, moveId: MOVES.water.special.surf, heldItem: ITEM.leftovers },
      { name: POKEMON.venusaur, level: 50, moveId: MOVES.grass.special.giga_drain, heldItem: ITEM.assault_vest },
    ]
  },

  // ── Nivel 10 — Élite con objetos, máxima dificultad ──────────────────────
  {
    level: 10, rate: 35,
    name: ENTRENADORES.Pokemaniaco.name, img: ENTRENADORES.Pokemaniaco.img,
    pokemon: [
      { name: POKEMON.dragonite, level: 50, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf },
      { name: POKEMON.snorlax, level: 50, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.leftovers },
      { name: POKEMON.tauros, level: 50, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.choice_band },
    ]
  },
  {
    level: 10, rate: 35,
    name: ENTRENADORES.Cientifico.name, img: ENTRENADORES.Cientifico.img,
    pokemon: [
      { name: POKEMON.mewtwo, level: 50, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs },
      { name: POKEMON.alakazam, level: 50, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.lifeorb },
      { name: POKEMON.gengar, level: 50, moveId: MOVES.ghost.special.shadow_ball, heldItem: ITEM.lifeorb },
    ]
  },
  {
    level: 10, rate: 30,
    name: ENTRENADORES.ChicaGuay.name, img: ENTRENADORES.ChicaGuay.img,
    pokemon: [
      { name: POKEMON.vaporeon, level: 50, moveId: MOVES.water.special.surf, heldItem: ITEM.leftovers },
      { name: POKEMON.jolteon, level: 50, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs },
      { name: POKEMON.flareon, level: 50, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.lifeorb },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PISOS DEL FRENTE BATALLA
//
// Los pisos se organizan en pares (A / B) por cada bloque de 10 combates.
// El segundo piso del par siempre tiene recompensa y puede tener specialTrainer.
//
//   Combates  1-10  → Pisos 1A y 1B  (trainer levels 1-2)
//   Combates 11-20  → Pisos 2A y 2B  (trainer levels 2-3)
//   Combates 21-30  → Pisos 3A y 3B  (trainer levels 3-4)
//   Combates 31-40  → Pisos 4A y 4B  (trainer levels 4-5)
//   Combates 41-50  → Pisos 5A y 5B  (trainer levels 5-6)
//   Combates 51-60  → Pisos 6A y 6B  (trainer levels 6-7)
//   Combates 61-70  → Pisos 7A y 7B  (trainer levels 7-8)
//   Combates 71-80  → Pisos 8A y 8B  (trainer levels 8-9)
//   Combates 81-90  → Pisos 9A y 9B  (trainer levels 9-10)
//   Combates 91-100 → Pisos 10A y 10B (trainer levels 9-10)
// ═══════════════════════════════════════════════════════════════════════════════

const BF_FLOORS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 1 — Combates 1-10
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-1a',
    name: 'Piso 1',
    battleRange: [1, 5],
    trainerLevelRange: [1, 2],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-1b',
    name: 'Piso 2',
    battleRange: [6, 10],
    trainerLevelRange: [1, 2],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 10,
      name: ENTRENADORES.Rival.name, img: ENTRENADORES.Rival.img,
      pokemon: [
        { name: POKEMON.nidorino, level: 50, moveId: MOVES.poison.physical.poison_jab },
        { name: POKEMON.pidgeotto, level: 50, moveId: MOVES.flying.physical.wing_attack },
        { name: POKEMON.wartortle, level: 50, moveId: [MOVES.water.special.water_gun, MOVES.ice.physical.ice_punch], heldItem: ITEM.eviolite },
      ]
    },
    reward: {
      pokemon: [POKEMON.eevee, POKEMON.scyther, POKEMON.pinsir],
      tm: [TM_LIST['tm-thunderbolt'], TM_LIST['tm-ice-beam'], TM_LIST['tm-surf']],
      item: [ITEM.sitrus_berry, ITEM.eviolite, ITEM.choice_scarf],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 2 — Combates 11-20
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-2a',
    name: 'Piso 3',
    battleRange: [11, 15],
    trainerLevelRange: [2, 3],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-2b',
    name: 'Piso 4',
    battleRange: [16, 20],
    trainerLevelRange: [2, 3],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 20,
      name: 'Brock', img: TRAINER_IMG.brock,
      pokemon: [
        { name: POKEMON.geodude, level: 50, moveId: MOVES.rock.physical.rock_slide },
        { name: POKEMON.onix, level: 50, moveId: MOVES.ground.physical.earthquake },
      ]
    },
    reward: {
      pokemon: [POKEMON.hitmonlee, POKEMON.hitmonchan, POKEMON.chansey],
      tm: [TM_LIST['tm-earth-power'], TM_LIST['tm-stomping-tantrum'], TM_LIST['tm-facade']],
      item: [ITEM.leftovers, ITEM.assault_vest, ITEM.choice_band],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 3 — Combates 21-30
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-3a',
    name: 'Piso 5',
    battleRange: [21, 25],
    trainerLevelRange: [3, 4],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-3b',
    name: 'Piso 6',
    battleRange: [26, 30],
    trainerLevelRange: [3, 4],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 30,
      name: 'Misty', img: TRAINER_IMG.misty,
      pokemon: [
        { name: POKEMON.staryu, level: 50, moveId: MOVES.water.special.surf },
        { name: POKEMON.starmie, level: 50, moveId: [MOVES.water.special.surf, MOVES.psychic.special.psychic] },
      ]
    },
    reward: {
      pokemon: [POKEMON.lapras, POKEMON.vaporeon, POKEMON.starmie],
      tm: [TM_LIST['tm-surf'], TM_LIST['tm-scald'], TM_LIST['tm-ice-beam']],
      item: [ITEM.mystic_water, ITEM.choice_specs, ITEM.lifeorb],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 4 — Combates 31-40
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-4a',
    name: 'Piso 7',
    battleRange: [31, 35],
    trainerLevelRange: [4, 5],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-4b',
    name: 'Piso 8',
    battleRange: [36, 40],
    trainerLevelRange: [4, 5],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 40,
      name: 'Lt. Surge', img: TRAINER_IMG.surge,
      pokemon: [
        { name: POKEMON.pikachu, level: 50, moveId: MOVES.electric.special.thunderbolt },
        { name: POKEMON.raichu, level: 50, moveId: MOVES.electric.special.thunder },
        { name: POKEMON.electrode, level: 50, moveId: MOVES.electric.special.thunder },
      ]
    },
    reward: {
      pokemon: [POKEMON.jolteon, POKEMON.electabuzz, POKEMON.magneton],
      tm: [TM_LIST['tm-thunderbolt'], TM_LIST['tm-tri-attack'], TM_LIST['tm-giga-drain']],
      item: [ITEM.choice_scarf, ITEM.lifeorb, ITEM.safety_goggles],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 5 — Combates 41-50
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-5a',
    name: 'Piso 9',
    battleRange: [41, 45],
    trainerLevelRange: [5, 6],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-5b',
    name: 'Piso 10',
    battleRange: [46, 50],
    trainerLevelRange: [5, 6],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 50,
      name: 'Erika', img: TRAINER_IMG.erika,
      pokemon: [
        { name: POKEMON.tangela, level: 50, moveId: MOVES.grass.special.giga_drain },
        { name: POKEMON.weepinbell, level: 50, moveId: MOVES.poison.special.sludge_bomb },
        { name: POKEMON.vileplume, level: 50, moveId: [MOVES.grass.special.giga_drain, MOVES.poison.special.sludge_bomb] },
      ]
    },
    reward: {
      pokemon: [POKEMON.snorlax, POKEMON.tauros, POKEMON.lapras],
      tm: [TM_LIST['tm-giga-drain'], TM_LIST['tm-flower-trick'], TM_LIST['tm-earth-power']],
      item: [ITEM.miracle_seed, ITEM.assault_vest, ITEM.leftovers],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 6 — Combates 51-60
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-6a',
    name: 'Piso 11',
    battleRange: [51, 55],
    trainerLevelRange: [6, 7],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-6b',
    name: 'Piso 12',
    battleRange: [56, 60],
    trainerLevelRange: [6, 7],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 60,
      name: 'Koga', img: TRAINER_IMG.koga,
      pokemon: [
        { name: POKEMON.koffing, level: 50, moveId: MOVES.poison.special.sludge_wave },
        { name: POKEMON.muk, level: 50, moveId: MOVES.dark.special.dark_pulse },
        { name: POKEMON.weezing, level: 50, moveId: MOVES.poison.special.sludge_wave },
      ]
    },
    reward: {
      pokemon: [POKEMON.gengar, POKEMON.haunter, POKEMON.arcanine],
      tm: [TM_LIST['tm-crunch'], TM_LIST['tm-facade'], TM_LIST['tm-giga-drain']],
      item: [ITEM.flame_orb, ITEM.safety_goggles, ITEM.choice_band],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 7 — Combates 61-70
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-7a',
    name: 'Piso 13',
    battleRange: [61, 65],
    trainerLevelRange: [7, 8],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-7b',
    name: 'Piso 14',
    battleRange: [66, 70],
    trainerLevelRange: [7, 8],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 70,
      name: 'Sabrina', img: TRAINER_IMG.sabrina,
      pokemon: [
        { name: POKEMON.abra, level: 50, moveId: MOVES.psychic.special.confusion },
        { name: POKEMON.alakazam, level: 50, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs },
        { name: POKEMON.hypno, level: 50, moveId: MOVES.psychic.special.psychic },
      ]
    },
    reward: {
      pokemon: [POKEMON.alakazam, POKEMON.hypno, POKEMON.starmie],
      tm: [TM_LIST['tm-tri-attack'], TM_LIST['tm-metal-claw'], TM_LIST['tm-thunderbolt']],
      item: [ITEM.choice_specs, ITEM.lifeorb, ITEM.assault_vest],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 8 — Combates 71-80
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-8a',
    name: 'Piso 15',
    battleRange: [71, 75],
    trainerLevelRange: [8, 9],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-8b',
    name: 'Piso 16',
    battleRange: [76, 80],
    trainerLevelRange: [8, 9],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 80,
      name: 'Blaine', img: TRAINER_IMG.blaine,
      pokemon: [
        { name: POKEMON.growlithe, level: 50, moveId: MOVES.fire.physical.fire_fang },
        { name: POKEMON.arcanine, level: 50, moveId: MOVES.normal.physical.extreme_speed, heldItem: ITEM.lifeorb },
        { name: POKEMON.magmar, level: 50, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.choice_scarf },
      ]
    },
    reward: {
      pokemon: [POKEMON.magmar, POKEMON.jynx, POKEMON.electabuzz],
      tm: [TM_LIST['tm-ice-beam'], TM_LIST['tm-icy-wind'], TM_LIST['tm-ice-fang']],
      item: [ITEM.choice_scarf, ITEM.choice_band, ITEM.lifeorb],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 9 — Combates 81-90
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-9a',
    name: 'Piso 17',
    battleRange: [81, 85],
    trainerLevelRange: [9, 10],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-9b',
    name: 'Piso 18',
    battleRange: [86, 90],
    trainerLevelRange: [9, 10],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 90,
      name: 'Lorelei', img: TRAINER_IMG.lorelei,
      pokemon: [
        { name: POKEMON.lapras, level: 50, moveId: MOVES.ice.special.ice_beam, heldItem: ITEM.leftovers },
        { name: POKEMON.jynx, level: 50, moveId: [MOVES.ice.special.ice_beam, MOVES.psychic.special.psychic] },
        { name: POKEMON.starmie, level: 50, moveId: MOVES.water.special.surf, heldItem: ITEM.choice_scarf },
      ]
    },
    reward: {
      pokemon: [POKEMON.articuno, POKEMON.zapdos, POKEMON.moltres],
      tm: [TM_LIST['tm-surf'], TM_LIST['tm-thunderbolt'], TM_LIST['tm-earth-power']],
      item: [ITEM.choice_specs, ITEM.lifeorb, ITEM.assault_vest],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOQUE 10 — Combates 91-100 (combate final)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bf-10a',
    name: 'Piso 19',
    battleRange: [91, 95],
    trainerLevelRange: [9, 10],
    combatBg: COMBAT_BG.default,
  },
  {
    id: 'bf-10b',
    name: 'Piso 20',
    battleRange: [96, 100],
    trainerLevelRange: [9, 10],
    combatBg: COMBAT_BG.default,
    specialTrainer: {
      battleNumber: 100,
      name: ENTRENADORES.Rojo.name, img: TRAINER_IMG.rojo,
      pokemon: [
        { name: POKEMON.pikachu, level: 50, moveId: MOVES.electric.special.thunder, heldItem: ITEM.light_ball },
        { name: POKEMON.snorlax, level: 50, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.leftovers },
        { name: POKEMON.mewtwo, level: 50, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs },
      ]
    },
    reward: {
      pokemon: [POKEMON.mewtwo, POKEMON.mew, POKEMON.dragonite],
      tm: [TM_LIST['tm-crunch'], TM_LIST['tm-tri-attack'], TM_LIST['tm-earth-power']],
      item: [ITEM.choice_band, ITEM.choice_specs, ITEM.lifeorb],
    },
  },

  // ── Pantalla de victoria — no es un combate, marca el fin del recorrido ──
  {
    type: 'victory',
    bg: BG.kantoLeague,
    title: '¡VICTORIA!',
    description: `Has completado el Frente Batalla.`,
  },
];
