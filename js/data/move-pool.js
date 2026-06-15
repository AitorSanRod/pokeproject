// ─────────────────────────────────────────────────────────────────────────────
// MOVE POOL — catálogo de movimientos por tipo y clase
//
// Usa TYPES y DAMAGE_CLASS en vez de strings para evitar errores tipográficos.
// Uso: type: TYPES.FIRE, damageClass: DAMAGE_CLASS.SPECIAL
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
      { id: 'tackle', name: 'Placaje', power: 40, pp: 35, type: 'normal', damageClass: 'physical', effectId: 'priority' },
      { id: 'body-slam', name: 'Golpe Cuerpo', power: 85, pp: 15, type: 'normal', damageClass: 'physical' },
      { id: 'hyper-fang', name: 'Hiper Colmillo', power: 80, pp: 15, type: 'normal', damageClass: 'physical' },
    ],
    special: [
      { id: 'swift', name: 'Velocidad', power: 60, pp: 20, type: 'normal', damageClass: 'special', effectId: 'shield-10' },
      { id: 'hyper-voice', name: 'Vozarrón', power: 90, pp: 10, type: 'normal', damageClass: 'special' },
      { id: 'boomburst', name: 'Estruendo', power: 140, pp: 10, type: 'normal', damageClass: 'special' },
    ],
  },
  fire: {
    physical: [
      { id: 'flame-wheel', name: 'Rueda Fuego', power: 60, pp: 25, type: 'fire', damageClass: 'physical' },
      { id: 'fire-fang', name: 'Colmillo Igneo', power: 65, pp: 15, type: 'fire', damageClass: 'physical' },
      { id: 'flare-blitz', name: 'Llamarada', power: 120, pp: 15, type: 'fire', damageClass: 'physical' },
    ],
    special: [
      { id: 'ember', name: 'Ascuas', power: 40, pp: 25, type: 'fire', damageClass: 'special', effectId: 'burn-10' },
      { id: 'flamethrower', name: 'Lanzallamas', power: 90, pp: 15, type: 'fire', damageClass: 'special', effectId: 'burn-20' },
      { id: 'fire-blast', name: 'Sofoco', power: 110, pp: 5, type: 'fire', damageClass: 'special', effectId: 'burn-25' },
    ],
  },
  water: {
    physical: [
      { id: 'waterfall', name: 'Cascada', power: 50, pp: 15, type: 'water', damageClass: 'physical', effectId: 'raise-atk-20' },
      { id: 'crabhammer', name: 'Martillazo', power: 70, pp: 10, type: 'water', damageClass: 'physical' },
      { id: 'wave-crash', name: 'Envite acuatico', power: 110, pp: 10, type: 'water', damageClass: 'physical' },
    ],
    special: [
      { id: 'water-gun', name: 'Pistola Agua', power: 40, pp: 25, type: 'water', damageClass: 'special', effectId: 'raise-spa-10' },
      { id: 'surf', name: 'Surf', power: 90, pp: 15, type: 'water', damageClass: 'special' },
      { id: 'hydro-pump', name: 'Hidrobomba', power: 110, pp: 5, type: 'water', damageClass: 'special' },
    ],
  },
  grass: {
    physical: [
      { id: 'vine-whip', name: 'Latigo Cepa', power: 45, pp: 25, type: 'grass', damageClass: 'physical' },
      { id: 'razor-leaf', name: 'Hoja afilada', power: 55, pp: 25, type: 'grass', damageClass: 'physical' },
      { id: 'wood-hammer', name: 'Mazazo', power: 120, pp: 15, type: 'grass', damageClass: 'physical' },
    ],
    special: [
      { id: 'absorb', name: 'Absorber', power: 40, pp: 25, type: 'grass', damageClass: 'special', effectId: 'drain-10' },
      { id: 'magical-leaf', name: 'Hoja Magica', power: 60, pp: 20, type: 'grass', damageClass: 'special', effectId: 'drain-25' },
      { id: 'solar-beam', name: 'Rayo Solar', power: 120, pp: 10, type: 'grass', damageClass: 'special', effectId: 'drain-50' },
    ],
  },
  electric: {
    physical: [
      { id: 'thunder-punch', name: 'Puño Trueno', power: 75, pp: 15, type: 'electric', damageClass: 'physical', effectId: 'paralize-25' },
      { id: 'wild-charge', name: 'Voltiocruel', power: 90, pp: 15, type: 'electric', damageClass: 'physical' },
      { id: 'volt-tackle', name: 'Placaje Eléctrico', power: 120, pp: 15, type: 'electric', damageClass: 'physical' },
    ],
    special: [
      { id: 'thunder-shock', name: 'Impactrueno', power: 40, pp: 30, type: 'electric', damageClass: 'special', effectId: 'paralize-25' },
      { id: 'thunderbolt', name: 'Rayo', power: 90, pp: 15, type: 'electric', damageClass: 'special' },
      { id: 'thunder', name: 'Trueno', power: 110, pp: 10, type: 'electric', damageClass: 'special' },
    ],
  },
  ice: {
    physical: [
      { id: 'ice-punch', name: 'Puño Hielo', power: 75, pp: 15, type: 'ice', damageClass: 'physical' },
      { id: 'ice-fang', name: 'Colmillo Hielo', power: 65, pp: 15, type: 'ice', damageClass: 'physical' },
      { id: 'icicle-crash', name: 'Alud', power: 85, pp: 10, type: 'ice', damageClass: 'physical' },
    ],
    special: [
      { id: 'powder-snow', name: 'Polvo de Nieve', power: 40, pp: 25, type: 'ice', damageClass: 'special' },
      { id: 'ice-beam', name: 'Rayo Hielo', power: 90, pp: 10, type: 'ice', damageClass: 'special' },
      { id: 'blizzard', name: 'Ventisca', power: 110, pp: 5, type: 'ice', damageClass: 'special' },
    ],
  },
  fighting: {
    physical: [
      { id: 'karate-chop', name: 'Golpe Karate', power: 50, pp: 25, type: 'fighting', damageClass: 'physical', effectId: 'raise-atk-20' },
      { id: 'brick-break', name: 'Romperrocas', power: 75, pp: 15, type: 'fighting', damageClass: 'physical' },
      { id: 'close-combat', name: 'A Bocajarro', power: 120, pp: 5, type: 'fighting', damageClass: 'physical' },
    ],
    special: [
      { id: 'vacuum-wave', name: 'Onda Vacio', power: 40, pp: 30, type: 'fighting', damageClass: 'special' },
      { id: 'aura-sphere', name: 'Esfera Aural', power: 80, pp: 20, type: 'fighting', damageClass: 'special' },
      { id: 'focus-blast', name: 'Onda Certera', power: 120, pp: 5, type: 'fighting', damageClass: 'special' },
    ],
  },
  poison: {
    physical: [
      { id: 'poison-sting', name: 'Aguijon Toxico', power: 35, pp: 35, type: 'poison', damageClass: 'physical', effectId: 'poison-25' },
      { id: 'poison-jab', name: 'Puya Nociva', power: 80, pp: 20, type: 'poison', damageClass: 'physical' },
      { id: 'gunk-shot', name: 'Lanza Mugre', power: 120, pp: 5, type: 'poison', damageClass: 'physical' },
    ],
    special: [
      { id: 'poison-powder', name: 'Polvo Veneno', power: 50, pp: 35, type: 'poison', damageClass: 'special', effectId: 'poison-25' },
      { id: 'sludge-bomb', name: 'Bomba Lodo', power: 90, pp: 10, type: 'poison', damageClass: 'special' },
      { id: 'sludge-wave', name: 'Onda Toxica', power: 95, pp: 10, type: 'poison', damageClass: 'special' },
    ],
  },
  ground: {
    physical: [
      { id: 'bulldoze', name: 'Terratemblor', power: 60, pp: 20, type: 'ground', damageClass: 'physical' },
      { id: 'stomping-tantrum', name: 'Pataleta', power: 85, pp: 10, type: 'ground', damageClass: 'physical' },
      { id: 'earthquake', name: 'Terremoto', power: 100, pp: 10, type: 'ground', damageClass: 'physical' },
    ],
    special: [
      { id: 'mud-shot', name: 'Disparo Lodo', power: 55, pp: 15, type: 'ground', damageClass: 'special' },
      { id: 'earth-power', name: 'Tierra Viva', power: 90, pp: 10, type: 'ground', damageClass: 'special' },
      { id: 'sandsear-storm', name: 'Simún de Arena', power: 100, pp: 5, type: 'ground', damageClass: 'special' },
    ],
  },
  flying: {
    physical: [
      { id: 'peck', name: 'Picotazo', power: 35, pp: 35, type: 'flying', damageClass: 'physical', effectId: 'lower-atk-10' },
      { id: 'wing-attack', name: 'Ataque Ala', power: 60, pp: 35, type: 'flying', damageClass: 'physical' },
      { id: 'brave-bird', name: 'Pajaro Osado', power: 120, pp: 15, type: 'flying', damageClass: 'physical' },
    ],
    special: [
      { id: 'gust', name: 'Tornado', power: 40, pp: 35, type: 'flying', damageClass: 'special', effectId: 'lower-atk-10' },
      { id: 'air-slash', name: 'Tajo Aereo', power: 75, pp: 20, type: 'flying', damageClass: 'special' },
      { id: 'hurricane', name: 'Huracan', power: 110, pp: 10, type: 'flying', damageClass: 'special' },
    ],
  },
  psychic: {
    physical: [
      { id: 'zen-headbutt', name: 'Cabezazo Zen', power: 80, pp: 15, type: 'psychic', damageClass: 'physical' },
      { id: 'psycho-cut', name: 'Psicucuchilla', power: 70, pp: 20, type: 'psychic', damageClass: 'physical' },
      { id: 'photo-geyser', name: 'Fotogeyser', power: 100, pp: 10, type: 'psychic', damageClass: 'physical' },
    ],
    special: [
      { id: 'confusion', name: 'Confusion', power: 50, pp: 25, type: 'psychic', damageClass: 'special' },
      { id: 'psychic', name: 'Psiquico', power: 90, pp: 10, type: 'psychic', damageClass: 'special'},
      { id: 'psystrike', name: 'Golpe Psi', power: 100, pp: 10, type: 'psychic', damageClass: 'special' },
      { id: 'trick', name: 'Truco', power: 10, pp: 99, type: 'psychic', damageClass: 'special', boss: true, effectId: ['clear', 'sleep', 'lower-spd-20'] },
    ],
  },
  bug: {
    physical: [
      { id: 'bug-bite', name: 'Picadura', power: 35, pp: 20, type: 'bug', damageClass: 'physical' },
      { id: 'x-scissor', name: 'Tijera X', power: 65, pp: 15, type: 'bug', damageClass: 'physical' },
      { id: 'megahorn', name: 'Megacuerno', power: 100, pp: 10, type: 'bug', damageClass: 'physical' },
    ],
    special: [
      { id: 'infestation', name: 'Infestacion', power: 20, pp: 20, type: 'bug', damageClass: 'special' },
      { id: 'signal-beam', name: 'Rayo Señal', power: 75, pp: 15, type: 'bug', damageClass: 'special' },
      { id: 'bug-buzz', name: 'Zumbido', power: 90, pp: 10, type: 'bug', damageClass: 'special' },
    ],
  },
  rock: {
    physical: [
      { id: 'rock-throw', name: 'Lanzarrocas', power: 50, pp: 15, type: 'rock', damageClass: 'physical' },
      { id: 'rock-slide', name: 'Avalancha', power: 75, pp: 10, type: 'rock', damageClass: 'physical' },
      { id: 'stone-edge', name: 'Roca Afilada', power: 100, pp: 5, type: 'rock', damageClass: 'physical' },
    ],
    special: [
      { id: 'power-gem', name: 'Joya de Luz', power: 80, pp: 20, type: 'rock', damageClass: 'special' },
      { id: 'tar-shot', name: 'Alquitranazo', power: 60, pp: 15, type: 'rock', damageClass: 'special' },
      { id: 'meteor-beam', name: 'Rayo Meteoro', power: 120, pp: 10, type: 'rock', damageClass: 'special' },
    ],
  },
  ghost: {
    physical: [
      { id: 'shadow-sneak', name: 'Sombra Ninja', power: 40, pp: 30, type: 'ghost', damageClass: 'physical', effectId: 'priority' },
      { id: 'shadow-claw', name: 'Garra Umbria', power: 70, pp: 15, type: 'ghost', damageClass: 'physical' },
      { id: 'phantom-force', name: 'Fuerza Fantasma', power: 90, pp: 10, type: 'ghost', damageClass: 'physical' },
    ],
    special: [
      { id: 'hex', name: 'Maldicion', power: 65, pp: 10, type: 'ghost', damageClass: 'special' },
      { id: 'shadow-ball', name: 'Bola Sombra', power: 80, pp: 15, type: 'ghost', damageClass: 'special', effectId: 'lower-def-20' },
      { id: 'astral-barrage', name: 'Bombardeo Astral', power: 120, pp: 5, type: 'ghost', damageClass: 'special' },
    ],
  },
  dragon: {
    physical: [
      { id: 'dragon-tail', name: 'Cola Dragon', power: 60, pp: 10, type: 'dragon', damageClass: 'physical' },
      { id: 'dragon-claw', name: 'Garra Dragon', power: 80, pp: 15, type: 'dragon', damageClass: 'physical' },
      { id: 'outrage', name: 'Furia Dragon', power: 120, pp: 10, type: 'dragon', damageClass: 'physical' },
    ],
    special: [
      { id: 'dragon-rage', name: 'Ira Dragon', power: 40, pp: 10, type: 'dragon', damageClass: 'special' },
      { id: 'dragon-pulse', name: 'Pulso Dragon', power: 85, pp: 10, type: 'dragon', damageClass: 'special' },
      { id: 'draco-meteor', name: 'Dracometeoro', power: 130, pp: 5, type: 'dragon', damageClass: 'special' },
    ],
  },
  dark: {
    physical: [
      { id: 'bite', name: 'Mordisco', power: 60, pp: 25, type: 'dark', damageClass: 'physical' },
      { id: 'crunch', name: 'Triturar', power: 80, pp: 15, type: 'dark', damageClass: 'physical' },
      { id: 'wicked-blow', name: 'Golpe Perverso', power: 80, pp: 5, type: 'dark', damageClass: 'physical' },
    ],
    special: [
      { id: 'feint-attack', name: 'Ataque Furtivo', power: 60, pp: 20, type: 'dark', damageClass: 'special' },
      { id: 'dark-pulse', name: 'Pulso Umbrio', power: 80, pp: 15, type: 'dark', damageClass: 'special' },
      { id: 'fiery-wrath', name: 'Ira Oscura', power: 90, pp: 10, type: 'dark', damageClass: 'special' },
    ],
  },
  steel: {
    physical: [
      { id: 'metal-claw', name: 'Garra Metal', power: 50, pp: 35, type: 'steel', damageClass: 'physical' },
      { id: 'iron-head', name: 'Cabeza de Hierro', power: 80, pp: 15, type: 'steel', damageClass: 'physical' },
      { id: 'behemoth-blade', name: 'Hoja Behemoth', power: 100, pp: 5, type: 'steel', damageClass: 'physical' },
    ],
    special: [
      { id: 'mirror-shot', name: 'Destello', power: 65, pp: 10, type: 'steel', damageClass: 'special' },
      { id: 'flash-cannon', name: 'Canon Destello', power: 80, pp: 10, type: 'steel', damageClass: 'special' },
      { id: 'steel-beam', name: 'Rayo Acero', power: 140, pp: 5, type: 'steel', damageClass: 'special' },
    ],
  },
  fairy: {
    physical: [
      { id: 'fairy-wind', name: 'Viento Feerico', power: 40, pp: 30, type: 'fairy', damageClass: 'physical' },
      { id: 'play-rough', name: 'Carantoña', power: 90, pp: 10, type: 'fairy', damageClass: 'physical' },
      { id: 'tectonic-rage', name: 'Furia Telurica', power: 100, pp: 10, type: 'fairy', damageClass: 'physical' },
    ],
    special: [
      { id: 'disarming-voice', name: 'Voz Cautivadora', power: 40, pp: 15, type: 'fairy', damageClass: 'special', effectId: 'sleep-10' },
      { id: 'moonblast', name: 'Fuerza Lunar', power: 95, pp: 15, type: 'fairy', damageClass: 'special' },
      { id: 'sparkling-aria', name: 'Aria Luminosa', power: 90, pp: 10, type: 'fairy', damageClass: 'special' },
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

// buildMoves: devuelve todos los movimientos disponibles hasta la stage del pokemon
// Stage 0 (base)   → solo el 1er movimiento de cada tipo (moveLevel 0)
// Stage 1 (media)  → los 2 primeros de cada tipo (moveLevel 0 y 1)
// Stage 2+ (final) → los 3 de cada tipo (moveLevel 0, 1 y 2)
function buildMoves(pokemonName, _unused) {
  const dbEntry = POKEMON_DB[pokemonName.toLowerCase()];
  if (!dbEntry) {
    return [{ id: 'tackle', name: 'Placaje', power: 40, type: 'normal', damageClass: 'physical', pp: 35, maxPp: 35 }];
  }

  const stage = getEvolutionStage(pokemonName);
  const maxIdx = Math.min(stage, 2); // 0, 1 o 2
  const moves = [];
  const seenIds = new Set();

  for (const line of dbEntry.moveLines) {
    const progression = getMoveProgression(line.type, line.damageClass);
    // Añadir todos los movimientos hasta maxIdx
    for (let i = 0; i <= maxIdx; i++) {
      const move = progression[i];
      // Los movimientos marcados boss:true NUNCA forman parte del moveset
      // normal — solo son accesibles si se hardcodean explícitamente vía
      // moveId en routes.js (ver createPokemon en pokemon.js)
      if (move && !move.boss && !seenIds.has(move.id)) {
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
