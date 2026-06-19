import api from './api';
import {
  Booking,
  CreateBookingDto,
  BookingWithProperty,
  BookingResponse,
} from '../types/booking.types';

interface PaginatedBookingsResponse {
  data: BookingWithProperty[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class BookingService {
  // Create a new booking
  async createBooking(data: CreateBookingDto): Promise<BookingResponse> {
    const response = await api.post<BookingResponse>('/bookings', data);
    return response.data;
  }

  // Get current user's bookings
  async getMyBookings(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedBookingsResponse> {
    const response = await api.get<PaginatedBookingsResponse>(
      `/bookings/my-bookings?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get a single booking by ID
  async getBookingById(id: string): Promise<BookingWithProperty> {
    const response = await api.get<BookingWithProperty>(`/bookings/${id}`);
    return response.data;
  }

  // Cancel a booking
  async cancelBooking(id: string): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`, {});
    return response.data;
  }
}

// Export singleton instance
export const bookingService = new BookingService();
export default bookingService;
