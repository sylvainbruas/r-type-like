// Classe des projectiles
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, owner, angle = 0) {
        // Choisir le sprite selon le propriétaire
        const textureKey = owner === 'enemy' ? 'enemy-missile' : 'bullet';
        super(scene, x, y, textureKey);
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propriétés du projectile
        this.owner = owner;
        // Vitesse différente selon le propriétaire
        if (owner === 'enemy') {
            // Missiles ennemis : 110% de la vitesse du joueur (GameConfig.player.speed * 1.1)
            this.speed = GameConfig.player.speed * 1.1; // 200 * 1.1 = 220
        } else {
            // Bullets joueur : vitesse standard rapide
            this.speed = 400;
        }
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
            // Missile ennemi - utilise déjà le bon sprite (enemy-missile)
            // Pas de teinte car le sprite a déjà les bonnes couleurs
            this.setScale(1.0); // Taille normale pour le missile
            
            if (angle !== 0) {
                // Missile avec angle
                const radians = Phaser.Math.DegToRad(angle);
                this.setVelocity(
                    Math.cos(radians) * -this.speed,
                    Math.sin(radians) * this.speed
                );
                this.setRotation(radians);
            } else {
                // Missile droit vers la gauche à 110% de la vitesse du joueur (220 px/s)
                this.setVelocity(-this.speed, 0);
            }
            
            // Effet de traînée jaune/orange pour les missiles
            this.trail = this.scene.add.particles(this.x, this.y, 'enemy-missile', {
                speed: { min: 15, max: 40 },
                scale: { start: 0.3, end: 0 },
                lifespan: 120,
                tint: [0xFFD700, 0xFF6B00, 0xFF4444], // Jaune, orange, rouge
                alpha: { start: 0.6, end: 0 },
                frequency: 60
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
