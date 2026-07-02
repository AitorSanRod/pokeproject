// ═══════════════════════════════════════════════════════════════════════════
// COMBAT V2 — Engine
//
// Cola de pasos asíncronos (TurnQueue) que garantiza que ningún paso
// comienza antes de que el anterior haya terminado completamente.
// Cada paso puede enqueue nuevos pasos — la cola es dinámica, no un array
// cerrado, lo que permite insertar pasos intermedios en cualquier momento.
// ═══════════════════════════════════════════════════════════════════════════

// ── Cola asíncrona de pasos ───────────────────────────────────────────────────

class TurnQueue {
  constructor() {
    this._steps    = [];
    this._running  = false;
    this._paused   = false;
    this._onResume = null;
  }

  enqueue(...fns) {
    this._steps.push(...fns);
    if (!this._running) this._flush();
    return this;
  }

  prepend(...fns) {
    this._steps.unshift(...fns);
    return this;
  }

  clear() { this._steps = []; }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
    if (this._onResume) { this._onResume(); this._onResume = null; }
  }

  get paused() { return this._paused; }

  // Espera (entre pasos) si la cola está pausada
  _waitIfPaused() {
    if (!this._paused) return Promise.resolve();
    return new Promise(r => { this._onResume = r; });
  }

  async _flush() {
    this._running = true;
    while (this._steps.length > 0) {
      await this._waitIfPaused();
      const step = this._steps.shift();
      try   { await step(); }
      catch (e) { console.error('[CV2 QUEUE]', e); }
    }
    this._running = false;
  }
}

// Movimiento de emergencia cuando un ataque no puede dañar al rival (eff === 0).
// Normal + versatil garantiza que siempre impacta independientemente del tipo defensor.
const FORCEJEO = Object.freeze({
  id: 'forcejeo', name: 'Forcejeo', power: 40,
  type: 'normal', damageClass: 'physical', pp: 999, maxPp: 999,
  effectId: 'versatil',
});

// ── Estado global del combate ─────────────────────────────────────────────────

