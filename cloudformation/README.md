# 🚀 R-Type 2 - AWS Deployment

Ce répertoire contient tous les templates et scripts nécessaires pour déployer le jeu R-Type 2 sur AWS en utilisant S3 + CloudFront.

## 📋 Architecture

### **Infrastructure AWS**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │────│       S3         │────│   Monitoring    │
│   Distribution  │    │     Bucket       │    │  (CloudWatch)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
    ┌─────────┐              ┌─────────┐              ┌─────────┐
    │  Cache  │              │  Game   │              │ Alerts  │
    │ Global  │              │ Assets  │              │   SNS   │
    └─────────┘              └─────────┘              └─────────┘
```

### **Composants**
- **S3 Bucket** : Stockage des fichiers statiques du jeu
- **CloudFront** : CDN global avec cache optimisé
- **Origin Access Control** : Sécurité d'accès S3
- **CloudWatch** : Monitoring et métriques
- **SNS** : Alertes par email

## 📁 Structure des Fichiers

```
cloudformation/
├── main-stack.yaml          # Infrastructure principale (S3 + CloudFront)
├── monitoring-stack.yaml    # Monitoring et alertes
├── parameters.json          # Paramètres par environnement
├── build.sh                 # Script d'optimisation des assets
├── deploy.sh                # Script de déploiement automatisé
├── Makefile                 # Commandes simplifiées
└── README.md               # Cette documentation
```

## 🚀 Déploiement Rapide

### **Méthode 1 : Script Automatisé**
```bash
# Déploiement simple en production
./deploy.sh

# Déploiement avec paramètres personnalisés
./deploy.sh staging us-west-2 staging-rtype.example.com arn:aws:acm:... admin@example.com
```

### **Méthode 2 : Makefile**
```bash
# Voir toutes les commandes disponibles
make help

# Déploiement rapide
make deploy ENVIRONMENT=prod

# Déploiement par environnement
make deploy-dev
make deploy-staging
make deploy-prod

# Déploiement complet (tous les environnements)
make deploy-all
```

### **Méthode 3 : Commandes AWS CLI**
```bash
# 1. Build des assets
./build.sh prod

# 2. Déploiement infrastructure
aws cloudformation deploy \
  --template-file main-stack.yaml \
  --stack-name rtype2-game-prod \
  --parameter-overrides \
    ProjectName=rtype2-game \
    Environment=prod \
  --capabilities CAPABILITY_IAM

# 3. Upload des fichiers
aws s3 sync dist/ s3://BUCKET_NAME/

# 4. Invalidation du cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

## ⚙️ Configuration

### **Paramètres Principaux**
| Paramètre | Description | Défaut |
|-----------|-------------|---------|
| `ProjectName` | Nom du projet | `rtype2-game` |
| `Environment` | Environnement (dev/staging/prod) | `prod` |
| `DomainName` | Domaine personnalisé (optionnel) | - |
| `CertificateArn` | Certificat SSL ARN (optionnel) | - |
| `AlertEmail` | Email pour les alertes | `admin@example.com` |

### **Environnements Supportés**
- **dev** : Développement avec tous les fichiers de test
- **staging** : Pré-production avec monitoring complet
- **prod** : Production optimisée sans fichiers de test

## 🔧 Scripts de Build

### **build.sh**
Optimise les assets avant déploiement :
- ✅ **Minification JavaScript** : Suppression commentaires et espaces
- ✅ **Optimisation SVG** : Réduction taille des sprites
- ✅ **Compression** : Préparation pour gzip CloudFront
- ✅ **Build info** : Métadonnées de version et commit Git
- ✅ **Package déploiement** : Archive tar.gz

```bash
# Build pour production (optimisé)
./build.sh prod

# Build pour développement (avec tests)
./build.sh dev

# Build avec debug
DEBUG=1 ./build.sh staging
```

### **Optimisations Appliquées**
```javascript
// JavaScript minifié
function minifyJS(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Supprime /* */ commentaires
        .replace(/\/\/.*$/gm, '')         // Supprime // commentaires
        .replace(/\s+/g, ' ')             // Espaces multiples → simple
        .trim();
}
```

```python
# SVG optimisé
def optimize_svg(content):
    content = re.sub(r'<!--.*?-->', '', content)  # Supprime commentaires
    content = re.sub(r'\s+', ' ', content)        # Espaces multiples
    content = re.sub(r'>\s+<', '><', content)     # Espaces entre balises
    return content.strip()
```

## 📊 Monitoring

### **Métriques CloudWatch**
- **Requests** : Nombre de requêtes CloudFront
- **BytesDownloaded** : Données téléchargées
- **4xxErrorRate** : Taux d'erreurs client
- **5xxErrorRate** : Taux d'erreurs serveur
- **CacheHitRate** : Taux de succès du cache

