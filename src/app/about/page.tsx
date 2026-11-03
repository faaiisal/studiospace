import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Ruler,
  Zap,
  ShieldCheck,
  Building2,
  Truck,
  Users2,
  LayoutDashboard,
  Quote,
} from "lucide-react";

const stats = [
  {
    label: "SPATIAL PORTFOLIO",
    value: "1,200+",
    desc: "Verified sites across 18 creative capitals",
  },
  {
    label: "CREATIVE ECONOMY",
    value: "$18M+",
    desc: "Paid out directly to independent space operators",
  },
  {
    label: "RELIABILITY RATE",
    value: "99.4%",
    desc: "On-time access and true-to-spec fulfilment",
  },
  {
    label: "PRODUCTION VOLUME",
    value: "45K+",
    desc: "Commercial, editorial & cinema hours booked",
  },
];

const philosophy = [
  {
    icon: Ruler,
    title: "Truth in Spatial Physics",
    desc: "We provide verifiable physical truth in our architectural documentation. Every listed property undergoes physical volumetric capture, genuine clearance measurements, true phase-type pipe grids, true floor load-bearing capacities, and guaranteed clear shooting distances.",
  },
  {
    icon: Zap,
    title: "The High-Capacity Standard",
    desc: "Nothing stops a commercial shoot faster than an untapped 20A residential breaker masquerading as a commercial board. All spaces list verifiable electrical documents and comprehensive electrical model sheets: 100A, 200A, or 400A 3-phase Camlock availability, isolated clean audio runs, and verified distribution boxes.",
  },
  {
    icon: ShieldCheck,
    title: "Empowering Spatial Guardians",
    desc: "We exist to sustain and celebrate independent space custodians — former textile warehouses, industrial lofts, family-run studios. We provide free 1099 legal understanding about ownership, contribute to preservation stories, and human-centered certification for insurance, commerce building docs, and insurance underwriting. Curation, not extraction, permitted.",
  },
];

const pillars = [
  {
    id: "PILLAR 01",
    icon: Building2,
    title: "Spatial Integrity & Specs",
    desc: "Never fudge square ceiling heights or wall-to-wall loads. Good riddance. We audit 400+ data points per space.",
  },
  {
    id: "PILLAR 02",
    icon: Truck,
    title: "Frictionless Logistics",
    desc: "Direct calendar holds, digital COI handling, freight elevator specs, door-by-door access data — call sheet ready.",
  },
  {
    id: "PILLAR 03",
    icon: Users2,
    title: "Visionary Community",
    desc: "A closed-loop network of vetted production designers, art directors, and architectural technicians sharing rigging pre-sets.",
  },
  {
    id: "PILLAR 04",
    icon: LayoutDashboard,
    title: "Host Stewardship",
    desc: "Up to $2,000,000 damage protection, editorial featured placements, and automated ISC lock — we clock better deposits.",
  },
];

