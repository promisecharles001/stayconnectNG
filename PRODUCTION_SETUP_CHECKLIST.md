# 🚀 StayConnect NG Production Setup Checklist

Follow these steps to make your app fully functional for real testing on the Play Store!


## 📱 Step 1: Get & Configure Google Maps API Key

**1.1 Create a Google Cloud Project**
- Go to: https://console.cloud.google.com/
- Create a new project named "StayConnect NG"

**1.2 Enable the Maps SDK for Android**
- In your project, go to **APIs & Services > Library**
- Search for "Maps SDK for Android" and enable it

**1.3 Get Your API Key**
- Go to **APIs & Services > Credentials**
- Click "Create Credentials" > "API Key"
- Copy this key!

**1.4 Restrict your API Key (IMPORTANT for Security)**
- Click the API key you just created
- Under "Application restrictions", select "Android apps"
- Add your package name: `com.stayconnectng.app`
- Add your SHA-1 fingerprint (see below to get it)
- Under "API restrictions", select "Restrict key" and choose "Maps SDK for Android"
- Save!

**How to get your SHA-1 fingerprint for development and production:**
- **EAS Build Production SHA-1:** You can get this from Expo or your keystore
- **Development:** Run `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android` in your terminal

**1.5 Update frontend/app.json**
- Open `stayconnect-ng-backend/frontend/app.json`
- Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your real API key
- Also, bump the version from `1.0.0` to `1.0.1` (already done!)


## 🗄️ Step 2: Set Up Backend Environment Variables on Render

Your backend is already deployed to Render at `https://stayconnect-ng-api.onrender.com`! Let's make sure all env vars are set:

1. Go to https://dashboard.render.com/
2. Select your backend service
3. Go to **Environment > Environment Variables**
4. Add/update these variables (copy/paste from your local .env file!):

| Variable Name                | Your Value                                                                 |
|------------------------------|----------------------------------------------------------------------------|
| `NODE_ENV`                   | `production`                                                               |
| `PORT`                       | (auto-set by Render)                                                       |
| `DATABASE_URL`               | (Your PostgreSQL connection string from Render Database)                   |
| `JWT_SECRET`                 | `a55284061dc61000bd752e1839d3e32ea4d5294d48184086926fe1b80f5aee6`         |
| `JWT_REFRESH_SECRET`         | `21713f24d57dbef0342d8d5543492db0d1b24e2c4f71b1c1b2e1cefe579448418242606ec8ede30b5bd648805bb0365b49670f86decf9b088f48e0be2e7a5ed3` |
| `JWT_ACCESS_EXPIRATION`      | `15m`                                                                      |
| `JWT_REFRESH_EXPIRATION`     | `7d`                                                                       |
| `CLOUDINARY_CLOUD_NAME`      | `da1rako6c`                                                                |
| `CLOUDINARY_API_KEY`         | `427477122634898`                                                          |
| `CLOUDINARY_API_SECRET`      | `ZTKmDWQCJN-s5P5V0ZVpjqFPXmc`                                              |
| `LIVEKIT_API_KEY`            | `API3fmkDyaiP74M`                                                          |
| `LIVEKIT_API_SECRET`         | `50i7EBL63fNGx9eXtaaD3lEhn3rbGqiX9HQKvsoGZVi`                              |
| `LIVEKIT_SERVER_URL`         | `wss://stayconnect-grnkwxe8.livekit.cloud`                                 |
| `LIVEKIT_TOKEN_EXPIRATION`   | `3600` (1 hour)                                                            |
| `CORS_ORIGIN`                | `*` (for testing; restrict later if needed)                                |


## ☁️ Step 2.1: Cloudinary Setup (for Image Uploads)
Your Cloudinary keys are already set in the backend .env file!
  - Cloud Name: `da1rako6c`
  - API Key: `427477122634898`
  - API Secret: `ZTKmDWQCJN-s5P5V0ZVpjqFPXmc`
- Make sure these are added to your Render backend's Environment Variables!

## 🔊 Step 2.2: LiveKit Setup (for Voice Calls)
Your LiveKit keys are already set!
  - LIVEKIT_API_KEY: `API3fmkDyaiP74M`
  - LIVEKIT_API_SECRET: `50i7EBL63fNGx9eXtaaD3lEhn3rbGqiX9HQKvsoGZVi`
  - LIVEKIT_SERVER_URL: `wss://stayconnect-grnkwxe8.livekit.cloud`
- Make sure these are added to your Render backend's Environment Variables!

(Optional: If you need to change them, go to https://cloud.livekit.io/)


## 📦 Step 3: Rebuild the Android App Bundle (.aab) with EAS

Now let's build a new version of your app! Run these commands in your terminal:

1. **Open the frontend directory:**
```bash
cd "c:\Users\Promisetheking\Downloads\StayConnect Backend\stayconnect-ng-backend\frontend"
```

2. **Make sure you're logged in to Expo:**
```bash
npx expo login
```

3. **Build the production .aab file:**
```bash
npx eas build --platform android --profile production
```

- This will take 5-15 minutes
- Once done, Expo will give you a download link for your .aab file!


## 🚀 Step 4: Update the App on Google Play Console

1. Go to https://play.google.com/console/
2. Select your StayConnect NG app
3. Go to **Testing > Internal testing** (or your chosen track)
4. Click "Create new release"
5. Upload the new .aab file you just downloaded from EAS
6. Fill out the release notes:
   - "Fixed Google Maps integration"
   - "Fixed image uploads to Cloudinary"
   - "General stability improvements"
7. Review and roll out the release!


## ✅ Step 5: Test Everything!

Once testers have the new version, ask them to test:
1. 🗺️ Map view loads and shows properties
2. 📷 Property images load correctly
3. 📤 Uploading a new property with images works
4. 🎤 Voice calls connect
5. 💬 Chat works
6. 📝 Booking flow works


## 📚 Useful Links
- Google Cloud Console: https://console.cloud.google.com/
- Cloudinary Dashboard: https://cloudinary.com/console
- LiveKit Cloud: https://cloud.livekit.io/
- Render Dashboard: https://dashboard.render.com/
- Expo EAS Docs: https://docs.expo.dev/build/introduction/
