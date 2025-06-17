#!/bin/bash

# Script pour créer une sprite sheet à partir des assets SVG
echo "🎨 Création de la sprite sheet R-Type 2..."

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick non trouvé"
    echo "💡 Installation sur macOS: brew install imagemagick"
    echo "💡 Installation sur Ubuntu: sudo apt-get install imagemagick"
    exit 1
fi

# Vérifier si rsvg-convert est disponible (pour SVG)
if ! command -v rsvg-convert &> /dev/null; then
    echo "⚠️  rsvg-convert non trouvé, tentative avec ImageMagick seul..."
fi

# Créer un répertoire temporaire
TEMP_DIR="temp_sprites"
mkdir -p "$TEMP_DIR"

echo "📁 Conversion des SVG en PNG..."

# Configuration des sprites avec leurs tailles
declare -A SPRITES=(
    ["player"]="assets/images/player.svg:80x40"
    ["enemy1"]="assets/images/enemy1.svg:60x30"
    ["enemy2"]="assets/images/enemy2.svg:60x35"
    ["enemy3"]="assets/images/enemy3.svg:60x30"
    ["enemy"]="assets/images/enemy.svg:50x25"
    ["boss1"]="assets/images/boss1.svg:120x60"
    ["boss2"]="assets/images/boss2.svg:110x70"
    ["boss3"]="assets/images/boss3.svg:100x80"
    ["boss4"]="assets/images/boss4.svg:130x60"
    ["boss5"]="assets/images/boss5.svg:100x100"
    ["bullet"]="assets/images/bullet.svg:20x8"
    ["enemy-missile"]="assets/images/enemy-missile.svg:20x8"
)

# Convertir chaque SVG en PNG
for sprite in "${!SPRITES[@]}"; do
    IFS=':' read -r file size <<< "${SPRITES[$sprite]}"
    
    if [ -f "$file" ]; then
        echo "✅ Conversion: $sprite ($size)"
        
        if command -v rsvg-convert &> /dev/null; then
            # Utiliser rsvg-convert si disponible (meilleure qualité pour SVG)
            rsvg-convert -w ${size%x*} -h ${size#*x} "$file" -o "$TEMP_DIR/${sprite}.png"
        else
            # Utiliser ImageMagick
            convert -background transparent -size "$size" "$file" "$TEMP_DIR/${sprite}.png"
        fi
    else
        echo "⚠️  Fichier manquant: $file"
        # Créer un placeholder
        convert -size "$size" xc:magenta -fill white -gravity center \
                -annotate +0+0 "$sprite" "$TEMP_DIR/${sprite}.png"
    fi
done

echo "🎨 Assemblage de la sprite sheet..."

# Créer la sprite sheet avec ImageMagick
# Organiser en grille 4x3 avec labels
convert \
    \( "$TEMP_DIR/player.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Player\nDeLorean" \) \
    \( "$TEMP_DIR/enemy1.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Enemy 1\nIntercepteur" \) \
    \( "$TEMP_DIR/enemy2.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Enemy 2\nCroiseur" \) \
    \( "$TEMP_DIR/enemy3.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Enemy 3\nChasseur" \) \
    +append \( \
    \( "$TEMP_DIR/boss1.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Boss 1\nSerpent" \) \
    \( "$TEMP_DIR/boss2.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Boss 2\nCroiseur" \) \
    \( "$TEMP_DIR/boss3.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Boss 3\nStation" \) \
    \( "$TEMP_DIR/boss4.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Boss 4\nDreadnought" \) \
    +append \) -append \( \
    \( "$TEMP_DIR/boss5.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Boss 5\nCore Alien" \) \
    \( "$TEMP_DIR/bullet.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Bullet\nProjectile" \) \
    \( "$TEMP_DIR/enemy-missile.png" -gravity center -extent 150x120 \
       -fill white -gravity south -annotate +0+5 "Missile\nEnnemi" \) \
    \( -size 150x120 xc:"#202040" -fill white -gravity center \
       -annotate +0+0 "R-Type 2\nSprite Sheet" \) \
    +append \) -append \
    -background "#202040" -gravity center -extent 600x400 \
    -fill white -gravity north -annotate +0+10 "R-Type 2 - Sprite Sheet" \
    -fill gray -gravity south -annotate +0+10 "github.com/sylvainbruas/r-type-like" \
    sprites.png

# Nettoyer les fichiers temporaires
rm -rf "$TEMP_DIR"

if [ -f "sprites.png" ]; then
    echo "✅ Sprite sheet créée: sprites.png"
    
    # Afficher les informations du fichier
    if command -v identify &> /dev/null; then
        echo "📐 Dimensions: $(identify -format '%wx%h' sprites.png)"
    fi
    
    file_size=$(du -h sprites.png | cut -f1)
    echo "📁 Taille: $file_size"
    
    echo ""
    echo "🎮 Sprites inclus:"
    echo "   • Joueur: DeLorean (vaisseau principal)"
    echo "   • Ennemis: 3 types + générique"
    echo "   • Boss: 5 boss uniques"
    echo "   • Projectiles: Balles joueur et missiles ennemis"
    echo ""
    echo "✅ Sprite sheet prête à l'utilisation !"
else
    echo "❌ Erreur lors de la création de la sprite sheet"
    exit 1
fi
