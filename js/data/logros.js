// ─────────────────────────────────────────────────────────────────────────────
// LOGROS — definición y comprobación de hitos del jugador
//
// Requiere storage.js cargado antes. Las funciones check() se evalúan en
// runtime, no en tiempo de carga.
//
// API pública:
//   LOGROS           → array de definiciones (id, name, desc, check)
//   updateLogros()   → comprueba todos y desbloquea en Storage los nuevos;
//                      devuelve cuántos se han desbloqueado esta vez
// ─────────────────────────────────────────────────────────────────────────────

const _KANTO_BADGE_IDS = [
  'boulder-badge', 'cascade-badge', 'thunder-badge', 'rainbow-badge',
  'soul-badge',    'marsh-badge',   'volcano-badge', 'earth-badge',
];

function _caughtCount() {
  return Object.values(Storage.getPokedex()).filter(e => e.caught).length;
}

function _uniqueBadges() {
  return new Set(Object.values(Storage.getAllBadges()).flat());
}

const LOGROS = [

  // ── Pokédex ────────────────────────────────────────────────────────────────

  {
    id:   'pokedex-kanto',
    icon: 'DEX', color: '#3a9dd5',
    name: 'Pokédex de Kanto completa',
    desc: 'Captura los 151 Pokémon de Kanto.',
    check() {
      if (typeof KANTO_DEX === 'undefined') return false;
      const dex = Storage.getPokedex();
      return KANTO_DEX.every(e => dex[e.name]?.caught);
    },
  },

  // ── Shiny ──────────────────────────────────────────────────────────────────

  {
    id:   'primer-shiny',
    icon: 'SHY', color: '#9b59b6',
    name: '¡Es shiny!',
    desc: 'Captura un Pokémon en su forma shiny.',
    check() {
      return Object.values(Storage.getPokedex()).some(e => e.shiny);
    },
  },

  // ── Medallas ───────────────────────────────────────────────────────────────

  {
    id:   'ocho-medallas',
    icon: 'GYM', color: '#e0a800',
    name: 'Ocho medallas',
    desc: 'Obtén las 8 medallas de los gimnasios de Kanto.',
    check() {
      const u = _uniqueBadges();
      return _KANTO_BADGE_IDS.every(id => u.has(id));
    },
  },

  // ── Liga ───────────────────────────────────────────────────────────────────

  {
    id:   'campeon-kanto',
    icon: 'LGA', color: '#c0392b',
    name: 'Campeón de Kanto',
    desc: 'Derrota al Alto Mando y al Campeón Pokémon.',
    check() { return Storage.isKantoCompleted(); },
  },

  // ── Frente Batalla ─────────────────────────────────────────────────────────

  {
    id:   'frente-debutante',
    icon: 'BFR', color: '#e67e22',
    name: 'Principiante del Frente Batalla',
    desc: 'Alcanza el piso 20 en el Frente Batalla.',
    check() { return Storage.getBfMaxFloor() >= 20; },
  },
  {
    id:   'frente-veterano',
    icon: 'BFR', color: '#e67e22',
    name: 'Veterano del Frente',
    desc: 'Alcanza el piso 60 en el Frente Batalla.',
    check() { return Storage.getBfMaxFloor() >= 60; },
  },
  {
    id:   'frente-campeon',
    icon: 'BFR', color: '#e67e22',
    name: 'Conquistador del Frente',
    desc: 'Completa el Frente Batalla.',
    check() { return Storage.getBfMaxFloor() >= 100; },
  },

];

// Evalúa todos los logros y persiste los recién conseguidos en Storage.
// Devuelve el número de logros desbloqueados en esta llamada.
function updateLogros() {
  let newUnlocks = 0;
  for (const logro of LOGROS) {
    if (!Storage.isLogroUnlocked(logro.id) && logro.check()) {
      Storage.unlockLogro(logro.id);
      newUnlocks++;
    }
  }
  return newUnlocks;
}
