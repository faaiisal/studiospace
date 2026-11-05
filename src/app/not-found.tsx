import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16 text-center overflow-x-hidden">
      <div className="relative mb-6 sm:mb-8">
        <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full border border-[#E7E5E0] bg-white">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A3A29E" strokeWidth="1" aria-hidden="true">
            <path d="M3 3h18v18H3z" />
            <path d="M3 9h18M9 3v18" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="absolute -right-2 -top-2 rounded-full bg-[#E76F51] px-2 py-1 text-xs font-bold text-white">404</span>
      </div>

      <h1 className="font-[Manrope] text-[22px] sm:text-3xl font-semibold break-words leading-tight px-4">Spatial Coordinate Not Found</h1>
      <p className="mt-3 sm:mt-4 max-w-md text-[13px] sm:text-sm text-neutral-600 break-words leading-5 px-4">
        The studio listing or page you are looking for has been relocated, unlisted, or does not exist.
      </p>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto px-4">
        <Link href="/studios" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto min-h-[48px]">Return to Explore Studios</Button>
        </Link>
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px]">Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}

