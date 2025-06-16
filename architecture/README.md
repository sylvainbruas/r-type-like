# 🏗️ Architecture R-Type 2 - Schémas Techniques

Ce répertoire contient les schémas d'architecture logicielle du jeu R-Type 2 au format draw.io.

## 📋 Liste des Schémas

### 1. **01-architecture-generale.drawio**
- **Description** : Vue d'ensemble de l'architecture en couches
- **Contenu** :
  - Couche Présentation (HTML/CSS, Phaser.js, Assets)
  - Couche Logique Métier (Scènes, Entités, Gestionnaires)
  - Couche Données (LocalStorage, Config, Tests)
  - Relations et flux de données

### 2. **02-scenes-navigation.drawio**
- **Description** : Flux des scènes et système de navigation
- **Contenu** :
  - PreloadScene → MenuScene → GameScene → GameOverScene
  - États de GameScene (Playing, Paused, Boss Fight, Level Complete)
  - Données partagées entre scènes
  - Contrôles et performance

### 3. **03-entites-relations.drawio**
- **Description** : Entités du jeu et leurs relations
- **Contenu** :
  - Player, Enemy, Boss, Bullet, AlienTerrain
  - Propriétés et méthodes de chaque entité
  - Relations de tir et collisions
  - Groupes Phaser et matrice des collisions
  - Système de sprites et cycle de mise à jour

### 4. **04-gestion-assets.drawio**
- **Description** : Système de gestion des assets et textures
- **Contenu** :
  - Flux de chargement PreloadScene
  - Structure des assets (SVG + Fallbacks)
  - Logique de sélection des sprites
  - États de chargement et gestion d'erreurs
  - Système de debug et optimisations

### 5. **05-systeme-tests.drawio**
- **Description** : Architecture des tests et qualité
- **Contenu** :
  - Test runner principal (182 tests)
  - Catégories : Unitaires, Intégration, Gameplay, Infrastructure
  - Tests visuels (DeLorean, couleurs, terrain)
  - Métriques qualité et pipeline CI/CD
  - Outils et bonnes pratiques

### 6. **06-architecture-aws.drawio**
- **Description** : Architecture AWS complète déployée
- **Contenu** :
  - Infrastructure S3 + CloudFront + Route 53
  - Origin Access Control et sécurité
  - Monitoring CloudWatch et alertes SNS
  - Optimisation des coûts (~$1.20/mois)
  - Couches de cache et performance
  - Multi-environnements (dev/staging/prod)

### 7. **07-processus-build.drawio**
- **Description** : Processus de build et optimisation des assets
- **Contenu** :
  - Pipeline de build automatisé (build.sh)
  - Minification JavaScript (-30% taille)
  - Optimisation SVG (-20% taille)
  - Génération de métadonnées build
  - Différences par environnement
  - Validation et statistiques

### 8. **08-pipeline-cicd.drawio**
- **Description** : Pipeline CI/CD et déploiement automatisé
- **Contenu** :
  - Flux complet : Build → Test → Quality → Deploy
  - Intégration GitHub Actions et GitLab CI
  - Déploiement multi-environnements
  - Monitoring et notifications
  - Stratégies de rollback
  - Métriques et KPIs

### 9. **09-architecture-aws-icons.drawio**
- **Description** : Architecture AWS avec icônes officielles AWS
- **Contenu** :
  - Icônes AWS officielles (S3, CloudFront, Route 53, etc.)
  - Flux de données colorés et légendés
  - Informations détaillées sur coûts et sécurité
  - Métriques de performance et monitoring
  - Multi-environnements avec configurations
  - Représentation professionnelle pour présentations

## 🛠️ Utilisation des Schémas

