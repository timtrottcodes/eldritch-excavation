// Eldritch Excavation - Main Game Logic

// Global flag to prevent saves during reset
let isResetting = false;

// Game State
const gameState = {
    ore: 0,
    totalOre: 0,
    totalClicks: 0,
    madness: 0,
    prestiges: 0,
    currentOreIndex: 0,

    tools: {}, // { toolId: level } - now tracks individual levels (0-256)
    upgrades: [], // [upgradeId, ...]
    relics: [], // [relicId, ...]
    prestigeUpgrades: [], // [upgradeId, ...]
    missions: {}, // { missionId: completed }
    achievements: [], // [achievementId, ...]

    // Critical Hit Stats
    criticalHits: 0,
    consecutiveCrits: 0,
    currentCritStreak: 0,
    baseCritChance: 0.05, // 5% base chance
    baseCritMultiplier: 5, // 5x damage on crit

    // Ascension
    ascensions: 0,
    cosmicPower: 0,
    totalMadnessSpent: 0, // Track lifetime madness for ascension calculation
    ascensionUpgrades: [],

    // Expeditions
    activeExpedition: null, // { id, startTime, endTime }
    expeditionCompletedIds: [], // Track completed expeditions for achievements

    // Stats
    orePerClick: 1,
    orePerSecond: 0,
    clickMultiplier: 1,
    productionMultiplier: 1,
    toolEfficiencyMultiplier: 1,
    globalMultiplier: 1,
    madnessMultiplier: 1,
    autoClicksPerSecond: 0,

    // Settings
    autoSave: true,
    particles: true,
    sound: false,

    lastTick: Date.now(),
    lastSave: Date.now(),
};

// Number formatting
function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    if (num < 1000000000000000000) return (num / 1000000000000000).toFixed(2) + 'Qa';
    if (num < 1e21) return (num / 1e18).toFixed(2) + 'Qi';
    if (num < 1e24) return (num / 1e21).toFixed(2) + 'Sx';
    if (num < 1e27) return (num / 1e24).toFixed(2) + 'Sp';
    if (num < 1e30) return (num / 1e27).toFixed(2) + 'Oc';
    if (num < 1e33) return (num / 1e30).toFixed(2) + 'No';
    if (num < 1e36) return (num / 1e33).toFixed(2) + 'Dc';
    return (num / 1e36).toFixed(2) + 'UDc';
}

// Calculate multipliers from upgrades, relics, and achievements
function calculateMultipliers() {
    let clickMult = 1;
    let prodMult = 1;
    let toolMult = 1;
    let globalMult = 1;
    let madnessMult = 1;
    let autoClicks = 0;
    let clickMultPrestige = 1;
    let globalMultPrestige = 1;
    let productionMultPrestige = 1;
    let madnessGainMult = 1;

    // Achievement bonuses
    const achBonuses = calculateAchievementBonuses(gameState);
    clickMult *= (1 + achBonuses.clickPowerBonus);
    prodMult *= (1 + achBonuses.productionBonus);
    globalMult *= (1 + achBonuses.globalMultiplier);
    madnessGainMult *= (1 + achBonuses.madnessGainBonus);
    gameState.baseCritChance = 0.05 + achBonuses.critChanceBonus;
    gameState.baseCritMultiplier = 5 + achBonuses.critMultiplierBonus;

    // Upgrades
    gameState.upgrades.forEach(upgradeId => {
        const upgrade = GameDataHelper.getUpgrade(upgradeId);
        if (upgrade && upgrade.effect) {
            if (upgrade.effect.clickPower) clickMult *= upgrade.effect.clickPower;
            if (upgrade.effect.productionMult) prodMult *= upgrade.effect.productionMult;
            if (upgrade.effect.autoClick) autoClicks += upgrade.effect.autoClick;
            if (upgrade.effect.toolEfficiency) toolMult *= upgrade.effect.toolEfficiency;
            if (upgrade.effect.globalMult) globalMult *= upgrade.effect.globalMult;
        }
    });

    // Relics
    gameState.relics.forEach(relicId => {
        const relic = GameDataHelper.getRelic(relicId);
        if (relic && relic.effect) {
            if (relic.effect.clickMult) clickMult *= relic.effect.clickMult;
            if (relic.effect.toolMult) toolMult *= relic.effect.toolMult;
            if (relic.effect.globalMult) globalMult *= relic.effect.globalMult;
            if (relic.effect.madnessMult) madnessMult *= relic.effect.madnessMult;
        }
    });

    // Prestige upgrades
    gameState.prestigeUpgrades.forEach(upgradeId => {
        const upgrade = GameDataHelper.getPrestigeUpgrade(upgradeId);
        if (upgrade && upgrade.effect) {
            if (upgrade.effect.prestigeMult) {
                globalMult *= 1 + (upgrade.effect.prestigeMult * gameState.prestiges);
            }
            if (upgrade.effect.toolEfficiency) toolMult *= upgrade.effect.toolEfficiency;
            if (upgrade.effect.clickMultPrestige) clickMultPrestige *= upgrade.effect.clickMultPrestige;
            if (upgrade.effect.globalMultPrestige) globalMultPrestige *= upgrade.effect.globalMultPrestige;
            if (upgrade.effect.productionMultPrestige) productionMultPrestige *= upgrade.effect.productionMultPrestige;
            if (upgrade.effect.madnessGainMult) madnessGainMult *= upgrade.effect.madnessGainMult;
        }
    });

    // Ascension upgrades (Cosmic Power bonuses)
    gameState.ascensionUpgrades.forEach(upgradeId => {
        const upgrade = ASCENSION_DATA.upgrades.find(u => u.id === upgradeId);
        if (upgrade && upgrade.effect) {
            if (upgrade.effect.clickPowerMult) clickMult *= upgrade.effect.clickPowerMult;
            if (upgrade.effect.productionMult) prodMult *= upgrade.effect.productionMult;
            if (upgrade.effect.madnessGain) madnessGainMult *= upgrade.effect.madnessGain;
            if (upgrade.effect.globalMult) globalMult *= upgrade.effect.globalMult;
            if (upgrade.effect.toolEfficiency) toolMult *= upgrade.effect.toolEfficiency;
            if (upgrade.effect.critChance) gameState.baseCritChance += upgrade.effect.critChance;
            if (upgrade.effect.critMultiplier) gameState.baseCritMultiplier += upgrade.effect.critMultiplier;
        }
    });

    gameState.clickMultiplier = clickMult * clickMultPrestige;
    gameState.productionMultiplier = prodMult * productionMultPrestige;
    gameState.toolEfficiencyMultiplier = toolMult;
    gameState.globalMultiplier = globalMult * globalMultPrestige;
    gameState.madnessMultiplier = madnessMult * madnessGainMult;
    gameState.autoClicksPerSecond = autoClicks;
}

// Calculate ore per click
function calculateOrePerClick() {
    const currentOre = GAME_DATA.ores[gameState.currentOreIndex];
    gameState.orePerClick = currentOre.baseValue * gameState.clickMultiplier * gameState.globalMultiplier;
}

// Calculate ore per second from tools
function calculateOrePerSecond() {
    let total = 0;

    for (const toolId in gameState.tools) {
        const level = gameState.tools[toolId];
        if (level > 0) {
            const production = GameDataHelper.getToolProduction(toolId, level);
            total += production;
        }
    }

    const currentOre = GAME_DATA.ores[gameState.currentOreIndex];
    total *= currentOre.baseValue;
    total *= gameState.productionMultiplier;
    total *= gameState.toolEfficiencyMultiplier;
    total *= gameState.globalMultiplier;

    // Add auto-clicks
    total += gameState.autoClicksPerSecond * gameState.orePerClick;

    gameState.orePerSecond = total;
}

