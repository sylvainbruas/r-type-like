// Classe pour les décors de terrain alien
class AlienTerrain extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.terrainHeight = Math.floor(GameConfig.height * 0.1); // 10% de l'écran
        
        this.createTopTerrain();
        this.createBottomTerrain();
    }
    
    createTopTerrain() {
        // Terrain du haut - formations rocheuses aliens
        const segments = 8;
        const segmentWidth = GameConfig.width / segments;
        
        for (let i = 0; i < segments; i++) {
            const x = i * segmentWidth;
            const baseHeight = this.terrainHeight * 0.6;
            const variation = Math.random() * this.terrainHeight * 0.4;
            const height = baseHeight + variation;
            
            // Créer un segment de terrain
            const terrain = this.scene.add.graphics();
            
            // Couleurs aliens - violet/vert/cyan
            const colors = [0x6600CC, 0x00AA44, 0x0088CC, 0x8800CC, 0x00CC88];
            const mainColor = colors[Math.floor(Math.random() * colors.length)];
            const darkColor = mainColor * 0.7;
            
            // Base du terrain
            terrain.fillStyle(mainColor);
            terrain.fillRect(0, 0, segmentWidth + 2, height);
            
            // Détails rocheux
            terrain.fillStyle(darkColor);
            terrain.fillRect(0, height * 0.8, segmentWidth + 2, height * 0.2);
            
            // Cristaux aliens
            if (Math.random() > 0.6) {
                terrain.fillStyle(0x00FFFF);
                const crystalX = Math.random() * segmentWidth * 0.6 + segmentWidth * 0.2;
                const crystalHeight = Math.random() * height * 0.3 + 5;
                terrain.fillTriangle(crystalX, height - crystalHeight, 
                                   crystalX - 3, height, 
                                   crystalX + 3, height);
            }
            
            // Végétation alien
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
