// Eldritch Excavation - Main Game Logic

// Game State
const gameState = {
    ore: 0,
    totalOre: 0,
    totalClicks: 0,
    madness: 0,
    prestiges: 0,
    currentOreIndex: 0,
    
    tools: {}, // { toolId: count }
    upgrades: [], // [upgradeId, ...]
    relics: [], // [relicId, ...]
    prestigeUpgrades: [], // [upgradeId, ...]
    missions: {}, // { missionId: completed }
    
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

// Initialize tools
GAME_DATA.tools.forEach(tool => {
    gameState.tools[tool.id] = 0;
});

// Initialize missions
GAME_DATA.missions.forEach(mission => {
    gameState.missions[mission.id] = false;
});

// Number formatting
function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';
    return (num / 1000000000000000).toFixed(2) + 'Q';
}

// Calculate multipliers from upgrades and relics
function calculateMultipliers() {
    let clickMult = 1;
    let prodMult = 1;
    let toolMult = 1;
    let globalMult = 1;
    let madnessMult = 1;
    let autoClicks = 0;
    let clickMultPrestige = 1;
    
    // Upgrades
    gameState.upgrades.forEach(upgradeId => {
        const upgrade = GameDataHelper.getUpgrade(upgradeId);
        if (upgrade && upgrade.effect) {
            if (upgrade.effect.clickPower) clickMult *= upgrade.effect.clickPower;
            if (upgrade.effect.productionMult) prodMult *= upgrade.effect.productionMult;
            if (upgrade.effect.autoClick) autoClicks += upgrade.effect.autoClick;
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
        }
    });
    
    gameState.clickMultiplier = clickMult * clickMultPrestige;
    gameState.productionMultiplier = prodMult;
    gameState.toolEfficiencyMultiplier = toolMult;
    gameState.globalMultiplier = globalMult;
    gameState.madnessMultiplier = madnessMult;
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
        const count = gameState.tools[toolId];
        if (count > 0) {
            const production = GameDataHelper.getToolProduction(toolId, count);
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

// Click handler
function handleClick() {
    addOre(gameState.orePerClick);
    gameState.totalClicks++;

    if (gameState.particles) {
        showDamageNumber(gameState.orePerClick);
        createClickEffect();
    }

    checkMissions();
    updateUI();
}

// Show floating damage number
function showDamageNumber(amount) {
    const container = $('#damage-numbers');
    const number = $('<div class="damage-number">').text('+' + formatNumber(amount));

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

// Create click visual effect
function createClickEffect() {
    $('#ore-crystal').addClass('clicked');
    setTimeout(() => $('#ore-crystal').removeClass('clicked'), 100);
}

// Buy tool
function buyTool(toolId, amount = 1) {
    const tool = GameDataHelper.getTool(toolId);
    if (!tool) return;

    const currentLevel = gameState.tools[toolId];
    let totalCost = 0;

    // Calculate total cost for buying multiple
    for (let i = 0; i < amount; i++) {
        totalCost += GameDataHelper.getToolCost(toolId, currentLevel + i);
    }

    if (gameState.ore >= totalCost) {
        gameState.ore -= totalCost;
        gameState.tools[toolId] += amount;
        updateCalculations();
        checkMissions();
        updateUI();
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
        gameState.prestigeUpgrades.push(upgradeId);
        updateCalculations();
        updateUI();
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

    GAME_DATA.tools.forEach(tool => {
        gameState.tools[tool.id] = 0;
    });

    gameState.upgrades = [];
    // Relics are kept!

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
    checkMissions();
    updateUI();
    showNotification(`Prestige complete! Gained ${madnessGain} Madness!`);
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
            let totalTools = 0;
            for (const toolId in gameState.tools) {
                totalTools += gameState.tools[toolId];
            }
            if (totalTools >= mission.requirement.toolsPurchased) {
                completed = true;
            }
        } else if (mission.requirement.upgradesPurchased && gameState.upgrades.length >= mission.requirement.upgradesPurchased) {
            completed = true;
        } else if (mission.requirement.relicsPurchased && gameState.relics.length >= mission.requirement.relicsPurchased) {
            completed = true;
        } else if (mission.requirement.prestiges && gameState.prestiges >= mission.requirement.prestiges) {
            completed = true;
        }

        if (completed) {
            gameState.missions[mission.id] = true;

            // Give rewards
            if (mission.reward.ore) {
                gameState.ore += mission.reward.ore;
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

    updateUI();
}

// Update UI
function updateUI() {
    const currentOre = GAME_DATA.ores[gameState.currentOreIndex];

    // Update stats
    $('#current-ore').text(currentOre.name).css('color', currentOre.color);
    $('#ore-description').text(currentOre.description);
    $('#ore-count').text(formatNumber(gameState.ore));
    $('#ore-per-click').text(formatNumber(gameState.orePerClick));
    $('#ore-per-second').text(formatNumber(gameState.orePerSecond));
    $('#madness-count').text(formatNumber(gameState.madness));
    $('#prestige-count').text(gameState.prestiges);
    $('#total-clicks').text(formatNumber(gameState.totalClicks));
    $('#total-ore').text(formatNumber(gameState.totalOre));

    // Update prestige info
    const madnessGain = calculateMadnessGain();
    $('#madness-on-prestige').text(formatNumber(madnessGain));
    const madnessMult = 1 + (gameState.prestiges * 0.1);
    $('#madness-multiplier').text(madnessMult.toFixed(1) + 'x');

    // Enable/disable prestige button
    $('#prestige-btn').prop('disabled', madnessGain <= 0);

    // Update crystal color
    $('.crystal-core').css('color', currentOre.color);
    $('.crystal-glow').css('background', `radial-gradient(circle, ${currentOre.color}40 0%, transparent 70%)`);
}

// Render tools list
function renderTools() {
    const container = $('#tools-list');
    container.empty();

    GAME_DATA.tools.forEach(tool => {
        const count = gameState.tools[tool.id];
        const cost = GameDataHelper.getToolCost(tool.id, count);
        const production = GameDataHelper.getToolProduction(tool.id, count);
        const totalProduction = production * GAME_DATA.ores[gameState.currentOreIndex].baseValue *
                               gameState.productionMultiplier * gameState.toolEfficiencyMultiplier *
                               gameState.globalMultiplier;

        const card = $('<div class="item-card">');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(`${tool.icon} ${tool.name}`));
        header.append($('<span class="item-level">').text(`Level ${count}`));

        const description = $('<div class="item-description">').text(tool.description);

        const stats = $('<div class="item-stats">');
        stats.append($('<span class="item-production">').text(`+${formatNumber(totalProduction)}/s`));
        stats.append($('<span class="item-cost">').text(`💰 ${formatNumber(cost)}`));

        const buyBtn = $('<button class="buy-btn">').text('Buy 1');
        buyBtn.prop('disabled', gameState.ore < cost);
        buyBtn.on('click', () => buyTool(tool.id, 1));

        const buy10Btn = $('<button class="buy-btn">').text('Buy 10').css('margin-top', '5px');
        let cost10 = 0;
        for (let i = 0; i < 10; i++) {
            cost10 += GameDataHelper.getToolCost(tool.id, count + i);
        }
        buy10Btn.prop('disabled', gameState.ore < cost10);
        buy10Btn.on('click', () => buyTool(tool.id, 10));

        card.append(header, description, stats, buyBtn, buy10Btn);
        container.append(card);
    });
}

// Render upgrades list
function renderUpgrades() {
    const container = $('#upgrades-list');
    container.empty();

    GAME_DATA.upgrades.forEach(upgrade => {
        const owned = gameState.upgrades.includes(upgrade.id);
        const locked = upgrade.requirement && !gameState.upgrades.includes(upgrade.requirement);

        const card = $('<div class="item-card">');
        if (owned) card.addClass('maxed');
        if (locked) card.addClass('locked');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(upgrade.name));
        if (owned) header.append($('<span class="item-level">').text('✓ Owned'));

        const description = $('<div class="item-description">').text(upgrade.description);

        const buyBtn = $('<button class="buy-btn">');
        if (owned) {
            buyBtn.text('Purchased').prop('disabled', true);
        } else if (locked) {
            buyBtn.text('Locked').prop('disabled', true);
        } else {
            buyBtn.text(`Buy - 💰 ${formatNumber(upgrade.cost)}`);
            buyBtn.prop('disabled', gameState.ore < upgrade.cost);
            buyBtn.on('click', () => buyUpgrade(upgrade.id));
        }

        card.append(header, description, buyBtn);
        container.append(card);
    });
}

// Render relics list
function renderRelics() {
    const container = $('#relics-list');
    container.empty();

    GAME_DATA.relics.forEach(relic => {
        const owned = gameState.relics.includes(relic.id);

        const card = $('<div class="item-card">');
        if (owned) card.addClass('maxed');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(`🔮 ${relic.name}`));
        if (owned) header.append($('<span class="item-level">').text('✓ Owned'));

        const description = $('<div class="item-description">').text(relic.description);

        const buyBtn = $('<button class="buy-btn">');
        if (owned) {
            buyBtn.text('Discovered').prop('disabled', true);
        } else {
            buyBtn.text(`Discover - 💰 ${formatNumber(relic.cost)}`);
            buyBtn.prop('disabled', gameState.ore < relic.cost);
            buyBtn.on('click', () => buyRelic(relic.id));
        }

        card.append(header, description, buyBtn);
        container.append(card);
    });
}

// Render prestige upgrades list
function renderPrestigeUpgrades() {
    const container = $('#prestige-upgrades-list');
    container.empty();

    GAME_DATA.prestigeUpgrades.forEach(upgrade => {
        const owned = gameState.prestigeUpgrades.includes(upgrade.id);
        const locked = upgrade.requirement && !gameState.prestigeUpgrades.includes(upgrade.requirement);

        const card = $('<div class="item-card">');
        if (owned) card.addClass('maxed');
        if (locked) card.addClass('locked');

        const header = $('<div class="item-header">');
        header.append($('<span class="item-name">').text(upgrade.name));
        if (owned) header.append($('<span class="item-level">').text('✓ Owned'));

        const description = $('<div class="item-description">').text(upgrade.description);

        const buyBtn = $('<button class="buy-btn">');
        if (owned) {
            buyBtn.text('Purchased').prop('disabled', true);
        } else if (locked) {
            buyBtn.text('Locked').prop('disabled', true);
        } else {
            buyBtn.text(`Buy - 🌑 ${formatNumber(upgrade.cost)} Madness`);
            buyBtn.prop('disabled', gameState.madness < upgrade.cost);
            buyBtn.on('click', () => buyPrestigeUpgrade(upgrade.id));
        }

        card.append(header, description, buyBtn);
        container.append(card);
    });
}

// Render missions list
function renderMissions() {
    const container = $('#missions-list');
    container.empty();

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
    });
}

// Render all lists
function renderAllLists() {
    renderTools();
    renderUpgrades();
    renderRelics();
    renderPrestigeUpgrades();
    renderMissions();
}

// Save game
function saveGame() {
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

    localStorage.removeItem('eldritchExcavation_save');
    location.reload();
}

// Initialize game
function initGame() {
    console.log('🌑 Eldritch Excavation - Initializing...');

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

// Set up event listeners
function setupEventListeners() {
    // Main click
    $('#ore-crystal').on('click', handleClick);

    // Tab navigation
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

    // Prestige button
    $('#prestige-btn').on('click', prestige);

    // Footer buttons
    $('#save-btn').on('click', () => {
        saveGame();
        showNotification('Game saved manually!');
    });

    $('#settings-btn').on('click', () => {
        $('#settings-modal').removeClass('hidden');
    });

    $('#reset-btn').on('click', resetGame);

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
