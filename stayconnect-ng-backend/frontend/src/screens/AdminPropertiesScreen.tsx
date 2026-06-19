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
import { PendingProperty } from '../types/admin.types';
import PropertyModerationCard from '../components/PropertyModerationCard';

type AdminPropertiesNavigationProp = StackNavigationProp<AppStackParamList, 'AdminProperties'>;

const AdminPropertiesScreen: React.FC = () => {
  const navigation = useNavigation<AdminPropertiesNavigationProp>();

  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      const response = await adminService.getPendingProperties(pageNum, 20);

      if (append) {
        setProperties((prev) => [...prev, ...response.properties]);
      } else {
        setProperties(response.properties);
      }

      setHasMore(pageNum < response.meta.totalPages);
      setPage(pageNum);
    } catch (error: any) {
      console.error('Fetch pending properties error:', error);
      Alert.alert('Error', 'Failed to load pending properties. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadProperties = useCallback(async () => {
    await fetchProperties(1, false);
  }, [fetchProperties]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties(1, false);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProperties(page + 1, true);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleApprove = async (propertyId: string) => {
    try {
      setProcessingId(propertyId);
      await adminService.approveProperty(propertyId);

      // Send notification
      await notificationService.sendLocalNotification({
        title: 'Property Approved',
        body: 'A property listing has been approved.',
        data: { type: 'general' },
      });

      // Remove from list
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      Alert.alert('Success', 'Property has been approved.');
    } catch (error: any) {
      console.error('Approve property error:', error);
      Alert.alert('Error', 'Failed to approve property. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (propertyId: string) => {
    try {
      setProcessingId(propertyId);
      await adminService.rejectProperty(propertyId);

      // Remove from list
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      Alert.alert('Success', 'Property has been rejected.');
    } catch (error: any) {
      console.error('Reject property error:', error);
      Alert.alert('Error', 'Failed to reject property. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderProperty = ({ item }: { item: PendingProperty }) => (
    <PropertyModerationCard
      property={item}
      onApprove={handleApprove}
      onReject={handleReject}
      isProcessing={processingId === item.id}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🏠</Text>
      <Text style={styles.emptyTitle}>No pending properties</Text>
      <Text style={styles.emptySubtitle}>
        All property listings have been reviewed
      </Text>
    </View>
  );

  if (loading && properties.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading properties...</Text>
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
        <Text style={styles.headerTitle}>Property Moderation</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={properties}
        renderItem={renderProperty}
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

export default AdminPropertiesScreen;
