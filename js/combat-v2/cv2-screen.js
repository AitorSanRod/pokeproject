// ═══════════════════════════════════════════════════════════════════════════
// COMBAT V2 — Adaptador para el juego principal
//
// Este archivo es el único punto de contacto entre CV2 y screens.js.
// Para sustituir el combate actual, en screens.js reemplazar la llamada
// a _renderCombatScreen() / _combatStartTurn() por:
//
//   const vp = document.getElementById('viewport');
//   vp.innerHTML = cv2Screen.html();
//   cv2Screen.applyBackground(GameState.currentCombatBg);
//   cv2Screen.initButtons();
//   await cv2Screen.start(GameState.team, combat.foeTeam, {
//     isWild:      combat.isWild,
//     isTrainer:   combat.isTrainer,
//     isGym:       combat.isGym,
//     trainerName: combat.gymLeaderName ?? combat.trainerName,
//     noExp:       combat.noExp,
//     onWin:       combat.onWin,
//     onLoss:      combat.onLoss,
//   });
//
// Scripts a añadir en index.html (después de battle.js, antes de screens.js):
//   <script src="js/combat-v2/cv2-config.js"></script>
//   <script src="js/combat-v2/cv2-ui.js"></script>
//   <script src="js/combat-v2/cv2-engine.js"></script>
//   <script src="js/combat-v2/cv2-screen.js"></script>
// ═══════════════════════════════════════════════════════════════════════════

