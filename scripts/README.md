# 🛠️ Scripts Utilitaires R-Type 2

Ce répertoire contient les scripts utilitaires pour le développement local du jeu R-Type 2.

## 📋 Scripts Disponibles

### **start.sh** (macOS/Linux)
Démarre un serveur HTTP local pour tester le jeu.

```bash
# Démarrage sur port par défaut (8000)
./start.sh

# Démarrage sur port personnalisé
./start.sh 8001

# Avec détection automatique des conflits de port
```

**Fonctionnalités :**
- ✅ Détection des conflits de port
- ✅ Gestion automatique des processus existants
- ✅ Support environnement virtuel Python
- ✅ Messages colorés et informatifs

### **start.bat** (Windows)
Version Windows du script de démarrage.

```batch
start.bat
```

### **stop.sh** (macOS/Linux)
Arrête tous les serveurs HTTP Python en cours d'exécution.

```bash
./stop.sh
```

**Fonctionnalités :**
- ✅ Arrêt automatique de tous les serveurs Python
- ✅ Vérification des ports couramment utilisés
- ✅ Nettoyage complet des processus

### **diagnose.sh** (macOS/Linux)
Diagnostic complet de l'environnement de développement.

```bash
./diagnose.sh
```

**Vérifications :**
- ✅ Version Python disponible
- ✅ Fichiers du projet présents
- ✅ Permissions d'exécution
- ✅ Ports utilisés
- ✅ Processus actifs
- ✅ Recommandations personnalisées

## 🚀 Utilisation Rapide

### Démarrage Standard
```bash
cd scripts
./start.sh
# Ouvrir http://localhost:8000
```

### Résolution de Problèmes
```bash
cd scripts
./diagnose.sh  # Identifier les problèmes
./stop.sh      # Arrêter les serveurs
./start.sh     # Redémarrer proprement
```

### Développement Multi-Port
```bash
cd scripts
./start.sh 8000  # Version principale
./start.sh 8001  # Version de test
./start.sh 8002  # Version expérimentale
```

## 🔧 Configuration

### Variables d'Environnement
```bash
# Port par défaut
export DEFAULT_PORT=8000

# Mode debug
export DEBUG=1

# Mode verbose
export VERBOSE=1
```

### Personnalisation
Les scripts peuvent être modifiés pour s'adapter à votre environnement :
- Changer le port par défaut
- Ajouter des vérifications spécifiques
- Personnaliser les messages

## 🐛 Dépannage

### Problèmes Courants

#### Port déjà utilisé
```bash
./diagnose.sh  # Identifier le processus
./stop.sh      # Arrêter tous les serveurs
./start.sh     # Redémarrer
```

#### Permissions manquantes
```bash
chmod +x *.sh  # Rendre les scripts exécutables
```

#### Python non trouvé
```bash
# Installer Python 3
brew install python3  # macOS
sudo apt install python3  # Ubuntu
```

## 📚 Intégration

### Avec l'IDE
Ajoutez ces scripts comme tâches dans votre IDE :
- **VS Code** : `.vscode/tasks.json`
- **WebStorm** : Run Configurations
- **Sublime** : Build Systems

### Avec Git Hooks
```bash
# Pre-commit hook
#!/bin/sh
cd scripts && ./diagnose.sh
```

### Avec Make
```makefile
start:
	cd scripts && ./start.sh

stop:
	cd scripts && ./stop.sh

diagnose:
	cd scripts && ./diagnose.sh
```

## 🔄 Maintenance

### Mise à Jour des Scripts
1. Modifier le script nécessaire
2. Tester avec `./diagnose.sh`
3. Commiter les changements
4. Documenter les modifications

### Ajout de Nouveaux Scripts
1. Créer le script dans ce répertoire
2. Rendre exécutable : `chmod +x script.sh`
3. Ajouter la documentation ici
4. Tester avec différents environnements

---

*Ces scripts facilitent le développement local du jeu R-Type 2. Ils sont maintenus et testés régulièrement.*
