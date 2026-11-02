/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Wishlist Service – frontend only

import { storage, STORAGE_KEYS } from "@/lib/storage";
import { mockStudios } from "@/data/studios";
import { WishlistItem } from "@/types";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

type WishlistEntry = { _id: string; userId: string; studioId: string; createdAt: string };

const getStoredWishlist = (userId: string): WishlistEntry[] => {
  const all = storage.get<WishlistEntry[]>(STORAGE_KEYS.WISHLIST, []);
  return all.filter((w) => w.userId === userId);
};

const saveWishlistForUser = (userId: string, entries: WishlistEntry[]) => {
  const all = storage.get<WishlistEntry[]>(STORAGE_KEYS.WISHLIST, []);
  const otherUsers = all.filter((w) => w.userId !== userId);
  storage.set(STORAGE_KEYS.WISHLIST, [...otherUsers, ...entries]);
};

export const wishlistService = {
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    await delay();
    const entries = getStoredWishlist(userId);
    return entries
      .map((e) => {
        const studio = mockStudios.find((s) => s._id === e.studioId);
        if (!studio) return null;
        return {
          _id: e._id,
          user: userId,
          studio,
          createdAt: e.createdAt,
        } as WishlistItem;
      })
      .filter(Boolean) as WishlistItem[];
  },

  async addToWishlist(userId: string, studioId: string): Promise<void> {
    await delay();
    const studio = mockStudios.find((s) => s._id === studioId);
    if (!studio) throw new Error("Studio not found");

    const entries = getStoredWishlist(userId);
    if (entries.some((e) => e.studioId === studioId)) {
      throw new Error("Already in wishlist");
    }

    const newEntry: WishlistEntry = {
      _id: `wish_${Date.now()}`,
      userId,
      studioId,
      createdAt: new Date().toISOString(),
    };

    saveWishlistForUser(userId, [...entries, newEntry]);
  },

  async removeFromWishlist(userId: string, studioId: string): Promise<void> {
    await delay();
    const entries = getStoredWishlist(userId);
    const filtered = entries.filter((e) => e.studioId !== studioId && e._id !== studioId);
    if (filtered.length === entries.length) throw new Error("Wishlist item not found");
    saveWishlistForUser(userId, filtered);
  },

  async isWishlisted(userId: string, studioId: string): Promise<boolean> {
    const entries = getStoredWishlist(userId);
    return entries.some((e) => e.studioId === studioId);
  },
};

