// Classe des boss
class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bossData) {
        super(scene, x, y, 'enemy');
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Propriétés du boss
        this.bossData = bossData;
        this.health = bossData.health;
        this.maxHealth = bossData.health;
        this.pattern = bossData.pattern;
        this.phase = 1;
        this.lastFired = 0;
        this.startTime = scene.time.now;
        this.entryComplete = false;
        
        // Propriétés de mouvement
        this.playerSpeed = GameConfig.player.speed; // 200
        this.currentSpeed = 0;
        this.speedChangeTimer = scene.time.now; // Initialiser avec le temps actuel
        this.speedChangeDuration = 5000; // 5 secondes
        this.chargeTimer = scene.time.now; // Initialiser avec le temps actuel
        this.chargeDuration = 60000; // 1 minute
        this.isCharging = false;
        this.chargePrepTime = 10000; // 10 secondes de tremblement
        this.isPreparingCharge = false;
        this.chargeTarget = { x: 0, y: 0 };
        this.originalX = 0;
        this.trembleOffset = { x: 0, y: 0 };
        this.chargeStartTime = 0;
        
        // Zone de mouvement (tiers droit de l'écran)
        this.movementZone = {
            left: GameConfig.width * 0.67, // 67% de l'écran
            right: GameConfig.width - 50,
            top: 50,
            bottom: GameConfig.height - 50
        };
        
        // Apparence du boss
        this.setScale(2);
        this.setTint(0xff00ff);
        
        // Barre de vie
        this.createHealthBar();
        
        // Entrée du boss
        this.enterScreen();
        
        // Afficher le nom du boss
        this.showBossName();
        
