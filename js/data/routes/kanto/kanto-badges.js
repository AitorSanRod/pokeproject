// ─────────────────────────────────────────────────────────────────────────────
// BADGE_LIST — catálogo de medallas de gimnasio
//
// Cada medalla referenciada desde ROUTE_DATA (campo badgeId) debe tener una
// entrada aquí. Las rutas usan el id como clave:
//   routes.js → badgeId: 'boulder-badge'
//
// Campos:
//   id      → clave única (coincide con la clave del objeto)
//   name    → nombre mostrado en la pokédex y en la pantalla de victoria
//   desc    → descripción mostrada en tooltip (hover) de la pokédex
//   gym     → nombre de la ciudad/lugar
//   leader  → nombre del líder de gimnasio
//   type    → tipo del gimnasio (para referencia)
//   img     → ruta al sprite de la medalla
// ─────────────────────────────────────────────────────────────────────────────

var BADGE_LIST = {

  'boulder-badge': {
    id:     'boulder-badge',
    name:   'Medalla Roca',
    desc:   'Obtenida al vencer a Brock en Ciudad Plateada.',
    gym:    'Ciudad Plateada',
    leader: 'Brock',
    type:   'Roca',
    img:    BADGE_IMG.boulder,
  },

  'cascade-badge': {
    id:     'cascade-badge',
    name:   'Medalla Agua',
    desc:   'Obtenida al vencer a Misty en Ciudad Celeste.',
    gym:    'Ciudad Celeste',
    leader: 'Misty',
    type:   'Agua',
    img:    BADGE_IMG.cascade,
  },

  'thunder-badge': {
    id:     'thunder-badge',
    name:   'Medalla Trueno',
    desc:   'Obtenida al vencer al Teniente Surge en Ciudad Carmín.',
    gym:    'Ciudad Carmín',
    leader: 'Lt. Surge',
    type:   'Electrico',
    img:    BADGE_IMG.thunder,
  },

  'rainbow-badge': {
    id:     'rainbow-badge',
    name:   'Medalla Arcoiris',
    desc:   'Obtenida al vencer a Erika en Ciudad Azulona.',
    gym:    'Ciudad Azulona',
    leader: 'Erika',
    type:   'Planta',
    img:    BADGE_IMG.rainbow,
  },

  'soul-badge': {
    id:     'soul-badge',
    name:   'Medalla Alma',
    desc:   'Obtenida al vencer a Koga en el Gimnasio de Fucsia.',
    gym:    'Gimnasio de Fucsia',
    leader: 'Koga',
    type:   'Veneno',
    img:    BADGE_IMG.soul,
  },

  'marsh-badge': {
    id:     'marsh-badge',
    name:   'Medalla Pantano',
    desc:   'Obtenida al vencer a Sabrina en el Gimnasio de Azafrán.',
    gym:    'Gimnasio de Azafrán',
    leader: 'Sabrina',
    type:   'Psíquico',
    img:    BADGE_IMG.marsh,
  },

  'volcano-badge': {
    id:     'volcano-badge',
    name:   'Medalla Volcán',
    desc:   'Obtenida al vencer a Blaine en el Gimnasio de Canela.',
    gym:    'Gimnasio de Canela',
    leader: 'Blaine',
    type:   'Fuego',
    img:    BADGE_IMG.volcano,
  },

  'earth-badge': {
    id:     'earth-badge',
    name:   'Medalla Tierra',
    desc:   'Obtenida al vencer a Giovanni en el Gimnasio de Verde.',
    gym:    'Gimnasio de Verde',
    leader: 'Giovanni',
    type:   'Tierra',
    img:    BADGE_IMG.earth,
  },

};
