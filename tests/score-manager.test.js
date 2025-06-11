// Tests pour le gestionnaire de scores
describe('ScoreManager', function() {
    let scoreManager;
    
    this.beforeEach(() => {
        scoreManager = new ScoreManager();
        // Nettoyer le localStorage pour les tests
        localStorage.removeItem('rtype-highscores');
    });
    
    this.afterEach(() => {
        // Nettoyer après chaque test
        localStorage.removeItem('rtype-highscores');
    });
    
    this.it('devrait initialiser avec un score de 0', () => {
        expect(scoreManager.getCurrentScore()).toBe(0);
        expect(scoreManager.multiplier).toBe(1);
        expect(scoreManager.combo).toBe(0);
        return true;
    });
    
    this.it('devrait charger les high scores par défaut', () => {
        const highScores = scoreManager.getHighScores();
        expect(highScores).toHaveLength(5);
        expect(highScores[0].score).toBe(50000);
        expect(highScores[0].name).toBe('ACE');
        return true;
    });
    
    this.it('devrait ajouter des points correctement', () => {
        const points = scoreManager.addScore(100, 'enemy');
        expect(points).toBe(100);
        expect(scoreManager.getCurrentScore()).toBe(100);
        return true;
    });
    
    this.it('devrait gérer le système de combo', () => {
        // Premier ennemi
        scoreManager.addScore(100, 'enemy');
        expect(scoreManager.combo).toBe(1);
        
        // Deuxième ennemi
        scoreManager.addScore(100, 'enemy');
        expect(scoreManager.combo).toBe(2);
        
        // Combo devrait se réinitialiser après un boss
        scoreManager.addScore(1000, 'boss');
        expect(scoreManager.combo).toBe(0);
        
        return true;
    });
    
    this.it('devrait appliquer le bonus de combo après 5 ennemis', () => {
        // Tuer 5 ennemis pour déclencher le bonus
        for (let i = 0; i < 5; i++) {
            scoreManager.addScore(100, 'enemy');
        }
        
        // Le 6ème ennemi devrait avoir un bonus
        const points = scoreManager.addScore(100, 'enemy');
        expect(points).toBe(150); // 100 * 1.5
        
        return true;
    });
    
    this.it('devrait gérer le multiplicateur', () => {
        scoreManager.increaseMultiplier();
        expect(scoreManager.multiplier).toBe(1.1);
        
        const points = scoreManager.addScore(100, 'normal');
        expect(points).toBe(110); // 100 * 1.1
        
        return true;
    });
    
    this.it('devrait limiter le multiplicateur à 3.0', () => {
        // Augmenter le multiplicateur au maximum
        for (let i = 0; i < 25; i++) {
            scoreManager.increaseMultiplier();
        }
        
        expect(scoreManager.multiplier).toBe(3.0);
        return true;
    });
    
    this.it('devrait réinitialiser le combo après timeout', () => {
        scoreManager.addScore(100, 'enemy');
        expect(scoreManager.combo).toBe(1);
        
        // Simuler le passage du temps
        scoreManager.multiplierTimer = 0;
        scoreManager.update(100);
        
        expect(scoreManager.combo).toBe(0);
        expect(scoreManager.multiplier).toBe(1);
        
        return true;
    });
    
    this.it('devrait détecter les high scores', () => {
        expect(scoreManager.isHighScore(60000)).toBeTruthy();
        expect(scoreManager.isHighScore(5000)).toBeFalsy();
        return true;
    });
    
    this.it('devrait ajouter et trier les high scores', () => {
        scoreManager.addHighScore(75000, 5, 'TEST');
        
        const highScores = scoreManager.getHighScores();
        expect(highScores[0].score).toBe(75000);
        expect(highScores[0].name).toBe('TEST');
        expect(highScores).toHaveLength(5); // Toujours 5 scores max
        
        return true;
    });
    
    this.it('devrait sauvegarder et charger les high scores', () => {
        scoreManager.addHighScore(80000, 5, 'SAVE_TEST');
        
        // Créer un nouveau manager pour tester le chargement
        const newManager = new ScoreManager();
        const highScores = newManager.getHighScores();
        
        expect(highScores[0].score).toBe(80000);
        expect(highScores[0].name).toBe('SAVE_TEST');
        
        return true;
    });
    
    this.it('devrait calculer correctement les bonus de boss avec combo', () => {
        // Construire un combo
        for (let i = 0; i < 10; i++) {
            scoreManager.addScore(100, 'enemy');
        }
        
        // Tuer un boss avec combo
        const points = scoreManager.addScore(1000, 'boss');
        expect(points).toBe(1500); // 1000 + (10 * 50)
        
        return true;
    });
    
    this.it('devrait réinitialiser correctement', () => {
        scoreManager.addScore(1000, 'enemy');
        scoreManager.increaseMultiplier();
        
        scoreManager.reset();
        
        expect(scoreManager.getCurrentScore()).toBe(0);
        expect(scoreManager.multiplier).toBe(1);
        expect(scoreManager.combo).toBe(0);
        expect(scoreManager.multiplierTimer).toBe(0);
        
        return true;
    });
    
    this.it('devrait fournir des données de score complètes', () => {
        scoreManager.addScore(500, 'enemy');
        scoreManager.increaseMultiplier();
        
        const data = scoreManager.getScoreData();
        
        expect(data.score).toBe(500);
        expect(data.multiplier).toBe(1.1);
        expect(data.combo).toBe(1);
        expect(data.timeLeft).toBeGreaterThan(0);
        
        return true;
    });
});
