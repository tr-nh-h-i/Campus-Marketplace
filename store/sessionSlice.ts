import { StateCreator } from 'zustand';
import { User } from '../types/marketplace';
import { saveSessionToken, clearSessionToken, getSessionToken } from '../services/authStorage';

export interface SessionSlice {
  user: User | null;
  token: string | null;
  isRestoringSession: boolean;
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  switchRole: (newRole: 'buyer' | 'seller') => void;
}

export const createSessionSlice: StateCreator<
  SessionSlice,
  [],
  [],
  SessionSlice
> = (set, get) => ({
  user: null,
  token: null,
  isRestoringSession: true,

  signIn: async (user: User, token: string) => {
    // Lưu vào SecureStore (Mã hóa phần cứng AES-256)
    await saveSessionToken(token, user);
    set({ user, token, isRestoringSession: false });
  },

  signOut: async () => {
    // Xóa sạch token trong SecureStore
    await clearSessionToken();
    set({ user: null, token: null, isRestoringSession: false });
  },

  restoreSession: async () => {
    try {
      const saved = await getSessionToken();
      if (saved) {
        set({ user: saved.user, token: saved.token, isRestoringSession: false });
      } else {
        set({ user: null, token: null, isRestoringSession: false });
      }
    } catch {
      set({ user: null, token: null, isRestoringSession: false });
    }
  },

  switchRole: (newRole: 'buyer' | 'seller') => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, role: newRole } });
    }
  },
});
