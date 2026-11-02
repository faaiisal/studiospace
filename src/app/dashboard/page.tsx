"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingService, studioService, userService } from "@/lib/api";
import { User, Studio, Booking } from "@/types";
import { Building2, Calendar, Heart, DollarSign, Clock, Plus } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ listings: 0, bookings: 0, pending: 0, wishlist: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentListings, setRecentListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, listingsRes, bookingsRes, hostBookingsRes] = await Promise.all([
          userService.me().catch(() => null),
          studioService.getMyListings().catch(() => ({ data: [] } as any)),
          bookingService.getMy({}).catch(() => ({ data: { bookings: [] } } as any)),
          bookingService.getHost({}).catch(() => ({ data: { bookings: [] } } as any)),
        ]);

        if (meRes) setUser(meRes.data);

        const listings = listingsRes?.data || [];
        setRecentListings(listings.slice(0, 3));

        const myBookings = bookingsRes?.data?.bookings || [];
        const hostBookings = hostBookingsRes?.data?.bookings || [];
        setRecentBookings([...myBookings, ...hostBookings].slice(0, 5));

        setStats({
          listings: listings.length,
          bookings: myBookings.length,
          pending: hostBookings.filter((b: Booking) => b.status === "pending").length,
          wishlist: 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-12">Loading dashboard...</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-[Manrope] text-3xl font-semibold">Good morning, {user?.name || "Alex"}</h1>
          <p className="text-sm text-neutral-600">Production Status: All Systems Operational • {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/add-studio"><Button className="gap-2"><Plus size={16} /> Add New Studio</Button></Link>
          <Link href="/studios"><Button variant="outline">Find a Space</Button></Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar size={16} /> Active Bookings</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.bookings} Upcoming</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Building2 size={16} /> My Listings</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.listings} Studios</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock size={16} /> Pending Requests</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.pending} Awaiting</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><DollarSign size={16} /> Total Spend</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">$14,850</p></CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <p className="text-sm text-neutral-500">No recent bookings. <Link href="/studios" className="text-[#E76F51] underline">Explore studios</Link></p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b: any) => (
                    <div key={b._id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex gap-3 items-center">
                        <img src={b.studio?.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100"} alt="" className="h-10 w-10 rounded object-cover" />
                        <div>
                          <p className="text-sm font-medium">{b.studio?.title || "Studio"}</p>
                          <p className="text-xs text-neutral-500">{b.bookingDate} • {b.startTime}-{b.endTime}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs ${b.status === "confirmed" ? "bg-green-100 text-green-800" : b.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-neutral-100"}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>My Listings</CardTitle></CardHeader>
            <CardContent>
              {recentListings.length === 0 ? (
                <p className="text-sm text-neutral-500">No listings yet. <Link href="/add-studio" className="text-[#E76F51]">List your first studio</Link></p>
              ) : (
                <div className="space-y-3">
                  {recentListings.map((s) => (
                    <div key={s._id} className="flex gap-3 rounded-lg border p-3">
                      <img src={s.images[0]} alt={s.title} className="h-12 w-12 rounded object-cover" />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{s.title}</p>
                        <p className="text-xs text-neutral-500">${s.hourlyRate}/hr • {s.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/add-studio"><Button variant="outline" className="w-full justify-start gap-2"><Plus size={16} /> Add Studio</Button></Link>
              <Link href="/my-listings"><Button variant="outline" className="w-full justify-start gap-2"><Building2 size={16} /> Manage Listings</Button></Link>
              <Link href="/my-bookings"><Button variant="outline" className="w-full justify-start gap-2"><Calendar size={16} /> View Bookings</Button></Link>
              <Link href="/wishlist"><Button variant="outline" className="w-full justify-start gap-2"><Heart size={16} /> Wishlist</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

