/* eslint-disable @typescript-eslint/no-explicit-any */
// Demo Auth Service – frontend only, NOT production auth
// For demo we persist registered users in localStorage so login works after registration + logout
// Replaceable with real API: POST /api/auth/login etc.

import { mockUsers } from "@/data/users";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { User } from "@/types";

type LoginData = { email: string; password: string };
type RegisterData = { name: string; email: string; password: string; photoURL?: string };

// Stored version includes password for demo persistence (NOT for production)
type StoredUser = User & { password: string };

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

function getRegisteredUsers(): StoredUser[] {
  return storage.get<StoredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
}

function saveRegisteredUsers(users: StoredUser[]): void {
  storage.set(STORAGE_KEYS.REGISTERED_USERS, users);
}

function validatePasswordFormat(password: string): void {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  if (password.length < 6 || !hasUpper || !hasLower) {
    throw new Error("Password must contain uppercase, lowercase, min 6 chars");
  }
}

export const authService = {
  async login(data: LoginData): Promise<{ user: User }> {
    await delay();
    const emailLower = data.email.toLowerCase().trim();

    // 1) Check mockUsers (demo accounts)
    const mockFound = mockUsers.find((u) => u.email.toLowerCase() === emailLower);
    if (mockFound) {
      validatePasswordFormat(data.password);
      const user: User = {
        _id: mockFound._id,
        name: mockFound.name,
        email: mockFound.email,
        photoURL: mockFound.photoURL,
        authProvider: "local",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      storage.set(STORAGE_KEYS.AUTH_USER, user);
      return { user };
    }

    // 2) Check locally registered users
    const registered = getRegisteredUsers();
    const stored = registered.find((u) => u.email.toLowerCase() === emailLower);

    if (!stored) {
      throw new Error("Invalid credentials");
    }

    // For registered users, verify exact password
    if (stored.password !== data.password) {
      throw new Error("Invalid credentials");
    }

    validatePasswordFormat(data.password);

    const user: User = {
      _id: stored._id,
      name: stored.name,
      email: stored.email,
      photoURL: stored.photoURL,
      authProvider: stored.authProvider,
      createdAt: stored.createdAt,
      updatedAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEYS.AUTH_USER, user);
    return { user };
  },

  async register(data: RegisterData): Promise<{ user: User }> {
    await delay(600);
    const emailLower = data.email.toLowerCase().trim();

    // Check duplicate in mockUsers + registered users
    const existsInMock = mockUsers.some((u) => u.email.toLowerCase() === emailLower);
    const registered = getRegisteredUsers();
    const existsInRegistered = registered.some((u) => u.email.toLowerCase() === emailLower);

    if (existsInMock || existsInRegistered) {
      throw new Error("Email already registered – try different email or login");
    }

    validatePasswordFormat(data.password);

    const newId = `user_${Date.now()}`;

    const storedUser: StoredUser = {
      _id: newId,
      name: data.name,
      email: emailLower,
      photoURL: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=E76F51&color=fff`,
      authProvider: "local",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      password: data.password, // demo only: persisted to allow login after logout
    };

    const user: User = {
      _id: storedUser._id,
      name: storedUser.name,
      email: storedUser.email,
      photoURL: storedUser.photoURL,
      authProvider: storedUser.authProvider,
      createdAt: storedUser.createdAt,
      updatedAt: storedUser.updatedAt,
    };

    // Persist registered list
    saveRegisteredUsers([...registered, storedUser]);
    // Set current session
    storage.set(STORAGE_KEYS.AUTH_USER, user);
    return { user };
  },

  async logout(): Promise<void> {
    await delay(200);
    storage.remove(STORAGE_KEYS.AUTH_USER);
    // NOTE: do NOT clear REGISTERED_USERS, so user can login again
  },

  getCurrentUser(): User | null {
    return storage.get<User | null>(STORAGE_KEYS.AUTH_USER, null);
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  //debug helper
  getRegisteredForDebug(): StoredUser[] {
    return getRegisteredUsers();
  },
};

