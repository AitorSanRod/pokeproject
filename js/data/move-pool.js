// ─────────────────────────────────────────────────────────────────────────────
// MOVE POOL — catálogo de movimientos por tipo y clase
//
// Usa TYPES y DAMAGE_CLASS en vez de strings para evitar errores tipográficos.
// Uso: type: TYPES.FIRE, damageClass: DAMAGE_CLASS.SPECIAL
// 
// mt: true hace que el movimiento solo se pueda aprender por mt
// 
// ─────────────────────────────────────────────────────────────────────────────

// Lista cerrada de tipos de pokemon válidos
var TYPES = Object.freeze({
  NORMAL: 'normal',
  FIRE: 'fire',
  WATER: 'water',
  GRASS: 'grass',
  ELECTRIC: 'electric',
  ICE: 'ice',
  FIGHTING: 'fighting',
  POISON: 'poison',
  GROUND: 'ground',
  FLYING: 'flying',
  PSYCHIC: 'psychic',
  BUG: 'bug',
  ROCK: 'rock',
  GHOST: 'ghost',
  DRAGON: 'dragon',
  DARK: 'dark',
  STEEL: 'steel',
  FAIRY: 'fairy',
});

// Lista cerrada de clases de daño válidas
var DAMAGE_CLASS = Object.freeze({
  PHYSICAL: 'physical',
  SPECIAL: 'special',
});

