// ─────────────────────────────────────────────────────────────────────────────
// MEDALLAS DE HOENN
//
// Extiende BADGE_LIST (definido en kanto/kanto-badges.js) con las 8 medallas
// de Hoenn. Se carga DESPUÉS de johto-badges.js.
//
// Las rutas de imagen apuntan a assets/sprites/badges/ — añadir los sprites
// correspondientes antes de usar en producción.
// ─────────────────────────────────────────────────────────────────────────────

Object.assign(BADGE_IMG, {
  stone:   'assets/sprites/badges/hoenn/medalla-piedra.png',
  knuckle: 'assets/sprites/badges/hoenn/medalla-nudillo.png',
  dynamo:  'assets/sprites/badges/hoenn/medalla-dinamo.png',
  heat:    'assets/sprites/badges/hoenn/medalla-calor.png',
  balance: 'assets/sprites/badges/hoenn/medalla-equilibrio.png',
  feather: 'assets/sprites/badges/hoenn/medalla-pluma.png',
  mind:    'assets/sprites/badges/hoenn/medalla-mente.png',
  rain:    'assets/sprites/badges/hoenn/medalla-lluvia.png',
});

Object.assign(BADGE_LIST, {

  'stone-badge': {
    id: 'stone-badge',
    name: 'Medalla Piedra',
    desc: 'Obtenida al vencer a Petra en Ciudad Férrica.',
    gym: 'Ciudad Férrica',
    leader: 'Petra',
    type: 'Roca',
    img: BADGE_IMG.stone,
  },

  'knuckle-badge': {
    id: 'knuckle-badge',
    name: 'Medalla Nudillo',
    desc: 'Obtenida al vencer a Marcial en Pueblo Corvina.',
    gym: 'Pueblo Corvina',
    leader: 'Marcial',
    type: 'Lucha',
    img: BADGE_IMG.knuckle,
  },

  'dynamo-badge': {
    id: 'dynamo-badge',
    name: 'Medalla Dínamo',
    desc: 'Obtenida al vencer a Marcelino en Ciudad Mauville.',
    gym: 'Ciudad Mauville',
    leader: 'Marcelino',
    type: 'Eléctrico',
    img: BADGE_IMG.dynamo,
  },

  'heat-badge': {
    id: 'heat-badge',
    name: 'Medalla Calor',
    desc: 'Obtenida al vencer a Candela en Pueblo Lavacalda.',
    gym: 'Pueblo Lavacalda',
    leader: 'Candela',
    type: 'Fuego',
    img: BADGE_IMG.heat,
  },

  'balance-badge': {
    id: 'balance-badge',
    name: 'Medalla Equilibrio',
    desc: 'Obtenida al vencer a Práxedes en Ciudad Petalia.',
    gym: 'Ciudad Petalia',
    leader: 'Práxedes',
    type: 'Normal',
    img: BADGE_IMG.balance,
  },

  'feather-badge': {
    id: 'feather-badge',
    name: 'Medalla Pluma',
    desc: 'Obtenida al vencer a Alondra en Ciudad Oroya.',
    gym: 'Ciudad Oroya',
    leader: 'Alondra',
    type: 'Volador',
    img: BADGE_IMG.feather,
  },

  'mind-badge': {
    id: 'mind-badge',
    name: 'Medalla Mente',
    desc: 'Obtenida al vencer a Telmo y Tara en Ciudad Mossdeep.',
    gym: 'Ciudad Mossdeep',
    leader: 'Telmo y Tara',
    type: 'Psíquico',
    img: BADGE_IMG.mind,
  },

  'rain-badge': {
    id: 'rain-badge',
    name: 'Medalla Lluvia',
    desc: 'Obtenida al vencer a Víctor en Ciudad Sotópolis.',
    gym: 'Ciudad Sotópolis',
    leader: 'Víctor',
    type: 'Agua',
    img: BADGE_IMG.rain,
  },

});
