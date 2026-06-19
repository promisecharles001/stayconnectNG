import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PropertyCard from '../PropertyCard';
import { Property } from '../../types/property.types';

const mockProperty: Property = {
  id: '1',
  title: 'Luxury Apartment in Lagos',
  description: 'A beautiful apartment',
  propertyType: 'APARTMENT',
  address: '123 Main St',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  latitude: null,
  longitude: null,
  maxGuests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 2,
  amenities: [],
  basePricePerNight: 15000,
  pricePerNight: 15000,
  status: 'APPROVED',
  images: ['https://example.com/image.jpg'],
  averageRating: 4.5,
  rating: 4.5,
  reviewCount: 10,
  isInstantBook: false,
  minNights: 1,
  hostId: 'host-1',
  createdAt: new Date().toISOString(),
};

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} onPress={() => {}} />);
    expect(screen.getByText('Luxury Apartment in Lagos')).toBeTruthy();
  });

  it('renders location', () => {
    render(<PropertyCard property={mockProperty} onPress={() => {}} />);
    expect(screen.getByText(/Lagos, Lagos/)).toBeTruthy();
  });

  it('renders price', () => {
    render(<PropertyCard property={mockProperty} onPress={() => {}} />);
    expect(screen.getByText(/₦15,000/)).toBeTruthy();
  });

  it('renders rating when available', () => {
    render(<PropertyCard property={mockProperty} onPress={() => {}} />);
    expect(screen.getByText('4.5')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<PropertyCard property={mockProperty} onPress={onPress} />);

    const card = screen.getByText('Luxury Apartment in Lagos');
    fireEvent.press(card);

    expect(onPress).toHaveBeenCalledWith(mockProperty);
  });

  it('has accessibility label', () => {
    render(<PropertyCard property={mockProperty} onPress={() => {}} />);
    const card = screen.getByLabelText('View Luxury Apartment in Lagos');
    expect(card).toBeTruthy();
  });
});
