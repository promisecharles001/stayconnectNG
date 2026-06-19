import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import propertyService from '../services/propertyService';
import reviewService from '../services/reviewService';
import messageService from '../services/messageService';
import { PropertyDetails } from '../types/property.types';
import { Review } from '../types/review.types';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import WishlistButton from '../components/WishlistButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMountedRef } from '../hooks/useMountedRef';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

type PropertyDetailsScreenRouteProp = RouteProp<AppStackParamList, 'PropertyDetails'>;
type PropertyDetailsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'PropertyDetails'>;

const PropertyDetailsScreen: React.FC = () => {
  const route = useRoute<PropertyDetailsScreenRouteProp>();
  const navigation = useNavigation<PropertyDetailsScreenNavigationProp>();
  const { isAuthenticated } = useAuth();
  const { showError, showInfo } = useToast();
  const { width } = useWindowDimensions();
  const isMounted = useMountedRef();
  const { propertyId } = route.params;

  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      const data = await propertyService.getPropertyById(propertyId);
      if (isMounted.current) {
        setProperty(data);
        navigation.setOptions({
          title: data.title,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleShareProperty}
              style={{ marginRight: 16, padding: 4 }}
              accessibilityLabel="Share property"
            >
              <Ionicons name="share-outline" size={24} color="#059669" />
            </TouchableOpacity>
          ),
        });
      }
    } catch (err: any) {
      console.error('Fetch property details error:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to load property details');
        showError('Failed to load property details. Please try again.');
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      if (isMounted.current) setReviewsLoading(true);
      const response = await reviewService.getPropertyReviews(propertyId, 1, 10);
      if (isMounted.current) setReviews(response.data);
    } catch (err: any) {
      console.error('Fetch reviews error:', err);
      // Don't show alert for reviews - just log the error
    } finally {
      if (isMounted.current) setReviewsLoading(false);
    }
  }, [propertyId]);

  const handleWriteReview = () => {
    requireAuth(() => {
      if (!property) return;
      navigation.navigate('WriteReview', {
        propertyId: property.id,
        propertyTitle: property.title,
      });
    }, 'write a review');
  };

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const requireAuth = (action: () => void, actionName: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        `Please sign in or create a free account to ${actionName}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') },
          { text: 'Create Account', onPress: () => navigation.navigate('Register') },
        ]
      );
      return;
    }
    action();
  };

  const handleBookNow = () => {
    requireAuth(() => {
      if (!property) return;

      const propertyImage = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://via.placeholder.com/400x300?text=No+Image';

      navigation.navigate('Booking', {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: propertyImage,
        propertyLocation: `${property.city}, ${property.state}`,
        pricePerNight: property.pricePerNight,
      });
    }, 'book this property');
  };

  const handleShareProperty = async () => {
    if (!property) return;
    try {
      const shareUrl = `https://stayconnect.ng/property/${property.id}`;
      const message = `Check out this property on StayConnect NG: ${property.title} in ${property.city}, ${property.state}. ${shareUrl}`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareUrl, {
          dialogTitle: `${property.title} - StayConnect NG`,
        });
      } else {
        showInfo('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Share error:', error);
      showError('Failed to share property');
    }
  };

  const handleContactHost = () => {
    requireAuth(() => {
      if (property?.host) {
        Alert.alert(
          'Contact Host',
          `Host: ${property.host.firstName} ${property.host.lastName}\nEmail: ${property.host.email}`
        );
      }
    }, 'contact the host');
  };

  const handleChatWithHost = async () => {
    requireAuth(async () => {
      if (!property?.host) return;

      try {
        const conversation = await messageService.getOrCreateConversation(
          property.host.id,
          property.id
        );

        navigation.navigate('Chat', {
          conversationId: conversation.id,
          propertyTitle: property.title,
          otherUserName: `${property.host.firstName} ${property.host.lastName}`,
        });
      } catch (error: any) {
        console.error('Start chat error:', error);
        showError('Failed to start chat. Please try again.');
      }
    }, 'chat with the host');
  };

  const handleCallHost = () => {
    requireAuth(() => {
      if (!property?.host) return;

      Alert.alert(
        'Call Host',
        `You are about to start a voice call with ${property.host.firstName} ${property.host.lastName}. Make sure you have a stable internet connection.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start Call',
            onPress: () => {
              navigation.navigate('VoiceCall', {
                propertyId: property.id,
                otherUserId: property.host.id,
                otherUserName: `${property.host.firstName} ${property.host.lastName}`,
              });
            },
          },
        ]
      );
    }, 'call the host');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !property) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>❌</Text>
        <Text style={styles.errorTitle}>Failed to load</Text>
        <Text style={styles.errorSubtitle}>{error || 'Property not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPropertyDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasImages = property.images && property.images.length > 0;
  const displayImages = hasImages
    ? property.images
    : ['https://via.placeholder.com/400x300?text=No+Image'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentImageIndex(newIndex);
            }}
          >
            {displayImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[styles.image, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Wishlist Button */}
          <View style={styles.wishlistButtonContainer}>
            <WishlistButton propertyId={propertyId} size="medium" />
          </View>

          {/* Image Pagination Dots */}
          {displayImages.length > 1 && (
            <View style={styles.paginationContainer}>
              {displayImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {displayImages.length}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title and Rating */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{property.title}</Text>
            {property.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.rating}>{property.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {property.city}, {property.state}, {property.country}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(property.pricePerNight)}</Text>
            <Text style={styles.perNight}> / night</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this place</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Host Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Host Information</Text>
            <View style={styles.hostCard}>
              <View style={styles.hostAvatar}>
                <Text style={styles.hostAvatarText}>
                  {property.host.firstName[0]}
                  {property.host.lastName[0]}
                </Text>
              </View>
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>
                  {property.host.firstName} {property.host.lastName}
                </Text>
                <Text style={styles.hostEmail}>{property.host.email}</Text>
              </View>
            </View>
            <View style={styles.hostButtonsRow}>
              <TouchableOpacity
                style={[styles.hostActionButton, styles.chatButton]}
                onPress={handleChatWithHost}
              >
                <Text style={styles.chatButtonIcon}>💬</Text>
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.hostActionButton, styles.callButton]}
                onPress={handleCallHost}
              >
                <Text style={styles.callButtonIcon}>📞</Text>
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.hostActionButton, styles.contactButton]}
                onPress={handleContactHost}
              >
                <Text style={styles.contactButtonIcon}>📧</Text>
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Listed Date */}
          <View style={styles.section}>
            <Text style={styles.listedText}>
              Listed on {formatDate(property.createdAt)}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <View>
                <Text style={styles.sectionTitle}>Reviews</Text>
                {property.rating && (
                  <View style={styles.ratingSummary}>
                    <RatingStars rating={property.rating} size="small" showValue />
                    <Text style={styles.reviewCount}>
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.writeReviewButton}
                onPress={handleWriteReview}
              >
                <Text style={styles.writeReviewText}>Write a Review</Text>
              </TouchableOpacity>
            </View>

            {reviewsLoading ? (
              <ActivityIndicator style={styles.reviewsLoading} color="#007AFF" />
            ) : reviews.length > 0 ? (
              <View style={styles.reviewsList}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </View>
            ) : (
              <View style={styles.noReviewsContainer}>
                <Text style={styles.noReviewsEmoji}>⭐</Text>
                <Text style={styles.noReviewsTitle}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtitle}>
                  Be the first to share your experience!
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarPrice}>
          <Text style={styles.bottomBarPriceText}>
            {formatPrice(property.pricePerNight)}
          </Text>
          <Text style={styles.bottomBarPerNight}> / night</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow} accessibilityLabel="Book this property" accessibilityRole="button">
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  perNight: {
    fontSize: 16,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
  },
  hostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hostInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  hostEmail: {
    fontSize: 14,
    color: '#666666',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listedText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomBarPriceText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  bottomBarPerNight: {
    fontSize: 14,
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  writeReviewButton: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  writeReviewText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsLoading: {
    paddingVertical: 40,
  },
  reviewsList: {
    marginTop: 8,
  },
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  noReviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  noReviewsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#1a1a1a',
  },
  wishlistButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
  },
  hostButtonsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  hostActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  chatButton: {
    backgroundColor: '#007AFF',
  },
  chatButtonIcon: {
    fontSize: 16,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButtonIcon: {
    fontSize: 16,
  },
  callButton: {
    backgroundColor: '#34C759',
  },
  callButtonIcon: {
    fontSize: 16,
    color: '#fff',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PropertyDetailsScreen;
