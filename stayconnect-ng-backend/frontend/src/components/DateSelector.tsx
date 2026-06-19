import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { DateRange } from '../types/booking.types';

interface DateSelectorProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  minDate?: Date;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  dateRange,
  onDateChange,
  minDate = new Date(),
}) => {
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const onCheckInChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowCheckInPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newRange: DateRange = {
        checkIn: selectedDate,
        checkOut: dateRange.checkOut && selectedDate > dateRange.checkOut
          ? null
          : dateRange.checkOut,
      };
      onDateChange(newRange);
    }
  };

  const onCheckOutChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowCheckOutPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newRange: DateRange = {
        checkIn: dateRange.checkIn,
        checkOut: selectedDate,
      };
      onDateChange(newRange);
    }
  };

  const isValidDateRange = (): boolean => {
    if (!dateRange.checkIn || !dateRange.checkOut) return false;
    return dateRange.checkOut > dateRange.checkIn;
  };

  const getNightsCount = (): number => {
    if (!isValidDateRange()) return 0;
    const diffTime = dateRange.checkOut!.getTime() - dateRange.checkIn!.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Dates</Text>

      {/* Check-in Date */}
      <View style={styles.dateSection}>
        <Text style={styles.label}>Check-in</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowCheckInPicker(true)}
        >
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={[styles.dateText, !dateRange.checkIn && styles.placeholderText]}>
            {formatDate(dateRange.checkIn)}
          </Text>
        </TouchableOpacity>
        {showCheckInPicker && (
          <DateTimePicker
            value={dateRange.checkIn || minDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={minDate}
            onChange={onCheckInChange}
          />
        )}
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>↓</Text>
      </View>

      {/* Check-out Date */}
      <View style={styles.dateSection}>
        <Text style={styles.label}>Check-out</Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            !dateRange.checkIn && styles.disabledButton,
          ]}
          onPress={() => dateRange.checkIn && setShowCheckOutPicker(true)}
          disabled={!dateRange.checkIn}
        >
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={[styles.dateText, !dateRange.checkOut && styles.placeholderText]}>
            {formatDate(dateRange.checkOut)}
          </Text>
        </TouchableOpacity>
        {showCheckOutPicker && (
          <DateTimePicker
            value={dateRange.checkOut || dateRange.checkIn || minDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={dateRange.checkIn || minDate}
            onChange={onCheckOutChange}
          />
        )}
      </View>

      {/* Validation Message */}
      {dateRange.checkIn && dateRange.checkOut && !isValidDateRange() && (
        <Text style={styles.errorText}>
          Check-out date must be after check-in date
        </Text>
      )}

      {/* Nights Count */}
      {isValidDateRange() && (
        <View style={styles.nightsContainer}>
          <Text style={styles.nightsText}>
            {getNightsCount()} {getNightsCount() === 1 ? 'night' : 'nights'}
          </Text>
        </View>
      )}
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
  dateSection: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  nightsContainer: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  nightsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default DateSelector;
