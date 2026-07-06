// ─────────────────────────────────────────────────────────────────────────────
// ROUTES ASSETS — rutas de imágenes centralizadas.
//
// Se carga ANTES que routes-constants.js, kanto-badges.js y kanto-routes.js.
// Cualquier archivo de ruta que necesite un asset debe referenciar estas
// constantes en lugar de escribir la ruta directamente.
//
// Globals exportados:
//   BG           — fondos de ruta e información
//   COMBAT_BG    — fondos de pantalla de combate
//   TRAINER_IMG  — sprites de entrenadores y líderes de gimnasio
//   GIF          — sprites y gifs misceláneos (escenas de historia, etc.)
//   POKEMON_SPRITE — sprites especiales de pokemon (variantes clásicas, etc.)
//   BADGE_IMG    — sprites de medallas
//   ENTRENADORES — entrenadores aleatorios con nombre e imagen (usa TRAINER_IMG)
// ─────────────────────────────────────────────────────────────────────────────

// ── Fondos de ruta ────────────────────────────────────────────────────────────

const BG = {
  // Rutas principales
  ruta1: 'assets/bg/route-1.png',
  ruta2: 'assets/bg/route-2.png',
  ruta3: 'assets/bg/ruta-3.png',
  ruta4: 'assets/bg/ruta-4.png',
  ruta5: 'assets/bg/ruta-5.png',
  ruta6: 'assets/bg/ruta-6.png',
  ruta9: 'assets/bg/ruta-9.png',
  ruta10: 'assets/bg/ruta-10.png',
  ruta15: 'assets/bg/ruta-15.png',
  ruta20: 'assets/bg/ruta-20.png',
  ruta22: 'assets/bg/route-22.png',
  ruta24: 'assets/bg/ruta-24.png',
  ruta25: 'assets/bg/ruta-25.png',
  // Ciudades y pueblos
  ciudadVerde: 'assets/bg/ciudad-verde.png',
  ciudadPlateada: 'assets/bg/ciudad-plateada.png',
  ciudadCeleste: 'assets/bg/ciudad-celeste.png',
  ciudadCarmin: 'assets/bg/ciudad-carmin.png',
  ciudadAzulona: 'assets/bg/ciudad-azulona.png',
  ciudadFucsia: 'assets/bg/ciudad-fucsia.png',
  ciudadAzafran: 'assets/bg/ciudad-azafran.png',
  puebloLavanda: 'assets/bg/pueblo-lavanda.png',
  puebloPaleta: 'assets/bg/pueblo-paleta.png',
  // Lugares especiales
  bosqueVerde: 'assets/bg/bosque-verde.png',
  mtMoon: 'assets/bg/mt-moon.png',
  ssAnne: 'assets/bg/ss-anne.png',
  tunelRoca: 'assets/bg/tunel-roca.png',
  guaridaRocket: 'assets/bg/guarida-rocket.png',
  oficinaRocket: 'assets/bg/oficina-rocket.png',
  torrePokemon: 'assets/bg/torre-pokemon.png',
  mansionPokemon: 'assets/bg/mansion-pokemon.png',
  islaCanela: 'assets/bg/isla-canela.png',
  kantoLeague: 'assets/bg/kanto-league.png',
  calleVictoria: 'assets/bg/calle-victoria.png',
  espacioRaro: 'assets/bg/espacio-raro.png',
  cuevaPlateada: 'assets/bg/cueva-plateada.png',
  silph: 'assets/bg/silph.png',
  zonaSafari: 'assets/bg/zona-safari.png',
  mesetaAnil: 'assets/bg/meseta-anil.png',
  final: 'assets/bg/final.png',
  JOTHO: {
    ruta29: 'assets/bg/johto/ruta-29.png',
    ruta30: 'assets/bg/johto/ruta-30.png',
    ruta32: 'assets/bg/johto/ruta-32.png',
    ciudadCerezo: 'assets/bg/johto/ciudad-cerezo.png',
    puebloPrimavera: 'assets/bg/johto/pueblo-primavera.png',
    ciudadMalva: 'assets/bg/johto/ciudad-malva.png',
    ciudadMalvaGym: 'assets/bg/johto/ciudad-malva-gym.png',
    ruinasAlfa: 'assets/bg/johto/ruinas-alfa.png',
    puebloAzalea: 'assets/bg/johto/pueblo-azalea.png',
    encinar: 'assets/bg/johto/encinar.png',
    ciudadTrigal: 'assets/bg/johto/ciudad-trigal.png',
    ruta36: 'assets/bg/johto/ruta-36.png',
    torreQuemada: 'assets/bg/johto/torre-quemada.png',
    ciudadIris: 'assets/bg/johto/ciudad-iris.png',
  }
};

