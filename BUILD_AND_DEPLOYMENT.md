# StayConnect NG - App Build & Deployment Guide

## Project Status
✅ Backend: Running on `http://localhost:3000`
✅ API Documentation: `http://localhost:3000/api/v1/docs`
✅ Frontend: Ready for deployment
✅ Git Repository: Configured

---

## 📱 Option 1: Install via Expo Go (Quickest for Testing)

### For Android & iOS Users:

1. **Download Expo Go** from your app store
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan this QR code** with Expo Go:
   ```
   Use the QR code displayed when running: npm start
   ```

3. **Or use the Development Server:**
   ```bash
   cd frontend
   npm start
   ```

---

## 📦 Option 2: Build Standalone APK (Android)

### Method A: Using EAS Build (Recommended)

```bash
cd stayconnect-ng-backend/frontend

# Build Android APK
eas build --platform android --profile preview

# Build iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

**Note:** Your EAS account currently has limited free builds per month. Upgrade for unlimited builds.

### Method B: Local Build (if you have Android SDK)

```bash
cd frontend

# Prebuild native modules
npx expo prebuild --platform android

# Build with Gradle
cd android
./gradlew assembleRelease
```

---

## 🍎 Option 3: Build for iOS

### Requirements:
- Mac with Xcode installed
- Apple Developer account ($99/year)

### Steps:

```bash
cd frontend

# Build using EAS
eas build --platform ios --profile production

# Or build locally
npx expo prebuild --platform ios
cd ios
xcodebuild -workspace StayConnect.xcworkspace -scheme StayConnect -configuration Release
```

---

## 🚀 Development Setup Instructions

### Backend Setup (Already Running!)

```bash
cd stayconnect-ng-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev

# Server running at: http://localhost:3000
# API Docs: http://localhost:3000/api/v1/docs
```

### Frontend Setup

```bash
cd stayconnect-ng-backend/frontend

# Install dependencies
npm install

# Start Expo server
npm start

# Scan QR code with Expo Go or press:
# 'a' - Android emulator
# 'i' - iOS simulator
# 'w' - Web browser
```

---

## 📋 Project Structure

```
StayConnect Backend/
├── stayconnect-ng-backend/          # NestJS Backend
│   ├── src/                         # Source code
│   ├── prisma/                      # Database schema
│   ├── .env                         # Configuration
│   └── package.json
│
├── frontend/                        # React Native App
│   ├── src/                         # React Native code
│   ├── app.json                     # Expo config
│   ├── eas.json                     # EAS config
│   └── package.json
│
└── .git/                            # Git repository
```

---

## 🔑 Key Configuration Files Updated

### Frontend - `app.json`
- Package Name: `ng.stayconnect.app`
- Bundle ID: `ng.stayconnect.app` (iOS)
- Min SDK: 24 (Android)
- Target SDK: 34 (Android)

### Backend - `.env`
- Database: PostgreSQL (localhost:5432)
- API Port: 3000
- JWT Secrets: Configured
- Agora.io: Configured for voice calls

---

## 🌐 Available API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `/api/v1/auth/*` |
| **Users** | `/api/v1/users/*` |
| **Properties** | `/api/v1/properties/*` |
| **Bookings** | `/api/v1/bookings/*` |
| **Earnings** | `/api/v1/earnings/*` |
| **KYC** | `/api/v1/kyc/*` |
| **Admin** | `/api/v1/admin/*` |
| **Voice Calls** | `/api/v1/voice/*` |

**Access at:** `http://localhost:3000/api/v1/docs` (Swagger UI)

---

## 🔐 Default Credentials

- **Admin Email:** `admin@stayconnect.ng`
- **Admin Password:** `Admin@123456`

---

## 📲 Testing the App

### 1. Create an Account
```bash
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure@Pass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234801234567"
}
```

### 2. Login
```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure@Pass123"
}
```

### 3. Explore Properties
```bash
GET http://localhost:3000/api/v1/properties
Authorization: Bearer <your_token>
```

---

## 🚨 Troubleshooting

### Android Build Fails
- Check that Java JDK 17+ is installed
- Ensure Android SDK is properly configured
- Clear cache: `eas build --platform android --clear-cache`

### App Won't Connect to Backend
- Verify backend is running: `http://localhost:3000`
- Update API endpoint in frontend config
- Check CORS settings in backend

### Expo Go QR Code Issues
- Make sure phone and computer are on same WiFi
- Try scanning with camera app then opening link
- Restart Expo server with `npm start`

---

## 📝 Git Repository

Your project is tracked in Git. To sync changes:

```bash
# View status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push (if remote configured)
git push origin main
```

---

## 🎯 Next Steps

1. **Test the Backend API:**
   - Visit `http://localhost:3000/api/v1/docs`
   - Try registering and logging in

2. **Run the Frontend:**
   - Run `npm start` in frontend folder
   - Scan QR code with Expo Go

3. **Build for Devices:**
   - Use EAS Build for cloud builds
   - Or use local Gradle for Android

4. **Deploy to Production:**
   - Configure signing certificates
   - Update bundle identifiers
   - Deploy to Play Store / App Store

---

## 📞 Support

For issues with:
- **Backend:** Check `stayconnect-ng-backend` README
- **Frontend:** Check Expo documentation
- **Database:** Check Prisma docs for migrations
- **Voice Calls:** See `AGORA_INTEGRATION_GUIDE.md`

---

**Version:** 1.0.0
**Last Updated:** March 14, 2026
**Status:** ✅ Ready for Testing & Development
