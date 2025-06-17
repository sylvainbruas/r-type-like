# Guide de Test des Boss - R-Type 2

## 🎮 Comment Tester les Boss

### Lancement du Jeu
1. **Démarrer le serveur local :**
```bash
cd Rtype
python3 -m http.server 8000
# ou
./scripts/start.sh
```

2. **Ouvrir le jeu :**
```
http://localhost:8000
```

3. **Commencer une partie :**
   - Cliquer sur "Commencer" dans le menu principal
   - Le jeu démarre au niveau 1

### 🧪 Tests des Boss (Touches 1-5)

Une fois dans le jeu, utilisez les touches numériques pour spawner instantanément chaque boss :

#### **Touche 1 - Serpent Mécanique**
```
🐍 BOSS NIVEAU 1:
├── Sprite: boss1.svg (240x120px)
├── Design: Segments mécaniques articulés
├── Couleurs: Gris métallique, rouge, cyan
└── Thème: Secteur Spatial
```

#### **Touche 2 - Croiseur Lourd**
```
🚢 BOSS NIVEAU 2:
├── Sprite: boss2.svg (220x140px)
├── Design: Vaisseau blindé avec astéroïdes
├── Couleurs: Gris foncé, marron
└── Thème: Champ d'Astéroïdes
```

#### **Touche 3 - Station Orbitale**
```
🛰️ BOSS NIVEAU 3:
├── Sprite: boss3.svg (200x160px)
├── Design: Structure hexagonale avec anneaux
├── Couleurs: Bleu-violet, effets néon
└── Thème: Nébuleuse Toxique
```

#### **Touche 4 - Dreadnought**
```
⚔️ BOSS NIVEAU 4:
├── Sprite: boss4.svg (260x120px) - LE PLUS GRAND
├── Design: Cuirassé de guerre massif
├── Couleurs: Noir, gris foncé, rouge
└── Thème: Station Ennemie
```

#### **Touche 5 - Core Alien**
```
👽 BOSS NIVEAU 5 (FINAL):
├── Sprite: boss5.svg (200x200px) - FORMAT CARRÉ
├── Design: Entité organique alien
├── Couleurs: Violet, rose, vert alien
└── Thème: Cœur Alien
```

## ✅ Points de Validation

### Chargement des Sprites
- [ ] Tous les sprites SVG se chargent correctement
- [ ] Les textures de fallback fonctionnent si SVG échoue
- [ ] Console affiche le statut de chargement des boss
- [ ] Aucune erreur dans la console du navigateur

### Affichage des Boss
- [ ] Chaque boss apparaît avec le bon sprite
- [ ] Les tailles sont correctes (3x à 4x le joueur)
- [ ] Les couleurs et détails sont visibles
- [ ] Le nom du boss s'affiche à l'écran

### Fonctionnalités de Test
- [ ] Touches 1-5 spawner les boss correspondants
- [ ] Texte "TEST: [Nom du Boss]" apparaît en vert
- [ ] Instructions de test visibles en bas d'écran
- [ ] Cooldown d'1 seconde entre les spawns

### Gameplay
- [ ] Boss peuvent être touchés par les balles du joueur
- [ ] Boss ont des barres de vie fonctionnelles
- [ ] Boss peuvent tirer sur le joueur
- [ ] Collisions boss-joueur fonctionnent

## 🐛 Problèmes Potentiels

### Si les Sprites ne s'Affichent Pas
1. **Vérifier la console :** Rechercher les erreurs de chargement
2. **Vérifier les chemins :** assets/images/boss1.svg à boss5.svg
3. **Fallback actif :** Les textures procédurales devraient s'afficher
4. **Serveur local :** S'assurer que le serveur HTTP fonctionne

### Si les Touches ne Fonctionnent Pas
1. **Focus du jeu :** Cliquer dans la zone de jeu
2. **Console logs :** Vérifier les messages "TEST: Boss X spawned"
3. **Cooldown :** Attendre 1 seconde entre les pressions

### Si les Boss ne Spawner Pas
1. **Vérifier GameConfig.bosses :** Configuration des données boss
2. **Vérifier Boss.js :** Constructeur et méthodes statiques
3. **Console errors :** Rechercher les erreurs JavaScript

## 📊 Métriques de Test

### Performance
- **Temps de chargement :** < 2 secondes pour tous les sprites
- **FPS :** Stable à 60 FPS avec boss à l'écran
- **Mémoire :** Pas de fuites lors des spawns répétés

### Qualité Visuelle
- **Résolution :** Sprites nets à toutes les tailles
- **Couleurs :** Fidèles aux designs originaux
- **Animations :** Fluides et sans saccades

## 🎯 Validation Complète

Pour valider complètement l'intégration :

1. **Tester chaque boss individuellement** (touches 1-5)
2. **Vérifier l'affichage des noms** (texte à l'écran)
3. **Confirmer les tailles relatives** (comparaison avec le joueur)
4. **Valider les thèmes visuels** (cohérence avec les niveaux)
5. **Tester les interactions** (tir, collisions, vie)

## 📝 Rapport de Test

Après validation, noter :
- ✅ Boss fonctionnels
- ✅ Sprites chargés correctement
- ✅ Tailles appropriées
- ✅ Thèmes cohérents
- ✅ Interactions gameplay

**L'intégration des sprites des boss est maintenant complète et testable !** 🎮👾
