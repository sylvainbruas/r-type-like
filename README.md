# R-Type 2 - Remake

Un remake moderne du célèbre jeu de shoot'em up R-Type 2, jouable directement dans le navigateur.

## Description

Ce projet recrée l'expérience du jeu R-Type 2 de Super Nintendo avec des fonctionnalités modernes et des effets visuels améliorés. Le jeu utilise Phaser.js pour des performances optimales et une compatibilité maximale avec les navigateurs modernes.

## Fonctionnalités

### Gameplay
- **5 niveaux uniques** avec environnements variés (Espace, Astéroïdes, Nébuleuse, Station, Cœur Alien)
- **5 boss épiques** avec patterns d'attaque uniques et phases multiples
- **Système de points** avec multiplicateurs et combos
- **3 types d'ennemis** : Basic, Fast, Heavy avec IA et patterns de mouvement
- **Système de vies** avec invulnérabilité temporaire après dégât
- **Décors aliens interactifs** : Terrain extraterrestre avec collisions mortelles
- **Cadence de tir équilibrée** : Ennemis tirent toutes les 5 secondes

### Effets Visuels
- Effets de particules pour explosions et traînées de projectiles
- Fond étoilé animé avec parallaxe
- Barres de vie des boss avec changement de couleur
- Animations de dégâts et d'invulnérabilité
- Interface utilisateur en temps réel

### Système de Progression
- Difficulté progressive sur 5 niveaux
- Sauvegarde automatique des high scores
- Statistiques de fin de partie (précision, ennemis détruits)

## Installation

Aucune installation requise ! Le jeu fonctionne directement dans le navigateur.

### Installation Rapide

1. Clonez le repository :
```bash
git clone [url-du-repo]
cd Rtype
```

2. **Option A** - Ouverture directe :
   - Ouvrez `index.html` dans votre navigateur web moderne

3. **Option B** - Serveur local (recommandé) :
```bash
# Méthode simple
python3 -m http.server 8000

# Ou utilisez les scripts fournis
cd scripts
./start.sh        # macOS/Linux (port 8000 par défaut)
./start.sh 8001   # macOS/Linux (port personnalisé)
start.bat         # Windows

# Scripts utilitaires
./stop.sh         # Arrêter tous les serveurs
./diagnose.sh     # Diagnostic des problèmes

# Puis ouvrez http://localhost:8000
```

### Installation avec Environnement Virtuel Python

Pour un environnement de développement plus propre :

```bash
# 1. Créer l'environnement virtuel
python3 -m venv venv

# 2. Activer l'environnement
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate     # Windows

# 3. Lancer le serveur
python -m http.server 8000

# 4. Ouvrir http://localhost:8000
```

### Autres Options de Serveur

```bash
# Avec Node.js (si installé)
npx http-server -p 8000

# Avec PHP (si installé)
php -S localhost:8000
```

📖 **Pour plus de détails sur la configuration, consultez [docs/SETUP.md](docs/SETUP.md)**

## Déploiement AWS

Le projet inclut une infrastructure complète pour déployer le jeu sur AWS avec S3 + CloudFront :

- **Infrastructure as Code** : Templates CloudFormation
- **CDN Global** : CloudFront avec cache optimisé
- **Monitoring** : CloudWatch avec alertes automatiques
- **Build Optimisé** : Minification JS/CSS, optimisation SVG
- **Déploiement Automatisé** : Scripts et Makefile

🚀 **Pour déployer sur AWS, consultez [cloudformation/README.md](cloudformation/README.md)**

## Contrôles

- **Flèches directionnelles** : Déplacement du vaisseau
- **Espace** : Tirer
- **Entrée** : Commencer une partie (menu principal)
- **M** : Retour au menu (écran Game Over)

## Architecture

Le projet utilise une architecture modulaire avec séparation claire des responsabilités :

