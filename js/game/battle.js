// Motor de combate — en vez de imprimir a consola, devuelve arrays de eventos
// que la UI consume para animar y mostrar mensajes

function calcDamage(attacker, defender, move) {
  if (!move || !move.power) return { dmg: 0, isCrit: false, modifiers: [] };

  // Daño fijo igual al nivel del atacante — ignora poder, stats y efectividad
  const _earlyIds = Array.isArray(move.effectId) ? move.effectId : [move.effectId ?? ''];
  if (_earlyIds.includes('seismic-toss-damage')) {
    return { dmg: Math.max(1, attacker.level), isCrit: false, eff: 1, modifiers: [] };
  }

  // Levitate: inmune a movimientos de tipo Tierra
  if (defender.ability === 'levitate' && move.type === 'ground') {
    return { dmg: 0, isCrit: false, eff: 0, modifiers: [] };
  }

  const isSpecial = move.damageClass === 'special';

  // Modificadores aditivos sobre la base: mod=0 → ×1.0, mod=0.4 → ×1.4, mod=-0.4 → ×0.6
  // Mínimo multiplicador: 0.1 (no puede llegar a 0 ni negativo)
  const atkMod  = attacker.combatMods?.atk ?? 0;
  const spaMod  = attacker.combatMods?.spa ?? 0;
  const defMod  = defender.combatMods?.def ?? 0;
  const spdMod  = defender.combatMods?.spd ?? 0;

  const atkMult = Math.max(0.1, 1 + atkMod);
  const spaMult = Math.max(0.1, 1 + spaMod);
  const defMult = Math.max(0.1, 1 + defMod);
  const spdMult = Math.max(0.1, 1 + spdMod);

  const atk = isSpecial
    ? Math.floor(attacker.stats.spa * spaMult)
    : Math.floor(attacker.stats.atk * atkMult);
  const def = isSpecial
    ? Math.floor(defender.stats.spd * spdMult)
    : Math.floor(defender.stats.def * defMult);

  let dmg = Math.floor((((2 * attacker.level / 5 + 2) * move.power * atk) / def) / 50) + 2;

  const stab   = attacker.types.includes(move.type) ? COMBAT_CONFIG.STAB_MULTIPLIER : 1.0;
  let eff      = getEffectiveness(move.type, defender.types);
  if (eff === 0) {
    const ids = Array.isArray(move.effectId) ? move.effectId : [move.effectId];
    if (ids.includes('versatil')) eff = 1;
  }
  const rnd    = COMBAT_CONFIG.RANDOM_MIN + Math.random() * (COMBAT_CONFIG.RANDOM_MAX - COMBAT_CONFIG.RANDOM_MIN);

  dmg = Math.floor(dmg * stab * eff * rnd);

  // ── Desglose de modificadores activos — para el log de combate (UI).
  // Solo se incluyen modificadores de combatMods relevantes para esta
  // clase de movimiento (atk/spa del atacante, def/spd del defensor) y
  // distintos de 0, más cualquier boost de objeto equipado.
  const modifiers = [];
  const atkLabel = isSpecial ? 'SPA' : 'ATK';
  const defLabel = isSpecial ? 'SPD' : 'DEF';
  const atkModVal = isSpecial ? spaMod : atkMod;
  const defModVal = isSpecial ? spdMod : defMod;
  if (atkModVal !== 0) {
    modifiers.push({
      label: `${atkLabel} ${attacker.displayName} ${atkModVal > 0 ? '+' : ''}${Math.round(atkModVal * 100)}%`,
      mult: Math.max(0.1, 1 + atkModVal),
    });
  }
  if (defModVal !== 0) {
    modifiers.push({
      label: `${defLabel} ${defender.displayName} ${defModVal > 0 ? '+' : ''}${Math.round(defModVal * 100)}%`,
      mult: Math.max(0.1, 1 + defModVal),
    });
  }

  // ── Objeto equipado del ATACANTE — boost de daño condicional por tipo/clase
  // (p.ej. Carbón: +25% a movimientos de tipo fuego).
  // Se evalúa en tiempo real desde HELD_ITEMS — si el objeto se quita, el
  // boost deja de aplicarse automáticamente sin necesidad de revertir nada.
  const heldItem = HELD_ITEMS?.[attacker.heldItem];
  if (heldItem?.dmgBoost) {
    const { mult, type, class: cls } = heldItem.dmgBoost;
    const typeMatches  = !type || move.type === type;
    const classMatches = !cls  || move.damageClass === cls;
    const ownerMatches = !heldItem.dmgBoost.onlyFor || attacker.name === heldItem.dmgBoost.onlyFor;
    if (typeMatches && classMatches && ownerMatches) {
      dmg = Math.floor(dmg * (1 + mult));
      modifiers.push({
        label: `${heldItem.name} (${attacker.displayName}) +${Math.round(mult * 100)}%`,
        mult: 1 + mult,
      });
    }
  }

  // ── Huge Power: duplica el ATK físico
  if (!isSpecial && attacker.ability === 'huge-power') {
    dmg = Math.floor(dmg * 2);
    modifiers.push({ label: `Potencia (${attacker.displayName}) ×2`, mult: 2 });
  }

  // ── Guts — +50% daño físico (habilidad pasiva)
  if (!isSpecial && hasGutsEffect(attacker)) {
    const gutsMult = (typeof ABILITIES !== 'undefined' && ABILITIES['guts']?.dmgMult) ?? 1.5;
    dmg = Math.floor(dmg * gutsMult);
    modifiers.push({ label: `Agallas (${attacker.displayName}) +${Math.round((gutsMult - 1) * 100)}%`, mult: gutsMult });
  }

  const _effectIds = Array.isArray(move.effectId) ? move.effectId : [move.effectId];
  const critChance = _effectIds.includes('crit-75') ? 0.75 : COMBAT_CONFIG.CRIT_CHANCE;
  const isCrit = Math.random() < critChance;
  if (isCrit) dmg = Math.floor(dmg * COMBAT_CONFIG.CRIT_MULTIPLIER);

  return { dmg: Math.max(1, dmg), isCrit, eff, modifiers };
}

