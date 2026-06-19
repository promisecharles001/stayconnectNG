export interface WishlistItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  location: string;
  pricePerNight: number;
  rating: number | null;
  createdAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
}

export interface AddToWishlistResponse {
  id: string;
  propertyId: string;
  userId: number;
  createdAt: string;
}

export interface RemoveFromWishlistResponse {
  success: boolean;
  message: string;
}