// Update all calculations
function updateCalculations() {
    calculateMultipliers();
    calculateOrePerClick();
    calculateOrePerSecond();
}

// Add ore
function addOre(amount) {
    gameState.ore += amount;
    gameState.totalOre += amount;
    checkOreUnlocks();
}

// Check if new ores should be unlocked
function checkOreUnlocks() {
    for (let i = gameState.currentOreIndex + 1; i < GAME_DATA.ores.length; i++) {
        const ore = GAME_DATA.ores[i];
        if (gameState.totalOre >= ore.unlockAt) {
            gameState.currentOreIndex = i;
            showNotification(`New ore discovered: ${ore.name}!`);
        }
    }
}

// Click handler with critical hits
function handleClick() {
    let oreGained = gameState.orePerClick;
    let isCrit = false;

    // Check for critical hit
    if (Math.random() < gameState.baseCritChance) {
        oreGained *= gameState.baseCritMultiplier;
        isCrit = true;
        gameState.criticalHits++;
        gameState.currentCritStreak++;

        // Track consecutive crits
        if (gameState.currentCritStreak > gameState.consecutiveCrits) {
            gameState.consecutiveCrits = gameState.currentCritStreak;
        }
    } else {
        gameState.currentCritStreak = 0;
    }

    addOre(oreGained);
    gameState.totalClicks++;

    if (gameState.particles) {
        showDamageNumber(oreGained, isCrit);
        createClickEffect();
        createClickParticles(); // Add particle effects

        if (isCrit) {
            showCriticalHitEffect();
        }
    }

    checkAchievements();
    checkMissions();
    updateUI();
}

// Show floating damage number
function showDamageNumber(amount, isCrit = false) {
    const container = $('#damage-numbers');
    const number = $('<div class="damage-number">').text('+' + formatNumber(amount));

    if (isCrit) {
        number.addClass('critical-hit');
    }

    const x = Math.random() * 300 - 150;
    const y = Math.random() * 50 - 25;

    number.css({
        left: '50%',
        top: '50%',
        transform: `translate(${x}px, ${y}px)`
    });

    container.append(number);

    setTimeout(() => number.remove(), 1000);
}

// Show critical hit effect
function showCriticalHitEffect() {
    // Screen flash
    $('body').addClass('crit-flash');
    setTimeout(() => $('body').removeClass('crit-flash'), 150);

    // Explosion rings
    const container = $('#damage-numbers');
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const ring = $('<div class="crit-ring">');
            container.append(ring);
            setTimeout(() => ring.remove(), 600);
        }, i * 100);
    }
}

// Create click visual effect
function createClickEffect() {
    $('#ore-crystal').addClass('clicked');
    setTimeout(() => $('#ore-crystal').removeClass('clicked'), 100);
}

// Create click particles based on ore tier
function createClickParticles() {
    // Check if particles are enabled
    if (!gameState.particles) return;

    const currentOreIndex = gameState.currentOreIndex;
    const currentOre = GAME_DATA.ores[currentOreIndex];

    // Determine particle type and count based on ore tier
    let particleClass, particleSymbol, particleCount, energyLevel;

    if (currentOreIndex < 7) {
        // Common Metals (0-6): Dust
        particleClass = 'particle-dust';
        particleSymbol = 'particle-symbol-dust';
        particleCount = 3 + Math.floor(Math.random() * 3); // 3-5 particles
        energyLevel = 1;
    } else if (currentOreIndex < 14) {
        // Precious Metals (7-13): Rubble
        particleClass = 'particle-rubble';
        particleSymbol = 'particle-symbol-rubble';
        particleCount = 4 + Math.floor(Math.random() * 4); // 4-7 particles
        energyLevel = 1.2;
    } else if (currentOreIndex < 21) {
        // Gemstones (14-20): Small Sparks
        particleClass = 'particle-spark-small';
        particleSymbol = 'particle-symbol-spark';
        particleCount = 5 + Math.floor(Math.random() * 4); // 5-8 particles
        energyLevel = 1.5;
    } else if (currentOreIndex < 28) {
        // Rare Minerals (21-27): Medium Sparks
        particleClass = 'particle-spark-medium';
        particleSymbol = 'particle-symbol-star';
        particleCount = 6 + Math.floor(Math.random() * 5); // 6-10 particles
        energyLevel = 2;
    } else {
        // Eldritch Materials (28+): Intense Sparks
        particleClass = 'particle-spark-intense';
        particleSymbol = 'particle-symbol-energy';
        particleCount = 8 + Math.floor(Math.random() * 7); // 8-14 particles
        energyLevel = 3;
    }

    const container = $('#damage-numbers');

    // For eldritch materials, add energy ring effect
    if (currentOreIndex >= 28 && energyLevel >= 3) {
        const ring = $('<div class="eldritch-ring">')
            .css('color', currentOre.color);
        container.append(ring);
        setTimeout(() => ring.remove(), 600);
    }

    // Spawn particles
    for (let i = 0; i < particleCount; i++) {
        const particle = $('<div>')
            .addClass('click-particle')
            .addClass(particleClass)
            .addClass(particleSymbol);

        // Random explosion direction and distance
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = (50 + Math.random() * 100) * energyLevel;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance;
        const rotation = Math.random() * 720 - 360;

        // Add slight color variation for visual interest
        const colorVariation = 0.85 + Math.random() * 0.3; // 0.85 to 1.15

        // Set CSS custom properties for animation
        particle.css({
            left: '50%',
            top: '50%',
            '--px': `${px}px`,
            '--py': `${py}px`,
            '--rotation': `${rotation}deg`,
            color: currentOre.color,
            filter: `brightness(${colorVariation})`
        });

        // Stagger particle creation slightly
        setTimeout(() => {
            container.append(particle);
            // Remove after animation completes
            const duration = energyLevel > 2 ? 900 : 800;
            setTimeout(() => particle.remove(), duration);
        }, i * 15); // 15ms delay between each particle
    }
}

// Buy tool (level up)
function buyTool(toolId, levels = 1) {
    const tool = GameDataHelper.getTool(toolId);
    if (!tool) return false;

    const currentLevel = gameState.tools[toolId];

    // Check if tool is unlocked ONLY if it's at level 0 (first purchase)
    if (currentLevel === 0 && !GameDataHelper.isToolUnlocked(toolId, gameState.tools)) {
        return false;
    }

    // Can't exceed max level
    if (currentLevel >= MAX_TOOL_LEVEL) return false;

    // Calculate how many levels we can actually buy
    const maxLevels = Math.min(levels, MAX_TOOL_LEVEL - currentLevel);
    let totalCost = 0;

    // Calculate total cost for buying multiple levels
    for (let i = 0; i < maxLevels; i++) {
        totalCost += GameDataHelper.getToolCost(toolId, currentLevel + i);
    }

    if (gameState.ore >= totalCost) {
        gameState.ore -= totalCost;
        gameState.tools[toolId] += maxLevels;
        updateCalculations();
        checkMissions();
        updateUI();
        renderTools(); // Re-render tool list to show new level
        return true;
    }
    return false;
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const upgrade = GameDataHelper.getUpgrade(upgradeId);
    if (!upgrade) return;

    if (gameState.upgrades.includes(upgradeId)) return false;

    // Check requirement
    if (upgrade.requirement && !gameState.upgrades.includes(upgrade.requirement)) {
        return false;
    }

    if (gameState.ore >= upgrade.cost) {
        gameState.ore -= upgrade.cost;
        gameState.upgrades.push(upgradeId);
        updateCalculations();
        checkMissions();
        updateUI();
        renderUpgrades(); // Re-render upgrades list
        renderTools(); // Might affect tool unlocks due to efficiency upgrades
        return true;
    }
    return false;
}

