export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export type DocumentType = 'GOVERNMENT_ID' | 'DRIVER_LICENSE' | 'PASSPORT';

export interface HostVerification {
  id: string;
  userId: number;
  documentType: DocumentType;
  documentImage: string;
  selfieImage: string;
  status: VerificationStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitVerificationDto {
  documentType: DocumentType;
  documentImage: string;
  selfieImage: string;
}

export interface VerificationResponse {
  id: string;
  userId: number;
  documentType: DocumentType;
  documentImage: string;
  selfieImage: string;
  status: VerificationStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationStatusResponse {
  status: VerificationStatus;
  verification?: HostVerification;
}

export interface UploadResponse {
  url: string;
  key: string;
}
