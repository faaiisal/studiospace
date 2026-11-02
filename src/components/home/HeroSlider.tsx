"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Calendar } from "lucide-react";

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
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-neutral-900">
      {slides.map((slide, idx) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.headline} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-20 md:px-12">
        <div className="max-w-3xl">
          <h1 className="font-[Manrope] text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl md:leading-[1.1]">{slides[current].headline}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-white/80">{slides[current].sub}</p>

          <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 px-3">
              <MapPin size={18} className="text-neutral-400" />
              <input
                placeholder="Neighborhood, City, or Zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
            <Link href={`/studios${location ? `?location=${encodeURIComponent(location)}` : ""}`}>
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

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 rounded-full transition-all ${idx === current ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}

