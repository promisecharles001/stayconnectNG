import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Withdrawal, WithdrawalStatus } from '../types/withdrawal.types';

interface WithdrawalHistoryListProps {
  withdrawals: Withdrawal[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const WithdrawalHistoryList: React.FC<WithdrawalHistoryListProps> = ({
  withdrawals,
  loading,
  refreshing,
  onRefresh,
  onLoadMore,
  hasMore,
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

  const getStatusColor = (status: WithdrawalStatus): string => {
    switch (status) {
      case 'PENDING':
        return '#FF9500'; // Orange
      case 'APPROVED':
        return '#007AFF'; // Blue
      case 'PAID':
        return '#34C759'; // Green
      case 'REJECTED':
        return '#FF3B30'; // Red
      default:
        return '#999';
    }
  };

  const getStatusBackgroundColor = (status: WithdrawalStatus): string => {
    switch (status) {
      case 'PENDING':
        return '#FFF3E0'; // Light orange
      case 'APPROVED':
        return '#E3F2FD'; // Light blue
      case 'PAID':
        return '#E8F5E9'; // Light green
      case 'REJECTED':
        return '#FFEBEE'; // Light red
      default:
        return '#F5F5F5';
    }
  };

  const renderStatusBadge = (status: WithdrawalStatus) => (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: getStatusBackgroundColor(status) },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: getStatusColor(status) },
        ]}
      />
      <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
        {status}
      </Text>
    </View>
  );

  const renderWithdrawalItem = ({ item }: { item: Withdrawal }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.amount}>{formatPrice(item.amount)}</Text>
        {renderStatusBadge(item.status)}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text style={styles.accountNumber}>•••• {item.accountNumber.slice(-4)}</Text>
      </View>

      <Text style={styles.date}>{formatDate(item.createdAt)}</Text>

      {item.rejectionReason && (
        <View style={styles.rejectionContainer}>
          <Text style={styles.rejectionLabel}>Reason:</Text>
          <Text style={styles.rejectionText}>{item.rejectionReason}</Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💰</Text>
      <Text style={styles.emptyTitle}>No withdrawals yet</Text>
      <Text style={styles.emptySubtitle}>
        Your withdrawal history will appear here
      </Text>
    </View>
  );

  if (loading && withdrawals.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading withdrawals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdrawal History</Text>

      {withdrawals.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={withdrawals}
          renderItem={renderWithdrawalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  accountNumber: {
    fontSize: 14,
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rejectionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default WithdrawalHistoryList;
