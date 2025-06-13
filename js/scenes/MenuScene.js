// Scène du menu principal
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
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
            this.scene.start('GameScene', { level: 1 }); // Commencer au niveau 1
        });
    }
}
