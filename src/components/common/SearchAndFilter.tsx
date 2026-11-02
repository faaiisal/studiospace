"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface FilterState {
  q: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
  total?: number;
}

const categories = [
  { value: "", label: "All Spaces" },
  { value: "daylight-loft", label: "Daylight Lofts" },
  { value: "cyclorama", label: "Cycloramas" },
  { value: "soundstage", label: "Soundstages" },
  { value: "black-box", label: "Black Box" },
  { value: "industrial-warehouse", label: "Industrial Warehouses" },
  { value: "rooftop", label: "Rooftops" },
];

export default function SearchAndFilter({ filters, onFilterChange, onClear, total }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search studios, location, amenities..."
            value={filters.q}
            onChange={(e) => update("q", e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="gap-2">
            <SlidersHorizontal size={16} />
            Filters
            {(filters.minPrice || filters.maxPrice || filters.location) && (
              <span className="ml-1 rounded-full bg-[#E76F51] px-2 py-0.5 text-xs text-white">•</span>
            )}
          </Button>
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value)}
            className="h-12 rounded-[8px] border border-[#E7E5E0] bg-white px-4 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="capacity-desc">Largest Capacity</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => update("category", cat.value)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors h-9 ${
              filters.category === cat.value
                ? "bg-[#202124] border-[#202124] text-white"
                : "bg-white border-[#E7E5E0] text-[#202124] hover:bg-[#F1F0EC]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div className="rounded-xl border border-[#E7E5E0] bg-white p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-neutral-700">Location</label>
            <Input placeholder="Brooklyn, NYC..." value={filters.location} onChange={(e)=>update("location", e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-700">Min Price ($/hr)</label>
            <Input type="number" placeholder="50" value={filters.minPrice} onChange={(e)=>update("minPrice", e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-700">Max Price ($/hr)</label>
            <Input type="number" placeholder="500" value={filters.maxPrice} onChange={(e)=>update("maxPrice", e.target.value)} className="mt-1" />
          </div>
          <div className="flex items-end">
            <Button variant="ghost" onClick={onClear} className="w-full gap-2">
              <X size={16} /> Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {total !== undefined && (
        <p className="text-sm text-neutral-600">Showing {total} verified production spaces</p>
      )}

      {/* Active filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.category && (
          <span className="flex items-center gap-1 rounded-full bg-[#202124] px-3 py-1 text-xs text-white">
            {filters.category} <X size={12} className="cursor-pointer" onClick={()=>update("category","")} />
          </span>
        )}
        {filters.location && (
          <span className="flex items-center gap-1 rounded-full bg-[#202124] px-3 py-1 text-xs text-white">
            {filters.location} <X size={12} className="cursor-pointer" onClick={()=>update("location","")} />
          </span>
        )}
        {(filters.minPrice || filters.maxPrice) && (
          <span className="flex items-center gap-1 rounded-full bg-[#202124] px-3 py-1 text-xs text-white">
            ${filters.minPrice || 0} - ${filters.maxPrice || "∞"} <X size={12} className="cursor-pointer" onClick={()=>{update("minPrice","");update("maxPrice","")}} />
          </span>
        )}
      </div>
    </div>
  );
}

