
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-12">
      <h1 className="font-[Manrope] text-4xl font-bold">How It Works</h1>
      <p className="mt-4 text-neutral-600">StudioSpace connects creators with verified architectural production spaces through a deliberate, technical workflow.</p>

      <div className="mt-12 space-y-12">
        {[
          { step: "01", title: "Discover & Filter by Physics", desc: "Search by daylight orientation, power amperage (100A/200A/400A 3-phase camlock), ceiling height, STC sound rating, freight elevator dimensions, and location. Every filter maps to real spatial data audited on-site." },
          { step: "02", title: "Inspect Architectural Specs", desc: "View 4K galleries, CAD floor plans, electrical rigging sheets, pipe grid loads, and truck load-in instructions. Hosts provide ground-verified photos, not stock imagery." },
          { step: "03", title: "Reserve with Insurance Verification", desc: "Select call/wrap times, crew size, production type. Server calculates price (hourly × duration + security deposit). Upload COI or use on-file certificate. Blocking logic prevents double-booking with transaction-safe overlap check." },
          { step: "04", title: "Shoot & Wrap with Support", desc: "Receive gate codes, tech contact, call sheet. $2M host guarantee, 24/7 support. Post-shoot invoicing and review system maintains marketplace integrity." },
        ].map((s) => (
          <div key={s.step} className="flex gap-6">
            <span className="font-[Manrope] text-5xl font-bold text-[#E7E5E0]">{s.step}</span>
            <div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex gap-3">
        <Link href="/studios"><Button>Explore Studios</Button></Link>
        <Link href="/add-studio"><Button variant="outline">List Your Space</Button></Link>
      </div>
    </div>
  );
}