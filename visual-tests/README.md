# 🎨 Tests Visuels R-Type 2

Ce répertoire contient les interfaces de test visuelles pour vérifier le rendu des assets du jeu.

## 📋 Tests Disponibles

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
