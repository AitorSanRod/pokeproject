// ─────────────────────────────────────────────────────────────────────────────
// OBJETOS EQUIPADOS (HELD ITEMS)
//
// Cada pokemon puede llevar como mucho UN objeto equipado (pokemon.heldItem,
// guarda el id del objeto o null). Los objetos viven en HELD_ITEMS, con una
// estructura muy similar a MOVE_EFFECTS (move-effects.js) pero en su propio
// archivo para mantener la lógica separada.
//
// TRIGGERS:
//   PASSIVE        → se aplica/revierte UNA VEZ al equipar/quitar el objeto
//                     (p.ej. modificar combatMods de forma permanente mientras
//                     se lleve el objeto). fn(ctx) y revert(ctx).
//   ON_TURN_START  → se evalúa al principio de cada turno de combate, con el
//                     HP ya actualizado tras el daño recibido. Útil para
//                     objetos de curación condicional (Baya Zidra).
//   ON_TURN_END    → se evalúa al FINAL del turno, después del daño por
//                     estado (veneno/quemadura/etc). Si varios pokemon tienen
//                     un objeto ON_TURN_END, se resuelven en orden de
//                     velocidad (effectiveSpeed, mayor primero) — pero
//                     siempre como última acción del turno, después de todo
//                     lo demás. Útil para curación pasiva (Restos).
//
// onceFlag: si se declara, el efecto solo puede activarse UNA VEZ por
// ese identificador — el flag se guarda en pokemon._heldItemFlags[onceFlag]
// y se resetea junto con combatMods al empezar una ruta nueva (screens.js,
// adventure()).
//
// blocksMoveChange: true → mientras el pokemon lleve este objeto, no se puede
// cambiar su autoMove desde el selector de la pantalla de ruta (Pañuelo Elección).
//
// CÓMO AÑADIR UN OBJETO NUEVO:
//   1. Añade entrada en HELD_ITEMS con id único
//   2. trigger: HELD_ITEM_TRIGGERS.PASSIVE | ON_TURN_START
//   3. Para PASSIVE: fn(ctx) al equipar, revert(ctx) al quitar
//   4. Para ON_TURN_START: fn(ctx) — usa onceFlag si solo debe activarse una vez
//   5. name/desc/img — mostrados en la UI (tooltip, tienda, etc.)
// ─────────────────────────────────────────────────────────────────────────────

var HELD_ITEM_TRIGGERS = Object.freeze({
  PASSIVE: 'passive',          // al equipar (fn) / al quitar (revert)
  ON_TURN_START: 'on-turn-start',    // al inicio de cada turno de combate
  ON_TURN_END: 'on-turn-end',        // al final de cada turno de combate
});

