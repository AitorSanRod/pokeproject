// ─────────────────────────────────────────────────────────────────────────────
// BATTLE FRONTIER — FLOORS
//
// Requiere battle-frontier-helpers.js cargado antes (BFHelpers disponible).
// Globals disponibles: MOVES, POKEMON, ENTRENADORES, TRAINER_IMG, COMBAT_BG,
//                      ITEM, TM_LIST
//
// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES GLOBALES
// ═══════════════════════════════════════════════════════════════════════════
//
//   BF_SHINY_RATE — ratio de shiny para recompensas de piso (aumentado)
//   BF_NO_EXP     — los combates del Frente Batalla no dan experiencia
//   BF_FLOORS     — array de definiciones de piso
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE BF_FLOORS
// ═══════════════════════════════════════════════════════════════════════════
//
//   battleRange       {[n, n]}  — [primerCombate, últimoCombate] (inclusivo)
//   trainers          {Array}   — generados por BFHelpers.getEntrenador(count, min, max)
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
    battleRange: [1, 5],
    trainers: BFHelpers.getEntrenador(5, 1, 2),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [6, 10],
    trainers: BFHelpers.getEntrenador(4, 1, 2),
    combatBg: COMBAT_BG.rocket,
    specialTrainer: {
      battleNumber: 10,
      name: ENTRENADORES.Rival.name, img: ENTRENADORES.Rival.img,
      pokemon: [
        { name: POKEMON.nidorino, level: 50, moveId: [MOVES.poison.physical.poison_jab, MOVES.fighting.physical.karate_chop] },
        { name: POKEMON.pidgeotto, level: 50, moveId: [MOVES.flying.physical.wing_attack, MOVES.normal.physical.extreme_speed] },
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
    battleRange: [11, 15],
    trainers: BFHelpers.getEntrenador(5, 2, 3),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [16, 20],
    trainers: BFHelpers.getEntrenador(4, 2, 3),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [21, 25],
    trainers: BFHelpers.getEntrenador(5, 3, 4),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [26, 30],
    trainers: BFHelpers.getEntrenador(4, 3, 4),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [31, 35],
    trainers: BFHelpers.getEntrenador(5, 4, 5),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [36, 40],
    trainers: BFHelpers.getEntrenador(4, 4, 5),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [41, 45],
    trainers: BFHelpers.getEntrenador(5, 5, 6),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [46, 50],
    trainers: BFHelpers.getEntrenador(4, 5, 6),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [51, 55],
    trainers: BFHelpers.getEntrenador(5, 6, 7),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [56, 60],
    trainers: BFHelpers.getEntrenador(4, 6, 7),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [61, 65],
    trainers: BFHelpers.getEntrenador(5, 7, 8),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [66, 70],
    trainers: BFHelpers.getEntrenador(4, 7, 8),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [71, 75],
    trainers: BFHelpers.getEntrenador(5, 8, 9),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [76, 80],
    trainers: BFHelpers.getEntrenador(4, 8, 9),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [81, 85],
    trainers: BFHelpers.getEntrenador(5, 9, 10),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [86, 90],
    trainers: BFHelpers.getEntrenador(4, 9, 10),
    combatBg: COMBAT_BG.rocket,
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
    battleRange: [91, 95],
    trainers: BFHelpers.getEntrenador(5, 9, 10),
    combatBg: COMBAT_BG.rocket,
  },
  {
    battleRange: [96, 100],
    trainers: BFHelpers.getEntrenador(4, 9, 10),
    combatBg: COMBAT_BG.rocket,
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
