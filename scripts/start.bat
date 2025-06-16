@echo off
REM Script de démarrage pour R-Type 2 (Windows)
REM Usage: start.bat [port]

set PORT=%1
if "%PORT%"=="" set PORT=8000

echo 🚀 Démarrage du serveur R-Type 2...
echo 📁 Dossier: %CD%
echo 🌐 Port: %PORT%
echo.

REM Vérifier si un environnement virtuel existe
if exist "venv\" (
    echo 🐍 Activation de l'environnement virtuel...
    call venv\Scripts\activate
    echo ✅ Environnement virtuel activé
) else (
    echo ⚠️  Aucun environnement virtuel trouvé
    echo 💡 Pour en créer un: python -m venv venv
)

echo.
echo 🎮 Lancement du serveur HTTP...
echo 🔗 Ouvrez votre navigateur sur: http://localhost:%PORT%
echo ⏹️  Appuyez sur Ctrl+C pour arrêter
echo.

REM Lancer le serveur HTTP Python
python -m http.server %PORT%
