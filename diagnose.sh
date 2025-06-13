#!/bin/bash

# Script de diagnostic pour R-Type 2
# Usage: ./diagnose.sh

echo "🔍 Diagnostic R-Type 2..."
echo "=========================="

# Vérifier Python
echo ""
echo "🐍 Vérification de Python:"
if command -v python3 &> /dev/null; then
    echo "✅ Python3 installé: $(python3 --version)"
else
    echo "❌ Python3 non trouvé"
fi

# Vérifier les fichiers essentiels
echo ""
echo "📁 Vérification des fichiers:"
files=("index.html" "js/config.js" "js/main.js" "start.sh")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done

# Vérifier les permissions
echo ""
echo "🔐 Vérification des permissions:"
if [ -x "start.sh" ]; then
    echo "✅ start.sh exécutable"
else
    echo "❌ start.sh non exécutable"
    echo "💡 Solution: chmod +x start.sh"
fi

# Vérifier les ports
echo ""
echo "🌐 Vérification des ports:"
for port in 8000 8001 8080; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port utilisé par:"
        lsof -Pi :$port -sTCP:LISTEN | head -2
    else
        echo "✅ Port $port libre"
    fi
done

# Vérifier les processus Python
echo ""
echo "🔍 Processus Python HTTP:"
PYTHON_PROCS=$(pgrep -f "python.*http.server" 2>/dev/null)
if [ -z "$PYTHON_PROCS" ]; then
    echo "✅ Aucun serveur HTTP Python en cours"
else
    echo "⚠️  Serveurs HTTP Python actifs:"
    ps aux | grep "python.*http.server" | grep -v grep
fi

# Test de connectivité
echo ""
echo "🌐 Test de connectivité:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ | grep -q "200\|000"; then
    echo "⚠️  Un serveur répond déjà sur le port 8000"
else
    echo "✅ Port 8000 disponible pour le serveur"
fi

# Recommandations
echo ""
echo "💡 Recommandations:"
echo "   1. Si des serveurs sont actifs: ./stop.sh"
echo "   2. Pour démarrer proprement: ./start.sh"
echo "   3. Pour un autre port: ./start.sh 8001"
echo "   4. Pour les tests: http://localhost:8000/tests/test-runner.html"

echo ""
echo "🎯 Diagnostic terminé !"
