export interface Review {
  id: string;
  propertyId: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewDto {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  propertyId: string;
  guestId: number;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaginatedReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PropertyReviewsSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
