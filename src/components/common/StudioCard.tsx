"use client";

import Link from "next/link";
import { Studio } from "@/types";
import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { wishlistService } from "@/lib/api";
import { toast } from "sonner";
import { cn, getStudioImage, handleImageError } from "@/lib/utils";

interface Props {
  studio: Studio;
  onWishlistToggle?: (id: string, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
}

function getSpecBadge(studio: Studio): string {
  const cat = studio.category?.toLowerCase() || "";
  const amen = studio.amenities?.[0] || "";
  if (cat.includes("daylight") || amen.toLowerCase().includes("natural light")) return "South-Facing Daylight";
  if (cat.includes("cyclorama") || amen.toLowerCase().includes("cyc")) return "2-Wall Center Cyc";
  if (cat.includes("soundstage")) return "STC 55 Acoustic Isolation";
  if (cat.includes("black")) return "100% Blackout Control";
  if (cat.includes("industrial")) return "Wet Studio Compatible";
  if (cat.includes("rooftop")) return "Rooftop Glass Atrium";
  if (amen) return amen.slice(0, 28);
  return "Verified Studio";
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    "daylight-loft": "PHOTO STUDIO",
    "cyclorama": "FILM STAGE",
    "soundstage": "FILM STAGE",
    "black-box": "FILM STAGE",
    "industrial-warehouse": "ART WORKSHOP",
    "rooftop": "PHOTO STUDIO",
    "podcast": "PODCAST",
    "music": "MUSIC SUITE",
  };
  const c = category?.toLowerCase() || "other";
  if (c.includes("podcast")) return "PODCAST";
  if (c.includes("music")) return "MUSIC SUITE";
  if (c.includes("film")) return "FILM STAGE";
  if (c.includes("art") || c.includes("industrial")) return "ART WORKSHOP";
  return map[c] || c.toUpperCase().replace(/-/g, " ").slice(0, 20);
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

  const locationShort = studio.location?.split(",")?.[0] || studio.location;
  const square = studio.squareFootage ? `${studio.squareFootage.toLocaleString()} sq ft` : "";
  const rating = studio.rating ? studio.rating.toFixed(2) : "4.92";
  // Stabilized review count based on _id hash to avoid impure Math.random in render
  const reviews = studio.reviewCount || (parseInt(studio._id.slice(-3), 16) % 120) + 12 || 47;
  const imageSrc = getStudioImage(studio.images?.[0]);

  return (
    <Link href={`/studios/${studio._id}`} className="group block w-full min-w-0">
      <div className="flex h-full min-h-[340px] flex-col overflow-hidden rounded-[14px] border border-[#E8DDD6] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(32,33,36,0.08)]">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-neutral-100">
          <img
            src={imageSrc}
            alt={studio.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={handleImageError}
            loading="lazy"
          />
          {/* Top left spec badge */}
          <div className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 max-w-[60%]">
            <span className="inline-block max-w-full truncate rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DDD6] px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-medium tracking-wide text-[#202124] shadow-sm">
              {getSpecBadge(studio)}
            </span>
          </div>
          {/* Top right heart */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-2 top-2 flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DDD6] shadow-sm transition-colors hover:bg-white min-h-[32px] min-w-[32px]"
          >
            <Heart size={14} className={cn(wishlisted ? "fill-[#E76F51] text-[#E76F51]" : "text-[#202124]")} />
          </button>
          {/* Bottom left category */}
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5">
            <span className="rounded-[4px] bg-[#202124] px-2 py-1 text-[8px] sm:text-[9px] font-semibold tracking-[0.08em] text-white uppercase">
              {getCategoryLabel(studio.category)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 sm:p-3.5 min-w-0">
          {/* location + rating line */}
          <div className="flex items-start justify-between gap-2 text-[11px] text-neutral-500">
            <span className="flex min-w-0 flex-1 items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{locationShort}{square ? ` • ${square}` : ""}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 text-[11px] font-medium text-[#202124]">
              <Star className="h-3 w-3 fill-[#202124] text-[#202124] shrink-0" /> {rating} <span className="text-neutral-400 hidden xs:inline">({reviews})</span>
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-1 font-[Manrope] text-[14px] font-semibold leading-tight text-[#202124] break-words">
            {studio.title}
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {studio.amenities?.slice(0, 3).map((am) => (
              <span
                key={am}
                className="rounded-full border border-[#F1E9E2] bg-[#FAF9F6] px-2.5 py-1 text-[10px] font-medium text-[#202124] truncate max-w-[90px] sm:max-w-[110px]"
              >
                {am}
              </span>
            ))}
            {studio.amenities?.length > 3 && (
              <span className="rounded-full bg-[#F1F0EC] px-2 py-1 text-[10px] text-neutral-600 shrink-0">
                +{studio.amenities.length - 3}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:gap-3 sm:pt-3.5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="font-[Manrope] text-[14px] font-bold text-[#202124]">${studio.hourlyRate}</span>
                <span className="text-[11px] text-neutral-500">/ hr</span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-neutral-500 break-words">
                {studio.securityDeposit ? `$${studio.securityDeposit} security deposit` : studio.maxCapacity ? `${studio.maxCapacity} guests max` : "Engineer included"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 min-h-[32px] shrink-0 rounded-md border-[#E8DDD6] bg-[#FAF6F3] px-3 text-[11px] font-medium text-[#202124] hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
              }}
              aria-label={`View details for ${studio.title}`}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
