// ─────────────────────────────────────────────────────────────────────────────
// POKÉDEX — pantalla de listado y detalle
// ─────────────────────────────────────────────────────────────────────────────

const PokedexScreen = {

  // Guarda la función que restaura la pantalla anterior
  _returnFn: null,

  // Abre la pokédex. onBack es la función que se llama al pulsar ← ATRAS
  show(onBack = null) {
    // Si no se pasa onBack, volver al título por defecto
    this._returnFn = onBack ?? (() => Screens.show(Screens.title));

    const dex     = Storage.getPokedex();
    const allEvs  = Storage.getAllEvs();
    const caught  = Object.keys(dex).filter(k => dex[k].caught).length;

    document.getElementById('viewport').innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">

        <!-- Header -->
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="dex-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">POKÉDEX</span>
          <span class="screen-header__extra">${caught}/151</span>
        </div>

        <!-- Lista -->
        <div id="dex-list" style="overflow-y:auto;flex:1;padding:var(--sp-sm)">
          <div style="display:flex;flex-direction:column;gap:4px">
            ${KANTO_DEX.map(entry => {
              const isCaught = dex[entry.name]?.caught;
              const isSeen   = !isCaught && dex[entry.name]?.seen;
              const evRoot   = Storage.getEvolutionRoot(entry.name);
              const evs      = allEvs[evRoot];
              const hasEvs   = evs && Object.values(evs).some(v => v > 0);
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
                    <span class="dex-entry__name">${isCaught || isSeen ? entry.name.toUpperCase() : '???'}</span>
                    <div class="dex-entry__types">
                      ${isCaught || isSeen ? entry.types.map(t => `<span class="type-badge" data-type="${t}">${t}</span>`).join('') : ''}
                    </div>
                  </div>

                  ${hasEvs && isCaught ? `<span class="dex-entry__ev-badge" title="Tiene EVs">EV</span>` : ''}
                  ${isCaught ? `<span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);flex-shrink:0">›</span>` : ''}
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;

    document.getElementById('dex-back').addEventListener('click', () => {
      PokedexScreen._returnFn();
    });

    // Click en entrada capturada o vista → detalle
    document.querySelectorAll('.dex-entry--caught, .dex-entry--seen').forEach(el => {
      el.addEventListener('click', () => {
        PokedexScreen.showDetail(el.dataset.name, +el.dataset.id);
      });
    });
  },

  async showDetail(name, id) {
    const vp = document.getElementById('viewport');

    // Skeleton mientras carga
    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="dex-detail-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">${name.toUpperCase()}</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center">
          <div class="loading-sprite" style="width:96px;height:96px"></div>
        </div>
      </div>`;

    document.getElementById('dex-detail-back').addEventListener('click', () => PokedexScreen.show(PokedexScreen._returnFn));

    const isCaught = Storage.isCaught(name);
    const entry = await getDexEntry({ id, name, types: KANTO_DEX.find(e => e.name === name)?.types ?? [] });
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

    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">

        <!-- Header -->
        <div class="screen-header" style="background:var(--red)">
          <button class="btn btn--ghost screen-header__back" id="dex-detail-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">
            #${String(id).padStart(3,'0')} ${name.toUpperCase()}
          </span>
        </div>

        <div style="overflow-y:auto;flex:1;padding:var(--sp-md);display:flex;flex-direction:column;gap:var(--sp-md)">

          <!-- Sprite + tipos -->
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--sp-sm)">
            <img src="${entry.spriteUrl}" alt="${name}"
              style="width:96px;height:96px;image-rendering:pixelated${isCaught ? '' : ';filter:brightness(.15) grayscale(1)'}"
              onerror="this.style.opacity=0.3">
            <div style="display:flex;gap:var(--sp-xs)">
              ${entry.types.map(t => `<span class="type-badge" data-type="${t}">${t}</span>`).join('')}
            </div>
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
                <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey);width:30px">${STAT_LABEL[key]}</span>
                <div style="flex:1;height:8px;background:var(--grey-light);border:2px solid var(--black);border-radius:2px;overflow:hidden">
                  <div style="height:100%;width:${Math.min(100, Math.round(val/255*100))}%;
                    background:${val >= 90 ? 'var(--green)' : val >= 60 ? 'var(--yellow)' : 'var(--red)'}">
                  </div>
                </div>
                <span style="font-family:var(--font-pixel);font-size:6px;color:var(--black);width:24px;text-align:right">${val}</span>
                <span style="font-family:var(--font-pixel);font-size:6px;color:var(--blue);width:22px;text-align:right">+${ev}</span>
              </div>`;
            }).join('')}
          </div>` : ''}

          <!-- Medallas obtenidas con este pokemon (o su línea evolutiva) en el equipo -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);margin-bottom:var(--sp-sm)">
              MEDALLAS
            </div>
            ${badges.length > 0 ? `
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${badges.map(b => `
                  <span style="font-family:var(--font-pixel);font-size:6px;color:var(--white);
                    background:var(--yellow);border:2px solid var(--black);border-radius:var(--radius-sm);
                    padding:3px 7px;text-shadow:1px 1px 0 rgba(0,0,0,.25)">${b}</span>
                `).join('')}
              </div>
            ` : `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">Sin medallas aun</span>`}
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
                      border-radius:var(--radius-sm);position:relative">
                      ${isMT ? `<span style="font-family:var(--font-pixel);font-size:5px;color:var(--white);
                        background:#4a7fc1;border-radius:2px;padding:1px 4px;flex-shrink:0">MT</span>` : ''}
                      <span class="type-badge" data-type="${m.type}" style="font-size:5px;padding:2px 5px;flex-shrink:0">${m.type}</span>
                      <span style="font-family:var(--font-pixel);font-size:7px;flex:1">${m.name}</span>
                      <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">POD:${m.power ?? '—'}</span>
                      ${effectDesc ? `<div class="move-effect-tooltip">✦ ${effectDesc}</div>` : ''}
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
  },
};
