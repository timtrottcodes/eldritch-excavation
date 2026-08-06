// Crystal SVG Generation System
// Generates unique SVG crystals for each ore type

const CrystalSVG = {
    // Generate SVG based on ore ID
    generate(oreId, oreColor, oreIndex) {
        const generators = {
            // Tier 1: Common Metals (0-6) - Simple geometric shapes
            'iron': () => this.createSimpleHexagon(oreColor),
            'copper': () => this.createSimplePentagon(oreColor),
            'zinc': () => this.createSimpleOctagon(oreColor),
            'tin': () => this.createSimpleDiamond(oreColor),
            'lead': () => this.createSimpleSquare(oreColor),
            'nickel': () => this.createSimpleTriangle(oreColor),
            'aluminum': () => this.createSimpleStar5(oreColor),

            // Tier 2: Precious Metals (7-13) - Faceted gems
            'silver': () => this.createFacetedGem(oreColor, 6),
            'gold': () => this.createFacetedGem(oreColor, 8),
            'platinum': () => this.createFacetedCrystal(oreColor, 6),
            'palladium': () => this.createFacetedCrystal(oreColor, 8),
            'rhodium': () => this.createMultiFaceted(oreColor, 6),
            'iridium': () => this.createMultiFaceted(oreColor, 8),
            'osmium': () => this.createComplexFaceted(oreColor),

            // Tier 3: Gemstones (14-20) - Brilliant cuts
            'garnet': () => this.createBrilliantCut(oreColor, 'round'),
            'amethyst': () => this.createBrilliantCut(oreColor, 'pointed'),
            'ruby': () => this.createBrilliantCut(oreColor, 'elongated'),
            'sapphire': () => this.createBrilliantCut(oreColor, 'square'),
            'emerald': () => this.createBrilliantCut(oreColor, 'rectangular'),
            'diamond': () => this.createBrilliantCut(oreColor, 'brilliant'),
            'alexandrite': () => this.createBrilliantCut(oreColor, 'cushion'),

            // Tier 4: Rare Minerals (21-27) - Geode formations
            'painite': () => this.createGeode(oreColor, 'simple'),
            'benitoite': () => this.createGeode(oreColor, 'clustered'),
            'taaffeite': () => this.createGeode(oreColor, 'radial'),
            'meteorite': () => this.createGeode(oreColor, 'jagged'),
            'obsidian': () => this.createGeode(oreColor, 'sharp'),
            'moldavite': () => this.createGeode(oreColor, 'organic'),
            'carborundum': () => this.createGeode(oreColor, 'crystalline'),

            // Tier 5: Eldritch Materials (28-34) - Void energy cores
            'voidstone': () => this.createVoidCore(oreColor, 'basic'),
            'starmetal': () => this.createVoidCore(oreColor, 'stellar'),
            'darkmatter': () => this.createVoidCore(oreColor, 'dark'),
            'timecrystal': () => this.createVoidCore(oreColor, 'temporal'),
            'phase_matter': () => this.createVoidCore(oreColor, 'phased'),
            'reality_shard': () => this.createVoidCore(oreColor, 'fractured'),
            'elder_essence': () => this.createVoidCore(oreColor, 'ancient'),
            'azathoth_core': () => this.createVoidCore(oreColor, 'ultimate'),
        };

        const generator = generators[oreId];
        if (generator) {
            return generator();
        }
        
        // Fallback
        return this.createSimpleHexagon(oreColor);
    },

    // Helper to create SVG container
    createSVG(content, viewBox = "0 0 200 200") {
        return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="crystal-svg">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="crystalGradient">
                    <stop offset="0%" style="stop-color:white;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:currentColor;stop-opacity:1"/>
                </radialGradient>
            </defs>
            ${content}
        </svg>`;
    },

    // Tier 1: Simple Shapes
    createSimpleHexagon(color) {
        const points = "100,30 160,65 160,135 100,170 40,135 40,65";
        return this.createSVG(`
            <polygon points="${points}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="3" opacity="0.9"/>
            <polygon points="${points}" fill="url(#crystalGradient)" opacity="0.3"/>
        `);
    },

    createSimplePentagon(color) {
        const points = "100,30 170,85 140,160 60,160 30,85";
        return this.createSVG(`
            <polygon points="${points}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="3" opacity="0.9"/>
            <polygon points="${points}" fill="url(#crystalGradient)" opacity="0.3"/>
        `);
    },

    createSimpleOctagon(color) {
        const points = "100,30 145,45 170,90 170,110 145,155 100,170 55,155 30,110 30,90 55,45";
        return this.createSVG(`
            <polygon points="${points}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="3" opacity="0.9"/>
            <polygon points="${points}" fill="url(#crystalGradient)" opacity="0.3"/>
        `);
    },

    createSimpleDiamond(color) {
        const points = "100,30 170,100 100,170 30,100";
        return this.createSVG(`
            <polygon points="${points}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="3" opacity="0.9"/>
            <polygon points="${points}" fill="url(#crystalGradient)" opacity="0.3"/>
        `);
    },

    createSimpleSquare(color) {
        return this.createSVG(`
            <rect x="40" y="40" width="120" height="120" fill="${color}" stroke="${this.lighten(color)}" 
                  stroke-width="3" transform="rotate(45 100 100)" opacity="0.9"/>
            <rect x="40" y="40" width="120" height="120" fill="url(#crystalGradient)" 
                  transform="rotate(45 100 100)" opacity="0.3"/>
        `);
    },

    createSimpleTriangle(color) {
        const points = "100,30 170,170 30,170";
        return this.createSVG(`
            <polygon points="${points}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="3" opacity="0.9"/>
            <polygon points="${points}" fill="url(#crystalGradient)" opacity="0.3"/>
        `);
    },

    createSimpleStar5(color) {
        const points = "100,20 115,75 170,75 125,110 145,165 100,130 55,165 75,110 30,75 85,75";
        return this.createSVG(`
            <polygon points="${points}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="3" opacity="0.9"/>
            <polygon points="${points}" fill="url(#crystalGradient)" opacity="0.3"/>
        `);
    },

    // Tier 2: Faceted Gems
    createFacetedGem(color, sides) {
        const centerPoints = this.generatePolygon(100, 100, 40, sides);
        const outerPoints = this.generatePolygon(100, 100, 70, sides);

        let facets = '';
        for (let i = 0; i < sides; i++) {
            const next = (i + 1) % sides;
            facets += `<polygon points="100,100 ${centerPoints[i]} ${outerPoints[i]} ${outerPoints[next]}"
                       fill="${color}" stroke="${this.lighten(color)}" stroke-width="1.5" opacity="${0.7 + Math.random() * 0.2}"/>`;
        }

        return this.createSVG(`
            <circle cx="100" cy="100" r="75" fill="${color}" opacity="0.3"/>
            ${facets}
            <circle cx="100" cy="100" r="40" fill="url(#crystalGradient)" opacity="0.5"/>
        `);
    },

    createFacetedCrystal(color, facets) {
        const points = this.generatePolygon(100, 100, 70, facets);
        let paths = `<polygon points="${points.join(' ')}" fill="${color}" stroke="${this.lighten(color)}" stroke-width="2" opacity="0.8"/>`;

        // Add inner facets
        for (let i = 0; i < facets; i++) {
            const next = (i + 1) % facets;
            paths += `<line x1="100" y1="100" x2="${points[i].split(',')[0]}" y2="${points[i].split(',')[1]}"
                      stroke="white" stroke-width="1" opacity="0.3"/>`;
        }

        return this.createSVG(`
            ${paths}
            <circle cx="100" cy="100" r="25" fill="white" opacity="0.5"/>
        `);
    },

    createMultiFaceted(color, sides) {
        const outer = this.generatePolygon(100, 100, 75, sides);
        const mid = this.generatePolygon(100, 100, 50, sides);
        const inner = this.generatePolygon(100, 100, 25, sides);

        return this.createSVG(`
            <polygon points="${outer.join(' ')}" fill="${color}" opacity="0.5" stroke="${this.lighten(color)}" stroke-width="2"/>
            <polygon points="${mid.join(' ')}" fill="${color}" opacity="0.7" stroke="${this.lighten(color)}" stroke-width="2"/>
            <polygon points="${inner.join(' ')}" fill="${color}" opacity="0.9" stroke="white" stroke-width="1.5"/>
            <circle cx="100" cy="100" r="15" fill="white" opacity="0.7"/>
        `);
    },

    createComplexFaceted(color) {
        return this.createSVG(`
            <polygon points="100,25 130,55 130,85 100,115 70,85 70,55" fill="${color}" opacity="0.7"/>
            <polygon points="100,115 130,85 160,100 130,145 100,130" fill="${color}" opacity="0.8"/>
            <polygon points="100,115 70,85 40,100 70,145 100,130" fill="${color}" opacity="0.8"/>
            <polygon points="100,130 130,145 100,175 70,145" fill="${color}" opacity="0.9"/>
            <circle cx="100" cy="80" r="20" fill="white" opacity="0.5"/>
        `);
    },

    // Tier 3: Brilliant Cuts
    createBrilliantCut(color, style) {
        const styles = {
            'round': this.createRoundBrilliant(color),
            'pointed': this.createPointedBrilliant(color),
            'elongated': this.createElongatedBrilliant(color),
            'square': this.createSquareBrilliant(color),
            'rectangular': this.createRectangularBrilliant(color),
            'brilliant': this.createClassicBrilliant(color),
            'cushion': this.createCushionBrilliant(color),
        };
        return styles[style] || styles['round'];
    },

    createRoundBrilliant(color) {
        let facets = '';
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x = 100 + Math.cos(angle) * 70;
            const y = 100 + Math.sin(angle) * 70;
            facets += `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="white" stroke-width="2" opacity="0.4"/>`;
        }

        return this.createSVG(`
            <circle cx="100" cy="100" r="75" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            ${facets}
            <circle cx="100" cy="100" r="50" fill="${color}" opacity="0.9"/>
            <circle cx="100" cy="100" r="30" fill="white" opacity="0.6"/>
            <circle cx="80" cy="80" r="10" fill="white" opacity="0.9"/>
        `);
    },

    createPointedBrilliant(color) {
        return this.createSVG(`
            <polygon points="100,20 140,80 120,140 80,140 60,80" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            <polygon points="100,40 120,80 100,120 80,80" fill="${color}" opacity="0.95"/>
            <polygon points="100,60 110,80 100,100 90,80" fill="white" opacity="0.7"/>
            <circle cx="95" cy="70" r="5" fill="white" opacity="1"/>
        `);
    },

    createElongatedBrilliant(color) {
        return this.createSVG(`
            <ellipse cx="100" cy="100" rx="50" ry="75" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            <ellipse cx="100" cy="100" rx="35" ry="55" fill="${color}" opacity="0.9"/>
            <ellipse cx="100" cy="100" rx="20" ry="35" fill="white" opacity="0.6"/>
            <ellipse cx="95" cy="85" rx="8" ry="12" fill="white" opacity="0.9"/>
        `);
    },

    createSquareBrilliant(color) {
        return this.createSVG(`
            <rect x="30" y="30" width="140" height="140" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            <rect x="50" y="50" width="100" height="100" fill="${color}" opacity="0.9"/>
            <rect x="70" y="70" width="60" height="60" fill="white" opacity="0.6"/>
            <rect x="75" y="75" width="15" height="15" fill="white" opacity="1"/>
        `);
    },

    createRectangularBrilliant(color) {
        return this.createSVG(`
            <rect x="40" y="30" width="120" height="140" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            <rect x="60" y="50" width="80" height="100" fill="${color}" opacity="0.9"/>
            <rect x="75" y="70" width="50" height="60" fill="white" opacity="0.6"/>
            <rect x="85" y="85" width="10" height="15" fill="white" opacity="1"/>
        `);
    },

    createClassicBrilliant(color) {
        return this.createSVG(`
            <polygon points="100,30 140,70 150,110 130,150 70,150 50,110 60,70" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            <polygon points="100,50 125,80 130,110 115,135 85,135 70,110 75,80" fill="${color}" opacity="0.95"/>
            <polygon points="100,70 110,90 110,105 100,115 90,105 90,90" fill="white" opacity="0.7"/>
            <circle cx="95" cy="85" r="6" fill="white" opacity="1"/>
        `);
    },

    createCushionBrilliant(color) {
        return this.createSVG(`
            <rect x="30" y="30" width="140" height="140" rx="30" ry="30" fill="${color}" opacity="0.8" filter="url(#glow)"/>
            <rect x="50" y="50" width="100" height="100" rx="20" ry="20" fill="${color}" opacity="0.9"/>
            <rect x="70" y="70" width="60" height="60" rx="10" ry="10" fill="white" opacity="0.6"/>
            <circle cx="90" cy="85" r="8" fill="white" opacity="1"/>
        `);
    },

    // Tier 4: Geode Formations
    createGeode(color, style) {
        const styles = {
            'simple': this.createSimpleGeode(color),
            'clustered': this.createClusteredGeode(color),
            'radial': this.createRadialGeode(color),
            'jagged': this.createJaggedGeode(color),
            'sharp': this.createSharpGeode(color),
            'organic': this.createOrganicGeode(color),
            'crystalline': this.createCrystallineGeode(color),
        };
        return styles[style] || styles['simple'];
    },

    createSimpleGeode(color) {
        return this.createSVG(`
            <ellipse cx="100" cy="100" rx="80" ry="75" fill="#444" opacity="0.6"/>
            <ellipse cx="100" cy="100" rx="70" ry="65" fill="${color}" opacity="0.4"/>
            <polygon points="100,40 110,60 105,75 95,75 90,60" fill="${color}" opacity="0.9"/>
            <polygon points="85,70 95,85 90,100 80,100 75,85" fill="${color}" opacity="0.85"/>
            <polygon points="115,70 125,85 120,100 110,100 105,85" fill="${color}" opacity="0.85"/>
            <polygon points="100,90 110,110 105,125 95,125 90,110" fill="${color}" opacity="0.9"/>
            <circle cx="100" cy="75" r="8" fill="white" opacity="0.7"/>
        `);
    },

    createClusteredGeode(color) {
        let crystals = '';
        const positions = [[80,60], [100,50], [120,60], [70,90], [100,85], [130,90], [85,120], [115,120]];
        positions.forEach(([x, y]) => {
            const size = 10 + Math.random() * 15;
            crystals += `<polygon points="${x},${y-size} ${x+size*0.4},${y} ${x},${y+size*0.8} ${x-size*0.4},${y}"
                         fill="${color}" stroke="white" stroke-width="0.5" opacity="${0.8 + Math.random()*0.2}"/>`;
        });

        return this.createSVG(`
            <circle cx="100" cy="100" r="85" fill="#333" opacity="0.5"/>
            <circle cx="100" cy="100" r="75" fill="${color}" opacity="0.3"/>
            ${crystals}
        `);
    },

    createRadialGeode(color) {
        let crystals = '';
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x = 100 + Math.cos(angle) * 60;
            const y = 100 + Math.sin(angle) * 60;
            const dx = Math.cos(angle) * 25;
            const dy = Math.sin(angle) * 25;
            crystals += `<polygon points="${x},${y} ${x+dy*0.3},${y-dx*0.3} ${x+dx},${y+dy} ${x-dy*0.3},${y+dx*0.3}"
                         fill="${color}" stroke="white" stroke-width="0.5" opacity="0.85"/>`;
        }

        return this.createSVG(`
            <circle cx="100" cy="100" r="90" fill="#2a2a2a" opacity="0.6"/>
            <circle cx="100" cy="100" r="65" fill="${color}" opacity="0.4"/>
            ${crystals}
            <circle cx="100" cy="100" r="20" fill="white" opacity="0.5"/>
        `);
    },

    createJaggedGeode(color) {
        return this.createSVG(`
            <polygon points="100,20 120,40 140,30 150,60 170,70 160,100 170,130 140,150 120,170 100,160 80,170 60,150 30,130 40,100 30,70 50,60 60,30 80,40"
                     fill="#1a1a1a" opacity="0.7"/>
            <polygon points="100,45 115,60 125,55 135,75 120,90 125,110 110,125 100,115 90,125 75,110 80,90 65,75 75,55 85,60"
                     fill="${color}" opacity="0.5"/>
            <polygon points="100,60 108,75 105,85 95,85 92,75" fill="${color}" opacity="0.95" filter="url(#glow)"/>
            <polygon points="85,80 93,95 90,105 80,105 77,95" fill="${color}" opacity="0.9"/>
            <polygon points="115,80 123,95 120,105 110,105 107,95" fill="${color}" opacity="0.9"/>
            <polygon points="100,100 108,115 105,125 95,125 92,115" fill="${color}" opacity="0.95" filter="url(#glow)"/>
        `);
    },

    createSharpGeode(color) {
        return this.createSVG(`
            <polygon points="100,20 130,50 160,60 155,95 175,120 140,145 100,175 60,145 25,120 45,95 40,60 70,50"
                     fill="#0a0a0a" opacity="0.8"/>
            <polygon points="100,35 120,55 100,80 80,55" fill="${color}" opacity="0.95" filter="url(#glow)"/>
            <polygon points="100,80 120,100 100,125 80,100" fill="${color}" opacity="0.9" filter="url(#glow)"/>
            <polygon points="70,75 85,90 70,110 55,90" fill="${color}" opacity="0.85"/>
            <polygon points="130,75 145,90 130,110 115,90" fill="${color}" opacity="0.85"/>
            <polygon points="100,125 115,140 100,160 85,140" fill="${color}" opacity="0.9" filter="url(#glow)"/>
            <polygon points="100,50 105,65 100,75 95,65" fill="white" opacity="0.8"/>
        `);
    },

    createOrganicGeode(color) {
        return this.createSVG(`
            <path d="M 100,20 Q 140,30 160,70 Q 170,100 155,135 Q 130,165 100,175 Q 70,165 45,135 Q 30,100 40,70 Q 60,30 100,20 Z"
                  fill="#222" opacity="0.6"/>
            <path d="M 100,40 Q 125,45 140,75 Q 145,100 130,125 Q 110,145 100,150 Q 90,145 70,125 Q 55,100 60,75 Q 75,45 100,40 Z"
                  fill="${color}" opacity="0.4"/>
            <ellipse cx="90" cy="70" rx="8" ry="15" fill="${color}" opacity="0.9" transform="rotate(-20 90 70)"/>
            <ellipse cx="110" cy="75" rx="10" ry="18" fill="${color}" opacity="0.95" transform="rotate(15 110 75)" filter="url(#glow)"/>
            <ellipse cx="85" cy="100" rx="7" ry="12" fill="${color}" opacity="0.85" transform="rotate(-30 85 100)"/>
            <ellipse cx="115" cy="105" rx="9" ry="14" fill="${color}" opacity="0.9" transform="rotate(25 115 105)"/>
            <ellipse cx="100" cy="125" rx="11" ry="16" fill="${color}" opacity="0.95" filter="url(#glow)"/>
        `);
    },

    createCrystallineGeode(color) {
        return this.createSVG(`
            <polygon points="100,25 135,45 160,85 155,125 125,160 75,160 45,125 40,85 65,45"
                     fill="#1a1a2a" opacity="0.7"/>
            <polygon points="100,45 120,60 115,85 85,85 80,60" fill="${color}" opacity="0.95" filter="url(#glow)"/>
            <polygon points="75,75 90,90 85,110 65,105 60,90" fill="${color}" opacity="0.9"/>
            <polygon points="125,75 140,90 135,105 115,110 110,90" fill="${color}" opacity="0.9"/>
            <polygon points="100,95 115,110 110,130 90,130 85,110" fill="${color}" opacity="0.95" filter="url(#glow)"/>
            <polygon points="70,115 85,130 80,145 65,140 60,125" fill="${color}" opacity="0.85"/>
            <polygon points="130,115 140,125 135,140 120,145 115,130" fill="${color}" opacity="0.85"/>
            <polygon points="100,135 110,145 105,155 95,155 90,145" fill="${color}" opacity="0.9" filter="url(#glow)"/>
            <circle cx="100" cy="70" r="5" fill="white" opacity="0.9"/>
        `);
    },

    // Tier 5: Void Energy Cores
    createVoidCore(color, style) {
        const styles = {
            'basic': this.createBasicVoid(color),
            'stellar': this.createStellarVoid(color),
            'dark': this.createDarkVoid(color),
            'temporal': this.createTemporalVoid(color),
            'phased': this.createPhasedVoid(color),
            'fractured': this.createFracturedVoid(color),
            'ancient': this.createAncientVoid(color),
            'ultimate': this.createUltimateVoid(color),
        };
        return styles[style] || styles['basic'];
    },

    createBasicVoid(color) {
        return this.createSVG(`
            <defs>
                <radialGradient id="voidGrad1">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
                    <stop offset="70%" style="stop-color:${color};stop-opacity:0.4"/>
                    <stop offset="100%" style="stop-color:#000;stop-opacity:0.1"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="url(#voidGrad1)" filter="url(#glow)"/>
            <circle cx="100" cy="100" r="60" fill="${color}" opacity="0.3"/>
            <circle cx="100" cy="100" r="40" fill="${color}" opacity="0.6" class="void-pulse"/>
            <circle cx="100" cy="100" r="20" fill="${color}" opacity="0.9" class="void-pulse"/>
            <circle cx="100" cy="100" r="8" fill="white" opacity="0.8" class="void-core"/>
        `);
    },

    createStellarVoid(color) {
        let stars = '';
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const x = 100 + Math.cos(angle) * 50;
            const y = 100 + Math.sin(angle) * 50;
            stars += `<circle cx="${x}" cy="${y}" r="3" fill="white" opacity="0.8"/>`;
            stars += `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1" opacity="0.4"/>`;
        }

        return this.createSVG(`
            <defs>
                <radialGradient id="stellarGrad">
                    <stop offset="0%" style="stop-color:white;stop-opacity:0.8"/>
                    <stop offset="30%" style="stop-color:${color};stop-opacity:0.6"/>
                    <stop offset="100%" style="stop-color:#000;stop-opacity:0"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#stellarGrad)" filter="url(#glow)"/>
            ${stars}
            <circle cx="100" cy="100" r="25" fill="${color}" opacity="0.8" class="void-pulse"/>
            <circle cx="100" cy="100" r="12" fill="white" opacity="0.9" class="void-core"/>
        `);
    },

    createDarkVoid(color) {
        return this.createSVG(`
            <defs>
                <radialGradient id="darkGrad">
                    <stop offset="0%" style="stop-color:#000;stop-opacity:1"/>
                    <stop offset="40%" style="stop-color:${color};stop-opacity:0.8"/>
                    <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="${color}" opacity="0.2" filter="url(#glow)"/>
            <circle cx="100" cy="100" r="70" fill="url(#darkGrad)" class="void-rotate"/>
            <circle cx="100" cy="100" r="45" fill="#000" opacity="0.9"/>
            <circle cx="100" cy="100" r="30" fill="${color}" opacity="0.6" class="void-pulse"/>
            <circle cx="100" cy="100" r="15" fill="${color}" opacity="0.9"/>
            <circle cx="100" cy="100" r="5" fill="white" opacity="1" class="void-core"/>
        `);
    },

    createTemporalVoid(color) {
        let timeRings = '';
        for (let i = 0; i < 5; i++) {
            const r = 30 + i * 12;
            timeRings += `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${color}"
                          stroke-width="1.5" opacity="${0.3 - i * 0.05}" stroke-dasharray="5,5" class="time-ring-${i}"/>`;
        }

        return this.createSVG(`
            <defs>
                <radialGradient id="timeGrad">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
                    <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
                </radialGradient>
            </defs>
            ${timeRings}
            <circle cx="100" cy="100" r="35" fill="url(#timeGrad)" filter="url(#glow)" class="void-pulse"/>
            <circle cx="100" cy="100" r="18" fill="${color}" opacity="0.8"/>
            <circle cx="100" cy="100" r="10" fill="white" opacity="0.9" class="void-core"/>
        `);
    },

    createPhasedVoid(color) {
        return this.createSVG(`
            <defs>
                <radialGradient id="phaseGrad">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.9"/>
                    <stop offset="50%" style="stop-color:${color};stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#phaseGrad)" class="phase-layer-1"/>
            <circle cx="100" cy="100" r="60" fill="url(#phaseGrad)" class="phase-layer-2"/>
            <circle cx="100" cy="100" r="40" fill="url(#phaseGrad)" class="phase-layer-3"/>
            <circle cx="100" cy="100" r="25" fill="${color}" opacity="0.9" class="void-pulse"/>
            <circle cx="100" cy="100" r="12" fill="white" opacity="0.95" class="void-core"/>
            <circle cx="90" cy="90" r="4" fill="white" opacity="0.8"/>
        `);
    },

    createFracturedVoid(color) {
        let fractures = '';
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 100 + Math.cos(angle) * 20;
            const y1 = 100 + Math.sin(angle) * 20;
            const x2 = 100 + Math.cos(angle) * 80;
            const y2 = 100 + Math.sin(angle) * 80;
            fractures += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                          stroke="${color}" stroke-width="2" opacity="0.6" class="fracture-${i % 3}"/>`;
        }

        return this.createSVG(`
            <defs>
                <radialGradient id="fractureGrad">
                    <stop offset="0%" style="stop-color:white;stop-opacity:0.5"/>
                    <stop offset="50%" style="stop-color:${color};stop-opacity:0.7"/>
                    <stop offset="100%" style="stop-color:#000;stop-opacity:0.2"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="url(#fractureGrad)" filter="url(#glow)"/>
            ${fractures}
            <circle cx="100" cy="100" r="22" fill="${color}" opacity="0.9" class="void-pulse"/>
            <circle cx="100" cy="100" r="10" fill="white" opacity="1" class="void-core"/>
        `);
    },

    createAncientVoid(color) {
        let runes = '';
        const runeSymbols = ['◇', '◈', '◊', '⬡', '⬢', '⬣'];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            const x = 100 + Math.cos(angle) * 65;
            const y = 100 + Math.sin(angle) * 65;
            runes += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
                      font-size="16" fill="${color}" opacity="0.7" class="rune-${i}">${runeSymbols[i]}</text>`;
        }

        return this.createSVG(`
            <defs>
                <radialGradient id="ancientGrad">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:0.9"/>
                    <stop offset="60%" style="stop-color:${color};stop-opacity:0.4"/>
                    <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:0.8"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#ancientGrad)" filter="url(#glow)"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="${color}" stroke-width="2" opacity="0.3" class="ancient-ring"/>
            ${runes}
            <circle cx="100" cy="100" r="35" fill="${color}" opacity="0.7" class="void-pulse"/>
            <circle cx="100" cy="100" r="18" fill="${color}" opacity="0.9"/>
            <circle cx="100" cy="100" r="8" fill="white" opacity="1" class="void-core"/>
        `);
    },

    createUltimateVoid(color) {
        let chaos = '';
        for (let i = 0; i < 16; i++) {
            const angle = (i * 22.5) * Math.PI / 180;
            const r1 = 25 + (i % 3) * 15;
            const r2 = r1 + 30;
            const x1 = 100 + Math.cos(angle) * r1;
            const y1 = 100 + Math.sin(angle) * r1;
            const x2 = 100 + Math.cos(angle) * r2;
            const y2 = 100 + Math.sin(angle) * r2;
            chaos += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                      stroke="${color}" stroke-width="1.5" opacity="0.5" class="chaos-${i % 4}"/>`;
        }

        return this.createSVG(`
            <defs>
                <radialGradient id="ultimateGrad">
                    <stop offset="0%" style="stop-color:white;stop-opacity:1"/>
                    <stop offset="20%" style="stop-color:${color};stop-opacity:0.9"/>
                    <stop offset="60%" style="stop-color:${color};stop-opacity:0.5"/>
                    <stop offset="100%" style="stop-color:#000;stop-opacity:0.9"/>
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#ultimateGrad)" filter="url(#glow)" class="ultimate-outer"/>
            ${chaos}
            <circle cx="100" cy="100" r="45" fill="${color}" opacity="0.6" class="ultimate-mid"/>
            <circle cx="100" cy="100" r="28" fill="${color}" opacity="0.9" class="void-pulse"/>
            <circle cx="100" cy="100" r="15" fill="white" opacity="0.9" class="ultimate-inner"/>
            <circle cx="100" cy="100" r="6" fill="${color}" opacity="1" class="void-core"/>
        `);
    },

    // Helper: Generate polygon points
    generatePolygon(cx, cy, radius, sides) {
        const points = [];
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        return points;
    },

    // Helper: Lighten color for highlights
    lighten(color) {
        return color + 'cc'; // Add alpha for lighter appearance
    },
};
