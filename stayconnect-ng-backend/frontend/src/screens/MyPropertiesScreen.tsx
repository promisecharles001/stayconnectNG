import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import propertyService from '../services/propertyService';
import { Property, PropertyStatus } from '../types/property.types';

type MyPropertiesNavigationProp = StackNavigationProp<AppStackParamList, 'MyProperties'>;

const STATUS_CONFIG: Record<PropertyStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' },
  PENDING_APPROVAL: { label: 'Pending Review', color: '#F59E0B', bg: '#FEF3C7' },
  APPROVED: { label: 'Live', color: '#059669', bg: '#D1FAE5' },
  REJECTED: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2' },
  SUSPENDED: { label: 'Suspended', color: '#7C3AED', bg: '#EDE9FE' },
  INACTIVE: { label: 'Inactive', color: '#6B7280', bg: '#F3F4F6' },
};

const MyPropertiesScreen: React.FC = () => {
  const navigation = useNavigation<MyPropertiesNavigationProp>();
  const { user } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const fetchProperties = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1 && !append) {
        setLoading(true);
      }

      const response = await propertyService.getMyProperties({ page: pageNum, limit: 20 });

      if (append) {
        setProperties((prev) => [...prev, ...response.data]);
      } else {
        setProperties(response.data);
      }

      setHasMore(response.meta.page < response.meta.totalPages);
      setPage(response.meta.page);
    } catch (error: any) {
      console.error('Error fetching my properties:', error);
      Alert.alert('Error', error.message || 'Failed to load your properties.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties(1, false);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      fetchProperties(page + 1, true);
    }
  };

  const handleDelete = (property: Property) => {
    Alert.alert(
      'Delete Property',
      `Are you sure you want to delete "${property.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(property.id);
            try {
              await propertyService.deleteProperty(property.id);
              setProperties((prev) => prev.filter((p) => p.id !== property.id));
              Alert.alert('Deleted', 'Property has been deleted.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete property.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (property: Property) => {
    navigation.navigate('EditProperty', { property });
  };

  const handleView = (property: Property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
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
    fetchProperties();
  }, [fetchProperties]);

  const renderPropertyCard = ({ item }: { item: Property }) => {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.DRAFT;
    const coverImage = item.images && item.images.length > 0 ? item.images[0] : null;
    const isDeleting = deletingId === item.id;

    return (
      <View style={styles.card}>
        {/* Cover Image */}
        <TouchableOpacity onPress={() => handleView(item)} activeOpacity={0.9}>
          <View style={styles.imageContainer}>
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color="#6B7280" /> {item.city}, {item.state}
          </Text>
          <Text style={styles.propertyPrice}>
            {formatPrice(item.basePricePerNight)} <Text style={styles.perNight}>/ night</Text>
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}>{item.maxGuests} guests</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="bed-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}>{item.bedrooms} br</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="water-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}>{item.bathrooms} ba</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={() => handleView(item)}>
              <Ionicons name="eye-outline" size={16} color="#059669" />
              <Text style={[styles.actionText, { color: '#059669' }]}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEdit(item)}>
              <Ionicons name="create-outline" size={16} color="#007AFF" />
              <Text style={[styles.actionText, { color: '#007AFF' }]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text style={[styles.actionText, { color: '#DC2626' }]}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="home-outline" size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No Properties Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start earning by listing your first property on StayConnect NG.
      </Text>
      <TouchableOpacity style={styles.emptyAddButton} onPress={() => navigation.navigate('AddProperty')}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.emptyAddButtonText}>List Your First Property</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
      </Text>
      <TouchableOpacity style={styles.headerAddButton} onPress={() => navigation.navigate('AddProperty')}>
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={styles.headerAddButtonText}>Add New</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && properties.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Properties</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading your properties...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Properties</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AddProperty')}>
          <Ionicons name="add" size={24} color="#059669" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={properties.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#059669" />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  headerAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  headerAddButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardContent: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 10,
  },
  perNight: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#ECFDF5',
  },
  editButton: {
    backgroundColor: '#EFF6FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MyPropertiesScreen;
