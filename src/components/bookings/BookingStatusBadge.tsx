import { BookingStatus } from "@/types";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-neutral-100 text-neutral-800 border-neutral-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[status] || "bg-neutral-100"}`}>{status}</span>;
}

