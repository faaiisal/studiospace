// Isolated browser storage adapter for demo data only
// Rules: Never store real auth credentials, never store real tokens, clearly documented as demo
// This adapter is replaceable – future backend integration will replace with API calls

const isBrowser = typeof window !== "undefined";

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser) return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set failed for ${key}`, e);
    }
  },
  remove(key: string): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
  clear(keys: string[]): void {
    keys.forEach((k) => this.remove(k));
  },
};

export const STORAGE_KEYS = {
  AUTH_USER: "studiospace_demo_user",
  STUDIOS: "studiospace_demo_studios",
  BOOKINGS: "studiospace_demo_bookings",
  WISHLIST: "studiospace_demo_wishlist",
  REGISTERED_USERS: "studiospace_demo_registered_users",
};

