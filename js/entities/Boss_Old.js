// Classe des boss
class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bossData) {
        // Déterminer le sprite du boss selon le niveau
        const bossSprite = Boss.getBossSprite(scene.levelManager.currentLevel);
        console.log(`🔧 DEBUG: Creating boss with sprite: ${bossSprite} for level ${scene.levelManager.currentLevel}`);
        
        super(scene, x, y, bossSprite);
        
        // Ajouter à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        console.log(`🔧 DEBUG: Boss created at position (${x}, ${y})`);
        console.log(`🔧 DEBUG: Boss initial scale: (${this.scaleX}, ${this.scaleY})`);
        
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
        this.lastLogTime = -1; // Pour les logs occasionnels de debug
        
        // Zone de mouvement (30% droit de l'écran, toute la hauteur hors décors)
        this.movementZone = {
            left: GameConfig.width * 0.7,  // 70% de l'écran (30% droits)
            right: GameConfig.width - 20,  // Marge de 20px du bord
            top: 20,                        // Marge haute (hors décors)
            bottom: GameConfig.height - 20  // Marge basse (hors décors)
        };
        
        console.log(`🔧 DEBUG: Movement zone:`, this.movementZone);
        console.log(`🔧 DEBUG: GameConfig dimensions: ${GameConfig.width}x${GameConfig.height}`);
        
        // Ajuster la taille selon le sprite du boss (pas de déformation)
        this.setBossScale(scene.levelManager.currentLevel);
        
        console.log(`🔧 DEBUG: Boss scale after setBossScale: (${this.scaleX}, ${this.scaleY})`);
        
        // Pas de teinte par défaut pour garder les couleurs originales du sprite
        // this.setTint(0xff00ff); // Supprimé pour garder les couleurs du sprite
        
        // Barre de vie
        this.createHealthBar();
        
        // Entrée du boss
        this.enterScreen();
        
        // Afficher le nom du boss
        this.showBossName();
        
        // Initialiser la vitesse
        this.updateMovementSpeed();
        
        console.log(`🔧 DEBUG: Boss initialization complete. Current speed: ${this.currentSpeed}`);
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
        // Vérifier que la scène existe
        if (!this.scene || !this.scene.add) {
            return;
        }
        
        const warningText = this.scene.add.text(GameConfig.width / 2, GameConfig.height / 2, 
            `ATTENTION!\n${this.bossData.name.toUpperCase()}`, {
            fontSize: '32px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
        
        // Animation d'apparition
        if (this.scene.tweens) {
            this.scene.tweens.add({
                targets: warningText,
                alpha: 0,
                duration: 200,
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    if (warningText && warningText.destroy) {
                        warningText.destroy();
                    }
                }
            });
        } else {
            // Fallback si tweens n'est pas disponible
            this.scene.time.delayedCall(3000, () => {
                if (warningText && warningText.destroy) {
                    warningText.destroy();
                }
            });
        }
    }
    
    enterScreen() {
        // Entrée depuis la droite vers la zone de mouvement (30% droits)
        this.setVelocityX(-120);
        
        this.scene.time.delayedCall(1500, () => {
            this.setVelocityX(0);
            this.entryComplete = true;
            // Position dans le centre de la zone de mouvement
            this.x = (this.movementZone.left + this.movementZone.right) / 2;
            this.y = (this.movementZone.top + this.movementZone.bottom) / 2;
            this.originalX = this.x;
            console.log(`Boss positioned in movement zone: x=${this.x}, y=${this.y}`);
        });
    }
    
