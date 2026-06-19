import { PaymentProofResponse } from '../types/payment.types';

// API Configuration
const API_BASE_URL = 'https://stayconnect-ng-api.onrender.com/api/v1';

// Token Storage Keys
const ACCESS_TOKEN_KEY = 'access_token';

class PaymentService {
  // Get stored access token
  private async getAccessToken(): Promise<string | null> {
    try {
      const SecureStore = await import('expo-secure-store');
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Upload payment proof with multipart/form-data
  async uploadPaymentProof(
    bookingId: string,
    imageUri: string
  ): Promise<PaymentProofResponse> {
    const accessToken = await this.getAccessToken();

    // Create form data
    const formData = new FormData();

    // Get file extension and determine mime type
    const uriParts = imageUri.split('.');
    const fileExtension = uriParts[uriParts.length - 1];
    const mimeType = fileExtension.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';

    // Create file object
    const fileName = `payment_proof_${Date.now()}.${fileExtension}`;
    const file = {
      uri: imageUri,
      type: mimeType,
      name: fileName,
    } as unknown as Blob;

    formData.append('file', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for upload

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/upload-payment-proof`,
        {
          method: 'POST',
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
            // Note: Don't set Content-Type for multipart/form-data
            // The browser/fetch will set it with the boundary
          },
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed with status ${response.status}`
        );
      }

      const data: { data: PaymentProofResponse } = await response.json();
      return data.data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timeout. Please try again.');
        }
        throw error;
      }

      throw new Error('An unexpected error occurred during upload');
    }
  }

  // Get bank transfer details (can be fetched from backend or hardcoded)
  getBankTransferDetails(): {
    bankName: string;
    accountNumber: string;
    accountName: string;
  } {
    // These should ideally come from backend config
    return {
      bankName: 'First Bank of Nigeria',
      accountNumber: '0123456789',
      accountName: 'StayConnect NG Ltd',
    };
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
