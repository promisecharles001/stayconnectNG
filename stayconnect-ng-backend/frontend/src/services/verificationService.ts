import api from './api';
import {
  HostVerification,
  SubmitVerificationDto,
  VerificationResponse,
  VerificationStatusResponse,
  UploadResponse,
  VerificationStatus,
} from '../types/verification.types';

// Local interface matching backend KycResponseDto
interface KycBackendResponse {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  documentImageFront: string;
  documentImageBack: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  status: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  rejectionReason: string | null;
  selfieImage: string | null;
  selfieVerified: boolean;
  submittedAt: string;
}

class VerificationService {
  // Submit verification documents
  async submitVerification(data: SubmitVerificationDto): Promise<VerificationResponse> {
    const response = await api.post<VerificationResponse>('/kyc', data);
    return response.data;
  }

  // Get current verification status
  async getVerificationStatus(): Promise<VerificationStatusResponse> {
    const response = await api.get<KycBackendResponse | null>('/kyc/my-kyc');
    const kyc = response.data;

    // Map backend KYCStatus to frontend VerificationStatus
    const statusMap: Record<string, VerificationStatus> = {
      PENDING: 'PENDING',
      IN_REVIEW: 'PENDING',
      APPROVED: 'VERIFIED',
      REJECTED: 'REJECTED',
    };

    if (!kyc) {
      return { status: 'UNVERIFIED' };
    }

    const mappedStatus = statusMap[kyc.status] || 'UNVERIFIED';

    return {
      status: mappedStatus,
      verification: {
        id: kyc.id,
        userId: Number(kyc.userId),
        documentType: kyc.documentType as any,
        documentImage: kyc.documentImageFront || '',
        selfieImage: kyc.selfieImage || '',
        status: mappedStatus,
        rejectionReason: kyc.rejectionReason || undefined,
        createdAt: kyc.submittedAt?.toString() || new Date().toISOString(),
        updatedAt: kyc.reviewedAt?.toString() || new Date().toISOString(),
      },
    };
  }

  // Get full verification details
  async getVerificationDetails(): Promise<HostVerification | null> {
    const response = await api.get<HostVerification | null>('/kyc');
    return response.data;
  }

  // Upload document image
  async uploadDocument(file: { uri: string; name: string; type: string }): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await api.post<UploadResponse>('/kyc/upload/document', formData);
    return response.data;
  }

  // Upload selfie image
  async uploadSelfie(file: { uri: string; name: string; type: string }): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await api.post<UploadResponse>('/kyc/upload/selfie', formData);
    return response.data;
  }
}

// Export singleton instance
export const verificationService = new VerificationService();
export default verificationService;
