// Lógica de creación y stats de pokemon — equivalente a Node src/game/pokemon.js

function calcStat(base, iv, ev, level, isHp = false, nature = null, statKey = null) {
  const evBonus = Math.floor(ev / 4);
  if (isHp) return Math.floor(((2 * base + iv + evBonus) * level) / 100) + level + 10;
  let stat = Math.floor(((2 * base + iv + evBonus) * level) / 100) + 5;
  if (nature && statKey) {
    if (nature.boost === statKey) stat = Math.floor(stat * 1.1);
    if (nature.lower === statKey) stat = Math.floor(stat * 0.9);
  }
  return stat;
}

function computeStats(pokemon) {
  const { baseStats, ivs, evs, level, nature } = pokemon;
  return {
    hp:  calcStat(baseStats.hp,  ivs.hp,  evs.hp,  level, true),
    atk: calcStat(baseStats.atk, ivs.atk, evs.atk, level, false, nature, 'atk'),
    def: calcStat(baseStats.def, ivs.def, evs.def, level, false, nature, 'def'),
    spa: calcStat(baseStats.spa, ivs.spa, evs.spa, level, false, nature, 'spa'),
    spd: calcStat(baseStats.spd, ivs.spd, evs.spd, level, false, nature, 'spd'),
    spe: calcStat(baseStats.spe, ivs.spe, evs.spe, level, false, nature, 'spe'),
  };
}

// overrides (opcional): { ivs: {hp,atk,def,spa,spd,spe}, evs: {hp,atk,def,spa,spd,spe} }
// Si no se especifica, IVs por defecto = 31 (perfectos) y EVs = 0 para CUALQUIER pokemon
// (jugador o rival). Para encuentros hardcodeados (gym leaders, rivales especiales)
// se puede pasar overrides desde routes.js para personalizar IVs/EVs de ese pokemon.
async function createPokemon(nameOrId, level, isPlayer = false, moveId = null, overrides = null) {
  const apiData = await PokeAPI.getPokemon(String(nameOrId));
  const nature  = randomNature();

  const baseStats = {
    hp:  apiData.stats.find(s => s.stat.name === 'hp').base_stat,
    atk: apiData.stats.find(s => s.stat.name === 'attack').base_stat,
    def: apiData.stats.find(s => s.stat.name === 'defense').base_stat,
    spa: apiData.stats.find(s => s.stat.name === 'special-attack').base_stat,
    spd: apiData.stats.find(s => s.stat.name === 'special-defense').base_stat,
    spe: apiData.stats.find(s => s.stat.name === 'speed').base_stat,
  };

  // IVs: perfectos (31) por defecto, salvo que se especifiquen en overrides.ivs
  const DEFAULT_IVS = { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 };
  const ivs = overrides?.ivs ? { ...DEFAULT_IVS, ...overrides.ivs } : DEFAULT_IVS;

  // EVs: 0 por defecto, salvo que se especifiquen en overrides.evs
  const DEFAULT_EVS = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  const evs = overrides?.evs ? { ...DEFAULT_EVS, ...overrides.evs } : DEFAULT_EVS;

  const name = apiData.name;

  // Movimientos: SIEMPRE se construye el set completo según la stage evolutiva
  // (sección 5). moveId (definido en routes.js para rivales) NO reemplaza el
  // moveset — solo fija qué movimiento usa ese rival por defecto (autoMove).
  // Así, si el pokemon es capturado, ya tiene todos sus movimientos disponibles.
  const moves = buildMoves(name);

  // Si moveId apunta a un movimiento que no está en el moveset por stage
  // (p.ej. un movimiento más fuerte que su stage normalmente no tendría),
  // se añade igualmente para que el rival lo pueda usar.
  if (moveId && MOVE_BY_ID[moveId] && !moves.find(m => m.id === moveId)) {
    const m = MOVE_BY_ID[moveId];
    moves.push({ ...m, maxPp: m.pp });
  }

  const pokemon = {
    id:           apiData.id,
    name,
    displayName:  name.charAt(0).toUpperCase() + name.slice(1),
    types:        apiData.types.map(t => t.type.name),
    baseStats,
    ivs, evs, nature, level,
    moveLevel:    0,
    exp:          0,
    expToNext:    EXP_TABLE.expToNext(level),
    moves,
    autoMove:     moveId && moves.find(m => m.id === moveId)
                     ? moveId
                     : moves.reduce((best, m) => (m.power ?? 0) > (best?.power ?? 0) ? m : best, moves[0])?.id ?? null,
    isPlayer,
    spriteUrl:    apiData.sprites.front_default,
    backSpriteUrl: apiData.sprites.back_default,
  };

  pokemon.stats     = computeStats(pokemon);
  pokemon.currentHp = pokemon.stats.hp;
  pokemon.combatMods = {};  // modificadores de combate: { atk, def, spa, spd, spe } como multiplicadores
  pokemon.heldItem   = null; // id de HELD_ITEMS, o null — ver held-items.js
  pokemon._heldItemFlags = {}; // flags "una vez por ruta" de objetos equipados
  return pokemon;
}

