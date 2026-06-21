// storage.types.ts
// Tipos de datos para el storage del juego — base para futura migración a SQL.
// Refleja la estructura exacta de los datos guardados en localStorage (prefijo pkmn_).
// No se compila — es referencia de tipos para desarrollo y planificación de BD.

// ─── Tipos base ──────────────────────────────────────────────────────────────

export type StatKey = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export interface StatBlock {
  hp:  number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export type DamageClass = 'physical' | 'special' | 'status';

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon';

export type StatusEffectId = 'poison' | 'paralysis' | 'burn' | 'sleep' | 'freeze';

export type NatureName =
  | 'hardy'  | 'lonely' | 'brave'   | 'adamant' | 'naughty'
  | 'bold'   | 'docile' | 'relaxed' | 'impish'  | 'lax'
  | 'timid'  | 'hasty'  | 'serious' | 'jolly'   | 'naive'
  | 'modest' | 'mild'   | 'quiet'   | 'bashful' | 'rash'
  | 'calm'   | 'gentle' | 'sassy'   | 'careful' | 'quirky';

// ─── Movimientos ─────────────────────────────────────────────────────────────

export interface Move {
  id:          string;        // 'ember', 'tackle', 'false-swipe'...
  name:        string;        // 'Ascuas', 'Placaje'...
  type:        PokemonType;
  damageClass: DamageClass;
  power:       number;        // 0 si es de estado
  pp:          number;
  maxPp:       number;
  stage?:      number;        // nivel mínimo de stage evolutiva para aprenderlo
  boss?:       boolean;       // exclusivo de rivales hardcodeados, no aparece en buildMoves()
  mt?:         boolean;       // fue aprendido vía MT
  effectId?:   string | string[];
  effectData?: Record<string, unknown>;
  pokemon?:    string[];      // lista de pokémon que pueden tener este movimiento
}

// ─── Estado alterado ─────────────────────────────────────────────────────────

export interface StatusEffectState {
  id:           StatusEffectId;
  turnsActive:  number;
  totalTurns?:  number;  // sleep: cuántos turnos duerme en total
}

// ─── Modificadores de stat en combate ────────────────────────────────────────
// combatMods son multiplicadores aditivos sobre el stat base.
// ATK efectivo = stats.atk × (1 + combatMods.atk)
// Se resetean al empezar cada ruta nueva.

export type CombatMods = Partial<StatBlock> & {
  _burnAtk?:   number;  // flag interno para revertir debuff de quemadura
  _freezeSpa?: number;  // flag interno para revertir debuff de congelación
};

// ─── Pokémon (serializado en pkmn_run) ───────────────────────────────────────

export interface SerializedPokemon {
  id:           number;
  name:         string;           // 'bulbasaur', 'pikachu'... (clave en POKEMON_DB)
  displayName:  string;           // nombre para mostrar ('Bulbasaur')
  types:        PokemonType[];
  baseStats:    StatBlock;
  ivs:          StatBlock;        // por defecto todos a 31
  evs:          StatBlock;        // por defecto todos a 0, máx 32 por stat
  nature:       NatureName;
  level:        number;
  moveLevel:    number;           // stage evolutiva: 0 = base, 1 = inter., 2 = final
  exp:          number;
  expToNext:    number;
  moves:        Move[];
  autoMovePool: string[] | null;  // IDs de moves disponibles para autoMove
  autoMove:     string | null;    // ID del move activo en modo automático
  isPlayer:     boolean;
  shiny:        boolean;
  spriteUrl:    string;
  backSpriteUrl: string;
  stats:        StatBlock;        // computados: baseStats + IVs + EVs + nature
  currentHp:    number;
  combatMods:   CombatMods;
  heldItem:     string | null;    // 'sitrus-berry', 'carbon'... (clave en HELD_ITEMS)
  learnedMTs:   string[];         // IDs de MTs aprendidas ('earthquake', 'ice-beam'...)
  statusEffect?: StatusEffectState;
}

// ─── Pokédex ─────────────────────────────────────────────────────────────────

export interface PokedexEntry {
  seen?:   boolean;
  caught?: boolean;
  shiny?:  boolean;  // true si alguna vez se capturó un shiny de esta especie
}

// ─── Medallas (BADGE_LIST) ───────────────────────────────────────────────────

export interface BadgeEntry {
  id:     string;   // 'boulder-badge', 'cascade-badge'...
  name:   string;   // 'Medalla Roca'
  desc:   string;
  gym:    string;   // 'Ciudad Plateada'
  leader: string;   // 'Brock'
  type:   string;   // tipo del gimnasio (informativo)
  img:    string;   // ruta al sprite
}

// ─── Claves de localStorage ──────────────────────────────────────────────────

export const STORAGE_KEYS = {
  pokedex: 'pkmn_pokedex',
  evs:     'pkmn_evs',
  mts:     'pkmn_mts',
  badges:  'pkmn_badges',
  run:     'pkmn_run',
  version: 'pkmn_version',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// ─── Dominios de storage ─────────────────────────────────────────────────────

/** pkmn_pokedex — estado visto/capturado de cada pokémon (por nombre) */
export type PokedexStorage = Record<string, PokedexEntry>;

/** pkmn_evs — EVs acumulados, indexados por raíz de cadena evolutiva
 *  bulbasaur/ivysaur/venusaur comparten la misma entrada bajo 'bulbasaur' */
export type EvStorage = Record<string, StatBlock>;

/** pkmn_mts — MTs aprendidas por raíz de cadena evolutiva
 *  { 'bulbasaur': ['earthquake', 'ice-beam'] } */
export type MtStorage = Record<string, string[]>;

/** pkmn_badges — medallas obtenidas por raíz de cadena evolutiva
 *  { 'bulbasaur': ['boulder-badge', 'cascade-badge'] } */
export type BadgeStorage = Record<string, string[]>;

/** pkmn_run — estado de la partida en curso */
export interface RunState {
  version:     string;
  routeIndex:  number;
  starterName: string;
  team:        SerializedPokemon[];
  badges:      string[];   // IDs de medallas obtenidas en esta run (p.ej. GameState.badges)
  items:       string[];   // IDs de objetos del jugador (consumibles, etc.)
}

// ─── Esquema completo ────────────────────────────────────────────────────────

export interface StorageSchema {
  'pkmn_pokedex': PokedexStorage;
  'pkmn_evs':     EvStorage;
  'pkmn_mts':     MtStorage;
  'pkmn_badges':  BadgeStorage;
  'pkmn_run':     RunState;
  'pkmn_version': string;
}

// ─── Notas para migración SQL ────────────────────────────────────────────────
//
// Cada dominio mapea a una o varias tablas relacionales:
//
// TABLE pokedex  (user_id, pokemon_name VARCHAR, seen BOOL, caught BOOL, shiny BOOL)
//   PK: (user_id, pokemon_name)
//
// TABLE evs      (user_id, evolution_root VARCHAR, hp INT, atk INT, def INT,
//                 spa INT, spd INT, spe INT)
//   PK: (user_id, evolution_root)
//   Constraint: cada stat <= 32 (EV_MAX_PER_STAT)
//
// TABLE mts      (user_id, evolution_root VARCHAR, move_id VARCHAR)
//   PK: (user_id, evolution_root, move_id)
//
// TABLE badges   (user_id, evolution_root VARCHAR, badge_id VARCHAR)
//   PK: (user_id, evolution_root, badge_id)
//
// TABLE runs     (run_id UUID PK, user_id, version VARCHAR, route_index INT,
//                 starter_name VARCHAR, badges JSON, items JSON, created_at TIMESTAMP)
//
// TABLE run_team (run_id UUID FK→runs, slot INT, pokemon_name VARCHAR,
//                 level INT, current_hp INT, held_item VARCHAR,
//                 moves JSON, evs JSON, ivs JSON, combat_mods JSON,
//                 status_effect JSON, shiny BOOL, ...)
//   PK: (run_id, slot)
//   Alternativa: normalizar moves/evs/ivs a tablas propias si se necesita consultar