// Buy relic
function buyRelic(relicId) {
    const relic = GameDataHelper.getRelic(relicId);
    if (!relic) return;

    if (gameState.relics.includes(relicId)) return false;

    if (gameState.ore >= relic.cost) {
        gameState.ore -= relic.cost;
        gameState.relics.push(relicId);
        updateCalculations();
        checkMissions();
        showNotification(`Relic acquired: ${relic.name}!`);
        updateUI();
        renderRelics(); // Re-render relics list
        renderTools(); // Relics affect production
        return true;
    }
    return false;
}

// Buy prestige upgrade
function buyPrestigeUpgrade(upgradeId) {
    const upgrade = GameDataHelper.getPrestigeUpgrade(upgradeId);
    if (!upgrade) return;

    if (gameState.prestigeUpgrades.includes(upgradeId)) return false;

    // Check requirement
    if (upgrade.requirement && !gameState.prestigeUpgrades.includes(upgrade.requirement)) {
        return false;
    }

    if (gameState.madness >= upgrade.cost) {
        gameState.madness -= upgrade.cost;
        gameState.totalMadnessSpent += upgrade.cost; // Track for ascension
        gameState.prestigeUpgrades.push(upgradeId);
        updateCalculations();
        updateUI();
        renderPrestigeUpgrades(); // Re-render prestige upgrades list
        renderTools(); // Prestige upgrades affect tool efficiency
        return true;
    }
    return false;
}

// Calculate madness gain on prestige
function calculateMadnessGain() {
    const baseMadness = Math.floor(Math.sqrt(gameState.totalOre / 1000000));
    return Math.floor(baseMadness * gameState.madnessMultiplier);
}

// Prestige
function prestige() {
    const madnessGain = calculateMadnessGain();

    if (madnessGain <= 0) {
        showNotification('You need more ore to gain madness!');
        return;
    }

    if (!confirm(`Are you sure you want to prestige?\n\nYou will gain ${madnessGain} Madness but lose all ore, tools, and upgrades.`)) {
        return;
    }

    // Reset
    gameState.ore = 0;
    gameState.totalOre = 0;
    gameState.totalClicks = 0;
    gameState.currentOreIndex = 0;

    // Reset all tool levels to 0
    GAME_DATA.tools.forEach(tool => {
        gameState.tools[tool.id] = 0;
    });

    gameState.upgrades = [];
    // Relics are kept - they persist through prestige!

    // Add madness and prestige count
    gameState.madness += madnessGain;
    gameState.prestiges++;

    // Apply starting ore from prestige upgrades
    gameState.prestigeUpgrades.forEach(upgradeId => {
        const upgrade = GameDataHelper.getPrestigeUpgrade(upgradeId);
        if (upgrade && upgrade.effect && upgrade.effect.startOre) {
            gameState.ore += upgrade.effect.startOre;
            gameState.totalOre += upgrade.effect.startOre;
        }
    });

    updateCalculations();
    checkAchievements();
    checkMissions();
    updateUI();
    renderAllLists(); // Re-render everything after prestige
    showNotification(`Prestige complete! Gained ${madnessGain} Madness!`);
}

// Calculate Cosmic Power gain on ascension
function calculateCosmicPowerGain() {
    return ASCENSION_DATA.calculateCosmicPower(gameState.totalMadnessSpent);
}

// Ascension (2nd prestige layer)
function ascend() {
    const cosmicGain = calculateCosmicPowerGain();

    if (cosmicGain <= 0) {
        showNotification('You need to spend more Madness to gain Cosmic Power!');
        return;
    }

    if (gameState.prestiges < ASCENSION_DATA.minPrestiges) {
        showNotification(`You need at least ${ASCENSION_DATA.minPrestiges} prestiges to ascend!`);
        return;
    }

    if (!confirm(`Are you sure you want to ASCEND?\n\nYou will gain ${cosmicGain} Cosmic Power but lose ALL Madness and restart all prestiges.\n\nRelics and Cosmic Upgrades are kept forever.`)) {
        return;
    }

    // Complete reset
    gameState.ore = 0;
    gameState.totalOre = 0;
    gameState.totalClicks = 0;
    gameState.currentOreIndex = 0;
    gameState.madness = 0;
    gameState.prestiges = 0;

    // Reset tools
    GAME_DATA.tools.forEach(tool => {
        gameState.tools[tool.id] = 0;
    });

    gameState.upgrades = [];
    gameState.prestigeUpgrades = [];
    // Relics and ascensionUpgrades persist!

    // Add cosmic power
    gameState.cosmicPower += cosmicGain;
    gameState.ascensions++;

    updateCalculations();
    checkAchievements();
    checkMissions();
    updateUI();
    renderAllLists();
    showNotification(`Ascension complete! Gained ${cosmicGain} Cosmic Power!`);
}

// Buy ascension upgrade
function buyAscensionUpgrade(upgradeId) {
    const upgrade = ASCENSION_DATA.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    // Check if already owned
    if (gameState.ascensionUpgrades.includes(upgradeId)) {
        return false;
    }

    // Check requirement
    if (upgrade.requirement && !gameState.ascensionUpgrades.includes(upgrade.requirement)) {
        showNotification(`Requires ${ASCENSION_DATA.upgrades.find(u => u.id === upgrade.requirement).name}`);
        return false;
    }

    // Check cost
    if (gameState.cosmicPower < upgrade.cost) {
        return false;
    }

    // Purchase
    gameState.cosmicPower -= upgrade.cost;
    gameState.ascensionUpgrades.push(upgradeId);

    updateCalculations();
    updateUI();
    renderAllLists();
    showNotification(`Purchased: ${upgrade.name}!`);
    return true;
}

// ========================================
// EXPEDITION SYSTEM
// ========================================

// Start an expedition
function startExpedition(expeditionId) {
    if (gameState.activeExpedition) {
        showNotification('An expedition is already in progress!');
        return false;
    }

    const expedition = EXPEDITION_DATA.expeditions.find(e => e.id === expeditionId);
    if (!expedition) return false;

    const now = Date.now();
    gameState.activeExpedition = {
        id: expeditionId,
        startTime: now,
        endTime: now + (expedition.duration * 1000)
    };

    updateUI();
    renderExpeditions();
    showNotification(`${expedition.name} has begun! Your workers will return in ${EXPEDITION_DATA.formatTimeRemaining(expedition.duration)}`);
    return true;
}

// Check if expedition is complete
function checkExpeditionCompletion() {
    if (!gameState.activeExpedition) return;

    const now = Date.now();
    if (now >= gameState.activeExpedition.endTime) {
        completeExpedition();
    }
}

