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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 overflow-x-hidden">
      <h1 className="font-[Manrope] text-[22px] sm:text-3xl font-semibold break-words leading-tight">My Production Bookings</h1>
      <p className="mt-1 text-[12px] sm:text-sm text-neutral-600 break-words leading-5">Track shoot dates, access call sheets, and download insurance endorsements</p>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mt-4 sm:mt-6 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-2 w-max">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-[12px] sm:text-sm font-medium whitespace-nowrap min-h-[36px] sm:min-h-0 shrink-0 transition-colors ${tab === t.value ? "bg-[#202124] text-white" : "bg-white border border-[#E7E5E0] hover:bg-[#F1F0EC]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
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
          <div className="space-y-3 sm:space-y-4">
            {bookings.map((b: any) => (
              <Card key={b._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-0">
                <img src={b.studio?.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200"} alt={b.studio?.title || "Studio"} className="h-20 w-full sm:h-24 sm:w-24 rounded-xl object-cover shrink-0 aspect-[16/10] sm:aspect-square" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] sm:text-xs text-neutral-500 truncate">#{b._id.slice(-6).toUpperCase()} • {b.productionType || "Commercial"}</p>
                      <h3 className="font-semibold mt-1 text-[14px] sm:text-[15px] break-words line-clamp-2">{b.studio?.title || "Studio"}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-neutral-600">
                        <span className="flex items-center gap-1"><Calendar size={12} className="shrink-0" /> {b.bookingDate}</span>
                        <span className="flex items-center gap-1"><Clock size={12} className="shrink-0" /> {b.startTime} - {b.endTime} • {b.duration}h</span>
                        <span className="flex items-center gap-1"><Users size={12} className="shrink-0" /> {b.crewSize || 5} people</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium shrink-0 w-fit ${b.status === "confirmed" ? "bg-green-100 text-green-800" : b.status === "pending" ? "bg-amber-100 text-amber-800" : b.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-neutral-100"}`}>{b.status}</span>
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
                    <Link href={`/studios/${b.studio?._id || b.studio}`} className="w-full xs:w-auto sm:w-auto"><Button variant="outline" size="sm" className="w-full xs:w-auto min-h-[36px] text-[12px]">View Studio</Button></Link>
                    {b.status === "pending" || b.status === "confirmed" ? (
                      <Button variant="outline" size="sm" className="text-red-600 w-full xs:w-auto min-h-[36px] text-[12px]" onClick={() => setCancelId(b._id)}>Cancel Booking</Button>
                    ) : null}
                    <span className="ml-auto text-[13px] sm:text-sm font-medium tabular-nums">${b.totalAmount?.toFixed(2)}</span>
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

