/**
 * @typedef {{ tackle: string, extreme_speed: string, hyper_fang: string, take_down: string, self_destruct: string, false_swipe: string }} NormalPhysical
 * @typedef {{ swift: string, hyper_voice: string, boomburst: string, tri_attack: string }} NormalSpecial
 * @typedef {{ flame_wheel: string, fire_fang: string, flare_blitz: string }} FirePhysical
 * @typedef {{ ember: string, flamethrower: string, fire_blast: string }} FireSpecial
 * @typedef {{ waterfall: string, crabhammer: string, wave_crash: string }} WaterPhysical
 * @typedef {{ water_gun: string, surf: string, hydro_pump: string, bubble_beam: string, scald: string }} WaterSpecial
 * @typedef {{ vine_whip: string, razor_leaf: string, wood_hammer: string }} GrassPhysical
 * @typedef {{ absorb: string, magical_leaf: string, solar_beam: string, giga_drain: string }} GrassSpecial
 * @typedef {{ thunder_punch: string, wild_charge: string, volt_tackle: string }} ElectricPhysical
 * @typedef {{ thunder_shock: string, thunderbolt: string, thunder: string }} ElectricSpecial
 * @typedef {{ ice_punch: string, ice_fang: string, icicle_crash: string }} IcePhysical
 * @typedef {{ powder_snow: string, ice_beam: string, blizzard: string, icy_wind: string }} IceSpecial
 * @typedef {{ karate_chop: string, brick_break: string, close_combat: string }} FightingPhysical
 * @typedef {{ vacuum_wave: string, aura_sphere: string, focus_blast: string }} FightingSpecial
 * @typedef {{ poison_sting: string, poison_jab: string, gunk_shot: string }} PoisonPhysical
 * @typedef {{ poison_powder: string, sludge_bomb: string, sludge_wave: string }} PoisonSpecial
 * @typedef {{ bulldoze: string, stomping_tantrum: string, earthquake: string }} GroundPhysical
 * @typedef {{ mud_shot: string, earth_power: string, sandsear_storm: string }} GroundSpecial
 * @typedef {{ peck: string, wing_attack: string, brave_bird: string }} FlyingPhysical
 * @typedef {{ gust: string, air_slash: string, hurricane: string }} FlyingSpecial
 * @typedef {{ zen_headbutt: string, psycho_cut: string, photo_geyser: string }} PsychicPhysical
 * @typedef {{ confusion: string, psychic: string, psystrike: string, teleport: string, trick: string }} PsychicSpecial
 * @typedef {{ bug_bite: string, x_scissor: string, megahorn: string }} BugPhysical
 * @typedef {{ infestation: string, signal_beam: string, bug_buzz: string }} BugSpecial
 * @typedef {{ rock_throw: string, rock_slide: string, stone_edge: string }} RockPhysical
 * @typedef {{ power_gem: string, tar_shot: string, meteor_beam: string }} RockSpecial
 * @typedef {{ shadow_sneak: string, shadow_claw: string, phantom_force: string }} GhostPhysical
 * @typedef {{ hex: string, shadow_ball: string, astral_barrage: string, night_shade: string }} GhostSpecial
 * @typedef {{ dragon_tail: string, dragon_claw: string, outrage: string }} DragonPhysical
 * @typedef {{ dragon_rage: string, dragon_pulse: string, draco_meteor: string }} DragonSpecial
 * @typedef {{ bite: string, crunch: string, wicked_blow: string }} DarkPhysical
 * @typedef {{ feint_attack: string, dark_pulse: string, fiery_wrath: string }} DarkSpecial
 * @typedef {{ metal_claw: string, iron_head: string, behemoth_blade: string }} SteelPhysical
 * @typedef {{ mirror_shot: string, flash_cannon: string, steel_beam: string }} SteelSpecial
 * @typedef {{ fairy_wind: string, play_rough: string, tectonic_rage: string }} FairyPhysical
 * @typedef {{ disarming_voice: string, moonblast: string, sparkling_aria: string }} FairySpecial
 */

/**
 * @typedef {{
 *   normal:   { physical: NormalPhysical,   special: NormalSpecial   },
 *   fire:     { physical: FirePhysical,      special: FireSpecial     },
 *   water:    { physical: WaterPhysical,     special: WaterSpecial    },
 *   grass:    { physical: GrassPhysical,     special: GrassSpecial    },
 *   electric: { physical: ElectricPhysical,  special: ElectricSpecial },
 *   ice:      { physical: IcePhysical,       special: IceSpecial      },
 *   fighting: { physical: FightingPhysical,  special: FightingSpecial },
 *   poison:   { physical: PoisonPhysical,    special: PoisonSpecial   },
 *   ground:   { physical: GroundPhysical,    special: GroundSpecial   },
 *   flying:   { physical: FlyingPhysical,    special: FlyingSpecial   },
 *   psychic:  { physical: PsychicPhysical,   special: PsychicSpecial  },
 *   bug:      { physical: BugPhysical,       special: BugSpecial      },
 *   rock:     { physical: RockPhysical,      special: RockSpecial     },
 *   ghost:    { physical: GhostPhysical,     special: GhostSpecial    },
 *   dragon:   { physical: DragonPhysical,    special: DragonSpecial   },
 *   dark:     { physical: DarkPhysical,      special: DarkSpecial     },
 *   steel:    { physical: SteelPhysical,     special: SteelSpecial    },
 *   fairy:    { physical: FairyPhysical,     special: FairySpecial    }
 * }} MoveList
 */
