#!/bin/bash

# Script de démarrage pour R-Type 2
# Usage: ./start.sh [port]

PORT=${1:-8000}

echo "🚀 Démarrage du serveur R-Type 2..."
echo "📁 Dossier: $(pwd)"
echo "🌐 Port: $PORT"
echo ""

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
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"
echo ""

# Lancer le serveur HTTP Python
python3 -m http.server $PORT
