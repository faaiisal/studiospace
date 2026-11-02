"use client";


import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService, userService } from "@/lib/api";
import { User } from "@/types";
import { Menu, X, Heart, LayoutDashboard, Plus, Building2, Calendar, LogOut, Settings } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.me();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-neutral-900">Studio</span>
            <span className="text-[#E76F51]">Space</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pb-1 text-sm font-medium transition-colors",
                  isActive
                    ? "border-b-2 border-[#E76F51] font-semibold text-[#E76F51]"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-100" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-neutral-200 p-1 pr-3 hover:border-neutral-300"
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E76F51&color=fff`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-neutral-200 bg-white py-2 shadow-xl z-50">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <div className="my-2 border-t border-neutral-100" />
                  <Link href="/dashboard" onClick={()=>setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/add-studio" onClick={()=>setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <Plus size={16} /> Add New Studio
                  </Link>
                  <Link href="/my-listings" onClick={()=>setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <Building2 size={16} /> My Studio Listings
                  </Link>
                  <Link href="/my-bookings" onClick={()=>setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <Calendar size={16} /> My Bookings
                  </Link>
                  <Link href="/wishlist" onClick={()=>setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <Heart size={16} /> Wishlist
                  </Link>
                  <div className="my-2 border-t border-neutral-100" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                Log In
              </Link>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-base font-medium",
                  pathname === link.href ? "text-[#E76F51]" : "text-neutral-700"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={()=>setMobileOpen(false)} className="text-sm">Dashboard</Link>
                  <Link href="/my-bookings" onClick={()=>setMobileOpen(false)} className="text-sm">My Bookings</Link>
                  <Link href="/my-listings" onClick={()=>setMobileOpen(false)} className="text-sm">My Listings</Link>
                  <Link href="/wishlist" onClick={()=>setMobileOpen(false)} className="text-sm">Wishlist</Link>
                  <button onClick={handleLogout} className="text-left text-sm text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={()=>setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/register" onClick={()=>setMobileOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

