# 🎨 Sprite Sheet R-Type 2

## 📋 Vue d'ensemble

La sprite sheet `sprites.png` contient tous les éléments visuels du jeu R-Type 2 organisés dans une grille 4x3 (580x320 pixels).

## 🎮 Contenu de la Sprite Sheet

### **Ligne 1 : Joueur + Ennemis**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   PLAYER    │   ENEMY 1   │   ENEMY 2   │   ENEMY 3   │
│  DeLorean   │Intercepteur │  Croiseur   │  Chasseur   │
│   80x40     │   60x30     │   60x35     │   60x30     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **Ligne 2 : Boss 1-4**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   BOSS 1    │   BOSS 2    │   BOSS 3    │   BOSS 4    │
│   Serpent   │Croiseur Lourd│  Station   │Dreadnought  │
│  120x60     │  110x70     │  100x80     │  130x60     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **Ligne 3 : Boss 5 + Projectiles + Ennemi Générique**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   BOSS 5    │   BULLET    │   MISSILE   │   ENEMY     │
│ Core Alien  │ Projectile  │   Ennemi    │ Générique   │
│  100x100    │   20x8      │   20x8      │   50x25     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## 📐 Spécifications Techniques

### **Dimensions Globales**
- **Taille totale** : 580x320 pixels
- **Format** : PNG avec transparence (RGBA)
- **Taille fichier** : ~128 KB
- **Organisation** : Grille 4x3 avec cellules de 140x100 pixels

### **Sprites Individuels**

#### **🚀 Joueur**
- **Nom** : Player (DeLorean)
- **Taille** : 80x40 pixels
- **Position** : Ligne 1, Colonne 1
- **Description** : Vaisseau principal du joueur, design DeLorean futuriste

#### **👾 Ennemis**
| Sprite | Nom | Taille | Position | Description |
|--------|-----|--------|----------|-------------|
| Enemy 1 | Intercepteur Rouge | 60x30 | L1,C2 | Ennemi rapide et agile |
| Enemy 2 | Croiseur Violet | 60x35 | L1,C3 | Ennemi équilibré |
| Enemy 3 | Chasseur Vert | 60x30 | L1,C4 | Ennemi furtif |
| Enemy | Générique | 50x25 | L3,C4 | Ennemi de base |

#### **🐉 Boss**
| Boss | Nom | Taille | Position | Niveau | Description |
|------|-----|--------|----------|--------|-------------|
| Boss 1 | Serpent Mécanique | 120x60 | L2,C1 | 1 | Secteur Spatial |
| Boss 2 | Croiseur Lourd | 110x70 | L2,C2 | 2 | Champ d'Astéroïdes |
| Boss 3 | Station Orbitale | 100x80 | L2,C3 | 3 | Nébuleuse Toxique |
| Boss 4 | Dreadnought | 130x60 | L2,C4 | 4 | Station Ennemie |
| Boss 5 | Core Alien | 100x100 | L3,C1 | 5 | Cœur Alien (Final) |

#### **💥 Projectiles**
| Sprite | Nom | Taille | Position | Description |
|--------|-----|--------|----------|-------------|
| Bullet | Projectile Joueur | 20x8 | L3,C2 | Tir principal du joueur |
| Missile | Missile Ennemi | 20x8 | L3,C3 | Projectile des ennemis |

## 🛠️ Utilisation dans le Code

### **Chargement de la Sprite Sheet**
```javascript
// Dans PreloadScene.js
this.load.spritesheet('gameSprites', 'sprites.png', {
    frameWidth: 140,
    frameHeight: 100
});
```

### **Extraction des Sprites Individuels**
```javascript
// Coordonnées des sprites (x, y en cellules)
const spriteCoords = {
    player: { x: 0, y: 0 },
    enemy1: { x: 1, y: 0 },
    enemy2: { x: 2, y: 0 },
    enemy3: { x: 3, y: 0 },
    boss1: { x: 0, y: 1 },
    boss2: { x: 1, y: 1 },
    boss3: { x: 2, y: 1 },
    boss4: { x: 3, y: 1 },
    boss5: { x: 0, y: 2 },
    bullet: { x: 1, y: 2 },
    missile: { x: 2, y: 2 },
    enemy: { x: 3, y: 2 }
};

// Utilisation
const playerSprite = this.add.sprite(x, y, 'gameSprites', 0); // Frame 0 = player
```

### **Calcul des Frames**
```javascript
// Formule : frame = y * 4 + x
const getFrame = (spriteName) => {
    const coord = spriteCoords[spriteName];
    return coord.y * 4 + coord.x;
};

// Exemples
const playerFrame = getFrame('player');    // 0
const boss1Frame = getFrame('boss1');      // 4
const boss5Frame = getFrame('boss5');      // 8
```

## 🔧 Régénération de la Sprite Sheet

### **Script Automatique**
```bash
# Depuis la racine du projet
./scripts/create-sprite-sheet-simple.sh
```

### **Prérequis**
- **ImageMagick** installé (`brew install imagemagick` sur macOS)
- **Assets SVG** présents dans `assets/images/`

### **Personnalisation**
Pour modifier la sprite sheet :
1. Éditer `scripts/create-sprite-sheet-simple.sh`
2. Ajuster les tailles, positions ou labels
3. Relancer le script

## 📊 Avantages de la Sprite Sheet

### **Performance**
- **Chargement unique** : Un seul fichier au lieu de 12
- **Réduction des requêtes HTTP** : Optimisation web
- **Cache efficace** : Mise en cache globale

### **Organisation**
- **Vue d'ensemble** : Tous les sprites visibles d'un coup
- **Cohérence visuelle** : Vérification facile des styles
- **Documentation** : Référence visuelle complète

### **Développement**
- **Debug facilité** : Identification rapide des sprites
- **Intégration simple** : Un seul asset à gérer
- **Évolutivité** : Ajout facile de nouveaux sprites

## 🎨 Utilisation Créative

### **Prévisualisation**
La sprite sheet peut servir de :
- **Référence visuelle** pour les développeurs
- **Documentation** pour les designers
- **Présentation** du style artistique du jeu

### **Outils Externes**
Compatible avec :
- **Éditeurs de sprites** (Aseprite, Piskel)
- **Outils de game design** (Tiled, GameMaker)
- **Logiciels graphiques** (Photoshop, GIMP)

## 📝 Notes Techniques

### **Format PNG**
- **Transparence** : Canal alpha préservé
- **Compression** : Optimisée pour le web
- **Qualité** : Sans perte pour les sprites vectoriels

### **Compatibilité**
- **Phaser.js** : Support natif des sprite sheets
- **Navigateurs** : Compatible tous navigateurs modernes
- **Résolution** : Adapté aux écrans HD

---

**La sprite sheet `sprites.png` centralise tous les éléments visuels du jeu R-Type 2 dans un format optimisé et facile à utiliser !** 🎮✨
