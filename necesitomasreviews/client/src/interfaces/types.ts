// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'PROMOTER' | 'REGIONAL_ADMIN' | 'SUPER_ADMIN';

// NFC Card related types
export interface NFCCard {
  id: string;
  uid: string;
  status: NFCCardStatus;
  googlePlaceId?: string;
  businessName?: string;
  activatedAt?: string;
  orderId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type NFCCardStatus = 'INACTIVE' | 'ACTIVE' | 'SUSPENDED';

export interface NFCCardStats {
  id: string;
  cardId: string;
  totalScans: number;
  uniqueScans: number;
  reviewConversions: number;
  lastScanAt?: string;
}

// Package related types
export interface Package {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  price: number;
  discountPrice?: number;
  features: string[];
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order related types
export interface Order {
  id: string;
  userId: string;
  packageId: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountCode?: string;
  promoterId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentData?: any;
  shippingAddress?: ShippingAddress;
  cards?: NFCCard[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'PAYPAL' | 'WEBPAY' | 'MERCADOPAGO';

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

// Promoter related types
export interface DiscountCode {
  id: string;
  code: string;
  discountPercentage: number;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  promoterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  promoterId: string;
  orderId: string;
  amount: number;
  status: CommissionStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommissionStatus = 'PENDING' | 'PAID';

// Region related types
export interface Region {
  id: string;
  name: string;
  code: string;
  country: string;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard related types
export interface DashboardSummary {
  totalCards: number;
  activeCards: number;
  totalScans: number;
  reviewConversions: number;
  conversionRate: number;
}

export interface AdminDashboardSummary extends DashboardSummary {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentActivations: NFCCard[];
}