function gainExp(pokemon, foeName, battleType = 'wild', foeLevel = 5) {
  const baseExp   = EXP_TABLE.getBaseExp(foeName);
  const mult      = EXP_TABLE.MULTIPLIERS[battleType] ?? 1.0;
  const levelMult = 1.0 + (foeLevel - 5) * 0.05;
  const gained    = Math.round(baseExp * mult * Math.max(0.5, levelMult));

  pokemon.exp += gained;
  let levelsGained = 0;

  while (pokemon.level < 100) {
    const needed = EXP_TABLE.expToNext(pokemon.level);
    if (pokemon.exp < needed) break;
    pokemon.exp   -= needed;
    pokemon.level += 1;
    pokemon.stats  = computeStats(pokemon);
    const heal = Math.max(1, Math.floor(pokemon.stats.hp * COMBAT_CONFIG.HEAL_ON_LEVEL_UP_PCT));
    pokemon.currentHp = Math.min(pokemon.stats.hp, pokemon.currentHp + heal);
    levelsGained++;

    // Comprobar evolución al subir nivel
    const evolvesInto = checkEvolution(pokemon);
    if (evolvesInto) {
      // Marcar para evolucionar — la UI lo gestiona con evolve()
      pokemon._pendingEvolution = evolvesInto;
    }
  }

  pokemon.expToNext = EXP_TABLE.expToNext(pokemon.level);
  return { gained, levelsGained };
}

function gainEVs(pokemon, foeBaseStats) {
  const highest = Object.entries(foeBaseStats).sort((a,b) => b[1]-a[1])[0][0];
  const total   = Object.values(pokemon.evs).reduce((a,b) => a+b, 0);
  if (total < 510 && pokemon.evs[highest] < 252) {
    pokemon.evs[highest] = Math.min(252, pokemon.evs[highest] + 3);
    pokemon.stats = computeStats(pokemon);
  }
}

function levelUpPokemon(pokemon, levels) {
  let gained = 0;
  for (let i = 0; i < levels; i++) {
    if (pokemon.level >= 100) break;
    pokemon.level++;
    pokemon.stats = computeStats(pokemon);
    const heal = Math.max(1, Math.floor(pokemon.stats.hp * COMBAT_CONFIG.HEAL_ON_LEVEL_UP_PCT));
    pokemon.currentHp = Math.min(pokemon.stats.hp, pokemon.currentHp + heal);
    gained++;

    const evolvesInto = checkEvolution(pokemon);
    if (evolvesInto) pokemon._pendingEvolution = evolvesInto;
  }
  pokemon.expToNext = EXP_TABLE.expToNext(pokemon.level);
  return gained;
}

