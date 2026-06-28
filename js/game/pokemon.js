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
async function createPokemon(nameOrId, level, isPlayer = false, moveId = null, overrides = null, shiny = false) {
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

  // Stage: definida en POKEMON_DB[name].stage (1=1 ataque, 2=2, 3=3).
  const moveLevel = POKEMON_DB[name]?.stage ?? 3;
  const moves = buildMoves(name);

  // Movimiento hardcodeado vía moveId (rivales/gym leaders con ataque específico)
  // moveId puede ser un string o un array de strings
  const _moveIds = Array.isArray(moveId) ? moveId : (moveId ? [moveId] : []);
  for (const mid of _moveIds) {
    if (MOVE_BY_ID[mid] && !moves.find(m => m.id === mid)) {
      const m = MOVE_BY_ID[mid];
      moves.push({ ...m, maxPp: m.pp });
    }
  }

  // MTs aprendidas: solo para pokemon del jugador — cargadas desde Storage
  // (se reinician cuando el jugador borra los datos de pokédex)
  const learnedMTs = (isPlayer && typeof Storage?.getLearnedMTs === 'function')
    ? Storage.getLearnedMTs(name)
    : [];
  for (const mtId of learnedMTs) {
    const m = MOVE_BY_ID[mtId];
    if (m && !moves.find(mv => mv.id === mtId)) moves.push({ ...m, maxPp: m.pp });
  }

  const pokemon = {
    id:           apiData.id,
    name,
    displayName:  name.charAt(0).toUpperCase() + name.slice(1),
    types:        apiData.types.map(t => t.type.name),
    baseStats,
    ivs, evs, nature, level,
    moveLevel,
    exp:          0,
    expToNext:    EXP_TABLE.expToNext(level),
    moves,
    autoMovePool: (() => {
                    const ids = Array.isArray(moveId) ? moveId : [];
                    const valid = ids.filter(id => moves.find(m => m.id === id));
                    return valid.length > 1 ? valid : null;
                  })(),
    autoMove:     (() => {
                    if (Array.isArray(moveId)) {
                      const valid = moveId.filter(id => moves.find(m => m.id === id));
                      return valid.length > 0
                        ? valid[Math.floor(Math.random() * valid.length)]
                        : moves[moves.length - 1]?.id ?? null;
                    }
                    return moveId && moves.find(m => m.id === moveId)
                      ? moveId
                      : moves[moves.length - 1]?.id ?? null;
                  })(),
    isPlayer,
    shiny,
    spriteUrl:    shiny ? (apiData.sprites.front_shiny ?? apiData.sprites.front_default) : apiData.sprites.front_default,
    backSpriteUrl: shiny ? (apiData.sprites.back_shiny  ?? apiData.sprites.back_default)  : apiData.sprites.back_default,
  };

  pokemon.stats     = computeStats(pokemon);
  pokemon.currentHp = pokemon.stats.hp;
  pokemon.combatMods = {};  // modificadores de combate: { atk, def, spa, spd, spe } como multiplicadores
  pokemon.ability     = POKEMON_DB[name]?.ability     ?? null; // habilidad activa — ver move-effects.js ABILITIES
  pokemon.hideAbility = POKEMON_DB[name]?.hideAbility ?? null; // habilidad oculta — intercambiable con cápsula

  // Rivales: 10% de posibilidades de que el pokemon aparezca con su habilidad oculta.
  // Solo si no tiene habilidad fijada a mano (overrides.ability) — ese campo se reserva
  // para cuando las rutas definan explícitamente la habilidad de un pokemon concreto.
  if (!isPlayer && pokemon.hideAbility && !overrides?.ability) {
    if (Math.random() < 0.10) {
      const temp          = pokemon.ability;
      pokemon.ability     = pokemon.hideAbility;
      pokemon.hideAbility = temp;
    }
  }

  pokemon.heldItem   = null; // id de HELD_ITEMS, o null — ver held-items.js
  pokemon._heldItemFlags = {}; // flags "una vez por ruta" de objetos equipados
  pokemon.learnedMTs = learnedMTs; // cache de MTs aprendidas (fuente: Storage)
  return pokemon;
}

