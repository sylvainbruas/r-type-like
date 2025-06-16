#!/bin/bash

# R-Type 2 - Automated Deployment Script for AWS
# Deploys the game to S3 + CloudFront using CloudFormation

set -e

# Configuration
PROJECT_NAME="rtype2-game"
ENVIRONMENT="${1:-prod}"
AWS_REGION="${2:-us-east-1}"
DOMAIN_NAME="${3:-}"
CERTIFICATE_ARN="${4:-}"
ALERT_EMAIL="${5:-admin@example.com}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 R-Type 2 - AWS Deployment Script${NC}"
echo -e "${BLUE}====================================${NC}"
echo -e "Project: ${YELLOW}${PROJECT_NAME}${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Region: ${YELLOW}${AWS_REGION}${NC}"
if [ -n "$DOMAIN_NAME" ]; then
    echo -e "Domain: ${YELLOW}${DOMAIN_NAME}${NC}"
fi
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI not found. Please install AWS CLI."
    fi
    print_status "AWS CLI found"
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Run 'aws configure'."
    fi
    print_status "AWS credentials configured"
    
    # Check if build directory exists
    if [ ! -d "dist" ]; then
        print_warning "Build directory not found. Running build script..."
        ./cloudformation/build.sh "$ENVIRONMENT"
    fi
    print_status "Build directory ready"
    
    echo ""
}

# Deploy CloudFormation stack
deploy_infrastructure() {
    echo -e "${BLUE}🏗️ Deploying infrastructure...${NC}"
    
    STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}"
    
    # Prepare parameters
    PARAMETERS="ParameterKey=ProjectName,ParameterValue=${PROJECT_NAME}"
    PARAMETERS="${PARAMETERS} ParameterKey=Environment,ParameterValue=${ENVIRONMENT}"
    
    if [ -n "$DOMAIN_NAME" ]; then
        PARAMETERS="${PARAMETERS} ParameterKey=DomainName,ParameterValue=${DOMAIN_NAME}"
    fi
    
    if [ -n "$CERTIFICATE_ARN" ]; then
        PARAMETERS="${PARAMETERS} ParameterKey=CertificateArn,ParameterValue=${CERTIFICATE_ARN}"
    fi
    
    # Deploy main stack
    echo -e "${YELLOW}Deploying main infrastructure stack...${NC}"
    aws cloudformation deploy \
        --template-file cloudformation/main-stack.yaml \
        --stack-name "$STACK_NAME" \
        --parameter-overrides $PARAMETERS \
        --capabilities CAPABILITY_IAM \
        --region "$AWS_REGION" \
        --no-fail-on-empty-changeset
    
    print_status "Main infrastructure deployed"
    
    # Get stack outputs
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
        --output text)
    
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    GAME_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`GameURL`].OutputValue' \
        --output text)
    
    echo -e "Bucket: ${YELLOW}${BUCKET_NAME}${NC}"
    echo -e "Distribution ID: ${YELLOW}${DISTRIBUTION_ID}${NC}"
    echo -e "Game URL: ${YELLOW}${GAME_URL}${NC}"
    echo ""
}

# Deploy monitoring stack
deploy_monitoring() {
    echo -e "${BLUE}📊 Deploying monitoring...${NC}"
    
    MONITORING_STACK_NAME="${PROJECT_NAME}-${ENVIRONMENT}-monitoring"
    
    # Deploy monitoring stack
    aws cloudformation deploy \
        --template-file cloudformation/monitoring-stack.yaml \
        --stack-name "$MONITORING_STACK_NAME" \
        --parameter-overrides \
            ParameterKey=ProjectName,ParameterValue="${PROJECT_NAME}" \
            ParameterKey=Environment,ParameterValue="${ENVIRONMENT}" \
            ParameterKey=AlertEmail,ParameterValue="${ALERT_EMAIL}" \
            ParameterKey=CloudFrontDistributionId,ParameterValue="${DISTRIBUTION_ID}" \
        --capabilities CAPABILITY_IAM \
        --region "$AWS_REGION" \
        --no-fail-on-empty-changeset
    
    print_status "Monitoring stack deployed"
    echo ""
}

