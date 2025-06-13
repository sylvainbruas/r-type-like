// Scène de fin de jeu
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        // Récupérer les données passées depuis GameScene
        const sceneData = this.scene.settings.data || {};
        console.log('GameOverScene - Raw scene data:', sceneData);
        
        // Utiliser les données directement sans fallback pour debug
        const finalScore = sceneData.score;
        const finalLevel = sceneData.level;
        const gameStats = sceneData.finalStats || {};
        
        console.log('GameOver - Final Score:', finalScore, 'Final Level:', finalLevel);
        console.log('GameOver - Game Stats:', gameStats);
        
        // Fond sombre
        this.add.rectangle(0, 0, GameConfig.width, GameConfig.height, 0x000000, 0.8).setOrigin(0);
        
        // Titre Game Over
        this.add.text(GameConfig.width / 2, 150, 'GAME OVER', {
            fontSize: '48px',
            fill: '#ff0000',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Score final - affichage direct des données reçues
        this.add.text(GameConfig.width / 2, 220, `Score Final: ${finalScore !== undefined ? finalScore : 'NON DÉFINI'}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(GameConfig.width / 2, 250, `Niveau Atteint: ${finalLevel !== undefined ? finalLevel : 'NON DÉFINI'}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Statistiques détaillées seulement si disponibles
        if (gameStats && Object.keys(gameStats).length > 0) {
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
        }
        
        // Option de retour au menu uniquement
        const menuText = this.add.text(GameConfig.width / 2, 350, 'APPUYEZ SUR M POUR RETOURNER AU MENU', {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Animation du texte
        this.tweens.add({
            targets: menuText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Gestion des touches - seulement retour au menu
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start('MenuScene');
        });
    }
}
