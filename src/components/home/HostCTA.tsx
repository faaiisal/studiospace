import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function HostCTA() {
  return (
    <>
      <section className="bg-[#202124] text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-16 lg:py-20 flex flex-col md:flex-row md:items-center items-start justify-between gap-6 sm:gap-8">
          <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-[#E76F51] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-[18px] sm:text-xl font-semibold break-words leading-tight">Host Guarantee & Creator Insurance</h3>
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
    </>
  );
}

