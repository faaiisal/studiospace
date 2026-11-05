"use client";


import { useEffect, useState } from "react";
import StudioCard from "@/components/common/StudioCard";
import { wishlistService } from "@/lib/api";
import { WishlistItem } from "@/types";
import { StudioGridSkeleton } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { toast } from "sonner";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await wishlistService.getAll();
        setItems(res.data.wishlist as any || []);
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleToggle = (studioId: string, isWishlisted: boolean) => {
    if (!isWishlisted) {
      setItems(items.filter((i) => i.studio._id !== studioId));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 overflow-x-hidden">
      <h1 className="font-[Manrope] text-[22px] sm:text-3xl font-semibold break-words leading-tight">Saved Studios & Wishlists</h1>
      <p className="mt-1 text-[12px] sm:text-sm text-neutral-600 break-words leading-5">Curated architectural stages for upcoming production treatments • {items.length} Saved Spaces</p>

      <div className="mt-6 sm:mt-8">
        {loading ? (
          <StudioGridSkeleton count={6} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Browse our architectural catalog and save spaces for your next project."
            actionLabel="Browse Studios"
            actionHref="/studios"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <StudioCard key={item._id} studio={item.studio} isWishlisted={true} onWishlistToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

