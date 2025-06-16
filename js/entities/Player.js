// Classe du joueur
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Choisir la texture : DeLorean si disponible, sinon fallback
        const textureKey = scene.textures.exists('player-delorean') ? 'player-delorean' : 'player';
        super(scene, x, y, textureKey);
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propriétés du joueur
        this.setCollideWorldBounds(true);
        this.setScale(1.5);
        this.health = 1;
        this.lives = 3; // Nombre de vies du joueur
        this.invulnerable = false;
        this.invulnerabilityTime = 2000; // 2 secondes d'invulnérabilité
        
        // Effet de propulsion
        this.thruster = scene.add.particles(x - 20, y, 'bullet', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0 },
            lifespan: 200,
            tint: 0x00ffff,
            alpha: { start: 0.8, end: 0 }
        });
        
        this.thruster.startFollow(this, -25, 0);
    }
    
    update(cursors) {
        // Réinitialiser la vélocité
        this.setVelocity(0);
        
        // Mouvement horizontal
        if (cursors.left.isDown) {
            this.setVelocityX(-GameConfig.player.speed);
        } else if (cursors.right.isDown) {
            this.setVelocityX(GameConfig.player.speed);
        }
        
        // Mouvement vertical
        if (cursors.up.isDown) {
            this.setVelocityY(-GameConfig.player.speed);
        } else if (cursors.down.isDown) {
            this.setVelocityY(GameConfig.player.speed);
        }
        
        // Animation de l'effet de propulsion basée sur le mouvement
        if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            this.thruster.setFrequency(50);
        } else {
            this.thruster.setFrequency(100);
        }
        
        // Limiter le joueur à rester dans l'écran
        this.x = Phaser.Math.Clamp(this.x, 20, GameConfig.width - 20);
        this.y = Phaser.Math.Clamp(this.y, 20, GameConfig.height - 20);
    }
    
    hit() {
        if (!this.invulnerable) {
            this.invulnerable = true;
            
            // Perdre une vie
            this.lives--;
            
            // Effet visuel de dégât
            this.setTint(0xff0000);
            this.scene.tweens.add({
                targets: this,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 10,
                onComplete: () => {
                    this.clearTint();
                    this.setAlpha(1);
                    this.invulnerable = false;
                }
            });
            
            // Effet de particules d'explosion
            const explosion = this.scene.add.particles(this.x, this.y, 'bullet', {
                speed: { min: 100, max: 200 },
                scale: { start: 0.5, end: 0 },
                lifespan: 300,
                tint: 0xff0000,
                quantity: 10
            });
            
            this.scene.time.delayedCall(300, () => {
                explosion.destroy();
            });
        }
    }
    
    resetLives() {
        this.lives = 3;
    }
    
    getLives() {
        return this.lives;
    }
    
    destroy() {
        if (this.thruster) {
            this.thruster.destroy();
        }
        super.destroy();
    }
}
