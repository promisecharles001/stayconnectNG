import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingSummaryData } from '../types/booking.types';

interface BookingSummaryProps {
  summary: BookingSummaryData | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ summary }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!summary || summary.numberOfNights === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Booking Summary</Text>
        <Text style={styles.placeholderText}>
          Select check-in and check-out dates to see pricing
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>
          {formatPrice(summary.pricePerNight)} x {summary.numberOfNights}{' '}
          {summary.numberOfNights === 1 ? 'night' : 'nights'}
        </Text>
        <Text style={styles.value}>
          {formatPrice(summary.pricePerNight * summary.numberOfNights)}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(summary.totalCost)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
});

export default BookingSummary;
