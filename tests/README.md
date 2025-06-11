# Tests R-Type 2

Suite de tests complète pour le jeu R-Type 2.

## Structure des Tests

```
tests/
├── test-runner.html        # Interface web pour lancer les tests
├── test-framework.js       # Framework de test personnalisé
├── config.test.js          # Tests de configuration
├── score-manager.test.js   # Tests du gestionnaire de scores
├── level-manager.test.js   # Tests du gestionnaire de niveaux
├── game-logic.test.js      # Tests de logique générale
└── README.md              # Ce fichier
```

## Lancer les Tests

### Option 1 : Interface Web (Recommandé)
1. Ouvrez `test-runner.html` dans votre navigateur
2. Cliquez sur "▶️ Lancer Tous les Tests"
3. Consultez les résultats en temps réel

### Option 2 : Serveur Local
```bash
# Depuis la racine du projet
python3 -m http.server 8000
# Puis ouvrez http://localhost:8000/tests/test-runner.html
```

### Option 3 : Scripts de Démarrage
```bash
# Depuis la racine du projet
./start.sh
# Puis naviguez vers /tests/test-runner.html
```

## Suites de Tests

### 1. Configuration du Jeu (`config.test.js`)
- ✅ Dimensions et paramètres de base
- ✅ Configuration des joueurs et ennemis
- ✅ Paramètres des 5 boss
- ✅ Système de scoring
- ✅ Progression de difficulté
- ✅ Cohérence des configurations

**Tests :** 10 | **Couverture :** Configuration complète

### 2. Gestionnaire de Scores (`score-manager.test.js`)
- ✅ Initialisation et état de base
- ✅ Système de points et multiplicateurs
- ✅ Gestion des combos
- ✅ High scores et sauvegarde
- ✅ Bonus et calculs avancés
- ✅ Réinitialisation et nettoyage

**Tests :** 15 | **Couverture :** Logique de scoring complète

### 3. Gestionnaire de Niveaux (`level-manager.test.js`)
- ✅ Initialisation et données de niveau
- ✅ Progression et difficulté
- ✅ Spawn des ennemis et boss
- ✅ Statistiques et completion
- ✅ Navigation entre niveaux
- ✅ Calculs de bonus

**Tests :** 18 | **Couverture :** Gestion des niveaux complète

### 4. Logique Générale (`game-logic.test.js`)
- ✅ Cohérence entre composants
- ✅ Équilibrage du gameplay
- ✅ Intégration des systèmes
- ✅ Validation des calculs
- ✅ Tests de régression

**Tests :** 15 | **Couverture :** Logique métier complète

## Framework de Test

### Fonctionnalités
- **Assertions** : `expect().toBe()`, `toEqual()`, `toBeTruthy()`, etc.
- **Organisation** : `describe()` et `it()` pour structurer les tests
- **Hooks** : `beforeEach()` et `afterEach()` pour la préparation/nettoyage
- **Interface** : Affichage en temps réel avec statistiques
- **Console** : Logs détaillés pour le débogage

### Exemple d'Utilisation
```javascript
describe('Mon Composant', function() {
    let component;
    
    this.beforeEach(() => {
        component = new MonComposant();
    });
    
    this.it('devrait initialiser correctement', () => {
        expect(component.value).toBe(0);
        return true;
    });
});
```

## Métriques de Test

### Couverture Actuelle
- **Total des Tests :** 58
- **Suites de Tests :** 4
- **Composants Testés :** 4/4 (100%)
- **Fonctions Critiques :** 100% couvertes

### Objectifs de Qualité
- ✅ Tous les managers testés
- ✅ Configuration validée
- ✅ Logique métier couverte
- ✅ Cas limites gérés
- ✅ Intégration vérifiée

## Types de Tests

### Tests Unitaires
- Fonctions individuelles
- Classes et méthodes
- Calculs et algorithmes
- États et transitions

### Tests d'Intégration
- Interaction entre composants
- Cohérence des données
- Flux de gameplay
- Persistance des scores

### Tests de Régression
- Équilibrage du jeu
- Performance des calculs
- Stabilité des configurations
- Compatibilité des sauvegardes

## Ajout de Nouveaux Tests

### 1. Créer un Nouveau Fichier
```javascript
// nouveau-composant.test.js
describe('Nouveau Composant', function() {
    this.it('devrait faire quelque chose', () => {
        // Test logic here
        return true;
    });
});
```

### 2. L'Inclure dans test-runner.html
```html
<script src="nouveau-composant.test.js"></script>
```

### 3. Lancer les Tests
Rafraîchissez `test-runner.html` et les nouveaux tests apparaîtront.

## Bonnes Pratiques

### Nommage
- **Suites :** Nom du composant testé
- **Tests :** "devrait [comportement attendu]"
- **Variables :** Noms descriptifs et clairs

### Structure
- Un fichier par composant principal
- Tests groupés par fonctionnalité
- Setup/cleanup dans beforeEach/afterEach

### Assertions
- Une assertion principale par test
- Messages d'erreur clairs
- Valeurs attendues explicites

### Maintenance
- Tests mis à jour avec le code
- Nettoyage des ressources
- Documentation des cas complexes

## Dépannage

### Tests qui Échouent
1. Vérifiez la console pour les erreurs détaillées
2. Assurez-vous que les dépendances sont chargées
3. Vérifiez l'ordre de chargement des scripts

### Performance
- Les tests devraient s'exécuter en < 5 secondes
- Utilisez des mocks pour les opérations lourdes
- Nettoyez les ressources après chaque test

### Compatibilité
- Testez dans différents navigateurs
- Vérifiez les APIs utilisées
- Gérez les différences d'environnement

---

**Note :** Cette suite de tests garantit la qualité et la stabilité du jeu R-Type 2. Lancez les tests régulièrement pendant le développement pour détecter les régressions rapidement.
