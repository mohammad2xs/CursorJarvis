#!/bin/bash

# CursorJarvis Chrome Extension Deployment Script

echo "🚀 Deploying CursorJarvis Chrome Extension..."

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this script from the chrome-extension directory."
    exit 1
fi

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p ../deploy/chrome-extension
rm -rf ../deploy/chrome-extension/*

# Copy extension files (excluding source control and docs)
echo "📋 Copying extension files..."
rsync -av --exclude='.git' --exclude='README.md' --exclude='deploy.sh' --exclude='USAGE_GUIDE.md' . ../deploy/chrome-extension/

# Create zip file
echo "📦 Creating extension package..."
cd ../deploy/chrome-extension
zip -r cursorjarvis-extension.zip . -x "*.DS_Store" "*.git*"

echo "✅ Extension packaged successfully!"
echo "📁 Location: ../deploy/chrome-extension/cursorjarvis-extension.zip"
echo ""
echo "To install:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select the chrome-extension folder"
echo "4. Or upload the zip file to Chrome Web Store"
