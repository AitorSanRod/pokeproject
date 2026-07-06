// ─────────────────────────────────────────────────────────────────────────────
// COMPENDIUM — referencia de efectos de estado, tipos y movimientos
// ─────────────────────────────────────────────────────────────────────────────

// Nombres de tipo en español (la clave es el id interno en inglés).
const TYPE_NAMES_ES = {
  normal:   'Normal',
  fire:     'Fuego',
  water:    'Agua',
  electric: 'Eléctrico',
  grass:    'Planta',
  ice:      'Hielo',
  fighting: 'Lucha',
  poison:   'Veneno',
  ground:   'Tierra',
  flying:   'Volador',
  psychic:  'Psíquico',
  bug:      'Bicho',
  rock:     'Roca',
  ghost:    'Fantasma',
  dragon:   'Dragón',
  dark:     'Siniestro',
  steel:    'Acero',
  fairy:    'Hada',
};

// Rutas de las imágenes PNG para los botones de tipo en la sección TIPOS.
// Si un tipo no tiene entrada aquí (o la imagen no existe), se usa la badge
// de color como fallback automáticamente.
const TYPE_BADGE_IMGS = {
  normal:   'assets/sprites/types/normal.png',
  fire:     'assets/sprites/types/fire.png',
  water:    'assets/sprites/types/water.png',
  electric: 'assets/sprites/types/electric.png',
  grass:    'assets/sprites/types/grass.png',
  ice:      'assets/sprites/types/ice.png',
  fighting: 'assets/sprites/types/fighting.png',
  poison:   'assets/sprites/types/poison.png',
  ground:   'assets/sprites/types/ground.png',
  flying:   'assets/sprites/types/flying.png',
  psychic:  'assets/sprites/types/psychic.png',
  bug:      'assets/sprites/types/bug.png',
  rock:     'assets/sprites/types/rock.png',
  ghost:    'assets/sprites/types/ghost.png',
  dragon:   'assets/sprites/types/dragon.png',
  dark:     'assets/sprites/types/dark.png',
  steel:    'assets/sprites/types/steel.png',
  fairy:    'assets/sprites/types/fairy.png',
};

