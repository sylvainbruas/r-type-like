// Classe pour les décors de terrain spatial réaliste
class AlienTerrain extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.terrainHeight = Math.floor(GameConfig.height * 0.12); // 12% de l'écran pour plus de détails
        
        // Types de terrain selon le niveau
        this.terrainType = this.getTerrainType(scene.levelManager?.currentLevel || 1);
        
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
            if (Math.random() > 0.7) {
                terrain.fillStyle(0xFF00AA);
                const plantX = Math.random() * segmentWidth * 0.8 + segmentWidth * 0.1;
                terrain.fillCircle(plantX, height - 3, 2);
                terrain.fillRect(plantX - 1, height - 8, 2, 5);
            }
            
            // Convertir en texture et créer sprite physique
            terrain.generateTexture(`topTerrain${i}`, segmentWidth + 2, height);
            const terrainSprite = this.scene.physics.add.staticSprite(x, 0, `topTerrain${i}`);
            terrainSprite.setOrigin(0, 0);
            terrainSprite.body.setSize(segmentWidth, height);
            
            this.add(terrainSprite);
            terrain.destroy();
        }
    }
    
    createBottomTerrain() {
        // Terrain du bas - formations différentes
        const segments = 8;
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.6;
            const variation = Math.random() * this.terrainHeight * 0.4;
            const height = baseHeight + variation;
            const y = GameConfig.height - height;
            
            // Créer un segment de terrain
            const terrain = this.scene.add.graphics();
            
            // Couleurs aliens différentes pour le bas
            const colors = [0xAA0066, 0x0066AA, 0x66AA00, 0xAA6600, 0x6600AA];
            const mainColor = colors[Math.floor(Math.random() * colors.length)];
            const lightColor = mainColor + 0x333333;
            
            // Base du terrain
            terrain.fillStyle(mainColor);
            terrain.fillRect(0, 0, segmentWidth + 2, height);
            
            // Surface éclairée
            terrain.fillStyle(lightColor);
            terrain.fillRect(0, 0, segmentWidth + 2, height * 0.2);
            
            // Formations spéciales
            if (Math.random() > 0.5) {
                // Geysers aliens
                terrain.fillStyle(0x00AAFF);
                const geyserX = Math.random() * segmentWidth * 0.6 + segmentWidth * 0.2;
                terrain.fillRect(geyserX - 2, 0, 4, height * 0.4);
                terrain.fillCircle(geyserX, height * 0.4, 3);
            }
            
            // Spores lumineux
            if (Math.random() > 0.6) {
                terrain.fillStyle(0xFFAA00);
                for (let j = 0; j < 3; j++) {
                    const sporeX = Math.random() * segmentWidth;
                    const sporeY = Math.random() * height * 0.3;
                    terrain.fillCircle(sporeX, sporeY, 1);
                }
            }
            
            // Convertir en texture et créer sprite physique
            terrain.generateTexture(`bottomTerrain${i}`, segmentWidth + 2, height);
            const terrainSprite = this.scene.physics.add.staticSprite(x, y, `bottomTerrain${i}`);
            terrainSprite.setOrigin(0, 0);
            terrainSprite.body.setSize(segmentWidth, height);
            
            this.add(terrainSprite);
            terrain.destroy();
        }
    }
    
    // Méthode pour régénérer le terrain (changement de niveau)
    regenerate() {
        this.clear(true, true);
        this.createTopTerrain();
        this.createBottomTerrain();
    }
    
    // Obtenir la hauteur du terrain à une position X donnée
    getTerrainHeightAt(x, isTop = true) {
        const segments = 8;
        const segmentWidth = GameConfig.width / segments;
        const segmentIndex = Math.floor(x / segmentWidth);
        
        if (segmentIndex < 0 || segmentIndex >= segments) {
            return 0;
        }
        
        // Estimation de la hauteur basée sur la variation aléatoire
        const baseHeight = this.terrainHeight * 0.6;
        const variation = Math.random() * this.terrainHeight * 0.4;
        return baseHeight + variation;
    }
}