const cv2Screen = {

  // ── Plantilla HTML ────────────────────────────────────────────────────────
  // Genera el HTML del combate para inyectar en el contenedor de destino.
  // En el juego:  document.getElementById('viewport').innerHTML = cv2Screen.html()
  // En playground: inyectado en cv2-wrap (ver cv2-playground.js)
  html() {
    return `
    <div class="combat-field" id="cv2-field">

      <div class="cv2-loading-overlay" id="cv2-loading-overlay">
        <div class="cv2-spinner"></div>
      </div>

      <div class="cv2-weather-overlay" id="cv2-weather-overlay"></div>

      <div class="cv2-weather-badge" id="cv2-weather-badge" style="display:none"></div>

      <div class="trainer-bar" id="cv2-trainer-bar">
        <span class="trainer-bar__name" id="cv2-trainer-name">Entrenador</span>
        <div class="trainer-bar__balls" id="cv2-trainer-balls"></div>
      </div>

      <div class="combat-hud combat-hud--foe" id="cv2-hud-foe">
        <div class="combat-hud__name">
          <span id="cv2-foe-name">—</span>
          <span class="combat-hud__level" id="cv2-foe-level"></span>
        </div>

        <div class="hp-bar-wrap" style="height:var(--combat-hud-bar-height)">
          <div class="hp-bar-fill" id="cv2-foe-hp-fill" data-level="high" style="width:100%"></div>
        </div>
        <div class="combat-hud__hp-nums" id="cv2-foe-hp-nums">100%</div>
        <div class="hud-status-row" id="cv2-foe-status"></div>
      </div>

      <div class="combat-foe" id="cv2-foe-sprite-wrap">
        <img class="combat-sprite combat-sprite--foe" id="cv2-foe-sprite" alt="" onerror="this.style.opacity=0.2">
      </div>

      <div class="combat-player" id="cv2-player-sprite-wrap">
        <img class="combat-sprite combat-sprite--player" id="cv2-player-sprite" alt="" onerror="this.style.opacity=0.2">
      </div>

      <div class="combat-hud combat-hud--player" id="cv2-hud-player">
        <div class="combat-hud__name">
          <span id="cv2-player-name">—</span>
          <span class="combat-hud__level" id="cv2-player-level"></span>
        </div>

        <div class="hp-bar-wrap" style="height:var(--combat-hud-bar-height)">
          <div class="hp-bar-fill" id="cv2-player-hp-fill" data-level="high" style="width:100%"></div>
        </div>
        <div class="combat-hud__hp-nums" id="cv2-player-hp-nums">—/—</div>
        <div class="hud-status-row" id="cv2-player-status"></div>
      </div>

    </div>

    <div class="combat-log">
      <span class="combat-log__text" id="cv2-log-text">Cargando combate...</span>
    </div>

    <div id="cv2-path-progress"></div>

    <div id="cv2-move-area" style="padding:6px var(--sp-md);min-height:72px">
      <div class="move-btn move-btn--display" id="cv2-move-btn" data-type="" style="cursor:default;opacity:.9">
        <div class="cv2-move-loading" id="cv2-move-loading">
          <div class="cv2-move-loading__spin"></div>
        </div>
        <span class="move-btn__name" id="cv2-move-name"></span>
        <span class="move-btn__meta">
          <span class="type-badge" id="cv2-move-type" style="font-size:5px;padding:2px 4px"></span>
          <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark)" id="cv2-move-power"></span>
        </span>
      </div>
    </div>

    <div class="combat-team-bar" id="cv2-team-player"></div>

    <div id="cv2-controls" style="display:flex;align-items:center;justify-content:space-between;padding:6px 14px;background:var(--off-white);border-top:var(--border)">
      <div style="display:flex;gap:6px">
        <img class="icon-btn" id="cv2-settings-btn" src="assets/sprites/others/config.png" title="Ajustes" alt="Ajustes">
      </div>
      <div id="cv2-controls-right" style="display:flex;gap:8px;align-items:center">
        <button class="cv2-btn" id="cv2-pause-btn">⏸ Pausa</button>
        <button class="cv2-btn" id="cv2-speed-btn">x1</button>
      </div>
    </div>`;
  },

  // ── Background del campo ──────────────────────────────────────────────────
  // En el juego: cv2Screen.applyBackground(GameState.currentCombatBg)
  // En entrenador/gimnasio: cv2Screen.applyBackground(GameState.currentTrainerCombatBg)
  _currentBg: null,
  _restoreMoveArea: null,

  applyBackground(url) {
    if (!url) return;
    this._currentBg = url;
    const field = document.getElementById('cv2-field');
    if (!field) return;
    field.style.backgroundImage    = `url('${url}')`;
    field.style.backgroundSize     = 'cover';
    field.style.backgroundPosition = 'center';
  },

  // ── Wiring de botones ─────────────────────────────────────────────────────
  // Conecta todos los botones de la barra de control.
  // Llamar después de inyectar html() en el DOM.
  initButtons() {
    document.getElementById('cv2-pause-btn')
      ?.addEventListener('click', () => CombatV2.togglePause());

    document.getElementById('cv2-speed-btn')
      ?.addEventListener('click', () => cv2UI.toggleSpeed());
    cv2UI.setSpeed(CV2_SPEED_FACTOR); // sincroniza el label con el estado real

    document.getElementById('cv2-settings-btn')
      ?.addEventListener('click', () => this._openSettings());
  },

  // ── Restaurar DOM tras overlay (Pokédex, Compendio) ──────────────────────
  // Re-inyecta el HTML del combate y reconstruye el estado visual desde
  // CombatV2.state, que persiste en memoria durante toda la batalla.
  _restoreDom() {
    const container = document.getElementById('viewport') || document.getElementById('cv2-wrap');
    if (!container) return;

    container.innerHTML = this.html();

    // El overlay de carga es visible por defecto en el HTML; ocultarlo inmediatamente
    const overlay = document.getElementById('cv2-loading-overlay');
    if (overlay) overlay.style.display = 'none';

    if (this._currentBg) this.applyBackground(this._currentBg);
    this.initButtons();

    const s = CombatV2.state;
    if (!s) return;

    const player = s.playerTeam[s.playerIndex];
    // foeIndex puede estar un paso adelante del último rival (cuando el combate
    // acaba de terminar pero aún se muestra la pantalla de captura), así que
    // lo clampeamos al último foe válido.
    const foe = s.foeTeam[Math.min(s.foeIndex, s.foeTeam.length - 1)];

    cv2UI.updateTeamBar('player', s.playerTeam);
    cv2UI.updateTeamBar('foe',    s.foeTeam);
    cv2UI.initTrainerBar(s.trainerName, s.isTrainer || s.isGym);
    cv2UI.initHud('foe',    foe);
    cv2UI.initHud('player', player);

    // Sprites sin animación de entrada.
    // Limpiar animation/filter/transition primero para no heredar estado residual.
    const foeEl    = document.getElementById('cv2-foe-sprite');
    const playerEl = document.getElementById('cv2-player-sprite');
    if (foeEl) {
      foeEl.style.animation  = '';
      foeEl.style.transition = '';
      foeEl.src              = foe.spriteUrl ?? '';
      // En batalla salvaje el rival derrotado se mantiene como silueta oscura
      // hasta que el jugador captura o continúa.
      const foeFainted = foe.currentHp <= 0;
      const showSilhouette = foeFainted && s.isWild;
      foeEl.style.filter  = showSilhouette ? 'brightness(0)' : '';
      foeEl.style.opacity = foeFainted && !showSilhouette ? '0' : '1';
    }
    if (playerEl) {
      playerEl.style.animation  = '';
      playerEl.style.filter     = '';
      playerEl.style.transition = '';
      playerEl.src              = player.backSpriteUrl ?? player.spriteUrl ?? '';
      playerEl.style.opacity    = player.currentHp <= 0 ? '0' : '1';
    }

    if (this._restoreMoveArea) {
      this._restoreMoveArea();
    } else {
      const move = player.moves.find(m => m.id === player.autoMove) ?? player.moves[0];
      if (move) cv2UI.showMove(move);
    }

    cv2UI.updateWeather(s.weather?.id ?? null);

    // Path progress — después de sprites/HUDs para que un error aquí no los bloquee
    try {
      if (typeof Screens !== 'undefined') {
        const pathEl = document.getElementById('cv2-path-progress');
        if (pathEl) {
          const html = Screens._renderPathProgress();
          if (html) pathEl.outerHTML = html;
          else pathEl.remove();
        }
      }
    } catch (e) {
      console.warn('[CV2] _restoreDom: error al restaurar path progress', e);
    }
  },

  // ── Precarga de sprites ───────────────────────────────────────────────────
  _preload(urls) {
    return Promise.allSettled(
      [...new Set(urls.filter(Boolean))].map(url =>
        new Promise(resolve => {
          const img = new Image();
          img.onload = img.onerror = resolve;
          img.src = url;
        })
      )
    );
  },

  // ── Punto de entrada principal ────────────────────────────────────────────
  // Precarga sprites del encuentro y arranca el engine.
  // Llamar siempre después de html() e initButtons().
  async start(playerTeam, foeTeam, opts = {}) {
    this._restoreMoveArea = null;

    const gc = document.getElementById('global-controls');
    if (gc) gc.style.display = 'none';

    const _restore = () => { if (gc) gc.style.display = ''; };
    const _onWin   = opts.onWin;
    const _onLoss  = opts.onLoss;
    opts = {
      ...opts,
      onWin:  (...args) => { _restore(); _onWin?.(...args);  },
      onLoss: (...args) => { _restore(); _onLoss?.(...args); },
    };

    // En combates de continuación (mismo path) el DOM ya está visible — no mostrar
    // el overlay de carga para evitar el parpadeo entre nodos.
    const overlay = document.getElementById('cv2-loading-overlay');
    if (overlay && !opts.skipPlayerEntry) overlay.style.display = '';

    await this._preload([
      ...playerTeam.flatMap(p => [p.spriteUrl, p.backSpriteUrl]),
      ...foeTeam.map(p => p.spriteUrl),
    ]);

    if (overlay) overlay.style.display = 'none';
    CombatV2.start(playerTeam, foeTeam, opts);
  },

  // ── Menú de ajustes ───────────────────────────────────────────────────────
  // Pausa el combate y muestra un panel flotante con opciones.
  // Cerrar (sea por X o tras salir de cualquier overlay) restaura el DOM y
  // reanuda la cola de turnos exactamente donde se dejó.
  _openSettings() {
    CombatV2.pause();
    this._showSettingsPanel();
  },

  _showSettingsPanel() {
    const panel = document.createElement('div');
    panel.className = 'cv2-settings-overlay';
    panel.innerHTML = `
      <div class="cv2-settings-panel">
        <div class="cv2-settings-header">
          <span class="cv2-settings-title">Ajustes</span>
          <button class="cv2-btn cv2-settings-close">✕</button>
        </div>
        <button class="cv2-settings-option" id="cv2-sopt-dex">Pokédex</button>
        <button class="cv2-settings-option" id="cv2-sopt-comp">Compendio</button>
        <button class="cv2-settings-option" id="cv2-sopt-exit" style="background:var(--red);color:var(--white)">Salir</button>
      </div>`;
    document.body.appendChild(panel);

    const resume = () => { this._restoreDom(); CombatV2.resume(); };
    const back   = () => { this._restoreDom(); this._showSettingsPanel(); };
    const close  = () => panel.remove();

    panel.addEventListener('click', e => { if (e.target === panel) { close(); resume(); } });

    panel.querySelector('.cv2-settings-close').addEventListener('click', () => {
      close(); resume();
    });

    panel.querySelector('#cv2-sopt-dex').addEventListener('click', () => {
      close();
      if (typeof PokedexScreen === 'undefined') { back(); return; }
      PokedexScreen.show(back);
    });

    panel.querySelector('#cv2-sopt-comp').addEventListener('click', () => {
      close();
      if (typeof CompendiumScreen === 'undefined') { back(); return; }
      CompendiumScreen.show(back);
    });

    panel.querySelector('#cv2-sopt-exit').addEventListener('click', () => {
      close();
      GameState.reset();
      Screens.show(Screens.title);
    });
  },

};
