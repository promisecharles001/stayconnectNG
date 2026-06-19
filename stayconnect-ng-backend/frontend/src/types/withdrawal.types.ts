export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: WithdrawalStatus;
  createdAt: string;
  updatedAt?: string;
  processedAt?: string;
  rejectionReason?: string;
}

export interface CreateWithdrawalDto {
  amount: number;
  bankName: string;
  accountNumber: string;
}

export interface WithdrawalResponse {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: WithdrawalStatus;
  createdAt: string;
}

export interface WithdrawalsResponse {
  withdrawals: Withdrawal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WithdrawalHistoryResponse {
  data: Withdrawal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AvailableBalanceResponse {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
}
