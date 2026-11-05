"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Studio } from "@/types";
import { bookingService } from "@/lib/api";
import { toast } from "sonner";
import { X } from "lucide-react";
import { getStudioImage, handleImageError } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studio: Studio;
  onSuccess?: () => void;
}

export default function BookingModal({ isOpen, onClose, studio, onSuccess }: Props) {
  const [form, setForm] = useState({
    bookingDate: "",
    startTime: "09:00",
    endTime: "17:00",
    crewSize: "5",
    productionType: "Commercial",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<{ subtotal: number; total: number; duration: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const calculatePreview = () => {
    const start = form.startTime.split(":").map(Number);
    const end = form.endTime.split(":").map(Number);
    const startMin = start[0] * 60 + (start[1] || 0);
    const endMin = end[0] * 60 + (end[1] || 0);
    const duration = (endMin - startMin) / 60;
    if (duration > 0) {
      const subtotal = studio.hourlyRate * duration;
      const total = subtotal + studio.securityDeposit;
      setPriceBreakdown({ subtotal, total, duration });
    } else {
      setPriceBreakdown(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookingService.create({
        studio: studio._id,
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        crewSize: parseInt(form.crewSize),
        productionType: form.productionType,
        notes: form.notes,
      });
      toast.success("Booking request submitted!");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Booking modal" onClick={onClose}>
      <div className="my-4 sm:my-8 w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-neutral-200" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b bg-white rounded-t-2xl gap-3">
          <div className="flex gap-2 sm:gap-3 items-center min-w-0 flex-1">
            <img src={getStudioImage(studio.images?.[0])} alt={studio.title} className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover shrink-0" onError={handleImageError} />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[14px] sm:text-[15px] truncate break-words">{studio.title}</h3>
              <p className="text-[12px] sm:text-sm text-neutral-500 truncate">${studio.hourlyRate}/hr • {studio.location}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close booking modal" className="p-2 rounded-full hover:bg-neutral-100 shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <Label>Booking Date</Label>
              <Input type="date" required value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} min={new Date().toISOString().split("T")[0]} className="mt-1 w-full" />
            </div>
            <div className="min-w-0">
              <Label>Crew Size</Label>
              <Input type="number" min={1} value={form.crewSize} onChange={(e) => setForm({ ...form, crewSize: e.target.value })} className="mt-1 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <Label className="text-[12px] sm:text-sm">Call Time (Start)</Label>
              <Input type="time" value={form.startTime} onChange={(e) => { setForm({ ...form, startTime: e.target.value }); setTimeout(calculatePreview, 0); }} className="mt-1 w-full" />
            </div>
            <div className="min-w-0">
              <Label className="text-[12px] sm:text-sm">Wrap Time (End)</Label>
              <Input type="time" value={form.endTime} onChange={(e) => { setForm({ ...form, endTime: e.target.value }); setTimeout(calculatePreview, 0); }} className="mt-1 w-full" />
            </div>
          </div>

          <div className="min-w-0">
            <Label>Production Type</Label>
            <select value={form.productionType} onChange={(e) => setForm({ ...form, productionType: e.target.value })} className="mt-1 h-12 w-full rounded-[8px] border border-[#E7E5E0] bg-white px-4 text-[13px] sm:text-sm min-h-[48px]">
              <option>Commercial</option>
              <option>Feature Film</option>
              <option>Editorial Stills</option>
              <option>Music Video</option>
              <option>Event</option>
            </select>
          </div>

          <div>
            <Label>Notes (Optional)</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requirements..." className="mt-1 min-h-[80px] sm:min-h-[100px]" />
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl bg-[#FAF9F6] border border-[#E7E5E0] p-3 sm:p-4 space-y-2">
            <h4 className="font-medium text-[13px] sm:text-sm">Price Breakdown</h4>
            <div className="text-[12px] sm:text-sm space-y-1.5">
              <div className="flex justify-between gap-2">
                <span className="text-neutral-600 break-words">Hourly Rate × Duration</span>
                <span className="tabular-nums shrink-0 text-right">${studio.hourlyRate} × {priceBreakdown?.duration?.toFixed(1) || "?"}h = ${priceBreakdown?.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-neutral-600">Security Deposit</span>
                <span className="tabular-nums shrink-0">${studio.securityDeposit}</span>
              </div>
              <div className="border-t border-[#E7E5E0] my-2" />
              <div className="flex justify-between font-semibold gap-2">
                <span>Estimated Total</span>
                <span className="tabular-nums shrink-0">${priceBreakdown?.total?.toFixed(2) || (studio.hourlyRate * 8 + studio.securityDeposit).toFixed(2)}</span>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={calculatePreview} className="mt-2 w-full min-h-[40px] text-[13px]">
              Recalculate
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 min-h-[48px] order-2 sm:order-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 min-h-[48px] order-1 sm:order-2" disabled={loading}>
              {loading ? "Submitting..." : "Request Reservation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

