// Tests pour la logique générale du jeu
describe('Logique du Jeu', function() {
    
    this.it('devrait avoir une cohérence entre les configurations', () => {
        // Vérifier que le nombre de boss correspond au nombre de niveaux
        expect(GameConfig.bosses).toHaveLength(GameConfig.levels.count);
        expect(GameConfig.levels.backgrounds).toHaveLength(GameConfig.levels.count);
        expect(GameConfig.levels.difficulty).toHaveLength(GameConfig.levels.count);
        
        return true;
    });
    
    this.it('devrait avoir des valeurs de scoring équilibrées', () => {
        // Un boss devrait valoir plusieurs ennemis
        const enemiesPerBoss = GameConfig.scoring.boss / GameConfig.scoring.enemy;
        expect(enemiesPerBoss).toBeGreaterThan(5);
        
        // Compléter un niveau devrait valoir plusieurs boss
        const bossesPerLevel = GameConfig.scoring.levelComplete / GameConfig.scoring.boss;
        expect(bossesPerLevel).toBeGreaterThan(3);
        
        return true;
    });
    
    this.it('devrait avoir une progression de difficulté logique', () => {
        const difficulties = GameConfig.levels.difficulty;
        
        // Chaque niveau devrait être plus difficile que le précédent
        for (let i = 1; i < difficulties.length; i++) {
            expect(difficulties[i]).toBeGreaterThan(difficulties[i - 1]);
        }
        
        // La difficulté ne devrait pas augmenter trop drastiquement
        for (let i = 1; i < difficulties.length; i++) {
            const increase = difficulties[i] / difficulties[i - 1];
            expect(increase).toBeLessThan(2); // Pas plus de 100% d'augmentation
        }
        
        return true;
    });
    
    this.it('devrait avoir des paramètres de joueur équilibrés', () => {
        const player = GameConfig.player;
        
        // La vitesse de tir ne devrait pas être trop rapide
        expect(player.fireRate).toBeGreaterThan(50);
        
        // Le joueur devrait avoir au moins 1 vie
        expect(player.lives).toBeGreaterThan(0);
        
        // La vitesse devrait être raisonnable
        expect(player.speed).toBeGreaterThan(0);
        expect(player.speed).toBeLessThan(500);
        
        return true;
    });
    
    this.it('devrait avoir des types d\'ennemis cohérents', () => {
        const enemyTypes = GameConfig.enemies.types;
        
        // Devrait avoir au moins 2 types d'ennemis
        expect(enemyTypes.length).toBeGreaterThan(1);
        
        // Tous les types devraient être des chaînes non vides
        enemyTypes.forEach(type => {
            expect(typeof type).toBe('string');
            expect(type.length).toBeGreaterThan(0);
        });
        
        return true;
    });
    
    this.it('devrait avoir des boss avec des patterns uniques', () => {
        const patterns = GameConfig.bosses.map(boss => boss.pattern);
        const uniquePatterns = [...new Set(patterns)];
        
        // Tous les patterns devraient être uniques
        expect(uniquePatterns).toHaveLength(patterns.length);
        
        return true;
    });
    
    this.it('devrait calculer correctement les scores avec multiplicateurs', () => {
        const scoreManager = new ScoreManager();
        
        // Score de base
        let points = scoreManager.addScore(100, 'enemy');
        expect(points).toBe(100);
        
        // Avec multiplicateur
        scoreManager.increaseMultiplier();
        points = scoreManager.addScore(100, 'enemy');
        expect(points).toBe(110); // 100 * 1.1
        
        return true;
    });
    
    this.it('devrait gérer la progression des niveaux correctement', () => {
        const levelManager = new LevelManager();
        
        // Niveau initial
        expect(levelManager.getCurrentLevel()).toBe(1);
        
        // Progression
        levelManager.nextLevel();
        expect(levelManager.getCurrentLevel()).toBe(2);
        
        // Limite maximale
        levelManager.currentLevel = 5;
        const canAdvance = levelManager.nextLevel();
        expect(canAdvance).toBeFalsy();
        
        return true;
    });
    
    this.it('devrait avoir des durées de niveau progressives', () => {
        const levelManager = new LevelManager();
        const durations = [];
        
        for (let i = 1; i <= 5; i++) {
            levelManager.currentLevel = i;
            const data = levelManager.getCurrentLevelData();
            durations.push(data.duration);
        }
        
        // Les niveaux plus avancés devraient être plus longs
        for (let i = 1; i < durations.length; i++) {
            expect(durations[i]).toBeGreaterThan(durations[i - 1]);
        }
        
        return true;
    });
    
    this.it('devrait avoir des comptes d\'ennemis progressifs', () => {
        const levelManager = new LevelManager();
        const enemyCounts = [];
        
        for (let i = 1; i <= 5; i++) {
            levelManager.currentLevel = i;
            const data = levelManager.getCurrentLevelData();
            enemyCounts.push(data.enemyCount);
        }
        
        // Les niveaux plus avancés devraient avoir plus d'ennemis
        for (let i = 1; i < enemyCounts.length; i++) {
            expect(enemyCounts[i]).toBeGreaterThan(enemyCounts[i - 1]);
        }
        
        return true;
    });
    
    this.it('devrait calculer les bonus de fin de niveau correctement', () => {
        const levelManager = new LevelManager();
        
        // Simuler quelques kills
        levelManager.enemySpawned();
        levelManager.enemyKilled();
        
        const bonus = levelManager.getLevelCompletionBonus();
        
        // Le bonus devrait inclure le bonus de base
        expect(bonus).toBeGreaterThan(GameConfig.scoring.levelComplete);
        
        return true;
    });
    
    this.it('devrait maintenir la cohérence des high scores', () => {
        const scoreManager = new ScoreManager();
        
        // Ajouter plusieurs scores
        scoreManager.addHighScore(10000, 2, 'TEST1');
        scoreManager.addHighScore(20000, 3, 'TEST2');
        scoreManager.addHighScore(15000, 2, 'TEST3');
        
        const highScores = scoreManager.getHighScores();
        
        // Devrait être trié par score décroissant
        for (let i = 1; i < highScores.length; i++) {
            expect(highScores[i - 1].score).toBeGreaterThan(highScores[i].score);
        }
        
        // Ne devrait jamais dépasser 5 entrées
        expect(highScores).toHaveLength(5);
        
        return true;
    });
    
    this.it('devrait avoir des valeurs de santé de boss équilibrées', () => {
        const bosses = GameConfig.bosses;
        
        // Le premier boss ne devrait pas être trop difficile
        expect(bosses[0].health).toBeLessThan(100);
        
        // Le boss final devrait être le plus difficile
        const finalBoss = bosses[bosses.length - 1];
        expect(finalBoss.health).toBeGreaterThan(bosses[0].health * 2);
        
        return true;
    });
    
    this.it('devrait gérer les timeouts de combo correctement', () => {
        const scoreManager = new ScoreManager();
        
        // Construire un combo
        scoreManager.addScore(100, 'enemy');
        expect(scoreManager.combo).toBe(1);
        
        // Simuler l'expiration du timer
        scoreManager.multiplierTimer = 0;
        scoreManager.update(100);
        
        expect(scoreManager.combo).toBe(0);
        expect(scoreManager.multiplier).toBe(1);
        
        return true;
    });
});
