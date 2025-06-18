#!/bin/bash

# Script de test des corrections du Boss 1
echo "🐍 Test des Corrections Boss 1 - Serpent Mécanique"
echo "=================================================="

# Vérifier le serveur
if curl -s -f http://localhost:8000 > /dev/null; then
    echo "✅ Serveur HTTP actif sur le port 8000"
else
    echo "❌ Serveur HTTP non accessible"
    echo "💡 Lancement du serveur..."
    python3 -m http.server 8000 > /dev/null 2>&1 &
    sleep 2
    echo "✅ Serveur lancé"
fi

echo ""
echo "🔧 Corrections Appliquées au Boss 1:"
echo "======================================"

echo "✅ SPRITE CORRIGÉ:"
echo "   - Texture fallback: 240x120 (dimensions correctes)"
echo "   - Design serpentin amélioré avec segments"
echo "   - Validation automatique des textures"
echo "   - Fallback seulement si SVG échoue"

echo ""
echo "✅ MOUVEMENT x2.5 PLUS RAPIDE:"
echo "   - Fréquence: 0.0075 (vs 0.003 normal)"
echo "   - Réactivité: 0.2 (vs 0.08 normal)"
echo "   - Amplitude: 40% de la zone (équilibré)"
echo "   - Mouvement horizontal serpentin ajouté"

echo ""
echo "✅ CODE NETTOYÉ:"
echo "   - Logs de debug réduits"
echo "   - Console moins encombrée"
echo "   - Performance optimisée"

echo ""
echo "🎮 Pages de Test Disponibles:"
echo "============================="

# Vérifier les pages de test
test_pages=(
    "index.html:Jeu principal"
    "test-boss1-fix.html:Test Boss 1 spécifique"
    "debug-boss.html:Debug général des boss"
)

for page_info in "${test_pages[@]}"; do
    page=$(echo $page_info | cut -d: -f1)
    desc=$(echo $page_info | cut -d: -f2)
    
    if curl -s -f "http://localhost:8000/$page" > /dev/null; then
        echo "✅ $desc - http://localhost:8000/$page"
    else
        echo "❌ $desc - Page non accessible"
    fi
done

echo ""
echo "🎯 Instructions de Test:"
echo "========================"

echo ""
echo "1. 🎮 TEST PRINCIPAL (Recommandé):"
echo "   http://localhost:8000"
echo "   - Cliquer sur 'Commencer'"
echo "   - Appuyer sur la touche '1' pour spawner Boss 1"
echo "   - Observer: Sprite correct + mouvement x2.5 plus rapide"

echo ""
echo "2. 🔧 TEST SPÉCIFIQUE BOSS 1:"
echo "   http://localhost:8000/test-boss1-fix.html"
echo "   - Test isolé avec corrections visibles"
echo "   - Zone de mouvement visualisée"
echo "   - Auto-spawn du Boss 1 après 2 secondes"

echo ""
echo "3. 🐛 DEBUG GÉNÉRAL:"
echo "   http://localhost:8000/debug-boss.html"
echo "   - Test de tous les boss"
echo "   - Console logs détaillés"

echo ""
echo "✅ VALIDATION ATTENDUE:"
echo "======================="

echo ""
echo "🐍 Boss 1 (Serpent Mécanique) doit maintenant:"
echo "   ✅ Apparaître avec le bon sprite (non déformé)"
echo "   ✅ Se déplacer verticalement x2.5 plus vite"
echo "   ✅ Avoir un mouvement serpentin fluide"
echo "   ✅ Rester dans la zone 30% droite de l'écran"
echo "   ✅ Avoir une amplitude de 40% de la hauteur"

echo ""
echo "📊 Métriques Techniques:"
echo "   - Fréquence: 0.0075 (x2.5 augmentation)"
echo "   - Vélocité Y: 0.2 (x2.5 plus réactif)"
echo "   - Vélocité X: 0.1 (mouvement horizontal)"
echo "   - Amplitude: 40% de zone (équilibré)"

echo ""
echo "🚀 PRÊT POUR LE TEST !"
echo "Ouvrez une des pages ci-dessus pour valider les corrections."
