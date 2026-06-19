export interface Booking {
  id: string;
  propertyId: string;
  guestId: number;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_HOST_APPROVAL'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface CreateBookingDto {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingWithProperty extends Booking {
  property: {
    id: string;
    title: string;
    images: string[];
    city: string;
    state: string;
    basePricePerNight: number;
  };
}

export interface BookingResponse {
  id: string;
  propertyId: string;
  guestId: number;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface BookingSummaryData {
  numberOfNights: number;
  pricePerNight: number;
  totalCost: number;
}
