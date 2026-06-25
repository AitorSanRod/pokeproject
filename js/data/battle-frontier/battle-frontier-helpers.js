// ─────────────────────────────────────────────────────────────────────────────
// BATTLE FRONTIER — HELPERS
//
// Debe cargarse ANTES que floors.js (floors.js llama a BFHelpers.getEntrenador).
// Requiere routes-constants.js cargado antes (ENTRENADORES, POKEMON, MOVES).
//
// ═══════════════════════════════════════════════════════════════════════════
// ESTRUCTURA DE BF_TRAINER_TYPES
// ═══════════════════════════════════════════════════════════════════════════
//
//   level       {number}  — dificultad del tipo (1 = fácil, 10 = difícil)
//   name        {string}  — nombre visible en combate
//   img         {string}  — ruta al sprite del entrenador
//   pokemonPool {Array}   — candidatos para el equipo generado.
//                           Repetir una entrada aumenta su probabilidad de salir.
//     .name     {string}  — nombre del pokemon
//     .moveId   {string|Array|null}  — movimiento(s) forzados (null → automático)
//     .heldItem {string}  (opcional) — id de objeto equipado
//
// Cada slot del equipo se elige de forma independiente del pool (con reemplazo),
// así que duplicar una entrada duplica su probabilidad de aparecer en el equipo.
//
// ═══════════════════════════════════════════════════════════════════════════
// API (objeto global BFHelpers)
// ═══════════════════════════════════════════════════════════════════════════
//
//   BFHelpers.getEntrenador(count, minLevel, maxLevel)
//     → array de `count` entrenadores del rango, cada uno con 3 pokemon
//       elegidos aleatoriamente de su pool
//
//   BFHelpers.getEntrenador(count, minLevel, maxLevel, { teamSize: 2 })
//     → igual pero con equipos de 2 pokemon
//
//   BFHelpers.getPool(minLevel, maxLevel)
//     → subarray de BF_TRAINER_TYPES filtrado (debug)
//
//   BFHelpers.buildTrainer(name, img, pokemonList)
//     → trainer ad-hoc con equipo fijo (para special trainers)
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE ENTRENADOR
// ═══════════════════════════════════════════════════════════════════════════

