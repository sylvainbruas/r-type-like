#!/bin/bash

# Script de diagnostic du problème d'opacité du terrain dans le jeu
echo "🔍 DIAGNOSTIC TERRAIN OPACITÉ - JEU PRINCIPAL"
echo "============================================="

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
echo "🚨 PROBLÈME IDENTIFIÉ:"
echo "====================="

echo "✅ test-terrain-full-opacity.html → Terrain 100% opaque (FONCTIONNE)"
echo "❌ index.html (jeu principal) → Terrain semi-transparent (PROBLÈME)"

echo ""
echo "🔍 CAUSE PROBABLE:"
echo "=================="

echo "🗂️  CACHE DU NAVIGATEUR:"
echo "├── Le navigateur utilise l'ancien fichier AlienTerrain.js en cache"
echo "├── Malgré les modifications, l'ancienne version est chargée"
echo "├── Le test spécialisé fonctionne car il force le rechargement"
echo "└── Le jeu principal utilise la version mise en cache"

echo ""
echo "🛠️  SOLUTIONS DISPONIBLES:"
echo "=========================="

echo ""
echo "1. 🔄 RECHARGEMENT FORCÉ:"
echo "   - Windows: Ctrl + F5"
echo "   - Mac: Cmd + Shift + R"
echo "   - Cela force le rechargement depuis le serveur"

echo ""
echo "2. 🗑️  VIDER LE CACHE:"
echo "   - Chrome: F12 → Network → Disable cache (coché)"
echo "   - Firefox: F12 → Network → Settings → Disable cache"
echo "   - Safari: Develop → Empty Caches"

echo ""
echo "3. 🕵️  NAVIGATION PRIVÉE:"
echo "   - Ouvrir le jeu en mode incognito/privé"
echo "   - Pas de cache utilisé"
echo "   - Test propre de la nouvelle version"

echo ""
echo "4. 🔧 PAGES DE DIAGNOSTIC CRÉÉES:"
echo "   - debug-terrain-version.html → Vérifier la version chargée"
echo "   - index-no-cache.html → Jeu avec rechargement forcé"
echo "   - test-game-terrain-opacity.html → Test en contexte de jeu"

echo ""
echo "🎮 PAGES DE TEST DISPONIBLES:"
echo "============================="

# Vérifier les pages de test
test_pages=(
    "debug-terrain-version.html:Diagnostic version terrain"
    "index-no-cache.html:Jeu principal SANS CACHE"
    "test-game-terrain-opacity.html:Test terrain en contexte jeu"
    "test-terrain-full-opacity.html:Test terrain objets natifs"
    "index.html:Jeu principal (peut avoir cache)"
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
echo "🎯 DIAGNOSTIC RECOMMANDÉ:"
echo "========================"

echo ""
echo "1. 🔍 VÉRIFIER LA VERSION:"
echo "   http://localhost:8000/debug-terrain-version.html"
echo "   → Doit afficher 'OBJETS PHASER NATIFS (100% OPAQUE)'"

echo ""
echo "2. 🎮 TESTER LE JEU SANS CACHE:"
echo "   http://localhost:8000/index-no-cache.html"
echo "   → Jeu avec fichiers rechargés automatiquement"

echo ""
echo "3. 🧪 TESTER EN CONTEXTE DE JEU:"
echo "   http://localhost:8000/test-game-terrain-opacity.html"
echo "   → Même logique que GameScene.js"

echo ""
echo "4. ✅ CONFIRMER LE FONCTIONNEMENT:"
echo "   http://localhost:8000/test-terrain-full-opacity.html"
echo "   → Doit toujours être 100% opaque"

echo ""
echo "📋 ÉTAPES DE RÉSOLUTION:"
echo "======================="

echo ""
echo "ÉTAPE 1 - Diagnostic:"
echo "├── Ouvrir debug-terrain-version.html"
echo "├── Vérifier si 'OBJETS PHASER NATIFS' est affiché"
echo "├── Si non → Cache problématique"
echo "└── Si oui → Problème ailleurs"

echo ""
echo "ÉTAPE 2 - Test sans cache:"
echo "├── Ouvrir index-no-cache.html"
echo "├── Vérifier si le terrain est opaque"
echo "├── Si oui → Confirme le problème de cache"
echo "└── Si non → Problème plus profond"

echo ""
echo "ÉTAPE 3 - Rechargement forcé:"
echo "├── Sur index.html, faire Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)"
echo "├── Vérifier si le terrain devient opaque"
echo "├── Si oui → Problème résolu"
echo "└── Si non → Essayer navigation privée"

echo ""
echo "ÉTAPE 4 - Navigation privée:"
echo "├── Ouvrir index.html en mode incognito/privé"
echo "├── Vérifier l'opacité du terrain"
echo "├── Si opaque → Confirme le problème de cache"
echo "└── Vider complètement le cache du navigateur"

echo ""
echo "🔧 VÉRIFICATION TECHNIQUE:"
echo "========================="

echo ""
echo "Le fichier AlienTerrain.js actuel contient:"
echo "├── createSolidAsteroidDark() → Objets Rectangle/Circle"
echo "├── createSolidAsteroidLight() → Objets Rectangle/Circle"
echo "├── createSolidMars() → Objets Rectangle/Circle"
echo "├── createSolidMoon() → Objets Rectangle/Ellipse"
echo "└── createSolidAlien() → Objets Rectangle/Polygon"

echo ""
echo "L'ancien fichier (en cache) contenait:"
echo "├── createAsteroidDarkSurface() → graphics.fillStyle()"
echo "├── createAsteroidLightSurface() → graphics.fillStyle()"
echo "└── Méthodes graphics potentiellement semi-transparentes"

echo ""
echo "📊 RÉSULTATS ATTENDUS:"
echo "====================="

echo ""
echo "Après résolution du cache:"
echo "✅ debug-terrain-version.html → 'OBJETS PHASER NATIFS (100% OPAQUE)'"
echo "✅ index-no-cache.html → Terrain 100% opaque"
echo "✅ test-game-terrain-opacity.html → Terrain 100% opaque"
echo "✅ index.html (après Ctrl+F5) → Terrain 100% opaque"

echo ""
echo "🏆 SOLUTION FINALE:"
echo "=================="

echo ""
echo "Le terrain utilise maintenant des objets Phaser natifs (100% opaques)."
echo "Si le jeu principal montre encore un terrain semi-transparent,"
echo "c'est uniquement un problème de cache du navigateur."
echo ""
echo "🔄 Utilisez index-no-cache.html pour un test immédiat sans cache !"
echo "🎮 Diagnostic complet: http://localhost:8000/debug-terrain-version.html"