### **Ouverture avec draw.io**
1. Allez sur [app.diagrams.net](https://app.diagrams.net)
2. Cliquez sur "Open Existing Diagram"
3. Sélectionnez le fichier `.drawio` souhaité
4. Le schéma s'ouvre avec tous les éléments interactifs

### **Intégration dans la Documentation**
```bash
# Export en PNG/SVG depuis draw.io
File → Export as → PNG/SVG

# Intégration dans README
![Architecture](architecture/01-architecture-generale.png)
```

### **Modification et Maintenance**
- **Format** : XML draw.io natif
- **Éditable** : Oui, avec draw.io
- **Versionné** : Oui, avec Git
- **Collaboratif** : Oui, partage de fichiers

## 🎯 Objectifs des Schémas

### **Documentation Technique**
- ✅ **Compréhension** : Vue claire de l'architecture
- ✅ **Maintenance** : Guide pour les modifications
- ✅ **Onboarding** : Formation des nouveaux développeurs
- ✅ **Communication** : Partage avec les parties prenantes

### **Aide au Développement**
- ✅ **Planification** : Roadmap technique
- ✅ **Debugging** : Identification des problèmes
- ✅ **Refactoring** : Optimisations ciblées
- ✅ **Testing** : Couverture complète

### **Assurance Qualité**
- ✅ **Standards** : Respect des bonnes pratiques
- ✅ **Cohérence** : Architecture uniforme
- ✅ **Évolutivité** : Préparation aux extensions
- ✅ **Performance** : Optimisations identifiées

## 📊 Métriques d'Architecture

### **Complexité**
- **Couches** : 3 (Présentation, Métier, Données)
- **Modules** : 15+ (Scènes, Entités, Gestionnaires)
- **Relations** : ~30 interactions principales
- **Infrastructure** : AWS complète (S3, CloudFront, CloudWatch)
- **Pipeline** : CI/CD automatisé avec 4 stages
- **Dépendances** : Minimales et bien définies

### **Qualité**
- **Séparation** : Responsabilités claires
- **Couplage** : Faible entre modules
- **Cohésion** : Forte dans chaque module
- **Extensibilité** : Architecture modulaire
- **Déployabilité** : Infrastructure as Code
- **Observabilité** : Monitoring intégré

### **Performance**
- **Chargement** : Assets optimisés (-25% taille moyenne)
- **Exécution** : 60 FPS target
- **Mémoire** : Gestion automatique
- **Réseau** : CDN global CloudFront
- **Cache** : Multi-niveaux (Edge + Browser)
- **Coût** : ~$1.20/mois optimisé

## 🔄 Mise à Jour des Schémas

### **Quand Mettre à Jour**
- ✅ Ajout de nouvelles fonctionnalités
- ✅ Modification de l'architecture
- ✅ Refactoring important
- ✅ Correction de bugs architecturaux

### **Processus de Mise à Jour**
1. **Identifier** les changements architecturaux
2. **Modifier** le schéma correspondant
3. **Valider** la cohérence avec le code
4. **Commiter** avec un message descriptif
5. **Documenter** les changements majeurs

### **Versionning**
```bash
# Commit des modifications de schémas
git add architecture/
git commit -m "docs: Update architecture diagrams for new terrain system"
```

## 🎨 Conventions Visuelles

### **Couleurs par Type**
- 🔴 **Rouge** : Présentation/UI
- 🟢 **Vert** : Entités/Gameplay
- 🟡 **Jaune** : Gestionnaires/Utilitaires
- 🟣 **Violet** : Données/Persistance
- 🔵 **Bleu** : Tests/Qualité

### **Formes par Fonction**
- **Rectangle** : Modules/Classes
- **Losange** : Décisions/Conditions
- **Cercle** : États/Statuts
- **Flèche** : Relations/Flux

### **Styles par Importance**
- **Gras** : Éléments principaux
- **Normal** : Éléments secondaires
- **Pointillé** : Relations optionnelles
- **Épais** : Flux critiques

## 📚 Ressources Complémentaires

### **Documentation Technique**
- [README.md](../README.md) : Documentation principale
- [tests/README.md](../tests/README.md) : Documentation des tests
- [SETUP.md](../SETUP.md) : Guide d'installation

### **Outils Recommandés**
- **draw.io** : Édition des schémas
- **VS Code** : Développement
- **Git** : Versionning
- **Browser DevTools** : Debug

### **Standards de Référence**
- **Clean Architecture** : Séparation des couches
- **SOLID Principles** : Design patterns
- **Game Development Patterns** : Spécifique aux jeux
- **Web Standards** : HTML5/ES6+

---

*Ces schémas constituent la documentation technique de référence pour le projet R-Type 2. Ils sont maintenus à jour avec l'évolution du code et servent de guide pour le développement et la maintenance.*