var HELD_ITEMS = {

  // ── CURACIÓN ─────────────────────────────────────────────────────────────────

  'sitrus-berry': {
    name: 'Baya Zidra',
    desc: 'Si el HP baja del 50%, restaura el 25% del HP máximo. Solo una vez por ruta.',
    img: 'assets/sprites/items/sitrus-berry.png',
    fallbackIcon: '🍒',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.ON_TURN_START,
    onceFlag: 'sitrus-berry-used',
    fn(ctx) {
      const { user, log, updateHud } = ctx;
      // No saltar si el pokemon está debilitado (HP a 0)
      if (user.currentHp <= 0) return false;
      if (user.currentHp / user.stats.hp >= 0.5) return false;

      const heal = Math.max(1, Math.floor(user.stats.hp * 0.25));
      const before = user.currentHp;
      user.currentHp = Math.min(user.stats.hp, user.currentHp + heal);
      const actual = user.currentHp - before;
      if (actual > 0) {
        log(`${user.displayName} usó la Baya Zidra!`);
        if (updateHud) updateHud();
      }
      return true; // consumida — onceFlag se marca aunque actual sea 0
    },
  },

  // ── OBJETOS ELECCIÓN ─────────────────────────────────────────────────────────

  'choice-scarf': {
    name: 'Pañuelo Elección',
    desc: 'Aumenta la VEL un 100%, pero bloquea el cambio de movimiento.',
    img: 'assets/sprites/items/choice-scarf.png',
    fallbackIcon: '🧣',
    canChange: false,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    blocksMoveChange: true,
    fn(ctx) {
      const { user } = ctx;
      if (!user.combatMods) user.combatMods = {};
      user.combatMods.spe = (user.combatMods.spe ?? 0) + 1.0;
    },
    revert(ctx) {
      const { user } = ctx;
      if (!user.combatMods) return;
      user.combatMods.spe = (user.combatMods.spe ?? 0) - 1.0;
    },
  },

  'choice-specs': {
    name: 'Gafas  Elección',
    desc: 'Aumenta la SPA un 100%, pero bloquea el cambio de movimiento.',
    img: 'assets/sprites/items/gafas-eleccion.png',
    fallbackIcon: '👓',
    canChange: false,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    blocksMoveChange: true,
    fn(ctx) {
      const { user } = ctx;
      if (!user.combatMods) user.combatMods = {};
      user.combatMods.spa = (user.combatMods.spa ?? 0) + 1.0;
    },
    revert(ctx) {
      const { user } = ctx;
      if (!user.combatMods) return;
      user.combatMods.spa = (user.combatMods.spa ?? 0) - 1.0;
    },
  },

  'choice-band': {
    name: 'Cinta  Elección',
    desc: 'Aumenta la ATK un 100%, pero bloquea el cambio de movimiento.',
    img: 'assets/sprites/items/cinta-eleccion.png',
    fallbackIcon: '👓',
    canChange: false,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    blocksMoveChange: true,
    fn(ctx) {
      const { user } = ctx;
      if (!user.combatMods) user.combatMods = {};
      user.combatMods.atk = (user.combatMods.atk ?? 0) + 1.0;
    },
    revert(ctx) {
      const { user } = ctx;
      if (!user.combatMods) return;
      user.combatMods.atk = (user.combatMods.atk ?? 0) - 1.0;
    },
  },

  // ── DEFENSIVOS / UTILIDAD ────────────────────────────────────────────────────

  'assault-vest': {
    name: 'Chaleco Asalto',
    desc: 'Aumenta un 50% la defensa especial.',
    img: 'assets/sprites/items/assault-vest.png',
    fallbackIcon: '🦺',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    fn(ctx) {
      const { user } = ctx;
      if (!user.combatMods) user.combatMods = {};
      user.combatMods.spd = (user.combatMods.spd ?? 0) + 0.5;
    },
    revert(ctx) {
      const { user } = ctx;
      if (!user.combatMods) return;
      user.combatMods.spd = (user.combatMods.spd ?? 0) - 0.5;
    },
  },

  // ── POTENCIADORES DE DAÑO ────────────────────────────────────────────────────

  'carbon': {
    name: 'Carbón',
    desc: 'Aumenta el daño de los movimientos de tipo FUEGO un 25%.',
    img: 'assets/sprites/items/carbon.png',
    fallbackIcon: '🔥',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    // dmgBoost — leído en tiempo real por calcDamage (battle.js):
    //   mult  → multiplicador adicional de daño (0.5 = +50%)
    //   type  → solo aplica a movimientos de este MOVE_POOL type. null/ausente = todos los tipos
    //   class → solo aplica a movimientos de este damageClass ('physical'|'special'). null/ausente = ambas clases
    dmgBoost: { mult: 0.25, type: 'fire' },
    // Sin combatMods que aplicar/revertir — el efecto se evalúa directamente
    // en calcDamage comprobando heldItem del atacante, así que desequiparlo
    // hace que el boost deje de aplicarse automáticamente.
    fn(ctx) { },
    revert(ctx) { },
  },

  'mystic-water': {
    name: 'Agua Mística',
    desc: 'Aumenta el daño de los movimientos de tipo AGUA un 25%.',
    img: 'assets/sprites/items/mystic-water.png',
    fallbackIcon: '💧',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    dmgBoost: { mult: 0.25, type: 'water' },
    fn(ctx) { },
    revert(ctx) { },
  },

  'miracle-seed': {
    name: 'Semilla Milagro',
    desc: 'Aumenta el daño de los movimientos de tipo PLANTA un 25%.',
    img: 'assets/sprites/items/miracle-seed.png',
    fallbackIcon: '🌱',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    dmgBoost: { mult: 0.25, type: 'grass' },
    fn(ctx) { },
    revert(ctx) { },
  },

  'leftovers': {
    name: 'Restos',
    desc: 'Cura el 10% del HP máximo del pokemon equipado al final de cada turno.',
    img: 'assets/sprites/items/leftovers.png',
    fallbackIcon: '🍞',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.ON_TURN_END,
    fn(ctx) {
      const { user, log, updateHud } = ctx;
      // No curar a un pokemon debilitado
      if (user.currentHp <= 0) return false;
      // No curar si ya está al máximo
      if (user.currentHp >= user.stats.hp) return false;

      const heal = Math.max(1, Math.floor(user.stats.hp * 0.10));
      const before = user.currentHp;
      user.currentHp = Math.min(user.stats.hp, user.currentHp + heal);
      const actual = user.currentHp - before;
      if (actual > 0) {
        log(`${user.displayName} ha recuperado ${actual} HP con restos.`);
        if (updateHud) updateHud();
      }
      return actual > 0;
    },
  },

  'flame-orb': {
    name: 'Llamasfera',
    desc: 'Quema al portador al inicio del combate y le resta el 5% de HP al final de cada turno.',
    img: 'assets/sprites/items/flame-orb.png',
    fallbackIcon: '🔥',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.ON_TURN_START,
    fn(ctx) {
      const { user, log, updateHud } = ctx;
      if (user.currentHp <= 0) return false;

      if (user.statusEffect?.id !== StatusEffect.BURN) {
        StatusEffects.apply(user, StatusEffect.BURN, log);
      }

      const drain = Math.max(1, Math.floor(user.stats.hp * 0.05));
      user.currentHp = Math.max(0, user.currentHp - drain);
      log(`${user.displayName} pierde ${drain} HP por la Llama Orbe!`);
      if (updateHud) updateHud();
      return true;
    },
  },

  'safety-goggles': {
    name: 'Gafas Protectoras',
    desc: 'Inmunidad total a efectos de estado.',
    img: 'assets/sprites/items/safety-goggles.png',
    fallbackIcon: '🥽',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    blocksStatus: true,
    fn(ctx) { },
    revert(ctx) { },
  },

  'light-ball': {
    name: 'Bola Luminosa',
    desc: 'Aumenta el daño físico y especial de Pikachu un 150%. Impide que evolucione.',
    img: 'assets/sprites/items/bola-luminosa.png',
    fallbackIcon: '⚡',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    blocksEvolution: true,
    dmgBoost: { mult: 1.5, onlyFor: 'pikachu' },
    fn(ctx) { },
    revert(ctx) { },
  },

  'lifeorb': {
    name: 'Vidasfera',
    desc: 'Aumenta el daño un 100%, pero el pierdes el 10% de su HP al final de cada turno.',
    img: 'assets/sprites/items/lifeorb.png',
    fallbackIcon: '🔴',
    canChange: true,
    trigger: HELD_ITEM_TRIGGERS.ON_TURN_END,
    dmgBoost: { mult: 1.0 },
    fn(ctx) {
      const { user, log, updateHud } = ctx;
      if (user.currentHp <= 0) return false;

      const drain = Math.max(1, Math.floor(user.stats.hp * 0.10));
      user.currentHp = Math.max(0, user.currentHp - drain);
      log(`${user.displayName} pierde ${drain} HP por la Vida Esfera!`);
      if (updateHud) updateHud();
      return true;
    },
  },

  // ── PIEDRAS DE EVOLUCIÓN ─────────────────────────────────────────────────────

  'thunder-stone': {
    name: 'Piedra Trueno',
    desc: 'Provoca la evolución instantánea de ciertos pokemon. Se consume al usarla.',
    img: 'assets/sprites/items/piedra-trueno.png',
    fallbackIcon: '⚡',
    canChange: false,
    pairs: [
      { preEvo: 'pikachu', evo: 'raichu' },
      { preEvo: 'eevee', evo: 'jolteon' },
    ],
    canEquip(pokemon) {
      return this.pairs.some(p => p.preEvo === pokemon.name);
    },
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    fn(ctx) {
      const user = ctx.user;
      const pairs = this.pairs;
      const pair = pairs.find(p => p.preEvo === user.name);
      if (!pair) return;
      user.heldItem = null; // consume stone before evolve to prevent re-equip
      const idx = GameState.team.indexOf(user);
      evolve(user, pair.evo).then(evolved => {
        if (idx !== -1) {
          GameState.team[idx] = evolved;
          if (GameState.starter === user) GameState.starter = evolved;
        }
        Storage.markCaught(evolved.name);
        console.log(`[PIEDRA] ${user.displayName} → ${evolved.displayName}`);
      }).catch(e => {
        console.error(`[PIEDRA] Error evolucionando ${user.displayName}:`, e.message);
      });
    },
    revert(ctx) { },
  },

  'fire-stone': {
    name: 'Piedra Fuego',
    desc: 'Provoca la evolución instantánea de ciertos pokemon. Se consume al usarla.',
    img: 'assets/sprites/items/piedra-fuego.png',
    fallbackIcon: '🔥',
    canChange: false,
    pairs: [
      { preEvo: 'vulpix', evo: 'ninetales' },
      { preEvo: 'growlithe', evo: 'arcanine' },
      { preEvo: 'eevee', evo: 'flareon' },
    ],
    canEquip(pokemon) {
      return this.pairs.some(p => p.preEvo === pokemon.name);
    },
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    fn(ctx) {
      const user = ctx.user;
      const pairs = this.pairs;
      const pair = pairs.find(p => p.preEvo === user.name);
      if (!pair) return;
      user.heldItem = null;
      const idx = GameState.team.indexOf(user);
      evolve(user, pair.evo).then(evolved => {
        if (idx !== -1) {
          GameState.team[idx] = evolved;
          if (GameState.starter === user) GameState.starter = evolved;
        }
        Storage.markCaught(evolved.name);
        console.log(`[PIEDRA] ${user.displayName} → ${evolved.displayName}`);
      }).catch(e => {
        console.error(`[PIEDRA] Error evolucionando ${user.displayName}:`, e.message);
      });
    },
    revert(ctx) { },
  },

  'water-stone': {
    name: 'Piedra Agua',
    desc: 'Provoca la evolución instantánea de ciertos pokemon. Se consume al usarla.',
    img: 'assets/sprites/items/piedra-agua.png',
    fallbackIcon: '💧',
    canChange: false,
    pairs: [
      { preEvo: 'poliwhirl', evo: 'poliwrath' },
      { preEvo: 'shellder', evo: 'cloyster' },
      { preEvo: 'staryu', evo: 'starmie' },
      { preEvo: 'eevee', evo: 'vaporeon' },
    ],
    canEquip(pokemon) {
      return this.pairs.some(p => p.preEvo === pokemon.name);
    },
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    fn(ctx) {
      const user = ctx.user;
      const pairs = this.pairs;
      const pair = pairs.find(p => p.preEvo === user.name);
      if (!pair) return;
      user.heldItem = null;
      const idx = GameState.team.indexOf(user);
      evolve(user, pair.evo).then(evolved => {
        if (idx !== -1) {
          GameState.team[idx] = evolved;
          if (GameState.starter === user) GameState.starter = evolved;
        }
        Storage.markCaught(evolved.name);
        console.log(`[PIEDRA] ${user.displayName} → ${evolved.displayName}`);
      }).catch(e => {
        console.error(`[PIEDRA] Error evolucionando ${user.displayName}:`, e.message);
      });
    },
    revert(ctx) { },
  },

  'moon-stone': {
    name: 'Piedra Lunar',
    desc: 'Provoca la evolución instantánea de ciertos pokemon. Se consume al usarla.',
    img: 'assets/sprites/items/piedra-lunar.png',
    fallbackIcon: '🌙',
    canChange: false,
    pairs: [
      { preEvo: 'nidorina', evo: 'nidoqueen' },
      { preEvo: 'nidorino', evo: 'nidoking' },
      { preEvo: 'clefairy', evo: 'clefable' },
      { preEvo: 'jigglypuff', evo: 'wigglytuff' },
    ],
    canEquip(pokemon) {
      return this.pairs.some(p => p.preEvo === pokemon.name);
    },
    trigger: HELD_ITEM_TRIGGERS.PASSIVE,
    fn(ctx) {
      const user = ctx.user;
      const pairs = this.pairs;
      const pair = pairs.find(p => p.preEvo === user.name);
      if (!pair) return;
      user.heldItem = null;
      const idx = GameState.team.indexOf(user);
      evolve(user, pair.evo).then(evolved => {
        if (idx !== -1) {
          GameState.team[idx] = evolved;
          if (GameState.starter === user) GameState.starter = evolved;
        }
        Storage.markCaught(evolved.name);
        console.log(`[PIEDRA] ${user.displayName} → ${evolved.displayName}`);
      }).catch(e => {
        console.error(`[PIEDRA] Error evolucionando ${user.displayName}:`, e.message);
      });
    },
    revert(ctx) { },
  },
};

