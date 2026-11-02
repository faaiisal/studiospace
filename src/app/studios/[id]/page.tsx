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
  if (!studio) return <div className="p-12 text-center">Studio not found</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-neutral-500">
        <span>Home &gt; Studios &gt; {studio.category} &gt; {studio.title}</span>
      </div>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="font-[Manrope] text-3xl font-semibold leading-tight">{studio.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><MapPin size={14} /> {studio.location}</span>
            {studio.rating && <span className="flex items-center gap-1"><Star size={14} className="fill-neutral-900" /> {studio.rating} ({studio.reviewCount || 0})</span>}
            <span className="flex items-center gap-1"><Users size={14} /> Up to {studio.maxCapacity} people</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2"><Share2 size={16} /> Share</Button>
          <Button variant="outline" size="sm" onClick={handleWishlist} className="gap-2"><Heart size={16} className={wishlisted ? "fill-[#E76F51] text-[#E76F51]" : ""} /> Save</Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
          <img src={studio.images[activeImage]} alt={studio.title} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-1 gap-2 md:aspect-[16/10]">
          {studio.images.slice(0, 5).map((img, idx) => (
            <button key={idx} onClick={() => setActiveImage(idx)} className={`overflow-hidden rounded-xl border-2 ${activeImage === idx ? "border-[#E76F51]" : "border-transparent"}`}>
              <img src={img} alt="" className="h-full w-full object-cover aspect-[4/3]" />
            </button>
          ))}
          {studio.images.length > 5 && (
            <div className="flex items-center justify-center rounded-xl bg-neutral-900 text-white text-sm">
              +{studio.images.length - 5} more
            </div>
          )}
        </div>
      </div>

      {/* Spec Bar */}
      <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-[#E7E5E0] bg-white p-4">
        <span className="flex items-center gap-2 text-sm"><Ruler size={16} /> {studio.squareFootage || "4,200"} sq ft</span>
        <span className="flex items-center gap-2 text-sm"><Ruler size={16} /> {studio.ceilingHeight || 18}ft Clear Height</span>
        <span className="flex items-center gap-2 text-sm"><Zap size={16} /> {studio.powerAmperage || 200}A Camlock</span>
        <span className="flex items-center gap-2 text-sm"><Shield size={16} /> STC {studio.stcRating || 55}+</span>
        <span className="flex items-center gap-2 text-sm"><Users size={16} /> {studio.maxCapacity} Capacity</span>
      </div>

      {/* Content 65/35 */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div>
            <h2 className="font-[Manrope] text-xl font-semibold">Architectural Overview</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-700">{studio.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold">Amenities & Production Gear</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {studio.amenities.map((am) => (
                <Badge key={am} variant="outline" className="uppercase text-xs tracking-wide">{am}</Badge>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="rounded-xl border border-[#E7E5E0] p-6 bg-[#FAF9F6]">
            <h3 className="font-semibold">House Rules & Insurance</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600 list-disc pl-5">
              <li>Security deposit: ${studio.securityDeposit} (refundable)</li>
              <li>Minimum COI: $1M / $2M general liability</li>
              <li>Overtime: 1.5× after booked wrap time</li>
              <li>No smoking, no open flames without permit</li>
            </ul>
          </div>

          {/* Host */}
          <div className="flex gap-4 rounded-xl border border-[#E7E5E0] p-6">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studio.ownerName)}&background=E76F51&color=fff`} alt={studio.ownerName} className="h-12 w-12 rounded-full" />
            <div>
              <h4 className="font-semibold">{studio.ownerName}</h4>
              <p className="text-sm text-neutral-500">Verified Studio Host • Responds in 2 hours</p>
              <p className="mt-2 text-sm text-neutral-600">Curator of architectural production spaces with 5+ years hosting commercial and film productions.</p>
            </div>
          </div>
        </div>

        {/* Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#E7E5E0] bg-white p-6 shadow-[0_12px_32px_rgba(32,33,36,0.08)]">
            <div className="flex items-baseline justify-between">
              <span className="font-[Manrope] text-2xl font-bold tabular-nums">${studio.hourlyRate}</span>
              <span className="text-sm text-neutral-500">/ hour (10hr min)</span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-[#E7E5E0] p-3 flex items-center justify-between">
                <span className="text-sm flex items-center gap-2"><Calendar size={16} /> Date</span>
                <span className="text-sm text-neutral-500">Select dates</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Call Time</p>
                  <p className="text-sm font-medium">07:00 AM</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Wrap</p>
                  <p className="text-sm font-medium">07:00 PM</p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-[#FAF9F6] p-4 text-sm">
                <div className="flex justify-between"><span>${studio.hourlyRate} × 12 hrs</span><span>${(studio.hourlyRate * 12).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Cleaning fee</span><span>$150</span></div>
                <div className="flex justify-between"><span>Security deposit</span><span>${studio.securityDeposit}</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>${(studio.hourlyRate * 12 + 150 + studio.securityDeposit).toFixed(2)}</span></div>
              </div>

              <Button className="w-full" size="lg" onClick={() => setShowBooking(true)}>Book This Studio</Button>
              <Button variant="outline" className="w-full">Contact Host / Tech Scout</Button>

              <p className="text-center text-xs text-neutral-500">You won&apos;t be charged yet</p>
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

