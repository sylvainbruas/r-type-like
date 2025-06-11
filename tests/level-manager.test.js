// Tests pour le gestionnaire de niveaux
describe('LevelManager', function() {
    let levelManager;
    
    this.beforeEach(() => {
        levelManager = new LevelManager();
    });
    
    this.it('devrait initialiser au niveau 1', () => {
        expect(levelManager.getCurrentLevel()).toBe(1);
        expect(levelManager.enemiesSpawned).toBe(0);
        expect(levelManager.enemiesKilled).toBe(0);
        expect(levelManager.bossDefeated).toBeFalsy();
        return true;
    });
    
    this.it('devrait avoir des données pour tous les niveaux', () => {
        for (let i = 1; i <= 5; i++) {
            levelManager.currentLevel = i;
            const data = levelManager.getCurrentLevelData();
            
            expect(data.name).toBeTruthy();
            expect(data.background).toBeTruthy();
            expect(data.enemyCount).toBeGreaterThan(0);
            expect(data.enemyTypes).toHaveLength.toBeGreaterThan(0);
            expect(data.boss).toBeTruthy();
            expect(data.duration).toBeGreaterThan(0);
        }
        return true;
    });
    
    this.it('devrait augmenter la difficulté avec les niveaux', () => {
        const level1Data = levelManager.getCurrentLevelData();
        
        levelManager.currentLevel = 5;
        const level5Data = levelManager.getCurrentLevelData();
        
        expect(level5Data.enemyCount).toBeGreaterThan(level1Data.enemyCount);
        expect(level5Data.duration).toBeGreaterThan(level1Data.duration);
        
        return true;
    });
    
    this.it('devrait calculer le taux de spawn des ennemis selon la difficulté', () => {
        const level1Rate = levelManager.getEnemySpawnRate();
        
        levelManager.currentLevel = 5;
        const level5Rate = levelManager.getEnemySpawnRate();
        
        expect(level5Rate).toBeLessThan(level1Rate); // Plus rapide = valeur plus petite
        
        return true;
    });
    
    this.it('devrait retourner des types d\'ennemis valides', () => {
        const enemyType = levelManager.getRandomEnemyType();
        const validTypes = ['basic', 'fast', 'heavy'];
        
        expect(validTypes).toContain(enemyType);
        return true;
    });
    
    this.it('devrait gérer le spawn des ennemis', () => {
        expect(levelManager.canSpawnEnemy()).toBeTruthy();
        
        levelManager.enemySpawned();
        expect(levelManager.enemiesSpawned).toBe(1);
        
        return true;
    });
    
    this.it('devrait empêcher le spawn après avoir atteint le maximum', () => {
        const levelData = levelManager.getCurrentLevelData();
        
        // Spawner le maximum d'ennemis
        for (let i = 0; i < levelData.enemyCount; i++) {
            levelManager.enemySpawned();
        }
        
        expect(levelManager.canSpawnEnemy()).toBeFalsy();
        return true;
    });
    
    this.it('devrait empêcher le spawn après la défaite du boss', () => {
        levelManager.bossKilled();
        expect(levelManager.canSpawnEnemy()).toBeFalsy();
        return true;
    });
    
    this.it('devrait détecter quand spawner le boss', () => {
        const levelData = levelManager.getCurrentLevelData();
        
        expect(levelManager.shouldSpawnBoss(0)).toBeFalsy();
        expect(levelManager.shouldSpawnBoss(levelData.duration + 1000)).toBeTruthy();
        
        return true;
    });
    
    this.it('devrait gérer la progression du niveau', () => {
        levelManager.enemyKilled();
        expect(levelManager.enemiesKilled).toBe(1);
        
        const progress = levelManager.getLevelProgress();
        expect(progress.enemies).toBeGreaterThan(0);
        expect(progress.boss).toBe(0);
        expect(progress.overall).toBeGreaterThan(0);
        
        return true;
    });
    
    this.it('devrait détecter la completion du niveau', () => {
        expect(levelManager.isLevelComplete()).toBeFalsy();
        
        levelManager.bossKilled();
        expect(levelManager.isLevelComplete()).toBeTruthy();
        
        return true;
    });
    
    this.it('devrait passer au niveau suivant', () => {
        const canAdvance = levelManager.nextLevel();
        expect(canAdvance).toBeTruthy();
        expect(levelManager.getCurrentLevel()).toBe(2);
        
        // Stats devraient être réinitialisées
        expect(levelManager.enemiesSpawned).toBe(0);
        expect(levelManager.enemiesKilled).toBe(0);
        expect(levelManager.bossDefeated).toBeFalsy();
        
        return true;
    });
    
    this.it('devrait empêcher de dépasser le niveau 5', () => {
        levelManager.currentLevel = 5;
        const canAdvance = levelManager.nextLevel();
        
        expect(canAdvance).toBeFalsy();
        expect(levelManager.getCurrentLevel()).toBe(5);
        
        return true;
    });
    
    this.it('devrait calculer le multiplicateur de difficulté', () => {
        expect(levelManager.getDifficultyMultiplier()).toBe(1);
        
        levelManager.currentLevel = 5;
        expect(levelManager.getDifficultyMultiplier()).toBe(2.2);
        
        return true;
    });
    
    this.it('devrait fournir des statistiques complètes', () => {
        levelManager.enemySpawned();
        levelManager.enemyKilled();
        
        const stats = levelManager.getLevelStats();
        
        expect(stats.level).toBe(1);
        expect(stats.enemiesSpawned).toBe(1);
        expect(stats.enemiesKilled).toBe(1);
        expect(stats.bossDefeated).toBeFalsy();
        expect(stats.progress).toBeTruthy();
        
        return true;
    });
    
    this.it('devrait calculer le bonus de completion', () => {
        levelManager.enemySpawned();
        levelManager.enemyKilled();
        
        const bonus = levelManager.getLevelCompletionBonus();
        expect(bonus).toBeGreaterThan(GameConfig.scoring.levelComplete);
        
        return true;
    });
    
    this.it('devrait réinitialiser correctement', () => {
        levelManager.currentLevel = 3;
        levelManager.enemySpawned();
        levelManager.enemyKilled();
        levelManager.bossKilled();
        
        levelManager.reset();
        
        expect(levelManager.getCurrentLevel()).toBe(1);
        expect(levelManager.enemiesSpawned).toBe(0);
        expect(levelManager.enemiesKilled).toBe(0);
        expect(levelManager.bossDefeated).toBeFalsy();
        
        return true;
    });
    
    this.it('devrait avoir des noms de niveau uniques', () => {
        const names = [];
        for (let i = 1; i <= 5; i++) {
            levelManager.currentLevel = i;
            names.push(levelManager.getLevelName());
        }
        
        const uniqueNames = [...new Set(names)];
        expect(uniqueNames).toHaveLength(5);
        
        return true;
    });
    
    this.it('devrait avoir des backgrounds de niveau uniques', () => {
        const backgrounds = [];
        for (let i = 1; i <= 5; i++) {
            levelManager.currentLevel = i;
            backgrounds.push(levelManager.getLevelBackground());
        }
        
        const uniqueBackgrounds = [...new Set(backgrounds)];
        expect(uniqueBackgrounds).toHaveLength(5);
        
        return true;
    });
});
