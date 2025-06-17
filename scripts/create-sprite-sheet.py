#!/usr/bin/env python3
"""
Script pour créer une sprite sheet PNG à partir des assets SVG du jeu R-Type 2
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
import cairosvg
import io

def svg_to_png(svg_path, width=None, height=None):
    """Convertit un SVG en image PIL PNG"""
    try:
        # Lire le fichier SVG
        with open(svg_path, 'r') as f:
            svg_content = f.read()
        
        # Convertir SVG en PNG bytes
        png_bytes = cairosvg.svg2png(
            bytestring=svg_content.encode('utf-8'),
            output_width=width,
            output_height=height
        )
        
        # Créer une image PIL à partir des bytes
        image = Image.open(io.BytesIO(png_bytes))
        return image.convert('RGBA')
    
    except Exception as e:
        print(f"Erreur lors de la conversion de {svg_path}: {e}")
        # Créer une image de fallback
        fallback = Image.new('RGBA', (width or 100, height or 100), (255, 0, 255, 255))
        return fallback

def create_sprite_sheet():
    """Crée la sprite sheet complète"""
    
    # Configuration des sprites
    sprites_config = {
        # Joueur
        'player': {
            'file': 'assets/images/player.svg',
            'size': (80, 40),
            'description': 'DeLorean (Vaisseau Joueur)'
        },
        
        # Ennemis
        'enemy1': {
            'file': 'assets/images/enemy1.svg',
            'size': (60, 30),
            'description': 'Intercepteur Rouge'
        },
        'enemy2': {
            'file': 'assets/images/enemy2.svg',
            'size': (60, 35),
            'description': 'Croiseur Violet'
        },
        'enemy3': {
            'file': 'assets/images/enemy3.svg',
            'size': (60, 30),
            'description': 'Chasseur Vert'
        },
        'enemy_generic': {
            'file': 'assets/images/enemy.svg',
            'size': (50, 25),
            'description': 'Ennemi Générique'
        },
        
        # Boss
        'boss1': {
            'file': 'assets/images/boss1.svg',
            'size': (120, 60),
            'description': 'Serpent Mécanique'
        },
        'boss2': {
            'file': 'assets/images/boss2.svg',
            'size': (110, 70),
            'description': 'Croiseur Lourd'
        },
        'boss3': {
            'file': 'assets/images/boss3.svg',
            'size': (100, 80),
            'description': 'Station Orbitale'
        },
        'boss4': {
            'file': 'assets/images/boss4.svg',
            'size': (130, 60),
            'description': 'Dreadnought'
        },
        'boss5': {
            'file': 'assets/images/boss5.svg',
            'size': (100, 100),
            'description': 'Core Alien'
        },
        
        # Projectiles
        'bullet': {
            'file': 'assets/images/bullet.svg',
            'size': (20, 8),
            'description': 'Projectile Joueur'
        },
        'enemy_missile': {
            'file': 'assets/images/enemy-missile.svg',
            'size': (20, 8),
            'description': 'Missile Ennemi'
        }
    }
    
    # Dimensions de la sprite sheet
    margin = 20
    label_height = 25
    cols = 4
    
    # Calculer les dimensions nécessaires
    max_width = max(config['size'][0] for config in sprites_config.values())
    max_height = max(config['size'][1] for config in sprites_config.values())
    
    cell_width = max_width + margin * 2
    cell_height = max_height + label_height + margin * 2
    
    rows = (len(sprites_config) + cols - 1) // cols
    
    sheet_width = cols * cell_width
    sheet_height = rows * cell_height + 100  # Extra pour titre
    
    # Créer l'image de la sprite sheet
    sprite_sheet = Image.new('RGBA', (sheet_width, sheet_height), (32, 32, 64, 255))
    draw = ImageDraw.Draw(sprite_sheet)
    
    # Essayer de charger une police
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
        font_label = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 12)
    except:
        try:
            font_title = ImageFont.truetype("arial.ttf", 24)
            font_label = ImageFont.truetype("arial.ttf", 12)
        except:
            font_title = ImageFont.load_default()
            font_label = ImageFont.load_default()
    
    # Titre
    title = "R-Type 2 - Sprite Sheet"
    title_bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = title_bbox[2] - title_bbox[0]
    draw.text(((sheet_width - title_width) // 2, 20), title, fill=(255, 255, 255, 255), font=font_title)
    
    # Sous-titre
    subtitle = f"Joueur • Ennemis • Boss • Projectiles ({len(sprites_config)} sprites)"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=font_label)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    draw.text(((sheet_width - subtitle_width) // 2, 50), subtitle, fill=(200, 200, 200, 255), font=font_label)
    
    # Placer les sprites
    y_offset = 100
    
    for i, (sprite_name, config) in enumerate(sprites_config.items()):
        row = i // cols
        col = i % cols
        
        x = col * cell_width + margin
        y = y_offset + row * cell_height + margin
        
        # Convertir et redimensionner le sprite
        if os.path.exists(config['file']):
            sprite_img = svg_to_png(config['file'], config['size'][0], config['size'][1])
        else:
            # Créer un sprite de fallback
            sprite_img = Image.new('RGBA', config['size'], (255, 0, 255, 255))
            fallback_draw = ImageDraw.Draw(sprite_img)
            fallback_draw.text((5, 5), sprite_name, fill=(255, 255, 255, 255))
        
        # Centrer le sprite dans sa cellule
        sprite_x = x + (max_width - sprite_img.width) // 2
        sprite_y = y + (max_height - sprite_img.height) // 2
        
        # Coller le sprite
        sprite_sheet.paste(sprite_img, (sprite_x, sprite_y), sprite_img)
        
        # Ajouter le label
        label = f"{sprite_name}\n{config['description']}"
        label_bbox = draw.textbbox((0, 0), label, font=font_label)
        label_width = label_bbox[2] - label_bbox[0]
        label_x = x + (max_width - label_width) // 2
        label_y = y + max_height + 5
        
        draw.text((label_x, label_y), label, fill=(255, 255, 255, 255), font=font_label)
        
        # Bordure autour de chaque sprite
        border_x1 = x - 5
        border_y1 = y - 5
        border_x2 = x + max_width + 5
        border_y2 = y + max_height + 5
        draw.rectangle([border_x1, border_y1, border_x2, border_y2], outline=(100, 100, 100, 255), width=1)
        
        print(f"✅ {sprite_name}: {config['description']} ({config['size'][0]}x{config['size'][1]})")
    
    # Ajouter des informations en bas
    info_y = sheet_height - 60
    info_text = "R-Type 2 Remake • Sprites générés automatiquement • github.com/sylvainbruas/r-type-like"
    info_bbox = draw.textbbox((0, 0), info_text, font=font_label)
    info_width = info_bbox[2] - info_bbox[0]
    draw.text(((sheet_width - info_width) // 2, info_y), info_text, fill=(150, 150, 150, 255), font=font_label)
    
    # Sauvegarder la sprite sheet
    output_path = 'sprites.png'
    sprite_sheet.save(output_path, 'PNG')
    
    print(f"\n🎨 Sprite sheet créée: {output_path}")
    print(f"📐 Dimensions: {sheet_width}x{sheet_height} pixels")
    print(f"🎮 Sprites inclus: {len(sprites_config)}")
    
    return output_path

def main():
    """Fonction principale"""
    print("🎨 Création de la sprite sheet R-Type 2...")
    print("=" * 50)
    
    # Vérifier les dépendances
    try:
        import cairosvg
        from PIL import Image, ImageDraw, ImageFont
    except ImportError as e:
        print(f"❌ Dépendance manquante: {e}")
        print("💡 Installation requise:")
        print("   pip install Pillow cairosvg")
        sys.exit(1)
    
    # Vérifier que nous sommes dans le bon répertoire
    if not os.path.exists('assets/images'):
        print("❌ Répertoire assets/images non trouvé")
        print("💡 Exécutez ce script depuis la racine du projet R-Type")
        sys.exit(1)
    
    try:
        output_path = create_sprite_sheet()
        print(f"\n✅ Sprite sheet générée avec succès: {output_path}")
        
        # Afficher les informations du fichier
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"📁 Taille du fichier: {file_size / 1024:.1f} KB")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
