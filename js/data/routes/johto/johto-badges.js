// ─────────────────────────────────────────────────────────────────────────────
// MEDALLAS DE JOHTO
//
// Extiende BADGE_LIST (definido en kanto/kanto-badges.js) con las 8 medallas
// de Johto. Se carga DESPUÉS de kanto-badges.js.
//
// Las rutas de imagen apuntan a assets/sprites/badges/ — añadir los sprites
// correspondientes antes de usar en producción.
// ─────────────────────────────────────────────────────────────────────────────

Object.assign(BADGE_IMG, {
  zephyr: 'assets/sprites/badges/johto/medalla-cefiro.png',
  hive: 'assets/sprites/badges/johto/medalla-colmena.png',
  plain: 'assets/sprites/badges/johto/medalla-planicie.png',
  fog: 'assets/sprites/badges/johto/medalla-niebla.png',
  storm: 'assets/sprites/badges/johto/medalla-tormenta.png',
  mineral: 'assets/sprites/badges/johto/medalla-mineral.png',
  glacier: 'assets/sprites/badges/johto/medalla-glaciar.png',
  rising: 'assets/sprites/badges/johto/medalla-dragon.png',
});

Object.assign(BADGE_LIST, {

  'zephyr-badge': {
    id: 'zephyr-badge',
    name: 'Medalla Ascua',
    desc: 'Obtenida al vencer a Falkner en Ciudad Malva.',
    gym: 'Ciudad Malva',
    leader: 'Falkner',
    type: 'Volador',
    img: BADGE_IMG.zephyr,
  },

  'hive-badge': {
    id: 'hive-badge',
    name: 'Medalla Colmena',
    desc: 'Obtenida al vencer a Bugsy en Pueblo Nogal.',
    gym: 'Pueblo Nogal',
    leader: 'Bugsy',
    type: 'Bicho',
    img: BADGE_IMG.hive,
  },

  'plain-badge': {
    id: 'plain-badge',
    name: 'Medalla Llanura',
    desc: 'Obtenida al vencer a Whitney en Ciudad Dorada.',
    gym: 'Ciudad Dorada',
    leader: 'Whitney',
    type: 'Normal',
    img: BADGE_IMG.plain,
  },

  'fog-badge': {
    id: 'fog-badge',
    name: 'Medalla Niebla',
    desc: 'Obtenida al vencer a Morty en Ciudad Incienso.',
    gym: 'Ciudad Incienso',
    leader: 'Morty',
    type: 'Fantasma',
    img: BADGE_IMG.fog,
  },

  'storm-badge': {
    id: 'storm-badge',
    name: 'Medalla Tormenta',
    desc: 'Obtenida al vencer a Chuck en Ciudad Nogal.',
    gym: 'Ciudad Nogal',
    leader: 'Chuck',
    type: 'Lucha',
    img: BADGE_IMG.storm,
  },

  'mineral-badge': {
    id: 'mineral-badge',
    name: 'Medalla Mineral',
    desc: 'Obtenida al vencer a Jasmine en Ciudad Olivina.',
    gym: 'Ciudad Olivina',
    leader: 'Jasmine',
    type: 'Acero',
    img: BADGE_IMG.mineral,
  },

  'glacier-badge': {
    id: 'glacier-badge',
    name: 'Medalla Glaciar',
    desc: 'Obtenida al vencer a Pryce en Pueblo Caoba.',
    gym: 'Pueblo Caoba',
    leader: 'Pryce',
    type: 'Hielo',
    img: BADGE_IMG.glacier,
  },

  'rising-badge': {
    id: 'rising-badge',
    name: 'Medalla Ascenso',
    desc: 'Obtenida al vencer a Clair en Ciudad Amatista.',
    gym: 'Ciudad Amatista',
    leader: 'Clair',
    type: 'Dragón',
    img: BADGE_IMG.rising,
  },

});
