// Eldritch Excavation - Game Data
// Real-world minerals and metals progression

const GAME_DATA = {
    // Minerals/Ores in order of value progression
    ores: [
        { id: 'iron', name: 'Iron Ore', description: 'The first metal drawn from the earth...', baseValue: 1, unlockAt: 0, color: '#8B7355' },
        { id: 'copper', name: 'Copper Ore', description: 'Ancient civilizations forged their tools from this...', baseValue: 5, unlockAt: 100, color: '#B87333' },
        { id: 'zinc', name: 'Zinc Ore', description: 'A metal that whispers of corrosion...', baseValue: 12, unlockAt: 500, color: '#C5C5C5' },
        { id: 'tin', name: 'Tin Ore', description: 'Soft and malleable, yet strangely resilient...', baseValue: 25, unlockAt: 1000, color: '#D4D4D4' },
        { id: 'lead', name: 'Lead Ore', description: 'Heavy with forgotten secrets...', baseValue: 50, unlockAt: 2500, color: '#6E6E6E' },
        { id: 'nickel', name: 'Nickel Ore', description: 'From meteorites that fell from beyond...', baseValue: 100, unlockAt: 5000, color: '#8C8C8C' },
        { id: 'aluminum', name: 'Aluminum Ore', description: 'Light as air, strong as will...', baseValue: 200, unlockAt: 10000, color: '#D4D4D4' },
        { id: 'silver', name: 'Silver Ore', description: 'The moon\'s blessing upon the earth...', baseValue: 500, unlockAt: 25000, color: '#C0C0C0' },
        { id: 'gold', name: 'Gold Ore', description: 'The sun incarnate, buried deep...', baseValue: 1000, unlockAt: 50000, color: '#FFD700' },
        { id: 'platinum', name: 'Platinum Ore', description: 'Rarer than gold, colder than death...', baseValue: 2500, unlockAt: 100000, color: '#E5E4E2' },
        { id: 'ruby', name: 'Ruby Crystals', description: 'Crimson as blood, hard as bone...', baseValue: 5000, unlockAt: 250000, color: '#E0115F' },
        { id: 'sapphire', name: 'Sapphire Crystals', description: 'Blue as the depths of madness...', baseValue: 10000, unlockAt: 500000, color: '#0F52BA' },
        { id: 'emerald', name: 'Emerald Crystals', description: 'Green with envy of the stars...', baseValue: 20000, unlockAt: 1000000, color: '#50C878' },
        { id: 'diamond', name: 'Diamond Crystals', description: 'Compressed time itself...', baseValue: 50000, unlockAt: 2500000, color: '#B9F2FF' },
        { id: 'obsidian', name: 'Obsidian Shards', description: 'Volcanic glass from hell\'s furnace...', baseValue: 100000, unlockAt: 5000000, color: '#0B0B0B' },
        { id: 'voidstone', name: 'Voidstone', description: 'A mineral that should not exist...', baseValue: 250000, unlockAt: 10000000, color: '#1a0033' },
    ],

    // Tools that generate ore automatically (Lovecraft-themed)
    tools: [
        {
            id: 'cultist',
            name: 'Cultist Miner',
            description: 'A devoted follower who tirelessly digs',
            baseCost: 15,
            baseProduction: 0.1,
            costMultiplier: 1.15,
            icon: '🧙'
        },
        {
            id: 'shoggoth',
            name: 'Shoggoth Worker',
            description: 'An amorphous entity of terrible efficiency',
            baseCost: 100,
            baseProduction: 1,
            costMultiplier: 1.15,
            icon: '👾'
        },
        {
            id: 'deepone',
            name: 'Deep One Excavator',
            description: 'Aquatic horrors from beneath the waves',
            baseCost: 1100,
            baseProduction: 8,
            costMultiplier: 1.15,
            icon: '🐙'
        },
        {
            id: 'nightgaunt',
            name: 'Night-gaunt Hauler',
            description: 'Faceless flyers that work in darkness',
            baseCost: 12000,
            baseProduction: 47,
            costMultiplier: 1.15,
            icon: '🦇'
        },
        {
            id: 'byakhee',
            name: 'Byakhee Transport',
            description: 'Interstellar creatures enslaved to your will',
            baseCost: 130000,
            baseProduction: 260,
            costMultiplier: 1.15,
            icon: '🌙'
        },
        {
            id: 'starspawn',
            name: 'Star-spawn Overseer',
            description: 'Ancient beings of cosmic power',
            baseCost: 1400000,
            baseProduction: 1400,
            costMultiplier: 1.15,
            icon: '⭐'
        },
        {
            id: 'eldergod',
            name: 'Elder God Fragment',
            description: 'A sliver of incomprehensible divinity',
            baseCost: 20000000,
            baseProduction: 7800,
            costMultiplier: 1.15,
            icon: '👁️'
        },
        {
            id: 'azathoth',
            name: 'Azathoth\'s Dream',
            description: 'The blind idiot god dreams your fortune',
            baseCost: 330000000,
            baseProduction: 44000,
            costMultiplier: 1.15,
            icon: '🌌'
        },
        {
            id: 'yog',
            name: 'Yog-Sothoth Gate',
            description: 'The key and the gate, the past and future',
            baseCost: 5100000000,
            baseProduction: 260000,
            costMultiplier: 1.15,
            icon: '🚪'
        },
        {
            id: 'cthulhu',
            name: 'Cthulhu\'s Blessing',
            description: 'Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn',
            baseCost: 75000000000,
            baseProduction: 1600000,
            costMultiplier: 1.15,
            icon: '🐉'
        },
    ],

    // Click power upgrades
    upgrades: [
        { id: 'click1', name: 'Reinforced Pick', description: 'Double click power', cost: 100, effect: { clickPower: 2 }, requirement: null },
        { id: 'click2', name: 'Cursed Hammer', description: 'Triple click power', cost: 500, effect: { clickPower: 3 }, requirement: 'click1' },
        { id: 'click3', name: 'Eldritch Drill', description: '5x click power', cost: 2500, effect: { clickPower: 5 }, requirement: 'click2' },
        { id: 'click4', name: 'Void Excavator', description: '10x click power', cost: 50000, effect: { clickPower: 10 }, requirement: 'click3' },
        { id: 'click5', name: 'Reality Splitter', description: '25x click power', cost: 500000, effect: { clickPower: 25 }, requirement: 'click4' },
        
        { id: 'prod1', name: 'Whispered Secrets', description: '+10% production', cost: 1000, effect: { productionMult: 1.1 }, requirement: null },
        { id: 'prod2', name: 'Ancient Knowledge', description: '+25% production', cost: 10000, effect: { productionMult: 1.25 }, requirement: 'prod1' },
        { id: 'prod3', name: 'Forbidden Tome', description: '+50% production', cost: 100000, effect: { productionMult: 1.5 }, requirement: 'prod2' },
        { id: 'prod4', name: 'Necronomicon', description: '2x production', cost: 1000000, effect: { productionMult: 2 }, requirement: 'prod3' },
        { id: 'prod5', name: 'Book of Azathoth', description: '3x production', cost: 10000000, effect: { productionMult: 3 }, requirement: 'prod4' },
        
        { id: 'auto1', name: 'Auto-Clicker I', description: '+1 auto-click per second', cost: 5000, effect: { autoClick: 1 }, requirement: null },
        { id: 'auto2', name: 'Auto-Clicker II', description: '+3 auto-clicks per second', cost: 50000, effect: { autoClick: 3 }, requirement: 'auto1' },
        { id: 'auto3', name: 'Auto-Clicker III', description: '+10 auto-clicks per second', cost: 500000, effect: { autoClick: 10 }, requirement: 'auto2' },
    ],

    // Relics - powerful permanent bonuses (rare discoveries)
    relics: [
        { id: 'relic1', name: 'Amulet of R\'lyeh', description: '2x ore from all sources', effect: { globalMult: 2 }, cost: 100000 },
        { id: 'relic2', name: 'Crown of Kadath', description: '3x click power', effect: { clickMult: 3 }, cost: 500000 },
        { id: 'relic3', name: 'Staff of Yog-Sothoth', description: '2x tool production', effect: { toolMult: 2 }, cost: 1000000 },
        { id: 'relic4', name: 'Mask of Nyarlathotep', description: '1.5x madness gain', effect: { madnessMult: 1.5 }, cost: 2500000 },
        { id: 'relic5', name: 'Blade of Cthugha', description: '5x click power', effect: { clickMult: 5 }, cost: 5000000 },
        { id: 'relic6', name: 'Eye of Shub-Niggurath', description: '3x all production', effect: { globalMult: 3 }, cost: 10000000 },
        { id: 'relic7', name: 'Heart of Azathoth', description: '10x ore gain', effect: { globalMult: 10 }, cost: 50000000 },
    ],

    // Prestige upgrades (bought with Madness)
    prestigeUpgrades: [
        { id: 'mad1', name: 'Persistent Madness I', description: '+10% ore gain per prestige', cost: 1, effect: { prestigeMult: 0.1 } },
        { id: 'mad2', name: 'Persistent Madness II', description: '+25% ore gain per prestige', cost: 5, effect: { prestigeMult: 0.25 }, requirement: 'mad1' },
        { id: 'mad3', name: 'Persistent Madness III', description: '+50% ore gain per prestige', cost: 25, effect: { prestigeMult: 0.5 }, requirement: 'mad2' },

        { id: 'start1', name: 'Head Start I', description: 'Start with 100 ore', cost: 2, effect: { startOre: 100 } },
        { id: 'start2', name: 'Head Start II', description: 'Start with 10,000 ore', cost: 10, effect: { startOre: 10000 }, requirement: 'start1' },
        { id: 'start3', name: 'Head Start III', description: 'Start with 1,000,000 ore', cost: 50, effect: { startOre: 1000000 }, requirement: 'start2' },

        { id: 'tool1', name: 'Cosmic Workers I', description: 'Tools 2x more effective', cost: 5, effect: { toolEfficiency: 2 } },
        { id: 'tool2', name: 'Cosmic Workers II', description: 'Tools 3x more effective', cost: 20, effect: { toolEfficiency: 3 }, requirement: 'tool1' },
        { id: 'tool3', name: 'Cosmic Workers III', description: 'Tools 5x more effective', cost: 100, effect: { toolEfficiency: 5 }, requirement: 'tool2' },

        { id: 'click_prestige1', name: 'Eternal Strength I', description: 'Clicks 5x more powerful', cost: 3, effect: { clickMultPrestige: 5 } },
        { id: 'click_prestige2', name: 'Eternal Strength II', description: 'Clicks 10x more powerful', cost: 15, effect: { clickMultPrestige: 10 }, requirement: 'click_prestige1' },
        { id: 'click_prestige3', name: 'Eternal Strength III', description: 'Clicks 25x more powerful', cost: 75, effect: { clickMultPrestige: 25 }, requirement: 'click_prestige2' },
    ],

    // Missions/Achievements with rewards
    missions: [
        { id: 'm1', name: 'First Strike', description: 'Click 10 times', requirement: { clicks: 10 }, reward: { ore: 50 }, repeatable: false },
        { id: 'm2', name: 'Hundred Blows', description: 'Click 100 times', requirement: { clicks: 100 }, reward: { ore: 500 }, repeatable: false },
        { id: 'm3', name: 'Thousand Strikes', description: 'Click 1,000 times', requirement: { clicks: 1000 }, reward: { ore: 5000 }, repeatable: false },

        { id: 'm4', name: 'First Harvest', description: 'Collect 1,000 ore', requirement: { totalOre: 1000 }, reward: { ore: 200 }, repeatable: false },
        { id: 'm5', name: 'Growing Fortune', description: 'Collect 100,000 ore', requirement: { totalOre: 100000 }, reward: { ore: 10000 }, repeatable: false },
        { id: 'm6', name: 'Vast Riches', description: 'Collect 10,000,000 ore', requirement: { totalOre: 10000000 }, reward: { ore: 1000000 }, repeatable: false },

        { id: 'm7', name: 'First Servant', description: 'Purchase 1 tool', requirement: { toolsPurchased: 1 }, reward: { ore: 100 }, repeatable: false },
        { id: 'm8', name: 'Small Army', description: 'Purchase 50 tools total', requirement: { toolsPurchased: 50 }, reward: { ore: 5000 }, repeatable: false },
        { id: 'm9', name: 'Legion', description: 'Purchase 500 tools total', requirement: { toolsPurchased: 500 }, reward: { ore: 100000 }, repeatable: false },

        { id: 'm10', name: 'Knowledge Seeker', description: 'Buy 5 upgrades', requirement: { upgradesPurchased: 5 }, reward: { ore: 2500 }, repeatable: false },
        { id: 'm11', name: 'Power Collector', description: 'Buy 3 relics', requirement: { relicsPurchased: 3 }, reward: { ore: 50000 }, repeatable: false },

        { id: 'm12', name: 'First Descent', description: 'Prestige once', requirement: { prestiges: 1 }, reward: { madness: 1 }, repeatable: false },
        { id: 'm13', name: 'Embracing Madness', description: 'Prestige 5 times', requirement: { prestiges: 5 }, reward: { madness: 5 }, repeatable: false },
        { id: 'm14', name: 'Master of Madness', description: 'Prestige 25 times', requirement: { prestiges: 25 }, reward: { madness: 25 }, repeatable: false },
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

    // Calculate tool cost at a specific level
    getToolCost(toolId, level) {
        const tool = this.getTool(toolId);
        if (!tool) return 0;
        return Math.floor(tool.baseCost * Math.pow(tool.costMultiplier, level));
    },

    // Calculate tool production at a specific level
    getToolProduction(toolId, level) {
        const tool = this.getTool(toolId);
        if (!tool) return 0;
        return tool.baseProduction * level;
    }
};
