// Classe des projectiles
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, owner, angle = 0) {
        super(scene, x, y, 'bullet');
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propriétés du projectile
        this.owner = owner;
        this.speed = 400;
        this.damage = 1;
        
        // Configuration selon le propriétaire
        this.setupByOwner(owner, angle);
        
        // Auto-destruction après un certain temps
        scene.time.delayedCall(5000, () => {
            if (this.active) {
                this.destroy();
            }
        });
    }
    
    setupByOwner(owner, angle) {
        if (owner === 'player') {
            // Projectile du joueur - TOUJOURS vers la droite
            this.setTint(0x00ffff);
            this.setVelocity(this.speed, 0); // Vitesse horizontale positive, verticale nulle
            this.setScale(1, 0.5);
            
            // Effet de traînée
            this.trail = this.scene.add.particles(this.x, this.y, 'bullet', {
                speed: { min: 20, max: 50 },
                scale: { start: 0.2, end: 0 },
                lifespan: 100,
                tint: 0x00ffff,
                alpha: { start: 0.6, end: 0 },
                frequency: 50
            });
            this.trail.startFollow(this);
            
        } else {
            // Projectile ennemi
            this.setTint(0xff0000);
            this.setScale(0.8);
            
            if (angle !== 0) {
                // Projectile avec angle
                const radians = Phaser.Math.DegToRad(angle);
                this.setVelocity(
                    Math.cos(radians) * -this.speed,
                    Math.sin(radians) * this.speed
                );
                this.setRotation(radians);
            } else {
                // Projectile droit vers la gauche
                this.setVelocity(-this.speed, 0);
            }
            
            // Effet de traînée rouge
            this.trail = this.scene.add.particles(this.x, this.y, 'bullet', {
                speed: { min: 10, max: 30 },
                scale: { start: 0.15, end: 0 },
                lifespan: 80,
                tint: 0xff0000,
                alpha: { start: 0.4, end: 0 },
                frequency: 80
            });
            this.trail.startFollow(this);
        }
    }
    
    update() {
        // Vérifier si le projectile est hors écran
        if (this.x < -50 || this.x > GameConfig.width + 50 || 
            this.y < -50 || this.y > GameConfig.height + 50) {
            this.destroy();
        }
    }
    
    destroy() {
        // Nettoyer l'effet de traînée
        if (this.trail) {
            this.trail.destroy();
        }
        
        // Petit effet d'impact
        if (this.scene && this.active) {
            const impact = this.scene.add.particles(this.x, this.y, 'bullet', {
                speed: { min: 30, max: 80 },
                scale: { start: 0.3, end: 0 },
                lifespan: 150,
                tint: this.owner === 'player' ? 0x00ffff : 0xff0000,
                quantity: 3
            });
            
            this.scene.time.delayedCall(150, () => {
                if (impact) impact.destroy();
            });
        }
        
        super.destroy();
    }
    
    // Méthode pour forcer la direction (utilisée par GameScene)
    setDirection(velocityX, velocityY = 0) {
        this.setVelocity(velocityX, velocityY);
    }
}
