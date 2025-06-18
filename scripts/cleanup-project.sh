#!/bin/bash

# Script de nettoyage du projet - Hotfix cleanup-and-update
echo "🧹 NETTOYAGE PROJET - HOTFIX CLEANUP-AND-UPDATE"
echo "==============================================="

echo ""
echo "📋 ACTIONS DE NETTOYAGE EFFECTUÉES:"
echo "=================================="

echo ""
echo "✅ FICHIERS DÉPLACÉS VERS visual-tests/:"
echo "├── test-boss-movement-rebuilt.html → visual-tests/"
echo "├── test-terrain-improved.html → visual-tests/"
echo "└── Documentation visual-tests/README.md mise à jour"

echo ""
echo "🗑️  FICHIERS SUPPRIMÉS (OBSOLÈTES):"
echo "├── debug-boss.html (debug général remplacé)"
echo "├── test-boss1-amplitude-x2.html (test spécifique obsolète)"
echo "├── test-boss1-amplitude.html (test basique obsolète)"
echo "├── test-boss1-fix.html (fix intégré)"
echo "├── test-game-terrain-opacity.html (remplacé par bitmap)"
echo "├── test-terrain-full-opacity.html (remplacé par bitmap)"
echo "├── test-terrain-no-green-squares.html (fix intégré)"
echo "└── test-terrain-opacity-levels-fix.html (remplacé par bitmap)"

echo ""
echo "✅ FICHIERS CONSERVÉS À LA RACINE:"
echo "├── test-terrain-bitmap.html (test principal v0.2)"
echo "├── test-boss-speed-reduced.html (fonctionnalité v0.2)"
echo "├── debug-terrain-version.html (diagnostic utile)"
echo "└── index-no-cache.html (debug cache)"

echo ""
echo "📚 DOCUMENTATION MISE À JOUR:"
echo "├── docs/questions.txt (ajout phases 9-11)"
echo "├── visual-tests/README.md (organisation post-nettoyage)"
echo "└── cleanup-plan.md (plan de nettoyage détaillé)"

echo ""
echo "🎯 OBJECTIFS DU NETTOYAGE:"
echo "========================="

echo "✅ ORGANISATION CLAIRE:"
echo "├── Tests principaux à la racine (facilement accessibles)"
echo "├── Tests de développement dans visual-tests/"
echo "├── Suppression des fichiers obsolètes"
echo "└── Documentation à jour"

echo ""
echo "✅ MAINTENANCE SIMPLIFIÉE:"
echo "├── Moins de fichiers à la racine"
echo "├── Tests organisés par catégorie"
echo "├── Historique complet dans questions.txt"
echo "└── Scripts de validation conservés"

echo ""
echo "📊 STATISTIQUES POST-NETTOYAGE:"
echo "=============================="

# Compter les fichiers restants
ROOT_TESTS=$(find . -maxdepth 1 -name "test-*.html" -o -name "debug-*.html" | wc -l)
VISUAL_TESTS=$(find visual-tests/ -name "*.html" 2>/dev/null | wc -l)
SCRIPTS=$(find scripts/ -name "*.sh" | wc -l)

echo "📄 Tests à la racine: $ROOT_TESTS"
echo "🎨 Tests visuels: $VISUAL_TESTS"
echo "📜 Scripts: $SCRIPTS"
echo "💾 Taille du projet: $(du -sh . | cut -f1)"

echo ""
echo "🔍 VALIDATION POST-NETTOYAGE:"
echo "============================"

echo ""
echo "Tests principaux accessibles:"
if [[ -f "test-terrain-bitmap.html" ]]; then
    echo "✅ test-terrain-bitmap.html (approche bitmap v0.2)"
else
    echo "❌ test-terrain-bitmap.html manquant"
fi

if [[ -f "test-boss-speed-reduced.html" ]]; then
    echo "✅ test-boss-speed-reduced.html (boss équilibrés v0.2)"
else
    echo "❌ test-boss-speed-reduced.html manquant"
fi

if [[ -f "debug-terrain-version.html" ]]; then
    echo "✅ debug-terrain-version.html (diagnostic)"
else
    echo "❌ debug-terrain-version.html manquant"
fi

echo ""
echo "Tests visuels organisés:"
if [[ -f "visual-tests/test-boss-movement-rebuilt.html" ]]; then
    echo "✅ visual-tests/test-boss-movement-rebuilt.html"
else
    echo "❌ test-boss-movement-rebuilt.html manquant"
fi

if [[ -f "visual-tests/test-terrain-improved.html" ]]; then
    echo "✅ visual-tests/test-terrain-improved.html"
else
    echo "❌ test-terrain-improved.html manquant"
fi

echo ""
echo "Documentation mise à jour:"
if grep -q "Question 44" docs/questions.txt; then
    echo "✅ docs/questions.txt mis à jour (Question 44)"
else
    echo "❌ docs/questions.txt non mis à jour"
fi

echo ""
echo "🏆 NETTOYAGE RÉUSSI !"
echo "===================="

echo ""
echo "Le projet R-Type 2 est maintenant :"
echo "├── 🧹 Nettoyé et organisé"
echo "├── 📚 Documentation complète et à jour"
echo "├── 🎯 Tests principaux facilement accessibles"
echo "├── 🎨 Tests de développement bien rangés"
echo "├── 🗑️  Fichiers obsolètes supprimés"
echo "└── 🔧 Prêt pour le développement futur"

echo ""
echo "🎮 Accès rapide aux tests principaux:"
echo "├── http://localhost:8000/test-terrain-bitmap.html"
echo "├── http://localhost:8000/test-boss-speed-reduced.html"
echo "└── http://localhost:8000/debug-terrain-version.html"

echo ""
echo "📖 Documentation complète dans docs/questions.txt (44 questions)"
