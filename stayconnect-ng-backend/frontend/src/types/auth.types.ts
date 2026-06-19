// User Roles
export type UserRole = 'ADMIN' | 'HOST' | 'GUEST';

// User Status
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

// Role Interface
export interface Role {
  id: string;
  name: UserRole;
  description?: string | null;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  hostRating?: number;
  hostReviewCount?: number;
  guestRating?: number;
  guestReviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Tokens Interface
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register Request
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

// Auth Response from Backend
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth Context State
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth Context Actions
export interface AuthContextActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

// Combined Auth Context Type
export type AuthContextType = AuthState & AuthContextActions;