# Upload files to S3
upload_files() {
    echo -e "${BLUE}📤 Uploading files to S3...${NC}"
    
    # Sync files with appropriate cache headers
    echo -e "${YELLOW}Uploading HTML files...${NC}"
    aws s3 sync dist/ s3://"$BUCKET_NAME"/ \
        --exclude "*" \
        --include "*.html" \
        --cache-control "max-age=300" \
        --region "$AWS_REGION"
    
    echo -e "${YELLOW}Uploading JavaScript files...${NC}"
    aws s3 sync dist/ s3://"$BUCKET_NAME"/ \
        --exclude "*" \
        --include "js/*" \
        --cache-control "max-age=86400" \
        --region "$AWS_REGION"
    
    echo -e "${YELLOW}Uploading assets...${NC}"
    aws s3 sync dist/ s3://"$BUCKET_NAME"/ \
        --exclude "*" \
        --include "assets/*" \
        --cache-control "max-age=2592000" \
        --region "$AWS_REGION"
    
    echo -e "${YELLOW}Uploading remaining files...${NC}"
    aws s3 sync dist/ s3://"$BUCKET_NAME"/ \
        --exclude "*.html" \
        --exclude "js/*" \
        --exclude "assets/*" \
        --cache-control "max-age=86400" \
        --region "$AWS_REGION"
    
    print_status "Files uploaded to S3"
    echo ""
}

# Invalidate CloudFront cache
invalidate_cache() {
    echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    echo -e "Invalidation ID: ${YELLOW}${INVALIDATION_ID}${NC}"
    print_status "Cache invalidation initiated"
    echo ""
}

# Run health check
health_check() {
    echo -e "${BLUE}🏥 Running health check...${NC}"
    
    # Wait a moment for deployment to propagate
    echo -e "${YELLOW}Waiting for deployment to propagate...${NC}"
    sleep 10
    
    # Check if the game loads
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$GAME_URL" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        print_status "Health check passed - Game is accessible"
    else
        print_warning "Health check failed - HTTP Status: $HTTP_STATUS"
        echo -e "${YELLOW}Note: It may take a few minutes for CloudFront to fully propagate${NC}"
    fi
    
    echo ""
}

# Display deployment summary
display_summary() {
    echo -e "${BLUE}📋 Deployment Summary${NC}"
    echo -e "${BLUE}=====================${NC}"
    echo -e "Project: ${YELLOW}${PROJECT_NAME}${NC}"
    echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
    echo -e "Region: ${YELLOW}${AWS_REGION}${NC}"
    echo -e "S3 Bucket: ${YELLOW}${BUCKET_NAME}${NC}"
    echo -e "CloudFront Distribution: ${YELLOW}${DISTRIBUTION_ID}${NC}"
    echo -e "Game URL: ${YELLOW}${GAME_URL}${NC}"
    echo ""
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "View CloudWatch Dashboard:"
    echo -e "${YELLOW}aws cloudwatch get-dashboard --dashboard-name ${PROJECT_NAME}-${ENVIRONMENT}-dashboard --region ${AWS_REGION}${NC}"
    echo ""
    echo -e "Check CloudFront distribution status:"
    echo -e "${YELLOW}aws cloudfront get-distribution --id ${DISTRIBUTION_ID}${NC}"
    echo ""
    echo -e "View S3 bucket contents:"
    echo -e "${YELLOW}aws s3 ls s3://${BUCKET_NAME}/ --recursive${NC}"
    echo ""
}

# Show usage
show_usage() {
    echo "Usage: $0 [environment] [region] [domain] [certificate-arn] [alert-email]"
    echo ""
    echo "Parameters:"
    echo "  environment     - Deployment environment (dev/staging/prod) [default: prod]"
    echo "  region         - AWS region [default: us-east-1]"
    echo "  domain         - Custom domain name (optional)"
    echo "  certificate-arn - SSL certificate ARN (optional, required if domain specified)"
    echo "  alert-email    - Email for alerts [default: admin@example.com]"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy to prod in us-east-1"
    echo "  $0 staging us-west-2                 # Deploy to staging in us-west-2"
    echo "  $0 prod us-east-1 game.example.com arn:aws:acm:... admin@example.com"
    echo ""
}

# Main execution
main() {
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        show_usage
        exit 0
    fi
    
    check_prerequisites
    deploy_infrastructure
    deploy_monitoring
    upload_files
    invalidate_cache
    health_check
    display_summary
}

# Run main function
main
