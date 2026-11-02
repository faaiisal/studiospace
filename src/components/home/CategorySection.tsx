import Link from "next/link";
import { Camera, Film, Aperture, Users } from "lucide-react";

const categories = [
  { label: "Daylight Lofts", icon: Camera, href: "/studios?category=daylight-loft", count: "42" },
  { label: "Soundstages", icon: Film, href: "/studios?category=soundstage", count: "28" },
  { label: "Cycloramas", icon: Aperture, href: "/studios?category=cyclorama", count: "19" },
  { label: "Industrial", icon: Users, href: "/studios?category=industrial-warehouse", count: "35" },
];

export default function CategorySection() {
  return (
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
  );
}