### **Alertes Configurées**
- **Taux d'erreur élevé** : > 10% pendant 10 minutes
- **Cache hit rate faible** : < 80% pendant 45 minutes
- **Notifications** : Email SNS automatique

### **Dashboard CloudWatch**
```bash
# Ouvrir le dashboard
make dashboard ENVIRONMENT=prod

# Ou directement
aws cloudwatch get-dashboard \
  --dashboard-name rtype2-game-prod-dashboard
```

## 🔒 Sécurité

### **Bonnes Pratiques Implémentées**
- ✅ **Origin Access Control** : Accès S3 sécurisé
- ✅ **HTTPS Only** : Redirection automatique
- ✅ **Security Headers** : Protection XSS, CSRF
- ✅ **Bucket Policy** : Accès restreint à CloudFront
- ✅ **Encryption** : Chiffrement S3 AES-256
- ✅ **Versioning** : Historique des fichiers S3

### **Headers de Sécurité**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
```

## 💰 Optimisation des Coûts

### **Stratégies Implémentées**
- **PriceClass_100** : CDN limité à NA/Europe (coût réduit)
- **Cache optimisé** : Réduction des requêtes origine
- **Compression** : Réduction bande passante
- **Lifecycle S3** : Suppression versions anciennes (30j)

### **Estimation des Coûts (mensuel)**
| Service | Usage Estimé | Coût Approx. |
|---------|--------------|--------------|
| S3 Storage | 100 MB | $0.02 |
| CloudFront | 10 GB transfer | $0.85 |
| CloudWatch | Métriques standard | $0.30 |
| **Total** | | **~$1.20/mois** |

## 🛠️ Commandes Utiles

### **Gestion du Déploiement**
```bash
# Status du déploiement
make status ENVIRONMENT=prod

# Synchronisation rapide (sans infrastructure)
make sync-only ENVIRONMENT=prod

# Invalidation cache uniquement
make invalidate ENVIRONMENT=prod

# Ouvrir le jeu déployé
make game ENVIRONMENT=prod
```

### **Debug et Maintenance**
```bash
# Logs CloudWatch
make logs ENVIRONMENT=prod

# Validation templates
make validate

# Nettoyage build
make clean

# Test local
make test-local
```

### **Gestion Multi-Environnements**
```bash
# Déploiement séquentiel
make deploy-dev && make deploy-staging && make deploy-prod

# Status tous environnements
for env in dev staging prod; do
  echo "=== $env ==="
  make status ENVIRONMENT=$env
done
```

## 🚨 Dépannage

### **Problèmes Courants**

#### **1. Erreur de Certificat SSL**
```bash
# Vérifier le certificat
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN

# Le certificat doit être en us-east-1 pour CloudFront
aws acm list-certificates --region us-east-1
```

#### **2. Erreur d'Accès S3**
```bash
# Vérifier la policy du bucket
aws s3api get-bucket-policy --bucket BUCKET_NAME

# Vérifier l'OAC CloudFront
aws cloudfront get-origin-access-control --id OAC_ID
```

#### **3. Cache CloudFront Persistant**
```bash
# Invalidation forcée
aws cloudfront create-invalidation \
  --distribution-id DIST_ID \
  --paths "/*"

# Vérifier le status
aws cloudfront get-invalidation \
  --distribution-id DIST_ID \
  --id INVALIDATION_ID
```

#### **4. Build qui Échoue**
```bash
# Debug du build
DEBUG=1 ./build.sh dev

# Vérifier les dépendances
node --version
python3 --version
aws --version
```

### **Logs de Debug**
```bash
# Activer les logs détaillés
export DEBUG=1
export VERBOSE=1

# Puis relancer le déploiement
./deploy.sh prod
```

## 🔄 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Deploy R-Type 2
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy
        run: |
          cd cloudformation
          make deploy ENVIRONMENT=prod
```

### **GitLab CI Example**
```yaml
deploy:
  stage: deploy
  image: amazon/aws-cli:latest
  script:
    - cd cloudformation
    - make deploy ENVIRONMENT=prod
  only:
    - main
```

## 📚 Ressources

### **Documentation AWS**
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html)
- [CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/)

### **Outils Recommandés**
- [AWS CLI](https://aws.amazon.com/cli/) - Interface en ligne de commande
- [AWS Console](https://console.aws.amazon.com/) - Interface web
- [CloudFormation Designer](https://console.aws.amazon.com/cloudformation/designer) - Éditeur visuel

### **Support**
- 📧 **Issues** : Créer une issue GitHub
- 📖 **Documentation** : Consulter ce README
- 🔧 **Debug** : Utiliser `make help` pour les commandes

---

*Ce système de déploiement garantit une infrastructure AWS robuste, sécurisée et optimisée pour le jeu R-Type 2.* 🚀🎮✨
