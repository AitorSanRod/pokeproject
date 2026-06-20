// ─────────────────────────────────────────────────────────────────────────────
// EFECTOS DE MOVIMIENTOS
//
// trigger : TRIGGERS.AFTER_ATTACK | TRIGGERS.BEFORE_ATTACK | TRIGGERS.ON_HITTED
// desc    : descripción visible en el hover del movimiento
// fn      : lógica del efecto — recibe ctx según el trigger
//
// Contextos:
//   BEFORE_ATTACK / AFTER_ATTACK:
//     { user, target, dmg, team, log, showStatChange, updatePlayerHud }
//   ON_HITTED:
//     { user, attacker, dmg, team, log, showStatChange, updatePlayerHud }
//
// CÓMO AÑADIR UN EFECTO:
//   1. Añade entrada en MOVE_EFFECTS con id único
//   2. Usa TRIGGERS.X como trigger
//   3. Pon effectId: 'tu-id' en el movimiento de move-pool.js
//   4. Si el efecto pone un estado y no siempre debe aplicarse, añade:
//      statusChance: 0.30  → 30% de probabilidad de activarse
//      Si no se declara statusChance, el efecto siempre se aplica.
// ─────────────────────────────────────────────────────────────────────────────

// Lista cerrada de triggers válidos
var TRIGGERS = Object.freeze({
  BEFORE_ATTACK: 'before-attack',  // antes de que el pokemon ataque este turno
  AFTER_ATTACK: 'after-attack',   // después de aplicar el daño del ataque
  ON_HITTED: 'on-hitted',      // cuando nuestro pokemon activo recibe un golpe
});

