// ─────────────────────────────────────────────────────────────────────────────
// BATTLE FRONTIER — selección de equipo de 3 pokémon capturados
// ─────────────────────────────────────────────────────────────────────────────

// Cambia a false para desactivar el botón en la pantalla de modos sin eliminar el código.
const BF_ENABLED = false;
const BF_LEVEL = 50;

const BF_RULES = [
  'Elige 3 Pokémon de tu Pokédex.',
  'Todos los Pokémon combaten al nivel 50.',
  'Los combates no otorgan experiencia ni EVs.',
  'El objetivo es superar los 100 combates sin perder.',
  'Recibirás curación completa cada 20 pisos superados.',
  'Ganarás recompensas al superar cada bloque de 10 combates.',
  'Puedes reorganizar tu equipo entre bloques de 5 combates.',
  'Cada 20 plantas tienes un checkpoint desde el que empezar.'
];
const BattleFrontierScreen = {
  _team:           [],   // [{ name, id, shiny }, ...] — máximo 3 (pantalla de selección)
  _replaceIdx:     null, // índice de slot en modo sustitución, o null
  _battleTeam:     [],   // [Pokemon, ...] — objetos creados (pantalla de preparación)
  _selectedItemId: null, // id del objeto seleccionado en la pantalla de prep
  _currentFloor:   0,    // último piso completado en esta run (1-20); 0 = ninguno
  _battleCount:    0,    // número de combate actual en la run (1-100)
  _floorIdx:       0,    // índice en BF_FLOORS del piso en curso
  _pendingBattles: [],   // trainers pre-sorteados para los próximos combates (se llenan en el reorg screen)

  // ── Pantalla de selección de equipo ──────────────────────────────────────

  show() {
    BattleFrontierScreen._team           = [];
    BattleFrontierScreen._replaceIdx     = null;
    BattleFrontierScreen._battleTeam     = [];
    BattleFrontierScreen._selectedItemId = null;
    BattleFrontierScreen._currentFloor   = 0;
    BattleFrontierScreen._battleCount    = 0;
    BattleFrontierScreen._floorIdx       = 0;
    BattleFrontierScreen._pendingBattles = [];
    BattleFrontierScreen._render();
  },

  // Actualiza el estado disabled de las cards de objetos según los objetos ya equipados.
  // Llámalo cada vez que cambie el heldItem de cualquier Pokémon del equipo.
  _refreshItemCards() {
    const used = new Set(
      BattleFrontierScreen._battleTeam.map(p => p.heldItem).filter(Boolean)
    );
    document.querySelectorAll('.bf-item-card').forEach(card => {
      card.classList.toggle('bf-item-card--disabled', used.has(card.dataset.itemId));
    });
  },

  // Llamar una sola vez al terminar la run (victoria o derrota).
  // Guarda el piso máximo solo si supera el récord almacenado.
  _onRunEnd() {
    const floor = BattleFrontierScreen._currentFloor;
    if (floor > 0) Storage.setBfMaxFloor(floor);
  },

  // ── Helpers de renderizado parcial ───────────────────────────────────────

  _slotHtml(i) {
    const team       = BattleFrontierScreen._team;
    const replaceIdx = BattleFrontierScreen._replaceIdx;
    const p          = team[i];
    const isActive   = replaceIdx === i;
    if (p) {
      return `
        <div class="bf-slot bf-slot--filled${isActive ? ' bf-slot--active' : ''}" data-idx="${i}" role="button" tabindex="0">
          <div style="position:relative;display:inline-block">
            <img src="${getDexSpriteUrl(p.id)}" class="bf-slot__sprite" onerror="this.style.opacity=0.3">
            ${p.shiny ? `<img src="assets/sprites/others/shiny.png" style="width:11px;height:11px;image-rendering:pixelated;position:absolute;top:0;right:0">` : ''}
          </div>
          <div class="bf-slot__name">${p.name.toUpperCase()}</div>
          <div class="bf-slot__hint" style="color:${isActive ? 'var(--blue)' : 'var(--grey)'}">
            ${isActive ? 'CAMBIAR' : '✕'}
          </div>
        </div>`;
    }
    return `
      <div class="bf-slot bf-slot--empty" data-idx="${i}">
        <div class="bf-slot__num">${i + 1}</div>
      </div>`;
  },

  _patchSlots() {
    const container = document.getElementById('bf-slots');
    if (!container) return;
    container.innerHTML = [0, 1, 2].map(i => BattleFrontierScreen._slotHtml(i)).join('');
    container.querySelectorAll('.bf-slot--filled').forEach(el => {
      el.addEventListener('click', () => {
        const idx = +el.dataset.idx;
        BattleFrontierScreen._replaceIdx = BattleFrontierScreen._replaceIdx === idx ? null : idx;
        BattleFrontierScreen._patchSlots();
        BattleFrontierScreen._patchHeader();
      });
    });
  },

  _patchHeader() {
    const el         = document.getElementById('bf-list-header');
    const team       = BattleFrontierScreen._team;
    const replaceIdx = BattleFrontierScreen._replaceIdx;
    if (el) el.textContent = replaceIdx !== null
      ? `SUSTITUIR A ${team[replaceIdx]?.name?.toUpperCase()}`
      : `Pokémon seleccionados — ${team.length}/3`;
  },

  _patchEntry(name, inTeam) {
    const el = document.querySelector(`#bf-poke-list [data-name="${name}"]`);
    if (!el) return;
    el.classList.toggle('dex-entry--caught', !inTeam);
    el.classList.toggle('bf-entry--inteam',   inTeam);
    el.style.cursor  = inTeam ? 'default' : 'pointer';
    el.style.opacity = inTeam ? '0.45'    : '';
    const arrow = el.querySelector('.bf-arrow');
    if (arrow) {
      arrow.textContent   = inTeam ? '✓' : '›';
      arrow.style.color   = inTeam ? 'var(--blue)' : 'var(--grey)';
    }
  },

  // ── Render inicial (solo la primera vez o al volver) ──────────────────────

  _render() {
    const dex        = Storage.getPokedex();
    const allEntries = typeof DEX_GENERATIONS !== 'undefined'
      ? DEX_GENERATIONS.flatMap(g => g.entries)
      : KANTO_DEX;
    const caught = allEntries.filter(e => dex[e.name]?.caught);

    const team          = BattleFrontierScreen._team;
    const selectedNames = new Set(team.map(t => t.name));

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;overflow:hidden">

        <div class="screen-header" style="background:var(--green)">
          <button class="btn btn--ghost screen-header__back" id="bf-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">FRENTE BATALLA</span>
        </div>

        <!-- Slots de equipo -->
        <div id="bf-slots" style="display:flex;gap:var(--sp-sm);padding:var(--sp-md);background:var(--white);border-bottom:var(--border)">
          ${[0, 1, 2].map(i => BattleFrontierScreen._slotHtml(i)).join('')}
        </div>

        <!-- Reglas del modo -->
        <div style="padding:var(--sp-sm) var(--sp-md);border-bottom:var(--border)">
          <details class="bf-rules" style="background:var(--white);border:var(--border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm)">
            <summary style="display:flex;align-items:center;justify-content:space-between;
              padding:var(--sp-md);cursor:pointer;list-style:none;border-radius:var(--radius-md)">
              <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);letter-spacing:1px">REGLAS</span>
              <span class="bf-rules__arrow" style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);flex-shrink:0">▶</span>
            </summary>
            <div style="padding:0 var(--sp-md) var(--sp-md)">
              <div style="border-radius:var(--radius-sm);border:1px solid #38BF4B22;background:#38BF4B0d;padding:10px 12px">
                <ul style="margin:0;padding-left:14px">
                  ${BF_RULES.map(r => `
                    <li style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);line-height:2.2;margin-bottom:1px">${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          </details>
        </div>

        <!-- Cabecera lista -->
        <div id="bf-list-header" style="padding:var(--sp-xs) var(--sp-md);font-family:var(--font-pixel);font-size:6px;color:var(--grey)">
          POKÉMON CAPTURADOS — ${team.length}/3
        </div>

        <!-- Lista de pokémon capturados -->
        <div id="bf-poke-scroll" style="overflow-y:auto;flex:1;min-height:0;padding:0 var(--sp-sm)">
          <div id="bf-poke-list" style="display:flex;flex-direction:column;gap:4px">
            ${caught.length === 0
              ? `<p style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);text-align:center;padding:32px 16px;line-height:1.8">
                   No tienes pokémon capturados.
                 </p>`
              : caught.map(entry => {
                  const inTeam  = selectedNames.has(entry.name);
                  const isShiny = Storage.isShiny(entry.name);
                  return `
                    <div class="dex-entry ${inTeam ? 'bf-entry--inteam' : 'dex-entry--caught'}"
                      data-name="${entry.name}" data-id="${entry.id}" data-shiny="${isShiny}"
                      style="cursor:${inTeam ? 'default' : 'pointer'}${inTeam ? ';opacity:0.45' : ''}">
                      <span class="dex-entry__num">#${String(entry.id).padStart(3, '0')}</span>
                      <div class="dex-entry__sprite-wrap">
                        <img src="${getDexSpriteUrl(entry.id)}"
                          class="dex-entry__sprite" alt="${entry.name}" onerror="this.style.opacity=0.3">
                      </div>
                      <div class="dex-entry__info">
                        <span class="dex-entry__name">${entry.name.toUpperCase()}</span>
                        <div class="dex-entry__types">
                          ${entry.types.map(t => `<span class="type-badge" data-type="${t}">${t}</span>`).join('')}
                        </div>
                      </div>
                      ${isShiny ? `<img src="assets/sprites/others/shiny.png" style="width:14px;height:14px;image-rendering:pixelated;flex-shrink:0">` : ''}
                      <span class="bf-arrow" style="font-family:var(--font-pixel);font-size:8px;flex-shrink:0;color:${inTeam ? 'var(--blue)' : 'var(--grey)'}">
                        ${inTeam ? '✓' : '›'}
                      </span>
                    </div>`;
                }).join('')}
          </div>
        </div>

        <!-- Botón continuar -->
        <div style="padding:var(--sp-sm) var(--sp-md);border-top:var(--border);background:var(--white)">
          <button class="btn btn--primary btn--wide" id="bf-continue" ${team.length < 3 ? 'disabled' : ''}>
            CONTINUAR
          </button>
        </div>

      </div>`;

    document.getElementById('bf-back').addEventListener('click', () => GameModesScreen.show());
    document.getElementById('bf-continue').addEventListener('click', () => BattleFrontierScreen._showPrepScreen());

    // Slots — delegamos en _patchSlots para consistencia
    BattleFrontierScreen._wireSlotsIn(document.getElementById('bf-slots'));

    // Lista — event delegation: un solo listener en el contenedor
    document.getElementById('bf-poke-list').addEventListener('click', e => {
      const entry = e.target.closest('.dex-entry--caught');
      if (!entry) return;
      BattleFrontierScreen._onPick(entry);
    });
  },

  _wireSlotsIn(container) {
    container?.querySelectorAll('.bf-slot--filled').forEach(el => {
      el.addEventListener('click', () => {
        const idx = +el.dataset.idx;
        BattleFrontierScreen._replaceIdx = BattleFrontierScreen._replaceIdx === idx ? null : idx;
        BattleFrontierScreen._patchSlots();
        BattleFrontierScreen._patchHeader();
      });
    });
  },

  _onPick(el) {
    const name       = el.dataset.name;
    const id         = +el.dataset.id;
    const isShiny    = el.dataset.shiny === 'true';
    const team       = BattleFrontierScreen._team;
    const replaceIdx = BattleFrontierScreen._replaceIdx;

    if (replaceIdx === null && team.length >= 3) return;

    if (!isShiny) {
      BattleFrontierScreen._commit(name, id, false);
      return;
    }

    const shinySpriteUrl  = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
    const normalSpriteUrl = getDexSpriteUrl(id);

    const overlay = Screens._makeModal(`
      <div class="modal-title">${name.toUpperCase()}</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);text-align:center;line-height:1.8;margin-bottom:12px">
        ¡Tienes una versión shiny! ¿Con cuál quieres jugar?
      </p>
      <div style="display:flex;justify-content:center;gap:24px;margin-bottom:16px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <img src="${normalSpriteUrl}" style="width:64px;height:64px;image-rendering:pixelated" onerror="this.style.opacity=0.3">
          <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark)">NORMAL</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <img src="${shinySpriteUrl}" style="width:64px;height:64px;image-rendering:pixelated" onerror="this.style.opacity=0.3">
          <span style="font-family:var(--font-pixel);font-size:7px;color:var(--yellow)">✨ SHINY</span>
        </div>
      </div>
      <button class="btn btn--wide" id="bf-pick-normal" style="margin-bottom:6px">NORMAL</button>
      <button class="btn btn--primary btn--wide" id="bf-pick-shiny">✨ SHINY</button>
      <button class="btn btn--ghost btn--wide" id="bf-pick-cancel" style="margin-top:6px">Cancelar</button>
    `, { id: 'bf-shiny-modal', closeOnBackdrop: true });

    overlay.querySelector('#bf-pick-normal').addEventListener('click', () => { overlay.remove(); BattleFrontierScreen._commit(name, id, false); });
    overlay.querySelector('#bf-pick-shiny').addEventListener('click',  () => { overlay.remove(); BattleFrontierScreen._commit(name, id, true);  });
    overlay.querySelector('#bf-pick-cancel').addEventListener('click', () => overlay.remove());
  },

  _commit(name, id, shiny) {
    const team       = BattleFrontierScreen._team;
    const replaceIdx = BattleFrontierScreen._replaceIdx;
    let   oldName    = null;

    if (replaceIdx !== null) {
      oldName = team[replaceIdx]?.name ?? null;
      team[replaceIdx] = { name, id, shiny };
      BattleFrontierScreen._replaceIdx = null;
    } else {
      team.push({ name, id, shiny });
    }

    // Parche quirúrgico — sin reconstruir el viewport
    if (oldName && oldName !== name) BattleFrontierScreen._patchEntry(oldName, false);
    BattleFrontierScreen._patchEntry(name, true);
    BattleFrontierScreen._patchSlots();
    BattleFrontierScreen._patchHeader();
    const btn = document.getElementById('bf-continue');
    if (btn) btn.disabled = team.length < 3;
  },

  // ── Pantalla de preparación ───────────────────────────────────────────────

  async _showPrepScreen() {
    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;align-items:center;justify-content:center">
        <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">Preparando equipo...</span>
      </div>`;

    try {
      const pokes = await Promise.all(
        BattleFrontierScreen._team.map(t => createPokemon(t.name, BF_LEVEL, true, null, null, t.shiny))
      );
      for (const p of pokes) {
        Storage.applyStoredEvs(p);
        p.stats     = computeStats(p);
        p.currentHp = p.stats.hp;
      }
      BattleFrontierScreen._battleTeam = pokes;
      BattleFrontierScreen._renderPrepScreen();
    } catch (err) {
      console.error('[BF] Error creando pokémon:', err);
      document.getElementById('viewport').innerHTML = `
        <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
          <span style="font-family:var(--font-pixel);font-size:8px;color:var(--red)">Error al cargar el equipo.</span>
          <button class="btn btn--wide" id="bf-err-back">Volver</button>
        </div>`;
      document.getElementById('bf-err-back').addEventListener('click', () => BattleFrontierScreen.show());
    }
  },

  _renderPrepScreen() {
    const bf    = BattleFrontierScreen;
    const pokes = bf._battleTeam;

    const collectedIds = Object.keys(Storage.getCollectedItems());
    const items = collectedIds
      .filter(id => HELD_ITEMS[id])
      .map(id => ({ id, ...HELD_ITEMS[id] }));

    const _updateLabel = () => {
      const label = document.getElementById('bf-team-label');
      const sel   = bf._selectedItemId;
      if (label) {
        label.textContent = sel ? 'EQUIPAR A → ELIGE UN POKÉMON' : 'EQUIPO · ARRASTRA para ordenar · TOCA para cambiar ataque';
        label.style.color = sel ? 'var(--blue)' : 'var(--grey)';
      }
    };

    const _renderCards = () => {
      const container = document.getElementById('bf-prep-team');
      if (!container) return;
      const sel = bf._selectedItemId;
      container.innerHTML = pokes.map((p, i) => {
        const heldItem = p.heldItem ? HELD_ITEMS[p.heldItem] : null;
        const autoMove = p.moves.find(m => m.id === p.autoMove) ?? p.moves[0];
        return `
          <div class="bf-reorg-card" draggable="true" data-idx="${i}"
            style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
              box-shadow:var(--shadow-sm);padding:10px 12px;display:flex;align-items:center;
              gap:10px;cursor:pointer;touch-action:none;user-select:none
              ${sel ? ';outline:2px dashed var(--blue)' : ''}">
            <img src="${p.spriteUrl ?? ''}" alt="${p.displayName}"
              style="width:52px;height:52px;image-rendering:pixelated;object-fit:contain;flex-shrink:0"
              onerror="this.style.opacity=0">
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
              <!-- Fila 1: nombre + nivel -->
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-family:var(--font-pixel);font-size:9px;color:var(--black)">
                  ${p.displayName}${p.shiny ? ' ' + Screens._shinyIcon(10) : ''}
                </span>
                <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">Nv.${p.level}</span>
              </div>
              <!-- Fila 2: barra de vida + bola de tipo + objeto (misma línea) -->
              <div style="display:flex;align-items:center;gap:6px">
                <div class="bf-prep-hp-wrap" style="flex:0 0 50%">${Render.hpBar(p.currentHp, p.stats.hp)}</div>
                ${autoMove ? `<span class="type-badge route-move-badge" data-type="${autoMove.type}">${autoMove.name}</span>` : ''}
                <div class="held-item-icon${heldItem ? '' : ' held-item-icon--empty'}"
                  style="margin-left:auto;flex-shrink:0"
                  ${heldItem ? `title="${heldItem.name}"` : ''}>
                  ${heldItem ? `<img src="${heldItem.img}" alt="${heldItem.name}"
                    onerror="this.outerHTML='<span class=\\'held-item-icon__fallback\\'>${heldItem.fallbackIcon ?? '❓'}</span>'">` : ''}
                </div>
              </div>
            </div>
            <span style="font-size:16px;color:var(--grey-light);cursor:grab;flex-shrink:0;padding:0 2px">⠿</span>
          </div>`;
      }).join('');

      let dragIdx = null;
      let dragging = false;

      container.querySelectorAll('.bf-reorg-card').forEach(card => {
        card.addEventListener('dragstart', e => {
          dragIdx = +card.dataset.idx;
          dragging = true;
          card.style.opacity = '.3';
          e.stopPropagation();
        });
        card.addEventListener('dragend', () => {
          dragging = false;
          container.querySelectorAll('.bf-reorg-card').forEach(c => {
            c.style.opacity = '';
            c.style.outline = '';
          });
          dragIdx = null;
          _renderCards();
        });
        card.addEventListener('dragover', e => { e.preventDefault(); card.style.outline = '2px solid var(--yellow)'; });
        card.addEventListener('dragleave', () => { card.style.outline = ''; });
        card.addEventListener('drop', e => {
          e.preventDefault();
          e.stopPropagation();
          const toIdx = +card.dataset.idx;
          if (dragIdx === null || dragIdx === toIdx) return;
          [bf._battleTeam[dragIdx], bf._battleTeam[toIdx]] = [bf._battleTeam[toIdx], bf._battleTeam[dragIdx]];
          GameState.team = bf._battleTeam;
        });
        card.addEventListener('click', () => {
          if (dragging) return;
          const idx   = +card.dataset.idx;
          const selId = bf._selectedItemId;
          if (selId) {
            const p = bf._battleTeam[idx];
            if (HELD_ITEMS[selId].canEquip && !HELD_ITEMS[selId].canEquip(p)) return;
            equipHeldItem(p, selId);
            bf._selectedItemId = null;
            document.querySelectorAll('.bf-item-card').forEach(c => c.classList.remove('bf-item-card--selected'));
            bf._refreshItemCards();
            _updateLabel();
            _renderCards();
          } else {
            bf._showBfMoveSelector(bf._battleTeam[idx], _renderCards);
          }
        });
      });

      Screens._initTouchSort(container, '.bf-reorg-card', (from, to) => {
        [bf._battleTeam[from], bf._battleTeam[to]] = [bf._battleTeam[to], bf._battleTeam[from]];
        GameState.team = bf._battleTeam;
        _renderCards();
      });
    };

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;overflow:hidden">

        <div class="screen-header" style="background:var(--green)">
          <button class="btn btn--ghost screen-header__back" id="bf-prep-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">FRENTE BATALLA</span>
        </div>

        <!-- Objetos desbloqueados — ocupa el espacio sobrante y hace scroll -->
        <div style="flex:1;min-height:0;overflow-y:auto;padding:var(--sp-sm) var(--sp-md);border-bottom:var(--border)">
          <div style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);margin-bottom:var(--sp-xs)">
            OBJETOS DESBLOQUEADOS
          </div>
          ${items.length === 0
            ? `<p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-light);text-align:center;padding:8px 0;line-height:1.8">
                 Aún no has desbloqueado ningún objeto.
               </p>`
            : `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--sp-sm)">
                 ${items.map(item => `
                   <div class="bf-item-card" data-item-id="${item.id}" role="button" tabindex="0">
                     <img src="${item.img}" class="bf-item-card__img" onerror="this.style.display='none'">
                     <span class="bf-item-card__name">${item.name}</span>
                   </div>`).join('')}
               </div>`}
        </div>

        <!-- Equipo con reorg integrado — tamaño natural, pegado al botón -->
        <div style="flex:0 0 auto;padding:var(--sp-sm) var(--sp-md);display:flex;flex-direction:column">
          <div id="bf-team-label"
            style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);margin-bottom:var(--sp-xs);line-height:1.8;flex-shrink:0">
            EQUIPO · ARRASTRA para ordenar · TOCA para cambiar ataque
          </div>
          <div id="bf-prep-team" style="display:flex;flex-direction:column;gap:8px"></div>
        </div>

        <!-- Botón comenzar -->
        <div style="padding:var(--sp-sm) var(--sp-md);border-top:var(--border);background:var(--white)">
          <button class="btn btn--primary btn--wide" id="bf-start">COMENZAR</button>
        </div>

      </div>`;

    _renderCards();

    document.getElementById('bf-prep-back').addEventListener('click', () => {
      bf._selectedItemId = null;
      bf._render();
    });

    document.getElementById('bf-start').addEventListener('click', () => bf._showFloorSelect());

    bf._refreshItemCards();
    document.querySelectorAll('.bf-item-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('bf-item-card--disabled')) return;
        const id = card.dataset.itemId;
        bf._selectedItemId = bf._selectedItemId === id ? null : id;
        document.querySelectorAll('.bf-item-card').forEach(c => {
          c.classList.toggle('bf-item-card--selected', c.dataset.itemId === bf._selectedItemId);
        });
        _updateLabel();
        _renderCards();
      });
    });
  },

  // ── Lógica de la run del Frente Batalla ──────────────────────────────────

  // Muestra el modal de selección de punto de entrada (desde el principio o desde
  // un checkpoint de 20 en 20) y lanza la run al confirmar.
  _showFloorSelect() {
    const maxFloor    = Storage.getBfMaxFloor();
    const checkpoints = [20, 40, 60, 80, 100];

    const overlay = Screens._makeModal(`
      <div class="modal-title">¿DESDE DÓNDE EMPEZAR?</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
        <button class="btn btn--primary btn--wide" id="bf-floor-0">DESDE EL PRINCIPIO</button>
        ${checkpoints.map(f => {
          const unlocked = maxFloor >= f;
          return `<button class="btn btn--wide" id="bf-floor-${f}"
            ${unlocked ? '' : 'disabled'}
            style="${unlocked ? '' : 'opacity:0.38;cursor:not-allowed'}">
            PLANTA ${f}${unlocked ? '' : ' (bloqueada)'}
          </button>`;
        }).join('')}
        <button class="btn btn--ghost btn--wide" id="bf-floor-cancel">CANCELAR</button>
      </div>`);

    document.getElementById('bf-floor-0').addEventListener('click', () => {
      overlay.remove();
      BattleFrontierScreen._startRunFromFloor(0);
    });
    checkpoints.forEach(f => {
      const btn = document.getElementById(`bf-floor-${f}`);
      if (btn && !btn.disabled) {
        btn.addEventListener('click', () => {
          overlay.remove();
          BattleFrontierScreen._startRunFromFloor(f);
        });
      }
    });
    document.getElementById('bf-floor-cancel').addEventListener('click', () => overlay.remove());
  },

  _startRunFromFloor(fromFloor = 0) {
    BattleFrontierScreen._battleCount  = fromFloor;
    BattleFrontierScreen._currentFloor = fromFloor;
    BattleFrontierScreen._floorIdx     = 0;  // _nextBattle avanza con su while

    for (const p of BattleFrontierScreen._battleTeam) fullHeal(p);

    GameState.team = BattleFrontierScreen._battleTeam;
    GameState.currentTrainerCombatBg = BF_FLOORS[0].trainerBg ?? null;

    BattleFrontierScreen._nextBattle();
  },

  // Pre-sortea los próximos 5 trainers, los guarda en _pendingBattles y
  // devuelve los datos de display (img, name, flags) ya usando esos trainers reales.
  _buildBfPath() {
    const bf    = BattleFrontierScreen;
    const start = bf._battleCount;
    const steps = [];
    bf._pendingBattles = [];
    let fi     = bf._floorIdx;
    let prevFi = fi;

    for (let n = 1; n <= 5; n++) {
      const num = start + n;
      if (num > 100) break;

      prevFi = fi;
      while (fi < BF_FLOORS.length - 1 &&
             BF_FLOORS[fi].battleRange &&
             num > (BF_FLOORS[fi].battleRange[1] ?? Infinity)) fi++;

      const floor = BF_FLOORS[fi];
      if (!floor?.battleRange) break;

      const isSpecial  = floor.specialTrainer?.battleNumber === num;
      const trainer    = isSpecial
        ? floor.specialTrainer
        : floor.trainers[BattleFrontierScreen._trainerIdxForBattle(floor, num)];
      const isFloorEnd = num === floor.battleRange[1];

      bf._pendingBattles.push({ num, trainer });

      steps.push({
        num,
        img:       trainer.img,
        name:      trainer.name,
        isSpecial,
        hasReward: isFloorEnd && !!floor.reward,
        isNewFloor: fi !== prevFi && n > 1,
      });
    }
    return steps;
  },

  // Dado un floor y un número de combate absoluto, devuelve el índice en floor.trainers
  // que corresponde a ese combate (saltando el slot del specialTrainer si existe).
  _trainerIdxForBattle(floor, num) {
    const specialNum = floor.specialTrainer?.battleNumber;
    let idx = 0;
    for (let b = floor.battleRange[0]; b < num; b++) {
      if (b !== specialNum) idx++;
    }
    return idx;
  },

  async _nextBattle() {
    BattleFrontierScreen._battleCount++;
    const count = BattleFrontierScreen._battleCount;

    // Avanzar piso si el combate actual supera el battleRange del piso en curso.
    // battleRange?.[1] ?? Infinity evita entrar en entradas sin battleRange (p.ej. type:'victory').
    while (
      BattleFrontierScreen._floorIdx < BF_FLOORS.length - 1 &&
      count > (BF_FLOORS[BattleFrontierScreen._floorIdx].battleRange?.[1] ?? Infinity)
    ) {
      BattleFrontierScreen._floorIdx++;
    }

    const floor = BF_FLOORS[BattleFrontierScreen._floorIdx];

    // Resetear mods de combate y efectos de objetos antes de cada batalla
    for (const p of GameState.team) p.combatMods = {};
    resetHeldItemFlags(GameState.team);
    for (const p of GameState.team) {
      if (p.heldItem) {
        const item = HELD_ITEMS[p.heldItem];
        if (item?.trigger === HELD_ITEM_TRIGGERS.PASSIVE && item.fn) item.fn({ user: p });
      }
    }

    // Determinar entrenador: usar el pre-sorteado si existe, si no sortear ahora
    const pending = BattleFrontierScreen._pendingBattles;
    let trainer;
    if (pending.length > 0 && pending[0].num === count) {
      trainer = pending.shift().trainer;
    } else if (floor.specialTrainer?.battleNumber === count) {
      trainer = floor.specialTrainer;
    } else {
      const idx = BattleFrontierScreen._trainerIdxForBattle(floor, count);
      trainer = floor.trainers[idx] ?? floor.trainers[0];
    }

    const foeTeamRaw = await Promise.all(
      trainer.pokemon.map(p => createPokemon(p.name, p.level, false, p.moveId ?? null))
    );
    const foeTeam = foeTeamRaw.map((foe, i) => {
      const def = trainer.pokemon[i];
      if (def.heldItem) equipHeldItem(foe, def.heldItem);
      return foe;
    });

    GameState.currentTrainerCombatBg = floor.trainerBg ?? null;

    Screens.show(Screens.combat, {
      foeTeam,
      isTrainer:   true,
      trainerName: `${trainer.name} · PISO ${BattleFrontierScreen._battleCount}`,
      noExp:       true,
      onWin:  () => BattleFrontierScreen._onBattleWin(floor),
      onLoss: () => BattleFrontierScreen._onBattleLoss(),
    });
  },

  _onBattleWin(floor) {
    const count = BattleFrontierScreen._battleCount;

    if (count < floor.battleRange[1]) {
      BattleFrontierScreen._nextBattle();
      return;
    }

    // Cada combate ganado es un piso
    BattleFrontierScreen._currentFloor = count;
    const currentFloor = count;
    const isRunOver    = BF_FLOORS[BattleFrontierScreen._floorIdx + 1]?.type === 'victory'
                      || BattleFrontierScreen._floorIdx >= BF_FLOORS.length - 1;
    const needsReorg   = !isRunOver && currentFloor % 5 === 0;

    const afterReward = () => {
      // Curación completa cada 20 pisos (20, 40, 60, 80, 100)
      if (currentFloor % 20 === 0) {
        for (const p of BattleFrontierScreen._battleTeam) fullHeal(p);
      }
      if (isRunOver) {
        BattleFrontierScreen._onRunEnd();
        BattleFrontierScreen._showBfVictory();
      } else if (needsReorg) {
        BattleFrontierScreen._showReorgScreen(() => BattleFrontierScreen._nextBattle());
      } else {
        BattleFrontierScreen._nextBattle();
      }
    };

    if (floor.reward) {
      BattleFrontierScreen._showBfReward(floor.reward, afterReward);
    } else {
      afterReward();
    }
  },

  _onBattleLoss() {
    BattleFrontierScreen._onRunEnd();
    BattleFrontierScreen._showBfDefeat();
  },

  async _showBfReward(reward, onDone) {
    const pokeName = reward.pokemon[Math.floor(Math.random() * reward.pokemon.length)];
    const tm       = reward.tm[Math.floor(Math.random() * reward.tm.length)];
    const tmId     = tm?.id ?? null;
    const itemId   = reward.item[Math.floor(Math.random() * reward.item.length)];
    const isShiny  = Math.random() < BF_SHINY_RATE;

    // Solo para mostrar sprite/nombre — nunca se añade al equipo
    const rewardPoke = await createPokemon(pokeName, 50, false, null, null, isShiny);

    // Pokédex: marcar capturado solo si no se tenía; shiny siempre que lo sea
    if (!Storage.isCaught(pokeName)) Storage.markCaught(pokeName);
    if (isShiny) Storage.markShiny(pokeName);

    const itemIsNew = !Storage.isItemCollected(itemId);
    Storage.markItemCollected(itemId);

    const move = tm ? (MOVE_BY_ID[tm.moveId] ?? null) : null;
    const item = HELD_ITEMS[itemId] ?? null;

    // Objeto con la forma que espera Screens._showTMSelector
    const tmPrize = {
      tmId,
      name: tm?.name ?? tmId,
      icon: `<img src="${tm?.sprite ?? ''}" style="width:28px;height:28px;image-rendering:pixelated;vertical-align:middle" onerror="this.style.display='none'">`,
      desc: move ? `${move.name} · POD:${move.power ?? '—'} · ${move.type}` : (tm?.desc ?? ''),
    };

    const _renderReward = () => {
      document.getElementById('viewport').innerHTML = `
        <div class="screen" style="background:url('assets/bg/price.png') center/cover no-repeat;
          align-items:center;justify-content:center;gap:20px;padding:32px 24px;
          text-align:center;display:flex;flex-direction:column;">
          <span style="font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.7);letter-spacing:2px">RECOMPENSA</span>
          <span style="font-family:var(--font-pixel);font-size:14px;color:var(--white);
            text-shadow:3px 3px 0 rgba(0,0,0,.3);line-height:1.6">¡PISO COMPLETADO!</span>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:340px">

            <!-- Pokémon (clic para continuar) -->
            <div class="item-card" id="bf-poke-card" role="button" tabindex="0" style="cursor:pointer">
              <div class="item-card__icon" style="position:relative;display:inline-block">
                <img src="${rewardPoke.spriteUrl ?? ''}"
                  style="width:52px;height:52px;image-rendering:pixelated;object-fit:contain"
                  onerror="this.style.opacity=0">
                ${isShiny ? `<img src="assets/sprites/others/shiny.png"
                  style="width:14px;height:14px;image-rendering:pixelated;position:absolute;top:0;right:0">` : ''}
              </div>
              <div class="item-card__name">${rewardPoke.displayName}</div>
              ${isShiny ? `<div style="font-family:var(--font-pixel);font-size:5px;color:var(--yellow);margin-top:2px">✨ SHINY</div>` : ''}
            </div>

            <!-- MT (interactiva — requiere elegir Pokémon; avanza al enseñar) -->
            <div class="item-card" id="bf-tm-card" role="button" tabindex="0"
              style="cursor:pointer;outline:none">
              <div class="item-card__icon">
                <img src="${tm?.sprite ?? ''}"
                  style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain"
                  onerror="this.style.display='none'">
              </div>
              <div class="item-card__name">${tm?.name ?? tmId}</div>
              <div style="font-family:var(--font-pixel);font-size:5px;color:var(--blue);margin-top:3px">
                TOCA PARA ENSEÑAR
              </div>
            </div>

            <!-- Objeto (clic para continuar) -->
            <div class="item-card" id="bf-item-card" role="button" tabindex="0"
              style="cursor:pointer;position:relative">
              ${itemIsNew
                ? `<div style="position:absolute;top:4px;right:4px;background:var(--yellow);color:var(--black);font-family:var(--font-pixel);font-size:5px;padding:2px 5px;border-radius:2px;line-height:1.4">NUEVO</div>`
                : `<div style="position:absolute;top:4px;right:4px;background:rgba(128,128,128,.25);color:var(--grey);font-family:var(--font-pixel);font-size:5px;padding:2px 5px;border-radius:2px;line-height:1.4">DESBLOQUEADO</div>`
              }
              <div class="item-card__icon">
                <img src="${item?.img ?? ''}"
                  style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain"
                  onerror="this.style.display='none'">
              </div>
              <div class="item-card__name">${item?.name ?? itemId}</div>
            </div>
          </div>

          <button id="bf-reward-continue" class="btn btn--wide"
            style="max-width:340px;width:100%;background:var(--white);border:var(--border);box-shadow:var(--shadow-sm)">
            CONTINUAR
          </button>
        </div>`;

      // Pokémon e item: clic directo avanza
      document.getElementById('bf-poke-card').addEventListener('click', onDone);
      document.getElementById('bf-item-card').addEventListener('click', onDone);

      // MT: abre selector; si enseña → avanza; si cancela → vuelve a esta pantalla
      document.getElementById('bf-tm-card').addEventListener('click', () => {
        Screens._showTMSelector(tmPrize, onDone);
      });

      document.getElementById('bf-reward-continue').addEventListener('click', onDone);
    };

    _renderReward();
  },

  _showReorgScreen(onDone, onBack = null) {
    const bf        = BattleFrontierScreen;
    const pathSteps = BattleFrontierScreen._buildBfPath(); // pre-sortea trainers una sola vez

    const _render = () => {
      const pokes = bf._battleTeam;

      document.getElementById('viewport').innerHTML = `
        <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;overflow:hidden">
          <div class="screen-header" style="background:var(--green)">
            <button class="btn btn--ghost screen-header__back" id="bf-reorg-quit">
              <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round">
                <path d="M18 6 L6 18"/><path d="M6 6 L18 18"/>
              </svg>
            </button>
            <span class="screen-header__title">REORGANIZAR${bf._currentFloor > 0 ? ' — PISO ' + bf._currentFloor : ''}</span>
            ${onBack ? `<button class="btn btn--ghost screen-header__back" id="bf-reorg-back" style="left:auto;right:var(--sp-md)">${BACK_ARROW_SVG}</button>` : ''}
          </div>

          ${pathSteps.length ? `
          <div style="padding:8px 14px;border-bottom:var(--border);background:var(--white)">
            <div style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);margin-bottom:6px">
              PRÓXIMOS COMBATES
            </div>
            <div class="path-progress bf-path">
              ${pathSteps.map((s, i) => {
                const icon = `<img src="${s.img}" style="width:20px;height:20px;image-rendering:pixelated;object-fit:contain"
                  onerror="this.outerHTML='<span style=font-size:11px>👤</span>'">`;
                const label = s.name + (s.hasReward ? ' ★' : '');
                const sep = s.isNewFloor
                  ? `<div style="width:2px;height:28px;background:var(--grey-light);border-radius:1px;flex-shrink:0;margin:0 2px"></div>`
                  : '';
                return `
                  ${sep}
                  <div class="path-progress__step path-encounter-cell"
                    style="${s.isSpecial ? 'border-color:var(--yellow);background:#fffbe6' : ''}">
                    <div class="path-progress__icon">${icon}</div>
                    <div class="path-tooltip">${label}</div>
                    ${s.hasReward ? `<span style="position:absolute;top:-5px;right:-5px;font-size:9px;line-height:1">★</span>` : ''}
                  </div>
                  ${i < pathSteps.length - 1 ? `<div class="path-progress__line"></div>` : ''}`;
              }).join('')}
            </div>
          </div>` : ''}

          <div style="flex:1;overflow-y:auto;min-height:0;padding:12px 14px;display:flex;flex-direction:column;gap:10px">
            <p style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);margin:0">
              ARRASTRA para ordenar · TOCA para cambiar ataque activo
            </p>
            <div id="bf-reorg-team" style="display:flex;flex-direction:column;gap:10px;flex:1">
              ${pokes.map((p, i) => {
                const heldItem = p.heldItem ? HELD_ITEMS[p.heldItem] : null;
                const autoMove = p.moves.find(m => m.id === p.autoMove) ?? p.moves[0];
                return `
                  <div class="bf-reorg-card" draggable="true" data-idx="${i}"
                    style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
                      box-shadow:var(--shadow-sm);padding:14px 12px;display:flex;align-items:center;
                      gap:14px;cursor:pointer;touch-action:none;user-select:none">

                    <img src="${p.spriteUrl ?? ''}" alt="${p.displayName}"
                      style="width:72px;height:72px;image-rendering:pixelated;object-fit:contain;flex-shrink:0"
                      onerror="this.style.opacity=0">

                    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">

                      <div style="display:flex;align-items:baseline;gap:8px">
                        <span style="font-family:var(--font-pixel);font-size:10px;color:var(--black)">
                          ${p.displayName}${p.shiny ? ' ' + Screens._shinyIcon(12) : ''}
                        </span>
                        <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey)">Nv.${p.level}</span>
                      </div>

                      <div>${Render.hpBar(p.currentHp, p.stats.hp)}</div>

                      ${autoMove ? `<span class="type-badge route-move-badge" data-type="${autoMove.type}">${autoMove.name}</span>` : ''}

                      ${heldItem ? `
                        <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
                          <img src="${heldItem.img}" alt="${heldItem.name}"
                            style="width:18px;height:18px;image-rendering:pixelated;flex-shrink:0"
                            onerror="this.style.display='none'">
                          <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark)">
                            ${heldItem.name}
                          </span>
                        </div>` : ''}
                    </div>

                    <span style="font-size:18px;color:var(--grey-light);cursor:grab;flex-shrink:0;padding:0 2px">⠿</span>
                  </div>`;
              }).join('')}
            </div>
          </div>

          <div style="padding:var(--sp-sm) var(--sp-md);border-top:var(--border);background:var(--white)">
            <button class="btn btn--primary btn--wide" id="bf-reorg-continue">CONTINUAR</button>
          </div>
        </div>`;

      const container = document.getElementById('bf-reorg-team');
      let dragIdx = null;
      let dragging = false;

      container.querySelectorAll('.bf-reorg-card').forEach(card => {
        card.addEventListener('dragstart', e => {
          dragIdx = +card.dataset.idx;
          dragging = true;
          card.style.opacity = '.3';
          e.stopPropagation();
        });
        card.addEventListener('dragend', () => {
          dragging = false;
          container.querySelectorAll('.bf-reorg-card').forEach(c => {
            c.style.opacity = '';
            c.style.outline = '';
          });
          dragIdx = null;
          _render();
        });
        card.addEventListener('dragover', e => { e.preventDefault(); card.style.outline = '2px solid var(--yellow)'; });
        card.addEventListener('dragleave', () => { card.style.outline = ''; });
        card.addEventListener('drop', e => {
          e.preventDefault();
          e.stopPropagation();
          const toIdx = +card.dataset.idx;
          if (dragIdx === null || dragIdx === toIdx) return;
          [bf._battleTeam[dragIdx], bf._battleTeam[toIdx]] = [bf._battleTeam[toIdx], bf._battleTeam[dragIdx]];
          GameState.team = bf._battleTeam;
        });
        card.addEventListener('click', () => {
          if (dragging) return;
          bf._showBfMoveSelector(bf._battleTeam[+card.dataset.idx], _render);
        });
      });

      Screens._initTouchSort(container, '.bf-reorg-card', (from, to) => {
        [bf._battleTeam[from], bf._battleTeam[to]] = [bf._battleTeam[to], bf._battleTeam[from]];
        GameState.team = bf._battleTeam;
        _render();
      });

      document.getElementById('bf-reorg-quit').addEventListener('click', () => {
        const overlay = Screens._makeModal(`
          <div class="modal-title">¿ABANDONAR?</div>
          <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);text-align:center;line-height:1.8;margin-bottom:16px">
            Perderás el progreso de esta partida<br>y volverás al menú del Frente Batalla.
          </p>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn--primary btn--wide" id="bf-reorg-quit-confirm">ABANDONAR PARTIDA</button>
            <button class="btn btn--wide" id="bf-reorg-quit-cancel">CANCELAR</button>
          </div>`);
        document.getElementById('bf-reorg-quit-confirm').addEventListener('click', () => {
          overlay.remove();
          BattleFrontierScreen._onRunEnd();
          BattleFrontierScreen.show();
        });
        document.getElementById('bf-reorg-quit-cancel').addEventListener('click', () => overlay.remove());
      });
      document.getElementById('bf-reorg-back')?.addEventListener('click', onBack);
      document.getElementById('bf-reorg-continue').addEventListener('click', onDone);
    };

    _render();
  },

  _showBfMoveSelector(poke, onClose) {
    const overlay = Screens._makeModal(`
      <div class="modal-title">${poke.displayName}</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);text-align:center;line-height:1.8;margin-bottom:8px">
        Elige el movimiento preferido
      </p>
      <div style="display:flex;flex-direction:column;gap:6px;overflow-y:auto;max-height:55vh">
        ${poke.moves.map(m => `
          <button class="btn ${poke.autoMove === m.id ? 'btn--primary' : ''} btn--wide"
            data-moveid="${m.id}" style="justify-content:space-between">
            <span>${m.name}</span>
            <span style="opacity:.6;font-size:6px">${m.type.toUpperCase()} · POD:${m.power ?? '—'}</span>
          </button>`).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="bf-move-sel-close" style="margin-top:8px">Cerrar</button>
    `, { id: 'bf-move-modal', closeOnBackdrop: true });

    overlay.querySelectorAll('[data-moveid]').forEach(btn => {
      btn.addEventListener('click', () => {
        poke.autoMove = btn.dataset.moveid;
        overlay.remove();
        onClose();
      });
    });

    document.getElementById('bf-move-sel-close').addEventListener('click', () => {
      overlay.remove();
      onClose();
    });
  },

  _showBfDefeat() {
    const floor = BattleFrontierScreen._battleCount;
    const msg   = floor > 0 ? `¡Has llegado hasta el piso ${floor}!` : 'Caiste en el primer piso';

    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--defeat">
        <div class="defeat-title">HAS SIDO<br>DERROTADO</div>
        <p style="font-family:var(--font-body);color:rgba(255,255,255,.6);font-size:13px">${msg}</p>
        <button class="btn btn--wide" id="bf-defeat-back"
          style="background:rgba(255,255,255,.15);color:white;border-color:rgba(255,255,255,.5);max-width:220px;width:100%">
          VOLVER AL PRINCIPIO
        </button>
      </div>`;

    document.getElementById('bf-defeat-back').addEventListener('click', () => BattleFrontierScreen.show());
  },

  _showBfVictory() {
    const data    = BF_FLOORS.find(f => f.type === 'victory') ?? {};
    const bgLayer = Screens._bgLayer(data.bg, true);

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="position:relative;
        align-items:center;justify-content:center;gap:18px;padding:32px 24px;text-align:center;display:flex;flex-direction:column;">
        ${bgLayer}
        <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:18px;width:100%">
          ${data.title ? `<span style="font-family:var(--font-pixel);font-size:18px;color:var(--white);text-shadow:3px 3px 0 rgba(0,0,0,.3);line-height:1.6">${data.title}</span>` : ''}
          ${data.description ? `<p style="text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">${data.description}</p>` : ''}
          <button class="btn btn--primary btn--wide" id="bf-victory-back" style="max-width:240px">VOLVER AL FRENTE</button>
        </div>
      </div>`;

    document.getElementById('bf-victory-back').addEventListener('click', () => BattleFrontierScreen.show());
  },
};
