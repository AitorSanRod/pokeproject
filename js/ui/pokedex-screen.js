// ─────────────────────────────────────────────────────────────────────────────
// POKÉDEX — pantalla de listado y detalle
// ─────────────────────────────────────────────────────────────────────────────

const PokedexScreen = {

  // Guarda la función que restaura la pantalla anterior
  _returnFn: null,
  _scrollPos: 0,

  // Abre la pokédex. onBack es la función que se llama al pulsar ← ATRAS
  show(onBack = null) {
    // Si no se pasa onBack, volver al título por defecto
    this._returnFn = onBack ?? (() => Screens.show(Screens.title));

    const dex     = Storage.getPokedex();
    const caught  = Object.keys(dex).filter(k => dex[k].caught).length;
    const gens    = typeof DEX_GENERATIONS !== 'undefined' ? DEX_GENERATIONS : [{ gen: 1, label: 'GEN I — KANTO', entries: KANTO_DEX }];
    const total   = gens.reduce((s, g) => s + g.entries.length, 0);

    // ── Sección Logros ────────────────────────────────────────────────────────
    const _logrosTotal  = typeof LOGROS !== 'undefined' ? LOGROS.length : 0;
    const _logrosDone   = typeof LOGROS !== 'undefined'
      ? LOGROS.filter(l => l.check()).length
      : 0;
    const _logrosHtml   = typeof LOGROS !== 'undefined'
      ? LOGROS.map(l => {
          const done = l.check();
          return `
            <div class="logro-entry ${done ? 'logro-entry--done' : 'logro-entry--locked'}">
              <div class="logro-entry__info">
                <span class="logro-entry__name">${l.name.toUpperCase()}</span>
                <span class="logro-entry__desc">${l.desc}</span>
              </div>
              ${done ? '<span class="logro-entry__star">&#9733;</span>' : ''}
            </div>`;
        }).join('')
      : '<span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">Sin logros definidos</span>';

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">

        <!-- Header -->
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="dex-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title" id="dex-header-title">POKÉDEX</span>
          <button class="btn btn--ghost" id="dex-search-btn"
            style="position:absolute;right:var(--sp-md);padding:4px;border:none;background:none;color:var(--white)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <!-- Lista -->
        <div id="dex-list" style="overflow-y:auto;flex:1;padding:var(--sp-sm)">
          <div style="display:flex;flex-direction:column;gap:4px">

            <!-- Buscador -->
            <div id="dex-search-bar" style="display:none;align-items:center;gap:6px;
              background:var(--white);border:var(--border);border-radius:var(--radius-sm);
              padding:12px 8px;margin-bottom:2px">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="var(--grey)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                style="flex-shrink:0">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input id="dex-search-input" type="text" placeholder="Buscar pokémon..."
                style="flex:1;border:none;outline:none;font-family:var(--font-pixel);font-size:8px;
                  background:transparent;color:var(--black)">
              <button id="dex-search-clear"
                style="border:none;background:none;cursor:pointer;font-family:var(--font-pixel);
                  font-size:10px;color:var(--grey);padding:0 2px;line-height:1">✕</button>
            </div>

            <!-- LOGROS -->
            <details>
              <summary style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
                padding:6px 8px;cursor:pointer;list-style:none;display:flex;align-items:center;
                justify-content:space-between;background:var(--grey-light);border:var(--border);
                border-radius:var(--radius-sm);margin-bottom:4px;user-select:none">
                <span>LOGROS</span>
                <span>${_logrosDone}/${_logrosTotal}</span>
              </summary>
              <div style="display:flex;flex-direction:column;gap:3px;margin-bottom:4px">
                ${_logrosHtml}
              </div>
            </details>

            <!-- GENERACIONES -->
            ${gens.map(gen => {
              const genCaught = gen.entries.filter(e => dex[e.name]?.caught).length;
              return `
                <details data-gen>
                  <summary style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
                    padding:6px 8px;cursor:pointer;list-style:none;display:flex;align-items:center;
                    justify-content:space-between;background:var(--grey-light);border:var(--border);
                    border-radius:var(--radius-sm);margin-bottom:4px;user-select:none">
                    <span>${gen.label}</span>
                    <span>${genCaught}/${gen.entries.length}</span>
                  </summary>
                  ${gen.entries.map(entry => {
                    const isCaught = dex[entry.name]?.caught;
                    const isSeen   = !isCaught && dex[entry.name]?.seen;
                    const isShiny  = isCaught && dex[entry.name]?.shiny;
                    return `
                      <div class="dex-entry ${isCaught ? 'dex-entry--caught' : isSeen ? 'dex-entry--seen' : 'dex-entry--unseen'}"
                        data-name="${entry.name}" data-id="${entry.id}">
                        <span class="dex-entry__num">#${String(entry.id).padStart(3,'0')}</span>

                        <div class="dex-entry__sprite-wrap">
                          ${isCaught
                            ? `<img src="${getDexSpriteUrl(entry.id)}" class="dex-entry__sprite" alt="${entry.name}" onerror="this.style.opacity=0.3">`
                            : isSeen
                            ? `<img src="${getDexSpriteUrl(entry.id)}" class="dex-entry__sprite dex-entry__sprite--seen" alt="${entry.name}" onerror="this.style.opacity=0.3">`
                            : `<div class="dex-entry__silhouette">?</div>`}
                        </div>

                        <div class="dex-entry__info">
                          <span class="dex-entry__name">${isCaught || isSeen ? (entry.label ?? entry.name).toUpperCase() : '???'}</span>
                          <div class="dex-entry__types">
                            ${isCaught || isSeen ? entry.types.map(t => `<span class="type-badge" data-type="${t}">${t}</span>`).join('') : ''}
                          </div>
                        </div>

                        ${isShiny ? `<img src="assets/sprites/others/shiny.png" style="width:14px;height:14px;image-rendering:pixelated;flex-shrink:0">` : ''}
                        ${isCaught ? `<span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);flex-shrink:0">›</span>` : ''}
                      </div>`;
                  }).join('')}
                </details>`;
            }).join('')}
          </div>
        </div>
      </div>`;

    document.getElementById('dex-list').scrollTop = PokedexScreen._scrollPos;

    document.getElementById('dex-back').addEventListener('click', () => {
      PokedexScreen._scrollPos = 0;
      PokedexScreen._returnFn();
    });

    // ── Buscador ────────────────────────────────────────────────────────────────
    const _searchBtn  = document.getElementById('dex-search-btn');
    const _searchBar  = document.getElementById('dex-search-bar');
    const _searchInput = document.getElementById('dex-search-input');
    const _searchClear = document.getElementById('dex-search-clear');

    const _openSearch = () => {
      _searchBar.style.display = 'flex';
      _searchInput.focus();
    };

    const _closeSearch = () => {
      _searchInput.value       = '';
      _searchBar.style.display = 'none';
      _filterDex('');
    };

    const _filterDex = (query) => {
      const q = query.trim().toLowerCase();
      document.querySelectorAll('#dex-list details[data-gen]').forEach(det => {
        if (q) det.open = true;
      });
      document.querySelectorAll('#dex-list .dex-entry').forEach(el => {
        const entryName  = (el.dataset.name ?? '').toLowerCase();
        const labelEl    = el.querySelector('.dex-entry__name');
        const labelText  = (labelEl?.textContent ?? '').toLowerCase();
        const visible    = !q || entryName.includes(q) || labelText.includes(q);
        el.style.display = visible ? '' : 'none';
      });
    };

    _searchBtn.addEventListener('click', _openSearch);
    _searchClear.addEventListener('click', _closeSearch);
    _searchInput.addEventListener('input', () => _filterDex(_searchInput.value));

    // Click en entrada capturada o vista → detalle
    document.querySelectorAll('.dex-entry--caught, .dex-entry--seen').forEach(el => {
      el.addEventListener('click', () => {
        PokedexScreen._scrollPos = document.getElementById('dex-list').scrollTop;
        PokedexScreen.showDetail(el.dataset.name, +el.dataset.id);
      });
    });
  },

  async showDetail(name, id) {
    const vp = document.getElementById('viewport');

    const _allDexEntries = typeof DEX_GENERATIONS !== 'undefined' ? DEX_GENERATIONS.flatMap(g => g.entries) : KANTO_DEX;
    const _dexMeta    = _allDexEntries.find(e => e.name === name);
    const displayName = (_dexMeta?.label ?? name).toUpperCase();

    // Skeleton mientras carga
    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="dex-detail-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">${displayName}</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center">
          <div class="loading-sprite" style="width:96px;height:96px"></div>
        </div>
      </div>`;

    document.getElementById('dex-detail-back').addEventListener('click', () => PokedexScreen.show(PokedexScreen._returnFn));

    const isCaught      = Storage.isCaught(name);
    const isShinyPokemon = Storage.isShiny(name);
    const entry = await getDexEntry({ id, name, types: _dexMeta?.types ?? [] });
    const shinySpriteUrl = toCdnSprite(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`);
    const evs    = Storage.getEvs(name);
    const badges = Storage.getBadges(name);
    const STAT_LABEL = { hp:'HP', atk:'ATK', def:'DEF', spa:'SPA', spd:'SPD', spe:'VEL' };

    // Movimientos disponibles filtrados por stage del pokemon (misma lógica que buildMoves)
    const dbEntry      = typeof POKEMON_DB !== 'undefined' ? POKEMON_DB[name] : null;
    const moveLines    = dbEntry?.moveLines ?? [];
    const pokemonStage = dbEntry?.stage ?? 3;
    const pokeMovesById = new Set();
    const pokeMovesList = [];
    if (typeof getMoveProgression !== 'undefined') {
      for (const line of moveLines) {
        const progression = getMoveProgression(line.type, line.damageClass);
        for (const move of progression) {
          if (move && !move.boss && !move.mt && (move.stage ?? 1) <= pokemonStage && !pokeMovesById.has(move.id)) {
            if (move.pokemon?.length > 0 && !move.pokemon.includes(name)) continue;
            pokeMovesById.add(move.id);
            pokeMovesList.push(move);
          }
        }
      }
    }

    // MTs aprendidas por la cadena evolutiva — compartidas entre todas las formas
    // (Storage.getLearnedMTs resuelve por raíz: Ivysaur ve las MTs de Bulbasaur)
    const learnedMtIds = typeof Storage !== 'undefined' ? Storage.getLearnedMTs(name) : [];
    const mtMovesList  = learnedMtIds
      .map(id => (typeof MOVE_BY_ID !== 'undefined' ? MOVE_BY_ID[id] : null))
      .filter(Boolean);

    // Rutas donde aparece en estado salvaje
    const wildLocations = (() => {
      if (typeof ROUTE_DATA === 'undefined') return [];
      const routeNameMap = {};
      if (typeof KANTO_ROUTES !== 'undefined') {
        for (const r of KANTO_ROUTES) routeNameMap[r.area] = r.name;
      }
      const locations = [];
      const EXCLUDED_AREAS = new Set(['zona-safari']);
      for (const [area, data] of Object.entries(ROUTE_DATA)) {
        if (EXCLUDED_AREAS.has(area)) continue;
        if (!data?.wild) continue;
        for (const w of data.wild) {
          if (w.name !== name) continue;
          const displayName = routeNameMap[area] ?? area;
          const minLv = w.minLv ?? w.level ?? 1;
          const maxLv = w.maxLv ?? w.level ?? 1;
          const existing = locations.find(l => l.routeName === displayName);
          if (existing) {
            existing.minLv = Math.min(existing.minLv, minLv);
            existing.maxLv = Math.max(existing.maxLv, maxLv);
          } else {
            locations.push({ routeName: displayName, minLv, maxLv });
          }
        }
      }
      return locations;
    })();

    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">

        <!-- Header -->
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="dex-detail-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">
            #${String(id).padStart(3,'0')} ${displayName}
          </span>
        </div>

        <div style="overflow-y:auto;flex:1;padding:var(--sp-md);display:flex;flex-direction:column;gap:var(--sp-md)">

          <!-- Sprite + tipos -->
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--sp-sm)">
            <div style="position:relative;display:inline-flex">
              <img id="dex-detail-sprite" src="${entry.spriteUrl}" alt="${name}"
                style="width:96px;height:96px;image-rendering:pixelated${isCaught ? '' : ';filter:brightness(.15) grayscale(1)'}"
                onerror="this.style.opacity=0.3">
              ${isShinyPokemon ? `
                <button id="dex-shiny-toggle" title="Ver forma shiny"
                  style="position:absolute;bottom:0;right:-8px;background:none;border:none;
                    cursor:pointer;font-size:16px;line-height:1;padding:2px;opacity:.7">
                  ↻
                </button>` : ''}
            </div>
            <div style="display:flex;gap:var(--sp-xs)">
              ${entry.types.map(t => `<span class="type-badge" data-type="${t}">${t}</span>`).join('')}
            </div>
            ${dbEntry?.evolvesAt ? `
              <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">
                Evoluciona al Nv.${dbEntry.evolvesAt}
              </span>` : ''}
          </div>

          <!-- Stats base + EVs inline -->
          ${entry.stats ? `
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);margin-bottom:var(--sp-sm)">
              STATS BASE
            </div>
            ${Object.entries(entry.stats).map(([key, val]) => {
              const ev = evs[key] ?? 0;
              return `
              <div style="display:flex;align-items:center;gap:var(--sp-sm);margin-bottom:5px">
                <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);width:30px">${STAT_LABEL[key]}</span>
                <div style="flex:1;height:8px;background:var(--grey-light);border:2px solid var(--black);border-radius:2px;overflow:hidden">
                  <div style="height:100%;width:${Math.min(100, Math.round(val/255*100))}%;
                    background:${val >= 90 ? 'var(--green)' : val >= 60 ? 'var(--yellow)' : 'var(--red)'}">
                  </div>
                </div>
                <span style="font-family:var(--font-pixel);font-size:8px;color:var(--black);width:24px;text-align:right">${val}</span>
                <span style="font-family:var(--font-pixel);font-size:8px;color:var(--blue);width:22px;text-align:right">+${ev}</span>
              </div>`;
            }).join('')}
          </div>` : ''}

          <!-- Habilidades -->
          ${(() => {
            const ab     = dbEntry?.ability;
            const hide   = dbEntry?.hideAbility;
            if (!ab && !hide) return '';
            const ABILITIES = typeof ABILITY_DATA !== 'undefined' ? ABILITY_DATA : {};
            const renderAbility = (id, isHide) => {
              const data = ABILITIES[id];
              const label = data?.name ?? id;
              const desc  = data?.desc ?? '';
              return `
                <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0">
                  <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey);flex-shrink:0;margin-top:1px">•</span>
                  <div>
                    <div style="display:flex;align-items:center;gap:6px">
                      <span style="font-family:var(--font-pixel);font-size:8px;color:var(--black)">${label}</span>
                      ${isHide ? `<span style="font-family:var(--font-pixel);font-size:5px;color:var(--white);background:var(--grey);border-radius:2px;padding:1px 4px">OCULTA</span>` : ''}
                    </div>
                    ${desc ? `<div style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);margin-top:2px;line-height:1.6">${desc}</div>` : ''}
                  </div>
                </div>`;
            };
            return `
              <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
                padding:var(--sp-md);box-shadow:var(--shadow-sm)">
                <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);margin-bottom:var(--sp-sm)">
                  HABILIDADES
                </div>
                ${ab   ? renderAbility(ab,   false) : ''}
                ${hide ? renderAbility(hide, true)  : ''}
              </div>`;
          })()}

          <!-- Medallas obtenidas con este pokemon (o su línea evolutiva) en el equipo -->
          ${(() => {
            const kantoFinished = Storage.isKantoCompleted();
            const medalBg = kantoFinished
              ? `background:url('assets/bg/kanto-league-bg.jpg') center/cover no-repeat;position:relative`
              : `background:var(--white)`;
            return `<div style="${medalBg};border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            ${kantoFinished ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,.45);border-radius:var(--radius-md);pointer-events:none"></div>` : ''}
            <div style="position:relative;z-index:1">
            <div style="font-family:var(--font-pixel);font-size:7px;color:${kantoFinished ? 'var(--white)' : 'var(--grey-dark)'};margin-bottom:var(--sp-sm)">
              MEDALLAS
            </div>
            ${badges.length > 0 ? `
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%">
                ${Object.values(typeof BADGE_LIST !== 'undefined' ? BADGE_LIST : {}).map(b => {
                  const earned = badges.includes(b.id);
                  return `<div style="display:flex;justify-content:center;align-items:center">
                    <img src="${b.img}" alt="${b.name}"
                      title="${b.name} - ${b.gym}"
                      style="width:36px;height:36px;image-rendering:pixelated;${earned ? '' : 'filter:grayscale(1) brightness(.4)'}"
                      onerror="this.outerHTML='<span style=font-family:var(--font-pixel);font-size:8px;color:var(--white);background:${earned ? 'var(--yellow)' : 'var(--grey)'};border:2px solid var(--black);border-radius:var(--radius-sm);padding:3px 7px>${b.name}</span>'">
                  </div>`;
                }).join('')}
              </div>
            ` : `<span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">Sin medallas aun</span>`}
          </div>
          </div>
          `;
          })()}

          <!-- Dónde encontrar en la naturaleza -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);margin-bottom:var(--sp-sm)">
              ENCONTRAR EN
            </div>
            ${wildLocations.length > 0 ? `
              <div style="display:flex;flex-direction:column;gap:4px">
                ${wildLocations.map(l => `
                  <div style="display:flex;justify-content:space-between;align-items:center;
                    padding:4px 8px;background:var(--off-white);border-radius:var(--radius-sm)">
                    <span style="font-family:var(--font-pixel);font-size:7px">${l.routeName}</span>
                    <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey)">
                      Nv.${l.minLv === l.maxLv ? l.minLv : `${l.minLv}–${l.maxLv}`}
                    </span>
                  </div>`).join('')}
              </div>
            ` : `
              <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">No aparece en la naturaleza</span>
            `}
          </div>

          <!-- Movimientos -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);margin-bottom:var(--sp-sm)">
              MOVIMIENTOS
            </div>
            ${isCaught && (pokeMovesList.length > 0 || mtMovesList.length > 0) ? `
              <div style="display:flex;flex-direction:column;gap:5px">
                ${[
                  ...pokeMovesList.map(m => ({ m, isMT: false })),
                  ...mtMovesList.map(m => ({ m, isMT: true })),
                ].map(({ m, isMT }) => {
                  const effectDesc = getEffectDescriptions(m);
                  return `
                    <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;
                      background:${isMT ? '#eef4ff' : 'var(--off-white)'};
                      border-radius:var(--radius-sm)"${effectDesc ? ` data-effect="${effectDesc.replace(/"/g, '&quot;')}"` : ''}>
                      ${isMT ? `<span style="font-family:var(--font-pixel);font-size:5px;color:var(--white);
                        background:#4a7fc1;border-radius:2px;padding:1px 4px;flex-shrink:0">MT</span>` : ''}
                      <span class="type-badge" data-type="${m.type}" style="font-size:5px;padding:2px 5px;flex-shrink:0">${m.type}</span>
                      <span style="font-family:var(--font-pixel);font-size:7px;flex:1">${m.name}</span>
                      <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">POD:${m.power ?? '—'}</span>
                    </div>`;
                }).join('')}
              </div>
            ` : `
              <div style="background:var(--grey-light);border-radius:var(--radius-sm);
                height:28px;display:flex;align-items:center;justify-content:center;
                font-family:var(--font-pixel);font-size:10px;color:var(--grey)">???</div>
            `}
          </div>

        </div>
      </div>`;

    document.getElementById('dex-detail-back').addEventListener('click', () => PokedexScreen.show(PokedexScreen._returnFn));

    if (isShinyPokemon) {
      let showingShiny = false;
      document.getElementById('dex-shiny-toggle').addEventListener('click', () => {
        showingShiny = !showingShiny;
        const sprite = document.getElementById('dex-detail-sprite');
        sprite.src = showingShiny ? shinySpriteUrl : entry.spriteUrl;
        document.getElementById('dex-shiny-toggle').style.opacity = showingShiny ? '1' : '.7';
      });
    }

    vp.querySelectorAll('[data-effect]').forEach(row => {
      const effect = row.dataset.effect;
      let _tip = null, _tipTimer = null;
      const _removeTip = () => { _tip?.remove(); _tip = null; clearTimeout(_tipTimer); _tipTimer = null; };
      const _showTip = () => {
        _removeTip();
        _tip = document.createElement('div');
        _tip.className = 'move-effect-tooltip';
        _tip.textContent = '✦ ' + effect;
        document.body.appendChild(_tip);
        const r = row.getBoundingClientRect();
        _tip.style.left = (r.left + r.width / 2) + 'px';
        _tip.style.top  = (r.top - _tip.offsetHeight - 8) + 'px';
        _tipTimer = setTimeout(_removeTip, 5000);
      };
      row.addEventListener('mouseenter', _showTip);
      row.addEventListener('mouseleave', _removeTip);
      row.addEventListener('click', () => { _tip ? _removeTip() : _showTip(); });
    });
  },
};
