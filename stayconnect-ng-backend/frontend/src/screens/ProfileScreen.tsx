import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';

type ProfileNavigationProp = StackNavigationProp<AppStackParamList>;

const ProfileScreen: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigation = useNavigation<ProfileNavigationProp>();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
          } catch (e) {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const getRoleBadge = () => {
    const roleName = user?.role?.name;
    if (roleName === 'ADMIN') return { label: 'Admin', color: '#FF9500', bg: '#FFF3E0' };
    if (roleName === 'HOST') return { label: 'Host', color: '#34C759', bg: '#E8F5E9' };
    return { label: 'Visitor', color: '#007AFF', bg: '#E8F4FD' };
  };

  const role = getRoleBadge();

  // ─── Anonymous User View ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" />

        {/* Anonymous Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.name}>Welcome to StayConnect NG</Text>
          <Text style={[styles.email, { maxWidth: 320 }]}>
            Sign in to book, message hosts & manage stays.
          </Text>
        </View>

        {/* Auth Buttons */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 4 }}>
            <TouchableOpacity
              style={[styles.authButton, styles.signInButton]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.createButton]}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.85}
            >
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it Works */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.howItWorksTitle}>How it works</Text>
          <View style={styles.howItWorksRow}>
            {[
              { icon: 'search', label: 'Search', sub: 'nearby rooms' },
              { icon: 'call', label: 'Call', sub: 'host instantly' },
              { icon: 'navigate', label: 'Navigate', sub: 'with map' },
              { icon: 'card', label: 'Pay', sub: '& move in' },
            ].map((item, idx) => (
              <View key={idx} style={styles.howItWorksItem}>
                <View style={styles.howItWorksIconCircle}>
                  <Ionicons name={item.icon as any} size={22} color="#059669" />
                </View>
                <Text style={styles.howItWorksLabel}>{item.label}</Text>
                <Text style={styles.howItWorksSub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => navigation.navigate('HelpCentre')} activeOpacity={0.7}>
              <View style={styles.menuIconWrap}>
                <Ionicons name="help-circle-outline" size={22} color="#6366F1" />
              </View>
              <Text style={styles.menuLabel}>Help Centre</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('LegalDocument', { title: 'Terms of Service', type: 'terms' })} activeOpacity={0.7}>
              <View style={styles.menuIconWrap}>
                <Ionicons name="document-text-outline" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.menuLabel}>Terms & Privacy</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Authenticated User View ──────────────────────────────────────────────

  const menuSections = [
    {
      title: 'Account',
      items: [
        { iconName: 'calendar-outline' as const, iconColor: '#3B82F6', iconBg: 'rgba(59,130,246,0.08)', label: 'My Bookings', onPress: () => navigation.navigate('Bookings' as any) },
        { iconName: 'chatbubble-ellipses-outline' as const, iconColor: '#10B981', iconBg: 'rgba(16,185,129,0.08)', label: 'Messages', onPress: () => navigation.navigate('Inbox' as any) },
        { iconName: 'heart-outline' as const, iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.08)', label: 'Saved Properties', onPress: () => navigation.navigate('Wishlists' as any) },
        { iconName: 'notifications-outline' as const, iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.08)', label: 'Notifications', onPress: () => {} },
      ],
    },
    {
      title: 'Hosting',
      items: [
        {
          iconName: 'speedometer-outline' as const, iconColor: '#059669', iconBg: 'rgba(5,150,105,0.08)',
          label: 'Host Dashboard',
          onPress: () => navigation.navigate('HostDashboard'),
          visible: user?.role?.name === 'HOST' || user?.role?.name === 'ADMIN',
        },
        {
          iconName: 'home-outline' as const, iconColor: '#0891B2', iconBg: 'rgba(8,145,178,0.08)',
          label: 'My Listings',
          onPress: () => navigation.navigate('MyProperties'),
          visible: user?.role?.name === 'HOST' || user?.role?.name === 'ADMIN',
        },
        {
          iconName: 'shield-checkmark-outline' as const, iconColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.08)',
          label: 'Host Verification',
          onPress: () => navigation.navigate('HostVerification'),
          visible: user?.role?.name === 'GUEST',
        },
        {
          iconName: 'wallet-outline' as const, iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.08)',
          label: 'Earnings & Withdrawals',
          onPress: () => navigation.navigate('Withdrawal'),
          visible: user?.role?.name === 'HOST' || user?.role?.name === 'ADMIN',
        },
      ].filter((i) => i.visible !== false),
    },
    {
      title: 'Admin',
      items: [
        {
          iconName: 'shield-checkmark-outline' as const, iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.08)',
          label: 'Admin Dashboard',
          onPress: () => navigation.navigate('AdminDashboard'),
          visible: user?.role?.name === 'ADMIN',
        },
      ].filter((i) => i.visible !== false),
      visible: user?.role?.name === 'ADMIN',
    },
    {
      title: 'Support',
      items: [
        { iconName: 'help-circle-outline' as const, iconColor: '#6366F1', iconBg: 'rgba(99,102,241,0.08)', label: 'Help Centre', onPress: () => navigation.navigate('HelpCentre') },
        { iconName: 'document-text-outline' as const, iconColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.08)', label: 'Terms & Privacy', onPress: () => navigation.navigate('LegalDocument', { title: 'Terms of Service', type: 'terms' }) },
      ],
    },
  ].filter((s) => s.visible !== false && s.items.length > 0);

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: role.bg }]}>
          <Text style={[styles.roleText, { color: role.color }]}>{role.label}</Text>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  idx < section.items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.iconName} size={20} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Log Out */}
      <View style={[styles.section, { marginTop: 24 }]}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8} disabled={loggingOut}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>{loggingOut ? 'Logging out...' : 'Log Out'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,231,235,0.4)',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(99,102,241,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  menuChevron: {
    fontSize: 22,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.06)',
    paddingVertical: 15,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 14,
  },
  howItWorksTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  howItWorksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  howItWorksItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  howItWorksIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  howItWorksLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  howItWorksSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  authButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  signInButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;
