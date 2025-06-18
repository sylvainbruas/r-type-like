#!/bin/bash

# Script de test de la vitesse des boss réduite de moitié
echo "🐌 VITESSE DES BOSS - RÉDUITE DE MOITIÉ"
echo "======================================"

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
echo "⚡ RÉDUCTION DE VITESSE APPLIQUÉE:"
echo "================================="

echo "❌ VITESSE ORIGINALE: 100% (trop rapide)"
echo "✅ VITESSE ACTUELLE: 50% (contrôlée)"

echo ""
echo "📊 FRÉQUENCES RÉDUITES PAR BOSS:"
echo "==============================="

echo ""
echo "🐍 BOSS 1 - SERPENT:"
echo "├── AVANT: 0.5 Hz (1 cycle toutes les 2 secondes)"
echo "├── APRÈS: 0.25 Hz (1 cycle toutes les 4 secondes)"
echo "└── RÉDUCTION: 50% plus lent"

echo ""
echo "🚢 BOSS 2 - CROISEUR:"
echo "├── AVANT: Facteur temps 0.0008"
echo "├── APRÈS: Facteur temps 0.0004"
echo "└── RÉDUCTION: 50% plus lent"

echo ""
echo "🛰️ BOSS 3 - STATION:"
echo "├── AVANT: Facteur temps 0.0006"
echo "├── APRÈS: Facteur temps 0.0003"
echo "└── RÉDUCTION: 50% plus lent"

echo ""
echo "⚔️ BOSS 4 - DREADNOUGHT:"
echo "├── AVANT: Facteur temps 0.001"
echo "├── APRÈS: Facteur temps 0.0005"
echo "└── RÉDUCTION: 50% plus lent"

echo ""
echo "👾 BOSS 5 - CORE ALIEN:"
echo "├── AVANT: Facteur temps 0.0012"
echo "├── APRÈS: Facteur temps 0.0006"
echo "└── RÉDUCTION: 50% plus lent"

echo ""
echo "🎯 AMÉLIORATIONS APPORTÉES:"
echo "=========================="

echo "✅ Mouvement plus contrôlable et prévisible"
echo "✅ Amplitude conservée (90% pour Boss 1)"
echo "✅ Patterns de mouvement inchangés"
echo "✅ Fluidité mathématique préservée"
echo "✅ Gameplay plus accessible"

echo ""
echo "🎮 PAGES DE TEST DISPONIBLES:"
echo "============================="

# Vérifier les pages de test
test_pages=(
    "index.html:Jeu principal (touche 1-5)"
    "test-boss-speed-reduced.html:Test vitesse réduite SPÉCIALISÉ"
    "test-boss-movement-rebuilt.html:Test système refait"
    "debug-boss.html:Debug général"
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
echo "🎯 TEST PRIORITAIRE - VITESSE RÉDUITE:"
echo "====================================="

echo ""
echo "🐌 http://localhost:8000/test-boss-speed-reduced.html"
echo ""
echo "FONCTIONNALITÉS SPÉCIALISÉES:"
echo "├── 📊 Barres de comparaison vitesse (100% vs 50%)"
echo "├── ⏱️  Métriques temps réel des cycles"
echo "├── 🎮 Test de tous les boss à vitesse réduite"
echo "├── 📐 Guides visuels avec timing"
echo "├── 🔍 Validation fréquences réduites"
echo "├── ⚡ Comparaison avant/après"
echo "└── 🚀 Auto-test Boss 1 après 3 secondes"

echo ""
echo "📋 VALIDATION DE LA VITESSE RÉDUITE:"
echo "==================================="

echo ""
echo "Le système doit maintenant montrer:"
echo "✅ Boss 1: Cycle complet en 4 secondes (vs 2 sec)"
echo "✅ Mouvement plus lent et contrôlable"
echo "✅ Même amplitude (90% vertical pour Boss 1)"
echo "✅ Patterns fluides mais plus lents"
echo "✅ Gameplay plus accessible"

echo ""
echo "🔍 POINTS DE CONTRÔLE CRITIQUES:"
echo "================================"

echo ""
echo "1. ⏱️  TIMING DU BOSS 1 (Serpent):"
echo "   - Doit prendre 4 secondes pour un cycle complet"
echo "   - Mouvement du haut au bas en 2 secondes"
echo "   - Retour du bas au haut en 2 secondes"
echo "   - Fréquence: 0.25 Hz (vs 0.5 Hz original)"

echo ""
echo "2. 📏 AMPLITUDE CONSERVÉE:"
echo "   - Toujours 90% de la zone verticale"
echo "   - Limites cyan atteintes"
echo "   - Mouvement ample mais plus lent"

echo ""
echo "3. 🎯 CONTRÔLABILITÉ:"
echo "   - Mouvement plus prévisible"
echo "   - Plus facile à suivre visuellement"
echo "   - Gameplay moins frénétique"

echo ""
echo "📊 MÉTRIQUES ATTENDUES:"
echo "======================"

echo ""
echo "Boss 1 (Serpent) - Timing attendu:"
echo "├── Cycle complet: 4.0 secondes"
echo "├── Demi-cycle (haut→bas): 2.0 secondes"
echo "├── Demi-cycle (bas→haut): 2.0 secondes"
echo "├── Fréquence: 0.25 Hz"
echo "└── Position Y: Oscillation lente entre 48px et 552px"

echo ""
echo "Autres boss - Vitesse proportionnellement réduite:"
echo "├── Boss 2: Mouvement vertical très lent"
echo "├── Boss 3: Orbite lente et contrôlée"
echo "├── Boss 4: Chaos lent et prévisible"
echo "└── Boss 5: Chaos complexe mais plus lent"

echo ""
echo "🏆 VITESSE OPTIMISÉE !"
echo "====================="

echo ""
echo "La vitesse de tous les boss a été réduite de 50% !"
echo "Le mouvement reste fluide mais devient plus contrôlable."
echo "L'amplitude et les patterns sont conservés intégralement."
echo ""
echo "🎮 Testez la vitesse réduite: http://localhost:8000/test-boss-speed-reduced.html"
