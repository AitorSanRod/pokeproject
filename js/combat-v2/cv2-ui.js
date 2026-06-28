// ═══════════════════════════════════════════════════════════════════════════
// COMBAT V2 — UI
//
// Funciones puras de actualización del DOM. Cada función modifica solo
// el elemento necesario sin re-renderizar nada más. Nunca leen el estado
// del combate directamente — reciben los datos como parámetros.
// ═══════════════════════════════════════════════════════════════════════════

const cv2UI = {

  // ── Tiempo ────────────────────────────────────────────────────────────────

  // Pausa que respeta el factor de velocidad global
  wait(ms) {
    return new Promise(r => setTimeout(r, Math.round(ms * CV2_SPEED_FACTOR)));
  },

  // ── Log de combate ────────────────────────────────────────────────────────

  log(msg) {
    const el = document.getElementById('cv2-log-text');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('cv2-log-appear');
    void el.offsetWidth; // reflow para reiniciar la animación
    el.classList.add('cv2-log-appear');
  },

  logAppend(msg, delay = 0) {
    if (delay > 0) {
      return this.wait(delay).then(() => this.log(msg));
    }
    this.log(msg);
    return Promise.resolve();
  },

  // ── HP bar ────────────────────────────────────────────────────────────────

  updateHp(side, pokemon) {
    const pct  = Math.max(0, pokemon.currentHp / pokemon.stats.hp);
    const fill = document.getElementById(`cv2-${side}-hp-fill`);
    const nums = document.getElementById(`cv2-${side}-hp-nums`);
    if (!fill) return;

    fill.style.width    = `${Math.round(pct * 100)}%`;
    fill.dataset.level  = pct > 0.5 ? 'high' : pct > 0.25 ? 'mid' : 'low';

    if (nums) {
      if (side === 'foe') {
        const rawPct  = Math.round(pct * 100);
        const pctText = `${pokemon.currentHp === 0 ? 0 : Math.max(1, rawPct)}%`;
        const caught  = typeof Storage !== 'undefined' && Storage.isCaught(pokemon.name);
        const caughtHtml = caught ? '<span class="combat-hud__caught-dot" title="Ya capturado"></span>' : '';
        const shinyHtml  = pokemon.shiny
          ? `<img src="assets/sprites/others/shiny.png" style="width:7px;height:7px;image-rendering:pixelated;vertical-align:middle" alt="★" title="Shiny">`
          : '';
        const leftHtml = (caughtHtml || shinyHtml)
          ? `<span style="display:flex;align-items:center;gap:1px">${caughtHtml}${shinyHtml}</span>`
          : '';
        nums.innerHTML = `${leftHtml}<span>${pctText}</span>`;
      } else {
        nums.textContent = `${pokemon.currentHp}/${pokemon.stats.hp}`;
      }
    }

    if (side === 'player') this._syncTeamPip(pokemon);
  },

  _syncTeamPip(pokemon) {
    const team = CombatV2.state?.playerTeam;
    if (!team) return;
    const idx  = team.indexOf(pokemon);
    const bar  = document.getElementById('cv2-team-player');
    const pip  = bar?.querySelectorAll('.combat-team-pip')[idx];
    if (!pip) return;

    const ratio = pokemon.stats.hp > 0 ? pokemon.currentHp / pokemon.stats.hp : 0;
    const pct   = Math.max(0, Math.round(ratio * 100));

    const hpFill = pip.querySelector('.hp-bar-fill');
    if (hpFill) {
      hpFill.style.width   = `${pct}%`;
      hpFill.dataset.level = ratio > 0.5 ? 'high' : ratio > 0.25 ? 'mid' : 'low';
    }
    const hpNums = pip.querySelector('.combat-team-pip__hp-nums');
    if (hpNums) hpNums.textContent = `${Math.max(0, pokemon.currentHp)}/${pokemon.stats.hp}`;

    if (pokemon.currentHp <= 0) pip.classList.add('combat-team-pip--fainted');
  },

  // ── Indicador de clima ────────────────────────────────────────────────────

  updateWeather(weatherId) {
    const badge   = document.getElementById('cv2-weather-badge');
    const overlay = document.getElementById('cv2-weather-overlay');
    const WEATHER_CLASSES = ['weather--sun', 'weather--rain', 'weather--sand', 'weather--hail'];

    if (overlay) overlay.classList.remove(...WEATHER_CLASSES);

    if (!weatherId) {
      if (badge) badge.style.display = 'none';
      return;
    }

    const IMGS = { sun: 'sol', rain: 'lluvia', sand: 'arena', hail: 'nieve' };
    const file = IMGS[weatherId];
    if (!file) {
      if (badge) badge.style.display = 'none';
      return;
    }

    if (badge) {
      badge.innerHTML  = `<img src="assets/sprites/others/${file}.png" alt="${weatherId}" draggable="false">`;
      badge.title      = (typeof WEATHER !== 'undefined' ? WEATHER[weatherId]?.name : null) ?? weatherId;
      badge.style.display = 'flex';
    }

    if (overlay) overlay.classList.add(`weather--${weatherId}`);
  },

  // ── HUD completo ──────────────────────────────────────────────────────────

  initHud(side, pokemon) {
    const q = id => document.getElementById(`cv2-${side}-${id}`);
    if (q('name'))  q('name').textContent  = pokemon.displayName;
    if (q('level')) q('level').textContent = `Nv.${pokemon.level}`;
    this.updateHp(side, pokemon);
    this.updateStatus(side, pokemon);
    this.updateTeamBar(side, null);
  },

  // ── Trainer bar ───────────────────────────────────────────────────────────

  initTrainerBar(trainerName, isTrainer) {
    const bar  = document.getElementById('cv2-trainer-bar');
    const name = document.getElementById('cv2-trainer-name');
    if (bar)  bar.style.display  = isTrainer ? '' : 'none';
    if (name) name.textContent   = trainerName ?? 'Entrenador';
  },

  // ── Estado alterado + modificadores de stat ───────────────────────────────

  updateStatus(side, pokemon) {
    const el = document.getElementById(`cv2-${side}-status`);
    if (!el) return;

    const parts = [];

    // Badge de estado (quemado, paralizado, etc.)
    const statusBadge = typeof StatusEffects !== 'undefined' ? StatusEffects.badge(pokemon) : '';
    if (statusBadge) parts.push(statusBadge);

    // Modificadores de stat efectivos (combatMods + penalizaciones multiplicativas de estado)
    const rawMods = pokemon.combatMods ?? {};
    const status  = pokemon.statusEffect?.id;
    const hasGuts = typeof hasGutsEffect === 'function' && hasGutsEffect(pokemon);

    const mods = { ...rawMods };
    if (!hasGuts) {
      if (status === StatusEffect.PARALYSIS)
        mods.spe = (1 + (rawMods.spe ?? 0)) * 0.5 - 1;
      if (status === StatusEffect.BURN)
        mods.atk = (1 + (rawMods.atk ?? 0)) * 0.5 - 1;
      if (status === StatusEffect.FREEZE)
        mods.spa = (1 + (rawMods.spa ?? 0)) * 0.5 - 1;
    }

    const STAT_LABEL = { atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'VEL' };
    const activeMods = Object.entries(mods).filter(([k, v]) => !k.startsWith('_') && Math.round(v * 100) !== 0);

    if (activeMods.length > 3) {
      const tooltipLines = Object.entries(STAT_LABEL).map(([key, label]) => {
        const val = mods[key] ?? 0;
        if (Math.round(val * 100) === 0) return `${label} -`;
        const pct = Math.round(Math.abs(val) * 100);
        return `${label} ${val > 0 ? '+' : '-'}${pct}%`;
      }).join('<br>');
      parts.push(`<span class="stat-mod-badge stat-mod-badge--collapsed">...<span class="stat-mod-tooltip">${tooltipLines}</span></span>`);
    } else {
      for (const [key, val] of activeMods) {
        const label = STAT_LABEL[key] ?? key.toUpperCase();
        const pct   = Math.round(Math.abs(val) * 100);
        const up    = val > 0;
        parts.push(`<span class="stat-mod-badge stat-mod-badge--${up ? 'up' : 'down'}">${label} ${up ? '+' : '-'}${pct}%</span>`);
      }
    }

    el.innerHTML = parts.join('');
  },

  // ── Anuncio de inicio de combate ─────────────────────────────────────────

  showIntro(msg) {
    const field = document.getElementById('cv2-field');
    if (!field) return Promise.resolve();
    const duration = Math.round(CV2_DELAY.INTRO * CV2_SPEED_FACTOR);
    const el = document.createElement('div');
    el.className = 'cv2-intro-overlay';
    el.style.animationDuration = `${duration}ms`;
    el.innerHTML = msg.split('\n').map(l => `<span>${l}</span>`).join('<br>');
    field.appendChild(el);
    return new Promise(resolve => {
      setTimeout(() => { el.remove(); resolve(); }, duration);
    });
  },

  // ── Sprite / animaciones ──────────────────────────────────────────────────

  flashSprite(side) {
    const el = document.getElementById(`cv2-${side}-sprite`);
    if (!el) return;
    if (el._enterCleanup) {
      clearTimeout(el._enterCleanup);
      el._enterCleanup = null;
    }
    el.style.animation = '';
    el.style.opacity   = '1';
    void el.offsetWidth;
    el.style.animation = 'cv2-hit-flash 0.28s ease forwards';
    return this.wait(CV2_DELAY.HIT_FLASH).then(() => {
      el.style.animation = '';
      el.style.opacity   = '1';
    });
  },

  async faintSprite(side) {
    const el = document.getElementById(`cv2-${side}-sprite`);
    if (!el) return;
    if (el._enterCleanup) {
      clearTimeout(el._enterCleanup);
      el._enterCleanup = null;
    }
    el.style.animation = '';
    el.style.opacity   = '1';
    void el.offsetWidth;
    el.style.animation = `cv2-faint ${CV2_DELAY.FAINT_ANIM}ms ease-in forwards`;
    await new Promise(r => setTimeout(r, CV2_DELAY.FAINT_ANIM));
  },

  // Solo oscurece el sprite (batalla salvaje): sin deslizar ni desvanecer
  async wildFaintSprite(side) {
    const el = document.getElementById(`cv2-${side}-sprite`);
    if (!el) return;
    if (el._enterCleanup) { clearTimeout(el._enterCleanup); el._enterCleanup = null; }
    el.style.animation  = '';
    el.style.opacity    = '1';
    void el.offsetWidth;
    el.style.transition = 'filter 0.35s ease';
    el.style.filter     = 'brightness(0)';
    await this.wait(350);
    el.style.transition = '';
  },

  // Restaura el área de movimiento a su estado inicial (elimina botones de captura, etc.)
  resetMoveArea() {
    const area = document.getElementById('cv2-move-area');
    if (!area) return;
    area.innerHTML = `
      <div class="move-btn move-btn--display" id="cv2-move-btn" data-type="" style="cursor:default;opacity:.9">
        <div class="cv2-move-loading" id="cv2-move-loading"><div class="cv2-move-loading__spin"></div></div>
        <span class="move-btn__name" id="cv2-move-name"></span>
        <span class="move-btn__meta">
          <span class="type-badge" id="cv2-move-type" style="font-size:5px;padding:2px 4px"></span>
          <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark)" id="cv2-move-power"></span>
        </span>
      </div>`;
  },

  resetSprite(side, pokemon) {
    const el = document.getElementById(`cv2-${side}-sprite`);
    if (!el) return;
    if (el._enterCleanup) {
      clearTimeout(el._enterCleanup);
      el._enterCleanup = null;
    }
    el.style.animation  = '';
    el.style.filter     = '';
    el.style.transition = '';
    el.style.opacity    = '0';
    el.src = side === 'player'
      ? (pokemon.backSpriteUrl ?? pokemon.spriteUrl ?? '')
      : (pokemon.spriteUrl ?? '');
    el.alt = pokemon.displayName;
    void el.offsetWidth;
    const enterAnim = side === 'foe' ? 'cv2-sprite-enter-foe' : 'cv2-sprite-enter-player';
    el.style.animation = `${enterAnim} 0.45s ease-out forwards`;
    el._enterCleanup = setTimeout(() => {
      el._enterCleanup  = null;
      el.style.animation = '';
      el.style.opacity   = '1';
    }, 450);
  },

  // ── Daño flotante ─────────────────────────────────────────────────────────

  showDamageFloat(side, amount, color = null) {
    const anchor = document.getElementById(`cv2-${side}-sprite-wrap`);
    if (!anchor) return;
    const el = document.createElement('div');
    el.className = 'cv2-damage-float';
    el.textContent = `-${amount}`;
    if (color) el.style.color = color;
    anchor.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  },

  showHealFloat(side, amount) {
    const anchor = document.getElementById(`cv2-${side}-sprite-wrap`);
    if (!anchor) return;
    const el = document.createElement('div');
    el.className = 'cv2-damage-float cv2-damage-float--heal';
    el.textContent = `+${amount}`;
    anchor.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  },

  // ── Cambio de stat ────────────────────────────────────────────────────────

  showStatChange(side, stat, dir, pct) {
    const anchor   = document.getElementById(`cv2-${side}-sprite-wrap`);
    const spriteEl = document.getElementById(`cv2-${side}-sprite`);
    if (!anchor || !spriteEl?.src) return Promise.resolve();

    const statMap = { ATK: 'atk', DEF: 'def', SPA: 'spa', SPD: 'spd', SPE: 'spe' };
    const file = statMap[stat] ?? 'mix';

    // Wrapper fijo con la silueta del pokemon como máscara
    const wrap = document.createElement('div');
    wrap.className = 'cv2-stat-wrap';
    const maskUrl = `url('${spriteEl.src}')`;
    wrap.style.webkitMaskImage = maskUrl;
    wrap.style.maskImage = maskUrl;

    // Imagen de stat que se desliza dentro del wrapper enmascarado
    const el = document.createElement('img');
    el.src = `assets/animations/${file}.png`;
    el.className = `cv2-stat-img cv2-stat-img--${dir === 'up' ? 'rise' : 'fall'}`;
    wrap.appendChild(el);
    anchor.appendChild(wrap);

    return new Promise(resolve => {
      el.addEventListener('animationend', () => { wrap.remove(); resolve(); }, { once: true });
      setTimeout(() => { if (wrap.parentNode) { wrap.remove(); resolve(); } }, CV2_DELAY.STAT_CHANGE + 300);
    });
  },

  // ── Barra de equipo ───────────────────────────────────────────────────────

  updateTeamBar(side, team) {
    if (!team) return;

    if (side === 'foe') {
      // Actualiza las bolas de estado del entrenador en el trainer-bar
      const balls = document.getElementById('cv2-trainer-balls');
      if (!balls) return;
      balls.innerHTML = team.map(p => {
        const cls = p.currentHp <= 0 ? 'fainted' : 'alive';
        return `<span class="trainer-ball trainer-ball--${cls}">⬤</span>`;
      }).join('');
      return;
    }

    // Lado jugador: pips completos con sprite, barra HP, nivel y barra EXP
    const bar = document.getElementById('cv2-team-player');
    if (!bar) return;
    bar.innerHTML = team.map(p => {
      const ratio   = p.stats.hp > 0 ? p.currentHp / p.stats.hp : 0;
      const hpLevel = ratio > 0.5 ? 'high' : ratio > 0.25 ? 'mid' : 'low';
      const expPct  = p.expToNext > 0
        ? Math.max(0, Math.min(100, Math.round((p.exp / p.expToNext) * 100)))
        : 0;
      const fainted = p.currentHp <= 0;
      return `
        <div class="combat-team-pip ${fainted ? 'combat-team-pip--fainted' : ''}">
          <img src="${p.spriteUrl ?? ''}" class="combat-team-pip__sprite" alt="${p.displayName}" onerror="this.style.opacity=0">
          <div class="combat-team-pip__hp-section">
            <div class="hp-bar-wrap combat-team-pip__hp-bar">
              <div class="hp-bar-fill" data-level="${hpLevel}" style="width:${Math.max(0, Math.round(ratio * 100))}%"></div>
            </div>
            <div class="combat-team-pip__hp-row">
              <div class="combat-team-pip__level">Nv.${p.level}</div>
              <div class="combat-team-pip__hp-nums">${p.currentHp}/${p.stats.hp}</div>
            </div>
            <div class="combat-team-pip__exp-bar">
              <div class="combat-team-pip__exp-fill" style="width:${expPct}%"></div>
            </div>
          </div>
          <div class="combat-team-pip__item-slot"></div>
        </div>`;
    }).join('');
  },

  // ── Animaciones de EXP / subida de nivel ─────────────────────────────────

  updateExpBars(team) {
    const bar = document.getElementById('cv2-team-player');
    if (!bar) return;
    bar.querySelectorAll('.combat-team-pip').forEach((pipEl, i) => {
      const p = team[i];
      if (!p) return;
      const expPct = p.expToNext > 0
        ? Math.max(0, Math.min(100, Math.round((p.exp / p.expToNext) * 100)))
        : 0;
      const expFill = pipEl.querySelector('.combat-team-pip__exp-fill');
      if (expFill) expFill.style.width = `${expPct}%`;
    });
  },

  showLevelUpPip(pokemon, team, levelsGained) {
    const bar = document.getElementById('cv2-team-player');
    if (!bar) return;
    const idx   = team.indexOf(pokemon);
    const pipEl = bar.querySelectorAll('.combat-team-pip')[idx];
    if (!pipEl) return;

    pipEl.classList.remove('combat-team-pip--levelup');
    void pipEl.offsetWidth;
    pipEl.classList.add('combat-team-pip--levelup');
    pipEl.style.position = 'relative';

    const badge = document.createElement('div');
    badge.className  = 'pip-levelup-badge';
    badge.textContent = `+${levelsGained}`;
    pipEl.appendChild(badge);

    setTimeout(() => {
      pipEl.classList.remove('combat-team-pip--levelup');
      badge.remove();
    }, 950);
  },

  // ── Move card ─────────────────────────────────────────────────────────────

  showMove(move) {
    const nameEl  = document.getElementById('cv2-move-name');
    const typeEl  = document.getElementById('cv2-move-type');
    const powerEl = document.getElementById('cv2-move-power');
    const btn     = document.getElementById('cv2-move-btn');
    if (!nameEl) return;

    document.getElementById('cv2-move-loading')?.setAttribute('hidden', '');

    const type = move?.type ?? 'normal';
    nameEl.textContent = move?.name ?? '—';

    if (typeEl) {
      typeEl.textContent        = move?.type ? move.type.toUpperCase() : '';
      typeEl.dataset.type       = type;
    }
    if (powerEl) {
      powerEl.textContent = move?.power ? `POD: ${move.power}` : '';
    }
    if (btn) btn.dataset.type = type;
  },

  clearMove() {
    const nameEl  = document.getElementById('cv2-move-name');
    const typeEl  = document.getElementById('cv2-move-type');
    const powerEl = document.getElementById('cv2-move-power');
    const btn     = document.getElementById('cv2-move-btn');
    if (nameEl)  nameEl.textContent  = '';
    if (typeEl)  { typeEl.textContent = ''; typeEl.dataset.type = ''; }
    if (powerEl) powerEl.textContent = '';
    if (btn)     btn.dataset.type    = '';
    document.getElementById('cv2-move-loading')?.removeAttribute('hidden');
  },

  // ── Botón de velocidad ────────────────────────────────────────────────────

  setSpeed(factor) {
    CV2_SPEED_FACTOR = factor;
    const btn = document.getElementById('cv2-speed-btn');
    if (btn) btn.textContent = factor === CV2_SPEED.X2 ? 'x2' : 'x1';
  },

  toggleSpeed() {
    this.setSpeed(CV2_SPEED_FACTOR === CV2_SPEED.X1 ? CV2_SPEED.X2 : CV2_SPEED.X1);
  },

  // ── Botón de pausa ────────────────────────────────────────────────────────

  setPauseState(paused) {
    const btn = document.getElementById('cv2-pause-btn');
    if (!btn) return;
    btn.textContent = paused ? '▶ Reanudar' : '⏸ Pausa';
    btn.classList.toggle('cv2-btn--paused', paused);
  },

  // ── Animación shiny ───────────────────────────────────────────────────────

  showShinyAnim(side) {
    const wrap = document.getElementById(`cv2-${side}-sprite-wrap`);
    if (!wrap) return;
    const img = document.createElement('img');
    img.src = 'assets/animations/shiny-animation.gif';
    img.className = 'shiny-battle-anim';
    img.setAttribute('aria-hidden', 'true');
    wrap.appendChild(img);
    img.addEventListener('animationend', () => img.remove(), { once: true });
  },

};