const BF_TRAINER_TYPES = [

  // ── Nivel 1 — Pokemon básicos, un solo movimiento simple ──────────────────
  {
    level: 1,
    name: ENTRENADORES.EntrenadorJoven.name,
    img: ENTRENADORES.EntrenadorJoven.img,
    pokemonPool: [
      { name: POKEMON.rattata, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.rattata, moveId: MOVES.normal.physical.take_down },
      { name: POKEMON.spearow, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.pidgey, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.doduo, moveId: MOVES.flying.physical.wing_attack },
    ]
  },
  {
    level: 1,
    name: ENTRENADORES.Cazabichos.name,
    img: ENTRENADORES.Cazabichos.img,
    pokemonPool: [
      { name: POKEMON.rattata, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.caterpie, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.weedle, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.metapod, moveId: MOVES.bug.special.infestation },
      { name: POKEMON.kakuna, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.paras, moveId: MOVES.bug.physical.x_scissor },
    ]
  },
  {
    level: 1,
    name: `Dama`,
    img: ENTRENADORES.Chica.img,
    pokemonPool: [
      { name: POKEMON.rattata, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.pikachu, moveId: MOVES.electric.physical.thunder_punch },
      { name: POKEMON.jigglypuff, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.jigglypuff, moveId: MOVES.fairy.special.moonblast },
      { name: POKEMON.clefairy, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.clefairy, moveId: MOVES.fairy.special.moonblast },
    ]
  },
  {
    level: 1,
    name: ENTRENADORES.Nadador.name,
    img: ENTRENADORES.Nadador.img,
    pokemonPool: [
      { name: POKEMON.squirtle, moveId: [MOVES.water.special.water_gun, MOVES.water.special.scald] },
      { name: POKEMON.psyduck, moveId: [MOVES.water.special.water_gun, MOVES.psychic.special.confusion] },
      { name: POKEMON.poliwag, moveId: MOVES.water.special.water_gun },
      { name: POKEMON.tentacool, moveId: [MOVES.water.physical.waterfall, MOVES.poison.physical.poison_jab] },
      { name: POKEMON.seel, moveId: [MOVES.water.special.bubble_beam, MOVES.ice.special.ice_beam] },
      { name: POKEMON.horsea, moveId: MOVES.dragon.special.dragon_pulse },
      { name: POKEMON.starmie, moveId: MOVES.water.special.water_gun },
    ]
  },
  {
    level: 1,
    name: ENTRENADORES.Montanero.name,
    img: ENTRENADORES.Montanero.img,
    pokemonPool: [
      { name: POKEMON.geodude, moveId: [MOVES.ground.physical.bulldoze, MOVES.rock.physical.rock_throw] },
      { name: POKEMON.sandshrew, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.nidorino, moveId: [MOVES.ground.physical.bulldoze, MOVES.ground.physical.poison_sting] },
      { name: POKEMON.nidorina, moveId: [MOVES.ground.physical.bulldoze, MOVES.poison.physical.poison_sting] },
      { name: POKEMON.diglett, moveId: MOVES.ground.physical.bulldoze },
      { name: POKEMON.cubone, moveId: [MOVES.ground.physical.bulldoze, MOVES.rock.physical.rock_throw] },
    ]
  },
  // ── Nivel 2 — Pokemon básicos, dos en equipo ──────────────────────────────
  {
    level: 2,
    name: `${ENTRENADORES.Campista.name} sospechoso`,
    img: ENTRENADORES.Campista.img,
    pokemonPool: [
      { name: POKEMON.nidoran_m, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_f, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.ekans, moveId: MOVES.poison.physical.gunk_shot },
      { name: POKEMON.koffing, moveId: [MOVES.poison.special.sludge_bomb, MOVES.fairy.special.moonblast] },
      { name: POKEMON.bellsprout, moveId: [MOVES.poison.special.poison_powder, MOVES.grass.special.giga_drain] },
      { name: POKEMON.venonat, moveId: MOVES.poison.special.poison_powder },
      { name: POKEMON.bulbasaur, moveId: [MOVES.poison.special.poison_powder, MOVES.grass.special.giga_drain] },
    ]
  },
  {
    level: 2,
    name: ENTRENADORES.Ornitologo.name,
    img: ENTRENADORES.Ornitologo.img,
    pokemonPool: [
      { name: POKEMON.pidgey, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.pidgeotto, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.pidgeotto, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.spearow, moveId: MOVES.flying.physical.peck },
      { name: POKEMON.zubat, moveId: [MOVES.flying.physical.peck, MOVES.poison.physical.poison_jab] },
      { name: POKEMON.doduo, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.scyther, moveId: [MOVES.flying.physical.wing_attack, MOVES.bug.physical.x_scissor] },
    ]
  },
  {
    level: 2,
    name: ENTRENADORES.Dominguera.name,
    img: ENTRENADORES.Dominguera.img,
    pokemonPool: [
      { name: POKEMON.growlithe, moveId: MOVES.fire.physical.fire_fang },
      { name: POKEMON.mankey, moveId: MOVES.fighting.physical.karate_chop },
      { name: POKEMON.horsea, moveId: MOVES.water.special.bubble_beam },
      { name: POKEMON.oddish, moveId: MOVES.grass.special.absorb },
      { name: POKEMON.pikachu, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.charmander, moveId: MOVES.fire.special.flamethrower },
    ]
  },
  {
    level: 2,
    name: ENTRENADORES.Cazabichos.name,
    img: ENTRENADORES.Cazabichos.img,
    pokemonPool: [
      { name: POKEMON.rattata, moveId: MOVES.normal.physical.tackle },
      { name: POKEMON.caterpie, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.butterfree, moveId: MOVES.bug.special.bug_buzz },
      { name: POKEMON.metapod, moveId: MOVES.bug.special.infestation },
      { name: POKEMON.kakuna, moveId: MOVES.bug.physical.bug_bite },
      { name: POKEMON.venomoth, moveId: MOVES.bug.special.signal_beam },
    ]
  },
  // ── Nivel 3 — Primera evolución, poder creciente ─────────────────────────
  {
    level: 3,
    name: ENTRENADORES.Montanero.name,
    img: ENTRENADORES.Montanero.img,
    pokemonPool: [
      { name: POKEMON.geodude, moveId: [MOVES.rock.physical.rock_slide, MOVES.ground.physical.bulldoze] },
      { name: POKEMON.onix, moveId: MOVES.rock.physical.rock_slide },
      { name: POKEMON.sandshrew, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.cubone, moveId: [MOVES.ground.physical.bulldoze, MOVES.rock.physical.rock_throw] },
      { name: POKEMON.nidorino, moveId: [MOVES.ground.physical.bulldoze, MOVES.poison.physical.poison_jab] },
      { name: POKEMON.diglett, moveId: MOVES.ground.physical.bulldoze },
    ],
  },
  {
    level: 3,
    name: ENTRENADORES.Campista.name,
    img: ENTRENADORES.Campista.img,
    pokemonPool: [
      { name: POKEMON.sandshrew, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.ekans, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.meowth, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.persian, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.nidoran_f, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.nidoran_m, moveId: MOVES.ground.physical.poison_sting },
    ],
  },
  {
    level: 3,
    name: ENTRENADORES.EntrenadorJoven.name,
    img: ENTRENADORES.EntrenadorJoven.img,
    pokemonPool: [
      { name: POKEMON.mankey, moveId: MOVES.fighting.physical.karate_chop },
      { name: POKEMON.primeape, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.spearow, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.fearow, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.doduo, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.dodrio, moveId: MOVES.flying.physical.wing_attack },
    ],
  },
  {
    level: 3,
    name: ENTRENADORES.Dominguera.name,
    img: ENTRENADORES.Dominguera.img,
    pokemonPool: [
      { name: POKEMON.oddish, moveId: MOVES.grass.special.magical_leaf },
      { name: POKEMON.gloom, moveId: [MOVES.grass.special.magical_leaf, MOVES.poison.special.sludge_bomb] },
      { name: POKEMON.paras, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.parasect, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.growlithe, moveId: MOVES.fire.special.flamethrower },
      { name: POKEMON.psyduck, moveId: [MOVES.water.special.water_gun, MOVES.psychic.special.confusion] },
    ],
  },
  {
    level: 3,
    name: ENTRENADORES.Ornitologo.name,
    img: ENTRENADORES.Ornitologo.img,
    pokemonPool: [
      { name: POKEMON.pidgeotto, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.fearow, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.doduo, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.zubat, moveId: [MOVES.flying.physical.wing_attack, MOVES.poison.physical.poison_jab] },
      { name: POKEMON.scyther, moveId: [MOVES.flying.physical.wing_attack, MOVES.bug.physical.x_scissor] },
      { name: POKEMON.dodrio, moveId: MOVES.flying.physical.wing_attack },
    ],
  },

  // ── Nivel 4 — Evolucionados intermedios ──────────────────────────────────
  {
    level: 4,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machop, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.machoke, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.graveler, moveId: [MOVES.rock.physical.rock_slide, MOVES.ground.physical.bulldoze] },
      { name: POKEMON.geodude, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.nidorino, moveId: [MOVES.ground.physical.bulldoze, MOVES.poison.physical.poison_jab] },
      { name: POKEMON.nidorina, moveId: [MOVES.ground.physical.bulldoze, MOVES.poison.physical.poison_jab] },
    ],
  },
  {
    level: 4,
    name: ENTRENADORES.Dominguera.name,
    img: ENTRENADORES.Dominguera.img,
    pokemonPool: [
      { name: POKEMON.gloom, moveId: [MOVES.grass.special.magical_leaf, MOVES.poison.special.sludge_bomb] },
      { name: POKEMON.weepinbell, moveId: [MOVES.grass.special.giga_drain, MOVES.poison.special.sludge_bomb] },
      { name: POKEMON.bellsprout, moveId: MOVES.grass.special.giga_drain },
      { name: POKEMON.parasect, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.venomoth, moveId: MOVES.bug.special.signal_beam },
      { name: POKEMON.tangela, moveId: MOVES.grass.special.giga_drain },
    ],
  },
  {
    level: 4,
    name: ENTRENADORES.ChicoGuay.name,
    img: ENTRENADORES.ChicoGuay.img,
    pokemonPool: [
      { name: POKEMON.pikachu, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.jigglypuff, moveId: MOVES.normal.special.hyper_voice },
      { name: POKEMON.clefairy, moveId: MOVES.normal.special.hyper_voice },
      { name: POKEMON.clefable, moveId: MOVES.normal.special.hyper_voice },
      { name: POKEMON.wigglytuff, moveId: MOVES.normal.special.hyper_voice },
    ],
  },
  {
    level: 4,
    name: ENTRENADORES.Nadador.name,
    img: ENTRENADORES.Nadador.img,
    pokemonPool: [
      { name: POKEMON.poliwhirl, moveId: [MOVES.water.special.surf, MOVES.fighting.physical.brick_break] },
      { name: POKEMON.shellder, moveId: MOVES.water.physical.waterfall },
      { name: POKEMON.cloyster, moveId: [MOVES.water.physical.waterfall, MOVES.ice.special.ice_beam] },
      { name: POKEMON.tentacruel, moveId: [MOVES.water.physical.waterfall, MOVES.poison.physical.poison_jab] },
      { name: POKEMON.dewgong, moveId: [MOVES.water.special.water_gun, MOVES.ice.special.ice_beam] },
      { name: POKEMON.seadra, moveId: [MOVES.water.special.water_gun, MOVES.dragon.special.dragon_pulse] },
    ],
  },
  {
    level: 4,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.magnemite, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.voltorb, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.magneton, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.pikachu, moveId: MOVES.electric.special.thunder },
    ],
  },

  // ── Nivel 5 — Pokémon potentes, inicio de EVs (pisos 41-50) ─── max EV/stat: 32
  {
    level: 5,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.magneton, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.electabuzz, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.voltorb, moveId: MOVES.normal.physical.self_destruct, overrides: { evs: { atk: 16, spe: 16 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.magmar, moveId: MOVES.fire.special.flamethrower, overrides: { evs: { spa: 16, spe: 16 } } },
    ],
  },
  {
    level: 5,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.hypno, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 16, hp: 16 } } },
      { name: POKEMON.kadabra, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.slowbro, moveId: [MOVES.water.special.surf, MOVES.psychic.special.psychic], overrides: { evs: { spa: 16, hp: 16 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.drowzee, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 16, hp: 16 } } },
    ],
  },
  {
    level: 5,
    name: ENTRENADORES.ChicaGuay.name,
    img: ENTRENADORES.ChicaGuay.img,
    pokemonPool: [
      { name: POKEMON.scyther, moveId: MOVES.bug.physical.x_scissor, overrides: { evs: { atk: 16, spe: 16 } } },
      { name: POKEMON.pinsir, moveId: MOVES.bug.physical.x_scissor, overrides: { evs: { atk: 16, spe: 16 } } },
      { name: POKEMON.parasect, moveId: MOVES.bug.physical.x_scissor, overrides: { evs: { atk: 16, hp: 16 } } },
      { name: POKEMON.venomoth, moveId: MOVES.bug.special.signal_beam, overrides: { evs: { spa: 16, spe: 16 } } },
      { name: POKEMON.paras, moveId: MOVES.bug.physical.x_scissor, overrides: { evs: { atk: 16, hp: 16 } } },
    ],
  },
  {
    level: 5,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machoke, moveId: MOVES.fighting.physical.brick_break, overrides: { evs: { atk: 16, hp: 16 } } },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 16, hp: 16 } } },
      { name: POKEMON.graveler, moveId: MOVES.ground.physical.stomping_tantrum, overrides: { evs: { atk: 16, hp: 16 } } },
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 16, hp: 16 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 16, spe: 16 } } },
      { name: POKEMON.nidoqueen, moveId: MOVES.poison.physical.gunk_shot, overrides: { evs: { atk: 16, hp: 16 } } },
    ],
  },
  {
    level: 5,
    name: ENTRENADORES.Ladron.name,
    img: ENTRENADORES.Ladron.img,
    pokemonPool: [
      { name: POKEMON.grimer, moveId: MOVES.poison.special.sludge_bomb, overrides: { evs: { hp: 16, spa: 16 } } },
      { name: POKEMON.koffing, moveId: MOVES.poison.special.sludge_wave, overrides: { evs: { hp: 16, spa: 16 } } },
      { name: POKEMON.muk, moveId: MOVES.dark.special.dark_pulse, overrides: { evs: { hp: 16, spa: 16 } } },
      { name: POKEMON.weezing, moveId: MOVES.poison.special.sludge_wave, overrides: { evs: { hp: 16, spa: 16 } } },
      { name: POKEMON.arbok, moveId: MOVES.poison.physical.gunk_shot, overrides: { evs: { atk: 16, spe: 16 } } },
    ],
  },

  // ── Nivel 6 — Evolucionados potentes, EVs medios (pisos 51-60) ───────────
  {
    level: 6,
    name: ENTRENADORES.Montanero.name,
    img: ENTRENADORES.Montanero.img,
    pokemonPool: [
      { name: POKEMON.graveler, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 16 } } },
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 16 } } },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 16 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, spe: 16 } } },
      { name: POKEMON.sandslash, moveId: MOVES.ground.physical.stomping_tantrum, overrides: { evs: { atk: 32, spe: 16 } } },
      { name: POKEMON.nidoqueen, moveId: MOVES.poison.physical.gunk_shot, overrides: { evs: { atk: 32, hp: 16 } } },
    ],
  },
  {
    level: 6,
    name: ENTRENADORES.Ladron.name,
    img: ENTRENADORES.Ladron.img,
    pokemonPool: [
      { name: POKEMON.muk, moveId: MOVES.dark.special.dark_pulse, overrides: { evs: { hp: 32, spa: 16 } } },
      { name: POKEMON.weezing, moveId: MOVES.poison.special.sludge_wave, overrides: { evs: { hp: 32, spa: 16 } } },
      { name: POKEMON.grimer, moveId: MOVES.poison.special.sludge_bomb, overrides: { evs: { hp: 32, spa: 16 } } },
      { name: POKEMON.koffing, moveId: MOVES.poison.special.sludge_wave, overrides: { evs: { hp: 32, spa: 16 } } },
      { name: POKEMON.arbok, moveId: MOVES.poison.physical.gunk_shot, overrides: { evs: { atk: 32, spe: 16 } } },
    ],
  },
  {
    level: 6,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 32, spe: 16 } } },
      { name: POKEMON.magneton, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 32, spe: 16 } } },
      { name: POKEMON.voltorb, moveId: MOVES.normal.physical.self_destruct, overrides: { evs: { atk: 32, spe: 16 } } },
      { name: POKEMON.electabuzz, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 32, spe: 16 } } },
      { name: POKEMON.magmar, moveId: MOVES.fire.special.flamethrower, overrides: { evs: { spa: 32, spe: 16 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, overrides: { evs: { spa: 32, spe: 16 } } },
    ],
  },
  {
    level: 6,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.haunter, moveId: MOVES.ghost.special.shadow_ball, overrides: { evs: { spa: 32, spe: 16 } } },
      { name: POKEMON.hypno, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, hp: 16 } } },
      { name: POKEMON.kadabra, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, spe: 16 } } },
      { name: POKEMON.slowbro, moveId: [MOVES.water.special.surf, MOVES.psychic.special.psychic], overrides: { evs: { spa: 32, hp: 16 } } },
      { name: POKEMON.drowzee, moveId: MOVES.psychic.special.psychic, overrides: { evs: { hp: 32, spa: 16 } } },
    ],
  },
  {
    level: 6,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machoke, moveId: MOVES.fighting.physical.brick_break, overrides: { evs: { atk: 32, hp: 16 } } },
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, overrides: { evs: { atk: 32, hp: 16 } } },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 16 } } },
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, def: 16 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, spe: 16 } } },
      { name: POKEMON.nidoqueen, moveId: MOVES.poison.physical.gunk_shot, overrides: { evs: { atk: 32, hp: 16 } } },
    ],
  },

  // ── Nivel 7 — Finales de evolución, EVs altos (pisos 61-70) ──────────────
  {
    level: 7,
    name: ENTRENADORES.Rocket.name,
    img: ENTRENADORES.Rocket.img,
    pokemonPool: [
      { name: POKEMON.crobat, moveId: MOVES.poison.physical.poison_jab, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.sudowoodo, moveId: MOVES.rock.physical.rock_slide, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.wobbuffet, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, spe: 16, hp: 16 } } },
    ],
  },
  {
    level: 7,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.qwilfish, moveId: MOVES.water.special.scald, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.sneasel, moveId: MOVES.ice.physical.icicle_crash, overrides: { evs: { spa: 32, hp: 32, spd: 4 } } },
      { name: POKEMON.kadabra, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.slowbro, moveId: [MOVES.water.special.surf, MOVES.psychic.special.psychic], overrides: { evs: { spa: 32, hp: 32, spd: 4 } } },
      { name: POKEMON.porygon2, moveId: MOVES.normal.special.hyper_voice, overrides: { evs: { hp: 32, spa: 16, spd: 16 } } },
    ],
  },
  {
    level: 7,
    name: ENTRENADORES.ChicoGuay.name,
    img: ENTRENADORES.ChicoGuay.img,
    pokemonPool: [
      { name: POKEMON.ursaring, moveId: MOVES.normal.physical.extreme_speed, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.miltank, moveId: MOVES.normal.physical.hyper_fang, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.tauros, moveId: MOVES.normal.physical.hyper_fang, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.snorlax, moveId: MOVES.normal.physical.hyper_fang, overrides: { evs: { hp: 32, atk: 32, def: 4 } } },
      { name: POKEMON.kangaskhan, moveId: MOVES.normal.physical.extreme_speed, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 7,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.slowbro, moveId: [MOVES.water.special.surf, MOVES.psychic.special.psychic], overrides: { evs: { spa: 32, hp: 32 } } },
      { name: POKEMON.aipom, moveId: MOVES.normal.physical.take_down, overrides: { evs: { spa: 32, hp: 32 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.wooper, moveId: [MOVES.water.special.surf, MOVES.psychic.special.psychic], overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.arcanine, moveId: MOVES.normal.physical.extreme_speed, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 7,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.stantler, moveId: MOVES.normal.physical.extreme_speed, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.ledian, moveId: MOVES.flying.physical.wing_attack, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
    ],
  },

  // ── Nivel 8 — Finales de evolución, EVs completos (pisos 71-80) ──────────
  {
    level: 8,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.nidoqueen, moveId: MOVES.poison.physical.gunk_shot, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
    ],
  },
  {
    level: 8,
    name: ENTRENADORES.ChicaGuay.name,
    img: ENTRENADORES.ChicaGuay.img,
    pokemonPool: [
      { name: POKEMON.vaporeon, moveId: MOVES.water.special.surf, overrides: { evs: { hp: 32, spa: 32, spd: 4 } } },
      { name: POKEMON.jolteon, moveId: MOVES.electric.special.thunder, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.flareon, moveId: MOVES.fire.special.flamethrower, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.umbreon, moveId: MOVES.dark.special.feint_attack, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.espeon, moveId: MOVES.psychic.special.psystrike, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 8,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.alakazam, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.gengar, moveId: MOVES.ghost.special.shadow_ball, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.houndoom, moveId: [MOVES.fire.physical.flame_wheel, MOVES.dark.physical.crunch], overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.haunter, moveId: MOVES.ghost.special.shadow_ball, overrides: { evs: { spa: 32, spe: 16, hp: 16 } } },
      { name: POKEMON.hypno, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, hp: 32, spd: 4 } } },
      { name: POKEMON.kadabra, moveId: MOVES.psychic.special.psychic, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 8,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.lapras, moveId: [MOVES.water.special.surf, MOVES.ice.special.ice_beam], overrides: { evs: { hp: 32, spa: 32, spd: 4 } } },
      { name: POKEMON.blissey, moveId: MOVES.normal.physical.hyper_fang, overrides: { evs: { hp: 32, atk: 32, def: 4 } } },
      { name: POKEMON.tauros, moveId: MOVES.normal.physical.hyper_fang, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.larvitar, moveId: MOVES.rock.physical.rock_throw, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.kangaskhan, moveId: MOVES.normal.physical.extreme_speed, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 8,
    name: ENTRENADORES.Montanero.name,
    img: ENTRENADORES.Montanero.img,
    pokemonPool: [
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.sandslash, moveId: MOVES.ground.physical.stomping_tantrum, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
    ],
  },

  // ── Nivel 9 — Élite con objetos equipados (pisos 81-90) ──────────────────
  {
    level: 9,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.choice_band, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.arcanine, moveId: MOVES.normal.physical.extreme_speed, heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.lapras, moveId: [MOVES.water.special.surf, MOVES.ice.special.ice_beam], heldItem: ITEM.leftovers, overrides: { evs: { hp: 32, spa: 32, spd: 4 } } },
      { name: POKEMON.dragonite, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 9,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.gligar, moveId: [MOVES.poison.physical.poison_jab, MOVES.ground.physical.earthquake], heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.gengar, moveId: MOVES.ghost.special.shadow_ball, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.dragonair, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.politoed, moveId: MOVES.water.special.hydro_pump, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 9,
    name: ENTRENADORES.ChicoGuay.name,
    img: ENTRENADORES.ChicoGuay.img,
    pokemonPool: [
      { name: POKEMON.charizard, moveId: MOVES.fire.special.fire_blast, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.blastoise, moveId: [MOVES.water.special.hydro_pump, MOVES.ice.special.blizzard], heldItem: ITEM.leftovers, overrides: { evs: { hp: 32, spa: 32, spd: 4 } } },
      { name: POKEMON.venusaur, moveId: MOVES.grass.special.giga_drain, heldItem: ITEM.assault_vest, overrides: { evs: { hp: 32, spa: 32, spd: 4 } } },
    ],
  },
  {
    level: 9,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.choice_band, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.hitmonlee, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.hitmonchan, moveId: [MOVES.fighting.physical.brick_break, MOVES.electric.physical.thunder_punch], heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake, heldItem: ITEM.choice_band, overrides: { evs: { hp: 32, atk: 32, def: 4 } } },
    ],
  },
  {
    level: 9,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.electabuzz, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.granbull, moveId: MOVES.fairy.physical.play_rough, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },

  // ── Nivel 10 — Máxima dificultad (pisos 91-100) ───────────────────────────
  {
    level: 10,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.dragonite, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.snorlax, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.leftovers, overrides: { evs: { hp: 32, atk: 32, def: 4 } } },
      { name: POKEMON.tauros, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.choice_band, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.arcanine, moveId: MOVES.normal.physical.extreme_speed, heldItem: ITEM.choice_band, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 10,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.mewtwo, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.alakazam, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.gengar, moveId: MOVES.ghost.special.shadow_ball, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 10,
    name: ENTRENADORES.ChicaGuay.name,
    img: ENTRENADORES.ChicaGuay.img,
    pokemonPool: [
      { name: POKEMON.vaporeon, moveId: MOVES.water.special.surf, heldItem: ITEM.leftovers, overrides: { evs: { hp: 32, spa: 32, spd: 4 } } },
      { name: POKEMON.jolteon, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.flareon, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 10,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.choice_band, overrides: { evs: { atk: 32, hp: 32, def: 4 } } },
      { name: POKEMON.hitmonlee, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.hitmonchan, moveId: [MOVES.fighting.physical.brick_break, MOVES.electric.physical.thunder_punch], heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake, heldItem: ITEM.lifeorb, overrides: { evs: { atk: 32, spe: 32, hp: 4 } } },
    ],
  },
  {
    level: 10,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.electabuzz, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.magmar, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder, heldItem: ITEM.lifeorb, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam, heldItem: ITEM.choice_specs, overrides: { evs: { spa: 32, spe: 32, hp: 4 } } },
    ],
  },

];

