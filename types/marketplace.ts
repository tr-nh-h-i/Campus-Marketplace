export type ProductCategory =
  | 'all'
  | 'textbook'
  | 'stationery'
  | 'electronics'
  | 'dorm_supplies'
  | 'clothing';

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  title: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number; // Dùng để kích hoạt local notification khi giá giảm
  stock: number;
  photoUri: string;
  photoCompressedSizeKb?: number; // Chứng minh nén ảnh
  photoOriginalSizeKb?: number;
  description: string;
  createdAt: string;
  condition: 'like_new' | 'good' | 'fair';
}

export interface CartItem {
  listingId: string;
  listing: Listing;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'student';
  isAdmin?: boolean;
  avatarUrl?: string;
  phone?: string;
  studentId?: string;
  createdAt?: string;
}

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin';
  isAdmin?: boolean;
  studentId?: string;
  phone?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  studentId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryType: 'campus_pickup' | 'dorm_delivery';
  total: number;
  status: string;
  createdAt: string;
}

export interface CheckoutSummary {
  subtotal: number;
  deliveryFee: number;
  deliveryType: 'campus_pickup' | 'dorm_delivery';
  discount: number;
  total: number;
}

export type ScreenState = 'loading' | 'empty' | 'error' | 'content';