    update() {
        if (!this.entryComplete) {
            return;
        }
        
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
        // Vitesse équilibrée entre 60% et 90% de celle du joueur
        const minSpeed = this.playerSpeed * 0.6;
        const maxSpeed = this.playerSpeed * 0.9;
        this.currentSpeed = Phaser.Math.Between(minSpeed, maxSpeed);
        console.log('🔧 DEBUG: Boss speed (BALANCED):', this.currentSpeed, 'Player speed:', this.playerSpeed);
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
        // Mouvement sinusoïdal vertical avec amplitude DOUBLÉE (x2)
        const amplitude = (this.movementZone.bottom - this.movementZone.top) * 0.95; // 95% de la hauteur (amplitude MAXIMALE)
        const frequency = 0.0075; // x2.5 plus rapide que 0.003 normal
        const centerY = (this.movementZone.top + this.movementZone.bottom) / 2;
        const targetY = centerY + Math.sin(elapsed * frequency) * amplitude;
        
        // Mouvement horizontal renforcé pour effet serpentin plus prononcé
        const horizontalAmplitude = (this.movementZone.right - this.movementZone.left) * 0.35;
        const targetX = this.movementZone.left + horizontalAmplitude + Math.cos(elapsed * frequency * 0.6) * horizontalAmplitude;
        
        // Appliquer les vélocités avec réactivité très élevée pour amplitude maximale
        const velocityY = (targetY - this.y) * 0.3; // Réactivité maximale pour amplitude doublée
        const velocityX = (targetX - this.x) * 0.15; // Réactivité horizontale augmentée
        
        this.setVelocity(velocityX, velocityY);
        
        // Log occasionnel pour debug (toutes les 2 secondes)
        if (Math.floor(elapsed / 2000) !== this.lastLogTime) {
            this.lastLogTime = Math.floor(elapsed / 2000);
            console.log(`🐍 Serpent - Amplitude DOUBLÉE: ${Math.round(amplitude)}px (95% de ${Math.round(this.movementZone.bottom - this.movementZone.top)}px)`);
            console.log(`🐍 Position Y: ${Math.round(this.y)} | Target Y: ${Math.round(targetY)} | Zone: ${Math.round(this.movementZone.top)}-${Math.round(this.movementZone.bottom)}`);
        }
    }
    
    cruiserMovement(elapsed) {
        // Mouvement vertical plus ample et régulier (croiseur lourd)
        const amplitude = (this.movementZone.bottom - this.movementZone.top) * 0.25;
        const frequency = 0.0015;
        const centerY = (this.movementZone.top + this.movementZone.bottom) / 2;
        const targetY = centerY + Math.sin(elapsed * frequency) * amplitude;
        
        // Mouvement horizontal minimal (reste dans sa zone)
        const targetX = this.movementZone.left + (this.movementZone.right - this.movementZone.left) * 0.6;
        
        const velocityY = (targetY - this.y) * 0.06;
        const velocityX = (targetX - this.x) * 0.02;
        this.setVelocity(velocityX, velocityY);
    }
    
    stationMovement(elapsed) {
        // Mouvement orbital complexe (station orbitale)
        const centerY = (this.movementZone.top + this.movementZone.bottom) / 2;
        const centerX = (this.movementZone.left + this.movementZone.right) / 2;
        
        const radiusY = (this.movementZone.bottom - this.movementZone.top) * 0.2;
        const radiusX = (this.movementZone.right - this.movementZone.left) * 0.3;
        const frequency = 0.002;
        
        const targetY = centerY + Math.sin(elapsed * frequency) * radiusY;
        const targetX = centerX + Math.cos(elapsed * frequency * 0.7) * radiusX;
        
        const velocityY = (targetY - this.y) * 0.05;
        const velocityX = (targetX - this.x) * 0.03;
        this.setVelocity(velocityX, velocityY);
    }
    
    dreadnoughtMovement(elapsed) {
        // Mouvement agressif et imprévisible (dreadnought)
        const amplitude1 = (this.movementZone.bottom - this.movementZone.top) * 0.2;
        const amplitude2 = (this.movementZone.bottom - this.movementZone.top) * 0.1;
        const frequency1 = 0.0025;
        const frequency2 = 0.004;
        
        const centerY = (this.movementZone.top + this.movementZone.bottom) / 2;
        const targetY = centerY + 
                       Math.sin(elapsed * frequency1) * amplitude1 + 
                       Math.cos(elapsed * frequency2) * amplitude2;
        
        // Mouvement horizontal plus agressif
        const horizontalRange = (this.movementZone.right - this.movementZone.left) * 0.4;
        const targetX = this.movementZone.left + horizontalRange + 
                       Math.sin(elapsed * frequency1 * 0.6) * horizontalRange * 0.5;
        
        const velocityY = (targetY - this.y) * 0.07;
        const velocityX = (targetX - this.x) * 0.04;
        this.setVelocity(velocityX, velocityY);
    }
    
