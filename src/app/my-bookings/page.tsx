"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { bookingService } from "@/lib/api";
import { Booking } from "@/types";
import { toast } from "sonner";
import EmptyState from "@/components/common/EmptyState";
import DeleteModal from "@/components/common/DeleteModal";
import { Calendar, Clock, Users } from "lucide-react";

type Tab = "all" | "pending" | "confirmed" | "completed" | "cancelled";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async (status: Tab) => {
    setLoading(true);
    try {
      const params = status === "all" ? {} : { status };
      const res = await bookingService.getMy(params);
      setBookings(res.data.bookings as any || []);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(tab);
  }, [tab]);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await bookingService.cancel(cancelId);
      toast.success("Booking cancelled");
      setBookings(bookings.map(b => b._id === cancelId ? { ...b, status: "cancelled" as any } : b));
      setCancelId(null);
    } catch (err: any) {
      toast.error(err.data?.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  const tabs: { label: string; value: Tab }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
      <h1 className="font-[Manrope] text-3xl font-semibold">My Production Bookings</h1>
      <p className="mt-1 text-sm text-neutral-600">Track shoot dates, access call sheets, and download insurance endorsements</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${tab === t.value ? "bg-[#202124] text-white" : "bg-white border border-[#E7E5E0] hover:bg-[#F1F0EC]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral-100" />)}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="You have no bookings yet"
            description="Discover production-ready lofts and stages."
            actionLabel="Explore Studios"
            actionHref="/studios"
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <Card key={b._id} className="p-6 flex flex-col md:flex-row gap-6">
                <img src={b.studio?.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200"} alt={b.studio?.title} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">#{b._id.slice(-6).toUpperCase()} • {b.productionType || "Commercial"}</p>
                      <h3 className="font-semibold mt-1">{b.studio?.title || "Studio"}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-600">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {b.bookingDate}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {b.startTime} - {b.endTime} • {b.duration}h</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {b.crewSize || 5} people</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${b.status === "confirmed" ? "bg-green-100 text-green-800" : b.status === "pending" ? "bg-amber-100 text-amber-800" : b.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-neutral-100"}`}>{b.status}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/studios/${b.studio?._id || b.studio}`}><Button variant="outline" size="sm">View Studio</Button></Link>
                    {b.status === "pending" || b.status === "confirmed" ? (
                      <Button variant="outline" size="sm" className="text-red-600" onClick={() => setCancelId(b._id)}>Cancel Booking</Button>
                    ) : null}
                    <span className="ml-auto text-sm font-medium tabular-nums">${b.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Production Booking?"
        description="This will cancel your booking. Cancelled bookings no longer block availability. This action cannot be undone for confirmed bookings close to shoot date."
        confirmLabel="Cancel Booking"
        loading={cancelling}
      />
    </div>
  );
}

