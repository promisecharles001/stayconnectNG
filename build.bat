@echo off
REM StayConnect NG - Build Script for Windows

setlocal enabledelayedexpansion

echo =========================================
echo StayConnect NG - Multi-Platform Build
echo =========================================
echo.

set "FRONTEND_DIR=frontend"
set "BUILD_OUTPUT_DIR=build-outputs"

REM Create output directory
if not exist "%BUILD_OUTPUT_DIR%" mkdir "%BUILD_OUTPUT_DIR%"

echo Frontend directory: %FRONTEND_DIR%
echo Build output directory: %BUILD_OUTPUT_DIR%
echo.

REM Check if we're in the correct directory
if not exist "%FRONTEND_DIR%\package.json" (
    echo Error: Frontend directory not found. Please run this script from the project root.
    exit /b 1
)

cd "%FRONTEND_DIR%"

echo Installing frontend dependencies...
call npm install

echo.
echo Building for Android...
echo Using EAS Build for Android APK...
echo.

REM Check if EAS is installed
where eas >nul 2>nul
if %errorlevel% equ 0 (
    echo Starting Android APK build on EAS...
    call eas build --platform android --profile preview
    echo Android build initiated!
    echo Check your EAS dashboard for build status and download links.
) else (
    echo EAS CLI not found. Installing globally...
    call npm install -g eas-cli
    call eas build --platform android --profile preview
)

echo.
echo For iOS build:
echo eas build --platform ios --profile production
echo (Requires Apple Developer account)
echo.

echo =========================================
echo Build process initiated!
echo =========================================
echo.
echo Download your APK at:
echo https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend
echo.
echo For development testing, use Expo Go:
echo npm start
echo.

cd ..
pause
