#!/bin/bash
# StayConnect NG - Build Script for All Platforms

set -e

echo "========================================="
echo "StayConnect NG - Multi-Platform Build"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FRONTEND_DIR="./frontend"
BUILD_OUTPUT_DIR="./build-outputs"

# Create output directory
mkdir -p "$BUILD_OUTPUT_DIR"

echo -e "${BLUE}Frontend directory: $FRONTEND_DIR${NC}"
echo -e "${BLUE}Build output directory: $BUILD_OUTPUT_DIR${NC}"
echo ""

# Check if we're in the correct directory
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "Error: Frontend directory not found. Please run this script from the project root."
    exit 1
fi

cd "$FRONTEND_DIR"

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install

echo ""
echo -e "${YELLOW}Building for Android...${NC}"
echo "Using EAS Build for Android APK..."
echo ""

# Try to build Android
if command -v eas &> /dev/null; then
    echo -e "${BLUE}Starting Android APK build on EAS...${NC}"
    eas build --platform android --profile preview
    echo -e "${GREEN}Android build initiated!${NC}"
    echo "Check your EAS dashboard for build status and download links."
else
    echo -e "${YELLOW}EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
    eas build --platform android --profile preview
fi

echo ""
echo -e "${YELLOW}For iOS build:${NC}"
echo "eas build --platform ios --profile production"
echo "(Requires Apple Developer account)"
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Build process initiated!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "📱 Download your APK:"
echo "   Check: https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend"
echo ""
echo "📚 For development testing, use Expo Go:"
echo "   npm start"
echo ""
