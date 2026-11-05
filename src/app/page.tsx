"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudioCard from "@/components/common/StudioCard";
import { StudioGridSkeleton } from "@/components/common/LoadingSkeleton";
import { studioService } from "@/lib/api";
import { Studio } from "@/types";
import { Search, MapPin, Users, Calendar, Shield, Camera, Film, Aperture } from "lucide-react";
import { handleImageError } from "@/lib/utils";

// Hero slider data
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    headline: "Where Visionary Productions Find Architectural Precision.",
    sub: "Curated soundstages, cycloramas, and daylight lofts verified for electrical Camlock specs and acoustics.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&q=80",
    headline: "Daylight Studios Designed for Natural Light Mastery.",
    sub: "North-facing windows, 18ft clear height, and STC 55+ isolation for flawless production.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&q=80",
    headline: "Industrial Lofts Built for Creative Production.",
    sub: "Verified 3-phase power, freight elevators, and drive-in access for large-scale shoots.",
  },
];

const categories = [
  { label: "Daylight Lofts", icon: Camera, href: "/studios?category=daylight-loft", count: "42" },
  { label: "Soundstages", icon: Film, href: "/studios?category=soundstage", count: "28" },
  { label: "Cycloramas", icon: Aperture, href: "/studios?category=cyclorama", count: "19" },
  { label: "Industrial", icon: Users, href: "/studios?category=industrial-warehouse", count: "35" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await studioService.getFeatured(6);
        setFeatured(res.data as any);
      } catch (err) {
        console.error("Failed to fetch featured", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Slider */}
      <section className="relative h-[70vh] min-h-[500px] sm:h-[75vh] sm:min-h-[550px] md:h-[85vh] md:min-h-[600px] overflow-hidden bg-neutral-900">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== currentSlide}
          >
            <img src={slide.image} alt={slide.headline} className="h-full w-full object-cover" onError={handleImageError} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-16 md:px-8 lg:px-12 md:py-20">
          <div className="max-w-3xl">
            <h1 className="font-[Manrope] text-[26px] font-semibold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl md:leading-[1.1] break-words">
              {heroSlides[currentSlide].headline}
            </h1>
            <p className="mt-4 max-w-2xl text-[14px] sm:text-base md:text-lg leading-6 sm:leading-7 text-white/80 break-words">
              {heroSlides[currentSlide].sub}
            </p>

            {/* Quick Search */}
            <div className="mt-6 sm:mt-10 flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-3 shadow-xl md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-2 sm:gap-3 px-2 sm:px-3 min-w-0">
                <MapPin size={18} className="text-neutral-400 shrink-0" />
                <input
                  placeholder="Neighborhood, City, or Zip"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full min-w-0 bg-transparent text-[14px] sm:text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Location search"
                />
              </div>
              <div className="hidden h-6 w-px bg-neutral-200 md:block" />
              <div className="hidden md:flex flex-1 items-center gap-3 px-3 min-w-0">
                <Calendar size={18} className="text-neutral-400 shrink-0" />
                <span className="text-sm text-neutral-500 truncate">Shoot Date</span>
              </div>
              <div className="hidden h-6 w-px bg-neutral-200 md:block" />
              <div className="hidden md:flex flex-1 items-center gap-3 px-3 min-w-0">
                <Users size={18} className="text-neutral-400 shrink-0" />
                <span className="text-sm text-neutral-500 truncate">Crew Size</span>
              </div>
              <Link href={`/studios${searchLocation ? `?location=${encodeURIComponent(searchLocation)}` : ""}`} className="w-full md:w-auto shrink-0">
                <Button size="lg" className="w-full md:w-auto gap-2 min-h-[44px]">
                  <Search size={16} /> Search Studios
                </Button>
              </Link>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs text-white/60">
              <span>✓ 100% On-Site Ground Verified</span>
              <span>• Audited 3-Phase Camlock</span>
              <span>• Real Daylight Exposure</span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentSlide}
              className={`h-2 rounded-full transition-all min-h-[8px] min-w-[8px] ${idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Studios */}
      <section className="mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-20 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-[Manrope] text-[24px] sm:text-[28px] md:text-3xl font-semibold tracking-tight break-words">Featured Production Spaces</h2>
            <p className="mt-2 text-[13px] sm:text-sm text-neutral-600 break-words">High-demand verified studios with premium technical specs</p>
          </div>
          <Link href="/studios" className="hidden md:block shrink-0">
            <Button variant="outline" className="min-h-[44px]">Explore All</Button>
          </Link>
        </div>

        <div className="mt-6 sm:mt-8">
          {loading ? (
            <StudioGridSkeleton count={6} />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  _id: "1",
                  title: "The Foundry Daylight Cyclorama",
                  location: "Greenpoint, Brooklyn",
                  hourlyRate: 185,
                  securityDeposit: 500,
                  images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
                  amenities: ["18ft Clear", "200A 3-Phase", "Freight"],
                  rating: 4.98,
                  reviewCount: 34,
                  category: "cyclorama",
                },
                {
                  _id: "2",
                  title: "North Light Industrial Loft",
                  location: "Arts District, LA",
                  hourlyRate: 220,
                  securityDeposit: 750,
                  images: ["https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800"],
                  amenities: ["24ft Ceiling", "400A Camlock", "Drive-In"],
                  rating: 4.95,
                  reviewCount: 27,
                  category: "daylight-loft",
                },
                {
                  _id: "3",
                  title: "Soundstage A – Certified Acoustic",
                  location: "Shoreditch, London",
                  hourlyRate: 350,
                  securityDeposit: 1000,
                  images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"],
                  amenities: ["STC 55+", "Pipe Grid", "Green Room"],
                  rating: 5.0,
                  reviewCount: 19,
                  category: "soundstage",
                },
              ].map((s: any) => (
                <StudioCard key={s._id} studio={s as any} />
              ))}
            </div>
          )}
          <div className="mt-6 md:hidden">
            <Link href="/studios" className="block">
              <Button variant="outline" className="w-full min-h-[44px]">Explore All Studios</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-16">
          <h2 className="font-[Manrope] text-[20px] sm:text-2xl font-semibold break-words">Production Categories</h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href} className="group rounded-xl sm:rounded-2xl border border-[#E7E5E0] p-5 sm:p-6 hover:border-[#202124] transition-colors min-w-0">
                <cat.icon className="h-6 w-6 text-[#E76F51] shrink-0" />
                <h3 className="mt-4 font-semibold break-words text-[15px] sm:text-base">{cat.label}</h3>
                <p className="mt-1 text-sm text-neutral-500">{cat.count} verified spaces</p>
                <span className="mt-4 inline-flex text-sm font-medium group-hover:text-[#E76F51]">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-20 lg:py-24">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 lg:gap-12">
          <div className="md:col-span-1">
            <h2 className="font-[Manrope] text-[24px] sm:text-3xl font-semibold break-words">How Booking Works</h2>
            <p className="mt-3 sm:mt-4 text-sm leading-6 text-neutral-600 break-words">From discovery to call sheet in four deliberate steps.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            {[
              { step: "01", title: "Discover & Filter", desc: "Search by daylight orientation, power specs, ceiling height, and acoustic rating." },
              { step: "02", title: "Verify & Inspect", desc: "High-res gallery, CAD floor plans, and electrical rigging sheets." },
              { step: "03", title: "Reserve & Insure", desc: "Instant booking, COI verification, and security deposit handling." },
              { step: "04", title: "Create & Wrap", desc: "Gate codes, tech contacts, and post-shoot invoicing." },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 sm:gap-4 min-w-0">
                <span className="font-[Manrope] text-2xl sm:text-3xl font-bold text-[#E7E5E0] shrink-0">{item.step}</span>
                <div className="min-w-0">
                  <h4 className="font-semibold break-words text-[14px] sm:text-[15px]">{item.title}</h4>
                  <p className="mt-1 text-[13px] sm:text-sm text-neutral-600 break-words leading-5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Guarantee */}
      <section className="bg-[#202124] text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-16 lg:py-20 flex flex-col md:flex-row md:items-center items-start justify-between gap-6 sm:gap-8">
          <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-[#E76F51] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-[18px] sm:text-xl font-semibold break-words">Host Guarantee & Creator Insurance</h3>
              <p className="mt-2 max-w-2xl text-[13px] sm:text-sm text-white/70 break-words leading-5">$2M damage protection, verified COI handling, and 24/7 production support. Every studio ground-verified.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
            <Button variant="outline" className="bg-white text-black hover:bg-neutral-100 border-white w-full sm:w-auto min-h-[44px]">Learn More</Button>
            <Link href="/add-studio" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-[44px]">List Your Space</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-20 lg:py-24">
        <div className="rounded-[16px] sm:rounded-[24px] bg-[#F1F0EC] p-6 sm:p-10 md:p-12 lg:p-16 text-center">
          <h2 className="font-[Manrope] text-[24px] sm:text-3xl md:text-4xl font-semibold break-words leading-tight">Join the Future of Creative Production</h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-[13px] sm:text-sm text-neutral-600 break-words leading-5">Thousands of filmmakers, photographers, and brands find their perfect space daily.</p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
            <Link href="/studios" className="w-full sm:w-auto"><Button size="lg" className="w-full sm:w-auto min-h-[48px]">Explore Available Studios</Button></Link>
            <Link href="/add-studio" className="w-full sm:w-auto"><Button size="lg" variant="outline" className="bg-white w-full sm:w-auto min-h-[48px]">List a Workspace</Button></Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 md:py-12 flex flex-col md:flex-row md:items-center items-start justify-between gap-5 sm:gap-6">
          <div className="min-w-0">
            <h3 className="font-semibold break-words text-[15px] sm:text-base">Get Studio Drops & Editorial Stories</h3>
            <p className="text-[13px] sm:text-sm text-neutral-600 break-words leading-5 mt-1">New verified spaces weekly, production insights, and technical spotlights.</p>
          </div>
          <div className="flex w-full max-w-md gap-2 flex-col xs:flex-row sm:flex-row">
            <input placeholder="Work email" className="flex-1 rounded-lg border border-[#E7E5E0] px-4 py-3 text-[14px] sm:text-sm outline-none focus:border-[#202124] min-h-[48px] min-w-0" aria-label="Email for newsletter" />
            <Button className="shrink-0 min-h-[48px] w-full xs:w-auto sm:w-auto">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

