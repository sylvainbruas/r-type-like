#!/bin/bash

# Script de démarrage pour R-Type 2
# Usage: ./start.sh [port]

PORT=${1:-8000}

echo "🚀 Démarrage du serveur R-Type 2..."
echo "📁 Dossier: $(pwd)"
echo "🌐 Port: $PORT"
echo ""

# Vérifier si le port est déjà utilisé
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Le port $PORT est déjà utilisé"
    echo "🔍 Processus utilisant le port:"
    lsof -Pi :$PORT -sTCP:LISTEN
    echo ""
    echo "💡 Solutions:"
    echo "   1. Arrêter le processus: kill \$(lsof -ti:$PORT)"
    echo "   2. Utiliser un autre port: ./start.sh 8001"
    echo "   3. Arrêter tous les serveurs Python: pkill -f 'python.*http.server'"
    echo ""
    read -p "Voulez-vous arrêter le processus existant ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 Arrêt du processus existant..."
        kill $(lsof -ti:$PORT) 2>/dev/null || true
        sleep 2
    else
        echo "❌ Démarrage annulé"
        exit 1
    fi
fi

# Vérifier si un environnement virtuel existe
if [ -d "venv" ]; then
    echo "🐍 Activation de l'environnement virtuel..."
    source venv/bin/activate
    echo "✅ Environnement virtuel activé"
else
    echo "⚠️  Aucun environnement virtuel trouvé"
    echo "💡 Pour en créer un: python3 -m venv venv"
fi

echo ""
echo "🎮 Lancement du serveur HTTP..."
echo "🔗 Ouvrez votre navigateur sur: http://localhost:$PORT"
echo "📖 Tests disponibles sur: http://localhost:$PORT/tests/test-runner.html"
echo "🧪 Test ScoreManager: http://localhost:$PORT/test-scoremanager.html"
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"
echo ""

# Fonction de nettoyage à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt du serveur..."
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Lancer le serveur HTTP Python
python3 -m http.server $PORT
