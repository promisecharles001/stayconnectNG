# 🚀 StayConnect NG - Complete Setup & Deployment Guide

## 📊 Project Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| **Backend** | ✅ Running | NestJS on `http://localhost:3000` |
| **Frontend** | ✅ Ready | React Native with Expo |
| **Database** | ✅ Connected | PostgreSQL with Prisma ORM |
| **Git Repository** | ✅ Tracked | Frontend changes committed |
| **Android Build** | 🔧 Ready | EAS Build configured |
| **iOS Build** | ⏳ Pending | Requires Apple Developer account |

---

## 🎯 What You Need to Do Next

### Option 1: Quick Testing (5 minutes)
```bash
# Terminal 1: Backend (already running)
cd "StayConnect Backend/stayconnect-ng-backend"
npm run start:dev

# Terminal 2: Frontend
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
npm start

# Then scan QR code with Expo Go app
```

### Option 2: Build for Android Device (10-15 minutes)
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
eas build --platform android --profile preview

# Wait for build and download APK from EAS dashboard
```

### Option 3: Build for iOS (Requires Apple Developer Account)
```bash
cd "StayConnect Backend/stayconnect-ng-backend/frontend"
eas build --platform ios --profile production

# Authenticate with Apple ID and two-factor code
```

---

## 📱 Installation Methods

### For Quick Testing: Expo Go
**Best for:** Rapid testing and development

1. Download Expo Go (iOS/Android)
2. Run `npm start` in frontend
3. Scan QR code with Expo Go
4. App launches immediately

### For Distribution: Standalone APK/IPA
**Best for:** Sharing with users/testers

1. Run EAS Build command
2. Download APK/IPA from dashboard
3. Install on device
4. App works without Expo Go

### For Production: App Stores
**Best for:** Public release

1. Build with production profile
2. Prepare screenshots, descriptions
3. Submit to Google Play Store / Apple App Store
4. Wait for approval

---

## 🔧 Build Configuration

### Updated Files:
✅ `frontend/app.json` - Package name updated to `ng.stayconnect.app`
✅ `frontend/eas.json` - Build profiles configured
✅ `frontend/android/app/build.gradle` - Android config updated
✅ `frontend/package.json` - expo-dev-client added

### Current Build Profiles:

**Development:**
```
eas build --platform android --profile development
```
- Includes development tools
- For testing only

**Preview:**
```
eas build --platform android --profile preview
```
- APK format
- Ready for sharing
- Recommended for testing on devices

**Production:**
```
eas build --platform android --profile production
```
- Optimized for app stores
- Signed with production key
- For Play Store submission

---

## 📋 System Specifications

### Backend (NestJS)
- **Port:** 3000
- **Database:** PostgreSQL (localhost:5432)
- **API Prefix:** /api/v1
- **Authentication:** JWT
- **Documentation:** http://localhost:3000/api/v1/docs

### Frontend (React Native)
- **Package:** ng.stayconnect.app
- **Min Android:** SDK 24 (Android 7.0+)
- **Target Android:** SDK 34
- **Min iOS:** 13+
- **Framework:** Expo 51+

### Database
- **Type:** PostgreSQL
- **ORM:** Prisma
- **Schema:** Public
- **Migrations:** Up to date

---

## 🌐 API Endpoints Reference

### Authentication
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login
POST   /api/v1/auth/refresh           - Refresh token
POST   /api/v1/auth/logout            - Logout
GET    /api/v1/auth/profile           - Get profile
POST   /api/v1/auth/change-password   - Change password
```

### Users
```
POST   /api/v1/users                  - Create user
GET    /api/v1/users                  - List users
GET    /api/v1/users/:id              - Get user
PATCH  /api/v1/users/:id              - Update user
DELETE /api/v1/users/:id              - Delete user
PATCH  /api/v1/users/:id/role         - Update role
```

### Properties
```
POST   /api/v1/properties             - Create property
GET    /api/v1/properties             - List properties
GET    /api/v1/properties/my-properties - Get my properties
GET    /api/v1/properties/:id         - Get property
PATCH  /api/v1/properties/:id         - Update property
DELETE /api/v1/properties/:id         - Delete property
```

### Bookings
```
POST   /api/v1/bookings               - Create booking
GET    /api/v1/bookings/my-bookings   - Get my bookings
GET    /api/v1/bookings/host-bookings - Get host bookings
PATCH  /api/v1/bookings/:id/status    - Update booking status
PATCH  /api/v1/bookings/:id/verify-payment - Verify payment
```

### Voice Calling
```
POST   /api/v1/voice/generate-token   - Generate Agora token
GET    /api/v1/voice/config-status    - Check voice config
```

**Full documentation:** http://localhost:3000/api/v1/docs

---

## 🔐 Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@stayconnect.ng | Admin@123456 |
| Test User | test@example.com | Test@123456 (register via app) |

---

## 📦 File Structure

