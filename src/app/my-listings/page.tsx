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

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-12"><StudioGridSkeleton count={3} /></div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Manrope] text-3xl font-semibold">My Studio Listings</h1>
          <p className="mt-1 text-sm text-neutral-600">Manage your architectural spaces, calendar rules, and rates</p>
        </div>
        <Link href="/add-studio"><Button className="gap-2"><Plus size={16} /> Add New Studio</Button></Link>
      </div>

      {studios.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="You haven't listed any studio spaces yet"
            description="Earn revenue by sharing your creative workspace with filmmakers, photographers, and production teams."
            actionLabel="List Your First Studio"
            actionHref="/add-studio"
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {studios.map((studio) => (
            <Card key={studio._id} className="p-4 flex flex-col md:flex-row gap-4 items-center">
              <img src={studio.images[0]} alt={studio.title} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-1">{studio.title}</h3>
                <p className="text-sm text-neutral-500">{studio.location} • ${studio.hourlyRate}/hr • {studio.maxCapacity} capacity</p>
                <div className="mt-1 flex gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Active</span>
                  <span className="text-xs text-neutral-500">{studio.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/studios/${studio._id}`}><Button variant="outline" size="sm"><Eye size={14} /> View</Button></Link>
                <Link href={`/studios/edit/${studio._id}`}><Button variant="outline" size="sm"><Edit size={14} /> Edit</Button></Link>
                <Button variant="outline" size="sm"><Calendar size={14} /> Calendar</Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(studio._id)}><Trash2 size={14} /></Button>
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

