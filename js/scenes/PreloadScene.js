// Scène de préchargement des assets
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    
    preload() {
        // Créer d'abord les textures de fallback avec les bonnes clés
        this.createPlayerTexture();
        this.createEnemyTexture();
        this.createBulletTexture();
        this.createBossTextures();
        
        // Charger la DeLorean pour le joueur
        this.load.svg('player-delorean', 'assets/images/player.svg', { width: 64, height: 32 });
        
        // Charger les 3 types d'ennemis
        this.load.svg('enemy1', 'assets/images/enemy1.svg', { width: 32, height: 32 });
        this.load.svg('enemy2', 'assets/images/enemy2.svg', { width: 32, height: 32 });
        this.load.svg('enemy3', 'assets/images/enemy3.svg', { width: 32, height: 32 });
        
        // Charger les autres assets
        this.load.svg('bullet-svg', 'assets/images/bullet.svg', { width: 8, height: 4 });
        this.load.svg('enemy-missile', 'assets/images/enemy-missile.svg', { width: 32, height: 8 });
        
        // Charger les sprites des boss
        this.load.svg('boss1', 'assets/images/boss1.svg', { width: 240, height: 120 });
        this.load.svg('boss2', 'assets/images/boss2.svg', { width: 220, height: 140 });
        this.load.svg('boss3', 'assets/images/boss3.svg', { width: 200, height: 160 });
        this.load.svg('boss4', 'assets/images/boss4.svg', { width: 260, height: 120 });
        this.load.svg('boss5', 'assets/images/boss5.svg', { width: 200, height: 200 });
        
        // Barre de chargement
        this.createLoadingBar();
    }
    
    createPlayerTexture() {
        const graphics = this.add.graphics();
        
        // Vaisseau du joueur (vert) - fallback
        graphics.fillStyle(0x00ff00);
        graphics.fillTriangle(0, 8, 8, 0, 8, 16);
        graphics.fillRect(8, 4, 16, 8);
        graphics.fillTriangle(24, 4, 32, 8, 24, 12);
        
        // Réacteur (jaune)
        graphics.fillStyle(0xffff00);
        graphics.fillCircle(28, 8, 2);
        
        graphics.generateTexture('player', 32, 16);
        graphics.destroy();
    }
    
    createEnemyTexture() {
        const graphics = this.add.graphics();
        
        // Vaisseau ennemi (rouge) - fallback
        graphics.fillStyle(0xff0000);
        graphics.fillTriangle(24, 8, 16, 0, 16, 16);
        graphics.fillRect(0, 4, 16, 8);
        
        // Réacteur (jaune)
        graphics.fillStyle(0xffff00);
        graphics.fillCircle(4, 8, 2);
        
        graphics.generateTexture('enemy', 24, 16);
        graphics.destroy();
    }
    
    createBulletTexture() {
        const graphics = this.add.graphics();
        
        // Projectile (cyan) - fallback
        graphics.fillStyle(0x00ffff);
        graphics.fillRect(0, 0, 8, 4);
        
        graphics.generateTexture('bullet', 8, 4);
        graphics.destroy();
    }
    
    createBossTextures() {
        // Boss 1 - Serpent Mécanique (fallback)
        const graphics1 = this.add.graphics();
        graphics1.fillStyle(0x666666);
        graphics1.fillRect(0, 10, 120, 20);
        graphics1.fillStyle(0xff0000);
        graphics1.fillCircle(110, 15, 3);
        graphics1.fillCircle(110, 25, 3);
        graphics1.generateTexture('boss1', 120, 40);
        graphics1.destroy();
        
        // Boss 2 - Croiseur Lourd (fallback)
        const graphics2 = this.add.graphics();
        graphics2.fillStyle(0x555555);
        graphics2.fillRect(0, 15, 110, 20);
        graphics2.fillStyle(0x777777);
        graphics2.fillRect(10, 10, 90, 10);
        graphics2.generateTexture('boss2', 110, 50);
        graphics2.destroy();
        
        // Boss 3 - Station Orbitale (fallback)
        const graphics3 = this.add.graphics();
        graphics3.fillStyle(0x4a4a6a);
        // Créer un hexagone avec fillRect au lieu de fillPolygon
        graphics3.fillRect(30, 20, 40, 20); // Corps principal
        graphics3.fillRect(35, 15, 30, 10); // Partie haute
        graphics3.fillRect(35, 35, 30, 10); // Partie basse
        graphics3.fillStyle(0x8a4fff);
        graphics3.fillCircle(50, 30, 8);
        graphics3.generateTexture('boss3', 100, 60);
        graphics3.destroy();
        
        // Boss 4 - Dreadnought (fallback)
        const graphics4 = this.add.graphics();
        graphics4.fillStyle(0x2a2a2a);
        graphics4.fillRect(0, 15, 130, 20);
        graphics4.fillStyle(0x1a1a1a);
        graphics4.fillRect(10, 10, 110, 10);
        graphics4.fillStyle(0xff0000);
        graphics4.fillCircle(120, 20, 2);
        graphics4.fillCircle(120, 30, 2);
        graphics4.generateTexture('boss4', 130, 50);
        graphics4.destroy();
        
        // Boss 5 - Core Alien (fallback)
        const graphics5 = this.add.graphics();
        graphics5.fillStyle(0x4a0e4e);
        graphics5.fillCircle(50, 50, 25);
        graphics5.fillStyle(0x9c27b0);
        graphics5.fillCircle(50, 50, 15);
        graphics5.fillStyle(0xff1744);
        graphics5.fillCircle(45, 45, 4);
        graphics5.fillCircle(55, 45, 4);
        graphics5.generateTexture('boss5', 100, 100);
        graphics5.destroy();
    }
    
    createLoadingBar() {
        const width = 400;
        const height = 20;
        const x = (this.cameras.main.width - width) / 2;
        const y = (this.cameras.main.height - height) / 2;
        
        // Fond de la barre
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0x333333);
        progressBg.fillRect(x, y, width, height);
        
        // Barre de progression
        const progressBar = this.add.graphics();
        
        // Texte de chargement
        const loadingText = this.add.text(this.cameras.main.width / 2, y - 50, 'Chargement...', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Mise à jour de la barre
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00);
            progressBar.fillRect(x, y, width * value, height);
        });
        
        this.load.on('complete', () => {
            progressBg.destroy();
            progressBar.destroy();
            loadingText.destroy();
        });
    }
    
    create() {
        // Vérifier le statut des assets et utiliser la DeLorean si disponible
        this.checkAssetLoading();
        
        // Passer au menu principal
        this.scene.start('MenuScene');
    }
    
    checkAssetLoading() {
        // Vérifier si les textures finales sont disponibles
        const playerTexture = this.textures.exists('player');
        const enemyTexture = this.textures.exists('enemy');
        const bulletTexture = this.textures.exists('bullet');
        
        console.log('🎮 Final asset status:');
        console.log('- Player:', playerTexture ? '✅ Ready' : '❌ Missing');
        console.log('- Enemy:', enemyTexture ? '✅ Ready' : '❌ Missing');
        console.log('- Bullet:', bulletTexture ? '✅ Ready' : '❌ Missing');
        
        // Vérifier spécifiquement si la DeLorean SVG a été chargée
        const deloreanLoaded = this.textures.exists('player-delorean');
        console.log('🚗 DeLorean SVG:', deloreanLoaded ? '✅ Loaded successfully' : '❌ Failed to load, using fallback');
        
        // Vérifier les 3 types d'ennemis
        const enemy1Loaded = this.textures.exists('enemy1');
        const enemy2Loaded = this.textures.exists('enemy2');
        const enemy3Loaded = this.textures.exists('enemy3');
        
        console.log('👾 Enemy Ships:');
        console.log('- Enemy 1 (Intercepteur Rouge):', enemy1Loaded ? '✅ Loaded' : '❌ Failed');
        console.log('- Enemy 2 (Croiseur Violet):', enemy2Loaded ? '✅ Loaded' : '❌ Failed');
        console.log('- Enemy 3 (Chasseur Vert):', enemy3Loaded ? '✅ Loaded' : '❌ Failed');
        
        const totalEnemiesLoaded = [enemy1Loaded, enemy2Loaded, enemy3Loaded].filter(Boolean).length;
        console.log(`🎯 ${totalEnemiesLoaded}/3 enemy types loaded successfully`);
        
        // Vérifier les sprites des boss
        const boss1Loaded = this.textures.exists('boss1');
        const boss2Loaded = this.textures.exists('boss2');
        const boss3Loaded = this.textures.exists('boss3');
        const boss4Loaded = this.textures.exists('boss4');
        const boss5Loaded = this.textures.exists('boss5');
        
        console.log('👾 Boss Sprites:');
        console.log('- Boss 1 (Serpent Mécanique):', boss1Loaded ? '✅ Loaded' : '❌ Failed');
        console.log('- Boss 2 (Croiseur Lourd):', boss2Loaded ? '✅ Loaded' : '❌ Failed');
        console.log('- Boss 3 (Station Orbitale):', boss3Loaded ? '✅ Loaded' : '❌ Failed');
        console.log('- Boss 4 (Dreadnought):', boss4Loaded ? '✅ Loaded' : '❌ Failed');
        console.log('- Boss 5 (Core Alien):', boss5Loaded ? '✅ Loaded' : '❌ Failed');
        
        const totalBossesLoaded = [boss1Loaded, boss2Loaded, boss3Loaded, boss4Loaded, boss5Loaded].filter(Boolean).length;
        console.log(`🎯 ${totalBossesLoaded}/5 boss sprites loaded successfully`);
        
        if (deloreanLoaded) {
            console.log('🎯 La DeLorean sera utilisée comme sprite du joueur !');
        }
    }
}
