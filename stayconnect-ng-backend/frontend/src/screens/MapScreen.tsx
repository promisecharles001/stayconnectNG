import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useToast } from '../context/ToastContext';
import PropertyMarker from '../components/PropertyMarker';
import propertyService from '../services/propertyService';
import locationService from '../services/locationService';
import { Property } from '../types/property.types';
import { Coordinates } from '../services/locationService';

type MapScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Map'>;

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const { showInfo } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map with user location and fetch properties
  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user location
      const location = await locationService.getCurrentLocation();
      
      if (location) {
        setUserLocation(location);
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        // Use default location (Lagos, Nigeria)
        const defaultLocation = locationService.getDefaultLocation();
        setUserLocation(defaultLocation);
        setMapRegion({
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        showInfo('Using default location. Enable location services for better results.');
      }

      // Fetch properties
      await fetchProperties();
    } catch (err: any) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getProperties({
        limit: 100, // Get more properties for map view
      });
      
      // response is PaginatedPropertiesResponse { data: Property[], meta: {...} }
      // Filter properties with valid coordinates
      const propertiesWithCoords = (response?.data || []).filter(
        (p) => p.latitude !== null && p.longitude !== null
      );
      
      setProperties(propertiesWithCoords);
    } catch (err: any) {
      console.error('Fetch properties error:', err);
      setError('Failed to load properties. Please try again.');
    }
  };

  const handlePropertyPress = useCallback((property: Property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
  }, [navigation]);

  const handleRecenter = async () => {
    const location = await locationService.getCurrentLocation();
    if (location && mapRegion) {
      setMapRegion({
        ...mapRegion,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  };

  const handleRegionChange = (region: Region) => {
    setMapRegion(region);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </SafeAreaView>
    );
  }

  if (error || !mapRegion) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>🗺️</Text>
        <Text style={styles.errorTitle}>Map Error</Text>
        <Text style={styles.errorSubtitle}>{error || 'Unable to load map'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeMap}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Map View</Text>
        <TouchableOpacity style={styles.listButton} onPress={() => navigation.goBack()}>
          <Text style={styles.listButtonText}>📋 List</Text>
        </TouchableOpacity>
      </View>

      {/* Property Count */}
      <View style={styles.propertyCountContainer}>
        <Text style={styles.propertyCountText}>
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} on map
        </Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {properties.map((property) => (
          <PropertyMarker
            key={property.id}
            property={property}
            onPress={handlePropertyPress}
          />
        ))}
      </MapView>

      {/* Recenter Button */}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={handleRecenter}
      >
        <Text style={styles.recenterIcon}>📍</Text>
      </TouchableOpacity>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.legendMarker} />
          <Text style={styles.legendText}>Available properties</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  listButton: {
    padding: 8,
  },
  listButtonText: {
    fontSize: 16,
  },
  propertyCountContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  map: {
    width: width,
    height: height - 100,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recenterIcon: {
    fontSize: 24,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendMarker: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default MapScreen;
