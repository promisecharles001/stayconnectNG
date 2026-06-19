# StayConnect NG - Production Checklist

## Automated Testing Setup (DONE)

### Unit Tests (Jest + React Native Testing Library)
- Run: `npm test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`
- CI mode: `npm run test:ci`

### E2E Tests (Maestro)
- Install Maestro: https://maestro.mobile.dev/getting-started/installing-maestro
- Run all flows: `maestro test .maestro/flows`
- Run single flow: `maestro test .maestro/flows/login.yaml`

### CI/CD Pipeline (GitHub Actions)
- File: `.github/workflows/ci-cd.yml`
- Triggers on push to `main`/`develop` and PRs to `main`
- Steps: TypeScript check → Unit tests → Coverage upload → Build Android/iOS preview

## Play Store Submission Steps

### 1. Generate Release Keystore (ONE TIME ONLY)
```bash
cd stayconnect-ng-backend/frontend/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore stayconnect-release.keystore -alias stayconnect -keyalg RSA -keysize 2048 -validity 10000
```
Upload the keystore to EAS:
```bash
eas credentials
```

### 2. Update Version
Edit `app.json`:
```json
{
  "version": "1.0.1",
  "android": { "versionCode": 2 }
}
```

### 3. Build Production AAB
```bash
cd stayconnect-ng-backend/frontend
eas build --profile production --platform android
```
This outputs an `.aab` file ready for Play Store.

### 4. Submit to Play Store
```bash
eas submit --platform android
```
Or manually upload the AAB to Google Play Console.

### 5. Required Play Store Assets
- [ ] App icon (512x512 PNG) — `./assets/logo.png`
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (phone + tablet)
- [ ] Privacy policy URL
- [ ] App description (short + full)

## Production Configuration Review

### Security
- [x] Input validation & sanitization
- [x] Secure token storage (expo-secure-store)
- [x] HTTPS-only API communication
- [x] ProGuard/R8 enabled for release

### Performance
- [x] Static Dimensions replaced with useWindowDimensions
- [x] AsyncStorage caching for properties
- [x] Skeleton screens for loading states
- [x] Memory leak prevention (useMountedRef)
- [x] Bundle size optimized (axios removed)

### Accessibility
- [x] Touch targets minimum 44x44
- [x] Screen reader labels on key elements
- [x] Keyboard navigation in forms
- [x] SafeAreaView on all screens

### Monitoring
- [x] Sentry error logging scaffolded
- [x] Error boundaries around app
- To activate Sentry: Install `@sentry/react-native` and set `EXPO_PUBLIC_SENTRY_DSN`

## Environment Variables Needed

Create `.env` in `stayconnect-ng-backend/frontend/`:
```
EXPO_PUBLIC_API_URL=https://stayconnect-ng-api.onrender.com/api/v1
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

## Web-Based Testing Options

You can test the app without physical devices using:

1. **EAS Build (Expo)** — Cloud builds for Android/iOS
   ```bash
   eas build --profile preview --platform android
   ```

2. **Firebase Test Lab** — Free device testing
   Upload your APK/AAB to: https://console.firebase.google.com/project/_/testlab

3. **BrowserStack App Live** — Real device cloud testing
   https://www.browserstack.com/app-live

4. **Maestro Cloud** — Run E2E tests in cloud
   https://console.mobile.dev

5. **Expo Orbit** — Test on local simulators
   ```bash
   npx expo-orbit
   ```
