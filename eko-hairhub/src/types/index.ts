// ============ CORE TYPES ============

export type UserRole = 'CUSTOMER' | 'STYLIST' | 'ADMIN';

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export type ServiceLocationType = 'SALON' | 'HOME';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface Stylist {
  id: string;
  userId: string;
  user: User;
  bio: string;
  specialties: string[];
  location: string;
  area: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  offersHomeService: boolean;
  homeServiceFee?: number;
  portfolioImages: PortfolioImage[];
  services: Service[];
  yearsExperience?: number;
  availability?: Availability[];
}

export interface PortfolioImage {
  id: string;
  url: string;
  caption?: string;
  hairstyleName?: string;
}

export interface Service {
  id: string;
  stylistId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  category: string;
}

export interface Hairstyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  popularityScore: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: User;
  stylistId: string;
  stylist: Stylist;
  serviceId: string;
  service: Service;
  hairstyleId?: string;
  hairstyle?: Hairstyle;
  status: BookingStatus;
  locationType: ServiceLocationType;
  address?: string;
  scheduledAt: string;
  totalAmount: number;
  payment?: Payment;
  review?: Review;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  paidAt?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customer: User;
  stylistId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Availability {
  dayOfWeek: number; // 0 = Sunday
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  isAvailable: boolean;
}

// ============ API TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateBookingRequest {
  stylistId: string;
  serviceId: string;
  hairstyleId?: string;
  locationType: ServiceLocationType;
  address?: string;
  scheduledAt: string;
}

export interface SearchStylistsParams {
  query?: string;
  area?: string;
  specialty?: string;
  minRating?: number;
  offersHomeService?: boolean;
  page?: number;
  limit?: number;
}
