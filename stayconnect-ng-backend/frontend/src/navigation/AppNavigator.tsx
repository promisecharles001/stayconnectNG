import React, { useState, useEffect, RefObject } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import VoiceCallScreen from '../screens/VoiceCallScreen';
import PropertyDetailsScreen from '../screens/PropertyDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import UploadPaymentScreen from '../screens/UploadPaymentScreen';
import MapScreen from '../screens/MapScreen';
import HostDashboardScreen from '../screens/HostDashboardScreen';
import WriteReviewScreen from '../screens/WriteReviewScreen';
import ChatScreen from '../screens/ChatScreen';
import WithdrawalScreen from '../screens/WithdrawalScreen';
import HostVerificationScreen from '../screens/HostVerificationScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminPropertiesScreen from '../screens/AdminPropertiesScreen';
import AdminWithdrawalsScreen from '../screens/AdminWithdrawalsScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
import MyPropertiesScreen from '../screens/MyPropertiesScreen';
import EditPropertyScreen from '../screens/EditPropertyScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LegalDocumentScreen from '../screens/LegalDocumentScreen';
import HelpCentreScreen from '../screens/HelpCentreScreen';
import { SearchFilters } from '../types/search.types';
import type { Property } from '../types/property.types';

// Define the param list for AppNavigator
export type AppStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  MainTabs: undefined;
  VoiceCall: {
    bookingId?: string;
    propertyId?: string;
    otherUserId: string;
    otherUserName: string;
  };
  PropertyDetails: {
    propertyId: string;
  };
  Booking: {
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    propertyLocation: string;
    pricePerNight: number;
  };
  UploadPayment: {
    bookingId: string;
    bookingReference: string;
    totalAmount: number;
  };
  Map: undefined;
  HostDashboard: undefined;
  WriteReview: {
    propertyId: string;
    propertyTitle: string;
    bookingId?: string;
  };
  Wishlist: undefined;
  Conversations: undefined;
  Chat: {
    conversationId: string;
    propertyTitle?: string;
    otherUserName?: string;
  };
  Withdrawal: undefined;
  HostVerification: undefined;
  AdminDashboard: undefined;
  AdminProperties: undefined;
  AdminWithdrawals: undefined;
  AdminUsers: undefined;
  SearchResults: {
    query?: string;
    initialFilters?: SearchFilters;
  };
  AddProperty: undefined;
  MyProperties: undefined;
  EditProperty: {
    property: Property;
  };
  LegalDocument: {
    title: string;
    type: 'terms' | 'privacy';
  };
  HelpCentre: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

interface AppNavigatorProps {
  navigationRef: RefObject<NavigationContainerRef<any>>;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ navigationRef }) => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setOnboardingChecked(true);
      }
    };
    checkOnboarding();
  }, []);

  // Navigate to MainTabs when user becomes authenticated
  // This handles login/register success automatically
  useEffect(() => {
    if (isAuthenticated && isSplashFinished && hasSeenOnboarding && navigationRef.current?.isReady()) {
      // Redirect admin users to AdminDashboard, others to MainTabs
      const isAdmin = user?.role?.name === 'ADMIN';
      try {
        const state = navigationRef.current.getRootState();
        if (!state || !state.routes || !state.routes.length) return;

        const currentRoute = state.routes[state.index];

        // Only reset if we are not already on the correct target
        const targetRoute = isAdmin ? 'AdminDashboard' : 'MainTabs';
        if (currentRoute?.name !== targetRoute) {
          navigationRef.current.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: targetRoute }],
            })
          );
        }
      } catch (error) {
        console.warn('Navigation redirect error (auth):', error);
      }
    }
  }, [isAuthenticated, isSplashFinished, hasSeenOnboarding, navigationRef, user]);

  // For anonymous users, ensure we land on MainTabs after splash/onboarding
  useEffect(() => {
    if (!isAuthenticated && isSplashFinished && hasSeenOnboarding && navigationRef.current?.isReady()) {
      try {
        const state = navigationRef.current.getRootState();
        if (!state || !state.routes || !state.routes.length) return;

        const currentRoute = state.routes[state.index];
        // Only reset if we're stuck on Welcome or auth screens
        if (currentRoute?.name === 'Welcome' || currentRoute?.name === 'Login' || currentRoute?.name === 'Register') {
          navigationRef.current.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            })
          );
        }
      } catch (error) {
        console.warn('Navigation redirect error (anon):', error);
      }
    }
  }, [isAuthenticated, isSplashFinished, hasSeenOnboarding, navigationRef]);

  const handleSplashFinish = () => {
    setIsSplashFinished(true);
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  // Show splash screen first
  if (!isSplashFinished) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Wait for onboarding check
  if (!onboardingChecked || authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: '#fff', borderTopColor: 'transparent' }} />
        </View>
      </View>
    );
  }

  // Show onboarding if not seen (for all users — auth and anonymous)
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
          color: '#1a1a1a',
        },
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* Main tab layout */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Detail / modal screens pushed on top of the tabs */}
      <Stack.Screen
        name="VoiceCall"
        component={VoiceCallScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadPayment"
        component={UploadPaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HostDashboard"
        component={HostDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Withdrawal"
        component={WithdrawalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HostVerification"
        component={HostVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminProperties"
        component={AdminPropertiesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminWithdrawals"
        component={AdminWithdrawalsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddProperty"
        component={AddPropertyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyProperties"
        component={MyPropertiesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProperty"
        component={EditPropertyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LegalDocument"
        component={LegalDocumentScreen}
        options={({ route }) => ({ title: route.params.title, headerShown: true })}
      />
      <Stack.Screen
        name="HelpCentre"
        component={HelpCentreScreen}
        options={{ title: 'Help Centre', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
