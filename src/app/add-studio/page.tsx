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
    <div className="bg-[#FBF8F5] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-8 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FFF1EB] text-[#9C4A2E] border border-[#F9D8C0] rounded-full text-[10px]">NEW LISTING</Badge>
              <Badge variant="outline" className="rounded-full text-[10px] border-[#E8DDD6] bg-white">Verified Acoustic & Daylight Certified</Badge>
            </div>
            <h1 className="mt-3 font-[Manrope] text-[28px] font-bold tracking-tight text-[#202124]">Add New Studio</h1>
            <p className="mt-1 text-[13px] text-neutral-600">List your creative workspace, set specs, pricing, and availability.</p>
          </div>
          <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E8DDD6]">
            <Building2 className="h-5 w-5 text-neutral-600" />
          </div>
        </div>

        <Card className="mt-8 border-[#E8DDD6] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px]">Studio Information</CardTitle>
                <CardDescription className="mt-1 text-[12px]">Verified production spaces filtered by technical specifications</CardDescription>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                <Zap className="h-3 w-3 text-[#E76F51]" /> Heavy Power Certified
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <StudioForm onSubmit={onSubmit} loading={loading} submitLabel="Publish Studio Listing" onCancel={() => router.back()} />
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, title: "$2M Guarantee", desc: "Host protection automatically" },
            { icon: Zap, title: "Power Certified", desc: "100A-400A Camlock audit" },
            { icon: Building2, title: "Floorplans", desc: "Laser-measured verification" },
          ].map((f) => (
            <div key={f.title} className="rounded-lg bg-white border border-[#E8DDD6] p-3 flex gap-2">
              <f.icon className="h-4 w-4 text-[#E76F51] mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-[#202124]">{f.title}</p>
                <p className="text-[10px] text-neutral-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
