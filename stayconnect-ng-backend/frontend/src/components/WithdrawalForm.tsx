import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CreateWithdrawalDto } from '../types/withdrawal.types';

interface WithdrawalFormProps {
  availableBalance: number;
  onSubmit: (data: CreateWithdrawalDto) => Promise<void>;
  isSubmitting: boolean;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  availableBalance,
  onSubmit,
  isSubmitting,
}) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate amount
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amountNum > availableBalance) {
      newErrors.amount = `Amount cannot exceed available balance (${formatPrice(availableBalance)})`;
    } else if (amountNum < 1000) {
      newErrors.amount = 'Minimum withdrawal amount is ₦1,000';
    }

    // Validate bank name
    if (!bankName.trim()) {
      newErrors.bankName = 'Please enter bank name';
    } else if (bankName.trim().length < 3) {
      newErrors.bankName = 'Bank name must be at least 3 characters';
    }

    // Validate account number
    const accountNumClean = accountNumber.replace(/\s/g, '');
    if (!accountNumClean) {
      newErrors.accountNumber = 'Please enter account number';
    } else if (!/^\d{10}$/.test(accountNumClean)) {
      newErrors.accountNumber = 'Account number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    const data: CreateWithdrawalDto = {
      amount: parseFloat(amount),
      bankName: bankName.trim(),
      accountNumber: accountNumber.replace(/\s/g, ''),
    };

    try {
      await onSubmit(data);
      // Clear form on success
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setErrors({});
    } catch (error) {
      // Error is handled by parent
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    setAmount(cleaned);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  const handleAccountNumberChange = (value: string) => {
    // Only allow numbers and spaces
    const cleaned = value.replace(/[^0-9\s]/g, '');
    setAccountNumber(cleaned);
    if (errors.accountNumber) {
      setErrors((prev) => ({ ...prev, accountNumber: '' }));
    }
  };

  const setMaxAmount = () => {
    setAmount(availableBalance.toString());
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Withdrawal</Text>

      {/* Available Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{formatPrice(availableBalance)}</Text>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (₦)</Text>
        <View style={styles.amountInputContainer}>
          <TextInput
            style={[styles.input, styles.amountInput, errors.amount ? styles.inputError : undefined]}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={handleAmountChange}
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={styles.maxButton}
            onPress={setMaxAmount}
            disabled={isSubmitting}
          >
            <Text style={styles.maxButtonText}>MAX</Text>
          </TouchableOpacity>
        </View>
        {errors.amount ? (
          <Text style={styles.errorText}>{errors.amount}</Text>
        ) : null}
      </View>

      {/* Bank Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          style={[styles.input, errors.bankName ? styles.inputError : undefined]}
          placeholder="e.g., First Bank of Nigeria"
          placeholderTextColor="#999"
          value={bankName}
          onChangeText={(text) => {
            setBankName(text);
            if (errors.bankName) {
              setErrors((prev) => ({ ...prev, bankName: '' }));
            }
          }}
          editable={!isSubmitting}
          autoCapitalize="words"
        />
        {errors.bankName ? (
          <Text style={styles.errorText}>{errors.bankName}</Text>
        ) : null}
      </View>

      {/* Account Number Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={[styles.input, errors.accountNumber ? styles.inputError : undefined]}
          placeholder="10-digit account number"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={10}
          value={accountNumber}
          onChangeText={handleAccountNumberChange}
          editable={!isSubmitting}
        />
        {errors.accountNumber ? (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        ) : null}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (isSubmitting || availableBalance <= 0) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting || availableBalance <= 0}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Request Withdrawal</Text>
        )}
      </TouchableOpacity>

      {availableBalance <= 0 && (
        <Text style={styles.noBalanceText}>
          You need available balance to request a withdrawal
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  balanceContainer: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    marginRight: 12,
  },
  maxButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  maxButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
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
  noBalanceText: {
    fontSize: 12,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default WithdrawalForm;