// Complete expedition and grant rewards
function completeExpedition() {
    if (!gameState.activeExpedition) return;

    const expedition = EXPEDITION_DATA.expeditions.find(e => e.id === gameState.activeExpedition.id);
    if (!expedition) {
        gameState.activeExpedition = null;
        return;
    }

    const rewards = EXPEDITION_DATA.calculateRewards(expedition.id, gameState);

    // Grant ore reward
    gameState.ore += rewards.ore;
    gameState.totalOre += rewards.ore;

    // Grant madness reward (if applicable)
    if (rewards.madness > 0) {
        gameState.madness += rewards.madness;
    }

    // Check for relic discovery
    let relicFound = null;
    if (Math.random() < rewards.relicChance) {
        relicFound = EXPEDITION_DATA.selectRandomRelic(gameState, expedition.tier);
        if (relicFound) {
            gameState.relics.push(relicFound.id);
        }
    }

    // Track completion
    if (!gameState.expeditionCompletedIds) {
        gameState.expeditionCompletedIds = [];
    }
    gameState.expeditionCompletedIds.push(expedition.id);

    // Clear active expedition
    gameState.activeExpedition = null;

    // Build notification message
    let message = `Expedition complete!\n\n`;
    message += `Ore found: ${formatNumber(rewards.ore)}\n`;
    if (rewards.madness > 0) {
        message += `Madness gained: ${rewards.madness}\n`;
    }
    if (relicFound) {
        message += `\n🔮 RELIC DISCOVERED: ${relicFound.name}! 🔮`;
    } else {
        message += `\nNo relics found this time...`;
    }

    showNotification(message);

    // Show special relic notification
    if (relicFound) {
        showRelicDiscovery(relicFound);
    }

    updateCalculations();
    checkAchievements();
    updateUI();
    renderAllLists();
}

// Show relic discovery notification
function showRelicDiscovery(relic) {
    const notification = $('<div class="relic-discovery">').html(`
        <div class="relic-discovery-icon">🔮</div>
        <div class="relic-discovery-info">
            <div class="relic-discovery-title">RELIC DISCOVERED!</div>
            <div class="relic-discovery-name">${relic.name}</div>
            <div class="relic-discovery-desc">${relic.description}</div>
        </div>
    `);

    $('body').append(notification);

    setTimeout(() => {
        notification.addClass('show');
    }, 100);

    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Check and unlock achievements
function checkAchievements() {
    if (!gameState.achievements) {
        gameState.achievements = [];
    }

    ACHIEVEMENTS.forEach(achievement => {
        if (gameState.achievements.includes(achievement.id)) return; // Already unlocked

        let unlocked = false;
        const req = achievement.requirement;

        // Check different requirement types
        if (req.totalClicks && gameState.totalClicks >= req.totalClicks) unlocked = true;
        if (req.orePerClick && gameState.orePerClick >= req.orePerClick) unlocked = true;
        if (req.orePerSecond && gameState.orePerSecond >= req.orePerSecond) unlocked = true;
        if (req.criticalHits && gameState.criticalHits >= req.criticalHits) unlocked = true;
        if (req.consecutiveCrits && gameState.consecutiveCrits >= req.consecutiveCrits) unlocked = true;
        if (req.toolsPurchased) {
            let total = 0;
            Object.values(gameState.tools).forEach(level => total += level);
            if (total >= req.toolsPurchased) unlocked = true;
        }
        if (req.maxedTools) {
            let maxed = 0;
            Object.values(gameState.tools).forEach(level => { if (level >= 256) maxed++; });
            if (maxed >= req.maxedTools) unlocked = true;
        }
        if (req.toolsUnlocked) {
            let unlocked_count = 0;
            Object.keys(gameState.tools).forEach(id => { if (gameState.tools[id] > 0) unlocked_count++; });
            if (unlocked_count >= req.toolsUnlocked) unlocked = true;
        }
        if (req.prestiges && gameState.prestiges >= req.prestiges) unlocked = true;
        if (req.totalMadness && (gameState.madness + (gameState.prestiges * 10)) >= req.totalMadness) unlocked = true;
        if (req.totalOre && gameState.totalOre >= req.totalOre) unlocked = true;
        if (req.relicsOwned && gameState.relics.length >= req.relicsOwned) unlocked = true;
        if (req.upgradesOwned && gameState.upgrades.length >= req.upgradesOwned) unlocked = true;
        if (req.prestigeUpgradesOwned && gameState.prestigeUpgrades.length >= req.prestigeUpgradesOwned) unlocked = true;
        if (req.oreIndex && gameState.currentOreIndex >= req.oreIndex) unlocked = true;

        if (unlocked) {
            gameState.achievements.push(achievement.id);
            showAchievementUnlock(achievement);
            calculateMultipliers(); // Recalculate bonuses
        }
    });
}

// Show achievement unlock notification
function showAchievementUnlock(achievement) {
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);

    const notification = $('<div class="achievement-popup">').html(`
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `);

    $('body').append(notification);

    setTimeout(() => {
        notification.addClass('show');
    }, 100);

    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Check and complete missions
function checkMissions() {
    GAME_DATA.missions.forEach(mission => {
        if (gameState.missions[mission.id]) return; // Already completed

        let completed = false;

        if (mission.requirement.clicks && gameState.totalClicks >= mission.requirement.clicks) {
            completed = true;
        } else if (mission.requirement.totalOre && gameState.totalOre >= mission.requirement.totalOre) {
            completed = true;
        } else if (mission.requirement.toolsPurchased) {
            let totalLevels = 0;
            for (const toolId in gameState.tools) {
                totalLevels += gameState.tools[toolId];
            }
            if (totalLevels >= mission.requirement.toolsPurchased) {
                completed = true;
            }
        } else if (mission.requirement.upgradesPurchased && gameState.upgrades.length >= mission.requirement.upgradesPurchased) {
            completed = true;
        } else if (mission.requirement.relicsPurchased && gameState.relics.length >= mission.requirement.relicsPurchased) {
            completed = true;
        } else if (mission.requirement.prestiges && gameState.prestiges >= mission.requirement.prestiges) {
            completed = true;
        } else if (mission.requirement.oreIndex !== undefined && gameState.currentOreIndex >= mission.requirement.oreIndex) {
            completed = true;
        }

        if (completed) {
            gameState.missions[mission.id] = true;

            // Give rewards
            if (mission.reward.ore) {
                gameState.ore += mission.reward.ore;
                gameState.totalOre += mission.reward.ore;
            }
            if (mission.reward.madness) {
                gameState.madness += mission.reward.madness;
            }

            showNotification(`Mission completed: ${mission.name}!`);
        }
    });
}

// Show notification
function showNotification(message) {
    // Simple console notification for now
    console.log('🌑 ' + message);

    // Could add a proper notification UI later
    const notification = $('<div>').text(message).css({
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--accent-purple)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 0 20px var(--glow-purple)',
        zIndex: 10000,
        animation: 'slideIn 0.3s ease-out'
    });

    $('body').append(notification);

    setTimeout(() => {
        notification.fadeOut(300, () => notification.remove());
    }, 3000);
}

// Game loop (runs every 100ms)
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - gameState.lastTick) / 1000; // Convert to seconds
    gameState.lastTick = now;

    // Add passive ore production
    if (gameState.orePerSecond > 0) {
        addOre(gameState.orePerSecond * deltaTime);
    }

    // Check for autosave
    if (gameState.autoSave && now - gameState.lastSave > 30000) { // Every 30 seconds
        saveGame();
        gameState.lastSave = now;
    }

    // Check expedition completion
    checkExpeditionCompletion();

    updateUI();
}

