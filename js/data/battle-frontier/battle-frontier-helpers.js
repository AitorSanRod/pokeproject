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
      { name: POKEMON.jigglypuff, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.jigglypuff, moveId: MOVES.fairy.special.moonblast },
      { name: POKEMON.clefairy, moveId: MOVES.fairy.special.disarming_voice },
      { name: POKEMON.clefairy, moveId: MOVES.fairy.special.moonblast },
    ]
  },

  // ── Nivel 2 — Pokemon básicos, dos en equipo ──────────────────────────────
  {
    level: 2,
    name: ENTRENADORES.Campista.name,
    img: ENTRENADORES.Campista.img,
    pokemonPool: [
      { name: POKEMON.nidoran_m, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.nidoran_f, moveId: MOVES.poison.physical.poison_sting },
      { name: POKEMON.ekans, moveId: MOVES.poison.physical.poison_sting },
    ]
  },
  {
    level: 2,
    name: ENTRENADORES.EntrenadorJoven.name,
    img: ENTRENADORES.EntrenadorJoven.img,
    pokemonPool: [
      { name: POKEMON.rattata, moveId: MOVES.normal.physical.hyper_fang },
      { name: POKEMON.spearow, moveId: MOVES.flying.physical.wing_attack },
      { name: POKEMON.mankey, moveId: MOVES.fighting.physical.karate_chop },
    ]
  },
  {
    level: 2,
    name: ENTRENADORES.Dominguera.name,
    img: ENTRENADORES.Dominguera.img,
    pokemonPool: [
      { name: POKEMON.clefairy, moveId: MOVES.normal.special.hyper_voice },
      { name: POKEMON.jigglypuff, moveId: MOVES.fairy.special.disarming_voice },
    ]
  },

  // ── Nivel 3 — Pokemon intermedios ────────────────────────────────────────
  {
    level: 3,
    name: ENTRENADORES.Montanero.name,
    img: ENTRENADORES.Montanero.img,
    pokemonPool: [
      { name: POKEMON.geodude, moveId: MOVES.rock.physical.rock_throw },
      { name: POKEMON.onix, moveId: MOVES.rock.physical.rock_slide },
      { name: POKEMON.sandshrew, moveId: MOVES.ground.physical.bulldoze },
    ]
  },
  {
    level: 3,
    name: ENTRENADORES.Campista.name,
    img: ENTRENADORES.Campista.img,
    pokemonPool: [
      { name: POKEMON.sandshrew, moveId: MOVES.ground.physical.bulldoze },
      { name: POKEMON.ekans, moveId: MOVES.poison.physical.poison_jab },
      { name: POKEMON.meowth, moveId: MOVES.normal.physical.extreme_speed },
    ]
  },
  {
    level: 3,
    name: ENTRENADORES.EntrenadorJoven.name,
    img: ENTRENADORES.EntrenadorJoven.img,
    pokemonPool: [
      { name: POKEMON.mankey, moveId: MOVES.fighting.physical.karate_chop },
      { name: POKEMON.meowth, moveId: MOVES.normal.physical.extreme_speed },
      { name: POKEMON.spearow, moveId: MOVES.flying.physical.wing_attack },
    ]
  },

  // ── Nivel 4 — Evolucionados intermedios ──────────────────────────────────
  {
    level: 4,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.machop, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.graveler, moveId: MOVES.rock.physical.rock_slide },
      { name: POKEMON.geodude, moveId: MOVES.ground.physical.stomping_tantrum },
    ]
  },
  {
    level: 4,
    name: ENTRENADORES.Dominguera.name,
    img: ENTRENADORES.Dominguera.img,
    pokemonPool: [
      { name: POKEMON.oddish, moveId: MOVES.grass.special.magical_leaf },
      { name: POKEMON.bellsprout, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.paras, moveId: MOVES.bug.physical.x_scissor },
    ]
  },
  {
    level: 4,
    name: ENTRENADORES.ChicoGuay.name,
    img: ENTRENADORES.ChicoGuay.img,
    pokemonPool: [
      { name: POKEMON.pikachu, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.jigglypuff, moveId: MOVES.normal.special.hyper_voice },
      { name: POKEMON.clefairy, moveId: MOVES.normal.special.hyper_voice },
    ]
  },

  // ── Nivel 5 — Dos Pokemon con movimientos fuertes ─────────────────────────
  {
    level: 5,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.magnemite, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.voltorb, moveId: MOVES.electric.special.thunderbolt },
      { name: POKEMON.magneton, moveId: MOVES.electric.special.thunder },
    ]
  },
  {
    level: 5,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.drowzee, moveId: MOVES.psychic.special.psychic },
      { name: POKEMON.slowpoke, moveId: MOVES.water.special.surf },
      { name: POKEMON.abra, moveId: MOVES.psychic.special.confusion },
    ]
  },
  {
    level: 5,
    name: ENTRENADORES.ChicaGuay.name,
    img: ENTRENADORES.ChicaGuay.img,
    pokemonPool: [
      { name: POKEMON.paras, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.scyther, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.pinsir, moveId: MOVES.bug.physical.x_scissor },
    ]
  },

  // ── Nivel 6 — Tres Pokemon evolucionados ──────────────────────────────────
  {
    level: 6,
    name: ENTRENADORES.Montanero.name,
    img: ENTRENADORES.Montanero.img,
    pokemonPool: [
      { name: POKEMON.graveler, moveId: MOVES.ground.physical.stomping_tantrum },
      { name: POKEMON.machoke, moveId: MOVES.fighting.physical.brick_break },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake },
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake },
    ]
  },
  {
    level: 6,
    name: ENTRENADORES.Ladron.name,
    img: ENTRENADORES.Ladron.img,
    pokemonPool: [
      { name: POKEMON.grimer, moveId: MOVES.poison.special.sludge_bomb },
      { name: POKEMON.koffing, moveId: MOVES.poison.special.sludge_wave },
      { name: POKEMON.muk, moveId: MOVES.dark.special.dark_pulse },
      { name: POKEMON.weezing, moveId: MOVES.poison.special.sludge_wave },
    ]
  },
  {
    level: 6,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.electrode, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.magneton, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.voltorb, moveId: MOVES.normal.physical.self_destruct },
    ]
  },

  // ── Nivel 7 — Tres Pokemon especiales, alta potencia ─────────────────────
  {
    level: 7,
    name: ENTRENADORES.Mecanico.name,
    img: ENTRENADORES.Mecanico.img,
    pokemonPool: [
      { name: POKEMON.electabuzz, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.jynx, moveId: MOVES.ice.special.ice_beam },
      { name: POKEMON.magmar, moveId: MOVES.fire.special.flamethrower },
    ]
  },
  {
    level: 7,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.haunter, moveId: MOVES.ghost.special.shadow_ball },
      { name: POKEMON.hypno, moveId: MOVES.psychic.special.psychic },
      { name: POKEMON.drowzee, moveId: MOVES.psychic.special.psychic },
    ]
  },
  {
    level: 7,
    name: ENTRENADORES.ChicoGuay.name,
    img: ENTRENADORES.ChicoGuay.img,
    pokemonPool: [
      { name: POKEMON.scyther, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.pinsir, moveId: MOVES.bug.physical.x_scissor },
      { name: POKEMON.tauros, moveId: MOVES.normal.physical.take_down },
    ]
  },

  // ── Nivel 8 — Finales de evolución ────────────────────────────────────────
  {
    level: 8,
    name: ENTRENADORES.Caballero.name,
    img: ENTRENADORES.Caballero.img,
    pokemonPool: [
      { name: POKEMON.golem, moveId: MOVES.ground.physical.earthquake },
      { name: POKEMON.nidoking, moveId: MOVES.ground.physical.earthquake },
      { name: POKEMON.nidoqueen, moveId: MOVES.poison.physical.gunk_shot },
      { name: POKEMON.rhydon, moveId: MOVES.ground.physical.earthquake },
    ]
  },
  {
    level: 8,
    name: ENTRENADORES.ChicaGuay.name,
    img: ENTRENADORES.ChicaGuay.img,
    pokemonPool: [
      { name: POKEMON.vaporeon, moveId: MOVES.water.special.surf },
      { name: POKEMON.jolteon, moveId: MOVES.electric.special.thunder },
      { name: POKEMON.flareon, moveId: MOVES.fire.special.flamethrower },
    ]
  },
  {
    level: 8,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.alakazam, moveId: MOVES.psychic.special.psychic },
      { name: POKEMON.gengar, moveId: MOVES.ghost.special.shadow_ball },
      { name: POKEMON.starmie, moveId: MOVES.water.special.surf },
    ]
  },

  // ── Nivel 9 — Finales con objetos equipados ───────────────────────────────
  {
    level: 9,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.machamp, moveId: MOVES.fighting.physical.brick_break, heldItem: ITEM.choice_band },
      { name: POKEMON.arcanine, moveId: MOVES.normal.physical.extreme_speed, heldItem: ITEM.lifeorb },
      { name: POKEMON.lapras, moveId: MOVES.ice.special.ice_beam, heldItem: ITEM.leftovers },
      { name: POKEMON.dragonite, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf },
    ]
  },
  {
    level: 9,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.alakazam, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs },
      { name: POKEMON.gengar, moveId: MOVES.ghost.special.shadow_ball, heldItem: ITEM.lifeorb },
      { name: POKEMON.dragonair, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf },
      { name: POKEMON.starmie, moveId: MOVES.water.special.surf, heldItem: ITEM.lifeorb },
    ]
  },
  {
    level: 9,
    name: ENTRENADORES.ChicoGuay.name,
    img: ENTRENADORES.ChicoGuay.img,
    pokemonPool: [
      { name: POKEMON.charizard, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.lifeorb },
      { name: POKEMON.blastoise, moveId: MOVES.water.special.surf, heldItem: ITEM.leftovers },
      { name: POKEMON.venusaur, moveId: MOVES.grass.special.giga_drain, heldItem: ITEM.assault_vest },
    ]
  },

  // ── Nivel 10 — Élite, máxima dificultad ──────────────────────────────────
  {
    level: 10,
    name: ENTRENADORES.Pokemaniaco.name,
    img: ENTRENADORES.Pokemaniaco.img,
    pokemonPool: [
      { name: POKEMON.dragonite, moveId: MOVES.dragon.physical.dragon_claw, heldItem: ITEM.choice_scarf },
      { name: POKEMON.snorlax, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.leftovers },
      { name: POKEMON.tauros, moveId: MOVES.normal.physical.hyper_fang, heldItem: ITEM.choice_band },
      { name: POKEMON.arcanine, moveId: MOVES.normal.physical.extreme_speed, heldItem: ITEM.choice_band },
    ]
  },
  {
    level: 10,
    name: ENTRENADORES.Cientifico.name,
    img: ENTRENADORES.Cientifico.img,
    pokemonPool: [
      { name: POKEMON.mewtwo, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.choice_specs },
      { name: POKEMON.alakazam, moveId: MOVES.psychic.special.psychic, heldItem: ITEM.lifeorb },
      { name: POKEMON.gengar, moveId: MOVES.ghost.special.shadow_ball, heldItem: ITEM.lifeorb },
    ]
  },
  {
    level: 10,
    name: ENTRENADORES.ChicaGuay.name,
    img: ENTRENADORES.ChicaGuay.img,
    pokemonPool: [
      { name: POKEMON.vaporeon, moveId: MOVES.water.special.surf, heldItem: ITEM.leftovers },
      { name: POKEMON.jolteon, moveId: MOVES.electric.special.thunder, heldItem: ITEM.choice_specs },
      { name: POKEMON.flareon, moveId: MOVES.fire.special.flamethrower, heldItem: ITEM.lifeorb },
    ]
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
