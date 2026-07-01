const GameState = {
  starter:          null,
  starterName:      null,   // nombre original (base form), no cambia al evolucionar
  team:             [],
  balls:            999,
  badges:           [],
  items:            [],
  autoMode:         true,
  hardcoreMode:     false,  // modo hardcore: debilitados = eliminados, solo starter
  routeIndex:          0,
  furthestRouteIndex:  0,
  currentEncounter: 0,
  currentPath:      null,
  currentPaths:     null,
  gymRoute:         null,
  gymPhase:         0,
  paused:              false,
  specialTrainerUsed:  false,
  _pathRunning:        false,
  combat:              null,
  _optionalArea:       null,
  currentArea:         null,
  version:            GAME_VERSION,

  init(starter) {
    this.starter             = starter;
    this.starterName         = starter.name;
    this.team                = [starter];
    this.balls               = 999;
    this.badges              = [];
    this.items               = [];
    this.autoMode            = true;
    this.routeIndex          = 0;
    this.furthestRouteIndex  = 0;
    this.currentEncounter    = 0;
    this.currentPath         = null;
    this.currentPaths        = null;
    this.paused              = false;
    this.specialTrainerUsed  = false;
    this._pathRunning        = false;
    this.welcomeShown        = {};
    this.combat              = null;
    this._optionalArea       = null;
    this.currentArea         = null;
    // Marcar starter como capturado y aplicar EVs guardados
    Storage.markCaught(starter.name);
    Storage.applyStoredEvs(starter);
    console.log(`[GAME] Nueva partida iniciada con ${starter.displayName}`);
  },

  reset() {
    this.starter          = null;
    this.starterName      = null;
    this.team             = [];
    this.balls            = 999;
    this.badges           = [];
    this.items            = [];
    this.autoMode         = true;
    this.hardcoreMode     = false;
    this.routeIndex         = 0;
    this.furthestRouteIndex = 0;
    this.currentEncounter   = 0;
    this.currentPath        = null;
    this.currentPaths       = null;
    this.paused             = false;
    this.specialTrainerUsed = false;
    this._pathRunning       = false;
    this.welcomeShown       = {};
    this.combat             = null;
    this._optionalArea      = null;
    this.currentArea        = null;
    console.log('[GAME] Estado reseteado');
  },
};

