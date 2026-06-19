export interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  availableBalance: number;
  totalBookings: number;
}

export interface BookingEarning {
  id: string;
  propertyTitle: string;
  guestName: string;
  amount: number;
  platformFee: number;
  hostAmount: number;
  status: EarningStatus;
  createdAt: string;
}

export type EarningStatus =
  | 'PENDING'
  | 'AVAILABLE'
  | 'WITHDRAWN'
  | 'CANCELLED';

export interface PaginatedEarningsResponse {
  data: BookingEarning[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountId: string;
}

export interface WithdrawalResponse {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
}