// ── API ──────────────────────────────────────────────────────────────────────

// Equipa un objeto a un pokemon. Si ya llevaba otro, primero se revierte su
// efecto pasivo (no se "destruye" el anterior aquí — solo se reemplaza).
function equipHeldItem(pokemon, itemId) {
  if (!HELD_ITEMS[itemId]) {
    console.warn(`[ITEM] Objeto desconocido: ${itemId}`);
    return false;
  }
  if (pokemon.heldItem) unequipHeldItem(pokemon);

  pokemon.heldItem = itemId;
  pokemon._heldItemFlags = pokemon._heldItemFlags ?? {};

  const item = HELD_ITEMS[itemId];
  if (item.trigger === HELD_ITEM_TRIGGERS.PASSIVE && item.fn) {
    item.fn({ user: pokemon });
  }
  console.log(`[ITEM] ${pokemon.displayName} equipa ${item.name}`);
  return true;
}

// Quita el objeto equipado — revierte su efecto pasivo si lo tenía y "destruye"
// el objeto (no vuelve al inventario). Devuelve el id del objeto quitado, o null.
function unequipHeldItem(pokemon) {
  const itemId = pokemon.heldItem;
  if (!itemId) return null;
  const item = HELD_ITEMS[itemId];

  if (item?.trigger === HELD_ITEM_TRIGGERS.PASSIVE && item.revert) {
    item.revert({ user: pokemon });
  }

  pokemon.heldItem = null;
  console.log(`[ITEM] ${pokemon.displayName} pierde ${item?.name ?? itemId} (destruido)`);
  return itemId;
}

