# 🌊 Git Flow - Guide d'Utilisation R-Type 2

Ce document décrit l'utilisation de Git Flow pour le développement du projet R-Type 2.

## 📋 Configuration Git Flow

### Branches Principales
- **main** : Branche de production (releases stables)
- **develop** : Branche de développement (intégration continue)

### Branches de Support
- **feature/** : Nouvelles fonctionnalités
- **release/** : Préparation des releases
- **hotfix/** : Corrections urgentes en production
- **support/** : Maintenance long terme

## 🚀 Workflow de Développement

### 1. Développement de Fonctionnalités

#### Créer une nouvelle fonctionnalité
```bash
# Créer et basculer sur une branche feature
git flow feature start nom-fonctionnalite

# Développer la fonctionnalité
# ... commits de développement ...

# Terminer la fonctionnalité (merge dans develop)
git flow feature finish nom-fonctionnalite
```

#### Publier une fonctionnalité (collaboration)
```bash
# Publier la feature pour collaboration
git flow feature publish nom-fonctionnalite

# Récupérer une feature publiée
git flow feature pull origin nom-fonctionnalite
```

### 2. Préparation des Releases

#### Créer une release
```bash
# Créer une branche release
git flow release start v1.0.0

# Finaliser la release (merge dans main et develop)
git flow release finish v1.0.0
```

### 3. Corrections Urgentes (Hotfix)

#### Créer un hotfix
```bash
# Créer un hotfix depuis main
git flow hotfix start nom-hotfix

# Terminer le hotfix (merge dans main et develop)
git flow hotfix finish nom-hotfix
```

## 📊 État Actuel du Projet

### Branches Configurées
- ✅ **main** : Branche de production
- ✅ **develop** : Branche de développement (active)
- ✅ **origin/main** : Remote production
- ✅ **origin/develop** : Remote développement

### Historique de Migration
- **Avant Git Flow** : Développement direct sur main
- **Après Git Flow** : Développement sur develop, releases sur main
- **Migration** : Tous les commits préservés

## 🎯 Bonnes Pratiques

### Conventions de Nommage
```bash
# Features
feature/add-new-enemy-type
feature/improve-collision-system
feature/add-power-ups

# Releases
release/v1.1.0
release/v2.0.0-beta

# Hotfixes
hotfix/fix-bullet-collision
hotfix/memory-leak-fix
```

### Messages de Commit
```bash
# Features
feat: add new enemy missile sprite
fix: resolve bullet reference error
docs: update architecture documentation

# Releases
release: prepare v1.1.0 with new features
chore: bump version to v1.1.0

# Hotfixes
hotfix: fix critical collision bug
hotfix: resolve memory leak in particle system
```

## 🔄 Workflow Quotidien

### Démarrer une Nouvelle Fonctionnalité
1. S'assurer d'être sur develop : `git checkout develop`
2. Mettre à jour develop : `git pull origin develop`
3. Créer la feature : `git flow feature start ma-fonctionnalite`
4. Développer et commiter
5. Terminer la feature : `git flow feature finish ma-fonctionnalite`
6. Pousser develop : `git push origin develop`

### Préparer une Release
1. S'assurer que develop est stable
2. Créer la release : `git flow release start v1.x.x`
3. Finaliser la documentation et tests
4. Terminer la release : `git flow release finish v1.x.x`
5. Pousser main et develop : `git push origin main develop --tags`

## 📚 Commandes Utiles

### Vérification de l'État
```bash
# Voir toutes les branches
git branch -a

# Voir l'état Git Flow
git flow version

# Voir les features en cours
git flow feature list
```

### Synchronisation
```bash
# Mettre à jour develop
git checkout develop
git pull origin develop

# Mettre à jour main
git checkout main
git pull origin main
```

## 🎮 Spécificités R-Type 2

### Types de Features Typiques
- **Gameplay** : Nouvelles mécaniques de jeu
- **Assets** : Sprites, sons, effets visuels
- **Performance** : Optimisations et corrections
- **Documentation** : Guides et schémas techniques
- **Infrastructure** : Déploiement et monitoring

### Cycle de Release
1. **Develop** : Intégration continue des features
2. **Release** : Tests finaux et documentation
3. **Main** : Version stable déployable
4. **Hotfix** : Corrections urgentes si nécessaire

## ✅ Avantages Git Flow

### Organisation
- ✅ Séparation claire développement/production
- ✅ Historique propre et traçable
- ✅ Collaboration facilitée
- ✅ Releases contrôlées

### Qualité
- ✅ Tests sur develop avant merge main
- ✅ Isolation des fonctionnalités
- ✅ Rollback facilité
- ✅ Hotfixes sans perturber le développement

---

**Git Flow est maintenant configuré pour le projet R-Type 2. Tous les développements futurs se feront sur la branche `develop` !** 🌊🚀
