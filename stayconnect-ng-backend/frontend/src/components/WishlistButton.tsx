import React, { useState, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import wishlistService from '../services/wishlistService';
import { useToast } from '../context/ToastContext';

interface WishlistButtonProps {
  propertyId: string;
  size?: 'small' | 'medium' | 'large';
  onToggle?: (isSaved: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  propertyId,
  size = 'medium',
  onToggle,
}) => {
  const { showError, showSuccess } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if property is in wishlist on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [propertyId]);

  const checkWishlistStatus = async () => {
    try {
      setIsChecking(true);
      const saved = await wishlistService.isInWishlist(propertyId);
      setIsSaved(saved);
    } catch (error) {
      console.error('Check wishlist status error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggle = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(propertyId);
        setIsSaved(false);
        onToggle?.(false);
        showSuccess('Removed from wishlist');
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(propertyId);
        setIsSaved(true);
        onToggle?.(true);
        showSuccess('Saved to wishlist');
      }
    } catch (error: any) {
      console.error('Wishlist toggle error:', error);
      showError(error.message || 'Failed to update wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isSaved, isLoading, propertyId, onToggle]);

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { fontSize: 20, padding: 4 };
      case 'large':
        return { fontSize: 32, padding: 8 };
      case 'medium':
      default:
        return { fontSize: 24, padding: 6 };
    }
  };

  const sizeStyle = getSizeStyle();

  if (isChecking) {
    return (
      <TouchableOpacity style={[styles.button, { padding: sizeStyle.padding }]} disabled>
        <ActivityIndicator size="small" color="#FF3B30" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, { padding: sizeStyle.padding }]}
      onPress={handleToggle}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FF3B30" />
      ) : (
        <Text style={[styles.heartIcon, { fontSize: sizeStyle.fontSize }]}>
          {isSaved ? '♥' : '♡'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIcon: {
    color: '#FF3B30',
  },
});

export default WishlistButton;
