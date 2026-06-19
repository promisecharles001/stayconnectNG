import api from './api';
import {
  Property,
  PropertyDetails,
  PropertyQueryParams,
  PaginatedPropertiesResponse,
  PropertyStats,
} from '../types/property.types';

class PropertyService {
  // Get all properties with optional filtering
  async getProperties(
    params: PropertyQueryParams = {}
  ): Promise<PaginatedPropertiesResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.city) {
      queryParams.append('city', params.city);
    }
    if (params.state) {
      queryParams.append('state', params.state);
    }
    if (params.minPrice !== undefined) {
      queryParams.append('minPrice', params.minPrice.toString());
    }
    if (params.maxPrice !== undefined) {
      queryParams.append('maxPrice', params.maxPrice.toString());
    }
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';

    const response = await api.get<PaginatedPropertiesResponse>(endpoint);
    return response.data;
  }

  // Get a single property by ID
  async getPropertyById(id: string): Promise<PropertyDetails> {
    const response = await api.get<PropertyDetails>(`/properties/${id}`);
    return response.data;
  }

  // Get current host's properties
  async getMyProperties(
    params: PropertyQueryParams = {}
  ): Promise<PaginatedPropertiesResponse> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/properties/my-properties?${queryString}`
      : '/properties/my-properties';

    const response = await api.get<PaginatedPropertiesResponse>(endpoint);
    return response.data;
  }

  // Upload images to Cloudinary
  async uploadImages(base64Images: string[]): Promise<string[]> {
    const response = await api.post<{ urls: string[] }>('/upload/images', {
      images: base64Images,
    });
    return response.data.urls;
  }

  // Create a new property
  async createProperty(
    data: {
      title: string;
      description: string;
      type: string;
      pricePerNight: number;
      maxGuests: number;
      bedrooms: number;
      beds: number;
      bathrooms: number;
      address: string;
      city: string;
      state: string;
      country: string;
      zipCode?: string;
      amenities: string[];
      images: string[];
      cleaningFee?: number;
      houseRules?: string;
      checkInTime?: string;
      checkOutTime?: string;
      minNights?: number;
      maxNights?: number;
    },
  ): Promise<Property> {
    // Upload images to Cloudinary first
    let imageUrls = data.images;
    const hasBase64Images = data.images.some((img) => img.startsWith('data:'));
    if (hasBase64Images) {
      imageUrls = await this.uploadImages(data.images);
    }

    const propertyData = {
      title: data.title,
      description: data.description,
      propertyType: data.type,
      basePricePerNight: data.pricePerNight,
      maxGuests: data.maxGuests,
      bedrooms: data.bedrooms,
      beds: data.beds,
      bathrooms: data.bathrooms,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.zipCode,
      amenities: data.amenities,
      images: imageUrls,
      cleaningFee: data.cleaningFee,
      houseRules: data.houseRules,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      minNights: data.minNights,
      maxNights: data.maxNights,
    };

    const response = await api.post<Property>('/properties', propertyData);
    return response.data;
  }

  // Update an existing property
  async updateProperty(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      propertyType: string;
      basePricePerNight: number;
      maxGuests: number;
      bedrooms: number;
      beds: number;
      bathrooms: number;
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      amenities: string[];
      images: string[];
      cleaningFee: number;
      houseRules: string;
      checkInTime: string;
      checkOutTime: string;
      minNights: number;
      maxNights: number;
    }>,
  ): Promise<Property> {
    // Upload any new base64 images to Cloudinary
    if (data.images && data.images.length > 0) {
      const hasBase64Images = data.images.some((img) => img.startsWith('data:'));
      if (hasBase64Images) {
        const imageUrls = await this.uploadImages(data.images);
        data.images = imageUrls;
      }
    }

    const response = await api.patch<Property>(`/properties/${id}`, data);
    return response.data;
  }

  // Delete a property
  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  }

  // Get property statistics
  async getPropertyStats(id: string): Promise<PropertyStats> {
    const response = await api.get<PropertyStats>(`/properties/${id}/stats`);
    return response.data;
  }
}

// Export singleton instance
export const propertyService = new PropertyService();
export default propertyService;
