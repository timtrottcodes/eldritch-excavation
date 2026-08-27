// Achievements System
// 100+ achievements across multiple categories
// Each grants a small permanent bonus

const ACHIEVEMENT_CATEGORIES = {
    CLICKING: 'Tapping Master',
    PRODUCTION: 'Idle Tycoon',
    PRESTIGE: 'Madness Embracer',
    COLLECTION: 'Collector',
    EXPLORATION: 'Deep Miner',
    SPEED: 'Speedrunner',
    SECRETS: 'Secret Hunter'
};

const ACHIEVEMENTS = [
    // === TAPPING MASTER (20 achievements) ===
    {
        id: 'clicks_100',
        name: 'First Steps',
        description: 'Tap the crystal 100 times',
        category: 'CLICKING',
        requirement: { totalClicks: 100 },
        reward: { clickPowerBonus: 0.01 }, // +1% tap power
        icon: '👆'
    },
    {
        id: 'clicks_1000',
        name: 'Dedicated Miner',
        description: 'Tap the crystal 1,000 times',
        category: 'CLICKING',
        requirement: { totalClicks: 1000 },
        reward: { clickPowerBonus: 0.01 },
        icon: '👆'
    },
    {
        id: 'clicks_10000',
        name: 'Tap Fanatic',
        description: 'Tap the crystal 10,000 times',
        category: 'CLICKING',
        requirement: { totalClicks: 10000 },
        reward: { clickPowerBonus: 0.02 },
        icon: '👆'
    },
    {
        id: 'clicks_100000',
        name: 'Tap Master',
        description: 'Tap the crystal 100,000 times',
        category: 'CLICKING',
        requirement: { totalClicks: 100000 },
        reward: { clickPowerBonus: 0.03 },
        icon: '👆'
    },
    {
        id: 'clicks_1000000',
        name: 'Tap Ascendant',
        description: 'Tap the crystal 1,000,000 times',
        category: 'CLICKING',
        requirement: { totalClicks: 1000000 },
        reward: { clickPowerBonus: 0.05 },
        icon: '👆'
    },
    {
        id: 'speed_clicker_50',
        name: 'Quick Fingers',
        description: 'Tap 50 times in 10 seconds',
        category: 'CLICKING',
        requirement: { clicksInTimeframe: { count: 50, seconds: 10 } },
        reward: { clickPowerBonus: 0.02 },
        icon: '⚡'
    },
    {
        id: 'speed_clicker_100',
        name: 'Lightning Reflexes',
        description: 'Tap 100 times in 10 seconds',
        category: 'CLICKING',
        requirement: { clicksInTimeframe: { count: 100, seconds: 10 } },
        reward: { clickPowerBonus: 0.03 },
        icon: '⚡'
    },
    {
        id: 'crit_first',
        name: 'Lucky Strike',
        description: 'Get your first critical hit',
        category: 'CLICKING',
        requirement: { criticalHits: 1 },
        reward: { critChanceBonus: 0.01 }, // +1% crit chance
        icon: '💥'
    },
    {
        id: 'crit_100',
        name: 'Critical Master',
        description: 'Get 100 critical hits',
        category: 'CLICKING',
        requirement: { criticalHits: 100 },
        reward: { critChanceBonus: 0.02 },
        icon: '💥'
    },
    {
        id: 'crit_1000',
        name: 'Critical Legend',
        description: 'Get 1,000 critical hits',
        category: 'CLICKING',
        requirement: { criticalHits: 1000 },
        reward: { critMultiplierBonus: 0.5 }, // Crits do +50% more damage
        icon: '💥'
    },
    {
        id: 'click_value_1m',
        name: 'Powerful Tap',
        description: 'Reach 1 million ore per tap',
        category: 'CLICKING',
        requirement: { orePerClick: 1000000 },
        reward: { clickPowerBonus: 0.05 },
        icon: '🔨'
    },
    {
        id: 'click_value_1b',
        name: 'Devastating Tap',
        description: 'Reach 1 billion ore per tap',
        category: 'CLICKING',
        requirement: { orePerClick: 1000000000 },
        reward: { clickPowerBonus: 0.1 },
        icon: '🔨'
    },
    {
        id: 'click_value_1t',
        name: 'Cosmic Tap',
        description: 'Reach 1 trillion ore per tap',
        category: 'CLICKING',
        requirement: { orePerClick: 1000000000000 },
        reward: { clickPowerBonus: 0.15 },
        icon: '🔨'
    },
    {
        id: 'no_click_hour',
        name: 'True Idle',
        description: 'Earn 1 hour of production without tapping',
        category: 'CLICKING',
        requirement: { idleTimeWithoutClick: 3600 },
        reward: { productionBonus: 0.05 },
        icon: '😴'
    },
    {
        id: 'marathon_clicker',
        name: 'Marathon Tapper',
        description: 'Tap for 1 hour straight (3600 taps)',
        category: 'CLICKING',
        requirement: { totalClicks: 3600, inSession: true },
        reward: { clickPowerBonus: 0.05 },
        icon: '🏃'
    },

    // === IDLE TYCOON (Production - 20 achievements) ===
    {
        id: 'production_1',
        name: 'Passive Income',
        description: 'Reach 1 ore per second',
        category: 'PRODUCTION',
        requirement: { orePerSecond: 1 },
        reward: { productionBonus: 0.01 },
        icon: '📈'
    },
    {
        id: 'production_100',
        name: 'Scaling Up',
        description: 'Reach 100 ore per second',
        category: 'PRODUCTION',
        requirement: { orePerSecond: 100 },
        reward: { productionBonus: 0.01 },
        icon: '📈'
    },
    {
        id: 'production_10k',
        name: 'Industrial Revolution',
        description: 'Reach 10,000 ore per second',
        category: 'PRODUCTION',
        requirement: { orePerSecond: 10000 },
        reward: { productionBonus: 0.02 },
        icon: '📈'
    },
    {
        id: 'production_1m',
        name: 'Mega Factory',
        description: 'Reach 1 million ore per second',
        category: 'PRODUCTION',
        requirement: { orePerSecond: 1000000 },
        reward: { productionBonus: 0.03 },
        icon: '📈'
    },
    {
        id: 'production_1b',
        name: 'Ore Empire',
        description: 'Reach 1 billion ore per second',
        category: 'PRODUCTION',
        requirement: { orePerSecond: 1000000000 },
        reward: { productionBonus: 0.05 },
        icon: '📈'
    },
    {
        id: 'production_1t',
        name: 'Infinite Riches',
        description: 'Reach 1 trillion ore per second',
        category: 'PRODUCTION',
        requirement: { orePerSecond: 1000000000000 },
        reward: { productionBonus: 0.1 },
        icon: '📈'
    },
    {
        id: 'tool_first',
        name: 'First Worker',
        description: 'Purchase your first tool',
        category: 'PRODUCTION',
        requirement: { toolsPurchased: 1 },
        reward: { productionBonus: 0.01 },
        icon: '🧙'
    },
    {
        id: 'tool_100',
        name: 'Tool Collector',
        description: 'Purchase 100 total tool levels',
        category: 'PRODUCTION',
        requirement: { toolsPurchased: 100 },
        reward: { productionBonus: 0.02 },
        icon: '🧙'
    },
    {
        id: 'tool_1000',
        name: 'Tool Hoarder',
        description: 'Purchase 1,000 total tool levels',
        category: 'PRODUCTION',
        requirement: { toolsPurchased: 1000 },
        reward: { productionBonus: 0.05 },
        icon: '🧙'
    },
    {
        id: 'tool_maxed',
        name: 'Perfection',
        description: 'Max out a tool to level 256',
        category: 'PRODUCTION',
        requirement: { maxedTools: 1 },
        reward: { productionBonus: 0.1 },
        icon: '⭐'
    },
    {
        id: 'tool_all_maxed',
        name: 'Ultimate Power',
        description: 'Max out all 25 tools',
        category: 'PRODUCTION',
        requirement: { maxedTools: 25 },
        reward: { productionBonus: 0.5 },
        icon: '⭐'
    },
    {
        id: 'all_tools_unlocked',
        name: 'Full Roster',
        description: 'Unlock all 25 workers',
        category: 'PRODUCTION',
        requirement: { toolsUnlocked: 25 },
        reward: { productionBonus: 0.05 },
        icon: '👥'
    },

    // === MADNESS EMBRACER (Prestige - 15 achievements) ===
    {
        id: 'prestige_first',
        name: 'Embrace the Void',
        description: 'Perform your first prestige',
        category: 'PRESTIGE',
        requirement: { prestiges: 1 },
        reward: { madnessGainBonus: 0.05 },
        icon: '🌟'
    },
    {
        id: 'prestige_10',
        name: 'Madness Addict',
        description: 'Prestige 10 times',
        category: 'PRESTIGE',
        requirement: { prestiges: 10 },
        reward: { madnessGainBonus: 0.1 },
        icon: '🌟'
    },
    {
        id: 'prestige_25',
        name: 'Cycle Master',
        description: 'Prestige 25 times',
        category: 'PRESTIGE',
        requirement: { prestiges: 25 },
        reward: { madnessGainBonus: 0.15 },
        icon: '🌟'
    },
    {
        id: 'prestige_50',
        name: 'Eternal Loop',
        description: 'Prestige 50 times',
        category: 'PRESTIGE',
        requirement: { prestiges: 50 },
        reward: { madnessGainBonus: 0.25 },
        icon: '🌟'
    },
    {
        id: 'prestige_100',
        name: 'Infinity Walker',
        description: 'Prestige 100 times',
        category: 'PRESTIGE',
        requirement: { prestiges: 100 },
        reward: { madnessGainBonus: 0.5 },
        icon: '🌟'
    },
    {
        id: 'madness_100',
        name: 'Madness Hoarder',
        description: 'Accumulate 100 total Madness',
        category: 'PRESTIGE',
        requirement: { totalMadness: 100 },
        reward: { madnessGainBonus: 0.1 },
        icon: '🌑'
    },
    {
        id: 'madness_1000',
        name: 'Insanity Incarnate',
        description: 'Accumulate 1,000 total Madness',
        category: 'PRESTIGE',
        requirement: { totalMadness: 1000 },
        reward: { madnessGainBonus: 0.2 },
        icon: '🌑'
    },
    {
        id: 'fast_prestige_1h',
        name: 'Speed Demon',
        description: 'Prestige in under 1 hour',
        category: 'PRESTIGE',
        requirement: { fastestPrestige: 3600 },
        reward: { globalMultiplier: 0.05 },
        icon: '⚡'
    },
    {
        id: 'fast_prestige_30m',
        name: 'Lightning Fast',
        description: 'Prestige in under 30 minutes',
        category: 'PRESTIGE',
        requirement: { fastestPrestige: 1800 },
        reward: { globalMultiplier: 0.1 },
        icon: '⚡'
    },
    {
        id: 'all_prestige_upgrades',
        name: 'Madness Mastery',
        description: 'Purchase all prestige upgrades',
        category: 'PRESTIGE',
        requirement: { prestigeUpgradesOwned: 15 },
        reward: { madnessGainBonus: 0.25 },
        icon: '🎓'
    },

    // === COLLECTOR (Collection - 20 achievements) ===
    {
        id: 'ore_total_1m',
        name: 'Ore Miner',
        description: 'Mine 1 million total ore',
        category: 'COLLECTION',
        requirement: { totalOre: 1000000 },
        reward: { globalMultiplier: 0.01 },
        icon: '💰'
    },
    {
        id: 'ore_total_1b',
        name: 'Ore Tycoon',
        description: 'Mine 1 billion total ore',
        category: 'COLLECTION',
        requirement: { totalOre: 1000000000 },
        reward: { globalMultiplier: 0.02 },
        icon: '💰'
    },
    {
        id: 'ore_total_1t',
        name: 'Ore Baron',
        description: 'Mine 1 trillion total ore',
        category: 'COLLECTION',
        requirement: { totalOre: 1000000000000 },
        reward: { globalMultiplier: 0.05 },
        icon: '💰'
    },
    {
        id: 'ore_total_1q',
        name: 'Ore God',
        description: 'Mine 1 quadrillion total ore',
        category: 'COLLECTION',
        requirement: { totalOre: 1000000000000000 },
        reward: { globalMultiplier: 0.1 },
        icon: '💰'
    },
    {
        id: 'relic_first',
        name: 'Artifact Found',
        description: 'Discover your first relic',
        category: 'COLLECTION',
        requirement: { relicsOwned: 1 },
        reward: { globalMultiplier: 0.01 },
        icon: '🔮'
    },
    {
        id: 'relic_10',
        name: 'Relic Hunter',
        description: 'Collect 10 relics',
        category: 'COLLECTION',
        requirement: { relicsOwned: 10 },
        reward: { globalMultiplier: 0.05 },
        icon: '🔮'
    },
    {
        id: 'relic_all',
        name: 'Master Collector',
        description: 'Collect all 25 relics',
        category: 'COLLECTION',
        requirement: { relicsOwned: 25 },
        reward: { globalMultiplier: 0.25 },
        icon: '🔮'
    },
    {
        id: 'upgrade_first',
        name: 'Enhanced',
        description: 'Purchase your first upgrade',
        category: 'COLLECTION',
        requirement: { upgradesOwned: 1 },
        reward: { globalMultiplier: 0.01 },
        icon: '⬆️'
    },
    {
        id: 'upgrade_25',
        name: 'Power Surge',
        description: 'Purchase 25 upgrades',
        category: 'COLLECTION',
        requirement: { upgradesOwned: 25 },
        reward: { globalMultiplier: 0.05 },
        icon: '⬆️'
    },
    {
        id: 'upgrade_all',
        name: 'Fully Upgraded',
        description: 'Purchase all upgrades',
        category: 'COLLECTION',
        requirement: { upgradesOwned: 60 },
        reward: { globalMultiplier: 0.15 },
        icon: '⬆️'
    },

    // === DEEP MINER (Exploration - 25 achievements) ===
    {
        id: 'ore_tier_copper',
        name: 'Bronze Age',
        description: 'Unlock Copper Ore',
        category: 'EXPLORATION',
        requirement: { oreIndex: 1 },
        reward: { globalMultiplier: 0.01 },
        icon: '🥉'
    },
    {
        id: 'ore_tier_silver',
        name: 'Silver Lining',
        description: 'Unlock Silver Ore',
        category: 'EXPLORATION',
        requirement: { oreIndex: 7 },
        reward: { globalMultiplier: 0.02 },
        icon: '🥈'
    },
    {
        id: 'ore_tier_gold',
        name: 'Golden Touch',
        description: 'Unlock Gold Ore',
        category: 'EXPLORATION',
        requirement: { oreIndex: 8 },
        reward: { globalMultiplier: 0.03 },
        icon: '🥇'
    },
    {
        id: 'ore_tier_diamond',
        name: 'Diamond Standard',
        description: 'Unlock Diamond Crystals',
        category: 'EXPLORATION',
        requirement: { oreIndex: 19 },
        reward: { globalMultiplier: 0.05 },
        icon: '💎'
    },
    {
        id: 'ore_tier_eldritch',
        name: 'Beyond Reality',
        description: 'Unlock Voidstone',
        category: 'EXPLORATION',
        requirement: { oreIndex: 28 },
        reward: { globalMultiplier: 0.1 },
        icon: '🌀'
    },
    {
        id: 'ore_tier_final',
        name: "Azathoth's Blessing",
        description: "Unlock Azathoth's Core",
        category: 'EXPLORATION',
        requirement: { oreIndex: 34 },
        reward: { globalMultiplier: 0.25 },
        icon: '⚫'
    },
    {
        id: 'all_ores',
        name: 'Cosmic Explorer',
        description: 'Unlock all 35 ore tiers',
        category: 'EXPLORATION',
        requirement: { oreIndex: 34 },
        reward: { globalMultiplier: 0.5 },
        icon: '🌌'
    },

    // === SPEEDRUNNER (Speed - 10 achievements) ===
    {
        id: 'speed_silver_1h',
        name: 'Silver Rush',
        description: 'Reach Silver in under 1 hour',
        category: 'SPEED',
        requirement: { reachOreInTime: { oreIndex: 7, seconds: 3600 } },
        reward: { globalMultiplier: 0.05 },
        icon: '🏃'
    },
    {
        id: 'speed_gold_2h',
        name: 'Golden Sprint',
        description: 'Reach Gold in under 2 hours',
        category: 'SPEED',
        requirement: { reachOreInTime: { oreIndex: 8, seconds: 7200 } },
        reward: { globalMultiplier: 0.1 },
        icon: '🏃'
    },
    {
        id: 'speed_void_12h',
        name: 'Into the Void',
        description: 'Reach Voidstone in under 12 hours',
        category: 'SPEED',
        requirement: { reachOreInTime: { oreIndex: 28, seconds: 43200 } },
        reward: { globalMultiplier: 0.15 },
        icon: '🏃'
    },

    // === SECRET HUNTER (Secrets - 15 achievements) ===
    {
        id: 'secret_konami',
        name: '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️',
        description: '???',
        category: 'SECRETS',
        requirement: { konamiCode: true },
        reward: { globalMultiplier: 0.1 },
        icon: '🎮',
        hidden: true
    },
    {
        id: 'secret_idle_24h',
        name: 'Eternal Patience',
        description: 'Play for 24 hours total',
        category: 'SECRETS',
        requirement: { totalPlaytime: 86400 },
        reward: { globalMultiplier: 0.1 },
        icon: '⏰'
    },
    {
        id: 'secret_lovecraft_bday',
        name: 'Happy Birthday, Howard',
        description: 'Play on August 20th',
        category: 'SECRETS',
        requirement: { dateIs: { month: 8, day: 20 } },
        reward: { madnessGainBonus: 0.2 },
        icon: '🎂',
        hidden: true
    },
    {
        id: 'secret_halloween',
        name: 'Trick or Treat',
        description: 'Play on Halloween',
        category: 'SECRETS',
        requirement: { dateIs: { month: 10, day: 31 } },
        reward: { globalMultiplier: 0.15 },
        icon: '🎃',
        hidden: true
    },
    {
        id: 'secret_zero_ore',
        name: 'Voluntary Poverty',
        description: 'Prestige with exactly 0 ore',
        category: 'SECRETS',
        requirement: { prestigeWithZeroOre: true },
        reward: { madnessGainBonus: 0.1 },
        icon: '💸',
        hidden: true
    },
    {
        id: 'secret_no_tools',
        name: 'Solo Miner',
        description: 'Reach 1 million ore without buying any tools',
        category: 'SECRETS',
        requirement: { oreWithoutTools: 1000000 },
        reward: { clickPowerBonus: 0.25 },
        icon: '🔨',
        hidden: true
    },
    {
        id: 'secret_all_crits',
        name: 'Blessed by RNG',
        description: 'Get 10 critical hits in a row',
        category: 'SECRETS',
        requirement: { consecutiveCrits: 10 },
        reward: { critChanceBonus: 0.05 },
        icon: '🍀',
        hidden: true
    },
    {
        id: 'secret_test_all_crystals',
        name: 'Crystal Connoisseur',
        description: 'View all 35 crystal designs',
        category: 'SECRETS',
        requirement: { viewedAllCrystals: true },
        reward: { globalMultiplier: 0.05 },
        icon: '💎',
        hidden: true
    },
];

// Helper function to check if achievement is unlocked
function isAchievementUnlocked(achievementId, gameState) {
    return gameState.achievements && gameState.achievements.includes(achievementId);
}

// Calculate total achievement bonuses
function calculateAchievementBonuses(gameState) {
    const bonuses = {
        clickPowerBonus: 0,
        productionBonus: 0,
        madnessGainBonus: 0,
        globalMultiplier: 0,
        critChanceBonus: 0,
        critMultiplierBonus: 0
    };

    if (!gameState.achievements) return bonuses;

    gameState.achievements.forEach(achId => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achId);
        if (achievement && achievement.reward) {
            Object.keys(achievement.reward).forEach(key => {
                bonuses[key] = (bonuses[key] || 0) + achievement.reward[key];
            });
        }
    });

    return bonuses;
}
