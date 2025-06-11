// Point d'entrée principal du jeu R-Type 2
class RTypeGame {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: GameConfig.width,
            height: GameConfig.height,
            parent: 'game-container',
            backgroundColor: GameConfig.backgroundColor,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [PreloadScene, MenuScene, GameScene, GameOverScene]
        };
        
        this.game = new Phaser.Game(this.config);
        this.scoreManager = new ScoreManager();
        this.levelManager = new LevelManager();
        
        // Variables globales du jeu
        this.gameState = {
            score: 0,
            level: 1,
            lives: GameConfig.player.lives,
            isGameOver: false
        };
        
        this.initializeUI();
    }
    
    initializeUI() {
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('level').textContent = this.gameState.level;
        document.getElementById('lives').textContent = this.gameState.lives;
    }
    
    addScore(points) {
        this.gameState.score += points;
        this.updateUI();
    }
    
    loseLife() {
        this.gameState.lives--;
        this.updateUI();
        
        if (this.gameState.lives <= 0) {
            this.gameOver();
        }
    }
    
    nextLevel() {
        this.gameState.level++;
        this.addScore(GameConfig.scoring.levelComplete);
        this.updateUI();
    }
    
    gameOver() {
        this.gameState.isGameOver = true;
        this.game.scene.start('GameOverScene');
    }
    
    restart() {
        this.gameState = {
            score: 0,
            level: 1,
            lives: GameConfig.player.lives,
            isGameOver: false
        };
        this.updateUI();
    }
}

// Initialisation du jeu
let rTypeGame;

window.addEventListener('load', () => {
    rTypeGame = new RTypeGame();
});