var MOVE_POOL = {
  normal: {
    physical: [
      { stage: 1, id: 'tackle', name: 'Placaje', power: 40, pp: 35, type: 'normal', damageClass: 'physical' },
      { stage: 2, id: 'extreme-speed', name: 'Velocidad Extrema', power: 70, pp: 15, type: 'normal', damageClass: 'physical', effectId: 'priority' },
      { stage: 3, id: 'hyper-fang', name: 'Hiper Colmillo', power: 90, pp: 15, type: 'normal', damageClass: 'physical', effectId: 'shield-10' },
      { id: 'self-destruct', name: 'Autodestruccion', power: 400, pp: 5, type: 'normal', damageClass: 'physical', effectId: 'self-destruct', boss: true },
      { id: 'false-swipe', name: 'Sonambulo', power: 5, pp: 100, type: 'normal', damageClass: 'physical', effectId: ['recoil-10', 'shield-25', 'sleep-self', 'sleep-attack'], boss: true },
    ],
    special: [
      { stage: 1, id: 'swift', name: 'Velocidad', power: 60, pp: 20, type: 'normal', damageClass: 'special', effectId: 'shield-10' },
      { stage: 2, id: 'hyper-voice', name: 'Vozarrón', power: 90, pp: 10, type: 'normal', damageClass: 'special', effectId: 'shield-25' },
      { stage: 3, id: 'boomburst', name: 'Estruendo', power: 140, pp: 10, type: 'normal', damageClass: 'special', effectId: 'shield-50' },
      { id: 'tri-attack', name: 'Triataque ', power: 80, pp: 10, type: 'normal', damageClass: 'special', effectId: ['burn-10', 'paralize-10', 'freeze-10', 'drain-10'], boss: true },
    ],
  },
  fire: {
    physical: [
      { stage: 1, id: 'flame-wheel', name: 'Rueda Fuego', power: 60, pp: 25, type: 'fire', damageClass: 'physical' },
      { stage: 2, id: 'fire-fang', name: 'Colmillo Igneo', power: 65, pp: 15, type: 'fire', damageClass: 'physical' },
      { stage: 3, id: 'flare-blitz', name: 'Llamarada', power: 120, pp: 15, type: 'fire', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'ember', name: 'Ascuas', power: 40, pp: 25, type: 'fire', damageClass: 'special', effectId: 'burn-10' },
      { stage: 2, id: 'flamethrower', name: 'Lanzallamas', power: 90, pp: 15, type: 'fire', damageClass: 'special', effectId: 'burn-20' },
      { stage: 3, id: 'fire-blast', name: 'Sofoco', power: 110, pp: 5, type: 'fire', damageClass: 'special', effectId: 'burn-25' },
    ],
  },
  water: {
    physical: [
      { stage: 1, id: 'waterfall', name: 'Cascada', power: 50, pp: 15, type: 'water', damageClass: 'physical', effectId: 'raise-atk-20' },
      { stage: 2, id: 'crabhammer', name: 'Martillazo', power: 70, pp: 10, type: 'water', damageClass: 'physical' },
      { stage: 3, id: 'wave-crash', name: 'Envite acuatico', power: 110, pp: 10, type: 'water', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'water-gun', name: 'Pistola Agua', power: 40, pp: 25, type: 'water', damageClass: 'special', effectId: 'raise-spa-10' },
      { stage: 2, id: 'surf', name: 'Surf', power: 90, pp: 15, type: 'water', damageClass: 'special' },
      { stage: 3, id: 'hydro-pump', name: 'Hidrobomba', power: 110, pp: 5, type: 'water', damageClass: 'special' },
    ],
  },
  grass: {
    physical: [
      { stage: 1, id: 'vine-whip', name: 'Latigo Cepa', power: 45, pp: 25, type: 'grass', damageClass: 'physical' },
      { stage: 2, id: 'razor-leaf', name: 'Hoja afilada', power: 55, pp: 25, type: 'grass', damageClass: 'physical' },
      { stage: 3, id: 'wood-hammer', name: 'Mazazo', power: 120, pp: 15, type: 'grass', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'absorb', name: 'Absorber', power: 40, pp: 25, type: 'grass', damageClass: 'special', effectId: 'drain-10' },
      { stage: 2, id: 'magical-leaf', name: 'Hoja Magica', power: 60, pp: 99, type: 'grass', damageClass: 'special', effectId: 'sleep-15' },
      { stage: 3, id: 'solar-beam', name: 'Rayo Solar', power: 120, pp: 99, type: 'grass', damageClass: 'special' },
      { stage: 4, mt: true, id: 'giga-drain', name: 'Gigadrenado', power: 60, pp: 99, type: 'grass', damageClass: 'special', effectId: 'drain-50'  },
    ],
  },
  electric: {
    physical: [
      { stage: 1, id: 'thunder-punch', name: 'Puño Trueno', power: 75, pp: 15, type: 'electric', damageClass: 'physical', effectId: 'paralize-25' },
      { stage: 2, id: 'wild-charge', name: 'Voltiocruel', power: 90, pp: 15, type: 'electric', damageClass: 'physical' },
      { stage: 3, id: 'volt-tackle', name: 'Placaje Eléctrico', power: 120, pp: 15, type: 'electric', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'thunder-shock', name: 'Impactrueno', power: 40, pp: 30, type: 'electric', damageClass: 'special', effectId: 'paralize-25' },
      { stage: 2, id: 'thunderbolt', name: 'Rayo', power: 90, pp: 15, type: 'electric', damageClass: 'special' },
      { stage: 3, id: 'thunder', name: 'Trueno', power: 110, pp: 10, type: 'electric', damageClass: 'special' },
    ],
  },
  ice: {
    physical: [
      { stage: 1, id: 'ice-punch', name: 'Puño Hielo', power: 75, pp: 15, type: 'ice', damageClass: 'physical' },
      { stage: 2, id: 'ice-fang', name: 'Colmillo Hielo', power: 65, pp: 15, type: 'ice', damageClass: 'physical' },
      { stage: 3, id: 'icicle-crash', name: 'Alud', power: 85, pp: 10, type: 'ice', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'powder-snow', name: 'Polvo de Nieve', power: 40, pp: 25, type: 'ice', damageClass: 'special' },
      { stage: 2, id: 'ice-beam', name: 'Rayo Hielo', power: 90, pp: 10, type: 'ice', damageClass: 'special' },
      { stage: 3, id: 'blizzard', name: 'Ventisca', power: 110, pp: 5, type: 'ice', damageClass: 'special' },
    ],
  },
  fighting: {
    physical: [
      { stage: 1, id: 'karate-chop', name: 'Golpe Karate', power: 50, pp: 25, type: 'fighting', damageClass: 'physical', effectId: 'raise-atk-20' },
      { stage: 2, id: 'brick-break', name: 'Romperrocas', power: 75, pp: 15, type: 'fighting', damageClass: 'physical' },
      { stage: 3, id: 'close-combat', name: 'A Bocajarro', power: 120, pp: 5, type: 'fighting', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'vacuum-wave', name: 'Onda Vacio', power: 40, pp: 30, type: 'fighting', damageClass: 'special' },
      { stage: 2, id: 'aura-sphere', name: 'Esfera Aural', power: 80, pp: 20, type: 'fighting', damageClass: 'special' },
      { stage: 3, id: 'focus-blast', name: 'Onda Certera', power: 120, pp: 5, type: 'fighting', damageClass: 'special' },
    ],
  },
  poison: {
    physical: [
      { stage: 1, id: 'poison-sting', name: 'Aguijon Toxico', power: 35, pp: 35, type: 'poison', damageClass: 'physical', effectId: 'poison-25' },
      { stage: 2, id: 'poison-jab', name: 'Puya Nociva', power: 75, pp: 20, type: 'poison', damageClass: 'physical', effectId: 'poison-50' },
      { stage: 3, id: 'gunk-shot', name: 'Lanza Mugre', power: 120, pp: 5, type: 'poison', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'poison-powder', name: 'Polvo Veneno', power: 50, pp: 35, type: 'poison', damageClass: 'special', effectId: 'poison-25' },
      { stage: 2, id: 'sludge-bomb', name: 'Bomba Lodo', power: 90, pp: 10, type: 'poison', damageClass: 'special' },
      { stage: 3, id: 'sludge-wave', name: 'Onda Toxica', power: 95, pp: 10, type: 'poison', damageClass: 'special' },
    ],
  },
  ground: {
    physical: [
      { stage: 1, id: 'bulldoze', name: 'Terratemblor', power: 60, pp: 20, type: 'ground', damageClass: 'physical' },
      { stage: 2, id: 'stomping-tantrum', name: 'Pataleta', power: 85, pp: 10, type: 'ground', damageClass: 'physical' },
      { stage: 3, id: 'earthquake', name: 'Terremoto', power: 100, pp: 10, type: 'ground', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'mud-shot', name: 'Disparo Lodo', power: 55, pp: 15, type: 'ground', damageClass: 'special' },
      { stage: 2, id: 'earth-power', name: 'Tierra Viva', power: 90, pp: 10, type: 'ground', damageClass: 'special' },
      { stage: 3, id: 'sandsear-storm', name: 'Simún de Arena', power: 100, pp: 5, type: 'ground', damageClass: 'special' },
    ],
  },
  flying: {
    physical: [
      { stage: 1, id: 'peck', name: 'Picotazo', power: 35, pp: 35, type: 'flying', damageClass: 'physical', effectId: 'lower-atk-10' },
      { stage: 2, id: 'wing-attack', name: 'Ataque Ala', power: 60, pp: 35, type: 'flying', damageClass: 'physical' },
      { stage: 3, id: 'brave-bird', name: 'Pajaro Osado', power: 120, pp: 15, type: 'flying', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'gust', name: 'Tornado', power: 40, pp: 35, type: 'flying', damageClass: 'special', effectId: 'lower-atk-10' },
      { stage: 2, id: 'air-slash', name: 'Tajo Aereo', power: 75, pp: 20, type: 'flying', damageClass: 'special' },
      { stage: 3, id: 'hurricane', name: 'Huracan', power: 110, pp: 10, type: 'flying', damageClass: 'special' },
    ],
  },
  psychic: {
    physical: [
      { stage: 1, id: 'zen-headbutt', name: 'Cabezazo Zen', power: 80, pp: 15, type: 'psychic', damageClass: 'physical' },
      { stage: 2, id: 'psycho-cut', name: 'Psicucuchilla', power: 70, pp: 20, type: 'psychic', damageClass: 'physical' },
      { stage: 3, id: 'photo-geyser', name: 'Fotogeyser', power: 100, pp: 10, type: 'psychic', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'confusion', name: 'Confusion', power: 20, pp: 25, type: 'psychic', damageClass: 'special', effectId: 'double-hit' },
      { stage: 2, id: 'psychic', name: 'Psiquico', power: 70, pp: 10, type: 'psychic', damageClass: 'special', effectId: 'clear' },
      { stage: 3, id: 'psystrike', name: 'Golpe Psi', power: 100, pp: 10, type: 'psychic', damageClass: 'special' },
      { id: 'teleport', name: 'Teletransporte', power: 0, pp: 99, type: 'psychic', damageClass: 'special', boss: true },
      { id: 'trick', name: 'Truco', power: 30, pp: 99, type: 'psychic', damageClass: 'special', boss: true, effectId: ['clear', 'sleep', 'lower-spd-20'] },
    ],
  },
  bug: {
    physical: [
      { stage: 1, id: 'bug-bite', name: 'Picadura', power: 35, pp: 20, type: 'bug', damageClass: 'physical', effectId: 'recoil-10' },
      { stage: 2, id: 'x-scissor', name: 'Tijera X', power: 65, pp: 15, type: 'bug', damageClass: 'physical', effectId: 'recoil-10' },
      { stage: 3, id: 'megahorn', name: 'Megacuerno', power: 90, pp: 10, type: 'bug', damageClass: 'physical', },
    ],
    special: [
      { stage: 1, id: 'infestation', name: 'Infestacion', power: 20, pp: 20, type: 'bug', damageClass: 'special' },
      { stage: 2, id: 'signal-beam', name: 'Rayo Señal', power: 75, pp: 15, type: 'bug', damageClass: 'special' },
      { stage: 3, id: 'bug-buzz', name: 'Zumbido', power: 100, pp: 10, type: 'bug', damageClass: 'special' },
    ],
  },
  rock: {
    physical: [
      { stage: 1, id: 'rock-throw', name: 'Lanzarrocas', power: 50, pp: 15, type: 'rock', damageClass: 'physical', effectId: 'flinch-20' },
      { stage: 2, id: 'rock-slide', name: 'Avalancha', power: 75, pp: 10, type: 'rock', damageClass: 'physical', effectId: 'flinch-20' },
      { stage: 3, id: 'stone-edge', name: 'Roca Afilada', power: 100, pp: 5, type: 'rock', damageClass: 'physical', effectId: 'flinch-30' },
    ],
    special: [
      { stage: 1, id: 'power-gem', name: 'Joya de Luz', power: 80, pp: 20, type: 'rock', damageClass: 'special' },
      { stage: 2, id: 'tar-shot', name: 'Alquitranazo', power: 60, pp: 15, type: 'rock', damageClass: 'special' },
      { stage: 3, id: 'meteor-beam', name: 'Rayo Meteoro', power: 120, pp: 10, type: 'rock', damageClass: 'special' },
    ],
  },
  ghost: {
    physical: [
      { stage: 1, id: 'shadow-sneak', name: 'Sombra Ninja', power: 40, pp: 30, type: 'ghost', damageClass: 'physical' },
      { stage: 2, id: 'shadow-claw', name: 'Garra Umbria', power: 70, pp: 15, type: 'ghost', damageClass: 'physical' },
      { stage: 3, id: 'phantom-force', name: 'Fuerza Fantasma', power: 90, pp: 10, type: 'ghost', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'hex', name: 'Maldicion', power: 65, pp: 10, type: 'ghost', damageClass: 'special' },
      { stage: 2, id: 'shadow-ball', name: 'Bola Sombra', power: 80, pp: 15, type: 'ghost', damageClass: 'special' },
      { stage: 3, id: 'astral-barrage', name: 'Bombardeo Astral', power: 120, pp: 5, type: 'ghost', damageClass: 'special' },
    ],
  },
  dragon: {
    physical: [
      { stage: 1, id: 'dragon-tail', name: 'Cola Dragon', power: 60, pp: 10, type: 'dragon', damageClass: 'physical' },
      { stage: 2, id: 'dragon-claw', name: 'Garra Dragon', power: 80, pp: 15, type: 'dragon', damageClass: 'physical' },
      { stage: 3, id: 'outrage', name: 'Furia Dragon', power: 120, pp: 10, type: 'dragon', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'dragon-rage', name: 'Ira Dragon', power: 40, pp: 10, type: 'dragon', damageClass: 'special' },
      { stage: 2, id: 'dragon-pulse', name: 'Pulso Dragon', power: 85, pp: 10, type: 'dragon', damageClass: 'special' },
      { stage: 3, id: 'draco-meteor', name: 'Dracometeoro', power: 130, pp: 5, type: 'dragon', damageClass: 'special' },
    ],
  },
  dark: {
    physical: [
      { stage: 1, id: 'bite', name: 'Mordisco', power: 60, pp: 25, type: 'dark', damageClass: 'physical' },
      { stage: 2, id: 'crunch', name: 'Triturar', power: 80, pp: 15, type: 'dark', damageClass: 'physical' },
      { stage: 3, id: 'wicked-blow', name: 'Golpe Perverso', power: 80, pp: 5, type: 'dark', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'feint-attack', name: 'Ataque Furtivo', power: 60, pp: 20, type: 'dark', damageClass: 'special' },
      { stage: 2, id: 'dark-pulse', name: 'Pulso Umbrio', power: 80, pp: 15, type: 'dark', damageClass: 'special' },
      { stage: 3, id: 'fiery-wrath', name: 'Ira Oscura', power: 90, pp: 10, type: 'dark', damageClass: 'special' },
    ],
  },
  steel: {
    physical: [
      { stage: 1, id: 'metal-claw', name: 'Garra Metal', power: 50, pp: 35, type: 'steel', damageClass: 'physical', effectId: 'raise-def-20' },
      { stage: 2, id: 'iron-head', name: 'Cabeza de Hierro', power: 80, pp: 15, type: 'steel', damageClass: 'physical' },
      { stage: 3, id: 'behemoth-blade', name: 'Hoja Behemoth', power: 100, pp: 5, type: 'steel', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'mirror-shot', name: 'Destello', power: 65, pp: 10, type: 'steel', damageClass: 'special' },
      { stage: 2, id: 'flash-cannon', name: 'Canon Destello', power: 80, pp: 10, type: 'steel', damageClass: 'special' },
      { stage: 3, id: 'steel-beam', name: 'Rayo Acero', power: 140, pp: 5, type: 'steel', damageClass: 'special' },
    ],
  },
  fairy: {
    physical: [
      { stage: 1, id: 'fairy-wind', name: 'Viento Feerico', power: 40, pp: 30, type: 'fairy', damageClass: 'physical' },
      { stage: 2, id: 'play-rough', name: 'Carantoña', power: 90, pp: 10, type: 'fairy', damageClass: 'physical' },
      { stage: 3, id: 'tectonic-rage', name: 'Furia Telurica', power: 100, pp: 10, type: 'fairy', damageClass: 'physical' },
    ],
    special: [
      { stage: 1, id: 'disarming-voice', name: 'Voz Cautivadora', power: 40, pp: 15, type: 'fairy', damageClass: 'special', effectId: 'sleep-10' },
      { stage: 2, id: 'moonblast', name: 'Fuerza Lunar', power: 95, pp: 15, type: 'fairy', damageClass: 'special', efectId: 'lower-spd-20-20' },
      { stage: 3, id: 'sparkling-aria', name: 'Aria Luminosa', power: 90, pp: 10, type: 'fairy', damageClass: 'special' },
    ],
  },
};

