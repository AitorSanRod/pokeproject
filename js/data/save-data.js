// ─────────────────────────────────────────────────────────────────────────────
// SAVE DATA — exportar e importar datos persistentes del jugador
//
// Incluye: pokédex, EVs, MTs, medallas, objetos recogidos, piso máximo del Frente Batalla.
// Excluye: run activa (pkmn_run) — el progreso de la partida en curso no viaja.
//
// Formato del archivo: .txt con JSON interno.
// Versión del esquema guardada en el campo "schema" para compatibilidad futura.
//
// Uso:
//   SaveData.exportar();           → descarga pokemon-datos-YYYY-MM-DD.txt
//   SaveData.importar(onSuccess);  → abre selector de archivo, llama a onSuccess()
// ─────────────────────────────────────────────────────────────────────────────

const SAVE_DATA_SCHEMA = 1;

const SaveData = {

  // ── Exportar ──────────────────────────────────────────────────────────────
  exportar() {
    const payload = {
      schema:       SAVE_DATA_SCHEMA,
      version:      typeof GAME_VERSION !== 'undefined' ? GAME_VERSION : null,
      pokedex:      Storage.getPokedex(),
      evs:          Storage.getAllEvs(),
      badges:       Storage.getAllBadges(),
      items:        Storage.getCollectedItems(),
      mts:          Storage._get('mts') ?? {},
      kantoDone:    Storage.isKantoCompleted(),
      bfMaxFloor:   Storage.getBfMaxFloor(),
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `pokemon-datos-${SaveData._today()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[SaveData] Exportado:', Object.keys(payload).filter(k => k !== 'schema' && k !== 'version').join(', '));
  },

  // ── Importar ──────────────────────────────────────────────────────────────
  // onSuccess: función opcional que se llama si la importación termina bien.
  // onError:   función opcional que se llama con el mensaje de error si falla.
  importar(onSuccess, onError) {
    const input   = document.createElement('input');
    input.type    = 'file';
    input.accept  = '.txt,.json,text/plain,application/json';

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);
          SaveData._validate(data);
          SaveData._apply(data);
          console.log('[SaveData] Importado correctamente desde', file.name);
          onSuccess?.();
        } catch (err) {
          console.error('[SaveData] Error al importar:', err.message);
          onError?.(err.message);
        }
      };
      reader.onerror = () => {
        const msg = 'No se pudo leer el archivo.';
        console.error('[SaveData]', msg);
        onError?.(msg);
      };
      reader.readAsText(file, 'utf-8');
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  },

  // ── Privado: validar estructura mínima ────────────────────────────────────
  _validate(data) {
    if (typeof data !== 'object' || data === null) {
      throw new Error('El archivo no contiene un JSON válido.');
    }
    const hasAny = ['pokedex', 'evs', 'badges', 'items', 'mts', 'kantoDone', 'bfMaxFloor'].some(k => k in data);
    if (!hasAny) {
      throw new Error('El archivo no parece un fichero de datos de este juego.');
    }
  },

  // ── Privado: escribir en Storage ─────────────────────────────────────────
  // pokedex/evs/badges/items se reemplazan por completo.
  // mts se fusiona (unión): nunca se pierden MTs aprendidas que no estén en el archivo.
  _apply(data) {
    if (data.pokedex   && typeof data.pokedex === 'object') Storage._set('pokedex',    data.pokedex);
    if (data.evs       && typeof data.evs     === 'object') Storage._set('evs',        data.evs);
    if (data.badges    && typeof data.badges  === 'object') Storage._set('badges',     data.badges);
    if (data.items     && typeof data.items   === 'object') Storage._set('items',      data.items);
    if (data.mts       && typeof data.mts     === 'object') {
      const existing = Storage._get('mts') ?? {};
      const merged   = { ...existing };
      for (const [root, moves] of Object.entries(data.mts)) {
        if (!merged[root]) merged[root] = [];
        for (const id of (moves ?? [])) {
          if (!merged[root].includes(id)) merged[root].push(id);
        }
      }
      Storage._set('mts', merged);
    }
    if (data.kantoDone === true)                            Storage._set('kanto_done', true);
    if (typeof data.bfMaxFloor === 'number' && data.bfMaxFloor > 0) Storage.setBfMaxFloor(data.bfMaxFloor);
  },

  // ── Privado: fecha de hoy en formato YYYY-MM-DD ───────────────────────────
  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
};
