import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SessionSlice, createSessionSlice } from './sessionSlice';
import { CartSlice, createCartSlice } from './cartSlice';
import { FavouritesSlice, createFavouritesSlice } from './favouritesSlice';
import { PreferencesSlice, createPreferencesSlice } from './preferencesSlice';

export type RootStore = SessionSlice & CartSlice & FavouritesSlice & PreferencesSlice;

export const PERSIST_STORAGE_KEY = 'campus_marketplace_persisted_state';

export const useAppStore = create<RootStore>()(
  persist(
    (...a) => ({
      ...createSessionSlice(...a),
      ...createCartSlice(...a),
      ...createFavouritesSlice(...a),
      ...createPreferencesSlice(...a),
    }),
    {
      name: PERSIST_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // BẢO MẬT BẮT BUỘC: Chỉ lưu themeMode vào global persisted state.
      // Giỏ hàng và Mục yêu thích được cô lập và lưu theo từng userId riêng biệt!
      // Token & Session được bảo mật bằng SecureStore!
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);

// ==========================================
// ATOMIC SELECTORS & DERIVED VALUES
// ==========================================

export const selectIsAuthenticated = (state: RootStore): boolean => !!state.token;

export const selectCurrentUser = (state: RootStore) => state.user;

export const selectIsSeller = (state: RootStore): boolean => state.user?.role === 'seller';

export const selectCartTotalCount = (state: RootStore): number =>
  state.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: RootStore): number =>
  state.cartItems.reduce((sum, item) => sum + item.listing.price * item.quantity, 0);

export const selectCartDeliveryFee = (state: RootStore): number => {
  if (state.cartItems.length === 0) return 0;
  // Quy tắc vận chuyển: Nhận tại cổng trường = Miễn phí (0đ); Giao tận phòng KTX = 15.000đ
  return state.deliveryType === 'dorm_delivery' ? 15000 : 0;
};

export const selectCartFinalTotal = (state: RootStore): number => {
  const subtotal = selectCartSubtotal(state);
  const delivery = selectCartDeliveryFee(state);
  return subtotal + delivery;
};

export const selectFavouriteIds = (state: RootStore) => state.favouriteIds;

export const selectIsFavourite = (id: string) => (state: RootStore) =>
  state.favouriteIds.includes(id);