- **Scènes** : Gestion des différents états du jeu
- **Entités** : Classes pour les objets du jeu (joueur, ennemis, projectiles)
- **Managers** : Gestion des systèmes (scores, niveaux)

📐 **Pour les schémas d'architecture détaillés, consultez [architecture/README.md](architecture/README.md)**

### Évolution du Projet

Le développement du jeu R-Type 2 s'est déroulé en **8 phases distinctes** à travers **29 questions documentées** :

1. **Fondations** (Q1-5) : Structure de base, Phaser.js, scènes principales
2. **Gameplay Core** (Q6-12) : Progression, vies, persistance, statistiques
3. **Assets & Visuals** (Q13-18) : Sprites, terrain alien, tests visuels
4. **Combat System** (Q19-22) : Tir des ennemis, cadence, groupes
5. **Testing & Quality** (Q23-25) : 182 tests automatisés, validation
6. **Architecture & Docs** (Q26-27) : 11 schémas, documentation complète
7. **AWS & Deployment** (Q28) : Infrastructure cloud, monitoring
8. **Production Ready** (Q29) : Corrections finales, console propre

📈 **Voir le schéma complet d'évolution : [11-evolution-projet.drawio](architecture/11-evolution-projet.drawio)**

### Diagrammes AWS Disponibles

Le projet inclut plusieurs diagrammes AWS pour différents usages :

- **06-architecture-aws.drawio** : Vue d'ensemble simple (multi-environnements)
- **09-architecture-aws-icons.drawio** : Version avec icônes (si compatible)
- **10-aws-production-icons.drawio** : **Production avec icônes AWS officielles** ✅
  - Icônes AWS natifs (Route 53, CloudFront, S3, CloudWatch, SNS)
  - Métriques production : 95%+ cache hit, <1% erreur
  - Coûts détaillés : $1.67/mois
  - Sécurité renforcée : WAF, CloudTrail, compliance
  - **Testé et fonctionnel dans draw.io**
- **11-evolution-projet.drawio** : **Historique complet du développement** 📈
  - 8 phases de développement (29 questions)
  - Timeline visuelle des fonctionnalités
  - Métriques finales et technologies utilisées
  - Perspectives d'évolution futures

## Structure du Projet

