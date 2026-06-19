import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SearchFilters, PropertyType, Amenity, DEFAULT_FILTER_OPTIONS } from '../types/search.types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const { height } = Dimensions.get('window');

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.minPrice || 0,
    max: initialFilters.maxPrice || 1000000,
  });

  const toggleAmenity = useCallback((amenity: Amenity) => {
    setFilters((prev) => {
      const currentAmenities = prev.amenities || [];
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter((a) => a !== amenity),
        };
      }
      return {
        ...prev,
        amenities: [...currentAmenities, amenity],
      };
    });
  }, []);

  const selectPropertyType = useCallback((type: PropertyType) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType === type ? undefined : type,
    }));
  }, []);

  const selectRating = useCallback((rating: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? undefined : rating,
    }));
  }, []);

  const handleApply = () => {
    onApply({
      ...filters,
      minPrice: priceRange.min > 0 ? priceRange.min : undefined,
      maxPrice: priceRange.max < 1000000 ? priceRange.max : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    setPriceRange({ min: 0, max: 1000000 });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isAmenitySelected = (amenity: Amenity): boolean => {
    return filters.amenities?.includes(amenity) || false;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Price Range Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceInput}>
                  <Text style={styles.priceLabel}>Min</Text>
                  <Text style={styles.priceValue}>{formatPrice(priceRange.min)}</Text>
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInput}>
                  <Text style={styles.priceLabel}>Max</Text>
                  <Text style={styles.priceValue}>{formatPrice(priceRange.max)}</Text>
                </View>
              </View>
              {/* Price Presets */}
              <View style={styles.pricePresets}>
                {[0, 50000, 100000, 250000, 500000, 1000000].map((price, index, arr) => {
                  if (index === arr.length - 1) return null;
                  return (
                    <TouchableOpacity
                      key={price}
                      style={[
                        styles.pricePreset,
                        priceRange.min === price && priceRange.max === arr[index + 1]
                          ? styles.pricePresetActive
                          : null,
                      ]}
                      onPress={() => setPriceRange({ min: price, max: arr[index + 1] })}
                    >
                      <Text
                        style={[
                          styles.pricePresetText,
                          priceRange.min === price && priceRange.max === arr[index + 1]
                            ? styles.pricePresetTextActive
                            : null,
                        ]}
                      >
                        {formatPrice(price)} - {formatPrice(arr[index + 1])}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                {DEFAULT_FILTER_OPTIONS.ratingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.ratingButton,
                      filters.rating === option.value ? styles.ratingButtonActive : null,
                    ]}
                    onPress={() => selectRating(option.value)}
                  >
                    <Text
                      style={[
                        styles.ratingText,
                        filters.rating === option.value ? styles.ratingTextActive : null,
                      ]}
                    >
                      {'⭐'.repeat(option.value)} {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Property Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Type</Text>
              <View style={styles.propertyTypeContainer}>
                {DEFAULT_FILTER_OPTIONS.propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.propertyTypeButton,
                      filters.propertyType === type.value
                        ? styles.propertyTypeButtonActive
                        : null,
                    ]}
                    onPress={() => selectPropertyType(type.value)}
                  >
                    <Text
                      style={[
                        styles.propertyTypeText,
                        filters.propertyType === type.value
                          ? styles.propertyTypeTextActive
                          : null,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amenities Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {DEFAULT_FILTER_OPTIONS.amenities.map((amenity) => (
                  <TouchableOpacity
                    key={amenity.value}
                    style={[
                      styles.amenityButton,
                      isAmenitySelected(amenity.value) ? styles.amenityButtonActive : null,
                    ]}
                    onPress={() => toggleAmenity(amenity.value)}
                  >
                    <Text style={styles.amenityIcon}>{amenity.icon}</Text>
                    <Text
                      style={[
                        styles.amenityText,
                        isAmenitySelected(amenity.value) ? styles.amenityTextActive : null,
                      ]}
                    >
                      {amenity.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 20,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resetText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  scrollView: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#666',
    marginHorizontal: 12,
  },
  pricePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pricePreset: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  pricePresetActive: {
    backgroundColor: '#007AFF',
  },
  pricePresetText: {
    fontSize: 12,
    color: '#666',
  },
  pricePresetTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  ratingContainer: {
    gap: 8,
  },
  ratingButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ratingButtonActive: {
    backgroundColor: '#007AFF',
  },
  ratingText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  ratingTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyTypeButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  propertyTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  propertyTypeText: {
    fontSize: 14,
    color: '#666',
  },
  propertyTypeTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  amenityButtonActive: {
    backgroundColor: '#E8F4FD',
  },
  amenityIcon: {
    fontSize: 16,
  },
  amenityText: {
    fontSize: 13,
    color: '#666',
  },
  amenityTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
