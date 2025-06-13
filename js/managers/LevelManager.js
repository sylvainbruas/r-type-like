// Gestionnaire des niveaux
class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levelData = this.initializeLevelData();
        this.enemiesSpawned = 0;
        this.enemiesKilled = 0;
        this.bossDefeated = false;
    }
    
    initializeLevelData() {
        return {
            1: {
                name: "Secteur Spatial",
                background: "#000022",
                enemyCount: 15,
                enemyTypes: ['basic'],
                boss: GameConfig.bosses[0],
                music: 'level1',
                duration: 30000
            },
            2: {
                name: "Champ d'Astéroïdes",
                background: "#220011",
                enemyCount: 20,
                enemyTypes: ['basic', 'fast'],
                boss: GameConfig.bosses[1],
                music: 'level2',
                duration: 35000
            },
            3: {
                name: "Nébuleuse Toxique",
                background: "#112200",
                enemyCount: 25,
                enemyTypes: ['basic', 'fast', 'heavy'],
                boss: GameConfig.bosses[2],
                music: 'level3',
                duration: 40000
            },
            4: {
                name: "Station Ennemie",
                background: "#221100",
                enemyCount: 30,
                enemyTypes: ['fast', 'heavy'],
                boss: GameConfig.bosses[3],
                music: 'level4',
                duration: 45000
            },
            5: {
                name: "Cœur Alien",
                background: "#220022",
                enemyCount: 35,
                enemyTypes: ['basic', 'fast', 'heavy'],
                boss: GameConfig.bosses[4],
                music: 'level5',
                duration: 50000
            }
        };
    }
    
    getCurrentLevelData() {
        return this.levelData[this.currentLevel] || this.levelData[5];
    }
    
    getEnemySpawnRate() {
        const baseRate = GameConfig.enemies.spawnRate;
        const difficulty = GameConfig.levels.difficulty[this.currentLevel - 1] || 2.2;
        return baseRate / difficulty;
    }
    
    getRandomEnemyType() {
        const levelData = this.getCurrentLevelData();
        const types = levelData.enemyTypes;
        return types[Math.floor(Math.random() * types.length)];
    }
    
    shouldSpawnBoss(elapsedTime) {
        const levelData = this.getCurrentLevelData();
        return elapsedTime >= levelData.duration && !this.bossDefeated;
    }
    
    canSpawnEnemy() {
        const levelData = this.getCurrentLevelData();
        return this.enemiesSpawned < levelData.enemyCount && !this.bossDefeated;
    }
    
    enemySpawned() {
        this.enemiesSpawned++;
    }
    
    enemyKilled() {
        this.enemiesKilled++;
    }
    
    bossKilled() {
        this.bossDefeated = true;
    }
    
    isLevelComplete() {
        return this.bossDefeated;
    }
    
    nextLevel() {
        if (this.currentLevel < GameConfig.levels.count) {
            this.currentLevel++;
            this.resetLevelStats();
            return true;
        }
        return false; // Jeu terminé
    }
    
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    getLevelData(level = null) {
        const targetLevel = level || this.currentLevel;
        return this.levelData[targetLevel] || null;
    }
    
    setCurrentLevel(level) {
        this.currentLevel = level;
        this.resetLevelStats();
        return this.currentLevel;
    }
    
    nextLevel() {
        this.currentLevel++;
        this.resetLevelStats();
        return this.currentLevel;
    }
    
    resetLevelStats() {
        this.enemiesSpawned = 0;
        this.enemiesKilled = 0;
        this.bossDefeated = false;
    }
    
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    getLevelProgress() {
        const levelData = this.getCurrentLevelData();
        const enemyProgress = this.enemiesKilled / levelData.enemyCount;
        const bossProgress = this.bossDefeated ? 1 : 0;
        
        return {
            enemies: Math.min(1, enemyProgress),
            boss: bossProgress,
            overall: this.bossDefeated ? 1 : enemyProgress * 0.8
        };
    }
    
    getDifficultyMultiplier() {
        return GameConfig.levels.difficulty[this.currentLevel - 1] || 2.2;
    }
    
    getLevelStats() {
        return {
            level: this.currentLevel,
            enemiesSpawned: this.enemiesSpawned,
            enemiesKilled: this.enemiesKilled,
            bossDefeated: this.bossDefeated,
            progress: this.getLevelProgress()
        };
    }
    
    reset() {
        this.currentLevel = 1;
        this.resetLevelStats();
    }
    
    // Méthodes pour les effets visuels du niveau
    getLevelBackground() {
        const levelData = this.getCurrentLevelData();
        return levelData.background;
    }
    
    getLevelName() {
        const levelData = this.getCurrentLevelData();
        return levelData.name;
    }
    
    // Calcul du score bonus de fin de niveau
    getLevelCompletionBonus() {
        const baseBonus = GameConfig.scoring.levelComplete;
        const difficultyBonus = this.getDifficultyMultiplier() * 1000;
        const accuracyBonus = (this.enemiesKilled / Math.max(this.enemiesSpawned, 1)) * 2000;
        
        return Math.floor(baseBonus + difficultyBonus + accuracyBonus);
    }
}
