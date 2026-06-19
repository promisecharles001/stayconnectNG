import api from './api';
import {
  Withdrawal,
  CreateWithdrawalDto,
  WithdrawalResponse,
  WithdrawalsResponse,
  WithdrawalHistoryResponse,
} from '../types/withdrawal.types';

class WithdrawalService {
  // Request a new withdrawal
  async requestWithdrawal(data: CreateWithdrawalDto): Promise<WithdrawalResponse> {
    const response = await api.post<WithdrawalResponse>('/withdrawals', data);
    return response.data;
  }

  // Get all withdrawals for the current user
  async getWithdrawals(
    page: number = 1,
    limit: number = 20
  ): Promise<WithdrawalsResponse> {
    const response = await api.get<WithdrawalsResponse>(
      `/withdrawals?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get withdrawal history
  async getWithdrawalHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<WithdrawalHistoryResponse> {
    const response = await api.get<WithdrawalHistoryResponse>(
      `/withdrawals?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get a single withdrawal by ID
  async getWithdrawalById(id: string): Promise<Withdrawal> {
    const response = await api.get<Withdrawal>(`/withdrawals/${id}`);
    return response.data;
  }

  // Cancel a pending withdrawal
  async cancelWithdrawal(id: string): Promise<void> {
    await api.delete(`/withdrawals/${id}`);
  }
}

// Export singleton instance
export const withdrawalService = new WithdrawalService();
export default withdrawalService;
