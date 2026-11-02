/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Booking Service – frontend only
// Simulates availability and price calculation, but NOT real multi-user protection (backend must implement transaction-safe overlap check)

import { mockBookings } from "@/data/bookings";
import { mockStudios } from "@/data/studios";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { Booking } from "@/types";

type BookingFilters = {
  status?: "all" | "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  page?: number;
  limit?: number;
};

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const getStoredBookings = (): Booking[] => {
  const stored = storage.get<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  if (stored.length === 0) return mockBookings;
  return stored;
};

const saveBookings = (bookings: Booking[]) => {
  storage.set(STORAGE_KEYS.BOOKINGS, bookings);
};

// Booking calculation per spec
export const calculateBookingPrice = (hourlyRate: number, durationHours: number, securityDeposit: number) => {
  const rateCents = Math.round(hourlyRate * 100);
  const depositCents = Math.round(securityDeposit * 100);
  const subtotalCents = Math.round(rateCents * durationHours);
  const totalCents = subtotalCents + depositCents;
  return {
    subtotal: subtotalCents / 100,
    totalAmount: totalCents / 100,
    duration: durationHours,
  };
};

export const parseTimeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

export const bookingService = {
  async getMyBookings(userId: string, filters: BookingFilters = {}): Promise<{ bookings: Booking[]; pagination: any }> {
    await delay();
    let filtered = getStoredBookings().filter((b) => {
      const userStr = typeof b.user === "string" ? b.user : (b.user as any)._id || b.user;
      return userStr === userId;
    });

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((b) => b.status === filters.status);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      bookings: filtered.slice(start, start + limit),
      pagination: { page, limit, total, totalPages },
    };
  },

  async getHostBookings(hostId: string, filters: BookingFilters = {}): Promise<{ bookings: Booking[]; pagination: any }> {
    await delay();
    let filtered = getStoredBookings().filter((b) => {
      const hostStr = typeof b.host === "string" ? b.host : (b.host as any)._id || b.host;
      return hostStr === hostId;
    });

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((b) => b.status === filters.status);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      bookings: filtered.slice(start, start + limit),
      pagination: { page, limit, total, totalPages },
    };
  },

  async getBookingById(id: string): Promise<Booking> {
    await delay(200);
    const found = getStoredBookings().find((b) => b._id === id);
    if (!found) throw new Error("Booking not found");
    return found;
  },

  async createBooking(data: {
    studio: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    crewSize?: number;
    productionType?: string;
    notes?: string;
    userId: string;
  }): Promise<Booking> {
    await delay(600);

    // Validate date not past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bDate = new Date(data.bookingDate);
    bDate.setHours(0, 0, 0, 0);
    if (bDate < today) throw new Error("Booking date must be today or future");

    const startMin = parseTimeToMinutes(data.startTime);
    const endMin = parseTimeToMinutes(data.endTime);
    if (startMin >= endMin) throw new Error("Start time must be earlier than end time");

    const durationHours = (endMin - startMin) / 60;
    if (durationHours < 1) throw new Error("Minimum 1 hour");

    // Find studio for pricing
    const studio = mockStudios.find((s) => s._id === data.studio) || getStoredBookings().find((b) => (typeof b.studio === "string" ? b.studio : (b.studio as any)._id) === data.studio) as any;
    // For mock, use mockStudios or fallback rate 185
    const studioData = mockStudios.find((s) => s._id === data.studio);
    const hourlyRate = studioData?.hourlyRate || 185;
    const securityDeposit = studioData?.securityDeposit || 500;
    const hostId = studioData?.owner || "user_host_01";

    if ((typeof hostId === "string" ? hostId : (hostId as any)._id) === data.userId) {
      throw new Error("Cannot book your own studio");
    }

    // Simulate overlap check (client-side only, not secure) – pending/confirmed block
    const existing = getStoredBookings().filter(
      (b) =>
        (typeof b.studio === "string" ? b.studio : (b.studio as any)._id) === data.studio &&
        b.bookingDate === data.bookingDate &&
        ["pending", "confirmed"].includes(b.status)
    );

    const hasOverlap = existing.some((b) => {
      const existingStart = b.startMinutes;
      const existingEnd = b.endMinutes;
      return startMin < existingEnd && endMin > existingStart;
    });

    if (hasOverlap) {
      throw new Error("Booking conflict: Time slot already booked (mock check)");
    }

    const price = calculateBookingPrice(hourlyRate, durationHours, securityDeposit);

    const newBooking: Booking = {
      _id: `booking_${Date.now()}`,
      studio: data.studio,
      user: data.userId,
      host: typeof hostId === "string" ? hostId : (hostId as any)._id || hostId,
      bookingDate: data.bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      startMinutes: startMin,
      endMinutes: endMin,
      duration: price.duration,
      hourlyRateSnapshot: hourlyRate,
      securityDepositSnapshot: securityDeposit,
      subtotal: price.subtotal,
      totalAmount: price.totalAmount,
      status: "pending",
      crewSize: data.crewSize,
      productionType: data.productionType,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = getStoredBookings();
    all.unshift(newBooking);
    saveBookings(all);

    return newBooking;
  },

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    await delay(300);
    const all = getStoredBookings();
    const idx = all.findIndex((b) => b._id === id);
    if (idx === -1) throw new Error("Booking not found");

    const booking = all[idx];
    const userStr = typeof booking.user === "string" ? booking.user : (booking.user as any)._id;
    const hostStr = typeof booking.host === "string" ? booking.host : (booking.host as any)._id;

    if (userStr !== userId && hostStr !== userId) throw new Error("Forbidden");

    if (["cancelled", "rejected", "completed"].includes(booking.status)) {
      throw new Error(`Cannot cancel ${booking.status} booking`);
    }

    if (booking.status === "pending" || booking.status === "confirmed") {
      // For confirmed, check future date
      if (booking.status === "confirmed") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bDate = new Date(booking.bookingDate);
        bDate.setHours(0, 0, 0, 0);
        if (bDate < today) throw new Error("Cannot cancel past confirmed booking");
      }
      booking.status = "cancelled";
      booking.updatedAt = new Date().toISOString();
      all[idx] = booking;
      saveBookings(all);
      return booking;
    }

    throw new Error("Cannot cancel this booking");
  },

  async updateBookingStatus(id: string, newStatus: "confirmed" | "rejected" | "completed", hostId: string): Promise<Booking> {
    await delay(300);
    const all = getStoredBookings();
    const idx = all.findIndex((b) => b._id === id);
    if (idx === -1) throw new Error("Booking not found");

    const booking = all[idx];
    const hostStr = typeof booking.host === "string" ? booking.host : (booking.host as any)._id;
    if (hostStr !== hostId) throw new Error("Forbidden: Only host can update status");

    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "rejected", "cancelled"],
      confirmed: ["completed", "cancelled"],
      rejected: [],
      cancelled: [],
      completed: [],
    };

    const allowed = validTransitions[booking.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid transition: ${booking.status} -> ${newStatus}`);
    }

    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();
    all[idx] = booking;
    saveBookings(all);
    return booking;
  },

  resetToMock(): void {
    saveBookings(mockBookings);
  },
};

