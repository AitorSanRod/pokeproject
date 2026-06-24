// ─────────────────────────────────────────────────────────────────────────────
// GAME MODES — pantalla de selección de modo de juego
//
// Para añadir un nuevo modo:
//   1. Añade una entrada en GAME_MODES con id, name, desc y accentColor.
//   2. Añade un case en el switch del listener de clicks.
// ─────────────────────────────────────────────────────────────────────────────

const GAME_MODES = [
  {
    id: 'adventure',
    name: 'AVENTURA',
    desc: 'Elige tu pokémon inicial y derrota a los Líderes de gimnasio, completa la Pokédex y Convierteté en Campeón de la Liga Pokémon.',
    accentColor: 'var(--red)',
  },
  {
    id: 'battle-frontier',
    name: 'FRENTE BATALLA',
    desc: 'Elige 3 pokémon de tu Pokédex y enfréntate a una serie de combates consecutivos. ¿Hasta dónde llegarás?',
    accentColor: 'var(--green)',
    // Getter evaluado en tiempo de llamada (BF_ENABLED se carga después de este archivo)
    get enabled() { return typeof BF_ENABLED !== 'undefined' ? BF_ENABLED : true; },
  },
];

const GameModesScreen = {

  show() {
    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="modes-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">JUGAR</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--sp-md);padding:var(--sp-md);overflow-y:auto;flex:1">
          ${GAME_MODES.map(m => {
            const enabled = m.enabled ?? true;
            return `
            <div class="mode-card" data-mode="${m.id}" role="button" tabindex="0"
              style="--mode-accent:${m.accentColor}${!enabled ? ';opacity:0.4;cursor:not-allowed;pointer-events:none' : ''}">
              <div class="mode-card__info">
                <div class="mode-card__name">${m.name}</div>
                <div class="mode-card__desc">${m.desc}</div>
              </div>
              <div class="mode-card__arrow" style="${!enabled ? 'opacity:0' : ''}">›</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;

    document.getElementById('modes-back').addEventListener('click', () => {
      Screens.show(Screens.title);
    });

    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = GAME_MODES.find(m => m.id === card.dataset.mode);
        if (mode && (mode.enabled ?? true) === false) return;
        GameModesScreen._onSelect(card.dataset.mode);
      });
    });
  },

  _onSelect(modeId) {
    switch (modeId) {
      case 'adventure': {
        const hasSave = Storage.hasRun(GameState.version);
        if (hasSave) {
          const ok = confirm('¿Iniciar una nueva partida?\n\nSe perderá el progreso guardado.');
          if (!ok) return;
          Storage.clearRun();
        }
        Screens.show(Screens.regionSelect);
        break;
      }
      case 'battle-frontier': {
        BattleFrontierScreen.show();
        break;
      }
    }
  },
};
