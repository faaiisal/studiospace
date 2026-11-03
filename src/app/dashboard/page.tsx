"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookingService, studioService, userService, wishlistService, authService } from "@/lib/api";
import { User, Studio, Booking } from "@/types";
import {
  Building2,
  Calendar,
  Heart,
  Clock,
  Plus,
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Search,
  FileText,
  Package,
  ShieldCheck,
  Star,
  MapPin,
  Timer,
  FileBadge,
  User2,
  Edit3,
  CalendarDays,
  ArrowUpRight,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

type TabType = "upcoming" | "pending" | "completed";

const mockReservations = [
  {
    _id: "bk_8812",
    ref: "ST-8812",
    title: "The Frame Lab — Photography Studio",
    location: "TriBeCa, New York • Daylight Loft & Cyc",
    date: "Tomorrow, 10:00 AM - 3:00 PM",
    host: "Elena Vance",
    superhost: true,
    status: "confirmed",
    price: 700,
    hours: "5 hrs total",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    coi: true,
    freight: "Freight loading dock reserved",
  },
  {
    _id: "bk_8819",
    ref: "ST-8819",
    title: "Echo Room — Broadcast Podcast",
    location: "Greenpoint, Brooklyn • Acoustic Soundstage",
    date: "Thu, Oct 26 • 2:00 PM - 4:00 PM",
    host: "Marcus Brody",
    superhost: false,
    status: "pending",
    price: 340,
    hours: "2 hrs total",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80",
    coi: false,
    freight: null,
    remaining: "Host has 6 hours remaining to confirm",
  },
  {
    _id: "bk_8740",
    ref: "ST-8740",
    title: "Motion House — Stage A",
    location: "Long Island City, NY • 4,500 sq ft Stage",
    date: "Sat, Oct 28 • 8:00 AM - 6:00 PM",
    host: "Apex Studio Group",
    superhost: false,
    status: "confirmed",
    price: 1100,
    hours: "Full Day",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d0?w=400&q=80",
    coi: true,
    freight: null,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ listings: 0, bookings: 0, pending: 0, wishlist: 0, confirmed: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [recentListings, setRecentListings] = useState<Studio[]>([]);
  const [allListings, setAllListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserveTab, setReserveTab] = useState<TabType>("upcoming");
  const [sidebarActive, setSidebarActive] = useState("overview");

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, listingsRes, bookingsRes, hostBookingsRes, wishlistRes] = await Promise.all([
          userService.me().catch(() => null),
          studioService.getMyListings().catch(() => ({ data: [] } as any)),
          bookingService.getMy({}).catch(() => ({ data: { bookings: [] } } as any)),
          bookingService.getHost({}).catch(() => ({ data: { bookings: [] } } as any)),
          wishlistService.getAll().catch(() => ({ data: { wishlist: [] } } as any)),
        ]);

        if (meRes) setUser(meRes.data);

        const listings = (listingsRes?.data || []) as Studio[];
        setAllListings(listings);
        setRecentListings(listings.slice(0, 3));

        const mBookings = (bookingsRes?.data?.bookings || []) as Booking[];
        const hBookings = (hostBookingsRes?.data?.bookings || []) as Booking[];
        const wishlist = (wishlistRes?.data?.wishlist || []) as any[];

        setMyBookings(mBookings);
        setHostBookings(hBookings);
        setRecentBookings([...mBookings, ...hBookings].slice(0, 8));

        setStats({
          listings: listings.length,
          bookings: mBookings.length + hBookings.length,
          pending: [...mBookings, ...hBookings].filter((b: any) => b.status === "pending").length,
          confirmed: [...mBookings, ...hBookings].filter((b: any) => b.status === "confirmed").length,
          wishlist: wishlist.length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logged out");
    router.push("/login");
  };

  const filteredReservations = (() => {
    const combined = [...myBookings, ...hostBookings];
    if (combined.length > 0) {
      if (reserveTab === "upcoming") return combined.filter((b: any) => b.status === "confirmed").length ? combined.filter((b: any) => b.status === "confirmed") : combined;
      if (reserveTab === "pending") return combined.filter((b: any) => b.status === "pending");
      if (reserveTab === "completed") return combined.filter((b: any) => ["completed", "cancelled"].includes(b.status));
      return combined;
    }
    // Fallback mock if no real data
    if (reserveTab === "pending") return mockReservations.filter((r) => r.status === "pending") as any;
    if (reserveTab === "completed") return [];
    return mockReservations as any;
  })();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF8F5]">
        <div className="text-sm text-neutral-500">Loading dashboard...</div>
      </div>
    );
  }

  const displayName = user?.name?.split(" ")[0] || "Alex";
  const fullName = user?.name || "Alex Rivera";
  const userAvatar = user?.photoURL || "https://i.pravatar.cc/150?img=11";

  return (
    <div className="bg-[#FBF8F5] min-h-screen">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
          {/* Profile Card */}
          <Card className="border-[#E8DDD6] bg-white rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <div className="relative">
                  <img src={userAvatar} alt={fullName} className="h-12 w-12 rounded-full object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#202124] truncate">{fullName}</p>
                  <p className="text-[11px] text-neutral-500 truncate">Creative Director & Studio...</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FFF1EB] border border-[#F9D8C0] px-2 py-0.5 text-[10px] font-medium text-[#8B5A44]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Pro Host Member
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[#FAF6F3] border border-[#F1E9E2] p-3 text-center">
                  <p className="text-[18px] font-bold text-[#202124]">4.98</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Host Rating</p>
                </div>
                <div className="rounded-lg bg-[#FAF6F3] border border-[#F1E9E2] p-3 text-center">
                  <p className="text-[18px] font-bold text-[#202124]">100%</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Response Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="border-[#E8DDD6] bg-white rounded-xl overflow-hidden">
            <CardContent className="p-2">
              <nav className="space-y-0.5">
                {[
                  { id: "overview", label: "Overview", icon: LayoutDashboard, active: true },
                  { id: "bookings", label: "My Bookings", icon: Calendar, badge: stats.bookings ? `${stats.bookings} Upcoming` : "3 Upcoming", badgeColor: "bg-[#FFE4D6] text-[#9C4A2E]" },
                  { id: "listings", label: "My Studio Listings", icon: Building2, badge: stats.listings ? `${stats.listings} Active` : "2 Active", badgeColor: "bg-[#D1FAE5] text-[#065F46]" },
                  { id: "add", label: "Add New Studio", icon: Plus, right: "+" },
                  { id: "wishlist", label: "Wishlist", icon: Heart, badge: stats.wishlist ? `${stats.wishlist} Saved` : "12 Saved", badgeColor: "bg-transparent text-neutral-500" },
                  { id: "messages", label: "Messages / Inquiries", icon: MessageSquare, badge: "1 new", badgeColor: "bg-[#E76F51] text-white" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "bookings") router.push("/my-bookings");
                      else if (item.id === "listings") router.push("/my-listings");
                      else if (item.id === "add") router.push("/add-studio");
                      else if (item.id === "wishlist") router.push("/wishlist");
                      else setSidebarActive(item.id);
                    }}
                    className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] transition-colors ${
                      sidebarActive === item.id && item.id === "overview"
                        ? "bg-[#FFF1EB] text-[#202124] border-l-2 border-[#E76F51] font-medium"
                        : "text-neutral-600 hover:bg-[#FAF6F3] hover:text-[#202124]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.badgeColor}`}>{item.badge}</span>
                      )}
                      {item.right && <span className="text-neutral-400 text-[12px]">{item.right}</span>}
                    </span>
                  </button>
                ))}

                <div className="my-2 border-t border-[#F1E9E2]" />

                {[
                  { id: "billing", label: "Billing & Payouts", icon: CreditCard },
                  { id: "account", label: "Account Settings", icon: Settings },
                  { id: "logout", label: "Log Out", icon: LogOut, danger: true },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "logout") handleLogout();
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] ${
                      item.danger ? "text-[#C53030] hover:bg-[#FFF1EB]" : "text-neutral-600 hover:bg-[#FAF6F3]"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Concierge */}
          <Card className="border-[#E8DDD6] bg-[#FFFEFB] rounded-xl">
            <CardContent className="p-4">
              <div className="flex gap-2 items-start">
                <div className="h-7 w-7 rounded-full bg-[#FFF1EB] border border-[#F9D8C0] flex items-center justify-center text-[#E76F51]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[12px] font-semibold text-[#202124]">StudioSpace Concierge</h4>
                  <p className="mt-1 text-[11px] leading-4 text-neutral-600">
                    Need equipment couriers, certified stage hands, or custom COI verification for tomorrow?
                  </p>
                  <Link href="#" className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#E76F51] hover:underline">
                    Chat with Production Desk <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-5 min-w-0">
          {/* Welcome Banner */}
          <Card className="border-[#E8DDD6] bg-white rounded-xl">
            <CardContent className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] tracking-wide text-neutral-500 uppercase">
                  <span>MONDAY, OCTOBER 23, 2025</span>
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> PRODUCTIONS LIVE
                  </span>
                </div>
                <h1 className="mt-2 font-[Manrope] text-[24px] md:text-[26px] font-bold tracking-tight text-[#202124]">
                  Welcome back, {displayName}!
                </h1>
                <p className="mt-1 text-[12px] text-neutral-500 max-w-[480px]">
                  Here is what&apos;s happening with your productions and studio listings today.
                </p>
              </div>
              <div className="flex gap-2.5 shrink-0">
                <Link href="/add-studio">
                  <Button className="rounded-md h-9 px-4 text-[12px] gap-1.5 bg-[#E76F51] hover:bg-[#d65c3f]">
                    <Plus className="h-4 w-4" /> Add New Studio
                  </Button>
                </Link>
                <Link href="/studios">
                  <Button variant="outline" className="rounded-md h-9 px-4 text-[12px] gap-1.5 border-[#E8DDD6]">
                    <Search className="h-3.5 w-3.5" /> Explore Studios
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-[#E8DDD6] bg-white rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-[10px] tracking-wide uppercase text-neutral-500">Total Studios Listed</p>
                  <span className="h-6 w-6 rounded-md bg-[#FAF6F3] border border-[#F1E9E2] flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-neutral-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-[22px] font-bold text-[#202124]">{stats.listings || 2}</p>
                  <Badge className="bg-[#EEF2FF] text-[#4338CA] text-[10px] rounded-full border-0 px-2">
                    +1 this month
                  </Badge>
                </div>
                <p className="mt-2 text-[10px] text-neutral-400 truncate">
                  {allListings[0]?.title ? `${allListings[0].title.slice(0, 28)}...` : "The Soho Sun Studio, Brea..."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E8DDD6] bg-white rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-[10px] tracking-wide uppercase text-neutral-500">Total Bookings</p>
                  <span className="h-6 w-6 rounded-md bg-[#FAF6F3] border border-[#F1E9E2] flex items-center justify-center">
                    <FileBadge className="h-3.5 w-3.5 text-neutral-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-[22px] font-bold text-[#202124]">{stats.bookings || 28}</p>
                  <span className="text-[10px] text-neutral-500">All-time</span>
                </div>
                <p className="mt-2 text-[10px] text-neutral-400">
                  14 as creator • 14 as host
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E8DDD6] bg-white rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-[10px] tracking-wide uppercase text-neutral-500">Pending Requests</p>
                  <span className="h-6 w-6 rounded-md bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-[22px] font-bold text-[#202124]">{stats.pending || 3}</p>
                  <Badge className="bg-[#FEF3C7] text-[#92400E] text-[10px] rounded-full border-0">Needs Action</Badge>
                </div>
                <p className="mt-2 text-[10px] text-neutral-400">Awaiting approval / client review</p>
              </CardContent>
            </Card>

            <Card className="border-[#E8DDD6] bg-white rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <p className="text-[10px] tracking-wide uppercase text-neutral-500">Confirmed Bookings</p>
                  <span className="h-6 w-6 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-[22px] font-bold text-[#202124]">{stats.confirmed || 8}</p>
                  <span className="text-[10px] text-emerald-600">Active cycle</span>
                </div>
                <p className="mt-2 text-[10px] text-neutral-400">Revenue $4,320 this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-5">
            {/* Reservations */}
            <Card className="border-[#E8DDD6] bg-white rounded-xl">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-[#F1E9E2] pb-4">
                  <div>
                    <h2 className="text-[14px] font-semibold text-[#202124]">Recent & Upcoming Reservations</h2>
                    <p className="mt-1 text-[11px] text-neutral-500 max-w-[320px]">
                      Manage active production days, permits, and credentials.
                    </p>
                  </div>
                  <div className="inline-flex rounded-full bg-[#F8F1ED] border border-[#F1E9E2] p-1">
                    {(["upcoming", "pending", "completed"] as TabType[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setReserveTab(tab)}
                        className={`rounded-full px-3.5 py-1 text-[11px] font-medium capitalize transition-all ${
                          reserveTab === tab ? "bg-white shadow-sm text-[#202124] border border-[#E8DDD6]" : "text-neutral-500"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-5">
                  {filteredReservations.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-[13px] text-neutral-500">No {reserveTab} reservations.</p>
                      <Link href="/studios" className="mt-2 inline-block text-[12px] text-[#E76F51] underline">
                        Explore studios
                      </Link>
                    </div>
                  ) : (
                    filteredReservations.map((item: any) => {
                      const isRealBooking = !!item.bookingDate || !!item.studioId;
                      const img = item.image || item.studio?.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300";
                      const title = item.title || item.studio?.title || "Studio Reservation";
                      const location = item.location || item.studio?.location || "New York";
                      const date = item.date || `${item.bookingDate || "Tomorrow"} • ${item.startTime || "10:00"} - ${item.endTime || "3:00"}`;
                      const price = item.price || item.totalPrice || 700;
                      const hrs = item.hours || (item.totalHours ? `${item.totalHours} hrs` : "5 hrs total");
                      const ref = item.ref || item._id?.slice(0, 6).toUpperCase() || "ST-8812";
                      const status = item.status || "confirmed";
                      const host = item.host || "Host";

                      return (
                        <div key={item._id} className="rounded-lg border border-[#F1E9E2] p-4 hover:border-[#E8DDD6] transition-colors">
                          <div className="flex gap-4">
                            <img src={img} alt={title} className="h-[86px] w-[110px] rounded-md object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                                <Badge
                                  className={`rounded-full border-0 text-[10px] px-2 py-0 ${
                                    status === "confirmed" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEF3C7] text-[#92400E]"
                                  }`}
                                >
                                  {status === "confirmed" ? "Confirmed" : "Pending Host Review"}
                                </Badge>
                                <span className="text-neutral-400">REF: #{ref}</span>
                              </div>
                              <h3 className="mt-2 text-[13px] font-semibold text-[#202124] leading-tight truncate">{title}</h3>
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-500">
                                <MapPin className="h-3 w-3" /> {location}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6F3] border border-[#F1E9E2] px-2 py-1 text-[10px] text-neutral-600">
                                  <Timer className="h-3 w-3" /> {date}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6F3] border border-[#F1E9E2] px-2 py-1 text-[10px] text-neutral-600">
                                  <User2 className="h-3 w-3" /> Host: {host} {item.superhost && <span className="text-[9px] text-neutral-400">(Superhost)</span>}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right hidden md:block">
                              <p className="text-[14px] font-bold text-[#202124]">${price}</p>
                              <p className="text-[10px] text-neutral-500">{hrs}</p>
                            </div>
                          </div>

                          {item.remaining && (
                            <div className="mt-3 flex items-center gap-1 text-[10px] text-neutral-500">
                              <Circle className="h-3 w-3" /> {item.remaining}
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.coi && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full px-2.5 py-1">
                                <ShieldCheck className="h-3 w-3" /> StudioSpace COI Insurance Active
                              </span>
                            )}
                            <Button variant="outline" size="sm" className="h-7 rounded-md text-[11px] border-[#E8DDD6] px-3">
                              <FileText className="h-3 w-3" /> Message Host
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 rounded-md text-[11px] border-[#E8DDD6] px-3">
                              Download Permit/COI
                            </Button>
                            <Button size="sm" className="h-7 rounded-md text-[11px] bg-[#202124] hover:bg-black text-white px-3">
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-6 text-center border-t border-[#F1E9E2] pt-4">
                  <Link href="/my-bookings" className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C45538] hover:underline">
                    View All Reservation History ({stats.bookings || 28} Total) <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Right Stack */}
            <div className="space-y-5">
              {/* My Studio Listings */}
              <Card className="border-[#E8DDD6] bg-white rounded-xl overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[13px] font-semibold">My Studio Listings</CardTitle>
                    <Badge className="bg-[#EEF2FF] text-[#4338CA] text-[10px] rounded-full border-0">2 Active Spaces</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  {/* Featured */}
                  <div className="rounded-lg border border-[#F1E9E2] overflow-hidden">
                    <div className="relative aspect-[16/10]">
                      <img
                        src={allListings[0]?.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80"}
                        alt="SoHo"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <Badge className="bg-[#DCFCE7] text-[#166534] text-[9px] border-0 rounded-full">● Live & Bool</Badge>
                        <Badge className="bg-white/90 text-[#202124] text-[9px] border-0 rounded-full">South-Facing Daylight</Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[12px] font-semibold leading-tight text-[#202124]">
                          {allListings[0]?.title?.slice(0, 28) || "SoHo Daylight Loft & Cyc"}
                        </h3>
                        <span className="text-[12px] font-bold text-[#202124] shrink-0">
                          ${allListings[0]?.hourlyRate || 140} <span className="text-[10px] font-normal text-neutral-500">/hr</span>
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-neutral-500">
                        {allListings[0]?.location || "Spring Street, Manhattan"} • 2,400 sq ft
                      </p>
                      <div className="mt-3 rounded-md bg-[#FAF6F3] border border-[#F1E9E2] px-2.5 py-2 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500">Occupancy rate this month</span>
                        <span className="text-[11px] font-semibold text-[#202124]">94%</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-md border-[#E8DDD6]">
                          <Edit3 className="h-3 w-3" /> Edit Listing
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-md border-[#E8DDD6]">
                          <CalendarDays className="h-3 w-3" /> View Calendar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Second Listing Compact */}
                  <div className="flex items-center justify-between rounded-lg border border-[#F1E9E2] bg-[#FFFEFB] p-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-8 w-8 rounded-md bg-[#FAF6F3] border border-[#F1E9E2] flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-neutral-600" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#202124] truncate">
                          {allListings[1]?.title?.slice(0, 22) || "Brooklyn Sound Stage B"}
                        </p>
                        <p className="text-[10px] text-neutral-500">({allListings[1]?.hourlyRate ? `$${allListings[1].hourlyRate}/hr` : "$210/hr"})</p>
                      </div>
                    </div>
                    <Link href="/my-listings" className="text-[11px] font-medium text-[#9C4A2E] hover:underline shrink-0">
                      Manage
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="border-[#E8DDD6] bg-white rounded-xl">
                <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-[13px] font-semibold">Activity Feed & Log</CardTitle>
                  <Clock className="h-4 w-4 text-neutral-400" />
                </CardHeader>
                <CardContent className="p-5 pt-3 space-y-4">
                  {[
                    {
                      icon: Package,
                      color: "bg-[#D1FAE5] text-emerald-700 border-emerald-200",
                      title: "Equipment load-in confirmed for Oct 24",
                      sub: "ARRI Alexa Mini package & Grip van • 18m ago",
                    },
                    {
                      icon: ShieldCheck,
                      color: "bg-[#FFE4D6] text-[#9C4A2E] border-[#F9CBBB]",
                      title: "COI insurance approved by StudioSpace",
                      sub: "Policy coverage validated for 'Vance Fashion Shoot' • 2h ago",
                    },
                    {
                      icon: Star,
                      color: "bg-[#FEF3C7] text-amber-700 border-amber-200",
                      title: "New review received: 5.0 stars",
                      sub: "\"Flawless natural light and super responsive host!\" • 1d ago",
                    },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <span className={`h-7 w-7 rounded-full border flex items-center justify-center shrink-0 ${act.color}`}>
                        <act.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#202124] leading-tight">{act.title}</p>
                        <p className="mt-0.5 text-[10px] text-neutral-500 leading-4">{act.sub}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Host Assurance */}
              <Card className="border-[#E8D9D0] bg-[#FFF6F1] rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2.5">
                      <span className="h-8 w-8 rounded-md bg-[#E76F51] text-white flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-[12px] font-semibold text-[#202124]">StudioSpace Host Assurance</h4>
                        <p className="mt-1 text-[11px] leading-4 text-neutral-600 max-w-[200px]">
                          Every production hosted on StudioSpace is automatically backed by our{" "}
                          <span className="font-semibold text-[#202124]">$2,000,000 Protection Guarantee</span> and spatial property coverage.
                        </p>
                        <Link href="#" className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-[#9C4A2E] hover:underline">
                          Download Policy Certificate <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                    <Badge className="bg-[#9C4A2E] text-white text-[8px] rounded-full border-0 shrink-0">COVERED</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
