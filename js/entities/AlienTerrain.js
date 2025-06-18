// Classe pour les décors de terrain spatial - OPACITÉ 100% FORCÉE
class AlienTerrain extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.terrainHeight = Math.floor(GameConfig.height * 0.12); // 12% de l'écran pour plus de détails
        
        // Types de terrain selon le niveau - NIVEAUX 1 ET 2 DIFFÉRENCIÉS
        this.terrainType = this.getTerrainType(scene.levelManager?.currentLevel || 1);
        
        console.log(`🌍 Creating ${this.terrainType} terrain for level ${scene.levelManager?.currentLevel || 1} - FULL OPACITY`);
        
        this.createTopTerrain();
        this.createBottomTerrain();
    }
    
    getTerrainType(level) {
        const terrainTypes = {
            1: 'asteroid-dark',  // Secteur Spatial - Astéroïdes sombres
            2: 'asteroid-light', // Champ d'Astéroïdes - Astéroïdes clairs
            3: 'mars',           // Nébuleuse Toxique - Surface martienne
            4: 'moon',           // Station Ennemie - Surface lunaire
            5: 'alien'           // Cœur Alien - Terrain alien
        };
        return terrainTypes[level] || 'asteroid-dark';
    }
    
    createTopTerrain() {
        // Terrain du haut - surface spatiale réaliste - OPACITÉ 100% FORCÉE
        const segments = 12;
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.7;
            const variation = Math.random() * this.terrainHeight * 0.3;
            const height = baseHeight + variation;
            
            // Créer le terrain avec des rectangles Phaser SOLIDES au lieu de graphics
            const terrainContainer = this.scene.add.container(x, 0);
            
            switch (this.terrainType) {
                case 'asteroid-dark':
                    this.createSolidAsteroidDark(terrainContainer, segmentWidth, height, i);
                    break;
                case 'asteroid-light':
                    this.createSolidAsteroidLight(terrainContainer, segmentWidth, height, i);
                    break;
                case 'mars':
                    this.createSolidMars(terrainContainer, segmentWidth, height, i);
                    break;
                case 'moon':
                    this.createSolidMoon(terrainContainer, segmentWidth, height, i);
                    break;
                case 'alien':
                    this.createSolidAlien(terrainContainer, segmentWidth, height, i);
                    break;
            }
            
            // Créer une zone de collision invisible
            const collisionZone = this.scene.add.zone(x + segmentWidth/2, height/2, segmentWidth, height);
            this.scene.physics.add.existing(collisionZone, true);
            this.add(collisionZone);
        }
    }
    
    createSolidAsteroidDark(container, width, height, segmentIndex) {
        // Astéroïdes sombres avec rectangles SOLIDES - OPACITÉ 100% GARANTIE
        
        // Base principale SOLIDE
        const baseRect = this.scene.add.rectangle(width/2, height/2, width + 2, height, 0x2A2A2A);
        baseRect.setOrigin(0.5, 0.5);
        container.add(baseRect);
        
        // Couches rocheuses SOLIDES
        for (let layer = 0; layer < 3; layer++) {
            const layerY = height * (0.3 + layer * 0.2);
            const layerHeight = height * 0.15;
            const layerRect = this.scene.add.rectangle(width/2, layerY + layerHeight/2, width + 2, layerHeight, 0x1A1A1A);
            layerRect.setOrigin(0.5, 0.5);
            container.add(layerRect);
        }
        
        // Cratères avec cercles SOLIDES
        const numCraters = Math.floor(Math.random() * 4) + 2;
        for (let c = 0; c < numCraters; c++) {
            const craterX = Math.random() * width * 0.8 + width * 0.1;
            const craterY = Math.random() * height * 0.6 + height * 0.2;
            const craterSize = Math.random() * 10 + 6;
            
            // Rebord du cratère (clair)
            const craterRim = this.scene.add.circle(craterX, craterY, craterSize + 2, 0x3A3A3A);
            container.add(craterRim);
            
            // Cratère principal (très sombre)
            const crater = this.scene.add.circle(craterX, craterY, craterSize, 0x0A0A0A);
            container.add(crater);
        }
        
        // Rochers avec rectangles SOLIDES
        const numRocks = Math.floor(Math.random() * 5) + 3;
        for (let r = 0; r < numRocks; r++) {
            const rockX = Math.random() * width * 0.8 + width * 0.1;
            const rockY = height - Math.random() * height * 0.3;
            const rockSize = Math.random() * 8 + 4;
            
            // Rocher principal
            const rock = this.scene.add.rectangle(rockX, rockY, rockSize, rockSize, 0x3A3A3A);
            container.add(rock);
            
            // Ombre du rocher
            const shadow = this.scene.add.rectangle(rockX + 1, rockY + 1, rockSize, rockSize, 0x1A1A1A);
            container.add(shadow);
        }
        
        // Texture avec petits cercles SOLIDES
        for (let t = 0; t < 15; t++) {
            const textureX = Math.random() * width;
            const textureY = Math.random() * height;
            const texturePoint = this.scene.add.circle(textureX, textureY, 1, 0x1A1A1A);
            container.add(texturePoint);
        }
    }
    
    createSolidAsteroidLight(container, width, height, segmentIndex) {
        // Astéroïdes clairs avec rectangles SOLIDES - OPACITÉ 100% GARANTIE
        
        // Base principale SOLIDE
        const baseRect = this.scene.add.rectangle(width/2, height/2, width + 2, height, 0x6A6A6A);
        baseRect.setOrigin(0.5, 0.5);
        container.add(baseRect);
        
        // Couches rocheuses claires SOLIDES
        for (let layer = 0; layer < 4; layer++) {
            const layerY = height * (0.2 + layer * 0.18);
            const layerHeight = height * 0.12;
            const layerRect = this.scene.add.rectangle(width/2, layerY + layerHeight/2, width + 2, layerHeight, 0x8A8A8A);
            layerRect.setOrigin(0.5, 0.5);
            container.add(layerRect);
        }
        
        // Cratères avec cercles SOLIDES
        const numCraters = Math.floor(Math.random() * 3) + 1;
        for (let c = 0; c < numCraters; c++) {
            const craterX = Math.random() * width * 0.8 + width * 0.1;
            const craterY = Math.random() * height * 0.6 + height * 0.2;
            const craterSize = Math.random() * 8 + 4;
            
            // Rebord du cratère (très clair)
            const craterRim = this.scene.add.circle(craterX, craterY, craterSize + 3, 0x9A9A9A);
            container.add(craterRim);
            
            // Cratère principal (sombre)
            const crater = this.scene.add.circle(craterX, craterY, craterSize, 0x2A2A2A);
            container.add(crater);
        }
        
        // Rochers clairs avec rectangles SOLIDES
        const numRocks = Math.floor(Math.random() * 4) + 2;
        for (let r = 0; r < numRocks; r++) {
            const rockX = Math.random() * width * 0.8 + width * 0.1;
            const rockY = height - Math.random() * height * 0.3;
            const rockSize = Math.random() * 6 + 3;
            
            // Rocher principal (clair)
            const rock = this.scene.add.rectangle(rockX, rockY, rockSize, rockSize, 0x8A8A8A);
            container.add(rock);
            
            // Reflet sur le rocher (très clair)
            const highlight = this.scene.add.rectangle(rockX - rockSize/4, rockY - rockSize/4, rockSize/2, rockSize/2, 0xAAAAAA);
            container.add(highlight);
        }
        
        // Poussière claire avec cercles SOLIDES
        for (let d = 0; d < 12; d++) {
            const dustX = Math.random() * width;
            const dustY = Math.random() * height;
            const dustPoint = this.scene.add.circle(dustX, dustY, 1.5, 0x7A7A7A);
            container.add(dustPoint);
        }
    }
    
    createSolidMars(container, width, height, segmentIndex) {
        // Surface martienne avec rectangles SOLIDES - OPACITÉ 100% GARANTIE
        
        // Base martienne SOLIDE
        const baseRect = this.scene.add.rectangle(width/2, height/2, width + 2, height, 0x8B4513);
        baseRect.setOrigin(0.5, 0.5);
        container.add(baseRect);
        
        // Couches sédimentaires SOLIDES
        for (let layer = 0; layer < 4; layer++) {
            const layerY = height * (0.2 + layer * 0.15);
            const layerHeight = height * 0.08;
            const layerRect = this.scene.add.rectangle(width/2, layerY + layerHeight/2, width + 2, layerHeight, 0xCD853F);
            layerRect.setOrigin(0.5, 0.5);
            container.add(layerRect);
        }
        
        // Formations rocheuses SOLIDES
        const numFormations = Math.floor(Math.random() * 2) + 1;
        for (let f = 0; f < numFormations; f++) {
            const formX = Math.random() * width * 0.6 + width * 0.2;
            const formHeight = Math.random() * height * 0.4 + height * 0.1;
            const formWidth = Math.random() * 15 + 10;
            
            // Formation rocheuse
            const formation = this.scene.add.rectangle(formX, height - formHeight/2, formWidth, formHeight, 0x654321);
            container.add(formation);
            
            // Érosion éolienne
            const erosion = this.scene.add.rectangle(formX, height - formHeight/6, formWidth + 4, formHeight/3, 0xDEB887);
            container.add(erosion);
        }
        
        // Dépôts d'oxyde de fer SOLIDES
        const numIronSpots = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numIronSpots; i++) {
            const ironX = Math.random() * width;
            const ironY = Math.random() * height * 0.8 + height * 0.2;
            const ironSize = Math.random() * 5 + 3;
            const ironSpot = this.scene.add.circle(ironX, ironY, ironSize, 0xB22222);
            container.add(ironSpot);
        }
        
        // Poussière martienne SOLIDE
        const numDustSpots = Math.floor(Math.random() * 5) + 3;
        for (let d = 0; d < numDustSpots; d++) {
            const dustX = Math.random() * width;
            const dustY = Math.random() * height * 0.8 + height * 0.2;
            const dustSize = Math.random() * 4 + 2;
            const dustSpot = this.scene.add.circle(dustX, dustY, dustSize, 0xDEB887);
            container.add(dustSpot);
        }
    }
    
    createSolidMoon(container, width, height, segmentIndex) {
        // Surface lunaire avec rectangles SOLIDES - OPACITÉ 100% GARANTIE
        
        // Base lunaire SOLIDE
        const baseRect = this.scene.add.rectangle(width/2, height/2, width + 2, height, 0x8C8C8C);
        baseRect.setOrigin(0.5, 0.5);
        container.add(baseRect);
        
        // Régolithe SOLIDE
        const regolithRect = this.scene.add.rectangle(width/2, height * 0.925, width + 2, height * 0.15, 0xA0A0A0);
        regolithRect.setOrigin(0.5, 0.5);
        container.add(regolithRect);
        
        // Cratères lunaires SOLIDES
        const numCraters = Math.floor(Math.random() * 4) + 2;
        for (let c = 0; c < numCraters; c++) {
            const craterX = Math.random() * width * 0.8 + width * 0.1;
            const craterY = Math.random() * height * 0.7 + height * 0.1;
            const craterSize = Math.random() * 12 + 6;
            
            // Éjecta (rebord clair)
            const ejecta = this.scene.add.circle(craterX, craterY, craterSize * 1.3, 0xB8B8B8);
            container.add(ejecta);
            
            // Cratère principal (sombre)
            const crater = this.scene.add.circle(craterX, craterY, craterSize, 0x3A3A3A);
            container.add(crater);
            
            // Pic central pour gros cratères
            if (craterSize > 10) {
                const centralPeak = this.scene.add.circle(craterX, craterY, craterSize * 0.2, 0x8C8C8C);
                container.add(centralPeak);
            }
        }
        
        // Roches lunaires SOLIDES
        const numRocks = Math.floor(Math.random() * 3) + 1;
        for (let r = 0; r < numRocks; r++) {
            const rockX = Math.random() * width * 0.8 + width * 0.1;
            const rockY = height - Math.random() * height * 0.2;
            const rockWidth = Math.random() * 8 + 4;
            const rockHeight = Math.random() * 6 + 3;
            
            // Roche principale
            const rock = this.scene.add.ellipse(rockX, rockY, rockWidth, rockHeight, 0x5A5A5A);
            container.add(rock);
            
            // Ombre portée
            const shadow = this.scene.add.ellipse(rockX + 2, rockY + 1, rockWidth * 0.8, rockHeight * 0.6, 0x3A3A3A);
            container.add(shadow);
        }
        
        // Traces de micrométorites SOLIDES
        for (let m = 0; m < 8; m++) {
            const microX = Math.random() * width;
            const microY = Math.random() * height;
            const microTrace = this.scene.add.circle(microX, microY, 1, 0x3A3A3A);
            container.add(microTrace);
        }
    }
    
    createSolidAlien(container, width, height, segmentIndex) {
        // Surface alien avec rectangles SOLIDES - OPACITÉ 100% GARANTIE
        const colors = [0x6600CC, 0x00AA44, 0x0088CC, 0x8800CC, 0x00CC88];
        const mainColor = colors[Math.floor(Math.random() * colors.length)];
        const darkColor = this.darkenColor(mainColor, 0.6);
        const lightColor = this.lightenColor(mainColor, 1.3);
        
        // Base alien SOLIDE
        const baseRect = this.scene.add.rectangle(width/2, height/2, width + 2, height, mainColor);
        baseRect.setOrigin(0.5, 0.5);
        container.add(baseRect);
        
        // Formations organiques SOLIDES
        const numFormations = Math.floor(Math.random() * 3) + 2;
        for (let f = 0; f < numFormations; f++) {
            const formX = Math.random() * width * 0.8 + width * 0.1;
            const formY = Math.random() * height * 0.6 + height * 0.2;
            const formSize = Math.random() * 10 + 5;
            
            // Formation organique principale
            const formation = this.scene.add.circle(formX, formY, formSize, darkColor);
            container.add(formation);
            
            // Extension organique
            const extension = this.scene.add.ellipse(formX + formSize/2, formY, formSize * 0.7, formSize * 1.3, darkColor);
            container.add(extension);
            
            // Pulsation bioluminescente
            const pulse = this.scene.add.circle(formX, formY, formSize * 0.5, lightColor);
            container.add(pulse);
        }
        
        // Cristaux aliens SOLIDES
        const numCrystals = Math.floor(Math.random() * 2) + 1;
        for (let cr = 0; cr < numCrystals; cr++) {
            const crystalX = Math.random() * width * 0.6 + width * 0.2;
            const crystalHeight = Math.random() * height * 0.4 + 8;
            const crystalBase = Math.random() * 6 + 4;
            
            // Cristal principal (triangle avec polygone)
            const crystal = this.scene.add.polygon(crystalX, height - crystalHeight/2, [
                0, -crystalHeight/2,
                -crystalBase/2, crystalHeight/2,
                crystalBase/2, crystalHeight/2
            ], 0x00FFFF);
            container.add(crystal);
            
            // Reflet sur le cristal
            const highlight = this.scene.add.polygon(crystalX - crystalBase/4, height - crystalHeight * 0.7, [
                0, -crystalHeight * 0.15,
                -crystalBase/4, crystalHeight * 0.15,
                0, crystalHeight * 0.1
            ], 0x88FFFF);
            container.add(highlight);
        }
        
        // Végétation alien SOLIDE
        const numPlants = Math.floor(Math.random() * 3) + 1;
        for (let p = 0; p < numPlants; p++) {
            const plantX = Math.random() * width * 0.8 + width * 0.1;
            const plantHeight = Math.random() * height * 0.3 + 5;
            
            // Tige
            const stem = this.scene.add.rectangle(plantX, height - plantHeight/2, 2, plantHeight, 0x00FF88);
            container.add(stem);
            
            // Bulbe lumineux
            const bulb = this.scene.add.circle(plantX, height - plantHeight, 3, 0x00FF88);
            container.add(bulb);
            
            // Aura bioluminescente
            const aura = this.scene.add.circle(plantX, height - plantHeight, 5, 0x44FF88);
            aura.setAlpha(0.7); // Seule exception pour l'effet lumineux
            container.add(aura);
        }
        
        // Spores flottantes SOLIDES
        for (let s = 0; s < 5; s++) {
            const sporeX = Math.random() * width;
            const sporeY = Math.random() * height * 0.8;
            const spore = this.scene.add.circle(sporeX, sporeY, 1, 0x88FF88);
            container.add(spore);
        }
    }
    
    createBottomTerrain() {
        // Terrain du bas - même logique mais inversé - OPACITÉ 100% FORCÉE
        const segments = 12;
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.7;
            const variation = Math.random() * this.terrainHeight * 0.3;
            const height = baseHeight + variation;
            
            // Créer le terrain avec des rectangles Phaser SOLIDES
            const terrainContainer = this.scene.add.container(x, GameConfig.height - height);
            
            switch (this.terrainType) {
                case 'asteroid-dark':
                    this.createSolidAsteroidDark(terrainContainer, segmentWidth, height, i);
                    break;
                case 'asteroid-light':
                    this.createSolidAsteroidLight(terrainContainer, segmentWidth, height, i);
                    break;
                case 'mars':
                    this.createSolidMars(terrainContainer, segmentWidth, height, i);
                    break;
                case 'moon':
                    this.createSolidMoon(terrainContainer, segmentWidth, height, i);
                    break;
                case 'alien':
                    this.createSolidAlien(terrainContainer, segmentWidth, height, i);
                    break;
            }
            
            // Créer une zone de collision invisible
            const collisionZone = this.scene.add.zone(
                x + segmentWidth/2, 
                GameConfig.height - height/2, 
                segmentWidth, 
                height
            );
            this.scene.physics.add.existing(collisionZone, true);
            this.add(collisionZone);
        }
    }
    
    // Utilitaires pour les couleurs
    darkenColor(color, factor) {
        const r = Math.floor(((color >> 16) & 0xFF) * factor);
        const g = Math.floor(((color >> 8) & 0xFF) * factor);
        const b = Math.floor((color & 0xFF) * factor);
        return (r << 16) | (g << 8) | b;
    }
    
    lightenColor(color, factor) {
        const r = Math.min(255, Math.floor(((color >> 16) & 0xFF) * factor));
        const g = Math.min(255, Math.floor(((color >> 8) & 0xFF) * factor));
        const b = Math.min(255, Math.floor((color & 0xFF) * factor));
        return (r << 16) | (g << 8) | b;
    }
    
    // Méthode pour changer le type de terrain dynamiquement
    changeTerrainType(newType) {
        console.log(`🌍 Changing terrain from ${this.terrainType} to ${newType} - FULL OPACITY`);
        this.terrainType = newType;
        // Nettoyer les anciens terrains
        this.clear(true, true);
        // Recréer avec le nouveau type
        this.createTopTerrain();
        this.createBottomTerrain();
    }
}
