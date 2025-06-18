#!/bin/bash

# Script simplifié pour créer une sprite sheet
echo "🎨 Création de la sprite sheet R-Type 2..."

# Créer un répertoire temporaire
TEMP_DIR="temp_sprites"
mkdir -p "$TEMP_DIR"

echo "📁 Conversion des SVG en PNG..."

# Convertir chaque SVG individuellement
convert_sprite() {
    local name=$1
    local file=$2
    local width=$3
    local height=$4
    
    if [ -f "$file" ]; then
        echo "✅ Conversion: $name (${width}x${height})"
        magick "$file" -resize "${width}x${height}" "$TEMP_DIR/${name}.png"
    else
        echo "⚠️  Fichier manquant: $file - création d'un placeholder"
        magick -size "${width}x${height}" xc:magenta -fill white -gravity center \
               -annotate +0+0 "$name" "$TEMP_DIR/${name}.png"
    fi
}

# Convertir tous les sprites
convert_sprite "player" "assets/images/player.svg" 80 40
convert_sprite "enemy1" "assets/images/enemy1.svg" 60 30
convert_sprite "enemy2" "assets/images/enemy2.svg" 60 35
convert_sprite "enemy3" "assets/images/enemy3.svg" 60 30
convert_sprite "enemy" "assets/images/enemy.svg" 50 25
convert_sprite "boss1" "assets/images/boss1.svg" 120 60
convert_sprite "boss2" "assets/images/boss2.svg" 110 70
convert_sprite "boss3" "assets/images/boss3.svg" 100 80
convert_sprite "boss4" "assets/images/boss4.svg" 130 60
convert_sprite "boss5" "assets/images/boss5.svg" 100 100
convert_sprite "bullet" "assets/images/bullet.svg" 20 8
convert_sprite "enemy-missile" "assets/images/enemy-missile.svg" 20 8

echo "🎨 Assemblage de la sprite sheet..."

# Créer des cellules uniformes avec labels
create_cell() {
    local sprite=$1
    local label1=$2
    local label2=$3
    
    magick "$TEMP_DIR/${sprite}.png" \
           -background "#2a2a4a" -gravity center -extent 140x100 \
           -fill white -pointsize 12 -gravity south \
           -annotate +0+15 "$label1" \
           -annotate +0+5 "$label2" \
           "$TEMP_DIR/cell_${sprite}.png"
}

# Créer les cellules avec labels
create_cell "player" "PLAYER" "DeLorean"
create_cell "enemy1" "ENEMY 1" "Intercepteur"
create_cell "enemy2" "ENEMY 2" "Croiseur"
create_cell "enemy3" "ENEMY 3" "Chasseur"
create_cell "boss1" "BOSS 1" "Serpent"
create_cell "boss2" "BOSS 2" "Croiseur Lourd"
create_cell "boss3" "BOSS 3" "Station"
create_cell "boss4" "BOSS 4" "Dreadnought"
create_cell "boss5" "BOSS 5" "Core Alien"
create_cell "bullet" "BULLET" "Projectile"
create_cell "enemy-missile" "MISSILE" "Ennemi"
create_cell "enemy" "ENEMY" "Générique"

# Assembler la grille 4x3
magick \
    \( "$TEMP_DIR/cell_player.png" "$TEMP_DIR/cell_enemy1.png" "$TEMP_DIR/cell_enemy2.png" "$TEMP_DIR/cell_enemy3.png" +append \) \
    \( "$TEMP_DIR/cell_boss1.png" "$TEMP_DIR/cell_boss2.png" "$TEMP_DIR/cell_boss3.png" "$TEMP_DIR/cell_boss4.png" +append \) \
    \( "$TEMP_DIR/cell_boss5.png" "$TEMP_DIR/cell_bullet.png" "$TEMP_DIR/cell_enemy-missile.png" "$TEMP_DIR/cell_enemy.png" +append \) \
    -append \
    -bordercolor "#1a1a2a" -border 10 \
    -fill white -pointsize 20 -gravity north -annotate +0+15 "R-TYPE 2 - SPRITE SHEET" \
    -fill gray -pointsize 10 -gravity south -annotate +0+5 "github.com/sylvainbruas/r-type-like" \
    sprites.png

# Nettoyer
rm -rf "$TEMP_DIR"

if [ -f "sprites.png" ]; then
    echo "✅ Sprite sheet créée: sprites.png"
    
    # Informations du fichier
    if command -v identify &> /dev/null; then
        echo "📐 Dimensions: $(magick identify -format '%wx%h' sprites.png)"
    fi
    
    file_size=$(du -h sprites.png | cut -f1)
    echo "📁 Taille: $file_size"
    
    echo ""
    echo "🎮 Contenu de la sprite sheet:"
    echo "   Ligne 1: Joueur + Ennemis (4 sprites)"
    echo "   Ligne 2: Boss 1-4 (4 sprites)"
    echo "   Ligne 3: Boss 5 + Projectiles + Ennemi générique (4 sprites)"
    echo ""
    echo "✅ Total: 12 sprites organisés en grille 4x3"
else
    echo "❌ Erreur lors de la création"
    exit 1
fi
