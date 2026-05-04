import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_USER: '@session_app:auth_user',
  BOOKINGS: '@session_app:bookings',
  INTERESTS: '@session_app:interests',
} as const;

export const StorageService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // silently fail
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // silently fail
    }
  },
};

export { KEYS };
