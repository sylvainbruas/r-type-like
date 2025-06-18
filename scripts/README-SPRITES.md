# 🎨 Scripts de Génération de Sprite Sheet

## 📋 Vue d'ensemble

Ce dossier contient les scripts pour générer automatiquement la sprite sheet `sprites.png` à partir des assets SVG du jeu.

## 🛠️ Scripts Disponibles

### **1. create-sprite-sheet-simple.sh** ⭐ (Recommandé)
```bash
./scripts/create-sprite-sheet-simple.sh
```

**Fonctionnalités :**
- ✅ Conversion SVG → PNG avec ImageMagick
- ✅ Assemblage automatique en grille 4x3
- ✅ Labels et descriptions pour chaque sprite
- ✅ Gestion des fichiers manquants (placeholders)
- ✅ Compatible macOS/Linux

**Prérequis :**
- ImageMagick (`brew install imagemagick` sur macOS)

### **2. create-sprite-sheet.py** (Avancé)
```bash
python3 scripts/create-sprite-sheet.py
```

**Fonctionnalités :**
- ✅ Conversion SVG → PNG avec cairosvg
- ✅ Contrôle précis des dimensions
- ✅ Polices personnalisées
- ✅ Gestion d'erreurs avancée

**Prérequis :**
```bash
pip install Pillow cairosvg
```

### **3. create-sprite-sheet.sh** (Complexe)
Script bash avancé avec arrays associatifs (peut nécessiter bash 4+).

## 🎯 Utilisation Rapide

### **Génération Standard**
```bash
# Depuis la racine du projet R-Type
cd /path/to/Rtype
./scripts/create-sprite-sheet-simple.sh
```

### **Vérification du Résultat**
```bash
# Vérifier que sprites.png a été créé
ls -la sprites.png

# Voir les dimensions
magick identify sprites.png
```

## 📐 Configuration des Sprites

### **Sprites Inclus**
| Sprite | Fichier Source | Taille | Position |
|--------|----------------|--------|----------|
| Player | `assets/images/player.svg` | 80x40 | L1,C1 |
| Enemy 1 | `assets/images/enemy1.svg` | 60x30 | L1,C2 |
| Enemy 2 | `assets/images/enemy2.svg` | 60x35 | L1,C3 |
| Enemy 3 | `assets/images/enemy3.svg` | 60x30 | L1,C4 |
| Boss 1 | `assets/images/boss1.svg` | 120x60 | L2,C1 |
| Boss 2 | `assets/images/boss2.svg` | 110x70 | L2,C2 |
| Boss 3 | `assets/images/boss3.svg` | 100x80 | L2,C3 |
| Boss 4 | `assets/images/boss4.svg` | 130x60 | L2,C4 |
| Boss 5 | `assets/images/boss5.svg` | 100x100 | L3,C1 |
| Bullet | `assets/images/bullet.svg` | 20x8 | L3,C2 |
| Missile | `assets/images/enemy-missile.svg` | 20x8 | L3,C3 |
| Enemy | `assets/images/enemy.svg` | 50x25 | L3,C4 |

### **Personnalisation**

#### **Modifier les Tailles**
Éditer dans `create-sprite-sheet-simple.sh` :
```bash
convert_sprite "player" "assets/images/player.svg" 80 40  # Nouvelle taille
```

#### **Ajouter un Sprite**
1. Ajouter la conversion :
```bash
convert_sprite "nouveau_sprite" "assets/images/nouveau.svg" 60 60
```

2. Créer la cellule :
```bash
create_cell "nouveau_sprite" "NOUVEAU" "Description"
```

3. Modifier l'assemblage pour inclure le nouveau sprite

#### **Changer la Disposition**
Modifier la commande `magick` finale pour changer l'organisation de la grille.

## 🔧 Dépannage

### **Erreur : ImageMagick non trouvé**
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Vérifier l'installation
magick --version
```

### **Erreur : Fichier SVG non trouvé**
- Vérifier que tous les fichiers SVG existent dans `assets/images/`
- Le script crée automatiquement des placeholders pour les fichiers manquants

### **Erreur : Permission refusée**
```bash
chmod +x scripts/create-sprite-sheet-simple.sh
```

### **Sprite Sheet Vide ou Corrompue**
- Vérifier les permissions d'écriture dans le répertoire
- S'assurer qu'ImageMagick peut lire les fichiers SVG
- Vérifier les logs d'erreur du script

## 📊 Optimisation

### **Réduction de la Taille**
```bash
# Optimiser la sprite sheet après génération
magick sprites.png -strip -quality 95 sprites_optimized.png
```

### **Format WebP** (Optionnel)
```bash
# Convertir en WebP pour le web
magick sprites.png sprites.webp
```

### **Sprite Sheet Haute Résolution**
Modifier les tailles dans le script pour créer une version 2x :
```bash
convert_sprite "player" "assets/images/player.svg" 160 80  # 2x
```

## 🎮 Intégration dans le Jeu

### **Chargement Phaser.js**
```javascript
// Dans PreloadScene.js
this.load.spritesheet('gameSprites', 'sprites.png', {
    frameWidth: 140,
    frameHeight: 100
});
```

### **Utilisation**
```javascript
// Créer un sprite depuis la sprite sheet
const player = this.add.sprite(x, y, 'gameSprites', 0); // Frame 0 = player
```

### **Exemple Complet**
Voir `examples/sprite-sheet-usage.js` pour un exemple d'intégration complète.

## 📝 Maintenance

### **Mise à Jour Automatique**
Ajouter au `Makefile` ou script de build :
```makefile
sprites: assets/images/*.svg
	./scripts/create-sprite-sheet-simple.sh
```

### **CI/CD**
Intégrer dans le pipeline de déploiement :
```yaml
# GitHub Actions exemple
- name: Generate Sprite Sheet
  run: ./scripts/create-sprite-sheet-simple.sh
```

### **Validation**
Script de validation automatique :
```bash
# Vérifier que la sprite sheet est à jour
if [ assets/images/*.svg -nt sprites.png ]; then
    echo "Sprite sheet obsolète, régénération..."
    ./scripts/create-sprite-sheet-simple.sh
fi
```

## 🎨 Conseils de Design

### **Cohérence Visuelle**
- Utiliser la même palette de couleurs
- Maintenir un style artistique uniforme
- Respecter les proportions relatives

### **Optimisation des Tailles**
- Sprites de même type → tailles similaires
- Boss → plus grands que les ennemis
- Projectiles → plus petits

### **Organisation**
- Grouper par type (joueur, ennemis, boss)
- Ordre logique (du plus important au moins important)
- Labels clairs et descriptifs

---

**Les scripts de sprite sheet automatisent la création d'assets optimisés pour R-Type 2 !** 🎮✨
