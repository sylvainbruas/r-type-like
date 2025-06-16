# R-Type 2 - AWS Deployment Makefile

# Default values
ENVIRONMENT ?= prod
REGION ?= us-east-1
PROJECT_NAME = rtype2-game

# Colors
BLUE = \033[0;34m
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m

.PHONY: help build deploy clean validate test-local

help: ## Show this help message
	@echo "$(BLUE)R-Type 2 - AWS Deployment Commands$(NC)"
	@echo "=================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(BLUE)Environment Variables:$(NC)"
	@echo "  ENVIRONMENT  - Deployment environment (dev/staging/prod) [default: prod]"
	@echo "  REGION       - AWS region [default: us-east-1]"
	@echo ""
	@echo "$(BLUE)Examples:$(NC)"
	@echo "  make build ENVIRONMENT=dev"
	@echo "  make deploy ENVIRONMENT=staging REGION=us-west-2"
	@echo "  make deploy-all"

build: ## Build the application for deployment
	@echo "$(BLUE)🔨 Building application for $(ENVIRONMENT)...$(NC)"
	./build.sh $(ENVIRONMENT)
	@echo "$(GREEN)✅ Build completed$(NC)"

validate: ## Validate CloudFormation templates
	@echo "$(BLUE)🔍 Validating CloudFormation templates...$(NC)"
	aws cloudformation validate-template --template-body file://main-stack.yaml --region $(REGION)
	aws cloudformation validate-template --template-body file://monitoring-stack.yaml --region $(REGION)
	@echo "$(GREEN)✅ Templates are valid$(NC)"

deploy: build ## Deploy to AWS (build + deploy)
	@echo "$(BLUE)🚀 Deploying to $(ENVIRONMENT) in $(REGION)...$(NC)"
	./deploy.sh $(ENVIRONMENT) $(REGION)
	@echo "$(GREEN)✅ Deployment completed$(NC)"

deploy-dev: ## Deploy to development environment
	@$(MAKE) deploy ENVIRONMENT=dev

deploy-staging: ## Deploy to staging environment
	@$(MAKE) deploy ENVIRONMENT=staging

deploy-prod: ## Deploy to production environment
	@$(MAKE) deploy ENVIRONMENT=prod

deploy-all: ## Deploy to all environments
	@echo "$(BLUE)🚀 Deploying to all environments...$(NC)"
	@$(MAKE) deploy-dev
	@$(MAKE) deploy-staging
	@$(MAKE) deploy-prod
	@echo "$(GREEN)✅ All deployments completed$(NC)"

clean: ## Clean build artifacts
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(NC)"
	rm -rf ../dist
	rm -f ../*.tar.gz
	@echo "$(GREEN)✅ Clean completed$(NC)"

test-local: ## Test the game locally
	@echo "$(BLUE)🧪 Starting local test server...$(NC)"
	cd .. && ./start.sh 8010

sync-only: ## Sync files to existing S3 bucket (no infrastructure changes)
	@echo "$(BLUE)📤 Syncing files to S3...$(NC)"
	@if [ ! -d "../dist" ]; then \
		echo "$(YELLOW)⚠️  Build directory not found. Running build first...$(NC)"; \
		$(MAKE) build; \
	fi
	@BUCKET_NAME=$$(aws cloudformation describe-stacks \
		--stack-name $(PROJECT_NAME)-$(ENVIRONMENT) \
		--region $(REGION) \
		--query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
		--output text 2>/dev/null || echo ""); \
	if [ -z "$$BUCKET_NAME" ]; then \
		echo "$(YELLOW)⚠️  Stack not found. Please deploy infrastructure first.$(NC)"; \
		exit 1; \
	fi; \
	echo "Syncing to bucket: $$BUCKET_NAME"; \
	aws s3 sync ../dist/ s3://$$BUCKET_NAME/ --delete --region $(REGION)
	@echo "$(GREEN)✅ Files synced$(NC)"

invalidate: ## Invalidate CloudFront cache
	@echo "$(BLUE)🔄 Invalidating CloudFront cache...$(NC)"
	@DISTRIBUTION_ID=$$(aws cloudformation describe-stacks \
		--stack-name $(PROJECT_NAME)-$(ENVIRONMENT) \
		--region $(REGION) \
		--query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
		--output text 2>/dev/null || echo ""); \
	if [ -z "$$DISTRIBUTION_ID" ]; then \
		echo "$(YELLOW)⚠️  Distribution not found. Please deploy infrastructure first.$(NC)"; \
		exit 1; \
	fi; \
	aws cloudfront create-invalidation --distribution-id $$DISTRIBUTION_ID --paths "/*"
	@echo "$(GREEN)✅ Cache invalidated$(NC)"

status: ## Show deployment status
	@echo "$(BLUE)📊 Deployment Status$(NC)"
	@echo "===================="
	@echo ""
	@echo "$(YELLOW)Stack Status:$(NC)"
	@aws cloudformation describe-stacks \
		--stack-name $(PROJECT_NAME)-$(ENVIRONMENT) \
		--region $(REGION) \
		--query 'Stacks[0].{Status:StackStatus,Created:CreationTime,Updated:LastUpdatedTime}' \
		--output table 2>/dev/null || echo "Stack not found"
	@echo ""
	@echo "$(YELLOW)Outputs:$(NC)"
	@aws cloudformation describe-stacks \
		--stack-name $(PROJECT_NAME)-$(ENVIRONMENT) \
		--region $(REGION) \
		--query 'Stacks[0].Outputs[*].{Key:OutputKey,Value:OutputValue}' \
		--output table 2>/dev/null || echo "No outputs available"

logs: ## View CloudWatch logs
	@echo "$(BLUE)📋 Recent CloudWatch Events$(NC)"
	@aws logs describe-log-groups \
		--log-group-name-prefix "/aws/cloudfront/$(PROJECT_NAME)" \
		--region $(REGION) \
		--query 'logGroups[*].logGroupName' \
		--output table 2>/dev/null || echo "No log groups found"

destroy: ## Destroy the deployment (WARNING: This will delete everything!)
	@echo "$(YELLOW)⚠️  WARNING: This will destroy the entire deployment!$(NC)"
	@echo "$(YELLOW)⚠️  All data will be permanently lost!$(NC)"
	@echo ""
	@read -p "Are you sure you want to continue? Type 'yes' to confirm: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo "$(BLUE)🗑️  Destroying deployment...$(NC)"; \
		aws cloudformation delete-stack --stack-name $(PROJECT_NAME)-$(ENVIRONMENT)-monitoring --region $(REGION) 2>/dev/null || true; \
		aws cloudformation delete-stack --stack-name $(PROJECT_NAME)-$(ENVIRONMENT) --region $(REGION) 2>/dev/null || true; \
		echo "$(GREEN)✅ Destruction initiated$(NC)"; \
	else \
		echo "$(GREEN)✅ Destruction cancelled$(NC)"; \
	fi

# Development helpers
dev-build: ## Quick development build
	@$(MAKE) build ENVIRONMENT=dev

dev-deploy: ## Quick development deployment
	@$(MAKE) deploy ENVIRONMENT=dev

dev-sync: ## Quick sync to development
	@$(MAKE) sync-only ENVIRONMENT=dev

# Monitoring
dashboard: ## Open CloudWatch dashboard
	@DASHBOARD_URL="https://console.aws.amazon.com/cloudwatch/home?region=$(REGION)#dashboards:name=$(PROJECT_NAME)-$(ENVIRONMENT)-dashboard"; \
	echo "$(BLUE)📊 Opening dashboard: $$DASHBOARD_URL$(NC)"; \
	open "$$DASHBOARD_URL" 2>/dev/null || echo "Please open: $$DASHBOARD_URL"

game: ## Open the deployed game
	@GAME_URL=$$(aws cloudformation describe-stacks \
		--stack-name $(PROJECT_NAME)-$(ENVIRONMENT) \
		--region $(REGION) \
		--query 'Stacks[0].Outputs[?OutputKey==`GameURL`].OutputValue' \
		--output text 2>/dev/null || echo ""); \
	if [ -n "$$GAME_URL" ]; then \
		echo "$(BLUE)🎮 Opening game: $$GAME_URL$(NC)"; \
		open "$$GAME_URL" 2>/dev/null || echo "Please open: $$GAME_URL"; \
	else \
		echo "$(YELLOW)⚠️  Game URL not found. Please deploy first.$(NC)"; \
	fi
