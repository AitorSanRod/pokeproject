// ─────────────────────────────────────────────────────────────────────────────
// STORAGE — persistencia entre sesiones
//
// Todo lo que necesita sobrevivir al cierre del navegador pasa por aquí.
// Usa localStorage con claves prefijadas para no colisionar con otros datos.
//
// Claves usadas:
//   pkmn_pokedex         → { [name]: { caught: bool } }
//   pkmn_evs             → { [root]: { hp, atk, def, spa, spd, spe } }
//   pkmn_mts             → { [root]: ['move-id-1', 'move-id-2'] }  ← se borra con pokédex
//   pkmn_items           → { [itemId]: true }  ← objetos equipables recogidos alguna vez
//   pkmn_kanto_done      → true  ← se ha visto la pantalla info-final-kanto al menos una vez
//   pkmn_logros          → { [logroId]: true }  ← logros desbloqueados (permanentes)
//   pkmn_furthest_routes → { [regionId]: areaString }  ← ruta más lejana alcanzada en la run activa por región
//                          Se resetea al iniciar nueva run. Sobrevive a recargas de página mid-ruta.
// ─────────────────────────────────────────────────────────────────────────────

var Storage = {

  _PREFIX: 'pkmn_',

  _key(name) { return this._PREFIX + name; },

  _get(key) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[Storage] Error leyendo', key, e);
      return null;
    }
  },

  _set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {
      console.warn('[Storage] Error guardando', key, e);
    }
  },

  // ── Pokédex ───────────────────────────────────────────────────────────────

  getPokedex() {
    return this._get('pokedex') ?? {};
  },

  markSeen(pokemonName) {
    const dex = this.getPokedex();
    if (dex[pokemonName]?.caught) return; // ya capturado, no hace falta
    if (dex[pokemonName]?.seen) return;   // ya visto
    if (!dex[pokemonName]) dex[pokemonName] = {};
    dex[pokemonName].seen = true;
    this._set('pokedex', dex);
    console.log(`[Storage] Pokedex: ${pokemonName} visto`);
  },

  isSeen(pokemonName) {
    const entry = this.getPokedex()[pokemonName];
    return entry?.caught === true || entry?.seen === true;
  },

  markCaught(pokemonName) {
    const dex = this.getPokedex();
    if (!dex[pokemonName]) dex[pokemonName] = {};
    if (dex[pokemonName].caught) return; // ya estaba marcado
    dex[pokemonName].caught = true;
    this._set('pokedex', dex);
    console.log(`[Storage] Pokedex: ${pokemonName} marcado como capturado`);
  },

  isCaught(pokemonName) {
    return this.getPokedex()[pokemonName]?.caught === true;
  },

  markShiny(pokemonName) {
    const dex = this.getPokedex();
    if (!dex[pokemonName]) dex[pokemonName] = {};
    if (dex[pokemonName].shiny) return;
    dex[pokemonName].shiny = true;
    this._set('pokedex', dex);
    console.log(`[Storage] Pokedex: ${pokemonName} capturado shiny`);
  },

  isShiny(pokemonName) {
    return this.getPokedex()[pokemonName]?.shiny === true;
  },

  // Marca como shiny todos los miembros capturados de la línea evolutiva de pokemonName.
  propagateShinyLine(pokemonName) {
    if (typeof POKEMON_DB === 'undefined') return;
    const root = this.getEvolutionRoot(pokemonName);
    const dex  = this.getPokedex();
    let changed = false;
    let cur = root;
    while (cur) {
      if (dex[cur]?.caught && !dex[cur].shiny) {
        dex[cur].shiny = true;
        changed = true;
        console.log(`[Storage] Pokedex: ${cur} marcado shiny (propagación de línea)`);
      }
      const next = POKEMON_DB[cur]?.evolvesInto;
      cur = (next && next !== '') ? next : null;
    }
    if (changed) this._set('pokedex', dex);
  },

  // Al cargar la app: propaga shiny a toda la línea de cada pokemon shiny ya registrado.
  propagateShinyLineAll() {
    if (typeof POKEMON_DB === 'undefined') return;
    const dex  = this.getPokedex();
    const seen = new Set();
    for (const [name, entry] of Object.entries(dex)) {
      if (!entry.shiny) continue;
      const root = this.getEvolutionRoot(name);
      if (seen.has(root)) continue;
      seen.add(root);
      this.propagateShinyLine(root);
    }
  },

  EV_MAX_PER_STAT: 32,

  // ── Líneas evolutivas ─────────────────────────────────────────────────────
  // Devuelve el nombre del primer eslabón de la cadena evolutiva.
  // Los EVs se guardan bajo esa clave, así toda la cadena comparte los mismos EVs.
  getEvolutionRoot(pokemonName) {
    if (typeof POKEMON_DB === 'undefined') return pokemonName;
    var current = pokemonName;
    var visited = {};
    while (true) {
      if (visited[current]) return current;
      visited[current] = true;
      var names = Object.keys(POKEMON_DB);
      var found = false;
      for (var i = 0; i < names.length; i++) {
        if (POKEMON_DB[names[i]].evolvesInto === current) {
          current = names[i];
          found = true;
          break;
        }
      }
      if (!found) return current;
    }
  },

  // ── EVs ──────────────────────────────────────────────────────────────────
  // Los EVs se guardan bajo la raíz de la cadena evolutiva.
  // bulbasaur/ivysaur/venusaur comparten la misma entrada.

  getEvs(pokemonName) {
    const root = this.getEvolutionRoot(pokemonName);
    const all  = this._get('evs') ?? {};
    return all[root] ?? { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
  },

  addEv(pokemonName, stat, amount = 1) {
    const root = this.getEvolutionRoot(pokemonName);
    const all  = this._get('evs') ?? {};
    if (!all[root]) all[root] = { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 };
    const current = all[root][stat] ?? 0;
    if (current >= this.EV_MAX_PER_STAT) {
      console.log(`[Storage] EVs: cadena ${root} ${stat} ya en máximo (${this.EV_MAX_PER_STAT})`);
      return all[root];
    }
    all[root][stat] = Math.min(this.EV_MAX_PER_STAT, current + amount);
    this._set('evs', all);
    console.log(`[Storage] EVs: cadena ${root} +${amount} ${stat} → ${all[root][stat]}/${this.EV_MAX_PER_STAT}`);
    return all[root];
  },

  getAllEvs() {
    return this._get('evs') ?? {};
  },

  // Aplica los EVs de la cadena al pokemon recién creado
  applyStoredEvs(pokemon) {
    const stored = this.getEvs(pokemon.name);
    pokemon.evs = { ...pokemon.evs, ...stored };
    return pokemon;
  },

  // ── Medallas ─────────────────────────────────────────────────────────────
  // Las medallas se guardan por la raíz de la cadena evolutiva, igual que los EVs:
  // ganar una medalla con Bulbasaur también la registra para Ivysaur/Venusaur.

  getBadges(pokemonName) {
    const root = this.getEvolutionRoot(pokemonName);
    const all  = this._get('badges') ?? {};
    return all[root] ?? [];
  },

  addBadge(pokemonName, badgeName) {
    const root = this.getEvolutionRoot(pokemonName);
    const all  = this._get('badges') ?? {};
    if (!all[root]) all[root] = [];
    if (!all[root].includes(badgeName)) {
      all[root].push(badgeName);
      this._set('badges', all);
      console.log(`[Storage] Medalla: cadena ${root} obtiene "${badgeName}"`);
    }
    return all[root];
  },

  getAllBadges() {
    return this._get('badges') ?? {};
  },

  // ── MTs aprendidas ───────────────────────────────────────────────────────
  // Guardadas por raíz de cadena evolutiva, igual que los EVs.
  // { root: ['move-id-1', 'move-id-2'] }
  // Se reinician al borrar el storage de pokédex (misma operación de reset).

  getLearnedMTs(pokemonName) {
    const root = this.getEvolutionRoot(pokemonName);
    const all  = this._get('mts') ?? {};
    return all[root] ?? [];
  },

  addLearnedMT(pokemonName, moveId) {
    const root = this.getEvolutionRoot(pokemonName);
    const all  = this._get('mts') ?? {};
    if (!all[root]) all[root] = [];
    if (!all[root].includes(moveId)) {
      all[root].push(moveId);
      this._set('mts', all);
      console.log(`[Storage] MT: cadena ${root} aprende ${moveId}`);
    }
  },

  // ── Objetos recogidos ─────────────────────────────────────────────────────
  // { [itemId]: true }  — booleano, solo marca que se obtuvo alguna vez.
  // No depende del pokemon activo ni de la partida en curso.

  getCollectedItems() {
    return this._get('items') ?? {};
  },

  markItemCollected(itemId) {
    const all = this.getCollectedItems();
    if (all[itemId]) return;
    all[itemId] = true;
    this._set('items', all);
    console.log(`[Storage] Objeto recogido: ${itemId}`);
  },

  isItemCollected(itemId) {
    return this.getCollectedItems()[itemId] === true;
  },

  // ── Frente Batalla ───────────────────────────────────────────────────────
  // Guarda el piso máximo alcanzado (1-20). No se reinicia con la run de aventura.
  // Se usará para desbloquear puntos de entrada en pisos 20, 40, 60, 80 y 100.

  getBfMaxFloor() {
    return this._get('bf_max_floor') ?? 0;
  },

  setBfMaxFloor(floor) {
    const current = this.getBfMaxFloor();
    if (floor <= current) return;
    this._set('bf_max_floor', floor);
    console.log(`[Storage] Frente Batalla: nuevo piso máximo → ${floor}`);
  },

  // ── Final de Kanto ────────────────────────────────────────────────────────
  // Se activa al llegar a info-final-kanto por primera vez. No se borra nunca
  // (ni con reset de run): es un logro permanente del jugador.

  isKantoCompleted() {
    return this._get('kanto_done') === true;
  },

  setKantoCompleted() {
    if (this.isKantoCompleted()) return;
    this._set('kanto_done', true);
    console.log('[Storage] ¡Liga Kanto completada!');
  },

  // ── Logros ────────────────────────────────────────────────────────────────
  // { [logroId]: true }  — booleano por logro desbloqueado.
  // No se borran con clearRun() ni con el reset de run; son permanentes.

  getLogros() {
    return this._get('logros') ?? {};
  },

  unlockLogro(id) {
    const current = this.getLogros();
    if (current[id]) return false;
    current[id] = true;
    this._set('logros', current);
    console.log(`[Storage] Logro desbloqueado: ${id}`);
    return true;
  },

  isLogroUnlocked(id) {
    return this.getLogros()[id] === true;
  },

  // ── Run State ────────────────────────────────────────────────────────────
  // Guarda/carga/elimina el estado de la partida en curso para poder continuar
  // tras recargar el navegador. Independiente de pokédex y EVs.
  // Formato: { version, routeIndex, starterName, team, badges, items }

  saveRun(state) {
    this._set('run', state);
    console.log(`[Storage] Run guardada — ruta ${state.routeIndex}, equipo: ${(state.team ?? []).map(p => p.displayName).join(', ')}`);
  },

  loadRun() {
    return this._get('run');
  },

  hasRun(currentVersion) {
    const save = this._get('run');
    if (!save) return false;
    return save.version === currentVersion;
  },

  clearRun() {
    try {
      localStorage.removeItem(this._key('run'));
      console.log('[Storage] Run eliminada');
    } catch (e) {
      console.warn('[Storage] Error eliminando run', e);
    }
  },

  // ── Progreso máximo de ruta por región ───────────────────────────────────
  // Guarda el area (string) de la ruta más lejana alcanzada, no el índice,
  // para que sea estable aunque se añadan/reordenen rutas en el array.
  // Se resetea explícitamente al iniciar una nueva run.

  getFurthestRoute(regionId) {
    const all = this._get('furthest_routes') ?? {};
    return all[regionId] ?? null; // string area o null
  },

  setFurthestRoute(regionId, area, currentIndex, routes) {
    const all      = this._get('furthest_routes') ?? {};
    const prevArea = all[regionId];
    if (prevArea) {
      const prevIdx = routes.findIndex(r => r.area === prevArea);
      if (prevIdx >= currentIndex) return; // ya tenemos uno más lejano
    }
    all[regionId] = area;
    this._set('furthest_routes', all);
  },

  clearFurthestRoute(regionId) {
    const all = this._get('furthest_routes') ?? {};
    delete all[regionId];
    this._set('furthest_routes', all);
  },

  clearAll() {
    const prefix = this._PREFIX;
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(prefix))
        .forEach(k => localStorage.removeItem(k));
      console.log('[Storage] Todos los datos eliminados');
    } catch (e) {
      console.warn('[Storage] Error limpiando storage', e);
    }
  },
};

// Detecta cambio de versión y limpia todos los datos guardados
// Solo actúa si RESET_STORAGE_ON_VERSION = true en version.js
const _storageVersionGuard = (() => {
  if (!RESET_STORAGE_ON_VERSION) return;
  const KEY = 'pkmn_version';
  const stored = localStorage.getItem(KEY);
  if (stored !== GAME_VERSION) {
    Storage.clearAll();
    localStorage.setItem(KEY, GAME_VERSION);
    console.log(`[Storage] Versión ${stored ?? 'desconocida'} → ${GAME_VERSION}: storage reseteado`);
  }
})();
