"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SearchCheck,
  FileCheck,
  Truck,
  Clock3,
  Zap,
  ShieldCheck,
  ChevronDown,
  Package,
  ClipboardCheck,
  Ruler,
  Receipt,
} from "lucide-react";

const crewSteps = [
  {
    num: "01",
    icon: SearchCheck,
    title: "Discover & Verify",
    desc: "Filter by power tie-ins, exact ceiling clearance, daylight exposure orientations, and verified soundproofing STC decibel ratings.",
    footIcon: Ruler,
    foot: "Aperture & spatial blueprint data",
  },
  {
    num: "02",
    icon: FileCheck,
    title: "Reserve & Instant COI",
    desc: "Lock in shoot dates with 1-click holds or instant reserve. Upload your existing insurance or issue an instantaneous COI broker certificate.",
    footIcon: ClipboardCheck,
    foot: "Automated endorsement generation",
  },
  {
    num: "03",
    icon: Truck,
    title: "Pre-Pro Walkthrough",
    desc: "Connect directly with verified on-site managers. Schedule tech scouts, coordinate freight elevator time-slots, and arrange gear staging.",
    footIcon: Package,
    foot: "Dedicated freight loading docks",
  },
  {
    num: "04",
    icon: Clock3,
    title: "Shoot & Wrap",
    desc: "Digital keyless access codes or greeted entry. Transparent real-time overtime accounting and instant consolidated production invoicing.",
    footIcon: Receipt,
    foot: "Itemized split production billing",
  },
];

const hostSteps = [
  {
    num: "01",
    icon: SearchCheck,
    title: "List & Verify",
    desc: "Submit your space with 400+ data points. Our team performs on-site volumetric capture, power auditing, and daylight trajectory mapping.",
    footIcon: Ruler,
    foot: "400+ point spatial audit",
  },
  {
    num: "02",
    icon: FileCheck,
    title: "Calibrate Pricing",
    desc: "Set hourly, day-rate, and security deposit. Enable instant book or approval holds, define crew limits and production types allowed.",
    footIcon: Receipt,
    foot: "Dynamic yield management",
  },
  {
    num: "03",
    icon: Truck,
    title: "Manage Bookings",
    desc: "Approve holds, message production teams, share gate codes, and coordinate load-in. Calendar sync prevents double-booking.",
    footIcon: ClipboardCheck,
    foot: "Transaction-safe blocking logic",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Get Paid & Protected",
    desc: "$2M Host Guarantee, verified COI handling, and automated payouts. Editorial featuring for top-performing spaces.",
    footIcon: Package,
    foot: "$2M damage protection",
  },
];

const guaranteeStats = [
  { label: "STC 55+", desc: "Soundstage decibel isolation rating check" },
  { label: "3-Phase", desc: "Certified Camlock power tie-in verification" },
  { label: "100%", desc: "Verified freight and dock clearances" },
  { label: "$2.0M", desc: "Comprehensive host property coverage" },
];

