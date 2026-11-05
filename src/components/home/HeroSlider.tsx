"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Calendar } from "lucide-react";
import { handleImageError } from "@/lib/utils";

const slides = [
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

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const id = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] sm:h-[75vh] sm:min-h-[550px] md:h-[85vh] md:min-h-[600px] overflow-hidden bg-neutral-900">
      {slides.map((slide, idx) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`} aria-hidden={idx !== current}>
          <img src={slide.image} alt={slide.headline} className="h-full w-full object-cover" onError={handleImageError} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-16 md:px-8 lg:px-12 md:py-20">
        <div className="max-w-3xl">
          <h1 className="font-[Manrope] text-[26px] sm:text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white break-words">{slides[current].headline}</h1>
          <p className="mt-4 max-w-2xl text-[14px] sm:text-base md:text-lg leading-6 sm:leading-7 text-white/80 break-words">{slides[current].sub}</p>

          <div className="mt-6 sm:mt-10 flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-3 shadow-xl md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 sm:gap-3 px-2 sm:px-3 min-w-0">
              <MapPin size={18} className="text-neutral-400 shrink-0" />
              <input
                placeholder="Neighborhood, City, or Zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
            <Link href={`/studios${location ? `?location=${encodeURIComponent(location)}` : ""}`} className="w-full md:w-auto shrink-0">
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

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === current}
            className={`h-2 min-h-[8px] min-w-[8px] rounded-full transition-all ${idx === current ? "w-8 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}

