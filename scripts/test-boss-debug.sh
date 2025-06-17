#!/bin/bash

# Script de test et debug des boss
echo "🔧 Test et Debug des Boss R-Type 2"
echo "=================================="

# Vérifier que le serveur fonctionne
echo "📡 Vérification du serveur..."
if curl -s -f http://localhost:8000 > /dev/null; then
    echo "✅ Serveur HTTP actif sur le port 8000"
else
    echo "❌ Serveur HTTP non accessible"
    echo "💡 Lancement du serveur..."
    python3 -m http.server 8000 > /dev/null 2>&1 &
    sleep 2
    echo "✅ Serveur lancé"
fi

# Vérifier les fichiers de debug
echo ""
echo "🔍 Vérification des fichiers de debug..."

debug_files=(
    "debug-boss.html"
    "js/entities/Boss.js"
    "js/config.js"
    "assets/images/boss1.svg"
    "assets/images/boss2.svg"
    "assets/images/boss3.svg"
    "assets/images/boss4.svg"
    "assets/images/boss5.svg"
)

for file in "${debug_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MANQUANT)"
    fi
done

# Vérifier la syntaxe JavaScript
echo ""
echo "🔍 Vérification de la syntaxe JavaScript..."

# Vérifier Boss.js pour les logs de debug
if grep -q "🔧 DEBUG" js/entities/Boss.js; then
    echo "✅ Boss.js contient les logs de debug"
else
    echo "❌ Boss.js ne contient pas les logs de debug"
fi

# Vérifier les méthodes critiques
critical_methods=(
    "setBossScale"
    "serpentMovement"
    "updateBossMovement"
    "constrainToMovementZone"
)

for method in "${critical_methods[@]}"; do
    if grep -q "$method" js/entities/Boss.js; then
        echo "✅ Méthode $method présente"
    else
        echo "❌ Méthode $method manquante"
    fi
done

# Test de connectivité aux pages
echo ""
echo "🌐 Test de connectivité..."

pages=(
    "index.html:Jeu principal"
    "debug-boss.html:Page de debug"
)

for page_info in "${pages[@]}"; do
    page=$(echo $page_info | cut -d: -f1)
    desc=$(echo $page_info | cut -d: -f2)
    
    if curl -s -f "http://localhost:8000/$page" > /dev/null; then
        echo "✅ $desc ($page) accessible"
    else
        echo "❌ $desc ($page) non accessible"
    fi
done

# Vérifier les dimensions des sprites
echo ""
echo "🖼️  Vérification des dimensions des sprites..."

sprite_dims=(
    "boss1.svg:240:120"
    "boss2.svg:220:140"
    "boss3.svg:200:160"
    "boss4.svg:260:120"
    "boss5.svg:200:200"
)

for sprite_info in "${sprite_dims[@]}"; do
    file=$(echo $sprite_info | cut -d: -f1)
    width=$(echo $sprite_info | cut -d: -f2)
    height=$(echo $sprite_info | cut -d: -f3)
    
    if [ -f "assets/images/$file" ]; then
        if grep -q "width=\"$width\"" "assets/images/$file" && \
           grep -q "height=\"$height\"" "assets/images/$file"; then
            echo "✅ $file (${width}x${height})"
        else
            echo "⚠️  $file (dimensions à vérifier)"
        fi
    else
        echo "❌ $file (MANQUANT)"
    fi
done

echo ""
echo "🎯 Instructions de Test"
echo "======================"
echo ""
echo "1. 🎮 Test du jeu principal :"
echo "   http://localhost:8000"
echo "   - Cliquer sur 'Commencer'"
echo "   - Utiliser les touches 1-5 pour tester chaque boss"
echo ""
echo "2. 🔧 Page de debug dédiée :"
echo "   http://localhost:8000/debug-boss.html"
echo "   - Interface de debug avec logs en temps réel"
echo "   - Zone de mouvement visualisée"
echo "   - Boutons de test individuels"
echo "   - Console logs capturés"
echo ""
echo "3. 🔍 Points à vérifier :"
echo "   ✅ Sprite non déformé (échelle 1:1)"
echo "   ✅ Couleurs originales visibles"
echo "   ✅ Mouvement dans la zone verte (30% droits)"
echo "   ✅ Vitesse de mouvement visible"
echo "   ✅ Patterns distincts par boss"
echo ""
echo "4. 📋 Logs à surveiller :"
echo "   🔧 DEBUG: Messages de debug détaillés"
echo "   👾 Boss: Informations sur les boss"
echo "   ❌ ERROR: Erreurs à corriger"
echo ""
echo "✅ Environnement de debug prêt !"
echo "🔧 Utilisez les deux pages pour identifier les problèmes"
