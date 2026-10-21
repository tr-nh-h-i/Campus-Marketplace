import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/marketplace';

const SECURE_TOKEN_KEY = 'campus_marketplace_jwt_token';
const SECURE_USER_KEY = 'campus_marketplace_user_session';

/**
 * QUY TẮC BẢO MẬT: Token & Session CHỈ lưu trong SecureStore (Mã hóa phần cứng).
 * Tuyệt đối không lưu token vào AsyncStorage.
 */
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
