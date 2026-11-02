import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

export default function ExploreStudiosPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
      <div className="mb-8">
        <h1 className="font-[Manrope] text-3xl font-semibold">Explore Studios</h1>
        <p className="mt-2 text-sm text-neutral-600">Verified production spaces filtered by technical specifications</p>
      </div>
      <Suspense fallback={<div className="h-32 animate-pulse bg-neutral-100 rounded-xl" />}>
        <ExploreClient />
      </Suspense>
    </div>
  );
}

