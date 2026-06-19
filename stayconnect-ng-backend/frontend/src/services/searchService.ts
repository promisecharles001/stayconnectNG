import api from './api';
import {
  SearchFilters,
  SearchResponse,
  FilterOptions,
  DEFAULT_FILTER_OPTIONS,
} from '../types/search.types';

// Backend returns { data: Property[], meta: {...} }
interface BackendPropertiesResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

class SearchService {
  // Transform backend response to SearchResponse format
  private transformResponse(response: BackendPropertiesResponse): SearchResponse {
    return {
      results: response.data || [],
      meta: {
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 20,
        totalPages: response.meta?.totalPages || 1,
      },
    };
  }

  // Search properties by query string - uses the main /properties endpoint with search param
  async searchProperties(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse> {
    const params = new URLSearchParams();
    params.append('search', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get<BackendPropertiesResponse>(
      `/properties?${params.toString()}`
    );
    return this.transformResponse(response.data);
  }

  // Filter properties with advanced filters - uses the main /properties endpoint
  async filterProperties(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters.location) {
      params.append('city', filters.location);
    }
    if (filters.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.propertyType) {
      params.append('propertyType', filters.propertyType);
    }

    const response = await api.get<BackendPropertiesResponse>(
      `/properties?${params.toString()}`
    );
    return this.transformResponse(response.data);
  }

  // Combined search and filter - uses the main /properties endpoint
  async searchAndFilter(
    query: string,
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResponse> {
    const params = new URLSearchParams();
    params.append('search', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters.location) {
      params.append('city', filters.location);
    }
    if (filters.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.propertyType) {
      params.append('propertyType', filters.propertyType);
    }

    const url = `/properties?${params.toString()}`;
    console.log('Search URL:', url);
    
    const response = await api.get<BackendPropertiesResponse>(url);
    console.log('Search response:', JSON.stringify(response, null, 2));
    
    return this.transformResponse(response.data);
  }

  // Get filter options (can be used to populate filter UI)
  getFilterOptions(): FilterOptions {
    return DEFAULT_FILTER_OPTIONS;
  }

  // Get popular search suggestions
  async getPopularSearches(): Promise<string[]> {
    // This endpoint doesn't exist on backend, return empty array
    return [];
  }

  // Get recent searches for the current user
  async getRecentSearches(): Promise<string[]> {
    // This endpoint doesn't exist on backend, return empty array
    return [];
  }

  // Save a search query to recent searches
  async saveSearch(query: string): Promise<void> {
    // This endpoint doesn't exist on backend, do nothing
    console.log('Save search not implemented:', query);
  }
}

// Export singleton instance
export const searchService = new SearchService();
export default searchService;
