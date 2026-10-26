import { StateCreator } from 'zustand';
import { CartItem, Listing } from '../types/marketplace';
import { saveUserCart } from '../services/authStorage';
import { RootStore } from './index';

export interface CartSlice {
  cartItems: CartItem[];
  deliveryType: 'campus_pickup' | 'dorm_delivery';
  addToCart: (listing: Listing) => { success: boolean; message: string };
  removeFromCart: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => { success: boolean; message: string };
  setDeliveryType: (type: 'campus_pickup' | 'dorm_delivery') => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<RootStore, [], [], CartSlice> = (set, get) => ({
  cartItems: [],
  deliveryType: 'campus_pickup',

  addToCart: (listing: Listing) => {
    const { cartItems, user } = get();
    const existing = cartItems.find((item) => item.listingId === listing.id);

    if (existing) {
      if (existing.quantity >= listing.stock) {
        return {
          success: false,
          message: `Rất tiếc! Người bán chỉ còn ${listing.stock} sản phẩm trong kho.`,
        };
      }
      const updated = cartItems.map((item) =>
        item.listingId === listing.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      set({ cartItems: updated });
      if (user) saveUserCart(user.id, updated);
      return { success: true, message: 'Đã tăng số lượng trong giỏ hàng!' };
    }

    if (listing.stock <= 0) {
      return {
        success: false,
        message: 'Sản phẩm này hiện tại đã hết hàng.',
      };
    }

    const updated = [...cartItems, { listingId: listing.id, listing, quantity: 1 }];
    set({ cartItems: updated });
    if (user) saveUserCart(user.id, updated);
    return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng!' };
  },

  removeFromCart: (listingId: string) => {
    const { cartItems, user } = get();
    const updated = cartItems.filter((i) => i.listingId !== listingId);
    set({ cartItems: updated });
    if (user) saveUserCart(user.id, updated);
  },

  updateQuantity: (listingId: string, quantity: number) => {
    const { cartItems, user } = get();
    const item = cartItems.find((i) => i.listingId === listingId);
    if (!item) return { success: false, message: 'Không tìm thấy sản phẩm' };

    if (quantity <= 0) {
      const updated = cartItems.filter((i) => i.listingId !== listingId);
      set({ cartItems: updated });
      if (user) saveUserCart(user.id, updated);
      return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ' };
    }

    if (quantity > item.listing.stock) {
      return {
        success: false,
        message: `Số lượng vượt quá tồn kho (tối đa: ${item.listing.stock})`,
      };
    }

    const updated = cartItems.map((i) =>
      i.listingId === listingId ? { ...i, quantity } : i
    );
    set({ cartItems: updated });
    if (user) saveUserCart(user.id, updated);
    return { success: true, message: 'Đã cập nhật số lượng' };
  },

  setDeliveryType: (deliveryType) => {
    set({ deliveryType });
  },

  clearCart: () => {
    const { user } = get();
    set({ cartItems: [] });
    if (user) saveUserCart(user.id, []);
  },
});
