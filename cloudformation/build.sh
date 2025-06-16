#!/bin/bash

# R-Type 2 - Build Script for AWS Deployment
# Optimizes assets and prepares for S3/CloudFront deployment

set -e

# Configuration
PROJECT_NAME="rtype2-game"
BUILD_DIR="dist"
SOURCE_DIR="."
ENVIRONMENT="${1:-prod}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 R-Type 2 - Build Script${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Build Directory: ${YELLOW}${BUILD_DIR}${NC}"
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
}

# Check dependencies
check_dependencies() {
    echo -e "${BLUE}🔍 Checking dependencies...${NC}"
    
    # Check if Node.js is available for minification
    if command -v node &> /dev/null; then
        print_status "Node.js found"
        NODE_AVAILABLE=true
    else
        print_warning "Node.js not found - skipping JS minification"
        NODE_AVAILABLE=false
    fi
    
    # Check if Python is available for SVG optimization
    if command -v python3 &> /dev/null; then
        print_status "Python3 found"
        PYTHON_AVAILABLE=true
    else
        print_warning "Python3 not found - skipping SVG optimization"
        PYTHON_AVAILABLE=false
    fi
    
    echo ""
}

# Clean and create build directory
setup_build_dir() {
    echo -e "${BLUE}📁 Setting up build directory...${NC}"
    
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        print_status "Cleaned existing build directory"
    fi
    
    mkdir -p "$BUILD_DIR"
    print_status "Created build directory: $BUILD_DIR"
    echo ""
}

# Copy base files
copy_base_files() {
    echo -e "${BLUE}📋 Copying base files...${NC}"
    
    # Copy HTML files
    cp index.html "$BUILD_DIR/"
    print_status "Copied index.html"
    
    # Copy test files (optional for production)
    if [ "$ENVIRONMENT" != "prod" ]; then
        cp test-*.html "$BUILD_DIR/" 2>/dev/null || true
        print_status "Copied test files"
    fi
    
    echo ""
}

# Process JavaScript files
process_javascript() {
    echo -e "${BLUE}⚙️ Processing JavaScript files...${NC}"
    
    # Create JS directory structure
    mkdir -p "$BUILD_DIR/js/scenes"
    mkdir -p "$BUILD_DIR/js/entities"
    mkdir -p "$BUILD_DIR/js/managers"
    
    # Copy JS files
    cp -r js/* "$BUILD_DIR/js/"
    print_status "Copied JavaScript files"
    
    # Minify JS files if Node.js is available
    if [ "$NODE_AVAILABLE" = true ]; then
        echo -e "${YELLOW}🔧 Minifying JavaScript files...${NC}"
        
        # Create a simple minification script
        cat > /tmp/minify.js << 'EOF'
const fs = require('fs');
const path = require('path');

function minifyJS(content) {
    // Simple minification: remove comments and extra whitespace
    return content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
        .replace(/\/\/.*$/gm, '') // Remove // comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/;\s*}/g, ';}') // Remove space before closing brace
        .replace(/{\s*/g, '{') // Remove space after opening brace
        .replace(/}\s*/g, '}') // Remove space after closing brace
        .trim();
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const minified = minifyJS(content);
            fs.writeFileSync(filePath, minified);
            console.log(`Minified: ${filePath}`);
        }
    });
}

const buildDir = process.argv[2];
processDirectory(path.join(buildDir, 'js'));
EOF
        
        node /tmp/minify.js "$BUILD_DIR"
        rm /tmp/minify.js
        print_status "JavaScript files minified"
    fi
    
    echo ""
}

# Process CSS files (if any)
process_css() {
    echo -e "${BLUE}🎨 Processing CSS files...${NC}"
    
    # Check if there are CSS files
    if ls *.css 1> /dev/null 2>&1; then
        cp *.css "$BUILD_DIR/"
        print_status "Copied CSS files"
    else
        print_status "No CSS files found"
    fi
    
    echo ""
}

