const modlist = {
  "2950902979": {
    name: "Equipment UI - Paper Doll Equipment Interface - CONTROLLER SUPPORTED!",
    mod: "EQUIPMENT_UI",
    category: "Interface"
  },
  // "2982070344": {
  //   name: "Inventory Tetris - Grid Based Inventory Overhaul [BETA 5]",
  //   mod: "INVENTORY_TETRIS",
  //   dependencies: ["2950902979"],
  //   category: "Interface"
  // },
  "2801575579": {
    name: "More Brews",
    mod: ["MoreBrews", "MoreBrewsWineMeUp"],
    category: "Crafting"
  },
  "2169435993": {
    name: "Mod Options (Build 41)",
    mod: "modoptions",
    category: "Dependencies"
  },
  "2619072426": {
    name: "Weapon Condition Indicator",
    mod: "TheStar",
    category: "Interface"
  },
  "2875848298": {
    name: "Braven's Common Sense",
    mod: "BB_CommonSense",
    category: "Immersion"
  },
  "2904920097": {
    name: "Fancy Handwork",
    mod: "FancyHandwork",
    category: "Animations",
  },
  "2688851521": {
    name: "Buffy's Role Play Chat",
    mod: "roleplaychat",
    disableCheatModes: ["12"],
    category: "Multiplayer"
  },
  "2755000912": {
    name: "buffy's character bios",
    mod: "CharacterBio",
    category: "Multiplayer"
  },
  "2688676019": {
    name: "Chat Bubble v0.6",
    mod: "ChatBubble",
    category: "Multiplayer"
  },
  "3321118178": {
    name: "Give Item",
    mod:"give-item",
    category: "Multiplayer"
  },
  "3334381671": {
    name: "Siphoning Needs Hoses",
    mod: "SiphoningNeedsHoses",
    category: "Vehicles"
  },
  "3033192177": {
    name: "Realistic Ballistics",
    mod: "realistic_ballistics",
    category: "Guns and ammo"
  },
  "2808679062": {
    category: "Interface",
    mod: "VISIBLE_BACKPACK_BACKGROUND",
    name: "Backpack Borders"
  },
  "2503622437": {
    category: "QOL",
    mod: "SkillRecoveryJournal",
    name: "Skill Recovery Journal"
  },
  "2901552077": {
    category: "Immersion",
    mod: "mrnvsbhltr",
    name: "Visible Holster"
  },
  "2544353492": {
    name: "Has Been Read",
    mod: "P4HasBeenRead",
    category: "Interface"
  },
  "3056538624": {
    name: "Obvious Collecting",
    mod: "BB_Foraging",
    category: "Immersion"
  },
  "2732662310": {
    name: "Improved Hair Menu",
    mod: "improvedhairmenu",
    category: "Interface"
  },
  "3071370537": {
    name: "Working HVAC",
    mod: "AirCond",
    category: "Crafting"
  },
  "2991351207": {
    name: "Hide",
    mod: "BB_Hide",
    category: "Controls"
  },
  "3078291265": {
    name: "Gunslinger's Redemption (Gun Sewerslide)",
    mod: "GRGV",
    category: "Immersion"
  },
  "3055029361": {
    name: "Working Seatbelt",
    category: "Vehicles",
    mod: "WorkingSeatbelt"
  },
  "3048123717": {
    name: "Real Knockouts",
    category: "Health and Damage",
    mod: "RealKnockouts"
  },
  "3007922923": {
    name: "Proper Vehicle Injuries for MP",
    mod: "ProperVehicleInjuriesMP",
    category: "Multiplayer"
  },
  "2944740659": {
    name: "Handcuffs",
    mod: "Cuffs",
    category: "Immersion"
  },
  "2690460338": {
    name: "Prisonner",
    mod: "Prisonner",
    category: "Immersion",
    dependencies: ["2169435993"]
  },
  "2873010748": {
    name: "Search Players For Weapons",
    mod: "SearchPlayersForWeapons",
    category: "Multiplayer"
  },
  "2934985376": {
    name: "Open Ammo Boxes While Walking",
    mod: "VFEOpenAmmoWalk",
    category: "QOL"
  },

  "2822286426": {
    name: "RV Interiors",
    mod: "RV_Interior_MP",
    map_folder: "vehicle_interior",
    dependencies: ["1510950729", "2282429356"],
    category: "Vehicles",
    disableCheatModes: ["12", "2"]
  },
  "1510950729": {
    name: "Filibuster Rhymes' Used Cars!",
    mod: ["FRUsedCars", "FRUsedCarsFT", "FRUsedCarsNRN"],
    category: "Vehicles"
  },
  "2282429356": {
    name: "Autotsar Trailers",
    mod: "autotsartrailers",
    category: "Vehicles",
    dependencies: ["2392709985"]
  },
  "2004998206": {
    name: "Mininmal Display Bars",
    mod: "MinimalDisplayBars",
    category: "Interface",
    conflicts: ["2002451312"]
  },
  "2487022075": {
    name: "True Actions - Sitting And Lying",
    mod: "TMC_TrueActions",
    category: "Animations",
    disableCheatModes: ["12"],
    dependencies: ["2392709985"]
  },
  "2975204120": {
    name: "Nepenthe's Colored Engine Status",
    category: "Interface",
    mod: "NepEngineColor" 
  },
  "2973053380": {
    name: "Nepenthe's Colored Battery Status",
    category: "Interface",
    mod: "NepBatteryColor"
  },
  "3013901070": {
    name: "Trip And Fall",
    mod: "TripAndFall",
    category: "Immersion"
  },
  "2648779556": {
    mod: "TrueActionsDancing",
    name: "True Actions - Dancing",
    category: "Animations"
  },
  "2966176354" : {
    name: "True Crouching",
    category: "Controls",
    mod: "TrueCrouching"
  },
  "2704811006": {
    mod: "snowiswater",
    category: "Immersion",
    name: "Snow is water [MP Working - v1.3.1]",
  },
  "2478768005": {
    name: "ZuperCart - Carts & Trolleys",
    category: "Immersion",
    mod: "TMC_Trolley"
  },
  "3008448748": {
    name: "True Crawling",
    category: "Controls",
    mod: "TrueCrawl"
  },
  "2921029369" : {
    name: "Skizot's Carryable Everything",
    mod: "Skizots Visible Boxes and Garbage2",
    category: "Immersion"
  },
  "2026976958": {
    name: "Smoker",
    mod: "Smoker",
    category: "Crafting"
  },
  "1703604612": {
    name: "Jigga's Green Fire Mod",
    mod: "jiggasAddictionMod",
    category: "Crafting"
  },
  "2885501709": {
    mod: "UdderlySafeLogin",
    name: "Udderly Safe Login",
    category: "Multiplayer"
  },
  // "3232993626": {
  //   mod: "SafeUserLogin",
  //   name: "Safe User Login",
  //   category: "Multiplayer"
  // },
  "2921642476": {
    name: "Injury Indicator",
    mod: "InjuryIndicator",
    category: "Interface"
  },
  "2696083206": {
    name: "Wring Out Clothing",
    mod: "wringclothes",
    category: "Immersion"
  },
  "2864231031": {
    mod: "SlowConsumption",
    category: "QOL",
    name: "Slow Consumption"
  },
  "2850135071": {
    mod: "BB_Utils",
    name: "Braven's Utilities",
    category: "Dependencies"
  },
  "2988491347": {
    mod: "BB_Bicycles",
    name: "Braven's Bicycles",
    category: "Vehicles"
  },
  "2616986064": {
    name: "Fuel Side Indicator",
    mod: "fuelsideindicator",
    category: "Vehicles"
  },
  "3175484316": {
    mod: "StaIte",
    name: "Standing Items 1.15 : Polished erection (of items)",
    category: "Immersion"
  },
  "2658619264": {
    name: "Scrap Armor",
    mod: "ScrapArmor(new version)",
    category: "Equipment",
    dependencies: ["2680473910"]
  },
  "2122265954": {
    name: "Scrap Weapons",
    mod: "ScrapWeapons(new version)",
    category: "Equipment",
    dependencies: ["2680473910"]
  },
  "2997342681": {
    name: "Lifestyle: Hobbies",
    mod: "Lifestyle",
    category: "Immersion"
  },
  "2876610875": {
    name: "Fuu's Roleplay Poses",
    mod: "RPActions",
    category: "Animations"
  },
  "2680473910": {
    name: "The Workshop",
    mod: "TheWorkshop(new version)",
    category: "Dependencies"
  },
  "2972289937": {
    name: "Visible Generator Range",
    category: "Interface",
    mod: "GenRange"
  },
  "2936196344": {
    name: "Take A Bath",
    mod: "fol_Take_A_Bath",
    category: "Immersion",
    dependencies: ["2169435993"]
  },
  "2985394645": {
    name: "Take Any Amount",
    category: "Interface",
    mod: "TakeAnyAmount"
  },
  "2920899878": {
    mod: "ReloadAllMagazines",
    name: "Load All Magazines",
    category: "Interface"
  },
  "2447729538": {
    name: "Fluffy Hair",
    category: "Appearance",
    mod: "FH"
  },
  "2463184726": {
    name: "Spongie's Hair Pack",
    category: "Appearance",
    mod: "SpnHair"
  },
  "3334304760": {
    name: "Vehicle Spawn Edits for Filibuster Rhymes' Used Cars",
    mod: "VSE-FR",
    category: "Vehicles",
  },
  "3315561157": {
    name: "Filibuster Rhymes' Used Cars! - Animation Beta",
    mod: "FRUsedCarsBeta",
    category: "Animations"
  },
  "3018929461": {
    name: "Grab and Drop",
    mod: "BION_DropBags",
    category: "Interface"
  },
  "3281755175": {
    name: "Vanilla Vehicles Animated",
    mod: "VanillaVehiclesAnimated",
    category: "Animations"
  },
  "2667899942": {
    name: "Vanilla Firearms Expanded",
    mod: "VFExpansion1",
    category: "Guns and ammo"
  },
  "2688809268": {
    name: "TC Cache MP",
    mod: "TsarcraftCache2",
    category: "Dependencies"
  },
  "2613146550" : {
    mod: "truemusic",
    category: "Immersion",
    name: "True Music",
    dependencies: ["2688809268", "2392709985"]
  },
  "3118990099" : {
    mod: "TrueMusicJukebox",
    category: "Immersion",
    name: "True Music Jukebox",
    dependencies: ["2688809268", "2392709985", "2613146550"]
  },
  "2939590929": {
    mod: "1962_to_1993_music_collection",
    category: "Immersion",
    name: "True Music Addon: 1909 To 1993 Music Collection Mod",
    dependencies: ["2613146550", "2392709985"]
    // - Mod load order should be in this order: Every single other mod first
    // (Cars, Weapons, Clothing, QoL stuff etc etc) and then True Music, then This 
    // Mod And lastly Tsar's Music Library in that exact order.
  },
  "3333627180": {
    mod: "GATA_Quail_Mod",
    category: "Immersion",
    name: "Quails and Quail Accessories"
  },
  "2799742455": {
    name: "Improvised Silencers by Maxwell218",
    mod: "ImprovisedSilencersVFEPatch",
    category: "Guns and ammo",
    lastInCategory: true
  },
  "2398274461": {
    name: "Save Our Station",
    mod: ["SaveOurStation_Core", "SaveOurStation_KnoxCountry"],
    category: "Maps"
    map_folder: "SaveOurStation_KnoxCountry_World",
  },
  "2959512313": {
    name: "Syncing vehicle animations",
    mod: "AnimSync",
    category: "Animations"
  },
  "2761200458": {
    mod: ["YakiHS", "YakiHSBasegameTexture"],
    name: "Yaki's Hair Salon",
    category: "Appearance"
  },
  "2456540487": {
    name: "Harry's Hair",
    mod:  "HHair",
    category: "Appearance"
  },
  "2392709985": {
    name: "Tsar's Common Library",
    mod: "tsarslib",
    category: "Dependencies"
  },
  "3304580957": {
    name: "Standardized Vehicle Upgrades 3 - Core",
    mod: "StandardizedVehicleUpgrades3Core",
    category: "Vehicles",
    dependencies: ['2392709985']
  },
  "2769706949": {
    name: "Tidy Up Meister",
    mod: "P4TidyUpMeister",
    category: "QOL"
  },
  "2760742937": {
    mod: "WorkingMasks",
    name: "Working Masks",
    category: "Immersion"
  },
  "2883633728": {
    name: "I Might Need A Lighter",
    mod: "IMightNeedALighter",
    category: "Immersion"
  },
  "2237300246": {
    name: "NRK Need Light To Read",
    mod: "NRK_NeedLightToRead",
    category: "Immersion"
  },
  "2762648316": {
    name: "Steam Powered Generator",
    mod: "SteamPoweredGenerator",
    category: "Crafting"
  },
  "1542069453": {
    mod: "Torch",
    category: "Crafting",
    name: "Torch"
  },
  "2849467715": {
    mod: "WaterGoesBad",
    category: "Immersion",
    name: "Water Goes Bad"
  },
  "2908846234": {
    mod: "FBR",
    category: "Immersion",
    name: "Fire Damage Rebalance"
  },
  "2950608437": {
    name: "Entertain Yourself",
    category: "Immersion",
    mod: "EntertainYourself"
  },
  "2207282444": {
    name: "Authentic Animations",
    mod: "AuthenticAnimations",
    category: "Animations"
  },
  "2757712197": {
    name: "Vehicle Repair Overhaul",
    mod: "VehicleRepairOverhaul",
    category: "Vehicles",
    lastInCategory: true
  },
  "2897228813": {
    name: "Role Play Descriptors",
    mod: "RPDescriptors",
    category: "Multiplayer"
  },
  "1539281445": {
    mod: "CrashedCarsMod",
    name: "Crashed Cars",
    category: "Vehicles"
  },
  "3300609985": {
    mod: "TWDAxemanMod",
    name: "The Axeman: Helmet & Axe",
    category: "Equipment"
  },
  "2241990680": {
    mod: "TowingCar",
    name: "Better Towing",
    category: "Vehicles"
  },
  "2725360009": {
    name: "Boredom Tweaks",
    category: "QOL",
    mod: "BoredomTweaks",
  },
  "2282429356": {
    name: "Autotsar Trailers",
    mod: "autotsartrailers",
    category: "Vehicles"
  },
  "1539281445": {
    mod: "CrashedCarsMod",
    name: "Crashed Cars Mod",
    category: "Vehicles"
  },
  "2712632417": {
    mod: "VPR_VehicleSpareParts",
    name: "Viperel's Vehicle Spare Parts",
    category: "Vehicles"
  },
  "2713055926": {
    mod: "VPR_RecyclingCenter",
    name: "Viperel's Recycling Center",
    category: "QOL"
  },
  "566115016": {
    name: "Item Tweaker API - Still works in Build 41.78",
    mod: "ItemTweakerAPI",
    category: "Dependencies"
  },
  "2810800927": {
    name: "ItemTweaker Extra Clothing Option Addon",
    mod: "ItemTweakerAPIExtraClothingAddon",
    category: "Dependencies",
    dependencies: ["566115016"]
  },
  "3331641213": {
    name: "Untucked Shirts",
    mod: "UntuckedShirts",
    category: "Clothing and Armor"
  },
  "2460154811": {
    name: "Brita's Armor Pack",
    mod: "Brita_2",
    category: "Clothing and Armor"
  },
  "2874678809": {
    name: "Lingering Whispers",
    mod: "Lingering Voices",
    category: "Zombie Behavior"
  },
  "2840805724": {
    name: "Simple Overhaul: Traits and Occupations (SOTO)",
    mod: "SimpleOverhaulTraitsAndOccupations",
    category: "Traits",
    conflicts: ["2792245343", "1299328280", "2459400130", "2856961307", "2729436580"]
  },
  "2458631365": {
    mod: "ExpandedHelicopterEvents",
    name: "Expanded Helicopter Events",
    category: "Immersion",
    dependencies: ["2529746725"]
  },
  "3118159023" : {
    name: "Plumbing",
    mod: "Plumbing",
    category: "Crafting"
  },
  "2787291513" : {
    mod: "CraftHelperContinued",
    category: "Crafting",
    name: "Craft Helper"
  },
  "2529746725": {
    name: "Easy Config Chucked",
    mod: "EasyConfigChucked",
    category: "Dependencies",
    dependencies: ["2896041179"]
  },
  "2896041179": {
    category: "Dependencies",
    name: "Error Magnifier",
    mod: "errorMagnifier"
  },
  "2832136889" : {
    name: "Sapph's Cooking [41.78+]",
    mod: "sapphcooking",
    category: "Food and Water"
  },
  "3042138819": {
    name: "Functional Appliances",
    mod: "FunctionalAppliances2",
    category: "Immersion",
    disableCheatModes: ["21"]
  },
  "2986578314": {
    category: "Dependencies",
    name: "TchernoLib",
    mod: "TchernoLib"
  },
  "2711057211": {
    name: "Clean Dirt",
    mod: "CleanDirt",
    category: "Immersion"
  },
  "2854030563": {
    name: "Moodle Quarters",
    mod: "moodle_quarters",
    category: "Interface"
  },
  "2859296947": {
    category: "Dependencies",
    name: "Moodle Framework",
    mod: "MoodleFramework"
  },
  "3309467743": {
    name: "HarvestZ's Cannibalism",
    mod: "HarvestZCannibalism",
    category: "Food and Water"
    dependencies: ["2859296947"]
  },
  "2871038554": {
    name: "Break Into Tears",
    mod: "BreakIntoTears",
    category: "Immersion",
  },
  "3000924731": {
    name: "Immersive Lore",
    mod: "ImmersiveLore",
    category: "Immersion"
  },
  "3002239837": {
    name: "Change Rope Climbing Direction",
    mod: "SheetRopeClimbingJumping",
    category: "Controls"
  },
  "2998815983": {
    name: "Jump",
    mod: "Jump",
    category: "Controls"
  },
  "2908614026": {
    name: "Stop, Drop 'n Roll (the 'Fire Self-Extinguish' Mod)!",
    mod: "DropRollMod",
    category: "Immersion"
  },
  "2954422590": {
    name: "Under Cover Of Darkness",
    mod: "UnderCoverOfDarkness",
    category: "Zombie Behavior",
  },
  "2903127760" : {
    name: "Essential Crafting",
    mod: "EssentialCrafting",
    category: "Crafting"
  },
  "2955282161": {
    name: "Hypothermia Kills",
    mod: "HypothermiaKillsHard",
    category: "Immersion"
  },
  "2815560151": {
    mod: "BLTAnnotations",
    name: "Share Annotations",
    category: "Multiplayer"
  },
  "2445720450": {
    name: "Playable Arcade Machines",
    mod: "PlayableArcadeMachines41",
    category: "Immersion"
  },
  "2946221823": {
    category: "Interface",
    name: "Nested Containers",
    mod: "NestedContainer01"
  },
  "2944344655": {
    name: "Replace Bandage",
    mod: "Replace Bandage",
    category: "QOL"
  },
  "2975848784": {
    name: "Enhanced Environment",
    mod: "PictureThis",
    category: "Crafting"
  },
  "2640351732": {
    name: "Spear Traps",
    mod: "SpearTraps",
    category: "Crafting"
  },
  "2913137598": {
    name: "Barricade Hurt Zombies",
    mod: "BarricadeHurtZombies",
    category: "Immersion"
  },
  "2963511042": {
    name: "Serving Plates",
    mod: "ServingPlates",
    category: "Food and Water"
  },
  "2863949128": {
    name: "Canteens And Bottles",
    mod: "CanteensAndBottles",
    category: "Food and Water"
  },
  "2969455858": {
    name: "Target Square On Load Commands",
    mod: "TargetSquareOnLoad",
    category: "Dependencies"
  },
  "2857548524": {
    name: "Immersive Solar Arrays",
    mod: "ISA_41",
    category: "Crafting"
  },
  "2962908954": {
    category: "Appearance",
    mod: "Tariq's Beards",
    name: "Tariq's Beards"
  },
  "3028261329": {
    name: "First Aid Overhaul",
    mod: "BB_FirstAidOverhaul_Alt",
    category: "Health and Damage"
  },
  "2890748284": {
    name: "Food Preservation Plus",
    mod: "FoodPreservationPlus",
    category: "Food and Water"
  },
  "2891494114": {
    name: "Herbal Medicine Plus",
    mod: "HerbalMedicinePlus",
    category: "Health and Damage"
  },
  "2900671939": {
    name: "Real Metalworking",
    mod: "RealMetalworking",
    category: "Crafting"
  },
  "2870742794": {
    name: "Tools of The Trade",
    mod: "ToolsOfTheTrade",
    category: "Equipment"
  },
  "2899681016": {
    name: "Hard Farming",
    mod: "HardFarming",
    category: "Immersion"
  },
  "2553809727": {
    name: "Kill Count",
    mod: "KillCount",
    category: "Interface"
  },
  "2737665235": {
    name: "Ladders?!",
    mod: "Ladders",
    category: "Controls"
  },
  "2852704777": {
    name: "Simon MDs Tiles",
    mod: "simonMDsTiles",
    category: "Dependencies"
  },
  "2925574774": {
    name: "Cookie Tile Pack",
    mod: "Cookie_Tiles",
    category: "Dependencies"
  },
  "2844829195": {
    name: "Oujinjin's Tiles",
    mod: "OujinjinTiles",
    category: "Dependencies"
  },
  "2337452747": {
    name: "Daddy Dirkie dirks tiles",
    mod: "Diederiks Tile Palooza",
    category: "Dependencies"
  },
  "2554699200": {
    name: "Fantasiado's More Street Details",
    mod: "FantaStreetTiles_01",
    category: "Dependencies"
  },
  "2384329562": {
    name: "throttlekitty's tiles",
    mod: "tkTiles_01",
    category: "Dependencies"
  },
  "2802755864": {
    name: "Trimble County Power Station & La Grange",
    mod: "TrimbleCountyPowerStation",
    map_folder: "TrimbleCountyPowerStation",
    category: "Maps",
    dependencies: ["2852704777", "2925574774", "2844829195", "2337452747", "2554699200", "2384329562"]
  },
  "3067798182": {
    name: "Building Menu",
    mod: "BuildingMenu",
    category: "Crafting"
  },
  "1960513900": {
    name: "Fast Reading IWBUMS",
    mod: "fastReadingIWBUMS",
    category: "QOL"
  },
  "2831786301": {
    name: "Video Game Consoles",
    mod: "Video_Game_Consoles",
    category: "Immersion"
  },
  "2445720450": {
    name: "Playable Arcade Machines for 41",
    mod: "PlayableArcadeMachines41",
    category: "Immersion"
  },
  "2599752664": {
    name: "Dylan's Tile Pack",
    mod: "DylansTiles",
    category: "Dependencies"
  },
  "3170914649": {
    name: "McAlpine Locks and Dam",
    mod: "mcalpine locks and dam",
    map_folder: "McAlpine Locks and Dam"
  },
  "2542249811": {
    mod: "LittleTownship",
    name: "Little Township",
    map_folder: "LittleTownship",
    category: "Maps"
  },
  "2840889213": {
    mod: "Chestown",
    map_folder: "Chestown",
    category: "Maps",
    name: "Chestown"
  },
  "3183799205": {
    name: "Pineville",
    mod: "pineville",
    category: "Maps",
    map_folder: "pineville"
  },
  "2536865912": {
    mod: "Blackwood",
    name: "Blackwood",
    category: "Maps",
    map_folder: "Blackwood"
  },
  "2726058465": {
    mod: "Refordville",
    name: "Refordville",
    map_folder: "Refordville",
    category: "Maps"
  },
  "3023118310": {
    mod: "rationcards",
    name: "Ration Card",
    category: "Immersion"
  }

}

