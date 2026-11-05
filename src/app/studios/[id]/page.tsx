"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { studioService } from "@/lib/api";
import { Studio } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/common/LoadingSkeleton";
import BookingModal from "@/components/common/BookingModal";
import { Heart, Share2, Star, MapPin, Users, Zap, Ruler, Shield, Calendar } from "lucide-react";
import { toast } from "sonner";
import { wishlistService } from "@/lib/api";
import { getStudioImage, handleImageError, STUDIO_FALLBACK_IMAGE } from "@/lib/utils";

export default function StudioDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await studioService.getById(id);
        setStudio(res.data as any);
      } catch (err: any) {
        toast.error(err.data?.message || "Studio not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudio();
  }, [id]);

  const handleWishlist = async () => {
    if (!studio) return;
    try {
      if (wishlisted) {
        await wishlistService.remove(studio._id);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.add(studio._id);
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (err: any) {
      if (err.status === 401) toast.error("Please login");
      else toast.error(err.data?.message || "Failed");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (loading) return <PageSkeleton />;
  if (!studio) return <div className="p-6 sm:p-12 text-center text-sm">Studio not found</div>;

  const images = studio.images?.length ? studio.images : [STUDIO_FALLBACK_IMAGE];
  const activeSrc = getStudioImage(images[activeImage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="mb-4 sm:mb-6 text-[12px] sm:text-sm text-neutral-500 break-words">
        <span className="line-clamp-1">Home &gt; Studios &gt; {studio.category} &gt; {studio.title}</span>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="font-[Manrope] text-[22px] sm:text-2xl md:text-3xl font-semibold leading-tight break-words">{studio.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] sm:text-sm text-neutral-600">
            <span className="flex items-center gap-1 min-w-0"><MapPin size={14} className="shrink-0" /> <span className="truncate">{studio.location}</span></span>
            {studio.rating && <span className="flex items-center gap-1 shrink-0"><Star size={14} className="fill-neutral-900 shrink-0" /> {studio.rating} ({studio.reviewCount || 0})</span>}
            <span className="flex items-center gap-1 shrink-0"><Users size={14} className="shrink-0" /> Up to {studio.maxCapacity} people</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 sm:gap-2 flex-1 sm:flex-none min-h-[40px] text-[13px]"><Share2 size={16} /> Share</Button>
          <Button variant="outline" size="sm" onClick={handleWishlist} className="gap-1.5 sm:gap-2 flex-1 sm:flex-none min-h-[40px] text-[13px]"><Heart size={16} className={wishlisted ? "fill-[#E76F51] text-[#E76F51]" : ""} /> Save</Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 md:grid md:grid-cols-4">
        <div className="order-1 md:col-span-3 aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100">
          <img src={activeSrc} alt={studio.title} className="h-full w-full object-cover" onError={handleImageError} />
        </div>
        <div className="order-2 flex md:grid md:grid-cols-1 gap-2 overflow-x-auto md:overflow-visible scrollbar-hide pb-1 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {images.slice(0, 5).map((img, idx) => (
            <button key={idx} onClick={() => setActiveImage(idx)} aria-label={`View image ${idx + 1}`} className={`shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all ${activeImage === idx ? "border-[#E76F51]" : "border-transparent"} h-16 w-20 sm:h-auto sm:w-auto`}>
              <img src={getStudioImage(img)} alt={`${studio.title} view ${idx + 1}`} className="h-full w-full object-cover aspect-[4/3]" onError={handleImageError} loading="lazy" />
            </button>
          ))}
          {images.length > 5 && (
            <div className="flex shrink-0 h-16 w-20 sm:h-auto items-center justify-center rounded-xl bg-neutral-900 text-white text-[11px] sm:text-sm px-2">
              +{images.length - 5} more
            </div>
          )}
        </div>
      </div>

      {/* Spec Bar */}
      <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 rounded-xl border border-[#E7E5E0] bg-white p-3 sm:p-4">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-sm break-words"><Ruler size={16} className="shrink-0" /> {studio.squareFootage || "4,200"} sq ft</span>
        <span className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-sm break-words"><Ruler size={16} className="shrink-0" /> {studio.ceilingHeight || 18}ft Clear Height</span>
        <span className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-sm break-words"><Zap size={16} className="shrink-0" /> {studio.powerAmperage || 200}A Camlock</span>
        <span className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-sm break-words"><Shield size={16} className="shrink-0" /> STC {studio.stcRating || 55}+</span>
        <span className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-sm break-words col-span-2 sm:col-span-1"><Users size={16} className="shrink-0" /> {studio.maxCapacity} Capacity</span>
      </div>

      {/* Content 65/35 */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
          {/* Overview */}
          <div className="min-w-0">
            <h2 className="font-[Manrope] text-[18px] sm:text-xl font-semibold break-words">Architectural Overview</h2>
            <p className="mt-3 sm:mt-4 text-[13px] sm:text-sm leading-6 text-neutral-700 break-words whitespace-pre-wrap">{studio.description}</p>
          </div>

          {/* Amenities */}
          <div className="min-w-0">
            <h3 className="font-semibold text-[14px] sm:text-[15px] break-words">Amenities & Production Gear</h3>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
              {studio.amenities?.map((am) => (
                <Badge key={am} variant="outline" className="uppercase text-[10px] sm:text-xs tracking-wide break-words max-w-full"><span className="truncate">{am}</span></Badge>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="rounded-xl border border-[#E7E5E0] p-4 sm:p-6 bg-[#FAF9F6]">
            <h3 className="font-semibold text-[14px] sm:text-[15px] break-words">House Rules & Insurance</h3>
            <ul className="mt-3 space-y-2 text-[13px] sm:text-sm text-neutral-600 list-disc pl-5 break-words">
              <li>Security deposit: ${studio.securityDeposit} (refundable)</li>
              <li>Minimum COI: $1M / $2M general liability</li>
              <li>Overtime: 1.5× after booked wrap time</li>
              <li>No smoking, no open flames without permit</li>
            </ul>
          </div>

          {/* Host */}
          <div className="flex gap-3 sm:gap-4 rounded-xl border border-[#E7E5E0] p-4 sm:p-6 min-w-0">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studio.ownerName)}&background=E76F51&color=fff`} alt={studio.ownerName} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0" onError={handleImageError} />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-[14px] sm:text-[15px] break-words">{studio.ownerName}</h4>
              <p className="text-[12px] sm:text-sm text-neutral-500 break-words">Verified Studio Host • Responds in 2 hours</p>
              <p className="mt-2 text-[12px] sm:text-sm text-neutral-600 break-words leading-5">Curator of architectural production spaces with 5+ years hosting commercial and film productions.</p>
            </div>
          </div>
        </div>

        {/* Booking Card - static on mobile, sticky on desktop */}
        <div className="lg:col-span-1 min-w-0">
          <div className="rounded-2xl border border-[#E7E5E0] bg-white p-4 sm:p-6 shadow-[0_12px_32px_rgba(32,33,36,0.08)] lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-[Manrope] text-[22px] sm:text-2xl font-bold tabular-nums">${studio.hourlyRate}</span>
              <span className="text-[12px] sm:text-sm text-neutral-500">/ hour (10hr min)</span>
            </div>

            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div className="rounded-lg border border-[#E7E5E0] p-3 flex items-center justify-between min-h-[48px]">
                <span className="text-[13px] sm:text-sm flex items-center gap-2"><Calendar size={16} className="shrink-0" /> Date</span>
                <span className="text-[13px] sm:text-sm text-neutral-500">Select dates</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border p-2.5 sm:p-3 min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-neutral-500">Call Time</p>
                  <p className="text-[13px] sm:text-sm font-medium mt-1">07:00 AM</p>
                </div>
                <div className="rounded-lg border p-2.5 sm:p-3 min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-neutral-500">Wrap</p>
                  <p className="text-[13px] sm:text-sm font-medium mt-1">07:00 PM</p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-[#FAF9F6] p-3 sm:p-4 text-[13px] sm:text-sm">
                <div className="flex justify-between gap-2"><span className="min-w-0 break-words">${studio.hourlyRate} × 12 hrs</span><span className="shrink-0">${(studio.hourlyRate * 12).toFixed(2)}</span></div>
                <div className="flex justify-between gap-2"><span>Cleaning fee</span><span>$150</span></div>
                <div className="flex justify-between gap-2"><span>Security deposit</span><span>${studio.securityDeposit}</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold gap-2"><span>Total</span><span className="shrink-0">${(studio.hourlyRate * 12 + 150 + studio.securityDeposit).toFixed(2)}</span></div>
              </div>

              <Button className="w-full min-h-[48px]" size="lg" onClick={() => setShowBooking(true)}>Book This Studio</Button>
              <Button variant="outline" className="w-full min-h-[44px] text-[13px] sm:text-sm">Contact Host / Tech Scout</Button>

              <p className="text-center text-[11px] sm:text-xs text-neutral-500">You won&apos;t be charged yet</p>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} studio={studio} onSuccess={() => toast.success("Booking confirmed, check My Bookings")} />
      )}
    </div>
  );
}

