# StayConnect App - Third-Party Services Setup Guide

## Overview
This document outlines all the third-party services required to make the StayConnect app fully functional and ready for production deployment on Google Play Store and Apple App Store.

**Please complete all sign-ups below and provide the requested credentials/information.**

---

## Estimated Costs Summary

| Item | One-Time Cost | Monthly/Yearly Cost |
|------|---------------|---------------------|
| Google Play Console | $25 | - |
| Apple Developer Program | - | $99/year |
| Domain Name | - | ~$10-15/year |
| Railway/Render Hosting | - | ~$5-7/month |
| Cloudinary | - | Free (25GB) |
| Google Maps | - | Free ($200 credit/month) |
| **LiveKit (Voice Calls)** | - | **Free (10,000 min)** |
| EAS Build (optional) | - | $29/month |
| **Total First Year** | **~$25** | **~$180-220/year** |

---

## 1. Cloud Storage - Cloudinary (REQUIRED)

**Purpose:** Store and serve all images (property photos, user avatars, KYC documents, payment proofs).

**Why Cloudinary:** Free tier, automatic image optimization, easy API, serves images via CDN.

### Steps:
1. Go to: https://cloudinary.com
2. Sign up for free account
3. Go to **Dashboard**
4. Provide the following:
   - [ ] **Cloud Name** (e.g., `your-cloud-name`)
   - [ ] **API Key** (found in Dashboard)
   - [ ] **API Secret** (found in Dashboard)

**Cost:** Free tier includes 25GB storage, 25GB bandwidth/month

---

## 2. Push Notifications - Expo (REQUIRED)

**Purpose:** Send push notifications for booking confirmations, messages, payment alerts.

**Note:** Expo project is already created. Project ID: `3f5f9473-f1fb-462d-8fb0-c4a2396e6068`

### Steps:
1. Go to: https://expo.dev
2. Sign in or create an account
3. The project "stayconnect-ng-frontend" is already set up under username `promisetheking`
4. If you want to transfer ownership:
   - [ ] Create your own Expo account
   - [ ] Provide your Expo username
   - [ ] I will transfer the project to you

**Cost:** Free for push notifications, EAS builds start at $29/month

---

## 3. Google Play Console (REQUIRED for Android)

**Purpose:** Publish and manage the Android app on Google Play Store.

### Steps:
1. Go to: https://play.google.com/console
2. Sign in with a Google account (preferably business email)
3. Pay the one-time registration fee: **$25**
4. Create a new app called "StayConnect"
5. Provide the following:
   - [ ] **Google Play Console Admin Access** (invite developer email)
   - [ ] Or create a Service Account and share the JSON key

**Documents Needed for Store Listing:**
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (minimum 2, recommended: phone screenshots)
- Privacy Policy URL
- Terms of Service URL

**Cost:** $25 one-time

---

## 4. Apple App Store Connect (REQUIRED for iOS)

**Purpose:** Publish and manage the iOS app on Apple App Store.

### Steps:
1. Go to: https://developer.apple.com
2. Enroll in Apple Developer Program: **$99/year**
3. Accept the license agreement
4. Go to: https://appstoreconnect.apple.com
5. Create a new App called "StayConnect"
6. Provide the following:
   - [ ] **App Store Connect Admin Access** (invite developer email)
   - [ ] Or create an API Key (App Store Connect → Users → Keys)

**Documents Needed:**
- App icons (all required sizes)
- Screenshots for iPhone sizes
- Privacy Policy URL
- App privacy details (data collection)

**Cost:** $99/year

---

## 5. Google Maps Platform (REQUIRED)

**Purpose:** Display properties on map, location search, address autocomplete.

### Steps:
1. Go to: https://console.cloud.google.com
2. Create a new project called "StayConnect"
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
4. Go to **APIs & Services → Credentials**
5. Create an API key
6. Provide the following:
   - [ ] **Google Maps API Key**

**Cost:** $200 free credit/month (usually covers small-medium apps)

---

## 6. LiveKit - Voice/Video Calls (REQUIRED - CRITICAL FEATURE)

**Purpose:** Real-time voice and video calls between guests and hosts. This is a **core feature** of the StayConnect app.