function enemyChooseMove(enemy, player) {
  if (!enemy.moves || enemy.moves.length === 0) {
    console.error('[COMBAT] enemyChooseMove: rival sin movimientos', enemy.displayName);
    return null;
  }

  // Respetar enemy.autoMove si está definido y es un movimiento válido del
  // rival — esto es lo que routes.js fija vía moveId (ver sección 5 del README).
  // El cálculo de "mejor movimiento" solo es un fallback para rivales sin
  // autoMove definido (p.ej. nunca debería pasar, pero por seguridad).
  if (enemy.autoMovePool && enemy.autoMovePool.length > 0) {
    const pool = enemy.autoMovePool
      .map(id => enemy.moves.find(m => m.id === id))
      .filter(Boolean);
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
  }
  if (enemy.autoMove) {
    const fixed = enemy.moves.find(m => m.id === enemy.autoMove);
    if (fixed) return fixed;
  }

  let best = null, bestScore = -1;
  for (const move of enemy.moves) {
    if (!move.power) continue;
    const eff   = getEffectiveness(move.type, player.types);
    const score = move.power * eff * (enemy.types.includes(move.type) ? COMBAT_CONFIG.STAB_MULTIPLIER : 1);
    if (score > bestScore) { bestScore = score; best = move; }
  }

  // Fallback: primero con poder, o el primero de la lista
  const chosen = best ?? enemy.moves.find(m => m.power) ?? enemy.moves[0];

  // Verificación de integridad: el movimiento elegido debe pertenecer al enemy
  if (!enemy.moves.includes(chosen)) {
    console.error('[COMBAT] enemyChooseMove: movimiento no pertenece al rival!', chosen, enemy.displayName);
    return enemy.moves[0];
  }

  return chosen;
}

