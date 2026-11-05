"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { studioService } from "@/lib/api";
import { Studio } from "@/types";
import { toast } from "sonner";
import DeleteModal from "@/components/common/DeleteModal";
import EmptyState from "@/components/common/EmptyState";
import { StudioGridSkeleton } from "@/components/common/LoadingSkeleton";
import { Edit, Eye, Trash2, Calendar, Plus } from "lucide-react";

export default function MyListingsPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await studioService.getMyListings();
      setStudios(res.data as any);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studioService.delete(deleteTarget);
      toast.success("Studio deleted");
      setStudios(studios.filter((s) => s._id !== deleteTarget));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-12"><StudioGridSkeleton count={3} /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-[Manrope] text-[22px] sm:text-3xl font-semibold break-words leading-tight">My Studio Listings</h1>
          <p className="mt-1 text-[12px] sm:text-sm text-neutral-600 break-words leading-5">Manage your architectural spaces, calendar rules, and rates</p>
        </div>
        <Link href="/add-studio" className="w-full sm:w-auto shrink-0"><Button className="gap-2 w-full sm:w-auto min-h-[44px]"><Plus size={16} /> Add New Studio</Button></Link>
      </div>

      {studios.length === 0 ? (
        <div className="mt-8 sm:mt-12">
          <EmptyState
            title="You haven't listed any studio spaces yet"
            description="Earn revenue by sharing your creative workspace with filmmakers, photographers, and production teams."
            actionLabel="List Your First Studio"
            actionHref="/add-studio"
          />
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4">
          {studios.map((studio) => (
            <Card key={studio._id} className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center min-w-0">
              <img src={studio.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200"} alt={studio.title} className="h-16 w-full sm:h-20 sm:w-20 rounded-xl object-cover shrink-0 aspect-[4/3] sm:aspect-square" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2 sm:line-clamp-1 break-words text-[14px] sm:text-[15px]">{studio.title}</h3>
                <p className="text-[12px] sm:text-sm text-neutral-500 break-words line-clamp-2 mt-1">{studio.location} • ${studio.hourlyRate}/hr • {studio.maxCapacity} capacity</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] sm:text-xs text-green-800">Active</span>
                  <span className="text-[11px] sm:text-xs text-neutral-500 truncate">{studio.category}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto shrink-0">
                <Link href={`/studios/${studio._id}`} className="w-full sm:w-auto"><Button variant="outline" size="sm" className="w-full min-h-[36px] text-[12px] gap-1"><Eye size={14} /> View</Button></Link>
                <Link href={`/studios/edit/${studio._id}`} className="w-full sm:w-auto"><Button variant="outline" size="sm" className="w-full min-h-[36px] text-[12px] gap-1"><Edit size={14} /> Edit</Button></Link>
                <Button variant="outline" size="sm" className="min-h-[36px] text-[12px] gap-1 hidden sm:flex"><Calendar size={14} /> Calendar</Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(studio._id)} className="min-h-[36px] col-span-2 sm:col-span-1"><Trash2 size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Studio Listing?"
        description="This will permanently delete your studio listing and remove it from search. Any upcoming bookings will prevent deletion."
        confirmLabel="Delete Studio"
        loading={deleting}
      />
    </div>
  );
}