const CompendiumScreen = {

  _returnFn: null,

  show(returnFn) {
    CompendiumScreen._returnFn = returnFn;
    CompendiumScreen._renderMain();
  },

  // ── Pantalla principal: secciones colapsables ─────────────────────────────
  _renderMain() {
    const vp = document.getElementById('viewport');

    const sec = (id, title, content) => `
      <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);box-shadow:var(--shadow-sm)">
        <button data-sec="${id}" style="width:100%;display:flex;align-items:center;justify-content:space-between;
          padding:var(--sp-md);background:none;border:none;cursor:pointer;text-align:left;gap:var(--sp-sm);
          border-radius:var(--radius-md)">
          <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);letter-spacing:1px">${title}</span>
          <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);flex-shrink:0">▶</span>
        </button>
        <div data-sec-body="${id}" style="display:none;padding:var(--sp-sm) var(--sp-md) var(--sp-md)">${content}</div>
      </div>`;

    vp.innerHTML = `
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;overflow:hidden">

        <div class="screen-header" style="background:var(--blue)">
          <button class="btn btn--ghost screen-header__back" id="comp-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">COMPENDIO</span>
        </div>

        <!-- scroll container: block (no flex) para que overflow-y:auto funcione -->
        <div style="overflow-y:auto;flex:1;min-height:0">
          <!-- layout container: flex separado del scroll -->
          <div style="display:flex;flex-direction:column;gap:var(--sp-md);padding:var(--sp-md)">
            ${sec('guide',  'GUÍA',              CompendiumScreen._renderGuide())}
            ${sec('stats',  'ESTADÍSTICAS',      CompendiumScreen._renderStatsList())}
            ${sec('status', 'EFECTOS DE ESTADO', CompendiumScreen._renderStatusList())}
            ${sec('types',  'TIPOS',             CompendiumScreen._renderTypeTest())}
            ${sec('moves',  'MOVIMIENTOS',        CompendiumScreen._renderMoveList())}
            ${sec('tms',    'MTS',               CompendiumScreen._renderTMList())}
            ${sec('items',  'OBJETOS EQUIPABLES', CompendiumScreen._renderHeldItemList())}
          </div>
        </div>
      </div>`;

    document.getElementById('comp-back')
      .addEventListener('click', () => CompendiumScreen._returnFn?.());

    vp.querySelectorAll('[data-sec]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id   = btn.dataset.sec;
        const body = vp.querySelector(`[data-sec-body="${id}"]`);
        const arrow = btn.querySelector('span:last-child');
        const open  = body.style.display !== 'none';
        body.style.display = open ? 'none' : 'block';
        arrow.textContent  = open ? '▶' : '▼';
      });
    });

    vp.querySelectorAll('[data-move-id]').forEach(el => {
      el.addEventListener('click', () => CompendiumScreen._renderMoveDetail(el.dataset.moveId));
    });

    vp.querySelectorAll('[data-select-type]').forEach(el => {
      el.addEventListener('click', () => {
        vp.querySelectorAll('[data-select-type]').forEach(b => b.classList.remove('tc-selected'));
        el.classList.add('tc-selected');
        CompendiumScreen._showTypeMatchup(el.dataset.selectType);
      });
    });
  },

  // ── Guía de juego ────────────────────────────────────────────────────────
  _renderGuide() {
    const sub = (title, color, items) => `
      <div style="border-radius:var(--radius-sm);border:1px solid ${color}22;
        background:${color}0d;padding:10px 12px;margin-bottom:8px">
        <div style="font-family:var(--font-pixel);font-size:7px;color:${color};
          letter-spacing:1px;margin-bottom:8px">${title}</div>
        <ul style="margin:0;padding-left:14px">
          ${items.map(l =>
            `<li style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
              line-height:2.2;margin-bottom:1px">${l}</li>`
          ).join('')}
        </ul>
      </div>`;

    return [

      sub('RUTAS Y CAMINOS', '#2980b9', [
        'Cada ruta presenta <strong>varios caminos</strong> entre los que elegir antes de empezar.',
        'Cada camino tiene una secuencia de encuentros: pokémon salvajes, entrenadores y/o puntos de curación.',
        'Los <strong>puntos de curación</strong> (Poción) permiten sanar al 100% un pokemon su vida y sus efectos alterados.',
        'En algunas rutas aparece un <strong>entrenador especial</strong>.',
        'Algunas pantallas de ciudad ofrecen un <strong>botón de ruta opcional</strong> que ofrece buenas recompensas.',
        'Al terminar una ruta, tus pokémon se curan completamente y podrás elegir entre 3 premios.',
        "Puedes elegir los movimientos que usa cada pokémon antes de seleccionar una ruta.",
        "Puedes ordenar tus pokémon antes de seleccionar un camino."
      ]),

      sub('COMBATE', '#8e44ad', [
        'El combate funciona en modo automático: <strong>Cada pokémon usa el ataque que hayas seleccionado</strong>.',
        'El <strong>orden de turno</strong> lo decide la Velocidad; los movimientos de <em>prioridad</em> siempre van primero.',
        'Si tu pokemon activo cae, el juego <strong>cambia automáticamente</strong> al siguiente vivo del equipo.',
        'Los <strong>objetos equipados</strong> se activan solos durante el combate sin necesidad de acción del jugador.',
        'Los <strong>efectos de estado</strong> (veneno, quemadura, parálisis…) se aplican al final del turno — consulta la sección "Efectos de Estado".',
      ]),

      sub('PREMIOS DE RUTA', '#e67e22', [
        'Al completar una ruta recibes <strong>3 tarjetas de premio</strong> entre las que elegir una (o pulsar CONTINUAR para saltarla).',
        '<strong>Pokemon</strong>: añade un nuevo pokemon a tu equipo. Si ya tienes 6, puedes intercambiar uno.',
        '<strong>Vitamina</strong>: sube +1 EV permanente en una estadística del pokemon que elijas. Esta mejora se mantiene entre runs.',
        '<strong>Rare Candy</strong>: sube 1 nivel a <strong>todos</strong> los pokemon del equipo a la vez.',
        '<strong>MT</strong>: enseña un movimiento nuevo a un pokemon compatible. La MT queda registrada permanentemente entre runs.',
        'Los 3 premios se barajan aleatoriamente en cada partida.',
      ]),

      sub('EQUIPO', '#16a085', [
        'Puedes llevar hasta <strong>6 pokemon</strong> en el equipo.',
        'Los pokemon pueden <strong>evolucionar</strong> al subir de nivel si se dan las condiciones.',
        'Al evolucionar, el pokemon conserva todos sus EVs y MTs aprendidas a lo largos de las partidas.',
        'El pokemon que lleves en primer slot es el que usas por defecto al empezar el combate.',
      ]),

      sub('POKÉDEX', '#2c3e50', [
        'La Pokédex <strong>persiste entre partidas</strong>: los pokemon que hayas visto o usado quedan registrados para siempre.',
        'Un pokemon se marca como <strong>visto</strong> en cuanto aparece en combate.',
        'Se marca como <strong>capturado</strong> cuando los capturas, no es necesario añadirlos al equipo.',
        'Los pokemon no capturados aparecen como <strong>siluetas</strong> en la Pokédex.',
        'Las <strong>evoluciones</strong> de un pokemon capturado se desbloquean en la Pokédex automáticamente al evolucionar.',
        'Desde la Pokédex puedes ver los <strong>movimientos</strong> de cada pokemon y qué entrenadores los usan.',
        'Puedes abrir la Pokédex <strong>durante una ruta</strong> desde el botón flotante sin perder el progreso.',
      ]),

      sub('EVS (PUNTOS DE ESFUERZO)', '#c0392b', [
        'Los EVs son bonificaciones permanentes que aumentan las estadísticas de un pokemon.',
        'Se consiguen <strong>eligiendo el premio de vitamina</strong> al terminar una ruta.',
        'Hay 6 estadísticas que pueden subir: HP, ATK, DEF, SPA (At. Esp.), SPD (Def. Esp.) y VEL (Velocidad).',
        'Máximo <strong>32 EVs por estadística</strong> y por cadena evolutiva.',
        'Los EVs se guardan por <strong>cadena evolutiva</strong>: si subes EVs a Bulbasaur, Ivysaur y Venusaur comparten esos EVs.',
        'Los EVs <strong>persisten entre partidas</strong> aunque pierdas o empieces de nuevo.',
      ]),

      sub('MTS (MÁQUINAS TÉCNICAS)', '#7f8c8d', [
        'Las MTs enseñan movimientos especiales que el pokemon no aprendería de forma natural.',
        'Se obtienen como <strong>premio de ruta</strong> al completar un camino.',
        'Solo pueden aprender una MT los pokemon <strong>del tipo correcto</strong> o los marcados específicamente como compatibles.',
        'Al recibir una MT, eliges a qué pokemon enseñársela desde el selector.',
        'Una MT aprendida <strong>persiste entre partidas</strong>: aunque pierdas la run, el movimiento sigue disponible si vuelves a usar ese pokemon.',
        'Si borras los datos de la Pokédex desde el menú de ajustes, los movimientos de MT también se eliminan.',
      ]),

      sub('QUÉ PERSISTE ENTRE PARTIDAS', '#34495e', [
        '<strong>Pokédex</strong>: todos los pokemon vistos y capturados quedan registrados para siempre.',
        '<strong>EVs</strong>: los puntos de esfuerzo acumulados por cadena evolutiva no se pierden nunca.',
        '<strong>MTs aprendidas</strong>: los movimientos enseñados por MT se conservan vinculados a la cadena evolutiva.',
        '<strong>Medallas de gimnasio</strong>: se registran en la Pokédex por cadena evolutiva (no en el equipo de la run).',
        'La <strong>partida activa</strong> (equipo, ruta actual, medallas de run) sí se pierde si sufres una derrota o inicias una nueva partida.',
        'Puedes borrar los datos permanentes (Pokédex, EVs, MTs, medallas) con el botón 🗑 en la esquina inferior izquierda.',
      ]),

    ].join('');
  },

  // ── Sección de estadísticas ───────────────────────────────────────────────
  _renderStatsList() {
    const stats = [
      {
        label: 'HP', color: '#27AE60', bg: '#EAFAF1',
        name: 'Puntos de Salud',
        lines: [
          'Vida total del pokemon.',
          'Llega a <strong>0</strong> → el pokemon se debilita y no puede seguir combatiendo.',
          'Se recupera al <strong>100%</strong> al terminar una ruta.',
          'Sube permanentemente con <strong>EVs de HP</strong>.',
        ],
      },
      {
        label: 'ATK', color: '#E74C3C', bg: '#FDEDEC',
        name: 'Ataque',
        lines: [
          'Potencia de los movimientos <strong>físicos</strong>.',
          'Reducida un <strong>50%</strong> mientras el pokemon sufre <em>quemadura</em>.',
          'Puede subir o bajar durante el combate por efectos de movimientos.',
        ],
      },
      {
        label: 'DEF', color: '#E67E22', bg: '#FEF9E7',
        name: 'Defensa',
        lines: [
          'Reduce el daño recibido de movimientos <strong>físicos</strong>.',
          'Puede subir o bajar durante el combate por efectos de movimientos.',
        ],
      },
      {
        label: 'SPA', color: '#8E44AD', bg: '#F5EEF8',
        name: 'Ataque Especial',
        lines: [
          'Potencia de los movimientos <strong>especiales</strong>.',
          'Reducida un <strong>50%</strong> mientras el pokemon está <em>congelado</em>.',
          'Puede subir o bajar durante el combate por efectos de movimientos.',
        ],
      },
      {
        label: 'SPD', color: '#2980B9', bg: '#EBF5FB',
        name: 'Defensa Especial',
        lines: [
          'Reduce el daño recibido de movimientos <strong>especiales</strong>.',
          'Puede subir o bajar durante el combate por efectos de movimientos.',
        ],
      },
      {
        label: 'VEL', color: '#16A085', bg: '#E8F8F5',
        name: 'Velocidad',
        lines: [
          'Determina el <strong>orden de turno</strong>: mayor VEL ataca primero.',
          'Reducida un <strong>50%</strong> mientras el pokemon está <em>paralizado</em>.',
          'Los movimientos con <em>prioridad</em> siempre actúan antes, independientemente de la VEL.',
        ],
      },
    ];

    return stats.map(s => `
      <div style="border-radius:var(--radius-sm);border:1px solid ${s.color};
        background:${s.bg};padding:10px 12px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-family:var(--font-pixel);font-size:8px;color:${s.color};
            background:white;border:1px solid ${s.color};padding:2px 7px;border-radius:3px;flex-shrink:0">
            ${s.label}
          </span>
          <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark)">${s.name}</span>
        </div>
        <ul style="margin:0;padding-left:14px">
          ${s.lines.map(l =>
            `<li style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
              line-height:2.2;margin-bottom:1px">${l}</li>`
          ).join('')}
        </ul>
      </div>`
    ).join('');
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
      {
        id: 'confusion', icon: '💫', label: 'CNF', color: '#7d22e6', bg: '#F3E9FE',
        lines: [
          'Dura un máximo de <strong>5 turnos</strong>.',
          'Cada turno: <strong>33%</strong> de curarse espontáneamente.',
          'Si no se cura: <strong>50%</strong> de golpearse a sí mismo (Normal físico, 60 base).',
          'El autogolpe <strong>ignora inmunidades de tipo</strong> (afecta a todos).',
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
            `<li style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);
              line-height:2;margin-bottom:1px">${l}</li>`
          ).join('')}
        </ul>
      </div>`).join('');
  },

  // ── Sección interactiva: selecciona un tipo y ve sus matchups ────────────
  _renderTypeTest() {
    const allTypes = [
      'normal','fire','water','electric','grass','ice','fighting','poison',
      'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy',
    ];

    const badges = allTypes.map(t => {
      const imgSrc = TYPE_BADGE_IMGS[t];
      const imgTag = imgSrc
        ? `<img src="${imgSrc}" class="tc-type-btn__img" onerror="this.remove()">`
        : '';
      return `
        <div class="tc-type-btn tc-selector" data-type="${t}" data-select-type="${t}">
          <span class="type-badge tc-type-btn__badge" data-type="${t}">${TYPE_NAMES_ES[t] ?? t.toUpperCase()}</span>
          ${imgTag}
        </div>`;
    }).join('');

    return `
      <p style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);margin-bottom:10px">
        Pulsa un tipo para ver sus matchups como defensor y atacante:
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">${badges}</div>
      <div id="type-matchup-result"></div>`;
  },

  _showTypeMatchup(type) {
    const allTypes = [
      'normal','fire','water','electric','grass','ice','fighting','poison',
      'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy',
    ];

    const multLabel = m => ({ 4:'×4', 2:'×2', 0.5:'×½', 0.25:'×¼', 0:'×0' }[m] ?? `×${m}`);
    const multCls   = m => m >= 4 ? 'super' : m >= 2 ? 'weak' : m === 0 ? 'immune' : m <= 0.25 ? 'ultra' : 'resist';

    const renderCol = items => items.length
      ? items.map(({ t }) =>
          `<span class="type-badge tc-atk-badge" data-type="${t}">${TYPE_NAMES_ES[t] ?? t.toUpperCase()}</span>`
        ).join('')
      : '<span class="tc-none">—</span>';

    // Perspectiva defensora: ataques entrantes vs este tipo
    const defWeak = [], defResist = [], defImmune = [];
    for (const atk of allTypes) {
      const mul = TYPE_CHART[atk]?.[type] ?? 1;
      if      (mul >= 2)           defWeak.push({ t: atk, mul });
      else if (mul > 0 && mul < 1) defResist.push({ t: atk, mul });
      else if (mul === 0)          defImmune.push({ t: atk, mul });
    }
    defWeak.sort((a, b)   => b.mul - a.mul);
    defResist.sort((a, b) => a.mul - b.mul);

    // Perspectiva atacante: qué hace este tipo contra los demás
    const atkSE = [], atkNVE = [], atkZero = [];
    for (const def of allTypes) {
      const mul = TYPE_CHART[type]?.[def] ?? 1;
      if      (mul >= 2)           atkSE.push({ t: def, mul });
      else if (mul > 0 && mul < 1) atkNVE.push({ t: def, mul });
      else if (mul === 0)          atkZero.push({ t: def, mul });
    }
    atkSE.sort((a, b)   => b.mul - a.mul);
    atkNVE.sort((a, b) => a.mul - b.mul);

    const card = (roleLabel, colHeads, cols) => `
      <div class="tc-card" style="margin-bottom:10px">
        <div class="tc-card__header">
          <span class="type-badge tc-card__defender-badge" data-type="${type}">${TYPE_NAMES_ES[type] ?? type.toUpperCase()}</span>
          <span class="tc-card__defender-label">${roleLabel}</span>
        </div>
        <div class="tc-card__table">
          ${cols.map((items, i) => `
            <div class="tc-col ${i === 0 ? 'tc-col--weak' : i === 1 ? 'tc-col--resist' : 'tc-col--immune'}">
              <div class="tc-col__head">${colHeads[i]}</div>
              <div class="tc-col__body">${renderCol(items)}</div>
            </div>`).join('')}
        </div>
      </div>`;

    const html =
      card('DEFENSOR', ['Débil a (×2)', 'Resiste (×½)', 'Inmune (×0)'],          [defWeak, defResist, defImmune]) +
      card('ATACANTE', ['Super eficaz (×2)', 'Poco eficaz (×½)', 'Sin efecto (×0)'], [atkSE,   atkNVE,   atkZero]);

    const result = document.getElementById('type-matchup-result');
    if (result) result.innerHTML = html;
  },

  // ── Tabla defensiva de tipos ──────────────────────────────────────────────
  _renderTypeChart() {
    const allTypes = [
      'normal','fire','water','electric','grass','ice','fighting','poison',
      'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy',
    ];

    const chart = {
      normal:   { ghost:0, fighting:2 },
      fire:     { fire:.5, grass:.5, ice:.5, bug:.5, steel:.5, fairy:.5, water:2, ground:2, rock:2 },
      water:    { fire:.5, water:.5, ice:.5, steel:.5, electric:2, grass:2 },
      electric: { electric:.5, flying:.5, steel:.5, ground:2 },
      grass:    { water:.5, electric:.5, grass:.5, ground:.5, fire:2, ice:2, poison:2, flying:2, bug:2 },
      ice:      { ice:.5, fire:2, fighting:2, rock:2, steel:2 },
      fighting: { rock:.5, bug:.5, dark:.5, flying:2, psychic:2, fairy:2 },
      poison:   { grass:.5, fighting:.5, poison:.5, bug:.5, fairy:.5, ground:2, psychic:2 },
      ground:   { poison:.5, rock:.5, electric:0, water:2, grass:2, ice:2 },
      flying:   { grass:.5, fighting:.5, bug:.5, ground:0, electric:2, ice:2, rock:2 },
      psychic:  { fighting:.5, psychic:.5, bug:2, ghost:2, dark:2 },
      bug:      { grass:.5, fighting:.5, ground:.5, fire:2, flying:2, rock:2 },
      rock:     { normal:.5, fire:.5, poison:.5, flying:.5, water:2, grass:2, fighting:2, ground:2, steel:2 },
      ghost:    { normal:0, fighting:0, poison:.5, bug:.5, ghost:2, dark:2 },
      dragon:   { fire:.5, water:.5, electric:.5, grass:.5, ice:2, dragon:2, fairy:2 },
      dark:     { psychic:0, ghost:.5, dark:.5, fighting:2, bug:2, fairy:2 },
      steel:    { normal:.5, grass:.5, ice:.5, flying:.5, psychic:.5, bug:.5, rock:.5, dragon:.5, steel:.5, fairy:.5, poison:0, fire:2, fighting:2, ground:2 },
      fairy:    { dragon:0, fighting:.5, bug:.5, dark:.5, poison:2, steel:2 },
    };

    const multLabel = m => ({ 4:'×4', 2:'×2', 0.5:'×½', 0.25:'×¼', 0:'×0' }[m] ?? `×${m}`);
    const multCls   = m => m >= 4 ? 'super' : m >= 2 ? 'weak' : m === 0 ? 'immune' : m <= 0.25 ? 'ultra' : 'resist';

    const renderCol = items => items.length
      ? items.map(({ atk, mul }) => `
          <div class="tc-row">
            <span class="type-badge tc-atk-badge" data-type="${atk}">${atk.toUpperCase()}</span>
            <span class="tc-mult tc-mult--${multCls(mul)}">${multLabel(mul)}</span>
          </div>`).join('')
      : '<span class="tc-none">—</span>';

    return allTypes.map(type => {
      const entries = chart[type] ?? {};
      const weak    = [];
      const resist  = [];
      const immune  = [];

      for (const [atk, mul] of Object.entries(entries)) {
        if (mul === 0)    immune.push({ atk, mul });
        else if (mul < 1) resist.push({ atk, mul });
        else              weak.push({ atk, mul });
      }
      weak.sort((a, b)   => b.mul - a.mul);
      resist.sort((a, b) => a.mul - b.mul);

      return `
        <div class="tc-card">
          <div class="tc-card__header">
            <span class="type-badge tc-card__defender-badge" data-type="${type}">${TYPE_NAMES_ES[type] ?? type.toUpperCase()}</span>
            <span class="tc-card__defender-label">◄ DEFENSOR</span>
          </div>
          <div class="tc-card__table">
            <div class="tc-col tc-col--weak">
              <div class="tc-col__head">Débil a</div>
              <div class="tc-col__body">${renderCol(weak)}</div>
            </div>
            <div class="tc-col tc-col--resist">
              <div class="tc-col__head">Resiste</div>
              <div class="tc-col__body">${renderCol(resist)}</div>
            </div>
            <div class="tc-col tc-col--immune">
              <div class="tc-col__head">Inmune</div>
              <div class="tc-col__body">${renderCol(immune)}</div>
            </div>
          </div>
        </div>`;
    }).join('');
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
          <span class="type-badge" data-type="${type}" style="font-size:8px;padding:2px 8px">${type.toUpperCase()}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${moves
            .sort((a,b) => {
              if (a.damageClass !== b.damageClass)
                return a.damageClass === 'special' ? -1 : 1;
              return (a.power ?? 0) - (b.power ?? 0);
            })
            .map(m => {
              const hasEffect = !!m.effectId;
              const effectIds = hasEffect ? (Array.isArray(m.effectId) ? m.effectId : [m.effectId]) : [];
              const effects   = typeof MOVE_EFFECTS !== 'undefined'
                ? effectIds.map(id => MOVE_EFFECTS[id]).filter(Boolean)
                : [];
              const effectDesc = effects.map(e => e.desc).filter(Boolean).join('<br>');
              return `
                <div class="comp-move-row" data-move-id="${m.id}"
                  style="display:flex;align-items:center;gap:8px;padding:6px 10px;
                    background:var(--off-white);border:1px solid var(--grey-light);
                    border-radius:var(--radius-sm);cursor:pointer;position:relative">
                  <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;
                    background:${m.damageClass === 'special' ? 'var(--blue)' : 'var(--red)'}"></span>
                  <span style="font-family:var(--font-pixel);font-size:7px;flex:1">${m.name}</span>
                  <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">
                    POD:${m.power ?? '—'}
                  </span>
                  ${hasEffect ? `<span style="color:var(--yellow);font-size:10px;line-height:1;flex-shrink:0">★</span>` : `<span style="width:10px;flex-shrink:0"></span>`}
                  ${effectDesc ? `<div class="move-effect-tooltip">✦ ${effectDesc}</div>` : ''}
                </div>`;
            }).join('')}
        </div>
      </div>`).join('');
  },

  // ── Lista de objetos equipables (held-items.js) ────────────────────────────
  _renderHeldItemList() {
    if (typeof HELD_ITEMS === 'undefined') return '<p>HELD_ITEMS no disponible</p>';

    const collected = (typeof Storage !== 'undefined') ? Storage.getCollectedItems() : {};

    return Object.entries(HELD_ITEMS).map(([id, item]) => {
      const obtained = collected[id] === true;
      return `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;margin-bottom:6px;
        background:var(--off-white);border:1px solid var(--grey-light);border-radius:var(--radius-sm);
        ${obtained ? '' : 'opacity:0.55'}">
        <img src="${item.img}" alt="${item.name}"
          style="width:28px;height:28px;image-rendering:pixelated;object-fit:contain;flex-shrink:0;
            ${obtained ? '' : 'filter:brightness(.15) grayscale(1)'}"
          onerror="this.outerHTML='<span style=font-size:22px;${obtained ? '' : 'filter:brightness(.15) grayscale(1)'}'>${item.fallbackIcon ?? '❓'}</span>'">
        <div style="flex:1">
          <span style="font-family:var(--font-pixel);font-size:12px;color:var(--grey-dark);line-height:1.8">
            ${item.name}
          </span>
          <br>
          <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark);line-height:1.8">
            ${obtained ? item.desc : '???'}
          </span>
        </div>
      </div>`;
    }).join('');
  },

  // ── Lista de MTs agrupadas por tipo ──────────────────────────────────────
  _renderTMList() {
    if (typeof TM_LIST === 'undefined') return '<p>TM_LIST no disponible</p>';

    // Agrupar por tipo del movimiento
    const byType = {};
    for (const tm of Object.values(TM_LIST)) {
      const move = (typeof MOVE_BY_ID !== 'undefined') ? MOVE_BY_ID[tm.moveId] : null;
      const type = move?.type ?? 'normal';
      if (!byType[type]) byType[type] = [];
      byType[type].push({ tm, move });
    }

    return Object.entries(byType)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, entries]) => `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:center;margin-bottom:6px">
            <span class="type-badge" data-type="${type}" style="font-size:8px;padding:2px 8px">
              ${TYPE_NAMES_ES[type] ?? type.toUpperCase()}
            </span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px">
            ${entries.map(({ tm, move }) => {
              const dmgClass   = move?.damageClass ?? null;
              const power      = move?.power ?? null;
              const effectIds  = move?.effectId
                ? (Array.isArray(move.effectId) ? move.effectId : [move.effectId])
                : [];
              const effectDesc = (typeof MOVE_EFFECTS !== 'undefined')
                ? effectIds.map(id => MOVE_EFFECTS[id]?.desc).filter(Boolean).join('<br>')
                : '';
              return `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;
                  background:var(--off-white);border:1px solid var(--grey-light);
                  border-radius:var(--radius-sm);position:relative">
                  <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;
                    background:${dmgClass === 'special' ? 'var(--blue)' : 'var(--red)'}"></span>
                  <span style="font-family:var(--font-pixel);font-size:7px;color:var(--grey-dark);flex:1">
                    ${tm.name}
                  </span>
                  ${effectDesc ? `<span style="color:var(--yellow);font-size:10px;line-height:1;flex-shrink:0">★</span>` : `<span style="width:10px;flex-shrink:0"></span>`}
                  <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey);flex-shrink:0">
                    POD:${power ?? '—'}
                  </span>
                  ${effectDesc ? `<div class="move-effect-tooltip">✦ ${effectDesc}</div>` : ''}
                </div>`;
            }).join('')}
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
      <div class="screen" style="background:var(--off-white);display:flex;flex-direction:column;overflow:hidden">

        <div class="screen-header" style="background:var(--blue)">
          <button class="btn btn--ghost screen-header__back" id="move-detail-back">${BACK_ARROW_SVG}</button>
          <span class="screen-header__title">${move.name.toUpperCase()}</span>
        </div>

        <div style="overflow-y:auto;flex:1;min-height:0">
        <div style="padding:var(--sp-md);display:flex;flex-direction:column;gap:var(--sp-md)">

          <!-- Info del movimiento -->
          <div style="background:var(--white);border:var(--border);border-radius:var(--radius-md);
            padding:var(--sp-md);box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="type-badge" data-type="${move.type}">${move.type.toUpperCase()}</span>
              <span style="font-family:var(--font-pixel);font-size:8px;
                color:${move.damageClass === 'special' ? 'var(--blue)' : 'var(--red)'};
                border:1px solid currentColor;padding:2px 6px;border-radius:3px">
                ${move.damageClass === 'special' ? 'ESPECIAL' : 'FÍSICO'}
              </span>
              <span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey-dark)">
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
              ? `<span style="font-family:var(--font-pixel);font-size:8px;color:var(--grey)">Ninguno en el sistema</span>`
              : `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">
                  ${users.map(u => {
                    const dexEntry = typeof KANTO_DEX !== 'undefined'
                      ? KANTO_DEX.find(e => e.name === u.name)
                      : null;
                    const spriteUrl = dexEntry ? getDexSpriteUrl(dexEntry.id) : '';
                    const isCaught = typeof Storage !== 'undefined' && Storage.isCaught(u.name);
                    return `
                      <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;
                        background:var(--off-white);border-radius:var(--radius-sm);
                        border:1px solid var(--grey-light)">
                        <img src="${spriteUrl}" style="width:32px;height:32px;image-rendering:pixelated;
                          ${isCaught ? '' : 'filter:brightness(.15) grayscale(1)'}"
                          onerror="this.style.opacity=0">
                        <div style="flex:1;min-width:0">
                          <div style="font-family:var(--font-pixel);font-size:8px;
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
        </div>
      </div>`;

    document.getElementById('move-detail-back')
      .addEventListener('click', () => CompendiumScreen._renderMain());
  },
};