const team = [
  {
    name: "Elisa Rostova",
    role: "Founder & Head of Curation",
    location: "NYC · PARIS",
    bio: "Former architectural advisor at “Habitat” with 9 years curating brutalist conversions for Vogue productions. North American and European capitals.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=700&fit=crop",
  },
  {
    name: "Marcus Weaver",
    role: "Head of Spatial Engineering",
    location: "LA · BERLIN",
    bio: "MTS-credentialed physical plant architect. Mapped technical verification process: pipe-grid alignment, sealing benchmarks, and Camlock certifications.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop",
  },
  {
    name: "Sophie Baptiste",
    role: "Head of Trust & Operations",
    location: "LONDON · LA",
    bio: "15 years managing top-tier agency shoots for luxury programs. Partner relations, concierge booking desks, and insurance underwriting.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=700&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FFFEFB]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#E76F51] font-semibold uppercase">
              <span className="h-px w-6 bg-[#E76F51]" /> A MANIFESTO & ARCHITECTURE
            </div>
            <h1 className="mt-4 font-[Manrope] text-[32px] md:text-[44px] font-bold leading-[0.95] tracking-[-0.03em] text-[#202124]">
              Built by Filmmakers and Architects for Visionary Productions.
            </h1>
            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-neutral-600">
              StudioSpace was founded on an unrelenting principle: creative ambition should never be compromised by logistical guesswork. We bridge the critical gap between raw architectural brilliance and rigorous spatial physics.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#EDE9E3] pt-6">
              {[
                "100% On-Site Ground Verified",
                "Audited 3-Phase Camlock Drops",
                "Real Daylight Solar Tracked",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-[11px] font-medium text-[#202124]"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#202124] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right Quote Card */}
          <Card className="border-[#E7E5E0] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-[10px] tracking-widest text-neutral-500 uppercase">
                <span>VISION 2024</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SITE-VERIFIED
                </span>
              </div>
              <div className="mt-6 relative">
                <Quote className="absolute -top-2 -left-1 h-8 w-8 text-[#F1F0EC]" />
                <p className="relative text-[13px] leading-6 text-[#202124]">
                  &quot;Every stage in our catalog is physically audited for structural rigging loads, electrical distribution integrity, and genuine architectural integrity.&quot;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-[#F1F0EC] pt-4">
                <img
                  src="https://i.pravatar.cc/100?img=32"
                  alt="Team"
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-[11px] font-semibold text-[#202124]">StudioSpace Spatial Team</p>
                  <p className="text-[10px] text-neutral-500">SYSTEM · 400+ POINT VERIFICATION</p>
                </div>
                <div className="ml-auto h-6 w-6 rounded-full border border-[#E7E5E0] flex items-center justify-center">
                  <span className="h-1.5 w-1.5 bg-[#202124] rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Gallery */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          {/* Main Browser Mock */}
          <div className="overflow-hidden rounded-xl border border-[#E7E5E0] bg-white shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-[#E7E5E0] bg-[#FAFAF8] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
              <span className="ml-4 text-[11px] text-neutral-500">StudioSpace — About Us</span>
            </div>
            <div className="relative aspect-[16/9] bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
                alt="Daylight Studio"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 rounded-md bg-[#202124]/90 px-3 py-1 text-[10px] text-white backdrop-blur">
                Stage 14: The Foundry Daylight Cyclorama — Greenpoint, BK
              </div>
            </div>
          </div>

          {/* Side Image */}
          <div className="relative overflow-hidden rounded-xl border border-[#E7E5E0] bg-white">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
              alt="Team inspecting"
              className="h-full w-full object-cover lg:aspect-[4/3]"
            />
            <div className="absolute bottom-3 left-3 right-3 rounded-md bg-[#202124]/85 px-3 py-1.5 text-[10px] text-white backdrop-blur">
              Ground Verification: Foundry Owners Audit & Rigging Testing
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#EDE9E3] bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F1F0EC]">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-8 md:py-10">
              <p className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase">{s.label}</p>
              <p className="mt-2 font-[Manrope] text-[28px] font-bold tracking-tight text-[#202124]">{s.value}</p>
              <p className="mt-1 text-[11px] leading-4 text-neutral-500 max-w-[180px]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-[10px] tracking-[0.2em] text-[#E76F51] font-semibold uppercase">
              OUR PHILOSOPHY
            </div>
            <h2 className="mt-3 font-[Manrope] text-[30px] font-bold leading-[1.1] tracking-tight text-[#202124]">
              Production shouldn&apos;t feel like a leap of faith.
            </h2>
            <p className="mt-6 text-[13px] leading-6 text-neutral-600">
              Before StudioSpace, production designers, producers, and location managers risked blind bookings: misleading lens angles, creative photoshop, confusing electrical panels, and questionable commercial lease agreements.
            </p>
          </div>

          <div className="lg:col-span-8 grid gap-5">
            {philosophy.map((item) => (
              <Card key={item.title} className="border-[#EDE9E3] bg-[#FFFEFB]">
                <CardContent className="p-6 flex gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-md bg-[#FDF0E6] border border-[#F9D8C0] flex items-center justify-center text-[#E76F51]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#202124]">{item.title}</h3>
                    <p className="mt-2 text-[12px] leading-6 text-neutral-600">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Four Cornerstones */}
      <section className="bg-[#F7F3F0] border-y border-[#EDE9E3] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-block text-[10px] tracking-[0.2em] uppercase text-neutral-500">
              INSTITUTIONAL PILLARS
            </div>
            <h2 className="mt-3 font-[Manrope] text-[32px] font-bold tracking-tight text-[#202124]">
              Our Four Cornerstones
            </h2>
            <p className="mt-3 text-[13px] text-neutral-600">
              The non-negotiable protocols behind every shoot confirmed on our platform.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <Card key={p.id} className="bg-white border-[#E7E5E0]">
                <CardContent className="p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1EB] border border-[#FAD9C9] text-[#E76F51]">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-[13px] font-semibold text-[#202124] leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-5 text-neutral-600">{p.desc}</p>
                  <div className="mt-6 text-[9px] tracking-[0.15em] text-neutral-500 border-t border-[#F1F0EC] pt-4">
                    {p.id}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#E76F51] uppercase font-semibold">
              THE PEOPLE BEHIND THE PLATFORM
            </div>
            <h2 className="mt-2 font-[Manrope] text-[28px] font-bold tracking-tight text-[#202124]">
              Curators & Engineers
            </h2>
          </div>
          <p className="max-w-[320px] text-[12px] leading-5 text-neutral-600 md:text-right">
            Our multidisciplinary leadership pairs decade-long architectural restoration backgrounds with seasoned commercial line production expertise.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="group">
              <div className="overflow-hidden rounded-xl bg-neutral-100 aspect-[3/3.5]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[14px] font-semibold text-[#202124]">{member.name}</h3>
                  <span className="text-[9px] tracking-widest text-neutral-500 uppercase">
                    {member.location}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-[#E76F51]">{member.role}</p>
                <p className="mt-2 text-[11px] leading-5 text-neutral-600 line-clamp-3">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted By */}
      <section className="border-y border-[#EDE9E3] bg-[#FBFAF7]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 whitespace-nowrap">
            Trusted by Visionary Production Teams Worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-semibold tracking-[0.05em] text-neutral-700">
            <span className="font-[Manrope] font-bold tracking-[0.15em]">VOGUE</span>
            <span className="font-bold">A24</span>
            <span className="font-semibold">Apple</span>
            <span className="font-[Manrope]">Kinfolk</span>
            <span className="text-[11px]">Architectural Digest</span>
            <span className="font-bold tracking-[0.2em]">MONOCLE</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
        <div className="rounded-[16px] bg-[#202124] px-8 py-10 md:px-12 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(600px_at_20%_0%,rgba(231,111,81,0.15),transparent)]" />
          <div className="relative max-w-3xl">
            <Badge variant="outline" className="border-white/20 bg-white/10 text-[9px] tracking-[0.2em] text-white/70">
              CLAIM YOUR NEXT PRODUCTION
            </Badge>
            <h2 className="mt-6 font-[Manrope] text-[28px] md:text-[36px] font-bold leading-[1.05] tracking-tight text-white max-w-[420px]">
              Join the Future of Creative Production.
            </h2>
            <p className="mt-4 text-[13px] leading-6 text-white/60 max-w-[420px]">
              Reserve architectural, camera-ready spaces with verified electrical grids, genuine daylight trajectories, and instant insurance coverage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/studios">
                <Button size="lg" className="bg-[#E76F51] hover:bg-[#d65c40] text-white h-10 px-6 text-[13px]">
                  Explore Available Studios
                </Button>
              </Link>
              <Link href="/add-studio">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/15 h-10 px-6 text-[13px]"
                >
                  Become a Studio Host
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
