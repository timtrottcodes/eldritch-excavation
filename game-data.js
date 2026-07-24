// Eldritch Excavation - Game Data
// Real-world minerals and metals progression

// Rarity tier definitions
const RARITY_TIERS = {
    COMMON: { name: 'Common', level: 0, color: '#FFFFFF', requiredLevel: 0 },
    UNCOMMON: { name: 'Uncommon', level: 1, color: '#1EFF00', requiredLevel: 25 },
    RARE: { name: 'Rare', level: 2, color: '#0070DD', requiredLevel: 50 },
    EPIC: { name: 'Epic', level: 3, color: '#A335EE', requiredLevel: 100 },
    LEGENDARY: { name: 'Legendary', level: 4, color: '#FF8000', requiredLevel: 150 },
    MYTHICAL: { name: 'Mythical', level: 5, color: '#E6CC80', requiredLevel: 200 }
};

const MAX_TOOL_LEVEL = 256;

// Helper to get rarity based on level
function getRarityForLevel(level) {
    if (level >= 200) return RARITY_TIERS.MYTHICAL;
    if (level >= 150) return RARITY_TIERS.LEGENDARY;
    if (level >= 100) return RARITY_TIERS.EPIC;
    if (level >= 50) return RARITY_TIERS.RARE;
    if (level >= 25) return RARITY_TIERS.UNCOMMON;
    return RARITY_TIERS.COMMON;
}

