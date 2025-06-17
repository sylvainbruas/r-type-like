// Classe des ennemis
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'basic') {
        // Choisir un sprite d'ennemi aléatoire
        const textureKey = Enemy.getRandomEnemyTexture(scene);
        super(scene, x, y, textureKey);
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propriétés de l'ennemi
        this.enemyType = type;
        this.textureUsed = textureKey; // Stocker la texture utilisée
        this.health = this.getHealthByType(type);
        this.maxHealth = this.health;
        this.speed = this.getSpeedByType(type);
        this.fireRate = this.getFireRateByType(type);
        this.lastFired = 0;
        this.lastLoggedTime = -1; // Pour éviter les logs répétitifs
        
        // Apparence selon le type
        this.setupAppearance();
        
        // Mouvement initial
        this.setVelocityX(-this.speed);
        
        // Pattern de mouvement
        this.movementPattern = this.getMovementPattern();
        this.startTime = scene.time ? scene.time.now : Date.now();
        
        // Auto-destruction si hors écran
        this.checkBounds();
    }
    
    getHealthByType(type) {
        switch (type) {
            case 'fast': return 1;
            case 'heavy': return 3;
            default: return 2;
        }
    }
    
    getSpeedByType(type) {
        const baseSpeed = GameConfig.enemies.speed * GameConfig.levels.difficulty[rTypeGame.gameState.level - 1];
        switch (type) {
            case 'fast': return baseSpeed * 1.5;
            case 'heavy': return baseSpeed * 0.7;
            default: return baseSpeed;
        }
    }
    
    getFireRateByType(type) {
        // Tous les ennemis tirent toutes les 5 secondes (5000ms)
        switch (type) {
            case 'fast': return 5000;
            case 'heavy': return 5000;
            default: return 5000;
        }
    }
    
    setupAppearance() {
        // Si on utilise un sprite SVG coloré, préserver les couleurs originales
        if (this.textureUsed && (this.textureUsed === 'enemy1' || this.textureUsed === 'enemy2' || this.textureUsed === 'enemy3')) {
            // Pas de teinte, garder les couleurs SVG originales
            this.clearTint();
            
            // Ajuster seulement la taille selon le type
            switch (this.enemyType) {
                case 'fast':
                    this.setScale(0.8);
                    break;
                case 'heavy':
                    this.setScale(1.3);
                    break;
                default:
                    this.setScale(1);
            }
        } else {
            // Pour le sprite fallback procédural, utiliser les teintes comme avant
            switch (this.enemyType) {
                case 'fast':
                    this.setTint(0x00ff00);
                    this.setScale(0.8);
                    break;
                case 'heavy':
                    this.setTint(0xff8800);
                    this.setScale(1.3);
                    break;
                default:
                    this.setTint(0xff0000);
                    this.setScale(1);
            }
        }
    }
    
    getMovementPattern() {
        const patterns = ['straight', 'sine', 'zigzag'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    
    update() {
        // Vérifications de sécurité
        if (!this.scene || !this.scene.time || !this.active) {
            return; // Sortir si l'ennemi est détruit ou la scène invalide
        }
        
        const currentTime = this.scene.time.now;
        const elapsed = currentTime - this.startTime;
        
        // Pattern de mouvement
        switch (this.movementPattern) {
            case 'sine':
                this.y += Math.sin(elapsed * 0.003) * 2;
                break;
            case 'zigzag':
                if (Math.floor(elapsed / 1000) % 2 === 0) {
                    this.setVelocityY(-50);
                } else {
                    this.setVelocityY(50);
                }
                break;
            default:
                // Mouvement droit
                break;
        }
        
        // Tir automatique
        if (currentTime > this.lastFired + this.fireRate && this.x < GameConfig.width - 100) {
            this.fire();
            this.lastFired = currentTime;
        }
        
        // Vérifier les limites
        this.checkBounds();
    }
    
    fire() {
        if (this.scene && this.scene.enemyBullets) {
            const bullet = new Bullet(this.scene, this.x - 20, this.y, 'enemy');
            this.scene.enemyBullets.add(bullet);
        } else {
            console.warn('⚠️ Enemy cannot fire: scene or enemyBullets missing');
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        
        // Effet visuel de dégât
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            this.setupAppearance();
        });
        
        if (this.health <= 0) {
            this.explode();
        }
    }
    
    explode() {
        // Effet d'explosion
        const explosion = this.scene.add.particles(this.x, this.y, 'bullet', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            lifespan: 400,
            tint: 0xff4400,
            quantity: 8
        });
        
        this.scene.time.delayedCall(400, () => {
            explosion.destroy();
        });
        
        this.destroy();
    }
    
    checkBounds() {
        if (this.x < -50 || this.y < -50 || this.y > GameConfig.height + 50) {
            this.destroy();
        }
    }
    
    // Méthode statique pour choisir aléatoirement un sprite d'ennemi
    static getRandomEnemyTexture(scene) {
        // Liste des sprites d'ennemis disponibles
        const enemyTextures = [];
        
        // Vérifier quels sprites SVG sont disponibles
        if (scene.textures.exists('enemy1')) {
            enemyTextures.push('enemy1');
        }
        if (scene.textures.exists('enemy2')) {
            enemyTextures.push('enemy2');
        }
        if (scene.textures.exists('enemy3')) {
            enemyTextures.push('enemy3');
        }
        
        // Si aucun sprite SVG n'est disponible, utiliser le fallback
        if (enemyTextures.length === 0) {
            return 'enemy';
        }
        
        // Choisir aléatoirement parmi les sprites disponibles
        const randomIndex = Math.floor(Math.random() * enemyTextures.length);
        const selectedTexture = enemyTextures[randomIndex];
        
        return selectedTexture;
    }
    
    // Méthode pour obtenir le nom du type d'ennemi selon la texture
    static getEnemyTypeName(textureKey) {
        switch(textureKey) {
            case 'enemy1': return 'Intercepteur Rouge';
            case 'enemy2': return 'Croiseur Violet';
            case 'enemy3': return 'Chasseur Vert';
            default: return 'Ennemi Standard';
        }
    }
}
