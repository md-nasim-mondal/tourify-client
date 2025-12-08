/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'TOURIST' | 'GUIDE' | 'ADMIN' | 'SUPER_ADMIN';
  photo?: string;
  bio?: string;
  contactNo?: string;
  address?: string;
  expertise?: string[];
  languagesSpoken?: string[];
  dailyRate?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration?: string;
  maxGroupSize?: number;
  category?: string;
  languages?: string[];
  meetingPoint?: string;
  images: string[];
  guideId: string;
  guide: Partial<User>;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice?: number;
  touristId: string;
  listingId: string;
  listing?: Partial<Listing>;
  tourist?: Partial<User>;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  bookingId: string;
  paymentGatewayData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  touristId: string;
  listingId: string;
  tourist?: Partial<User>;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  needPasswordChange: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}