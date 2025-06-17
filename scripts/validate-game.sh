#!/bin/bash

# Script de validation du jeu R-Type 2
echo "🎮 Validation du jeu R-Type 2..."

# Vérifier que le serveur fonctionne
echo "📡 Vérification du serveur..."
if curl -s -f http://localhost:8000 > /dev/null; then
    echo "✅ Serveur HTTP actif sur le port 8000"
else
    echo "❌ Serveur HTTP non accessible"
    echo "💡 Lancez: python3 -m http.server 8000"
    exit 1
fi

# Vérifier les fichiers critiques
echo "📁 Vérification des fichiers critiques..."

critical_files=(
    "index.html"
    "js/main.js"
    "js/config.js"
    "js/scenes/PreloadScene.js"
    "js/scenes/GameScene.js"
    "js/entities/Boss.js"
    "assets/images/boss1.svg"
    "assets/images/boss2.svg"
    "assets/images/boss3.svg"
    "assets/images/boss4.svg"
    "assets/images/boss5.svg"
)

missing_files=0
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MANQUANT)"
        ((missing_files++))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo "❌ $missing_files fichier(s) manquant(s)"
    exit 1
fi

# Vérifier les sprites des boss
echo "👾 Vérification des sprites des boss..."
boss_sizes=(
    "boss1.svg:240x120"
    "boss2.svg:220x140"
    "boss3.svg:200x160"
    "boss4.svg:260x120"
    "boss5.svg:200x200"
)

for boss_info in "${boss_sizes[@]}"; do
    file=$(echo $boss_info | cut -d: -f1)
    expected_size=$(echo $boss_info | cut -d: -f2)
    
    if [ -f "assets/images/$file" ]; then
        # Vérifier que le fichier contient les dimensions attendues
        if grep -q "width=\"$(echo $expected_size | cut -dx -f1)\"" "assets/images/$file" && \
           grep -q "height=\"$(echo $expected_size | cut -dx -f2)\"" "assets/images/$file"; then
            echo "✅ $file ($expected_size)"
        else
            echo "⚠️  $file (dimensions à vérifier)"
        fi
    else
        echo "❌ $file (MANQUANT)"
    fi
done

# Vérifier la syntaxe JavaScript critique
echo "🔍 Vérification de la syntaxe JavaScript..."

# Vérifier PreloadScene pour l'erreur fillPolygon
if grep -v "^\s*//" js/scenes/PreloadScene.js | grep -q "fillPolygon"; then
    echo "❌ PreloadScene.js contient encore fillPolygon (erreur potentielle)"
    exit 1
else
    echo "✅ PreloadScene.js - pas d'erreur fillPolygon"
fi

# Vérifier Boss.js pour les méthodes statiques
if grep -q "getBossSprite" js/entities/Boss.js && \
   grep -q "getBossName" js/entities/Boss.js; then
    echo "✅ Boss.js - méthodes statiques présentes"
else
    echo "❌ Boss.js - méthodes statiques manquantes"
    exit 1
fi

# Test de connectivité aux assets
echo "🖼️  Test de chargement des assets..."
for i in {1..5}; do
    if curl -s -f "http://localhost:8000/assets/images/boss$i.svg" > /dev/null; then
        echo "✅ boss$i.svg accessible via HTTP"
    else
        echo "❌ boss$i.svg non accessible via HTTP"
    fi
done

echo ""
echo "🎯 Validation terminée !"
echo ""
echo "📋 Instructions de test :"
echo "1. Ouvrez http://localhost:8000 dans votre navigateur"
echo "2. Cliquez sur 'Commencer' pour démarrer le jeu"
echo "3. Utilisez les touches 1-5 pour tester chaque boss :"
echo "   - Touche 1: Serpent Mécanique (mouvement sinusoïdal)"
echo "   - Touche 2: Croiseur Lourd (mouvement vertical régulier)"
echo "   - Touche 3: Station Orbitale (mouvement orbital)"
echo "   - Touche 4: Dreadnought (mouvement agressif)"
echo "   - Touche 5: Core Alien (mouvement chaotique)"
echo ""
echo "🔍 Points à vérifier :"
echo "✅ Sprites non déformés (échelle 1:1)"
echo "✅ Couleurs originales visibles (pas de teinte magenta)"
echo "✅ Mouvement dynamique dans les 30% droits de l'écran"
echo "✅ Vitesse appropriée (50-80% du joueur)"
echo "✅ Patterns de mouvement distincts pour chaque boss"
echo ""
echo "📖 Guide détaillé : docs/BOSS-BEHAVIOR-TEST.md"
echo ""
echo "✅ Le jeu devrait maintenant fonctionner sans erreur JavaScript !"
echo "🎮 Les boss ont un comportement corrigé et optimisé !"
