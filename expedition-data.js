// Expedition System - Timed missions that unlock relics and grant rewards

const EXPEDITION_DATA = {
    // Available expedition durations (in seconds)
    expeditions: [
        {
            id: 'quick_scout',
            name: 'Quick Scout',
            description: 'A brief reconnaissance of nearby ruins...',
            duration: 300, // 5 minutes
            icon: '🔍',
            baseOreReward: 0.5, // 50% of 5 min production
            baseMadnessReward: 0,
            relicChance: 0.05, // 5% chance
            tier: 1
        },
        {
            id: 'short_delve',
            name: 'Short Delve',
            description: 'Venture into the shallow depths...',
            duration: 600, // 10 minutes
            icon: '⛏️',
            baseOreReward: 1.0, // 100% of 10 min production
            baseMadnessReward: 0,
            relicChance: 0.10, // 10% chance
            tier: 1
        },
        {
            id: 'deep_exploration',
            name: 'Deep Exploration',
            description: 'Descend into forgotten chambers...',
            duration: 1800, // 30 minutes
            icon: '🗺️',
            baseOreReward: 2.0, // 200% of 30 min production
            baseMadnessReward: 1,
            relicChance: 0.20, // 20% chance
            tier: 2
        },
        {
            id: 'extended_expedition',
            name: 'Extended Expedition',
            description: 'Journey to distant eldritch sites...',
            duration: 3600, // 1 hour
            icon: '🧭',
            baseOreReward: 3.0, // 300% of 1 hour production
            baseMadnessReward: 2,
            relicChance: 0.35, // 35% chance
            tier: 2
        },
        {
            id: 'perilous_journey',
            name: 'Perilous Journey',
            description: 'Brave the most dangerous ruins...',
            duration: 10800, // 3 hours
            icon: '⚔️',
            baseOreReward: 4.0, // 400% of 3 hour production
            baseMadnessReward: 5,
            relicChance: 0.50, // 50% chance
            tier: 3
        },
        {
            id: 'grand_expedition',
            name: 'Grand Expedition',
            description: 'Mount a full expedition to the void itself...',
            duration: 21600, // 6 hours
            icon: '🏛️',
            baseOreReward: 5.0, // 500% of 6 hour production
            baseMadnessReward: 10,
            relicChance: 0.75, // 75% chance
            tier: 3
        }
    ],

    // Calculate actual rewards based on player progress
    calculateRewards(expeditionId, gameState) {
        const expedition = this.expeditions.find(e => e.id === expeditionId);
        if (!expedition) return null;

        const durationInSeconds = expedition.duration;
        
        // Ore reward: base production * duration * multiplier
        const oreReward = Math.floor(
            gameState.orePerSecond * 
            (durationInSeconds / 60) * // Convert to minutes for balance
            expedition.baseOreReward
        );

        // Madness reward (only if player has prestiged)
        const madnessReward = gameState.prestiges > 0 ? expedition.baseMadnessReward : 0;

        // Relic chance affected by current prestige level
        const prestigeBonus = Math.min(gameState.prestiges * 0.02, 0.20); // +2% per prestige, max +20%
        const relicChance = Math.min(expedition.relicChance + prestigeBonus, 0.95); // Cap at 95%

        return {
            ore: oreReward,
            madness: madnessReward,
            relicChance: relicChance,
            duration: durationInSeconds
        };
    },

    // Select random undiscovered relic weighted by tier
    selectRandomRelic(gameState, expeditionTier) {
        // Get all undiscovered relics
        const undiscoveredRelics = GAME_DATA.relics.filter(r => 
            !gameState.relics.includes(r.id)
        );

        if (undiscoveredRelics.length === 0) {
            return null; // All relics discovered
        }

        // Weight relics by expedition tier
        // Lower tier expeditions find lower tier relics more often
        const weightedRelics = undiscoveredRelics.map((relic, index) => {
            const relicTier = Math.floor(index / 5) + 1; // Roughly 5 relics per tier
            let weight = 1;

            if (expeditionTier === 1) {
                // Tier 1 expeditions favor early relics
                weight = relicTier === 1 ? 5 : relicTier === 2 ? 2 : 1;
            } else if (expeditionTier === 2) {
                // Tier 2 expeditions favor mid relics
                weight = relicTier === 2 ? 5 : relicTier === 3 ? 3 : relicTier === 1 ? 2 : 1;
            } else {
                // Tier 3 expeditions favor late relics but can find any
                weight = relicTier === 3 ? 5 : relicTier === 4 ? 4 : relicTier === 5 ? 3 : 2;
            }

            return { relic, weight };
        });

        // Weighted random selection
        const totalWeight = weightedRelics.reduce((sum, r) => sum + r.weight, 0);
        let random = Math.random() * totalWeight;

        for (const { relic, weight } of weightedRelics) {
            random -= weight;
            if (random <= 0) {
                return relic;
            }
        }

        // Fallback to first undiscovered
        return undiscoveredRelics[0];
    },

    // Format time remaining
    formatTimeRemaining(seconds) {
        if (seconds < 60) {
            return `${Math.ceil(seconds)}s`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}m ${secs}s`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }
};
