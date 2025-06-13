// Scène de fin de jeu
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        // Récupérer les données passées depuis GameScene
        const sceneData = this.scene.settings.data || {};
        const finalScore = sceneData.score || 0;
        const finalLevel = sceneData.level || 1;
        const gameStats = sceneData.finalStats || {};
        
        console.log('GameOver - Score:', finalScore, 'Level:', finalLevel, 'Stats:', gameStats);
        
        // Fond sombre
        this.add.rectangle(0, 0, GameConfig.width, GameConfig.height, 0x000000, 0.8).setOrigin(0);
        
        // Titre Game Over
        this.add.text(GameConfig.width / 2, 150, 'GAME OVER', {
            fontSize: '48px',
            fill: '#ff0000',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Score final
        this.add.text(GameConfig.width / 2, 220, `Score Final: ${finalScore}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(GameConfig.width / 2, 250, `Niveau Atteint: ${finalLevel}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Statistiques détaillées
        if (gameStats.enemiesKilled !== undefined) {
            this.add.text(GameConfig.width / 2, 290, `Ennemis Détruits: ${gameStats.enemiesKilled}`, {
                fontSize: '18px',
                fill: '#cccccc',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }
        
        if (gameStats.accuracy !== undefined) {
            this.add.text(GameConfig.width / 2, 315, `Précision: ${gameStats.accuracy}%`, {
                fontSize: '18px',
                fill: '#cccccc',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }
        
        if (gameStats.shotsFired !== undefined) {
            this.add.text(GameConfig.width / 2, 340, `Tirs Effectués: ${gameStats.shotsFired}`, {
                fontSize: '16px',
                fill: '#999999',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }
        
        if (gameStats.playTime !== undefined) {
            const minutes = Math.floor(gameStats.playTime / 60);
            const seconds = gameStats.playTime % 60;
            this.add.text(GameConfig.width / 2, 360, `Temps de Jeu: ${minutes}:${seconds.toString().padStart(2, '0')}`, {
                fontSize: '16px',
                fill: '#999999',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }
        
        // Options de redémarrage
        const restartText = this.add.text(GameConfig.width / 2, 380, 'APPUYEZ SUR R POUR REJOUER', {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        const menuText = this.add.text(GameConfig.width / 2, 410, 'APPUYEZ SUR M POUR LE MENU', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Animation des textes
        this.tweens.add({
            targets: [restartText, menuText],
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Gestion des touches
        this.input.keyboard.on('keydown-R', () => {
            rTypeGame.restart();
            this.scene.start('GameScene', { level: 1, score: 0, lives: 3 }); // Redémarrer avec les valeurs par défaut
        });
        
        this.input.keyboard.on('keydown-M', () => {
            rTypeGame.restart();
            this.scene.start('MenuScene');
        });
        
        // Calculer et afficher les statistiques
        this.displayStats();
    }
    
    displayStats() {
        const stats = [
            `Ennemis Détruits: ${Math.floor(rTypeGame.gameState.score / GameConfig.scoring.enemy)}`,
            `Boss Vaincus: ${rTypeGame.gameState.level - 1}`,
            `Précision: ${this.calculateAccuracy()}%`
        ];
        
        stats.forEach((stat, index) => {
            this.add.text(GameConfig.width / 2, 360 + (index * 25), stat, {
                fontSize: '16px',
                fill: '#ffff00',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        });
    }
    
    calculateAccuracy() {
        // Calcul approximatif de la précision basé sur le score
        const estimatedShots = rTypeGame.gameState.score / GameConfig.scoring.enemy * 3;
        const hits = rTypeGame.gameState.score / GameConfig.scoring.enemy;
        return Math.min(100, Math.round((hits / Math.max(estimatedShots, 1)) * 100));
    }
}
