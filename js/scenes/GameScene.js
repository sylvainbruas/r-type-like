// Scène principale du jeu
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // Groupes d'objets
        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.bosses = this.physics.add.group();
        
        // Créer le joueur
        this.player = new Player(this, 100, GameConfig.height / 2);
        
        // Gestion des touches
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Variables de jeu
        this.lastFired = 0;
        this.enemySpawnTimer = 0;
        this.levelStartTime = this.time.now;
        this.bossSpawned = false;
        this.levelComplete = false;
        this.maxPlayerBullets = 2; // Limite de projectiles simultanés
        
        // Collisions
        this.setupCollisions();
        
        // Démarrer la génération d'ennemis
        this.startEnemySpawning();
        
        // Fond étoilé animé
        this.createStarfield();
    }
    
    setupCollisions() {
        // Balles du joueur vs ennemis
        this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.takeDamage(1);
            rTypeGame.addScore(GameConfig.scoring.enemy);
        });
        
        // Balles du joueur vs boss
        this.physics.add.overlap(this.playerBullets, this.bosses, (bullet, boss) => {
            bullet.destroy();
            boss.takeDamage(1);
        });
        
        // Joueur vs ennemis
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            enemy.destroy();
            this.playerHit();
        });
        
        // Joueur vs balles ennemies
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
            bullet.destroy();
            this.playerHit();
        });
        
        // Joueur vs boss
        this.physics.add.overlap(this.player, this.bosses, (player, boss) => {
            this.playerHit();
        });
    }
    
    createStarfield() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, GameConfig.width),
                Phaser.Math.Between(0, GameConfig.height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );
            star.speed = Phaser.Math.Between(20, 100);
            this.stars.push(star);
        }
    }
    
    startEnemySpawning() {
        this.enemySpawnEvent = this.time.addEvent({
            delay: GameConfig.enemies.spawnRate / GameConfig.levels.difficulty[rTypeGame.gameState.level - 1],
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }
    
    spawnEnemy() {
        if (!this.bossSpawned && this.enemies.children.entries.length < 5) {
            const enemy = new Enemy(this, GameConfig.width + 50, Phaser.Math.Between(50, GameConfig.height - 50));
            this.enemies.add(enemy);
        }
    }
    
    spawnBoss() {
        if (!this.bossSpawned) {
            this.bossSpawned = true;
            this.enemySpawnEvent.destroy();
            
            const bossData = GameConfig.bosses[rTypeGame.gameState.level - 1];
            const boss = new Boss(this, GameConfig.width + 100, GameConfig.height / 2, bossData);
            this.bosses.add(boss);
        }
    }
    
    playerHit() {
        if (!this.player.invulnerable) {
            this.player.hit();
            rTypeGame.loseLife();
            
            if (rTypeGame.gameState.lives <= 0) {
                this.scene.start('GameOverScene');
            }
        }
    }
    
    update(time, delta) {
        // Mouvement du joueur
        this.player.update(this.cursors);
        
        // Tir du joueur
        if (this.spaceKey.isDown && time > this.lastFired + GameConfig.player.fireRate) {
            // Vérifier le nombre de projectiles actifs
            if (this.playerBullets.children.entries.length < this.maxPlayerBullets) {
                this.fireBullet();
                this.lastFired = time;
            }
        }
        
        // Animation du fond étoilé
        this.stars.forEach(star => {
            star.x -= star.speed * delta / 1000;
            if (star.x < -10) {
                star.x = GameConfig.width + 10;
                star.y = Phaser.Math.Between(0, GameConfig.height);
            }
        });
        
        // Logique de niveau
        const levelDuration = 30000; // 30 secondes par niveau
        if (time - this.levelStartTime > levelDuration && !this.bossSpawned) {
            this.spawnBoss();
        }
        
        // Vérifier si le niveau est terminé
        if (this.bossSpawned && this.bosses.children.entries.length === 0 && !this.levelComplete) {
            this.completeLevel();
        }
        
        // Nettoyer les balles hors écran
        this.cleanupBullets();
    }
    
    fireBullet() {
        // Créer le projectile à droite du vaisseau
        const bullet = new Bullet(this, this.player.x + 30, this.player.y, 'player');
        this.playerBullets.add(bullet);
        
        // S'assurer que le projectile va vers la droite
        bullet.setVelocityX(400);
        bullet.setVelocityY(0);
    }
    
    completeLevel() {
        this.levelComplete = true;
        
        if (rTypeGame.gameState.level >= GameConfig.levels.count) {
            // Jeu terminé
            this.add.text(GameConfig.width / 2, GameConfig.height / 2, 'FÉLICITATIONS!\nVOUS AVEZ SAUVÉ LA GALAXIE!', {
                fontSize: '32px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                align: 'center'
            }).setOrigin(0.5);
            
            this.time.delayedCall(3000, () => {
                this.scene.start('MenuScene');
                rTypeGame.restart();
            });
        } else {
            // Niveau suivant
            rTypeGame.nextLevel();
            this.time.delayedCall(2000, () => {
                this.scene.restart();
            });
        }
    }
    
    cleanupBullets() {
        // Nettoyer les projectiles du joueur hors écran
        this.playerBullets.children.entries.forEach(bullet => {
            if (bullet.x > GameConfig.width + 50 || bullet.y < -50 || bullet.y > GameConfig.height + 50) {
                bullet.destroy();
            }
        });
        
        // Nettoyer les projectiles ennemis hors écran
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.x < -50 || bullet.y < -50 || bullet.y > GameConfig.height + 50) {
                bullet.destroy();
            }
        });
    }
}
