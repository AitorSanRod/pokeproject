// ═══════════════════════════════════════════════════════════════════════════
// COMBAT V2 — Configuración global
//
// Todas las constantes de timing, balance y comportamiento están aquí.
// Cambia este archivo para ajustar el combate sin tocar la lógica ni la UI.
// ═══════════════════════════════════════════════════════════════════════════

// ── Velocidad ────────────────────────────────────────────────────────────────
// Factor que multiplica TODOS los delays del combate.
// 1.0 = velocidad normal · 0.5 = x2 (la mitad del tiempo)
var CV2_SPEED_FACTOR = 1.0;

const CV2_SPEED = { X1: 1.0, X2: 0.5 };

// ── Mensajes de anuncio de combate ────────────────────────────────────────────
// Modificar aquí para cambiar el texto de los avisos al inicio de cada nodo.
// Se usan en cv2-engine._buildIntroMsg() y se renderizan en cv2-ui.showIntro().
const CV2_MESSAGES = {
  wildAppear:    name => `¡Un ${name} salvaje\naparece!`,
  trainerBattle: name => `¡${name}\nquiere combatir!`,
  gymBattle:     name => `¡El líder ${name}\nquiere combatir!`,
};

// ── Delays base (ms a velocidad x1) ──────────────────────────────────────────
const CV2_DELAY = {
  INTRO:       1800,  // anuncio de inicio de combate — debe coincidir con la duración en combat-v2.css (.cv2-intro-overlay)
  ENTRY_SLIDE: 800,   // pokemon entra deslizándose
  ENTRY_HUD: 400,   // HUD aparece tras el sprite
  ATTACK_ANNOUNCE: 700,   // "X usó Y!" antes de que ocurra el golpe
  HIT_FLASH: 280,   // flash del sprite al recibir golpe
  DAMAGE_FLOAT: 750,   // número flotante de daño visible
  CRIT_LOG: 500,   // "¡Golpe crítico!" mensaje
  EFF_LOG: 500,   // "¡Es supereficaz!" mensaje
  AFTER_HIT: 400,   // pausa tras actualizar HP bar
  LOG_READ: 850,   // pausa para leer un mensaje normal
  LOG_SHORT: 420,   // pausa breve entre mensajes consecutivos
  STAT_CHANGE: 1200,  // animación PNG de cambio de stat — debe coincidir con la duración en combat-v2.css (.cv2-stat-img--rise/fall)
  FAINT_ANIM: 1000, // duración animación de derrota (caída)
  FAINT_PAUSE: 800,   // pausa tras derrota antes del siguiente paso
  STATUS_APPLY: 600,   // "X fue envenenado!"
  END_OF_TURN_STATUS: 550,   // daño por estado al final del turno
  EXP_BAR: 900,   // animación de barra de EXP
  LEVEL_UP: 900,   // "¡X subió al nivel N!"
  EVOLUTION: 1400,   // animación de evolución
  NEW_POKEMON: 800,   // nueva entrada de pokemon al campo
  TURN_START_GAP: 350,   // pausa entre el fin de un turno y el inicio del siguiente
};

// ── Prioridades de movimiento (−3 mínima · 0 normal · +3 máxima) ─────────────
// Movimientos con igual prioridad se resuelven por velocidad (SPE efectiva).
const CV2_PRIORITY = {
  MAX: 3,
  HIGH: 2,
  ABOVE: 1,
  NORMAL: 0,
  BELOW: -1,
  LOW: -2,
  MIN: -3,
};

// ── Fórmulas de combate ───────────────────────────────────────────────────────
const CV2_COMBAT = {
  STAB_MULTIPLIER: 1.5,
  CRIT_CHANCE: 0.075,  // 7.5% crítico normal
  CRIT_MULTIPLIER: 1.5,
  RANDOM_MIN: 0.85,
  RANDOM_MAX: 1.00,
  CATCH_RATE: 0.80,
  HEAL_ON_LEVEL_UP_PCT: 0.10,
};

