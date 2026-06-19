import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DocumentType } from '../types/verification.types';

interface DocumentUploadProps {
  documentType: DocumentType;
  onDocumentSelect: (uri: string, type: 'document' | 'selfie') => void;
  selectedImage?: string;
  label: string;
  isUploading?: boolean;
  mode?: 'document' | 'selfie';
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  onDocumentSelect,
  selectedImage,
  label,
  isUploading = false,
  mode = 'document',
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const handleSelectImage = async () => {
    if (hasPermission === null) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photos to upload documents.'
        );
        return;
      }
    } else if (hasPermission === false) {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photos in settings.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onDocumentSelect(asset.uri, 'document');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your camera.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onDocumentSelect(asset.uri, 'document');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case 'GOVERNMENT_ID':
        return 'National ID Card';
      case 'DRIVER_LICENSE':
        return "Driver's License";
      case 'PASSPORT':
        return 'International Passport';
      default:
        return 'Document';
    }
  };

  const isSelfie = mode === 'selfie';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          {isUploading ? (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.changeButton}
              onPress={isSelfie ? handleTakePhoto : handleSelectImage}
              disabled={isUploading}
            >
              <Text style={styles.changeButtonText}>
                {isSelfie ? 'Retake' : 'Change'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.uploadContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{isSelfie ? '👤' : '📄'}</Text>
          </View>
          <Text style={styles.documentTypeLabel}>
            {isSelfie ? 'Face Verification' : getDocumentTypeLabel(documentType)}
          </Text>
          <Text style={styles.hint}>
            {isSelfie
              ? 'Take a clear selfie holding your ID near your face'
              : 'Upload a clear photo of your document'}
          </Text>

          <View style={styles.buttonRow}>
            {!isSelfie && (
              <TouchableOpacity
                style={[styles.button, styles.galleryButton]}
                onPress={handleSelectImage}
                disabled={isUploading}
              >
                <Text style={styles.buttonIcon}>🖼️</Text>
                <Text style={styles.buttonText}>Gallery</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.cameraButton, isSelfie && styles.cameraButtonFull]}
              onPress={handleTakePhoto}
              disabled={isUploading}
            >
              <Text style={styles.buttonIcon}>📷</Text>
              <Text style={styles.buttonText}>
                {isSelfie ? 'Take Selfie' : 'Camera'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  uploadContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  documentTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  galleryButton: {
    backgroundColor: '#007AFF',
  },
  cameraButton: {
    backgroundColor: '#34C759',
  },
  cameraButtonFull: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  changeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DocumentUpload;