function gainExp(pokemon, foeName, battleType = 'wild', foeLevel = 5) {
  const baseExp   = EXP_TABLE.getBaseExp(foeName);
  const mult      = EXP_TABLE.MULTIPLIERS[battleType] ?? 1.0;
  const levelMult = 1.0 + (foeLevel - 5) * 0.05;
  let gained      = Math.round(baseExp * mult * Math.max(0.5, levelMult));

  // Penalización basada en el nivel propio del pokemon, no en el activo
  const diff = pokemon.level - foeLevel;
  const penalty = (EXP_TABLE.EXP_PENALTIES ?? []).find(p => diff > p.levelDiff);
  if (penalty) gained = Math.round(gained * penalty.multiplier);

  pokemon.exp += gained;
  let levelsGained = 0;

  while (pokemon.level < 100) {
    const needed = EXP_TABLE.expToNext(pokemon.level);
    if (pokemon.exp < needed) break;
    pokemon.exp   -= needed;
    pokemon.level += 1;
    const oldMaxHp = pokemon.stats.hp;
    pokemon.stats  = computeStats(pokemon);
    // Curar al menos el aumento de HP máximo para que un pokemon a vida completa
    // siga estándolo tras subir de nivel (HEAL_ON_LEVEL_UP_PCT puede ser insuficiente
    // en niveles bajos donde el incremento de HP por nivel supera el 10%).
    const hpIncrease = pokemon.stats.hp - oldMaxHp;
    const heal = Math.max(hpIncrease, Math.max(1, Math.floor(pokemon.stats.hp * COMBAT_CONFIG.HEAL_ON_LEVEL_UP_PCT)));
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


function levelUpPokemon(pokemon, levels) {
  let gained = 0;
  for (let i = 0; i < levels; i++) {
    if (pokemon.level >= 100) break;
    pokemon.level++;
    const oldMaxHp = pokemon.stats.hp;
    pokemon.stats = computeStats(pokemon);
    const hpIncrease = pokemon.stats.hp - oldMaxHp;
    const heal = Math.max(hpIncrease, Math.max(1, Math.floor(pokemon.stats.hp * COMBAT_CONFIG.HEAL_ON_LEVEL_UP_PCT)));
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
// Solo activo si el movimiento con 'clear' es el autoMove actualmente seleccionado.
function hasClearEffect(pokemon) {
  const active = pokemon?.moves?.find(m => m.id === pokemon?.autoMove) ?? pokemon?.moves?.[0];
  if (!active) return false;
  if (Array.isArray(active.effectId)) return active.effectId.includes('clear');
  return active.effectId === 'clear';
}

// Comprueba si el pokemon tiene la habilidad 'guts'.
// Guts ignora las penalizaciones de burn/freeze/paralysis y añade daño físico.
function hasGutsEffect(pokemon) {
  return pokemon?.ability === 'guts';
}

// ── Evoluciones ───────────────────────────────────────────────────────────────

// Comprueba si el pokemon debe evolucionar. Devuelve el nombre de la evolución
// o null si no corresponde evolucionar todavía.
function checkEvolution(pokemon) {
  const db = POKEMON_DB[pokemon.name];
  if (!db?.evolvesAt || !db?.evolvesInto) return null;
  if (pokemon.level < db.evolvesAt) return null;
  if (HELD_ITEMS?.[pokemon.heldItem]?.blocksEvolution) return null;
  return db.evolvesInto;
}

// Evoluciona un pokemon conservando IVs, EVs, naturaleza, EXP y autoMove.
// Devuelve el nuevo pokemon evolucionado (async porque necesita datos de la API).
async function evolve(pokemon, intoName) {
  const newPoke = await createPokemon(intoName, pokemon.level, pokemon.isPlayer, null, null, pokemon.shiny ?? false);

  // Preservar progreso del entrenador
  newPoke.ivs      = { ...pokemon.ivs };
  newPoke.evs      = { ...pokemon.evs };
  newPoke.nature   = pokemon.nature;
  newPoke.exp      = pokemon.exp;
  newPoke.expToNext = EXP_TABLE.expToNext(pokemon.level);

  // moves y learnedMTs ya vienen correctos de createPokemon (stage + Storage MTs).
  // Regla de autoMove tras evolución:
  // - Si el jugador tenía el movimiento "por defecto" (el último/más fuerte de su forma base),
  //   se actualiza al último movimiento de la forma evolucionada (nueva habilidad).
  // - Si el jugador lo había cambiado manualmente a otro movimiento y ese existe en el nuevo
  //   moveset, se respeta la elección manual.
  // - En cualquier otro caso, se usa el último movimiento de la forma evolucionada.
  const baseLast    = pokemon.moves[pokemon.moves.length - 1]?.id;
  const evolvedLast = newPoke.moves[newPoke.moves.length - 1]?.id;
  if (pokemon.autoMove === baseLast) {
    newPoke.autoMove = evolvedLast ?? null;
  } else if (pokemon.autoMove && newPoke.moves.find(m => m.id === pokemon.autoMove)) {
    newPoke.autoMove = pokemon.autoMove;
  } else {
    newPoke.autoMove = evolvedLast ?? null;
  }

  // Recalcular stats con los nuevos IVs/EVs/naturaleza
  newPoke.stats     = computeStats(newPoke);
  // Mantener HP proporcional al que tenía
  const hpRatio     = pokemon.currentHp / pokemon.stats.hp;
  newPoke.currentHp = Math.max(1, Math.floor(newPoke.stats.hp * hpRatio));

  // Preservar objeto equipado y sus flags
  // Usar equipHeldItem para que los efectos PASSIVE (combatMods) se re-apliquen
  newPoke._heldItemFlags = { ...(pokemon._heldItemFlags ?? {}) };
  if (pokemon.heldItem) {
    equipHeldItem(newPoke, pokemon.heldItem);
  }

  console.log(`[EVOLUCION] ${pokemon.displayName} → ${newPoke.displayName} Nv.${newPoke.level}`);
  return newPoke;
}