function getMoveProgression(type, damageClass) {
  return MOVE_POOL[type]?.[damageClass] ?? [];
}

// Calcula la stage evolutiva de un pokemon (0=base, 1=media, 2=final)
// Regla: forma final siempre = stage 2. Base = 0. Media = 1.
function getEvolutionStage(pokemonName) {
  if (typeof POKEMON_DB === 'undefined') return 0;
  const name = pokemonName.toLowerCase();
  const entry = POKEMON_DB[name];
  if (!entry) return 0;

  // Es forma final si no tiene destino de evolución en absoluto
  const isFinal = !entry.evolvesInto;

  if (isFinal) {
    // ¿Tiene predecesor? → forma final de cadena de al menos 2
    const hasPrev = Object.values(POKEMON_DB).some(d => d.evolvesInto === name);
    // Sin predecesor y sin evolución = pokemon independiente → stage 2 (acceso completo)
    return 2;
  }

  // ¿Es forma base? Ningún pokemon evoluciona hacia él
  const hasPrev = Object.values(POKEMON_DB).some(d => d.evolvesInto === name);
  return hasPrev ? 1 : 0;
}

// buildMoves: incluye los movimientos cuyo move.stage <= POKEMON_DB[name].stage.
// Boss:true nunca se incluye — solo accesibles vía moveId explícito en routes.js.
function buildMoves(pokemonName) {
  const dbEntry = POKEMON_DB[pokemonName.toLowerCase()];
  if (!dbEntry) {
    return [{ id: 'tackle', name: 'Placaje', power: 40, type: 'normal', damageClass: 'physical', pp: 35, maxPp: 35 }];
  }

  const pokemonStage = dbEntry.stage ?? 3;
  const moves = [];
  const seenIds = new Set();

  for (const line of dbEntry.moveLines) {
    const progression = getMoveProgression(line.type, line.damageClass);
    for (const move of progression) {
      if (move && !move.boss && !move.mt && (move.stage ?? 1) <= pokemonStage && !seenIds.has(move.id)) {
        seenIds.add(move.id);
        moves.push({ ...move, maxPp: move.pp });
      }
    }
  }

  if (moves.length === 0) {
    moves.push({ id: 'tackle', name: 'Placaje', power: 40, type: 'normal', damageClass: 'physical', pp: 35, maxPp: 35 });
  }
  return moves;
}

// Índice rápido por id — para lookup de moveId desde routes.js
var MOVE_BY_ID = {};
for (const typeData of Object.values(MOVE_POOL)) {
  for (const move of [...typeData.physical, ...typeData.special]) {
    MOVE_BY_ID[move.id] = move;
  }
}

// ── MOVE_LIST — referencias rápidas por tipo y clase para usar en routes.js ──
// Uso: moveId: MOVE_LIST.fire.special.ember  o  MOVE_LIST.grass.special.absorb
// Cada valor es el id string del movimiento tal como aparece en MOVE_POOL
function _buildMoveList() {
  const list = {};
  const entries = Object.keys(MOVE_POOL);
  for (let i = 0; i < entries.length; i++) {
    const type = entries[i];
    const lines = MOVE_POOL[type];
    list[type] = { physical: {}, special: {} };
    for (let j = 0; j < lines.physical.length; j++) {
      const m = lines.physical[j];
      list[type].physical[m.id.replace(/-/g, '_')] = m.id;
    }
    for (let j = 0; j < lines.special.length; j++) {
      const m = lines.special[j];
      list[type].special[m.id.replace(/-/g, '_')] = m.id;
    }
  }
  return list;
}
var MOVE_LIST = _buildMoveList();
