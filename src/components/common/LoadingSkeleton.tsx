export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E7E5E0] bg-white w-full min-w-0">
      <div className="aspect-[4/3] animate-pulse bg-neutral-200" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-12 w-full min-w-0 overflow-x-hidden">
      <div className="h-8 w-48 max-w-full animate-pulse rounded bg-neutral-200 mb-6 sm:mb-8" />
      <StudioGridSkeleton />
    </div>
  );
}

