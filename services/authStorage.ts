import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, StoredAccount, CartItem } from '../types/marketplace';

const SECURE_TOKEN_KEY = 'campus_marketplace_jwt_token';
const SECURE_USER_KEY = 'campus_marketplace_user_session';
const ACCOUNTS_STORAGE_KEY = 'campus_marketplace_all_accounts_v2';
const USER_CARTS_KEY_PREFIX = 'campus_marketplace_cart_user_';
const USER_FAVS_KEY_PREFIX = 'campus_marketplace_favs_user_';

// ==========================================
// SEED ACCOUNTS (Tài khoản mẫu trường DNTU)
// ==========================================
export const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr_buyer_1923050080',
    name: 'Trịnh Thế Thanh Hải',
    email: 'hai.trinh@dntu.edu.vn',
    password: 'password123',
    role: 'buyer',
    studentId: '1923050080',
    phone: '0901234567',
    createdAt: '2026-10-21T08:00:00.000Z',
  },
  {
    id: 'usr_seller_01',
    name: 'Nguyễn Văn Minh (Chủ Shop Sách)',
    email: 'minh.seller@dntu.edu.vn',
    password: 'password123',
    role: 'seller',
    studentId: '1923050001',
    phone: '0909876543',
    createdAt: '2026-10-21T09:30:00.000Z',
  },
  {
    id: 'usr_buyer_1923050973',
    name: 'Bùi Thanh Sơn',
    email: 'son.bui@dntu.edu.vn',
    password: 'password123',
    role: 'buyer',
    studentId: '1923050973',
    phone: '0912345678',
    createdAt: '2026-10-22T10:15:00.000Z',
  },
  {
    id: 'usr_seller_1923050861',
    name: 'Nguyễn Vũ Minh Nhật',
    email: 'nhat.nguyen@dntu.edu.vn',
    password: 'password123',
    role: 'seller',
    studentId: '1923050861',
    phone: '0987654321',
    createdAt: '2026-10-23T14:20:00.000Z',
  },
];

// ==========================================
// LƯU TRỮ VÀ QUẢN LÝ TÀI KHOẢN (ACCOUNTS DB)
// ==========================================

export async function getAllAccounts(): Promise<StoredAccount[]> {
  try {
    let raw: string | null = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      }
    } else {
      raw = await AsyncStorage.getItem(ACCOUNTS_STORAGE_KEY);
    }

    if (!raw) {
      // Khởi tạo các tài khoản mẫu ban đầu
      await saveAllAccounts(SEED_ACCOUNTS);
      return SEED_ACCOUNTS;
    }

    const parsed: StoredAccount[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      await saveAllAccounts(SEED_ACCOUNTS);
      return SEED_ACCOUNTS;
    }
    return parsed;
  } catch (error) {
    console.warn('[AccountsDB] Lỗi nạp tài khoản:', error);
    return SEED_ACCOUNTS;
  }
}

export async function saveAllAccounts(accounts: StoredAccount[]): Promise<void> {
  const json = JSON.stringify(accounts);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, json);
    }
    return;
  }
  await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, json);
}

// 1. ĐĂNG KÝ TÀI KHOẢN MỚI
export async function registerAccount(params: {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  studentId?: string;
  phone?: string;
}): Promise<{ user: User; token: string }> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const trimmedName = params.name.trim();

  if (!trimmedName) {
    throw new Error('Vui lòng nhập họ và tên sinh viên.');
  }
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Email không hợp lệ. Vui lòng sử dụng email hợp lệ.');
  }
  if (!params.password || params.password.length < 6) {
    throw new Error('Mật khẩu phải có tối thiểu 6 ký tự để đảm bảo an toàn.');
  }

  const accounts = await getAllAccounts();
  const existing = accounts.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail
  );

  if (existing) {
    throw new Error(
      `Email "${normalizedEmail}" đã được đăng ký trong hệ thống. Vui lòng đăng nhập hoặc sử dụng email khác.`
    );
  }

  const newId = `usr_${params.role}_${Date.now()}`;
  const newAccount: StoredAccount = {
    id: newId,
    name: trimmedName,
    email: normalizedEmail,
    password: params.password,
    role: params.role,
    studentId: params.studentId?.trim() || `23DTH${Math.floor(1000 + Math.random() * 9000)}`,
    phone: params.phone?.trim() || '0901234567',
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  await saveAllAccounts(accounts);

  const user: User = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    role: newAccount.role,
    studentId: newAccount.studentId,
    phone: newAccount.phone,
    createdAt: newAccount.createdAt,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      newAccount.name
    )}&background=0284c7&color=fff`,
  };

  const token = `jwt_campus_${newAccount.id}_${Date.now()}`;
  await saveSessionToken(token, user);
  return { user, token };
}

// 2. ĐĂNG NHẬP XÁC THỰC TÀI KHOẢN
export async function authenticateAccount(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = await getAllAccounts();

  const account = accounts.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail
  );

  if (!account) {
    throw new Error(
      `Không tìm thấy tài khoản với email "${normalizedEmail}". Vui lòng kiểm tra lại hoặc chuyển sang tab Đăng ký.`
    );
  }

  if (account.password !== password) {
    throw new Error('Mật khẩu không chính xác. Vui lòng thử lại!');
  }

  const user: User = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    studentId: account.studentId,
    phone: account.phone,
    createdAt: account.createdAt,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      account.name
    )}&background=0284c7&color=fff`,
  };

  const token = `jwt_campus_${account.id}_${Date.now()}`;
  await saveSessionToken(token, user);
  return { user, token };
}

