# 🎨 Tests Visuels R-Type 2

Ce répertoire contient les interfaces de test visuelles pour vérifier le rendu des assets du jeu.

## 📋 Tests Disponibles

### **test-enemy-missile.html**
Test visuel du missile ennemi (projectiles ennemis).

**Fonctionnalités :**
- ✅ Aperçu du missile avec palette jaune/rouge
- ✅ Test des rotations et angles de tir
- ✅ Vérification des dimensions (32x8 pixels)
- ✅ Validation des couleurs (or, orange, rouge)
- ✅ Prévisualisation des effets de particules
- ✅ Comparaison avec les bullets du joueur

### **test-delorean.html**
Test visuel du sprite DeLorean (vaisseau du joueur).

**Fonctionnalités :**
- ✅ Comparaison DeLorean SVG vs fallback
- ✅ Vérification du chargement des assets
- ✅ Test des dimensions et proportions
- ✅ Validation des couleurs (argenté, cyan)

### **test-enemy-colors.html**
Test visuel des 3 types de vaisseaux ennemis.

**Fonctionnalités :**
- ✅ Affichage des 3 sprites ennemis (Rouge, Violet, Vert)
- ✅ Vérification des palettes de couleurs
- ✅ Test du système de sélection aléatoire
- ✅ Comparaison avec les fallbacks

### **test-alien-terrain.html**
Test visuel du terrain alien interactif.

**Fonctionnalités :**
- ✅ Génération procédurale du terrain
- ✅ Test des collisions mortelles
- ✅ Vérification des couleurs aliens
- ✅ Validation de la zone de jeu (80%)

## 🚀 Utilisation

```bash
# 1. Démarrer le serveur
cd ../scripts && ./start.sh

# 2. Ouvrir les tests
http://localhost:8000/visual-tests/
```

## 🔍 Validation

### Checklist de Test
```
🎨 TESTS VISUELS COMPLETS

DeLorean:
□ Chargement SVG
□ Couleurs correctes
□ Dimensions appropriées
□ Fallback fonctionnel

Ennemis:
□ 3 types distincts
□ Couleurs préservées
□ Rendu correct
□ Sélection aléatoire

Terrain:
□ Génération procédurale
□ Zone de jeu correcte
□ Couleurs aliens
□ Performance fluide
```

---

*Ces tests visuels garantissent la qualité du rendu graphique du jeu R-Type 2.*
### **test-boss-sprites.html** ⭐ NOUVEAU
Test visuel des 5 sprites de boss du jeu.

**Fonctionnalités :**
- ✅ Aperçu des 5 boss avec designs thématiques
- ✅ Validation des tailles (3x à 4x le vaisseau joueur)
- ✅ Vérification de la cohérence avec les niveaux
- ✅ Comparaison des dimensions et proportions
- ✅ Test de rendu SVG et qualité graphique
- ✅ Interface de comparaison interactive

**Boss inclus :**
1. **Serpent Mécanique** (240x120px) - Secteur Spatial
2. **Croiseur Lourd** (220x140px) - Champ d'Astéroïdes  
3. **Station Orbitale** (200x160px) - Nébuleuse Toxique
4. **Dreadnought** (260x120px) - Station Ennemie
5. **Core Alien** (200x200px) - Cœur Alien (Boss Final)

## 🎮 Tests de Gameplay (Ajoutés lors du nettoyage)

### **test-boss-movement-rebuilt.html**
Test de reconstruction des mouvements de boss avec patterns mathématiques.

**Fonctionnalités :**
- ✅ Test des 5 boss avec mouvements reconstruits
- ✅ Validation des patterns mathématiques
- ✅ Vérification de la fluidité des mouvements
- ✅ Debug des trajectoires et vitesses

### **test-terrain-improved.html**
Test d'amélioration du terrain spatial avec détails procéduraux.

**Fonctionnalités :**
- ✅ Test des 5 types de terrain améliorés
- ✅ Validation des textures procédurales
- ✅ Vérification des détails visuels
- ✅ Test des collisions et opacité

## 🔧 Tests Principaux (Racine du Projet)

Les tests les plus importants restent à la racine :
- **test-terrain-bitmap.html** - Test de l'approche bitmap finale (v0.2)
- **test-boss-speed-reduced.html** - Test des boss équilibrés (v0.2)
- **debug-terrain-version.html** - Diagnostic de version terrain
- **index-no-cache.html** - Jeu sans cache pour debug

## 📚 Organisation Post-Nettoyage

Suite au hotfix cleanup-and-update :
- ✅ Tests obsolètes supprimés de la racine
- ✅ Tests utiles déplacés vers visual-tests/
- ✅ Tests principaux conservés à la racine
- ✅ Documentation mise à jour
