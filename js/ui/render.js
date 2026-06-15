// Funciones de render reutilizables en todas las pantallas

const Render = {

  // HP bar HTML
  hpBar(current, max) {
    const pct   = Math.max(0, current / max);
    const level = pct > 0.5 ? 'high' : pct > 0.25 ? 'mid' : 'low';
    return `
      <div class="hp-bar-wrap">
        <div class="hp-bar-fill" data-level="${level}" style="width:${Math.round(pct*100)}%"></div>
      </div>`;
  },

  // Update existing HP bar in place
  updateHpBar(el, current, max) {
    const fill  = el.querySelector('.hp-bar-fill');
    if (!fill) return;
    const pct   = Math.max(0, current / max);
    const level = pct > 0.5 ? 'high' : pct > 0.25 ? 'mid' : 'low';
    fill.style.width = Math.round(pct * 100) + '%';
    fill.dataset.level = level;
  },

  // Type badge
  typeBadge(type) {
    return `<span class="type-badge" data-type="${type}">${type}</span>`;
  },

  typeBadges(types) {
    return types.map(t => this.typeBadge(t)).join('');
  },

  // Sprite img element
  sprite(url, alt, cls = '') {
    if (!url) return `<div class="loading-sprite ${cls}"></div>`;
    return `<img src="${url}" alt="${alt}" class="sprite ${cls}" onerror="this.style.opacity=0.3">`;
  },

  // Nature display with colored arrows
  natureDisplay(nature) {
    if (!nature.boost && !nature.lower) {
      return `<span style="color:var(--grey)">${nature.name}</span>`;
    }
    const labels = { atk:'ATK', def:'DEF', spa:'SPA', spd:'SPD', spe:'VEL' };
    return `${nature.name} <span class="nature-up">${labels[nature.boost]}↑</span> <span class="nature-down">${labels[nature.lower]}↓</span>`;
  },

  // Mini stat grid for pokemon card — acepta evs opcionales para mostrar +N
  statsGrid(stats, nature, evs = null) {
    const labels = [
      ['HP',  'hp',  false],
      ['ATK', 'atk', true],
      ['DEF', 'def', true],
      ['SPA', 'spa', true],
      ['SPD', 'spd', true],
      ['VEL', 'spe', true],
    ];
    return labels.map(([label, key, showNature]) => {
      let cls = '';
      if (showNature && nature) {
        if (nature.boost === key) cls = 'nature-up';
        if (nature.lower === key) cls = 'nature-down';
      }
      const evVal  = evs?.[key] ?? 0;
      const evHtml = evVal > 0
        ? `<span style="font-family:var(--font-pixel);font-size:5px;color:var(--blue);margin-left:2px">+${evVal}</span>`
        : '';
      return `<div class="starter-stat"><span class="${cls}">${stats[key]}</span>${evHtml} ${label}</div>`;
    }).join('');
  },

  // Log line with type
  logLine(text, type = '') {
    console.log(`[BATTLE] ${text}`);
    return `<div class="log-line log-line--${type}">${text}</div>`;
  },
};

// Icono de flecha "atrás" — curva tipo undo, reutilizable en headers
const BACK_ARROW_SVG = `<svg viewBox="0 0 24 24"><path d="M9 14 L4 9 L9 4"/><path d="M4 9 H15 A6 6 0 0 1 15 21 H11"/></svg>`;
