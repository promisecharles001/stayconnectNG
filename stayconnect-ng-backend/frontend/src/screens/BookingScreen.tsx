import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import DateSelector from '../components/DateSelector';
import BookingSummary from '../components/BookingSummary';
import bookingService from '../services/bookingService';
import notificationService from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import { DateRange, BookingSummaryData } from '../types/booking.types';

type BookingScreenRouteProp = RouteProp<AppStackParamList, 'Booking'>;
type BookingScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Booking'>;

interface RouteParams {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  pricePerNight: number;
}

const BookingScreen: React.FC = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { showError, showSuccess } = useToast();
  
  const {
    propertyId,
    propertyTitle,
    propertyImage,
    propertyLocation,
    pricePerNight,
  } = route.params as RouteParams;

  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const bookingSummary: BookingSummaryData | null = useMemo(() => {
    if (!dateRange.checkIn || !dateRange.checkOut) {
      return null;
    }

    const diffTime = dateRange.checkOut.getTime() - dateRange.checkIn.getTime();
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) {
      return null;
    }

    return {
      numberOfNights,
      pricePerNight,
      totalCost: pricePerNight * numberOfNights,
    };
  }, [dateRange, pricePerNight]);

  const isValidBooking = (): boolean => {
    return !!(
      dateRange.checkIn &&
      dateRange.checkOut &&
      bookingSummary &&
      bookingSummary.numberOfNights > 0
    );
  };

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleConfirmBooking = async (): Promise<void> => {
    if (!isValidBooking()) {
      showError('Please select valid check-in and check-out dates.');
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        propertyId,
        checkInDate: formatDateForAPI(dateRange.checkIn!),
        checkOutDate: formatDateForAPI(dateRange.checkOut!),
      };

      const response = await bookingService.createBooking(bookingData);

      // Send notification for new booking
      await notificationService.notifyNewBooking(propertyTitle, 'You');

      showSuccess('Booking created successfully!');

      // Navigate to UploadPaymentScreen after successful booking
      navigation.navigate('UploadPayment', {
        bookingId: response.id,
        bookingReference: `BK-${response.id.slice(0, 8).toUpperCase()}`,
        totalAmount: response.totalPrice,
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      showError(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
        <Text style={styles.headerTitle}>Book Your Stay</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Summary Card */}
        <View style={styles.propertyCard}>
          <Image
            source={{ uri: propertyImage }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle} numberOfLines={2}>
              {propertyTitle}
            </Text>
            <Text style={styles.propertyLocation}>{propertyLocation}</Text>
            <Text style={styles.propertyPrice}>
              {formatPrice(pricePerNight)}
              <Text style={styles.perNight}> / night</Text>
            </Text>
          </View>
        </View>

        {/* Chat with Host Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => {
            // Navigate back to PropertyDetails to access chat
            Alert.alert(
              'Chat with Host',
              'Please go back to the property details page to chat with the host.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Go Back', onPress: () => navigation.goBack() },
              ]
            );
          }}
        >
          <Text style={styles.chatButtonIcon}>💬</Text>
          <Text style={styles.chatButtonText}>Questions? Chat with Host</Text>
        </TouchableOpacity>

        {/* Date Selection */}
        <DateSelector
          dateRange={dateRange}
          onDateChange={setDateRange}
        />

        {/* Booking Summary */}
        <BookingSummary summary={bookingSummary} />

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInfo}>
          <Text style={styles.bottomBarLabel}>
            {bookingSummary
              ? `${bookingSummary.numberOfNights} nights`
              : 'Select dates'}
          </Text>
          <Text style={styles.bottomBarPrice}>
            {bookingSummary
              ? formatPrice(bookingSummary.totalCost)
              : formatPrice(0)}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!isValidBooking() || isLoading) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmBooking}
          disabled={!isValidBooking() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  propertyInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  perNight: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
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
    marginBottom: 2,
  },
  bottomBarPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  chatButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default BookingScreen;
