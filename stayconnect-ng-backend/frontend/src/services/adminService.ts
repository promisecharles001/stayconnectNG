import api from './api';
import {
  AdminStats,
  PendingProperty,
  PendingWithdrawal,
  PlatformUser,
  ApprovePropertyResponse,
  RejectPropertyResponse,
  ApproveWithdrawalResponse,
  RejectWithdrawalResponse,
  MarkWithdrawalPaidResponse,
  SuspendUserResponse,
  ActivateUserResponse,
  PendingPropertiesResponse,
  PendingWithdrawalsResponse,
  UsersResponse,
} from '../types/admin.types';

// Backend paginated shape
interface PaginatedBackendResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Backend user shape
interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: { name: string };
  status: string;
  createdAt: string;
}

// Backend property shape (subset we need)
interface BackendProperty {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  basePricePerNight: number;
  images: string[];
  status: string;
  hostId: string;
  createdAt: string;
}

// Backend withdrawal shape (subset we need)
interface BackendWithdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: string;
  createdAt: string;
  hostId: string;
}

class AdminService {
  // Get admin dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get<
      | AdminStats
      | {
          users: { total: number };
          properties: { total: number };
          bookings: { total: number };
          revenue: { total: number };
        }
    >('/admin/dashboard');

    const data = response.data;

    // Support both flat and nested backend shapes
    if ('totalUsers' in data) {
      return data as AdminStats;
    }

    const nested = data as {
      users: { total: number };
      properties: { total: number };
      bookings: { total: number };
      revenue: { total: number };
    };

    return {
      totalUsers: nested.users.total,
      totalProperties: nested.properties.total,
      totalBookings: nested.bookings.total,
      platformRevenue: nested.revenue.total,
    };
  }

  // Get pending properties for moderation
  async getPendingProperties(
    page: number = 1,
    limit: number = 20
  ): Promise<PendingPropertiesResponse> {
    const response = await api.get<
      PaginatedBackendResponse<BackendProperty>
    >(
      `/properties/admin/all?status=PENDING_APPROVAL&page=${page}&limit=${limit}`
    );

    const paginated = response.data;

    return {
      properties: paginated.data.map((p) => ({
        id: p.id,
        title: p.title,
        hostName: p.hostId,
        hostId: p.hostId,
        location: `${p.city}, ${p.state}`,
        pricePerNight: p.basePricePerNight,
        createdAt: p.createdAt,
        images: p.images,
        description: p.description,
      })),
      meta: {
        total: paginated.meta.total,
        page: paginated.meta.page,
        limit: paginated.meta.limit,
        totalPages: paginated.meta.totalPages,
      },
    };
  }

  // Approve a property listing
  async approveProperty(propertyId: string): Promise<ApprovePropertyResponse> {
    const response = await api.patch<ApprovePropertyResponse>(
      `/properties/${propertyId}/review`,
      { status: 'APPROVED', reviewNotes: 'Approved by admin' }
    );
    return response.data;
  }

  // Reject a property listing
  async rejectProperty(
    propertyId: string,
    reason?: string
  ): Promise<RejectPropertyResponse> {
    const response = await api.patch<RejectPropertyResponse>(
      `/properties/${propertyId}/review`,
      { status: 'REJECTED', rejectionReason: reason || 'Rejected by admin' }
    );
    return response.data;
  }

  // Get pending withdrawals for approval
  async getPendingWithdrawals(
    page: number = 1,
    limit: number = 20
  ): Promise<PendingWithdrawalsResponse> {
    const response = await api.get<
      PaginatedBackendResponse<BackendWithdrawal>
    >(
      `/withdrawals/all?status=PENDING&page=${page}&limit=${limit}`
    );

    const paginated = response.data;

    return {
      withdrawals: paginated.data.map((w) => ({
        id: w.id,
        hostName: w.hostId,
        hostId: w.hostId,
        amount: w.amount,
        bankName: w.bankName,
        accountNumber: w.accountNumber,
        status: w.status as PendingWithdrawal['status'],
        createdAt: w.createdAt,
      })),
      meta: {
        total: paginated.meta.total,
        page: paginated.meta.page,
        limit: paginated.meta.limit,
        totalPages: paginated.meta.totalPages,
      },
    };
  }

  // Approve a withdrawal request
  async approveWithdrawal(withdrawalId: string): Promise<ApproveWithdrawalResponse> {
    const response = await api.patch<ApproveWithdrawalResponse>(
      `/withdrawals/${withdrawalId}/process`,
      { status: 'COMPLETED' }
    );
    return response.data;
  }

  // Reject a withdrawal request
  async rejectWithdrawal(
    withdrawalId: string,
    reason?: string
  ): Promise<RejectWithdrawalResponse> {
    const response = await api.patch<RejectWithdrawalResponse>(
      `/withdrawals/${withdrawalId}/process`,
      { status: 'FAILED', failureReason: reason || 'Rejected by admin' }
    );
    return response.data;
  }

  // Mark withdrawal as paid
  async markWithdrawalPaid(withdrawalId: string): Promise<MarkWithdrawalPaidResponse> {
    const response = await api.patch<MarkWithdrawalPaidResponse>(
      `/withdrawals/${withdrawalId}/process`,
      { status: 'COMPLETED' }
    );
    return response.data;
  }

  // Get all users
  async getUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<UsersResponse> {
    const response = await api.get<
      PaginatedBackendResponse<BackendUser>
    >(`/users?page=${page}&limit=${limit}`);

    const paginated = response.data;

    return {
      users: paginated.data.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role.name as PlatformUser['role'],
        status: u.status as PlatformUser['status'],
        createdAt: u.createdAt,
      })),
      meta: {
        total: paginated.meta.total,
        page: paginated.meta.page,
        limit: paginated.meta.limit,
        totalPages: paginated.meta.totalPages,
      },
    };
  }

  // Suspend a user
  async suspendUser(userId: string, reason?: string): Promise<SuspendUserResponse> {
    const response = await api.patch<SuspendUserResponse>(
      `/users/${userId}/status`,
      { status: 'SUSPENDED' }
    );
    return response.data;
  }

  // Activate a suspended user
  async activateUser(userId: string): Promise<ActivateUserResponse> {
    const response = await api.patch<ActivateUserResponse>(
      `/users/${userId}/status`,
      { status: 'ACTIVE' }
    );
    return response.data;
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;