// ── Fondos de combate ─────────────────────────────────────────────────────────

const COMBAT_BG = {
  default: 'assets/bg/combate.png',
  cueva: 'assets/bg/combate-cueva.png',
  agua: 'assets/bg/combate-agua.png',
  electrico: 'assets/bg/combate-electrico.png',
  interior: 'assets/bg/combate-interior.png',
  noche: 'assets/bg/combate-noche.png',
  hierbaAlta: 'assets/bg/combate-hierba-alta.png',
  rocket: 'assets/bg/combate-rocket.png',
  espacioRaro: 'assets/bg/combate-espacio-raro.png',
  altoMando: 'assets/bg/combate-alto-mando.png',
};

// ── Sprites de entrenadores y líderes ─────────────────────────────────────────

const TRAINER_IMG = {
  // Entrenadores aleatorios
  mewtwo: 'assets/sprites/trainers/mewtwo.png',
  rival: 'assets/sprites/trainers/rival_kanto.png',
  cazabichos: 'assets/sprites/trainers/cazabichos.png',
  entrenadorJoven: 'assets/sprites/trainers/entrenadorjoven.png',
  campista: 'assets/sprites/trainers/campista.png',
  montanero: 'assets/sprites/trainers/montanero.png',
  dominguera: 'assets/sprites/trainers/dominguera.png',
  domingueroFuego: 'assets/sprites/trainers/dominguero-fuego.png',
  domingueroAgua: 'assets/sprites/trainers/dominguero-agua.png',
  nadador: 'assets/sprites/trainers/nadador.png',
  caballero: 'assets/sprites/trainers/caballero.png',
  mecanico: 'assets/sprites/trainers/mecanico.png',
  pokemaniaco: 'assets/sprites/trainers/pokemaniaco.png',
  rojo: 'assets/sprites/trainers/rojo.png',
  cientifico: 'assets/sprites/trainers/cientifico.png',
  marinero: 'assets/sprites/trainers/marinero.png',
  rocket: 'assets/sprites/trainers/soldado-rocket.png',
  giovanni: 'assets/sprites/trainers/giovanni.png',
  chicoGuay: 'assets/sprites/trainers/entrenador-guay.png',
  chicaGuay: 'assets/sprites/trainers/entrenadora-guay.png',
  chica: 'assets/sprites/trainers/chica.png',
  medium: 'assets/sprites/trainers/medium.png',
  malabarista: 'assets/sprites/trainers/malabarista.png',
  ladron: 'assets/sprites/trainers/ladron.png',
  Ornitologo: 'assets/sprites/trainers/ornitologo.png',
  // Líderes de gimnasio
  brock: 'assets/sprites/trainers/brock.png',
  misty: 'assets/sprites/trainers/misty.png',
  surge: 'assets/sprites/trainers/surge.png',
  erika: 'assets/sprites/trainers/erika.png',
  koga: 'assets/sprites/trainers/koga.png',
  sabrina: 'assets/sprites/trainers/sabrina.png',
  blaine: 'assets/sprites/trainers/blaine.png',
  loreleiBig: 'assets/sprites/others/lorelei-big.png',
  lorelei: 'assets/sprites/trainers/lorelei.png',
  bruno: 'assets/sprites/trainers/bruno.png',
  agatha: 'assets/sprites/trainers/agatha.png',
  lance: 'assets/sprites/trainers/lance.png',

  //Johto
  plata: 'assets/sprites/trainers/plata.png',
  pensador: 'assets/sprites/trainers/pensador.png',
  pegaso: 'assets/sprites/trainers/pegaso.png',
  anton: 'assets/sprites/trainers/anton.png',
  blanca: 'assets/sprites/trainers/blanca.png',
  morti: 'assets/sprites/trainers/morti.png',
};

// ── Sprites y gifs misceláneos (escenas de historia) ─────────────────────────

const GIF = {
  giovanni: 'assets/sprites/others/giovani.gif',
  bill: 'assets/sprites/others/bill.gif',
  rojo: 'assets/sprites/others/rojo.gif',
  montanero: 'assets/sprites/others/montanero.gif',
  gastly: 'assets/sprites/others/gastly.gif',
  rojoClassic: 'assets/sprites/others/rojo-classic.png',
  oak: 'assets/sprites/others/oak.gif',
  bruno: 'assets/sprites/others/bruno.png',
  agatha: 'assets/sprites/others/agatha.png',
  lance: 'assets/sprites/trainers/lance.png',
  azul: 'assets/sprites/others/azul.gif',
};

