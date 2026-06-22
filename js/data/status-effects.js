// ─────────────────────────────────────────────────────────────────────────────
// EFECTOS DE ESTADO DE COMBATE
//
// Un pokemon puede tener un único estado activo: pokemon.statusEffect
//
// Estructura de statusEffect:
// {
//   id:       StatusEffect.POISON | StatusEffect.PARALYSIS | StatusEffect.BURN | StatusEffect.SLEEP | StatusEffect.FREEZE | StatusEffect.CONFUSION
//   turnsActive: 0    ← se incrementa al inicio de cada turno del pokemon
// }
//
// CÓMO APLICAR UN ESTADO DESDE UN MOVIMIENTO:
//   En move-effects.js, dentro del fn del efecto:
//     StatusEffects.apply(ctx.target, StatusEffect.POISON, ctx.log);  // aplica al rival
//     StatusEffects.apply(ctx.user,   StatusEffect.BURN,   ctx.log);  // aplica al propio pokemon
//
// ICONOS que se muestran en el HUD:
//   StatusEffect.POISON    → 💜 PSN   StatusEffect.BURN      → 🔥 QEM   StatusEffect.SLEEP → 💤 SLE
//   StatusEffect.PARALYSIS → ⚡ PAR   StatusEffect.FREEZE    → 🧊 CON   StatusEffect.CONFUSION → 💫 CNF
//
// CONFUSIÓN (StatusEffect.CONFUSION):
//   Dura máximo 5 turnos. Cada turno: 33% autocura → 50% autogolpe (Normal físico 60 base, ignora inmunidades).
// ─────────────────────────────────────────────────────────────────────────────

// Lista cerrada de identificadores de estado válidos
var STATUS = Object.freeze({
  BURN:      'burn',
  POISON:    'poison',
  SLEEP:     'sleep',
  PARALYSIS: 'paralysis',
  FREEZE:    'freeze',
  CONFUSION: 'confusion',
});
const StatusEffect = STATUS;

const STATUS_META = {
  poison:    { label: 'PSN', icon: '💜', color: '#9B59B6', bg: '#F5EEF8' },
  paralysis: { label: 'PAR', icon: '⚡', color: '#F1C40F', bg: '#FEF9E7' },
  burn:      { label: 'QEM', icon: '🔥', color: '#E74C3C', bg: '#FDEDEC' },
  sleep:     { label: 'SLE', icon: '💤', color: '#7F8C8D', bg: '#F2F3F4' },
  freeze:    { label: 'CON', icon: '🧊', color: '#5DADE2', bg: '#EBF5FB' },
  confusion: { label: 'CNF', icon: '💫', color: '#7d22e6', bg: '#FEF5E7' },
};

// Movimiento de autogolpe al atacarse confundido (Normal físico 40 base)
const CONFUSION_SELF_HIT = Object.freeze({
  id: 'confusion-hit', name: 'Confusión', power: 60,
  type: 'normal', damageClass: 'physical', pp: 999, maxPp: 999,
  effectId: 'versatil',
});

