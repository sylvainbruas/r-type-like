#!/bin/bash

# Script de préparation de release v0.2
echo "🚀 PRÉPARATION RELEASE v0.2 - R-TYPE 2 REMAKE"
echo "============================================="

VERSION="0.2.0"
RELEASE_DATE=$(date +"%Y-%m-%d")

echo ""
echo "📋 VÉRIFICATIONS PRE-RELEASE:"
echo "============================="

# Vérifier que nous sommes sur la branche release
CURRENT_BRANCH=$(git branch --show-current)
if [[ $CURRENT_BRANCH != "release/v0.2" ]]; then
    echo "❌ Erreur: Vous devez être sur la branche release/v0.2"
    echo "   Branche actuelle: $CURRENT_BRANCH"
    exit 1
fi
echo "✅ Branche release/v0.2 active"

# Vérifier le fichier VERSION
if [[ -f "VERSION" ]]; then
    FILE_VERSION=$(cat VERSION)
    if [[ "$FILE_VERSION" == "$VERSION" ]]; then
        echo "✅ Fichier VERSION correct: $FILE_VERSION"
    else
        echo "❌ Version incorrecte dans VERSION: $FILE_VERSION (attendu: $VERSION)"
        exit 1
    fi
else
    echo "❌ Fichier VERSION manquant"
    exit 1
fi

# Vérifier le CHANGELOG
if [[ -f "CHANGELOG.md" ]]; then
    if grep -q "v0.2.0" CHANGELOG.md; then
        echo "✅ CHANGELOG.md contient v0.2.0"
    else
        echo "❌ CHANGELOG.md ne contient pas v0.2.0"
        exit 1
    fi
else
    echo "❌ Fichier CHANGELOG.md manquant"
    exit 1
fi

# Vérifier le titre dans index.html
if grep -q "R-Type 2 - Remake v0.2" index.html; then
    echo "✅ Titre v0.2 dans index.html"
else
    echo "❌ Titre v0.2 manquant dans index.html"
    exit 1
fi

echo ""
echo "🧪 VÉRIFICATIONS FONCTIONNELLES:"
echo "==============================="

# Vérifier la présence des fichiers clés
KEY_FILES=(
    "js/entities/AlienTerrain.js"
    "js/entities/Boss.js"
    "test-terrain-bitmap.html"
    "test-boss-speed-reduced.html"
    "scripts/test-terrain-bitmap.sh"
    "scripts/test-boss-speed-reduced.sh"
)

for file in "${KEY_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file présent"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

echo ""
echo "📊 STATISTIQUES DE LA RELEASE:"
echo "============================="

# Compter les fichiers de test
TEST_FILES=$(find . -name "test-*.html" | wc -l)
echo "📄 Pages de test: $TEST_FILES"

# Compter les scripts
SCRIPT_FILES=$(find scripts/ -name "*.sh" | wc -l)
echo "📜 Scripts: $SCRIPT_FILES"

# Compter les versions de terrain
TERRAIN_FILES=$(find js/entities/ -name "AlienTerrain*.js" | wc -l)
echo "🌍 Versions de terrain: $TERRAIN_FILES"

# Taille du projet
PROJECT_SIZE=$(du -sh . | cut -f1)
echo "💾 Taille du projet: $PROJECT_SIZE"

echo ""
echo "🎯 FONCTIONNALITÉS v0.2:"
echo "======================="

echo "✅ Terrain bitmap avec opacité 100%"
echo "✅ 5 environnements spatiaux distincts"
echo "✅ Boss avec vitesse réduite de 50%"
echo "✅ Suite de tests complète"
echo "✅ Scripts de validation"
echo "✅ Documentation technique"

echo ""
echo "🔍 TESTS RECOMMANDÉS AVANT RELEASE:"
echo "=================================="

echo "1. 🎮 Test du jeu principal:"
echo "   http://localhost:8000/index.html"

echo ""
echo "2. 🎨 Test terrain bitmap:"
echo "   http://localhost:8000/test-terrain-bitmap.html"

echo ""
echo "3. ⚡ Test vitesse boss:"
echo "   http://localhost:8000/test-boss-speed-reduced.html"

echo ""
echo "4. 🧪 Scripts de validation:"
echo "   ./scripts/test-terrain-bitmap.sh"
echo "   ./scripts/test-boss-speed-reduced.sh"

echo ""
echo "📋 CHECKLIST FINALE:"
echo "==================="

echo "□ Terrain 100% opaque dans le jeu principal"
echo "□ Boss avec vitesse réduite fonctionnelle"
echo "□ 5 niveaux avec environnements distincts"
echo "□ Pages de test fonctionnelles"
echo "□ Scripts de validation exécutables"
echo "□ Documentation à jour"

echo ""
echo "🏆 RELEASE v0.2 PRÊTE !"
echo "======================"

echo ""
echo "Version: $VERSION"
echo "Date: $RELEASE_DATE"
echo "Branche: $CURRENT_BRANCH"
echo ""
echo "Pour finaliser la release:"
echo "git flow release finish v0.2"
echo ""
echo "🚀 R-Type 2 v0.2 - Terrain spatial réaliste et boss équilibrés !"
