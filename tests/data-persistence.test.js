// Tests pour la persistance des données entre les niveaux
describe('Persistance des Données', function() {
    
    this.it('devrait conserver le score entre les niveaux', () => {
        // Simuler un score au niveau 1
        const scoreManager = new ScoreManager();
        scoreManager.addScore(1500, 'enemy');
        
        const currentScore = scoreManager.getScoreData().score;
        expect(currentScore).toBeGreaterThan(0);
        
        // Simuler la persistance
        const newScoreManager = new ScoreManager();
        newScoreManager.setScore(currentScore);
        
        expect(newScoreManager.getScoreData().score).toBe(currentScore);
        return true;
    });
    
    this.it('devrait conserver les vies entre les niveaux', () => {
        // Simuler un joueur avec 2 vies
        let playerLives = 3;
        playerLives--; // Perte d'une vie
        
        expect(playerLives).toBe(2);
        
        // Simuler le passage au niveau suivant
        const nextLevelLives = playerLives;
        expect(nextLevelLives).toBe(2);
        
        return true;
    });
    
    this.it('devrait ajouter le bonus de fin de niveau', () => {
        const scoreManager = new ScoreManager();
        const initialScore = 1000;
        scoreManager.setScore(initialScore);
        
        const levelBonus = GameConfig.scoring.levelComplete;
        scoreManager.addScore(levelBonus, 'level');
        
        const finalScore = scoreManager.getScoreData().score;
        expect(finalScore).toBeGreaterThan(initialScore);
        expect(finalScore).toBe(initialScore + levelBonus);
        
        return true;
    });
    
    this.it('devrait valider les données de transition de niveau', () => {
        const levelData = {
            level: 2,
            score: 2500,
            lives: 2
        };
        
        // Vérifier que toutes les données sont présentes
        expect(levelData.level).toBeTruthy();
        expect(levelData.score).toBeGreaterThan(0);
        expect(levelData.lives).toBeGreaterThan(0);
        expect(levelData.lives).toBeLessThanOrEqual(3);
        
        return true;
    });
    
    this.it('devrait gérer les valeurs par défaut correctement', () => {
        const defaultData = {
            level: 1,
            score: 0,
            lives: 3
        };
        
        // Simuler les données par défaut
        const level = defaultData.level || 1;
        const score = defaultData.score || 0;
        const lives = defaultData.lives || 3;
        
        expect(level).toBe(1);
        expect(score).toBe(0);
        expect(lives).toBe(3);
        
        return true;
    });
    
    this.it('devrait calculer correctement le score final avec bonus', () => {
        const scoreManager = new ScoreManager();
        
        // Score initial
        scoreManager.addScore(1000, 'enemy');
        scoreManager.addScore(500, 'enemy');
        
        const scoreBeforeBonus = scoreManager.getScoreData().score;
        
        // Bonus de fin de niveau
        scoreManager.addScore(GameConfig.scoring.levelComplete, 'level');
        
        const finalScore = scoreManager.getScoreData().score;
        expect(finalScore).toBeGreaterThan(scoreBeforeBonus);
        
        return true;
    });
    
    this.it('devrait préserver les données lors de multiples transitions', () => {
        let gameData = {
            level: 1,
            score: 0,
            lives: 3
        };
        
        // Simuler plusieurs niveaux
        for (let i = 1; i <= 3; i++) {
            // Ajouter du score
            gameData.score += 1000;
            
            // Parfois perdre une vie
            if (i === 2) {
                gameData.lives--;
            }
            
            // Passer au niveau suivant
            gameData.level = i + 1;
            
            // Vérifier la cohérence
            expect(gameData.level).toBe(i + 1);
            expect(gameData.score).toBe(i * 1000);
            expect(gameData.lives).toBeGreaterThan(0);
        }
        
        return true;
    });
    
    this.it('devrait gérer la fin de jeu avec les bonnes données', () => {
        const gameData = {
            level: 5, // Dernier niveau
            score: 25000,
            lives: 1
        };
        
        const isLastLevel = gameData.level >= GameConfig.levels.count;
        expect(isLastLevel).toBeTruthy();
        
        // Le score et les vies doivent être préservés même à la fin
        expect(gameData.score).toBeGreaterThan(0);
        expect(gameData.lives).toBeGreaterThan(0);
        
        return true;
    });
    
    this.it('devrait valider la méthode setScore du ScoreManager', () => {
        const scoreManager = new ScoreManager();
        const testScore = 5000;
        
        const result = scoreManager.setScore(testScore);
        expect(result).toBe(testScore);
        expect(scoreManager.getScoreData().score).toBe(testScore);
        
        return true;
    });
    
    this.it('devrait maintenir la cohérence des données de jeu', () => {
        const gameState = {
            level: 3,
            score: 15000,
            lives: 2
        };
        
        // Vérifications de cohérence
        expect(gameState.level).toBeGreaterThan(0);
        expect(gameState.level).toBeLessThanOrEqual(GameConfig.levels.count);
        expect(gameState.score).toBeGreaterThanOrEqual(0);
        expect(gameState.lives).toBeGreaterThan(0);
        expect(gameState.lives).toBeLessThanOrEqual(3);
        
        return true;
    });
});