# Process assets
process_assets() {
    echo -e "${BLUE}🖼️ Processing assets...${NC}"
    
    # Create assets directory
    mkdir -p "$BUILD_DIR/assets/images"
    
    # Copy assets
    cp -r assets/* "$BUILD_DIR/assets/"
    print_status "Copied asset files"
    
    # Optimize SVG files if Python is available
    if [ "$PYTHON_AVAILABLE" = true ]; then
        echo -e "${YELLOW}🔧 Optimizing SVG files...${NC}"
        
        # Create SVG optimization script
        cat > /tmp/optimize_svg.py << 'EOF'
import os
import re
import sys

def optimize_svg(content):
    # Remove comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    # Remove unnecessary whitespace
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r'>\s+<', '><', content)
    
    # Remove unnecessary attributes
    content = re.sub(r'\s*xmlns:xlink="[^"]*"', '', content)
    content = re.sub(r'\s*xml:space="preserve"', '', content)
    
    return content.strip()

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.svg'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    optimized = optimize_svg(content)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(optimized)
                    
                    print(f"Optimized: {file_path}")
                except Exception as e:
                    print(f"Error optimizing {file_path}: {e}")

if __name__ == "__main__":
    build_dir = sys.argv[1]
    process_directory(os.path.join(build_dir, 'assets'))
EOF
        
        python3 /tmp/optimize_svg.py "$BUILD_DIR"
        rm /tmp/optimize_svg.py
        print_status "SVG files optimized"
    fi
    
    echo ""
}

# Copy documentation (for non-prod environments)
copy_documentation() {
    if [ "$ENVIRONMENT" != "prod" ]; then
        echo -e "${BLUE}📚 Copying documentation...${NC}"
        
        # Copy documentation files
        mkdir -p "$BUILD_DIR/tests"
        mkdir -p "$BUILD_DIR/architecture"
        
        cp -r tests/* "$BUILD_DIR/tests/" 2>/dev/null || true
        cp -r architecture/* "$BUILD_DIR/architecture/" 2>/dev/null || true
        cp README.md "$BUILD_DIR/" 2>/dev/null || true
        
        print_status "Documentation copied"
        echo ""
    fi
}

# Generate build info
generate_build_info() {
    echo -e "${BLUE}ℹ️ Generating build information...${NC}"
    
    # Create build info file
    cat > "$BUILD_DIR/build-info.json" << EOF
{
    "project": "$PROJECT_NAME",
    "environment": "$ENVIRONMENT",
    "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "buildVersion": "$(date +%Y%m%d%H%M%S)",
    "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "gitBranch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
}
EOF
    
    print_status "Build information generated"
    echo ""
}

# Create deployment package
create_deployment_package() {
    echo -e "${BLUE}📦 Creating deployment package...${NC}"
    
    # Create a tarball for easy deployment
    tar -czf "${PROJECT_NAME}-${ENVIRONMENT}-$(date +%Y%m%d%H%M%S).tar.gz" -C "$BUILD_DIR" .
    
    print_status "Deployment package created"
    echo ""
}

# Display build summary
display_summary() {
    echo -e "${BLUE}📊 Build Summary${NC}"
    echo -e "${BLUE}=================${NC}"
    
    # Calculate build size
    BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
    
    echo -e "Build Directory: ${YELLOW}$BUILD_DIR${NC}"
    echo -e "Total Size: ${YELLOW}$BUILD_SIZE${NC}"
    echo -e "File Count: ${YELLOW}$FILE_COUNT${NC}"
    echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
    echo ""
    
    echo -e "${GREEN}🎉 Build completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "1. Deploy CloudFormation stack: ${YELLOW}aws cloudformation deploy --template-file cloudformation/main-stack.yaml --stack-name $PROJECT_NAME-$ENVIRONMENT${NC}"
    echo -e "2. Sync files to S3: ${YELLOW}aws s3 sync $BUILD_DIR/ s3://\$BUCKET_NAME/${NC}"
    echo -e "3. Invalidate CloudFront: ${YELLOW}aws cloudfront create-invalidation --distribution-id \$DISTRIBUTION_ID --paths '/*'${NC}"
    echo ""
}

# Main execution
main() {
    check_dependencies
    setup_build_dir
    copy_base_files
    process_javascript
    process_css
    process_assets
    copy_documentation
    generate_build_info
    create_deployment_package
    display_summary
}

# Run main function
main
