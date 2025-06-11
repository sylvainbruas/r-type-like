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
        
        // Apparence du boss
        this.setScale(2);
        this.setTint(0xff00ff);
        
        // Barre de vie
        this.createHealthBar();
        
        // Entrée du boss
        this.enterScreen();
        
        // Afficher le nom du boss
        this.showBossName();
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
            this.x = GameConfig.width - 100;
        });
    }
    
    update() {
        if (!this.entryComplete) return;
        
        const currentTime = this.scene.time.now;
        const elapsed = currentTime - this.startTime;
        
        // Patterns d'attaque selon le type de boss
        this.executePattern(elapsed);
        
        // Changer de phase selon la vie
        this.updatePhase();
        
        // Mise à jour de la barre de vie
        this.updateHealthBar();
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
        // Mouvement sinusoïdal
        this.y = GameConfig.height / 2 + Math.sin(elapsed * 0.002) * 100;
        
        // Tir en rafale
        if (this.scene.time.now > this.lastFired + 800) {
            this.fireSpread(3);
            this.lastFired = this.scene.time.now;
        }
    }
    
    cruiserPattern(elapsed) {
        // Mouvement vertical lent
        this.y += Math.sin(elapsed * 0.001) * 0.5;
        
        // Tir rapide
        if (this.scene.time.now > this.lastFired + 500) {
            this.fireStraight();
            this.lastFired = this.scene.time.now;
        }
    }
    
    stationPattern(elapsed) {
        // Position fixe
        this.y = GameConfig.height / 2;
        
        // Tir en éventail
        if (this.scene.time.now > this.lastFired + 1200) {
            this.fireSpread(5);
            this.lastFired = this.scene.time.now;
        }
    }
    
    dreadnoughtPattern(elapsed) {
        // Mouvement complexe
        this.y = GameConfig.height / 2 + Math.sin(elapsed * 0.003) * 80 + Math.cos(elapsed * 0.001) * 40;
        
        // Tir multiple
        if (this.scene.time.now > this.lastFired + 600) {
            this.fireSpread(4);
            this.fireStraight();
            this.lastFired = this.scene.time.now;
        }
    }
    
    finalPattern(elapsed) {
        // Pattern le plus complexe
        this.y = GameConfig.height / 2 + Math.sin(elapsed * 0.004) * 120;
        
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
