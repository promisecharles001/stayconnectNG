import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import {
  AuthContextType,
  AuthState,
  RegisterRequest,
  User,
} from '../types/auth.types';

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is already authenticated
  const checkAuthStatus = async (): Promise<void> => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        // Try to get user profile
        try {
          const user = await authService.getProfile();
          setState({
            user,
            tokens: null, // Tokens are stored in SecureStore
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshed = await authService.refreshToken();
          
          if (refreshed) {
            const user = await authService.getProfile();
            setState({
              user,
              tokens: null,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            // Refresh failed, clear state
            setState({
              ...initialState,
              isLoading: false,
            });
          }
        }
      } else {
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.login({ email, password });
      console.log('AuthContext login response:', JSON.stringify(response, null, 2));
      
      if (!response || !response.user) {
        throw new Error('Invalid login response: missing user data');
      }
      
      setState({
        user: response.user,
        tokens: response.tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterRequest): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.register(data);
      console.log('AuthContext register response:', JSON.stringify(response, null, 2));
      
      if (!response || !response.user) {
        throw new Error('Invalid registration response: missing user data');
      }
      
      setState({
        user: response.user,
        tokens: response.tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Register error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshed = await authService.refreshToken();
      
      if (refreshed && !state.user) {
        // If token refreshed but no user data, fetch profile
        const user = await authService.getProfile();
        setState({
          user,
          tokens: null,
          isLoading: false,
          isAuthenticated: true,
        });
      }
      
      return refreshed;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Update user data
  const updateUser = (user: User): void => {
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
