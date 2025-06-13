// Tests pour la progression de niveau
describe('Progression de Niveau', function() {
    
    this.it('devrait commencer au niveau 1 par défaut', () => {
        const levelManager = new LevelManager();
        expect(levelManager.getCurrentLevel()).toBe(1);
        return true;
    });
    
    this.it('devrait permettre de définir le niveau actuel', () => {
        const levelManager = new LevelManager();
        
        levelManager.setCurrentLevel(3);
        expect(levelManager.getCurrentLevel()).toBe(3);
        
        levelManager.setCurrentLevel(1);
        expect(levelManager.getCurrentLevel()).toBe(1);
        
        return true;
    });
    
    this.it('devrait passer au niveau suivant', () => {
        const levelManager = new LevelManager();
        
        expect(levelManager.getCurrentLevel()).toBe(1);
        
        const nextLevel = levelManager.nextLevel();
        expect(nextLevel).toBe(2);
        expect(levelManager.getCurrentLevel()).toBe(2);
        
        levelManager.nextLevel();
        expect(levelManager.getCurrentLevel()).toBe(3);
        
        return true;
    });
    
    this.it('devrait récupérer les données du niveau', () => {
        const levelManager = new LevelManager();
        
        const level1Data = levelManager.getLevelData(1);
        expect(level1Data).toBeTruthy();
        expect(level1Data.name).toBe("Secteur Spatial");
        
        const level2Data = levelManager.getLevelData(2);
        expect(level2Data).toBeTruthy();
        expect(level2Data.name).toBe("Champ d'Astéroïdes");
        
        return true;
    });
    
    this.it('devrait retourner null pour un niveau inexistant', () => {
        const levelManager = new LevelManager();
        
        const invalidLevel = levelManager.getLevelData(999);
        expect(invalidLevel).toBeNull();
        
        return true;
    });
    
    this.it('devrait récupérer les données du niveau actuel par défaut', () => {
        const levelManager = new LevelManager();
        levelManager.setCurrentLevel(2);
        
        const currentLevelData = levelManager.getLevelData();
        expect(currentLevelData.name).toBe("Champ d'Astéroïdes");
        
        return true;
    });
    
    this.it('devrait réinitialiser les stats lors du changement de niveau', () => {
        const levelManager = new LevelManager();
        
        // Simuler des stats de niveau
        levelManager.enemiesSpawned = 10;
        levelManager.enemiesKilled = 8;
        levelManager.bossDefeated = false;
        
        // Passer au niveau suivant
        levelManager.nextLevel();
        
        // Vérifier que les stats sont réinitialisées
        expect(levelManager.enemiesSpawned).toBe(0);
        expect(levelManager.enemiesKilled).toBe(0);
        expect(levelManager.bossDefeated).toBeFalsy();
        
        return true;
    });
    
    this.it('devrait gérer la progression jusqu\'au niveau maximum', () => {
        const levelManager = new LevelManager();
        const maxLevels = GameConfig.levels.count; // 5 niveaux
        
        // Progresser jusqu'au niveau maximum
        for (let i = 1; i < maxLevels; i++) {
            levelManager.nextLevel();
        }
        
        expect(levelManager.getCurrentLevel()).toBe(maxLevels);
        
        // Vérifier qu'on peut encore progresser (pour le message de fin)
        levelManager.nextLevel();
        expect(levelManager.getCurrentLevel()).toBe(maxLevels + 1);
        
        return true;
    });
    
    this.it('devrait valider les données de tous les niveaux', () => {
        const levelManager = new LevelManager();
        
        for (let level = 1; level <= GameConfig.levels.count; level++) {
            const levelData = levelManager.getLevelData(level);
            
            expect(levelData).toBeTruthy();
            expect(levelData.name).toBeTruthy();
            expect(typeof levelData.name).toBe('string');
            expect(levelData.enemyCount).toBeGreaterThan(0);
            expect(Array.isArray(levelData.enemyTypes)).toBeTruthy();
            expect(levelData.boss).toBeTruthy();
        }
        
        return true;
    });
    
    this.it('devrait calculer correctement le multiplicateur de difficulté', () => {
        const levelManager = new LevelManager();
        
        // Tester différents niveaux
        levelManager.setCurrentLevel(1);
        let multiplier1 = levelManager.getDifficultyMultiplier();
        expect(multiplier1).toBeGreaterThan(0);
        
        levelManager.setCurrentLevel(3);
        let multiplier3 = levelManager.getDifficultyMultiplier();
        expect(multiplier3).toBeGreaterThan(multiplier1); // Plus difficile
        
        levelManager.setCurrentLevel(5);
        let multiplier5 = levelManager.getDifficultyMultiplier();
        expect(multiplier5).toBeGreaterThan(multiplier3); // Encore plus difficile
        
        return true;
    });
});
