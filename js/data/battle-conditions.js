// ─────────────────────────────────────────────────────────────────────────────
// CONDICIONES DE BATALLA
//
// Define los catálogos de climas (WEATHER), campos (FIELD) y efectos de equipo
// (TEAM_EFFECTS). Los catálogos están vacíos — la infraestructura está lista
// para añadir entradas cuando se implementen las habilidades o movimientos que
// los activen.
//
// CÓMO AÑADIR UNA CONDICIÓN:
//   1. Añade una entrada al catálogo correspondiente con id único.
//   2. Para activarla desde una habilidad (ON_ENTER) o movimiento:
//        CombatV2.setWeather('sun');
//        CombatV2.setField('electric-terrain');
//        CombatV2.addTeamEffect('player', 'tailwind');
//   3. cv2-engine.js lee los catálogos en _getWeatherMult, _getFieldMult y
//      _getSpeedMult al calcular daño y velocidad.
// ─────────────────────────────────────────────────────────────────────────────

// ── Climas ────────────────────────────────────────────────────────────────────
// Se activan mediante habilidades ON_ENTER o movimientos especiales.
// El motor comprueba WEATHER[state.weather.id] en _calcDamage.
//
// Estructura de entrada:
// 'id': {
//   name:          'Nombre visible en el log',
//   turns:         5,                          // duración por defecto en turnos
//   damageBoost:   [{ type: 'fire', mult: 1.5 }],    // tipos potenciados
//   damagePenalty: [{ type: 'water', mult: 0.5 }],   // tipos debilitados
//   endOfTurnDmg:  { pct: 0.0625, excludeTypes: ['rock','ground','steel'] },
//                  // daño al final de turno (p.ej. granizo a no-hielo)
// }
var WEATHER = {
  'sun': { name: 'Sol Intenso', damageBoost: [{ type: 'fire', mult: 1.25 }], damagePenalty: [{ type: 'water', mult: 0.5 }] },
  'rain': { name: 'Lluvia', damageBoost: [{ type: 'water', mult: 1.25 }], damagePenalty: [{ type: 'fire', mult: 0.5 }] },
  'sand': { name: 'Tormenta de Arena', endOfTurnDmg: { pct: 0.0625, excludeTypes: ['rock', 'ground', 'steel'] } },
  'hail': { name: 'Granizo', endOfTurnDmg: { pct: 0.0625, excludeTypes: ['ice'] } },
};

// ── Campos ────────────────────────────────────────────────────────────────────
// No afectan a Pokémon en vuelo (tipo flying o habilidad levitate).
// El motor comprueba _isGrounded(pokemon) antes de aplicar el campo.
//
// Estructura de entrada:
// 'id': {
//   name:        'Nombre visible',
//   turns:       5,
//   damageBoost: [{ type: 'electric', mult: 1.3 }],  // tipos potenciados en tierra
//   blockStatus: 'sleep',    // (opcional) bloquea un estado concreto
// }
var FIELD = {
  // 'electric-terrain': { name: 'Campo Eléctrico', turns: 5, damageBoost: [{ type: 'electric', mult: 1.3 }], blockStatus: 'sleep' },
  // 'grassy-terrain':   { name: 'Campo de Hierba', turns: 5, damageBoost: [{ type: 'grass', mult: 1.3 }] },
  // 'psychic-terrain':  { name: 'Campo Psíquico',  turns: 5, damageBoost: [{ type: 'psychic', mult: 1.3 }], blockStatus: 'sleep' },
  // 'misty-terrain':    { name: 'Campo de Niebla', turns: 5 },
};

// ── Efectos de equipo ─────────────────────────────────────────────────────────
// scope: 'team'   → solo afecta al equipo que lo activó (player o foe)
// scope: 'global' → afecta a ambos equipos (se almacena en teamEffects.global)
//
// Estructura de entrada:
// 'id': {
//   name:         'Nombre visible',
//   turns:        4,
//   scope:        'team' | 'global',
//   speedMult:    2,          // multiplicador de SPE del equipo afectado
//   invertSpeed:  true,       // invierte el orden de ataque (Sala Trampa / Trick Room)
// }
var TEAM_EFFECTS = {
  // 'tailwind':   { name: 'Viento de Cola', turns: 4, scope: 'team',   speedMult: 2 },
  // 'trick-room': { name: 'Sala Trampa',    turns: 5, scope: 'global', invertSpeed: true },
};
