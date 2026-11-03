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
    <div className="space-y-6">
      {/* Primary Filter Bar */}
      <Card className="border-[#E8DDD6] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <CardContent className="p-3 md:p-3.5 flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Search by studio name, gear, or keyword..."
              value={filters.q}
              onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
              className="pl-9 h-10 rounded-full border-[#E8DDD6] bg-[#FFFEFB] text-[13px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <select
                value={filters.location}
                onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
                className="h-10 rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none min-w-[140px]"
              >
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc || "All Locations"}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <select
                value={filters.maxPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) setFilters((p) => ({ ...p, maxPrice: "", minPrice: "" }));
                  else setFilters((p) => ({ ...p, maxPrice: val, minPrice: "" }));
                }}
                className="h-10 rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none min-w-[130px]"
              >
                {priceOptions.map((opt) => (
                  <option key={opt.label} value={opt.value || opt.max || ""}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Star className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <select
                value={filters.rating}
                onChange={(e) => setFilters((p) => ({ ...p, rating: e.target.value }))}
                className="h-10 rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none min-w-[150px]"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <SlidersHorizontal className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
                className="h-10 rounded-full border border-[#E8DDD6] bg-white pl-8 pr-8 text-[12px] font-medium text-[#202124] appearance-none min-w-[130px]"
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
      <div className="flex flex-wrap items-center gap-2">
        {categoryPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => setFilters((p) => ({ ...p, category: pill.value }))}
            className={`rounded-full border px-4 py-2 text-[12px] font-medium h-8 transition-colors ${
              filters.category === pill.value
                ? "bg-[#202124] border-[#202124] text-white"
                : "bg-white border-[#E8DDD6] text-[#202124] hover:bg-[#FAF6F3]"
            }`}
          >
            {pill.label}
          </button>
        ))}

        <div className="relative">
          <button
            onClick={() => {
              // toggle amenities dropdown - simple: add first not selected
              const next = amenityOptions.find((a) => !filters.amenities.includes(a));
              if (next) setFilters((p) => ({ ...p, amenities: [...p.amenities, next] }));
              else setFilters((p) => ({ ...p, amenities: [] }));
            }}
            className="rounded-full border border-[#E8DDD6] bg-white px-4 py-2 text-[12px] font-medium h-8 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-3 w-3" /> Amenities {filters.amenities.length > 0 && `(${filters.amenities.length} Selected)`}
            {filters.amenities.length > 0 && (
              <Badge className="bg-[#E76F51] text-white rounded-full h-4 w-4 p-0 flex items-center justify-center text-[9px] ml-1">
                {filters.amenities.length}
              </Badge>
            )}
          </button>
        </div>

        {hasActiveFilters && (
          <button onClick={handleClear} className="ml-2 text-[11px] text-neutral-500 hover:text-[#202124] flex items-center gap-1">
            <X className="h-3 w-3" /> Clear all filters
          </button>
        )}
      </div>

      {/* Active Criteria */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F1E9E2] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.12em] uppercase text-neutral-500 font-medium">ACTIVE CRITERIA:</span>
          {filters.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px]">
              {filters.category} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("category")} />
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px]">
              {filters.location} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("location")} />
            </span>
          )}
          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px]">
              Under ${filters.maxPrice}/hr <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("maxPrice")} />
            </span>
          )}
          {filters.rating && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px]">
              {filters.rating}+ Stars <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("rating")} />
            </span>
          )}
          {filters.amenities.map((am) => (
            <span key={am} className="inline-flex items-center gap-1 rounded-full bg-[#202124] text-white px-2.5 py-1 text-[11px]">
              {am} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilterChip("amenities", am)} />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Showing {totalShowing} available spaces{filters.location ? ` in ${filters.location}` : ""} • Page {page}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-2">
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#F1E9E2] pt-6">
                <p className="text-[11px] text-neutral-500">
                  Showing {showingLabel} creative spaces • Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md text-[11px]"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchStudios(pagination.page - 1)}
                  >
                    Prev
                  </Button>
                  {getPageNumbers().map((p, idx) =>
                    p === "..." ? (
                      <span key={`el-${idx}`} className="px-2 text-[11px] text-neutral-400">...</span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === pagination.page ? "secondary" : "outline"}
                        size="sm"
                        className={`h-8 w-8 rounded-md text-[11px] p-0 ${p === pagination.page ? "bg-[#202124] text-white" : ""}`}
                        onClick={() => fetchStudios(p as number)}
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md text-[11px]"
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
      <Card className="mt-12 border-[#E8DDD6] bg-[#FFFEFB] rounded-xl">
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#F1E9E2]">
          {[
            { icon: Ruler, title: "Verified Floorplans", desc: "Laser-measured clearances, freight lift dimensions, and clean shooting area." },
            { icon: Zap, title: "Heavy Power Certified", desc: "Verified 100A-400A Camlock and 3-phase tie-ins with certified master electricians on call." },
            { icon: ShieldCheck, title: "$2M Host Guarantee", desc: "Comprehensive production COI issuance and comprehensive equipment liability protection." },
            { icon: Headset, title: "Concierge Dispatch", desc: "On-call tech and lighting rental consolidation, and local catering coordination." },
          ].map((item) => (
            <div key={item.title} className="p-5 flex gap-3">
              <span className="h-8 w-8 rounded-md bg-[#FFF1EB] border border-[#F9D8C0] flex items-center justify-center text-[#E76F51] shrink-0">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-[12px] font-semibold text-[#202124]">{item.title}</h4>
                <p className="mt-1 text-[11px] leading-4 text-neutral-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
