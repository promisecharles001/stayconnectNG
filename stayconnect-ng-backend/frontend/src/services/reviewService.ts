import api from './api';
import {
  Review,
  CreateReviewDto,
  ReviewResponse,
  PaginatedReviewsResponse,
} from '../types/review.types';

class ReviewService {
  // Create a new review
  async createReview(data: CreateReviewDto): Promise<ReviewResponse> {
    const response = await api.post<ReviewResponse>('/reviews', data);
    return response.data;
  }

  // Get reviews for a property
  async getPropertyReviews(
    propertyId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedReviewsResponse> {
    const response = await api.get<PaginatedReviewsResponse>(
      `/reviews/property/${propertyId}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get a single review by ID
  async getReviewById(id: string): Promise<Review> {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  }

  // Update a review
  async updateReview(id: string, data: Partial<CreateReviewDto>): Promise<Review> {
    const response = await api.patch<Review>(`/reviews/${id}`, data);
    return response.data;
  }

  // Delete a review
  async deleteReview(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  }
}

// Export singleton instance
export const reviewService = new ReviewService();
export default reviewService;
