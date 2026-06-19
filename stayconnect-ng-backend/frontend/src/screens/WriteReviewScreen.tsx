import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import RatingStars from '../components/RatingStars';
import reviewService from '../services/reviewService';
import notificationService from '../services/notificationService';

type WriteReviewScreenRouteProp = RouteProp<AppStackParamList, 'WriteReview'>;
type WriteReviewScreenNavigationProp = StackNavigationProp<AppStackParamList, 'WriteReview'>;

interface RouteParams {
  propertyId: string;
  propertyTitle: string;
  bookingId?: string;
}

const WriteReviewScreen: React.FC = () => {
  const route = useRoute<WriteReviewScreenRouteProp>();
  const navigation = useNavigation<WriteReviewScreenNavigationProp>();
  
  const { propertyId, propertyTitle, bookingId } = route.params as RouteParams;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    // Validation
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert(
        'Comment Too Short',
        'Please write a comment of at least 10 characters.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        propertyId,
        rating,
        comment: comment.trim(),
      };

      await reviewService.createReview(reviewData);

      // Send notification for review submission
      await notificationService.sendLocalNotification({
        title: 'Review Submitted',
        body: `Thank you for reviewing ${propertyTitle}!`,
        data: {
          type: 'review',
          propertyId,
        },
      });

      Alert.alert(
        'Review Submitted!',
        'Thank you for your feedback. Your review has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to PropertyDetailsScreen
              navigation.navigate('PropertyDetails', { propertyId });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Review submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Failed to submit review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Tap to rate';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Info */}
          <View style={styles.propertyCard}>
            <Text style={styles.propertyLabel}>Reviewing</Text>
            <Text style={styles.propertyTitle}>{propertyTitle}</Text>
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How was your stay?</Text>
            <View style={styles.ratingContainer}>
              <RatingStars
                rating={rating}
                size="large"
                interactive
                onRatingChange={setRating}
              />
              <Text style={styles.ratingLabel}>
                {getRatingLabel(rating)}
              </Text>
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Share your experience</Text>
            <Text style={styles.sectionSubtitle}>
              What did you like? What could be improved?
            </Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Write your review here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {comment.length}/500 characters
            </Text>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelinesCard}>
            <Text style={styles.guidelinesTitle}>💡 Tips for a great review</Text>
            <Text style={styles.guidelineText}>• Be specific about your experience</Text>
            <Text style={styles.guidelineText}>• Mention what you liked or disliked</Text>
            <Text style={styles.guidelineText}>• Keep it honest and constructive</Text>
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || comment.trim().length < 10 || isSubmitting) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || comment.trim().length < 10 || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  propertyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  ratingLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f9f9f9',
    minHeight: 150,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  guidelinesCard: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  guidelineText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
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
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
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

export default WriteReviewScreen;
