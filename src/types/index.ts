/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  authProvider: 'local' | 'google';
  createdAt: string;
  updatedAt: string;
}

export type StudioCategory =
  | 'daylight-loft'
  | 'cyclorama'
  | 'soundstage'
  | 'black-box'
  | 'industrial-warehouse'
  | 'rooftop'
  | 'other';

export interface Studio {
  _id: string;
  title: string;
  category: string;
  description: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  images: string[];
  amenities: string[];
  owner: string | User;
  ownerName: string;
  ownerEmail: string;
  rating?: number;
  reviewCount?: number;
  squareFootage?: number;
  ceilingHeight?: number;
  powerAmperage?: number;
  stcRating?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface Booking {
  _id: string;
  studio: Studio | string;
  user: User | string;
  host: User | string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  duration: number;
  hourlyRateSnapshot: number;
  securityDepositSnapshot: number;
  subtotal: number;
  totalAmount: number;
  status: BookingStatus;
  crewSize?: number;
  productionType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  _id: string;
  user: string;
  studio: Studio;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

