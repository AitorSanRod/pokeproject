// ═══════════════════════════════════════════════════════════════════════════
// COMBAT V2 — Playground
//
// Adaptador específico de la página de prueba (combat-playground.html).
// Gestiona la creación de equipos, la secuencia de encuentros y el reinicio.
//
// Para integrar CV2 en el juego principal, ver cv2-screen.js.
// ═══════════════════════════════════════════════════════════════════════════

// ── Datos del playground ─────────────────────────────────────────────────────
// Mueve estos valores aquí para probar escenarios sin tocar el engine ni el juego.
// type: 'wild' | 'trainer' | 'gym'

const CV2_PG = {
  NO_EXP: false,

  BG: 'assets/bg/combate-hierba-alta.png',

  PLAYER_PARTY: [
    { name: 'alakazam', level: 50 },
    { name: 'caterpie', level: 50 },
    { name: 'rhydon',   level: 20 },
    { name: 'alakazam', level: 50 },
    { name: 'caterpie', level: 50 },
    { name: 'rhydon',   level: 20 },
  ],

  ENCOUNTERS: [
    {
      type: 'wild',
      foeParty: [
        { name: 'rattata', level: 10 },
      ],
    },
    {
      type: 'trainer',
      trainerName: 'Rival',
      foeParty: [
        { name: 'chansey', level: 50 },
        { name: 'rhydon',  level: 48 },
      ],
    },
    {
      type: 'gym',
      trainerName: 'Misty',
      foeParty: [
        { name: 'starmie',  level: 50 },
        { name: 'venusaur', level: 50 },
      ],
    },
  ],
};

// ── Estado del playground ─────────────────────────────────────────────────────

let _playerTeam   = null;
let _foeTeams     = [];
let _encounterIdx = 0;

// ── Iniciar el encuentro actual ───────────────────────────────────────────────

function _startEncounter() {
  if (!_playerTeam || !_foeTeams.length) return;
  const enc = CV2_PG.ENCOUNTERS[_encounterIdx];
  if (!enc) return;

  cv2UI.setPauseState(false);

  cv2Screen.start(_playerTeam, _foeTeams[_encounterIdx], {
    isWild:          enc.type === 'wild',
    isTrainer:       enc.type === 'trainer',
    isGym:           enc.type === 'gym',
    noExp:           CV2_PG.NO_EXP,
    trainerName:     enc.trainerName ?? '',
    skipPlayerEntry: _encounterIdx > 0,
    onWin:           _onWin,
    onLoss:          _onLoss,
  });
}

// ── Crear equipos y ejecutar primer encuentro ─────────────────────────────────

async function cv2Preload() {
  _encounterIdx = 0;

  try {
    _playerTeam = await Promise.all(
      CV2_PG.PLAYER_PARTY.map(cfg =>
        createPokemon(cfg.name, cfg.level, true, cfg.moveId ?? null)
      )
    );

    _foeTeams = await Promise.all(
      CV2_PG.ENCOUNTERS.map(enc =>
        Promise.all(enc.foeParty.map(cfg =>
          createPokemon(cfg.name, cfg.level, false, cfg.moveId ?? null)
        ))
      )
    );

    _startEncounter();

  } catch (err) {
    console.error('[CV2 Playground] Error precargando:', err);
  }
}

// ── Callbacks de fin de combate ───────────────────────────────────────────────

async function _onWin() {
  _encounterIdx++;

  if (_encounterIdx >= CV2_PG.ENCOUNTERS.length) {
    cv2UI.log('¡Todos los combates superados!');
    document.getElementById('cv2-restart-btn').style.display = '';
    return;
  }

  const total = CV2_PG.ENCOUNTERS.length;
  cv2UI.log(`Siguiente combate… (${_encounterIdx + 1}/${total})`);
  await cv2UI.wait(1400);
  _startEncounter();
}

function _onLoss() {
  document.getElementById('cv2-restart-btn').style.display = '';
}

// ── Reiniciar desde el principio ──────────────────────────────────────────────

async function cv2Restart() {
  document.getElementById('cv2-restart-btn').style.display = 'none';
  CombatV2.queue?.clear();
  CombatV2.state = null;
  _playerTeam    = null;
  _foeTeams      = [];
  _encounterIdx  = 0;
  await cv2Preload();
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Inyectar el HTML del combate en el wrapper del playground
  const wrap = document.getElementById('cv2-wrap');
  if (wrap) wrap.innerHTML = cv2Screen.html();

  // Background del área actual
  cv2Screen.applyBackground(CV2_PG.BG);

  // Botones estándar (Pokédex, Compendio, Pausa, Velocidad)
  cv2Screen.initButtons();

  // Botón de reinicio — exclusivo del playground, se añade en la barra de control
  const restartBtn = document.createElement('button');
  restartBtn.className   = 'cv2-btn';
  restartBtn.id          = 'cv2-restart-btn';
  restartBtn.textContent = '↺ Reiniciar';
  restartBtn.style.display = 'none';
  restartBtn.addEventListener('click', cv2Restart);
  document.getElementById('cv2-controls-right')?.prepend(restartBtn);

  cv2Preload();
});
