import api from './api';
import {
  WishlistItem,
  WishlistResponse,
  AddToWishlistResponse,
  RemoveFromWishlistResponse,
} from '../types/wishlist.types';

class WishlistService {
  // Add a property to wishlist
  async addToWishlist(propertyId: string): Promise<AddToWishlistResponse> {
    const response = await api.post<AddToWishlistResponse>(`/wishlist/${propertyId}`, {});
    return response.data;
  }

  // Remove a property from wishlist
  async removeFromWishlist(propertyId: string): Promise<RemoveFromWishlistResponse> {
    const response = await api.delete<RemoveFromWishlistResponse>(`/wishlist/${propertyId}`);
    return response.data;
  }

  // Get all wishlist items for the current user
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await api.get<WishlistResponse>('/wishlist');
      return response.data.items;
    } catch (error: any) {
      // Wishlist feature not yet available on backend — return empty state
      if (error?.message?.includes('Cannot GET') || error?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  // Check if a property is in the wishlist
  async isInWishlist(propertyId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.some((item) => item.propertyId === propertyId);
    } catch (error) {
      console.error('Check wishlist status error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();
export default wishlistService;
