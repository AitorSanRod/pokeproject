// ─────────────────────────────────────────────────────────────────────────────
// COMPENDIUM — referencia de efectos de estado y movimientos
// ─────────────────────────────────────────────────────────────────────────────

const CompendiumScreen = {

  _returnFn: null,

  show(returnFn) {
    CompendiumScreen._returnFn = returnFn;
    CompendiumScreen._renderMain();
  },

  // ── Pantalla principal: dos secciones ─────────────────────────────────────
  _renderMain() {
    const vp = document.getElementById('viewport');
    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">

        <div class="screen-header" style="background:var(--blue)">
          <button class="btn btn--ghost screen-header__back" id="comp-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">COMPENDIO</span>
        </div>

        <div style="overflow-y:auto;flex:1;padding:var(--sp-md);display:flex;flex-direction:column;gap:var(--sp-md)">

          <!-- Efectos de estado -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
              margin-bottom:var(--sp-md);letter-spacing:1px">EFECTOS DE ESTADO</div>
            ${CompendiumScreen._renderStatusList()}
          </div>

          <!-- Movimientos -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
              margin-bottom:var(--sp-md);letter-spacing:1px">MOVIMIENTOS</div>
            ${CompendiumScreen._renderMoveList()}
          </div>

          <!-- Objetos equipables -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
              margin-bottom:var(--sp-md);letter-spacing:1px">OBJETOS EQUIPABLES</div>
            ${CompendiumScreen._renderHeldItemList()}
          </div>

        </div>
      </div>`;

    document.getElementById('comp-back')
      .addEventListener('click', () => CompendiumScreen._returnFn?.());

    // Clicks en movimientos → detalle con pokemon que lo usan
    vp.querySelectorAll('[data-move-id]').forEach(el => {
      el.addEventListener('click', () => {
        const moveId = el.dataset.moveId;
        CompendiumScreen._renderMoveDetail(moveId);
      });
    });
  },

  // ── Lista de efectos de estado ────────────────────────────────────────────
  _renderStatusList() {
    const statuses = [
      {
        id: 'poison', icon: '💜', label: 'PSN', color: '#9B59B6', bg: '#F5EEF8',
        lines: [
          'Inflige el <strong>10% del HP máximo</strong> al final de cada turno.',
          'No reduce ninguna estadística.',
        ],
      },
      {
        id: 'paralysis', icon: '⚡', label: 'PAR', color: '#D4AC0D', bg: '#FEF9E7',
        lines: [
          '<strong>10% de probabilidad</strong> de no poder atacar cada turno.',
          'Reduce la <strong>Velocidad un 50%</strong> (afecta al orden de turno).',
        ],
      },
      {
        id: 'burn', icon: '🔥', label: 'QEM', color: '#E74C3C', bg: '#FDEDEC',
        lines: [
          'Inflige el <strong>5% del HP máximo</strong> al final de cada turno.',
          'Reduce el <strong>Ataque base un 50%</strong> permanentemente mientras dure.',
        ],
      },
      {
        id: 'sleep', icon: '💤', label: 'SLE', color: '#7F8C8D', bg: '#F2F3F4',
        lines: [
          'El pokemon <strong>no puede atacar</strong> mientras duerme.',
          'Turno 1: <strong>0%</strong> de despertar.',
          'Turno 2: <strong>33%</strong> de despertar.',
          'Turno 3: <strong>66%</strong> de despertar.',
          'Turno 4+: <strong>100%</strong> — siempre se despierta.',
        ],
      },
      {
        id: 'freeze', icon: '🧊', label: 'CON', color: '#5DADE2', bg: '#EBF5FB',
        lines: [
          'Inflige el <strong>5% del HP máximo</strong> al final de cada turno.',
          'Reduce el <strong>Ataque Especial base un 50%</strong> mientras dure.',
        ],
      },
    ];

    return statuses.map(s => `
      <div style="border-radius:var(--radius-sm);border:1px solid ${s.color};
        background:${s.bg};padding:10px 12px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:18px">${s.icon}</span>
          <span style="font-family:var(--font-pixel);font-size:8px;color:${s.color};
            background:white;border:1px solid ${s.color};padding:2px 7px;border-radius:3px">
            ${s.label}
          </span>
        </div>
        <ul style="margin:0;padding-left:14px">
          ${s.lines.map(l =>
            `<li style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark);
              line-height:2;margin-bottom:1px">${l}</li>`
          ).join('')}
        </ul>
      </div>`).join('');
  },

  // ── Lista de movimientos agrupados por tipo ────────────────────────────────
  _renderMoveList() {
    if (typeof MOVE_POOL === 'undefined') return '<p>MOVE_POOL no disponible</p>';

    // Aplanar todos los movimientos de MOVE_POOL
    const allMoves = [];
    const seen = new Set();
    for (const [type, classes] of Object.entries(MOVE_POOL)) {
      for (const [dmgClass, moves] of Object.entries(classes)) {
        for (const move of Object.values(moves)) {
          if (!seen.has(move.id)) {
            seen.add(move.id);
            allMoves.push({ ...move, type, damageClass: dmgClass });
          }
        }
      }
    }

    // Agrupar por tipo
    const byType = {};
    for (const m of allMoves) {
      if (!byType[m.type]) byType[m.type] = [];
      byType[m.type].push(m);
    }

    return Object.entries(byType).sort(([a],[b]) => a.localeCompare(b)).map(([type, moves]) => `
      <div style="margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
          <span class="type-badge" data-type="${type}" style="font-size:6px;padding:2px 8px">${type.toUpperCase()}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${moves.sort((a,b) => (b.power??0)-(a.power??0)).map(m => {
            const effectIds = m.effectId ? (Array.isArray(m.effectId) ? m.effectId : [m.effectId]) : [];
            const effects   = typeof MOVE_EFFECTS !== 'undefined'
              ? effectIds.map(id => MOVE_EFFECTS[id]).filter(Boolean)
              : [];
            const triggerLabels = {
              'before-attack': 'ANTES',
              'after-attack':  'TRAS',
              'on-hitted':     'AL RECIBIR',
            };
            const effectDesc = effects.map(e => e.desc).filter(Boolean).join(' · ');
            return `
              <div class="comp-move-row" data-move-id="${m.id}"
                style="display:flex;align-items:center;gap:8px;padding:6px 10px;
                  background:var(--off-white);border:1px solid var(--grey-light);
                  border-radius:var(--radius-sm);cursor:pointer;position:relative">
                <!-- Clase de daño -->
                <span style="font-family:var(--font-pixel);font-size:4px;
                  color:${m.damageClass === 'special' ? 'var(--blue)' : 'var(--red)'};
                  border:1px solid currentColor;padding:1px 4px;border-radius:2px;flex-shrink:0">
                  ${m.damageClass === 'special' ? 'ESP' : 'FIS'}
                </span>
                <!-- Nombre -->
                <span style="font-family:var(--font-pixel);font-size:7px;flex:1">${m.name}</span>
                <!-- Poder -->
                <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">
                  POD:${m.power ?? '—'}
                </span>
                <!-- PP -->
                <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">
                  PP:${m.pp ?? '—'}
                </span>
                <!-- Efecto badge(s) -->
                ${effects.map(e => `
                  <span style="font-family:var(--font-pixel);font-size:4px;color:var(--blue);
                    border:1px solid var(--blue);padding:1px 4px;border-radius:2px;flex-shrink:0">
                    ${triggerLabels[e.trigger] ?? ''}
                  </span>`).join('')}
                <!-- Tooltip del efecto -->
                ${effectDesc ? `<div class="move-effect-tooltip">✦ ${effectDesc}</div>` : ''}
              </div>`;
          }).join('')}
        </div>
      </div>`).join('');
  },

  // ── Lista de objetos equipables (held-items.js) ────────────────────────────
  _renderHeldItemList() {
    if (typeof HELD_ITEMS === 'undefined') return '<p>HELD_ITEMS no disponible</p>';

    const triggerLabels = {
      'passive':        'PASIVO',
      'on-turn-start':  'INICIO DE TURNO',
    };

    return Object.values(HELD_ITEMS).map(item => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 10px;margin-bottom:6px;
        background:var(--off-white);border:1px solid var(--grey-light);border-radius:var(--radius-sm)">
        <img src="${item.img}" alt="${item.name}"
          style="width:28px;height:28px;image-rendering:pixelated;object-fit:contain;flex-shrink:0"
          onerror="this.outerHTML='<span style=font-size:22px>${item.fallbackIcon ?? '❓'}</span>'">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span style="font-family:var(--font-pixel);font-size:7px">${item.name}</span>
            <span style="font-family:var(--font-pixel);font-size:4px;color:var(--blue);
              border:1px solid var(--blue);padding:1px 4px;border-radius:2px;flex-shrink:0">
              ${triggerLabels[item.trigger] ?? ''}
            </span>
            ${item.blocksMoveChange ? `
              <span style="font-family:var(--font-pixel);font-size:4px;color:var(--red);
                border:1px solid var(--red);padding:1px 4px;border-radius:2px;flex-shrink:0">
                BLOQUEA MOVIMIENTO
              </span>` : ''}
          </div>
          <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark);line-height:1.8">
            ${item.desc}
          </span>
        </div>
      </div>`).join('');
  },

  // ── Detalle de movimiento: pokemon que lo usan ─────────────────────────────
  _renderMoveDetail(moveId) {
    if (typeof MOVE_POOL === 'undefined' || typeof POKEMON_DB === 'undefined') return;

    // Encontrar el movimiento
    let move = null;
    for (const classes of Object.values(MOVE_POOL)) {
      for (const moves of Object.values(classes)) {
        if (moves[moveId]) { move = moves[moveId]; break; }
      }
      if (move) break;
    }
    if (!move) return;

    // Encontrar pokemon que usan este movimiento — dinámico desde POKEMON_DB moveLines
    const users = [];
    for (const [name, data] of Object.entries(POKEMON_DB)) {
      const moveLines = data.moveLines ?? [];
      for (const line of moveLines) {
        const pool = MOVE_POOL[line.type]?.[line.damageClass] ?? {};
        if (pool[moveId]) {
          users.push({ name, types: data.types });
          break;
        }
      }
    }

    // Ordenar por número en KANTO_DEX
    const dexOrder = {};
    if (typeof KANTO_DEX !== 'undefined') {
      KANTO_DEX.forEach((e, i) => { dexOrder[e.name] = i; });
    }
    users.sort((a, b) => (dexOrder[a.name] ?? 999) - (dexOrder[b.name] ?? 999));

    const effectDesc = getEffectDescriptions(move);
    const vp     = document.getElementById('viewport');

    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;">

        <div class="screen-header" style="background:var(--blue)">
          <button class="btn btn--ghost screen-header__back" id="move-detail-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">${move.name.toUpperCase()}</span>
        </div>

        <div style="overflow-y:auto;flex:1;padding:var(--sp-md);display:flex;flex-direction:column;gap:var(--sp-md)">

          <!-- Info del movimiento -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="type-badge" data-type="${move.type}">${move.type.toUpperCase()}</span>
              <span style="font-family:var(--font-pixel);font-size:6px;
                color:${move.damageClass === 'special' ? 'var(--blue)' : 'var(--red)'};
                border:1px solid currentColor;padding:2px 6px;border-radius:3px">
                ${move.damageClass === 'special' ? 'ESPECIAL' : 'FÍSICO'}
              </span>
              <span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey-dark)">
                POD: ${move.power ?? '—'} · PP: ${move.pp ?? '—'}
              </span>
            </div>
            ${effectDesc ? `
              <div style="background:var(--off-white);border-radius:var(--radius-sm);
                padding:8px 10px;border-left:3px solid var(--blue)">
                <div style="font-family:var(--font-pixel);font-size:5px;color:var(--blue);margin-bottom:4px">EFECTO</div>
                <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);line-height:1.8">
                  ✦ ${effectDesc}
                </div>
              </div>` : ''}
          </div>

          <!-- Pokemon que lo usan -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);
              margin-bottom:var(--sp-md);letter-spacing:1px">
              POKEMON QUE LO USAN (${users.length})
            </div>
            ${users.length === 0
              ? `<span style="font-family:var(--font-pixel);font-size:6px;color:var(--grey)">Ninguno en el sistema</span>`
              : `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">
                  ${users.map(u => {
                    const dexEntry = typeof KANTO_DEX !== 'undefined'
                      ? KANTO_DEX.find(e => e.name === u.name)
                      : null;
                    const spriteUrl = dexEntry
                      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexEntry.id}.png`
                      : '';
                    const isCaught = typeof Storage !== 'undefined' && Storage.isCaught(u.name);
                    return `
                      <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;
                        background:var(--off-white);border-radius:var(--radius-sm);
                        border:1px solid var(--grey-light)">
                        <img src="${spriteUrl}" style="width:32px;height:32px;image-rendering:pixelated;
                          ${isCaught ? '' : 'filter:brightness(.15) grayscale(1)'}"
                          onerror="this.style.opacity=0">
                        <div style="flex:1;min-width:0">
                          <div style="font-family:var(--font-pixel);font-size:6px;
                            color:var(--black);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                            ${isCaught ? u.name.toUpperCase() : '???'}
                          </div>
                          <div style="display:flex;gap:3px;margin-top:2px">
                            ${u.types.map(t =>
                              `<span class="type-badge" data-type="${t}"
                                style="font-size:4px;padding:1px 4px">${t}</span>`
                            ).join('')}
                          </div>
                        </div>
                      </div>`;
                  }).join('')}
                </div>`}
          </div>
        </div>
      </div>`;

    document.getElementById('move-detail-back')
      .addEventListener('click', () => CompendiumScreen._renderMain());
  },
};
