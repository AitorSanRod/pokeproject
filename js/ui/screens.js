// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN — edita aquí para cambiar comportamiento sin tocar la lógica
// ─────────────────────────────────────────────────────────────────────────────

const SCREENS_CONFIG = {
  // Cada región tiene: id, gen (etiqueta), name, routesGlobal (nombre del global
  // de rutas cargado por su script, p.ej. 'KANTO_ROUTES'), y starters[].
  // Para añadir una nueva generación: añadir entrada aquí y cargar su script
  // de rutas en index.html antes de que se use.
  REGIONS: [
    {
      id: 'kanto',
      gen: 'GEN I',
      name: 'KANTO',
      routesGlobal: 'KANTO_ROUTES',
      starters: [
        { name: 'bulbasaur',  label: 'Bulbasaur' },
        { name: 'charmander', label: 'Charmander' },
        { name: 'squirtle',   label: 'Squirtle' },
      ],
    },
  ],
  STARTER_LEVEL: 5,
  DEV_POKEDEX: false,
};

if (SCREENS_CONFIG.DEV_POKEDEX) {
  Storage.getPokedex = function () {
    const dex = {};
    const allEntries = typeof DEX_GENERATIONS !== 'undefined'
      ? DEX_GENERATIONS.flatMap(g => g.entries)
      : (typeof KANTO_DEX !== 'undefined' ? KANTO_DEX : []);
    allEntries.forEach(e => { dex[e.name] = { caught: true, seen: true }; });
    return dex;
  };
  Storage.isCaught = () => true;
  Storage.isSeen   = () => true;

  const _DEV_ALL_BADGES = ['boulder-badge','cascade-badge','thunder-badge','rainbow-badge','soul-badge','marsh-badge','volcano-badge','earth-badge'];
  Storage.getBadges    = () => [..._DEV_ALL_BADGES];
  Storage.getAllBadges  = () => {
    const all = {};
    const allEntries = typeof DEX_GENERATIONS !== 'undefined'
      ? DEX_GENERATIONS.flatMap(g => g.entries)
      : (typeof KANTO_DEX !== 'undefined' ? KANTO_DEX : []);
    allEntries.forEach(e => { all[e.name] = [..._DEV_ALL_BADGES]; });
    return all;
  };
  Storage.isKantoCompleted = () => true;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREENS — gestor de pantallas
// Cada función pública renderiza una pantalla completa en #viewport.
// Las funciones privadas (_xxx) son helpers internos o sub-pantallas.
// GameState es el estado global compartido; Storage persiste entre sesiones.
// ─────────────────────────────────────────────────────────────────────────────

const Screens = {

  // ── Guarda la run actual en localStorage ────────────────────────────────
  _saveRun() {
    Storage.saveRun({
      version:     GameState.version,
      routeIndex:  GameState.routeIndex,
      starterName: GameState.starterName ?? GameState.starter?.name ?? null,
      team:        GameState.team,
      badges:      GameState.badges,
      items:       GameState.items,
    });
  },

  // ── Navega a una pantalla ────────────────────────────────────────────────
  show(screenFn, ...args) {
    document.getElementById('btn-notes-global')?.style.setProperty('display', 'none');
    document.querySelectorAll('.held-item-tooltip--floating').forEach(el => el.remove());
    const viewport = document.getElementById('app');
    viewport.innerHTML = `<div class="game-viewport" id="viewport"></div>`;
    screenFn(...args);
  },

  // ═══════════════════════════════════════════════════════════════════════
  // HELPERS DE PLANTILLA — fragmentos HTML reutilizables
  // ═══════════════════════════════════════════════════════════════════════

  // Icono shiny en línea — mismo aspecto en todos los contextos.
  _shinyIcon(size = 10) {
    return `<img src="assets/sprites/others/shiny.png" style="width:${size}px;height:${size}px;image-rendering:pixelated;vertical-align:middle">`;
  },

  // Capa de fondo para pantallas de ruta.
  // withFallback=true → usa gradiente verde si no hay imagen (para pantallas
  // de información donde el fondo blanco quedaría mal).
  _bgLayer(url, withFallback = false) {
    if (url) return `<div class="encounter-bg-layer" style="background-image:url('${url}')"></div>`;
    if (withFallback) return `<div style="position:absolute;inset:0;background:linear-gradient(160deg,var(--green-dark) 0%,var(--green) 100%);z-index:0"></div>`;
    return '';
  },

  // Crea y monta un modal overlay con modal-sheet estándar.
  // id opcional: permite hacer document.getElementById(id)?.remove() antes de recrearlo.
  // closeOnBackdrop: si true, cerrar al pulsar fuera del sheet.
  _makeModal(innerHtml, { id = null, closeOnBackdrop = false } = {}) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    if (id) overlay.id = id;
    overlay.innerHTML = `<div class="modal-sheet">${innerHtml}</div>`;
    document.getElementById('viewport').appendChild(overlay);
    if (closeOnBackdrop) {
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    }
    return overlay;
  },

  // Botón de pokemon estándar en modales de selección (intercambio, EV, MT...).
  // extra: HTML adicional al final del botón (nivel, stat, badge de estado, etc.)
  // disabled: grisa y deshabilita el botón.
  _teamBtn(p, i, extra = '', disabled = false) {
    return `
      <button class="btn btn--wide" data-idx="${i}"
        style="display:flex;align-items:center;gap:10px;justify-content:flex-start;padding:8px 12px${disabled ? ';opacity:0.4' : ''}"
        ${disabled ? 'disabled' : ''}>
        <img src="${p.spriteUrl ?? ''}" style="width:28px;height:28px;image-rendering:pixelated" onerror="this.style.opacity=0">
        <span style="flex:1;text-align:left;font-family:var(--font-pixel);font-size:7px">${p.displayName}</span>
        ${extra}
      </button>`;
  },

  // Pip del equipo en la barra inferior de combate (barra de HP + EXP + nivel).
  // activePoke: pokemon activo actual para marcar el pip como activo.
  _pipHtml(p, activePoke) {
    const ratio    = p.stats.hp > 0 ? p.currentHp / p.stats.hp : 0;
    const hpLevel  = ratio > 0.5 ? 'high' : ratio > 0.25 ? 'mid' : 'low';
    const expPct   = p.expToNext > 0 ? Math.max(0, Math.min(100, Math.round((p.exp / p.expToNext) * 100))) : 0;
    const heldItem = p.heldItem ? HELD_ITEMS[p.heldItem] : null;
    const itemContent = heldItem
      ? `<img src="${heldItem.img}" alt="${heldItem.name}" title="${heldItem.name}" onerror="this.style.display='none'">`
      : '';
    return `
      <div class="combat-team-pip ${p === activePoke ? 'combat-team-pip--active' : ''} ${!isAlive(p) ? 'combat-team-pip--fainted' : ''}">
        <img src="${p.spriteUrl ?? ''}" class="combat-team-pip__sprite" alt="${p.displayName}" onerror="this.style.opacity=0">
        <div class="combat-team-pip__hp-section">
          <div class="hp-bar-wrap combat-team-pip__hp-bar">
            <div class="hp-bar-fill" data-level="${hpLevel}" style="width:${Math.max(0, Math.round(ratio * 100))}%"></div>
          </div>
          <div class="combat-team-pip__hp-row">
            <div class="combat-team-pip__level">Nv.${p.level}${p.shiny ? ' ' + Screens._shinyIcon(10) : ''}</div>
            <div class="combat-team-pip__hp-nums">${p.currentHp}/${p.stats.hp}</div>
          </div>
          <div class="combat-team-pip__exp-bar">
            <div class="combat-team-pip__exp-fill" style="width:${expPct}%"></div>
          </div>
        </div>
        <div class="combat-team-pip__item-slot">${itemContent}</div>
      </div>`;
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TITLE
  // ═══════════════════════════════════════════════════════════════════════
  title() {
    // Si hay un guardado de versión incompatible, eliminarlo automáticamente
    const rawSave = Storage.loadRun();
    if (rawSave && rawSave.version !== GameState.version) {
      Storage.clearRun();
      console.log('[Storage] Run antigua descartada (versión incompatible)');
    }
    const hasSave = Storage.hasRun(GameState.version);

    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--title">
        <div class="title-logo">
          <span class="title-logo__main">POKEMON</span>
          <span class="title-logo__sub">${GameState.version}</span>
        </div>
        <div class="title-pokeball">
          <div class="title-pokeball__top"></div>
          <div class="title-pokeball__bot"></div>
          <div class="title-pokeball__band"></div>
          <div class="title-pokeball__center"></div>
        </div>
        <div class="title-actions">
          ${hasSave ? `<button class="btn btn--primary btn--wide" id="btn-continue">CONTINUAR</button>` : ''}
          <button class="btn ${hasSave ? 'btn--wide' : 'btn--primary btn--wide'}" id="btn-adventure">
            ${hasSave ? 'NUEVA PARTIDA' : 'AVENTURA'}
          </button>
          <button class="btn btn--wide" id="btn-dex-title">
            POKÉDEX
          </button>
          <button class="btn btn--wide" id="btn-compendium-title">
            COMPENDIO
          </button>
          <button class="btn btn--wide" id="btn-datos-title"
            style="background:var(--blue);color:var(--white);margin-top:8px">
            DATOS
          </button>
        </div>
      </div>`;

    if (hasSave) {
      document.getElementById('btn-continue').addEventListener('click', () => {
        const save = Storage.loadRun();
        if (!save) return;
        GameState.reset();
        GameState.routeIndex       = save.routeIndex ?? 0;
        GameState.badges           = save.badges     ?? [];
        GameState.items            = save.items      ?? [];
        GameState.team             = save.team       ?? [];
        GameState.starter          = save.starterName ? { name: save.starterName } : null;
        GameState.starterName      = save.starterName ?? null;
        // Re-sincronizar MTs desde Storage: si el jugador borró los datos de pokédex
        // (que también limpia Storage.mts), los movimientos de MT se eliminan del equipo.
        GameState.team.forEach(p => {
          const validMTs = Storage.getLearnedMTs(p.name);
          p.moves     = (p.moves ?? []).filter(m => !MOVE_BY_ID[m.id]?.mt || validMTs.includes(m.id));
          p.learnedMTs = validMTs;
        });
        GameState.autoMode         = true;
        console.log(`[Storage] Run cargada — ruta ${GameState.routeIndex}, equipo: ${GameState.team.map(p => p.displayName).join(', ')}`);
        Screens.show(Screens.adventure);
      });
    }
    document.getElementById('btn-adventure')
      .addEventListener('click', () => {
        if (hasSave) {
          const ok = confirm('¿Iniciar una nueva partida?\n\nSe perderá el progreso guardado.');
          if (!ok) return;
          Storage.clearRun();
        }
        Screens.show(Screens.regionSelect);
      });
    document.getElementById('btn-dex-title')
      .addEventListener('click', () => PokedexScreen.show(() => Screens.show(Screens.title)));
    document.getElementById('btn-compendium-title')
      .addEventListener('click', () => CompendiumScreen.show(() => Screens.show(Screens.title)));

    document.getElementById('btn-datos-title').addEventListener('click', () => {
      Screens._showDatosMenu();
    });

    document.getElementById('btn-notes-global')?.style.removeProperty('display');
    console.log('[UI] Pantalla: Titulo');
  },

  // ── Menú de datos: importar / exportar storage ───────────────────────────
  _showDatosMenu() {
    const overlay = Screens._makeModal(`
      <div class="modal-title" style="color:var(--blue)">DATOS</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8;margin-bottom:16px">
        Exporta o importa todos los datos guardados<br>(pokédex, EVs, medallas, objetos).
      </p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn--wide" id="btn-datos-export"
          style="background:var(--blue);color:var(--white)">
          EXPORTAR
        </button>
        <button class="btn btn--wide" id="btn-datos-import">
          IMPORTAR
        </button>
      </div>
      <button class="btn btn--wide" id="btn-datos-cancel" style="margin-top:8px">CANCELAR</button>
    `);

    document.getElementById('btn-datos-cancel').addEventListener('click', () => overlay.remove());

    document.getElementById('btn-datos-export').addEventListener('click', () => {
      SaveData.exportar();
    });

    document.getElementById('btn-datos-import').addEventListener('click', () => {
      SaveData.importar(
        () => {
          overlay.remove();
          const toast = document.createElement('div');
          toast.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99999;pointer-events:none';
          toast.innerHTML = `<div style="background:var(--blue);color:white;font-family:var(--font-pixel);font-size:9px;padding:14px 24px;border-radius:8px;box-shadow:var(--shadow-md)">¡Datos importados!</div>`;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        },
        (msg) => alert(`Error al importar:\n${msg}`),
      );
    });
  },

  // ═══════════════════════════════════════════════════════════════════════
  // REGION SELECT
  // ═══════════════════════════════════════════════════════════════════════
  regionSelect() {
    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--region">
        <div class="screen-header">
          <button class="btn btn--ghost screen-header__back" id="btn-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">ELIGE REGION</span>
        </div>
        <div class="region-grid">
          <div class="region-card" id="region-kanto">
            <span class="region-card__name">KANTO</span>
            <span class="region-card__badge region-card__badge--available">DISPONIBLE</span>
          </div>
          <div class="region-card region-card--locked">
            <span class="region-card__name">JOHTO</span>
            <span class="region-card__badge region-card__badge--soon">PRONTO</span>
          </div>
        </div>
      </div>`;

    document.getElementById('btn-back')
      .addEventListener('click', () => Screens.show(Screens.title));
    document.getElementById('region-kanto')
      .addEventListener('click', () => {
        Screens._region = SCREENS_CONFIG.REGIONS.find(r => r.id === 'kanto');
        Screens.show(Screens.starterSelect);
      });
    console.log('[UI] Pantalla: Seleccion de region');
  },

  // ═══════════════════════════════════════════════════════════════════════
  // STARTER SELECT
  // ═══════════════════════════════════════════════════════════════════════
  // Pantalla de selección de pokemon inicial. Carga cada starter desde la API,
  // muestra sus stats/tipos y permite elegir uno para comenzar la partida.
  starterSelect() {
    const region   = Screens._region ?? SCREENS_CONFIG.REGIONS[0];
    const starters = region.starters;

    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--starter">
        <div class="screen-header">
          <button class="btn btn--ghost screen-header__back" id="btn-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">ELIGE TU INICIAL</span>
        </div>

        <!-- Profesor Oak -->
        <div style="display:flex;flex-direction:column;align-items:center;padding:12px 16px 0;flex-shrink:0">
          <img src="assets/sprites/others/oak.gif"
            alt="Profesor Oak"
            style="scale: 1.3; padding: 2em; image-rendering:pixelated;"
            onerror="this.style.display='none'">
          <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);text-align:center;line-height:1.8;margin-top:6px; margin-bottom:4px">
            El Profesor Oak tiene<br>tres pokemon para ti.
          </p>
        </div>

        <div class="starter-list" id="starter-list">
          ${starters.map(s => `
            <div class="starter-card" data-starter="${s.name}" id="card-${s.name}">
              <div class="starter-card__sprite-wrap">
                <div class="loading-sprite" id="sprite-${s.name}"></div>
              </div>
              <div class="starter-card__info">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <div class="starter-card__name" style="margin-bottom:0">${s.label.toUpperCase()}</div>
                  <span id="dmg-${s.name}" style="font-family:var(--font-pixel);font-size:6px"></span>
                </div>
                <div class="starter-card__types" id="types-${s.name}"></div>
                <div class="starter-card__stats" id="stats-${s.name}">
                  <div class="loading-sprite" style="height:32px;width:100%;grid-column:1/-1"></div>
                </div>
              </div>
              <div class="starter-card__arrow">→</div>
            </div>`).join('')}
          ${(() => {
            const unlocked = Object.values(Storage.getAllBadges()).some(b => b.length >= 8);
            return `
              <div id="card-custom"
                class="starter-card${unlocked ? '' : ' starter-card--locked'}"
                style="${unlocked ? '' : 'opacity:0.45;cursor:not-allowed'}">
                <div class="starter-card__sprite-wrap">
                  <span style="font-size:28px;line-height:1">${unlocked ? '✨' : '🔒'}</span>
                </div>
                <div class="starter-card__info">
                  <div class="starter-card__name">OTRO...</div>
                  <div style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);margin-top:4px;line-height:1.6">
                    ${unlocked ? 'Elige cualquier Pokémon capturado' : 'Consigue las 8 medallas con cualquier Pokémon'}
                  </div>
                </div>
                <div class="starter-card__arrow">${unlocked ? '→' : ''}</div>
              </div>`;
          })()}
        </div>
      </div>`;

    document.getElementById('btn-back')
      .addEventListener('click', () => Screens.show(Screens.regionSelect));

    starters.forEach(async (s) => {
      try {
        const isShiny = Math.random() < (typeof SHINY_RATE !== 'undefined' ? SHINY_RATE : 0);
        const p = await createPokemon(s.name, SCREENS_CONFIG.STARTER_LEVEL, true, null, null, isShiny);

        const spriteEl = document.getElementById(`sprite-${s.name}`);
        spriteEl.outerHTML = `<img src="${p.spriteUrl}" alt="${s.label}"
          class="starter-card__sprite" id="sprite-${s.name}"
          onerror="this.style.opacity=0.2">`;

        if (p.shiny) {
          const label = document.querySelector(`#card-${s.name} .starter-card__name`);
          if (label) label.insertAdjacentHTML('beforeend', ' ' + Screens._shinyIcon(12));
        }

        document.getElementById(`types-${s.name}`).innerHTML = Render.typeBadges(p.types);
        const storedEvs = Storage.getEvs(s.name);
        document.getElementById(`stats-${s.name}`).innerHTML = Render.statsGrid(p.stats, p.nature, storedEvs);

        // Tipo de ataque junto al nombre
        const dbEntry  = POKEMON_DB[s.name];
        const dmgClass = dbEntry?.damageClass ?? 'physical';
        const dmgEl    = document.getElementById(`dmg-${s.name}`);

        document.getElementById(`card-${s.name}`)
          .addEventListener('click', () => {
            console.log(`[UI] Starter elegido: ${s.name}${p.shiny ? ' (shiny)' : ''}`);
            GameState.init(p);
            if (p.shiny) Storage.markShiny(p.name);
            GameState.autoMode = true;
            Screens._saveRun();
            Screens.show(Screens.adventure);
          });

        console.log(`[UI] Starter cargado: ${s.name} Nv.${p.level}`);
      } catch (err) {
        console.error(`[UI] Error cargando ${s.name}:`, err);
      }
    });

    if (Object.values(Storage.getAllBadges()).some(b => b.length >= 8)) {
      document.getElementById('card-custom')
        .addEventListener('click', () => Screens._showCustomStarterPicker());
    }

    console.log('[UI] Pantalla: Seleccion de inicial');
  },

  // ── Selector de inicial libre (desbloqueado al conseguir las 8 medallas) ───
  _showCustomStarterPicker() {
    const dex = Storage.getPokedex();
    const allEntries = typeof DEX_GENERATIONS !== 'undefined' ? DEX_GENERATIONS.flatMap(g => g.entries) : KANTO_DEX;
    const caught = allEntries.filter(e => dex[e.name]?.caught);

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;overflow:hidden">
        <div class="screen-header">
          <button class="btn btn--ghost screen-header__back" id="custom-starter-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">ELIGE TU INICIAL</span>
        </div>
        <div style="overflow-y:auto;flex:1;min-height:0;padding:var(--sp-sm)">
          <div style="display:flex;flex-direction:column;gap:4px">
            ${caught.map(entry => {
              const isShiny = Storage.isShiny(entry.name);
              return `
              <div class="dex-entry dex-entry--caught" data-name="${entry.name}" data-id="${entry.id}"
                data-shiny="${isShiny}" style="cursor:pointer">
                <span class="dex-entry__num">#${String(entry.id).padStart(3,'0')}</span>
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
                <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);flex-shrink:0">›</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;

    document.getElementById('custom-starter-back')
      .addEventListener('click', () => Screens.show(Screens.starterSelect));

    const _startWith = async (name, useShiny) => {
      try {
        const p = await createPokemon(name, SCREENS_CONFIG.STARTER_LEVEL, true, null, null, useShiny);
        if (useShiny) Storage.markShiny(p.name);
        console.log(`[UI] Starter personalizado elegido: ${name}${useShiny ? ' (shiny)' : ''}`);
        GameState.init(p);
        GameState.autoMode = true;
        Screens._saveRun();
        Screens.show(Screens.adventure);
      } catch (err) {
        console.error(`[UI] Error cargando starter personalizado ${name}:`, err);
      }
    };

    document.querySelectorAll('.dex-entry--caught').forEach(el => {
      el.addEventListener('click', async () => {
        const name    = el.dataset.name;
        const isShiny = el.dataset.shiny === 'true';

        if (!isShiny) { _startWith(name, false); return; }

        // Pokémon capturado shiny — preguntar versión
        const shinySpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${el.dataset.id}.png`;
        const normalSpriteUrl = getDexSpriteUrl(+el.dataset.id);

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
          <button class="btn btn--wide" id="pick-normal" style="margin-bottom:6px">NORMAL</button>
          <button class="btn btn--primary btn--wide" id="pick-shiny">✨ SHINY</button>
          <button class="btn btn--ghost btn--wide" id="pick-cancel" style="margin-top:6px">Cancelar</button>
        `, { id: 'shiny-pick-modal', closeOnBackdrop: true });

        overlay.querySelector('#pick-normal').addEventListener('click', () => { overlay.remove(); _startWith(name, false); });
        overlay.querySelector('#pick-shiny').addEventListener('click',  () => { overlay.remove(); _startWith(name, true);  });
        overlay.querySelector('#pick-cancel').addEventListener('click', () => overlay.remove());

      });
    });
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ADVENTURE — selección de camino + ejecución secuencial
  // ═══════════════════════════════════════════════════════════════════════
  adventure() {
    let route, data;
    if (GameState._optionalArea) {
      const area = GameState._optionalArea;
      GameState._optionalArea = null;
      data  = ROUTE_DATA[area];
      route = { name: data?.title ?? 'Ruta Opcional', area };
    } else {
      route = KANTO_ROUTES[GameState.routeIndex];
      data  = ROUTE_DATA[route.area];
    }
    GameState.currentArea  = route.area;
    GameState.autoMode     = true;
    GameState.currentBg    = data?.bg ?? null;
    // Fondo de combate independiente — si la ruta no define combatBg,
    // se reutiliza el fondo de ruta como fallback
    GameState.currentCombatBg = data?.combatBg ?? data?.bg ?? null;

    // Resetear modificadores de combate al empezar ruta nueva
    for (const p of GameState.team) p.combatMods = {};
    // Resetear flags "una vez por ruta" de objetos equipados (p.ej. Baya Zidra)
    resetHeldItemFlags(GameState.team);
    // Re-aplicar efectos pasivos de objetos equipados (p.ej. Pañuelo Eleccion +VEL)
    // ya que combatMods se acaba de resetear por completo
    for (const p of GameState.team) {
      if (p.heldItem) {
        const item = HELD_ITEMS[p.heldItem];
        if (item?.trigger === HELD_ITEM_TRIGGERS.PASSIVE && item.fn) item.fn({ user: p });
      }
    }

    // Pantalla de bienvenida — solo una vez por ruta (p.ej. "Llegas a Ciudad Plateada")
    if (data?.welcome && !GameState.welcomeShown?.[route.area]) {
      GameState.welcomeShown = GameState.welcomeShown ?? {};
      GameState.welcomeShown[route.area] = true;
      Screens._showWelcome(route, data);
      return;
    }

    // Ruta de tipo 'information' — sin caminos ni combates, solo
    // título + descripción + botón "CONTINUAR" hacia la siguiente ruta.
    if (data?.type === 'information') {
      Screens._showInformation(route, data);
      return;
    }

    Screens._renderAdventureShell(route);
    Screens._showPathSelection(route);
  },

  // Pantalla informativa — usa data.title / data.description / data.bg de
  // routes.js (ROUTE_DATA[area] con type:'information'). No tiene caminos
  // ni combates: solo un texto y un botón "CONTINUAR" que avanza a la
  // siguiente ruta (o a la pantalla de victoria si es la última).
  _showInformation(route, data) {
    if (route.area === 'info-final-kanto') Storage.setKantoCompleted();
    const bgLayer = Screens._bgLayer(data.bg, true);

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="position:relative;
        align-items:center;justify-content:center;gap:18px;padding:32px 24px;text-align:center;display:flex;flex-direction:column;">
        ${bgLayer}
        <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:18px;width:100%">
          ${data.title ? `<span style="font-family:var(--font-pixel);font-size:18px;color:var(--white);text-shadow:3px 3px 0 rgba(0,0,0,.3);line-height:1.6">${data.title.toUpperCase()}</span>` : ''}
          ${data.description ? `<p style="text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">${data.description}</p>` : ''}
          <button class="btn btn--primary btn--wide" id="btn-info-continue" style="max-width:240px">CONTINUAR</button>
          ${data.optional ? `<button class="btn btn--wide" id="btn-info-optional" style="max-width:240px">${data.optional.btnName.toUpperCase()}</button>` : ''}
        </div>
      </div>`;

    document.getElementById('btn-info-continue').addEventListener('click', () => {
      GameState.routeIndex++;
      if (GameState.routeIndex >= KANTO_ROUTES.length) {
        const lastBadge = GameState.badges[GameState.badges.length - 1];
        Screens.show(Screens.victory, lastBadge);
      } else {
        Screens._saveRun();
        Screens.show(Screens.adventure);
      }
    });

    document.getElementById('btn-info-optional')?.addEventListener('click', () => {
      GameState._optionalArea = data.optional.area;
      Screens._saveRun();
      Screens.show(Screens.adventure);
    });
  },

  // Pantalla de "llegada" — usa data.welcome (title/subtitle/img) de routes.js.
  // Se muestra una sola vez por ruta, antes de la selección de camino.
  _showWelcome(route, data) {
    const w = data.welcome;
    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:linear-gradient(160deg,var(--green-dark) 0%,var(--green) 100%);
        align-items:center;justify-content:center;gap:18px;padding:32px 24px;text-align:center;display:flex;flex-direction:column;">
        <span style="font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.7);letter-spacing:2px">LLEGADA A</span>
        <span style="font-family:var(--font-pixel);font-size:18px;color:var(--white);text-shadow:3px 3px 0 rgba(0,0,0,.3);line-height:1.6">${(w.title ?? route.name).toUpperCase()}</span>
        ${w.img ? `<img src="${w.img}" style="width:100%;max-width:280px;border:var(--border);border-radius:var(--radius-md);image-rendering:pixelated" onerror="this.style.display='none'">` : ''}
        ${w.subtitle ? `<p style="font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.85);line-height:1.8">${w.subtitle}</p>` : ''}
        <button class="btn btn--primary btn--wide" id="btn-welcome-continue" style="max-width:240px">CONTINUAR</button>
      </div>`;

    document.getElementById('btn-welcome-continue').addEventListener('click', () => {
      Screens._renderAdventureShell(route);
      Screens._showPathSelection(route);
    });
  },

  // Pinta el contenedor vacío de la pantalla de aventura con fondo y botones
  // flotantes (pokédex/compendio). Se llama antes de mostrar la selección de camino
  // y también para restaurar el fondo al volver de un combate.
  _renderAdventureShell(route) {
    const bg = GameState.currentBg;
    const bgLayer = Screens._bgLayer(bg);

    // Botones flotantes arriba-derecha (pokédex + compendio)
    document.getElementById('app').querySelectorAll('.global-dex-btn').forEach(e => e.remove());
    const dexWrap = document.createElement('div');
    dexWrap.className = 'global-dex-btn';
    dexWrap.style.cssText = 'position:fixed;top:12px;right:12px;z-index:1000;display:flex;gap:4px';
    const floatBtnStyle = 'min-height:32px;padding:4px 10px;font-size:10px;background:rgba(255,255,255,.92);border-color:var(--black);box-shadow:var(--shadow-sm)';
    dexWrap.innerHTML = `
      <button class="btn btn--sm" id="btn-dex-route-float"        style="${floatBtnStyle}" title="Pokédex">📖</button>
      <button class="btn btn--sm" id="btn-compendium-route-float" style="${floatBtnStyle}" title="Compendio">📋</button>`;
    document.getElementById('app').appendChild(dexWrap);

    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--adventure">
        ${bgLayer}
        <div class="encounter-area" id="encounter-area">
          <div class="encounter-prompt">Preparando ruta...</div>
        </div>
      </div>`;
  },

  // Renderiza la barra de progreso del camino elegido — bolitas que se van
  // marcando como completadas a medida que avanzas. currentPath / currentEncounter
  // deben estar ya establecidos en GameState.
  _renderPathProgress() {
    const path = GameState.currentPath;
    if (!path || path.length === 0) return '';
    // currentEncounter se incrementa ANTES de lanzar el combate, así que
    // durante el combate del paso N, currentEncounter ya vale N — eso significa
    // que los pasos 0..N-2 están completados, y el paso N-1 es el actual (en curso)
    const completed = Math.max(0, GameState.currentEncounter - 1);

    // Usar los mismos sprites resueltos en la selección de camino
    const resolved = GameState.currentResolvedPath ?? path;

    const iconFor = (enc) => {
      if (enc.type === 'heal') {
        return `<img src="assets/sprites/items/potion.png" style="width:20px;height:20px;image-rendering:pixelated;object-fit:contain" alt="curacion">`;
      }
      if (enc.type === 'leader') {
        if (enc.img) return `<img src="${enc.img}" style="width:20px;height:20px;image-rendering:pixelated;object-fit:contain"
          onerror="this.outerHTML='<span style=font-size:13px>🏆</span>'">`;
        return `<span style="font-size:13px">🏆</span>`;
      }
      if (enc.type === 'trainer' || enc.type === 'special') {
        if (enc.img) return `<img src="${enc.img}" style="width:20px;height:20px;image-rendering:pixelated;object-fit:contain"
          onerror="this.outerHTML='<span style=font-size:13px>❓</span>'">`;
        return `<span style="font-size:13px">❓</span>`;
      }
      return `<img src="assets/sprites/others/grass.png" style="width:20px;height:20px;image-rendering:pixelated" alt="salvaje">`;
    };

    return `
      <div class="path-progress">
        ${path.map((enc, i) => {
          const done    = i < completed;
          const current = i === completed;
          const rEnc = resolved[i] ?? enc;
          return `
            <div class="path-progress__step ${done ? 'path-progress__step--done' : ''} ${current ? 'path-progress__step--current' : ''}">
              <div class="path-progress__icon">${iconFor(rEnc)}</div>
              ${done ? `<div class="path-progress__check">✓</div>` : ''}
            </div>
            ${i < path.length - 1 ? `<div class="path-progress__line ${done ? 'path-progress__line--done' : ''}"></div>` : ''}
          `;
        }).join('')}
      </div>`;
  },

  _initPauseBtn() {},  // no-op — pause solo en combate

  _showPathSelection(route) {
    const data  = ROUTE_DATA[route.area];
    const area  = document.getElementById('encounter-area');
    if (!area || !data) return;

    const paths = generatePaths(route.area);
    GameState.currentPaths = paths;

    // Para cada camino, resolver qué entrenador se usaría (para el tooltip)
    // Usamos pickTrainer para simular cuál aparecería pero sin consumir la semilla real
    const resolvedPaths = paths.map(path =>
      path.map(enc => {
        if (enc.type === 'heal') {
          return { type:'heal', name:'Punto de curación', img:'assets/sprites/items/potion.png' };
        }
        if (enc.type === 'leader') {
          return { type:'leader', name: data.gymLeader ?? 'Lider', img: data.gymLeaderImg ?? null };
        }
        if (enc.type === 'special' && data.specialTrainer) {
          const t = data.specialTrainer;
          return { type:'special', name: t.name, img: t.img ?? null };
        }
        if (enc.type === 'trainer') {
          const t = pickTrainer(data.trainer);
          return { type:'trainer', name: t?.name ?? 'Entrenador', img: t?.img ?? null, _trainer: t };
        }
        return { type:'wild', name:'Pokemon Salvaje', img:'assets/sprites/others/grass.png' };
      })
    );

    const iconFor = (enc) => {
      if (enc.type === 'heal') {
        return `<img src="assets/sprites/items/potion.png" class="path-node-img" alt="curacion">`;
      }
      if (enc.type === 'leader') {
        if (enc.img) return `<img src="${enc.img}" class="path-node-img"
          onerror="this.outerHTML='<span style=font-size:22px>🏆</span>'">`;
        return `<span style="font-size:22px">🏆</span>`;
      }
      if (enc.type === 'trainer' || enc.type === 'special') {
        if (enc.img) return `<img src="${enc.img}" class="path-node-img"
          onerror="this.outerHTML='<span style=font-size:22px>❓</span>'">`;
        return `<span style="font-size:22px">❓</span>`;
      }
      return `<img src="assets/sprites/others/grass.png" class="path-node-img" alt="salvaje">`;
    };

    area.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;width:100%;
        padding:var(--sp-md) var(--sp-md) 0;gap:var(--sp-xs)">

        <h1 style="font-family:var(--font-pixel);color:white;letter-spacing:1px;margin-bottom:1em;text-align:center;
          text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 2px 0 #000">${route.name.toUpperCase()}</h1>
        <div style="font-family:var(--font-pixel);font-size:48px;line-height:1;color:white;
          text-shadow:4px 4px 0 var(--grey-light);user-select:none">?</div>
        <p class="encounter-prompt" style="margin-bottom:4px;color:white;
          text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000">Elige un camino</p>

        <div style="display:flex;flex-direction:column;gap:6px;width:100%">
          ${resolvedPaths.map((path, pi) => `
            <button class="encounter-btn" id="path-${pi}" data-path="${pi}">
              <div class="path-nodes-row">
                ${path.map((enc, ei) => `
                  <div class="path-encounter-cell" data-tooltip="${enc.name}"
                    style="display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;min-width:0;position:relative">
                    ${iconFor(enc)}
                    <div class="path-tooltip">${enc.name}</div>
                  </div>`).join('<span class="path-node-sep">›</span>')}
              </div>
            </button>`).join('')}
        </div>

        <div style="width:100%;height:2px;background:var(--grey-light);border-radius:1px;margin:4px 0"></div>
        <div id="team-bar" style="display:flex;flex-direction:column;gap:4px;width:100%"></div>
      </div>`;

    Screens._renderTeamBar();

    paths.forEach((path, pi) => {
      document.getElementById(`path-${pi}`).addEventListener('click', () => {
        if (GameState.paused) return;
        console.log(`[ADVENTURE] Camino elegido ${pi}: ${path.map(e=>e.type).join(' › ')}`);
        GameState.currentPath         = path;
        GameState.currentResolvedPath = resolvedPaths[pi]; // sprites/iconos resueltos para el progreso
        GameState.currentEncounter    = 0;
        GameState.specialTrainerUsed  = false;  // reset para cada camino elegido
        Screens._runNextInPath();
      });
    });

    document.getElementById('btn-dex-route-float')?.addEventListener('click', () => {
      PokedexScreen.show(() => {
        document.getElementById('app').querySelectorAll('.global-dex-btn').forEach(e => e.remove());
        Screens._renderAdventureShell(route);
        Screens._showPathSelection(route);
      });
    });

    document.getElementById('btn-compendium-route-float')?.addEventListener('click', () => {
      CompendiumScreen.show(() => {
        document.getElementById('app').querySelectorAll('.global-dex-btn').forEach(e => e.remove());
        Screens._renderAdventureShell(route);
        Screens._showPathSelection(route);
      });
    });
  },

  // Ejecuta el siguiente encuentro del camino elegido
  async _runNextInPath() {
    // Guardia contra ejecuciones concurrentes
    if (GameState._pathRunning) {
      console.warn('[ADVENTURE] _runNextInPath llamado mientras ya estaba corriendo — ignorado');
      return;
    }
    GameState._pathRunning = true;

    // Limpiar botón pokédex flotante al entrar en combate
    document.querySelectorAll('.global-dex-btn').forEach(e => e.remove());
    const path = GameState.currentPath;
    const idx  = GameState.currentEncounter;

    if (idx >= path.length) {
      // Camino completado — curar + recompensa
      GameState._pathRunning = false;
      GameState.team.forEach(p => fullHeal(p));
      await Screens._showItemReward();
      return;
    }

    const data  = ROUTE_DATA[GameState.currentArea];
    const routeEntry = KANTO_ROUTES.find(r => r.area === GameState.currentArea);
    const route = { area: GameState.currentArea, name: routeEntry?.name ?? data?.title ?? GameState.currentArea };
    const enc   = path[idx];

    GameState.currentEncounter++;
    console.log(`[ADVENTURE] Encuentro ${GameState.currentEncounter}/3 — tipo: ${enc.type}`);

    if (enc.type === 'heal') {
      // Punto de curación — elegir un pokemon, curar HP al 100% y eliminar
      // su estado alterado, luego continuar el camino sin combate.
      Screens._showHealSelector(() => {
        GameState._pathRunning = false;
        Screens._runNextInPath();
      });
    } else if (enc.type === 'leader') {
      // Combate final del gimnasio — usa gym.leader
      const gym = data.gym;
      if (!gym?.leader) {
        console.error(`[GYM] Ruta "${route.area}" tiene type:'leader' pero no gym.leader definido`);
        GameState._pathRunning = false; Screens._runNextInPath(); return;
      }
      const foeTeam = [];
      for (const p of gym.leader) {
        const foe = await createPokemon(p.name, rollLevel(p), false, p.moveId ?? null, p.overrides ?? null, p.shiny ?? false);
        if (p.img) foe.spriteUrl = p.img;
        if (p.heldItem) equipHeldItem(foe, p.heldItem);
        foeTeam.push(foe);
      }
      Screens.show(Screens.combat, {
        foeTeam,
        isGym: true,
        gymLeaderName: data.gymLeader ?? route.name,
        onWin: () => {
          // Otorgar medalla — al juego y a la pokédex (toda la cadena evolutiva del equipo)
          if (data.badgeId) {
            GameState.badges.push(data.badgeId);
            console.log(`[GYM] Medalla obtenida: ${data.badgeId}`);
            for (const p of GameState.team) Storage.addBadge(p.name, data.badgeId);
          }
          GameState._pathRunning = false;
          Screens._renderAdventureShell(route);
          Screens._runNextInPath();
        },
        onLoss: () => { GameState._pathRunning = false; Screens.show(Screens.defeat); },
      });
    } else if (enc.type === 'trainer' || enc.type === 'special') {
      let trainer;
      if (enc.type === 'special' && data.specialTrainer) {
        // Entrenador especial — aparece exactamente una vez por ruta
        if (GameState.specialTrainerUsed) {
          // Ya apareció en este camino — fallback a entrenador normal
          trainer = pickTrainer(data.trainer);
        } else {
          // Resolver pokemon dinámicos: si pokemon[i].name === 'RIVAL_STARTER',
          // se sustituye por el contra-tipo del starter del jugador
          trainer = {
            ...data.specialTrainer,
            pokemon: data.specialTrainer.pokemon.map(p => {
              if (p.name === 'RIVAL_STARTER')
                return { ...p, name: pickInitialPokemonRival(GameState.starterName) };
              if (p.name === 'RIVAL_STARTER_2')
                return { ...p, name: pickRivalSecondForm(GameState.starterName) };
              if (p.name === 'RIVAL_STARTER_3')
                return { ...p, name: pickRivalThirdForm(GameState.starterName) };
              return p;
            }),
          };
          GameState.specialTrainerUsed = true;
          console.log(`[ADVENTURE] Encuentro especial: ${trainer.name}`);
        }
      } else {
        const resolvedEnc = GameState.currentResolvedPath?.[idx];
        trainer = resolvedEnc?._trainer ?? pickTrainer(data.trainer);
      }
      if (!trainer) { GameState._pathRunning = false; Screens._runNextInPath(); return; }
      const foeTeam = [];
      for (const p of trainer.pokemon) {
        const foe = await createPokemon(p.name, rollLevel(p), false, p.moveId ?? null, p.overrides ?? null, p.shiny ?? false);
        if (p.img) foe.spriteUrl = p.img;
        if (p.heldItem) equipHeldItem(foe, p.heldItem);
        foeTeam.push(foe);
      }
      Screens.show(Screens.combat, {
        foeTeam,
        isTrainer: true,
        trainerName: trainer.name,
        onWin:  () => { GameState._pathRunning = false; Screens._renderAdventureShell(route); Screens._runNextInPath(); },
        onLoss: () => { GameState._pathRunning = false; Screens.show(Screens.defeat); },
      });
    } else {
      // Salvaje — combate automático + captura automática
      const entry   = pickWildEncounter(data.wild);
      const isShiny = entry.shiny === true || Math.random() < (typeof SHINY_RATE !== 'undefined' ? SHINY_RATE : 0);
      const foePoke = await createPokemon(entry.name, rollLevel(entry), false, entry.moveId ?? null, entry.overrides ?? null, isShiny);
      if (entry.img) foePoke.spriteUrl = entry.img;
      if (entry.heldItem) equipHeldItem(foePoke, entry.heldItem);
      Screens.show(Screens.combat, {
        foeTeam:    [foePoke],
        isWild:     true,
        autoCapture: true,   // captura automática post-KO
        onWin:  () => { GameState._pathRunning = false; Screens._renderAdventureShell(route); Screens._runNextInPath(); },
        onLoss: () => { GameState._pathRunning = false; Screens.show(Screens.defeat); },
      });
    }
  },

  _renderTeamBar() {
    document.querySelectorAll('.held-item-tooltip--floating').forEach(el => el.remove());
    const bar = document.getElementById('team-bar');
    if (!bar) return;
    bar.innerHTML = GameState.team.map((p, i) => {
      const autoMove = p.moves.find(m => m.id === p.autoMove) ?? p.moves[0];
      return `
        <div class="route-team-row ${isAlive(p) ? '' : 'route-team-row--fainted'}"
             draggable="true" data-idx="${i}">
          <img src="${p.spriteUrl ?? ''}" class="route-team-row__sprite" alt="${p.displayName}"
            onerror="this.style.opacity=0">
          <div class="route-team-row__info">
            <div style="display:flex;align-items:baseline;gap:6px">
              <span class="route-team-row__name">${p.displayName}${p.shiny ? ' ' + Screens._shinyIcon(10) : ''}</span>
              <span class="route-team-row__level">Nv.${p.level}</span>
            </div>
            <div style="margin-top:4px">${Render.hpBar(p.currentHp, p.stats.hp)}</div>
          </div>
          ${p.heldItem ? (() => {
            const item = HELD_ITEMS[p.heldItem];
            return `
              <div class="held-item-icon" data-idx="${i}" data-item-name="${item.name}" data-item-desc="${item.desc}">
                <img src="${item.img}" alt="${item.name}"
                  onerror="this.outerHTML='<span class=\\'held-item-icon__fallback\\'>${item.fallbackIcon ?? '❓'}</span>'">
              </div>`;
          })() : ''}
          <div style="flex:1"></div>
          ${autoMove ? `<span class="type-badge route-move-badge" data-type="${autoMove.type}">${autoMove.name}</span>` : ''}
          <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-light);flex-shrink:0;cursor:grab;margin-left:4px">⠿</span>
        </div>`;
    }).join('');

    // Click → modal de automovimiento
    bar.querySelectorAll('.route-team-row').forEach(row => {
      row.addEventListener('click', e => {
        if (e.defaultPrevented) return;
        const poke = GameState.team[+row.dataset.idx];
        Screens._showPipMoveModal(poke);
      });
    });

    // Click en el icono de objeto equipado → confirmar si se quiere quitar
    bar.querySelectorAll('.held-item-icon').forEach(icon => {
      icon.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const poke = GameState.team[+icon.dataset.idx];
        Screens._showUnequipItemConfirm(poke);
      });
    });

    // Tooltip de objeto equipado — se añade a document.body con position:fixed
    // para evitar que lo recorte el overflow:hidden de .screen--adventure.
    bar.querySelectorAll('.held-item-icon').forEach(icon => {
      let tooltipEl = null;
      icon.addEventListener('mouseenter', () => {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'held-item-tooltip held-item-tooltip--floating';
        tooltipEl.innerHTML = `<strong>${icon.dataset.itemName}</strong><br>${icon.dataset.itemDesc}`;
        document.body.appendChild(tooltipEl);

        const rect = icon.getBoundingClientRect();
        tooltipEl.style.left = `${rect.right}px`;
        tooltipEl.style.top  = `${rect.top - 6}px`;

        // Si se saldría por la derecha de la pantalla, alinear a la derecha del icono
        const tooltipRect = tooltipEl.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
          tooltipEl.style.left = `${rect.right - tooltipRect.width}px`;
        }
        // Posicionar verticalmente encima del icono
        tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 6}px`;
      });
      icon.addEventListener('mouseleave', () => {
        tooltipEl?.remove();
        tooltipEl = null;
      });
    });

    // Drag and drop reorder
    let dragIdx = null;
    bar.querySelectorAll('.route-team-row').forEach(row => {
      row.addEventListener('dragstart', e => {
        dragIdx = +row.dataset.idx;
        row.style.opacity = '.3';
        e.stopPropagation();
      });
      row.addEventListener('dragend', () => {
        bar.querySelectorAll('.route-team-row').forEach(r => r.style.opacity = '');
        dragIdx = null;
        Screens._renderTeamBar();
      });
      row.addEventListener('dragover', e => { e.preventDefault(); row.style.outline = '2px solid var(--yellow)'; });
      row.addEventListener('dragleave', () => row.style.outline = '');
      row.addEventListener('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        const toIdx = +row.dataset.idx;
        if (dragIdx === null || dragIdx === toIdx) return;
        const tmp = GameState.team[dragIdx];
        GameState.team[dragIdx] = GameState.team[toIdx];
        GameState.team[toIdx]   = tmp;
        console.log(`[UI] Equipo reordenado: pos ${dragIdx} <-> pos ${toIdx}`);
        Screens._renderTeamBar();
      });
    });
    Screens._initTouchSort(bar, '.route-team-row', (from, to) => {
      const tmp = GameState.team[from];
      GameState.team[from] = GameState.team[to];
      GameState.team[to]   = tmp;
      console.log(`[UI] Equipo reordenado (touch): pos ${from} <-> pos ${to}`);
      Screens._renderTeamBar();
    });
  },

  // Modal que aparece al pulsar un pokemon en la barra de ruta: muestra sus
  // movimientos y permite cambiar el automovimiento activo.
  _showPipMoveModal(poke) {
    document.getElementById('pip-modal')?.remove();

    const labels = { atk:'ATK', def:'DEF', spa:'SPA', spd:'SPD', spe:'VEL' };
    const nature = poke.nature;
    const natureLine = nature && (nature.boost || nature.lower)
      ? `<span class="nature-up">+${labels[nature.boost]}</span> / <span class="nature-down">-${labels[nature.lower]}</span>`
      : `<span style="color:var(--grey)">Naturaleza neutra</span>`;

    const moveChangeBlocked = heldItemBlocksMoveChange(poke);
    const blockedItem = moveChangeBlocked ? HELD_ITEMS[poke.heldItem] : null;

    const overlay = Screens._makeModal(`
      <div class="modal-title">${poke.displayName}</div>
      <div style="display:flex;justify-content:center;margin-bottom:4px">
        <img src="${poke.spriteUrl ?? ''}" alt="${poke.displayName}"
          style="width:72px;height:72px;image-rendering:pixelated;object-fit:contain"
          onerror="this.style.opacity=0.2">
      </div>
      <div style="text-align:center;font-family:var(--font-pixel);font-size:7px;margin-bottom:8px">${natureLine}</div>
      ${moveChangeBlocked ? `
        <div style="background:var(--off-white);border-radius:var(--radius-sm);padding:8px 10px;
          border-left:3px solid var(--red);margin-bottom:8px;text-align:center">
          <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark);line-height:1.8">
            ${blockedItem.fallbackIcon ?? ''} ${blockedItem.name} bloquea el cambio de movimiento
          </span>
        </div>` : ''}
      <div style="display:flex;flex-direction:column;gap:6px">
        ${poke.moves.map(m => {
          const effectDesc = getEffectDescriptions(m);
          return `
            <div style="position:relative">
              <button class="btn ${poke.autoMove === m.id ? 'btn--primary' : ''} btn--wide"
                data-moveid="${m.id}" style="justify-content:space-between"
                ${moveChangeBlocked ? 'disabled' : ''}>
                <span>${m.name}</span>
                <span style="opacity:.6;font-size:6px">${m.type.toUpperCase()} · POD:${m.power ?? '—'}</span>
              </button>
              ${effectDesc ? `<div class="move-effect-tooltip">✦ ${effectDesc}</div>` : ''}
            </div>`;
        }).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="pip-modal-close">Cerrar</button>
    `, { id: 'pip-modal', closeOnBackdrop: true });

    overlay.querySelectorAll('[data-moveid]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (moveChangeBlocked) return;
        poke.autoMove = btn.dataset.moveid;
        console.log(`[UI] Automovimiento de ${poke.displayName}: ${poke.autoMove}`);
        overlay.remove();
        Screens._renderTeamBar();
      });
    });

    document.getElementById('pip-modal-close').addEventListener('click', () => overlay.remove());
  },

  // Confirmación al pulsar el icono de objeto equipado — si confirma, el
  // objeto se "destruye" (revierte su efecto pasivo y desaparece para siempre).
  // Si el item tiene canChange:true, ofrece además la opción de cambiarlo de pokemon.
  _showUnequipItemConfirm(poke) {
    const item = HELD_ITEMS[poke.heldItem];
    if (!item) return;

    document.getElementById('unequip-modal')?.remove();
    const overlay = Screens._makeModal(`
      <div class="modal-title">${item.name}</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);text-align:center;line-height:1.8">
        ${item.desc}
      </p>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);text-align:center;line-height:1.8">
        ¿Qué quieres hacer con este objeto?<br>
        <span style="color:var(--red)">Quitar lo destruirá</span> para siempre.
      </p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${item.canChange && GameState.team.length > 1 ? `<button class="btn btn--primary" id="unequip-swap">Cambiar de Pokémon</button>` : ''}
        <button class="btn btn--primary" id="unequip-confirm" style="background:var(--red)">Quitar objeto</button>
        <button class="btn btn--ghost" id="unequip-cancel">Cancelar</button>
      </div>
    `, { id: 'unequip-modal', closeOnBackdrop: true });

    document.getElementById('unequip-confirm').addEventListener('click', () => {
      unequipHeldItem(poke);
      overlay.remove();
      Screens._renderTeamBar();
    });
    document.getElementById('unequip-cancel').addEventListener('click', () => overlay.remove());
    document.getElementById('unequip-swap')?.addEventListener('click', () => {
      overlay.remove();
      Screens._showSwapItemModal(poke);
    });
  },

  // Modal para mover el objeto equipado de `poke` a otro pokemon del equipo.
  // Si el destino lleva un item con canChange:true, se intercambian.
  // Si el destino lleva un item con canChange:false, aparece deshabilitado.
  _showSwapItemModal(poke) {
    const item = HELD_ITEMS[poke.heldItem];
    if (!item) return;

    document.getElementById('swap-item-modal')?.remove();

    const others = GameState.team
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p !== poke);

    const teamRows = others.map(({ p, i }) => {
      const targetItem = p.heldItem ? HELD_ITEMS[p.heldItem] : null;
      const disabled = !!(targetItem && !targetItem.canChange);
      const itemLabel = targetItem
        ? `<span style="font-family:var(--font-pixel);font-size:6px;color:${disabled ? 'var(--red)' : 'var(--grey)'}">
             ${targetItem.name}${disabled ? ' (no transferible)' : ''}
           </span>`
        : `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">Sin objeto</span>`;
      return Screens._teamBtn(p, i, itemLabel, disabled);
    }).join('');

    const overlay = Screens._makeModal(`
      <div class="modal-title">Dar ${item.name} a...</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin:12px 0">
        ${teamRows}
      </div>
      <button class="btn btn--ghost btn--wide" id="swap-item-cancel">Cancelar</button>
    `, { id: 'swap-item-modal', closeOnBackdrop: true });

    document.getElementById('swap-item-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelectorAll('button[data-idx]:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = GameState.team[+btn.dataset.idx];
        if (!target) return;

        const sourceId = poke.heldItem;
        const targetId = target.heldItem ?? null;

        unequipHeldItem(poke);
        if (targetId) unequipHeldItem(target);

        equipHeldItem(target, sourceId);
        if (targetId) equipHeldItem(poke, targetId);

        overlay.remove();
        Screens._renderTeamBar();
      });
    });
  },

  // Pantalla de recompensa al completar un camino. Presenta 3 premios (pokemon,
  // objeto, MT, vitaminas o caramelo) y aplica el elegido al equipo.
  async _showItemReward() {
    const data  = ROUTE_DATA[GameState.currentArea];
    const routeEntry = KANTO_ROUTES.find(r => r.area === GameState.currentArea);
    const route = { area: GameState.currentArea, name: routeEntry?.name ?? data?.title ?? GameState.currentArea };
    const REWARD_BG = "url('assets/bg/price.png') center/cover no-repeat";

    const maxLevel = Math.max(...GameState.team.map(p => p.level));

    // ── Helpers ───────────────────────────────────────────────────────────────
    const tmEligible = (tmId) => !!TM_LIST[tmId];
    const makeTmPrize = (tmId) => {
      const tm = TM_LIST[tmId];
      const move = MOVE_BY_ID[tm.moveId];
      return {
        id: tmId,
        icon: `<img src="${tm.sprite}" style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain"
                 onerror="this.outerHTML='<span style=font-size:32px>${tm.fallbackIcon}</span>'">`,
        name: tm.name,
        desc: `${tm.desc}${move ? ` · ${move.name} (Poder: ${move.power})` : ''}`,
        type: 'tm',
        tmId,
      };
    };

    // ── Slot fijo: Pokemon ────────────────────────────────────────────────────
    let rewardPoke = null;
    let pokemonPrize = null;
    if (data.rewardPokemon?.length) {
      const rewardName = data.rewardPokemon[Math.floor(Math.random() * data.rewardPokemon.length)];
      rewardPoke = await createPokemon(rewardName, maxLevel, true);
      Storage.markCaught(rewardPoke.name);
      pokemonPrize = {
        id: 'pokemon',
        icon: `<img src="${rewardPoke.spriteUrl ?? ''}" style="width:52px;height:52px;image-rendering:pixelated;object-fit:contain" onerror="this.style.opacity=0">`,
        name: rewardPoke.displayName,
        desc: `Nv.${rewardPoke.level} · ${rewardPoke.types.join('/')}`,
        type: 'pokemon',
      };
    }

    // ── Slot fijo: Objeto equipable (1 elegido al azar de rewardExtras) ───────
    let itemPrize = null;
    if (data.rewardExtras?.length) {
      const itemId = data.rewardExtras[Math.floor(Math.random() * data.rewardExtras.length)];
      const item = HELD_ITEMS[itemId];
      if (item) {
        itemPrize = {
          id: `held-${itemId}`,
          icon: `<img src="${item.img}" style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain"
            onerror="this.outerHTML='<span style=font-size:32px>${item.fallbackIcon ?? '❓'}</span>'">`,
          name: item.name,
          desc: item.desc,
          type: 'held-item',
          itemId,
        };
      }
    }

    // ── Slot fijo: MT de la ruta (1 elegida al azar de rewardTMs) ────────────
    let routeTmPrize = null;
    if (data.rewardTMs?.length) {
      const eligible = data.rewardTMs.filter(tmEligible).map(makeTmPrize);
      if (eligible.length > 0)
        routeTmPrize = eligible[Math.floor(Math.random() * eligible.length)];
    }

    // ── Pool aleatorio: vitaminas + candy + 1 MT del pool global ─────────────
    const vitaminas = [
      { id:'mas-ps',        icon:'<img src="assets/sprites/items/ps.png"       style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">', name:'Más PS',        stat:'hp'  },
      { id:'proteina',      icon:'<img src="assets/sprites/items/proteina.png" style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">', name:'Proteína',      stat:'atk' },
      { id:'hierro',        icon:'<img src="assets/sprites/items/hierro.png"   style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">', name:'Hierro',        stat:'def' },
      { id:'calcio',        icon:'<img src="assets/sprites/items/calcio.png"   style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">', name:'Calcio',        stat:'spa' },
      { id:'zinc',          icon:'<img src="assets/sprites/items/zinc.png"     style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">', name:'Zinc',          stat:'spd' },
      { id:'carbohidratos', icon:'<img src="assets/sprites/items/carbo.png"    style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">', name:'Carbohidratos', stat:'spe' },
    ];
    const vitaminaChoice = vitaminas[Math.floor(Math.random() * vitaminas.length)];
    const candyIcon = '<img src="assets/sprites/items/rarecandy.png" style="width:40px;height:40px;image-rendering:pixelated;object-fit:contain">';

    const vitaminaChoice2 = vitaminas.filter(v => v.id !== vitaminaChoice.id)[Math.floor(Math.random() * (vitaminas.length - 1))];
    const randomPool = [
      {
        id: vitaminaChoice.id,
        icon: vitaminaChoice.icon,
        name: vitaminaChoice.name,
        desc: `+1 EV ${vitaminaChoice.stat.toUpperCase()} permanente`,
        type: 'ev-stat',
        stat: vitaminaChoice.stat,
      },
      {
        id: 'rare-candy',
        icon: candyIcon,
        name: 'Carameloraro',
        desc: '+1 nivel a todo el equipo',
        type: 'candy',
      },
      {
        id: vitaminaChoice2.id,
        icon: vitaminaChoice2.icon,
        name: vitaminaChoice2.name,
        desc: `+1 EV ${vitaminaChoice2.stat.toUpperCase()} permanente`,
        type: 'ev-stat',
        stat: vitaminaChoice2.stat,
      },
    ];

    // Añadir 1 MT del pool global (excluyendo la MT fija de ruta si ya hay una)
    const usedTmId = routeTmPrize?.tmId;
    const globalEligible = Object.keys(TM_LIST)
      .filter(id => id !== usedTmId && tmEligible(id))
      .map(makeTmPrize);
    if (globalEligible.length > 0)
      randomPool.push(globalEligible[Math.floor(Math.random() * globalEligible.length)]);

    // ── Construir los 3 premios finales ───────────────────────────────────────
    // Si las 3 listas fijas están definidas → 1 de cada, sin pool aleatorio.
    // Si falta alguna → los slots restantes se rellenan del pool aleatorio.
    const fixedPrizes = [pokemonPrize, itemPrize, routeTmPrize].filter(Boolean);
    const slotsNeeded = 3 - fixedPrizes.length;
    let prizes;
    if (slotsNeeded <= 0) {
      prizes = fixedPrizes;
    } else {
      const shuffled = randomPool
        .map(p => ({ p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, slotsNeeded)
        .map(({ p }) => p);
      prizes = [...fixedPrizes, ...shuffled];
    }
    prizes = prizes
      .map(p => ({ p, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ p }) => p);

    let _advanced = false;
    const advance = () => {
      if (_advanced) return;
      _advanced = true;
      GameState.routeIndex++;
      if (GameState.routeIndex >= KANTO_ROUTES.length) {
        const lastBadge = GameState.badges[GameState.badges.length - 1];
        Screens.show(Screens.victory, lastBadge);
      } else {
        Screens._saveRun();
        Screens.show(Screens.adventure);
      }
    };

    // Botones flotantes pokédex / compendio (mismo patrón que _renderAdventureShell)
    document.getElementById('app').querySelectorAll('.global-dex-btn').forEach(e => e.remove());
    const rewardDexWrap = document.createElement('div');
    rewardDexWrap.className = 'global-dex-btn';
    rewardDexWrap.style.cssText = 'position:fixed;top:12px;right:12px;z-index:1000;display:flex;gap:4px';
    const _rBtnStyle = 'min-height:32px;padding:4px 10px;font-size:10px;background:rgba(255,255,255,.92);border-color:var(--black);box-shadow:var(--shadow-sm)';
    rewardDexWrap.innerHTML = `
      <button class="btn btn--sm" id="btn-dex-reward"        style="${_rBtnStyle}" title="Pokédex">📖</button>
      <button class="btn btn--sm" id="btn-compendium-reward" style="${_rBtnStyle}" title="Compendio">📋</button>`;
    document.getElementById('app').appendChild(rewardDexWrap);

    const _renderReward = () => {
      document.getElementById('viewport').innerHTML = `
        <div class="screen" style="background:${REWARD_BG};
          align-items:center;justify-content:center;gap:20px;padding:32px 24px;text-align:center;display:flex;flex-direction:column;">
          <span style="font-family:var(--font-pixel);font-size:8px;color:rgba(255,255,255,.7);letter-spacing:2px">COMPLETADA</span>
          <span style="font-family:var(--font-pixel);font-size:16px;color:var(--white);text-shadow:3px 3px 0 rgba(0,0,0,.3);line-height:1.6">${route.name.toUpperCase()}</span>
          <span style="font-family:var(--font-pixel);font-size:8px;color:var(--yellow)">Elige una recompensa:</span>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:340px">
            ${prizes.map(p => `
              <div class="item-card" data-prize="${p.id}" data-desc="${p.desc}">
                <div class="item-card__icon">${p.icon}</div>
                <div class="item-card__name">${p.name}</div>
              </div>`).join('')}
          </div>
          <button id="reward-skip" class="btn btn--wide"
            style="max-width:340px;width:100%;background:var(--white);border:var(--border);box-shadow:var(--shadow-sm)">
            CONTINUAR
          </button>
        </div>`;

      document.getElementById('reward-skip').addEventListener('click', advance);

      document.querySelectorAll('.item-card').forEach(el => {
        let tipEl = null;
        el.addEventListener('mouseenter', () => {
          tipEl = document.createElement('div');
          tipEl.className = 'held-item-tooltip held-item-tooltip--floating';
          tipEl.textContent = el.dataset.desc;
          document.body.appendChild(tipEl);
          const rect = el.getBoundingClientRect();
          tipEl.style.left = `${rect.left}px`;
          tipEl.style.top  = `${rect.top - tipEl.offsetHeight - 6}px`;
          if (parseFloat(tipEl.style.top) < 4) tipEl.style.top = `${rect.bottom + 6}px`;
        });
        el.addEventListener('mouseleave', () => { tipEl?.remove(); tipEl = null; });

        el.addEventListener('click', async () => {
          const prizeId = el.dataset.prize;
          const chosen  = prizes.find(p => p.id === prizeId);
          console.log(`[ADVENTURE] Premio elegido: ${chosen.name}`);

          if (chosen.type === 'pokemon') {
            if (GameState.team.length < 6) {
              GameState.team.push(rewardPoke);
              advance();
            } else {
              Screens._showPokemonSwapSelector(rewardPoke, advance, null);
            }
          } else if (chosen.type === 'ev-stat') {
            Screens._showEvItemSelector(chosen, advance);
          } else if (chosen.type === 'candy') {
            for (const p of GameState.team) levelUpPokemon(p, 1);
            for (let i = 0; i < GameState.team.length; i++) {
              const p = GameState.team[i];
              if (p._pendingEvolution) {
                const intoName = p._pendingEvolution;
                delete p._pendingEvolution;
                try {
                  const evolved = await evolve(p, intoName);
                  GameState.team[i] = evolved;
                  if (p === GameState.starter) GameState.starter = evolved;
                  Storage.markCaught(evolved.name);
                } catch (e) {
                  console.error('[EVOLUCION] Error en caramelo:', e.message);
                }
              }
            }
            GameState.team.forEach(p => fullHeal(p));
            advance();
          } else if (chosen.type === 'held-item') {
            Screens._showHeldItemSelector(chosen, advance);
          } else if (chosen.type === 'tm') {
            Screens._showTMSelector(chosen, advance);
          }
        });
      });
    };

    _renderReward();

    document.getElementById('btn-dex-reward')?.addEventListener('click', () => {
      PokedexScreen.show(() => _renderReward());
    });
    document.getElementById('btn-compendium-reward')?.addEventListener('click', () => {
      CompendiumScreen.show(() => _renderReward());
    });
  },

  // Selector para sustituir un pokemon cuando el equipo está lleno.
  // Se usa al capturar o recibir un pokemon de premio con 6 slots ocupados.
  _showPokemonSwapSelector(newPoke, onDone, onCancel = onDone) {
    const overlay = Screens._makeModal(`
      <div class="modal-title">Equipo completo</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8">
        Elige un pokemon para sustituir por<br>
        <strong>${newPoke.displayName}</strong> Nv.${newPoke.level}
      </p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${GameState.team.map((p, i) => Screens._teamBtn(p, i,
          `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">Nv.${p.level}</span>`
        )).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="swap-cancel">Cancelar</button>
    `);

    overlay.querySelectorAll('[data-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.dataset.idx;
        console.log(`[ADVENTURE] Sustituido: ${GameState.team[idx].displayName} → ${newPoke.displayName}`);
        GameState.team[idx] = newPoke;
        overlay.remove();
        onDone();
      });
    });

    document.getElementById('swap-cancel').addEventListener('click', () => {
      overlay.remove();
      onCancel?.();
    });
  },

  // Selector de pokemon para vitaminas (premios de EV).
  _showEvItemSelector(item, onDone) {
    const overlay = Screens._makeModal(`
      <div class="modal-title">${item.icon} ${item.name}</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8">
        Elige un pokemon para aumentar su ${item.stat.toUpperCase()}
      </p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${GameState.team.map((p, i) => {
          const evs = Storage.getEvs(p.name);
          return Screens._teamBtn(p, i,
            `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--blue)">${item.stat.toUpperCase()}: ${p.stats[item.stat]} (+${evs[item.stat] ?? 0} EV)</span>`
          );
        }).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="ev-cancel">Cancelar</button>
    `);

    overlay.querySelectorAll('[data-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = GameState.team[+btn.dataset.idx];
        // Guardar EV en Storage y aplicar al pokemon
        const newEvs = Storage.addEv(p.name, item.stat, 4);
        p.evs[item.stat] = newEvs[item.stat];
        p.stats = computeStats(p);
        console.log(`[ITEM] ${item.name} → ${p.displayName} +4 EV ${item.stat}`);
        overlay.remove();
        onDone();
      });
    });

    document.getElementById('ev-cancel').addEventListener('click', () => {
      overlay.remove();
    });
  },

  // Selector de pokemon para equipar un objeto (premio de fin de ruta).
  // Si el pokemon elegido ya lleva un objeto, este se sustituye (el anterior
  // se "pierde" — equipHeldItem revierte su efecto pasivo automáticamente).
  _showHeldItemSelector(item, onDone) {
    const heldItem = HELD_ITEMS[item.itemId];
    const overlay = Screens._makeModal(`
      <div class="modal-title">${item.icon} ${item.name}</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8">
        ${item.desc}
      </p>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8">
        Elige un pokemon para equipar este objeto
      </p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${GameState.team.map((p, i) => {
          const compatible = !heldItem.canEquip || heldItem.canEquip(p);
          const current = p.heldItem ? HELD_ITEMS[p.heldItem] : null;
          const extra = !compatible
            ? `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">No compatible</span>`
            : current ? `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--red)">Sustituye: ${current.name}</span>` : '';
          return Screens._teamBtn(p, i, extra, !compatible);
        }).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="held-item-cancel">Cancelar</button>
    `);

    overlay.querySelectorAll('[data-idx]:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = GameState.team[+btn.dataset.idx];
        equipHeldItem(p, item.itemId);
        Storage.markItemCollected(item.itemId);
        console.log(`[ITEM] ${heldItem.name} → ${p.displayName}`);
        overlay.remove();
        onDone();
      });
    });

    document.getElementById('held-item-cancel').addEventListener('click', () => {
      overlay.remove();
    });
  },

  // Selector de pokemon para enseñar una MT. Los pokemon incompatibles o que ya
  // conocen el movimiento aparecen deshabilitados. Cancelar no avanza la ruta.
  _showTMSelector(item, onDone) {
    const tm   = TM_LIST[item.tmId];
    const move = MOVE_BY_ID[tm.moveId];
    const overlay = Screens._makeModal(`
      <div class="modal-title">${item.icon} ${item.name}</div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8">
        Elige un pokemon para enseñar <strong>${move?.name ?? tm.moveId}</strong>
      </p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${GameState.team.map((p, i) => {
          const compatible   = canLearnTM(p, item.tmId);
          const alreadyKnows = p.moves.some(m => m.id === tm.moveId);
          const disabled = !compatible || alreadyKnows;
          return Screens._teamBtn(p, i,
            `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">${alreadyKnows ? 'Ya conoce' : (!compatible ? 'No compatible' : '')}</span>`,
            disabled
          );
        }).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="tm-cancel">Cancelar</button>
    `);

    overlay.querySelectorAll('[data-idx]:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = GameState.team[+btn.dataset.idx];
        teachTM(p, item.tmId);
        overlay.remove();
        onDone();
      });
    });

    document.getElementById('tm-cancel').addEventListener('click', () => {
      overlay.remove();
    });
  },

  // Selector de pokemon para un punto de curación del camino (type:'heal').
  // Cura el HP al 100% y elimina el estado alterado del elegido.
  _showHealSelector(onDone) {
    const overlay = Screens._makeModal(`
      <div class="modal-title">
        <img src="assets/sprites/items/potion.png" style="width:20px;height:20px;image-rendering:pixelated;vertical-align:middle;margin-right:4px">
        Punto de curación
      </div>
      <p style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);text-align:center;line-height:1.8">
        Elige un pokemon para curar su HP al 100%<br>y eliminar su estado alterado
      </p>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${GameState.team.map((p, i) => {
          const statusBadge = (typeof StatusEffects !== 'undefined' && p.statusEffect)
            ? StatusEffects.badge(p)
            : '';
          return Screens._teamBtn(p, i,
            `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">${p.currentHp}/${p.stats.hp}</span>${statusBadge}`
          );
        }).join('')}
      </div>
      <button class="btn btn--ghost btn--wide" id="heal-cancel">No curar a nadie</button>
    `);

    overlay.querySelectorAll('[data-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = GameState.team[+btn.dataset.idx];
        healPokemon(p);
        console.log(`[ITEM] Punto de curación → ${p.displayName} curado al 100% (HP y estado)`);
        overlay.remove();
        onDone();
      });
    });

    document.getElementById('heal-cancel').addEventListener('click', () => {
      overlay.remove();
      onDone(); // continua sin curar a nadie
    });
  },

  // ═══════════════════════════════════════════════════════════════════════
  // COMBAT
  // ═══════════════════════════════════════════════════════════════════════
  combat(options) {
    const { foeTeam, isWild = false, isTrainer = false, isGym = false, gymLeaderName, trainerName, onWin, onLoss } = options;

    GameState.combat = {
      foeTeam,
      foeIndex:    0,
      isWild, isTrainer, isGym, gymLeaderName, trainerName,
      onWin, onLoss,
      chosenMove:  null,
      lastFoeObj:  null,
      animating:   false,
      introPlayed: false,  // si ya mostramos la animación de intro
    };

    Screens._renderCombatScreen();
  },

  _renderCombatScreen() {
    const ctx    = GameState.combat;
    const foe    = ctx.foeTeam[ctx.foeIndex];
    const player = ctx.activePlayer ?? GameState.team.find(p => isAlive(p)) ?? GameState.team[0];

    const introText = ctx.isGym
      ? `El lider ${ctx.gymLeaderName}\nquiere combatir!`
      : ctx.isTrainer
      ? `!${ctx.trainerName ?? 'Entrenador'}\nquiere combatir!`
      : `Un ${foe.displayName}\nsalvaje aparecio!`;

    console.log(`[COMBAT] ${introText.replace('\n',' ')}`);

    const routeData = ROUTE_DATA[GameState.currentArea];
    const bg      = GameState.currentCombatBg;
    const bgPos   = routeData?.combatBgPosition ?? 'center';
    const bgSize  = routeData?.combatBgSize ?? 'cover'; // p.ej. '130%' para zoom y poder mover
    const fieldBg = bg
      ? `background-image:url('${bg}');background-size:${bgSize};background-position:${bgPos};`
      : `background:linear-gradient(180deg,#87CEEB 0%,#87CEEB 55%,#8DB870 55%,#6A9B50 100%);`;

    const trainerBar = (ctx.isTrainer || ctx.isGym) ? (() => {
      const trainerName = ctx.isGym ? ctx.gymLeaderName : (ctx.trainerName ?? 'Entrenador');
      const balls = ctx.foeTeam.map(p => {
        const cls = p.currentHp <= 0 ? 'fainted' : 'alive';
        return `<span class="trainer-ball trainer-ball--${cls}">⬤</span>`;
      }).join('');
      return `
        <div class="trainer-bar" id="trainer-bar">
          <span class="trainer-bar__name">${trainerName}</span>
          <div class="trainer-bar__balls">${balls}</div>
        </div>`;
    })() : '';

    // Si es la primera vez que mostramos este foe, el HUD y sprite entran animados
    const isFirstRender = !ctx.introPlayed;
    const foeHudClass   = isFirstRender ? 'combat-hud--foe-enter' : '';
    const foeSpriteClass= isFirstRender ? 'combat-sprite--foe-enter' : '';

    // El texto de intro ("X quiere combatir!") solo se muestra una vez,
    // al inicio del combate completo — no en cada cambio de pokemon del rival
    const showIntroText = isFirstRender && ctx.foeIndex === 0;

    // Marcar el foe como visto la primera vez que aparece
    if (isFirstRender) Storage.markSeen(foe.name);

    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--combat">

        <!-- Campo de batalla -->
        <div class="combat-field" style="${fieldBg}" id="combat-field">
          ${trainerBar}

          <!-- Intro text overlay — solo en la primera aparición del combate -->
          ${showIntroText ? `
            <div class="combat-intro-text" id="intro-overlay">
              ${introText.split('\n').join('<br>')}
            </div>` : ''}

          <!-- HUD foe — oculto hasta que pase el intro -->
          <div class="combat-hud combat-hud--foe ${foeHudClass}" id="hud-foe"
            style="${isFirstRender ? 'opacity:0' : ''}">
            <div class="combat-hud__name" style="position:relative">
              <span>${foe.displayName.toUpperCase()}</span>
              <span class="combat-hud__level">Nv.${foe.level}</span>
            </div>
            <div class="combat-hud__hp-label">HP</div>
            <div style="display:flex;align-items:center;gap:5px">
              <div style="flex:1">${Render.hpBar(foe.currentHp, foe.stats.hp)}</div>
              ${Storage.isCaught(foe.name) ? `
                <span class="combat-hud__caught-dot" title="Ya capturado"></span>
              ` : ''}
            </div>
          </div>

          <!-- Sprite foe — oculto hasta que pase el intro -->
          <div class="combat-foe" id="combat-foe-wrap" style="${isFirstRender ? 'opacity:0' : ''}">
            <img src="${foe.spriteUrl ?? ''}" alt="${foe.displayName}"
              class="combat-sprite combat-sprite--foe ${foeSpriteClass}" id="sprite-foe"
              onerror="this.style.opacity=0.2">
          </div>

          <!-- Sprite player — siempre visible -->
          <div class="combat-player">
            <img src="${player.backSpriteUrl ?? player.spriteUrl ?? ''}" alt="${player.displayName}"
              class="combat-sprite combat-sprite--player" id="sprite-player"
              onerror="this.style.opacity=0.2">
          </div>

          <!-- HUD player — siempre visible -->
          <div class="combat-hud combat-hud--player" id="hud-player">
            <div class="combat-hud__name" style="position:relative">
              <span>${player.displayName.toUpperCase()}</span>
              <span class="combat-hud__level">Nv.${player.level}</span>
            </div>
            <div class="combat-hud__hp-label">HP</div>
            ${Render.hpBar(player.currentHp, player.stats.hp)}
            <div class="combat-hud__hp-nums" id="hp-nums-player">${player.currentHp}/${player.stats.hp}</div>
          </div>
        </div>

        <!-- Log -->
        <div class="combat-log" id="combat-log">
          <span class="combat-log__text" id="log-text"></span>
        </div>

        <!-- Progreso del camino elegido — incluye el combate del líder de gimnasio -->
        ${Screens._renderPathProgress()}

        <!-- Accion activa -->
        <div id="combat-actions-area"></div>

        <!-- Mini equipo -->
        <div class="combat-team-bar" id="combat-team-bar">
          ${GameState.team.map(p => Screens._pipHtml(p, player)).join('')}
        </div>
      </div>`;

    // Init pause button
    Screens._setupCombatPauseBtn();

    // Badges de estado inmediatas: quemado/veneno/etc. visibles desde el primer frame
    Screens._updateStatusBadges(player, foe);

    if (isFirstRender) {
      // Si hay overlay de texto, esperar a que termine (~1400ms). Si no
      // (cambio de pokemon del rival a mitad de combate), delay corto.
      ctx.introPlayed = true;
      const introDelay = showIntroText ? 1400 : 200;
      setTimeout(() => {
        const hudFoe  = document.getElementById('hud-foe');
        const foeWrap = document.getElementById('combat-foe-wrap');
        if (hudFoe)  { hudFoe.style.opacity  = '1'; hudFoe.classList.add('combat-hud--foe-enter');  }
        if (foeWrap) { foeWrap.style.opacity = '1'; foeWrap.querySelector('img')?.classList.add('combat-sprite--foe-enter'); }
        // Iniciar el turno tras la animación de entrada del foe (~500ms más)
        setTimeout(() => Screens._combatStartTurn(), 600);
      }, introDelay);
    } else {
      Screens._combatStartTurn();
    }
  },

  // Helper separado para el botón de pausa (evita duplicar código)
  _setupCombatPauseBtn() {

    // Botones de combate — se insertan en el gear-panel antes del botón ✕ (último hijo)
    document.querySelectorAll('.global-pause-btn').forEach(e => e.remove());
    const gearPanel = document.getElementById('gear-panel');
    const btnStyle = 'font-size:14px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.6);padding:6px 8px;border-radius:6px;cursor:pointer;line-height:1';
    const pauseWrap = document.createElement('div');
    pauseWrap.className = 'global-pause-btn';
    pauseWrap.style.cssText = 'display:contents';
    pauseWrap.innerHTML = `
      <button id="btn-dex-combat"        style="${btnStyle}" title="Pokédex">📖</button>
      <button id="btn-compendium-combat" style="${btnStyle}" title="Compendio">📋</button>
      <button id="btn-pause-combat"      style="${btnStyle}" title="Pausar/Reanudar">⏸</button>`;
    if (gearPanel) {
      gearPanel.insertBefore(pauseWrap, gearPanel.children[1]);
    } else {
      document.body.appendChild(pauseWrap);
    }

    pauseWrap.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,0,0,.6)');
      btn.addEventListener('mouseleave', () => {
        if (btn.id === 'btn-pause-combat' && GameState.paused) return;
        btn.style.background = 'rgba(0,0,0,.35)';
      });
    });

    document.getElementById('btn-dex-combat').addEventListener('click', () => {
      GameState.paused = true;
      PokedexScreen.show(() => {
        Screens._renderCombatScreen();
        GameState.paused = false;
        const ctx = GameState.combat;
        if (!ctx._turnRunning && !ctx._ending) {
          Screens._combatStartTurn();
        }
      });
    });

    document.getElementById('btn-compendium-combat').addEventListener('click', () => {
      GameState.paused = true;
      CompendiumScreen.show(() => {
        Screens._renderCombatScreen();
        GameState.paused = false;
        const ctx = GameState.combat;
        if (!ctx._turnRunning && !ctx._ending) {
          Screens._combatStartTurn();
        }
      });
    });

    const pauseBtn = document.getElementById('btn-pause-combat');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        GameState.paused = !GameState.paused;
        pauseBtn.textContent = GameState.paused ? '▶' : '⏸';
        pauseBtn.style.background = GameState.paused ? 'rgba(200,160,0,.7)' : 'rgba(0,0,0,.35)';
        pauseBtn.style.color = GameState.paused ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.6)';
        console.log(`[UI] Combate ${GameState.paused ? 'pausado' : 'reanudado'}`);
      });
    }

  },

  // Muestra un indicador visual de cambio de stat en el HUD correspondiente
  // hudId: 'hud-foe' | 'hud-player'
  // label: 'ATK', 'DEF', etc.
  // direction: 'up' | 'down'
  // pct: 10 | 20 | 25 ...
  // pokemon: el combatiente afectado (user o target del efecto) — se determina
  // dinámicamente si su HUD es 'hud-player' o 'hud-foe' comparándolo con el
  // pokemon activo del jugador, para que la animación aparezca siempre sobre
  // el HUD correcto sin importar si el efecto lo lanza el jugador o el rival.
  _showStatChange(pokemon, label, direction, pct) {
    const ctx = GameState.combat;
    const hudId = pokemon === ctx.activePlayer ? 'hud-player' : 'hud-foe';
    const hud = document.getElementById(hudId);
    if (!hud) return;
    // Quitar indicadores anteriores del mismo hud
    hud.querySelectorAll('.stat-change').forEach(e => e.remove());
    const el = document.createElement('span');
    el.className = `stat-change stat-change--${direction}`;
    el.textContent = `${label} ${direction === 'up' ? '+' : '-'}${pct}%`;
    // Insertar en el nombre del hud (position:relative)
    const nameRow = hud.querySelector('.combat-hud__name');
    if (nameRow) nameRow.appendChild(el);
    // Auto-remove tras la animación
    setTimeout(() => el.remove(), 2500);
  },

  _combatStartTurn() {
    const ctx = GameState.combat;
    const foe = ctx.foeTeam[ctx.foeIndex];

    // Inicializar activePlayer con el primero vivo del equipo
    if (!ctx.activePlayer) {
      ctx.activePlayer = GameState.team.find(p => isAlive(p)) ?? GameState.team[0];
    }

    // Si el activo esta caido, buscar sustituto
    if (!isAlive(ctx.activePlayer)) {
      const next = GameState.team.find(p => isAlive(p) && p !== ctx.activePlayer);
      if (!next) {
        Screens._clearPauseBtn(); ctx.onLoss();
        return;
      }
      Screens._updateCombatLog(`${ctx.activePlayer.displayName} no puede mas! Vamos, ${next.displayName}!`);
      ctx.activePlayer = next;
      ctx.chosenMove   = null;
      // Re-render pantalla para mostrar el nuevo sprite del jugador
      setTimeout(() => {
        Screens._renderCombatScreen();
        Screens._combatStartTurn();
      }, 1200);
      return;
    }

    const active = ctx.activePlayer;

    const autoMove = active.moves.find(m => m.id === active.autoMove)
      ?? active.moves[0];
    ctx.chosenMove = autoMove;

    // Mostrar el movimiento activo como botón informativo
    const area = document.getElementById('combat-actions-area');
    if (area && autoMove) {
      area.innerHTML = `
        <div style="padding:6px var(--sp-md)">
          <div class="move-btn move-btn--display" data-type="${autoMove.type}" style="cursor:default;opacity:.9">
            <span class="move-btn__name">${autoMove.name}</span>
            <span class="move-btn__meta">
              <span class="type-badge" data-type="${autoMove.type}" style="font-size:5px;padding:2px 4px">${autoMove.type}</span>
              <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark)">POD: ${autoMove.power ?? '—'}</span>
            </span>
          </div>
        </div>`;
    }

    setTimeout(() => Screens._executeCombatTurn(active, foe), 900);
  },

  async _executeCombatTurn(player, foe) {
    const ctx = GameState.combat;

    // Guardia: si el combate ya terminó o hay un turno en curso, ignorar
    if (ctx._ending || ctx._turnRunning) {
      console.warn('[COMBAT] _executeCombatTurn ignorado — combate terminando o turno ya en curso');
      return;
    }
    ctx._turnRunning = true;

    const logFn = (txt) => Screens._updateCombatLog(txt);

    // Validar que chosenMove pertenece realmente al jugador activo
    const playerMove = player.moves.find(m => m.id === ctx.chosenMove?.id)
      ?? player.moves.find(m => m.id === player.autoMove)
      ?? player.moves[0];

    if (!playerMove) {
      console.error('[COMBAT] Jugador sin movimiento válido:', player.displayName, player.moves);
      ctx._turnRunning = false;
      Screens._combatStartTurn();
      return;
    }

    // Movimiento del rival — calculado fresco cada turno, solo de sus propios moves
    const foeMove = enemyChooseMove(foe, player);
    if (!foeMove) {
      console.error('[COMBAT] Rival sin movimiento válido:', foe.displayName, foe.moves);
      ctx._turnRunning = false;
      Screens._combatStartTurn();
      return;
    }

    console.log(`[COMBAT] Turno: ${player.displayName} usará ${playerMove.name} | ${foe.displayName} usará ${foeMove.name}`);

    // Limpiar flags temporales del turno anterior — tanto jugador como rival
    player._priority  = false;
    player._doubleHit = false;
    player._flinched  = false;
    player._ventaja   = false;
    foe._priority     = false;
    foe._doubleHit    = false;
    foe._flinched     = false;
    foe._ventaja      = false;

    // before-attack: se evalúa para AMBOS movimientos antes de decidir el orden
    // de turno, ya que efectos como 'priority' (ataca primero) deben poder
    // afectar a cualquiera de los dos combatientes, no solo al jugador.
    if (playerMove?.effectId) {
      applyEffect(playerMove, 'before-attack', {
        user: player, target: foe, dmg: 0, team: GameState.team, log: logFn,
      });
    }
    if (foeMove?.effectId) {
      applyEffect(foeMove, 'before-attack', {
        user: foe, target: player, dmg: 0, team: GameState.team, log: logFn,
      });
    }

    // Determinar orden: priority sobreescribe velocidad.
    // Si ambos tienen priority (o ninguno), se decide por velocidad como siempre.
    let playerGoesFirst;
    if (player._priority && !foe._priority) {
      playerGoesFirst = true;
    } else if (foe._priority && !player._priority) {
      playerGoesFirst = false;
    } else {
      playerGoesFirst = effectiveSpeed(player) >= effectiveSpeed(foe);
    }
    const [first, second] = playerGoesFirst ? [player, foe] : [foe, player];

    // moveOf: cada pokemon solo puede usar SU movimiento
    const moveOf = (poke) => poke === player ? playerMove : foeMove;

    // ctx.chosenMove sincronizado con el movimiento validado
    ctx.chosenMove = playerMove;

    // ── Primer atacante ────────────────────────────────────────────────────
    const firstCheck = StatusEffects.checkBeforeAttack(first);
    if (firstCheck.message) { logFn(firstCheck.message); await Screens._wait(500); }
    if (firstCheck.canAttack) {
      if (firstCheck.hitSelf) {
        await Screens._animateAttack(first, first, CONFUSION_SELF_HIT, player);
        if (!isAlive(first)) {
          ctx._turnRunning = false;
          await Screens._applyEndOfTurnStatus(player, foe);
          Screens._combatEnd(); return;
        }
      } else {
        await Screens._animateAttack(first, second, moveOf(first), player);
        if (!isAlive(second)) {
          ctx._turnRunning = false;
          await Screens._applyEndOfTurnStatus(player, foe);
          Screens._combatEnd(); return;
        }
      }
    }

    // Double-hit: segunda animación — solo si no se golpeó a sí mismo
    if (first._doubleHit && firstCheck.canAttack && !firstCheck.hitSelf) {
      first._doubleHit = false;
      await Screens._animateAttack(first, second, moveOf(first), player);
      if (!isAlive(second)) {
        ctx._turnRunning = false;
        await Screens._applyEndOfTurnStatus(player, foe);
        Screens._combatEnd(); return;
      }
    }

    // ── Segundo atacante ───────────────────────────────────────────────────
    if (second._flinched) {
      second._flinched = false;
      logFn(`${second.displayName} retrocedio y no pudo atacar!`);
      await Screens._wait(700);
    } else {
      const secondCheck = StatusEffects.checkBeforeAttack(second);
      if (secondCheck.message) { logFn(secondCheck.message); await Screens._wait(500); }
      if (secondCheck.canAttack) {
        if (secondCheck.hitSelf) {
          await Screens._animateAttack(second, second, CONFUSION_SELF_HIT, player);
          if (!isAlive(second)) {
            ctx._turnRunning = false;
            await Screens._applyEndOfTurnStatus(player, foe);
            Screens._combatEnd(); return;
          }
        } else {
          await Screens._animateAttack(second, first, moveOf(second), player);
          if (!isAlive(first)) {
            ctx._turnRunning = false;
            await Screens._applyEndOfTurnStatus(player, foe);
            Screens._combatEnd(); return;
          }
        }
      }
    }

    // ── Fin de turno: daño por estado ──────────────────────────────────────
    await Screens._applyEndOfTurnStatus(player, foe);
    ctx._turnRunning = false;
    if (!isAlive(player)) { Screens._combatEnd(); return; }
    if (!isAlive(foe))    { Screens._combatEnd(); return; }

    Screens._combatStartTurn();
  },

  // Aplica daño de fin de turno por estados y actualiza HUDs
  // Salta los Pokémon ya derrotados para no mostrar daño en muertos,
  // pero sí aplica al superviviente aunque el rival haya caído ese mismo turno.
  async _applyEndOfTurnStatus(player, foe) {
    const logFn = (txt) => Screens._updateCombatLog(txt);

    if (isAlive(player)) {
      const playerDmg = StatusEffects.applyEndOfTurn(player, logFn);
      if (playerDmg > 0) {
        Render.updateHpBar(document.getElementById('hud-player'), player.currentHp, player.stats.hp);
        const nums = document.getElementById('hp-nums-player');
        if (nums) nums.textContent = `${player.currentHp}/${player.stats.hp}`;
        Screens._updateCombatTeamBar();
        await Screens._wait(400);
      }
    }

    if (isAlive(foe)) {
      const foeDmg = StatusEffects.applyEndOfTurn(foe, logFn);
      if (foeDmg > 0) {
        Render.updateHpBar(document.getElementById('hud-foe'), foe.currentHp, foe.stats.hp);
        await Screens._wait(400);
      }
    }

    // Refrescar badges de estado en HUDs
    Screens._updateStatusBadges(player, foe);

    // ── Objetos ON_TURN_END (p.ej. Restos) — última acción del turno ────────
    // Si ambos combatientes llevan un objeto con este trigger, se resuelven
    // en orden de velocidad (effectiveSpeed, mayor primero), pero siempre
    // después de todo lo demás (daño por estado ya aplicado arriba).
    const updatePlayerHud = () => {
      Render.updateHpBar(document.getElementById('hud-player'), player.currentHp, player.stats.hp);
      const nums = document.getElementById('hp-nums-player');
      if (nums) nums.textContent = `${player.currentHp}/${player.stats.hp}`;
      Screens._updateCombatTeamBar();
    };
    const updateFoeHud = () => {
      Render.updateHpBar(document.getElementById('hud-foe'), foe.currentHp, foe.stats.hp);
    };

    const order = effectiveSpeed(player) >= effectiveSpeed(foe)
      ? [{ poke: player, updateHud: updatePlayerHud }, { poke: foe, updateHud: updateFoeHud }]
      : [{ poke: foe, updateHud: updateFoeHud }, { poke: player, updateHud: updatePlayerHud }];

    for (const { poke, updateHud } of order) {
      if (!isAlive(poke)) continue;
      const triggered = applyHeldItemTurnEnd(poke, { log: logFn, updateHud });
      if (triggered) await Screens._wait(400);
    }
  },


  async _animateAttack(attacker, defender, move, activePlayer) {
    const ctx       = GameState.combat;
    const foe       = ctx.foeTeam[ctx.foeIndex];
    const isPlayerAtk = attacker === activePlayer;
    const logFn     = (txt) => Screens._updateCombatLog(txt);

    // Nota: 'before-attack' (priority, double-hit) ya se evaluó para ambos
    // combatientes en _executeCombatTurn, antes de determinar el orden de turno.
    // No se re-ejecuta aquí para evitar doble aplicación/duplicar logs.

    Screens._updateCombatLog(`${attacker.displayName} uso ${move?.name ?? '???'}!`);
    await Screens._wait(500);

    const calc = calcDamage(attacker, defender, move ?? attacker.moves[0]);
    let dmg = calc.dmg;
    const { isCrit, eff, modifiers } = calc;

    if (attacker._ventaja) {
      attacker._ventaja = false;
      dmg = dmg * 2;
      logFn(`¡${attacker.displayName} aprovecha el estado del rival! ×2`);
    }

    // Callbacks de actualización de HUD para efectos
    const updatePlayerHud = () => {
      Render.updateHpBar(document.getElementById('hud-player'), activePlayer.currentHp, activePlayer.stats.hp);
      const nums = document.getElementById('hp-nums-player');
      if (nums) nums.textContent = `${activePlayer.currentHp}/${activePlayer.stats.hp}`;
      Screens._updateCombatTeamBar();
    };
    const updateFoeHud = () => {
      Render.updateHpBar(document.getElementById('hud-foe'), foe.currentHp, foe.stats.hp);
    };

    // ── on-hitted (del DEFENSOR) — se evalúa ANTES de aplicar el daño, para
    // que efectos como 'shield-25' puedan reducir `dmg` antes de restar el HP.
    // Genérico: si el jugador es golpeado, se mira su autoMove; si el rival es
    // golpeado, se mira el autoMove del rival — cualquiera puede tener recoil/shield/heal.
    const defenderMove = defender.moves.find(m => m.id === defender.autoMove) ?? defender.moves[0];

    let onHittedHadEffect = false;
    if (defenderMove?.effectId) {
      const effectCtx = {
        user: defender, attacker, team: GameState.team, log: logFn,
        showStatChange: (hudId, label, dir, pct) => Screens._showStatChange(hudId, label, dir, pct),
        updatePlayerHud: defender === activePlayer ? updatePlayerHud : updateFoeHud,
        get dmg() { return dmg; },
        set dmg(v) { dmg = v; },
      };
      onHittedHadEffect = applyEffect(defenderMove, 'on-hitted', effectCtx);
    }

    // Aplicar el daño (ya ajustado por shield-25 si corresponde)
    defender.currentHp = Math.max(0, defender.currentHp - dmg);

    // Log de resumen — justo tras aplicar el daño, antes de efectos (Baya Zidra, etc.)
    console.log(`[COMBAT] ${attacker.displayName} uso ${move?.name} -> ${dmg} dmg${isCrit?' (CRIT)':''}${eff>=2?' (EFICAZ!)':eff<1&&eff>0?' (poco eficaz)':eff===0?' (inmune)':''}`);
    if (modifiers?.length) {
      console.log(`[COMBAT] Modificadores aplicados: ${modifiers.map(m => `${m.label} (×${m.mult.toFixed(2)})`).join(', ')}`);
    }

    // ── Objeto equipado del DEFENSOR (ON_TURN_START, p.ej. Baya Zidra) ──────
    // Se evalúa justo tras recibir el golpe, con el HP ya actualizado.
    const heldItemUpdateHud = defender === activePlayer ? updatePlayerHud : updateFoeHud;
    const heldItemTriggered = applyHeldItemTurnStart(defender, { log: logFn, updateHud: heldItemUpdateHud });

    // Floater de daño sobre el sprite del defensor
    const defTarget = isPlayerAtk ? 'foe' : 'player';
    Screens._showFloater(defTarget, isCrit ? `-${dmg}!` : `-${dmg}`, isCrit ? 'crit' : 'dmg');

    // Flash sprite
    const spriteId = isPlayerAtk ? 'sprite-foe' : 'sprite-player';
    const sprite   = document.getElementById(spriteId);
    if (sprite) {
      sprite.classList.add('combat-sprite--hit');
      setTimeout(() => sprite.classList.remove('combat-sprite--hit'), 300);
    }

    if (isCrit) { Screens._updateCombatLog('Un golpe critico!'); await Screens._wait(300); }
    if (eff >= 2)       { Screens._updateCombatLog(`Es eficaz contra ${defender.displayName}!`); await Screens._wait(300); }
    else if (eff === 0) { Screens._updateCombatLog(`No afecto a ${defender.displayName}!`);      await Screens._wait(300); }
    else if (eff < 1)   { Screens._updateCombatLog(`No es muy eficaz contra ${defender.displayName}...`); await Screens._wait(300); }

    // Mostrar en el log de combate los modificadores que afectaron a este golpe
    // (subidas/bajadas de estadística vía combatMods, boosts de objetos como Carbón).
    for (const mod of modifiers ?? []) {
      Screens._updateCombatLog(`${mod.label}`);
      await Screens._wait(300);
    }

    if (heldItemTriggered) await Screens._wait(1000);

    // Recoil/heal-on-hit pueden haber cambiado el HP de defender/attacker — refrescar HUDs
    if (onHittedHadEffect) {
      updatePlayerHud();
      updateFoeHud();
      await Screens._wait(400);
    }

    // ── after-attack (del ATACANTE) ─────────────────────────────────────────
    if (move?.effectId) {
      const prevAttackerHp = attacker.currentHp;
      const hadEffect = applyEffect(move, 'after-attack', {
        user: attacker, target: defender, dmg, team: GameState.team, log: logFn,
        showStatChange: (hudId, label, dir, pct) => Screens._showStatChange(hudId, label, dir, pct),
        updatePlayerHud: isPlayerAtk ? () => {
          const healed = attacker.currentHp - prevAttackerHp;
          updatePlayerHud();
          if (healed > 0) Screens._showFloater('player', `+${healed}`, 'heal');
        } : () => {
          // El rival se cura con drain — mostrar floater sobre su sprite
          const healed = attacker.currentHp - prevAttackerHp;
          updateFoeHud();
          if (healed > 0) Screens._showFloater('foe', `+${healed}`, 'heal');
        },
      });
      if (hadEffect) await Screens._wait(400);
    }

    // Update HP bars — siempre ambos por si los efectos modificaron al jugador
    Render.updateHpBar(document.getElementById('hud-foe'), foe.currentHp, foe.stats.hp);
    Render.updateHpBar(document.getElementById('hud-player'), activePlayer.currentHp, activePlayer.stats.hp);
    const nums = document.getElementById('hp-nums-player');
    if (nums) nums.textContent = `${activePlayer.currentHp}/${activePlayer.stats.hp}`;
    Screens._updateCombatTeamBar();
    // Actualizar badges de estado y modificadores de stat
    Screens._updateStatusBadges(activePlayer, foe);

    await Screens._wait(400);
  },

  async _combatEnd() {
    const ctx = GameState.combat;
    // Guardia: evitar que _combatEnd se ejecute dos veces en el mismo turno
    if (ctx._ending) {
      console.warn('[COMBAT] _combatEnd llamado dos veces — ignorado');
      return;
    }
    ctx._ending = true;

    const player = GameState.team[0];
    const foe    = ctx.foeTeam[ctx.foeIndex];
    const area   = document.getElementById('combat-actions-area');

    // La muerte del jugador tiene prioridad: si ambos mueren a la vez, es derrota
    if (!isAlive(foe) && isAlive(ctx.activePlayer)) {
      Screens._updateCombatLog(`${foe.displayName} se debilito!`);
      // Animación de derrota del rival
      await Screens._showFaintAnimation('foe');
      await Screens._wait(200);

      // EXP
      const battleType = ctx.isGym ? 'gym' : ctx.isTrainer ? 'trainer' : 'wild';
      for (const member of GameState.team) {
        if (member.currentHp <= 0) continue;
        const { gained, levelsGained } = gainExp(member, foe.name, battleType, foe.level);
        console.log(`[COMBAT] ${member.displayName} gano ${gained} exp`);
        if (levelsGained > 0) {
          Screens._updateCombatLog(`${member.displayName} subio al nivel ${member.level}!`);
          console.log(`[COMBAT] ${member.displayName} subio al nivel ${member.level}!`);
          Screens._updateCombatTeamBar();
          Screens._showLevelUpPip(member, levelsGained);
          await Screens._wait(950);
        }
        // Evolución pendiente
        if (member._pendingEvolution) {
          const intoName = member._pendingEvolution;
          delete member._pendingEvolution;
          Screens._updateCombatLog(`Que? ${member.displayName} esta evolucionando!`);
          // Animación ¡EVOLUCIONA! en el pip — se muestra sobre el pip del pokemon actual
          Screens._showEvolutionPip(member);
          await Screens._wait(1000);
          try {
            const evolved = await evolve(member, intoName);
            const idx = GameState.team.indexOf(member);
            if (idx !== -1) GameState.team[idx] = evolved;
            if (member === GameState.starter) GameState.starter = evolved;
            // Si el pokemon que evolucionó era el activo en combate, actualizar la referencia
            if (ctx.activePlayer === member) ctx.activePlayer = evolved;
            // Marcar la evolución como capturada en la pokédex
            Storage.markCaught(evolved.name);
            Screens._updateCombatLog(`Felicidades! Tu ${member.displayName} a evolucionado a ${evolved.displayName}!`);
            console.log(`[EVOLUCION] ${member.displayName} → ${evolved.displayName}`);
            Screens._updateCombatTeamBar();
            await Screens._wait(800);
          } catch (e) {
            console.error('[EVOLUCION] Error:', e.message);
          }
        }
      }
      // Captura: auto si autoCapture, manual si no
      if (ctx.isWild) {
        if (ctx.autoCapture) {
          if (Math.random() < COMBAT_CONFIG.CATCH_RATE) {
            fullHeal(foe);
            Screens._updateCombatLog(`Gotcha! ${foe.displayName} fue capturado!`);
            console.log(`[COMBAT] Capturado: ${foe.displayName}`);
            Storage.markCaught(foe.name);
            if (foe.shiny) Storage.markShiny(foe.name);
            // Convertir en pokemon del jugador y cargar MTs aprendidas por la cadena evolutiva
            foe.isPlayer = true;
            const capturedMTs = Storage.getLearnedMTs(foe.name);
            foe.learnedMTs = capturedMTs;
            for (const mtId of capturedMTs) {
              const mtMove = MOVE_BY_ID[mtId];
              if (mtMove && !foe.moves.find(mv => mv.id === mtId))
                foe.moves.push({ ...mtMove, maxPp: mtMove.pp });
            }
            if (GameState.team.length < 6) {
              GameState.team.push(foe);
              await Screens._wait(800);
              Screens._advanceFoeOrEnd();
            } else {
              await Screens._wait(800);
              Screens._showPokemonSwapSelector(foe, () => Screens._advanceFoeOrEnd());
            }
          } else {
            Screens._updateCombatLog(`${foe.displayName} escapo!`);
            await Screens._wait(800);
            Screens._advanceFoeOrEnd();
          }
        } else {
          area.innerHTML = `
            <div style="display:flex;gap:8px;padding:8px 16px;align-items:center">
              <button class="btn btn--primary pokeball-btn" style="flex:1" id="btn-catch" title="Capturar">
                <svg class="pokeball-spin" viewBox="0 0 16 16" width="22" height="22">
                  <!-- circulo exterior negro (borde) -->
                  <circle cx="8" cy="8" r="7.5" fill="#1A1A1A"/>
                  <!-- mitad superior roja (recortada al circulo, ligeramente mas pequeña para dejar borde) -->
                  <path d="M 1 8 A 7 7 0 0 1 15 8 Z" fill="#E74C3C"/>
                  <!-- mitad inferior blanca -->
                  <path d="M 1 8 A 7 7 0 0 0 15 8 Z" fill="#FFFFFF"/>
                  <!-- banda central negra -->
                  <rect x="1" y="7" width="14" height="2" fill="#1A1A1A"/>
                  <!-- boton central: anillo negro + nucleo blanco, ambos circulares -->
                  <circle cx="8" cy="8" r="3"   fill="#1A1A1A"/>
                  <circle cx="8" cy="8" r="1.7" fill="#FFFFFF"/>
                </svg>
              </button>
              <button class="btn" style="flex:1" id="btn-no-catch">CONTINUAR</button>
            </div>`;
          document.getElementById('btn-catch').addEventListener('click', () => Screens._attemptCatch(foe));
          document.getElementById('btn-no-catch').addEventListener('click', () => Screens._advanceFoeOrEnd());
        }
        return;
      }

      Screens._advanceFoeOrEnd();

    } else if (!isAlive(ctx.activePlayer)) {
      // Animación de derrota del jugador
      await Screens._showFaintAnimation('player');
      const next = GameState.team.find(p => isAlive(p) && p !== ctx.activePlayer);
      if (!next) {
        Screens._updateCombatLog(`${ctx.activePlayer.displayName} no puede mas!`);
        await Screens._wait(600);
        Screens._clearPauseBtn(); ctx.onLoss();
      } else if (!isAlive(foe)) {
        // Ambos murieron a la vez (ej: Autodestruccion). El rival cuenta como debilitado.
        Screens._updateCombatLog(`${foe.displayName} se debilito!`);
        await Screens._showFaintAnimation('foe');
        await Screens._wait(200);
        // EXP para los pokemon vivos del equipo
        const battleType2 = ctx.isGym ? 'gym' : ctx.isTrainer ? 'trainer' : 'wild';
        for (const member of GameState.team) {
          if (member.currentHp <= 0) continue;
          const { levelsGained } = gainExp(member, foe.name, battleType2, foe.level);
          if (levelsGained > 0) {
            Screens._updateCombatLog(`${member.displayName} subio al nivel ${member.level}!`);
            Screens._updateCombatTeamBar();
            Screens._showLevelUpPip(member, levelsGained);
            await Screens._wait(950);
          }
        }
        ctx.activePlayer  = next;
        ctx.chosenMove    = null;
        ctx._ending       = false;
        ctx._turnRunning  = false;
        ctx.introPlayed   = true;
        await Screens._wait(600);
        Screens._advanceFoeOrEnd();
      } else {
        Screens._updateCombatLog(`${ctx.activePlayer.displayName} no puede mas! Vamos, ${next.displayName}!`);
        ctx.activePlayer  = next;
        ctx.chosenMove    = null;
        ctx._ending       = false;
        ctx._turnRunning  = false;
        ctx.introPlayed   = true;  // evitar que _renderCombatScreen relance la intro
        await Screens._wait(800);
        Screens._renderCombatScreen();
        // _combatStartTurn lo llama _renderCombatScreen internamente
      }
    }
  },

  async _attemptCatch(foe) {
    const area = document.getElementById('combat-actions-area');
    GameState.balls -= 1;
    const chance = COMBAT_CONFIG.CATCH_RATE;
    area.innerHTML = `<div style="text-align:center;padding:16px;font-family:var(--font-pixel);font-size:9px">Lanzas una Poke Ball...</div>`;
    await Screens._wait(400);
    Screens._updateCombatLog('1...');
    await Screens._wait(500);
    Screens._updateCombatLog('2...');
    await Screens._wait(500);
    Screens._updateCombatLog('3...');
    await Screens._wait(600);

    if (Math.random() < chance) {
      fullHeal(foe);
      Screens._updateCombatLog(`Gotcha! ${foe.displayName} fue capturado!`);
      console.log(`[COMBAT] Capturado: ${foe.displayName}`);
      Storage.markCaught(foe.name);
      if (foe.shiny) Storage.markShiny(foe.name);
      foe.isPlayer = true;
      const capturedMTs = Storage.getLearnedMTs(foe.name);
      foe.learnedMTs = capturedMTs;
      for (const mtId of capturedMTs) {
        const mtMove = MOVE_BY_ID[mtId];
        if (mtMove && !foe.moves.find(mv => mv.id === mtId))
          foe.moves.push({ ...mtMove, maxPp: mtMove.pp });
      }
      if (GameState.team.length < 6) {
        GameState.team.push(foe);
        await Screens._wait(1000);
        Screens._advanceFoeOrEnd();
      } else {
        await Screens._wait(1000);
        Screens._showPokemonSwapSelector(foe, () => Screens._advanceFoeOrEnd());
      }
    } else {
      Screens._updateCombatLog(`Casi... ${foe.displayName} se escapo!`);
      await Screens._wait(800);
      Screens._advanceFoeOrEnd();
    }
  },

  _advanceFoeOrEnd() {
    const ctx = GameState.combat;
    ctx.foeIndex++;
    if (ctx.foeIndex < ctx.foeTeam.length) {
      const nextFoe = ctx.foeTeam[ctx.foeIndex];
      Screens._updateCombatLog(`El rival saco a ${nextFoe.displayName}!`);
      console.log(`[COMBAT] Siguiente rival: ${nextFoe.displayName}`);
      ctx.chosenMove   = null;
      ctx._ending      = false;
      ctx._turnRunning = false;
      ctx.introPlayed  = false;  // mostrar animación de entrada del nuevo foe
      setTimeout(() => {
        Screens._renderCombatScreen();
        // _renderCombatScreen llama a _combatStartTurn internamente tras la intro
      }, 800);
    } else {
      Screens._clearPauseBtn(); ctx.onWin();
    }
  },

  _clearPauseBtn() {
    document.querySelectorAll('.global-pause-btn').forEach(e => e.remove());
    document.querySelectorAll('.global-dex-btn').forEach(e => e.remove());
    GameState.paused = false;
  },

  _updateCombatTeamBar() {
    const bar = document.getElementById('combat-team-bar');
    if (!bar) return;
    const ctx    = GameState.combat;
    const active = ctx?.activePlayer ?? GameState.team[0];
    bar.innerHTML = GameState.team.map(p => Screens._pipHtml(p, active)).join('');
  },

  // Actualiza los badges de estado y modificadores de stat en los HUDs
  _updateStatusBadges(player, foe) {
    ['player', 'foe'].forEach(side => {
      const poke  = side === 'player' ? player : foe;
      const hudId = `hud-${side}`;
      const hud   = document.getElementById(hudId);
      if (!hud) return;

      // Badge de estado (poison, burn, etc.)
      let statusEl = hud.querySelector('.hud-status-row');
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'hud-status-row';
        hud.appendChild(statusEl);
      }

      const parts = [];

      // Estado de combate
      const statusBadge = StatusEffects.badge(poke);
      if (statusBadge) parts.push(statusBadge);

      // Modificadores de stat activos
      const mods = poke.combatMods ?? {};
      const STAT_LABEL = { atk:'ATK', def:'DEF', spa:'SPA', spd:'SPD', spe:'VEL' };
      const activeMods = Object.entries(mods).filter(([k, v]) => !k.startsWith('_') && v !== 0);
      if (activeMods.length >= 3 && activeMods.every(([, v]) => v === activeMods[0][1])) {
        const val = activeMods[0][1];
        const pct = Math.round(Math.abs(val) * 100);
        const up  = val > 0;
        parts.push(`<span class="stat-mod-badge stat-mod-badge--${up ? 'up' : 'down'}">... ${up ? '+' : '-'}${pct}%</span>`);
      } else {
        for (const [key, val] of activeMods) {
          const label = STAT_LABEL[key] ?? key.toUpperCase();
          const pct   = Math.round(Math.abs(val) * 100);
          const up    = val > 0;
          parts.push(`<span class="stat-mod-badge stat-mod-badge--${up ? 'up' : 'down'}">${label} ${up ? '+' : '-'}${pct}%</span>`);
        }
      }

      statusEl.innerHTML = parts.join('');
    });
  },

  // Muestra un número flotante sobre un sprite de combate
  // target: 'foe' | 'player'  type: 'dmg' | 'crit' | 'heal'
  _showFloater(target, text, type) {
    const field = document.getElementById('combat-field');
    if (!field) return;

    const el = document.createElement('div');
    el.className = `combat-floater combat-floater--${type}`;
    el.textContent = text;

    // El rival está arriba-derecha, el jugador abajo-izquierda
    if (target === 'foe') {
      el.style.right = '10%';
      el.style.top   = '15%';
    } else {
      el.style.left  = '15%';
      el.style.bottom = '20%';
    }

    field.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  },

  // Animación de derrota: solo gris para salvajes, gris + caída para entrenador/gym
  async _showFaintAnimation(target) {
    const sprite = document.getElementById(`sprite-${target}`);
    if (!sprite) return;
    const ctx = GameState.combat;
    const isWildFoe = target === 'foe' && ctx.isWild;

    if (isWildFoe) {
      // Salvaje: solo se pone gris, sin caída
      sprite.style.transition = 'filter 400ms ease';
      sprite.style.filter = 'grayscale(1) brightness(.35)';
      await Screens._wait(500);
    } else {
      sprite.classList.add('combat-sprite--fainting');
      await Screens._wait(750);
    }
  },

  // Animación de subida de nivel en el pip del equipo
  _showLevelUpPip(pokemon, levelsGained = 1) {
    const bar = document.getElementById('combat-team-bar');
    if (!bar) return;
    const pips = bar.querySelectorAll('.combat-team-pip');
    const idx  = GameState.team.indexOf(pokemon);
    const pipEl = pips[idx];
    if (!pipEl) return;

    pipEl.classList.add('combat-team-pip--levelup');
    pipEl.style.position = 'relative';

    const badge = document.createElement('div');
    badge.className = 'pip-levelup-badge';
    badge.textContent = `+${levelsGained}`;
    pipEl.appendChild(badge);

    setTimeout(() => {
      pipEl.classList.remove('combat-team-pip--levelup');
      badge.remove();
    }, 950);
  },

  _showEvolutionPip(pokemon) {
    const bar = document.getElementById('combat-team-bar');
    if (!bar) return;
    const pips  = bar.querySelectorAll('.combat-team-pip');
    const idx   = GameState.team.indexOf(pokemon);
    const pipEl = pips[idx];
    if (!pipEl) return;

    // Forzar reflow para que la animación CSS se reinicie desde cero
    pipEl.classList.remove('combat-team-pip--levelup');
    void pipEl.offsetWidth;
    pipEl.classList.add('combat-team-pip--levelup');
    pipEl.style.position = 'relative';

    const badge = document.createElement('div');
    badge.className = 'pip-levelup-badge';
    badge.style.fontSize = '7px';
    badge.textContent = '¡EVOLUCIONA!';
    pipEl.appendChild(badge);

    setTimeout(() => {
      pipEl.classList.remove('combat-team-pip--levelup');
      badge.remove();
    }, 1000);
  },

  _updateCombatLog(text) {
    const el = document.getElementById('log-text');
    if (el) el.textContent = text;
    console.log(`[COMBAT LOG] ${text}`);
  },

  _wait(ms) {
    return new Promise(r => {
      const start = Date.now();
      const check = () => {
        if (GameState.paused) { setTimeout(check, 100); return; }
        const elapsed = Date.now() - start;
        if (elapsed >= ms) r();
        else setTimeout(check, ms - elapsed);
      };
      setTimeout(check, 0);
    });
  },

  // ═══════════════════════════════════════════════════════════════════════
  // BETWEEN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  betweenRoutes() {
    const route = KANTO_ROUTES[GameState.routeIndex];
    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--between">
        <div class="screen-header" style="background:var(--green)">
          <span class="screen-header__title" style="color:white">RUTA COMPLETADA</span>
        </div>
        <div class="between-team" id="team-list">
          ${GameState.team.map((p,i) => `
            <div class="team-card ${isAlive(p)?'':'team-card--fainted'}" draggable="true" data-idx="${i}">
              <img src="${p.spriteUrl??''}" class="team-card__sprite" alt="${p.displayName}" onerror="this.style.opacity=0">
              <div class="team-card__info">
                <div class="team-card__name">${p.displayName}</div>
                <div class="team-card__level">Nv.${p.level}</div>
              </div>
              <div class="team-card__handle">⠿</div>
            </div>`).join('')}
        </div>
        <div class="between-actions">
          <button class="btn btn--primary btn--wide" id="btn-continue">
            CONTINUAR → ${route?.name?.toUpperCase() ?? 'FINAL'}
          </button>
          <button class="btn btn--wide" id="btn-settings">⚙ Ajustes de combate</button>
        </div>
      </div>`;

    Screens._initDragSort();

    document.getElementById('btn-continue').addEventListener('click', () => {
      Screens.show(Screens.adventure);
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      Screens._showSettingsModal();
    });
    console.log('[UI] Pantalla: Entre rutas');
  },

  _initDragSort() {
    const items = document.querySelectorAll('.team-card');
    let dragSrc = null;
    items.forEach(item => {
      item.addEventListener('dragstart', e => { dragSrc = item; item.classList.add('team-card--dragging'); });
      item.addEventListener('dragend',   ()  => items.forEach(i => i.classList.remove('team-card--dragging','team-card--dragover')));
      item.addEventListener('dragover',  e  => { e.preventDefault(); item.classList.add('team-card--dragover'); });
      item.addEventListener('dragleave', ()  => item.classList.remove('team-card--dragover'));
      item.addEventListener('drop',      e  => {
        e.preventDefault();
        if (dragSrc === item) return;
        const fromIdx = +dragSrc.dataset.idx;
        const toIdx   = +item.dataset.idx;
        const tmp = GameState.team[fromIdx];
        GameState.team[fromIdx] = GameState.team[toIdx];
        GameState.team[toIdx]   = tmp;
        Screens.betweenRoutes();
        console.log(`[UI] Equipo reordenado: pos ${fromIdx} <-> pos ${toIdx}`);
      });
    });
    Screens._initTouchSort(document.body, '.team-card', (from, to) => {
      const tmp = GameState.team[from];
      GameState.team[from] = GameState.team[to];
      GameState.team[to]   = tmp;
      Screens.betweenRoutes();
      console.log(`[UI] Equipo reordenado (touch): pos ${from} <-> pos ${to}`);
    });
  },

  // Touch drag-and-drop reorder para móvil.
  // container: elemento raíz donde buscar los items (o document.body)
  // selector:  CSS selector de cada fila arrastrable
  // onSwap(fromIdx, toIdx): callback que ejecuta el intercambio y re-renderiza
  _initTouchSort(container, selector, onSwap) {
    const DRAG_THRESHOLD = 8;
    let dragEl    = null;
    let clone     = null;
    let offX = 0, offY = 0;
    let startX = 0, startY = 0;
    let isDragging = false;

    container.querySelectorAll(selector).forEach(el => {
      el.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = el.getBoundingClientRect();
        offX = touch.clientX - rect.left;
        offY = touch.clientY - rect.top;
        dragEl = el;
        isDragging = false;
      }, { passive: true });

      el.addEventListener('touchmove', e => {
        if (!dragEl) return;
        const touch = e.touches[0];

        if (!isDragging) {
          if (Math.hypot(touch.clientX - startX, touch.clientY - startY) < DRAG_THRESHOLD) return;
          isDragging = true;
          document.querySelectorAll('.held-item-tooltip--floating').forEach(el => el.remove());
          const rect = dragEl.getBoundingClientRect();
          dragEl.style.opacity = '.3';
          clone = dragEl.cloneNode(true);
          clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;z-index:9999;pointer-events:none;opacity:.85;box-shadow:0 6px 20px rgba(0,0,0,.35);`;
          document.body.appendChild(clone);
        }

        clone.style.left = `${touch.clientX - offX}px`;
        clone.style.top  = `${touch.clientY - offY}px`;

        clone.style.visibility = 'hidden';
        const under = document.elementFromPoint(touch.clientX, touch.clientY);
        clone.style.visibility = '';
        const targetEl = under?.closest(selector);
        container.querySelectorAll(selector).forEach(r => r.style.outline = '');
        if (targetEl && targetEl !== dragEl) targetEl.style.outline = '2px solid var(--yellow)';
        e.preventDefault();
      }, { passive: false });

      el.addEventListener('touchend', e => {
        if (!dragEl) return;
        clone?.remove(); clone = null;
        container.querySelectorAll(selector).forEach(r => { r.style.opacity = ''; r.style.outline = ''; });

        if (isDragging) {
          const touch = e.changedTouches[0];
          const under = document.elementFromPoint(touch.clientX, touch.clientY);
          const targetEl = under?.closest(selector);
          if (targetEl && targetEl !== dragEl) onSwap(+dragEl.dataset.idx, +targetEl.dataset.idx);
        }

        dragEl = null;
        isDragging = false;
      });
    });
  },

  _showSettingsModal() {
    const p = GameState.starter;
    const overlay = Screens._makeModal(`
      <div class="modal-title">AJUSTES DE COMBATE</div>
      <label style="font-family:var(--font-pixel);font-size:8px;display:flex;align-items:center;gap:12px;justify-content:space-between">
        AutoCombate
        <input type="checkbox" id="toggle-auto" ${GameState.autoMode ? 'checked' : ''} style="width:20px;height:20px">
      </label>
      <div style="font-family:var(--font-pixel);font-size:8px">Automovimiento:</div>
      <div style="display:flex;flex-direction:column;gap:6px" id="move-btns">
        ${p.moves.map(m => `
          <button class="btn btn--sm ${p.autoMove===m.id?'btn--primary':''}" data-moveid="${m.id}">
            ${m.name} [${m.type}]
          </button>`).join('')}
      </div>
      <button class="btn btn--green btn--wide" id="btn-close-modal">GUARDAR</button>
    `, { closeOnBackdrop: true });

    overlay.querySelectorAll('#move-btns .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        p.autoMove = btn.dataset.moveid;
        overlay.querySelectorAll('#move-btns .btn').forEach(b => b.classList.remove('btn--primary'));
        btn.classList.add('btn--primary');
        console.log(`[UI] Automovimiento: ${p.autoMove}`);
      });
    });

    document.getElementById('toggle-auto').addEventListener('change', e => {
      GameState.autoMode = e.target.checked;
      console.log(`[UI] AutoCombate: ${GameState.autoMode}`);
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => overlay.remove());
  },

  // ═══════════════════════════════════════════════════════════════════════
  // VICTORY
  // ═══════════════════════════════════════════════════════════════════════
  victory(badge) {
    Storage.clearRun();
    // Personalizable vía FINAL_SCREEN en routes.js — title/subtitle/bg/btnText.
    // Si no está definido, se usan los valores por defecto de siempre.
    const cfg = (typeof FINAL_SCREEN !== 'undefined' && FINAL_SCREEN) ? FINAL_SCREEN : {};
    const title   = cfg.title   ?? 'HAS GANADO!';
    const btnText = cfg.btnText ?? 'NUEVA PARTIDA';
    const bg = cfg.bg
      ? `background-image:url('${cfg.bg}');background-size:cover;background-position:center;`
      : '';

    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--victory" style="${bg}">
        <div class="victory-title">${title}</div>
        <button class="btn btn--primary" id="btn-restart" style="max-width:220px;width:100%">
          ${btnText}
        </button>
      </div>`;
    document.getElementById('btn-restart').addEventListener('click', () => {
      GameState.reset();
      Screens.show(Screens.title);
    });
    console.log(`[UI] VICTORIA! Medalla: ${badge}`);
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DEFEAT
  // ═══════════════════════════════════════════════════════════════════════
  defeat() {
    Storage.clearRun();
    document.getElementById('viewport').innerHTML = `
      <div class="screen screen--defeat">
        <div class="defeat-title">HAS SIDO<br>DERROTADO</div>
        <p style="font-family:var(--font-body);color:rgba(255,255,255,.6);font-size:13px">
          Todos tus pokemon fueron debilitados.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:220px">
          <button class="btn btn--primary btn--wide" id="btn-retry">INTENTAR DE NUEVO</button>
          <button class="btn btn--wide" id="btn-title"
            style="background:rgba(255,255,255,.15);color:white;border-color:rgba(255,255,255,.5)">
            MENU PRINCIPAL
          </button>
        </div>
      </div>`;
    document.getElementById('btn-retry').addEventListener('click', () => {
      GameState.reset();
      Screens.show(Screens.starterSelect);
    });
    document.getElementById('btn-title').addEventListener('click', () => {
      GameState.reset();
      Screens.show(Screens.title);
    });
    console.log('[UI] DERROTA');
  },
};
