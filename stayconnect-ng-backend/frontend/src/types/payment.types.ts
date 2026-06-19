export interface UploadPaymentProofDto {
  bookingId: string;
  imageUrl: string;
}

export interface PaymentProofResponse {
  id: string;
  bookingId: string;
  imageUrl: string;
  status: PaymentProofStatus;
  createdAt: string;
}

export type PaymentProofStatus =
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED';

export interface BankTransferDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  referencePrefix: string;
}

export interface SelectedImage {
  uri: string;
  type: string;
  name: string;
}
