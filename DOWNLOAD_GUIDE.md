# 📲 StayConnect NG - How to Download & Share the App

## 🎯 TLDR - Quick Links

| Method | Time | Link | Notes |
|--------|------|------|-------|
| **Expo Go** | 2 min | Download Expo Go app, then `npm start` | No build needed |
| **Android APK** | 10 min | https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend | Standalone app |
| **iOS IPA** | 15 min | https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend | Needs Apple account |

---

## 🚀 Option 1: Instant Demo with Expo Go (RECOMMENDED FOR TESTING)

### What is Expo Go?
A free app that runs your React Native app instantly without building APK/IPA.

### How to use:

**Step 1: Download Expo Go**
- 📱 iPhone: https://apps.apple.com/app/expo-go/id982107779
- 🤖 Android: https://play.google.com/store/apps/details?id=host.exp.exponent

**Step 2: Make sure backend is running**
```bash
cd "StayConnect Backend/stayconnect-ng-backend"
npm run start:dev
```

**Step 3: Start development server**
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
npm start
```

**Step 4: Scan the QR code**
Open Expo Go app → Tap "Scan QR code" → Point at your terminal

**Step 5: App loads and you can start testing!**

### Advantages:
✅ No build waiting time  
✅ Works on any phone  
✅ Easy to share with testers  
✅ Hot reload for fast development  
✅ Great for demos  

### Disadvantages:
❌ Requires Expo Go app installed  
❌ Slower than native app  
❌ Can't submit to app stores  

---

## 📦 Option 2: Download Standalone APK for Android

### What's an APK?
A compiled app file that works on Android without needing Expo Go.

### How to get it:

**Step 1: Build on EAS**
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
eas build --platform android --profile preview
```

**Step 2: Wait for build completion**
- Takes ~10 minutes
- You'll see a URL in the terminal
- Or check: https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend

**Step 3: Download the APK**
- Click the download button in the dashboard
- Or use the link from terminal
- File will be ~50 MB

**Step 4: Install on Android phone**
- Download APK on phone
- Open file manager and tap the APK
- Tap "Install"
- Allow unknown sources if prompted
- App is now installed!

**Step 5: Launch app**
- Find StayConnect in app drawer
- Tap to launch
- Start using!

### How to share:
1. Download APK from EAS
2. Send via email, cloud drive, WhatsApp, etc.
3. Others download and install
4. Works on any Android phone!

### Requirements:
- Android 7.0+ (SDK 24)
- 100MB free storage
- Unknown sources enabled

### File Details:
- **Size:** ~50 MB
- **Format:** APK
- **Installation:** Direct installation
- **Duration:** 2-3 minutes to install

---

## 🍎 Option 3: Build for iOS

### What's an IPA?
An iOS app file that works on iPhones without App Store.

### Prerequisites:
⚠️ You need an Apple Developer account ($99/year)

### How to build:

**Step 1: Get Apple account**
- Go to: https://developer.apple.com
- Pay $99/year fee
- Setup account

**Step 2: Build on EAS**
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
eas build --platform ios --profile production
```

**Step 3: Authenticate**
- Enter Apple ID email
- Enter Apple ID password
- Enter 2FA code from your Apple device
- EAS gets credentials

**Step 4: Wait for build**
- Takes ~15 minutes
- Longer than Android

**Step 5: Download IPA**
- Get from EAS dashboard
- File size: ~100-150 MB

**Step 6: Install on iPhone**
- Use Testflight (easier)
- Or direct installation (requires provisioning)

### Easiest Method: Use Testflight
1. Share app with testers via Apple ID
2. They install Testflight app
3. Accept invite from email
4. Install from Testflight
5. Ready to use!

---

## 🎁 How to Share the App

### Method 1: Share APK (Android)
```
1. Build APK (Option 2 above)
2. Download to computer
3. Send to friends via:
   - Email
   - Google Drive
   - Dropbox
   - USB drive
   - Telegram/WhatsApp
