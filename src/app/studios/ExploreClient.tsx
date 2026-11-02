"use client";


import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StudioCard from "@/components/common/StudioCard";
import SearchAndFilter, { FilterState } from "@/components/common/SearchAndFilter";
import { StudioGridSkeleton } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { studioService } from "@/lib/api";
import { Studio, Pagination } from "@/types";
import { Button } from "@/components/ui/button";

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const updateURL = useCallback((newFilters: FilterState, page: number = 1) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.sort && newFilters.sort !== "newest") params.set("sort", newFilters.sort);
    if (page !== 1) params.set("page", String(page));
    router.push(`/studios?${params.toString()}`, { scroll: false });
  }, [router]);

  const fetchStudios = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 12,
        sort: filters.sort,
      };
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await studioService.getAll(params);
      setStudios(res.data.studios || []);
      setPagination(res.data.pagination);
      updateURL(filters, page);
    } catch (err) {
      console.error(err);
      setStudios([]);
    } finally {
      setLoading(false);
    }
  }, [filters, updateURL]);

  useEffect(() => {
    fetchStudios(1);
  }, [fetchStudios]);

  const handleClear = () => {
    setFilters({ q: "", category: "", location: "", minPrice: "", maxPrice: "", sort: "newest" });
  };

  return (
    <div>
      <SearchAndFilter filters={filters} onFilterChange={setFilters} onClear={handleClear} total={pagination?.total} />

      <div className="mt-8">
        {loading ? (
          <StudioGridSkeleton count={9} />
        ) : studios.length === 0 ? (
          <EmptyState
            title="No studios match your criteria"
            description="Try expanding your search radius or clearing power filters."
            actionLabel="Reset All Filters"
            actionHref="/studios"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchStudios(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchStudios(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

