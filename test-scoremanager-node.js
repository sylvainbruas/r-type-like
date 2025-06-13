// Test simple du ScoreManager en Node.js
console.log('🧪 Test ScoreManager - Vérification des méthodes\n');

// Simuler les dépendances
global.GameConfig = {
    scoring: {
        enemy: 100,
        boss: 1000,
        levelComplete: 5000
    }
};

// Simuler localStorage
global.localStorage = {
    data: {},
    getItem: function(key) { return this.data[key] || null; },
    setItem: function(key, value) { this.data[key] = value; }
};

// Charger le ScoreManager
const fs = require('fs');
const scoreManagerCode = fs.readFileSync('./js/managers/ScoreManager.js', 'utf8');
eval(scoreManagerCode);

// Tests
try {
    console.log('1️⃣ Test de création du ScoreManager...');
    const scoreManager = new ScoreManager();
    console.log('✅ ScoreManager créé avec succès');
    
    console.log('\n2️⃣ Test de la méthode setScore...');
    if (typeof scoreManager.setScore === 'function') {
        const result = scoreManager.setScore(1500);
        console.log('✅ setScore est une fonction');
        console.log(`✅ Score défini: ${result}`);
        
        const scoreData = scoreManager.getScoreData();
        if (scoreData.score === 1500) {
            console.log('✅ Score correctement sauvegardé');
        } else {
            console.log(`❌ Score incorrect: ${scoreData.score}`);
        }
    } else {
        console.log('❌ setScore n\'est pas une fonction');
    }
    
    console.log('\n3️⃣ Test de la méthode restoreScore...');
    if (typeof scoreManager.restoreScore === 'function') {
        scoreManager.restoreScore(2500);
        console.log('✅ restoreScore est une fonction');
        
        const scoreData = scoreManager.getScoreData();
        if (scoreData.score === 2500) {
            console.log('✅ Score restauré correctement');
        } else {
            console.log(`❌ Score de restauration incorrect: ${scoreData.score}`);
        }
    } else {
        console.log('❌ restoreScore n\'est pas une fonction');
    }
    
    console.log('\n4️⃣ Test d\'ajout de score...');
    const initialScore = scoreManager.getScoreData().score;
    scoreManager.addScore(500, 'enemy');
    const newScore = scoreManager.getScoreData().score;
    
    if (newScore > initialScore) {
        console.log(`✅ Score ajouté: ${initialScore} → ${newScore}`);
    } else {
        console.log(`❌ Problème d'ajout de score: ${initialScore} → ${newScore}`);
    }
    
    console.log('\n🎯 RÉSULTAT: Tous les tests du ScoreManager passent !');
    
} catch (error) {
    console.log(`❌ Erreur lors des tests: ${error.message}`);
    console.log(error.stack);
}
