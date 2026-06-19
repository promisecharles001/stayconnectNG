import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingsTabScreen from '../screens/BookingsTabScreen';

export type MainTabParamList = {
  Explore: undefined;
  Wishlists: undefined;
  Bookings: undefined;
  Inbox: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// ── Tab icon component ───────────────────────────────────────────────────────
interface TabIconProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ iconName, label, focused }) => (
  <View style={tabStyles.iconWrap}>
    <Ionicons 
      name={iconName} 
      size={24} 
      color={focused ? '#059669' : '#9CA3AF'} 
    />
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  labelActive: {
    color: '#059669',
    fontWeight: '700',
  },
});

// ── Navigator ────────────────────────────────────────────────────────────────
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(229,231,235,0.4)',
          height: Platform.OS === 'ios' ? 82 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'search' : 'search-outline'} label="Explore" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Wishlists"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'heart' : 'heart-outline'} label="Wishlists" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsTabScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'calendar' : 'calendar-outline'} label="Bookings" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={ConversationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} label="Inbox" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName={focused ? 'person' : 'person-outline'} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
