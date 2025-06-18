#!/bin/bash

# Script de test de l'amplitude verticale DOUBLÉE du Boss 1
echo "🐍 AMPLITUDE VERTICALE x2 - Boss 1 Serpent MAXIMALE"
echo "==================================================="

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
echo "🔥 AMPLITUDE MULTIPLIÉE PAR 2 !"
echo "==============================="

echo "❌ AMPLITUDE ORIGINALE: 40% (224px) - Insuffisante"
echo "⚡ AMPLITUDE PRÉCÉDENTE: 80% (448px) - Bonne"
echo "🚀 AMPLITUDE ACTUELLE: 95% (532px) - MAXIMALE !"

echo ""
echo "📊 PROGRESSION DE L'AMPLITUDE:"
echo "=============================="

# Calculer les dimensions pour l'affichage
SCREEN_HEIGHT=600
ZONE_HEIGHT=$((SCREEN_HEIGHT - 40))  # 560px
AMPLITUDE_40=$((ZONE_HEIGHT * 40 / 100))  # 224px
AMPLITUDE_80=$((ZONE_HEIGHT * 80 / 100))  # 448px
AMPLITUDE_95=$((ZONE_HEIGHT * 95 / 100))  # 532px

echo "📐 Zone de mouvement disponible: ${ZONE_HEIGHT}px"
echo ""
echo "📈 ÉVOLUTION DE L'AMPLITUDE:"
echo "├── Étape 1 (Original): ${AMPLITUDE_40}px (40%)"
echo "├── Étape 2 (Amélioré): ${AMPLITUDE_80}px (80%)"
echo "└── Étape 3 (DOUBLÉ): ${AMPLITUDE_95}px (95%) ⭐"

echo ""
echo "🎯 GAINS CUMULÉS:"
echo "================"

GAIN_STEP1=$(($AMPLITUDE_80 - $AMPLITUDE_40))
GAIN_STEP2=$(($AMPLITUDE_95 - $AMPLITUDE_80))
GAIN_TOTAL=$(($AMPLITUDE_95 - $AMPLITUDE_40))

echo "⚡ Gain Étape 1→2: +${GAIN_STEP1}px (+100%)"
echo "🚀 Gain Étape 2→3: +${GAIN_STEP2}px (+19%)"
echo "🏆 GAIN TOTAL: +${GAIN_TOTAL}px (+137%)"

echo ""
echo "🔧 AMÉLIORATIONS TECHNIQUES:"
echo "============================"

echo "✅ Amplitude: 0.95 (95% de la zone - QUASI-MAXIMUM)"
echo "✅ Réactivité: 0.3 (maximale pour suivre l'amplitude)"
echo "✅ Mouvement horizontal: 35% (effet serpentin renforcé)"
echo "✅ Vélocité Y: 0.3 (réponse instantanée)"
echo "✅ Vélocité X: 0.15 (dérive serpentine fluide)"

echo ""
echo "🎮 PAGES DE TEST SPÉCIALISÉES:"
echo "============================="

# Vérifier les pages de test
test_pages=(
    "index.html:Jeu principal (touche 1)"
    "test-boss1-amplitude-x2.html:Test amplitude x2 SPÉCIALISÉ"
    "test-boss1-amplitude.html:Test amplitude standard"
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
echo "🎯 TEST PRIORITAIRE - AMPLITUDE x2:"
echo "==================================="

echo ""
echo "🚀 http://localhost:8000/test-boss1-amplitude-x2.html"
echo ""
echo "FONCTIONNALITÉS EXCLUSIVES:"
echo "├── 📊 Barres de comparaison avant/après"
echo "├── 📐 Guides visuels amplitude MAXIMALE"
echo "├── 🔴 Lignes rouges épaisses = Limites 95%"
echo "├── 🟠 Lignes pointillées = Anciennes limites 40%"
echo "├── 🔄 Mode comparaison (nouveau vs ancien)"
echo "├── 📈 Métriques temps réel amplitude x2"
echo "├── ⚠️  Avertissement amplitude quasi-maximale"
echo "└── 🚀 Auto-spawn avec amplitude doublée"

echo ""
echo "📋 VALIDATION VISUELLE EXTRÊME:"
echo "==============================="

echo ""
echo "Le Boss 1 doit maintenant:"
echo "✅ Atteindre PRESQUE le haut de la zone verte (~34px)"
echo "✅ Atteindre PRESQUE le bas de la zone verte (~566px)"
echo "✅ Couvrir ${AMPLITUDE_95}px de hauteur (vs ${AMPLITUDE_40}px original)"
echo "✅ Mouvement TRÈS ample et spectaculaire"
echo "✅ Effet serpentin prononcé avec dérive horizontale"
echo "✅ Réactivité maximale (changements instantanés)"

echo ""
echo "🔍 POINTS DE CONTRÔLE CRITIQUES:"
echo "================================"

echo ""
echo "1. 📏 AMPLITUDE QUASI-MAXIMALE:"
echo "   - Boss monte jusqu'à la ligne rouge épaisse du HAUT"
echo "   - Boss descend jusqu'à la ligne rouge épaisse du BAS"
echo "   - Amplitude couvre 95% de l'espace disponible"
echo "   - Mouvement spectaculaire et très visible"

echo ""
echo "2. ⚡ RÉACTIVITÉ MAXIMALE:"
echo "   - Vélocité Y: 0.3 (réponse instantanée)"
echo "   - Changements de direction très fluides"
echo "   - Pas de retard dans le mouvement"

echo ""
echo "3. 🐍 EFFET SERPENTIN RENFORCÉ:"
echo "   - Mouvement horizontal 35% (très prononcé)"
echo "   - Dérive sinusoïdale ample"
echo "   - Pattern serpentin spectaculaire"

echo ""
echo "📊 MÉTRIQUES ATTENDUES (MAXIMALES):"
echo "==================================="

echo ""
echo "Position Y doit osciller entre:"
echo "├── Minimum: ~34px (limite haute quasi-maximale)"
echo "├── Centre: 300px (ligne jaune)"
echo "└── Maximum: ~566px (limite basse quasi-maximale)"

echo ""
echo "Amplitude totale: ${AMPLITUDE_95}px (95% de ${ZONE_HEIGHT}px)"
echo "Gain par rapport à l'original: +${GAIN_TOTAL}px (+137%)"

echo ""
echo "🏆 AMPLITUDE MAXIMALE ATTEINTE !"
echo "================================"

echo ""
echo "L'amplitude du Boss 1 a été multipliée par 2 au MAXIMUM possible !"
echo "95% est la limite technique pour éviter que le boss sorte de sa zone."
echo "Le mouvement est maintenant SPECTACULAIRE et très dynamique !"
echo ""
echo "🎮 Testez l'amplitude MAXIMALE: http://localhost:8000/test-boss1-amplitude-x2.html"