// ═══════════════════════════════════════════════════════════════════════════
// LÓGICA DE GENERACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const BFHelpers = (() => {

  // Selección uniforme de un tipo de entrenador dentro del rango de nivel.
  function _pickType(minLevel, maxLevel) {
    const pool = BF_TRAINER_TYPES.filter(t => t.level >= minLevel && t.level <= maxLevel);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Elige teamSize pokemon del pool de forma independiente por slot (con reemplazo).
  // Duplicar una entrada en el pool aumenta proporcionalmente su probabilidad.
  function _pickPokemon(pool, teamSize) {
    return Array.from({ length: teamSize }, () => pool[Math.floor(Math.random() * pool.length)]);
  }

  // Construye el objeto trainer { name, img, pokemon } a partir de un tipo.
  function _buildFromType(type, teamSize) {
    const pokemon = _pickPokemon(type.pokemonPool, teamSize).map(p => ({
      name: p.name,
      level: 50,
      moveId: p.moveId ?? null,
      ...(p.heldItem ? { heldItem: p.heldItem } : {}),
      ...(p.overrides ? { overrides: p.overrides } : {}),
    }));
    return { name: type.name, img: type.img, pokemon };
  }

  // ── Público ───────────────────────────────────────────────────────────────

  // Devuelve un array de `count` entrenadores del rango [minLevel, maxLevel].
  // Cada entrenador tiene teamSize pokemon elegidos de su pool.
  function getEntrenador(count, minLevel, maxLevel, { teamSize = 3 } = {}) {
    const result = [];
    for (let i = 0; i < count; i++) {
      const type = _pickType(minLevel, maxLevel);
      if (!type) {
        console.warn(`[BFHelpers] No hay tipos en el rango nivel ${minLevel}-${maxLevel}`);
        break;
      }
      result.push(_buildFromType(type, teamSize));
    }
    return result;
  }

  // Devuelve el subconjunto de BF_TRAINER_TYPES filtrado por nivel (debug).
  function getPool(minLevel = 1, maxLevel = 10) {
    return BF_TRAINER_TYPES.filter(t => t.level >= minLevel && t.level <= maxLevel);
  }

  // Construye un trainer ad-hoc con equipo fijo (para special trainers o tests).
  // pokemonList: [{ name, moveId?, heldItem?, level? }]
  function buildTrainer(name, img, pokemonList) {
    return {
      name,
      img,
      pokemon: pokemonList.map(p => ({
        name: p.name,
        level: p.level ?? 50,
        moveId: p.moveId ?? null,
        ...(p.heldItem ? { heldItem: p.heldItem } : {}),
      })),
    };
  }

  return { getEntrenador, getPool, buildTrainer };

})();
