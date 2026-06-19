import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppStackParamList } from '../navigation/AppNavigator';
import propertyService from '../services/propertyService';
import { useToast } from '../context/ToastContext';
import { sanitizeInput, validateRequired, validatePrice } from '../utils/validation';

type AddPropertyScreenProps = StackScreenProps<AppStackParamList, 'AddProperty'>;

const PROPERTY_TYPES = [
  { id: 'APARTMENT', label: 'Apartment', icon: 'business' },
  { id: 'HOUSE', label: 'House', icon: 'home' },
  { id: 'VILLA', label: 'Villa', icon: 'cafe' },
  { id: 'STUDIO', label: 'Studio', icon: 'bed' },
  { id: 'CONDO', label: 'Condo', icon: 'business-outline' },
  { id: 'HOTEL', label: 'Hotel', icon: 'business' },
  { id: 'GUEST_HOUSE', label: 'Guest House', icon: 'home-outline' },
  { id: 'OTHER', label: 'Other', icon: 'ellipsis-horizontal' },
] as const;

const AMENITIES = [
  'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Pool', 'Gym',
  'TV', 'Washer', 'Dryer', 'Balcony', 'Garden', 'Security', 'Hot Water',
  'Generator', 'Furnished', 'Smart TV', 'Netflix', 'Workspace'
];

const AddPropertyScreen: React.FC<AddPropertyScreenProps> = ({ navigation }) => {
  const { showError, showInfo, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    pricePerNight: '',
    maxGuests: '1',
    bedrooms: '1',
    beds: '1',
    bathrooms: '1',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipCode: '',
    amenities: [] as string[],
    cleaningFee: '',
    houseRules: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    minNights: '1',
    maxNights: '',
  });

  const pickImage = async () => {
    if (images.length >= 10) {
      showInfo('You can upload up to 10 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const mimeType = result.assets[0].type || 'image/jpeg';
      const base64Uri = `data:${mimeType};base64,${result.assets[0].base64}`;
      setImages([...images, base64Uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateForm = (): string | null => {
    const titleError = validateRequired(formData.title, 'Property title', 3, 100);
    if (titleError) return titleError;

    const descError = validateRequired(formData.description, 'Description', 10, 2000);
    if (descError) return descError;

    const priceError = validatePrice(formData.pricePerNight);
    if (priceError) return priceError;

    const cityError = validateRequired(formData.city, 'City', 2, 50);
    if (cityError) return cityError;

    const stateError = validateRequired(formData.state, 'State', 2, 50);
    if (stateError) return stateError;

    if (images.length === 0) return 'At least one image is required';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      showError(error);
      return;
    }

    setLoading(true);
    try {
      await propertyService.createProperty({
        title: sanitizeInput(formData.title),
        description: sanitizeInput(formData.description),
        type: formData.type,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxGuests: parseInt(formData.maxGuests) || 1,
        bedrooms: parseInt(formData.bedrooms) || 1,
        beds: parseInt(formData.beds) || 1,
        bathrooms: parseFloat(formData.bathrooms) || 1,
        address: sanitizeInput(formData.address),
        city: sanitizeInput(formData.city),
        state: sanitizeInput(formData.state),
        country: sanitizeInput(formData.country),
        zipCode: formData.zipCode.trim() || undefined,
        amenities: formData.amenities,
        images: images,
        cleaningFee: formData.cleaningFee ? parseFloat(formData.cleaningFee) : undefined,
        houseRules: formData.houseRules.trim() || undefined,
        checkInTime: formData.checkInTime || undefined,
        checkOutTime: formData.checkOutTime || undefined,
        minNights: parseInt(formData.minNights) || 1,
        maxNights: formData.maxNights ? parseInt(formData.maxNights) : undefined,
      });
      showSuccess('Your property has been submitted for review.');
      navigation.goBack();
    } catch (error: any) {
      showError(error.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Your Property</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Photos</Text>
          <Text style={styles.sectionSubtitle}>Add up to 10 photos</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="camera" size={32} color="#059669" />
              <Text style={styles.addImageText}>Add Photo</Text>
            </TouchableOpacity>
            
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Property Title"
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
          />
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.typeGrid}>
            {PROPERTY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  formData.type === type.id && styles.typeButtonActive,
                ]}
                onPress={() => updateField('type', type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={formData.type === type.id ? '#fff' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.type === type.id && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pricing & Capacity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Capacity</Text>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Price per Night (₦)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={formData.pricePerNight}
                onChangeText={(text) => updateField('pricePerNight', text)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Cleaning Fee (₦)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={formData.cleaningFee}
                onChangeText={(text) => updateField('cleaningFee', text)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Max Guests</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="number-pad"
                value={formData.maxGuests}
                onChangeText={(text) => updateField('maxGuests', text)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Min Nights</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="number-pad"
                value={formData.minNights}
                onChangeText={(text) => updateField('minNights', text)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Bedrooms</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="number-pad"
                value={formData.bedrooms}
                onChangeText={(text) => updateField('bedrooms', text)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Beds</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="number-pad"
                value={formData.beds}
                onChangeText={(text) => updateField('beds', text)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Bathrooms</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="decimal-pad"
                value={formData.bathrooms}
                onChangeText={(text) => updateField('bathrooms', text)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Max Nights</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                keyboardType="number-pad"
                value={formData.maxNights}
                onChangeText={(text) => updateField('maxNights', text)}
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={formData.address}
            onChangeText={(text) => updateField('address', text)}
          />
          
          <View style={styles.row}>
            <View style={styles.flex1}>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(text) => updateField('city', text)}
              />
            </View>
            <View style={styles.flex1}>
              <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={(text) => updateField('state', text)}
              />
            </View>
          </View>
        </View>

        {/* Check In & Out */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check In & Out</Text>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Check-in Time</Text>
              <TextInput
                style={styles.input}
                placeholder="14:00"
                value={formData.checkInTime}
                onChangeText={(text) => updateField('checkInTime', text)}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>Check-out Time</Text>
              <TextInput
                style={styles.input}
                placeholder="11:00"
                value={formData.checkOutTime}
                onChangeText={(text) => updateField('checkOutTime', text)}
              />
            </View>
          </View>
        </View>

        {/* House Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>House Rules</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any specific rules for guests?"
            multiline
            numberOfLines={3}
            value={formData.houseRules}
            onChangeText={(text) => updateField('houseRules', text)}
          />
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityButton,
                  formData.amenities.includes(amenity) && styles.amenityButtonActive,
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <Text
                  style={[
                    styles.amenityText,
                    formData.amenities.includes(amenity) && styles.amenityTextActive,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>List Property</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
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
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#059669',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#ECFDF5',
  },
  addImageText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 8,
    minWidth: '30%',
  },
  typeButtonActive: {
    backgroundColor: '#059669',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amenityButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  amenityText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  amenityTextActive: {
    color: '#fff',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 40,
  },
});

export default AddPropertyScreen;