        // Initialiser la vitesse
        this.updateMovementSpeed();
    }
    
    createHealthBar() {
        const barWidth = 200;
        const barHeight = 20;
        const x = GameConfig.width - barWidth - 20;
        const y = 20;
        
        // Fond de la barre
        this.healthBarBg = this.scene.add.rectangle(x, y, barWidth, barHeight, 0x333333).setOrigin(0);
        
        // Barre de vie
        this.healthBar = this.scene.add.rectangle(x, y, barWidth, barHeight, 0xff0000).setOrigin(0);
        
        // Texte du boss
        this.bossNameText = this.scene.add.text(x, y - 25, this.bossData.name, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });
    }
    
    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        const barWidth = 200 * healthPercent;
        this.healthBar.width = Math.max(0, barWidth);
        
        // Changer la couleur selon la vie
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xffff00);
        } else {
            this.healthBar.setFillStyle(0xff0000);
        }
    }
    
    showBossName() {
        const warningText = this.scene.add.text(GameConfig.width / 2, GameConfig.height / 2, 
            `ATTENTION!\n${this.bossData.name.toUpperCase()}`, {
            fontSize: '32px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
        
        // Animation d'apparition
        this.scene.tweens.add({
            targets: warningText,
            alpha: 0,
            duration: 200,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                warningText.destroy();
            }
        });
    }
    
    enterScreen() {
        this.setVelocityX(-100);
        
        this.scene.time.delayedCall(2000, () => {
            this.setVelocityX(0);
            this.entryComplete = true;
            this.x = this.movementZone.right - 50; // Position dans la zone de mouvement
            this.originalX = this.x;
        });
    }
    
    update() {
        if (!this.entryComplete) return;
        
        const currentTime = this.scene.time.now;
        const elapsed = currentTime - this.startTime;
        
        // Gestion du mouvement du boss
        this.updateBossMovement(currentTime);
        
        // Patterns d'attaque selon le type de boss
        this.executePattern(elapsed);
        
        // Changer de phase selon la vie
        this.updatePhase();
        
        // Mise à jour de la barre de vie
        this.updateHealthBar();
    }
    
    updateBossMovement(currentTime) {
        // Vérifier si c'est le moment de charger (toutes les minutes)
        if (currentTime - this.chargeTimer > this.chargeDuration && !this.isCharging && !this.isPreparingCharge) {
            this.startChargeSequence();
        }
        
        if (this.isPreparingCharge) {
            this.handleChargePreparation(currentTime);
        } else if (this.isCharging) {
            this.handleCharging();
        } else {
            this.handleNormalMovement(currentTime);
        }
        
        // Maintenir le boss dans sa zone
        this.constrainToMovementZone();
    }
    
    startChargeSequence() {
        this.isPreparingCharge = true;
        this.chargeStartTime = this.scene.time.now;
        this.setVelocity(0, 0); // Arrêter le mouvement
        
        // Plus besoin de mémoriser une position fixe car le boss va suivre en temps réel
        console.log('Boss preparing to chase player dynamically!'); // Debug
    }
    
    handleChargePreparation(currentTime) {
        const prepElapsed = currentTime - this.chargeStartTime;
        
        // Tremblement pendant 10 secondes
        if (prepElapsed < this.chargePrepTime) {
            this.trembleOffset.x = (Math.random() - 0.5) * 10;
            this.trembleOffset.y = (Math.random() - 0.5) * 10;
            this.x = this.originalX + this.trembleOffset.x;
            this.y += this.trembleOffset.y;
        } else {
            // Commencer la charge (plus besoin de capturer la position fixe)
            this.isPreparingCharge = false;
            this.isCharging = true;
            this.chargeStartTime = currentTime; // Réinitialiser pour la durée de charge
            
            console.log('Boss starting dynamic chase!'); // Debug
        }
    }
    
    handleCharging() {
        // Le boss suit maintenant le joueur en temps réel à 80% de sa vitesse
        if (this.scene.player) {
            const dx = this.scene.player.x - this.x;
            const dy = this.scene.player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const chargeSpeed = this.playerSpeed * 0.8; // 80% de la vitesse du joueur
                this.setVelocity(
                    (dx / distance) * chargeSpeed,
                    (dy / distance) * chargeSpeed
                );
            }
        }
        
        // Arrêter la charge après un certain temps ou si le boss sort trop loin
        const chargeElapsed = this.scene.time.now - this.chargeStartTime;
        const maxChargeDuration = 15000; // 15 secondes maximum de poursuite
        
        if (chargeElapsed > maxChargeDuration || 
            this.x < -200 || this.x > GameConfig.width + 200 || 
            this.y < -200 || this.y > GameConfig.height + 200) {
            this.resetAfterCharge();
        }
    }
    
    resetAfterCharge() {
        this.isCharging = false;
        this.isPreparingCharge = false;
        this.chargeTimer = this.scene.time.now; // Réinitialiser le timer de charge
        
        // Repositionner le boss dans sa zone
        this.x = this.movementZone.right - 50;
        this.y = GameConfig.height / 2;
        this.originalX = this.x;
        this.setVelocity(0, 0);
        
        // Reprendre le mouvement normal
        this.updateMovementSpeed();
        
        console.log('Boss chase complete, returning to zone'); // Debug
    }
    
    handleNormalMovement(currentTime) {
        // Changer la vitesse toutes les 5 secondes
        if (currentTime - this.speedChangeTimer > this.speedChangeDuration) {
            this.updateMovementSpeed();
            this.speedChangeTimer = currentTime;
            console.log('Boss speed updated to:', this.currentSpeed); // Debug
        }
        
        // Mouvement selon le pattern du boss
        this.applyMovementPattern(currentTime);
    }
    
    updateMovementSpeed() {
        // Vitesse entre 25% et 35% de celle du joueur
        const minSpeed = this.playerSpeed * 0.25;
        const maxSpeed = this.playerSpeed * 0.35;
        this.currentSpeed = Phaser.Math.Between(minSpeed, maxSpeed);
        console.log('New boss speed:', this.currentSpeed, 'Player speed:', this.playerSpeed); // Debug
    }
    
    applyMovementPattern(currentTime) {
        const elapsed = currentTime - this.startTime;
        
        switch (this.pattern) {
            case 'serpent':
                this.serpentMovement(elapsed);
                break;
            case 'cruiser':
                this.cruiserMovement(elapsed);
                break;
            case 'station':
                this.stationMovement(elapsed);
                break;
            case 'dreadnought':
                this.dreadnoughtMovement(elapsed);
                break;
            case 'final':
                this.finalMovement(elapsed);
                break;
        }
    }
    
    serpentMovement(elapsed) {
        // Mouvement sinusoïdal vertical simple
        const amplitude = 80;
        const frequency = 0.002;
        const targetY = GameConfig.height / 2 + Math.sin(elapsed * frequency) * amplitude;
        
        // Appliquer directement la vélocité
        const velocityY = (targetY - this.y) * 0.05;
        this.setVelocityY(velocityY);
        
        console.log('Serpent movement - Y velocity:', velocityY); // Debug
    }
    
    cruiserMovement(elapsed) {
        // Mouvement vertical lent et régulier
        const amplitude = 60;
        const frequency = 0.001;
        const targetY = GameConfig.height / 2 + Math.sin(elapsed * frequency) * amplitude;
        
        const velocityY = (targetY - this.y) * 0.03;
        this.setVelocityY(velocityY);
    }
    
    stationMovement(elapsed) {
        // Mouvement minimal vers le centre
        const targetY = GameConfig.height / 2;
        const velocityY = (targetY - this.y) * 0.01;
        this.setVelocityY(velocityY);
    }
    
    dreadnoughtMovement(elapsed) {
        // Mouvement complexe
        const amplitude1 = 70;
        const amplitude2 = 30;
        const frequency1 = 0.003;
        const frequency2 = 0.001;
        
        const targetY = GameConfig.height / 2 + 
                       Math.sin(elapsed * frequency1) * amplitude1 + 
                       Math.cos(elapsed * frequency2) * amplitude2;
        
        const velocityY = (targetY - this.y) * 0.04;
        this.setVelocityY(velocityY);
    }
    
    finalMovement(elapsed) {
        // Mouvement le plus complexe
        const amplitude = 100;
        const frequency1 = 0.004;
        const frequency2 = 0.002;
        const frequency3 = 0.0015;
        
        const targetY = GameConfig.height / 2 + 
                       Math.sin(elapsed * frequency1) * amplitude +
                       Math.cos(elapsed * frequency2) * (amplitude * 0.5) +
                       Math.sin(elapsed * frequency3) * (amplitude * 0.3);
        
        const velocityY = (targetY - this.y) * 0.05;
        this.setVelocityY(velocityY);
    }
    
    constrainToMovementZone() {
        // Pendant la charge, le boss peut aller partout sur l'écran
        if (this.isCharging) {
            // Pas de contraintes pendant la poursuite
            return;
        }
        
        // Maintenir le boss dans le tiers droit de l'écran en temps normal
        if (this.x < this.movementZone.left) {
            this.x = this.movementZone.left;
            this.setVelocityX(Math.abs(this.body.velocity.x));
        }
        if (this.x > this.movementZone.right) {
            this.x = this.movementZone.right;
            this.setVelocityX(-Math.abs(this.body.velocity.x));
        }
        if (this.y < this.movementZone.top) {
            this.y = this.movementZone.top;
            this.setVelocityY(Math.abs(this.body.velocity.y));
        }
        if (this.y > this.movementZone.bottom) {
            this.y = this.movementZone.bottom;
            this.setVelocityY(-Math.abs(this.body.velocity.y));
        }
    }
    
    executePattern(elapsed) {
        const currentTime = this.scene.time.now;
        
        switch (this.pattern) {
            case 'serpent':
                this.serpentPattern(elapsed);
                break;
            case 'cruiser':
                this.cruiserPattern(elapsed);
                break;
            case 'station':
                this.stationPattern(elapsed);
                break;
            case 'dreadnought':
                this.dreadnoughtPattern(elapsed);
                break;
            case 'final':
                this.finalPattern(elapsed);
                break;
        }
    }
    
    serpentPattern(elapsed) {
        // Tir en rafale (mouvement géré séparément)
        if (this.scene.time.now > this.lastFired + 800) {
            this.fireSpread(3);
            this.lastFired = this.scene.time.now;
        }
    }
    
    cruiserPattern(elapsed) {
        // Tir rapide (mouvement géré séparément)
        if (this.scene.time.now > this.lastFired + 500) {
            this.fireStraight();
            this.lastFired = this.scene.time.now;
        }
    }
    
    stationPattern(elapsed) {
        // Tir en éventail (mouvement géré séparément)
        if (this.scene.time.now > this.lastFired + 1200) {
            this.fireSpread(5);
            this.lastFired = this.scene.time.now;
        }
    }
    
    dreadnoughtPattern(elapsed) {
        // Tir multiple (mouvement géré séparément)
        if (this.scene.time.now > this.lastFired + 600) {
            this.fireSpread(4);
            this.fireStraight();
            this.lastFired = this.scene.time.now;
        }
    }
    
    finalPattern(elapsed) {
        // Pattern le plus complexe (mouvement géré séparément)
        if (this.phase >= 3) {
            // Phase finale - tir intense
            if (this.scene.time.now > this.lastFired + 300) {
                this.fireSpread(7);
                this.lastFired = this.scene.time.now;
            }
        } else {
            if (this.scene.time.now > this.lastFired + 700) {
                this.fireSpread(this.phase + 2);
                this.lastFired = this.scene.time.now;
            }
        }
    }
    
    fireStraight() {
        const bullet = new Bullet(this.scene, this.x - 30, this.y, 'enemy');
        this.scene.enemyBullets.add(bullet);
    }
    
    fireSpread(count) {
        const angleStep = 30 / (count - 1);
        const startAngle = -15;
        
        for (let i = 0; i < count; i++) {
            const angle = startAngle + (angleStep * i);
            const bullet = new Bullet(this.scene, this.x - 30, this.y, 'enemy', angle);
            this.scene.enemyBullets.add(bullet);
        }
    }
    
    updatePhase() {
        const healthPercent = this.health / this.maxHealth;
        
        if (healthPercent <= 0.3 && this.phase < 3) {
            this.phase = 3;
            this.setTint(0xff0000);
        } else if (healthPercent <= 0.6 && this.phase < 2) {
            this.phase = 2;
            this.setTint(0xffff00);
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        
        // Effet visuel
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            this.updatePhase();
        });
        
        if (this.health <= 0) {
            this.explode();
        }
    }
    
    explode() {
        // Explosion spectaculaire
        for (let i = 0; i < 10; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                const explosion = this.scene.add.particles(
                    this.x + Phaser.Math.Between(-50, 50),
                    this.y + Phaser.Math.Between(-50, 50),
                    'bullet', {
                    speed: { min: 100, max: 300 },
                    scale: { start: 0.8, end: 0 },
                    lifespan: 600,
                    tint: 0xff4400,
                    quantity: 15
                });
                
                this.scene.time.delayedCall(600, () => {
                    explosion.destroy();
                });
            });
        }
        
        // Ajouter les points du boss
        rTypeGame.addScore(GameConfig.scoring.boss);
        
        // Nettoyer l'interface
        this.cleanupUI();
        
        this.scene.time.delayedCall(1000, () => {
            this.destroy();
        });
    }
    
    cleanupUI() {
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.bossNameText) this.bossNameText.destroy();
    }
    
    destroy() {
        this.cleanupUI();
        super.destroy();
    }
}