const faqs = [
  {
    q: "What are the cancellation and postponement policies?",
    a: "Production crews can cancel within 48 hours for full refund minus processing. Holds are auto-released after 2 hours if not converted. Postponements can be rebooked within 30 days with host approval and no additional platform fee, provided notice >72 hours.",
  },
  {
    q: "What Certificate of Insurance (COI) coverage is required?",
    a: "Minimum $1M general liability, $2M aggregate, naming StudioSpace and host as additional insured. You can upload existing COI or issue an instant certificate via our integrated broker (AT-BAY) for $149/day. Automated underwriting confirms endorsement in under 2 minutes.",
  },
  {
    q: "How are production overtime fees calculated?",
    a: "Overtime is tracked in 15-minute increments beyond wrap time. Rate is 1.5x hourly rate in first 2 hours, then 2x. Real-time dashboard shows running total and grace period configurable per host. Final invoice consolidates base, overtime, and damage hold release.",
  },
  {
    q: "Can equipment rental houses deliver staging gear in advance?",
    a: "Yes. Most hosts allow gear drop 12-24h before call with prior approval. Dedicated freight time-slots can be booked as add-ons. We coordinate with major rental houses (CSC, Noir, Brooklyn Stills) for pre-staged delivery and on-site storage.",
  },
];

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"crews" | "hosts">("crews");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = activeTab === "crews" ? crewSteps : hostSteps;

  return (
    <div className="bg-[#FFFEFB]">
      {/* Hero */}
      <section className="bg-[#FBF8F6] border-b border-[#F1EBE6] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-[#E8D9D0] bg-[#FFF1EB] px-3 py-1 text-[10px] tracking-[0.15em] font-semibold text-[#8B5A44] uppercase"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#E76F51]" />
            ARCHITECTURAL PRODUCTION WORKFLOW
          </Badge>
          <h1 className="mt-6 font-[Manrope] text-[36px] md:text-[52px] font-bold leading-[0.95] tracking-[-0.03em] text-[#202124]">
            How StudioSpace Works
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-[14px] md:text-[15px] leading-6 text-neutral-600">
            The curated marketplace built for seamless spatial bookings. From verified 3-phase camlocks to daylight orientation, discover an uncompromising standard for visionary creative shoots.
          </p>

          {/* Toggle */}
          <div className="mx-auto mt-8 inline-flex rounded-full border border-[#E8D9D0] bg-[#F8F1ED] p-1.5">
            <button
              onClick={() => setActiveTab("crews")}
              className={`rounded-full px-5 py-2 text-[12px] font-medium transition-all ${
                activeTab === "crews"
                  ? "bg-white shadow-sm text-[#202124] border border-[#E7E5E0]"
                  : "text-neutral-500 hover:text-[#202124]"
              }`}
            >
              For Production Crews / Creatives
            </button>
            <button
              onClick={() => setActiveTab("hosts")}
              className={`rounded-full px-5 py-2 text-[12px] font-medium transition-all ${
                activeTab === "hosts"
                  ? "bg-white shadow-sm text-[#202124] border border-[#E7E5E0]"
                  : "text-neutral-500 hover:text-[#202124]"
              }`}
            >
              For Studio Hosts
            </button>
          </div>
        </div>
      </section>

      {/* Crew Journey */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        {/* Journey header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EDE9E3] pb-6">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#E76F51] font-semibold uppercase">
              CREW JOURNEY
            </div>
            <h2 className="mt-2 font-[Manrope] text-[22px] md:text-[26px] font-bold tracking-tight text-[#202124]">
              Four steps from concept to wrap
            </h2>
          </div>
          <Card className="border-[#E8D9D0] bg-[#FFF8F4] rounded-md shadow-none w-fit">
            <CardContent className="p-0 px-3 py-2 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#E76F51]" />
              <span className="text-[11px] font-medium text-[#202124]">Automated COI Underwriting Included</span>
            </CardContent>
          </Card>
        </div>

        {/* 4 Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <Card key={s.num + s.title} className="border-[#E7E5E0] bg-white rounded-xl">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="h-9 w-9 rounded-md bg-[#FFF1EB] border border-[#F9D8C0] flex items-center justify-center text-[#E76F51]">
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-[Manrope] text-[20px] font-bold text-[#EDE9E3]">{s.num}</span>
                </div>
                <h3 className="mt-5 text-[14px] font-semibold text-[#202124]">{s.title}</h3>
                <p className="mt-2 text-[12px] leading-5 text-neutral-600 flex-1">{s.desc}</p>
                <div className="mt-6 flex items-center gap-1.5 border-t border-[#F1F0EC] pt-3 text-[10px] text-neutral-500">
                  <s.footIcon className="h-3 w-3 text-[#E76F51]" />
                  {s.foot}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Spec Sheets Banner */}
        <Card className="mt-6 border-[#E8D9D0] bg-[#FFFEFB] rounded-xl">
          <CardContent className="p-0 px-5 py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 shrink-0 rounded-md bg-[#FFF1EB] border border-[#F9D8C0] flex items-center justify-center text-[#E76F51]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#202124]">Standardized Production Spec Sheets</h4>
                <p className="mt-1 text-[11px] leading-5 text-neutral-600 max-w-[680px]">
                  Every listed stage includes tested power load capacity (100A–400A 3-Phase Camlock), sound ratings, and ceiling load capacities.
                </p>
              </div>
            </div>
            <Link href="/studios" className="shrink-0">
              <Button variant="outline" size="sm" className="rounded-full text-[11px] h-8 px-4">
                Browse Verified Stages
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Guarantee */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-6">
        <div className="rounded-xl bg-[#242629] px-6 py-8 md:px-10 md:py-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(600px_at_10%_0%,rgba(231,111,81,0.12),transparent)]" />
          <div className="relative">
            <Badge className="bg-white/10 border-white/10 text-white/70 text-[9px] tracking-[0.2em] uppercase font-semibold rounded-full">
              <ShieldCheck className="h-3 w-3 mr-1" /> THE STUDIOSPACE GUARANTEE
            </Badge>
            <h2 className="mt-6 font-[Manrope] text-[26px] md:text-[32px] font-bold leading-[1.05] tracking-tight max-w-[420px]">
              Engineered for seamless production days.
            </h2>
            <p className="mt-4 text-[12px] leading-6 text-white/60 max-w-[420px]">
              Every stage featured on StudioSpace undergoes our strict 14-point physical spatial audit before onboarding. We certify load capacities, ambient sound attenuation, and power compliance so your crew never encounters unexpected surprises on set.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            {guaranteeStats.map((g) => (
              <div key={g.label} className="rounded-lg bg-white/[0.06] border border-white/10 p-4">
                <p className="text-[16px] font-bold tracking-tight text-white">{g.label}</p>
                <p className="mt-1 text-[10px] leading-4 text-white/50">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="text-center">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#E76F51] font-semibold">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="mt-3 font-[Manrope] text-[28px] md:text-[32px] font-bold tracking-tight text-[#202124]">
            Everything you need to know
          </h2>
          <p className="mt-2 text-[12px] text-neutral-600">
            Logistical specifics, booking terms, and spatial expectations.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card
                key={idx}
                className="border-[#E7E5E0] rounded-lg cursor-pointer hover:border-[#D8D2CC] transition-colors"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-5 py-4">
                    <h3 className="text-[13px] font-medium text-[#202124] pr-4">{f.q}</h3>
                    <ChevronDown
                      className={`h-4 w-4 text-neutral-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                  {isOpen && (
                    <div className="px-5 pb-4 text-[12px] leading-6 text-neutral-600 border-t border-[#F1F0EC] pt-3">
                      {f.a}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="rounded-xl border border-[#E8D9D0] bg-[#FFFEFB] px-6 py-12 md:py-16 text-center">
          <h2 className="font-[Manrope] text-[26px] md:text-[30px] font-bold tracking-tight text-[#202124]">
            Ready to elevate your next shoot?
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[13px] leading-5 text-neutral-600">
            Join thousands of directors, photographers, and spatial architects producing extraordinary work worldwide.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/studios">
              <Button className="rounded-full h-9 px-6 text-[12px] bg-[#E76F51] hover:bg-[#d65a3f]">
                Explore Studios
              </Button>
            </Link>
            <Link href="/add-studio">
              <Button className="rounded-full h-9 px-6 text-[12px]" variant="secondary">
                List Your Space
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
