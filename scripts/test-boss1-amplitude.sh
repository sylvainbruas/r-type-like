#!/bin/bash

# Script de test de l'amplitude verticale corrigée du Boss 1
echo "🐍 Test Amplitude Verticale Boss 1 - CORRECTION MAJEURE"
echo "======================================================="

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
echo "🔧 CORRECTION AMPLITUDE APPLIQUÉE:"
echo "=================================="

echo "❌ AVANT: Amplitude 40% (trop faible)"
echo "✅ APRÈS: Amplitude 80% (très visible)"

echo ""
echo "📊 NOUVELLES MÉTRIQUES:"
echo "======================"

# Calculer les dimensions pour l'affichage
SCREEN_HEIGHT=600
ZONE_HEIGHT=$((SCREEN_HEIGHT - 40))  # 20px top + 20px bottom = 560px
AMPLITUDE_80=$((ZONE_HEIGHT * 80 / 100))  # 80% = 448px
AMPLITUDE_40=$((ZONE_HEIGHT * 40 / 100))  # 40% = 224px

echo "📐 Zone de mouvement: ${ZONE_HEIGHT}px (hauteur disponible)"
echo "📈 Amplitude AVANT: ${AMPLITUDE_40}px (40% - insuffisant)"
echo "📈 Amplitude APRÈS: ${AMPLITUDE_80}px (80% - très visible)"
echo "⚡ Gain d'amplitude: +$(($AMPLITUDE_80 - $AMPLITUDE_40))px (+100%)"

echo ""
echo "🎯 AMÉLIORATIONS TECHNIQUES:"
echo "============================"

echo "✅ Amplitude: 0.8 (80% de la zone vs 0.4 précédent)"
echo "✅ Réactivité: 0.25 (augmentée pour suivre l'amplitude)"
echo "✅ Mouvement horizontal: 0.3 (30% pour effet serpentin)"
echo "✅ Logs de debug: Toutes les 2 secondes (contrôlés)"

echo ""
echo "🎮 PAGES DE TEST DISPONIBLES:"
echo "============================="

# Vérifier les pages de test
test_pages=(
    "index.html:Jeu principal (touche 1)"
    "test-boss1-amplitude.html:Test amplitude spécifique"
    "test-boss1-fix.html:Test corrections générales"
    "debug-boss.html:Debug tous boss"
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
echo "🎯 TEST RECOMMANDÉ - AMPLITUDE SPÉCIFIQUE:"
echo "=========================================="

echo ""
echo "🔧 http://localhost:8000/test-boss1-amplitude.html"
echo ""
echo "FONCTIONNALITÉS SPÉCIALES:"
echo "├── 📊 Métriques en temps réel (position, vélocité)"
echo "├── 📐 Guides visuels avec limites d'amplitude"
echo "├── 🔴 Lignes rouges = Limites amplitude 80%"
echo "├── 🟡 Ligne jaune = Centre de la zone"
echo "├── 🟢 Zone verte = Zone de mouvement"
echo "├── 🧪 Test amplitude extrême (90%) disponible"
echo "└── 🚀 Auto-spawn après 2 secondes"

echo ""
echo "📋 VALIDATION VISUELLE:"
echo "======================"

echo ""
echo "Le Boss 1 doit maintenant:"
echo "✅ Se déplacer du HAUT au BAS de la zone verte"
echo "✅ Atteindre les lignes rouges (limites 80%)"
echo "✅ Avoir un mouvement ample et très visible"
echo "✅ Couvrir ${AMPLITUDE_80}px de hauteur (vs ${AMPLITUDE_40}px avant)"
echo "✅ Mouvement serpentin fluide avec dérive horizontale"

echo ""
echo "🔍 POINTS DE CONTRÔLE:"
echo "====================="

echo ""
echo "1. 📏 AMPLITUDE VERTICALE:"
echo "   - Le boss doit monter jusqu'à la ligne rouge du haut"
echo "   - Le boss doit descendre jusqu'à la ligne rouge du bas"
echo "   - Mouvement sinusoïdal ample et régulier"

echo ""
echo "2. ⚡ VITESSE x2.5:"
echo "   - Fréquence: 0.0075 (cycle complet plus rapide)"
echo "   - Réactivité: 0.25 (changements de direction fluides)"

echo ""
echo "3. 🐍 EFFET SERPENTIN:"
echo "   - Mouvement horizontal léger (30% de la zone)"
echo "   - Dérive sinusoïdale pour effet serpent"

echo ""
echo "📊 MÉTRIQUES ATTENDUES:"
echo "======================"

echo ""
echo "Position Y doit osciller entre:"
echo "├── Minimum: ~$(( (SCREEN_HEIGHT/2) - AMPLITUDE_80/2 ))px (limite haute)"
echo "├── Centre: $(( SCREEN_HEIGHT/2 ))px (ligne jaune)"
echo "└── Maximum: ~$(( (SCREEN_HEIGHT/2) + AMPLITUDE_80/2 ))px (limite basse)"

echo ""
echo "🚀 PRÊT POUR VALIDATION !"
echo "========================"

echo ""
echo "L'amplitude verticale du Boss 1 a été DOUBLÉE (40% → 80%)"
echo "Le mouvement est maintenant beaucoup plus visible et dynamique !"
echo ""
echo "🎮 Testez immédiatement: http://localhost:8000/test-boss1-amplitude.html"
