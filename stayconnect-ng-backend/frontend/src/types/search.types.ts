export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  propertyType?: PropertyType;
  amenities?: Amenity[];
  availableDates?: {
    checkIn: string;
    checkOut: string;
  };
}

export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'CONDO'
  | 'CABIN'
  | 'COTTAGE'
  | 'LOFT'
  | 'STUDIO';

export type Amenity =
  | 'WIFI'
  | 'POOL'
  | 'GYM'
  | 'PARKING'
  | 'KITCHEN'
  | 'AC'
  | 'HEATING'
  | 'WASHER'
  | 'DRYER'
  | 'TV'
  | 'BALCONY'
  | 'GARDEN'
  | 'BBQ'
  | 'FIREPLACE'
  | 'PET_FRIENDLY'
  | 'SMOKE_FREE'
  | 'ELEVATOR'
  | 'SECURITY';

export interface SearchResult {
  id: string;
  title: string;
  location: string;
  city: string;
  state: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  image: string;
  propertyType: PropertyType;
  amenities: Amenity[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
}

export interface SearchResponse {
  results: SearchResult[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  propertyTypes: { value: PropertyType; label: string }[];
  amenities: { value: Amenity; label: string; icon: string }[];
  priceRange: {
    min: number;
    max: number;
    step: number;
  };
  ratingOptions: { value: number; label: string }[];
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  CONDO: 'Condo',
  CABIN: 'Cabin',
  COTTAGE: 'Cottage',
  LOFT: 'Loft',
  STUDIO: 'Studio',
};

export const AMENITY_LABELS: Record<Amenity, { label: string; icon: string }> = {
  WIFI: { label: 'WiFi', icon: '📶' },
  POOL: { label: 'Pool', icon: '🏊' },
  GYM: { label: 'Gym', icon: '💪' },
  PARKING: { label: 'Parking', icon: '🚗' },
  KITCHEN: { label: 'Kitchen', icon: '🍳' },
  AC: { label: 'Air Conditioning', icon: '❄️' },
  HEATING: { label: 'Heating', icon: '🔥' },
  WASHER: { label: 'Washer', icon: '🧺' },
  DRYER: { label: 'Dryer', icon: '👕' },
  TV: { label: 'TV', icon: '📺' },
  BALCONY: { label: 'Balcony', icon: '🌅' },
  GARDEN: { label: 'Garden', icon: '🌳' },
  BBQ: { label: 'BBQ', icon: '🍖' },
  FIREPLACE: { label: 'Fireplace', icon: '🔥' },
  PET_FRIENDLY: { label: 'Pet Friendly', icon: '🐾' },
  SMOKE_FREE: { label: 'Smoke Free', icon: '🚭' },
  ELEVATOR: { label: 'Elevator', icon: '🛗' },
  SECURITY: { label: 'Security', icon: '🔒' },
};

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  propertyTypes: [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOUSE', label: 'House' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'CABIN', label: 'Cabin' },
    { value: 'COTTAGE', label: 'Cottage' },
    { value: 'LOFT', label: 'Loft' },
    { value: 'STUDIO', label: 'Studio' },
  ],
  amenities: [
    { value: 'WIFI', label: 'WiFi', icon: '📶' },
    { value: 'POOL', label: 'Pool', icon: '🏊' },
    { value: 'GYM', label: 'Gym', icon: '💪' },
    { value: 'PARKING', label: 'Parking', icon: '🚗' },
    { value: 'KITCHEN', label: 'Kitchen', icon: '🍳' },
    { value: 'AC', label: 'AC', icon: '❄️' },
    { value: 'TV', label: 'TV', icon: '📺' },
    { value: 'PET_FRIENDLY', label: 'Pet Friendly', icon: '🐾' },
  ],
  priceRange: {
    min: 0,
    max: 1000000,
    step: 5000,
  },
  ratingOptions: [
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 1, label: '1+ Stars' },
  ],
};