// Update UI
function updateUI() {
    const currentOre = GAME_DATA.ores[gameState.currentOreIndex];

    // Update desktop stats
    $('#current-ore').text(currentOre.name).css('color', currentOre.color);
    $('#ore-description').text(currentOre.description);
    $('#ore-count').text(formatNumber(gameState.ore));
    $('#ore-per-click').text(formatNumber(gameState.orePerClick));
    $('#ore-per-second').text(formatNumber(gameState.orePerSecond));
    $('#madness-count').text(formatNumber(gameState.madness));
    $('#prestige-count').text(gameState.prestiges);
    $('#total-clicks').text(formatNumber(gameState.totalClicks));
    $('#total-ore').text(formatNumber(gameState.totalOre));

    // Update mobile stats bar
    $('#mobile-ore-count').text(formatNumber(gameState.ore));
    $('#mobile-current-ore').text(currentOre.name.split(' ')[0]); // Just first word (e.g., "Iron")
    $('#mobile-ore-per-second').text(formatNumber(gameState.orePerSecond));
    $('#mobile-madness-count').text(formatNumber(gameState.madness));

    // Update prestige info (both desktop and mobile)
    const madnessGain = calculateMadnessGain();
    $('#madness-on-prestige, #mobile-madness-on-prestige').text(formatNumber(madnessGain));
    const madnessMult = 1 + (gameState.prestiges * 0.1);
    $('#madness-multiplier, #mobile-madness-multiplier').text(madnessMult.toFixed(1) + 'x');

    // Enable/disable prestige button (both desktop and mobile)
    $('#prestige-btn, #mobile-prestige-btn').prop('disabled', madnessGain <= 0);

    // Update ascension info
    const cosmicGain = calculateCosmicPowerGain();
    $('#cosmic-on-ascension').text(cosmicGain);
    $('#cosmic-power').text(formatNumber(gameState.cosmicPower));
    $('#ascension-prestiges').text(gameState.prestiges);
    $('#ascension-btn').prop('disabled', cosmicGain <= 0 || gameState.prestiges < ASCENSION_DATA.minPrestiges);

    // Show/hide ascension tab (unlock at 10 prestiges)
    if (gameState.prestiges >= ASCENSION_DATA.minPrestiges) {
        $('#ascension-tab-btn').show();
    }

    // Update expedition progress if active
    if (gameState.activeExpedition) {
        const expedition = EXPEDITION_DATA.expeditions.find(e => e.id === gameState.activeExpedition.id);
        if (expedition) {
            const now = Date.now();
            const remaining = Math.max(0, gameState.activeExpedition.endTime - now);
            const progress = 1 - (remaining / (expedition.duration * 1000));

            $('#expedition-progress-fill').css('width', (progress * 100) + '%');
            $('#expedition-time-remaining').text(`Time Remaining: ${EXPEDITION_DATA.formatTimeRemaining(remaining / 1000)}`);
        }
    }

    // Update crystal SVG based on current ore
    updateCrystalSVG(currentOre);

    // Update crystal color (kept for backward compatibility)
    $('.crystal-core').css('color', currentOre.color);
    $('.crystal-glow').css('background', `radial-gradient(circle, ${currentOre.color}40 0%, transparent 70%)`);

    // Update theme colors based on current ore
    updateThemeColor(currentOre.color, currentOre.textColor);

    // Update button states (enable/disable based on resources)
    updateButtonStates();
}

// Update crystal SVG display
function updateCrystalSVG(currentOre) {
    const crystalCore = $('.crystal-core');

    // Generate SVG for current ore
    const svgContent = CrystalSVG.generate(currentOre.id, currentOre.color, gameState.currentOreIndex);

    // Replace the emoji symbol with SVG
    crystalCore.html(svgContent);
}

// Update global theme color based on ore
function updateThemeColor(oreColor, textColor) {
    // Convert hex to rgba for glow effect
    const r = parseInt(oreColor.slice(1, 3), 16);
    const g = parseInt(oreColor.slice(3, 5), 16);
    const b = parseInt(oreColor.slice(5, 7), 16);
    const oreGlow = `rgba(${r}, ${g}, ${b}, 0.3)`;

    // Update CSS custom properties
    document.documentElement.style.setProperty('--ore-color', oreColor);
    document.documentElement.style.setProperty('--ore-glow', oreGlow);
    document.documentElement.style.setProperty('--ore-text-color', textColor || '#FFFFFF');
}

// Update button states based on current resources
function updateButtonStates() {
    // Update tool buy buttons
    GAME_DATA.tools.forEach(tool => {
        const level = gameState.tools[tool.id];
        const isMaxed = level >= MAX_TOOL_LEVEL;

        if (!isMaxed) {
            // Find the +1 button for this tool
            const cost1 = GameDataHelper.getToolCost(tool.id, level);
            $(`#tools-list .tool-card`).each(function() {
                const cardText = $(this).find('.item-name').text();
                if (cardText.includes(tool.name)) {
                    $(this).find('.buy-btn').first().prop('disabled', gameState.ore < cost1);

                    // +10 button
                    let cost10 = 0;
                    const maxLevels = Math.min(10, MAX_TOOL_LEVEL - level);
                    for (let i = 0; i < maxLevels; i++) {
                        cost10 += GameDataHelper.getToolCost(tool.id, level + i);
                    }
                    $(this).find('.buy-btn').eq(1).prop('disabled', gameState.ore < cost10 || maxLevels === 0);
                }
            });
        }
    });

    // Update upgrade buy buttons
    GAME_DATA.upgrades.forEach(upgrade => {
        const owned = gameState.upgrades.includes(upgrade.id);
        const locked = upgrade.requirement && !gameState.upgrades.includes(upgrade.requirement);

        if (!owned && !locked) {
            $(`#upgrades-list .item-card`).each(function() {
                const cardText = $(this).find('.item-name').text();
                if (cardText === upgrade.name) {
                    $(this).find('.buy-btn').prop('disabled', gameState.ore < upgrade.cost);
                }
            });
        }
    });

    // Update relic buy buttons
    GAME_DATA.relics.forEach(relic => {
        const owned = gameState.relics.includes(relic.id);

        if (!owned) {
            $(`#relics-list .item-card`).each(function() {
                const cardText = $(this).find('.item-name').text();
                if (cardText.includes(relic.name)) {
                    $(this).find('.buy-btn').prop('disabled', gameState.ore < relic.cost);
                }
            });
        }
    });

    // Update prestige upgrade buy buttons
    GAME_DATA.prestigeUpgrades.forEach(upgrade => {
        const owned = gameState.prestigeUpgrades.includes(upgrade.id);

        if (!owned) {
            $(`#prestige-upgrades-list .item-card`).each(function() {
                const cardText = $(this).find('.item-name').text();
                if (cardText === upgrade.name) {
                    $(this).find('.buy-btn').prop('disabled', gameState.madness < upgrade.cost);
                }
            });
        }
    });
}

