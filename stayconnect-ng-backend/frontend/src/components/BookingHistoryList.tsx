import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingEarning, EarningStatus } from '../types/earnings.types';

interface BookingHistoryListProps {
  bookings: BookingEarning[];
  onBookingPress?: (booking: BookingEarning) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const BookingHistoryList: React.FC<BookingHistoryListProps> = ({
  bookings,
  onBookingPress,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: EarningStatus): string => {
    switch (status) {
      case 'AVAILABLE':
        return '#34C759';
      case 'PENDING':
        return '#FF9500';
      case 'WITHDRAWN':
        return '#007AFF';
      case 'CANCELLED':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const renderBookingItem = ({ item }: { item: BookingEarning }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => onBookingPress?.(item)}
      activeOpacity={0.8}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.propertyTitle}
          </Text>
          <Text style={styles.guestName}>Guest: {item.guestName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}20` },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.amountsContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Booking Amount</Text>
          <Text style={styles.amountValue}>{formatPrice(item.amount)}</Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Platform Fee</Text>
          <Text style={[styles.amountValue, styles.feeValue]}>
            -{formatPrice(item.platformFee)}
          </Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={[styles.amountLabel, styles.hostLabel]}>Your Earnings</Text>
          <Text style={[styles.amountValue, styles.hostValue]}>
            {formatPrice(item.hostAmount)}
          </Text>
        </View>
      </View>

      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="receipt-outline" size={36} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptySubtitle}>
        Your booking history will appear here once guests start booking your properties.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={onLoadMore}
        disabled={isLoading}
      >
        <Text style={styles.loadMoreText}>
          {isLoading ? 'Loading...' : 'Load More'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  propertyInfo: {
    flex: 1,
    marginRight: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  guestName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  amountsContainer: {
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  feeValue: {
    color: '#FF3B30',
  },
  hostLabel: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  hostValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34C759',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(156,163,175,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 280,
  },
  loadMoreButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default BookingHistoryList;