const CombatV2 = {
  state: null,
  queue: null,

  // ── Punto de entrada ──────────────────────────────────────────────────────

  start(playerTeam, foeTeam, opts = {}) {
    const startPlayerIdx = playerTeam.findIndex(p => p.currentHp > 0 && p.stats);
    const prevWeather = opts.skipPlayerEntry ? (this.state?.weather ?? null) : null;
    this.state = {
      playerTeam,
      foeTeam,
      playerIndex:      startPlayerIdx !== -1 ? startPlayerIdx : 0,
      foeIndex:         0,
      turn:             0,
      ended:            false,
      isWild:           opts.isWild          ?? false,
      isTrainer:        opts.isTrainer       ?? false,
      isGym:            opts.isGym           ?? false,
      noExp:            opts.noExp           ?? false,
      trainerName:      opts.trainerName     ?? null,
      skipPlayerEntry:  opts.skipPlayerEntry ?? false,
      onWin:            opts.onWin           ?? null,
      onLoss:           opts.onLoss          ?? null,
      // ── Condiciones de batalla ──────────────────────────────────────────
      weather:     prevWeather,       // se preserva en combates de continuación
      field:       null,              // { id, turnsLeft } | null
      teamEffects: { player: [], foe: [], global: [] },
    };

    this.queue = new TurnQueue();
    this.queue.enqueue(() => this._stepEntry());
  },

  // ── API pública de condiciones de batalla ────────────────────────────────

  setWeather(id) {
    const def = WEATHER[id];
    if (!def) return;
    const alreadyActive = this.state.weather?.id === id;
    this.state.weather = { id, turnsLeft: def.turns ?? null };
    if (!alreadyActive) cv2UI.log(`¡Empezó ${def.name}!`);
    cv2UI.updateWeather(id);
  },

  setField(id) {
    const def = FIELD[id];
    if (!def) return;
    this.state.field = { id, turnsLeft: def.turns };
    cv2UI.log(`¡${def.name} cubre el campo de batalla!`);
  },

  addTeamEffect(side, id) {
    const def = TEAM_EFFECTS[id];
    if (!def) return;
    const scope = def.scope === 'global' ? 'global' : side;
    this.state.teamEffects[scope] = this.state.teamEffects[scope].filter(e => e.id !== id);
    this.state.teamEffects[scope].push({ id, turnsLeft: def.turns });
    cv2UI.log(`¡${def.name}!`);
  },

  // ── Pausa / reanudación ───────────────────────────────────────────────────

  get isPaused() { return this.queue?.paused ?? false; },

  pause() {
    this.queue?.pause();
    cv2UI.setPauseState(true);
  },

  resume() {
    this.queue?.resume();
    cv2UI.setPauseState(false);
  },

  togglePause() {
    this.isPaused ? this.resume() : this.pause();
  },

  // ── Accesores rápidos ─────────────────────────────────────────────────────

  get player()  { return this.state.playerTeam[this.state.playerIndex]; },
  get foe()     { return this.state.foeTeam[this.state.foeIndex]; },

  _getBySide(side) { return side === 'player' ? this.player : this.foe; },
  _getOpponentSide(side) { return side === 'player' ? 'foe' : 'player'; },
  _getOpponent(side)     { return this._getBySide(this._getOpponentSide(side)); },

  _showPlayerMove() {
    const p    = this.player;
    const move = p?.moves?.find(m => m.id === p.autoMove) ?? p?.moves?.[0];
    if (move) cv2UI.showMove(move);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PASO 1 — Entrada de Pokémon
  // ═══════════════════════════════════════════════════════════════════════════

  _buildIntroMsg() {
    const s = this.state;
    if (s.isGym)     return CV2_MESSAGES.gymBattle(s.trainerName ?? 'Líder');
    if (s.isTrainer) return CV2_MESSAGES.trainerBattle(s.trainerName ?? 'Entrenador');
    return CV2_MESSAGES.wildAppear(this.foe.displayName);
  },

  async _stepEntry() {
    cv2UI.updateWeather(this.state.weather?.id ?? null);
    cv2UI.resetMoveArea();

    const p = this.player;
    const f = this.foe;

    // Anuncio de inicio de nodo — no bloqueante: el resto de la entrada se carga en paralelo
    cv2UI.showIntro(this._buildIntroMsg());

    cv2UI.updateTeamBar('player', this.state.playerTeam);
    cv2UI.updateTeamBar('foe',    this.state.foeTeam);
    cv2UI.initTrainerBar(this.state.trainerName, this.state.isTrainer || this.state.isGym);
    cv2UI.resetSprite('foe', f);
    if (f.shiny) cv2UI.showShinyAnim('foe');
    cv2UI.initHud('foe', f);
    cv2UI.log(`¡${f.displayName} apareció!`);
    Storage.markSeen(f.name);
    await cv2UI.wait(CV2_DELAY.ENTRY_SLIDE);

    if (!this.state.skipPlayerEntry) {
      cv2UI.resetSprite('player', p);
    } else {
      cv2UI.syncSprite('player', p);
    }
    cv2UI.initHud('player', p);
    this._showPlayerMove();
    await cv2UI.wait(CV2_DELAY.ENTRY_HUD);

    // Efectos de entrada (habilidades pasivas "on_entry")
    // El jugador solo dispara ON_ENTER si realmente entró al campo (no es continuación).
    const entryActions = [];
    if (!this.state.skipPlayerEntry) entryActions.push({ side: 'player', pokemon: p });
    entryActions.push({ side: 'foe', pokemon: f });
    entryActions.sort((a, b) => _effectiveSpeed(b.pokemon) - _effectiveSpeed(a.pokemon));

    for (const ea of entryActions) {
      await this._applyEntryEffects(ea.pokemon, ea.side);
    }

    this.queue.enqueue(() => this._startTurn());
  },

  async _applyEntryEffects(pokemon, side) {
    const opponentSide = this._getOpponentSide(side);
    const opponent     = this._getBySide(opponentSide);
    const statAnims    = [];
    const triggered = await applyAbility(pokemon, ABILITY_TRIGGERS.ON_ENTER, {
      side,
      opponent,
      opponentSide,
      log:            msg => cv2UI.log(msg),
      showStatChange: (s, stat, dir, pct) => { statAnims.push(cv2UI.showStatChange(s, stat, dir, pct)); },
    });
    if (statAnims.length) await Promise.all(statAnims);
    if (triggered) {
      cv2UI.updateHp(side,         pokemon);
      cv2UI.updateHp(opponentSide, opponent);
      cv2UI.updateStatus(side,         pokemon);
      cv2UI.updateStatus(opponentSide, opponent);
      await cv2UI.wait(CV2_DELAY.LOG_SHORT);
    }
  },

  // Dispara ON_OPPONENT_ENTER en el observador cuando un nuevo rival entra al campo.
  // Solo se llama desde _stepNewFoePokemon y _stepNextPlayerOrLoss, nunca en el inicio
  // de combate (donde ON_ENTER ya cubre la detección inicial).
  async _applyOpponentEnterEffects(observer, observerSide, newOpponent) {
    if (!observer) return;
    const statAnims = [];
    const triggered = await applyAbility(observer, ABILITY_TRIGGERS.ON_OPPONENT_ENTER, {
      side:         observerSide,
      opponent:     newOpponent,
      opponentSide: this._getOpponentSide(observerSide),
      log:            msg => cv2UI.log(msg),
      showStatChange: (s, stat, dir, pct) => { statAnims.push(cv2UI.showStatChange(s, stat, dir, pct)); },
    });
    if (statAnims.length) await Promise.all(statAnims);
    if (triggered) {
      cv2UI.updateHp(observerSide, observer);
      cv2UI.updateStatus(observerSide, observer);
      await cv2UI.wait(CV2_DELAY.LOG_SHORT);
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PASO 2 — Turno
  // ═══════════════════════════════════════════════════════════════════════════

  async _startTurn() {
    if (this.state.ended) return;

    this.state.turn++;
    const p = this.player;
    const f = this.foe;

    // Limpiar flags de turno
    for (const pk of [p, f]) {
      pk._flinched  = false;
      pk._doubleHit = false;
      pk._priority  = false;
      pk._ventaja   = false;
    }

    // Objetos de inicio de turno (Baya Zidra, Llamasfera, etc.)
    for (const [pk, side] of [[p, 'player'], [f, 'foe']]) {
      if (pk.currentHp <= 0) continue;
      const hpBefore = pk.currentHp;
      const triggered = applyHeldItemTurnStart(pk, {
        log:       msg => cv2UI.log(msg),
        updateHud: () => cv2UI.updateHp(side, pk),
      });
      if (triggered) {
        const diff = pk.currentHp - hpBefore;
        if (diff > 0) cv2UI.showHealFloat(side, diff);
        else if (diff < 0) cv2UI.showDamageFloat(side, -diff);
        cv2UI.updateHp(side, pk);
        cv2UI.updateStatus(side, pk);
        await cv2UI.wait(CV2_DELAY.LOG_SHORT);
      }
    }

    // Si algún pokemon murió por efecto de objeto (Llamasfera), resolver el KO antes del turno
    if (f.currentHp <= 0 && p.currentHp <= 0) {
      this.queue.enqueue(() => this._stepHandleBothFaint(p, f)); return;
    } else if (f.currentHp <= 0) {
      this.queue.enqueue(() => this._stepHandleFaint(f, 'foe')); return;
    } else if (p.currentHp <= 0) {
      this.queue.enqueue(() => this._stepHandleFaint(p, 'player')); return;
    }

    // Elegir movimientos
    const playerMove = p.moves.find(m => m.id === p.autoMove) ?? p.moves[0];
    const foeMove    = enemyChooseMove(f, p);  // función del engine v1 reutilizada
    cv2UI.showMove(playerMove);

    // Construir acciones
    const actions = _sortByPriority([
      { side: 'player', pokemon: p, move: playerMove, _skip: false },
      { side: 'foe',    pokemon: f, move: foeMove,    _skip: false },
    ]);

    await cv2UI.wait(CV2_DELAY.TURN_START_GAP);
    this.queue.enqueue(() => this._stepNextAction(actions, 0));
  },

  // ── Secuencia de acciones ─────────────────────────────────────────────────

  async _stepNextAction(actions, idx) {
    if (this.state.ended) return;
    if (idx >= actions.length) {
      // Todos los ataques completados → fin de turno
      this.queue.enqueue(() => this._stepEndOfTurn());
      return;
    }

    const action   = actions[idx];
    const attacker = this._getBySide(action.side);
    const opponent = this._getBySide(this._getOpponentSide(action.side));

    // Saltar si el atacante o el rival ya están K.O.
    if (attacker.currentHp <= 0 || opponent.currentHp <= 0) {
      this.queue.enqueue(() => this._stepNextAction(actions, idx + 1));
      return;
    }

    // Flinch: si el atacante retrocedió este turno (recibió un golpe antes de actuar), pierde su turno
    if (attacker._flinched) {
      cv2UI.log(`¡${attacker.displayName} retrocedió y no pudo atacar!`);
      await cv2UI.wait(CV2_DELAY.LOG_READ);
      this.queue.enqueue(() => this._stepNextAction(actions, idx + 1));
      return;
    }

    this.queue.enqueue(
      () => this._stepPreAttack(action),
      () => this._stepDoAttack(action, opponent),
      () => this._stepCheckFaintAfterAttack(action, opponent, actions, idx),
    );
  },

  // ── Pre-ataque (BEFORE_ATTACK) ────────────────────────────────────────────

  async _stepPreAttack(action) {
    if (this.state.ended || action._skip) return;
    const { pokemon, move, side } = action;
    const opponent = this._getBySide(this._getOpponentSide(side));

    // La card siempre muestra el movimiento del jugador activo
    if (side === 'player') cv2UI.showMove(move);

    // Comprobar estado (sueño, parálisis, confusión)
    const check = StatusEffects.checkBeforeAttack(pokemon);
    if (check.message) {
      cv2UI.log(check.message);
      await cv2UI.wait(CV2_DELAY.LOG_READ);
    }

    if (!check.canAttack) {
      action._skip = true;
      return;
    }

    // Autogolpe por confusión
    if (check.hitSelf) {
      action._confusionSelfHit = true;
    }

    // Aplicar efectos BEFORE_ATTACK
    if (!action._confusionSelfHit) {
      applyEffect(move, TRIGGERS.BEFORE_ATTACK, _makeCtx(pokemon, opponent, 0));
    }
  },

  // ── Ataque ────────────────────────────────────────────────────────────────

  async _stepDoAttack(action, opponent) {
    if (this.state.ended || action._skip) return;
    const { pokemon, move, side } = action;

    let effectiveMove = action._confusionSelfHit ? CONFUSION_SELF_HIT : move;
    if (!action._confusionSelfHit) {
      if ((pokemon._cursedBodyTurns ?? 0) > 0) {
        effectiveMove = FORCEJEO;
        pokemon._cursedBodyTurns--;
        if (pokemon._cursedBodyTurns === 0) delete pokemon._cursedBodyTurns;
      } else if (HELD_ITEMS?.[pokemon.heldItem]?.metronome) {
        effectiveMove = getMetronomeMove();
      }
    }
    const target     = action._confusionSelfHit ? pokemon             : opponent;
    const targetSide = action._confusionSelfHit ? side : this._getOpponentSide(side);

    // Anunciar movimiento
    cv2UI.log(`${pokemon.displayName} usó ${effectiveMove.name}!`);
    await cv2UI.wait(CV2_DELAY.ATTACK_ANNOUNCE);

    if (effectiveMove.power) {
      await this._applyDamage(effectiveMove, pokemon, target, targetSide, action);
    } else {
      // Movimiento sin daño directo — efectos AFTER_ATTACK aún pueden ocurrir
      cv2UI.log('...');
      await cv2UI.wait(CV2_DELAY.LOG_SHORT);
    }

    // Aplicar efectos AFTER_ATTACK
    if (!action._confusionSelfHit) {
      const statAnims = [];
      const ctx = _makeCtx(pokemon, target, action._lastDmg ?? 0);
      ctx.showStatChange = (pk, stat, dir, pct) => {
        const s = pk === pokemon ? side : targetSide;
        statAnims.push(cv2UI.showStatChange(s, stat, dir, pct));
      };
      applyEffect(move, TRIGGERS.AFTER_ATTACK, ctx);
      cv2UI.updateStatus(side, pokemon);
      cv2UI.updateStatus(targetSide, target);
      cv2UI.updateHp(targetSide, target);
      cv2UI.updateHp(side, pokemon);
      if (statAnims.length) await Promise.all(statAnims);
    }

    // Double-hit: enqueue un segundo ataque inmediatamente
    if (pokemon._doubleHit && !action._doubleHitDone) {
      action._doubleHitDone = true;
      this.queue.prepend(() => this._stepDoAttack(action, opponent));
    }

    this._showPlayerMove();
  },

  // ── Aplicar daño a un objetivo ────────────────────────────────────────────

  async _applyDamage(move, attacker, defender, defenderSide, action) {
    // ON_HITTED antes de aplicar el daño (permite modificar ctx.dmg)
    const attackerSide = this._getOpponentSide(defenderSide);
    const onHittedCtx = {
      user:     defender,
      attacker: attacker,
      dmg:      0,  // se sobrescribirá con el valor calculado
      team:     this.state.playerTeam,
      log:      msg => { cv2UI.log(msg); },
      showStatChange: (pk, stat, dir, pct) => {
        const s = pk === defender ? defenderSide : attackerSide;
        cv2UI.showStatChange(s, stat, dir, pct);
      },
      updatePlayerHud: () => {
        cv2UI.updateHp(defenderSide, defender);
        cv2UI.updateHp(attackerSide, attacker);
      },
    };

    const { dmg: rawDmg, isCrit, eff } = _calcDamage(attacker, defender, move);

    if (eff === 0) {
      cv2UI.log(`¡${move.name} no puede dañar a ${defender.displayName}! ¡${attacker.displayName} usó Forcejeo!`);
      await cv2UI.wait(CV2_DELAY.LOG_READ);
      await this._applyDamage(FORCEJEO, attacker, defender, defenderSide, action);
      return;
    }

    onHittedCtx.dmg = rawDmg;

    const defenderMove = defender.moves?.find(m => m.id === defender.autoMove);
    if (defenderMove) {
      applyEffect(defenderMove, TRIGGERS.ON_HITTED, onHittedCtx);
    }

    // Efecto ventaja (×2 si rival tiene estado)
    let finalDmg = onHittedCtx.dmg;
    if (attacker._ventaja && defender.statusEffect) {
      finalDmg = Math.floor(finalDmg * 2);
    }

    // Supervivencia (Banda Aguante): solo a HP completo, solo una vez por ruta
    if (finalDmg >= defender.currentHp) {
      const adj = applyHeldItemSurvive(defender, finalDmg, msg => cv2UI.log(msg));
      if (adj !== null) {
        finalDmg = adj;
        await cv2UI.wait(CV2_DELAY.LOG_SHORT);
      }
    }

    // Aplicar daño
    const _prevHp = defender.currentHp;
    defender.currentHp = Math.max(0, defender.currentHp - finalDmg);
    action._lastDmg = finalDmg;
    const _actualDmg = _prevHp - defender.currentHp;

    // Animaciones (en paralelo donde tiene sentido)
    cv2UI.flashSprite(defenderSide);
    cv2UI.showDamageFloat(defenderSide, finalDmg);
    await cv2UI.wait(CV2_DELAY.HIT_FLASH);
    cv2UI.updateHp(defenderSide, defender);
    await cv2UI.wait(CV2_DELAY.AFTER_HIT);

    // Logs de crítico / efectividad
    if (isCrit) {
      cv2UI.log('¡Golpe crítico!');
      await cv2UI.wait(CV2_DELAY.CRIT_LOG);
    }
    if (eff >= 2) {
      cv2UI.log('¡Es supereficaz!');
      await cv2UI.wait(CV2_DELAY.EFF_LOG);
    } else if (eff > 0 && eff < 1) {
      cv2UI.log('No es muy eficaz...');
      await cv2UI.wait(CV2_DELAY.EFF_LOG);
    }

    // Habilidad del atacante al aterrizar el golpe
    {
      const attackerSide = this._getOpponentSide(defenderSide);
      const statAnims    = [];
      const triggered = await applyAbility(attacker, ABILITY_TRIGGERS.ON_HIT, {
        side:           attackerSide,
        target:         defender,
        targetSide:     defenderSide,
        dmg:            finalDmg,
        log:            msg => cv2UI.log(msg),
        showStatChange: (s, stat, dir, pct) => { statAnims.push(cv2UI.showStatChange(s, stat, dir, pct)); },
        updateHud:      () => cv2UI.updateHp(attackerSide, attacker),
      });
      if (statAnims.length) await Promise.all(statAnims);
      if (triggered) {
        cv2UI.updateHp(attackerSide, attacker);
        await cv2UI.wait(CV2_DELAY.LOG_SHORT);
      }
    }

    // Habilidad del defensor al recibir golpe
    if (defender.currentHp > 0) {
      const statAnims = [];
      const triggered = await applyAbility(defender, ABILITY_TRIGGERS.ON_HIT_RECEIVED, {
        side:           defenderSide,
        attacker,
        move,
        dmg:            finalDmg,
        log:            msg => cv2UI.log(msg),
        showStatChange: (s, stat, dir, pct) => { statAnims.push(cv2UI.showStatChange(s, stat, dir, pct)); },
        updateHud:      () => cv2UI.updateHp(defenderSide, defender),
      });
      if (statAnims.length) await Promise.all(statAnims);
      if (triggered) {
        cv2UI.updateHp(defenderSide, defender);
        await cv2UI.wait(CV2_DELAY.LOG_SHORT);
      }
    }

    // Cascabel Concha — curación del atacante proporcional al daño real infligido
    if (_actualDmg > 0 && HELD_ITEMS?.[attacker.heldItem]?.shellBell) {
      const shellHeal = Math.max(1, Math.floor(_actualDmg * 0.20));
      const beforeHeal = attacker.currentHp;
      attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + shellHeal);
      const healed = attacker.currentHp - beforeHeal;
      if (healed > 0) {
        cv2UI.log(`${attacker.displayName} se curó gracias a la Cascabel Concha!`);
        cv2UI.showHealFloat(attackerSide, healed);
        cv2UI.updateHp(attackerSide, attacker);
        await cv2UI.wait(CV2_DELAY.LOG_SHORT);
      }
    }
  },

  // ── Comprobar derrota tras ataque ─────────────────────────────────────────

  async _stepCheckFaintAfterAttack(action, opponent, actions, idx) {
    if (this.state.ended) return;

    const opponentSide = this._getOpponentSide(action.side);
    const opponentDead = opponent.currentHp <= 0;
    const selfDead     = action.pokemon.currentHp <= 0;

    if (opponentDead || selfDead) {
      // Uno o ambos cayeron — pasar por _stepEndOfTurn para que el superviviente
      // pueda activar sus objetos de fin de turno (Restos, Vidasfera, etc.).
      // _stepEndOfTurn ya omite a los pokemon con HP <= 0 y al final detecta
      // la derrota y llama a _stepHandleFaint / _stepHandleBothFaint.
      this.queue.enqueue(() => this._stepEndOfTurn());
    } else {
      this.queue.enqueue(() => this._stepNextAction(actions, idx + 1));
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PASO 3 — Fin de turno (estados, objetos end-of-turn)
  // ═══════════════════════════════════════════════════════════════════════════

  async _stepEndOfTurn() {
    if (this.state.ended) return;

    const entries = [
      { side: 'player', pokemon: this.player },
      { side: 'foe',    pokemon: this.foe    },
    ];

    for (const { side, pokemon } of entries) {
      if (pokemon.currentHp <= 0) continue;

      // Objetos de fin de turno (Restos, Vidasfera, Llamasfera, etc.)
      // Se procesan ANTES que el daño de estado para que la Llamasfera
      // aplique QUEMADO y el estado drene en el mismo turno.
      if (HELD_ITEMS?.[pokemon.heldItem]?.trigger === 'on-turn-end') {
        const hpBefore = pokemon.currentHp;
        const triggered = applyHeldItemTurnEnd(pokemon, {
          log:       msg => cv2UI.log(msg),
          updateHud: () => cv2UI.updateHp(side, pokemon),
        });
        if (triggered) {
          const diff = pokemon.currentHp - hpBefore;
          if (diff > 0) cv2UI.showHealFloat(side, diff);
          else if (diff < 0) cv2UI.showDamageFloat(side, -diff);
          cv2UI.updateHp(side, pokemon);
          cv2UI.updateStatus(side, pokemon);
          await cv2UI.wait(CV2_DELAY.LOG_SHORT);
        }
        if (pokemon.currentHp <= 0) break;
      }

      // Daño por estado (veneno, quemadura, congelación)
      const dmg = StatusEffects.applyEndOfTurn(pokemon, msg => {
        cv2UI.log(msg);
      });
      if (dmg > 0) {
        cv2UI.updateHp(side, pokemon);
        cv2UI.updateStatus(side, pokemon);
        await cv2UI.wait(CV2_DELAY.END_OF_TURN_STATUS);
        if (pokemon.currentHp <= 0) break;
      }

      // Habilidad de fin de turno
      const statAnims = [];
      const abilityTriggered = await applyAbility(pokemon, ABILITY_TRIGGERS.ON_TURN_END, {
        side,
        log:            msg => cv2UI.log(msg),
        showStatChange: (s, stat, dir, pct) => { statAnims.push(cv2UI.showStatChange(s, stat, dir, pct)); },
        updateHud:      () => cv2UI.updateHp(side, pokemon),
      });
      if (statAnims.length) await Promise.all(statAnims);
      if (abilityTriggered) {
        cv2UI.updateHp(side, pokemon);
        await cv2UI.wait(CV2_DELAY.LOG_SHORT);
      }
    }

    // Decrementar condiciones de batalla
    _tickBattleConditions(this.state);

    // Resolver derrotas por daño de estado
    const p = this.player;
    const f = this.foe;

    if (f.currentHp <= 0 && p.currentHp <= 0) {
      this.queue.enqueue(() => this._stepHandleBothFaint(p, f));
    } else if (f.currentHp <= 0) {
      this.queue.enqueue(() => this._stepHandleFaint(f, 'foe'));
    } else if (p.currentHp <= 0) {
      this.queue.enqueue(() => this._stepHandleFaint(p, 'player'));
    } else {
      // Nadie murió → siguiente turno
      this.queue.enqueue(() => this._startTurn());
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PASO 4 — Derrota de un Pokémon
  // ═══════════════════════════════════════════════════════════════════════════

  async _stepHandleFaint(pokemon, side) {
    if (this.state.ended) return;

    cv2UI.log(`¡${pokemon.displayName} se debilitó!`);
    if (side === 'foe' && this.state.isWild) {
      await cv2UI.wildFaintSprite(side);
    } else {
      await cv2UI.faintSprite(side);
    }
    await cv2UI.wait(CV2_DELAY.FAINT_PAUSE);

    if (side === 'foe') {
      this.queue.enqueue(
        () => this._stepExpAndLevelUp(),
        () => this._stepNextFoeOrEnd(),
      );
    } else {
      this.queue.enqueue(() => this._stepNextPlayerOrLoss());
    }
  },

  // ── Derrota simultánea de ambos Pokémon ──────────────────────────────────

  async _stepHandleBothFaint(playerPokemon, foePokemon) {
    if (this.state.ended) return;

    // El log del rival aparece mientras arrancan las dos animaciones en paralelo
    cv2UI.log(`¡${foePokemon.displayName} se debilitó!`);
    await Promise.all([
      cv2UI.faintSprite('foe'),
      cv2UI.faintSprite('player'),
    ]);
    cv2UI.log(`¡${playerPokemon.displayName} también se debilitó!`);
    await cv2UI.wait(CV2_DELAY.FAINT_PAUSE);

    // EXP primero (el rival fue derrotado), luego resolver ambos bandos
    this.queue.enqueue(
      () => this._stepExpAndLevelUp(),
      () => this._stepResolveBothFaint(),
    );
  },

  // Trae al siguiente pokemon de cada bando tras una derrota simultánea.
  // La cola garantiza que la secuencia es: jugador entra → rival entra → turno.
  async _stepResolveBothFaint() {
    if (this.state.ended) return;

    cv2UI.updateTeamBar('player', this.state.playerTeam);

    const deadIdx = this.state.playerIndex;

    // Buscar siguiente pokemon del jugador (excluye el slot muerto actual)
    const nextPlayerIdx = (() => {
      const i = this.state.playerTeam.findIndex(
        (p, j) => j > deadIdx && p.currentHp > 0 && p.stats
      );
      return i !== -1 ? i : this.state.playerTeam.findIndex(
        (p, j) => j !== deadIdx && p.currentHp > 0 && p.stats
      );
    })();

    if (nextPlayerIdx === -1) {
      this.queue.enqueue(() => this._stepLoss());
      return;
    }

    // Sacar al siguiente pokemon del jugador
    this.state.playerIndex = nextPlayerIdx;
    const nextPlayer = this.state.playerTeam[nextPlayerIdx];
    cv2UI.log(`¡Adelante, ${nextPlayer.displayName}!`);
    await cv2UI.wait(CV2_DELAY.NEW_POKEMON);
    cv2UI.resetSprite('player', nextPlayer);
    cv2UI.initHud('player', nextPlayer);
    this._showPlayerMove();

    // Buscar siguiente pokemon rival
    this.state.foeIndex++;
    const nextFoe = this.state.foeTeam[this.state.foeIndex];

    if (!nextFoe) {
      // Sin rival → victoria
      this.queue.enqueue(() => this._stepWin());
      return;
    }

    // Anunciar y sacar al siguiente rival
    // (_stepNewFoePokemon gestiona la animación, los efectos de entrada y _startTurn)
    cv2UI.log(`${this.state.trainerName ?? 'El rival'} envió a ${nextFoe.displayName}!`);
    await cv2UI.wait(CV2_DELAY.NEW_POKEMON);
    this.queue.enqueue(() => this._stepNewFoePokemon(nextFoe));
  },

  // ── EXP y nivel ───────────────────────────────────────────────────────────

  async _stepExpAndLevelUp() {
    if (this.state.ended || this.state.noExp) return;

    const foe       = this.foe;
    const type      = this.state.isGym ? 'gym' : this.state.isTrainer ? 'trainer' : 'wild';
    const survivors = this.state.playerTeam.filter(p => p.currentHp > 0);

    for (const pk of survivors) {
      const { gained, levelsGained } = gainExp(pk, foe.name, type, foe.level);
      if (gained <= 0) continue;

      cv2UI.log(`${pk.displayName} ganó ${gained} puntos de EXP!`);

      if (levelsGained > 0) {
        cv2UI.log(`¡${pk.displayName} subió al nivel ${pk.level}!`);

        // 1. Badge +N sobre el pip existente (antes de re-renderizar)
        cv2UI.showLevelUpPip(pk, this.state.playerTeam, levelsGained);
        if (pk === this.player) {
          cv2UI.initHud('player', pk);
          this._showPlayerMove();
        }
        await cv2UI.wait(CV2_DELAY.LEVEL_UP);

        // 2. Re-renderizar pips con datos del nuevo nivel y animar barra EXP
        cv2UI.updateTeamBar('player', this.state.playerTeam);
        cv2UI.updateExpBars(this.state.playerTeam);
        await cv2UI.wait(CV2_DELAY.EXP_BAR);

        if (pk._pendingEvolution) {
          await this._stepEvolution(pk);
        }
      } else {
        // Sin subida de nivel: solo animar la barra EXP
        cv2UI.updateExpBars(this.state.playerTeam);
        await cv2UI.wait(CV2_DELAY.EXP_BAR);
      }
    }
  },

  async _stepEvolution(pokemon) {
    const intoName = pokemon._pendingEvolution;
    pokemon._pendingEvolution = null;
    cv2UI.log(`¡${pokemon.displayName} está evolucionando!`);
    await cv2UI.wait(CV2_DELAY.EVOLUTION);
    const evolved = await evolve(pokemon, intoName);
    if (!evolved) return;
    // Reemplazar en el equipo
    const idx = this.state.playerTeam.indexOf(pokemon);
    if (idx !== -1) this.state.playerTeam[idx] = evolved;
    if (GameState.starter === pokemon) GameState.starter = evolved;
    Storage.markCaught(evolved.name);
    if (evolved.shiny) Storage.propagateShinyLine(evolved.name);
    if (this.state.playerIndex === idx) {
      cv2UI.resetSprite('player', evolved);
      cv2UI.initHud('player', evolved);
      this._showPlayerMove();
    }
    cv2UI.updateTeamBar('player', this.state.playerTeam);
    cv2UI.log(`¡${evolved.displayName}!`);
    await cv2UI.wait(CV2_DELAY.LEVEL_UP);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PASO 5 — Nueva entrada o fin del combate
  // ═══════════════════════════════════════════════════════════════════════════

  async _stepNextFoeOrEnd() {
    if (this.state.ended) return;

    this.state.foeIndex++;
    const nextFoe = this.state.foeTeam[this.state.foeIndex];

    if (nextFoe) {
      cv2UI.log(`${this.state.trainerName ?? 'El rival'} envió a ${nextFoe.displayName}!`);
      await cv2UI.wait(CV2_DELAY.NEW_POKEMON);
      this.queue.enqueue(() => this._stepNewFoePokemon(nextFoe));
    } else {
      // No hay más pokemon rivales → victoria
      this.queue.enqueue(() => this._stepWin());
    }
  },

  async _stepNewFoePokemon(pokemon) {
    cv2UI.resetSprite('foe', pokemon);
    cv2UI.initHud('foe', pokemon);
    cv2UI.updateTeamBar('foe', this.state.foeTeam);
    Storage.markSeen(pokemon.name);
    await cv2UI.wait(CV2_DELAY.ENTRY_SLIDE);

    // Solo el nuevo foe ejecuta ON_ENTER — el jugador ya estaba en campo
    await this._applyEntryEffects(pokemon, 'foe');
    // Habilidades del jugador que reaccionan a un nuevo rival (ej. Descarga)
    await this._applyOpponentEnterEffects(this._getBySide('player'), 'player', pokemon);

    this.queue.enqueue(() => this._startTurn());
  },

  async _stepNextPlayerOrLoss() {
    if (this.state.ended) return;

    // Marcar el slot actual como muerto para que la barra lo muestre correctamente
    const deadIdx = this.state.playerIndex;

    // Buscar el siguiente pokemon vivo: primero después del actual, luego antes
    const nextIdx = this.state.playerTeam.findIndex(
      (p, i) => i > deadIdx && p.currentHp > 0 && p.stats
    );
    const altIdx = nextIdx === -1
      ? this.state.playerTeam.findIndex((p, i) => i !== deadIdx && p.currentHp > 0 && p.stats)
      : -1;

    const idx = nextIdx !== -1 ? nextIdx : altIdx;

    cv2UI.updateTeamBar('player', this.state.playerTeam);

    if (idx !== -1) {
      this.state.playerIndex = idx;
      const next = this.state.playerTeam[idx];
      cv2UI.log(`¡Adelante, ${next.displayName}!`);
      await cv2UI.wait(CV2_DELAY.NEW_POKEMON);
      cv2UI.resetSprite('player', next);
      cv2UI.initHud('player', next);
      this._showPlayerMove();

      // Solo el nuevo jugador ejecuta ON_ENTER — el foe ya estaba en campo
      await this._applyEntryEffects(next, 'player');
      // Habilidades del rival que reaccionan a un nuevo jugador (ej. Descarga en el foe)
      await this._applyOpponentEnterEffects(this._getBySide('foe'), 'foe', next);

      this.queue.enqueue(() => this._startTurn());
    } else {
      this.queue.enqueue(() => this._stepLoss());
    }
  },

  // ── Victoria / derrota ────────────────────────────────────────────────────

  async _stepWin() {
    if (this.state.ended) return;
    this.state.ended = true;
    for (const pk of this.state.playerTeam ?? []) delete pk._cursedBodyTurns;
    cv2UI.log('¡Ganaste el combate!');
    await cv2UI.wait(CV2_DELAY.LOG_READ);
    this.state.onWin?.();
  },

  async _stepLoss() {
    if (this.state.ended) return;
    this.state.ended = true;
    for (const pk of this.state.playerTeam ?? []) delete pk._cursedBodyTurns;
    cv2UI.log('¡Todos tus Pokémon se han debilitado!');
    await cv2UI.wait(CV2_DELAY.LOG_READ);
    this.state.onLoss?.();
  },

};

// ═══════════════════════════════════════════════════════════════════════════
// Funciones auxiliares del engine
// ═══════════════════════════════════════════════════════════════════════════

// ── Condiciones de batalla ────────────────────────────────────────────────────

// ¿Está el Pokémon en contacto con el suelo? (determina si le afectan los campos)
function _isGrounded(pokemon) {
  if (pokemon.ability === 'levitate') return false;
  if (pokemon.types?.includes('flying')) return false;
  return true;
}

// Multiplicador de daño por clima para un tipo de movimiento dado.
function _getWeatherMult(weatherId, moveType) {
  if (!weatherId || !WEATHER[weatherId]) return 1;
  const w = WEATHER[weatherId];
  for (const b of (w.damageBoost   ?? [])) { if (b.type === moveType) return b.mult ?? 1; }
  for (const p of (w.damagePenalty ?? [])) { if (p.type === moveType) return p.mult ?? 1; }
  return 1;
}

// Multiplicador de daño por campo para un tipo de movimiento dado.
// Solo aplica si el atacante está en tierra.
function _getFieldMult(fieldId, moveType, attacker) {
  if (!fieldId || !FIELD[fieldId] || !_isGrounded(attacker)) return 1;
  const f = FIELD[fieldId];
  for (const b of (f.damageBoost ?? [])) { if (b.type === moveType) return b.mult ?? 1; }
  return 1;
}

// ¿Tiene el equipo (o el scope global) el efecto indicado activo?
function _hasTeamEffect(side, id) {
  const te = CombatV2.state?.teamEffects;
  if (!te) return false;
  return (te[side]  ?? []).some(e => e.id === id)
      || (te.global ?? []).some(e => e.id === id);
}

// Multiplicador de SPE por efectos de equipo (p.ej. Viento de Cola).
function _getSpeedMult(side) {
  const te = CombatV2.state?.teamEffects;
  if (!te) return 1;
  const all = [...(te[side] ?? []), ...(te.global ?? [])];
  const hit = all.find(e => TEAM_EFFECTS[e.id]?.speedMult != null);
  return hit ? (TEAM_EFFECTS[hit.id].speedMult ?? 1) : 1;
}

// Decrece los contadores de condiciones y elimina las expiradas.
function _tickBattleConditions(state) {
  if (state.weather?.turnsLeft !== null && state.weather?.turnsLeft !== undefined && --state.weather.turnsLeft <= 0) {
    cv2UI.log('El tiempo ha vuelto a la normalidad.');
    state.weather = null;
    cv2UI.updateWeather(null);
  }
  if (state.field && --state.field.turnsLeft <= 0) {
    cv2UI.log('El efecto de campo se ha disipado.');
    state.field = null;
  }
  for (const scope of ['player', 'foe', 'global']) {
    state.teamEffects[scope] = (state.teamEffects[scope] ?? []).filter(e => {
      if (--e.turnsLeft <= 0) {
        cv2UI.log(`${TEAM_EFFECTS[e.id]?.name ?? e.id} terminó.`);
        return false;
      }
      return true;
    });
  }
}

function _effectiveSpeed(pokemon, side = null) {
  const mod = pokemon.combatMods?.spe ?? 0;
  let spe = Math.floor(pokemon.stats.spe * Math.max(0.1, 1 + mod));
  if (pokemon.statusEffect?.id === StatusEffect.PARALYSIS && !hasGutsEffect(pokemon))
    spe = Math.floor(spe * 0.5);
  if (side) spe = Math.floor(spe * _getSpeedMult(side));
  return spe;
}

// Ordena acciones por prioridad (mayor primero) y, en caso de empate, por SPE.
// Si Trick Room está activo, el pokemon más lento dentro del mismo nivel actúa primero.
function _sortByPriority(actions) {
  const trickRoom = _hasTeamEffect('global', 'trick-room');
  return [...actions].sort((a, b) => {
    const pa = getMovePriority(a.move, a.pokemon);
    const pb = getMovePriority(b.move, b.pokemon);
    if (pa !== pb) return pb - pa;
    const sa = _effectiveSpeed(a.pokemon, a.side);
    const sb = _effectiveSpeed(b.pokemon, b.side);
    if (sa !== sb) return trickRoom ? sa - sb : sb - sa;
    return Math.random() < 0.5 ? -1 : 1;
  });
}

// Calcula el daño — reutiliza calcDamage del engine v1 pero con constantes CV2
function _calcDamage(attacker, defender, move) {
  if (!move?.power) return { dmg: 0, isCrit: false, eff: 1, modifiers: [] };

  const ids = Array.isArray(move.effectId) ? move.effectId : [move.effectId ?? ''];

  // Daño fijo: Seismic Toss
  if (ids.includes('seismic-toss-damage')) {
    return { dmg: Math.max(1, attacker.level), isCrit: false, eff: 1, modifiers: [] };
  }

  // Levitate: inmune a movimientos de tipo Tierra
  if (defender.ability === 'levitate' && move.type === 'ground') {
    return { dmg: 0, isCrit: false, eff: 0 };
  }


  const isSpecial = move.damageClass === 'special';
  const atkMod    = isSpecial ? (attacker.combatMods?.spa ?? 0) : (attacker.combatMods?.atk ?? 0);
  const defMod    = isSpecial ? (defender.combatMods?.spd ?? 0) : (defender.combatMods?.def ?? 0);
  const atkStat   = isSpecial ? attacker.stats.spa : attacker.stats.atk;
  const defStat   = isSpecial ? defender.stats.spd : defender.stats.def;
  let   atk       = Math.floor(atkStat * Math.max(0.1, 1 + atkMod));
  let   def       = Math.floor(defStat * Math.max(0.1, 1 + defMod));

  // Penalizaciones de estado: multiplicativas sobre el stat ya modificado por combatMods
  if (!hasGutsEffect(attacker)) {
    if (!isSpecial && attacker.statusEffect?.id === StatusEffect.BURN)
      atk = Math.floor(atk * 0.5);
    if (isSpecial && attacker.statusEffect?.id === StatusEffect.FREEZE)
      atk = Math.floor(atk * 0.5);
  }

  let dmg = Math.floor((((2 * attacker.level / 5 + 2) * move.power * atk) / def) / 50) + 2;

  const stab = attacker.types.includes(move.type) ? CV2_COMBAT.STAB_MULTIPLIER : 1.0;
  let eff    = getEffectiveness(move.type, defender.types);
  if (eff === 0 && ids.includes('versatil')) eff = 1;

  const rnd = CV2_COMBAT.RANDOM_MIN + Math.random() * (CV2_COMBAT.RANDOM_MAX - CV2_COMBAT.RANDOM_MIN);
  dmg = Math.floor(dmg * stab * eff * rnd);

  // Clima
  const weatherMult = _getWeatherMult(CombatV2.state?.weather?.id, move.type);
  if (weatherMult !== 1) dmg = Math.floor(dmg * weatherMult);

  // Campo (solo si el atacante está en tierra)
  const fieldMult = _getFieldMult(CombatV2.state?.field?.id, move.type, attacker);
  if (fieldMult !== 1) dmg = Math.floor(dmg * fieldMult);

  // Objeto equipado: bonus de daño por tipo/clase/especie
  const heldItem = HELD_ITEMS?.[attacker.heldItem];
  if (heldItem?.dmgBoost) {
    const { mult, type, class: cls, onlyFor } = heldItem.dmgBoost;
    if (
      (!onlyFor || attacker.name === onlyFor) &&
      (!type    || move.type         === type) &&
      (!cls     || move.damageClass  === cls)
    ) {
      dmg = Math.floor(dmg * (1 + mult));
    }
  }

  // Huge Power: duplica el ATK físico
  if (!isSpecial && attacker.ability === 'huge-power') {
    dmg = Math.floor(dmg * 2);
  }

  // Guts: +50% daño físico (habilidad pasiva)
  if (!isSpecial && hasGutsEffect(attacker)) {
    const gutsMult = ABILITIES['guts']?.dmgMult ?? 1.5;
    dmg = Math.floor(dmg * gutsMult);
  }

  // Lightning-rod: reduce el daño eléctrico recibido un 75%
  if (defender.ability === 'lightning-rod' && move.type === 'electric') {
    dmg = Math.floor(dmg * 0.25);
  }

  const critChance = ids.includes('crit-75') ? 0.75 : CV2_COMBAT.CRIT_CHANCE;
  const isCrit     = Math.random() < critChance;
  if (isCrit) dmg  = Math.floor(dmg * CV2_COMBAT.CRIT_MULTIPLIER);

  return { dmg: Math.max(1, dmg), isCrit, eff };
}

// Contexto estándar para applyEffect
function _makeCtx(user, target, dmg) {
  return {
    user,
    target,
    dmg,
    team: CombatV2.state?.playerTeam ?? [],
    log:  msg => cv2UI.log(msg),
    showStatChange: () => {},
    updatePlayerHud: () => {
      cv2UI.updateHp('player', CombatV2.state?.playerTeam[CombatV2.state?.playerIndex]);
    },
  };
}
