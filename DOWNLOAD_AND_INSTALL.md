# 📱 StayConnect NG - How to Download & Install App

## Quick Start

Your **StayConnect NG** app is ready to use! Choose your preferred method below:

---

## 🚀 Method 1: Instant Testing (Recommended for Testing)

### Using Expo Go (No Installation Required)

**For Android & iOS Users:**

1. **Download Expo Go:**
   - 📱 iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - 🤖 Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server:**
   ```bash
   cd "StayConnect Backend/stayconnect-ng-backend/frontend"
   npm start
   ```

3. **Scan the QR code** that appears in your terminal with the Expo Go app

4. **App launches immediately!** ✅

---

## 📦 Method 2: Download APK for Android (Standalone)

### Option A: Download Pre-built APK (Coming Soon)

We're building your APK on Expo's servers. Here's how to get it:

1. **Check the EAS Dashboard:**
   - Go to: https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend/builds
   - Look for completed Android builds
   - Click "Download" to get the APK

2. **Install on Android:**
   - Enable "Unknown Sources" in Settings > Security
   - Open the downloaded APK file
   - Follow the installation prompts
   - Launch "StayConnect" app ✅

### Option B: Build Your Own APK

**Step 1: Install EAS CLI**
```bash
npm install -g eas-cli
```

**Step 2: Run the build script (Windows)**
```bash
cd "C:\Users\Promisetheking\Downloads\StayConnect Backend"
build.bat
```

**Or on Mac/Linux:**
```bash
bash build.sh
```

**Step 3: Wait for build to complete**
- Build time: ~5-10 minutes
- Check progress at: https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend

**Step 4: Download and install**
- Click the download link in your terminal
- Install the APK on your Android device

---

## 🍎 Method 3: Download for iOS

### Requirements:
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- Testflight access

### Steps:

**1. Build for iOS:**
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
eas build --platform ios --profile production
```

**2. Configure Apple Developer Account:**
- You'll be prompted during build
- Authenticate with your Apple ID
- Two-factor authentication required

**3. Download the IPA file:**
- Check EAS dashboard for build status
- Click download when ready
- Use Xcode or Testflight to install

**4. Alternate: Use Testflight (Recommended)**
- Build via EAS
- Register testers via Apple Developer Portal
- Send Testflight invites
- Users download from Testflight app

---

## 💻 System Requirements

### For Running on Device:

**Android:**
- Android 6.0 or higher
- 100 MB free storage
- Internet connection
- Microphone (for voice calls)

**iOS:**
- iOS 13 or higher
- 100 MB free storage
- Internet connection
- Microphone (for voice calls)

### For Building:

**Windows/Mac/Linux:**
- Node.js 18 or higher
- npm or yarn
- EAS CLI installed globally
- Git (for version control)

---

## 🔗 Important Links

### Your Project Dashboard:
- **EAS Builds:** https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api/v1/docs

### Download Links:
- **Android APK:** Check EAS dashboard
- **iOS IPA:** Check EAS dashboard
- **Expo Go:** https://expo.io

---

## 🧪 First Time Setup

### 1. Make sure backend is running:
```bash
cd "StayConnect Backend/stayconnect-ng-backend"
npm run start:dev
```

### 2. Start the development server:
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
npm start
```

### 3. Connect to the app:
- **Expo Go method:** Scan QR code
- **Android Emulator:** Press `a`
- **iOS Simulator:** Press `i`
- **Web:** Press `w`

### 4. Test the features:
- Register a new account
- Login
- Browse properties
- Make bookings
- Use voice calling

---

## ⚙️ Configuration Files

### Key Settings:

**Backend (.env):**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/stayconnect_ng
JWT_SECRET=your-secret-key
PORT=3000
```

**Frontend (app.json):**
```json
{
  "expo": {
    "name": "StayConnect",
    "package": "ng.stayconnect.app",
    "version": "1.0.0"
  }
}
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
- Verify backend is running: http://localhost:3000
- Check your WiFi connection
- Update API endpoint in config if needed
- Restart both backend and frontend

### Issue: "QR code won't scan"
**Solution:**
- Make sure device and computer are on same WiFi
- Try opening the link manually from terminal
- Restart Expo Go app
- Run `npm start` again

### Issue: "APK download is slow"
**Solution:**
- EAS builds take 5-15 minutes
- Wait for "Build successful" message
- Check your internet connection
- Download on stable connection

### Issue: "Installation fails on Android"
**Solution:**
- Enable "Unknown Sources" in Settings
- Uninstall any previous version first
- Ensure 100 MB free storage
- Try a different Android device

### Issue: "iOS build fails"
**Solution:**
- Verify Apple Developer Account is active
- Check Two-Factor Authentication is enabled
- Ensure certificate is valid
- Try building with latest Xcode

---

## 📊 Build Status

### Current Status:
✅ Backend: Running
✅ Frontend: Built & Ready
✅ Database: Connected
⏳ Android APK: Building...
⏳ iOS IPA: Ready for build

### Recent Builds:
- Last Android: March 14, 2026
- Last iOS: Pending
- Last Test: March 14, 2026

---

## 🚀 Going Live

When ready for production:

1. **Update version in app.json**
   ```json
   "version": "1.0.1"
   ```

2. **Build for submission:**
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```

3. **Submit to stores:**
   - **Google Play Store:** https://developer.android.com/studio/publish
   - **Apple App Store:** https://appstoreconnect.apple.com

4. **Configure:**
   - App icons and screenshots
   - Description and pricing
   - Privacy policy
   - Terms of service

---

## 📞 Need Help?

- **Documentation:** See `BUILD_AND_DEPLOYMENT.md`
- **Backend README:** See `stayconnect-ng-backend/README.md`
- **Expo Docs:** https://docs.expo.dev
- **Git Issues:** Check your git repository for issues

---

**Version:** 1.0.0
**Last Updated:** March 14, 2026
**Support:** 24/7 (Documentation & Guides)
