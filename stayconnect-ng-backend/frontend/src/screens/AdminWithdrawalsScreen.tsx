import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import adminService from '../services/adminService';
import notificationService from '../services/notificationService';
import { PendingWithdrawal } from '../types/admin.types';
import WithdrawalApprovalCard from '../components/WithdrawalApprovalCard';

type AdminWithdrawalsNavigationProp = StackNavigationProp<AppStackParamList, 'AdminWithdrawals'>;

const AdminWithdrawalsScreen: React.FC = () => {
  const navigation = useNavigation<AdminWithdrawalsNavigationProp>();

  const [withdrawals, setWithdrawals] = useState<PendingWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchWithdrawals = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      const response = await adminService.getPendingWithdrawals(pageNum, 20);

      if (append) {
        setWithdrawals((prev) => [...prev, ...response.withdrawals]);
      } else {
        setWithdrawals(response.withdrawals);
      }

      setHasMore(pageNum < response.meta.totalPages);
      setPage(pageNum);
    } catch (error: any) {
      console.error('Fetch pending withdrawals error:', error);
      Alert.alert('Error', 'Failed to load pending withdrawals. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadWithdrawals = useCallback(async () => {
    await fetchWithdrawals(1, false);
  }, [fetchWithdrawals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWithdrawals(1, false);
  }, [fetchWithdrawals]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchWithdrawals(page + 1, true);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, [loadWithdrawals]);

  const handleApprove = async (withdrawalId: string) => {
    try {
      setProcessingId(withdrawalId);
      await adminService.approveWithdrawal(withdrawalId);

      // Send notification
      await notificationService.sendLocalNotification({
        title: 'Withdrawal Approved',
        body: 'A withdrawal request has been approved.',
        data: { type: 'general' },
      });

      // Update status in list
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === withdrawalId ? { ...w, status: 'APPROVED' as const } : w
        )
      );
      Alert.alert('Success', 'Withdrawal has been approved.');
    } catch (error: any) {
      console.error('Approve withdrawal error:', error);
      Alert.alert('Error', 'Failed to approve withdrawal. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    try {
      setProcessingId(withdrawalId);
      await adminService.rejectWithdrawal(withdrawalId);

      // Remove from list
      setWithdrawals((prev) => prev.filter((w) => w.id !== withdrawalId));
      Alert.alert('Success', 'Withdrawal has been rejected.');
    } catch (error: any) {
      console.error('Reject withdrawal error:', error);
      Alert.alert('Error', 'Failed to reject withdrawal. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkPaid = async (withdrawalId: string) => {
    try {
      setProcessingId(withdrawalId);
      await adminService.markWithdrawalPaid(withdrawalId);

      // Send notification
      await notificationService.sendLocalNotification({
        title: 'Withdrawal Paid',
        body: 'A withdrawal has been marked as paid.',
        data: { type: 'general' },
      });

      // Remove from list
      setWithdrawals((prev) => prev.filter((w) => w.id !== withdrawalId));
      Alert.alert('Success', 'Withdrawal has been marked as paid.');
    } catch (error: any) {
      console.error('Mark paid error:', error);
      Alert.alert('Error', 'Failed to mark withdrawal as paid. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderWithdrawal = ({ item }: { item: PendingWithdrawal }) => (
    <WithdrawalApprovalCard
      withdrawal={item}
      onApprove={handleApprove}
      onReject={handleReject}
      onMarkPaid={handleMarkPaid}
      isProcessing={processingId === item.id}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💸</Text>
      <Text style={styles.emptyTitle}>No pending withdrawals</Text>
      <Text style={styles.emptySubtitle}>
        All withdrawal requests have been processed
      </Text>
    </View>
  );

  if (loading && withdrawals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading withdrawals...</Text>
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
        <Text style={styles.headerTitle}>Withdrawal Approvals</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={withdrawals}
        renderItem={renderWithdrawal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdminWithdrawalsScreen;
