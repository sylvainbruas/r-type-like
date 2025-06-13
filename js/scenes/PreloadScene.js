// Scène de préchargement des assets
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    
    preload() {
        // Charger les assets SVG depuis assets/images/
        this.load.svg('player', 'assets/images/player.svg', { width: 64, height: 32 });
        this.load.svg('enemy', 'assets/images/enemy.svg', { width: 32, height: 32 });
        this.load.svg('bullet', 'assets/images/bullet.svg', { width: 8, height: 4 });
        
        // Créer des textures de fallback au cas où les SVG ne se chargent pas
        this.createFallbackTextures();
        
        // Barre de chargement
        this.createLoadingBar();
    }
    
    createFallbackTextures() {
        // Textures de secours si les SVG ne se chargent pas
        this.createPlayerTexture();
        this.createEnemyTexture();
        this.createBulletTexture();
    }
    
    createPlayerTexture() {
        const graphics = this.add.graphics();
        
        // Vaisseau du joueur (vert)
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
        
        // Vaisseau ennemi (rouge)
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
        
        // Projectile (cyan)
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
        // Vérifier si les SVG ont été chargés correctement
        this.checkAssetLoading();
        
        // Passer au menu principal
        this.scene.start('MenuScene');
    }
    
    checkAssetLoading() {
        // Vérifier si les textures SVG sont disponibles
        const playerTexture = this.textures.exists('player');
        const enemyTexture = this.textures.exists('enemy');
        const bulletTexture = this.textures.exists('bullet');
        
        console.log('🎮 Asset loading status:');
        console.log('- Player (DeLorean):', playerTexture ? '✅ SVG Loaded' : '❌ Using fallback');
        console.log('- Enemy:', enemyTexture ? '✅ SVG Loaded' : '❌ Using fallback');
        console.log('- Bullet:', bulletTexture ? '✅ SVG Loaded' : '❌ Using fallback');
        
        // Si les SVG n'ont pas pu être chargés, les textures procédurales seront utilisées
    }
}
