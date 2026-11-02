"use client";

import Link from "next/link";
import { Studio } from "@/types";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { wishlistService } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  studio: Studio;
  onWishlistToggle?: (id: string, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
}

export default function StudioCard({ studio, onWishlistToggle, isWishlisted = false }: Props) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      if (wishlisted) {
        // Need wishlist id – for card we use studio id fallback, backend supports both
        await wishlistService.remove(studio._id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
        onWishlistToggle?.(studio._id, false);
      } else {
        await wishlistService.add(studio._id);
        setWishlisted(true);
        toast.success("Added to wishlist");
        onWishlistToggle?.(studio._id, true);
      }
    } catch (err: any) {
      if (err.status === 401) {
        toast.error("Please login to use wishlist");
      } else if (err.status === 409) {
        setWishlisted(true);
        toast.info("Already in wishlist");
      } else {
        toast.error(err.data?.message || "Failed to update wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/studios/${studio._id}`} className="group">
      <div className="overflow-hidden rounded-[16px] border border-[#E7E5E0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(32,33,36,0.06),0_1px_2px_rgba(32,33,36,0.04)]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <img
            src={studio.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"}
            alt={studio.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart size={16} className={wishlisted ? "fill-[#E76F51] text-[#E76F51]" : "text-neutral-700"} />
          </button>
          {/* Badge */}
          <div className="absolute left-3 top-3">
            <Badge variant="outline" className="bg-[#FAF9F6]/90 backdrop-blur-sm text-[11px] uppercase tracking-wide">
              ☼ {studio.category}
            </Badge>
          </div>
          {/* Verified */}
          {studio.rating && studio.rating >= 4.5 && (
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              Verified Camlock // STC {studio.stcRating || "55+"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-[Manrope] text-[1.05rem] font-semibold leading-tight text-[#202124]">
              {studio.title}
            </h3>
            {studio.rating ? (
              <span className="flex items-center gap-1 text-sm font-medium">
                <Star size={14} className="fill-[#202124] text-[#202124]" /> {studio.rating.toFixed(2)} {studio.reviewCount ? `(${studio.reviewCount})` : ""}
              </span>
            ) : null}
          </div>

          <p className="mt-1 line-clamp-1 text-[0.8125rem] text-[#737373]">
            {studio.location} {studio.squareFootage ? `• ${studio.squareFootage.toLocaleString()} sq ft` : ""}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {studio.amenities?.slice(0, 3).map((am) => (
              <span
                key={am}
                className="rounded-full border border-[#E7E5E0] bg-[#FAF9F6] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[#202124]"
              >
                {am}
              </span>
            ))}
            {studio.amenities?.length > 3 && (
              <span className="rounded-full bg-[#F1F0EC] px-2.5 py-1 text-[11px]">+{studio.amenities.length - 3}</span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-[Manrope] text-[1.1rem] font-bold tabular-nums">${studio.hourlyRate}</span>
            <span className="text-sm text-[#737373]">/ hour</span>
            {studio.securityDeposit ? (
              <span className="ml-auto text-xs text-[#A3A29E]">${studio.securityDeposit} deposit</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

