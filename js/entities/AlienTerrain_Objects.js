// Classe pour les décors de terrain spatial - APPROCHE BITMAP/SPRITE
class AlienTerrain extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.terrainHeight = Math.floor(GameConfig.height * 0.12); // 12% de l'écran
        
        // Types de terrain selon le niveau
        this.terrainType = this.getTerrainType(scene.levelManager?.currentLevel || 1);
        
        console.log(`🌍 Creating BITMAP terrain ${this.terrainType} for level ${scene.levelManager?.currentLevel || 1}`);
        
        // Créer les textures bitmap d'abord
        this.createTerrainTextures();
        
        // Puis créer le terrain avec ces textures
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
    
    createTerrainTextures() {
        // Créer des textures bitmap pour chaque type de terrain
        console.log('🎨 Creating bitmap textures for terrain...');
        
        const textureWidth = 100;
        const textureHeight = 80;
        
        // Créer les textures selon le type
        switch (this.terrainType) {
            case 'asteroid-dark':
                this.createAsteroidDarkTexture(textureWidth, textureHeight);
                break;
            case 'asteroid-light':
                this.createAsteroidLightTexture(textureWidth, textureHeight);
                break;
            case 'mars':
                this.createMarsTexture(textureWidth, textureHeight);
                break;
            case 'moon':
                this.createMoonTexture(textureWidth, textureHeight);
                break;
            case 'alien':
                this.createAlienTexture(textureWidth, textureHeight);
                break;
        }
        
        console.log('✅ Bitmap textures created');
    }
    
    createAsteroidDarkTexture(width, height) {
        // Créer une texture bitmap pour astéroïdes sombres
        const graphics = this.scene.add.graphics();
        
        // Base sombre SOLIDE
        graphics.fillStyle(0x2A2A2A);
        graphics.fillRect(0, 0, width, height);
        
        // Couches rocheuses
        graphics.fillStyle(0x1A1A1A);
        graphics.fillRect(0, height * 0.3, width, height * 0.2);
        graphics.fillRect(0, height * 0.6, width, height * 0.15);
        
        // Cratères
        graphics.fillStyle(0x0A0A0A);
        graphics.fillCircle(width * 0.3, height * 0.4, 8);
        graphics.fillCircle(width * 0.7, height * 0.7, 6);
        
        // Rochers
        graphics.fillStyle(0x3A3A3A);
        graphics.fillRect(width * 0.2, height * 0.8, 8, 6);
        graphics.fillRect(width * 0.6, height * 0.85, 6, 4);
        
        // Générer la texture
        graphics.generateTexture('terrain-asteroid-dark', width, height);
        graphics.destroy();
        
        console.log('✅ Asteroid dark texture created');
    }
    
    createAsteroidLightTexture(width, height) {
        // Créer une texture bitmap pour astéroïdes clairs
        const graphics = this.scene.add.graphics();
        
        // Base claire SOLIDE
        graphics.fillStyle(0x6A6A6A);
        graphics.fillRect(0, 0, width, height);
        
        // Couches rocheuses claires
        graphics.fillStyle(0x8A8A8A);
        graphics.fillRect(0, height * 0.2, width, height * 0.15);
        graphics.fillRect(0, height * 0.4, width, height * 0.12);
        graphics.fillRect(0, height * 0.6, width, height * 0.1);
        
        // Cratères avec rebords clairs
        graphics.fillStyle(0x9A9A9A);
        graphics.fillCircle(width * 0.25, height * 0.35, 10);
        graphics.fillStyle(0x2A2A2A);
        graphics.fillCircle(width * 0.25, height * 0.35, 6);
        
        graphics.fillStyle(0x9A9A9A);
        graphics.fillCircle(width * 0.75, height * 0.65, 8);
        graphics.fillStyle(0x2A2A2A);
        graphics.fillCircle(width * 0.75, height * 0.65, 4);
        
        // Rochers avec reflets
        graphics.fillStyle(0x8A8A8A);
        graphics.fillRect(width * 0.15, height * 0.8, 10, 8);
        graphics.fillStyle(0xAAAAAA);
        graphics.fillRect(width * 0.15, height * 0.8, 5, 4);
        
        graphics.fillStyle(0x8A8A8A);
        graphics.fillRect(width * 0.65, height * 0.85, 8, 6);
        graphics.fillStyle(0xAAAAAA);
        graphics.fillRect(width * 0.65, height * 0.85, 4, 3);
        
        // Générer la texture
        graphics.generateTexture('terrain-asteroid-light', width, height);
        graphics.destroy();
        
        console.log('✅ Asteroid light texture created');
    }
    
    createMarsTexture(width, height) {
        // Créer une texture bitmap pour Mars
        const graphics = this.scene.add.graphics();
        
        // Base martienne SOLIDE
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, width, height);
        
        // Couches sédimentaires
        graphics.fillStyle(0xCD853F);
        graphics.fillRect(0, height * 0.2, width, height * 0.1);
        graphics.fillRect(0, height * 0.4, width, height * 0.08);
        graphics.fillRect(0, height * 0.6, width, height * 0.08);
        
        // Formations rocheuses
        graphics.fillStyle(0x654321);
        graphics.fillRect(width * 0.3, height * 0.7, 15, height * 0.3);
        graphics.fillRect(width * 0.7, height * 0.75, 12, height * 0.25);
        
        // Dépôts d'oxyde de fer
        graphics.fillStyle(0xB22222);
        graphics.fillCircle(width * 0.2, height * 0.5, 4);
        graphics.fillCircle(width * 0.8, height * 0.6, 3);
        
        // Poussière martienne
        graphics.fillStyle(0xDEB887);
        graphics.fillCircle(width * 0.4, height * 0.8, 3);
        graphics.fillCircle(width * 0.6, height * 0.9, 2);
        
        // Générer la texture
        graphics.generateTexture('terrain-mars', width, height);
        graphics.destroy();
        
        console.log('✅ Mars texture created');
    }
    
    createMoonTexture(width, height) {
        // Créer une texture bitmap pour la Lune
        const graphics = this.scene.add.graphics();
        
        // Base lunaire SOLIDE
        graphics.fillStyle(0x8C8C8C);
        graphics.fillRect(0, 0, width, height);
        
        // Régolithe
        graphics.fillStyle(0xA0A0A0);
        graphics.fillRect(0, height * 0.85, width, height * 0.15);
        
        // Cratères lunaires avec éjecta
        graphics.fillStyle(0xB8B8B8);
        graphics.fillCircle(width * 0.3, height * 0.4, 12);
        graphics.fillStyle(0x3A3A3A);
        graphics.fillCircle(width * 0.3, height * 0.4, 8);
        graphics.fillStyle(0x8C8C8C);
        graphics.fillCircle(width * 0.3, height * 0.4, 2);
        
        graphics.fillStyle(0xB8B8B8);
        graphics.fillCircle(width * 0.7, height * 0.6, 10);
        graphics.fillStyle(0x3A3A3A);
        graphics.fillCircle(width * 0.7, height * 0.6, 6);
        
        // Roches lunaires
        graphics.fillStyle(0x5A5A5A);
        graphics.fillEllipse(width * 0.2, height * 0.8, 8, 6);
        graphics.fillEllipse(width * 0.8, height * 0.85, 6, 4);
        
        // Traces de micrométorites
        graphics.fillStyle(0x3A3A3A);
        for (let i = 0; i < 5; i++) {
            graphics.fillCircle(Math.random() * width, Math.random() * height, 1);
        }
        
        // Générer la texture
        graphics.generateTexture('terrain-moon', width, height);
        graphics.destroy();
        
        console.log('✅ Moon texture created');
    }
    
    createAlienTexture(width, height) {
        // Créer une texture bitmap pour terrain alien
        const colors = [0x6600CC, 0x00AA44, 0x0088CC, 0x8800CC, 0x00CC88];
        const mainColor = colors[Math.floor(Math.random() * colors.length)];
        
        const graphics = this.scene.add.graphics();
        
        // Base alien SOLIDE
        graphics.fillStyle(mainColor);
        graphics.fillRect(0, 0, width, height);
        
        // Formations organiques
        const darkColor = this.darkenColor(mainColor, 0.6);
        graphics.fillStyle(darkColor);
        graphics.fillCircle(width * 0.3, height * 0.4, 8);
        graphics.fillEllipse(width * 0.3 + 4, height * 0.4, 6, 10);
        
        graphics.fillCircle(width * 0.7, height * 0.6, 6);
        graphics.fillEllipse(width * 0.7 + 3, height * 0.6, 4, 8);
        
        // Cristaux aliens (triangles)
        graphics.fillStyle(0x00FFFF);
        graphics.fillTriangle(
            width * 0.2, height * 0.9,
            width * 0.2 - 4, height,
            width * 0.2 + 4, height
        );
        graphics.fillTriangle(
            width * 0.8, height * 0.85,
            width * 0.8 - 3, height,
            width * 0.8 + 3, height
        );
        
        // Végétation bioluminescente
        graphics.fillStyle(0x00FF88);
        graphics.fillRect(width * 0.4 - 1, height * 0.7, 2, height * 0.3);
        graphics.fillCircle(width * 0.4, height * 0.7, 3);
        
        graphics.fillRect(width * 0.6 - 1, height * 0.75, 2, height * 0.25);
        graphics.fillCircle(width * 0.6, height * 0.75, 2);
        
        // Spores
        graphics.fillStyle(0x88FF88);
        for (let i = 0; i < 3; i++) {
            graphics.fillCircle(Math.random() * width, Math.random() * height * 0.8, 1);
        }
        
        // Générer la texture
        graphics.generateTexture('terrain-alien', width, height);
        graphics.destroy();
        
        console.log('✅ Alien texture created');
    }
    
    createTopTerrain() {
        // Créer le terrain du haut avec des sprites bitmap
        const segments = 8; // Moins de segments car on utilise des textures
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.7;
            const variation = Math.random() * this.terrainHeight * 0.3;
            const height = baseHeight + variation;
            
            // Créer un sprite avec la texture bitmap
            const textureKey = `terrain-${this.terrainType}`;
            const terrainSprite = this.scene.add.tileSprite(x, 0, segmentWidth, height, textureKey);
            terrainSprite.setOrigin(0, 0);
            
            // Ajouter à la physique
            this.scene.physics.add.existing(terrainSprite, true); // true = static
            this.add(terrainSprite);
            
            console.log(`✅ Top terrain segment ${i} created with sprite`);
        }
    }
    
    createBottomTerrain() {
        // Créer le terrain du bas avec des sprites bitmap
        const segments = 8;
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.7;
            const variation = Math.random() * this.terrainHeight * 0.3;
            const height = baseHeight + variation;
            
            // Créer un sprite avec la texture bitmap
            const textureKey = `terrain-${this.terrainType}`;
            const terrainSprite = this.scene.add.tileSprite(x, GameConfig.height - height, segmentWidth, height, textureKey);
            terrainSprite.setOrigin(0, 0);
            
            // Ajouter à la physique
            this.scene.physics.add.existing(terrainSprite, true); // true = static
            this.add(terrainSprite);
            
            console.log(`✅ Bottom terrain segment ${i} created with sprite`);
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
        console.log(`🌍 Changing BITMAP terrain from ${this.terrainType} to ${newType}`);
        this.terrainType = newType;
        
        // Nettoyer les anciens terrains
        this.clear(true, true);
        
        // Recréer les textures et le terrain
        this.createTerrainTextures();
        this.createTopTerrain();
        this.createBottomTerrain();
    }
}
