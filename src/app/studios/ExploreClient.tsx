"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StudioCard from "@/components/common/StudioCard";
import { StudioGridSkeleton } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { studioService } from "@/lib/api";
import { Studio, Pagination } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  SlidersHorizontal,
  X,
  Ruler,
  Zap,
  ShieldCheck,
  Headset,
} from "lucide-react";

type FilterState = {
  q: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  rating: string;
  amenities: string[];
};

const categoryPills = [
  { value: "", label: "All Spaces" },
  { value: "daylight-loft", label: "Photo Studios" },
  { value: "soundstage", label: "Film Stages" },
  { value: "black-box", label: "Podcast Lounges" },
  { value: "industrial-warehouse", label: "Music Suites" },
];

const locationOptions = ["", "New York, NY", "Brooklyn, NY", "Manhattan, NY", "Los Angeles, CA", "Queens, NY"];
const priceOptions = [
  { label: "Any Price", value: "" },
  { label: "Under $100 / h", max: "100" },
  { label: "Under $200 / h", max: "200" },
  { label: "Under $300 / h", max: "300" },
];
const ratingOptions = [
  { label: "Any Rating", value: "" },
  { label: "4.5+ Stars", value: "4.5" },
  { label: "4.8+ Stars (Top Rated)", value: "4.8" },
];
const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating-desc" },
];
const amenityOptions = ["Natural Light", "Freight Elevator", "3-Phase Power", "Cyc Wall", "Soundproofed", "Rooftop Access"];

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "recommended",
    rating: searchParams.get("rating") || "",
    amenities: [],
  });

  const updateURL = useCallback((newFilters: FilterState, pg: number = 1) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.rating) params.set("rating", newFilters.rating);
    if (newFilters.sort && newFilters.sort !== "recommended") params.set("sort", newFilters.sort);
    if (pg !== 1) params.set("page", String(pg));
    router.push(`/studios?${params.toString()}`, { scroll: false });
  }, [router]);

  const fetchStudios = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page: pg,
        limit: 12,
        sort: filters.sort === "recommended" ? "newest" : filters.sort,
      };
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await studioService.getAll(params);
      const all = res.data.studios || [];
      setStudios(all);
      setPagination(res.data.pagination);
      setPage(pg);
      updateURL(filters, pg);
    } catch (err) {
      console.error(err);
      setStudios([]);
    } finally {
      setLoading(false);
    }
  }, [filters.q, filters.category, filters.location, filters.minPrice, filters.maxPrice, filters.sort, updateURL]);

  // Client-side extra filtering for rating + amenities
  useEffect(() => {
    let result = [...studios];
    if (filters.rating) {
      const minR = parseFloat(filters.rating);
      result = result.filter((s) => (s.rating || 0) >= minR);
    }
    if (filters.amenities.length > 0) {
      result = result.filter((s) =>
        filters.amenities.every((am) => s.amenities?.some((sa) => sa.toLowerCase().includes(am.toLowerCase())))
      );
    }
    setFilteredStudios(result);
  }, [studios, filters.rating, filters.amenities]);

  useEffect(() => {
    fetchStudios(1);
  }, [fetchStudios]);

  const handleClear = () => {
    setFilters({ q: "", category: "", location: "", minPrice: "", maxPrice: "", sort: "recommended", rating: "", amenities: [] });
  };

  const removeFilterChip = (type: keyof FilterState, value?: string) => {
    if (type === "category") setFilters((p) => ({ ...p, category: "" }));
    if (type === "location") setFilters((p) => ({ ...p, location: "" }));
    if (type === "maxPrice") setFilters((p) => ({ ...p, maxPrice: "", minPrice: "" }));
    if (type === "rating") setFilters((p) => ({ ...p, rating: "" }));
    if (type === "amenities" && value) setFilters((p) => ({ ...p, amenities: p.amenities.filter((a) => a !== value) }));
  };

  const totalShowing = pagination?.total || filteredStudios.length;
  const showingLabel = totalShowing === 0 ? "0" : `${(page - 1) * 12 + 1}-${Math.min(page * 12, totalShowing)} of ${totalShowing}`;
  const hasActiveFilters = !!(filters.category || filters.location || filters.maxPrice || filters.rating || filters.amenities.length > 0);

  // Pagination numbers logic
  const getPageNumbers = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages: (number | string)[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 overflow-x-hidden">
      {/* Primary Filter Bar */}
      <Card className="border-[#E8DDD6] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <CardContent className="p-3 sm:p-3.5 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2.5">
          <div className="relative flex-1 min-w-0 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <Input
              placeholder="Search by studio name, gear, or keyword..."
              value={filters.q}
              onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
              className="pl-9 h-11 sm:h-10 rounded-full border-[#E8DDD6] bg-[#FFFEFB] text-[13px] w-full"
              aria-label="Search studios"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2 w-full lg:w-auto shrink-0">
            <div className="relative w-full sm:w-auto min-w-0">
              <MapPin className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <select
                value={filters.location}
                onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
                className="h-11 sm:h-10 w-full sm:w-auto rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none sm:min-w-[140px] min-h-[44px] sm:min-h-0"
                aria-label="Filter by location"
              >
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc || "All Locations"}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-auto min-w-0">
              <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <select
                value={filters.maxPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) setFilters((p) => ({ ...p, maxPrice: "", minPrice: "" }));
                  else setFilters((p) => ({ ...p, maxPrice: val, minPrice: "" }));
                }}
                className="h-11 sm:h-10 w-full sm:w-auto rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none sm:min-w-[130px] min-h-[44px] sm:min-h-0"
                aria-label="Filter by price"
              >
                {priceOptions.map((opt) => (
                  <option key={opt.label} value={opt.value || opt.max || ""}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-auto min-w-0">
              <Star className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <select
                value={filters.rating}
                onChange={(e) => setFilters((p) => ({ ...p, rating: e.target.value }))}
                className="h-11 sm:h-10 w-full sm:w-auto rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none sm:min-w-[150px] min-h-[44px] sm:min-h-0"
                aria-label="Filter by rating"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-auto min-w-0">
              <SlidersHorizontal className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
                className="h-11 sm:h-10 w-full sm:w-auto rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none sm:min-w-[130px] min-h-[44px] sm:min-h-0"
                aria-label="Sort studios"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Pills */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 pb-2 sm:pb-0 w-max sm:w-full">
          {categoryPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setFilters((p) => ({ ...p, category: pill.value }))}
              className={`whitespace-nowrap rounded-full border px-3.5 sm:px-4 py-1.5 sm:py-2 text-[12px] font-medium min-h-[36px] sm:h-8 transition-colors shrink-0 ${
                filters.category === pill.value
                  ? "bg-[#202124] border-[#202124] text-white"
                  : "bg-white border-[#E8DDD6] text-[#202124] hover:bg-[#FAF6F3]"
              }`}
            >
              {pill.label}
            </button>
          ))}

          <div className="relative shrink-0">
            <button
              onClick={() => {
                const next = amenityOptions.find((a) => !filters.amenities.includes(a));
                if (next) setFilters((p) => ({ ...p, amenities: [...p.amenities, next] }));
                else setFilters((p) => ({ ...p, amenities: [] }));
              }}
              className="whitespace-nowrap rounded-full border border-[#E8DDD6] bg-white px-3.5 sm:px-4 py-1.5 sm:py-2 text-[12px] font-medium min-h-[36px] sm:h-8 flex items-center gap-1.5 shrink-0"
            >
              <SlidersHorizontal className="h-3 w-3 shrink-0" /> <span className="hidden xs:inline">Amenities</span><span className="xs:hidden">Filters</span> {filters.amenities.length > 0 && `(${filters.amenities.length})`}
              {filters.amenities.length > 0 && (
                <Badge className="bg-[#E76F51] text-white rounded-full h-4 w-4 p-0 flex items-center justify-center text-[9px] ml-1 shrink-0">
                  {filters.amenities.length}
                </Badge>
              )}
            </button>
          </div>

          {hasActiveFilters && (
            <button onClick={handleClear} className="ml-1 sm:ml-2 text-[11px] text-neutral-500 hover:text-[#202124] flex items-center gap-1 min-h-[36px] shrink-0 whitespace-nowrap">
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Active Criteria */}
      <div className="flex flex-col gap-3 border-b border-[#F1E9E2] pb-3 sm:pb-4 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-[10px] tracking-[0.12em] uppercase text-neutral-500 font-medium shrink-0">ACTIVE CRITERIA:</span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
            {filters.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px] max-w-full truncate">
                <span className="truncate">{filters.category}</span> <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => removeFilterChip("category")} aria-label="Remove category filter" />
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px] max-w-full truncate">
                <span className="truncate">{filters.location}</span> <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => removeFilterChip("location")} aria-label="Remove location filter" />
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px] shrink-0">
                Under ${filters.maxPrice}/hr <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => removeFilterChip("maxPrice")} aria-label="Remove price filter" />
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px] shrink-0">
                {filters.rating}+ Stars <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => removeFilterChip("rating")} aria-label="Remove rating filter" />
              </span>
            )}
            {filters.amenities.map((am) => (
              <span key={am} className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px] shrink-0">
                {am} <X className="h-3 w-3 cursor-pointer shrink-0" onClick={() => removeFilterChip("amenities", am)} aria-label={`Remove ${am} filter`} />
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 break-words">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="break-words">Showing {totalShowing} available spaces{filters.location ? ` in ${filters.location}` : ""} • Page {page}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-2 min-w-0">
        {loading ? (
          <StudioGridSkeleton count={9} />
        ) : filteredStudios.length === 0 ? (
          <EmptyState
            title="No studios match your criteria"
            description="Try expanding your search radius or clearing power filters."
            actionLabel="Reset All Filters"
            actionHref="/studios"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1E9E2] pt-4 sm:pt-6">
                <p className="text-[11px] text-neutral-500 order-2 sm:order-1 text-center sm:text-left break-words">
                  Showing {showingLabel} creative spaces • Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2 overflow-x-auto scrollbar-hide max-w-full pb-1 sm:pb-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 sm:h-8 rounded-md text-[11px] min-h-[36px] shrink-0"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchStudios(pagination.page - 1)}
                  >
                    Prev
                  </Button>
                  {getPageNumbers().map((p, idx) =>
                    p === "..." ? (
                      <span key={`el-${idx}`} className="px-1 sm:px-2 text-[11px] text-neutral-400 shrink-0">...</span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === pagination.page ? "secondary" : "outline"}
                        size="sm"
                        className={`h-9 w-9 sm:h-8 sm:w-8 rounded-md text-[11px] p-0 min-h-[36px] shrink-0 ${p === pagination.page ? "bg-[#202124] text-white" : ""}`}
                        onClick={() => fetchStudios(p as number)}
                        aria-label={`Go to page ${p}`}
                        aria-current={p === pagination.page ? "page" : undefined}
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 sm:h-8 rounded-md text-[11px] min-h-[36px] shrink-0"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchStudios(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Trust Bar */}
      <Card className="mt-8 sm:mt-12 border-[#E8DDD6] bg-[#FFFEFB] rounded-xl overflow-hidden">
        <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F1E9E2]">
          {[
            { icon: Ruler, title: "Verified Floorplans", desc: "Laser-measured clearances, freight lift dimensions, and clean shooting area." },
            { icon: Zap, title: "Heavy Power Certified", desc: "Verified 100A-400A Camlock and 3-phase tie-ins with certified master electricians on call." },
            { icon: ShieldCheck, title: "$2M Host Guarantee", desc: "Comprehensive production COI issuance and comprehensive equipment liability protection." },
            { icon: Headset, title: "Concierge Dispatch", desc: "On-call tech and lighting rental consolidation, and local catering coordination." },
          ].map((item) => (
            <div key={item.title} className="p-4 sm:p-5 flex gap-3 min-w-0">
              <span className="h-8 w-8 rounded-md bg-[#FFF1EB] border border-[#F9D8C0] flex items-center justify-center text-[#E76F51] shrink-0">
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h4 className="text-[12px] font-semibold text-[#202124] break-words">{item.title}</h4>
                <p className="mt-1 text-[11px] leading-4 text-neutral-600 break-words">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
