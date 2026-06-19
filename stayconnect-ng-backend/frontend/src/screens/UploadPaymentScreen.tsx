import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Clipboard,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import ImageUploader from '../components/ImageUploader';
import paymentService from '../services/paymentService';

type UploadPaymentScreenRouteProp = RouteProp<AppStackParamList, 'UploadPayment'>;
type UploadPaymentScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UploadPayment'>;

interface RouteParams {
  bookingId: string;
  bookingReference: string;
  totalAmount: number;
}

const UploadPaymentScreen: React.FC = () => {
  const route = useRoute<UploadPaymentScreenRouteProp>();
  const navigation = useNavigation<UploadPaymentScreenNavigationProp>();
  
  const { bookingId, bookingReference, totalAmount } = route.params as RouteParams;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const bankDetails = paymentService.getBankTransferDetails();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedImage) {
      Alert.alert('Image Required', 'Please select a payment proof image to upload.');
      return;
    }

    setIsUploading(true);

    try {
      const response = await paymentService.uploadPaymentProof(bookingId, selectedImage);

      Alert.alert(
        'Upload Successful!',
        `Your payment proof has been uploaded successfully.\n\nReference: ${response.id}\nStatus: ${response.status}`,
        [
          {
            text: 'View My Bookings',
            onPress: () => {
              // Navigate to MyBookings screen (to be implemented)
              navigation.navigate('MainTabs');
            },
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        error.message || 'Failed to upload payment proof. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Upload?',
      'You can upload your payment proof later from your bookings page.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'default',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Reference Card */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingLabel}>Booking Reference</Text>
          <Text style={styles.bookingReference}>{bookingReference}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountValue}>{formatPrice(totalAmount)}</Text>
          </View>
        </View>

        {/* Bank Transfer Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Bank Transfer Instructions</Text>
          <Text style={styles.instructionsText}>
            Please transfer the exact amount to the bank account below. Use your booking reference as the transfer description.
          </Text>

          <View style={styles.bankDetailsContainer}>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Bank Name</Text>
              <View style={styles.bankDetailValueContainer}>
                <Text style={styles.bankDetailValue}>{bankDetails.bankName}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(bankDetails.bankName, 'Bank name')}
                >
                  <Text style={styles.copyButton}>📋</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Account Number</Text>
              <View style={styles.bankDetailValueContainer}>
                <Text style={styles.bankDetailValue}>{bankDetails.accountNumber}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                >
                  <Text style={styles.copyButton}>📋</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Account Name</Text>
              <Text style={styles.bankDetailValue}>{bankDetails.accountName}</Text>
            </View>

            <View style={[styles.bankDetailRow, styles.referenceRow]}>
              <Text style={styles.bankDetailLabel}>Transfer Description</Text>
              <View style={styles.bankDetailValueContainer}>
                <Text style={[styles.bankDetailValue, styles.referenceValue]}>
                  {bookingReference}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(bookingReference, 'Reference')}
                >
                  <Text style={styles.copyButton}>📋</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.importantNote}>
            <Text style={styles.importantNoteIcon}>⚠️</Text>
            <Text style={styles.importantNoteText}>
              Important: Include your booking reference in the transfer description to ensure your payment is properly credited.
            </Text>
          </View>
        </View>

        {/* Image Uploader */}
        <ImageUploader
          selectedImage={selectedImage}
          onImageSelected={setSelectedImage}
        />

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInfo}>
          <Text style={styles.bottomBarLabel}>
            {selectedImage ? 'Ready to upload' : 'Select an image'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedImage || isUploading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Payment Proof</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  bookingLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  bookingReference: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  amountContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  bankDetailsContainer: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  referenceRow: {
    borderBottomWidth: 0,
    backgroundColor: '#e8f4fd',
    marginHorizontal: -16,
    marginBottom: -16,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bankDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  bankDetailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  referenceValue: {
    color: '#007AFF',
  },
  copyButton: {
    fontSize: 16,
  },
  importantNote: {
    flexDirection: 'row',
    backgroundColor: '#fff9e6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  importantNoteIcon: {
    fontSize: 16,
  },
  importantNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#8b6914',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadPaymentScreen;