const StatusEffects = {

  // ── Aplicar un estado a un pokemon ───────────────────────────────────────
  // Devuelve true si se aplicó, false si ya tenía un estado o es inmune
  apply(pokemon, statusId, log) {
    if (hasClearEffect(pokemon)) {
      if (log) log(`${pokemon.displayName} esta protegido y no puede ser afectado!`);
      return false;
    }
    if (HELD_ITEMS?.[pokemon.heldItem]?.blocksStatus) {
      if (log) log(`Las Gafas Protectoras de ${pokemon.displayName} bloquean el efecto!`);
      return false;
    }
    if (pokemon.statusEffect) {
      if (log) log(`${pokemon.displayName} ya tiene un estado alterado!`);
      return false;
    }
    if (!STATUS_META[statusId]) {
      console.warn(`[STATUS] Estado desconocido: ${statusId}`);
      return false;
    }

    pokemon.statusEffect = { id: statusId, turnsActive: 0 };

    const meta = STATUS_META[statusId];
    if (log) log(`${pokemon.displayName} fue ${StatusEffects._appliedMsg(statusId)}!`);

    // Burn reduce ATK base un 50% vía combatMods (guts lo ignora)
    if (statusId === StatusEffect.BURN && !hasGutsEffect(pokemon)) {
      if (!pokemon.combatMods) pokemon.combatMods = {};
      pokemon.combatMods._burnAtk = true;
      pokemon.combatMods.atk = (pokemon.combatMods.atk ?? 0) - 0.50;
    }

    // Freeze reduce SPA base un 50% vía combatMods (guts lo ignora)
    if (statusId === StatusEffect.FREEZE && !hasGutsEffect(pokemon)) {
      if (!pokemon.combatMods) pokemon.combatMods = {};
      pokemon.combatMods._freezeSpa = true;
      pokemon.combatMods.spa = (pokemon.combatMods.spa ?? 0) - 0.50;
    }

    // Paralysis reduce SPE un 50% — directamente en stats (guts lo ignora)
    if (statusId === StatusEffect.PARALYSIS && !hasGutsEffect(pokemon)) {
      pokemon._baseSpe = pokemon._baseSpe ?? pokemon.stats.spe;
      pokemon.stats.spe = Math.max(1, Math.floor(pokemon.stats.spe * 0.50));
    }

    console.log(`[STATUS] ${pokemon.displayName} → ${statusId}`);
    return true;
  },

  // ── Curar el estado ───────────────────────────────────────────────────────
  cure(pokemon, log) {
    if (!pokemon.statusEffect) return;
    const id = pokemon.statusEffect.id;

    // Revertir efectos de stat
    if (id === StatusEffect.BURN && pokemon.combatMods?._burnAtk) {
      pokemon.combatMods.atk = (pokemon.combatMods.atk ?? 0) + 0.50;
      delete pokemon.combatMods._burnAtk;
    }
    if (id === StatusEffect.FREEZE && pokemon.combatMods?._freezeSpa) {
      pokemon.combatMods.spa = (pokemon.combatMods.spa ?? 0) + 0.50;
      delete pokemon.combatMods._freezeSpa;
    }
    if (id === StatusEffect.PARALYSIS && pokemon._baseSpe) {
      pokemon.stats.spe = pokemon._baseSpe;
      delete pokemon._baseSpe;
    }

    if (log) log(`${pokemon.displayName} se recupero del estado alterado!`);
    pokemon.statusEffect = null;
    console.log(`[STATUS] ${pokemon.displayName} curado`);
  },

  // ── Comprobar si el pokemon puede atacar este turno ───────────────────────
  // Devuelve { canAttack: bool, message: string | null }
  checkBeforeAttack(pokemon) {
    const s = pokemon.statusEffect;
    if (!s) return { canAttack: true, message: null };

    s.turnsActive++;

    if (s.id === StatusEffect.SLEEP) {
      // Comprobar si el autoMove tiene el efecto 'sleep-attack' (atacar dormido)
      const activeMove = pokemon.moves?.find(m => m.id === pokemon.autoMove);
      const hasSleepAttack = activeMove && (
        activeMove.effectId === 'sleep-attack' ||
        (Array.isArray(activeMove.effectId) && activeMove.effectId.includes('sleep-attack'))
      );
      if (hasSleepAttack) {
        return { canAttack: true, message: `${pokemon.displayName} ataca en sueños!` };
      }

      // Turno 1: nunca se despierta
      // Turno 2: 33% de despertar
      // Turno 3: 66% de despertar
      // Turno 4+: siempre se despierta
      const wakeChance = s.turnsActive === 1 ? 0
        : s.turnsActive === 2 ? 0.33
        : s.turnsActive === 3 ? 0.66
        : 1.0;

      if (Math.random() < wakeChance) {
        StatusEffects.cure(pokemon, null);
        return { canAttack: true, message: `${pokemon.displayName} se desperto!` };
      }
      return { canAttack: false, message: `${pokemon.displayName} esta dormido...` };
    }

    if (s.id === StatusEffect.PARALYSIS) {
      if (Math.random() < 0.10) {
        return { canAttack: false, message: `${pokemon.displayName} esta paralizado!` };
      }
    }

    if (s.id === StatusEffect.CONFUSION) {
      // Máximo 5 turnos — se cura automáticamente
      if (s.turnsActive >= 5) {
        StatusEffects.cure(pokemon, null);
        return { canAttack: true, hitSelf: false, message: `${pokemon.displayName} ya no esta confundido!` };
      }
      // 33% de curarse cada turno
      if (Math.random() < 0.33) {
        StatusEffects.cure(pokemon, null);
        return { canAttack: true, hitSelf: false, message: `${pokemon.displayName} ya no esta confundido!` };
      }
      // 50% de golpearse a sí mismo
      if (Math.random() < 0.50) {
        return { canAttack: true, hitSelf: true, message: `${pokemon.displayName} esta confundido y se golpea a si mismo!` };
      }
      return { canAttack: true, hitSelf: false, message: `${pokemon.displayName} esta confundido!` };
    }

    return { canAttack: true, message: null };
  },

  // ── Efectos de fin de turno (daño por estado) ─────────────────────────────
  // Devuelve el daño infligido (0 si no hay)
  applyEndOfTurn(pokemon, log) {
    const s = pokemon.statusEffect;
    if (!s) return 0;

    let dmg = 0;

    if (s.id === StatusEffect.POISON) {
      dmg = Math.max(1, Math.floor(pokemon.stats.hp * 0.10));
      pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
      if (log) log(`${pokemon.displayName} sufre daño por veneno! (-${dmg} HP)`);
    }

    if (s.id === StatusEffect.BURN) {
      dmg = Math.max(1, Math.floor(pokemon.stats.hp * 0.05));
      pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
      if (log) log(`${pokemon.displayName} sufre daño por quemadura! (-${dmg} HP)`);
    }

    if (s.id === StatusEffect.FREEZE) {
      dmg = Math.max(1, Math.floor(pokemon.stats.hp * 0.05));
      pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
      if (log) log(`${pokemon.displayName} sufre daño por congelacion! (-${dmg} HP)`);
    }

    return dmg;
  },

  // ── HTML badge para mostrar en HUDs ──────────────────────────────────────
  badge(pokemon) {
    const s = pokemon.statusEffect;
    if (!s) return '';
    const m = STATUS_META[s.id];
    if (!m) return '';
    return `<span class="status-badge" style="background:${m.bg};color:${m.color};border-color:${m.color}">${m.icon} ${m.label}</span>`;
  },

  // ── Mensaje de aplicación ─────────────────────────────────────────────────
  _appliedMsg(id) {
    return {
      poison:    'envenenado',
      paralysis: 'paralizado',
      burn:      'quemado',
      sleep:     'dormido',
      freeze:    'congelado',
      confusion: 'confundido',
    }[id] ?? 'afectado';
  },
};
