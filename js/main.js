const GameState = {
  starter:          null,
  team:             [],
  balls:            999,
  badges:           [],
  items:            [],
  autoMode:         true,
  routeIndex:       0,
  currentEncounter: 0,
  currentPath:      null,
  currentPaths:     null,
  gymRoute:         null,
  gymPhase:         0,
  paused:              false,
  specialTrainerUsed:  false,
  _pathRunning:        false,
  combat:              null,

  init(starter) {
    this.starter          = starter;
    this.team             = [starter];
    this.balls            = 999;
    this.badges           = [];
    this.items            = [];
    this.autoMode         = true;
    this.routeIndex       = 0;
    this.currentEncounter = 0;
    this.currentPath      = null;
    this.currentPaths     = null;
    // Marcar starter como capturado y aplicar EVs guardados
    Storage.markCaught(starter.name);
    Storage.applyStoredEvs(starter);
    console.log(`[GAME] Nueva partida iniciada con ${starter.displayName}`);
  },

  reset() {
    this.starter          = null;
    this.team             = [];
    this.balls            = 999;
    this.badges           = [];
    this.items            = [];
    this.autoMode         = true;
    this.routeIndex       = 0;
    this.currentEncounter = 0;
    this.currentPath      = null;
    this.currentPaths     = null;
    this.paused             = false;
    this.specialTrainerUsed = false;
    this._pathRunning       = false;
    this.welcomeShown       = {};
    this.combat           = null;
    console.log('[GAME] Estado reseteado');
  },
};

window.addEventListener('DOMContentLoaded', () => {
  console.log('[GAME] Pokemon Adventure — version web');
  console.log('[GAME] Abre las DevTools (F12) para ver el log de combate');

  // Botón de reset — fijo en la pantalla global, fuera del viewport del juego
  const resetBtn = document.createElement('button');
  resetBtn.id = 'btn-reset-global';
  resetBtn.textContent = '🗑';
  resetBtn.title = 'Borrar datos guardados (pokédex y EVs)';
  resetBtn.style.cssText = [
    'position:fixed',
    'bottom:12px',
    'left:12px',
    'z-index:9999',
    'font-size:14px',
    'background:rgba(0,0,0,.35)',
    'border:1px solid rgba(255,255,255,.2)',
    'color:rgba(255,255,255,.6)',
    'padding:6px 8px',
    'border-radius:6px',
    'cursor:pointer',
    'line-height:1',
  ].join(';');

  resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = 'rgba(0,0,0,.6)');
  resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = 'rgba(0,0,0,.35)');

  resetBtn.addEventListener('click', () => {
    const ok = confirm('¿Borrar todos los datos guardados?\n\nSe eliminará el progreso de la Pokédex y los EVs de todos los pokemon.\n\nEsta acción no se puede deshacer.');
    if (!ok) return;
    Storage._set('pokedex', {});
    Storage._set('evs', {});
    console.log('[Storage] Datos reseteados: pokédex y EVs eliminados');
    resetBtn.textContent = '✓';
    resetBtn.style.color = '#4caf50';
    setTimeout(() => {
      resetBtn.textContent = '🗑';
      resetBtn.style.color = 'rgba(255,255,255,.6)';
    }, 1500);
  });

  document.body.appendChild(resetBtn);
  Screens.show(Screens.title);
});
