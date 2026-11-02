/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Studio Service – frontend only
// Interface mirrors future API: GET /api/studios, POST /api/studios etc.
// Components must not depend directly on mock arrays – use these service functions.

import { mockStudios } from "@/data/studios";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { Studio } from "@/types";

type StudioFilters = {
  q?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string; // comma-separated
  sort?: "newest" | "price-asc" | "price-desc" | "rating-desc" | "capacity-desc" | "size-desc";
  page?: number;
  limit?: number;
};

type GetStudiosResult = {
  studios: Studio[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const getStoredStudios = (): Studio[] => {
  const stored = storage.get<Studio[]>(STORAGE_KEYS.STUDIOS, []);
  if (stored.length === 0) {
    return mockStudios;
  }
  return stored;
};

const saveStudios = (studios: Studio[]) => {
  storage.set(STORAGE_KEYS.STUDIOS, studios);
};

export const studioService = {
  async getStudios(filters: StudioFilters = {}): Promise<GetStudiosResult> {
    await delay();
    let filtered = [...getStoredStudios()];

    // Search q: title, description, location, amenities
    if (filters.q) {
      const q = filters.q.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (filters.category) {
      filtered = filtered.filter((s) => s.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((s) => s.location.toLowerCase().includes(loc));
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((s) => s.hourlyRate >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((s) => s.hourlyRate <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter((s) => (s.rating || 0) >= filters.minRating!);
    }

    if (filters.amenities) {
      const ams = filters.amenities.split(",").map((a) => a.trim().toLowerCase()).filter(Boolean);
      filtered = filtered.filter((s) => ams.every((need) => s.amenities.some((a) => a.toLowerCase().includes(need))));
    }

    // Sorting
    switch (filters.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "rating-desc":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "capacity-desc":
        filtered.sort((a, b) => b.maxCapacity - a.maxCapacity);
        break;
      case "size-desc":
        filtered.sort((a, b) => (b.squareFootage || 0) - (a.squareFootage || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { studios: paginated, pagination: { page, limit, total, totalPages } };
  },

  async getStudioById(id: string): Promise<Studio> {
    await delay(200);
    const found = getStoredStudios().find((s) => s._id === id);
    if (!found) throw new Error("Studio not found");
    return found;
  },

  async getFeatured(limit = 6): Promise<Studio[]> {
    await delay(200);
    const all = getStoredStudios();
    return [...all].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
  },

  async getMyListings(ownerId: string): Promise<Studio[]> {
    await delay(200);
    return getStoredStudios().filter((s) => {
      const owner = typeof s.owner === "string" ? s.owner : (s.owner as any)._id || s.owner;
      return owner === ownerId;
    });
  },

  async createStudio(data: Omit<Studio, "_id" | "createdAt" | "updatedAt" | "ownerName" | "ownerEmail" | "isActive" | "rating" | "reviewCount"> & { owner: string; ownerName: string; ownerEmail: string }): Promise<Studio> {
    await delay(500);
    const newStudio: Studio = {
      _id: `studio_${Date.now()}`,
      title: data.title,
      category: data.category,
      description: data.description,
      hourlyRate: data.hourlyRate,
      securityDeposit: data.securityDeposit,
      maxCapacity: data.maxCapacity,
      location: data.location,
      images: data.images,
      amenities: data.amenities,
      owner: data.owner,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      rating: 0,
      reviewCount: 0,
      squareFootage: (data as any).squareFootage,
      ceilingHeight: (data as any).ceilingHeight,
      powerAmperage: (data as any).powerAmperage,
      stcRating: (data as any).stcRating,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = getStoredStudios();
    all.unshift(newStudio);
    saveStudios(all);
    return newStudio;
  },

  async updateStudio(id: string, data: Partial<Studio>, ownerId: string): Promise<Studio> {
    await delay(400);
    const all = getStoredStudios();
    const idx = all.findIndex((s) => s._id === id);
    if (idx === -1) throw new Error("Studio not found");
    const existing = all[idx];
    const ownerStr = typeof existing.owner === "string" ? existing.owner : (existing.owner as any)._id;
    if (ownerStr !== ownerId) throw new Error("Forbidden: Not owner");

    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    // Prevent mass assignment of owner/rating
    delete (updated as any).owner;
    (updated as any).owner = existing.owner;
    updated.ownerName = existing.ownerName;
    updated.ownerEmail = existing.ownerEmail;

    all[idx] = updated;
    saveStudios(all);
    return updated;
  },

  async deleteStudio(id: string, ownerId: string): Promise<void> {
    await delay(300);
    const all = getStoredStudios();
    const idx = all.findIndex((s) => s._id === id);
    if (idx === -1) throw new Error("Studio not found");
    const existing = all[idx];
    const ownerStr = typeof existing.owner === "string" ? existing.owner : (existing.owner as any)._id;
    if (ownerStr !== ownerId) throw new Error("Forbidden: Not owner");

    all.splice(idx, 1);
    saveStudios(all);
  },

  // For testing/clearing demo data
  resetToMock(): void {
    saveStudios(mockStudios);
  },
};

