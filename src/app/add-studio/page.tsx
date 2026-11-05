"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudioForm, { StudioFormData } from "@/components/forms/StudioForm";
import { studioService } from "@/lib/api";
import { toast } from "sonner";
import { Building2, ShieldCheck, Zap } from "lucide-react";

export default function AddStudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: StudioFormData) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        category: data.category.toLowerCase(),
        description: data.description,
        hourlyRate: data.hourlyRate,
        securityDeposit: data.securityDeposit,
        maxCapacity: data.maxCapacity,
        location: data.location,
        images: data.images.split(",").map((s) => s.trim()).filter(Boolean),
        amenities: data.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        squareFootage: data.squareFootage,
        ceilingHeight: data.ceilingHeight,
      };

      await studioService.create(payload);
      toast.success("Studio listed successfully!");
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create studio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF8F5] min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge className="bg-[#FFF1EB] text-[#9C4A2E] border border-[#F9D8C0] rounded-full text-[10px] shrink-0">NEW LISTING</Badge>
              <Badge variant="outline" className="rounded-full text-[10px] border-[#E8DDD6] bg-white break-words">Verified Acoustic & Daylight Certified</Badge>
            </div>
            <h1 className="mt-2 sm:mt-3 font-[Manrope] text-[22px] sm:text-[28px] font-bold tracking-tight text-[#202124] break-words leading-tight">Add New Studio</h1>
            <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-600 break-words leading-5">List your creative workspace, set specs, pricing, and availability.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E8DDD6] shrink-0">
            <Building2 className="h-5 w-5 text-neutral-600" />
          </div>
        </div>

        <Card className="mt-6 sm:mt-8 border-[#E8DDD6] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <CardHeader className="pb-4 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-[14px] sm:text-[15px] break-words">Studio Information</CardTitle>
                <CardDescription className="mt-1 text-[11px] sm:text-[12px] break-words">Verified production spaces filtered by technical specifications</CardDescription>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 shrink-0">
                <Zap className="h-3 w-3 text-[#E76F51] shrink-0" /> Heavy Power Certified
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <StudioForm onSubmit={onSubmit} loading={loading} submitLabel="Publish Studio Listing" onCancel={() => router.back()} />
          </CardContent>
        </Card>

        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {[
            { icon: ShieldCheck, title: "$2M Guarantee", desc: "Host protection automatically" },
            { icon: Zap, title: "Power Certified", desc: "100A-400A Camlock audit" },
            { icon: Building2, title: "Floorplans", desc: "Laser-measured verification" },
          ].map((f) => (
            <div key={f.title} className="rounded-lg bg-white border border-[#E8DDD6] p-3 flex gap-2 min-w-0">
              <f.icon className="h-4 w-4 text-[#E76F51] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#202124] break-words">{f.title}</p>
                <p className="text-[10px] text-neutral-500 break-words">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
