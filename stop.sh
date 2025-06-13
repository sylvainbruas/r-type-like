#!/bin/bash

# Script d'arrêt pour R-Type 2
# Usage: ./stop.sh

echo "🛑 Arrêt des serveurs R-Type 2..."

# Arrêter tous les serveurs HTTP Python
echo "🔍 Recherche des serveurs HTTP Python..."
PIDS=$(pgrep -f "python.*http.server" 2>/dev/null)

if [ -z "$PIDS" ]; then
    echo "✅ Aucun serveur HTTP Python en cours d'exécution"
else
    echo "🛑 Arrêt des serveurs (PIDs: $PIDS)..."
    pkill -f "python.*http.server"
    sleep 2
    
    # Vérifier si les processus sont bien arrêtés
    REMAINING=$(pgrep -f "python.*http.server" 2>/dev/null)
    if [ -z "$REMAINING" ]; then
        echo "✅ Tous les serveurs ont été arrêtés"
    else
        echo "⚠️  Certains serveurs résistent, arrêt forcé..."
        pkill -9 -f "python.*http.server"
        echo "✅ Arrêt forcé terminé"
    fi
fi

# Vérifier les ports couramment utilisés
echo ""
echo "🔍 Vérification des ports..."
for port in 8000 8001 8080 3000; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port encore utilisé:"
        lsof -Pi :$port -sTCP:LISTEN
    else
        echo "✅ Port $port libre"
    fi
done

echo ""
echo "🎯 Nettoyage terminé !"
echo "💡 Vous pouvez maintenant relancer: ./start.sh"
