const NATURES = [
  { name: 'Hardy',   boost: null,  lower: null  },
  { name: 'Lonely',  boost: 'atk', lower: 'def' },
  { name: 'Brave',   boost: 'atk', lower: 'spe' },
  { name: 'Adamant', boost: 'atk', lower: 'spa' },
  { name: 'Naughty', boost: 'atk', lower: 'spd' },
  { name: 'Bold',    boost: 'def', lower: 'atk' },
  { name: 'Docile',  boost: null,  lower: null  },
  { name: 'Relaxed', boost: 'def', lower: 'spe' },
  { name: 'Impish',  boost: 'def', lower: 'spa' },
  { name: 'Lax',     boost: 'def', lower: 'spd' },
  { name: 'Timid',   boost: 'spe', lower: 'atk' },
  { name: 'Hasty',   boost: 'spe', lower: 'def' },
  { name: 'Serious', boost: null,  lower: null  },
  { name: 'Jolly',   boost: 'spe', lower: 'spa' },
  { name: 'Naive',   boost: 'spe', lower: 'spd' },
  { name: 'Modest',  boost: 'spa', lower: 'atk' },
  { name: 'Mild',    boost: 'spa', lower: 'def' },
  { name: 'Quiet',   boost: 'spa', lower: 'spe' },
  { name: 'Bashful', boost: null,  lower: null  },
  { name: 'Rash',    boost: 'spa', lower: 'spd' },
  { name: 'Calm',    boost: 'spd', lower: 'atk' },
  { name: 'Gentle',  boost: 'spd', lower: 'def' },
  { name: 'Sassy',   boost: 'spd', lower: 'spe' },
  { name: 'Careful', boost: 'spd', lower: 'spa' },
  { name: 'Quirky',  boost: null,  lower: null  },
];

const STAT_LABEL = { atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'VEL' };

function randomNature() {
  return NATURES[Math.floor(Math.random() * NATURES.length)];
}

function natureHTML(nature) {
  if (!nature.boost && !nature.lower) return `<span class="nature-neutral">${nature.name}</span>`;
  return `${nature.name} <span class="nature-up">${STAT_LABEL[nature.boost]} ↑</span> <span class="nature-down">${STAT_LABEL[nature.lower]} ↓</span>`;
}