function fullHeal(pokemon) {
  pokemon.stats        = computeStats(pokemon);
  pokemon.currentHp    = pokemon.stats.hp;
  pokemon.moves.forEach(m => m.pp = m.maxPp);
  pokemon.statusEffect = null;   // curar efecto de estado (veneno, quemado, etc.)
  pokemon.combatMods   = {};     // resetear modificadores de combat
}

// Cura un pokemon al 100% de HP y elimina su estado alterado (veneno, quemado,
// paralizado, etc.) — usado por los puntos de curación del camino (type:'heal').
// A diferencia de fullHeal, NO restaura PP ni resetea combatMods.
function healPokemon(pokemon) {
  pokemon.currentHp    = pokemon.stats.hp;
  pokemon.statusEffect = null;
}

function isAlive(pokemon) { return pokemon.currentHp > 0; }

// Velocidad efectiva para determinar el orden de turno — aplica combatMods.spe
// (p.ej. Pañuelo Eleccion: +100% vía held-items.js) sobre stats.spe.
// Mismo patrón aditivo que calcDamage: mod=0 → ×1.0, mod=1.0 → ×2.0.
function effectiveSpeed(pokemon) {
  const mult = Math.max(0.1, 1 + (pokemon?.combatMods?.spe ?? 0));
  return Math.floor((pokemon?.stats?.spe ?? 0) * mult);
}

// Comprueba si el pokemon tiene en su moveset algún movimiento con
// effectId:'clear' — efecto pasivo de inmunidad (ver move-effects.js).
// Mientras lo tenga (sea o no su autoMove actual), el pokemon no puede:
//   - recibir ningún estado alterado (StatusEffects.apply)
//   - sufrir bajadas de estadísticas (lower-atk-X, lower-def-X, etc.)
function hasClearEffect(pokemon) {
  return !!pokemon?.moves?.some(m => {
    if (Array.isArray(m.effectId)) return m.effectId.includes('clear');
    return m.effectId === 'clear';
  });
}

// ── Evoluciones ───────────────────────────────────────────────────────────────

// Comprueba si el pokemon debe evolucionar. Devuelve el nombre de la evolución
// o null si no corresponde evolucionar todavía.
function checkEvolution(pokemon) {
  const db = POKEMON_DB[pokemon.name];
  if (!db?.evolvesAt || !db?.evolvesInto) return null;
  if (pokemon.level < db.evolvesAt) return null;
  return db.evolvesInto;
}

// Evoluciona un pokemon conservando IVs, EVs, naturaleza, EXP y autoMove.
// Devuelve el nuevo pokemon evolucionado (async porque necesita datos de la API).
async function evolve(pokemon, intoName) {
  const newPoke = await createPokemon(intoName, pokemon.level, pokemon.isPlayer);

  // Preservar progreso del entrenador
  newPoke.ivs      = { ...pokemon.ivs };
  newPoke.evs      = { ...pokemon.evs };
  newPoke.nature   = pokemon.nature;
  newPoke.exp      = pokemon.exp;
  newPoke.expToNext = EXP_TABLE.expToNext(pokemon.level);

  // Subir línea de movimientos (moveLevel +1, hasta máximo 2)
  newPoke.moveLevel = Math.min(2, (pokemon.moveLevel ?? 0) + 1);
  newPoke.moves     = buildMoves(intoName);
  newPoke.autoMove  = pokemon.autoMove ?? newPoke.moves[0]?.id ?? null;

  // Recalcular stats con los nuevos IVs/EVs/naturaleza
  newPoke.stats     = computeStats(newPoke);
  // Mantener HP proporcional al que tenía
  const hpRatio     = pokemon.currentHp / pokemon.stats.hp;
  newPoke.currentHp = Math.max(1, Math.floor(newPoke.stats.hp * hpRatio));

  console.log(`[EVOLUCION] ${pokemon.displayName} → ${newPoke.displayName} Nv.${newPoke.level}`);
  return newPoke;
}

