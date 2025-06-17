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
        // Boss 1 - Serpent Mécanique (fallback) - Dimensions correctes 240x120
        const graphics1 = this.add.graphics();
        graphics1.fillStyle(0x666666);
        // Corps serpentin plus long pour correspondre aux dimensions SVG
        graphics1.fillRect(0, 40, 240, 40); // Corps principal
        graphics1.fillStyle(0x888888);
        graphics1.fillRect(20, 35, 200, 10); // Partie haute
        graphics1.fillRect(20, 75, 200, 10); // Partie basse
        graphics1.fillStyle(0xff0000);
        // Yeux rouges
        graphics1.fillCircle(220, 50, 4);
        graphics1.fillCircle(220, 70, 4);
        // Segments du corps
        graphics1.fillStyle(0x999999);
        for (let i = 0; i < 5; i++) {
            graphics1.fillCircle(40 + i * 40, 60, 8);
        }
        graphics1.generateTexture('boss1-fallback', 240, 120);
        graphics1.destroy();
        
        // Boss 2 - Croiseur Lourd (fallback) - Dimensions correctes 220x140
        const graphics2 = this.add.graphics();
        graphics2.fillStyle(0x555555);
        graphics2.fillRect(0, 50, 220, 40);
        graphics2.fillStyle(0x777777);
        graphics2.fillRect(20, 40, 180, 20);
        graphics2.fillRect(20, 80, 180, 20);
        graphics2.generateTexture('boss2-fallback', 220, 140);
        graphics2.destroy();
        
        // Boss 3 - Station Orbitale (fallback) - Dimensions correctes 200x160
        const graphics3 = this.add.graphics();
        graphics3.fillStyle(0x4a4a6a);
        // Créer un hexagone avec fillRect au lieu de fillPolygon
        graphics3.fillRect(60, 60, 80, 40); // Corps principal
        graphics3.fillRect(70, 50, 60, 20); // Partie haute
        graphics3.fillRect(70, 100, 60, 20); // Partie basse
        graphics3.fillStyle(0x8a4fff);
        graphics3.fillCircle(100, 80, 15);
        graphics3.generateTexture('boss3-fallback', 200, 160);
        graphics3.destroy();
        
        // Boss 4 - Dreadnought (fallback) - Dimensions correctes 260x120
        const graphics4 = this.add.graphics();
        graphics4.fillStyle(0x2a2a2a);
        graphics4.fillRect(0, 40, 260, 40);
        graphics4.fillStyle(0x1a1a1a);
        graphics4.fillRect(20, 30, 220, 20);
        graphics4.fillRect(20, 70, 220, 20);
        graphics4.fillStyle(0xff0000);
        graphics4.fillCircle(240, 50, 3);
        graphics4.fillCircle(240, 70, 3);
        graphics4.generateTexture('boss4-fallback', 260, 120);
        graphics4.destroy();
        
        // Boss 5 - Core Alien (fallback) - Dimensions correctes 200x200
        const graphics5 = this.add.graphics();
        graphics5.fillStyle(0x4a0e4e);
        graphics5.fillCircle(100, 100, 50);
        graphics5.fillStyle(0x9c27b0);
        graphics5.fillCircle(100, 100, 30);
        graphics5.fillStyle(0xff1744);
        graphics5.fillCircle(90, 90, 8);
        graphics5.fillCircle(110, 90, 8);
        graphics5.generateTexture('boss5-fallback', 200, 200);
        graphics5.destroy();
        
        console.log('🎨 Boss fallback textures created with correct dimensions');
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
        
        // Vérifier et corriger les textures de boss
        this.validateBossTextures();
        
        // Passer au menu principal
        this.scene.start('MenuScene');
    }
    
    validateBossTextures() {
        // Vérifier chaque boss et utiliser le fallback si nécessaire
        const bosses = [
            { key: 'boss1', fallback: 'boss1-fallback', name: 'Serpent Mécanique' },
            { key: 'boss2', fallback: 'boss2-fallback', name: 'Croiseur Lourd' },
            { key: 'boss3', fallback: 'boss3-fallback', name: 'Station Orbitale' },
            { key: 'boss4', fallback: 'boss4-fallback', name: 'Dreadnought' },
            { key: 'boss5', fallback: 'boss5-fallback', name: 'Core Alien' }
        ];
        
        console.log('🔧 Validating boss textures...');
        
        bosses.forEach(boss => {
            if (!this.textures.exists(boss.key)) {
                console.log(`🔧 Boss ${boss.key} (${boss.name}) failed to load, using fallback`);
                // Copier la texture fallback vers la clé principale
                if (this.textures.exists(boss.fallback)) {
                    const fallbackTexture = this.textures.get(boss.fallback);
                    this.textures.addCanvas(boss.key, fallbackTexture.source[0].image);
                    console.log(`✅ Fallback applied for ${boss.key}`);
                }
            } else {
                console.log(`✅ Boss ${boss.key} (${boss.name}) loaded successfully from SVG`);
                // Vérifier les dimensions de la texture SVG
                const texture = this.textures.get(boss.key);
                const frame = texture.get();
                console.log(`📐 ${boss.key} dimensions: ${frame.width}x${frame.height}`);
            }
        });
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
