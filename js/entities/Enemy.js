// Classe des ennemis
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type = 'basic') {
        super(scene, x, y, 'enemy');
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propriétés de l'ennemi
        this.enemyType = type;
        this.health = this.getHealthByType(type);
        this.maxHealth = this.health;
        this.speed = this.getSpeedByType(type);
        this.fireRate = this.getFireRateByType(type);
        this.lastFired = 0;
        
        // Apparence selon le type
        this.setupAppearance();
        
        // Mouvement initial
        this.setVelocityX(-this.speed);
        
        // Pattern de mouvement
        this.movementPattern = this.getMovementPattern();
        this.startTime = scene.time.now;
        
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
        switch (type) {
            case 'fast': return 1500;
            case 'heavy': return 3000;
            default: return 2000;
        }
    }
    
    setupAppearance() {
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
    
    getMovementPattern() {
        const patterns = ['straight', 'sine', 'zigzag'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    
    update() {
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
}
