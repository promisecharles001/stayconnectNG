import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { PendingWithdrawal } from '../types/admin.types';

interface WithdrawalApprovalCardProps {
  withdrawal: PendingWithdrawal;
  onApprove: (withdrawalId: string) => void;
  onReject: (withdrawalId: string) => void;
  onMarkPaid: (withdrawalId: string) => void;
  isProcessing?: boolean;
}

const WithdrawalApprovalCard: React.FC<WithdrawalApprovalCardProps> = ({
  withdrawal,
  onApprove,
  onReject,
  onMarkPaid,
  isProcessing = false,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return '#FF9500';
      case 'APPROVED':
        return '#007AFF';
      case 'PAID':
        return '#34C759';
      case 'REJECTED':
        return '#FF3B30';
      default:
        return '#999';
    }
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Withdrawal',
      `Are you sure you want to reject the withdrawal of ${formatPrice(withdrawal.amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => onReject(withdrawal.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.amount}>{formatPrice(withdrawal.amount)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(withdrawal.status) },
          ]}
        >
          <Text style={styles.statusText}>{withdrawal.status}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.host}>Host: {withdrawal.hostName}</Text>
        <Text style={styles.bank}>🏦 {withdrawal.bankName}</Text>
        <Text style={styles.account}>Account: •••• {withdrawal.accountNumber.slice(-4)}</Text>
        <Text style={styles.date}>Requested: {formatDate(withdrawal.createdAt)}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {withdrawal.status === 'PENDING' && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => onApprove(withdrawal.id)}
              disabled={isProcessing}
            >
              <Text style={styles.approveButtonText}>✓ Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
              disabled={isProcessing}
            >
              <Text style={styles.rejectButtonText}>✕ Reject</Text>
            </TouchableOpacity>
          </>
        )}
        {withdrawal.status === 'APPROVED' && (
          <TouchableOpacity
            style={[styles.button, styles.paidButton]}
            onPress={() => onMarkPaid(withdrawal.id)}
            disabled={isProcessing}
          >
            <Text style={styles.paidButtonText}>💰 Mark as Paid</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  details: {
    marginBottom: 16,
  },
  host: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  bank: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  account: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paidButton: {
    backgroundColor: '#007AFF',
  },
  paidButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WithdrawalApprovalCard;
