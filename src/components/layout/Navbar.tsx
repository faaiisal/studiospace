"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, getStudioImage, handleImageError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService, userService } from "@/lib/api";
import { User } from "@/types";
import { Menu, X, Heart, LayoutDashboard, Plus, Building2, Calendar, LogOut } from "lucide-react";

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

  // Close dropdown on outside click and lock body scroll when mobile open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setDropdownOpen(false);
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0" aria-label="StudioSpace home">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="text-[18px] sm:text-xl font-bold tracking-tight truncate">
            <span className="text-neutral-900">Studio</span>
            <span className="text-[#E76F51]">Space</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pb-1 text-sm font-medium transition-colors whitespace-nowrap",
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
        <div className="hidden items-center gap-3 md:flex shrink-0">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-100" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-2 rounded-full border border-neutral-200 p-1 pr-3 hover:border-neutral-300 min-h-[44px]"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <img
                  src={getStudioImage(user.photoURL) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E76F51&color=fff`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={handleImageError}
                />
                <span className="text-sm font-medium text-neutral-900 max-w-[100px] truncate">{user.name}</span>
                <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-200 bg-white py-2 shadow-xl z-50"
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <div className="my-2 border-t border-neutral-100" />
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                    <LayoutDashboard size={16} className="shrink-0" /> Dashboard
                  </Link>
                  <Link href="/add-studio" onClick={() => setDropdownOpen(false)} className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                    <Plus size={16} className="shrink-0" /> Add New Studio
                  </Link>
                  <Link href="/my-listings" onClick={() => setDropdownOpen(false)} className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                    <Building2 size={16} className="shrink-0" /> My Studio Listings
                  </Link>
                  <Link href="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                    <Calendar size={16} className="shrink-0" /> My Bookings
                  </Link>
                  <Link href="/wishlist" onClick={() => setDropdownOpen(false)} className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                    <Heart size={16} className="shrink-0" /> Wishlist
                  </Link>
                  <div className="my-2 border-t border-neutral-100" />
                  <button onClick={handleLogout} className="flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                    <LogOut size={16} className="shrink-0" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 min-h-[44px] flex items-center">
                Log In
              </Link>
              <Button asChild className="min-h-[44px]">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-neutral-100 shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-neutral-200 bg-white px-4 py-6 sm:px-6 md:hidden shadow-xl">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex min-h-[48px] items-center rounded-lg px-3 text-base font-medium transition-colors",
                    pathname === link.href ? "bg-[#FFF1EB] text-[#E76F51]" : "text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-3 border-t border-neutral-100" />
              <div className="flex flex-col gap-1">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex min-h-[48px] items-center rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      Dashboard
                    </Link>
                    <Link href="/my-bookings" onClick={() => setMobileOpen(false)} className="flex min-h-[48px] items-center rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      My Bookings
                    </Link>
                    <Link href="/my-listings" onClick={() => setMobileOpen(false)} className="flex min-h-[48px] items-center rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      My Listings
                    </Link>
                    <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex min-h-[48px] items-center rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      Wishlist
                    </Link>
                    <button onClick={handleLogout} className="flex min-h-[48px] items-center rounded-lg px-3 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-1">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full min-h-[48px]">Log In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full">
                      <Button className="w-full min-h-[48px]">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

