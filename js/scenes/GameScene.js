// Scène principale du jeu
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // Récupérer les données depuis les paramètres de la scène
        const sceneData = this.scene.settings.data || {};
        const currentLevel = sceneData.level || 1;
        const currentScore = sceneData.score || 0;
        const currentLives = sceneData.lives || 3;
        
        console.log('Starting level:', currentLevel, 'Score:', currentScore, 'Lives:', currentLives);
        
        // Initialiser les managers AVANT de les utiliser
        this.levelManager = new LevelManager();
        this.levelManager.setCurrentLevel(currentLevel);
        this.scoreManager = new ScoreManager();
        
        // Restaurer le score précédent APRÈS avoir initialisé le scoreManager
        if (currentScore > 0) {
            try {
                if (this.scoreManager && typeof this.scoreManager.setScore === 'function') {
                    this.scoreManager.setScore(currentScore);
                    console.log('Score restored successfully:', currentScore);
                } else if (this.scoreManager && typeof this.scoreManager.restoreScore === 'function') {
                    this.scoreManager.restoreScore(currentScore);
                    console.log('Score restored via restoreScore:', currentScore);
                } else {
                    console.warn('ScoreManager.setScore not available, using addScore fallback');
                    // Fallback : ajouter le score au lieu de le définir
                    if (this.scoreManager && typeof this.scoreManager.addScore === 'function') {
                        this.scoreManager.addScore(currentScore, 'restore');
                        console.log('Score restored via addScore fallback:', currentScore);
                    } else {
                        console.error('No method available to restore score');
                    }
                }
            } catch (error) {
                console.error('Error restoring score:', error);
                // Dernière tentative : définir directement la propriété
                if (this.scoreManager) {
                    this.scoreManager.currentScore = currentScore;
                    console.log('Score restored via direct property assignment:', currentScore);
                }
            }
        }
        
        // Groupes d'objets
        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.bosses = this.physics.add.group();
        
        // Créer le terrain alien (décors)
        this.alienTerrain = new AlienTerrain(this);
        
        // Créer le joueur
        this.player = new Player(this, 100, GameConfig.height / 2);
        
        // Restaurer les vies précédentes
        if (currentLives !== 3) {
            this.player.lives = currentLives;
        }
        
        // Initialiser les statistiques de jeu
        this.gameStats = sceneData.gameStats || {
            enemiesKilled: 0,
            shotsFired: 0,
            shotsHit: 0,
            startTime: Date.now()
        };
        
        // Gestion des touches
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Variables de jeu
        this.lastFired = 0;
        this.enemySpawnTimer = 0;
        this.groupSpawnTimer = 0; // Timer pour les groupes d'ennemis
        this.levelStartTime = this.time.now;
        this.bossSpawned = false;
        this.levelComplete = false;
        this.maxPlayerBullets = 2; // Limite de projectiles simultanés
        this.enemyGroups = []; // Tableau pour gérer les groupes d'ennemis
        
        // Collisions
        this.setupCollisions();
        
        // Démarrer la génération d'ennemis
        this.startEnemySpawning();
        
        // Fond étoilé animé
        this.createStarfield();
        
        // Afficher le niveau actuel
        this.displayLevelInfo();
        
        // Afficher l'interface utilisateur
        this.createUI();
    }
    
    createUI() {
        // Affichage des vies
        this.livesText = this.add.text(10, GameConfig.height - 30, `VIES: ${this.player.lives}`, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });
        
        // Affichage du score
        this.scoreText = this.add.text(GameConfig.width - 200, 10, 'SCORE: 0', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });
    }
    
    calculateAccuracy() {
        if (this.gameStats.shotsFired === 0) return 0;
        return Math.round((this.gameStats.shotsHit / this.gameStats.shotsFired) * 100);
    }
    
    updateUI() {
        // Mettre à jour l'affichage des vies
        if (this.livesText && this.player) {
            this.livesText.setText(`VIES: ${this.player.lives}`);
        }
        
        // Mettre à jour l'affichage du score
        if (this.scoreText && this.scoreManager) {
            const scoreData = this.scoreManager.getScoreData();
            this.scoreText.setText(`SCORE: ${scoreData.score}`);
        }
    }
    
    displayLevelInfo() {
        const currentLevel = this.levelManager.getCurrentLevel();
        const levelData = this.levelManager.getLevelData(currentLevel);
        
        // Afficher le numéro de niveau
        this.levelText = this.add.text(10, 10, `NIVEAU ${currentLevel}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        });
        
        // Afficher le nom du niveau si disponible
        if (levelData && levelData.name) {
            this.levelNameText = this.add.text(10, 35, levelData.name, {
                fontSize: '14px',
                fill: '#cccccc',
                fontFamily: 'Courier New'
            });
        }
        
        // Afficher temporairement le message de début de niveau
        const startMessage = this.add.text(GameConfig.width / 2, GameConfig.height / 2, 
            `NIVEAU ${currentLevel}\n${levelData?.name || 'SECTEUR INCONNU'}`, {
            fontSize: '32px',
            fill: '#00ff00',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
        
        // Faire disparaître le message après 2 secondes
        this.time.delayedCall(2000, () => {
            if (startMessage && startMessage.destroy) {
                startMessage.destroy();
            }
        });
    }
    
    setupCollisions() {
        // Balles du joueur vs ennemis
        this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            this.gameStats.shotsHit++; // Compter les touches
            enemy.takeDamage(1);
            this.scoreManager.addScore(GameConfig.scoring.enemy, 'enemy');
            
            // Si l'ennemi est détruit, compter la destruction
            if (enemy.health <= 0) {
                this.gameStats.enemiesKilled++;
            }
            
            this.updateUI(); // Mettre à jour le score
        });
        
        // Balles du joueur vs boss
        this.physics.add.overlap(this.playerBullets, this.bosses, (bullet, boss) => {
            bullet.destroy();
            this.gameStats.shotsHit++; // Compter les touches sur boss
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
        
        // Joueur vs terrain alien (perte de vie)
        this.physics.add.overlap(this.player, this.alienTerrain, (player, terrain) => {
            console.log('💥 Player hit alien terrain!');
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
        const currentLevel = this.levelManager.getCurrentLevel();
        const difficulty = GameConfig.levels.difficulty[currentLevel - 1] || 1;
        
        this.enemySpawnEvent = this.time.addEvent({
            delay: GameConfig.enemies.spawnRate / difficulty,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }
    
    spawnEnemy() {
        if (!this.bossSpawned && this.enemies.children.entries.length < 5) {
            // Calculer la zone sûre pour éviter le terrain alien (10% haut et bas)
            const terrainHeight = Math.floor(GameConfig.height * 0.1);
            const safeZoneTop = terrainHeight + 20; // Marge de sécurité
            const safeZoneBottom = GameConfig.height - terrainHeight - 20;
            
            const enemy = new Enemy(this, GameConfig.width + 50, 
                                  Phaser.Math.Between(safeZoneTop, safeZoneBottom));
            this.enemies.add(enemy);
            
            console.log(`👾 Enemy spawned in safe zone: ${safeZoneTop}-${safeZoneBottom}`);
        }
    }
    
    spawnBoss() {
        if (!this.bossSpawned) {
            this.bossSpawned = true;
            this.enemySpawnEvent.destroy();
            
            const currentLevel = this.levelManager.getCurrentLevel();
            const bossData = GameConfig.bosses[currentLevel - 1] || GameConfig.bosses[0];
            const boss = new Boss(this, GameConfig.width + 100, GameConfig.height / 2, bossData);
            this.bosses.add(boss);
        }
    }
    
    playerHit() {
        if (!this.player.invulnerable) {
            this.player.hit();
            
            // Mettre à jour l'interface
            this.updateUI();
            
            console.log('Player hit! Lives remaining:', this.player.lives);
            
            if (this.player.lives <= 0) {
                console.log('Player died - preparing Game Over data...');
                
                // Récupérer les données actuelles du jeu avec vérifications
                let currentScore = 0;
                let currentLevel = 1;
                
                if (this.scoreManager) {
                    const scoreData = this.scoreManager.getScoreData();
                    currentScore = scoreData ? scoreData.score : 0;
                    console.log('ScoreManager data:', scoreData);
                } else {
                    console.warn('ScoreManager not available');
                }
                
                if (this.levelManager) {
                    currentLevel = this.levelManager.getCurrentLevel();
                    console.log('LevelManager current level:', currentLevel);
                } else {
                    console.warn('LevelManager not available');
                }
                
                const accuracy = this.calculateAccuracy();
                
                console.log('Game Over - Final Score:', currentScore, 'Final Level:', currentLevel);
                console.log('Game Over - Game Stats:', this.gameStats);
                
                // Passer les données à GameOverScene
                const gameOverData = { 
                    score: currentScore, 
                    level: currentLevel,
                    finalStats: {
                        score: currentScore,
                        level: currentLevel,
                        enemiesKilled: this.gameStats ? this.gameStats.enemiesKilled : 0,
                        shotsFired: this.gameStats ? this.gameStats.shotsFired : 0,
                        shotsHit: this.gameStats ? this.gameStats.shotsHit : 0,
                        accuracy: accuracy,
                        playTime: this.gameStats ? Math.round((Date.now() - this.gameStats.startTime) / 1000) : 0
                    }
                };
                
                console.log('Sending to GameOverScene:', gameOverData);
                this.scene.start('GameOverScene', gameOverData);
            }
        }
    }
    
    update(time, delta) {
        // Mouvement du joueur
        this.player.update(this.cursors);
        
        // Mise à jour des boss
        this.bosses.children.entries.forEach(boss => {
            if (boss.update) {
                boss.update();
            }
        });
        
        // Mise à jour des groupes d'ennemis
        this.updateEnemyGroups();
        
        // Spawn des groupes d'ennemis
        if (time > this.groupSpawnTimer + this.getGroupSpawnRate() && !this.bossSpawned) {
            this.spawnEnemyGroup();
            this.groupSpawnTimer = time;
        }
        
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
    
    updateEnemyGroups() {
        // Mettre à jour tous les groupes d'ennemis
        this.enemyGroups = this.enemyGroups.filter(group => {
            if (group.isDestroyed()) {
                group.destroy();
                return false;
            }
            group.update();
            return true;
        });
    }
    
    getGroupSpawnRate() {
        // Taux de spawn des groupes (plus lent que les ennemis individuels)
        const baseRate = 8000; // 8 secondes de base
        
        // Vérifier que levelManager existe
        if (this.levelManager && typeof this.levelManager.getDifficultyMultiplier === 'function') {
            const levelMultiplier = this.levelManager.getDifficultyMultiplier();
            return baseRate / levelMultiplier;
        }
        
        // Fallback si levelManager n'est pas disponible
        return baseRate;
    }
    
    spawnEnemyGroup() {
        // Générer un point d'entrée aléatoire
        const entryPoints = [
            { x: GameConfig.width + 50, y: Phaser.Math.Between(50, GameConfig.height - 50) }, // Droite
            { x: Phaser.Math.Between(50, GameConfig.width - 50), y: -50 }, // Haut
            { x: Phaser.Math.Between(50, GameConfig.width - 50), y: GameConfig.height + 50 } // Bas
        ];
        
        const entryPoint = Phaser.Utils.Array.GetRandom(entryPoints);
        const group = new EnemyGroup(this, entryPoint);
        
        this.enemyGroups.push(group);
        
        console.log('Spawned enemy group at:', entryPoint);
    }
    
    fireBullet() {
        // Créer le projectile à droite du vaisseau
        const bullet = new Bullet(this, this.player.x + 30, this.player.y, 'player');
        this.playerBullets.add(bullet);
        
        // Compter les tirs
        this.gameStats.shotsFired++;
        
        // S'assurer que le projectile va vers la droite
        bullet.setVelocityX(400);
        bullet.setVelocityY(0);
    }
    
    completeLevel() {
        this.levelComplete = true;
        
        const currentLevel = this.levelManager.getCurrentLevel();
        const currentScore = this.scoreManager.getScoreData().score;
        const currentLives = this.player.lives;
        
        console.log('Level completed:', currentLevel, 'Score:', currentScore, 'Lives:', currentLives);
        
        if (currentLevel >= GameConfig.levels.count) {
            // Jeu terminé
            this.add.text(GameConfig.width / 2, GameConfig.height / 2, 'FÉLICITATIONS!\nVOUS AVEZ SAUVÉ LA GALAXIE!', {
                fontSize: '32px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                align: 'center'
            }).setOrigin(0.5);
            
            this.time.delayedCall(3000, () => {
                this.scene.start('MenuScene');
            });
        } else {
            // Niveau suivant
            const nextLevel = this.levelManager.nextLevel();
            
            // Bonus de fin de niveau
            const levelBonus = GameConfig.scoring.levelComplete || 1000;
            this.scoreManager.addScore(levelBonus, 'level');
            const finalScore = this.scoreManager.getScoreData().score;
            
            console.log('Moving to level:', nextLevel, 'Final score:', finalScore, 'Lives:', currentLives);
            
            // Afficher le message de niveau suivant
            this.add.text(GameConfig.width / 2, GameConfig.height / 2, `NIVEAU ${nextLevel}\nBONUS: ${levelBonus}`, {
                fontSize: '48px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                align: 'center'
            }).setOrigin(0.5);
            
            this.time.delayedCall(2000, () => {
                // Redémarrer la scène avec le nouveau niveau, score, vies ET statistiques
                this.scene.restart({ 
                    level: nextLevel, 
                    score: finalScore, 
                    lives: currentLives,
                    gameStats: {
                        enemiesKilled: this.gameStats.enemiesKilled,
                        shotsFired: this.gameStats.shotsFired,
                        shotsHit: this.gameStats.shotsHit,
                        startTime: this.gameStats.startTime
                    }
                });
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
