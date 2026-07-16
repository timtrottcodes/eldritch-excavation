// Ascension System
// Second prestige layer - unlocks at Prestige 10+
// Reset Madness & Prestiges → Gain Cosmic Power
// Cosmic upgrades affect all future prestiges

const ASCENSION_DATA = {
    // Requirements
    minPrestiges: 10,
    
    // Cosmic Power formula: sqrt(total Madness spent) / 10
    calculateCosmicPower(totalMadnessSpent) {
        if (totalMadnessSpent < 100) return 0;
        return Math.floor(Math.sqrt(totalMadnessSpent) / 10);
    },

    // Cosmic Upgrades (permanent across all prestiges)
    upgrades: [
        // Tier 1: Foundation (1 CP each)
        {
            id: 'cosmic_click_1',
            name: 'Cosmic Strength I',
            description: 'Clicks are 2x more powerful',
            cost: 1,
            effect: { clickPowerMult: 2 },
            icon: '👆',
            tier: 1
        },
        {
            id: 'cosmic_production_1',
            name: 'Cosmic Efficiency I',
            description: 'All production is 2x faster',
            cost: 1,
            effect: { productionMult: 2 },
            icon: '📈',
            tier: 1
        },
        {
            id: 'cosmic_madness_1',
            name: 'Cosmic Insight I',
            description: 'Gain 50% more Madness on prestige',
            cost: 1,
            effect: { madnessGain: 1.5 },
            icon: '🌑',
            tier: 1
        },
        {
            id: 'cosmic_crit_1',
            name: 'Cosmic Fortune I',
            description: 'Critical hit chance +5%',
            cost: 1,
            effect: { critChance: 0.05 },
            icon: '💥',
            tier: 1
        },

        // Tier 2: Enhancement (3 CP each)
        {
            id: 'cosmic_click_2',
            name: 'Cosmic Strength II',
            description: 'Clicks are 5x more powerful',
            cost: 3,
            effect: { clickPowerMult: 5 },
            requirement: 'cosmic_click_1',
            icon: '👆',
            tier: 2
        },
        {
            id: 'cosmic_production_2',
            name: 'Cosmic Efficiency II',
            description: 'All production is 5x faster',
            cost: 3,
            effect: { productionMult: 5 },
            requirement: 'cosmic_production_1',
            icon: '📈',
            tier: 2
        },
        {
            id: 'cosmic_madness_2',
            name: 'Cosmic Insight II',
            description: 'Gain 2x more Madness on prestige',
            cost: 3,
            effect: { madnessGain: 2 },
            requirement: 'cosmic_madness_1',
            icon: '🌑',
            tier: 2
        },
        {
            id: 'cosmic_crit_2',
            name: 'Cosmic Fortune II',
            description: 'Critical hits do 2x more damage',
            cost: 3,
            effect: { critMultiplier: 2 },
            requirement: 'cosmic_crit_1',
            icon: '💥',
            tier: 2
        },
        {
            id: 'cosmic_offline',
            name: 'Eternal Vigil',
            description: 'Offline time increased to 24 hours',
            cost: 3,
            effect: { offlineTime: 24 },
            icon: '⏰',
            tier: 2
        },
        {
            id: 'cosmic_auto',
            name: 'Cosmic Automation',
            description: 'Start each prestige with 1 auto-clicker',
            cost: 3,
            effect: { startingAutoClick: 1 },
            icon: '🤖',
            tier: 2
        },

        // Tier 3: Mastery (10 CP each)
        {
            id: 'cosmic_click_3',
            name: 'Cosmic Strength III',
            description: 'Clicks are 10x more powerful',
            cost: 10,
            effect: { clickPowerMult: 10 },
            requirement: 'cosmic_click_2',
            icon: '👆',
            tier: 3
        },
        {
            id: 'cosmic_production_3',
            name: 'Cosmic Efficiency III',
            description: 'All production is 10x faster',
            cost: 10,
            effect: { productionMult: 10 },
            requirement: 'cosmic_production_2',
            icon: '📈',
            tier: 3
        },
        {
            id: 'cosmic_madness_3',
            name: 'Cosmic Insight III',
            description: 'Gain 3x more Madness on prestige',
            cost: 10,
            effect: { madnessGain: 3 },
            requirement: 'cosmic_madness_2',
            icon: '🌑',
            tier: 3
        },
        {
            id: 'cosmic_global',
            name: 'Universal Blessing',
            description: 'All multipliers increased by 5x',
            cost: 10,
            effect: { globalMult: 5 },
            icon: '🌌',
            tier: 3
        },
        {
            id: 'cosmic_tools',
            name: 'Cosmic Workers',
            description: 'All tools 5x more efficient',
            cost: 10,
            effect: { toolEfficiency: 5 },
            icon: '🧙',
            tier: 3
        },

        // Tier 4: Transcendence (25 CP each)
        {
            id: 'cosmic_ultimate_click',
            name: 'Omnipotent Touch',
            description: 'Clicks are 100x more powerful',
            cost: 25,
            effect: { clickPowerMult: 100 },
            requirement: 'cosmic_click_3',
            icon: '👆',
            tier: 4
        },
        {
            id: 'cosmic_ultimate_production',
            name: 'Infinite Industry',
            description: 'All production is 100x faster',
            cost: 25,
            effect: { productionMult: 100 },
            requirement: 'cosmic_production_3',
            icon: '📈',
            tier: 4
        },
        {
            id: 'cosmic_ultimate_madness',
            name: 'Eternal Madness',
            description: 'Gain 10x more Madness on prestige',
            cost: 25,
            effect: { madnessGain: 10 },
            requirement: 'cosmic_madness_3',
            icon: '🌑',
            tier: 4
        },
        {
            id: 'cosmic_instant_prestige',
            name: 'Reality Shift',
            description: 'Start each prestige at Silver Ore',
            cost: 25,
            effect: { startingOre: 7 },
            icon: '⚡',
            tier: 4
        },
        {
            id: 'cosmic_crit_master',
            name: 'Absolute Certainty',
            description: 'Critical hit chance +20%, crits do 5x damage',
            cost: 25,
            effect: { critChance: 0.20, critMultiplier: 5 },
            requirement: 'cosmic_crit_2',
            icon: '💥',
            tier: 4
        },
    ]
};
