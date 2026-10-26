import { StateCreator } from 'zustand';
import { User } from '../types/marketplace';
import {
  saveSessionToken,
  clearSessionToken,
  getSessionToken,
  authenticateAccount,
  registerAccount,
  changePassword,
  getUserCart,
  getUserFavourites,
  saveUserCart,
  saveUserFavourites,
} from '../services/authStorage';
import { RootStore } from './index';

export interface SessionSlice {
  user: User | null;
  token: string | null;
  isRestoringSession: boolean;
  signIn: (userOrEmail: User | string, tokenOrPassword?: string) => Promise<void>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    role: 'buyer' | 'seller';
    studentId?: string;
    phone?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  switchRole: (newRole: 'buyer' | 'seller') => void;
  updatePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

export const createSessionSlice: StateCreator<
  RootStore,
  [],
  [],
  SessionSlice
> = (set, get) => ({
  user: null,
  token: null,
  isRestoringSession: true,

  // Đăng nhập: Hỗ trợ cả xác thực email/password thật lẫn nạp trực tiếp User object
  signIn: async (userOrEmail: User | string, tokenOrPassword?: string) => {
    let authUser: User;
    let authToken: string;

    if (typeof userOrEmail === 'string') {
      const res = await authenticateAccount(userOrEmail, tokenOrPassword || '');
      authUser = res.user;
      authToken = res.token;
    } else {
      authUser = userOrEmail;
      authToken = tokenOrPassword || `jwt_campus_${authUser.id}_${Date.now()}`;
      await saveSessionToken(authToken, authUser);
    }

    // MULTI-USER ISOLATION: Nạp giỏ hàng & yêu thích riêng biệt của user này
    const [userCart, userFavs] = await Promise.all([
      getUserCart(authUser.id),
      getUserFavourites(authUser.id),
    ]);

    set({
      user: authUser,
      token: authToken,
      cartItems: userCart,
      favouriteIds: userFavs,
      isRestoringSession: false,
    });
  },

  // Đăng ký tài khoản mới: Lưu vào Database tài khoản và tự động đăng nhập
  signUp: async (params) => {
    const { user, token } = await registerAccount(params);
    const [userCart, userFavs] = await Promise.all([
      getUserCart(user.id),
      getUserFavourites(user.id),
    ]);

    set({
      user,
      token,
      cartItems: userCart,
      favouriteIds: userFavs,
      isRestoringSession: false,
    });
  },

  // Đăng xuất: Lưu lại trạng thái giỏ hàng trước khi xóa session
  signOut: async () => {
    const { user, cartItems, favouriteIds } = get();
    if (user) {
      await Promise.all([
        saveUserCart(user.id, cartItems),
        saveUserFavourites(user.id, favouriteIds),
      ]);
    }

    await clearSessionToken();
    set({
      user: null,
      token: null,
      cartItems: [],
      favouriteIds: [],
      isRestoringSession: false,
    });
  },

  // Khôi phục phiên làm việc (khi mở lại app)
  restoreSession: async () => {
    try {
      const saved = await getSessionToken();
      if (saved) {
        const [userCart, userFavs] = await Promise.all([
          getUserCart(saved.user.id),
          getUserFavourites(saved.user.id),
        ]);
        set({
          user: saved.user,
          token: saved.token,
          cartItems: userCart,
          favouriteIds: userFavs,
          isRestoringSession: false,
        });
      } else {
        set({ user: null, token: null, cartItems: [], favouriteIds: [], isRestoringSession: false });
      }
    } catch {
      set({ user: null, token: null, cartItems: [], favouriteIds: [], isRestoringSession: false });
    }
  },

  // Chuyển đổi vai trò
  switchRole: (newRole: 'buyer' | 'seller') => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, role: newRole };
      set({ user: updatedUser });
      saveSessionToken(get().token || '', updatedUser);
    }
  },

  // Đổi mật khẩu tài khoản
  updatePassword: async (oldPass: string, newPass: string) => {
    const { user } = get();
    if (!user) {
      throw new Error('Vui lòng đăng nhập để đổi mật khẩu.');
    }
    return await changePassword(user.id, oldPass, newPass);
  },
});
