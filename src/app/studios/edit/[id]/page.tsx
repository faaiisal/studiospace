"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studioService } from "@/lib/api";
import { toast } from "sonner";

const editSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(2),
  description: z.string().min(20).max(5000),
  hourlyRate: z.coerce.number().min(10).max(10000),
  securityDeposit: z.coerce.number().min(0).max(100000),
  maxCapacity: z.coerce.number().int().min(1).max(500),
  location: z.string().min(3).max(200),
  images: z.string().min(1),
  amenities: z.string().min(1),
});

type EditForm = z.infer<typeof editSchema>;

export default function EditStudioPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>({
    resolver: zodResolver(editSchema) as any,
  });

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await studioService.getById(id);
        const s = res.data as any;
        reset({
          title: s.title,
          category: s.category,
          description: s.description,
          hourlyRate: s.hourlyRate,
          securityDeposit: s.securityDeposit,
          maxCapacity: s.maxCapacity,
          location: s.location,
          images: s.images.join(", "),
          amenities: s.amenities.join(", "),
        });
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to load studio");
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) fetchStudio();
  }, [id, reset]);

  const onSubmit = async (data: EditForm) => {
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
      });
      toast.success("Studio updated");
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-12">Loading studio...</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 md:px-12">
      <h1 className="font-[Manrope] text-3xl font-semibold">Edit Studio</h1>
      <p className="text-sm text-neutral-600">Update spatial specs, media, and pricing</p>

      <Card className="mt-8">
        <CardHeader><CardTitle>Studio Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input {...register("title")} className="mt-1" />
                {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
              </div>
              <div>
                <Label>Category</Label>
                <select {...register("category")} className="mt-1 h-12 w-full rounded-[8px] border bg-white px-4 text-sm">
                  <option value="daylight-loft">Daylight Loft</option>
                  <option value="cyclorama">Cyclorama</option>
                  <option value="soundstage">Soundstage</option>
                  <option value="black-box">Black Box</option>
                  <option value="industrial-warehouse">Industrial Warehouse</option>
                  <option value="rooftop">Rooftop</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label>Location</Label>
                <Input {...register("location")} className="mt-1" />
              </div>
              <div>
                <Label>Hourly Rate</Label>
                <Input type="number" {...register("hourlyRate")} className="mt-1" />
              </div>
              <div>
                <Label>Deposit</Label>
                <Input type="number" {...register("securityDeposit")} className="mt-1" />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" {...register("maxCapacity")} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Images (comma separated)</Label>
                <Textarea {...register("images")} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Amenities (comma separated)</Label>
                <Input {...register("amenities")} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea {...register("description")} className="mt-1 min-h-[120px]" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Saving..." : "Save & Update Listing"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

