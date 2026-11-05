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
    <section className="bg-white border-y border-neutral-200 overflow-x-hidden">
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
  );
}