// 3. ĐỔI MẬT KHẨU BẢO MẬT
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!oldPassword.trim()) {
    throw new Error('Vui lòng nhập mật khẩu hiện tại.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự.');
  }
  if (oldPassword === newPassword) {
    throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ.');
  }

  const accounts = await getAllAccounts();
  const index = accounts.findIndex((acc) => acc.id === userId);

  if (index === -1) {
    throw new Error('Không tìm thấy tài khoản người dùng.');
  }

  if (accounts[index].password !== oldPassword) {
    throw new Error('Mật khẩu hiện tại không chính xác!');
  }

  accounts[index].password = newPassword;
  await saveAllAccounts(accounts);
  return { success: true, message: 'Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật.' };
}

// ==========================================
// SESSION & TOKEN STORAGE (SECURESTORE)
// ==========================================

export async function saveSessionToken(token: string, user: User): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(SECURE_TOKEN_KEY, token);
      window.sessionStorage.setItem(SECURE_USER_KEY, JSON.stringify(user));
    }
    return;
  }

  await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
  await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(user), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function getSessionToken(): Promise<{ token: string; user: User } | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const token = window.sessionStorage.getItem(SECURE_TOKEN_KEY);
        const userStr = window.sessionStorage.getItem(SECURE_USER_KEY);
        if (token && userStr) {
          return { token, user: JSON.parse(userStr) };
        }
      }
      return null;
    }

    const token = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
    const userStr = await SecureStore.getItemAsync(SECURE_USER_KEY);

    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
    return null;
  } catch (error) {
    console.warn('[SecureStore] Lỗi đọc session:', error);
    return null;
  }
}

export async function clearSessionToken(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(SECURE_TOKEN_KEY);
      window.sessionStorage.removeItem(SECURE_USER_KEY);
    }
    return;
  }

  await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
  await SecureStore.deleteItemAsync(SECURE_USER_KEY);
}

// ==========================================
// MULTI-USER ISOLATION (GIỎ HÀNG & YÊU THÍCH RIÊNG THEO USER)
// ==========================================

export async function getUserCart(userId: string): Promise<CartItem[]> {
  try {
    const key = `${USER_CARTS_KEY_PREFIX}${userId}`;
    let raw: string | null = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(key);
      }
    } else {
      raw = await AsyncStorage.getItem(key);
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveUserCart(userId: string, items: CartItem[]): Promise<void> {
  try {
    const key = `${USER_CARTS_KEY_PREFIX}${userId}`;
    const json = JSON.stringify(items);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, json);
      }
      return;
    }
    await AsyncStorage.setItem(key, json);
  } catch (err) {
    console.warn('[UserCart] Lỗi lưu giỏ hàng user:', err);
  }
}

export async function getUserFavourites(userId: string): Promise<string[]> {
  try {
    const key = `${USER_FAVS_KEY_PREFIX}${userId}`;
    let raw: string | null = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(key);
      }
    } else {
      raw = await AsyncStorage.getItem(key);
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveUserFavourites(userId: string, ids: string[]): Promise<void> {
  try {
    const key = `${USER_FAVS_KEY_PREFIX}${userId}`;
    const json = JSON.stringify(ids);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, json);
      }
      return;
    }
    await AsyncStorage.setItem(key, json);
  } catch (err) {
    console.warn('[UserFavs] Lỗi lưu yêu thích user:', err);
  }
}
