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
        
        // Charger la DeLorean pour le joueur
        this.load.svg('player-delorean', 'assets/images/player.svg', { width: 64, height: 32 });
        
        // Charger les 3 types d'ennemis
        this.load.svg('enemy1', 'assets/images/enemy1.svg', { width: 32, height: 32 });
        this.load.svg('enemy2', 'assets/images/enemy2.svg', { width: 32, height: 32 });
        this.load.svg('enemy3', 'assets/images/enemy3.svg', { width: 32, height: 32 });
        
        // Charger les autres assets
        this.load.svg('bullet-svg', 'assets/images/bullet.svg', { width: 8, height: 4 });
        this.load.svg('enemy-missile', 'assets/images/enemy-missile.svg', { width: 32, height: 8 });
        
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
        
        if (deloreanLoaded) {
            console.log('🎯 La DeLorean sera utilisée comme sprite du joueur !');
        }
    }
}