// Render tools list
function renderTools() {
    const container = $('#tools-list');
    const mobileContainer = $('#mobile-tools-list');
    container.empty();
    mobileContainer.empty();

    GAME_DATA.tools.forEach(tool => {
        const level = gameState.tools[tool.id];
        const isUnlocked = GameDataHelper.isToolUnlocked(tool.id, gameState.tools);
        const isMaxed = level >= MAX_TOOL_LEVEL;
        const rarity = getRarityForLevel(level);

        // Hide locked tools - only show unlocked tools
        if (!isUnlocked) {
            return; // Skip rendering this tool
        }

        const card = $('<div class="item-card tool-card">');

        // Max level status
        if (isMaxed) {
            card.addClass('maxed');
        }

        // Header with name and level
        const header = $('<div class="item-header">');
        const nameSpan = $('<span class="item-name">').text(`${tool.icon} ${tool.name}`);

        // Color by rarity
        if (level > 0) {
            nameSpan.css('color', rarity.color);
        }

        header.append(nameSpan);

        // Level and rarity display
        const levelInfo = $('<span class="item-level">');
        if (isMaxed) {
            levelInfo.text(`Lv ${level}/${MAX_TOOL_LEVEL} MAX`);
            levelInfo.css('color', '#FFD700');
        } else {
            levelInfo.text(`Lv ${level}/${MAX_TOOL_LEVEL} - ${rarity.name}`);
            if (level > 0) {
                levelInfo.css('color', rarity.color);
            }
        }
        header.append(levelInfo);

        const description = $('<div class="item-description">').text(tool.description);

        // Production and cost
        if (!isMaxed) {
            const production = GameDataHelper.getToolProduction(tool.id, level);
            const totalProduction = production * GAME_DATA.ores[gameState.currentOreIndex].baseValue *
                                   gameState.productionMultiplier * gameState.toolEfficiencyMultiplier *
                                   gameState.globalMultiplier;

            const cost = GameDataHelper.getToolCost(tool.id, level);

            const stats = $('<div class="item-stats">');
            if (level > 0) {
                stats.append($('<span class="item-production">').text(`+${formatNumber(totalProduction)}/s`));
            } else {
                stats.append($('<span class="item-production">').text(`First level`));
            }
            stats.append($('<span class="item-cost">').text(`💰 ${formatNumber(cost)}`));

            // Level up buttons
            const buyBtn = $('<button class="buy-btn">').text('Level +1');
            buyBtn.prop('disabled', gameState.ore < cost);
            buyBtn.on('click', () => buyTool(tool.id, 1));

            const buy10Btn = $('<button class="buy-btn">').text('Level +10').css('margin-top', '5px');
            let cost10 = 0;
            const maxLevels = Math.min(10, MAX_TOOL_LEVEL - level);
            for (let i = 0; i < maxLevels; i++) {
                cost10 += GameDataHelper.getToolCost(tool.id, level + i);
            }
            buy10Btn.prop('disabled', gameState.ore < cost10 || maxLevels === 0);
            buy10Btn.on('click', () => buyTool(tool.id, 10));

            // Progress bar to next rarity
            const progressBar = createRarityProgressBar(level);

            card.append(header, description, stats, progressBar, buyBtn, buy10Btn);
        } else {
            // Maxed
            card.append(header, description);
            const maxMessage = $('<div class="item-description">').text('✨ Maximum Level Reached! ✨').css({
                'color': '#FFD700',
                'text-align': 'center',
                'font-weight': 'bold'
            });
            card.append(maxMessage);
        }

        container.append(card);
        mobileContainer.append(card.clone(true)); // Clone with events for mobile
    });
}

// Create progress bar to next rarity tier
function createRarityProgressBar(currentLevel) {
    const currentRarity = getRarityForLevel(currentLevel);

    // Find next rarity
    let nextRarity = null;
    let nextThreshold = MAX_TOOL_LEVEL;

    if (currentLevel < RARITY_TIERS.UNCOMMON.requiredLevel) {
        nextRarity = RARITY_TIERS.UNCOMMON;
        nextThreshold = RARITY_TIERS.UNCOMMON.requiredLevel;
    } else if (currentLevel < RARITY_TIERS.RARE.requiredLevel) {
        nextRarity = RARITY_TIERS.RARE;
        nextThreshold = RARITY_TIERS.RARE.requiredLevel;
    } else if (currentLevel < RARITY_TIERS.EPIC.requiredLevel) {
        nextRarity = RARITY_TIERS.EPIC;
        nextThreshold = RARITY_TIERS.EPIC.requiredLevel;
    } else if (currentLevel < RARITY_TIERS.LEGENDARY.requiredLevel) {
        nextRarity = RARITY_TIERS.LEGENDARY;
        nextThreshold = RARITY_TIERS.LEGENDARY.requiredLevel;
    } else if (currentLevel < RARITY_TIERS.MYTHICAL.requiredLevel) {
        nextRarity = RARITY_TIERS.MYTHICAL;
        nextThreshold = RARITY_TIERS.MYTHICAL.requiredLevel;
    }

    const progressContainer = $('<div class="rarity-progress">');

    if (nextRarity) {
        const prevThreshold = currentRarity.requiredLevel;
        const range = nextThreshold - prevThreshold;
        const progress = currentLevel - prevThreshold;
        const percentage = Math.min(100, (progress / range) * 100);

        const progressBarOuter = $('<div class="progress-bar-outer">');
        const progressBarInner = $('<div class="progress-bar-inner">').css({
            'width': percentage + '%',
            'background': `linear-gradient(90deg, ${currentRarity.color}, ${nextRarity.color})`
        });

        const progressText = $('<div class="progress-text">').text(
            `${currentLevel}/${nextThreshold} to ${nextRarity.name}`
        );

        progressBarOuter.append(progressBarInner);
        progressContainer.append(progressBarOuter, progressText);
    } else {
        const progressText = $('<div class="progress-text">').text('Maximum Rarity!').css('color', '#FFD700');
        progressContainer.append(progressText);
    }

    return progressContainer;
}

// Render upgrades list
function renderUpgrades() {
    const container = $('#upgrades-list');
    const mobileContainer = $('#mobile-upgrades-list');
    container.empty();
    mobileContainer.empty();

    GAME_DATA.upgrades.forEach(upgrade => {
        const owned = gameState.upgrades.includes(upgrade.id);
        const locked = upgrade.requirement && !gameState.upgrades.includes(upgrade.requirement);

        // Hide locked upgrades - only show owned or available to buy
        if (locked) {
            return; // Skip rendering this upgrade
        }

        const card = $('<div class="item-card">');
        if (owned) card.addClass('maxed');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(upgrade.name));
        if (owned) header.append($('<span class="item-level">').text('✓ Owned'));

        const description = $('<div class="item-description">').text(upgrade.description);

        const buyBtn = $('<button class="buy-btn">');
        if (owned) {
            buyBtn.text('Purchased').prop('disabled', true);
        } else {
            buyBtn.text(`Buy - 💰 ${formatNumber(upgrade.cost)}`);
            buyBtn.prop('disabled', gameState.ore < upgrade.cost);
            buyBtn.on('click', () => buyUpgrade(upgrade.id));
        }

        card.append(header, description, buyBtn);
        container.append(card);
        mobileContainer.append(card.clone(true));
    });
}

