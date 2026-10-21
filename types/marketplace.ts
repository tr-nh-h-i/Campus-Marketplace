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
  role: 'buyer' | 'seller' | 'student';
  avatarUrl?: string;
  phone?: string;
}

export interface CheckoutSummary {
  subtotal: number;
  deliveryFee: number;
  deliveryType: 'campus_pickup' | 'dorm_delivery';
  discount: number;
  total: number;
}

export type ScreenState = 'loading' | 'empty' | 'error' | 'content';
