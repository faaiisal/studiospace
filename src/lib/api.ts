/* eslint-disable @typescript-eslint/no-explicit-any */
// LEGACY REAL API LAYER – preserved for future backend integration documentation
// For Phase 1 Frontend-only, use src/services/* mock services instead
// This file now re-exports mock services with same interface as before for compatibility
// Future integration: replace body with fetch to NEXT_PUBLIC_API_URL

import { studioService as mockStudioService } from "@/services/studio.service";
import { bookingService as mockBookingService } from "@/services/booking.service";
import { wishlistService as mockWishlistService } from "@/services/wishlist.service";
import { authService as mockAuthService } from "@/services/auth.service";
import { storage, STORAGE_KEYS } from "./storage";

// Mock API base for compatibility (no real calls)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authService = {
  register: (body: { name: string; email: string; password: string; photoURL?: string }) =>
    mockAuthService.register(body).then((res) => ({ success: true, data: { user: res.user } } as any)),
  login: (body: { email: string; password: string }) =>
    mockAuthService.login(body).then((res) => ({ success: true, data: { user: res.user } } as any)),
  logout: () => mockAuthService.logout().then(() => ({ success: true } as any)),
  me: () => {
    const user = mockAuthService.getCurrentUser();
    if (!user) throw { status: 401, data: { message: "Unauthorized" } };
    return Promise.resolve({ success: true, data: user } as any);
  },
};

export const userService = {
  me: () => {
    const user = mockAuthService.getCurrentUser();
    if (!user) throw { status: 401, data: { message: "Unauthorized" } };
    return Promise.resolve({ success: true, data: user } as any);
  },
  updateMe: (body: any) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) throw { status: 401, data: { message: "Unauthorized" } };
    const updated = { ...user, ...body, updatedAt: new Date().toISOString() };
    storage.set(STORAGE_KEYS.AUTH_USER, updated);
    return Promise.resolve({ success: true, data: updated } as any);
  },
};

export const studioService = {
  getAll: (params?: any) =>
    mockStudioService.getStudios(params).then((res) => ({ success: true, data: res } as any)),
  getFeatured: (limit = 6) =>
    mockStudioService.getFeatured(limit).then((data) => ({ success: true, data } as any)),
  getById: (id: string) =>
    mockStudioService.getStudioById(id).then((data) => ({ success: true, data } as any)),
  getMyListings: () => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockStudioService.getMyListings(user._id).then((data) => ({ success: true, data } as any));
  },
  create: (body: any) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockStudioService
      .createStudio({ ...body, owner: user._id, ownerName: user.name, ownerEmail: user.email })
      .then((data) => ({ success: true, data } as any));
  },
  update: (id: string, body: any) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockStudioService.updateStudio(id, body, user._id).then((data) => ({ success: true, data } as any));
  },
  delete: (id: string) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockStudioService.deleteStudio(id, user._id).then(() => ({ success: true } as any));
  },
};

export const bookingService = {
  create: (body: any) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockBookingService
      .createBooking({ ...body, userId: user._id })
      .then((data) => ({ success: true, data } as any));
  },
  getMy: (params?: any) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockBookingService.getMyBookings(user._id, params).then((data) => ({ success: true, data } as any));
  },
  getHost: (params?: any) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockBookingService.getHostBookings(user._id, params).then((data) => ({ success: true, data } as any));
  },
  getById: (id: string) => mockBookingService.getBookingById(id).then((data) => ({ success: true, data } as any)),
  updateStatus: (id: string, status: string) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockBookingService
      .updateBookingStatus(id, status as any, user._id)
      .then((data) => ({ success: true, data } as any));
  },
  cancel: (id: string) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockBookingService.cancelBooking(id, user._id).then((data) => ({ success: true, data } as any));
  },
};

export const wishlistService = {
  add: (studio: string) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockWishlistService.addToWishlist(user._id, studio).then(() => ({ success: true } as any));
  },
  getAll: () => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockWishlistService.getWishlist(user._id).then((data) => ({ success: true, data: { wishlist: data } } as any));
  },
  remove: (id: string) => {
    const user = mockAuthService.getCurrentUser();
    if (!user) return Promise.reject({ status: 401, data: { message: "Unauthorized" } });
    return mockWishlistService.removeFromWishlist(user._id, id).then(() => ({ success: true } as any));
  },
};

export { API_BASE };
export default { authService, userService, studioService, bookingService, wishlistService };