// Ejecuta UN turno y devuelve array de eventos
// Evento: { type, ...datos }
function executeTurn(attacker, defender, move) {
  const events = [];
  if (!move) return events;

  const { dmg, isCrit, eff } = calcDamage(attacker, defender, move);
  defender.currentHp = Math.max(0, defender.currentHp - dmg);

  events.push({ type: 'attack',  attacker: attacker.displayName, move: move.name, moveType: move.type });
  if (isCrit) events.push({ type: 'crit' });
  if (eff >= 2)   events.push({ type: 'effective',   level: 'super' });
  if (eff === 0)  events.push({ type: 'effective',   level: 'none'  });
  if (eff > 0 && eff < 1) events.push({ type: 'effective', level: 'not' });
  events.push({ type: 'damage',  target: defender.displayName, dmg, hp: defender.currentHp, maxHp: defender.stats.hp });

  if (defender.currentHp <= 0) {
    events.push({ type: 'faint', target: defender.displayName });
  }

  return events;
}

// Simula el combate completo y devuelve { events, result, balls }
// No tiene side effects visuales — todo va por eventos
async function runBattleSim(playerPokemon, foePokemon, options = {}) {
  const {
    isWild    = false,
    isTrainer = false,
    isGym     = false,
    team      = null,
    playerBalls = 0,
  } = options;

  const events = [];
  let balls  = playerBalls;
  let caught = false;

  // Intro
  if (isGym)        events.push({ type: 'intro-gym',     foe: foePokemon.displayName });
  else if (isTrainer) events.push({ type: 'intro-trainer', foe: foePokemon.displayName });
  else              events.push({ type: 'intro-wild',    foe: foePokemon.displayName });

  let round = 0;
  let activePlayer = playerPokemon;

  while (isAlive(foePokemon)) {
    if (!isAlive(activePlayer)) {
      if (!team) break;
      const next = team.find(p => isAlive(p) && p !== activePlayer);
      if (!next) break;
      activePlayer = next;
      events.push({ type: 'swap', pokemon: activePlayer.displayName });
    }

    round++;
    events.push({ type: 'turn-start', round, playerHp: activePlayer.currentHp, playerMaxHp: activePlayer.stats.hp, foeHp: foePokemon.currentHp, foeMaxHp: foePokemon.stats.hp });

    const playerMove = options.chosenMove;
    const foeMove    = enemyChooseMove(foePokemon, activePlayer);
    const playerPrio  = getMovePriority(playerMove);
    const foePrio     = getMovePriority(foeMove);
    const playerFirst = playerPrio !== foePrio
      ? playerPrio > foePrio
      : activePlayer.stats.spe >= foePokemon.stats.spe;
    const [first, second]         = playerFirst ? [activePlayer, foePokemon] : [foePokemon, activePlayer];
    const [firstMove, secondMove] = playerFirst ? [playerMove, foeMove]      : [foeMove, playerMove];

    events.push(...executeTurn(first, second, firstMove));
    if (!isAlive(second)) break;
    events.push(...executeTurn(second, first, secondMove));
  }

  // Resultado
  if (!isAlive(foePokemon)) {
    events.push({ type: 'foe-defeated', foe: foePokemon.name });

    // EXP
    const battleType  = isGym ? 'gym' : isTrainer ? 'trainer' : 'wild';
    const fullTeam    = team ?? [activePlayer];


    for (const member of fullTeam) {
      if (member.currentHp <= 0) continue;
      const { gained, levelsGained } = gainExp(member, foePokemon.name, battleType, foePokemon.level);
      events.push({ type: 'exp', pokemon: member.displayName, gained });
      if (levelsGained > 0) events.push({ type: 'level-up', pokemon: member.displayName, level: member.level });
    }

    return { events, result: 'win', balls, caught: false };
  }

  if (!isAlive(activePlayer) && (!team || !team.find(p => isAlive(p)))) {
    return { events, result: 'loss', balls, caught: false };
  }

  return { events, result: 'unknown', balls, caught: false };
}
