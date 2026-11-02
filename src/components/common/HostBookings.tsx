"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/lib/api";
import { Booking } from "@/types";
import { toast } from "sonner";

export default function HostBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getHost({ status: "pending" });
      setBookings(res.data.bookings as any || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id: string, status: "confirmed" | "rejected") => {
    try {
      await bookingService.updateStatus(id, status);
      toast.success(`Booking ${status}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err: any) {
      toast.error(err.data?.message || "Failed");
    }
  };

  if (loading) return <div>Loading host requests...</div>;
  if (bookings.length === 0) return <p className="text-sm text-neutral-500">No pending host requests</p>;

  return (
    <div className="space-y-3">
      {bookings.map((b: any) => (
        <Card key={b._id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">{b.studio?.title} • {b.bookingDate} {b.startTime}-{b.endTime}</p>
            <p className="text-xs text-neutral-500">{b.user?.name} • {b.crewSize} people • {b.productionType}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleStatus(b._id, "confirmed")}>Confirm</Button>
            <Button size="sm" variant="outline" onClick={() => handleStatus(b._id, "rejected")}>Reject</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

