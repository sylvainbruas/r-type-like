// Gestionnaire des scores
class ScoreManager {
    constructor() {
        this.highScores = this.loadHighScores();
        this.currentScore = 0;
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.combo = 0;
    }
    
    loadHighScores() {
        const saved = localStorage.getItem('rtype-highscores');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            { score: 50000, level: 5, name: 'ACE' },
            { score: 40000, level: 4, name: 'PRO' },
            { score: 30000, level: 4, name: 'VET' },
            { score: 20000, level: 3, name: 'ADV' },
            { score: 10000, level: 2, name: 'NOV' }
        ];
    }
    
    saveHighScores() {
        localStorage.setItem('rtype-highscores', JSON.stringify(this.highScores));
    }
    
    addScore(points, type = 'normal') {
        let finalPoints = points;
        
        // Appliquer le multiplicateur
        finalPoints *= this.multiplier;
        
        // Bonus de combo
        if (type === 'enemy') {
            this.combo++;
            if (this.combo > 5) {
                finalPoints *= 1.5;
            }
            this.resetMultiplierTimer();
        } else if (type === 'boss') {
            finalPoints += this.combo * 50; // Bonus basé sur le combo
            this.combo = 0;
        }
        
        this.currentScore += Math.floor(finalPoints);
        return Math.floor(finalPoints);
    }
    
    setScore(score) {
        if (typeof score === 'number' && score >= 0) {
            this.currentScore = score;
            console.log('Score set to:', this.currentScore);
            return this.currentScore;
        } else {
            console.warn('Invalid score value:', score);
            return this.currentScore;
        }
    }
    
    // Méthode alternative pour restaurer le score
    restoreScore(score) {
        return this.setScore(score);
    }
    
    resetMultiplierTimer() {
        this.multiplierTimer = 5000; // 5 secondes
    }
    
    update(delta) {
        // Décrémenter le timer du multiplicateur
        if (this.multiplierTimer > 0) {
            this.multiplierTimer -= delta;
            if (this.multiplierTimer <= 0) {
                this.resetCombo();
            }
        }
    }
    
    resetCombo() {
        this.combo = 0;
        this.multiplier = 1;
    }
    
    increaseMultiplier() {
        this.multiplier = Math.min(this.multiplier + 0.1, 3.0);
        this.resetMultiplierTimer();
    }
    
    isHighScore(score) {
        return score > this.highScores[this.highScores.length - 1].score;
    }
    
    addHighScore(score, level, name = 'PLAYER') {
        const newScore = { score, level, name };
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 5);
        this.saveHighScores();
    }
    
    getHighScores() {
        return this.highScores;
    }
    
    getCurrentScore() {
        return this.currentScore;
    }
    
    reset() {
        this.currentScore = 0;
        this.multiplier = 1;
        this.combo = 0;
        this.multiplierTimer = 0;
    }
    
    getScoreData() {
        return {
            score: this.currentScore,
            multiplier: this.multiplier,
            combo: this.combo,
            timeLeft: Math.max(0, this.multiplierTimer)
        };
    }
}
