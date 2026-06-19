import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import withdrawalService from '../services/withdrawalService';
import earningsService from '../services/earningsService';
import notificationService from '../services/notificationService';
import { Withdrawal, CreateWithdrawalDto } from '../types/withdrawal.types';
import { EarningsSummary } from '../types/earnings.types';
import WithdrawalForm from '../components/WithdrawalForm';
import WithdrawalHistoryList from '../components/WithdrawalHistoryList';
import { useAuth } from '../context/AuthContext';

type WithdrawalScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Withdrawal'>;

const WithdrawalScreen: React.FC = () => {
  const navigation = useNavigation<WithdrawalScreenNavigationProp>();
  const { user } = useAuth();

  const [availableBalance, setAvailableBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  const fetchData = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      // Fetch earnings summary for available balance
      const earningsResponse = await earningsService.getEarningsSummary();
      setAvailableBalance(earningsResponse.availableBalance);

      // Fetch withdrawal history
      const withdrawalsResponse = await withdrawalService.getWithdrawalHistory(pageNum, 20);

      if (append) {
        setWithdrawals((prev) => [...prev, ...withdrawalsResponse.data]);
      } else {
        setWithdrawals(withdrawalsResponse.data);
      }

      setHasMore(pageNum < withdrawalsResponse.meta.totalPages);
      setPage(pageNum);
    } catch (error: any) {
      console.error('Fetch withdrawal data error:', error);
      Alert.alert('Error', 'Failed to load withdrawal data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(1, false);
  }, [fetchData]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchData(page + 1, true);
    }
  };

  const handleSubmitWithdrawal = async (data: CreateWithdrawalDto): Promise<void> => {
    try {
      setIsSubmitting(true);
      await withdrawalService.requestWithdrawal(data);

      // Send notification for withdrawal request
      await notificationService.sendLocalNotification({
        title: 'Withdrawal Requested',
        body: `Your withdrawal request of ${formatPrice(data.amount)} has been submitted`,
        data: { type: 'withdrawal' },
      });

      Alert.alert(
        'Withdrawal Requested',
        'Your withdrawal request has been submitted successfully. It will be processed within 1-3 business days.',
        [{ text: 'OK' }]
      );

      // Refresh data after successful submission
      await fetchData(1, false);
    } catch (error: any) {
      console.error('Withdrawal request error:', error);
      Alert.alert(
        'Request Failed',
        error.message || 'Failed to submit withdrawal request. Please try again.'
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading && withdrawals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawals</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Available Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available for Withdrawal</Text>
          <Text style={styles.balanceAmount}>{formatPrice(availableBalance)}</Text>
          <Text style={styles.balanceNote}>
            Minimum withdrawal: ₦1,000
          </Text>
        </View>

        {/* Withdrawal Form */}
        <WithdrawalForm
          availableBalance={availableBalance}
          onSubmit={handleSubmitWithdrawal}
          isSubmitting={isSubmitting}
        />

        {/* Withdrawal History */}
        <View style={styles.historyContainer}>
          <WithdrawalHistoryList
            withdrawals={withdrawals}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  balanceNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  historyContainer: {
    marginTop: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default WithdrawalScreen;
