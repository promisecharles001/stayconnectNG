import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  interactive = false,
  onRatingChange,
  showValue = false,
}) => {
  const getStarSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      case 'medium':
      default:
        return 24;
    }
  };

  const getStarStyle = (starSize: number) => ({
    fontSize: starSize,
    lineHeight: starSize * 1.2,
  });

  const renderStar = (index: number) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= rating;
    const isHalf = !isFilled && starNumber - 0.5 <= rating;

    const starSize = getStarSize();
    const starStyle = getStarStyle(starSize);

    let starContent = '☆'; // Empty star
    if (isFilled) {
      starContent = '★'; // Filled star
    } else if (isHalf) {
      starContent = '⯪'; // Half star (may not render on all devices)
    }

    if (interactive) {
      return (
        <TouchableOpacity
          key={index}
          style={styles.starButton}
          onPress={() => onRatingChange?.(starNumber)}
          activeOpacity={0.6}
        >
          <Text style={[styles.star, starStyle, isFilled && styles.filledStar]}>
            {isFilled ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text
        key={index}
        style={[styles.star, starStyle, isFilled && styles.filledStar]}
      >
        {starContent}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </View>
      {showValue && (
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    color: '#ddd',
  },
  filledStar: {
    color: '#FFB800',
  },
  starButton: {
    padding: 4,
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default RatingStars;