**Why LiveKit:** 
- Low-latency audio/video
- Works on both Android and iOS
- Excellent React Native support
- Free tier available
- Reliable WebRTC infrastructure

### Step-by-Step Setup:

#### Step 1: Create LiveKit Cloud Account
1. Go to: https://cloud.livekit.io
2. Click **"Start for Free"** or **"Sign Up"**
3. Create an account (use Google or email)
4. Verify your email address

#### Step 2: Create a Project
1. Click **"Create Project"**
2. Name it: **"StayConnect"**
3. Select a region closest to Nigeria (e.g., Europe - Frankfurt)
4. Click **"Create Project"**

#### Step 3: Get Your Credentials
1. Go to **Settings** (gear icon) in your project
2. Click on **API Keys** in the left sidebar
3. You will see:
   - **API Key** (e.g., `APIxxxxxxxxxxxx`)
   - **API Secret** (click "Reveal" to see it)
4. Copy both values

#### Step 4: Get Your Server URL
1. In your project dashboard, look for **"URL"** or **"Server URL"**
2. It will look like: `wss://stayconnect-xxxxx.livekit.cloud`
3. Copy this URL

#### Step 5: Provide the Following:
- [ ] **API Key** (e.g., `APIabc123xyz`)
- [ ] **API Secret** (e.g., `secret_abc123xyz...`)
- [ ] **Server URL** (e.g., `wss://stayconnect-xxxxx.livekit.cloud`)

**Cost:** 
- Free tier: 10,000 participant minutes/month
- Pay-as-you-go: $0.004 per participant minute after free tier
- Estimated monthly cost for MVP: Free (under 10,000 minutes)

### How Voice Calls Work in StayConnect:

1. **Guest books a property** → Creates a booking
2. **Guest or Host initiates call** → Opens VoiceCallScreen
3. **App requests token** from backend (`POST /voice/generate-token`)
4. **Backend generates LiveKit token** using your credentials
5. **Guest connects to LiveKit room** with the token
6. **Host joins the same room** when they receive a call
7. **Real-time audio communication** established

### Architecture:
```
[Guest App] ←→ [LiveKit Cloud Server] ←→ [Host App]
                    ↑
            [Backend generates tokens]
```

---

## 7. Email Service - Gmail SMTP (RECOMMENDED)

**Purpose:** Send transactional emails (password reset, booking confirmations, receipts).

### Steps:
1. Use your existing Gmail account (or create a business Gmail)
2. Enable 2-Factor Authentication on the Gmail account
3. Go to **Google Account → Security → App Passwords**
4. Generate a new App Password for "StayConnect"
5. Provide the following:
   - [ ] **Gmail Address** (e.g., `noreply@stayconnect.ng`)
   - [ ] **App Password** (16-character code generated)

**Cost:** Free

---

## 8. Backend Hosting & Database (REQUIRED for Production)

**Purpose:** Host the backend API and database so the app works from anywhere.

### Option A: Railway (Recommended)
1. Go to: https://railway.app
2. Sign up with GitHub
3. Create a new project
4. Add PostgreSQL database
5. Deploy the backend from GitHub
6. Provide:
   - [ ] **Backend URL** (e.g., `https://stayconnect-production.up.railway.app`)

**Cost:** Free tier available, ~$5/month for production

### Option B: Render
1. Go to: https://render.com
2. Sign up with GitHub
3. Create a Web Service for backend
4. Create a PostgreSQL database
5. Provide:
   - [ ] **Backend URL** (e.g., `https://stayconnect-api.onrender.com`)

**Cost:** Free tier available, ~$7/month for production

---

## 9. Domain Name (RECOMMENDED)

**Purpose:** Professional API URL instead of hosting provider subdomain.

### Steps:
1. Go to: https://namecheap.com or https://domains.google
2. Search for available domain (e.g., `stayconnect.ng`, `stayconnectapp.com`)
3. Purchase the domain
4. Provide:
   - [ ] **Domain Name**
   - [ ] **DNS Access** (to point to backend)

**Cost:** ~$10-15/year

---

## 10. Error Monitoring - Sentry (RECOMMENDED)

**Purpose:** Track app crashes and errors in production.

