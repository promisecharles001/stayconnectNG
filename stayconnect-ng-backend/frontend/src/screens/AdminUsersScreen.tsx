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
import { PlatformUser } from '../types/admin.types';
import UserManagementCard from '../components/UserManagementCard';

type AdminUsersNavigationProp = StackNavigationProp<AppStackParamList, 'AdminUsers'>;

const AdminUsersScreen: React.FC = () => {
  const navigation = useNavigation<AdminUsersNavigationProp>();

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      const response = await adminService.getUsers(pageNum, 20);

      if (append) {
        setUsers((prev) => [...prev, ...response.users]);
      } else {
        setUsers(response.users);
      }

      setHasMore(pageNum < response.meta.totalPages);
      setPage(pageNum);
    } catch (error: any) {
      console.error('Fetch users error:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    await fetchUsers(1, false);
  }, [fetchUsers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers(1, false);
  }, [fetchUsers]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchUsers(page + 1, true);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSuspend = async (userId: string) => {
    try {
      setProcessingId(userId);
      await adminService.suspendUser(userId);

      // Send notification
      await notificationService.sendLocalNotification({
        title: 'User Suspended',
        body: 'A user account has been suspended.',
        data: { type: 'general' },
      });

      // Update status in list
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: 'SUSPENDED' as const } : u
        )
      );
      Alert.alert('Success', 'User has been suspended.');
    } catch (error: any) {
      console.error('Suspend user error:', error);
      Alert.alert('Error', 'Failed to suspend user. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      setProcessingId(userId);
      await adminService.activateUser(userId);

      // Send notification
      await notificationService.sendLocalNotification({
        title: 'User Activated',
        body: 'A user account has been activated.',
        data: { type: 'general' },
      });

      // Update status in list
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: 'ACTIVE' as const } : u
        )
      );
      Alert.alert('Success', 'User has been activated.');
    } catch (error: any) {
      console.error('Activate user error:', error);
      Alert.alert('Error', 'Failed to activate user. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderUser = ({ item }: { item: PlatformUser }) => (
    <UserManagementCard
      user={item}
      onSuspend={handleSuspend}
      onActivate={handleActivate}
      isProcessing={processingId === item.id}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>👤</Text>
      <Text style={styles.emptyTitle}>No users found</Text>
      <Text style={styles.emptySubtitle}>
        There are no users in the system
      </Text>
    </View>
  );

  if (loading && users.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading users...</Text>
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
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
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

export default AdminUsersScreen;