// Render relics list
function renderRelics() {
    const container = $('#relics-list');
    const mobileContainer = $('#mobile-relics-list');
    container.empty();
    mobileContainer.empty();

    // Only show discovered relics
    const discoveredRelics = GAME_DATA.relics.filter(relic => gameState.relics.includes(relic.id));

    if (discoveredRelics.length === 0) {
        const emptyMessage = $('<div class="empty-list-message">').html(`
            <p>🗺️ No relics discovered yet...</p>
            <p>Send expeditions to uncover ancient artifacts!</p>
        `);
        container.append(emptyMessage);
        mobileContainer.append(emptyMessage.clone());
        return;
    }

    discoveredRelics.forEach(relic => {
        const card = $('<div class="item-card">');
        card.addClass('maxed'); // All shown relics are owned

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(`🔮 ${relic.name}`));
        header.append($('<span class="item-level">').text('✓ Discovered'));

        const description = $('<div class="item-description">').text(relic.description);

        card.append(header, description);
        container.append(card);
        mobileContainer.append(card.clone(true));
    });
}

// Render prestige upgrades list
function renderPrestigeUpgrades() {
    const container = $('#prestige-upgrades-list');
    const mobileContainer = $('#mobile-prestige-upgrades-list');
    container.empty();
    mobileContainer.empty();

    GAME_DATA.prestigeUpgrades.forEach(upgrade => {
        const owned = gameState.prestigeUpgrades.includes(upgrade.id);
        const locked = upgrade.requirement && !gameState.prestigeUpgrades.includes(upgrade.requirement);

        // Hide locked prestige upgrades - only show owned or available to buy
        if (locked) {
            return; // Skip rendering this upgrade
        }

        const card = $('<div class="item-card">');
        if (owned) card.addClass('maxed');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(upgrade.name));
        if (owned) header.append($('<span class="item-level">').text('✓ Owned'));

        const description = $('<div class="item-description">').text(upgrade.description);

        const buyBtn = $('<button class="buy-btn">');
        if (owned) {
            buyBtn.text('Purchased').prop('disabled', true);
        } else {
            buyBtn.text(`Buy - 🌑 ${formatNumber(upgrade.cost)} Madness`);
            buyBtn.prop('disabled', gameState.madness < upgrade.cost);
            buyBtn.on('click', () => buyPrestigeUpgrade(upgrade.id));
        }

        card.append(header, description, buyBtn);
        container.append(card);
        mobileContainer.append(card.clone(true));
    });
}

// Render ascension upgrades list
function renderAscensionUpgrades() {
    const container = $('#ascension-upgrades-list');
    container.empty();

    // Group by tier
    const tiers = [1, 2, 3, 4];
    tiers.forEach(tier => {
        const tierUpgrades = ASCENSION_DATA.upgrades.filter(u => u.tier === tier);
        if (tierUpgrades.length === 0) return;

        const tierHeader = $('<div class="tier-header">').text(`Tier ${tier}`);
        container.append(tierHeader);

        tierUpgrades.forEach(upgrade => {
            const owned = gameState.ascensionUpgrades.includes(upgrade.id);
            const locked = upgrade.requirement && !gameState.ascensionUpgrades.includes(upgrade.requirement);

            // Hide locked ascension upgrades - only show owned or available to buy
            if (locked) {
                return; // Skip rendering this upgrade
            }

            const card = $('<div class="item-card">');
            if (owned) card.addClass('maxed');

            const header = $('<div class="item-header">');
            header.append($('<span class="item-icon">').text(upgrade.icon));
            header.append($('<span class="item-name">').text(upgrade.name));
            if (owned) header.append($('<span class="item-level">').text('✓ Owned'));

            const description = $('<div class="item-description">').text(upgrade.description);

            const buyBtn = $('<button class="buy-btn">');
            if (owned) {
                buyBtn.text('Purchased').prop('disabled', true);
            } else {
                buyBtn.text(`Buy - 🌌 ${upgrade.cost} Cosmic Power`);
                buyBtn.prop('disabled', gameState.cosmicPower < upgrade.cost);
                buyBtn.on('click', () => buyAscensionUpgrade(upgrade.id));
            }

            card.append(header, description, buyBtn);
            container.append(card);
        });
    });
}

// Render expeditions list
function renderExpeditions() {
    const container = $('#expedition-list');
    container.empty();

    const activeExpedition = $('#active-expedition');

    if (gameState.activeExpedition) {
        // Show active expedition
        activeExpedition.show();

        const expedition = EXPEDITION_DATA.expeditions.find(e => e.id === gameState.activeExpedition.id);
        const now = Date.now();
        const remaining = Math.max(0, gameState.activeExpedition.endTime - now);
        const progress = 1 - (remaining / (expedition.duration * 1000));

        $('#expedition-name').text(`${expedition.icon} ${expedition.name}`);
        $('#expedition-progress-fill').css('width', (progress * 100) + '%');
        $('#expedition-time-remaining').text(`Time Remaining: ${EXPEDITION_DATA.formatTimeRemaining(remaining / 1000)}`);
    } else {
        // Hide active expedition display
        activeExpedition.hide();

        // Show available expeditions
        EXPEDITION_DATA.expeditions.forEach(expedition => {
            const rewards = EXPEDITION_DATA.calculateRewards(expedition.id, gameState);

            const card = $('<div class="item-card expedition-card">');

            const header = $('<div class="item-header">');
            header.append($('<span class="item-name">').text(`${expedition.icon} ${expedition.name}`));
            header.append($('<span class="item-level">').text(EXPEDITION_DATA.formatTimeRemaining(expedition.duration)));

            const description = $('<div class="item-description">').text(expedition.description);

            // Rewards display
            const rewardsDiv = $('<div class="expedition-rewards">');
            rewardsDiv.append($('<div>').html(`💰 <strong>${formatNumber(rewards.ore)}</strong> ore`));
            if (rewards.madness > 0) {
                rewardsDiv.append($('<div>').html(`🌑 <strong>${rewards.madness}</strong> madness`));
            }
            rewardsDiv.append($('<div>').html(`🔮 <strong>${Math.floor(rewards.relicChance * 100)}%</strong> relic chance`));

            const startBtn = $('<button class="buy-btn expedition-btn">').text('Launch Expedition');
            startBtn.on('click', () => startExpedition(expedition.id));

            card.append(header, description, rewardsDiv, startBtn);
            container.append(card);
        });
    }
}

// Render missions list
function renderMissions() {
    const container = $('#missions-list');
    const mobileContainer = $('#mobile-missions-list');
    container.empty();
    mobileContainer.empty();

    GAME_DATA.missions.forEach(mission => {
        const completed = gameState.missions[mission.id];

        const card = $('<div class="item-card">');
        if (completed) card.addClass('maxed');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(mission.name));
        if (completed) header.append($('<span class="item-level">').text('✓ Complete'));

        const description = $('<div class="item-description">').text(mission.description);

        let rewardText = 'Reward: ';
        if (mission.reward.ore) rewardText += `${formatNumber(mission.reward.ore)} Ore `;
        if (mission.reward.madness) rewardText += `${formatNumber(mission.reward.madness)} Madness `;

        const reward = $('<div class="item-description">').text(rewardText).css('color', 'var(--accent-gold)');

        card.append(header, description, reward);
        container.append(card);
        mobileContainer.append(card.clone(true));
    });
}

// Render all lists
function renderAllLists() {
    renderTools();
    renderUpgrades();
    renderRelics();
    renderExpeditions();
    renderPrestigeUpgrades();
    renderAscensionUpgrades();
    renderMissions();
}

// Save game
function saveGame() {
    // Don't save if we're in the middle of resetting
    if (isResetting) {
        console.log('Save blocked - reset in progress');
        return;
    }

    const saveData = {
        version: '1.0',
        state: gameState
    };

    try {
        localStorage.setItem('eldritchExcavation_save', JSON.stringify(saveData));
        console.log('Game saved!');
    } catch (e) {
        console.error('Failed to save game:', e);
    }
}

