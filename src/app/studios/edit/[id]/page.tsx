"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudioForm, { StudioFormData } from "@/components/forms/StudioForm";
import { studioService } from "@/lib/api";
import { toast } from "sonner";
import { Building2, ShieldCheck } from "lucide-react";

export default function EditStudioPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<StudioFormData> | null>(null);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await studioService.getById(id);
        const s = res.data as any;
        setInitialData({
          title: s.title,
          category: s.category,
          description: s.description,
          hourlyRate: s.hourlyRate,
          securityDeposit: s.securityDeposit,
          maxCapacity: s.maxCapacity,
          location: s.location,
          images: s.images?.join(", ") || "",
          amenities: s.amenities?.join(", ") || "",
          squareFootage: s.squareFootage,
          ceilingHeight: s.ceilingHeight,
        });
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to load studio");
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) fetchStudio();
  }, [id]);

  const onSubmit = async (data: StudioFormData) => {
    setLoading(true);
    try {
      await studioService.update(id, {
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
      });
      toast.success("Studio updated successfully");
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-[#FBF8F5] min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-neutral-500 animate-pulse">Loading studio...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Card className="border-[#E8DDD6]">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-neutral-600">Studio not found or failed to load.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF8F5] min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Badge className="bg-[#D1FAE5] text-[#065F46] border-0 rounded-full text-[10px] shrink-0">EDIT MODE</Badge>
              <Badge variant="outline" className="rounded-full text-[10px] border-[#E8DDD6] bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0 inline-block" /> Verified Listing
              </Badge>
            </div>
            <h1 className="mt-2 sm:mt-3 font-[Manrope] text-[22px] sm:text-[28px] font-bold tracking-tight text-[#202124] break-words leading-tight">Edit Studio</h1>
            <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-600 break-words leading-5">Update spatial specs, media, and pricing • ID: {id.slice(0, 8)}</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E8DDD6] shrink-0">
            <Building2 className="h-5 w-5 text-neutral-600" />
          </div>
        </div>

        <Card className="mt-6 sm:mt-8 border-[#E8DDD6] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <CardHeader className="pb-4 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-[14px] sm:text-[15px] break-words">Studio Details</CardTitle>
                <CardDescription className="mt-1 text-[11px] sm:text-[12px] break-words">Ground-verified specs required for architectural certification</CardDescription>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full px-2.5 py-1 shrink-0 w-fit">
                <ShieldCheck className="h-3 w-3 shrink-0" /> $2M Guarantee Active
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <StudioForm
              initialData={initialData}
              onSubmit={onSubmit}
              loading={loading}
              submitLabel="Save & Update Listing"
              onCancel={() => router.back()}
            />
          </CardContent>
        </Card>

        <div className="mt-4 sm:mt-6 flex items-start gap-2 rounded-lg bg-[#FFF8F4] border border-[#E8D9D0] p-3">
          <ShieldCheck className="h-4 w-4 text-[#E76F51] mt-0.5 shrink-0" />
          <p className="text-[11px] leading-4 text-neutral-600 break-words">
            Updating specs triggers re-verification. Our spatial team will audit changes within 24h. Ensure power, ceiling, and footage are accurate to maintain Verified status.
          </p>
        </div>
      </div>
    </div>
  );
}
