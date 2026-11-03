import { Suspense } from "react";
import ExploreClient from "./ExploreClient";
import { Badge } from "@/components/ui/badge";

export default function ExploreStudiosPage() {
  return (
    <div className="bg-[#FBF8F5] min-h-screen">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-wide">
              <Badge className="bg-[#D1FAE5] text-[#065F46] border-0 rounded-full text-[10px] px-2.5">MARKETPLACE DIRECTORY</Badge>
              <span className="text-neutral-400">/</span>
              <span className="inline-flex items-center gap-1 text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Verified Acoustic & Daylight Certified
              </span>
            </div>
            <h1 className="mt-3 font-[Manrope] text-[26px] md:text-[30px] font-bold tracking-tight text-[#202124]">
              Explore Creative Spaces
            </h1>
            <p className="mt-1 text-[13px] text-neutral-600">Find the right environment for your next shoot, recording, or production.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="rounded-full bg-white text-[11px]">Live Feed (42)</Badge>
            <Badge variant="outline" className="rounded-full bg-white text-[11px]">Loading Skeleton</Badge>
            <Badge variant="outline" className="rounded-full bg-white text-[11px]">Zero Results State</Badge>
          </div>
        </div>

        <Suspense fallback={<div className="h-32 animate-pulse bg-neutral-100 rounded-xl" />}>
          <ExploreClient />
        </Suspense>
      </div>
    </div>
  );
}
