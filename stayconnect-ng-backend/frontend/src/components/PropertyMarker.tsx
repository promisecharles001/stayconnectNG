import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Property } from '../types/property.types';

interface PropertyMarkerProps {
  property: Property;
  onPress: (property: Property) => void;
}

const PropertyMarker: React.FC<PropertyMarkerProps> = ({ property, onPress }) => {
  const [isSelected, setIsSelected] = useState(false);

  // Skip properties without coordinates
  if (!property.latitude || !property.longitude) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (): string => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  return (
    <Marker
      coordinate={{
        latitude: property.latitude,
        longitude: property.longitude,
      }}
      onPress={() => setIsSelected(true)}
    >
      {/* Custom Marker View */}
      <View style={styles.markerContainer}>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            ₦{(property.pricePerNight / 1000).toFixed(0)}k
          </Text>
        </View>
        <View style={styles.markerTriangle} />
      </View>

      {/* Callout/Preview Card */}
      <Callout
        tooltip
        onPress={() => onPress(property)}
      >
        <View style={styles.calloutContainer}>
          <Image
            source={{ uri: getImageUrl() }}
            style={styles.calloutImage}
            resizeMode="cover"
          />
          <View style={styles.calloutContent}>
            <Text style={styles.calloutTitle} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.calloutLocation} numberOfLines={1}>
              {property.city}, {property.state}
            </Text>
            <View style={styles.calloutFooter}>
              <Text style={styles.calloutPrice}>
                {formatPrice(property.pricePerNight)}
                <Text style={styles.perNight}> / night</Text>
              </Text>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => onPress(property)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  priceTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007AFF',
  },
  calloutContainer: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  calloutContent: {
    padding: 12,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  calloutLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
  },
  viewDetailsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PropertyMarker;
