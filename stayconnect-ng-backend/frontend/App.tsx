// Import polyfills FIRST before any other imports
import './src/polyfills';

import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ToastProvider } from './src/context/ToastContext';
import { OfflineBanner } from './src/components/OfflineBanner';
import { initSentry } from './src/utils/sentry';

// Initialize error monitoring
initSentry();

const linking = {
  prefixes: ['stayconnect://', 'https://stayconnect.ng'],
  config: {
    screens: {
      PropertyDetails: 'property/:propertyId',
      MainTabs: {
        screens: {
          Home: 'home',
          Search: 'search',
          Bookings: 'bookings',
          Conversations: 'messages',
          Profile: 'profile',
        },
      },
    },
  },
};

// Main App component
// AppNavigator handles the full flow: Splash → Onboarding → Welcome → Auth → Main App
export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef} linking={linking}>
            <OfflineBanner />
            <StatusBar style="auto" />
            <AppNavigator navigationRef={navigationRef} />
          </NavigationContainer>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
