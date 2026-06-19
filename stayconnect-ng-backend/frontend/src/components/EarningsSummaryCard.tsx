import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EarningsSummary } from '../types/earnings.types';

interface EarningsSummaryCardProps {
  summary: EarningsSummary | null;
  onWithdrawPress?: () => void;
}

const EarningsSummaryCard: React.FC<EarningsSummaryCardProps> = ({
  summary,
  onWithdrawPress,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Earnings Summary</Text>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings Overview</Text>

      {/* Main Balance Card */}
      <View style={styles.mainCard}>
        <Text style={styles.mainCardLabel}>Available Balance</Text>
        <Text style={styles.mainCardAmount}>
          {formatPrice(summary.availableBalance)}
        </Text>
        {summary.availableBalance > 0 && onWithdrawPress && (
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={onWithdrawPress}
          >
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
            <Ionicons name="trending-up" size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>
            {formatPrice(summary.totalEarnings)}
          </Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
            <Ionicons name="time-outline" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>
            {formatPrice(summary.pendingEarnings)}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>
            {summary.totalBookings}
          </Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loadingCard: {
    backgroundColor: '#f5f5f5',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  mainCard: {
    backgroundColor: '#007AFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainCardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  mainCardAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  withdrawButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default EarningsSummaryCard;