// Helper function to resolve dependencies and order mods
function resolveDependencies(modlist) {
  const resolved = [];
  const unresolved = new Set();

  function resolve(modID) {
    if (resolved.includes(modID)) {
      return;
    }

    const mod = modlist[modID];
    if (!mod) {
      console.warn(`Mod ID ${modID} not found in modlist.`);
      return;
    }

    unresolved.add(modID);

    // Check for dependencies and resolve them first
    if (mod.dependencies) {
      mod.dependencies.forEach(depID => {
        if (!resolved.includes(depID)) {
          if (unresolved.has(depID)) {
            console.warn(`Circular dependency detected: ${modID} -> ${depID}`);
          } else {
            resolve(depID);
          }
        }
      });
    }

    // After resolving dependencies, add the current mod
    resolved.push(modID);
    unresolved.delete(modID);
  }

  // Iterate over all mods and resolve them
  Object.keys(modlist).forEach(modID => {
    resolve(modID);
  });

  return resolved;
}

// Function to spit out mod IDs and mod names
function generateModStrings(modlist) {
  const orderedModIDs = resolveDependencies(modlist);

  // Generate the Mod ID string
  const modIDString = orderedModIDs.join(";");

  // Generate the Mod Name string
  const modNameString = orderedModIDs.map(modID => {
    const mod = modlist[modID];
    return Array.isArray(mod.mod) ? mod.mod.join(";") : mod.mod;
  }).join(";");

  return {
    modIDString,
    modNameString
  };
}

const { modIDString, modNameString } = generateModStrings(modlist);

console.log("Mod IDs:", modIDString);
console.log("Mod Names:", modNameString);

// Function to generate a categorized human-readable list of mods
function generateCategorizedModList(modlist) {
  const orderedModIDs = resolveDependencies(modlist);

  // Group mods by category
  const categorizedMods = {};

  orderedModIDs.forEach(modID => {
    const mod = modlist[modID];
    if (!mod.category) {
      mod.category = "Uncategorized";  // Handle mods with no category
    }

    if (!categorizedMods[mod.category]) {
      categorizedMods[mod.category] = [];
    }

    categorizedMods[mod.category].push({
      id: modID,
      name: mod.name,
      mod: mod.mod
    });
  });

  // Create a human-readable string for the mods categorized by type
  let humanReadableString = "";
  Object.keys(categorizedMods).sort().forEach(category => {
    humanReadableString += `\n# ${category}\n`;
    categorizedMods[category].forEach(mod => {
      humanReadableString += `- ${mod.name}\n`;
    });
  });

  return humanReadableString;
}

const categorizedModList = generateCategorizedModList(modlist);

console.log("Categorized Mod List:", categorizedModList);