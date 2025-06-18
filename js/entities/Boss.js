// Classe des boss - SYSTÈME REFAIT COMPLÈTEMENT
class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bossData) {
        // Déterminer le sprite du boss selon le niveau
        const bossSprite = Boss.getBossSprite(scene.levelManager.currentLevel);
        console.log(`🔧 Creating boss with sprite: ${bossSprite} for level ${scene.levelManager.currentLevel}`);
        
        super(scene, x, y, bossSprite);
        
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
        this.lastLogTime = -1;
        
        // Zone de mouvement (30% droit de l'écran, toute la hauteur hors décors)
        this.movementZone = {
            left: GameConfig.width * 0.7,  // 70% de l'écran (30% droits)
            right: GameConfig.width - 20,  // Marge de 20px du bord
            top: 20,                        // Marge haute (hors décors)
            bottom: GameConfig.height - 20  // Marge basse (hors décors)
        };
        
        console.log(`🔧 Movement zone:`, this.movementZone);
        
        // Ajuster la taille selon le sprite du boss
        this.setBossScale(scene.levelManager.currentLevel);
        
        // Barre de vie
        this.createHealthBar();
        
        // Entrée du boss
        this.enterScreen();
        
        // Afficher le nom du boss
        this.showBossName();
        
        console.log(`🔧 Boss initialization complete`);
    }
    
    setBossScale(level) {
        // Les sprites SVG sont déjà aux bonnes dimensions
        this.setScale(1.0, 1.0);
        console.log(`👾 Boss niveau ${level}: sprite=${Boss.getBossSprite(level)}, scale=1.0`);
    }
    
    enterScreen() {
        // Entrée simple depuis la droite
        this.setVelocityX(-100);
        
        // Arrêter l'entrée quand on atteint la zone de mouvement
        this.scene.time.delayedCall(2000, () => {
            this.setVelocityX(0);
            this.entryComplete = true;
            // Position dans le centre de la zone de mouvement
            this.x = (this.movementZone.left + this.movementZone.right) / 2;
            this.y = (this.movementZone.top + this.movementZone.bottom) / 2;
            console.log(`Boss positioned in movement zone: x=${this.x}, y=${this.y}`);
        });
    }
    
    update() {
        if (!this.entryComplete) {
            return;
        }
        
        // Mouvement simple et direct
        this.updateSimpleMovement();
        
        // Patterns d'attaque
        this.executePattern();
        
        // Changer de phase selon la vie
        this.updatePhase();
        
        // Mise à jour de la barre de vie
        this.updateHealthBar();
    }
    
    updateSimpleMovement() {
        // Mouvement basé uniquement sur le pattern du boss
        const elapsed = this.scene.time.now - this.startTime;
        
        switch (this.pattern) {
            case 'serpent':
                this.simpleSerpentMovement(elapsed);
                break;
            case 'cruiser':
                this.simpleCruiserMovement(elapsed);
                break;
            case 'station':
                this.simpleStationMovement(elapsed);
                break;
            case 'dreadnought':
                this.simpleDreadnoughtMovement(elapsed);
                break;
            case 'final':
                this.simpleFinalMovement(elapsed);
                break;
            default:
                this.simpleDefaultMovement(elapsed);
                break;
        }
        
        // Maintenir le boss dans sa zone
        this.constrainToMovementZone();
    }
    
    simpleSerpentMovement(elapsed) {
        // Mouvement serpentin simple et efficace - VITESSE RÉDUITE DE MOITIÉ
        const zoneHeight = this.movementZone.bottom - this.movementZone.top;
        const zoneWidth = this.movementZone.right - this.movementZone.left;
        const centerY = this.movementZone.top + zoneHeight / 2;
        const centerX = this.movementZone.left + zoneWidth / 2;
        
        // Amplitude verticale très visible (90% de la zone)
        const verticalAmplitude = zoneHeight * 0.45; // 45% de chaque côté = 90% total
        const horizontalAmplitude = zoneWidth * 0.3;  // 30% de mouvement horizontal
        
        // Fréquence RÉDUITE DE MOITIÉ pour mouvement plus lent
        const time = elapsed * 0.001; // Convertir en secondes
        const verticalFreq = 0.25; // 0.25 Hz = 1 cycle toutes les 4 secondes (était 0.5 Hz = 2 sec)
        const horizontalFreq = 0.15; // Légèrement différent pour effet serpentin (était 0.3)
        
        // Calculer les positions cibles
        const targetY = centerY + Math.sin(time * verticalFreq * 2 * Math.PI) * verticalAmplitude;
        const targetX = centerX + Math.cos(time * horizontalFreq * 2 * Math.PI) * horizontalAmplitude;
        
        // Appliquer directement les positions (pas de vélocité)
        this.y = targetY;
        this.x = targetX;
        
        // Debug occasionnel
        if (Math.floor(time) !== this.lastLogTime) {
            this.lastLogTime = Math.floor(time);
            console.log(`🐍 Serpent (VITESSE /2) - Y: ${Math.round(this.y)} (range: ${Math.round(centerY - verticalAmplitude)}-${Math.round(centerY + verticalAmplitude)})`);
        }
    }
    
    simpleCruiserMovement(elapsed) {
        // Mouvement vertical lent et régulier - VITESSE RÉDUITE DE MOITIÉ
        const zoneHeight = this.movementZone.bottom - this.movementZone.top;
        const centerY = this.movementZone.top + zoneHeight / 2;
        const centerX = this.movementZone.left + (this.movementZone.right - this.movementZone.left) * 0.6;
        
        const verticalAmplitude = zoneHeight * 0.3;
        const time = elapsed * 0.0004; // RÉDUIT DE MOITIÉ (était 0.0008)
        
        this.y = centerY + Math.sin(time * 2 * Math.PI) * verticalAmplitude;
        this.x = centerX;
    }
    
    simpleStationMovement(elapsed) {
        // Mouvement orbital - VITESSE RÉDUITE DE MOITIÉ
        const zoneHeight = this.movementZone.bottom - this.movementZone.top;
        const zoneWidth = this.movementZone.right - this.movementZone.left;
        const centerY = this.movementZone.top + zoneHeight / 2;
        const centerX = this.movementZone.left + zoneWidth / 2;
        
        const verticalRadius = zoneHeight * 0.25;
        const horizontalRadius = zoneWidth * 0.2;
        const time = elapsed * 0.0003; // RÉDUIT DE MOITIÉ (était 0.0006)
        
        this.y = centerY + Math.sin(time * 2 * Math.PI) * verticalRadius;
        this.x = centerX + Math.cos(time * 2 * Math.PI) * horizontalRadius;
    }
    
    simpleDreadnoughtMovement(elapsed) {
        // Mouvement agressif et imprévisible - VITESSE RÉDUITE DE MOITIÉ
        const zoneHeight = this.movementZone.bottom - this.movementZone.top;
        const zoneWidth = this.movementZone.right - this.movementZone.left;
        const centerY = this.movementZone.top + zoneHeight / 2;
        const centerX = this.movementZone.left + zoneWidth * 0.7;
        
        const verticalAmplitude = zoneHeight * 0.35;
        const horizontalAmplitude = zoneWidth * 0.2;
        const time = elapsed * 0.0005; // RÉDUIT DE MOITIÉ (était 0.001)
        
        // Mouvement chaotique avec plusieurs fréquences
        const y1 = Math.sin(time * 0.7 * 2 * Math.PI) * verticalAmplitude * 0.6;
        const y2 = Math.cos(time * 1.3 * 2 * Math.PI) * verticalAmplitude * 0.4;
        const x1 = Math.sin(time * 0.5 * 2 * Math.PI) * horizontalAmplitude;
        
        this.y = centerY + y1 + y2;
        this.x = centerX + x1;
    }
    
    simpleFinalMovement(elapsed) {
        // Mouvement chaotique du boss final - VITESSE RÉDUITE DE MOITIÉ
        const zoneHeight = this.movementZone.bottom - this.movementZone.top;
        const zoneWidth = this.movementZone.right - this.movementZone.left;
        const centerY = this.movementZone.top + zoneHeight / 2;
        const centerX = this.movementZone.left + zoneWidth / 2;
        
        const verticalAmplitude = zoneHeight * 0.4;
        const horizontalAmplitude = zoneWidth * 0.3;
        const time = elapsed * 0.0006; // RÉDUIT DE MOITIÉ (était 0.0012)
        
        // Mouvement très chaotique
        const y1 = Math.sin(time * 0.8 * 2 * Math.PI) * verticalAmplitude * 0.5;
        const y2 = Math.cos(time * 1.7 * 2 * Math.PI) * verticalAmplitude * 0.3;
        const y3 = Math.sin(time * 2.3 * 2 * Math.PI) * verticalAmplitude * 0.2;
        const x1 = Math.cos(time * 0.6 * 2 * Math.PI) * horizontalAmplitude * 0.7;
        const x2 = Math.sin(time * 1.1 * 2 * Math.PI) * horizontalAmplitude * 0.3;
        
        this.y = centerY + y1 + y2 + y3;
        this.x = centerX + x1 + x2;
    }
    
    simpleDefaultMovement(elapsed) {
        // Mouvement par défaut simple - VITESSE RÉDUITE DE MOITIÉ
        const zoneHeight = this.movementZone.bottom - this.movementZone.top;
        const centerY = this.movementZone.top + zoneHeight / 2;
        const centerX = this.movementZone.left + (this.movementZone.right - this.movementZone.left) / 2;
        
        const verticalAmplitude = zoneHeight * 0.2;
        const time = elapsed * 0.00025; // RÉDUIT DE MOITIÉ (était 0.0005)
        
        this.y = centerY + Math.sin(time * 2 * Math.PI) * verticalAmplitude;
        this.x = centerX;
    }
    
    constrainToMovementZone() {
        // Maintenir le boss dans sa zone de mouvement
        if (this.x < this.movementZone.left) {
            this.x = this.movementZone.left;
        }
        if (this.x > this.movementZone.right) {
            this.x = this.movementZone.right;
        }
        if (this.y < this.movementZone.top) {
            this.y = this.movementZone.top;
        }
        if (this.y > this.movementZone.bottom) {
            this.y = this.movementZone.bottom;
        }
    }
    
    executePattern() {
        // Patterns d'attaque simplifiés
        const currentTime = this.scene.time.now;
        
        if (currentTime - this.lastFired > 2000) { // Tirer toutes les 2 secondes
            this.fireBullet();
            this.lastFired = currentTime;
        }
    }
    
    fireBullet() {
        // Tir simple vers le joueur
        if (this.scene.player && this.scene.enemyBullets) {
            const bullet = this.scene.physics.add.sprite(this.x - 20, this.y, 'enemy-missile');
            this.scene.enemyBullets.add(bullet);
            bullet.setVelocityX(-200);
            
            // Détruire la balle si elle sort de l'écran
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        
        // Effet de dégât
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
        
        if (this.health <= 0) {
            this.destroy();
        }
    }
    
    updatePhase() {
        // Changer de phase selon la vie
        const healthPercent = this.health / this.maxHealth;
        
        if (healthPercent <= 0.3 && this.phase === 1) {
            this.phase = 2;
            console.log('Boss entered phase 2!');
        }
    }
    
    createHealthBar() {
        const barWidth = 200;
        const barHeight = 10;
        const x = (GameConfig.width - barWidth) / 2;
        const y = 30;
        
        // Fond de la barre
        this.healthBarBg = this.scene.add.rectangle(x, y, barWidth, barHeight, 0x333333);
        this.healthBarBg.setOrigin(0, 0);
        
        // Barre de vie
        this.healthBar = this.scene.add.rectangle(x, y, barWidth, barHeight, 0x00ff00);
        this.healthBar.setOrigin(0, 0);
        
        // Texte du boss
        this.healthText = this.scene.add.text(x, y - 20, 'BOSS', {
            fontSize: '16px',
            fill: '#ffffff'
        });
    }
    
    updateHealthBar() {
        if (this.healthBar) {
            const healthPercent = Math.max(0, this.health / this.maxHealth);
            const barWidth = 200 * healthPercent;
            this.healthBar.width = barWidth;
            
            // Changer la couleur selon la vie
            if (healthPercent > 0.6) {
                this.healthBar.fillColor = 0x00ff00; // Vert
            } else if (healthPercent > 0.3) {
                this.healthBar.fillColor = 0xffff00; // Jaune
            } else {
                this.healthBar.fillColor = 0xff0000; // Rouge
            }
        }
    }
    
    showBossName() {
        const bossName = Boss.getBossName(this.scene.levelManager.currentLevel);
        const nameText = this.scene.add.text(GameConfig.width / 2, GameConfig.height / 2 - 50, 
            `BOSS: ${bossName}`, {
            fontSize: '32px',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        });
        nameText.setOrigin(0.5);
        
        // Faire disparaître le texte après 3 secondes
        this.scene.time.delayedCall(3000, () => {
            nameText.destroy();
        });
    }
    
    destroy() {
        // Nettoyer les éléments UI
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthText) this.healthText.destroy();
        
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
