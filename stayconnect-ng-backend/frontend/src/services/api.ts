import * as SecureStore from 'expo-secure-store';

// API Configuration
// Use environment variable if available, fallback to localhost for development
const API_BASE_URL = 'https://stayconnect-ng-api.onrender.com/api/v1';

// Token Storage Keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// API Response Interface
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Token Refresh Response
interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class ApiService {
  private baseURL: string;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Get stored access token
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Get stored refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Save tokens to secure storage
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw new Error('Failed to save authentication tokens');
    }
  }

  // Clear tokens from storage
  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (!refreshToken) {
        // Expected for new users who haven't logged in yet
        return false;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30s

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // Refresh token is invalid or expired
          await this.clearTokens();
          return false;
        }
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const result: TokenRefreshResponse = await response.json();
      
      if (result.accessToken && result.refreshToken) {
        await this.saveTokens(result.accessToken, result.refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      // Only log non-abort errors to reduce noise
      if (error instanceof Error && error.name === 'AbortError') {
        // Timeout - server might be slow or unreachable, don't spam console
        console.log('Token refresh timed out - server may be unreachable');
      } else {
        console.error('Token refresh error:', error);
      }
      return false;
    }
  }

  // Main request method with automatic token refresh
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get access token
    const accessToken = await this.getAccessToken();
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add authorization header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Setup timeout - 60s for mobile networks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - try to refresh token (skip for auth endpoints)
      const isAuthEndpoint = endpoint.startsWith('/auth/');
      if (response.status === 401 && retryCount > 0 && !isAuthEndpoint) {
        const refreshed = await this.refreshAccessToken();
        
        if (refreshed) {
          // Retry the original request with new token
          return this.request<T>(endpoint, options, retryCount - 1);
        } else {
          // Token refresh failed, clear tokens and throw error
          await this.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }

      // Handle other error status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      // Parse successful response
      const rawData = await response.json();
      console.log('API Response:', JSON.stringify(rawData, null, 2));

      // Always wrap in { data: ... } so callers get a consistent ApiResponse<T> shape.
      // This handles null, arrays, direct objects, and paginated { data, meta } alike.
      const data: ApiResponse<T> = { data: rawData as T };
      console.log('Wrapped Response:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please check your connection.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // HTTP Method Helpers
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL);
export default api;
