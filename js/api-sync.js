// ─────────────────────────────────────────────────────────────────────────────
// API SYNC — envía y recibe los datos de localStorage desde el servidor.
//
// Pendiente de integración. No hay ningún script que lo cargue todavía.
// Mantener en sync con storage.types.ts si cambian los tipos del storage.
//
// ENVÍO  → ApiSync.sync*()  ·  POST al servidor con los datos del storage
// CARGA  → ApiSync.load*()  ·  GET del servidor y escritura en storage
//
// Endpoints cubiertos:
//   /pokedex  · /evs  · /mts  · /badges  · /items  · /run  · /furthest-routes  · /sync (todo en uno)
//
// Uso rápido:
//   await ApiSync.syncAll();   // sube todo el storage al servidor
//   await ApiSync.loadAll();   // descarga todo del servidor y lo escribe en storage
//
// Antes de activar: configura BASE_URL con la URL real del servidor.
// ─────────────────────────────────────────────────────────────────────────────

var ApiSync = (() => {

  // ── Configuración ─────────────────────────────────────────────────────────

  /**
   * URL base del servidor. Todos los endpoints se añaden como sufijo.
   * Ejemplo: 'https://api.tu-servidor.com'
   * @type {string}
   */
  const BASE_URL = '';

  /**
   * Clave de localStorage que persiste el ID de dispositivo entre sesiones.
   * No es autenticación real — identifica al cliente para asociar sus datos.
   */
  const USER_ID_KEY = 'pkmn_user_id';

  /**
   * Devuelve el user_id del dispositivo, creándolo si no existe.
   * Usa crypto.randomUUID() si está disponible; si no, genera un ID aleatorio.
   * @returns {string} UUID v4 o string aleatorio
   */
  function _getUserId() {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  }

  // ── HTTP ──────────────────────────────────────────────────────────────────

  /**
   * Realiza un POST JSON al endpoint indicado.
   * Lanza Error si la respuesta no es 2xx.
   * @param {string} endpoint  Ruta relativa, p.ej. '/sync'
   * @param {object} body      Payload a serializar como JSON
   * @returns {Promise<any>}   Respuesta del servidor parseada como JSON, o null
   */
  async function _post(endpoint, body) {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`[ApiSync] POST ${url}`, body);
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`[ApiSync] ${endpoint} → ${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
    }
    return res.json().catch(() => null);
  }

  /**
   * Realiza un GET al endpoint indicado pasando user_id como query param.
   * Lanza Error si la respuesta no es 2xx.
   * @param {string} endpoint  Ruta relativa, p.ej. '/sync'
   * @returns {Promise<any>}   Respuesta del servidor parseada como JSON
   */
  async function _get(endpoint) {
    const url = `${BASE_URL}${endpoint}?user_id=${encodeURIComponent(_getUserId())}`;
    console.log(`[ApiSync] GET ${url}`);
    const res = await fetch(url, {
      method:  'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`[ApiSync] GET ${endpoint} → ${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
    }
    return res.json();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BUILDERS (storage → filas SQL)
  // Transforman el storage en arrays de filas con los nombres exactos de las
  // columnas SQL (ver storage.types.ts). El servidor puede hacer INSERT/UPSERT
  // directamente sobre estas filas sin transformación adicional.
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Construye las filas de la tabla `pokedex`.
   * Fuente: Storage.getPokedex() → localStorage clave `pkmn_pokedex`
   *
   * Tabla SQL destino:
   *   pokedex (user_id PK, pokemon_name PK, seen, caught, shiny)
   *
   * @returns {Array<{
   *   pokemon_name: string,   // nombre interno del pokémon ('bulbasaur', 'nidoran-f'...)
   *   seen:         boolean,  // true si apareció como rival aunque no se capturara
   *   caught:       boolean,  // true si fue capturado al menos una vez (nunca vuelve a false)
   *   shiny:        boolean,  // true si se capturó alguna vez en versión shiny
   * }>}
   */
  function _buildPokedexRows() {
    const data = Storage.getPokedex();
    return Object.entries(data).map(([pokemon_name, entry]) => ({
      pokemon_name,
      seen:   entry.seen   ?? false,
      caught: entry.caught ?? false,
      shiny:  entry.shiny  ?? false,
    }));
  }

  /**
   * Construye las filas de la tabla `evs`.
   * Fuente: Storage.getAllEvs() → localStorage clave `pkmn_evs`
   *
   * Los EVs se guardan por CADENA EVOLUTIVA, no por pokémon individual.
   * Bulbasaur/Ivysaur/Venusaur comparten la misma fila bajo 'bulbasaur'.
   * Máximo 32 EVs por stat (Storage.EV_MAX_PER_STAT). Cada 4 EVs = +1 punto de stat.
   *
   * Tabla SQL destino:
   *   evs (user_id PK, evolution_root PK, hp, atk, def, spa, spd, spe)
   *
   * @returns {Array<{
   *   evolution_root: string,  // primer eslabón de la cadena ('bulbasaur', 'rattata'...)
   *   hp:             number,  // EVs de PS (0–32)
   *   atk:            number,  // EVs de Ataque (0–32)
   *   def:            number,  // EVs de Defensa (0–32)
   *   spa:            number,  // EVs de Ataque Especial (0–32)
   *   spd:            number,  // EVs de Defensa Especial (0–32)
   *   spe:            number,  // EVs de Velocidad (0–32)
   * }>}
   */
  function _buildEvRows() {
    const data = Storage.getAllEvs();
    return Object.entries(data).map(([evolution_root, evs]) => ({
      evolution_root,
      hp:  evs.hp  ?? 0,
      atk: evs.atk ?? 0,
      def: evs.def ?? 0,
      spa: evs.spa ?? 0,
      spd: evs.spd ?? 0,
      spe: evs.spe ?? 0,
    }));
  }

  /**
   * Construye las filas de la tabla `mts`.
   * Fuente: Storage._get('mts') → localStorage clave `pkmn_mts`
   *
   * Las MTs también se guardan por cadena evolutiva (mismo criterio que EVs).
   * Una fila por combinación cadena+movimiento (relación N:M normalizada).
   *
   * Tabla SQL destino:
   *   mts (user_id PK, evolution_root PK, move_id PK)
   *
   * @returns {Array<{
   *   evolution_root: string,  // primer eslabón de la cadena ('bulbasaur'...)
   *   move_id:        string,  // id del movimiento aprendido ('earthquake', 'ice-beam'...)
   * }>}
   */
  function _buildMtRows() {
    const data = Storage._get('mts') ?? {};
    const rows = [];
    for (const [evolution_root, move_ids] of Object.entries(data)) {
      for (const move_id of (move_ids ?? [])) {
        rows.push({ evolution_root, move_id });
      }
    }
    return rows;
  }

  /**
   * Construye las filas de la tabla `badges`.
   * Fuente: Storage.getAllBadges() → localStorage clave `pkmn_badges`
   *
   * Las medallas también se guardan por cadena evolutiva.
   * Ganar una medalla con Bulbasaur la registra también para Ivysaur/Venusaur.
   * Una fila por combinación cadena+medalla (relación N:M normalizada).
   *
   * Tabla SQL destino:
   *   badges (user_id PK, evolution_root PK, badge_id PK)
   *
   * @returns {Array<{
   *   evolution_root: string,  // primer eslabón de la cadena ('bulbasaur'...)
   *   badge_id:       string,  // id de la medalla ('boulder-badge', 'cascade-badge'...)
   * }>}
   */
  function _buildBadgeRows() {
    const data = Storage.getAllBadges();
    const rows = [];
    for (const [evolution_root, badge_ids] of Object.entries(data)) {
      for (const badge_id of (badge_ids ?? [])) {
        rows.push({ evolution_root, badge_id });
      }
    }
    return rows;
  }

  /**
   * Construye las filas de la tabla `items`.
   * Fuente: Storage.getCollectedItems() → localStorage clave `pkmn_items`
   *
   * Un objeto recogido es un booleano permanente — nunca vuelve a false.
   * Una fila por objeto recogido (no se almacenan los no recogidos).
   *
   * Tabla SQL destino:
   *   items (user_id PK, item_id PK)
   *
   * @returns {Array<{ item_id: string }>}
   */
  function _buildItemRows() {
    const data = Storage.getCollectedItems();
    return Object.entries(data)
      .filter(([, v]) => v === true)
      .map(([item_id]) => ({ item_id }));
  }

  /**
   * Construye las filas de la tabla `furthest_routes`.
   * Fuente: Storage.getFurthestRoute() → localStorage clave `pkmn_furthest_routes`
   *
   * Una fila por región con el area (string) de la ruta más lejana alcanzada
   * en la run activa. Se resetea al iniciar una nueva run.
   *
   * Tabla SQL destino:
   *   furthest_routes (user_id PK, region_id PK, area)
   *
   * @returns {Array<{ region_id: string, area: string }>}
   */
  function _buildFurthestRoutesRows() {
    const all = Storage._get('furthest_routes') ?? {};
    return Object.entries(all)
      .filter(([, area]) => area != null)
      .map(([region_id, area]) => ({ region_id, area }));
  }

  /**
   * Convierte el array de filas de furthest_routes al formato de localStorage.
   * @param {Array<{ region_id: string, area: string }>} rows
   * @returns {{ [region_id: string]: string }}
   */
  function _parseFurthestRoutesRows(rows) {
    const result = {};
    for (const row of (rows ?? [])) {
      if (row.region_id && row.area) result[row.region_id] = row.area;
    }
    return result;
  }

  /**
   * Construye el payload de la run activa (cabecera + equipo).
   * Fuente: Storage.loadRun() → localStorage clave `pkmn_run`
   *
   * Devuelve null si no hay ninguna run guardada.
   *
   * Se divide en dos objetos para que el servidor pueda insertar en tablas separadas:
   *   - run_data  → cabecera de la partida (tabla `runs`)
   *   - run_team  → uno por pokémon del equipo (tabla `run_team`)
   *
   * ── run_data ──────────────────────────────────────────────────────────────
   * Tabla SQL destino:
   *   runs (run_id PK auto, user_id, version, route_index, starter_name, badges, items)
   *
   * @typedef {{
   *   version:      string,    // versión del juego al guardar ('1.0.0'...) — guard de compatibilidad
   *   route_index:  number,    // índice en KANTO_ROUTES de la ruta actual (0-based)
   *   starter_name: string,    // nombre del pokémon inicial elegido ('bulbasaur'...)
   *   badges:       string[],  // medallas de gimnasio obtenidas en esta run (['boulder-badge'...])
   *   items:        string[],  // objetos consumibles del jugador (['potion', 'pokeball'...])
   * }} RunData
   *
   * ── run_team ──────────────────────────────────────────────────────────────
   * Tabla SQL destino:
   *   run_team (run_id FK, slot PK, pokemon_name, display_name, level, current_hp,
   *             max_hp, nature, exp, shiny, held_item, auto_move, status_effect,
   *             evs JSON, ivs JSON, moves JSON, learned_mts JSON)
   *
   * @typedef {{
   *   slot:          number,        // posición en el equipo (0–5)
   *   pokemon_name:  string,        // nombre interno ('ivysaur', 'pikachu'...)
   *   display_name:  string,        // nombre para mostrar ('Ivysaur', 'Pikachu'...)
   *   level:         number,        // nivel actual (1–100)
   *   current_hp:    number,        // PS actuales — puede ser 0 si está debilitado
   *   max_hp:        number,        // PS máximos computados (baseStats + IVs + EVs + nature)
   *   nature:        string,        // naturaleza ('modest', 'adamant'... — ver natures.js)
   *   exp:           number,        // experiencia acumulada en el nivel actual
   *   shiny:         boolean,       // true si es la variante de color alternativo
   *   held_item:     string|null,   // id del objeto equipado ('sitrus-berry', 'carbon'... o null)
   *   auto_move:     string|null,   // id del movimiento activo en modo automático
   *   status_effect: object|null,   // { id: string, turnsActive: number } o null
   *   evs: {                        // EVs actuales del pokémon (no de la cadena completa)
   *     hp, atk, def, spa, spd, spe: number  // 0–32 cada uno
   *   },
   *   ivs: {                        // IVs individuales (generalmente todos a 31)
   *     hp, atk, def, spa, spd, spe: number  // 0–31 cada uno
   *   },
   *   moves: Array<{                // moveset actual (máx. ~6 movimientos)
   *     id:     string,             // id del movimiento ('ember', 'tackle'...)
   *     name:   string,             // nombre visible ('Ascuas', 'Placaje'...)
   *     pp:     number,             // PP restantes
   *     max_pp: number,             // PP máximos del movimiento
   *   }>,
   *   learned_mts: string[],        // ids de MTs que este pokémon tiene cargadas
   * }} RunTeamSlot
   *
   * @returns {{ run_data: RunData, run_team: RunTeamSlot[] } | null}
   */
  function _buildRunPayload() {
    const run = Storage.loadRun();
    if (!run) return null;

    const region            = run.region ?? 'kanto';
    const furthest_route_area = Storage.getFurthestRoute(region) ?? null;

    const run_data = {
      version:             run.version,
      region,
      route_index:         run.routeIndex,
      furthest_route_area,
      starter_name:        run.starterName,
      badges:              run.badges  ?? [],
      items:               run.items   ?? [],
    };

    const run_team = (run.team ?? []).map((pokemon, slot) => ({
      slot,
      pokemon_name:  pokemon.name,
      display_name:  pokemon.displayName,
      level:         pokemon.level,
      current_hp:    pokemon.currentHp,
      max_hp:        pokemon.stats?.hp    ?? 0,
      nature:        pokemon.nature,
      exp:           pokemon.exp,
      shiny:         pokemon.shiny        ?? false,
      held_item:     pokemon.heldItem     ?? null,
      ability:       pokemon.ability      ?? null,
      hide_ability:  pokemon.hideAbility  ?? null,
      auto_move:     pokemon.autoMove     ?? null,
      status_effect: pokemon.statusEffect ?? null,
      evs: {
        hp:  pokemon.evs?.hp  ?? 0,
        atk: pokemon.evs?.atk ?? 0,
        def: pokemon.evs?.def ?? 0,
        spa: pokemon.evs?.spa ?? 0,
        spd: pokemon.evs?.spd ?? 0,
        spe: pokemon.evs?.spe ?? 0,
      },
      ivs: {
        hp:  pokemon.ivs?.hp  ?? 31,
        atk: pokemon.ivs?.atk ?? 31,
        def: pokemon.ivs?.def ?? 31,
        spa: pokemon.ivs?.spa ?? 31,
        spd: pokemon.ivs?.spd ?? 31,
        spe: pokemon.ivs?.spe ?? 31,
      },
      moves: (pokemon.moves ?? []).map(m => ({
        id:     m.id,
        name:   m.name,
        pp:     m.pp,
        max_pp: m.maxPp,
      })),
      learned_mts: pokemon.learnedMTs ?? [],
    }));

    return { run_data, run_team };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PARSERS (filas SQL → storage)
  // Transforman los arrays de filas recibidos del servidor al formato exacto
  // que Storage._set() espera en localStorage. Inverso de los builders.
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Convierte el array de filas de pokedex al formato de localStorage.
   * @param {Array<{ pokemon_name, seen, caught, shiny }>} rows
   * @returns {{ [pokemon_name: string]: { seen, caught, shiny } }}
   */
  function _parsePokedexRows(rows) {
    const result = {};
    for (const row of (rows ?? [])) {
      result[row.pokemon_name] = {
        seen:   row.seen   ?? false,
        caught: row.caught ?? false,
        shiny:  row.shiny  ?? false,
      };
    }
    return result;
  }

  /**
   * Convierte el array de filas de evs al formato de localStorage.
   * @param {Array<{ evolution_root, hp, atk, def, spa, spd, spe }>} rows
   * @returns {{ [evolution_root: string]: { hp, atk, def, spa, spd, spe } }}
   */
  function _parseEvRows(rows) {
    const result = {};
    for (const row of (rows ?? [])) {
      result[row.evolution_root] = {
        hp:  row.hp  ?? 0,
        atk: row.atk ?? 0,
        def: row.def ?? 0,
        spa: row.spa ?? 0,
        spd: row.spd ?? 0,
        spe: row.spe ?? 0,
      };
    }
    return result;
  }

  /**
   * Convierte el array de filas de mts al formato de localStorage.
   * Agrupa los move_id de la misma cadena en un array.
   * @param {Array<{ evolution_root, move_id }>} rows
   * @returns {{ [evolution_root: string]: string[] }}
   */
  function _parseMtRows(rows) {
    const result = {};
    for (const row of (rows ?? [])) {
      if (!result[row.evolution_root]) result[row.evolution_root] = [];
      result[row.evolution_root].push(row.move_id);
    }
    return result;
  }

  /**
   * Convierte el array de filas de badges al formato de localStorage.
   * Agrupa los badge_id de la misma cadena en un array.
   * @param {Array<{ evolution_root, badge_id }>} rows
   * @returns {{ [evolution_root: string]: string[] }}
   */
  function _parseBadgeRows(rows) {
    const result = {};
    for (const row of (rows ?? [])) {
      if (!result[row.evolution_root]) result[row.evolution_root] = [];
      result[row.evolution_root].push(row.badge_id);
    }
    return result;
  }

  /**
   * Convierte el array de filas de items al formato de localStorage.
   * @param {Array<{ item_id: string }>} rows
   * @returns {{ [item_id: string]: true }}
   */
  function _parseItemRows(rows) {
    const result = {};
    for (const row of (rows ?? [])) {
      result[row.item_id] = true;
    }
    return result;
  }

  /**
   * Convierte run_data + run_team al formato que Storage.saveRun() espera.
   * Reconstruye el array `team` con el formato de objeto pokémon del juego,
   * ordenado por slot. Los campos snake_case se convierten de vuelta a camelCase.
   *
   * @param {RunData|null}     run_data
   * @param {RunTeamSlot[]}    run_team
   * @returns {object|null}  Objeto listo para pasar a Storage.saveRun(), o null
   */
  function _parseRunPayload(run_data, run_team) {
    if (!run_data) return null;

    const team = (run_team ?? [])
      .sort((a, b) => a.slot - b.slot)
      .map(slot => ({
        name:         slot.pokemon_name,
        displayName:  slot.display_name,
        level:        slot.level,
        currentHp:    slot.current_hp,
        stats: {
          // Solo hp es necesario para renderizar la barra. El resto se
          // recalcula en computeStats() cuando el pokémon se usa en combate.
          hp:  slot.max_hp,
          atk: 0, def: 0, spa: 0, spd: 0, spe: 0,
        },
        nature:       slot.nature,
        exp:          slot.exp,
        shiny:        slot.shiny        ?? false,
        heldItem:     slot.held_item    ?? null,
        ability:      slot.ability      ?? null,
        hideAbility:  slot.hide_ability ?? null,
        autoMove:     slot.auto_move    ?? null,
        statusEffect: slot.status_effect ?? null,
        evs:          slot.evs  ?? { hp:0, atk:0, def:0, spa:0, spd:0, spe:0 },
        ivs:          slot.ivs  ?? { hp:31, atk:31, def:31, spa:31, spd:31, spe:31 },
        moves: (slot.moves ?? []).map(m => ({
          id:    m.id,
          name:  m.name,
          pp:    m.pp,
          maxPp: m.max_pp,
        })),
        learnedMTs:   slot.learned_mts ?? [],
        isPlayer:     true,
        combatMods:   {},
        _heldItemFlags: {},
      }));

    // Restaurar el progreso de ruta más lejana en Storage si viene del servidor
    if (run_data.region && run_data.furthest_route_area) {
      Storage.setFurthestRoute(run_data.region, run_data.furthest_route_area, Infinity, []);
    }

    return {
      version:            run_data.version,
      region:             run_data.region ?? 'kanto',
      routeIndex:         run_data.route_index,
      furthestRouteIndex: run_data.furthest_route_area ? null : 0, // se recalcula en screens.js desde Storage
      starterName:        run_data.starter_name,
      team,
      badges:             run_data.badges ?? [],
      items:              run_data.items  ?? [],
    };
  }

  // ── Funciones públicas — ENVÍO ─────────────────────────────────────────────

  /**
   * Envía el estado de la Pokédex al servidor.
   * POST /pokedex → { user_id, pokedex: PokedexRow[] }
   */
  async function syncPokedex() {
    const user_id = _getUserId();
    const pokedex = _buildPokedexRows();
    console.log(`[ApiSync] Enviando pokédex — ${pokedex.length} entradas`);
    return _post('/pokedex', { user_id, pokedex });
  }

  /**
   * Envía los EVs acumulados por cadena evolutiva.
   * POST /evs → { user_id, evs: EvRow[] }
   */
  async function syncEvs() {
    const user_id = _getUserId();
    const evs = _buildEvRows();
    console.log(`[ApiSync] Enviando EVs — ${evs.length} cadenas evolutivas`);
    return _post('/evs', { user_id, evs });
  }

  /**
   * Envía las MTs aprendidas por cadena evolutiva.
   * POST /mts → { user_id, mts: MtRow[] }
   */
  async function syncMts() {
    const user_id = _getUserId();
    const mts = _buildMtRows();
    console.log(`[ApiSync] Enviando MTs — ${mts.length} registros`);
    return _post('/mts', { user_id, mts });
  }

  /**
   * Envía las medallas obtenidas por cadena evolutiva.
   * POST /badges → { user_id, badges: BadgeRow[] }
   */
  async function syncBadges() {
    const user_id = _getUserId();
    const badges = _buildBadgeRows();
    console.log(`[ApiSync] Enviando medallas — ${badges.length} registros`);
    return _post('/badges', { user_id, badges });
  }

  /**
   * Envía los objetos recogidos al servidor.
   * POST /items → { user_id, items: ItemRow[] }
   */
  async function syncItems() {
    const user_id = _getUserId();
    const items = _buildItemRows();
    console.log(`[ApiSync] Enviando objetos recogidos — ${items.length} registros`);
    return _post('/items', { user_id, items });
  }

  /**
   * Envía la partida activa (cabecera + equipo completo).
   * No hace nada si no hay ninguna run guardada.
   * POST /run → { user_id, run_data: RunData, run_team: RunTeamSlot[] }
   */
  async function syncRun() {
    const user_id = _getUserId();
    const payload = _buildRunPayload();
    if (!payload) {
      console.log('[ApiSync] No hay run activa — nada que enviar.');
      return null;
    }
    const { run_data, run_team } = payload;
    console.log(`[ApiSync] Enviando run — ruta ${run_data.route_index}, equipo: ${run_team.length} pokémon`);
    return _post('/run', { user_id, run_data, run_team });
  }

  /**
   * Envía el progreso de ruta más lejana por región (SmartRotom).
   * POST /furthest-routes → { user_id, furthest_routes: FurthestRouteRow[] }
   */
  async function syncFurthestRoutes() {
    const user_id         = _getUserId();
    const furthest_routes = _buildFurthestRoutesRows();
    console.log(`[ApiSync] Enviando furthest_routes — ${furthest_routes.length} regiones`);
    return _post('/furthest-routes', { user_id, furthest_routes });
  }

  /**
   * Envía la planta más alta alcanzada en el Frente Batalla.
   * POST /bf-floor → { user_id, bf_max_floor: number }
   */
  async function syncBfFloor() {
    const user_id     = _getUserId();
    const bf_max_floor = Storage.getBfMaxFloor();
    console.log(`[ApiSync] Enviando planta máxima BF — ${bf_max_floor}`);
    return _post('/bf-floor', { user_id, bf_max_floor });
  }

  /**
   * Envía TODO el storage en un único POST.
   * El servidor puede procesar todas las tablas en una sola transacción.
   *
   * POST /sync → {
   *   user_id:       string,          // ID de dispositivo (UUID)
   *   pkmn_version:  string|null,     // versión de juego del guard de storage ('pkmn_version')
   *   pokedex:          PokedexRow[],           // filas de la tabla pokedex
   *   evs:              EvRow[],               // filas de la tabla evs
   *   mts:              MtRow[],               // filas de la tabla mts
   *   badges:           BadgeRow[],            // filas de la tabla badges
   *   items:            ItemRow[],             // filas de la tabla items
   *   furthest_routes:  FurthestRouteRow[],   // ruta más lejana alcanzada por región
   *   bf_max_floor:     number,               // planta más alta alcanzada en Frente Batalla
   *   run_data:         RunData|null,          // cabecera de la run activa (null si no hay run)
   *   run_team:         RunTeamSlot[],         // equipo de la run activa ([] si no hay run)
   * }
   */
  async function syncAll() {
    const user_id    = _getUserId();
    const pokedex    = _buildPokedexRows();
    const evs        = _buildEvRows();
    const mts        = _buildMtRows();
    const badges     = _buildBadgeRows();
    const items      = _buildItemRows();
    const runPayload = _buildRunPayload();

    const furthest_routes = _buildFurthestRoutesRows();

    const body = {
      user_id,
      pkmn_version:    localStorage.getItem('pkmn_version') ?? null,
      pokedex,
      evs,
      mts,
      badges,
      items,
      furthest_routes,
      bf_max_floor:    Storage.getBfMaxFloor(),
      run_data:        runPayload?.run_data ?? null,
      run_team:        runPayload?.run_team ?? [],
    };

    console.log(
      `[ApiSync] syncAll — pokédex:${pokedex.length} evs:${evs.length}` +
      ` mts:${mts.length} medallas:${badges.length} objetos:${items.length}` +
      ` furthest_routes:${furthest_routes.length}` +
      ` bf_max_floor:${body.bf_max_floor}` +
      ` run:${runPayload ? `ruta ${body.run_data.route_index}` : 'ninguna'}`
    );

    return _post('/sync', body);
  }

  // ── Funciones públicas — CARGA ─────────────────────────────────────────────

  /**
   * Descarga la pokédex del servidor y la escribe en localStorage.
   *
   * GET /pokedex?user_id=...
   *
   * Respuesta esperada del backend:
   * {
   *   "pokedex": [
   *     { "pokemon_name": "bulbasaur", "seen": true,  "caught": true,  "shiny": false },
   *     { "pokemon_name": "pikachu",   "seen": true,  "caught": false, "shiny": false },
   *     { "pokemon_name": "mewtwo",    "seen": false, "caught": false, "shiny": true  }
   *   ]
   * }
   *
   * @returns {Promise<object>} El objeto escrito en storage
   */
  async function loadPokedex() {
    const data = await _get('/pokedex');
    const parsed = _parsePokedexRows(data.pokedex);
    Storage._set('pokedex', parsed);
    console.log(`[ApiSync] Pokédex cargada — ${Object.keys(parsed).length} entradas`);
    return parsed;
  }

  /**
   * Descarga los EVs del servidor y los escribe en localStorage.
   *
   * GET /evs?user_id=...
   *
   * Respuesta esperada del backend:
   * {
   *   "evs": [
   *     { "evolution_root": "bulbasaur", "hp": 0, "atk": 8, "def": 0, "spa": 16, "spd": 0, "spe": 4 },
   *     { "evolution_root": "rattata",   "hp": 4, "atk": 0, "def": 0, "spa": 0,  "spd": 0, "spe": 8 }
   *   ]
   * }
   *
   * @returns {Promise<object>} El objeto escrito en storage
   */
  async function loadEvs() {
    const data = await _get('/evs');
    const parsed = _parseEvRows(data.evs);
    Storage._set('evs', parsed);
    console.log(`[ApiSync] EVs cargados — ${Object.keys(parsed).length} cadenas evolutivas`);
    return parsed;
  }

  /**
   * Descarga las MTs del servidor y las escribe en localStorage.
   *
   * GET /mts?user_id=...
   *
   * Respuesta esperada del backend:
   * {
   *   "mts": [
   *     { "evolution_root": "bulbasaur", "move_id": "earthquake" },
   *     { "evolution_root": "bulbasaur", "move_id": "ice-beam"   },
   *     { "evolution_root": "rattata",   "move_id": "take-down"  }
   *   ]
   * }
   *
   * @returns {Promise<object>} El objeto escrito en storage
   */
  async function loadMts() {
    const data = await _get('/mts');
    const parsed = _parseMtRows(data.mts);
    Storage._set('mts', parsed);
    console.log(`[ApiSync] MTs cargadas — ${data.mts?.length ?? 0} registros`);
    return parsed;
  }

  /**
   * Descarga las medallas del servidor y las escribe en localStorage.
   *
   * GET /badges?user_id=...
   *
   * Respuesta esperada del backend:
   * {
   *   "badges": [
   *     { "evolution_root": "bulbasaur", "badge_id": "boulder-badge"  },
   *     { "evolution_root": "bulbasaur", "badge_id": "cascade-badge"  },
   *     { "evolution_root": "rattata",   "badge_id": "boulder-badge"  }
   *   ]
   * }
   *
   * @returns {Promise<object>} El objeto escrito en storage
   */
  async function loadBadges() {
    const data = await _get('/badges');
    const parsed = _parseBadgeRows(data.badges);
    Storage._set('badges', parsed);
    console.log(`[ApiSync] Medallas cargadas — ${data.badges?.length ?? 0} registros`);
    return parsed;
  }

  /**
   * Descarga los objetos recogidos del servidor y los escribe en localStorage.
   *
   * GET /items?user_id=...
   *
   * Respuesta esperada del backend:
   * {
   *   "items": [
   *     { "item_id": "carbon" },
   *     { "item_id": "sitrus-berry" }
   *   ]
   * }
   *
   * @returns {Promise<object>} El objeto escrito en storage
   */
  async function loadItems() {
    const data = await _get('/items');
    const parsed = _parseItemRows(data.items);
    Storage._set('items', parsed);
    console.log(`[ApiSync] Objetos cargados — ${data.items?.length ?? 0} registros`);
    return parsed;
  }

  /**
   * Descarga la run activa del servidor y la escribe en localStorage.
   * Si el servidor devuelve run_data: null, borra la run local.
   *
   * GET /run?user_id=...
   *
   * Respuesta esperada del backend:
   * {
   *   "run_data": {
   *     "version":      "1.0.0",
   *     "route_index":  3,
   *     "starter_name": "bulbasaur",
   *     "badges":       ["boulder-badge"],
   *     "items":        []
   *   },
   *   "run_team": [
   *     {
   *       "slot":          0,
   *       "pokemon_name":  "ivysaur",
   *       "display_name":  "Ivysaur",
   *       "level":         18,
   *       "current_hp":    45,
   *       "max_hp":        58,
   *       "nature":        "modest",
   *       "exp":           340,
   *       "shiny":         false,
   *       "held_item":     "sitrus-berry",
   *       "auto_move":     "magical-leaf",
   *       "status_effect": null,
   *       "evs":  { "hp": 0, "atk": 8, "def": 0, "spa": 16, "spd": 0, "spe": 4 },
   *       "ivs":  { "hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31 },
   *       "moves": [
   *         { "id": "absorb",       "name": "Absorber",    "pp": 20, "max_pp": 25 },
   *         { "id": "magical-leaf", "name": "Hoja Magica", "pp": 99, "max_pp": 99 },
   *         { "id": "poison-powder","name": "Polvo Veneno","pp": 30, "max_pp": 35 },
   *         { "id": "sludge-bomb",  "name": "Bomba Lodo",  "pp": 8,  "max_pp": 10 }
   *       ],
   *       "learned_mts": ["earthquake"]
   *     },
   *     {
   *       "slot":          1,
   *       "pokemon_name":  "pikachu",
   *       "display_name":  "Pikachu",
   *       "level":         12,
   *       "current_hp":    32,
   *       "max_hp":        38,
   *       "nature":        "jolly",
   *       "exp":           80,
   *       "shiny":         true,
   *       "held_item":     null,
   *       "auto_move":     "thunder-shock",
   *       "status_effect": { "id": "poison", "turnsActive": 2 },
   *       "evs":  { "hp": 0, "atk": 0, "def": 0, "spa": 0, "spd": 0, "spe": 4 },
   *       "ivs":  { "hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31 },
   *       "moves": [
   *         { "id": "thunder-shock", "name": "Impactrueno", "pp": 25, "max_pp": 30 }
   *       ],
   *       "learned_mts": []
   *     }
   *   ]
   * }
   *
   * Si no hay run activa el backend debe devolver:
   * { "run_data": null, "run_team": [] }
   *
   * @returns {Promise<object|null>} El objeto escrito en storage, o null si no había run
   */
  async function loadRun() {
    const data = await _get('/run');
    const parsed = _parseRunPayload(data.run_data, data.run_team);
    if (parsed) {
      Storage.saveRun(parsed);
      console.log(`[ApiSync] Run cargada — ruta ${parsed.routeIndex}, equipo: ${parsed.team.length} pokémon`);
    } else {
      Storage.clearRun();
      console.log('[ApiSync] No hay run activa en el servidor — run local eliminada.');
    }
    return parsed;
  }

  /**
   * Descarga el progreso de ruta más lejana por región y lo escribe en localStorage.
   * El valor del servidor sobreescribe el local (la nube es autoritativa para este dato).
   *
   * GET /furthest-routes?user_id=...
   *
   * Respuesta esperada del backend:
   * { "furthest_routes": [{ "region_id": "kanto", "area": "guarida-rocket" }] }
   *
   * @returns {Promise<object>} El objeto escrito en storage
   */
  async function loadFurthestRoutes() {
    const data   = await _get('/furthest-routes');
    const parsed = _parseFurthestRoutesRows(data.furthest_routes);
    Storage._set('furthest_routes', parsed);
    console.log(`[ApiSync] furthest_routes cargadas — ${Object.keys(parsed).length} regiones`);
    return parsed;
  }

  /**
   * Descarga la planta más alta del Frente Batalla y la escribe en localStorage.
   * El valor del servidor siempre sobreescribe el local (la nube es autoritativa).
   *
   * GET /bf-floor?user_id=...
   *
   * Respuesta esperada del backend:
   * { "bf_max_floor": 40 }
   *
   * @returns {Promise<number>} La planta cargada
   */
  async function loadBfFloor() {
    const data  = await _get('/bf-floor');
    if (data.bf_max_floor == null) {
      console.log('[ApiSync] Planta máxima BF no presente en servidor — sin cambios locales.');
      return null;
    }
    const floor = typeof data.bf_max_floor === 'number' ? data.bf_max_floor : 0;
    Storage._set('bf_max_floor', floor);
    console.log(`[ApiSync] Planta máxima BF cargada — ${floor}`);
    return floor;
  }

  /**
   * Descarga TODO el storage del servidor y lo escribe en localStorage.
   * Equivale a llamar a todos los load* en orden en una sola petición.
   *
   * GET /sync?user_id=...
   *
   * Respuesta esperada del backend (todos los campos del syncAll combinados):
   * {
   *   "pkmn_version":  "1.0.0",
   *   "pokedex":       [ ...PokedexRow[] ],
   *   "evs":           [ ...EvRow[]      ],
   *   "mts":           [ ...MtRow[]      ],
   *   "badges":        [ ...BadgeRow[]   ],
   *   "items":         [ ...ItemRow[]    ],
   *   "bf_max_floor":  40,
   *   "run_data":      { ...RunData } | null,
   *   "run_team":      [ ...RunTeamSlot[] ]
   * }
   *
   * @returns {Promise<{ pokedex, evs, mts, badges, items, bfMaxFloor, run }>} Resumen de lo cargado
   */
  async function loadAll() {
    const data = await _get('/sync');

    const pokedex        = _parsePokedexRows(data.pokedex);
    const evs            = _parseEvRows(data.evs);
    const mts            = _parseMtRows(data.mts);
    const badges         = _parseBadgeRows(data.badges);
    const items          = _parseItemRows(data.items);
    const furthestRoutes = _parseFurthestRoutesRows(data.furthest_routes);
    const bfMaxFloor     = data.bf_max_floor != null
      ? (typeof data.bf_max_floor === 'number' ? data.bf_max_floor : 0)
      : null;
    const run            = _parseRunPayload(data.run_data, data.run_team);

    Storage._set('pokedex',          pokedex);
    Storage._set('evs',              evs);
    Storage._set('mts',              mts);
    Storage._set('badges',           badges);
    Storage._set('items',            items);
    Storage._set('furthest_routes',  furthestRoutes);
    if (bfMaxFloor != null) Storage._set('bf_max_floor', bfMaxFloor);

    if (run) {
      Storage.saveRun(run);
    } else {
      Storage.clearRun();
    }

    if (data.pkmn_version) {
      localStorage.setItem('pkmn_version', data.pkmn_version);
    }

    console.log(
      `[ApiSync] loadAll — pokédex:${Object.keys(pokedex).length}` +
      ` evs:${Object.keys(evs).length}` +
      ` mts:${data.mts?.length ?? 0}` +
      ` medallas:${data.badges?.length ?? 0}` +
      ` objetos:${data.items?.length ?? 0}` +
      ` furthest_routes:${Object.keys(furthestRoutes).length}` +
      ` bf_max_floor:${bfMaxFloor ?? '(no presente)'}` +
      ` run:${run ? `ruta ${run.routeIndex}` : 'ninguna'}`
    );

    return { pokedex, evs, mts, badges, items, furthestRoutes, bfMaxFloor, run };
  }

  return {
    // Envío
    syncPokedex, syncEvs, syncMts, syncBadges, syncItems, syncRun, syncFurthestRoutes, syncBfFloor, syncAll,
    // Carga
    loadPokedex, loadEvs, loadMts, loadBadges, loadItems, loadRun, loadFurthestRoutes, loadBfFloor, loadAll,
  };

})();
