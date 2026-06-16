# Pokemon Adventure — Documentación técnica

Guía de referencia para añadir y modificar contenido del juego: rutas, pokemon,
movimientos, efectos, estados, evoluciones, recompensas y pantallas.

---

## Índice

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Rutas, caminos y entrenadores](#2-rutas-caminos-y-entrenadores)
   - [Pokemon dinámico del rival — RIVAL_STARTER](#pokemon-dinámico-del-rival-según-el-starter--rival_starter)
   - [⚠️ Convención de nombres: guiones vs guiones bajos](#️-convención-de-nombres--guiones-vs-guiones-bajos-muy-importante)
3. [Gimnasios](#3-gimnasios)
4. [Pokemon — IVs, EVs y overrides](#4-pokemon--ivs-evs-y-overrides)
5. [Líneas evolutivas y stages de movimientos](#5-líneas-evolutivas-y-stages-de-movimientos)
   - [moveId y autoMove — relación con buildMoves](#moveid-routesjs-y-automove--relación-con-buildmoves)
6. [Movimientos — MOVE_POOL, TYPES, DAMAGE_CLASS](#6-movimientos--move_pool-types-damage_class)
   - [effectId — uno o varios efectos](#effectid--uno-o-varios-efectos)
   - [boss: true — movimientos exclusivos de rivales hardcodeados](#boss-true--movimientos-exclusivos-de-rivales-hardcodeados)
7. [Efectos de movimientos (MOVE_EFFECTS)](#7-efectos-de-movimientos-move_effects)
8. [Efectos de estado (status-effects.js)](#8-efectos-de-estado-status-effectsjs)
9. [Sistema de combatMods (modificadores de stat)](#9-sistema-de-combatmods-modificadores-de-stat)
9.5. [Objetos equipados (held-items.js)](#95-objetos-equipados-held-itemsjs)
10. [EVs por cadena evolutiva](#10-evs-por-cadena-evolutiva)
11. [Recompensas de fin de ruta](#11-recompensas-de-fin-de-ruta)
12. [Pokédex — 3 estados](#12-pokédex--3-estados)
13. [Compendio](#13-compendio)
14. [Animaciones de combate](#14-animaciones-de-combate)
15. [Guardas de concurrencia en combate](#15-guardas-de-concurrencia-en-combate)
16. [Reset de datos guardados](#16-reset-de-datos-guardados)
17. [Captura — límite de 6 pokemon en el equipo](#17-captura--límite-de-6-pokemon-en-el-equipo)
18. [Progreso del camino durante combate](#18-progreso-del-camino-durante-combate)
19. [UI — headers, botones atrás y pokéball](#19-ui--headers-botones-atrás-y-pokéball)
20. [Validación de daño y efectividad de tipos](#20-validación-de-daño-y-efectividad-de-tipos)
21. [Rutas tipo 'information' y pantalla final personalizable](#21-rutas-tipo-information-y-pantalla-final-personalizable)
22. [Orden de logs de combate — resumen vs efectos de objetos](#22-orden-de-logs-de-combate--resumen-vs-efectos-de-objetos)
23. [Desglose de modificadores de daño en el log de combate](#23-desglose-de-modificadores-de-daño-en-el-log-de-combate)
24. [Penalización de experiencia por diferencia de nivel](#24-penalización-de-experiencia-por-diferencia-de-nivel)
25. [Pokémon Shiny](#25-pokémon-shiny)

---

## 1. Estructura del proyecto

```
index.html                    Punto de entrada — carga todos los scripts en orden
css/
  main.css                     Tokens de diseño, botones, barras de HP, badges de tipo
  screens.css                  Estilos de pantallas, animaciones, tooltips
js/
  api.js                       Capa de API — PokeAPI con fallback local
  main.js                      GameState global + arranque + botón reset storage
  data/
    combat-config.js           Constantes de balance (STAB, crit, CATCH_RATE...)
    exp-table.js                Tabla de EXP base + curva de nivel
    move-pool.js                MOVE_POOL + TYPES + DAMAGE_CLASS + buildMoves() + getEvolutionStage()
    move-effects.js             TRIGGERS + MOVE_EFFECTS + applyEffect() + statusChance
    status-effects.js           StatusEffects: poison/paralysis/burn/sleep/freeze
    natures.js                  25 naturalezas
    pokemon-db.js               POKEMON_DB (151 Gen1, tipos, moveLines, evoluciones) + POKEMON_LIST
    routes.js                   ROUTE_DATA + KANTO_ROUTES + SHINY_RATE + generatePaths()
    storage.js                  Storage: pokédex, EVs por cadena evolutiva
    pokedex.js                  KANTO_DEX (151) + getDexEntry()
    types.js                    Tabla de efectividad
    mock-data.js                Stats base 151 Gen1 (fallback sin red)
  game/
    pokemon.js                  createPokemon, computeStats, gainExp, evolve, fullHeal
    battle.js                   calcDamage (con combatMods), enemyChooseMove
  ui/
    render.js                    Render.hpBar, typeBadge/typeBadges, statsGrid, updateHpBar
    screens.js                   Todas las pantallas, incl. rutas 'information' (~2100 líneas)
    pokedex-screen.js            Pokédex: 3 estados + detalle con stats/EVs/movimientos
    compendium-screen.js         Compendio: efectos de estado + lista de movimientos
assets/
  bg/                            Fondos de ruta/combate
  sprites/
    grass.png                    Icono de encuentro salvaje (fondo transparente)
    trainers/                    Sprites de entrenadores (entrenadorjoven.png)
    items/                       Sprites de vitaminas (proteina, ps, zinc, calcio, carbo, hierro, rarecandy)
```

---

## 2. Rutas, caminos y entrenadores

### Aliases en routes.js

```js
const MOVES   = MOVE_LIST;    // MOVES.fire.special.ember → 'ember'
const POKEMON = POKEMON_LIST; // POKEMON.rattata → 'rattata'
```

### Estructura de una ruta

```js
'route-1': {
  bg: 'assets/bg/route-1.png',

  // Opcional — fondo específico para las pantallas de combate en esta ruta.
  // Si no se especifica, el combate reutiliza `bg` (fondo de la ruta).
  combatBg: 'assets/bg/combate.png',

  // Pool de pokemon que pueden salir como PREMIO al completar la ruta (ver sección 11)
  rewardPokemon: [POKEMON.rattata, POKEMON.pidgey, POKEMON.pikachu],

  // Encuentros salvajes — rate debe sumar 100 entre todas las entradas
  wild: [
    { name: POKEMON.rattata, rate: 45, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
    { name: POKEMON.pidgey,  rate: 45, minLv: 2, maxLv: 4, moveId: MOVES.flying.physical.peck   },
    // shiny: true → este Pokémon SIEMPRE aparece como shiny (ver sección 25)
    { name: POKEMON.pikachu, rate: 10, minLv: 3, maxLv: 7, moveId: MOVES.electric.special.thunder_shock, shiny: true },
  ],

  // Entrenadores normales — rate debe sumar 100
  trainer: [
    { name: 'Youngster Joey', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 60,
      pokemon: [{ name: POKEMON.rattata, minLv: 3, maxLv: 4, moveId: MOVES.normal.physical.tackle }] },
    { name: 'Lass Amy', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 40,
      pokemon: [{ name: POKEMON.pidgey, minLv: 3, maxLv: 5, moveId: MOVES.flying.physical.peck }] },
  ],

  // Opcional: entrenador especial que aparece EXACTAMENTE UNA VEZ por ruta (ver más abajo)
  specialTrainer: { name:'Rival Gary', img:'...', pokemon: [...] },

  // Opcional: caminos hardcodeados (si no, se generan automáticamente)
  paths: [
    [{ type:'trainer' }, { type:'wild' }, { type:'wild' }],
    [{ type:'wild' },    { type:'special' }, { type:'wild' }],
  ],

  // Opcional: longitud de los caminos generados automáticamente (por defecto 3)
  pathLength: 2,
}
```

### Fondos — ruta vs combate (`bg` y `combatBg`)

`adventure()` establece dos variables en `GameState` al entrar a una ruta:

```js
GameState.currentBg       = data?.bg ?? null;                    // fondo de la pantalla de ruta
GameState.currentCombatBg = data?.combatBg ?? data?.bg ?? null;  // fondo de las pantallas de combate
```

- `_renderAdventureShell` (pantalla "Elige tu camino", progreso, etc.) usa
  `GameState.currentBg`.
- `_renderCombatScreen` (cualquier combate de esa ruta — salvaje, entrenador,
  rival especial) usa `GameState.currentCombatBg`.

Si una ruta no define `combatBg`, los combates reutilizan `bg` (comportamiento
anterior, fondo único). Para tener un fondo distinto en combate (p.ej. el
camino de tierra de la ruta vs una zona de hierba alta para el combate),
simplemente añade `combatBg` a la ruta — no hace falta tocar nada más.

### Imágenes de entrenadores

Cada entrenador en `trainer[]` y `specialTrainer` puede tener `img: 'ruta/al/sprite.png'`.
Esa imagen se muestra:
- En el icono del camino durante la selección de ruta
- En el tooltip al hacer hover (muestra el nombre del entrenador)

Si `img` no existe o la imagen falla al cargar, se muestra `❓` automáticamente
(vía `onerror` en el `<img>`).

Los sprites de entrenadores van en `assets/sprites/trainers/`. Si tienen fondo
negro sólido en vez de transparencia real, hay que procesarlos con Pillow:

```python
from PIL import Image
img = Image.open('sprite.png').convert('RGBA')
data = list(img.getdata())
new_data = [(r,g,b,0) if r<30 and g<30 and b<30 else (r,g,b,a) for r,g,b,a in data]
img.putdata(new_data)
img.save('sprite.png')
```

Los sprites se renderizan con `object-fit:contain` (32×32px) para no deformar
proporciones no cuadradas.

### Hover en la selección de camino

Al elegir ruta, cada evento del camino (`Salvaje`/`Entrenador`/`Especial`) muestra
un tooltip al hacer hover con su nombre real ("Pokemon Salvaje", "Youngster Joey", etc.).
Esto se resuelve en `_showPathSelection` con `resolvedPaths`, usando `pickTrainer`
para previsualizar qué entrenador tocaría en cada hueco `trainer`.

### Longitud de caminos — `pathLength` y `paths`

Por defecto los caminos generados tienen **3 eventos**. Para cambiarlo:

```js
'route-1': {
  pathLength: 2,  // genera caminos de 2 eventos
  ...
}
```

Longitudes con combinaciones predefinidas: **2** y **3**. Cualquier otra longitud
genera combinaciones aleatorias de `trainer`/`wild`.

Para control total, usa `paths` — cada camino puede tener **cualquier número de eventos**,
y caminos distintos pueden tener longitudes distintas:

```js
paths: [
  [{ type:'trainer' }, { type:'wild' }],                                    // 2 eventos
  [{ type:'wild' }, { type:'trainer' }, { type:'wild' }],                   // 3 eventos
  [{ type:'trainer' }, { type:'trainer' }, { type:'wild' }, { type:'wild' }], // 4 eventos
]
```

### Encuentro especial (`specialTrainer` + `type:'special'`)

Para garantizar que un entrenador concreto aparezca **exactamente una vez** por ruta
(p.ej. un rival), sin importar cuántas veces aparezca `type:'trainer'`:

```js
specialTrainer: {
  name: 'Rival Gary',
  img:  'assets/sprites/trainers/gary.png',
  pokemon: [
    { name: POKEMON.squirtle, minLv: 5, maxLv: 5, moveId: MOVES.water.special.water_gun },
  ],
},
paths: [
  [{ type:'special' }, { type:'wild'    }, { type:'trainer' }],
  [{ type:'wild'    }, { type:'special' }, { type:'wild'    }],
  [{ type:'trainer' }, { type:'wild'    }, { type:'special' }],
],
```

Comportamiento:
- El primer `type:'special'` encontrado en el camino usa `specialTrainer` y marca
  `GameState.specialTrainerUsed = true`.
- Si hay un segundo `type:'special'` en el mismo camino, cae a un `trainer` normal
  (no se repite).
- El flag se resetea cada vez que el jugador elige un nuevo camino.

### Punto de curación (`type:'heal'`)

Un paso del camino que no es combate — al llegar, se muestra un selector con
todo el equipo (sprite, HP actual/máximo, y badge de estado si lo tiene) y el
jugador elige **un** pokemon para curar:

```js
paths: [
  [{ type:'wild' }, { type:'trainer' }, { type:'heal' }, { type:'trainer' }, { type:'wild' }],
],
```

No necesita ninguna configuración adicional en `ROUTE_DATA` — el icono es
siempre `assets/sprites/items/potion.png`, en la selección de camino y en el
progreso durante combate (sección 18).

Comportamiento de `healPokemon(pokemon)` (en `pokemon.js`):
- `currentHp = stats.hp` (HP al 100%)
- `statusEffect = null` (elimina veneno/quemado/paralizado/etc.)
- **NO** restaura PP ni resetea `combatMods` — a diferencia de `fullHeal`,
  que se usa al completar la ruta (sección 11) o al capturar (sección 17)

El botón "No curar a nadie" permite saltar el punto de curación sin elegir
ningún pokemon. En ambos casos, el camino continúa normalmente al siguiente
paso (`_runNextInPath`).

### Pokemon dinámico del rival según el starter — `RIVAL_STARTER`

Para que el equipo del rival dependa de qué starter eligió el jugador (el clásico
"rival con el contra-tipo de tu inicial"), usa el marcador especial
`'RIVAL_STARTER'` como `name` en `specialTrainer.pokemon`:

```js
specialTrainer: {
  name: 'Azul',
  img:  'assets/sprites/trainers/rival_kanto.png',
  pokemon: [
    { name: 'RIVAL_STARTER', minLv: 5, maxLv: 5 },
    // No pongas moveId aquí — buildMoves() lo calcula automáticamente
    // según el pokemon resuelto y su stage evolutiva (ver sección 5)
  ],
},
```

`_runNextInPath` detecta `p.name === 'RIVAL_STARTER'` y lo sustituye por
`pickInitialPokemonRival(GameState.starter.name)` (definida en `routes.js`):

```js
function pickInitialPokemonRival(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur)  return POKEMON.charmander;
  if (playerPokemon === POKEMON.charmander) return POKEMON.squirtle;
  if (playerPokemon === POKEMON.squirtle)   return POKEMON.bulbasaur;
  return POKEMON.eevee; // fallback si el starter no es ninguno de los 3 clásicos
}
```

La rotación es la clásica de Pokémon Rojo/Azul (cada starter rival es fuerte
contra el tuyo). Para cambiar la lógica de asignación, edita esta función —
puede devolver cualquier nombre de `POKEMON_LIST`, incluyendo otra cadena
evolutiva completa.

**Importante**: `RIVAL_STARTER` solo funciona dentro de `specialTrainer.pokemon`,
resuelto la primera vez que `enc.type === 'special'` aparece en el camino
(antes de que `GameState.specialTrainerUsed` se ponga a `true`).

### RIVAL_STARTER_2 — segunda forma del contra-tipo

Para un encuentro posterior donde el rival ya ha evolucionado su starter a la
forma intermedia, usa el marcador `'RIVAL_STARTER_2'`:

```js
specialTrainer: {
  name: 'Azul',
  img:  'assets/sprites/trainers/rival_kanto.png',
  pokemon: [
    { name: 'RIVAL_STARTER_2', minLv: 18, maxLv: 22 },
  ],
},
```

`_runNextInPath` lo resuelve con `pickRivalSecondForm(GameState.starter.name)`
(definida en `routes.js`):

```js
function pickRivalSecondForm(playerPokemon) {
  if (playerPokemon === POKEMON.bulbasaur)  return POKEMON.charmeleon;  // jugador Bulbasaur → rival Charmeleon
  if (playerPokemon === POKEMON.charmander) return POKEMON.wartortle;   // jugador Charmander → rival Wartortle
  if (playerPokemon === POKEMON.squirtle)   return POKEMON.ivysaur;     // jugador Squirtle → rival Ivysaur
  return POKEMON.vaporeon; // fallback
}
```

El nivel, `moveId` y `overrides` del entry se respetan tal cual — solo se
sustituye `name`. Si no se especifica `moveId`, `buildMoves` usará el movimiento
de mayor poder para esa stage evolutiva (stage 1 = forma intermedia).

Ambos marcadores (`RIVAL_STARTER` y `RIVAL_STARTER_2`) pueden coexistir en el
mismo `pokemon[]` del `specialTrainer` — cada uno se resuelve de forma
independiente.

---

## ⚠️ Convención de nombres — guiones vs guiones bajos (MUY IMPORTANTE)

Este es el error más fácil de cometer al escribir `routes.js` y **rompe la carga
de TODO el juego** sin lanzar un error de sintaxis detectable por linters.

### El problema

`POKEMON_LIST` y `MOVE_LIST` (en `pokemon-db.js` y `move-pool.js`) generan claves
reemplazando `-` por `_`:

```js
// pokemon-db.js
list.nidoran_m = 'nidoran-m';
list.nidoran_f = 'nidoran-f';
list.mr_mime   = 'mr-mime';

// move-pool.js — _buildMoveList()
list[type].physical[m.id.replace(/-/g,'_')] = m.id;
```

Así que el **id real** del pokemon/movimiento puede tener guión (`'nidoran-f'`,
`'poison-sting'`), pero la **clave de acceso** en `POKEMON_LIST`/`MOVE_LIST`
usa guión bajo (`POKEMON.nidoran_f`, `MOVES.poison.physical.poison_sting`).

### Por qué rompe todo el juego sin avisar

```js
POKEMON.nidoran-f                          // ❌ JS lo interpreta como POKEMON.nidoran - f
MOVES.poison.physical.poison-sting         // ❌ JS lo interpreta como ...poison - sting
```

Esto es **sintácticamente válido** — `node --check` no lo detecta, porque
`a.b - c` es una resta perfectamente legal. Pero en runtime, `f` y `sting` no
existen como variables → `ReferenceError: f is not defined`. Como esto ocurre
durante la evaluación de `ROUTE_DATA` (un objeto literal que se construye al
cargar el script), **lanza una excepción que corta la carga completa de
`routes.js`**, y el juego se queda colgado tras elegir starter sin ningún
mensaje visible en pantalla — solo en la consola del navegador.

### Checklist al escribir cualquier entrada de pokemon/movimiento en routes.js

- ✅ `POKEMON.nidoran_f`, `POKEMON.nidoran_m`, `POKEMON.mr_mime` — **guión bajo**
- ✅ `MOVES.poison.physical.poison_sting`, `MOVES.fighting.physical.karate_chop` — **guión bajo**
- ❌ Nunca copies el `id` del movimiento (`'poison-sting'`, `'karate-chop'`) tal
  cual en notación de punto — esos ids llevan guión real.

Si tienes dudas sobre el nombre de la clave correcta para un pokemon o
movimiento, consulta `POKEMON_LIST` / `MOVE_LIST` generados en `pokemon-db.js`
y `move-pool.js`, o simplemente usa siempre `_` en notación de punto.

---

## 3. Gimnasios

### Filosofía: un gimnasio es una ruta más

Los gimnasios **no son una pantalla especial** — son una entrada normal de
`ROUTE_DATA` con un `paths` que incluye un nuevo tipo de encuentro,
`type:'leader'`. Todo el flujo (selección de camino, progreso, combates,
recompensa de fin de ruta) es exactamente igual al de cualquier otra ruta.

```js
'ciudad-plateada': {
  bg:       'assets/bg/ciudad-plateada.png',
  combatBg: 'assets/bg/combate.png',
  wild: [],

  // Pantalla de "llegada" — se muestra UNA SOLA VEZ, antes de la selección
  // de camino, la primera vez que se entra a esta ruta. Opcional: si no se
  // define `welcome`, la ruta empieza directo en "Elige tu camino" como
  // cualquier otra.
  welcome: {
    title:    'Ciudad Plateada',
    subtitle: 'Hogar del Gimnasio Pokemon de tipo Roca',
    img:      'assets/bg/ciudad-plateada.png',
  },

  // Datos del líder — usados por el combate type:'leader' y por la
  // recompensa final (medalla). Todo vive aquí, no en KANTO_ROUTES.
  gymLeader:    'Brock',        // nombre mostrado durante el combate
  gymType:      'rock',         // informativo
  gymLeaderImg: 'assets/sprites/trainers/brock.png',  // opcional, sprite en selección de camino
  badge:        'Boulder Badge',

  // Entrenadores normales — usados por cualquier type:'trainer' del camino,
  // EXACTAMENTE igual que en cualquier otra ruta (rate debe sumar 100, sección 2).
  trainer: [
    { name: 'Hiker Rocko', img: 'assets/sprites/trainers/entrenadorjoven.png', rate: 100,
      pokemon: [{ name: POKEMON.geodude, minLv: 11, maxLv: 12, moveId: MOVES.rock.physical.rock_throw }] },
  ],

  // Equipo del líder — combate type:'leader', un solo combate con varios pokemon
  gym: {
    leader: [
      { name: POKEMON.geodude, level: 12, moveId: MOVES.rock.physical.rock_throw },
      { name: POKEMON.onix, level: 14, moveId: MOVES.rock.physical.rock_throw,
        overrides: { evs: { hp: 32, def: 32, spd: 32 } } },  // ver sección 4
    ],
  },

  // Camino(s) de la ruta — type:'leader' es el combate final contra el líder.
  // type:'trainer' usa el array `trainer` de arriba, como cualquier otra ruta.
  // Pueden tener distinta longitud, igual que cualquier `paths` (sección 2).
  paths: [
    [{ type: 'trainer' }, { type: 'leader' }],
    [{ type: 'leader' }],
  ],
},
```

`KANTO_ROUTES` para esta ruta solo necesita `{ name, area }` — sin ningún
campo de gimnasio:

```js
{ name: 'Ciudad Plateada', area: 'ciudad-plateada' },
```

### Pantalla de bienvenida (`welcome`)

Si `data.welcome` existe, `adventure()` la muestra antes de
`_showPathSelection`, **solo la primera vez** que se entra a esa ruta
(`GameState.welcomeShown[route.area]`, persiste durante la partida, se
resetea con `GameState.reset()`). Campos:

- `title` — título grande (si no se especifica, usa `route.name`)
- `subtitle` — texto descriptivo opcional
- `img` — imagen opcional mostrada entre el título y el subtítulo

Un botón "CONTINUAR" lleva a la selección de camino normal.

### type:'leader' — el combate del líder

`_runNextInPath` trata `type:'leader'` así:

1. Crea `foeTeam` desde `data.gym.leader` (cada entry usa `level` fijo, o
   `minLv`/`maxLv` si prefieres variar el nivel — `rollLevel` soporta ambos)
2. Lanza `Screens.combat` con `isGym: true` y `gymLeaderName: data.gymLeader`
3. Al ganar (`onWin`):
   - `GameState.badges.push(data.badge)` (medallas del jugador, para HUD/progreso)
   - `Storage.addBadge(p.name, data.badge)` para **cada pokemon del equipo**
     — la medalla queda registrada en la pokédex para toda su cadena evolutiva
     (sección 12)
   - Continúa el camino normalmente (`_runNextInPath`) — si era el último
     paso, se muestra la recompensa de fin de ruta (sección 11) igual que
     cualquier otra ruta

### type:'trainer' — sin diferencias respecto a rutas normales

`type:'trainer'` dentro de una ruta de gimnasio funciona **exactamente igual**
que en cualquier otra ruta (sección 2): se elige un entrenador de `data.trainer`
según `rate`. No existe ninguna rama especial — si quieres que el gimnasio
tenga combates previos al líder, simplemente añade entradas a `data.trainer`
y pon `{type:'trainer'}` en el `paths` antes de `{type:'leader'}`.

### Iconos en selección de camino y progreso

`type:'leader'` se resuelve con `data.gymLeader`/`data.gymLeaderImg` — si no
hay `gymLeaderImg` o falla la carga, se muestra 🏆. Esto aplica tanto en
`_showPathSelection` (icono 32px) como en `_renderPathProgress` (icono 20px,
durante el combate).

### Victoria final

`_showItemReward`'s `advance()` detecta `GameState.routeIndex >= KANTO_ROUTES.length`
tras completar la recompensa de la última ruta, y muestra `Screens.victory`
pasando la última medalla obtenida (`GameState.badges[length-1]`).

---

## 4. Pokemon — IVs, EVs y overrides

### Comportamiento por defecto

**Todo pokemon creado con `createPokemon()` — jugador o rival — tiene por defecto:**
- **IVs perfectos**: `{ hp:31, atk:31, def:31, spa:31, spd:31, spe:31 }`
- **EVs en cero**: `{ hp:0, atk:0, def:0, spa:0, spd:0, spe:0 }`

No hay que especificar nada para obtener este comportamiento — es el default.

### Personalizar IVs/EVs de un encuentro concreto

Añade `overrides` a la entrada del pokemon en `routes.js` (funciona en `wild`,
`trainer[].pokemon`, `specialTrainer.pokemon`, `gym.pre`, `gym.leader`):

```js
{ name: POKEMON.onix, level: 14, moveId: MOVES.rock.physical.rock_throw,
  overrides: {
    evs: { def: 20, hp: 12 },   // solo las stats que quieras subir — el resto quedan en 0
    ivs: { spe: 0 },            // solo las stats que quieras bajar — el resto quedan en 31
  },
},
```

`overrides.ivs` y `overrides.evs` son **parciales** — se mezclan sobre los
defaults (`{...DEFAULT, ...overrides.ivs}`), así que solo necesitas especificar
las stats que difieran del default.

### Firma de createPokemon

```js
createPokemon(nameOrId, level, isPlayer = false, moveId = null, overrides = null, shiny = false)
```

El parámetro `shiny` se usa internamente — no hace falta pasarlo manualmente
desde `routes.js`. El sistema lo gestiona a través de `SHINY_RATE` y del campo
`shiny: true` en los encuentros salvajes (ver sección 25).

---

## 5. Líneas evolutivas y stages de movimientos

### POKEMON_DB

Cada entrada en `pokemon-db.js` tiene:

```js
bulbasaur: {
  types: ['grass','poison'],
  damageClass: 'special',
  moveLines: [{type:'grass',damageClass:'special'}, {type:'poison',damageClass:'special'}],
  evolvesAt: 16,            // nivel de evolución (99 = evoluciona por piedra/trade, no por nivel)
  evolvesInto: 'ivysaur',   // siguiente forma — ausente si es forma final sin evolución
},
```

151 pokemon Gen1 con 69 cadenas de evolución completas con niveles oficiales.

### getEvolutionStage(name) — stage 0/1/2

`move-pool.js` calcula la "stage" evolutiva de cada pokemon:

| Caso | Stage |
|---|---|
| Forma base (nadie evoluciona hacia él, y él evoluciona en algo) | **0** |
| Forma intermedia (tiene predecesor Y evoluciona en algo más) | **1** |
| Forma final (`evolvesInto` ausente, **o** es el último eslabón de cualquier cadena) | **2** |
| Pokemon sin cadena evolutiva (Ditto, Snorlax, Lapras, Scyther, Eevee...) | **2** |

Importante: `evolvesAt: 99` (evolución por piedra, como Pikachu→Raichu) **no**
hace que el pokemon sea stage 2 — Pikachu sigue siendo stage 0 porque tiene
`evolvesInto: 'raichu'`. Solo Raichu (sin `evolvesInto`) es stage 2.

### buildMoves(pokemonName) — movimientos según stage

Cada `moveLine` (tipo + clase de daño) tiene una progresión de **3 movimientos**
en `MOVE_POOL` (flojo → medio → fuerte). `buildMoves` devuelve:

- **Stage 0**: el 1er movimiento de cada moveLine
- **Stage 1**: los 2 primeros de cada moveLine
- **Stage 2**: los 3 de cada moveLine

Ejemplos verificados:

| Pokemon | Stage | Movimientos |
|---|---|---|
| Bulbasaur | 0 | Absorber, Polvo Veneno |
| Ivysaur | 1 | Absorber, Hoja Mágica, Polvo Veneno, Bomba Lodo |
| Venusaur | 2 | Absorber, Hoja Mágica, Rayo Solar, Polvo Veneno, Bomba Lodo, Onda Tóxica |
| Pikachu | 0 | Impactrueno |
| Raichu | 2 | Impactrueno, Rayo, Trueno |
| Raticate | 2 | Placaje, Golpe Cuerpo, Hiper Colmillo |

**La pokédex usa exactamente esta misma lógica** (`getEvolutionStage` +
`getMoveProgression`) para mostrar solo los movimientos accesibles a esa stage —
si Bulbasaur solo puede usar 2 movimientos, la pokédex solo muestra esos 2,
no los 6 de Venusaur.

### moveId (routes.js) y autoMove — relación con buildMoves

**`createPokemon` SIEMPRE llama a `buildMoves(name)`**, sea jugador o rival.
`moveId` (definido por pokemon en `routes.js`, sección 2) **nunca reemplaza**
el moveset — su único efecto es decidir `autoMove` (qué movimiento usa ese
rival por defecto en combate):

- Si `moveId` está entre los movimientos que `buildMoves` ya devolvió para esa
  stage → `autoMove = moveId`. El rival ataca con ese movimiento, pero el
  pokemon conserva el resto de su moveset por stage.
- Si `moveId` **no** está en el moveset por stage (p.ej. asignaste a un rival
  un movimiento más fuerte del que su stage normalmente tendría) → se añade
  igualmente al array `moves` para que el rival pueda usarlo, y `autoMove`
  apunta a él.
- Si no se especifica `moveId` (jugador, o pokemon de recompensa) →
  `autoMove` = el movimiento de mayor `power` entre los disponibles.

**Por qué esto importa al capturar**: antes, un Pidgey salvaje con
`moveId: MOVES.flying.physical.peck` se creaba con **un único movimiento**
(Picotazo). Al capturarlo, te quedabas con ese Pidgey limitado a un solo
ataque para siempre. Ahora, ese mismo Pidgey se crea con su moveset completo
de stage 0 (Picotazo + Placaje) — el rival sigue atacando con Picotazo
(`autoMove`), pero si lo capturas, **ya tienes ambos movimientos disponibles**
para elegir, sin tener que esperar a que evolucione o suba de stage.

---

## 6. Movimientos — MOVE_POOL, TYPES, DAMAGE_CLASS

### Constantes cerradas

```js
// TYPES — los 18 tipos de pokemon
type: TYPES.FIRE, TYPES.WATER, TYPES.GRASS, TYPES.ELECTRIC, ... // ver move-pool.js

// DAMAGE_CLASS — solo dos valores
damageClass: DAMAGE_CLASS.PHYSICAL | DAMAGE_CLASS.SPECIAL
```

Usa siempre estas constantes en vez de strings sueltos para evitar typos.

### Estructura de un movimiento en MOVE_POOL

```js
{ id: 'tackle', name: 'Placaje', power: 20, pp: 35, type: TYPES.NORMAL,
  damageClass: DAMAGE_CLASS.PHYSICAL, effectId: 'double-hit' },
```

`effectId` es opcional — referencia una entrada en `MOVE_EFFECTS` (sección 7).

### effectId — uno o varios efectos

`effectId` acepta un **string** (un solo efecto) o un **array** (varios
efectos, ejecutados en orden de aparición):

```js
{ id: 'psychic', name: 'Psiquico', power: 90, pp: 10, type: 'psychic',
  damageClass: 'special', effectId: ['clear', 'double-hit'] },
```

`applyEffect(move, trigger, ctx)` recorre el array y ejecuta **solo** los
efectos cuyo `trigger` coincide con el momento actual (antes del golpe,
después, o al recibirlo — sección 7). Un mismo movimiento puede combinar
efectos de triggers distintos: p.ej. `['priority', 'drain-50']` ejecuta
`priority` en `BEFORE_ATTACK` y `drain-50` en `AFTER_ATTACK`, cada uno
en su momento correspondiente. Si dos efectos del array coinciden en el
mismo trigger, se ejecutan **en el orden en que aparecen en el array**.
Cada efecto con `statusChance` tira su propia probabilidad de forma
independiente.

Los tooltips de movimiento (pokédex, compendio, selector de auto-movimiento)
muestran las descripciones de todos los efectos del array unidas con ` · `,
vía `getEffectDescriptions(move)`.

### boss: true — movimientos exclusivos de rivales hardcodeados

Un movimiento con `boss: true` **nunca** forma parte del moveset que
`buildMoves()` genera automáticamente por stage evolutiva (sección 5) —
ningún pokemon del jugador puede aprenderlo de forma normal, sin importar su
nivel o evolución.

```js
{ id: 'meteor-mash', name: 'Puño Meteoro', power: 110, pp: 5, type: 'steel',
  damageClass: 'physical', boss: true },
```

La **única** forma de que un pokemon tenga este movimiento es referenciarlo
explícitamente vía `moveId` en `routes.js` (rivales especiales, líderes de
gimnasio, etc. — sección 2/3):

```js
gym: {
  leader: [
    { name: POKEMON.metagross, level: 50, moveId: MOVES.steel.physical.meteor_mash },
  ],
},
```

`createPokemon` siempre llama `buildMoves(name)` (que omite los `boss:true`),
y luego, si `moveId` no está en ese moveset — como es el caso de un movimiento
`boss:true` — lo añade explícitamente y lo fija como `autoMove` (sección 5,
"moveId y autoMove"). Si el jugador **captura** a ese rival, el pokemon
capturado conserva ese movimiento (formaba parte de ese pokemon concreto),
pero seguirá sin poder "aprenderlo" de forma genérica en ningún otro pokemon.

`boss: true` es completamente opcional — un movimiento sin esa propiedad
(o con `boss: false`) se comporta exactamente como antes.

---

## 7. Efectos de movimientos (MOVE_EFFECTS)

### TRIGGERS — lista cerrada

```js
var TRIGGERS = Object.freeze({
  BEFORE_ATTACK: 'before-attack',  // antes de que el pokemon ataque este turno
  AFTER_ATTACK:  'after-attack',   // después de aplicar el daño del ataque
  ON_HITTED:     'on-hitted',      // cuando el pokemon recibe un golpe
});
```

### Contextos del callback `fn(ctx)`

- `BEFORE_ATTACK` / `AFTER_ATTACK`: `{ user, target, dmg, team, log, showStatChange, updatePlayerHud }`
- `ON_HITTED`: `{ user, attacker, dmg, team, log, showStatChange, updatePlayerHud }`

**Importante**: estos efectos se aplican tanto cuando ataca el **jugador** como
cuando ataca el **rival** — no hay distinción. Si un rival tiene un movimiento
con `effectId: 'double-hit'`, golpeará dos veces igual que el jugador.

### Cómo añadir un efecto nuevo

```js
'mi-efecto': {
  trigger: TRIGGERS.AFTER_ATTACK,
  desc:    'Descripción visible en hover y pokédex',
  statusChance: 0.30,  // opcional — 30% de probabilidad de activarse (ver abajo)
  fn(ctx) {
    // tu lógica
  },
},
```

Luego referencia el id desde `move-pool.js`: `effectId: 'mi-efecto'`.

### statusChance — probabilidad de aplicación

Si el efecto declara `statusChance: 0.30`, `applyEffect()` tira los dados ANTES
de ejecutar `fn` — solo un 30% de las veces se aplica. Si no se declara
`statusChance`, el efecto **siempre** se aplica (comportamiento de drain,
raise-atk, etc.).

```js
'poison-touch': {
  trigger: TRIGGERS.AFTER_ATTACK,
  statusChance: 0.30,
  desc: '30% de probabilidad de envenenar al rival',
  fn(ctx) { StatusEffects.apply(ctx.target, 'poison', ctx.log); }
}
```

### Efectos disponibles

| ID | Trigger | Efecto |
|---|---|---|
| drain-50 / drain-25 / drain-10 | AFTER_ATTACK | Cura 50%/25%/10% del daño causado al usuario |
| lower-atk-10 / lower-atk-20 / lower-def-20 | AFTER_ATTACK | Baja ATK/DEF del rival 10%/20% del **base** (acumulable) |
| raise-atk-20 / raise-spa-10 | AFTER_ATTACK | Sube ATK/SPA propio 20%/10% del **base** (acumulable) |
| burn-10 / burn-20 / burn-25 | AFTER_ATTACK | Probabilidad de quemar al rival |
| poison-25 | AFTER_ATTACK | 25% de probabilidad de envenenar al rival |
| sleep-10 | AFTER_ATTACK | 10% de probabilidad de dormir al rival |
| paralize-25 | AFTER_ATTACK | 25% de probabilidad de paralizar al rival |
| double-hit | BEFORE_ATTACK | Golpea dos veces en el mismo turno |
| priority | BEFORE_ATTACK | Ataca primero, ignora velocidad |
| **clear** | BEFORE_ATTACK (pasivo) | Inmune a estados alterados y a bajadas de stat — ver abajo |
| recoil-30 | ON_HITTED | Devuelve 30% del daño recibido al atacante |
| shield-10 / shield-25 | ON_HITTED | Reduce el daño recibido un 10%/25% |
| heal-on-hit-10 | ON_HITTED | Cura 10% HP máximo al recibir un golpe |

### Efecto pasivo `clear` — inmunidad a estados y debuffs

A diferencia de los demás efectos, `clear` **no se "activa" en un turno** —
es una habilidad pasiva: mientras el pokemon tenga **cualquier** movimiento
con `effectId: 'clear'` en su moveset (no necesita ser su `autoMove`/movimiento
seleccionado), el pokemon es inmune a:

- Cualquier estado alterado (`StatusEffects.apply` — veneno, quemadura,
  parálisis, sueño, congelado) — la llamada devuelve `false` y se registra
  `"<Pokemon> esta protegido y no puede ser afectado!"`
- Cualquier bajada de estadísticas vía `lower-atk-10`, `lower-atk-20`,
  `lower-def-20` (y cualquier efecto `lower-*` futuro que añadas siguiendo
  el mismo patrón) — se registra `"<Pokemon> esta protegido y no puede ser
  debilitado!"` y `combatMods` no se modifica

La comprobación la hace `hasClearEffect(pokemon)` (en `pokemon.js`):

```js
function hasClearEffect(pokemon) {
  return !!pokemon?.moves?.some(m => m.effectId === 'clear');
}
```

**Para usarlo**: pon `effectId: 'clear'` en cualquier movimiento de
`move-pool.js`. Cualquier pokemon que tenga ese movimiento en su moveset
(jugador o rival) queda protegido automáticamente, sin configuración
adicional. Subidas de stat propias (`raise-atk-20`, `raise-spa-10`) no se ven
afectadas — `clear` solo bloquea efectos negativos sobre el propio pokemon.

**Si añades nuevos efectos `lower-*`**: replica la comprobación
`if (hasClearEffect(ctx.target)) { ...log...; return; }` al principio de
`fn(ctx)`, igual que en `lower-atk-10`/`lower-atk-20`/`lower-def-20`.

---

## 8. Efectos de estado (status-effects.js)

Un pokemon solo puede tener **un estado activo a la vez**. `StatusEffects.apply()`
devuelve `false` si el pokemon ya tiene cualquier estado — no se puede re-envenenar
a alguien quemado, por ejemplo. Los cambios de stat (`combatMods`, sección 9) son
independientes y siempre se aplican.

**Excepción**: si `hasClearEffect(pokemon)` es `true` (el pokemon tiene un
movimiento con `effectId: 'clear'` en su moveset, sección 7), `apply()` devuelve
`false` inmediatamente sin comprobar nada más — el pokemon es inmune a todos los
estados, independientemente de si ya tenía uno o no.

### Tabla de efectos exactos

| Estado | Daño fin de turno | Modificador de stat | Otros |
|---|---|---|---|
| **Veneno** (poison) | 10% HP máximo | — | — |
| **Parálisis** (paralysis) | — | VEL −50% (afecta orden de turno) | 10% de no atacar cada turno |
| **Quemado** (burn) | 5% HP máximo | ATK −50% (vía combatMods) | — |
| **Sueño** (sleep) | — | — | No ataca. T1: 0% despertar, T2: 33%, T3: 66%, T4+: 100% |
| **Congelación** (freeze) | 5% HP máximo | SPA −50% (vía combatMods) | — |

### Cómo aplicar un estado desde un efecto de movimiento

```js
'mi-efecto-veneno': {
  trigger: TRIGGERS.AFTER_ATTACK,
  statusChance: 0.30,
  desc: '30% de envenenar al rival',
  fn(ctx) { StatusEffects.apply(ctx.target, 'poison', ctx.log); }
}
```

**Por diseño, ningún movimiento del juego aplica estados actualmente** — el
sistema está implementado y listo, pero se deja sin activar hasta que se decida
qué movimientos lo usan.

### Curación al capturar

`fullHeal(pokemon)` (llamado al capturar, en cada combate ganado y al curar en
ruta) limpia:
- `currentHp = stats.hp` (vida completa)
- `statusEffect = null` (cura cualquier estado)
- `combatMods = {}` (resetea todos los modificadores de stat)
- PP de todos los movimientos al máximo

Un pokemon capturado mientras está envenenado/quemado/etc. se captura **curado**.

### Badges visuales

`StatusEffects.badge(pokemon)` genera el HTML del badge (`💜 PSN`, `🔥 QEM`, etc.)
que se muestra de forma persistente en el HUD durante el combate, actualizado
tras cada ataque y al final de cada turno vía `_updateStatusBadges`.

---

## 9. Sistema de combatMods (modificadores de stat)

### Por qué existe

Antes los efectos modificaban `pokemon.stats.atk` directamente. Esto se rompía
cuando el pokemon subía de nivel (`computeStats()` recalculaba `stats` desde
base+IVs+EVs y borraba el boost).

### Cómo funciona

Cada pokemon tiene `pokemon.combatMods = { atk, def, spa, spd, spe, ... }` —
multiplicadores **aditivos sobre la base**, no sobre el valor actual:

```
ATK efectivo = stats.atk × (1 + combatMods.atk)
```

- `combatMods.atk = 0`    → ATK normal (×1.0)
- `combatMods.atk = 0.20` → ATK +20% del base (×1.2)
- `combatMods.atk = 0.40` → ATK +40% del base (×1.4), tras 2 usos de raise-atk-20
- `combatMods.atk = -0.40` → ATK −40% del base (×0.6)

**Cada subida/bajada es siempre relativa al stat BASE, nunca al valor ya
modificado.** Con ATK base 10: tras 1 boost → 12, tras 2 boosts → 14 (no 14.4).

El multiplicador final tiene un mínimo de `×0.1` (nunca llega a 0 o negativo).

### Ciclo de vida

- **Se inicializan** a `{}` en `createPokemon`
- **Persisten** entre combates de la misma ruta (subir de nivel no los borra)
- **Se resetean** a `{}` al empezar una ruta nueva (`adventure()`)
- **Se resetean** al capturar (`fullHeal`)
- Burn/Freeze usan `combatMods._burnAtk` / `combatMods._freezeSpa` como flags
  internos para poder revertir el modificador al curar el estado

### Badges visuales

Cualquier `combatMods[stat] !== 0` se muestra en el HUD como
`ATK +40%` (verde) o `DEF -20%` (rojo), actualizado en tiempo real tras cada
ataque vía `_updateStatusBadges`.

---

## 9.5. Objetos equipados (held-items.js)

Cada pokemon puede llevar **como mucho un objeto equipado**:
`pokemon.heldItem` guarda el `id` del objeto (o `null`), y
`pokemon._heldItemFlags` guarda flags de activación "una vez por ruta".

### Estructura de un objeto en HELD_ITEMS

```js
'sitrus-berry': {
  name: 'Baya Zidra',
  desc: 'Si el HP baja del 50%, restaura el 25% del HP máximo. Solo una vez por ruta.',
  img:  'assets/sprites/items/sitrus-berry.png',
  fallbackIcon: '🍒',          // se usa si `img` no carga (onerror)
  trigger: HELD_ITEM_TRIGGERS.ON_TURN_START,
  onceFlag: 'sitrus-berry-used', // solo se activa una vez por ruta
  fn(ctx) {
    // ctx: { user, log, updateHud }
    // devuelve true si el efecto se ejecutó (consumido)
  },
},
```

### Tres tipos de trigger

- **`PASSIVE`** — se ejecuta **una vez** al equipar (`fn`) y al quitar (`revert`).
  Útil para modificadores permanentes mientras se lleve el objeto, como
  `combatMods.spe` del Pañuelo Eleccion o `combatMods.spd` del Chaleco Asalto.
- **`ON_TURN_START`** — se evalúa tras cada golpe recibido en combate, con el
  HP ya actualizado (`applyHeldItemTurnStart`, llamado desde `_animateAttack`
  justo después de aplicar el daño al defensor). Si declara `onceFlag`, solo
  se ejecuta una vez por ruta — el flag se resetea junto a `combatMods` en
  `adventure()`.
- **`ON_TURN_END`** — se evalúa al **final del turno**, en
  `_applyEndOfTurnStatus`, después del daño por estado (veneno/quemadura/
  congelación). Si ambos combatientes llevan un objeto con este trigger, se
  resuelven en **orden de velocidad** (`effectiveSpeed`, mayor primero), pero
  siempre como **última acción del turno** — después de todo lo demás. Útil
  para curación pasiva como Restos (`applyHeldItemTurnEnd`).

### Objetos disponibles

| ID | Nombre | Efecto |
|---|---|---|
| `sitrus-berry` | Baya Zidra | Si HP < 50% (y > 0%), cura 25% del HP máximo. Una vez por ruta. |
| `choice-scarf` | Pañuelo Elección | `combatMods.spe += 1.0` (+100% VEL, afecta orden de turno vía `effectiveSpeed`). Bloquea cambio de `autoMove`. |
| `assault-vest` | Chaleco asalto | `combatMods.spd += 0.5` (+50% defensa especial). Bloquea cambio de `autoMove`. |
| `carbon` | Carbón | +25% de daño a movimientos de tipo **fuego** (ver `dmgBoost` abajo). |
| `mystic-water` | Agua Mística | +25% de daño a movimientos de tipo **agua** (ver `dmgBoost` abajo). |
| `miracle-seed` | Semilla Milagro | +25% de daño a movimientos de tipo **planta** (ver `dmgBoost` abajo). |
| `leftovers` | Restos | Cura 10% del HP máximo al final de cada turno (`ON_TURN_END`, ver abajo). No cura si está a tope o debilitado. |

### dmgBoost — boost de daño condicional por tipo/clase de movimiento

Un objeto `PASSIVE` puede declarar `dmgBoost` para aumentar el daño de
movimientos que cumplan ciertas condiciones de `type`/`damageClass`. A
diferencia de `combatMods` (modificadores de stat genéricos, sección 9),
`dmgBoost` se evalúa **dentro de `calcDamage`** (`battle.js`), justo después
de aplicar STAB/efectividad/aleatoriedad, comprobando en tiempo real
`HELD_ITEMS[attacker.heldItem]`:

```js
'carbon': {
  name: 'Carbón',
  desc: 'Aumenta el daño de los movimientos de tipo FUEGO un 25%.',
  img:  'assets/sprites/items/carbon.png',
  fallbackIcon: '🔥',
  trigger: HELD_ITEM_TRIGGERS.PASSIVE,
  dmgBoost: { mult: 0.25, type: 'fire' },
  fn(ctx) {},      // no-op — el boost se evalúa en calcDamage, no aquí
  revert(ctx) {},  // no-op — al desequipar, calcDamage deja de verlo
},
```

Campos de `dmgBoost`:

- **`mult`** — multiplicador adicional de daño. `0.25` = ×1.25 (+25%).
  `dmg = Math.floor(dmg * (1 + mult))`.
- **`type`** — si está informado (p.ej. `'fire'`), solo aplica cuando
  `move.type === type`. Si es `null`/se omite, aplica a **todos los tipos**.
- **`class`** — opcional. Si está informado (`'physical'` o `'special'`), solo
  aplica cuando `move.damageClass === class`. Si es `null`/se omite (como en
  `carbon`, `mystic-water` y `miracle-seed`), aplica a **ambas clases**.

**Por qué `fn`/`revert` están vacíos**: a diferencia de `combatMods` (que se
escriben una vez al equipar y deben revertirse al quitar), `dmgBoost` se lee
directamente de `HELD_ITEMS[attacker.heldItem]` en cada cálculo de daño. Si el
pokemon ya no lleva el objeto, el boost simplemente no se evalúa — no hace
falta revertir ningún estado.

**Ejemplo**: Ascuas (Ember, fuego/especial, poder 40) con Carbón equipado en
un Charmander Nv.10 pasa de hacer ~9 dmg a ~11 dmg contra un objetivo neutral
(+25%, redondeado hacia abajo). Como `carbon` no declara `class`, también
afecta a movimientos físicos de fuego (p.ej. Rueda Fuego). Un movimiento
especial de otro tipo (p.ej. Pistola Agua) no recibe el boost — solo
movimientos cuyo `move.type` coincida con el `type` declarado en `dmgBoost`.

### API

```js
equipHeldItem(pokemon, itemId)   // equipa (revierte el anterior si lo había)
unequipHeldItem(pokemon)         // quita y "destruye" — revierte efecto pasivo
applyHeldItemTurnStart(pokemon, ctx) // ON_TURN_START — llamado desde combate
applyHeldItemTurnEnd(pokemon, ctx)   // ON_TURN_END — llamado al final del turno, en orden de velocidad
resetHeldItemFlags(team)         // resetea _heldItemFlags de todo el equipo
heldItemBlocksMoveChange(pokemon) // true si el objeto bloquea cambiar autoMove
```

### ITEM — acceso por clave con guión bajo

Igual que `POKEMON`/`MOVES` (ver la convención de nombres, sección 2), `ITEM`
se genera automáticamente a partir de las claves de `HELD_ITEMS`
reemplazando `-` por `_`:

```js
ITEM.sitrus_berry === 'sitrus-berry'
ITEM.choice_scarf === 'choice-scarf'
```

Al añadir un objeto nuevo a `HELD_ITEMS`, su `ITEM.xxx` queda disponible
automáticamente — no hace falta tocar nada más. Usa siempre `ITEM.xxx` en
`routes.js` (p.ej. `rewardExtras`, sección 11) en vez del id con guión.

**Importante — reset de ruta**: `adventure()` resetea `combatMods = {}` para
todo el equipo al empezar cada ruta (sección 9). Esto borraría también el
efecto pasivo de objetos como el Pañuelo Eleccion, así que `adventure()`
**re-aplica** `item.fn({user: p})` para cualquier `heldItem` con trigger
`PASSIVE` justo después del reset.

### UI — pantalla de selección de camino

En `_renderTeamBar`, si `p.heldItem` existe, aparece un icono (16×16px,
`item.img` o `item.fallbackIcon` si la imagen falla) a la derecha de la barra
de HP de ese pokemon:

- **Hover** → tooltip (`.held-item-tooltip`) con nombre y descripción
- **Click** → `_showUnequipItemConfirm(poke)`: modal de confirmación. Si se
  confirma, `unequipHeldItem` revierte el efecto pasivo y el objeto
  desaparece para siempre (no vuelve a ningún inventario)

El click en el icono usa `e.preventDefault() + e.stopPropagation()` para no
disparar también el modal de automovimiento de la fila completa.

### Cómo se obtienen los objetos

Vía recompensa de fin de ruta (`rewardExtras` en `routes.js`, sección 11) —
`equipHeldItem(pokemon, itemId)` se llama desde `_showHeldItemSelector` cuando
el jugador elige ese premio y selecciona a qué pokemon equiparlo.

### Sprites pendientes

`assets/sprites/items/sitrus-berry.png`, `assets/sprites/items/choice-scarf.png`,
`assets/sprites/items/carbon.png`, `assets/sprites/items/mystic-water.png`,
`assets/sprites/items/miracle-seed.png`, `assets/sprites/items/assault-vest.png`
y `assets/sprites/items/leftovers.png` no existen todavía — el icono cae a
`fallbackIcon` (🍒 / 🧣 / 🔥 / 💧 / 🌱 / 🦺 / 🍞) vía `onerror`. Añade los PNG a
esa carpeta cuando los tengas; no se necesita ningún cambio de código adicional.

---

## 10. EVs por cadena evolutiva

### Comportamiento

**Los EVs se comparten entre TODOS los miembros de una cadena evolutiva.**
Dar una vitamina a Ivysaur también beneficia a Bulbasaur y Venusaur (y viceversa).

### Cómo funciona — Storage.getEvolutionRoot(name)

`storage.js` sube por la cadena de `POKEMON_DB` hasta encontrar la **raíz**
(el primer eslabón — el que nadie evoluciona hacia él). Los EVs se guardan
siempre bajo esa clave raíz:

```js
Storage.addEv('ivysaur', 'atk', 5);
Storage.getEvs('bulbasaur').atk  // → 5
Storage.getEvs('ivysaur').atk    // → 5
Storage.getEvs('venusaur').atk   // → 5
Storage.getEvs('rattata').atk    // → 0 (cadena distinta)
```

Verificado con test — funciona para cadenas de 2 y 3 eslabones.

### Dónde se aplica

- `Storage.getEvs(pokemon.name)` — usado en `applyStoredEvs`, pokédex (detalle
  y badge `EV`), y selector de vitaminas
- Límite: **32 por stat** (`Storage.EV_MAX_PER_STAT`)
- Las vitaminas son el único modo de subir EVs (no se ganan en combate)

---

## 11. Recompensas de fin de ruta

Al completar un camino, `_showItemReward()` muestra **3 premios elegidos sin
repetir** de un pool de candidatos. El pool base son siempre estos 3:

### 1. Pokemon de la ruta

- Se elige aleatoriamente de `data.rewardPokemon` (array en `routes.js`)
- Se crea con `createPokemon(name, maxLevel, true)` donde `maxLevel` es el
  nivel más alto del equipo actual — el pokemon de recompensa nunca es
  más débil que tu equipo
- Se marca automáticamente como `caught` en la pokédex
- Si el equipo tiene <6 pokemon: se añade directamente
- Si el equipo tiene 6: se abre `_showPokemonSwapSelector` — eliges cuál
  sustituir, o "Cancelar" para no añadirlo

### 2. Vitamina aleatoria

Una de las 6 vitaminas elegida al azar:

| Vitamina | Stat | Sprite |
|---|---|---|
| Más PS | HP | `assets/sprites/items/ps.png` |
| Proteína | ATK | `assets/sprites/items/proteina.png` |
| Hierro | DEF | `assets/sprites/items/hierro.png` |
| Calcio | SPA | `assets/sprites/items/calcio.png` |
| Zinc | SPD | `assets/sprites/items/zinc.png` |
| Carbohidratos | VEL | `assets/sprites/items/carbo.png` |

Abre `_showEvItemSelector` para elegir a qué pokemon (y por tanto a qué
cadena evolutiva, ver sección 10) se aplica el EV.

### 3. Rare Candy

`+1 nivel a todo el equipo` vía `levelUpPokemon(p, 1)`.
Sprite: `assets/sprites/items/rarecandy.png`.

### rewardExtras — objetos equipables como candidatos extra

`ROUTE_DATA[area].rewardExtras` es un array opcional de ids de
`HELD_ITEMS` (sección 9.5), referenciados vía la constante `ITEM`:

```js
'route-1': {
  rewardPokemon: [...],
  rewardExtras: [ITEM.sitrus_berry, ITEM.choice_scarf],  // opcional
  ...
}
```

Cada entrada de `rewardExtras` se añade como **candidato adicional** de tipo
`held-item` al pool junto a los 3 base. **De entre todos los candidatos
disponibles se eligen 3 al azar, sin repetir**:

| `rewardExtras` | Candidatos totales | Resultado |
|---|---|---|
| `[]` o ausente | 3 (pokemon, vitamina, candy) | Siempre los 3 base |
| `[ITEM.sitrus_berry]` | 4 | 3 al azar de los 4 |
| `[ITEM.sitrus_berry, ITEM.choice_scarf]` | 5 | 3 al azar de los 5 |

El algoritmo (`_showItemReward`): si hay ≤3 candidatos, se muestran todos
tal cual; si hay más, se asigna a cada uno un número aleatorio (`Math.random()`),
se ordenan por ese número y se toman los primeros 3 — garantiza 3 elementos
**distintos**, sin necesidad de comprobar duplicados manualmente.

Al elegir un premio `type:'held-item'`, se abre `_showHeldItemSelector` —
eliges a qué pokemon del equipo se equipa (`equipHeldItem`). Si ese pokemon
ya llevaba otro objeto, se muestra "Sustituye: <nombre>" — el objeto anterior
se revierte y se pierde (igual que `_showUnequipItemConfirm`, sección 9.5).

### Añadir rewardPokemon/rewardExtras a una ruta nueva

```js
'nueva-ruta': {
  rewardPokemon: [POKEMON.eevee, POKEMON.pikachu],
  rewardExtras:  [ITEM.sitrus_berry],  // opcional
  ...
}
```

---

## 12. Pokédex — 3 estados

| Estado | Sprite | Nombre/tipos | Clickable | Cuándo se marca |
|---|---|---|---|---|
| **Capturado** | Normal | Visibles | Sí → detalle completo | Al capturar, elegir starter, o evolucionar |
| **Visto** | `brightness(.15) grayscale(1)` (muy oscuro) | Visibles | Sí → mismo detalle | Primera vez que aparece como foe en combate |
| **No encontrado** | `?` | `???` | No | Nunca visto |

### Storage

```js
Storage.markSeen(name)    // marca como visto (no sobreescribe si ya está caught)
Storage.markCaught(name)  // marca como capturado
Storage.isSeen(name)      // true si seen O caught
Storage.isCaught(name)    // true si caught
```

`markSeen` se llama en `_renderCombatScreen` la primera vez que se renderiza
un foe (`isFirstRender`). `markCaught` se llama al capturar, elegir starter,
recibir como recompensa, y al evolucionar (`Storage.markCaught(evolved.name)`).

### Detalle del pokemon

Muestra: sprite (oscuro si solo "visto"), tipos, stats base con barras de color,
EVs acumulados de la cadena (sección 10), y **movimientos disponibles según su
stage evolutiva** (sección 5) — solo si está capturado; si no, muestra cajas `???`.

---

## 13. Compendio

Pantalla accesible desde el menú principal (`📚 COMPENDIO`), implementada en
`compendium-screen.js`. Tres secciones:

### Efectos de estado

Lista fija con la descripción exacta de cada estado (igual que la tabla de la
sección 8), con icono y badge de color.

### Movimientos

Todos los movimientos de `MOVE_POOL` agrupados por tipo, con badge FIS/ESP,
poder, PP, y tooltip de efecto al hover.

**Al hacer clic en un movimiento** se abre un detalle con:
- Info completa del movimiento y su efecto
- **Lista dinámica de pokemon que pueden usarlo** — calculada cruzando
  `MOVE_POOL` con `moveLines` de cada entrada en `POKEMON_DB`. Si añades un
  movimiento nuevo a una `moveLine`, o cambias las `moveLines` de un pokemon,
  esta lista se actualiza sola, sin tocar el compendio.
- Pokemon no capturados se muestran con sprite oscuro y nombre `???`

### Objetos equipables

Todos los objetos de `HELD_ITEMS` (sección 9.5), implementado en
`_renderHeldItemList()`. Por cada objeto se muestra:
- Sprite (`item.img`, con `fallbackIcon` como respaldo si la imagen falla)
- Nombre y descripción completa (`item.desc`)
- Badge de trigger: `PASIVO` (`HELD_ITEM_TRIGGERS.PASSIVE`) o
  `INICIO DE TURNO` (`HELD_ITEM_TRIGGERS.ON_TURN_START`)
- Badge adicional `BLOQUEA MOVIMIENTO` si `item.blocksMoveChange === true`
  (p.ej. Pañuelo Elección)

Esta lista se genera dinámicamente a partir de `HELD_ITEMS` — **al añadir un
objeto nuevo siguiendo la guía de la sección 9.5, aparece automáticamente en
el compendio sin tocar `compendium-screen.js`**.

---

## 14. Animaciones de combate

### Daño / curación (floaters)

- **Daño**: `_showFloater('foe'|'player', '-40', 'dmg')` — número rojo sobre
  el sprite correspondiente. Posiciones fijas: rival `right:10%, top:15%`,
  jugador `left:15%, bottom:20%`.
- **Crítico**: `_showFloater(..., '-60!', 'crit')` — texto más grande con `!`.
- **Curación**: `_showFloater(..., '+20', 'heal')` — verde. Se dispara desde
  `updatePlayerHud`/efectos drain, calculando `currentHp` antes/después del
  efecto para el valor correcto.

### Subida de nivel — `_showLevelUpPip(pokemon, levelsGained)`

1. El pip del pokemon en el team bar se pone gris (`combat-team-pip--levelup`,
   900ms)
2. Aparece `+N` en amarillo grande centrado (`N = levelsGained` — si sube 2
   niveles de golpe, aparece `+2`)
3. Vuelve a su estado normal

**Orden crítico**: primero `_updateCombatTeamBar()` (renderiza el pip con el
nivel nuevo), LUEGO `_showLevelUpPip()` (añade la animación encima). Si se
invierte el orden, `_updateCombatTeamBar` borra el DOM de la animación.

Se usa `void pipEl.offsetWidth` (reflow forzado) antes de añadir la clase, para
que la animación CSS se reinicie si se reutiliza el mismo elemento.

### Evolución — `_showEvolutionPip(pokemon)`

Misma animación que el level up pero con el texto `¡EVOLUCIONA!` (7px para que
quepa). Se ejecuta DESPUÉS de la animación de `+N` del level up. También fuerza
reflow.

Tras `evolve()`:
- `GameState.team[idx] = evolved`
- Si `ctx.activePlayer === member` (el pokemon evolucionado era el activo en
  combate) → `ctx.activePlayer = evolved`
- `Storage.markCaught(evolved.name)` — la evolución queda registrada en la
  pokédex inmediatamente

### Derrota — `_showFaintAnimation(target)`

- **Salvaje** (`ctx.isWild && target === 'foe'`): solo `filter: grayscale(1)
  brightness(.35)` con transición, sin caída — el sprite se queda gris en su sitio
- **Entrenador / gym / jugador**: `combat-sprite--fainting` — gris oscuro +
  caída de 40px hacia abajo en 700ms, simulando los juegos originales

### Texto de combate

Se eliminó el mensaje `"X gano N exp!"` — solo se loguea en consola. El mensaje
de subida de nivel (`"X subio al nivel N!"`) se mantiene en el log de combate
en paralelo a la animación visual del pip.

### Botón de captura — pokéball giratoria

En vez de un botón con texto "CAPTURAR", se muestra un SVG pixel-art 16×16 de
una pokéball (mitad roja, mitad blanca, banda y botón central negro/blanco)
con `animation: pokeball-spin 1.4s linear infinite` — gira continuamente
mientras el botón está visible.

---

## 15. Guardas de concurrencia en combate

El motor de combate es asíncrono con múltiples `setTimeout`/`await`. Para evitar
ejecuciones dobles (turnos repetidos, `_combatEnd` duplicado, pantallas
parpadeando), existen tres flags en `GameState.combat` (`ctx`):

| Flag | Bloquea | Se resetea en |
|---|---|---|
| `ctx._turnRunning` | `_executeCombatTurn` si ya hay un turno en curso | Cada salida de turno; en `_advanceFoeOrEnd` y al hacer swap de pokemon del jugador |
| `ctx._ending` | `_combatEnd` si ya se está cerrando el combate | `_advanceFoeOrEnd` (siguiente foe) y al hacer swap de pokemon del jugador |
| `GameState._pathRunning` | `_runNextInPath` si ya hay un camino en ejecución | Camino completado, combate lanzado (`onWin`/`onLoss`), o trainer nulo |

### Validación de movimientos por turno

`_executeCombatTurn` valida que `ctx.chosenMove` pertenezca realmente a
`player.moves` (por `id`) antes de usarlo — si no, cae a `autoMove` o al primer
movimiento. `enemyChooseMove` verifica que el movimiento devuelto esté en
`enemy.moves` antes de devolverlo. Cada turno loguea:

```
[COMBAT] Turno: X usará A | Y usará B
```

para poder verificar en consola que cada pokemon usa solo sus propios movimientos.

### Renderizado tras swap/avance — evitar doble `_combatStartTurn`

`_renderCombatScreen` llama internamente a `_combatStartTurn` (con o sin
animación de intro según `ctx.introPlayed`). Por eso, tras un swap de pokemon
o avance de foe, **nunca** se debe llamar a `_combatStartTurn` manualmente
después de `_renderCombatScreen` — causaría doble ejecución del turno con
movimientos intercambiados.

---

## 16. Reset de datos guardados

Botón `🗑` fijo en `position:fixed; bottom:12px; left:12px; z-index:9999`,
añadido a `document.body` en `DOMContentLoaded` (visible en cualquier pantalla,
no solo el título — un contenedor padre con `overflow:hidden` lo ocultaría si
estuviera dentro de `#app`).

Al pulsar pide `confirm()` y, si se acepta, limpia `pkmn_pokedex` y `pkmn_evs`
de `localStorage` (`Storage._set('pokedex', {})` y `Storage._set('evs', {})`).
Muestra `✓` verde como feedback durante 1.5s.


## 17. Captura — límite de 6 pokemon en el equipo

### Comportamiento

Tanto la **captura automática** (encuentros salvajes en ruta, `autoCapture: true`)
como la **captura manual** (botón pokéball cuando `autoCapture` es falso) siguen
el mismo flujo:

1. Tirada de captura con `COMBAT_CONFIG.CATCH_RATE` (80% por defecto)
2. Si tiene éxito: `fullHeal(foe)` (cura HP, estado y combatMods — ver secciones 8/9)
   y `Storage.markCaught(foe.name)` (pokédex)
3. **Comprobación de equipo**:
   - Si `GameState.team.length < 6` → se añade directamente con `team.push(foe)`
   - Si el equipo está lleno (6/6) → se abre `_showPokemonSwapSelector(foe, onDone)`,
     el mismo modal que usan las recompensas de fin de ruta (sección 11). El
     jugador elige qué pokemon sustituir, o cancela y el capturado se descarta
     (queda capturado en la pokédex, pero no entra al equipo)

### Dónde está el código

Dos puntos en `screens.js`, ambos con la misma estructura:

```js
if (GameState.team.length < 6) {
  GameState.team.push(foe);
  await Screens._wait(800);
  Screens._advanceFoeOrEnd();
} else {
  await Screens._wait(800);
  Screens._showPokemonSwapSelector(foe, () => Screens._advanceFoeOrEnd());
}
```

- Captura automática: dentro del bloque `if (ctx.autoCapture)`
- Captura manual: dentro de `_attemptCatch(foe)`

**Si añades una nueva fuente de obtención de pokemon** (otro tipo de premio,
trade, regalo de NPC, etc.), recuerda replicar esta comprobación — `team.push()`
sin verificar `length < 6` es el bug más fácil de reintroducir.

---

## 18. Progreso del camino durante combate

### Qué se ve

Durante cualquier combate de una **ruta normal** (no gimnasio), entre el log de
combate y el área de acciones aparece una fila de bolitas — una por cada paso
del camino elegido (`GameState.currentPath`):

- **Icono de cada paso**: el mismo sprite/imagen que se mostró en la pantalla
  "Elige tu camino" — sprite del entrenador concreto (`enc.img`), `grass.png`
  para salvajes, o `❓` si la imagen falla
- **Pasos completados**: círculo verde con `✓` superpuesto, icono atenuado
- **Paso actual** (el combate en curso): círculo con borde azul claro y halo
- **Pasos pendientes**: círculo gris neutro
- Las líneas que conectan los círculos se colorean verde si el tramo ya se
  completó, gris si no

### Implementación — `_renderPathProgress()`

```js
_renderPathProgress() {
  const path = GameState.currentPath;
  if (!path || path.length === 0) return '';

  // currentEncounter se incrementa ANTES de lanzar el combate, así que durante
  // el combate del paso N, currentEncounter ya vale N+1 en términos de índice 0:
  // los pasos 0..completed-1 están hechos, "completed" es el actual
  const completed = Math.max(0, GameState.currentEncounter - 1);

  // Reutiliza los sprites resueltos en la pantalla de selección de camino
  const resolved = GameState.currentResolvedPath ?? path;

  // ...iconFor(rEnc) — misma lógica que _showPathSelection (sección 2)
}
```

### Datos necesarios en GameState

- `GameState.currentPath` — array de `{type}` del camino elegido
- `GameState.currentResolvedPath` — array paralelo con `{type, name, img}` ya
  resuelto (mismo entrenador/sprite que se mostró al elegir camino). Se guarda
  en el click handler de `_showPathSelection`:
  ```js
  GameState.currentPath         = path;
  GameState.currentResolvedPath = resolvedPaths[pi];
  ```
- `GameState.currentEncounter` — índice del encuentro actual (se incrementa
  antes de lanzar cada combate)

### Por qué NO aparece en gimnasios

```js
${(ctx.isGym || KANTO_ROUTES[GameState.routeIndex]?.gymLeader) ? '' : Screens._renderPathProgress()}
```

`ctx.isGym` cubre el combate del líder. `KANTO_ROUTES[...].gymLeader` cubre
también los combates `gym.pre` (que se lanzan con `isTrainer:true`, sin
`isGym`), porque toda la ruta pertenece a un gimnasio y no tiene un
`GameState.currentPath` significativo (el de la ruta anterior quedaría
residual en pantalla si no se ocultara explícitamente).

### CSS relevante

`.path-progress`, `.path-progress__step`, `.path-progress__step--done`,
`.path-progress__step--current`, `.path-progress__line`,
`.path-progress__line--done`, `.path-progress__check` — todo en `screens.css`.

---

## 19. UI — headers, botones atrás y pokéball

### Headers centrados con flecha

Todas las pantallas con cabecera (`pokédex`, `compendio`, selección de región,
selección de inicial, detalles) usan la misma estructura:

```html
<div class="screen-header" style="background:var(--blue)"> <!-- o var(--red), default -->
  <button class="btn btn--ghost screen-header__back" id="...">${BACK_ARROW_SVG}</button>
  <span class="screen-header__title">TÍTULO</span>
  <span class="screen-header__extra">opcional, p.ej. 151/151</span>
</div>
```

- `.screen-header` — `position:relative; justify-content:center` → el título
  queda perfectamente centrado independientemente del ancho del botón atrás
- `.screen-header__back` — `position:absolute; left:...`, **32×32px cuadrado**
  forzado con `width/height/min-width/max-width/aspect-ratio + box-sizing`,
  sin borde, sin sombra, sin hover/active (transform/background/box-shadow
  anulados explícitamente)
- `.screen-header__extra` — `position:absolute; right:...`, para contadores
  como `151/151`
- Background por defecto `var(--red)`; pásalo inline si necesitas otro color
  (compendio usa `var(--blue)`)

### BACK_ARROW_SVG

Constante definida en `render.js`, reutilizada en los 7 headers del juego:

```js
const BACK_ARROW_SVG = `<svg viewBox="0 0 24 24"><path d="M9 14 L4 9 L9 4"/><path d="M4 9 H15 A6 6 0 0 1 15 21 H11"/></svg>`;
```

Flecha curva tipo "undo", `stroke-width:2.5`, sin relleno — el color lo hereda
de `color: white` vía `stroke: currentColor`.

**Si añades una pantalla nueva con header**: usa esta misma estructura
(`.screen-header` + `.screen-header__back` con `${BACK_ARROW_SVG}` +
`.screen-header__title`) en vez de reescribir el CSS — así el botón sale
cuadrado y centrado automáticamente.

### Pokéball giratoria (botón de captura)

El botón "CAPTURAR" en combates salvajes con elección manual es un SVG circular
pixel-art que gira continuamente:

```html
<svg class="pokeball-spin" viewBox="0 0 16 16" width="22" height="22">
  <circle cx="8" cy="8" r="7.5" fill="#1A1A1A"/>           <!-- borde negro -->
  <path d="M 1 8 A 7 7 0 0 1 15 8 Z" fill="#E74C3C"/>      <!-- mitad roja -->
  <path d="M 1 8 A 7 7 0 0 0 15 8 Z" fill="#FFFFFF"/>      <!-- mitad blanca -->
  <rect x="1" y="7" width="14" height="2" fill="#1A1A1A"/> <!-- banda central -->
  <circle cx="8" cy="8" r="3"   fill="#1A1A1A"/>           <!-- botón anillo -->
  <circle cx="8" cy="8" r="1.7" fill="#FFFFFF"/>           <!-- botón núcleo -->
</svg>
```

CSS: `.pokeball-spin { animation: pokeball-spin 1.4s linear infinite; }` —
rotación continua de 360°. Sin `image-rendering:pixelated` ni
`shape-rendering:crispEdges` (los `<circle>`/`<path>` se renderizan suaves,
no escalonados). El círculo exterior negro (`r="7.5"`) actúa como borde de
contraste contra el fondo rojo del botón, ya que las mitades roja/blanca son
ligeramente más pequeñas (`r="7"`).

---

## 20. Validación de daño y efectividad de tipos

### Fórmula de daño (battle.js → calcDamage)

```
dmg = floor((((2×nivel/5 + 2) × poder × ATK) / DEF) / 50) + 2
dmg = floor(dmg × STAB × efectividad × random[0.85, 1.0])
```

Donde `ATK`/`DEF` son `stats.atk`/`stats.def` (físico) o `stats.spa`/`stats.spd`
(especial), ya multiplicados por `combatMods` (sección 9).

### Efectividad de tipos — getEffectiveness (types.js)

`TYPE_CHART[moveType][defenderType]` da `0`, `0.5`, `1` (implícito si no está
en la tabla) o `2`. Para defensores de doble tipo, los multiplicadores de
ambos tipos se multiplican entre sí:

```js
getEffectiveness('fire', ['grass','poison'])
// = TYPE_CHART.fire.grass (2) × TYPE_CHART.fire.poison (no definido → 1)
// = 2  → "Es muy eficaz!" (×2, NO ×4)
```

**Importante**: que un tipo no aparezca en `TYPE_CHART[moveType]` significa
multiplicador `1` (neutral) — no es un error ni una omisión. Por ejemplo,
Fuego vs Veneno es neutral según la tabla oficial de Pokémon, así que Fuego
vs Bulbasaur (Grass/Poison) da exactamente ×2, no ×4.

### Por qué el daño puede "parecer" desproporcionado al tipo

La fórmula pondera el **nivel del atacante** (`2×nivel/5+2`) tanto como la
efectividad de tipo. Un atacante de nivel muy superior con un movimiento
neutral puede hacer más daño absoluto que un atacante de nivel inferior con
ventaja de tipo ×2 — esto es **comportamiento correcto y esperado**, replicado
de los juegos originales. Antes de asumir un bug en el cálculo de tipos,
verifica primero la diferencia de nivel/stats entre los combatientes
calculando la fórmula manualmente con los stats reales (`computeStats`).

Casos verificados en testing:
- Bulbasaur Lv10 (SPD 21) vs Ascuas de Charmander Lv5 (SPA 12), ×2 efectividad,
  STAB ×1.5 → rango 7-9 dmg ✓
- Bulbasaur Lv10 (SPD 21) vs Ascuas de Charmander Lv11 (SPA 21), ×2 efectividad,
  STAB ×1.5 → rango 17-21 dmg ✓

Ambos coinciden exactamente con los valores observados en combate real.

---

## 21. Rutas tipo 'information' y pantalla final personalizable

### Rutas tipo 'information'

Una entrada de `ROUTE_DATA` puede marcarse con `type: 'information'` para
crear una pantalla intermedia **sin caminos ni combates**: solo título,
descripción y un botón "CONTINUAR" que avanza a la siguiente ruta de
`KANTO_ROUTES` (o a la pantalla de victoria si es la última).

```js
'info-ejemplo': {
  type: 'information',
  bg: 'assets/bg/espacio-raro.png',          // opcional — si se omite, usa un degradado verde
  title: 'Enhorabuena!',                      // opcional
  description: 'Has superado este tramo...<br>Prepárate para lo que viene.', // opcional, admite HTML
}
```

Para que aparezca, añade su `area` a `KANTO_ROUTES` en la posición donde la
quieras mostrar:

```js
var KANTO_ROUTES = [
  { name: 'Ruta 1', area: 'route-1' },
  { name: 'Información', area: 'info-ejemplo' },  // pantalla intermedia
  { name: 'Ruta 22', area: 'route-22' },
  ...
];
```

`Screens.adventure()` detecta `data.type === 'information'` y llama
directamente a `Screens._showInformation(route, data)`, saltándose por
completo `_renderAdventureShell` y `_showPathSelection`. El botón
"CONTINUAR" hace `GameState.routeIndex++` y reanuda el flujo normal
(`Screens.show(Screens.adventure)` o `Screens.victory` si era la última ruta).

Esta pantalla **no entrega premios** — para eso siguen existiendo
`rewardPokemon`/`rewardExtras` en rutas normales (sección 11), gestionados por
`_showItemReward` sin cambios.

### Pantalla final "HAS GANADO!" — FINAL_SCREEN

La pantalla `Screens.victory` (mostrada al completar la última ruta de
`KANTO_ROUTES`) ahora lee su título, subtítulo, fondo y texto del botón desde
`FINAL_SCREEN`, definido en `routes.js`:

```js
var FINAL_SCREEN = {
  title:   'HAS GANADO!',                    // opcional, por defecto 'HAS GANADO!'
  // subtitle: 'Medalla obtenida:<br><br>Boulder Badge', // opcional — si se omite, muestra la última medalla obtenida (GameState.badges)
  bg:      null,                             // opcional — p.ej. 'assets/bg/espacio-raro.png'
  btnText: 'NUEVA PARTIDA',                  // opcional
};
```

Si se omite cualquier campo (o todo el objeto `FINAL_SCREEN`), `Screens.victory`
mantiene su comportamiento original: título "HAS GANADO!", fondo amarillo por
defecto (`.screen--victory` en `css/screens.css`), subtítulo con la última
medalla y botón "NUEVA PARTIDA" que resetea el estado y vuelve a `Screens.title`.

---

## 22. Orden de logs de combate — resumen vs efectos de objetos

El log de consola `[COMBAT] <atacante> uso <movimiento> -> X dmg` se imprime
**inmediatamente después de aplicar el daño**, antes de evaluar efectos del
objeto equipado del defensor (p.ej. Baya Zidra, sección 9.5). Esto asegura que
en consola aparezca primero el resumen del golpe y después cualquier mensaje
de efecto asociado:

```
[COMBAT] Turno: Bulbasaur usará Polvo Veneno | Nidoran-m usará Aguijon Toxico
[COMBAT LOG] Bulbasaur uso Polvo Veneno!
[COMBAT] Bulbasaur uso Polvo Veneno -> 8 dmg (poco eficaz)
[COMBAT LOG] No es muy eficaz...
[COMBAT LOG] Nidoran-m uso Aguijon Toxico!
[COMBAT] Nidoran-m uso Aguijon Toxico -> 3 dmg
[COMBAT LOG] Bulbasaur comio su Baya Zidra y recupero 7 HP!
```

**Nota**: la Baya Zidra (`ON_TURN_START`, sección 9.5) siempre se evalúa
**correctamente después de aplicar el daño**, con el HP del defensor ya
actualizado — esto no ha cambiado. Solo se reordenó el `console.log` de
resumen para que el orden de la consola sea más intuitivo durante depuración;
no afecta a la lógica de combate ni al log visible en pantalla
(`[COMBAT LOG]`, vía `_updateCombatLog`).

---

## 23. Desglose de modificadores de daño en el log de combate

`calcDamage` (`battle.js`) ahora devuelve, además de `dmg`/`isCrit`/`eff`, un
array **`modifiers`** con los modificadores que afectaron al daño de ese
golpe concreto — tanto subidas/bajadas de estadística (`combatMods`, sección
9) como boosts de objetos equipados (`dmgBoost`, sección 9.5). Cada entrada
es `{ label, mult }`.

### Qué se incluye

- **Modificador de ataque del atacante** — `combatMods.atk` (movimientos
  físicos) o `combatMods.spa` (especiales), si es distinto de 0.
  Label: `"ATK <nombre> +20%"` / `"SPA <nombre> -10%"`.
- **Modificador de defensa del defensor** — `combatMods.def` (físicos) o
  `combatMods.spd` (especiales), si es distinto de 0.
  Label: `"DEF <nombre> -20%"` / `"SPD <nombre> +50%"`.
- **Boost de objeto equipado** — si `HELD_ITEMS[attacker.heldItem].dmgBoost`
  aplica a este movimiento (type/class coinciden, sección 9.5).
  Label: `"<nombre objeto> (<atacante>) +25%"`.

Solo se listan los modificadores **relevantes para este golpe concreto** —
p.ej. si el movimiento es físico, no se muestra `combatMods.spa` aunque el
atacante tenga ese modificador activo (no afecta a este cálculo).

### Dónde se muestra

- **Consola** — una línea adicional justo después del resumen `[COMBAT] ...
  -> X dmg`:
  ```
  [COMBAT] Charmander uso Ascuas -> 11 dmg
  [COMBAT] Modificadores aplicados: Carbón (Charmander) +25% (×1.25)
  ```
- **Log de combate visible** (`_updateCombatLog`) — una línea por
  modificador, mostrada tras los mensajes de "Es muy eficaz!"/"Un golpe
  crítico!" y antes de evaluar el objeto equipado del defensor:
  ```
  [COMBAT LOG] Charmander uso Ascuas!
  [COMBAT LOG] Es muy eficaz!
  [COMBAT LOG] SPA Charmander +20%
  [COMBAT LOG] Carbón (Charmander) +25%
  ```

Si no hay ningún modificador activo para ese golpe, `modifiers` es un array
vacío y no se añade ninguna línea extra al log.

---

## 24. Penalización de experiencia por diferencia de nivel

Configurable en `EXP_TABLE.EXP_PENALTY` (`exp-table.js`):

```js
EXP_PENALTY: {
  levelDiff: 2,    // diferencia de nivel a partir de la cual se aplica la penalización
  multiplier: 0.5, // multiplicador de exp aplicado si se supera levelDiff
},
```

**Regla**: si el pokemon **activo** del jugador (el que está combatiendo en
ese momento, `ctx.activePlayer`) tiene más de `levelDiff` niveles por encima
del pokemon rival derrotado, **todo el equipo** recibe
`gained = Math.round(gained * multiplier)` — es decir, con los valores por
defecto, la mitad de la experiencia que ganarían normalmente. Aplica por
igual a combates salvajes, de entrenador y de gimnasio.

### Implementación

`gainExp(pokemon, foeName, battleType, foeLevel, activeLevel)` (`pokemon.js`)
acepta un quinto parámetro `activeLevel` — el nivel del pokemon activo del
jugador en ese combate. Tras calcular `gained` con los multiplicadores
habituales (`MULTIPLIERS`, `levelMult`), si
`activeLevel - foeLevel > EXP_TABLE.EXP_PENALTY.levelDiff`, se aplica
`gained = Math.round(gained * EXP_TABLE.EXP_PENALTY.multiplier)` **antes** de
sumarlo a `pokemon.exp` — afecta tanto al pokemon activo como al resto del
equipo, ya que la comparación de nivel siempre usa el activo, no cada
miembro individualmente.

Ambos puntos donde se reparte experiencia pasan `activeLevel`:

- `screens.js` (`_combatEnd`) → `(ctx.activePlayer ?? player).level`
- `battle.js` (simulador, `runBattleSim`) → `activePlayer.level`

Si `activeLevel` se omite, por defecto vale `foeLevel` (diferencia 0 → sin
penalización), por lo que llamadas antiguas a `gainExp` sin este parámetro
siguen funcionando sin cambios de comportamiento.

### Ejemplo

Con los valores por defecto (`levelDiff: 2`, `multiplier: 0.5`):
- Activo Nv.12 vs rival Nv.10 → diferencia 2 → **sin penalización**, exp normal.
- Activo Nv.13 vs rival Nv.10 → diferencia 3 → **penalización**, exp ÷ 2 para
  todo el equipo (redondeado).

---

## 25. Pokémon Shiny

### Cómo funciona

Los Pokémon shiny tienen sprites alternativos de color diferente. El sistema
tiene dos modos de aparición:

1. **Encuentro aleatorio** — cualquier Pokémon salvaje puede aparecer shiny
   con una probabilidad configurable globalmente.
2. **Shiny forzado** — una entrada concreta del array `wild` puede marcarse
   con `shiny: true` para que ese Pokémon sea **siempre** shiny.

### SHINY_RATE — probabilidad global

Definida en `routes.js`, antes de `ROUTE_DATA`:

```js
// Probabilidad (0–1) de que un Pokémon salvaje aparezca como shiny.
// 0.001 = 1 de cada 1000 (similar a los juegos principales).
// Ponlo a 1 para que todos sean shiny (útil para testear).
var SHINY_RATE = 0.001;
```

Esta constante es la única que hay que tocar para cambiar la tasa global.
Aplica a **todos** los encuentros salvajes de **todas** las rutas.

### Cómo añadir un shiny forzado en una ruta

Añade `shiny: true` a cualquier entrada del array `wild` en `routes.js`:

```js
wild: [
  { name: POKEMON.rattata, rate: 45, minLv: 2, maxLv: 4, moveId: MOVES.normal.physical.tackle },
  { name: POKEMON.pidgey,  rate: 45, minLv: 2, maxLv: 4, moveId: MOVES.flying.physical.peck   },
  // Este Pikachu SIEMPRE aparecerá shiny, independientemente de SHINY_RATE
  { name: POKEMON.pikachu, rate: 10, minLv: 3, maxLv: 7, moveId: MOVES.electric.special.thunder_shock, shiny: true },
],
```

Cuando el sistema elige ese Pikachu por su `rate`, el flag `shiny: true`
garantiza que será shiny sin ninguna tirada de dados. Las demás entradas
sin `shiny: true` siguen sujetas a `SHINY_RATE`.

### Lógica en screens.js

En `_runNextInPath`, justo antes de crear el Pokémon salvaje:

```js
const entry   = pickWildEncounter(data.wild);
const isShiny = entry.shiny === true || Math.random() < SHINY_RATE;
const foePoke = await createPokemon(entry.name, rollLevel(entry), false, entry.moveId ?? null, entry.overrides ?? null, isShiny);
```

`entry.shiny === true` tiene prioridad sobre la tirada aleatoria.

### Sprites shiny

Los sprites se obtienen de los mismos repositorios que los normales, pero con
rutas diferentes:

| Sprite | URL |
|---|---|
| Normal (frente) | `sprites/pokemon/{id}.png` |
| Normal (espalda) | `sprites/pokemon/back/{id}.png` |
| **Shiny (frente)** | `sprites/pokemon/shiny/{id}.png` |
| **Shiny (espalda)** | `sprites/pokemon/back/shiny/{id}.png` |

Cuando PokeAPI está disponible, `api.js` extrae `data.sprites.front_shiny` y
`data.sprites.back_shiny` directamente de la respuesta. En modo fallback
(sin red), `mock-data.js` construye las URLs con el `id` local.

`createPokemon` asigna los sprites correctos automáticamente:

```js
spriteUrl:    shiny ? (apiData.sprites.front_shiny ?? apiData.sprites.front_default) : apiData.sprites.front_default,
backSpriteUrl: shiny ? (apiData.sprites.back_shiny  ?? apiData.sprites.back_default)  : apiData.sprites.back_default,
```

Si el sprite shiny no existe (fallo de red o Pokémon sin shiny en la API),
cae al sprite normal como respaldo.

### El objeto Pokémon tiene el campo `shiny`

Cualquier Pokémon creado con `createPokemon` tiene `pokemon.shiny: boolean`.
Esto permite consultarlo en cualquier parte del código:

```js
if (foePoke.shiny) { /* mostrar efecto especial */ }
```

### Indicador visual ★

Los Pokémon shiny del equipo muestran un indicador dorado `★` en dos sitios:

- **Barra de equipo** (pantalla de ruta) — junto al nombre del Pokémon
- **Pips de combate** (barra inferior durante el combate) — junto al nivel (`Nv.5 ★`)

El indicador se renderiza directamente en el HTML de `_renderTeamBar` y
`_updateCombatTeamBar` leyendo `p.shiny`.

### Captura y evolución

Al capturar un shiny, el objeto Pokémon ya tiene `shiny: true` y los sprites
correctos — no hace falta ningún paso adicional. Al capturarlo se añade
al equipo con `team.push(foe)` igual que cualquier otro.

Si un shiny evoluciona, `evolve()` pasa `pokemon.shiny` a `createPokemon`
para que la forma evolucionada conserve el color shiny y sus sprites
correspondientes:

```js
async function evolve(pokemon, intoName) {
  const newPoke = await createPokemon(intoName, pokemon.level, pokemon.isPlayer, null, null, pokemon.shiny ?? false);
  ...
}
```

### Testear shinies rápidamente

Pon `SHINY_RATE = 1` en `routes.js` para que **todos** los Pokémon salvajes
sean shiny. Recuerda volver a `0.001` (o el valor que quieras) para producción.