const GAME_DATA = {
    // Minerals/Ores in order of value progression (35 tiers for 24-hour gameplay)
    ores: [
        // Common Metals (Tier 1-7)
        { id: 'iron', name: 'Iron Ore', description: 'The first metal drawn from the earth...', baseValue: 1, unlockAt: 0, color: '#8B7355', textColor: '#FFFFFF' },
        { id: 'copper', name: 'Copper Ore', description: 'Ancient civilizations forged their tools from this...', baseValue: 3, unlockAt: 500, color: '#B87333', textColor: '#FFFFFF' },
        { id: 'zinc', name: 'Zinc Ore', description: 'A metal that whispers of corrosion...', baseValue: 8, unlockAt: 2500, color: '#C5C5C5', textColor: '#1A1A1A' },
        { id: 'tin', name: 'Tin Ore', description: 'Soft and malleable, yet strangely resilient...', baseValue: 20, unlockAt: 10000, color: '#D4D4D4', textColor: '#1A1A1A' },
        { id: 'lead', name: 'Lead Ore', description: 'Heavy with forgotten secrets...', baseValue: 50, unlockAt: 50000, color: '#6E6E6E', textColor: '#FFFFFF' },
        { id: 'nickel', name: 'Nickel Ore', description: 'From meteorites that fell from beyond...', baseValue: 125, unlockAt: 250000, color: '#8C8C8C', textColor: '#FFFFFF' },
        { id: 'aluminum', name: 'Aluminum Ore', description: 'Light as air, strong as will...', baseValue: 300, unlockAt: 1000000, color: '#D4D4D4', textColor: '#1A1A1A' },

        // Precious Metals (Tier 8-14)
        { id: 'silver', name: 'Silver Ore', description: 'The moon\'s blessing upon the earth...', baseValue: 750, unlockAt: 5000000, color: '#C0C0C0', textColor: '#1A1A1A' },
        { id: 'gold', name: 'Gold Ore', description: 'The sun incarnate, buried deep...', baseValue: 1800, unlockAt: 25000000, color: '#FFD700', textColor: '#1A1A1A' },
        { id: 'platinum', name: 'Platinum Ore', description: 'Rarer than gold, colder than death...', baseValue: 4500, unlockAt: 100000000, color: '#E5E4E2', textColor: '#1A1A1A' },
        { id: 'palladium', name: 'Palladium Ore', description: 'Lustrous white metal from the abyss...', baseValue: 11000, unlockAt: 500000000, color: '#CED0DD', textColor: '#1A1A1A' },
        { id: 'rhodium', name: 'Rhodium Ore', description: 'The rarest of metals, gleaming with power...', baseValue: 27000, unlockAt: 2500000000, color: '#E8E8E8', textColor: '#1A1A1A' },
        { id: 'iridium', name: 'Iridium Ore', description: 'Dense as a collapsed star...', baseValue: 65000, unlockAt: 10000000000, color: '#F0F0C0', textColor: '#1A1A1A' },
        { id: 'osmium', name: 'Osmium Ore', description: 'The densest element, pulled from oblivion...', baseValue: 160000, unlockAt: 50000000000, color: '#A8A8A8', textColor: '#1A1A1A' },

        // Gemstones (Tier 15-21)
        { id: 'garnet', name: 'Garnet Crystals', description: 'Deep red stones of ancient origin...', baseValue: 400000, unlockAt: 250000000000, color: '#AA2222', textColor: '#FFFFFF' },
        { id: 'amethyst', name: 'Amethyst Crystals', description: 'Purple gems that channel cosmic energy...', baseValue: 950000, unlockAt: 1000000000000, color: '#9966CC', textColor: '#FFFFFF' },
        { id: 'ruby', name: 'Ruby Crystals', description: 'Crimson as blood, hard as bone...', baseValue: 2300000, unlockAt: 5000000000000, color: '#E0115F', textColor: '#FFFFFF' },
        { id: 'sapphire', name: 'Sapphire Crystals', description: 'Blue as the depths of madness...', baseValue: 5500000, unlockAt: 25000000000000, color: '#0F52BA', textColor: '#FFFFFF' },
        { id: 'emerald', name: 'Emerald Crystals', description: 'Green with envy of the stars...', baseValue: 13000000, unlockAt: 100000000000000, color: '#50C878', textColor: '#FFFFFF' },
        { id: 'diamond', name: 'Diamond Crystals', description: 'Compressed time itself...', baseValue: 32000000, unlockAt: 500000000000000, color: '#B9F2FF', textColor: '#1A1A1A' },
        { id: 'alexandrite', name: 'Alexandrite', description: 'Changes color like reality shifts...', baseValue: 75000000, unlockAt: 2500000000000000, color: '#9370DB', textColor: '#FFFFFF' },

        // Rare Minerals (Tier 22-28)
        { id: 'painite', name: 'Painite', description: 'One of Earth\'s rarest minerals...', baseValue: 180000000, unlockAt: 500000000000, color: '#CC5555', textColor: '#FFFFFF' },
        { id: 'benitoite', name: 'Benitoite', description: 'Blue fire trapped in crystal form...', baseValue: 430000000, unlockAt: 1400000000000, color: '#4169E1', textColor: '#FFFFFF' },
        { id: 'taaffeite', name: 'Taaffeite', description: 'So rare it was mistaken for another gem...', baseValue: 1000000000, unlockAt: 4000000000000, color: '#E6C7FF', textColor: '#1A1A1A' },
        { id: 'meteorite', name: 'Meteorite Fragments', description: 'Fallen from beyond the stars...', baseValue: 2400000000, unlockAt: 11000000000000, color: '#4A4A4A', textColor: '#FFFFFF' },
        { id: 'obsidian', name: 'Obsidian Shards', description: 'Volcanic glass from hell\'s furnace...', baseValue: 5800000000, unlockAt: 30000000000000, color: '#0B0B0B', textColor: '#FFFFFF' },
        { id: 'moldavite', name: 'Moldavite', description: 'Born from cosmic impact...', baseValue: 14000000000, unlockAt: 85000000000000, color: '#3F7F3F', textColor: '#FFFFFF' },
        { id: 'carborundum', name: 'Carborundum', description: 'Harder than nature intended...', baseValue: 33000000000, unlockAt: 240000000000000, color: '#5A5A8C', textColor: '#FFFFFF' },

        // Eldritch Materials (Tier 29-35)
        { id: 'voidstone', name: 'Voidstone', description: 'A mineral that should not exist...', baseValue: 80000000000, unlockAt: 700000000000000, color: '#1a0033', textColor: '#FFFFFF' },
        { id: 'starmetal', name: 'Star-Metal', description: 'Forged in the heart of dying suns...', baseValue: 190000000000, unlockAt: 2000000000000000, color: '#FFE4B5', textColor: '#1A1A1A' },
        { id: 'darkmatter', name: 'Dark Matter Crystal', description: 'The universe\'s hidden mass made tangible...', baseValue: 450000000000, unlockAt: 5500000000000000, color: '#0D0D1F', textColor: '#FFFFFF' },
        { id: 'timecrystal', name: 'Time Crystal', description: 'A pattern that repeats in time, not space...', baseValue: 1100000000000, unlockAt: 16000000000000000, color: '#00CED1', textColor: '#1A1A1A' },
        { id: 'phase_matter', name: 'Phase Matter', description: 'Exists in multiple dimensions at once...', baseValue: 2600000000000, unlockAt: 45000000000000000, color: '#FF1493', textColor: '#FFFFFF' },
        { id: 'reality_shard', name: 'Reality Shard', description: 'Fragments of broken universes...', baseValue: 6200000000000, unlockAt: 130000000000000000, color: '#FF6347', textColor: '#FFFFFF' },
        { id: 'elder_essence', name: 'Elder Essence', description: 'The crystallized dreams of sleeping gods...', baseValue: 15000000000000, unlockAt: 370000000000000000, color: '#8B008B', textColor: '#FFFFFF' },
        { id: 'azathoth_core', name: 'Azathoth\'s Core', description: 'The nuclear chaos at the center of infinity...', baseValue: 36000000000000, unlockAt: 1000000000000000000, color: '#4B0082', textColor: '#FFFFFF' },
    ],

    // Tools that generate ore automatically (Lovecraft-themed, 25 tiers)
    tools: [
        {
            id: 'cultist',
            name: 'Cultist Miner',
            description: 'A devoted follower who tirelessly digs',
            baseCost: 50,
            baseProduction: 0.05,
            costMultiplier: 1.15,
            icon: '🧙'
        },
        {
            id: 'ghoul',
            name: 'Ghoul Scavenger',
            description: 'Grave-dwelling creatures with a nose for ore',
            baseCost: 500,
            baseProduction: 0.2,
            costMultiplier: 1.15,
            icon: '🧟'
        },
        {
            id: 'shoggoth',
            name: 'Shoggoth Worker',
            description: 'An amorphous entity of terrible efficiency',
            baseCost: 5000,
            baseProduction: 1,
            costMultiplier: 1.15,
            icon: '👾'
        },
        {
            id: 'deepone',
            name: 'Deep One Excavator',
            description: 'Aquatic horrors from beneath the waves',
            baseCost: 50000,
            baseProduction: 5,
            costMultiplier: 1.15,
            icon: '🐙'
        },
        {
            id: 'migo',
            name: 'Mi-Go Harvester',
            description: 'Fungoid beings from dark Yuggoth',
            baseCost: 500000,
            baseProduction: 25,
            costMultiplier: 1.15,
            icon: '🦠'
        },
        {
            id: 'nightgaunt',
            name: 'Night-gaunt Hauler',
            description: 'Faceless flyers that work in darkness',
            baseCost: 5000000,
            baseProduction: 125,
            costMultiplier: 1.15,
            icon: '🦇'
        },
        {
            id: 'hound',
            name: 'Hound of Tindalos',
            description: 'Creatures that hunt through angles of time',
            baseCost: 50000000,
            baseProduction: 625,
            costMultiplier: 1.15,
            icon: '🐺'
        },
        {
            id: 'polyp',
            name: 'Flying Polyp',
            description: 'Partially material beings of great power',
            baseCost: 500000000,
            baseProduction: 3125,
            costMultiplier: 1.15,
            icon: '🫧'
        },
        {
            id: 'byakhee',
            name: 'Byakhee Transport',
            description: 'Interstellar creatures enslaved to your will',
            baseCost: 5000000000,
            baseProduction: 15625,
            costMultiplier: 1.15,
            icon: '🌙'
        },
        {
            id: 'shantak',
            name: 'Shantak-bird',
            description: 'Scaled nightmares from the peaks of Leng',
            baseCost: 50000000000,
            baseProduction: 78125,
            costMultiplier: 1.15,
            icon: '🦅'
        },
        {
            id: 'formless',
            name: 'Formless Spawn',
            description: 'Tsathoggua\'s amorphous children',
            baseCost: 500000000000,
            baseProduction: 390625,
            costMultiplier: 1.15,
            icon: '💧'
        },
        {
            id: 'starspawn',
            name: 'Star-spawn Overseer',
            description: 'Ancient beings of cosmic power',
            baseCost: 5000000000000,
            baseProduction: 1953125,
            costMultiplier: 1.15,
            icon: '⭐'
        },
        {
            id: 'servitor',
            name: 'Servitor of Outer Gods',
            description: 'Mindless servants of the court of chaos',
            baseCost: 50000000000000,
            baseProduction: 9765625,
            costMultiplier: 1.15,
            icon: '👻'
        },
        {
            id: 'color',
            name: 'Color Out of Space',
            description: 'An indescribable chromatic entity',
            baseCost: 500000000000000,
            baseProduction: 48828125,
            costMultiplier: 1.15,
            icon: '🌈'
        },
        {
            id: 'dweller',
            name: 'Dimensional Shambler',
            description: 'Steps between worlds to gather riches',
            baseCost: 5000000000000000,
            baseProduction: 244140625,
            costMultiplier: 1.15,
            icon: '🚪'
        },
        {
            id: 'elderthing',
            name: 'Elder Thing',
            description: 'Ancient Antarctic builders and scientists',
            baseCost: 50000000000000000,
            baseProduction: 1220703125,
            costMultiplier: 1.15,
            icon: '❄️'
        },
        {
            id: 'moonbeast',
            name: 'Moon-Beast',
            description: 'Toad-like slavers from Earth\'s moon',
            baseCost: 500000000000000000,
            baseProduction: 6103515625,
            costMultiplier: 1.15,
            icon: '🌕'
        },
        {
            id: 'nyarlathotep',
            name: 'Avatar of Nyarlathotep',
            description: 'The crawling chaos takes many forms',
            baseCost: 5000000000000000000,
            baseProduction: 30517578125,
            costMultiplier: 1.15,
            icon: '🎭'
        },
        {
            id: 'dagon',
            name: 'Dagon\'s Chosen',
            description: 'High priests of the ocean depths',
            baseCost: 50000000000000000000,
            baseProduction: 152587890625,
            costMultiplier: 1.15,
            icon: '🔱'
        },
        {
            id: 'hastur',
            name: 'Hastur\'s Sign',
            description: 'The Yellow Sign empowers your workers',
            baseCost: 500000000000000000000,
            baseProduction: 762939453125,
            costMultiplier: 1.15,
            icon: '👑'
        },
        {
            id: 'shub',
            name: 'Dark Young of Shub-Niggurath',
            description: 'Spawn of the Black Goat with a Thousand Young',
            baseCost: 5000000000000000000000,
            baseProduction: 3814697265625,
            costMultiplier: 1.15,
            icon: '🌳'
        },
        {
            id: 'yog',
            name: 'Yog-Sothoth Gate',
            description: 'The key and the gate, the past and future',
            baseCost: 50000000000000000000000,
            baseProduction: 19073486328125,
            costMultiplier: 1.15,
            icon: '🌌'
        },
        {
            id: 'azathoth',
            name: 'Azathoth\'s Dream',
            description: 'The blind idiot god dreams your fortune',
            baseCost: 500000000000000000000000,
            baseProduction: 95367431640625,
            costMultiplier: 1.15,
            icon: '💤'
        },
        {
            id: 'cthulhu',
            name: 'Cthulhu\'s Blessing',
            description: 'Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn',
            baseCost: 5000000000000000000000000,
            baseProduction: 476837158203125,
            costMultiplier: 1.15,
            icon: '🐉'
        },
        {
            id: 'outer_gods',
            name: 'Court of Outer Gods',
            description: 'The ultimate cosmic entities work for you',
            baseCost: 50000000000000000000000000,
            baseProduction: 2384185791015625,
            costMultiplier: 1.15,
            icon: '♾️'
        },
    ],

    // Upgrades (60+ upgrades across multiple categories)
    upgrades: [
        // Click Power Upgrades (15 tiers)
        { id: 'click1', name: 'Reinforced Pick', description: '2x click power', cost: 100, effect: { clickPower: 2 }, requirement: null },
        { id: 'click2', name: 'Iron Mattock', description: '2x click power', cost: 500, effect: { clickPower: 2 }, requirement: 'click1' },
        { id: 'click3', name: 'Bronze Excavator', description: '2x click power', cost: 2500, effect: { clickPower: 2 }, requirement: 'click2' },
        { id: 'click4', name: 'Cursed Hammer', description: '2x click power', cost: 12000, effect: { clickPower: 2 }, requirement: 'click3' },
        { id: 'click5', name: 'Silver Drill', description: '2x click power', cost: 60000, effect: { clickPower: 2 }, requirement: 'click4' },
        { id: 'click6', name: 'Eldritch Bore', description: '2x click power', cost: 300000, effect: { clickPower: 2 }, requirement: 'click5' },
        { id: 'click7', name: 'Platinum Breaker', description: '2x click power', cost: 1500000, effect: { clickPower: 2 }, requirement: 'click6' },
        { id: 'click8', name: 'Gem Splitter', description: '2x click power', cost: 7500000, effect: { clickPower: 2 }, requirement: 'click7' },
        { id: 'click9', name: 'Diamond Edge', description: '2x click power', cost: 38000000, effect: { clickPower: 2 }, requirement: 'click8' },
        { id: 'click10', name: 'Void Excavator', description: '2x click power', cost: 190000000, effect: { clickPower: 2 }, requirement: 'click9' },
        { id: 'click11', name: 'Star Forge Hammer', description: '2x click power', cost: 950000000, effect: { clickPower: 2 }, requirement: 'click10' },
        { id: 'click12', name: 'Reality Splitter', description: '2x click power', cost: 4750000000, effect: { clickPower: 2 }, requirement: 'click11' },
        { id: 'click13', name: 'Time Shatterer', description: '2x click power', cost: 24000000000, effect: { clickPower: 2 }, requirement: 'click12' },
        { id: 'click14', name: 'Dimension Breaker', description: '2x click power', cost: 120000000000, effect: { clickPower: 2 }, requirement: 'click13' },
        { id: 'click15', name: 'Cosmic Annihilator', description: '3x click power', cost: 600000000000, effect: { clickPower: 3 }, requirement: 'click14' },

        // Production Multipliers (15 tiers)
        { id: 'prod1', name: 'Whispered Secrets', description: '+25% production', cost: 1000, effect: { productionMult: 1.25 }, requirement: null },
        { id: 'prod2', name: 'Forbidden Glyphs', description: '+25% production', cost: 5000, effect: { productionMult: 1.25 }, requirement: 'prod1' },
        { id: 'prod3', name: 'Ancient Runes', description: '+25% production', cost: 25000, effect: { productionMult: 1.25 }, requirement: 'prod2' },
        { id: 'prod4', name: 'Elder Signs', description: '+25% production', cost: 125000, effect: { productionMult: 1.25 }, requirement: 'prod3' },
        { id: 'prod5', name: 'Cursed Tablets', description: '+25% production', cost: 625000, effect: { productionMult: 1.25 }, requirement: 'prod4' },
        { id: 'prod6', name: 'Forbidden Tome', description: '+50% production', cost: 3000000, effect: { productionMult: 1.5 }, requirement: 'prod5' },
        { id: 'prod7', name: 'Pnakotic Manuscripts', description: '+50% production', cost: 15000000, effect: { productionMult: 1.5 }, requirement: 'prod6' },
        { id: 'prod8', name: 'Necronomicon', description: '+50% production', cost: 75000000, effect: { productionMult: 1.5 }, requirement: 'prod7' },
        { id: 'prod9', name: 'Book of Eibon', description: '+50% production', cost: 375000000, effect: { productionMult: 1.5 }, requirement: 'prod8' },
        { id: 'prod10', name: 'Unaussprechlichen Kulten', description: '2x production', cost: 1875000000, effect: { productionMult: 2 }, requirement: 'prod9' },
        { id: 'prod11', name: 'De Vermis Mysteriis', description: '2x production', cost: 9400000000, effect: { productionMult: 2 }, requirement: 'prod10' },
        { id: 'prod12', name: 'Cultes des Goules', description: '2x production', cost: 47000000000, effect: { productionMult: 2 }, requirement: 'prod11' },
        { id: 'prod13', name: 'Book of Azathoth', description: '2x production', cost: 235000000000, effect: { productionMult: 2 }, requirement: 'prod12' },
        { id: 'prod14', name: 'Revelations of Glaaki', description: '2x production', cost: 1175000000000, effect: { productionMult: 2 }, requirement: 'prod13' },
        { id: 'prod15', name: 'True Necronomicon', description: '3x production', cost: 5875000000000, effect: { productionMult: 3 }, requirement: 'prod14' },

        // Auto-Clicker Upgrades (10 tiers)
        { id: 'auto1', name: 'Auto-Clicker I', description: '+1 auto-click/s', cost: 5000, effect: { autoClick: 1 }, requirement: null },
        { id: 'auto2', name: 'Auto-Clicker II', description: '+2 auto-clicks/s', cost: 50000, effect: { autoClick: 2 }, requirement: 'auto1' },
        { id: 'auto3', name: 'Auto-Clicker III', description: '+3 auto-clicks/s', cost: 500000, effect: { autoClick: 3 }, requirement: 'auto2' },
        { id: 'auto4', name: 'Auto-Clicker IV', description: '+5 auto-clicks/s', cost: 5000000, effect: { autoClick: 5 }, requirement: 'auto3' },
        { id: 'auto5', name: 'Auto-Clicker V', description: '+8 auto-clicks/s', cost: 50000000, effect: { autoClick: 8 }, requirement: 'auto4' },
        { id: 'auto6', name: 'Auto-Clicker VI', description: '+13 auto-clicks/s', cost: 500000000, effect: { autoClick: 13 }, requirement: 'auto5' },
        { id: 'auto7', name: 'Auto-Clicker VII', description: '+21 auto-clicks/s', cost: 5000000000, effect: { autoClick: 21 }, requirement: 'auto6' },
        { id: 'auto8', name: 'Auto-Clicker VIII', description: '+34 auto-clicks/s', cost: 50000000000, effect: { autoClick: 34 }, requirement: 'auto7' },
        { id: 'auto9', name: 'Auto-Clicker IX', description: '+55 auto-clicks/s', cost: 500000000000, effect: { autoClick: 55 }, requirement: 'auto8' },
        { id: 'auto10', name: 'Auto-Clicker X', description: '+100 auto-clicks/s', cost: 5000000000000, effect: { autoClick: 100 }, requirement: 'auto9' },

        // Tool Efficiency Upgrades (10 tiers)
        { id: 'tool_eff1', name: 'Better Training', description: 'All tools 2x more efficient', cost: 10000, effect: { toolEfficiency: 2 }, requirement: null },
        { id: 'tool_eff2', name: 'Dark Rituals', description: 'All tools 2x more efficient', cost: 100000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff1' },
        { id: 'tool_eff3', name: 'Eldritch Motivation', description: 'All tools 2x more efficient', cost: 1000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff2' },
        { id: 'tool_eff4', name: 'Cosmic Empowerment', description: 'All tools 2x more efficient', cost: 10000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff3' },
        { id: 'tool_eff5', name: 'Void Enhancement', description: 'All tools 2x more efficient', cost: 100000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff4' },
        { id: 'tool_eff6', name: 'Reality Warping', description: 'All tools 2x more efficient', cost: 1000000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff5' },
        { id: 'tool_eff7', name: 'Time Dilation', description: 'All tools 2x more efficient', cost: 10000000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff6' },
        { id: 'tool_eff8', name: 'Dimensional Folding', description: 'All tools 2x more efficient', cost: 100000000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff7' },
        { id: 'tool_eff9', name: 'Universal Constants', description: 'All tools 2x more efficient', cost: 1000000000000, effect: { toolEfficiency: 2 }, requirement: 'tool_eff8' },
        { id: 'tool_eff10', name: 'Azathoth\'s Will', description: 'All tools 3x more efficient', cost: 10000000000000, effect: { toolEfficiency: 3 }, requirement: 'tool_eff9' },

        // Special Global Multipliers (10 tiers)
        { id: 'global1', name: 'Minor Blessing', description: '1.5x all ore gain', cost: 50000, effect: { globalMult: 1.5 }, requirement: null },
        { id: 'global2', name: 'Greater Blessing', description: '1.5x all ore gain', cost: 500000, effect: { globalMult: 1.5 }, requirement: 'global1' },
        { id: 'global3', name: 'Cosmic Favor', description: '1.5x all ore gain', cost: 5000000, effect: { globalMult: 1.5 }, requirement: 'global2' },
        { id: 'global4', name: 'Eldritch Pact', description: '1.5x all ore gain', cost: 50000000, effect: { globalMult: 1.5 }, requirement: 'global3' },
        { id: 'global5', name: 'Void Contract', description: '2x all ore gain', cost: 500000000, effect: { globalMult: 2 }, requirement: 'global4' },
        { id: 'global6', name: 'Star Alignment', description: '2x all ore gain', cost: 5000000000, effect: { globalMult: 2 }, requirement: 'global5' },
        { id: 'global7', name: 'Reality Shift', description: '2x all ore gain', cost: 50000000000, effect: { globalMult: 2 }, requirement: 'global6' },
        { id: 'global8', name: 'Universal Law', description: '2x all ore gain', cost: 500000000000, effect: { globalMult: 2 }, requirement: 'global7' },
        { id: 'global9', name: 'Dimensional Mastery', description: '2x all ore gain', cost: 5000000000000, effect: { globalMult: 2 }, requirement: 'global8' },
        { id: 'global10', name: 'Outer Gods\' Gift', description: '3x all ore gain', cost: 50000000000000, effect: { globalMult: 3 }, requirement: 'global9' },
    ],

    // Relics - powerful permanent bonuses (25 relics, persist through prestige!)
    relics: [
        { id: 'relic1', name: 'Rusty Pendant', description: '1.5x ore from all sources', effect: { globalMult: 1.5 }, cost: 25000 },
        { id: 'relic2', name: 'Carved Idol', description: '2x click power', effect: { clickMult: 2 }, cost: 100000 },
        { id: 'relic3', name: 'Ancient Coin', description: '1.5x tool production', effect: { toolMult: 1.5 }, cost: 250000 },
        { id: 'relic4', name: 'Obsidian Mirror', description: '1.25x madness gain', effect: { madnessMult: 1.25 }, cost: 500000 },
        { id: 'relic5', name: 'Amulet of R\'lyeh', description: '2x ore from all sources', effect: { globalMult: 2 }, cost: 1000000 },
        { id: 'relic6', name: 'Crown of Kadath', description: '3x click power', effect: { clickMult: 3 }, cost: 2500000 },
        { id: 'relic7', name: 'Staff of Yog-Sothoth', description: '2x tool production', effect: { toolMult: 2 }, cost: 5000000 },
        { id: 'relic8', name: 'Mask of Nyarlathotep', description: '1.5x madness gain', effect: { madnessMult: 1.5 }, cost: 10000000 },
        { id: 'relic9', name: 'Ring of Eibon', description: '2.5x ore from all sources', effect: { globalMult: 2.5 }, cost: 25000000 },
        { id: 'relic10', name: 'Blade of Cthugha', description: '5x click power', effect: { clickMult: 5 }, cost: 50000000 },
        { id: 'relic11', name: 'Tome of Eternal Night', description: '3x tool production', effect: { toolMult: 3 }, cost: 100000000 },
        { id: 'relic12', name: 'Orb of the Deep Ones', description: '2x madness gain', effect: { madnessMult: 2 }, cost: 250000000 },
        { id: 'relic13', name: 'Eye of Shub-Niggurath', description: '3x all production', effect: { globalMult: 3 }, cost: 500000000 },
        { id: 'relic14', name: 'Flute of Azathoth', description: '10x click power', effect: { clickMult: 10 }, cost: 1000000000 },
        { id: 'relic15', name: 'Sigil of the Gate', description: '5x tool production', effect: { toolMult: 5 }, cost: 2500000000 },
        { id: 'relic16', name: 'Fragment of the Shining Trapezohedron', description: '2.5x madness gain', effect: { madnessMult: 2.5 }, cost: 5000000000 },
        { id: 'relic17', name: 'Heart of Azathoth', description: '5x ore gain', effect: { globalMult: 5 }, cost: 10000000000 },
        { id: 'relic18', name: 'Claw of Cthulhu', description: '25x click power', effect: { clickMult: 25 }, cost: 25000000000 },
        { id: 'relic19', name: 'Seed of Shub-Niggurath', description: '10x tool production', effect: { toolMult: 10 }, cost: 50000000000 },
        { id: 'relic20', name: 'Yellow Sign of Hastur', description: '3x madness gain', effect: { madnessMult: 3 }, cost: 100000000000 },
        { id: 'relic21', name: 'Key of the Silver Gate', description: '10x ore gain', effect: { globalMult: 10 }, cost: 250000000000 },
        { id: 'relic22', name: 'Sphere of the Outer Gods', description: '50x click power', effect: { clickMult: 50 }, cost: 500000000000 },
        { id: 'relic23', name: 'Crown of Dagon', description: '25x tool production', effect: { toolMult: 25 }, cost: 1000000000000 },
        { id: 'relic24', name: 'Soul of Yog-Sothoth', description: '5x madness gain', effect: { madnessMult: 5 }, cost: 2500000000000 },
        { id: 'relic25', name: 'Core of Creation', description: '100x all ore gain', effect: { globalMult: 100 }, cost: 10000000000000 },
    ],

    // Prestige upgrades (bought with Madness) - 40 upgrades
    prestigeUpgrades: [
        // Persistent Madness (ore per prestige count)
        { id: 'mad1', name: 'Persistent Madness I', description: '+5% ore gain per prestige', cost: 1, effect: { prestigeMult: 0.05 } },
        { id: 'mad2', name: 'Persistent Madness II', description: '+10% ore gain per prestige', cost: 3, effect: { prestigeMult: 0.1 }, requirement: 'mad1' },
        { id: 'mad3', name: 'Persistent Madness III', description: '+15% ore gain per prestige', cost: 10, effect: { prestigeMult: 0.15 }, requirement: 'mad2' },
        { id: 'mad4', name: 'Persistent Madness IV', description: '+25% ore gain per prestige', cost: 30, effect: { prestigeMult: 0.25 }, requirement: 'mad3' },
        { id: 'mad5', name: 'Persistent Madness V', description: '+50% ore gain per prestige', cost: 100, effect: { prestigeMult: 0.5 }, requirement: 'mad4' },

        // Head Start (starting ore)
        { id: 'start1', name: 'Head Start I', description: 'Start with 100 ore', cost: 1, effect: { startOre: 100 } },
        { id: 'start2', name: 'Head Start II', description: 'Start with 5,000 ore', cost: 5, effect: { startOre: 5000 }, requirement: 'start1' },
        { id: 'start3', name: 'Head Start III', description: 'Start with 100,000 ore', cost: 15, effect: { startOre: 100000 }, requirement: 'start2' },
        { id: 'start4', name: 'Head Start IV', description: 'Start with 5,000,000 ore', cost: 50, effect: { startOre: 5000000 }, requirement: 'start3' },
        { id: 'start5', name: 'Head Start V', description: 'Start with 250,000,000 ore', cost: 150, effect: { startOre: 250000000 }, requirement: 'start4' },

        // Cosmic Workers (tool efficiency)
        { id: 'tool1', name: 'Cosmic Workers I', description: 'Tools 2x more effective', cost: 2, effect: { toolEfficiency: 2 } },
        { id: 'tool2', name: 'Cosmic Workers II', description: 'Tools 2x more effective', cost: 8, effect: { toolEfficiency: 2 }, requirement: 'tool1' },
        { id: 'tool3', name: 'Cosmic Workers III', description: 'Tools 2x more effective', cost: 25, effect: { toolEfficiency: 2 }, requirement: 'tool2' },
        { id: 'tool4', name: 'Cosmic Workers IV', description: 'Tools 2x more effective', cost: 75, effect: { toolEfficiency: 2 }, requirement: 'tool3' },
        { id: 'tool5', name: 'Cosmic Workers V', description: 'Tools 3x more effective', cost: 250, effect: { toolEfficiency: 3 }, requirement: 'tool4' },

        // Eternal Strength (click power)
        { id: 'click_prestige1', name: 'Eternal Strength I', description: 'Clicks 2x more powerful', cost: 2, effect: { clickMultPrestige: 2 } },
        { id: 'click_prestige2', name: 'Eternal Strength II', description: 'Clicks 2x more powerful', cost: 7, effect: { clickMultPrestige: 2 }, requirement: 'click_prestige1' },
        { id: 'click_prestige3', name: 'Eternal Strength III', description: 'Clicks 2x more powerful', cost: 20, effect: { clickMultPrestige: 2 }, requirement: 'click_prestige2' },
        { id: 'click_prestige4', name: 'Eternal Strength IV', description: 'Clicks 2x more powerful', cost: 60, effect: { clickMultPrestige: 2 }, requirement: 'click_prestige3' },
        { id: 'click_prestige5', name: 'Eternal Strength V', description: 'Clicks 3x more powerful', cost: 200, effect: { clickMultPrestige: 3 }, requirement: 'click_prestige4' },

        // Global Multipliers
        { id: 'global_p1', name: 'Void Infusion I', description: '2x all ore gain', cost: 5, effect: { globalMultPrestige: 2 } },
        { id: 'global_p2', name: 'Void Infusion II', description: '2x all ore gain', cost: 20, effect: { globalMultPrestige: 2 }, requirement: 'global_p1' },
        { id: 'global_p3', name: 'Void Infusion III', description: '2x all ore gain', cost: 75, effect: { globalMultPrestige: 2 }, requirement: 'global_p2' },
        { id: 'global_p4', name: 'Void Infusion IV', description: '2x all ore gain', cost: 250, effect: { globalMultPrestige: 2 }, requirement: 'global_p3' },
        { id: 'global_p5', name: 'Void Infusion V', description: '3x all ore gain', cost: 750, effect: { globalMultPrestige: 3 }, requirement: 'global_p4' },

        // Production Boost
        { id: 'prod_p1', name: 'Eldritch Production I', description: '2x passive production', cost: 3, effect: { productionMultPrestige: 2 } },
        { id: 'prod_p2', name: 'Eldritch Production II', description: '2x passive production', cost: 12, effect: { productionMultPrestige: 2 }, requirement: 'prod_p1' },
        { id: 'prod_p3', name: 'Eldritch Production III', description: '2x passive production', cost: 40, effect: { productionMultPrestige: 2 }, requirement: 'prod_p2' },
        { id: 'prod_p4', name: 'Eldritch Production IV', description: '2x passive production', cost: 120, effect: { productionMultPrestige: 2 }, requirement: 'prod_p3' },
        { id: 'prod_p5', name: 'Eldritch Production V', description: '3x passive production', cost: 400, effect: { productionMultPrestige: 3 }, requirement: 'prod_p4' },

        // Madness Gain
        { id: 'madness_gain1', name: 'Deeper Madness I', description: '1.5x madness from prestige', cost: 10, effect: { madnessGainMult: 1.5 } },
        { id: 'madness_gain2', name: 'Deeper Madness II', description: '1.5x madness from prestige', cost: 40, effect: { madnessGainMult: 1.5 }, requirement: 'madness_gain1' },
        { id: 'madness_gain3', name: 'Deeper Madness III', description: '2x madness from prestige', cost: 150, effect: { madnessGainMult: 2 }, requirement: 'madness_gain2' },
        { id: 'madness_gain4', name: 'Deeper Madness IV', description: '2x madness from prestige', cost: 500, effect: { madnessGainMult: 2 }, requirement: 'madness_gain3' },
        { id: 'madness_gain5', name: 'Deeper Madness V', description: '3x madness from prestige', cost: 1500, effect: { madnessGainMult: 3 }, requirement: 'madness_gain4' },

        // Ultimate Upgrades
        { id: 'ultimate1', name: 'Cosmic Transcendence', description: '10x all ore gain', cost: 1000, effect: { globalMultPrestige: 10 } },
        { id: 'ultimate2', name: 'Reality Mastery', description: '10x tool efficiency', cost: 2000, effect: { toolEfficiency: 10 }, requirement: 'ultimate1' },
        { id: 'ultimate3', name: 'Dimensional Supremacy', description: '10x click power', cost: 3000, effect: { clickMultPrestige: 10 }, requirement: 'ultimate2' },
        { id: 'ultimate4', name: 'Elder God Ascension', description: '100x all ore gain', cost: 5000, effect: { globalMultPrestige: 100 }, requirement: 'ultimate3' },
    ],

    // Missions/Achievements with rewards (50 missions)
    missions: [
        // Click Milestones
        { id: 'm1', name: 'First Strike', description: 'Click 10 times', requirement: { clicks: 10 }, reward: { ore: 25 }, repeatable: false },
        { id: 'm2', name: 'Hundred Blows', description: 'Click 100 times', requirement: { clicks: 100 }, reward: { ore: 250 }, repeatable: false },
        { id: 'm3', name: 'Thousand Strikes', description: 'Click 1,000 times', requirement: { clicks: 1000 }, reward: { ore: 2500 }, repeatable: false },
        { id: 'm4', name: 'Ten Thousand Hits', description: 'Click 10,000 times', requirement: { clicks: 10000 }, reward: { ore: 50000 }, repeatable: false },
        { id: 'm5', name: 'Hundred Thousand Blows', description: 'Click 100,000 times', requirement: { clicks: 100000 }, reward: { ore: 1000000 }, repeatable: false },
        { id: 'm6', name: 'Million Clicks', description: 'Click 1,000,000 times', requirement: { clicks: 1000000 }, reward: { ore: 25000000 }, repeatable: false },

        // Ore Collection Milestones
        { id: 'm7', name: 'First Harvest', description: 'Collect 500 ore', requirement: { totalOre: 500 }, reward: { ore: 100 }, repeatable: false },
        { id: 'm8', name: 'Minor Fortune', description: 'Collect 10,000 ore', requirement: { totalOre: 10000 }, reward: { ore: 2000 }, repeatable: false },
        { id: 'm9', name: 'Growing Wealth', description: 'Collect 500,000 ore', requirement: { totalOre: 500000 }, reward: { ore: 100000 }, repeatable: false },
        { id: 'm10', name: 'Major Fortune', description: 'Collect 25,000,000 ore', requirement: { totalOre: 25000000 }, reward: { ore: 5000000 }, repeatable: false },
        { id: 'm11', name: 'Vast Riches', description: 'Collect 1,000,000,000 ore', requirement: { totalOre: 1000000000 }, reward: { ore: 200000000 }, repeatable: false },
        { id: 'm12', name: 'Incomprehensible Wealth', description: 'Collect 50,000,000,000 ore', requirement: { totalOre: 50000000000 }, reward: { ore: 10000000000 }, repeatable: false },
        { id: 'm13', name: 'Cosmic Hoard', description: 'Collect 5,000,000,000,000 ore', requirement: { totalOre: 5000000000000 }, reward: { ore: 1000000000000 }, repeatable: false },

        // Tool Purchase Milestones
        { id: 'm14', name: 'First Servant', description: 'Purchase 1 tool', requirement: { toolsPurchased: 1 }, reward: { ore: 50 }, repeatable: false },
        { id: 'm15', name: 'Small Workforce', description: 'Purchase 10 tools total', requirement: { toolsPurchased: 10 }, reward: { ore: 1000 }, repeatable: false },
        { id: 'm16', name: 'Growing Army', description: 'Purchase 50 tools total', requirement: { toolsPurchased: 50 }, reward: { ore: 10000 }, repeatable: false },
        { id: 'm17', name: 'Battalion', description: 'Purchase 250 tools total', requirement: { toolsPurchased: 250 }, reward: { ore: 100000 }, repeatable: false },
        { id: 'm18', name: 'Legion', description: 'Purchase 1,000 tools total', requirement: { toolsPurchased: 1000 }, reward: { ore: 1000000 }, repeatable: false },
        { id: 'm19', name: 'Army of Darkness', description: 'Purchase 5,000 tools total', requirement: { toolsPurchased: 5000 }, reward: { ore: 25000000 }, repeatable: false },
        { id: 'm20', name: 'Eldritch Horde', description: 'Purchase 25,000 tools total', requirement: { toolsPurchased: 25000 }, reward: { ore: 500000000 }, repeatable: false },

        // Upgrade Milestones
        { id: 'm21', name: 'Student of the Dark', description: 'Buy 3 upgrades', requirement: { upgradesPurchased: 3 }, reward: { ore: 1000 }, repeatable: false },
        { id: 'm22', name: 'Knowledge Seeker', description: 'Buy 10 upgrades', requirement: { upgradesPurchased: 10 }, reward: { ore: 10000 }, repeatable: false },
        { id: 'm23', name: 'Scholar of Forbidden Lore', description: 'Buy 25 upgrades', requirement: { upgradesPurchased: 25 }, reward: { ore: 100000 }, repeatable: false },
        { id: 'm24', name: 'Master of Secrets', description: 'Buy 40 upgrades', requirement: { upgradesPurchased: 40 }, reward: { ore: 10000000 }, repeatable: false },
        { id: 'm25', name: 'Keeper of All Knowledge', description: 'Buy 60 upgrades', requirement: { upgradesPurchased: 60 }, reward: { ore: 1000000000 }, repeatable: false },

        // Relic Milestones
        { id: 'm26', name: 'First Artifact', description: 'Discover 1 relic', requirement: { relicsPurchased: 1 }, reward: { ore: 10000 }, repeatable: false },
        { id: 'm27', name: 'Artifact Hunter', description: 'Discover 5 relics', requirement: { relicsPurchased: 5 }, reward: { ore: 500000 }, repeatable: false },
        { id: 'm28', name: 'Power Collector', description: 'Discover 10 relics', requirement: { relicsPurchased: 10 }, reward: { ore: 25000000 }, repeatable: false },
        { id: 'm29', name: 'Relic Master', description: 'Discover 15 relics', requirement: { relicsPurchased: 15 }, reward: { ore: 1000000000 }, repeatable: false },
        { id: 'm30', name: 'Curator of the Eldritch', description: 'Discover all 25 relics', requirement: { relicsPurchased: 25 }, reward: { madness: 100 }, repeatable: false },

        // Prestige Milestones
        { id: 'm31', name: 'First Descent', description: 'Prestige once', requirement: { prestiges: 1 }, reward: { madness: 1 }, repeatable: false },
        { id: 'm32', name: 'Embracing Madness', description: 'Prestige 3 times', requirement: { prestiges: 3 }, reward: { madness: 3 }, repeatable: false },
        { id: 'm33', name: 'Madness Beckons', description: 'Prestige 10 times', requirement: { prestiges: 10 }, reward: { madness: 10 }, repeatable: false },
        { id: 'm34', name: 'Master of Madness', description: 'Prestige 25 times', requirement: { prestiges: 25 }, reward: { madness: 25 }, repeatable: false },
        { id: 'm35', name: 'Eternal Madness', description: 'Prestige 50 times', requirement: { prestiges: 50 }, reward: { madness: 50 }, repeatable: false },
        { id: 'm36', name: 'Incarnation of Chaos', description: 'Prestige 100 times', requirement: { prestiges: 100 }, reward: { madness: 100 }, repeatable: false },

        // Ore Tier Unlocks
        { id: 'm37', name: 'Bronze Age', description: 'Unlock Copper Ore', requirement: { oreIndex: 1 }, reward: { ore: 100 }, repeatable: false },
        { id: 'm38', name: 'Age of Metals', description: 'Unlock Lead Ore', requirement: { oreIndex: 4 }, reward: { ore: 5000 }, repeatable: false },
        { id: 'm39', name: 'Silver Standard', description: 'Unlock Silver Ore', requirement: { oreIndex: 7 }, reward: { ore: 250000 }, repeatable: false },
        { id: 'm40', name: 'Golden Era', description: 'Unlock Gold Ore', requirement: { oreIndex: 8 }, reward: { ore: 1000000 }, repeatable: false },
        { id: 'm41', name: 'Precious Discovery', description: 'Unlock Platinum Ore', requirement: { oreIndex: 9 }, reward: { ore: 5000000 }, repeatable: false },
        { id: 'm42', name: 'Gemstone Dreams', description: 'Unlock Ruby Crystals', requirement: { oreIndex: 16 }, reward: { ore: 100000000 }, repeatable: false },
        { id: 'm43', name: 'Diamond Hunter', description: 'Unlock Diamond Crystals', requirement: { oreIndex: 19 }, reward: { ore: 10000000000 }, repeatable: false },
        { id: 'm44', name: 'Obsidian Depths', description: 'Unlock Obsidian Shards', requirement: { oreIndex: 26 }, reward: { ore: 1000000000000 }, repeatable: false },
        { id: 'm45', name: 'Void Walker', description: 'Unlock Voidstone', requirement: { oreIndex: 28 }, reward: { madness: 25 }, repeatable: false },
        { id: 'm46', name: 'Star Forger', description: 'Unlock Star-Metal', requirement: { oreIndex: 29 }, reward: { madness: 50 }, repeatable: false },
        { id: 'm47', name: 'Dark Matter Seeker', description: 'Unlock Dark Matter Crystal', requirement: { oreIndex: 30 }, reward: { madness: 100 }, repeatable: false },
        { id: 'm48', name: 'Master of Time', description: 'Unlock Time Crystal', requirement: { oreIndex: 31 }, reward: { madness: 150 }, repeatable: false },
        { id: 'm49', name: 'Reality Bender', description: 'Unlock Reality Shard', requirement: { oreIndex: 33 }, reward: { madness: 250 }, repeatable: false },
        { id: 'm50', name: 'Azathoth Awakens', description: 'Unlock Azathoth\'s Core', requirement: { oreIndex: 34 }, reward: { madness: 500 }, repeatable: false },
    ]
};

// Helper functions for game data
const GameDataHelper = {
    getOre(id) {
        return GAME_DATA.ores.find(ore => ore.id === id);
    },

    getTool(id) {
        return GAME_DATA.tools.find(tool => tool.id === id);
    },

    getUpgrade(id) {
        return GAME_DATA.upgrades.find(upgrade => upgrade.id === id);
    },

    getRelic(id) {
        return GAME_DATA.relics.find(relic => relic.id === id);
    },

    getPrestigeUpgrade(id) {
        return GAME_DATA.prestigeUpgrades.find(upgrade => upgrade.id === id);
    },

    getMission(id) {
        return GAME_DATA.missions.find(mission => mission.id === id);
    },

    // Calculate tool cost for next level
    getToolCost(toolId, currentLevel) {
        const tool = this.getTool(toolId);
        if (!tool) return 0;
        if (currentLevel >= MAX_TOOL_LEVEL) return Infinity;
        return Math.floor(tool.baseCost * Math.pow(tool.costMultiplier, currentLevel));
    },

    // Calculate tool production at a specific level (scales per level, with rarity bonuses)
    getToolProduction(toolId, level) {
        const tool = this.getTool(toolId);
        if (!tool) return 0;
        if (level === 0) return 0;

        // Base production scales with level
        let production = tool.baseProduction * level;

        // Rarity bonuses
        const rarity = getRarityForLevel(level);
        let rarityBonus = 1;

        if (rarity === RARITY_TIERS.UNCOMMON) rarityBonus = 1.5;
        else if (rarity === RARITY_TIERS.RARE) rarityBonus = 2;
        else if (rarity === RARITY_TIERS.EPIC) rarityBonus = 3;
        else if (rarity === RARITY_TIERS.LEGENDARY) rarityBonus = 5;
        else if (rarity === RARITY_TIERS.MYTHICAL) rarityBonus = 10;

        return production * rarityBonus;
    },

    // Check if a tool is unlocked (first tool always unlocked, others need previous at Epic)
    isToolUnlocked(toolId, toolStates) {
        const toolIndex = GAME_DATA.tools.findIndex(t => t.id === toolId);
        if (toolIndex === 0) return true; // First tool always unlocked

        // Check if previous tool is at Epic level (100+)
        const previousTool = GAME_DATA.tools[toolIndex - 1];
        if (!previousTool) return true;

        const previousLevel = toolStates[previousTool.id] || 0;
        return previousLevel >= RARITY_TIERS.EPIC.requiredLevel;
    }
};
