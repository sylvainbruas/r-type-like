// Classe pour les décors de terrain spatial réaliste
class AlienTerrain extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.terrainHeight = Math.floor(GameConfig.height * 0.12); // 12% de l'écran pour plus de détails
        
        // Types de terrain selon le niveau
        this.terrainType = this.getTerrainType(scene.levelManager?.currentLevel || 1);
        
        console.log(`🌍 Creating ${this.terrainType} terrain for level ${scene.levelManager?.currentLevel || 1}`);
        
        this.createTopTerrain();
        this.createBottomTerrain();
    }
    
    getTerrainType(level) {
        const terrainTypes = {
            1: 'asteroid',  // Secteur Spatial - Astéroïdes
            2: 'asteroid',  // Champ d'Astéroïdes
            3: 'mars',      // Nébuleuse Toxique - Surface martienne
            4: 'moon',      // Station Ennemie - Surface lunaire
            5: 'alien'      // Cœur Alien - Terrain alien
        };
        return terrainTypes[level] || 'asteroid';
    }
    
    createTopTerrain() {
        // Terrain du haut - surface spatiale réaliste
        const segments = 12; // Plus de segments pour plus de détails
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.7;
            const variation = Math.random() * this.terrainHeight * 0.3;
            const height = baseHeight + variation;
            
            // Créer un segment de terrain avec texture réaliste
            const terrain = this.scene.add.graphics();
            
            switch (this.terrainType) {
                case 'asteroid':
                    this.createAsteroidSurface(terrain, segmentWidth, height, i);
                    break;
                case 'mars':
                    this.createMarsSurface(terrain, segmentWidth, height, i);
                    break;
                case 'moon':
                    this.createMoonSurface(terrain, segmentWidth, height, i);
                    break;
                case 'alien':
                    this.createAlienSurface(terrain, segmentWidth, height, i);
                    break;
            }
            
            terrain.x = x;
            terrain.y = 0;
            
            // Créer une zone de collision invisible
            const collisionZone = this.scene.add.zone(x + segmentWidth/2, height/2, segmentWidth, height);
            this.scene.physics.add.existing(collisionZone, true); // true = static
            this.add(collisionZone);
        }
    }
    
    createAsteroidSurface(graphics, width, height, segmentIndex) {
        // Surface d'astéroïde - gris rocheux avec cratères
        const baseColor = 0x4A4A4A;
        const darkColor = 0x2A2A2A;
        const lightColor = 0x6A6A6A;
        const veryDarkColor = 0x1A1A1A;
        
        // Base rocheuse
        graphics.fillStyle(baseColor);
        graphics.fillRect(0, 0, width + 2, height);
        
        // Strates rocheuses
        graphics.fillStyle(darkColor);
        for (let layer = 0; layer < 3; layer++) {
            const layerY = height * (0.3 + layer * 0.2);
            const layerHeight = height * 0.15;
            graphics.fillRect(0, layerY, width + 2, layerHeight);
        }
        
        // Cratères d'impact
        graphics.fillStyle(veryDarkColor);
        const numCraters = Math.floor(Math.random() * 3) + 1;
        for (let c = 0; c < numCraters; c++) {
            const craterX = Math.random() * width * 0.8 + width * 0.1;
            const craterY = Math.random() * height * 0.6 + height * 0.2;
            const craterSize = Math.random() * 8 + 4;
            graphics.fillCircle(craterX, craterY, craterSize);
            
            // Rebord du cratère
            graphics.fillStyle(lightColor);
            graphics.strokeCircle(craterX, craterY, craterSize + 1);
            graphics.fillStyle(veryDarkColor);
        }
        
        // Rochers et débris
        graphics.fillStyle(lightColor);
        const numRocks = Math.floor(Math.random() * 4) + 2;
        for (let r = 0; r < numRocks; r++) {
            const rockX = Math.random() * width * 0.8 + width * 0.1;
            const rockY = height - Math.random() * height * 0.3;
            const rockSize = Math.random() * 6 + 3;
            graphics.fillRect(rockX - rockSize/2, rockY - rockSize/2, rockSize, rockSize);
            
            // Ombre du rocher
            graphics.fillStyle(darkColor);
            graphics.fillRect(rockX - rockSize/2 + 1, rockY - rockSize/2 + 1, rockSize, rockSize);
            graphics.fillStyle(lightColor);
        }
        
        // Texture rugueuse
        graphics.fillStyle(darkColor);
        for (let t = 0; t < 10; t++) {
            const textureX = Math.random() * width;
            const textureY = Math.random() * height;
            graphics.fillCircle(textureX, textureY, 1);
        }
    }
    
    createMarsSurface(graphics, width, height, segmentIndex) {
        // Surface martienne - rouge/orange avec formations rocheuses
        const baseColor = 0x8B4513;  // Brun martien
        const darkColor = 0x654321;  // Brun foncé
        const redColor = 0xCD853F;   // Ocre rouge
        const dustColor = 0xDEB887;  // Poussière
        const ironColor = 0xB22222;  // Oxyde de fer
        
        // Base martienne
        graphics.fillStyle(baseColor);
        graphics.fillRect(0, 0, width + 2, height);
        
        // Couches sédimentaires
        graphics.fillStyle(redColor);
        for (let layer = 0; layer < 4; layer++) {
            const layerY = height * (0.2 + layer * 0.15);
            const layerHeight = height * 0.08;
            graphics.fillRect(0, layerY, width + 2, layerHeight);
        }
        
        // Formations rocheuses martiennes
        graphics.fillStyle(darkColor);
        const numFormations = Math.floor(Math.random() * 2) + 1;
        for (let f = 0; f < numFormations; f++) {
            const formX = Math.random() * width * 0.6 + width * 0.2;
            const formHeight = Math.random() * height * 0.4 + height * 0.1;
            const formWidth = Math.random() * 15 + 10;
            graphics.fillRect(formX - formWidth/2, height - formHeight, formWidth, formHeight);
            
            // Érosion éolienne
            graphics.fillStyle(dustColor);
            graphics.fillRect(formX - formWidth/2 - 2, height - formHeight/3, formWidth + 4, formHeight/3);
            graphics.fillStyle(darkColor);
        }
        
        // Dépôts d'oxyde de fer
        graphics.fillStyle(ironColor);
        const numIronSpots = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numIronSpots; i++) {
            const ironX = Math.random() * width;
            const ironY = Math.random() * height * 0.8 + height * 0.2;
            const ironSize = Math.random() * 5 + 3;
            graphics.fillCircle(ironX, ironY, ironSize);
        }
        
        // Poussière et érosion
        graphics.fillStyle(dustColor);
        const numDustSpots = Math.floor(Math.random() * 5) + 3;
        for (let d = 0; d < numDustSpots; d++) {
            const dustX = Math.random() * width;
            const dustY = Math.random() * height * 0.8 + height * 0.2;
            const dustSize = Math.random() * 4 + 2;
            graphics.fillCircle(dustX, dustY, dustSize);
        }
    }
    
    createMoonSurface(graphics, width, height, segmentIndex) {
        // Surface lunaire - gris clair avec cratères et régolithe
        const baseColor = 0x8C8C8C;  // Gris lunaire
        const darkColor = 0x5A5A5A;  // Gris foncé
        const lightColor = 0xB8B8B8; // Gris clair
        const shadowColor = 0x3A3A3A; // Ombres
        const regolithColor = 0xA0A0A0; // Régolithe
        
        // Base lunaire
        graphics.fillStyle(baseColor);
        graphics.fillRect(0, 0, width + 2, height);
        
        // Régolithe (poussière lunaire)
        graphics.fillStyle(regolithColor);
        graphics.fillRect(0, height * 0.85, width + 2, height * 0.15);
        
        // Cratères lunaires
        const numCraters = Math.floor(Math.random() * 4) + 2;
        for (let c = 0; c < numCraters; c++) {
            const craterX = Math.random() * width * 0.8 + width * 0.1;
            const craterY = Math.random() * height * 0.7 + height * 0.1;
            const craterSize = Math.random() * 12 + 6;
            
            // Rebord du cratère (éjecta)
            graphics.fillStyle(lightColor);
            graphics.fillCircle(craterX, craterY, craterSize * 1.3);
            
            // Cratère principal
            graphics.fillStyle(shadowColor);
            graphics.fillCircle(craterX, craterY, craterSize);
            
            // Pic central (pour les gros cratères)
            if (craterSize > 10) {
                graphics.fillStyle(baseColor);
                graphics.fillCircle(craterX, craterY, craterSize * 0.2);
            }
        }
        
        // Roches lunaires
        graphics.fillStyle(darkColor);
        const numRocks = Math.floor(Math.random() * 3) + 1;
        for (let r = 0; r < numRocks; r++) {
            const rockX = Math.random() * width * 0.8 + width * 0.1;
            const rockY = height - Math.random() * height * 0.2;
            const rockWidth = Math.random() * 8 + 4;
            const rockHeight = Math.random() * 6 + 3;
            graphics.fillEllipse(rockX, rockY, rockWidth, rockHeight);
            
            // Ombre portée
            graphics.fillStyle(shadowColor);
            graphics.fillEllipse(rockX + 2, rockY + 1, rockWidth * 0.8, rockHeight * 0.6);
            graphics.fillStyle(darkColor);
        }
        
        // Traces de micrométorites
        graphics.fillStyle(shadowColor);
        for (let m = 0; m < 8; m++) {
            const microX = Math.random() * width;
            const microY = Math.random() * height;
            graphics.fillCircle(microX, microY, 1);
        }
    }
    
    createAlienSurface(graphics, width, height, segmentIndex) {
        // Surface alien - couleurs étranges avec cristaux et formations organiques
        const colors = [0x6600CC, 0x00AA44, 0x0088CC, 0x8800CC, 0x00CC88];
        const mainColor = colors[Math.floor(Math.random() * colors.length)];
        const darkColor = this.darkenColor(mainColor, 0.6);
        const lightColor = this.lightenColor(mainColor, 1.3);
        
        // Base alien
        graphics.fillStyle(mainColor);
        graphics.fillRect(0, 0, width + 2, height);
        
        // Formations organiques
        graphics.fillStyle(darkColor);
        const numFormations = Math.floor(Math.random() * 3) + 2;
        for (let f = 0; f < numFormations; f++) {
            const formX = Math.random() * width * 0.8 + width * 0.1;
            const formY = Math.random() * height * 0.6 + height * 0.2;
            const formSize = Math.random() * 10 + 5;
            
            // Forme organique irrégulière
            graphics.fillCircle(formX, formY, formSize);
            graphics.fillEllipse(formX + formSize/2, formY, formSize * 0.7, formSize * 1.3);
            
            // Pulsation bioluminescente
            graphics.fillStyle(lightColor);
            graphics.fillCircle(formX, formY, formSize * 0.5);
            graphics.fillStyle(darkColor);
        }
        
        // Cristaux aliens
        graphics.fillStyle(0x00FFFF);
        const numCrystals = Math.floor(Math.random() * 2) + 1;
        for (let cr = 0; cr < numCrystals; cr++) {
            const crystalX = Math.random() * width * 0.6 + width * 0.2;
            const crystalHeight = Math.random() * height * 0.4 + 8;
            const crystalBase = Math.random() * 6 + 4;
            
            // Cristal principal
            graphics.fillTriangle(
                crystalX, height - crystalHeight,
                crystalX - crystalBase/2, height,
                crystalX + crystalBase/2, height
            );
            
            // Reflets
            graphics.fillStyle(0x88FFFF);
            graphics.fillTriangle(
                crystalX - crystalBase/4, height - crystalHeight * 0.8,
                crystalX - crystalBase/2, height,
                crystalX, height - crystalHeight * 0.6
            );
            graphics.fillStyle(0x00FFFF);
        }
        
        // Végétation alien bioluminescente
        graphics.fillStyle(0x00FF88);
        const numPlants = Math.floor(Math.random() * 3) + 1;
        for (let p = 0; p < numPlants; p++) {
            const plantX = Math.random() * width * 0.8 + width * 0.1;
            const plantHeight = Math.random() * height * 0.3 + 5;
            
            // Tige
            graphics.fillRect(plantX - 1, height - plantHeight, 2, plantHeight);
            
            // Bulbe lumineux
            graphics.fillCircle(plantX, height - plantHeight, 3);
            
            // Aura bioluminescente
            graphics.fillStyle(0x44FF88);
            graphics.fillCircle(plantX, height - plantHeight, 5);
            graphics.fillStyle(0x00FF88);
        }
        
        // Spores flottantes
        graphics.fillStyle(0x88FF88);
        for (let s = 0; s < 5; s++) {
            const sporeX = Math.random() * width;
            const sporeY = Math.random() * height * 0.8;
            graphics.fillCircle(sporeX, sporeY, 1);
        }
    }
    
    createBottomTerrain() {
        // Terrain du bas - même logique mais inversé
        const segments = 12;
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.7;
            const variation = Math.random() * this.terrainHeight * 0.3;
            const height = baseHeight + variation;
            
            // Créer un segment de terrain avec texture réaliste
            const terrain = this.scene.add.graphics();
            
            switch (this.terrainType) {
                case 'asteroid':
                    this.createAsteroidSurface(terrain, segmentWidth, height, i);
                    break;
                case 'mars':
                    this.createMarsSurface(terrain, segmentWidth, height, i);
                    break;
                case 'moon':
                    this.createMoonSurface(terrain, segmentWidth, height, i);
                    break;
                case 'alien':
                    this.createAlienSurface(terrain, segmentWidth, height, i);
                    break;
            }
            
            terrain.x = x;
            terrain.y = GameConfig.height - height;
            
            // Créer une zone de collision invisible
            const collisionZone = this.scene.add.zone(
                x + segmentWidth/2, 
                GameConfig.height - height/2, 
                segmentWidth, 
                height
            );
            this.scene.physics.add.existing(collisionZone, true); // true = static
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
        console.log(`🌍 Changing terrain from ${this.terrainType} to ${newType}`);
        this.terrainType = newType;
        // Nettoyer les anciens terrains
        this.clear(true, true);
        // Recréer avec le nouveau type
        this.createTopTerrain();
        this.createBottomTerrain();
    }
}
