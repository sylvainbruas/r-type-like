// Scène du menu principal
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    preload() {
        // Créer des graphiques simples pour le prototype
        this.load.image('player', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="16" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,8 8,0 24,4 32,8 24,12 8,16" fill="#00ff00"/>
                <circle cx="28" cy="8" r="2" fill="#ffff00"/>
            </svg>
        `));
        
        this.load.image('enemy', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="16" xmlns="http://www.w3.org/2000/svg">
                <polygon points="24,8 16,0 0,4 0,12 16,16" fill="#ff0000"/>
                <circle cx="4" cy="8" r="2" fill="#ffff00"/>
            </svg>
        `));
        
        this.load.image('bullet', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="8" height="4" xmlns="http://www.w3.org/2000/svg">
                <rect width="8" height="4" fill="#00ffff"/>
            </svg>
        `));
    }
    
    create() {
        // Titre du jeu
        this.add.text(GameConfig.width / 2, 150, 'R-TYPE 2', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(GameConfig.width / 2, 200, 'REMAKE', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(GameConfig.width / 2, 300, 'CONTRÔLES:', {
            fontSize: '20px',
            fill: '#ffff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(GameConfig.width / 2, 340, 'Flèches: Déplacement', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(GameConfig.width / 2, 360, 'Espace: Tirer', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Bouton de démarrage
        const startButton = this.add.text(GameConfig.width / 2, 450, 'APPUYEZ SUR ENTRÉE POUR COMMENCER', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // Animation du bouton
        this.tweens.add({
            targets: startButton,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Gestion des touches
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }
}
