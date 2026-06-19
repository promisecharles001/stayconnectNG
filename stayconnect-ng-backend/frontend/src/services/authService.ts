import api from './api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/auth.types';

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('Login called with:', credentials.email);
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    console.log('Login API response:', JSON.stringify(response, null, 2));
    
    if (response.data && response.data.tokens) {
      // Save tokens to secure storage
      await api.saveTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }
    
    return response.data;
  }

  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    if (response.data && response.data.tokens) {
      // Save tokens to secure storage
      await api.saveTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional, depending on backend implementation)
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local tokens
      await api.clearTokens();
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  }

  // Check if user is authenticated (has valid tokens)
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await api.getAccessToken();
    return !!accessToken;
  }

  // Refresh tokens
  async refreshToken(): Promise<boolean> {
    return await api.refreshAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