```
StayConnect Backend/
├── stayconnect-ng-backend/
│   ├── src/
│   │   ├── auth/          - Authentication
│   │   ├── users/         - User management
│   │   ├── properties/    - Property listing
│   │   ├── bookings/      - Booking management
│   │   ├── voice/         - Voice calling
│   │   ├── earnings/      - Earnings tracking
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma  - Database schema
│   │   └── migrations/    - Migration files
│   ├── .env              - Configuration
│   ├── package.json      - Dependencies
│   └── README.md         - Backend docs
│
├── stayconnect-ng-backend/frontend/
│   ├── src/
│   │   ├── screens/      - App screens
│   │   ├── components/   - Reusable components
│   │   ├── services/     - API services
│   │   └── navigation/   - Navigation setup
│   ├── android/          - Android native code
│   ├── app.json          - Expo config
│   ├── eas.json          - EAS config
│   ├── package.json      - Dependencies
│   └── tsconfig.json     - TypeScript config
│
├── BUILD_AND_DEPLOYMENT.md  - Build guide
├── DOWNLOAD_AND_INSTALL.md  - Installation guide
├── build.sh                 - Unix build script
├── build.bat                - Windows build script
└── .git/                    - Git repository
```

---

## 🚀 Deployment Checklist

### Before Building:
- [ ] Backend is running and accessible
- [ ] Database is connected and migrations are done
- [ ] Frontend dependencies are installed
- [ ] .env files are configured
- [ ] Git changes are committed

### Before Publishing:
- [ ] Test on actual devices (Android & iOS)
- [ ] Test all features (login, booking, voice calls)
- [ ] Update app version number
- [ ] Prepare screenshots and description
- [ ] Set up privacy policy
- [ ] Get signing certificates

### For App Store Submission:
- [ ] Build with production profile
- [ ] Get Apple Developer account ($99/year)
- [ ] Get Google Play Developer account ($25 one-time)
- [ ] Prepare store listings
- [ ] Submit for review

---

## 🛠️ Troubleshooting

### "Backend not responding"
```bash
# Check backend is running
curl http://localhost:3000/api/v1/auth/login

# Restart backend
cd stayconnect-ng-backend
npm run start:dev
```

### "Can't scan QR code"
```bash
# Make sure on same WiFi
# Run with --tunnel flag
cd frontend
npm start -- --tunnel
```

### "Build fails on EAS"
```bash
# Clear cache
eas build --platform android --clear-cache

# Check logs in dashboard
https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend
```

### "APK won't install"
- Enable "Unknown Sources" in Android Settings
- Uninstall previous version
- Check device storage (100MB+ free)
- Try different Android device

---

## 📚 Documentation References

| Document | Purpose |
|----------|---------|
| [BUILD_AND_DEPLOYMENT.md](BUILD_AND_DEPLOYMENT.md) | Building for all platforms |
| [DOWNLOAD_AND_INSTALL.md](DOWNLOAD_AND_INSTALL.md) | Installation instructions |
| [stayconnect-ng-backend/README.md](stayconnect-ng-backend/README.md) | Backend documentation |
| [stayconnect-ng-backend/AGORA_INTEGRATION_GUIDE.md](stayconnect-ng-backend/AGORA_INTEGRATION_GUIDE.md) | Voice calling setup |

---

## 🔗 Important Links

### Development
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/v1/docs
- Prisma Studio: http://localhost:5555 (after `npm run prisma:studio`)

### Deployment
- EAS Dashboard: https://expo.dev/accounts/promisetheking/projects/stayconnect-ng-frontend
- Google Play Developer: https://play.google.com/console
- Apple App Store Connect: https://appstoreconnect.apple.com

### External Services
- Agora.io Console: https://console.agora.io
- Expo Documentation: https://docs.expo.dev
- NestJS Documentation: https://docs.nestjs.com

---

## 💡 Pro Tips

1. **Use development mode for testing:**
   ```bash
   npm start  # Expo Go
   ```

2. **Watch for changes:**
   ```bash
   npm run start:dev  # Backend
   npm start -- --watch  # Frontend
   ```

3. **Clear cache when issues occur:**
   ```bash
   npm run prisma:migrate reset --force  # Database
   npm cache clean --force  # npm cache
   eas build --clear-cache  # EAS cache
   ```

4. **Test on real device:**
   - Builds without Expo Go are more reliable
   - Install APK directly on Android
   - Use Testflight for iOS

5. **Monitor logs:**
   ```bash
   eas build --platform android  # Shows live logs
   ```

---

## 📞 Support Resources

- **Backend Issues:** Check backend logs with `npm run start:dev`
- **Frontend Issues:** Check Expo logs with `npm start`
- **Build Issues:** Check EAS dashboard logs
- **Database Issues:** Check Prisma Studio at http://localhost:5555

---

## 🎉 You're All Set!

Your StayConnect NG application is:
✅ **Fully functional** with running backend
✅ **Ready for testing** via Expo Go
✅ **Configured for deployment** with EAS
✅ **Version controlled** with Git
✅ **Documented** with guides

### Next Steps:
1. Test the app with Expo Go
2. Create a test account and explore features
3. Build for your target devices
4. Share with testers
5. Iterate and improve
6. Deploy to app stores

---

**Version:** 1.0.0  
**Last Updated:** March 14, 2026  
**Status:** ✅ Ready for Development & Testing  
**Maintainer:** StayConnect NG Team
