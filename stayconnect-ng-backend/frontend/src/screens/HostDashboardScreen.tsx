import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import EarningsSummaryCard from '../components/EarningsSummaryCard';
import BookingHistoryList from '../components/BookingHistoryList';
import earningsService from '../services/earningsService';
import { EarningsSummary, BookingEarning } from '../types/earnings.types';

type HostDashboardNavigationProp = StackNavigationProp<AppStackParamList, 'HostDashboard'>;

const HostDashboardScreen: React.FC = () => {
  const navigation = useNavigation<HostDashboardNavigationProp>();
  const { user } = useAuth();

  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [bookings, setBookings] = useState<BookingEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Check if user is a host
  useEffect(() => {
    if (user && user.role.name !== 'HOST' && user.role.name !== 'ADMIN') {
      Alert.alert(
        'Access Denied',
        'This section is only available for hosts.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [user, navigation]);

  const fetchDashboardData = useCallback(async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      // Fetch summary and first page of bookings in parallel
      const [summaryResponse, bookingsResponse] = await Promise.all([
        earningsService.getEarningsSummary(),
        earningsService.getEarningsBookings(1, 20),
      ]);

      setSummary(summaryResponse);
      setBookings(bookingsResponse.data);
      setHasMore(bookingsResponse.meta.page < bookingsResponse.meta.totalPages);
      setPage(1);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load dashboard data. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMoreBookings = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const response = await earningsService.getEarningsBookings(nextPage, 20);

      setBookings((prev) => [...prev, ...response.data]);
      setHasMore(response.meta.page < response.meta.totalPages);
      setPage(nextPage);
    } catch (error: any) {
      console.error('Error loading more bookings:', error);
      Alert.alert('Error', 'Failed to load more bookings.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  const handleWithdrawPress = () => {
    navigation.navigate('Withdrawal');
  };

  const handleBookingPress = (booking: BookingEarning) => {
    // Navigate to booking details (to be implemented)
    Alert.alert(
      'Booking Details',
      `Property: ${booking.propertyTitle}\nGuest: ${booking.guestName}\nAmount: ${formatPrice(booking.hostAmount)}`
    );
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
        <Text style={styles.headerTitle}>Host Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Earnings Summary */}
        <EarningsSummaryCard
          summary={summary}
          onWithdrawPress={handleWithdrawPress}
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MyProperties')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: 'rgba(8,145,178,0.1)' }]}>
                <Ionicons name="home-outline" size={22} color="#0891B2" />
              </View>
              <Text style={styles.quickActionText}>My Properties</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AddProperty')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: 'rgba(5,150,105,0.1)' }]}>
                <Ionicons name="add-circle-outline" size={22} color="#059669" />
              </View>
              <Text style={styles.quickActionText}>Add Property</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('HostVerification')}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: 'rgba(139,92,246,0.1)' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionText}>Verification</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Booking History */}
        <BookingHistoryList
          bookings={bookings}
          onBookingPress={handleBookingPress}
          onLoadMore={loadMoreBookings}
          hasMore={hasMore}
          isLoading={isLoadingMore}
        />

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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  quickActionsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HostDashboardScreen;
