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

1. Clonez le repository :
```bash
git clone [url-du-repo]
cd Rtype
```

2. Ouvrez `index.html` dans votre navigateur web moderne

Ou utilisez un serveur local pour de meilleures performances :
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si http-server est installé)
npx http-server

# Puis ouvrez http://localhost:8000
```

## Contrôles

- **Flèches directionnelles** : Déplacement du vaisseau
- **Espace** : Tirer
- **Entrée** : Commencer une partie (menu principal)
- **R** : Rejouer (écran Game Over)
- **M** : Retour au menu (écran Game Over)

## Architecture du Projet

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
│   │   └── Bullet.js      # Projectiles
│   └── managers/          # Gestionnaires
│       ├── ScoreManager.js # Gestion des scores
│       └── LevelManager.js # Gestion des niveaux
├── assets/                # Ressources (images, sons)
├── README.md
└── questions.txt          # Suivi du développement
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

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Licence

À définir.