```
Rtype/
├── index.html              # Point d'entrée HTML
├── js/
│   ├── config.js          # Configuration du jeu
│   ├── main.js            # Point d'entrée JavaScript
│   ├── scenes/            # Scènes du jeu
│   │   ├── MenuScene.js   # Menu principal
│   │   ├── GameScene.js   # Jeu principal
│   │   └── GameOverScene.js # Écran de fin
│   ├── entities/          # Entités du jeu
│   │   ├── Player.js      # Vaisseau du joueur
│   │   ├── Enemy.js       # Ennemis
│   │   ├── Boss.js        # Boss
│   │   ├── Bullet.js      # Projectiles
│   │   └── AlienTerrain.js # Décors de planète alien
│   └── managers/          # Gestionnaires
│       ├── ScoreManager.js # Gestion des scores
│       └── LevelManager.js # Gestion des niveaux
├── tests/                 # Suite de tests complète
│   ├── test-runner.html   # Interface de test
│   ├── *.test.js         # Fichiers de tests
│   └── README.md         # Documentation des tests
├── visual-tests/          # Tests visuels des assets
│   ├── test-delorean.html # Test sprite DeLorean
│   ├── test-enemy-colors.html # Test couleurs ennemis
│   ├── test-alien-terrain.html # Test terrain alien
│   └── README.md         # Documentation tests visuels
├── assets/                # Ressources
│   └── images/           # Images et sprites
│       ├── player.svg    # DeLorean 8-bit (vaisseau joueur)
│       ├── enemy1.svg    # Intercepteur Rouge (ennemi type 1)
│       ├── enemy2.svg    # Croiseur Violet (ennemi type 2)
│       ├── enemy3.svg    # Chasseur Vert (ennemi type 3)
│       ├── enemy.svg     # Ennemi fallback (procédural)
│       └── bullet.svg    # Sprites des projectiles
├── scripts/               # Scripts utilitaires
│   ├── start.sh          # Serveur local (macOS/Linux)
│   ├── start.bat         # Serveur local (Windows)
│   ├── stop.sh           # Arrêt serveurs
│   ├── diagnose.sh       # Diagnostic environnement
│   └── README.md         # Documentation scripts
├── docs/                  # Documentation
│   ├── SETUP.md          # Guide d'installation
│   ├── TEST-REPORT.md    # Rapport de tests
│   ├── questions.txt     # Suivi du développement
│   └── README.md         # Index documentation
├── architecture/          # Schémas d'architecture
│   ├── README.md         # Documentation des schémas
│   ├── 01-architecture-generale.drawio
│   ├── 02-scenes-navigation.drawio
│   ├── 03-entites-relations.drawio
│   ├── 04-gestion-assets.drawio
│   ├── 05-systeme-tests.drawio
│   ├── 06-architecture-aws.drawio
│   ├── 07-processus-build.drawio
│   ├── 08-pipeline-cicd.drawio
│   ├── 09-architecture-aws-icons.drawio
│   ├── 10-aws-production-icons.drawio
│   └── 11-evolution-projet.drawio
├── cloudformation/        # Déploiement AWS
│   ├── README.md         # Documentation déploiement
│   ├── main-stack.yaml   # Infrastructure S3 + CloudFront
│   ├── monitoring-stack.yaml # Monitoring CloudWatch
│   ├── build.sh          # Script d'optimisation assets
│   ├── deploy.sh         # Script de déploiement automatisé
│   ├── Makefile          # Commandes simplifiées
│   └── parameters.json   # Paramètres par environnement
└── README.md
```

## Boss et Niveaux

1. **Niveau 1 - Secteur Spatial** : Serpent Mécanique
2. **Niveau 2 - Champ d'Astéroïdes** : Croiseur Lourd  
3. **Niveau 3 - Nébuleuse Toxique** : Station Orbitale
4. **Niveau 4 - Station Ennemie** : Dreadnought
5. **Niveau 5 - Cœur Alien** : Core Alien (Boss Final)

## Technologies Utilisées

- **Phaser.js 3.70.0** - Framework de jeu HTML5
- **HTML5 Canvas** - Rendu graphique
- **JavaScript ES6+** - Logique du jeu
- **LocalStorage** - Sauvegarde des high scores
- **CSS3** - Interface utilisateur

## Développement

Le projet utilise une architecture modulaire avec séparation claire des responsabilités :

- **Scènes** : Gestion des différents états du jeu
- **Entités** : Classes pour les objets du jeu (joueur, ennemis, projectiles)
- **Managers** : Gestion des systèmes (scores, niveaux)

### Tests

Le projet inclut une suite de tests complète pour garantir la qualité du code :

```bash
# Lancer les tests via l'interface web
# Ouvrez tests/test-runner.html dans votre navigateur

# Ou via serveur local
python3 -m http.server 8000
# Puis naviguez vers http://localhost:8000/tests/test-runner.html
```

**Couverture des tests :**
- ✅ Configuration du jeu (10 tests)
- ✅ Gestionnaire de scores (15 tests)  
- ✅ Gestionnaire de niveaux (18 tests)
- ✅ Progression de niveau (10 tests)
- ✅ Système de vies du joueur (10 tests)
- ✅ Persistance des données (10 tests)
- ✅ Statistiques de jeu (12 tests)
- ✅ Logique générale (15 tests)
- ✅ Mécanique des projectiles (8 tests)
- ✅ Mouvement des boss (12 tests)
- ✅ Groupes d'ennemis (12 tests)
- **Total : 132 tests**

📖 **Pour plus de détails sur les tests, consultez [tests/README.md](tests/README.md)**

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Licence

À définir.