### Steps:
1. Go to: https://sentry.io
2. Sign up for free account
3. Create a new project for "StayConnect"
4. Provide the following:
   - [ ] **Sentry DSN** (from Project Settings)

**Cost:** Free developer tier available

---

## Payment Information for MVP

**For the first MVP, we are using manual bank transfer payments:**

- Users transfer to your bank account
- Users upload payment proof (screenshot)
- Admin verifies payment manually

**Bank details needed in the app:**
- [ ] **Bank Name** (e.g., "First Bank of Nigeria")
- [ ] **Account Number** (e.g., "0123456789")
- [ ] **Account Name** (e.g., "StayConnect Nigeria Ltd")

These details will be shown to users when they make a booking.

---

## App Store Assets (REQUIRED before submission)

**Please provide the following assets for app store listings:**

### App Icon
- [ ] **App Icon** - 1024x1024 PNG (no transparency)

### Screenshots (minimum 2 each, recommended 4-5)
- [ ] **Phone Screenshots** - For each supported phone size
- [ ] **Tablet Screenshots** (optional)

### Graphics
- [ ] **Feature Graphic** - 1024x500 PNG (Google Play only)

### Required URLs
- [ ] **Privacy Policy URL** (e.g., `https://stayconnect.ng/privacy`)
- [ ] **Terms of Service URL** (e.g., `https://stayconnect.ng/terms`)

### App Description
- [ ] **Short Description** - 80 characters max (Google Play)
- [ ] **Full Description** - 4000 characters max
- [ ] **Keywords** - For App Store search

---

## Summary Checklist

| Service | Status | Credentials Needed |
|---------|--------|-------------------|
| Cloudinary | ⬜ Pending | Cloud Name, API Key, API Secret |
| Expo (Push Notifications) | ⬜ Already Set Up | Transfer ownership if needed |
| Google Play Console | ⬜ Pending | Admin Access or Service Account |
| Apple App Store | ⬜ Pending | Admin Access or API Key |
| Google Maps | ⬜ Pending | API Key |
| **LiveKit (Voice Calls)** | ⬜ **REQUIRED** | **API Key, Secret, Server URL** |
| Gmail SMTP (Email) | ⬜ Recommended | App Password |
| Backend Hosting | ⬜ Pending | Railway/Render URL |
| Domain Name | ⬜ Recommended | Domain, DNS Access |
| Sentry (Monitoring) | ⬜ Recommended | DSN |
| Bank Details (Payment) | ⬜ Pending | Bank Name, Account Number, Account Name |

---

## Important Notes

### Security
- Never share API keys via plain email. Use a secure password manager (e.g., 1Password, LastPass) or share via encrypted messaging.
- All secret keys will be stored securely in environment variables and never committed to code.

### Recommended Email for Accounts
Use a business email that multiple team members can access (e.g., `tech@yourcompany.com`) rather than personal emails.

### Domain Requirements
You'll need:
- A domain name for the backend API (e.g., `api.stayconnect.ng`)
- A domain for the website/marketing (e.g., `stayconnect.ng`)

---

## Next Steps After Receiving Credentials

Once all credentials are provided, I will:

1. ✅ Configure Cloudinary for image uploads (property photos, payment proofs)
2. ✅ Set up push notifications for booking alerts
3. ✅ Configure Google Maps for location features
4. ✅ Deploy backend to Railway/Render
5. ✅ Update app with production API URL
6. ✅ Build the Android APK/AAB for Play Store
7. ✅ Build the iOS IPA for App Store
8. ✅ Submit apps for review
9. ✅ Provide admin access credentials

---

## Estimated Timeline

| Phase | Duration |
|-------|----------|
| Receive all credentials | 1-2 days |
| Integrate services | 3-5 days |
| Testing | 2-3 days |
| App Store submission | 1-2 days |
| Review process | 1-3 days (Android), 1-7 days (iOS) |
| **Total** | **7-15 business days** |

---

## Contact

For questions or assistance with account creation:
- **Developer:** [Your Name]
- **Email:** [your-email@domain.com]
- **Phone:** [your-phone-number]

---

*Document prepared for StayConnect App Development Project*
*Version 2.0 | Date: March 2026*
*Updated: Removed Paystack for MVP, using manual bank transfer*