var MOVE_EFFECTS = {

  // ── AFTER_ATTACK ──────────────────────────────────────────────────────────

  'drain-50': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Recupera el 50% del daño causado',
    fn(ctx) {
      const heal = Math.max(1, Math.floor(ctx.dmg * 0.50));
      const before = ctx.user.currentHp;
      ctx.user.currentHp = Math.min(ctx.user.stats.hp, ctx.user.currentHp + heal);
      const actual = ctx.user.currentHp - before;
      if (actual > 0) {
        ctx.log(`${ctx.user.displayName} absorbio ${actual} HP!`);
        if (ctx.updatePlayerHud) ctx.updatePlayerHud();
      }
    },
  },

  'drain-25': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Recupera el 25% del daño causado',
    fn(ctx) {
      const heal = Math.max(1, Math.floor(ctx.dmg * 0.25));
      const before = ctx.user.currentHp;
      ctx.user.currentHp = Math.min(ctx.user.stats.hp, ctx.user.currentHp + heal);
      const actual = ctx.user.currentHp - before;
      if (actual > 0) {
        ctx.log(`${ctx.user.displayName} absorbio ${actual} HP!`);
        if (ctx.updatePlayerHud) ctx.updatePlayerHud();
      }
    },
  },

  'drain-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Recupera el 10% del daño causado',
    fn(ctx) {
      const heal = Math.max(1, Math.floor(ctx.dmg * 0.10));
      const before = ctx.user.currentHp;
      ctx.user.currentHp = Math.min(ctx.user.stats.hp, ctx.user.currentHp + heal);
      const actual = ctx.user.currentHp - before;
      if (actual > 0) {
        ctx.log(`${ctx.user.displayName} absorbio ${actual} HP!`);
        if (ctx.updatePlayerHud) ctx.updatePlayerHud();
      }
    },
  },

  'lower-atk-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    statusChance: 0.10,
    desc: 'Baja el ATK del rival un 10%',
    fn(ctx) {
      if (hasClearEffect(ctx.target)) {
        ctx.log(`${ctx.target.displayName} esta protegido y no puede ser debilitado!`);
        return;
      }
      if (!ctx.target.combatMods) ctx.target.combatMods = {};
      ctx.target.combatMods.atk = (ctx.target.combatMods.atk ?? 0) - 0.10;
      ctx.log(`El ATK de ${ctx.target.displayName} bajo!`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.target, 'ATK', 'down', 10);
    },
  },

  'lower-atk-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Baja el ATK del rival un 20%',
    fn(ctx) {
      if (hasClearEffect(ctx.target)) {
        ctx.log(`${ctx.target.displayName} esta protegido y no puede ser debilitado!`);
        return;
      }
      if (!ctx.target.combatMods) ctx.target.combatMods = {};
      ctx.target.combatMods.atk = (ctx.target.combatMods.atk ?? 0) - 0.20;
      ctx.log(`El ATK de ${ctx.target.displayName} bajo!`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.target, 'ATK', 'down', 20);
    },
  },

  'lower-def-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Baja la DEF del rival un 20%',
    fn(ctx) {
      if (hasClearEffect(ctx.target)) {
        ctx.log(`${ctx.target.displayName} esta protegido y no puede ser debilitado!`);
        return;
      }
      if (!ctx.target.combatMods) ctx.target.combatMods = {};
      ctx.target.combatMods.def = (ctx.target.combatMods.def ?? 0) - 0.20;
      ctx.log(`La DEF de ${ctx.target.displayName} bajo!`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.target, 'DEF', 'down', 20);
    },
  },

  'lower-spd-20-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Puede bajar la SPD del rival un 20%',
    statusChance: 0.10,
    fn(ctx) {
      if (hasClearEffect(ctx.target)) {
        ctx.log(`${ctx.target.displayName} esta protegido y no puede ser debilitado!`);
        return;
      }
      if (!ctx.target.combatMods) ctx.target.combatMods = {};
      ctx.target.combatMods.spd = (ctx.target.combatMods.spd ?? 0) - 0.20;
      ctx.log(`La SPD de ${ctx.target.displayName} bajo!`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.target, 'SPD', 'down', 20);
    },
  },

  'lower-spd-20-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Puede bajar la SPD del rival un 20%',
    statusChance: 0.20,
    fn(ctx) {
      if (hasClearEffect(ctx.target)) {
        ctx.log(`${ctx.target.displayName} esta protegido y no puede ser debilitado!`);
        return;
      }
      if (!ctx.target.combatMods) ctx.target.combatMods = {};
      ctx.target.combatMods.spd = (ctx.target.combatMods.spd ?? 0) - 0.20;
      ctx.log(`La SPD de ${ctx.target.displayName} bajo!`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.target, 'SPD', 'down', 20);
    },
  },

  'raise-spa-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    statusChance: 0.10,
    desc: 'Sube el SPA propio un 10% del base',
    fn(ctx) {
      if (!ctx.user.combatMods) ctx.user.combatMods = {};
      ctx.user.combatMods.spa = (ctx.user.combatMods.spa ?? 0) + 0.10;
      const pct = Math.round(ctx.user.combatMods.spa * 100);
      ctx.log(`El SPA de ${ctx.user.displayName} subio! (+${pct}% base)`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.user, 'SPA', 'up', 10);
    },
  },

  'raise-atk-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Sube el ATK propio un 20% del base',
    fn(ctx) {
      if (!ctx.user.combatMods) ctx.user.combatMods = {};
      ctx.user.combatMods.atk = (ctx.user.combatMods.atk ?? 0) + 0.20;
      const pct = Math.round(ctx.user.combatMods.atk * 100);
      ctx.log(`El ATK de ${ctx.user.displayName} subio! (+${pct}% base)`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.user, 'ATK', 'up', 20);
    },
  },

  'raise-def-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Sube el DEF propio un 20% del base con cada ataque',
    fn(ctx) {
      if (!ctx.user.combatMods) ctx.user.combatMods = {};
      ctx.user.combatMods.def = (ctx.user.combatMods.def ?? 0) + 0.20;
      const pct = Math.round(ctx.user.combatMods.def * 100);
      ctx.log(`El DEF de ${ctx.user.displayName} subio! (+${pct}% base)`);
      if (ctx.showStatChange) ctx.showStatChange(ctx.user, 'DEF', 'up', 20);
    },
  },

  'burn-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 10% de probabilidad de quemar al rival',
    statusChance: 0.10,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'burn', ctx.log);
    },
  },

  'burn-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 20% de probabilidad de quemar al rival',
    statusChance: 0.20,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'burn', ctx.log);
    },
  },

  'burn-25': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 25% de probabilidad de quemar al rival',
    statusChance: 0.25,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'burn', ctx.log);
    },
  },

  'poison-25': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 25% de probabilidad de envenenar al rival',
    statusChance: 0.25,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'poison', ctx.log);
    },
  },

  'poison-50': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 50% de probabilidad de envenenar al rival',
    statusChance: 0.50,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'poison', ctx.log);
    },
  },

  'sleep-after': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Duerme al rival tras el ataque',
    statusChance: 1.00,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'sleep', ctx.log);
    },
  },

  'sleep-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 10% de probabilidad de hacer dormir al rival',
    statusChance: 0.10,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'sleep', ctx.log);
    },
  },

  'paralize-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 10% de probabilidad de paralizar al rival',
    statusChance: 0.10,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'paralysis', ctx.log);
    },
  },

  'paralize-25': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 25% de probabilidad de paralizar al rival',
    statusChance: 0.25,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'paralysis', ctx.log);
    },
  },

  'freeze-10': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 10% de probabilidad de congelar al rival',
    statusChance: 0.10,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'freeze', ctx.log);
    },
  },

  'freeze-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 20% de probabilidad de congelar al rival',
    statusChance: 0.20,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'freeze', ctx.log);
    },
  },

  'freeze-50': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 50% de probabilidad de congelar al rival',
    statusChance: 0.50,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'freeze', ctx.log);
    },
  },

  'sleep-15': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 15% de probabilidad de hacer dormir al rival',
    statusChance: 0.15,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'sleep', ctx.log);
    },
  },

  'sleep-30': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'Tiene un 30% de probabilidad de hacer dormir al rival',
    statusChance: 0.30,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'sleep', ctx.log);
    },
  },

  'flinch-20': {
    trigger: TRIGGERS.AFTER_ATTACK,
    statusChance: 0.20,
    desc: '20% de probabilidad de hacer retroceder al rival',
    fn(ctx) {
      ctx.target._flinched = true;
    },
  },

  'flinch-30': {
    trigger: TRIGGERS.AFTER_ATTACK,
    statusChance: 0.30,
    desc: '30% de probabilidad de hacer retroceder al rival',
    fn(ctx) {
      ctx.target._flinched = true;
    },
  },

  // ── BEFORE_ATTACK ─────────────────────────────────────────────────────────

  'sleep': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Duerme al rival.',
    statusChance: 1.00,
    fn(ctx) {
      StatusEffects.apply(ctx.target, 'sleep', ctx.log);
    },
  },

  'double-hit': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Golpea dos veces seguidas en el mismo turno',
    fn(ctx) {
      ctx.user._doubleHit = true;
    },
  },

  'priority': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Siempre ataca primero, independiente de la velocidad',
    fn(ctx) {
      ctx.user._priority = true;
    },
  },

  'sleep-attack': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Permite atacar aunque el usuario este dormido',
    fn(ctx) {
      // No-op: la lógica la aplica StatusEffects.checkBeforeAttack al detectar
      // este effectId en el autoMove — permite atacar ignorando el estado sueño.
    },
  },

  'sleep-self': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'El usuario se duerme antes de atacar cada turno',
    fn(ctx) {
      StatusEffects.apply(ctx.user, 'sleep', ctx.log);
    },
  },

  // ── PASIVO ────────────────────────────────────────────────────────────────
  'ventaja': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Dobla el daño si el rival sufre un problema de estado',
    fn(ctx) {
      if (ctx.target.statusEffect) ctx.user._ventaja = true;
    },
  },

  'clear': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Inmune a effectos de estado y cambios de estadisticas',
    fn(ctx) {
      // No-op: el efecto es pasivo, ver comentario arriba.
    },
  },

  'guts': {
    trigger: TRIGGERS.BEFORE_ATTACK,
    desc: 'Ignora las penalizaciones de quemado,<br> paralizado y congelado. +120% daño físico',
    fn(ctx) {
    },
  },

  // ── ON_HITTED ─────────────────────────────────────────────────────────────

  'recoil-10': {
    trigger: TRIGGERS.ON_HITTED,
    desc: 'Devuelve el 10% del daño recibido al atacante',
    fn(ctx) {
      const recoil = Math.max(1, Math.floor(ctx.dmg * 0.10));
      ctx.attacker.currentHp = Math.max(0, ctx.attacker.currentHp - recoil);
      ctx.log(`${ctx.attacker.displayName} recibio ${recoil} de rebote!`);
    },
  },

  'recoil-30': {
    trigger: TRIGGERS.ON_HITTED,
    desc: 'Devuelve el 30% del daño recibido al atacante',
    fn(ctx) {
      const recoil = Math.max(1, Math.floor(ctx.dmg * 0.30));
      ctx.attacker.currentHp = Math.max(0, ctx.attacker.currentHp - recoil);
      ctx.log(`${ctx.attacker.displayName} recibio ${recoil} de rebote!`);
    },
  },

  'shield-10': {
    trigger: TRIGGERS.ON_HITTED,
    desc: 'Reduce el daño recibido un 10%',
    fn(ctx) {
      const reduction = Math.floor(ctx.dmg * 0.10);
      ctx.dmg = Math.max(1, ctx.dmg - reduction);
      ctx.user.currentHp = Math.max(0, ctx.user.currentHp + reduction);
      ctx.log(`${ctx.user.displayName} redujo el daño del golpe!`);
    },
  },

  'shield-25': {
    trigger: TRIGGERS.ON_HITTED,
    desc: 'Reduce el daño recibido un 25%',
    fn(ctx) {
      const reduction = Math.floor(ctx.dmg * 0.25);
      ctx.dmg = Math.max(1, ctx.dmg - reduction);
      ctx.user.currentHp = Math.max(0, ctx.user.currentHp + reduction);
      ctx.log(`${ctx.user.displayName} redujo el daño del golpe!`);
    },
  },

  'shield-50': {
    trigger: TRIGGERS.ON_HITTED,
    desc: 'Reduce el daño recibido un 50%',
    fn(ctx) {
      const reduction = Math.floor(ctx.dmg * 0.50);
      ctx.dmg = Math.max(1, ctx.dmg - reduction);
      ctx.user.currentHp = Math.max(0, ctx.user.currentHp + reduction);
      ctx.log(`${ctx.user.displayName} redujo el daño del golpe!`);
    },
  },

  'heal-on-hit-10': {
    trigger: TRIGGERS.ON_HITTED,
    desc: 'Recupera el 10% del HP maximo al recibir un golpe',
    fn(ctx) {
      const heal = Math.max(1, Math.floor(ctx.user.stats.hp * 0.10));
      ctx.user.currentHp = Math.min(ctx.user.stats.hp, ctx.user.currentHp + heal);
      ctx.log(`${ctx.user.displayName} se recupero parcialmente!`);
    },
  },

  'self-destruct': {
    trigger: TRIGGERS.AFTER_ATTACK,
    desc: 'El usuario pierde toda su vida al usar este movimiento',
    fn(ctx) {
      ctx.user.currentHp = 0;
      ctx.log(`${ctx.user.displayName} se autodestruyo!`);
      ctx.updatePlayerHud?.();
    },
  },

};