// Evalúa el efecto ON_TURN_START del objeto equipado de un pokemon, si lo tiene.
// ctx: { user, log, updateHud }
// Devuelve true si el efecto se ejecutó (y por tanto se consumió, si tenía onceFlag).
function applyHeldItemTurnStart(pokemon, ctx) {
  const itemId = pokemon?.heldItem;
  if (!itemId) return false;
  const item = HELD_ITEMS[itemId];
  if (!item || item.trigger !== HELD_ITEM_TRIGGERS.ON_TURN_START) return false;

  pokemon._heldItemFlags = pokemon._heldItemFlags ?? {};
  if (item.onceFlag && pokemon._heldItemFlags[item.onceFlag]) return false;

  let executed = false;
  try {
    executed = !!item.fn({ ...ctx, user: pokemon });
  } catch (e) {
    console.error(`[ITEM] Error en "${itemId}":`, e.message);
  }

  if (executed && item.onceFlag) {
    pokemon._heldItemFlags[item.onceFlag] = true;
  }
  return executed;
}

// Evalúa el efecto ON_TURN_END del objeto equipado de un pokemon, si lo tiene.
// ctx: { user, log, updateHud }
// Devuelve true si el efecto se ejecutó (y por tanto se consumió, si tenía onceFlag).
// Llamar al FINAL del turno (tras el daño por estado), en orden de
// effectiveSpeed (mayor primero) entre los pokemon que tengan un objeto
// ON_TURN_END — ver _applyEndOfTurnStatus en screens.js.
function applyHeldItemTurnEnd(pokemon, ctx) {
  const itemId = pokemon?.heldItem;
  if (!itemId) return false;
  const item = HELD_ITEMS[itemId];
  if (!item || item.trigger !== HELD_ITEM_TRIGGERS.ON_TURN_END) return false;

  pokemon._heldItemFlags = pokemon._heldItemFlags ?? {};
  if (item.onceFlag && pokemon._heldItemFlags[item.onceFlag]) return false;

  let executed = false;
  try {
    executed = !!item.fn({ ...ctx, user: pokemon });
  } catch (e) {
    console.error(`[ITEM] Error en "${itemId}":`, e.message);
  }

  if (executed && item.onceFlag) {
    pokemon._heldItemFlags[item.onceFlag] = true;
  }
  return executed;
}

