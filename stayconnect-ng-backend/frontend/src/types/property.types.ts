export type PropertyStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude: number | null;
  longitude: number | null;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  houseRules?: string;
  checkInTime?: string;
  checkOutTime?: string;
  basePricePerNight: number;
  pricePerNight: number;
  cleaningFee?: number;
  commissionPercent?: number;
  status: PropertyStatus;
  images: string[];
  averageRating: number;
  rating: number | null;
  reviewCount: number;
  isInstantBook: boolean;
  minNights: number;
  maxNights?: number;
  hostId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  type?: string;
}

export interface PropertyHost {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  hostRating?: number;
  hostReviewCount?: number;
  hostSince?: string;
}

export interface PropertyDetails extends Property {
  host: PropertyHost;
}

export interface PropertyQueryParams {
  search?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedPropertiesResponse {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PropertyStats {
  propertyId: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
}