// Aplica los efectos de un movimiento para un trigger dado.
// move.effectId puede ser:
//   - un string: 'double-hit'
//   - un array:  ['clear', 'double-hit']
// Cada effectId del array se evalúa EN ORDEN. Solo se ejecutan los que
// coinciden con `trigger` (antes/después del golpe, o al recibirlo) — un
// movimiento puede tener efectos para distintos triggers a la vez, p.ej.
// ['priority', 'drain-50'] ejecuta 'priority' en BEFORE_ATTACK y 'drain-50'
// en AFTER_ATTACK, cada uno en su momento correspondiente.
// Devuelve true si AL MENOS UN efecto se ejecutó.
function applyEffect(move, trigger, ctx) {
  if (!move?.effectId) return false;
  const ids = Array.isArray(move.effectId) ? move.effectId : [move.effectId];

  let executed = false;
  for (const id of ids) {
    const effect = MOVE_EFFECTS[id];
    if (!effect || effect.trigger !== trigger) continue;
    // Si el efecto tiene probabilidad, tirarla antes de ejecutar (cada
    // efecto del array tira su propia probabilidad de forma independiente)
    if (effect.statusChance !== undefined && Math.random() >= effect.statusChance) continue;
    try {
      effect.fn(ctx);
      executed = true;
    } catch (e) {
      console.error(`[EFFECT] Error en "${id}":`, e.message);
    }
  }
  return executed;
}

// Devuelve la(s) descripción(es) de move.effectId (string o array) unidas
// con ' · ' — útil para mostrar tooltips combinando varios efectos.
// Devuelve null si el movimiento no tiene effectId o ninguno tiene desc.
function getEffectDescriptions(move) {
  if (!move?.effectId) return null;
  const ids = Array.isArray(move.effectId) ? move.effectId : [move.effectId];
  const descs = ids.map(id => MOVE_EFFECTS[id]?.desc).filter(Boolean);
  return descs.length > 0 ? descs.join(' · ') : null;
}
