import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, actionLabel, actionHref, icon }: Props) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E5E0] bg-[#FAF9F6] p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-[#E7E5E0]">
        {icon || (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A3A29E" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6M9 13h6M9 17h4" />
          </svg>
        )}
      </div>
      <h3 className="font-[Manrope] text-lg font-semibold text-[#202124]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#737373]">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}

