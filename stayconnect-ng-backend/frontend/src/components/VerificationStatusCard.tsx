import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VerificationStatus } from '../types/verification.types';

interface VerificationStatusCardProps {
  status: VerificationStatus;
  rejectionReason?: string;
}

const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({
  status,
  rejectionReason,
}) => {
  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'UNVERIFIED':
        return {
          icon: '⚠️',
          title: 'Not Verified',
          description: 'Please complete your verification to start hosting.',
          color: '#FF9500',
          backgroundColor: '#FFF3E0',
        };
      case 'PENDING':
        return {
          icon: '⏳',
          title: 'Verification Under Review',
          description: 'Your documents are being reviewed. This usually takes 1-2 business days.',
          color: '#007AFF',
          backgroundColor: '#E3F2FD',
        };
      case 'VERIFIED':
        return {
          icon: '✅',
          title: 'Verified',
          description: 'Your account is verified. You can now list properties and receive bookings.',
          color: '#34C759',
          backgroundColor: '#E8F5E9',
        };
      case 'REJECTED':
        return {
          icon: '❌',
          title: 'Verification Rejected',
          description: rejectionReason || 'Your verification was rejected. Please check the reason below and resubmit.',
          color: '#FF3B30',
          backgroundColor: '#FFEBEE',
        };
      default:
        return {
          icon: '❓',
          title: 'Unknown Status',
          description: 'Please contact support if this persists.',
          color: '#999',
          backgroundColor: '#F5F5F5',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.color }]}>
          {config.title}
        </Text>
        <Text style={styles.description}>{config.description}</Text>
        {status === 'REJECTED' && rejectionReason && (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionLabel}>Reason:</Text>
            <Text style={styles.rejectionText}>{rejectionReason}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  rejectionBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: '#666',
  },
});

export default VerificationStatusCard;
