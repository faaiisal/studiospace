"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StudioCard from "@/components/common/StudioCard";
import { StudioGridSkeleton } from "@/components/common/LoadingSkeleton";
import { studioService } from "@/lib/api";
import { Studio } from "@/types";
import { Search, MapPin, Users, Calendar, Shield, Star, Camera, Film, Music, Aperture } from "lucide-react";

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
        // Fallback mock for visual dev
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Slider */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-neutral-900">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.image} alt={slide.headline} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-20 md:px-12">
          <div className="max-w-3xl">
            <h1 className="font-[Manrope] text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl md:leading-[1.1]">
              {heroSlides[currentSlide].headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-white/80">
              {heroSlides[currentSlide].sub}
            </p>

            {/* Quick Search */}
            <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-3 px-3">
                <MapPin size={18} className="text-neutral-400" />
                <input
                  placeholder="Neighborhood, City, or Zip"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
              </div>
              <div className="hidden h-6 w-px bg-neutral-200 md:block" />
              <div className="flex flex-1 items-center gap-3 px-3">
                <Calendar size={18} className="text-neutral-400" />
                <span className="text-sm text-neutral-500">Shoot Date</span>
              </div>
              <div className="hidden h-6 w-px bg-neutral-200 md:block" />
              <div className="flex flex-1 items-center gap-3 px-3">
                <Users size={18} className="text-neutral-400" />
                <span className="text-sm text-neutral-500">Crew Size</span>
              </div>
              <Link href={`/studios${searchLocation ? `?location=${encodeURIComponent(searchLocation)}` : ""}`}>
                <Button size="lg" className="w-full md:w-auto gap-2">
                  <Search size={16} /> Search Studios
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60">
              <span>✓ 100% On-Site Ground Verified</span>
              <span>• Audited 3-Phase Camlock</span>
              <span>• Real Daylight Exposure</span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Studios */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-[Manrope] text-3xl font-semibold tracking-tight">Featured Production Spaces</h2>
            <p className="mt-2 text-sm text-neutral-600">High-demand verified studios with premium technical specs</p>
          </div>
          <Link href="/studios" className="hidden md:block">
            <Button variant="outline">Explore All</Button>
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <StudioGridSkeleton count={6} />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Fallback demo cards if no data */}
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
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <h2 className="font-[Manrope] text-2xl font-semibold">Production Categories</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href} className="group rounded-2xl border border-[#E7E5E0] p-6 hover:border-[#202124] transition-colors">
                <cat.icon className="h-6 w-6 text-[#E76F51]" />
                <h3 className="mt-4 font-semibold">{cat.label}</h3>
                <p className="mt-1 text-sm text-neutral-500">{cat.count} verified spaces</p>
                <span className="mt-4 inline-flex text-sm font-medium group-hover:text-[#E76F51]">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-[Manrope] text-3xl font-semibold">How Booking Works</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">From discovery to call sheet in four deliberate steps.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { step: "01", title: "Discover & Filter", desc: "Search by daylight orientation, power specs, ceiling height, and acoustic rating." },
              { step: "02", title: "Verify & Inspect", desc: "High-res gallery, CAD floor plans, and electrical rigging sheets." },
              { step: "03", title: "Reserve & Insure", desc: "Instant booking, COI verification, and security deposit handling." },
              { step: "04", title: "Create & Wrap", desc: "Gate codes, tech contacts, and post-shoot invoicing." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="font-[Manrope] text-3xl font-bold text-[#E7E5E0]">{item.step}</span>
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Guarantee */}
      <section className="bg-[#202124] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex gap-4">
            <Shield className="h-10 w-10 text-[#E76F51] shrink-0" />
            <div>
              <h3 className="text-xl font-semibold">Host Guarantee & Creator Insurance</h3>
              <p className="mt-2 max-w-2xl text-sm text-white/70">$2M damage protection, verified COI handling, and 24/7 production support. Every studio ground-verified.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white text-black hover:bg-neutral-100 border-white">Learn More</Button>
            <Link href="/add-studio">
              <Button>List Your Space</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="rounded-[24px] bg-[#F1F0EC] p-12 md:p-16 text-center">
          <h2 className="font-[Manrope] text-3xl md:text-4xl font-semibold">Join the Future of Creative Production</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-600">Thousands of filmmakers, photographers, and brands find their perfect space daily.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/studios"><Button size="lg">Explore Available Studios</Button></Link>
            <Link href="/add-studio"><Button size="lg" variant="outline" className="bg-white">List a Workspace</Button></Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold">Get Studio Drops & Editorial Stories</h3>
            <p className="text-sm text-neutral-600">New verified spaces weekly, production insights, and technical spotlights.</p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <input placeholder="Work email" className="flex-1 rounded-lg border border-[#E7E5E0] px-4 py-3 text-sm outline-none focus:border-[#202124]" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

