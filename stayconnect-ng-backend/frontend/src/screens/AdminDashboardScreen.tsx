import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import adminService from '../services/adminService';
import { AdminStats } from '../types/admin.types';
import AdminStatCard from '../components/AdminStatCard';
import { useAuth } from '../context/AuthContext';

type AdminDashboardNavigationProp = StackNavigationProp<AppStackParamList, 'AdminDashboard'>;

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role.name !== 'ADMIN') {
      Alert.alert(
        'Access Denied',
        'This section is only available for administrators.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [user, navigation]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getAdminStats();
      setStats(data);
    } catch (error: any) {
      console.error('Fetch admin stats error:', error);
      Alert.alert('Error', 'Failed to load admin statistics. Please try again.');
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await fetchStats();
    setLoading(false);
  }, [fetchStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, [fetchStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Overview</Text>
          <AdminStatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            iconName="people-outline"
            color="#3B82F6"
          />
          <AdminStatCard
            title="Total Properties"
            value={stats?.totalProperties || 0}
            iconName="home-outline"
            color="#10B981"
          />
          <AdminStatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            iconName="calendar-outline"
            color="#F59E0B"
          />
          <AdminStatCard
            title="Platform Revenue"
            value={formatPrice(stats?.platformRevenue || 0)}
            iconName="wallet-outline"
            color="#8B5CF6"
          />
        </View>

        {/* Moderation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moderation</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminProperties')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
              <Ionicons name="home-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Property Moderation</Text>
              <Text style={styles.menuSubtitle}>Review and approve property listings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminWithdrawals')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(139,92,246,0.1)' }]}>
              <Ionicons name="wallet-outline" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Withdrawal Approvals</Text>
              <Text style={styles.menuSubtitle}>Manage host withdrawal requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
              <Ionicons name="people-outline" size={24} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>User Management</Text>
              <Text style={styles.menuSubtitle}>Suspend or activate user accounts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,231,235,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  logoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(59,130,246,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default AdminDashboardScreen;