// ── Sprites especiales de pokémon ─────────────────────────────────────────────

const POKEMON_SPRITE = {
  snorlaxClassic: 'assets/sprites/pokemon/snorlax-classic.png',
  charizardClassic: 'assets/sprites/pokemon/charizard-classic.png',
  venusaurClassic: 'assets/sprites/pokemon/venusaur-classic.png',
  blastoiseClassic: 'assets/sprites/pokemon/blastoise-classic.png',
  laprasClassic: 'assets/sprites/pokemon/lapras-classic.png',
  pikachuClassic: 'assets/sprites/pokemon/pikachu-classic.png',
  armoredMewtwo: 'assets/sprites/pokemon/mewtwo-armored.png',
};

// ── Sprites de medallas ───────────────────────────────────────────────────────

const BADGE_IMG = {
  boulder: 'assets/sprites/badges/medalla-roca.png',
  cascade: 'assets/sprites/badges/medalla-cascada.png',
  thunder: 'assets/sprites/badges/medalla-trueno.png',
  rainbow: 'assets/sprites/badges/medalla-arcoiris.png',
  soul: 'assets/sprites/badges/medalla-alma.png',
  marsh: 'assets/sprites/badges/medalla-pantano.png',
  volcano: 'assets/sprites/badges/medalla-volcan.png',
  earth: 'assets/sprites/badges/medalla-tierra.png',
};

// ── Entrenadores aleatorios ───────────────────────────────────────────────────
// Combina nombre visible + sprite. Usado en ROUTE_DATA[x].trainer[].
// Se mantiene aquí (no en kanto-routes.js) para que otras regiones puedan
// reutilizarlo sin duplicar los paths.

const ENTRENADORES = {
  Rival: { name: 'Azul', img: TRAINER_IMG.rival },
  Cazabichos: { name: 'Cazabichos', img: TRAINER_IMG.cazabichos },
  EntrenadorJoven: { name: 'Entrenador joven', img: TRAINER_IMG.entrenadorJoven },
  Campista: { name: 'Campista', img: TRAINER_IMG.campista },
  Montanero: { name: 'Montañero', img: TRAINER_IMG.montanero },
  Dominguera: { name: 'Dominguera', img: TRAINER_IMG.dominguera },
  DomingueroFuego: { name: 'Dominguero Fogoso', img: TRAINER_IMG.domingueroFuego },
  DomingueroAgua: { name: 'Dominguero Mojado', img: TRAINER_IMG.domingueroAgua },
  Nadador: { name: 'Nadador', img: TRAINER_IMG.nadador },
  Caballero: { name: 'Caballero', img: TRAINER_IMG.caballero },
  Mecanico: { name: 'Mecanico', img: TRAINER_IMG.mecanico },
  Pokemaniaco: { name: 'Pokemaniaco', img: TRAINER_IMG.pokemaniaco },
  Rojo: { name: 'Rojo', img: TRAINER_IMG.rojo },
  Cientifico: { name: 'Cientifico', img: TRAINER_IMG.cientifico },
  Marinero: { name: 'Marinero', img: TRAINER_IMG.marinero },
  Rocket: { name: 'Rocket', img: TRAINER_IMG.rocket },
  Giovanni: {
    name: 'Giovanni', img: TRAINER_IMG.giovanni,
    gif: GIF.giovanni
  },
  ChicoGuay: { name: 'Entrenador Guay', img: TRAINER_IMG.chicoGuay },
  ChicaGuay: { name: 'Entrenadora Guay', img: TRAINER_IMG.chicaGuay },
  Chica: { name: 'Chica', img: TRAINER_IMG.chica },
  Medium: { name: 'Medium', img: TRAINER_IMG.medium },
  Malabarista: { name: 'Malabarista', img: TRAINER_IMG.malabarista },
  Ladron: { name: 'Ladrón', img: TRAINER_IMG.ladron },
  Ornitologo: { name: 'Ornitologo', img: TRAINER_IMG.Ornitologo },
  Plata: { name: 'Plata', img: TRAINER_IMG.plata },
  Pensador: { name: 'Pensador', img: TRAINER_IMG.pensador },
  Pegaso: { name: 'Pegaso', img: TRAINER_IMG.pegaso },
  Blanca: { name: 'Blanca', img: TRAINER_IMG.blanca },
  Anton: { name: 'Antón', img: TRAINER_IMG.anton},
  Mewtwo: { name: 'Mewtwo', img: TRAINER_IMG.mewtwo },
  Morti: { name: 'Morti', img: TRAINER_IMG.morti },
};