window.addEventListener('DOMContentLoaded', () => {
  console.log('[GAME] Pokemon Adventure — version web');
  console.log('[GAME] Abre las DevTools (F12) para ver el log de combate');
  Storage.propagateShinyLineAll();

  // Contenedor compartido para todos los botones globales flotantes
  const globalControls = document.createElement('div');
  globalControls.id = 'global-controls';
  globalControls.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:9999;display:flex;gap:6px;align-items:center';
  document.body.appendChild(globalControls);

  const _btnBase = [
    'font-size:14px',
    'background:rgba(0,0,0,.35)',
    'border:1px solid rgba(255,255,255,.2)',
    'color:rgba(255,255,255,.6)',
    'padding:6px 8px',
    'border-radius:6px',
    'cursor:pointer',
    'line-height:1',
  ].join(';');

  // ── Botón engranaje — siempre visible, abre el panel ─────────────────────
  const gearBtn = document.createElement('button');
  gearBtn.id = 'btn-gear-global';
  gearBtn.title = 'Opciones';
  gearBtn.textContent = '⚙️';
  gearBtn.style.cssText = _btnBase + ';display:none';
  gearBtn.addEventListener('mouseenter', () => gearBtn.style.background = 'rgba(0,0,0,.6)');
  gearBtn.addEventListener('mouseleave', () => gearBtn.style.background = 'rgba(0,0,0,.35)');
  globalControls.appendChild(gearBtn);

  // ── Panel expandible — oculto por defecto ─────────────────────────────────
  const gearPanel = document.createElement('div');
  gearPanel.id = 'gear-panel';
  gearPanel.style.cssText = 'display:none;gap:6px;align-items:center';
  globalControls.appendChild(gearPanel);

  const _openPanel = () => {
    gearBtn.style.display = 'none';
    gearPanel.style.display = 'flex';
  };
  const _closePanel = () => {
    gearPanel.style.display = 'none';
    gearBtn.style.display = '';
  };

  gearBtn.addEventListener('click', _openPanel);

  // ── Botón de reset ────────────────────────────────────────────────────────
  const resetBtn = document.createElement('button');
  resetBtn.id = 'btn-reset-global';
  resetBtn.textContent = '🗑';
  resetBtn.title = 'Borrar datos guardados (pokédex y EVs)';
  resetBtn.style.cssText = _btnBase;
  resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = 'rgba(0,0,0,.6)');
  resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = 'rgba(0,0,0,.35)');
  resetBtn.addEventListener('click', () => {
    const ok = confirm('¿Borrar todos los datos guardados?\n\nSe eliminará el progreso de la Pokédex, los EVs, las medallas y los movimientos aprendidos por MT.\n\nEsta acción no se puede deshacer.');
    if (!ok) return;
    Storage._set('pokedex', {});
    Storage._set('evs', {});
    Storage._set('mts', {});
    Storage._set('badges', {});
    console.log('[Storage] Datos reseteados: pokédex, EVs, MTs y medallas eliminados');
    resetBtn.textContent = '✓';
    resetBtn.style.color = '#4caf50';
    setTimeout(() => {
      resetBtn.textContent = '🗑';
      resetBtn.style.color = 'rgba(255,255,255,.6)';
    }, 1500);
  });
  // ── Botón X — cierra el panel — siempre primero ──────────────────────────
  const closeBtn = document.createElement('button');
  closeBtn.title = 'Cerrar';
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = _btnBase + ';color:#e74c3c;border-color:rgba(231,76,60,.4)';
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(231,76,60,.25)');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(0,0,0,.35)');
  closeBtn.addEventListener('click', _closePanel);
  gearPanel.appendChild(closeBtn);

  gearPanel.appendChild(resetBtn);

  // ── Botón de notas (independiente del panel) ─────────────────────────────
  const notesBtn = document.createElement('button');
  notesBtn.id = 'btn-notes-global';
  notesBtn.title = 'Notas';
  notesBtn.textContent = '📋';
  notesBtn.style.cssText = 'display:none;' + _btnBase;
  notesBtn.addEventListener('mouseenter', () => notesBtn.style.background = 'rgba(0,0,0,.6)');
  notesBtn.addEventListener('mouseleave', () => notesBtn.style.background = 'rgba(0,0,0,.35)');
  notesBtn.addEventListener('click', () => NotesPopup.open());
  globalControls.appendChild(notesBtn);

  // ── Botón SmartRotom ──────────────────────────────────────────────────────
  const smartRotomBtn = document.createElement('button');
  smartRotomBtn.id = 'btn-smart-rotom';
  smartRotomBtn.title = 'SmartRotom';
  smartRotomBtn.textContent = 'SmartRotom';
  smartRotomBtn.style.cssText = _btnBase;
  smartRotomBtn.addEventListener('mouseenter', () => smartRotomBtn.style.background = 'rgba(0,0,0,.6)');
  smartRotomBtn.addEventListener('mouseleave', () => smartRotomBtn.style.background = 'rgba(0,0,0,.35)');
  smartRotomBtn.addEventListener('click', () => {
    _closePanel();
    const overlay = document.createElement('div');
    overlay.className = 'cv2-settings-overlay';
    overlay.innerHTML = `
      <div class="cv2-settings-panel">
        <div class="cv2-settings-header">
          <span class="cv2-settings-title">SmartRotom</span>
          <button class="cv2-btn cv2-settings-close">✕</button>
        </div>
        <p style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);text-align:center;padding:8px 0">
          Próximamente...
        </p>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.cv2-settings-close').addEventListener('click', () => overlay.remove());
  });
  gearPanel.appendChild(smartRotomBtn);

  Screens.show(Screens.title);
});
