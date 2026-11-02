"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Studio } from "@/types";
import { bookingService } from "@/lib/api";
import { toast } from "sonner";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex gap-3 items-center">
            <img src={studio.images[0]} alt={studio.title} className="h-12 w-12 rounded-lg object-cover" />
            <div>
              <h3 className="font-semibold">{studio.title}</h3>
              <p className="text-sm text-neutral-500">${studio.hourlyRate}/hr • {studio.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Booking Date</Label>
              <Input type="date" required value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} min={new Date().toISOString().split("T")[0]} className="mt-1" />
            </div>
            <div>
              <Label>Crew Size</Label>
              <Input type="number" min={1} value={form.crewSize} onChange={(e) => setForm({ ...form, crewSize: e.target.value })} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Call Time (Start)</Label>
              <Input type="time" value={form.startTime} onChange={(e) => { setForm({ ...form, startTime: e.target.value }); setTimeout(calculatePreview, 0); }} className="mt-1" />
            </div>
            <div>
              <Label>Wrap Time (End)</Label>
              <Input type="time" value={form.endTime} onChange={(e) => { setForm({ ...form, endTime: e.target.value }); setTimeout(calculatePreview, 0); }} className="mt-1" />
            </div>
          </div>

          <div>
            <Label>Production Type</Label>
            <select value={form.productionType} onChange={(e) => setForm({ ...form, productionType: e.target.value })} className="mt-1 h-12 w-full rounded-[8px] border border-[#E7E5E0] bg-white px-4 text-sm">
              <option>Commercial</option>
              <option>Feature Film</option>
              <option>Editorial Stills</option>
              <option>Music Video</option>
              <option>Event</option>
            </select>
          </div>

          <div>
            <Label>Notes (Optional)</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requirements..." className="mt-1" />
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl bg-[#FAF9F6] border border-[#E7E5E0] p-4 space-y-2">
            <h4 className="font-medium text-sm">Price Breakdown</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-600">Hourly Rate × Duration</span>
                <span className="tabular-nums">${studio.hourlyRate} × {priceBreakdown?.duration?.toFixed(1) || "?"}h = ${priceBreakdown?.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Security Deposit</span>
                <span className="tabular-nums">${studio.securityDeposit}</span>
              </div>
              <div className="border-t border-[#E7E5E0] my-2" />
              <div className="flex justify-between font-semibold">
                <span>Estimated Total</span>
                <span className="tabular-nums">${priceBreakdown?.total?.toFixed(2) || (studio.hourlyRate * 8 + studio.securityDeposit).toFixed(2)}</span>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={calculatePreview} className="mt-2 w-full">
              Recalculate
            </Button>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Submitting..." : "Request Reservation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

