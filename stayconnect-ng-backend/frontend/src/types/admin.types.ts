export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  platformRevenue: number;
}

export interface PendingProperty {
  id: string;
  title: string;
  hostName: string;
  hostId: string;
  location: string;
  pricePerNight: number;
  createdAt: string;
  images?: string[];
  description?: string;
}

export interface PendingWithdrawal {
  id: string;
  hostName: string;
  hostId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'HOST' | 'GUEST';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface ApprovePropertyResponse {
  id: string;
  status: string;
  message: string;
}

export interface RejectPropertyResponse {
  id: string;
  status: string;
  message: string;
}

export interface ApproveWithdrawalResponse {
  id: string;
  status: string;
  message: string;
}

export interface RejectWithdrawalResponse {
  id: string;
  status: string;
  message: string;
}

export interface MarkWithdrawalPaidResponse {
  id: string;
  status: string;
  message: string;
}

export interface SuspendUserResponse {
  id: string;
  status: string;
  message: string;
}

export interface ActivateUserResponse {
  id: string;
  status: string;
  message: string;
}

export interface PendingPropertiesResponse {
  properties: PendingProperty[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PendingWithdrawalsResponse {
  withdrawals: PendingWithdrawal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UsersResponse {
  users: PlatformUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