// Resetea los flags "una vez por ruta" de todo el equipo — llamar en
// adventure() junto al reset de combatMods.
function resetHeldItemFlags(team) {
  for (const p of team) p._heldItemFlags = {};
}

// true si el pokemon lleva un objeto que bloquea el cambio de autoMove
// (p.ej. Pañuelo Eleccion)
function heldItemBlocksMoveChange(pokemon) {
  const item = HELD_ITEMS[pokemon?.heldItem];
  return !!item?.blocksMoveChange;
}

// ── ITEM — acceso por clave con guión bajo, igual que POKEMON/MOVES ──────────
// Permite escribir ITEM.sitrus_berry / ITEM.choice_scarf en routes.js en vez
// del id real con guión ('sitrus-berry' / 'choice-scarf').
// IMPORTANTE: al añadir un objeto nuevo a HELD_ITEMS, añadir también su entrada
// aquí para que el IDE ofrezca autocompletado.
var ITEM = {
  safety_goggles: 'safety-goggles',
  light_ball: 'light-ball',
  sitrus_berry: 'sitrus-berry',
  choice_scarf: 'choice-scarf',
  choice_specs: 'choice-specs',
  choice_band: 'choice-band',
  assault_vest: 'assault-vest',
  carbon: 'carbon',
  mystic_water: 'mystic-water',
  miracle_seed: 'miracle-seed',
  leftovers: 'leftovers',
  flame_orb: 'flame-orb',
  lifeorb: 'lifeorb',
  thunder_stone: 'thunder-stone',
  fire_stone: 'fire-stone',
  water_stone: 'water-stone',
  moon_stone: 'moon-stone',
};
