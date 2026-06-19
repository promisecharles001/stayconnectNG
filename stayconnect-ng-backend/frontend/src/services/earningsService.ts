import api from './api';
import {
  EarningsSummary,
  BookingEarning,
  PaginatedEarningsResponse,
  WithdrawalRequest,
  WithdrawalResponse,
} from '../types/earnings.types';

class EarningsService {
  // Get earnings summary for the host
  async getEarningsSummary(): Promise<EarningsSummary> {
    const response = await api.get<EarningsSummary>('/earnings/summary');
    return response.data;
  }

  // Get earnings bookings for the host
  async getEarningsBookings(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedEarningsResponse> {
    const response = await api.get<PaginatedEarningsResponse>(
      `/earnings/bookings?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Request a withdrawal
  async requestWithdrawal(data: WithdrawalRequest): Promise<WithdrawalResponse> {
    const response = await api.post<WithdrawalResponse>('/withdrawals', data);
    return response.data;
  }

  // Get withdrawal history
  async getWithdrawalHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: WithdrawalResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    interface WithdrawalHistoryResponse {
      data: WithdrawalResponse[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }
    const response = await api.get<WithdrawalHistoryResponse>(`/withdrawals?page=${page}&limit=${limit}`);
    return response.data;
  }
}

// Export singleton instance
export const earningsService = new EarningsService();
export default earningsService;
