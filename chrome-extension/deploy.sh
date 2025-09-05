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

# Copy extension files
echo "📋 Copying extension files..."
cp -r . ../deploy/chrome-extension/

# Remove unnecessary files
echo "🧹 Cleaning up deployment files..."
cd ../deploy/chrome-extension
rm -f README.md
rm -f deploy.sh
rm -rf .git

# Create zip file
echo "📦 Creating extension package..."
zip -r cursorjarvis-extension.zip . -x "*.DS_Store" "*.git*" "deploy.sh" "README.md"

echo "✅ Extension packaged successfully!"
echo "📁 Location: ../deploy/chrome-extension/cursorjarvis-extension.zip"
echo ""
echo "To install:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select the chrome-extension folder"
echo "4. Or upload the zip file to Chrome Web Store"
update zip file
