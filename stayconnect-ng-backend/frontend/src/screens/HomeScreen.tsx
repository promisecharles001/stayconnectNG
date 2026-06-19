import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import propertyService from '../services/propertyService';
import { Property } from '../types/property.types';
import { useMountedRef } from '../hooks/useMountedRef';
import { PropertyListSkeleton } from '../components/Skeleton';
import Cache from '../utils/cache';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps-outline' as const },
  { id: 'apartment', label: 'Apartments', icon: 'business-outline' as const },
  { id: 'house', label: 'Houses', icon: 'home-outline' as const },
  { id: 'villa', label: 'Villas', icon: 'leaf-outline' as const },
  { id: 'studio', label: 'Studios', icon: 'cube-outline' as const },
  { id: 'penthouse', label: 'Penthouse', icon: 'diamond-outline' as const },
];

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const isMounted = useMountedRef();

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProperties = useCallback(async (showLoading: boolean = true) => {
    try {
      if (showLoading && isMounted.current) setLoading(true);
      if (isMounted.current) setError(null);

      // Try cache first for instant display
      const cached = await Cache.get<Property[]>('properties');
      if (cached && isMounted.current) {
        setProperties(cached);
        setFilteredProperties(cached);
      }

      const response = await propertyService.getProperties({ limit: 50 });
      const propertiesArray = response?.data || [];

      // Update cache and state
      await Cache.set('properties', propertiesArray);
      if (isMounted.current) {
        setProperties(propertiesArray);
        setFilteredProperties(propertiesArray);
      }
    } catch (err: any) {
      if (isMounted.current) setError(err.message || 'Failed to fetch properties');
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    let result = properties;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'all') {
      result = result.filter(
        (p) =>
          (p.type?.toLowerCase() === activeCategory) ||
          (p.propertyType?.toLowerCase() === activeCategory)
      );
    }
    setFilteredProperties(result);
  }, [searchQuery, properties, activeCategory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties(false);
  }, [fetchProperties]);

  const handlePropertyPress = (property: Property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // ─── Sub-renders ─────────────────────────────────────────────────────────────

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>{getHour()}</Text>
          <Text style={styles.headerTitle}>
            {user ? user.firstName : 'Visitor'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {user?.role?.name === 'ADMIN' && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Ionicons name="shield-checkmark-outline" size={20} color="#F59E0B" />
            </TouchableOpacity>
          )}
          {(user?.role?.name === 'HOST' || user?.role?.name === 'ADMIN') && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('HostDashboard')}
            >
              <Ionicons name="home-outline" size={20} color="#059669" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.iconBtn, styles.mapBtn]}
            onPress={() => navigation.navigate('Map')}
          >
            <Ionicons name="map-outline" size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBox}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('SearchResults', { query: '' })}
      >
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search city, area or property..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() =>
            navigation.navigate('SearchResults', { query: searchQuery })
          }
          returnKeyType="search"
          editable={true}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              isActive && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon}
              size={16}
              color={isActive ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.categoryLabel,
                isActive && styles.categoryLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {searchQuery ? `Results for "${searchQuery}"` : 'Available Stays'}
      </Text>
      <Text style={styles.sectionCount}>
        {filteredProperties.length} {filteredProperties.length === 1 ? 'place' : 'places'}
      </Text>
    </View>
  );

  const renderPropertyCard = ({ item }: { item: Property }) => {
    const imgUrl =
      item.images && item.images.length > 0
        ? item.images[0]
        : `https://picsum.photos/seed/${item.id}/400/300`;

    return (
      <TouchableOpacity
        style={[styles.card, { width: (width - 12 * 3) / 2 }]}
        onPress={() => handlePropertyPress(item)}
        activeOpacity={0.93}
        accessibilityLabel={`View ${item.title}`}
        accessibilityRole="button"
      >
        <View style={styles.cardImageWrap}>
          <Image source={{ uri: imgUrl }} style={styles.cardImage} resizeMode="cover" />
          {/* Type badge */}
          {item.type && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
          )}
          {/* Wishlist */}
          <TouchableOpacity style={styles.heartBtn}>
            <Ionicons name="heart-outline" size={16} color="#059669" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.cardLocationRow}>
            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
            <Text style={styles.cardLocation} numberOfLines={1}>
              {item.city}, {item.state}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardPrice}>{formatPrice(item.pricePerNight)}</Text>
              <Text style={styles.cardPerNight}>/ night</Text>
            </View>
            {item.rating != null && (
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons
          name={searchQuery ? 'search-outline' : 'home-outline'}
          size={40}
          color="#9CA3AF"
        />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No matches found' : 'No properties yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term or category'
          : 'Check back soon for new listings'}
      </Text>
      {searchQuery ? (
        <TouchableOpacity
          style={styles.clearSearchBtn}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (loading && properties.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <PropertyListSkeleton count={6} />
      </SafeAreaView>
    );
  }

  if (error && properties.length === 0) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="cloud-offline-outline" size={40} color="#9CA3AF" />
        </View>
        <Text style={styles.errorTitle}>Could not load properties</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchProperties()}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderCategories()}
            {renderSectionHeader()}
          </>
        }
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  // ── Header ──
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,231,235,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  mapBtn: {
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderColor: 'rgba(99,102,241,0.15)',
  },

  // ── Search Box ──
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
  },

  // ── Categories ──
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(229,231,235,0.5)',
    gap: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ── Property Card ──
  columnWrapper: {
    paddingHorizontal: 12,
    gap: 12,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardImageWrap: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(5,150,105,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  cardLocation: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  cardPerNight: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },

  // ── States ──
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  retryBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(156,163,175,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
  clearSearchBtn: {
    marginTop: 20,
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 12,
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default HomeScreen;
