// Configuration du jeu R-Type 2
const GameConfig = {
    width: 800,
    height: 600,
    backgroundColor: '#000011',
    
    // Paramètres du joueur
    player: {
        speed: 200,
        lives: 3,
        fireRate: 150
    },
    
    // Paramètres des ennemis
    enemies: {
        speed: 100,
        spawnRate: 2000,
        types: ['basic', 'fast', 'heavy']
    },
    
    // Paramètres des boss
    bosses: [
        { name: 'Serpent Mécanique', health: 50, pattern: 'serpent' },
        { name: 'Croiseur Lourd', health: 75, pattern: 'cruiser' },
        { name: 'Station Orbitale', health: 100, pattern: 'station' },
        { name: 'Dreadnought', health: 125, pattern: 'dreadnought' },
        { name: 'Core Alien', health: 200, pattern: 'final' }
    ],
    
    // Système de points
    scoring: {
        enemy: 100,
        boss: 1000,
        levelComplete: 5000,
        lifeBonus: 10000
    },
    
    // Niveaux
    levels: {
        count: 5,
        backgrounds: ['space1', 'asteroid', 'nebula', 'station', 'alien'],
        difficulty: [1, 1.2, 1.5, 1.8, 2.2]
    }
};