    finalMovement(elapsed) {
        // Mouvement chaotique et imprévisible (Core Alien - Boss Final)
        const amplitude = (this.movementZone.bottom - this.movementZone.top) * 0.25;
        const frequency1 = 0.004;
        const frequency2 = 0.002;
        const frequency3 = 0.0015;
        
        const centerY = (this.movementZone.top + this.movementZone.bottom) / 2;
        const centerX = (this.movementZone.left + this.movementZone.right) / 2;
        
        const targetY = centerY + 
                       Math.sin(elapsed * frequency1) * amplitude +
                       Math.cos(elapsed * frequency2) * (amplitude * 0.5) +
                       Math.sin(elapsed * frequency3) * (amplitude * 0.3);
        
        // Mouvement horizontal chaotique
        const horizontalAmplitude = (this.movementZone.right - this.movementZone.left) * 0.3;
        const targetX = centerX + 
                       Math.cos(elapsed * frequency1 * 0.8) * horizontalAmplitude +
                       Math.sin(elapsed * frequency2 * 1.2) * (horizontalAmplitude * 0.4);
        
        const velocityY = (targetY - this.y) * 0.08;
        const velocityX = (targetX - this.x) * 0.05;
        this.setVelocity(velocityX, velocityY);
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
        // Capturer les références nécessaires avant la destruction
        const scene = this.scene;
        const bossX = this.x;
        const bossY = this.y;
        
        // Vérifier que la scène existe
        if (!scene || !scene.add || !scene.active) {
            this.destroy();
            return;
        }
        
        // Explosion spectaculaire
        for (let i = 0; i < 10; i++) {
            scene.time.delayedCall(i * 100, () => {
                // Double vérification que la scène existe encore
                if (scene && scene.add && scene.active) {
                    const explosion = scene.add.particles(
                        bossX + Phaser.Math.Between(-50, 50),
                        bossY + Phaser.Math.Between(-50, 50),
                        'bullet', {
                        speed: { min: 100, max: 300 },
                        scale: { start: 0.8, end: 0 },
                        lifespan: 600,
                        tint: 0xff4400,
                        quantity: 15
                    });
                    
                    // Nettoyer l'explosion après un délai
                    scene.time.delayedCall(600, () => {
                        if (explosion && explosion.destroy) {
                            explosion.destroy();
                        }
                    });
                }
            });
        }
        
        // Ajouter les points du boss (utiliser le scoreManager local)
        if (scene.scoreManager && scene.scoreManager.addScore) {
            scene.scoreManager.addScore(GameConfig.scoring.boss, 'boss');
        }
        
        // Nettoyer l'interface
        this.cleanupUI();
        
        // Programmer la destruction du boss
        scene.time.delayedCall(1000, () => {
            if (this.active) {
                this.destroy();
            }
        });
    }
    
    cleanupUI() {
        try {
            if (this.healthBar && this.healthBar.destroy) {
                this.healthBar.destroy();
                this.healthBar = null;
            }
            if (this.healthBarBg && this.healthBarBg.destroy) {
                this.healthBarBg.destroy();
                this.healthBarBg = null;
            }
            if (this.bossNameText && this.bossNameText.destroy) {
                this.bossNameText.destroy();
                this.bossNameText = null;
            }
        } catch (error) {
            console.warn('Error cleaning up boss UI:', error);
        }
    }
    
    destroy() {
        // Nettoyer l'interface avant la destruction
        this.cleanupUI();
        
        // Vérifier que l'objet est encore actif avant la destruction
        if (this.active) {
            super.destroy();
        }
    }
    
    // Méthodes statiques pour la gestion des sprites
    static getBossSprite(level) {
        const bossSprites = {
            1: 'boss1', // Serpent Mécanique - Secteur Spatial
            2: 'boss2', // Croiseur Lourd - Champ d'Astéroïdes
            3: 'boss3', // Station Orbitale - Nébuleuse Toxique
            4: 'boss4', // Dreadnought - Station Ennemie
            5: 'boss5'  // Core Alien - Cœur Alien (Boss Final)
        };
        
        return bossSprites[level] || 'enemy'; // Fallback vers sprite ennemi générique
    }
    
    setBossScale(level) {
        // Les sprites SVG sont déjà aux bonnes dimensions, pas besoin de scaling
        // Garder l'échelle 1:1 pour éviter la déformation
        this.setScale(1.0, 1.0);
        
        console.log(`👾 Boss niveau ${level}: sprite=${Boss.getBossSprite(level)}, scale=1.0 (dimensions préservées)`);
    }
    
    static getBossName(level) {
        const bossNames = {
            1: 'Serpent Mécanique',
            2: 'Croiseur Lourd',
            3: 'Station Orbitale',
            4: 'Dreadnought',
            5: 'Core Alien'
        };
        
        return bossNames[level] || 'Boss Inconnu';
    }
}
