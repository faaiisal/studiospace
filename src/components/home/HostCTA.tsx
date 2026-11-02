import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function HostCTA() {
  return (
    <>
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
    </>
  );
}