// Load game
function loadGame() {
    try {
        const saveData = localStorage.getItem('eldritchExcavation_save');
        if (!saveData) return false;

        const parsed = JSON.parse(saveData);

        // Merge saved state into current state
        Object.assign(gameState, parsed.state);

        gameState.lastTick = Date.now();
        gameState.lastSave = Date.now();

        updateCalculations();
        console.log('Game loaded!');
        return true;
    } catch (e) {
        console.error('Failed to load game:', e);
        return false;
    }
}

// Reset game
function resetGame() {
    if (!confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
        return;
    }

    // Set flag to prevent auto-save during reset
    isResetting = true;

    // Clear localStorage
    localStorage.removeItem('eldritchExcavation_save');

    // Reload immediately (auto-save is now blocked by isResetting flag)
    location.reload();
}

// Initialize game
function initGame() {
    console.log('🌑 Eldritch Excavation - Initializing...');

    // Initialize tools if not already set (all start at level 0)
    if (Object.keys(gameState.tools).length === 0) {
        GAME_DATA.tools.forEach(tool => {
            gameState.tools[tool.id] = 0;
        });
    }

    // Initialize missions if not already set
    if (Object.keys(gameState.missions).length === 0) {
        GAME_DATA.missions.forEach(mission => {
            gameState.missions[mission.id] = false;
        });
    }

    // Try to load saved game
    const loaded = loadGame();

    if (!loaded) {
        console.log('No save found, starting new game...');
        updateCalculations();
    }

    // Set up UI
    renderAllLists();
    updateUI();

    // Set up event listeners
    setupEventListeners();

    // Start game loop
    setInterval(gameLoop, 100); // Run 10 times per second

    console.log('🌑 Eldritch Excavation - Ready!');
}

// Set up mobile drawer functionality
function setupMobileDrawer() {
    const drawer = $('#mobile-drawer');
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    // Initially closed
    drawer.addClass('drawer-closed');

    // Handle tap/click
    $('#drawer-handle').on('click', function(e) {
        if (!isDragging) {
            drawer.toggleClass('drawer-open drawer-closed');
        }
    });

    // Handle touch drag
    $('#drawer-handle').on('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = false;
    });

    $('#drawer-handle').on('touchmove', function(e) {
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        if (Math.abs(deltaY) > 10) {
            isDragging = true;
            e.preventDefault();
        }
    });

    $('#drawer-handle').on('touchend', function(e) {
        if (isDragging) {
            const deltaY = currentY - startY;

            if (deltaY > 50) {
                // Swipe down - close drawer
                drawer.removeClass('drawer-open').addClass('drawer-closed');
            } else if (deltaY < -50) {
                // Swipe up - open drawer
                drawer.removeClass('drawer-closed').addClass('drawer-open');
            }
        }
        isDragging = false;
    });
}

// Set up event listeners
function setupEventListeners() {
    // Main click
    $('#ore-crystal').on('click', handleClick);

    // Desktop tab navigation
    $('.tab-btn').on('click', function() {
        const tabName = $(this).data('tab');

        // Update buttons
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        // Update content
        $('.tab-content').removeClass('active');
        $(`#${tabName}-tab`).addClass('active');

        // Re-render the active tab
        renderAllLists();
    });

    // Mobile tab navigation
    $('.mobile-tab-btn').on('click', function() {
        const tabName = $(this).data('tab');

        // Update buttons
        $('.mobile-tab-btn').removeClass('active');
        $(this).addClass('active');

        // Update content
        $('.mobile-tab-content').removeClass('active');
        $(`#mobile-${tabName}-tab`).addClass('active');

        // Update drawer handle text
        const tabText = $(this).text().trim();
        $('#drawer-current-tab').text(tabText);

        // Re-render the active tab
        renderAllLists();
    });

    // Mobile drawer toggle
    setupMobileDrawer();

    // Prestige button (both desktop and mobile)
    $('#prestige-btn, #mobile-prestige-btn').on('click', prestige);

    // Ascension button
    $('#ascension-btn').on('click', ascend);

    // Desktop footer buttons
    $('#save-btn').on('click', () => {
        saveGame();
        showNotification('Game saved manually!');
    });

    $('#settings-btn').on('click', () => {
        $('#settings-modal').removeClass('hidden');
    });

    $('#reset-btn').on('click', resetGame);

    // Mobile footer buttons
    $('#mobile-save-btn').on('click', () => {
        saveGame();
        showNotification('Game saved manually!');
    });

    $('#mobile-settings-btn').on('click', () => {
        $('#settings-modal').removeClass('hidden');
    });

    $('#mobile-reset-btn').on('click', resetGame);

    // Settings modal
    $('#close-settings').on('click', () => {
        $('#settings-modal').addClass('hidden');
    });

    $('#auto-save-toggle').on('change', function() {
        gameState.autoSave = $(this).prop('checked');
    });

    $('#particles-toggle').on('change', function() {
        gameState.particles = $(this).prop('checked');
    });

    $('#sound-toggle').on('change', function() {
        gameState.sound = $(this).prop('checked');
    });

    // Click outside modal to close
    $('#settings-modal').on('click', function(e) {
        if (e.target === this) {
            $(this).addClass('hidden');
        }
    });

    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Space to click
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            handleClick();
        }

        // S to save
        if (e.code === 'KeyS' && e.ctrlKey) {
            e.preventDefault();
            saveGame();
            showNotification('Game saved!');
        }
    });
}

// Start the game when DOM is ready
$(document).ready(function() {
    initGame();
});

// Auto-save before page unload
$(window).on('beforeunload', function() {
    saveGame();
});

// Developer helper function to test particles at different ore tiers
// Usage in console: testParticles(oreIndex)
window.testParticles = function(oreIndex) {
    if (oreIndex >= 0 && oreIndex < GAME_DATA.ores.length) {
        gameState.currentOreIndex = oreIndex;
        const ore = GAME_DATA.ores[oreIndex];
        console.log(`Testing particles for: ${ore.name} (Tier ${oreIndex})`);
        updateUI();
        createClickParticles();
    } else {
        console.log(`Invalid ore index. Valid range: 0-${GAME_DATA.ores.length - 1}`);
    }
};

// Developer helper to list all ore tiers
window.listOres = function() {
    console.log('Ore Tiers:');
    GAME_DATA.ores.forEach((ore, index) => {
        console.log(`${index}: ${ore.name} - ${ore.color}`);
    });
};

// Developer helper to test crystal designs
window.testCrystal = function(oreIndex) {
    if (oreIndex >= 0 && oreIndex < GAME_DATA.ores.length) {
        gameState.currentOreIndex = oreIndex;
        const ore = GAME_DATA.ores[oreIndex];
        console.log(`Displaying crystal for: ${ore.name} (Tier ${oreIndex})`);
        updateUI();
    } else {
        console.log(`Invalid ore index. Valid range: 0-${GAME_DATA.ores.length - 1}`);
    }
};

// Developer helper to cycle through all crystals
window.cycleAllCrystals = function(delayMs = 2000) {
    let index = 0;
    const interval = setInterval(() => {
        if (index >= GAME_DATA.ores.length) {
            clearInterval(interval);
            console.log('Crystal showcase complete!');
            return;
        }
        testCrystal(index);
        index++;
    }, delayMs);
};
