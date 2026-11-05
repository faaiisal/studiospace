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
    <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-[#E7E5E0] bg-[#FAF9F6] p-6 sm:p-12 text-center">
      <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white border border-[#E7E5E0] shrink-0">
        {icon || (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A3A29E" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6M9 13h6M9 17h4" />
          </svg>
        )}
      </div>
      <h3 className="font-[Manrope] text-[16px] sm:text-lg font-semibold text-[#202124] break-words max-w-full">{title}</h3>
      <p className="mt-2 max-w-sm text-[13px] sm:text-sm text-[#737373] break-words leading-5">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-5 sm:mt-6 w-full sm:w-auto">
          <Button className="w-full sm:w-auto min-h-[44px]">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}

