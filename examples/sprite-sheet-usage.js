/**
 * Exemple d'utilisation de la sprite sheet sprites.png
 * Ce fichier montre comment intégrer la sprite sheet dans Phaser.js
 */

// Configuration des sprites dans la sprite sheet
const SPRITE_CONFIG = {
    // Dimensions de chaque cellule dans la sprite sheet
    cellWidth: 140,
    cellHeight: 100,
    
    // Mapping des sprites avec leurs coordonnées
    sprites: {
        // Ligne 1: Joueur + Ennemis
        player: { x: 0, y: 0, frame: 0 },
        enemy1: { x: 1, y: 0, frame: 1 },
        enemy2: { x: 2, y: 0, frame: 2 },
        enemy3: { x: 3, y: 0, frame: 3 },
        
        // Ligne 2: Boss 1-4
        boss1: { x: 0, y: 1, frame: 4 },
        boss2: { x: 1, y: 1, frame: 5 },
        boss3: { x: 2, y: 1, frame: 6 },
        boss4: { x: 3, y: 1, frame: 7 },
        
        // Ligne 3: Boss 5 + Projectiles + Ennemi générique
        boss5: { x: 0, y: 2, frame: 8 },
        bullet: { x: 1, y: 2, frame: 9 },
        missile: { x: 2, y: 2, frame: 10 },
        enemy: { x: 3, y: 2, frame: 11 }
    }
};

/**
 * Classe utilitaire pour gérer la sprite sheet
 */
class SpriteSheetManager {
    constructor(scene) {
        this.scene = scene;
        this.config = SPRITE_CONFIG;
    }
    
    /**
     * Charger la sprite sheet dans PreloadScene
     */
    preload() {
        this.scene.load.spritesheet('gameSprites', 'sprites.png', {
            frameWidth: this.config.cellWidth,
            frameHeight: this.config.cellHeight
        });
    }
    
    /**
     * Créer un sprite à partir de la sprite sheet
     */
    createSprite(x, y, spriteName, scale = 1) {
        const spriteData = this.config.sprites[spriteName];
        if (!spriteData) {
            console.warn(`Sprite '${spriteName}' non trouvé dans la sprite sheet`);
            return null;
        }
        
        const sprite = this.scene.add.sprite(x, y, 'gameSprites', spriteData.frame);
        sprite.setScale(scale);
        
        return sprite;
    }
    
    /**
     * Créer un sprite physique (avec collision)
     */
    createPhysicsSprite(x, y, spriteName, scale = 1) {
        const spriteData = this.config.sprites[spriteName];
        if (!spriteData) {
            console.warn(`Sprite '${spriteName}' non trouvé dans la sprite sheet`);
            return null;
        }
        
        const sprite = this.scene.physics.add.sprite(x, y, 'gameSprites', spriteData.frame);
        sprite.setScale(scale);
        
        return sprite;
    }
    
    /**
     * Obtenir le numéro de frame d'un sprite
     */
    getFrame(spriteName) {
        const spriteData = this.config.sprites[spriteName];
        return spriteData ? spriteData.frame : 0;
    }
    
    /**
     * Lister tous les sprites disponibles
     */
    listSprites() {
        return Object.keys(this.config.sprites);
    }
}

/**
 * Exemple d'utilisation dans PreloadScene
 */
class ExamplePreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExamplePreloadScene' });
        this.spriteManager = new SpriteSheetManager(this);
    }
    
    preload() {
        // Charger la sprite sheet
        this.spriteManager.preload();
        
        console.log('Sprites disponibles:', this.spriteManager.listSprites());
    }
    
    create() {
        this.scene.start('ExampleGameScene');
    }
}

/**
 * Exemple d'utilisation dans GameScene
 */
class ExampleGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExampleGameScene' });
        this.spriteManager = new SpriteSheetManager(this);
    }
    
    create() {
        // Créer le joueur
        this.player = this.spriteManager.createPhysicsSprite(100, 300, 'player', 1);
        
        // Créer des ennemis
        this.enemy1 = this.spriteManager.createPhysicsSprite(400, 200, 'enemy1', 0.8);
        this.enemy2 = this.spriteManager.createPhysicsSprite(500, 250, 'enemy2', 0.8);
        this.enemy3 = this.spriteManager.createPhysicsSprite(450, 350, 'enemy3', 0.8);
        
        // Créer un boss
        this.boss = this.spriteManager.createPhysicsSprite(600, 300, 'boss1', 1.2);
        
        // Créer des projectiles
        this.bullets = this.physics.add.group();
        this.missiles = this.physics.add.group();
        
        // Exemple de tir
        this.input.on('pointerdown', () => {
            this.fireBullet();
        });
        
        // Afficher les informations
        this.add.text(10, 10, 'Cliquez pour tirer', { fontSize: '16px', fill: '#fff' });
        this.add.text(10, 30, 'Sprites chargés depuis sprites.png', { fontSize: '12px', fill: '#ccc' });
    }
    
    fireBullet() {
        const bullet = this.spriteManager.createPhysicsSprite(
            this.player.x + 40, 
            this.player.y, 
            'bullet', 
            1
        );
        
        if (bullet) {
            this.bullets.add(bullet);
            bullet.setVelocityX(300);
            
            // Détruire la balle quand elle sort de l'écran
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        }
    }
    
    update() {
        // Logique de jeu...
    }
}

/**
 * Configuration Phaser avec sprite sheet
 */
const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [ExamplePreloadScene, ExampleGameScene]
};

// Lancer le jeu d'exemple
// const game = new Phaser.Game(gameConfig);

/**
 * Intégration dans le jeu R-Type existant
 */

// Dans PreloadScene.js, ajouter :
/*
preload() {
    // Charger la sprite sheet en plus des SVG individuels
    this.load.spritesheet('gameSprites', 'sprites.png', {
        frameWidth: 140,
        frameHeight: 100
    });
    
    // Garder le chargement SVG pour compatibilité
    this.load.svg('player', 'assets/images/player.svg');
    // ... autres SVG
}
*/

// Dans les entités, utiliser la sprite sheet comme fallback :
/*
// Dans Player.js
constructor(scene, x, y) {
    // Essayer d'abord le SVG, puis la sprite sheet
    const texture = scene.textures.exists('player') ? 'player' : 'gameSprites';
    const frame = texture === 'gameSprites' ? SPRITE_CONFIG.sprites.player.frame : undefined;
    
    super(scene, x, y, texture, frame);
}
*/

/**
 * Avantages de cette approche :
 * 
 * 1. Performance : Un seul fichier à charger
 * 2. Fallback : Si les SVG échouent, utiliser la sprite sheet
 * 3. Cohérence : Tous les sprites dans un format uniforme
 * 4. Debug : Vue d'ensemble de tous les assets
 * 5. Optimisation : Réduction des requêtes HTTP
 */

export { SpriteSheetManager, SPRITE_CONFIG };
