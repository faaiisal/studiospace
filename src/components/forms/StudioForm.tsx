"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const studioSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(2),
  description: z.string().min(20).max(5000),
  hourlyRate: z.coerce.number().min(10).max(10000),
  securityDeposit: z.coerce.number().min(0).max(100000),
  maxCapacity: z.coerce.number().int().min(1).max(500),
  location: z.string().min(3).max(200),
  images: z.string().min(1, "At least 1 image URL, comma-separated"),
  amenities: z.string().min(1, "At least 1 amenity, comma-separated"),
  squareFootage: z.coerce.number().optional(),
  ceilingHeight: z.coerce.number().optional(),
});

export type StudioFormData = z.infer<typeof studioSchema>;

interface Props {
  initialData?: Partial<StudioFormData>;
  onSubmit: (data: StudioFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function StudioForm({ initialData, onSubmit, loading, submitLabel = "Publish Studio Listing", onCancel }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<StudioFormData>({
    resolver: zodResolver(studioSchema) as any,
    defaultValues: initialData as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label>Studio Title</Label>
          <Input placeholder="The Foundry Daylight Cyclorama" {...register("title")} className="mt-1" />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label>Category</Label>
          <select {...register("category")} className="mt-1 h-12 w-full rounded-[8px] border border-[#E7E5E0] bg-white px-4 text-sm">
            <option value="">Select category</option>
            <option value="daylight-loft">Daylight Loft</option>
            <option value="cyclorama">Cyclorama</option>
            <option value="soundstage">Soundstage</option>
            <option value="black-box">Black Box</option>
            <option value="industrial-warehouse">Industrial Warehouse</option>
            <option value="rooftop">Rooftop</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <Label>Location</Label>
          <Input placeholder="Greenpoint, Brooklyn" {...register("location")} className="mt-1" />
          {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <Label>Hourly Rate ($)</Label>
          <Input type="number" placeholder="185" {...register("hourlyRate")} className="mt-1" />
          {errors.hourlyRate && <p className="text-xs text-red-600 mt-1">{errors.hourlyRate.message as any}</p>}
        </div>
        <div>
          <Label>Security Deposit ($)</Label>
          <Input type="number" placeholder="500" {...register("securityDeposit")} className="mt-1" />
        </div>
        <div>
          <Label>Max Capacity</Label>
          <Input type="number" placeholder="30" {...register("maxCapacity")} className="mt-1" />
        </div>
        <div>
          <Label>Square Footage (optional)</Label>
          <Input type="number" placeholder="4200" {...register("squareFootage")} className="mt-1" />
        </div>
        <div>
          <Label>Ceiling Height ft (optional)</Label>
          <Input type="number" placeholder="18" {...register("ceilingHeight")} className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <Label>Images (comma-separated URLs)</Label>
          <Textarea placeholder="https://i.ibb.co/1.jpg, https://..." {...register("images")} className="mt-1" />
          {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images.message}</p>}
          <p className="text-[11px] text-neutral-500 mt-1">Use ImgBB or Unsplash. 1-10 images. Preview supported.</p>
        </div>
        <div className="md:col-span-2">
          <Label>Amenities (comma-separated)</Label>
          <Input placeholder="18ft Clear Height, 200A 3-Phase, Freight Elevator" {...register("amenities")} className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <Label>Detailed Overview</Label>
          <Textarea placeholder="Describe daylight, floor loading, electrical specs..." {...register("description")} className="mt-1 min-h-[120px]" />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Publishing..." : submitLabel}</Button>
      </div>
    </form>
  );
}

