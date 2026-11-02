/* eslint-disable @typescript-eslint/no-explicit-any */
// Demo Auth Service – frontend only, NOT production auth
// Security notes: No password stored, no token stored, only mock user object in localStorage
// Replaceable with real API: POST /api/auth/login etc.

import { mockUsers, defaultUserId } from "@/data/users";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { User } from "@/types";

type LoginData = { email: string; password: string };
type RegisterData = { name: string; email: string; password: string; photoURL?: string };

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  async login(data: LoginData): Promise<{ user: User }> {
    await delay();
    // Simple demo: find by email (case insensitive)
    const found = mockUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (!found) {
      throw new Error("Invalid credentials – try alex@productionlab.com / Demo123");
    }
    // Password validation mock: must contain upper+lower min6 per spec
    const hasUpper = /[A-Z]/.test(data.password);
    const hasLower = /[a-z]/.test(data.password);
    if (data.password.length < 6 || !hasUpper || !hasLower) {
      throw new Error("Password must contain uppercase, lowercase, min 6 chars");
    }

    const user: User = {
      _id: found._id,
      name: found.name,
      email: found.email,
      photoURL: found.photoURL,
      authProvider: "local",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEYS.AUTH_USER, user);
    return { user };
  },

  async register(data: RegisterData): Promise<{ user: User }> {
    await delay(600);
    // Check duplicate email in mockUsers + storage studios owner? simple check mockUsers
    const exists = mockUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      throw new Error("Email already registered – try different email or login");
    }

    const hasUpper = /[A-Z]/.test(data.password);
    const hasLower = /[a-z]/.test(data.password);
    if (data.password.length < 6 || !hasUpper || !hasLower) {
      throw new Error("Password must contain uppercase, lowercase, min 6 chars");
    }

    const user: User = {
      _id: `user_${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      photoURL: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=E76F51&color=fff`,
      authProvider: "local",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEYS.AUTH_USER, user);
    return { user };
  },

  async logout(): Promise<void> {
    await delay(200);
    storage.remove(STORAGE_KEYS.AUTH_USER);
  },

  getCurrentUser(): User | null {
    return storage.get<User | null>(STORAGE_KEYS.AUTH_USER, null);
  },

  // For components that need sync check
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};

