# Guide de Configuration - R-Type 2

Ce guide vous explique comment configurer l'environnement de développement pour le jeu R-Type 2.

## Configuration avec Python et Virtualenv

### Prérequis
- Python 3.6 ou supérieur installé sur votre système
- pip (gestionnaire de paquets Python)

### Installation et Configuration

#### 1. Vérifier l'installation de Python
```bash
python3 --version
# ou
python --version
```

#### 2. Installer virtualenv (si pas déjà installé)
```bash
# Avec pip
pip install virtualenv

# Ou avec pip3
pip3 install virtualenv

# Alternative avec le module venv intégré (Python 3.3+)
# Aucune installation nécessaire
```

#### 3. Créer un environnement virtuel
```bash
# Avec virtualenv
virtualenv venv

# Ou avec le module venv intégré (recommandé)
python3 -m venv venv

# Ou spécifier une version Python spécifique
python3 -m venv --python=python3.9 venv
```

#### 4. Activer l'environnement virtuel

**Sur macOS/Linux :**
```bash
source venv/bin/activate
```

**Sur Windows :**
```bash
# Command Prompt
venv\Scripts\activate

# PowerShell
venv\Scripts\Activate.ps1
```

#### 5. Vérifier l'activation
Une fois activé, votre prompt devrait afficher `(venv)` au début :
```bash
(venv) $ python --version
```

#### 6. Installer les dépendances (optionnel)
```bash
# Si vous avez un fichier requirements.txt
pip install -r requirements.txt

# Pour ce projet, aucune dépendance Python n'est requise
# Le serveur HTTP est intégré à Python
```

### Lancer le Serveur de Développement

#### Avec l'environnement virtuel activé :
```bash
# Python 3
python -m http.server 8000

# Python 2 (déprécié)
python -m SimpleHTTPServer 8000
```

#### Accéder au jeu :
Ouvrez votre navigateur et allez à : `http://localhost:8000`

### Désactiver l'environnement virtuel
```bash
deactivate
```

## Alternatives sans Virtualenv

### Serveur HTTP Python direct
```bash
# Depuis le dossier du projet
python3 -m http.server 8000
```

### Avec Node.js (si installé)
```bash
# Installer http-server globalement
npm install -g http-server

# Lancer le serveur
http-server -p 8000
```

### Avec PHP (si installé)
```bash
php -S localhost:8000
```

## Structure du Projet avec Virtualenv

```
Rtype/
├── venv/                   # Environnement virtuel (à ignorer dans git)
├── index.html
├── js/
├── assets/
├── README.md
├── SETUP.md               # Ce fichier
├── .gitignore             # Ignorer venv/
└── requirements.txt       # Dépendances Python (optionnel)
```

## Bonnes Pratiques

### 1. Fichier .gitignore
Ajoutez ces lignes à votre `.gitignore` :
```
# Environnements virtuels Python
venv/
env/
ENV/
.venv/
.env/

# Fichiers Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
```

### 2. Fichier requirements.txt (optionnel)
Si vous ajoutez des dépendances Python :
```
# Générer le fichier
pip freeze > requirements.txt

# Installer depuis le fichier
pip install -r requirements.txt
```

### 3. Scripts de développement
Créez des scripts pour automatiser :

**start.sh** (macOS/Linux) :
```bash
#!/bin/bash
source venv/bin/activate
python -m http.server 8000
```

**start.bat** (Windows) :
```batch
@echo off
call venv\Scripts\activate
python -m http.server 8000
```

## Dépannage

### Problème : "python: command not found"
- Vérifiez que Python est installé
- Essayez `python3` au lieu de `python`
- Sur Windows, ajoutez Python au PATH

### Problème : "virtualenv: command not found"
```bash
# Installer virtualenv
pip install virtualenv
# ou
pip3 install virtualenv
```

### Problème : Permission refusée sur le port 8000
```bash
# Utilisez un autre port
python -m http.server 8080
```

### Problème : Le jeu ne se charge pas
- Vérifiez que vous êtes dans le bon dossier
- Assurez-vous que `index.html` existe
- Vérifiez la console du navigateur pour les erreurs

## Développement Avancé

### Hot Reload avec Python
Pour un rechargement automatique pendant le développement :
```bash
pip install watchdog
# Puis utilisez un script de surveillance personnalisé
```

### HTTPS Local (pour certaines fonctionnalités web)
```bash
# Générer un certificat auto-signé
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Serveur HTTPS Python
python -m http.server 8000 --bind 127.0.0.1 --directory . --cgi
```

---

**Note :** Pour ce projet R-Type 2, un environnement virtuel Python n'est pas strictement nécessaire car le jeu est entièrement côté client (HTML/CSS/JavaScript). Cependant, il est utile pour servir les fichiers localement et éviter les problèmes CORS.
