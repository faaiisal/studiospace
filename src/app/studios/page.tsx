import { Suspense } from "react";
import ExploreClient from "./ExploreClient";
import { Badge } from "@/components/ui/badge";

export default function ExploreStudiosPage() {
  return (
    <div className="bg-[#FBF8F5] min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] tracking-wide">
              <Badge className="bg-[#D1FAE5] text-[#065F46] border-0 rounded-full text-[10px] px-2.5 shrink-0">MARKETPLACE DIRECTORY</Badge>
              <span className="text-neutral-400 hidden sm:inline">/</span>
              <span className="inline-flex items-center gap-1 text-neutral-500 text-[10px] sm:text-[11px] break-words">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" /> Verified Acoustic & Daylight Certified
              </span>
            </div>
            <h1 className="mt-2 sm:mt-3 font-[Manrope] text-[22px] sm:text-[26px] md:text-[30px] font-bold tracking-tight text-[#202124] break-words leading-tight">
              Explore Creative Spaces
            </h1>
            <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-600 break-words leading-5">Find the right environment for your next shoot, recording, or production.</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 shrink-0">
            <Badge variant="outline" className="rounded-full bg-white text-[10px] sm:text-[11px]">Live Feed (42)</Badge>
            <Badge variant="outline" className="rounded-full bg-white text-[10px] sm:text-[11px] hidden sm:inline-flex">Loading Skeleton</Badge>
            <Badge variant="outline" className="rounded-full bg-white text-[10px] sm:text-[11px] hidden sm:inline-flex">Zero Results State</Badge>
          </div>
        </div>

        <Suspense fallback={<div className="h-32 animate-pulse bg-neutral-100 rounded-xl" />}>
          <ExploreClient />
        </Suspense>
      </div>
    </div>
  );
}
