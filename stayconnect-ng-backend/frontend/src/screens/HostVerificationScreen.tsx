import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import verificationService from '../services/verificationService';
import { useToast } from '../context/ToastContext';
import notificationService from '../services/notificationService';
import {
  VerificationStatus,
  DocumentType,
  HostVerification,
  SubmitVerificationDto,
} from '../types/verification.types';
import VerificationStatusCard from '../components/VerificationStatusCard';
import DocumentUpload from '../components/DocumentUpload';
import { useAuth } from '../context/AuthContext';

type HostVerificationScreenNavigationProp = StackNavigationProp<AppStackParamList, 'HostVerification'>;

const HostVerificationScreen: React.FC = () => {
  const navigation = useNavigation<HostVerificationScreenNavigationProp>();
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();

  const [status, setStatus] = useState<VerificationStatus>('UNVERIFIED');
  const [verification, setVerification] = useState<HostVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [documentType, setDocumentType] = useState<DocumentType>('GOVERNMENT_ID');
  const [documentImage, setDocumentImage] = useState<string>('');
  const [selfieImage, setSelfieImage] = useState<string>('');
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isUploadingSelfie, setIsUploadingSelfie] = useState(false);

  // Allow visitors to apply for host verification
  const isEligible = !user || user.role.name === 'HOST' || user.role.name === 'ADMIN' || user.role.name === 'GUEST' || user.role.name === 'VISITOR';

  const fetchVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await verificationService.getVerificationStatus();
      setStatus(response.status);

      if (response.verification) {
        setVerification(response.verification);
      }
    } catch (error: any) {
      console.error('Fetch verification status error:', error);
      // No verification record yet — that's ok for new applicants
      setStatus('UNVERIFIED');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerificationStatus();
  }, [fetchVerificationStatus]);

  const handleDocumentSelect = async (uri: string, type: 'document' | 'selfie') => {
    try {
      if (type === 'document') {
        setIsUploadingDocument(true);
        const fileName = uri.split('/').pop() || 'document.jpg';
        const response = await verificationService.uploadDocument({
          uri,
          name: fileName,
          type: 'image/jpeg',
        });
        setDocumentImage(response.url);
      } else {
        setIsUploadingSelfie(true);
        const fileName = uri.split('/').pop() || 'selfie.jpg';
        const response = await verificationService.uploadSelfie({
          uri,
          name: fileName,
          type: 'image/jpeg',
        });
        setSelfieImage(response.url);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingDocument(false);
      setIsUploadingSelfie(false);
    }
  };

  const handleSubmit = async () => {
    if (!documentImage || !selfieImage) {
      showError('Please upload both your ID document and a selfie.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data: SubmitVerificationDto = {
        documentType,
        documentImage,
        selfieImage,
      };

      await verificationService.submitVerification(data);

      // Send notification
      await notificationService.sendLocalNotification({
        title: 'Verification Submitted',
        body: 'Your host verification documents have been submitted for review.',
        data: { type: 'general' },
      });

      showSuccess('Your documents have been submitted for review. We will notify you once the review is complete.');
      setTimeout(() => fetchVerificationStatus(), 1500);
    } catch (error: any) {
      console.error('Submit verification error:', error);
      showError(error.message || 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  const renderDocumentTypeSelector = () => (
    <View style={styles.documentTypeContainer}>
      <Text style={styles.sectionTitle}>Select Document Type</Text>
      <View style={styles.documentTypeRow}>
        {(['GOVERNMENT_ID', 'DRIVER_LICENSE', 'PASSPORT'] as DocumentType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.documentTypeButton,
              documentType === type && styles.documentTypeButtonActive,
            ]}
            onPress={() => setDocumentType(type)}
            disabled={isSubmitting}
          >
            <Text
              style={[
                styles.documentTypeButtonText,
                documentType === type && styles.documentTypeButtonTextActive,
              ]}
            >
              {getDocumentTypeLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderUploadForm = () => (
    <View style={styles.formContainer}>
      {renderDocumentTypeSelector()}

      <DocumentUpload
        documentType={documentType}
        label="Upload ID Document"
        onDocumentSelect={(uri: string) => handleDocumentSelect(uri, 'document')}
        selectedImage={documentImage}
        isUploading={isUploadingDocument}
      />

      <DocumentUpload
        documentType={documentType}
        label="Take a Selfie"
        onDocumentSelect={(uri: string) => handleDocumentSelect(uri, 'selfie')}
        selectedImage={selfieImage}
        isUploading={isUploadingSelfie}
        mode="selfie"
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!documentImage || !selfieImage || isSubmitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!documentImage || !selfieImage || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit for Verification</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderPendingState = () => (
    <View style={styles.stateContainer}>
      <Text style={styles.stateEmoji}>⏳</Text>
      <Text style={styles.stateTitle}>Under Review</Text>
      <Text style={styles.stateDescription}>
        Your verification documents are being reviewed by our team. This usually takes 1-2 business days.
      </Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchVerificationStatus}
        disabled={loading}
      >
        <Text style={styles.refreshButtonText}>Check Status</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerifiedState = () => (
    <View style={styles.stateContainer}>
      <Text style={styles.stateEmoji}>🎉</Text>
      <Text style={styles.stateTitle}>You're Verified!</Text>
      <Text style={styles.stateDescription}>
        Your account has been verified. You can now list properties and start receiving bookings.
      </Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('MainTabs')}
      >
        <Text style={styles.actionButtonText}>Start Hosting</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRejectedState = () => (
    <View style={styles.stateContainer}>
      <Text style={styles.stateEmoji}>📝</Text>
      <Text style={styles.stateTitle}>Resubmit Documents</Text>
      <Text style={styles.stateDescription}>
        Your previous submission was rejected. Please review the reason and submit again.
      </Text>
      {renderUploadForm()}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading...</Text>
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
        <Text style={styles.headerTitle}>Host Verification</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <VerificationStatusCard
          status={status}
          rejectionReason={verification?.rejectionReason}
        />

        {/* Content based on status */}
        {status === 'UNVERIFIED' && renderUploadForm()}
        {status === 'PENDING' && renderPendingState()}
        {status === 'VERIFIED' && renderVerifiedState()}
        {status === 'REJECTED' && renderRejectedState()}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    color: '#059669',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  documentTypeContainer: {
    marginBottom: 20,
  },
  documentTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  documentTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  documentTypeButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  documentTypeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  documentTypeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stateContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  stateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  stateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
  },
  refreshButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default HostVerificationScreen;