4. They download and install
```

### Method 2: Share via Testflight (iOS)
```
1. Build IPA (Option 3 above)
2. Add tester Apple IDs in Apple Developer Portal
3. They get email invitation
4. They open email link
5. They click "View in Testflight"
6. They accept and install
```

### Method 3: Share via Expo Link (Both)
```
1. Run npm start
2. Share the QR code or link
3. They scan with Expo Go
4. App loads instantly
```

### Method 4: Share via QR Code
```
1. Run: npm start
2. Take screenshot of QR code
3. Share screenshot
4. Others scan with Expo Go
```

---

## 📊 Build Timeline

### Expo Go Method
- **Setup:** 5 minutes
- **Running:** Immediate
- **Total:** 5 minutes ✅

### Android APK Build
- **Setup:** 5 minutes
- **Building:** 10 minutes
- **Download:** 2 minutes
- **Installation:** 2 minutes
- **Total:** 19 minutes ✅

### iOS IPA Build
- **Setup:** 5 minutes
- **Apple Setup:** 5 minutes (first time)
- **Building:** 15 minutes
- **Download:** 3 minutes
- **Installation:** 5 minutes
- **Total:** 33 minutes ✅

---

## 💰 Cost Analysis

| Method | One-Time | Monthly | Notes |
|--------|----------|---------|-------|
| Expo Go | Free | Free | Limited functionality |
| Android APK | Free | Free | Full functionality |
| iOS Testflight | $99 | - | Required Apple account |
| Google Play Store | $25 | - | For public release |
| App Store | $99 | - | For public release |

---

## ✅ Verification Checklist

Before sharing the app:

- [ ] Backend is running (`npm run start:dev`)
- [ ] Frontend is working (`npm start`)
- [ ] Can create account
- [ ] Can login
- [ ] Can view properties
- [ ] Can make booking
- [ ] Can use voice calling
- [ ] No errors in logs
- [ ] All features tested

---

## 🚨 Troubleshooting Downloads

### Issue: "APK download is slow"
**Solution:** 
- EAS servers might be busy
- Try again in a few minutes
- Check your internet speed
- Download on desktop for faster speed

### Issue: "Can't install APK"
**Solution:**
- Enable "Unknown Sources" in Settings
- Try different Android device
- Check storage space (need 100MB+)
- Download latest version
- Clear app cache before installing

### Issue: "Testflight installation failed"
**Solution:**
- Verify Apple ID in invite
- Check email for invitation link
- Install Testflight app first
- Ensure iOS 13+
- Wait 24 hours for provisioning

### Issue: "QR code won't scan"
**Solution:**
- Make sure phone and computer on same WiFi
- Brighten screen before scanning
- Try copying link from terminal
- Restart Expo Go
- Try `npm start -- --tunnel`

---

## 📱 Download Links Summary

### Ready to Use Now:
- ✅ Backend API: http://localhost:3000
- ✅ API Docs: http://localhost:3000/api/v1/docs
- ✅ Expo Go: https://expo.io

### Build & Download:
- ⏳ EAS Dashboard: https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend
- ⏳ Android APK: Available after `eas build --platform android`
- ⏳ iOS IPA: Available after `eas build --platform ios` (needs Apple account)

### Documentation:
- 📖 Full Guide: See BUILD_AND_DEPLOYMENT.md
- 📖 Setup Complete: See SETUP_COMPLETE.md
- 📖 API Docs: http://localhost:3000/api/v1/docs

---

## 🎯 Recommended Flow

### For Quick Testing:
```
1. Download Expo Go (2 min)
2. Run npm start (2 min)
3. Scan QR code (1 min)
4. Test app (10 min)
Total: 15 minutes
```

### For Real Device Testing:
```
1. Run eas build --platform android (start, 10 min)
2. Download APK (2 min)
3. Install on phone (2 min)
4. Test app (10 min)
Total: 24 minutes
```

### For Production Release:
```
1. Update version
2. Build for stores
3. Prepare screenshots
4. Submit to Play Store/App Store
5. Wait for approval (24-48 hours)
```

---

## 📞 Support

### If you encounter issues:
1. Check the BUILD_AND_DEPLOYMENT.md file
2. Review http://localhost:3000/api/v1/docs
3. Check terminal logs for errors
4. Restart backend and frontend
5. Clear caches and rebuild

---

## 🎉 You're Ready!

Choose your method above and start testing with real users!

**Questions?** Refer to DEPLOYMENT_COMPLETE.md or SETUP_COMPLETE.md

---

**Last Updated:** March 14, 2026  
**Status:** ✅ Ready for Download & Installation
