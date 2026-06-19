import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import bookingService from '../services/bookingService';
import { Ionicons } from '@expo/vector-icons';

type BookingsNavProp = StackNavigationProp<AppStackParamList>;

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:   { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  CONFIRMED: { bg: '#D1FAE5', text: '#065F46', label: 'Confirmed' },
  CANCELLED: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
  COMPLETED: { bg: '#E0E7FF', text: '#3730A3', label: 'Completed' },
};

const BookingsTabScreen: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showError } = useToast();
  const navigation = useNavigation<BookingsNavProp>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (showLoading = true) => {
    if (!isAuthenticated) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : data?.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings(false);
  }, [fetchBookings]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0,
    }).format(price);

  const handleCallHost = (booking: any) => {
    // Determine the other party in this call
    const isHost = user?.role?.name === 'HOST';
    const otherUserId = isHost ? booking.guestId : booking.hostId || booking.property?.hostId;
    const otherUserName = isHost 
      ? (booking.guestName || 'Visitor') 
      : (booking.hostName || booking.property?.host?.firstName || 'Host');

    if (!otherUserId) {
      showError('Could not find user to call. Please try again later.');
      return;
    }

    navigation.navigate('VoiceCall', {
      bookingId: booking.id,
      otherUserId: otherUserId,
      otherUserName: otherUserName,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSub}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#059669" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🗓️</Text>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySub}>
              {isAuthenticated
                ? 'Your upcoming stays will appear here'
                : 'Sign in to see your bookings and manage your stays'}
            </Text>
            {!isAuthenticated ? (
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.exploreBtnText}>Sign In</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('MainTabs')}
              >
                <Text style={styles.exploreBtnText}>Explore Properties</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_COLORS[item.status] || STATUS_COLORS.PENDING;
          const canCall = item.status === 'CONFIRMED' || item.status === 'PENDING';
          
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.propertyId || item.property?.id })}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.property?.title || 'Property'}
                  </Text>
                  <Text style={styles.cardLocation} numberOfLines={1}>
                    📍 {item.property?.city}, {item.property?.state}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardBottom}>
                <View style={styles.dateRow}>
                  <View style={styles.datePill}>
                    <Text style={styles.dateLabel}>Check-in</Text>
                    <Text style={styles.dateValue}>{formatDate(item.checkIn || item.checkInDate)}</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={styles.datePill}>
                    <Text style={styles.dateLabel}>Check-out</Text>
                    <Text style={styles.dateValue}>{formatDate(item.checkOut || item.checkOutDate)}</Text>
                  </View>
                </View>
                <Text style={styles.price}>{formatPrice(item.totalAmount || item.totalPrice || 0)}</Text>
              </View>
              {canCall && (
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCallHost(item)}
                >
                  <Ionicons name="call" size={16} color="#fff" />
                  <Text style={styles.callButtonText}>Call {user?.role?.name === 'HOST' ? 'Visitor' : 'Host'}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F8FA' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 15 },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 4,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardLocation: { fontSize: 13, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  datePill: {},
  dateLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },
  dateValue: { fontSize: 13, fontWeight: '600', color: '#374151' },
  arrow: { fontSize: 16, color: '#D1D5DB' },
  price: { fontSize: 16, fontWeight: '800', color: '#059669' },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  exploreBtn: { marginTop: 24, backgroundColor: '#059669', paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14 },
  exploreBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  callButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

export default BookingsTabScreen;
