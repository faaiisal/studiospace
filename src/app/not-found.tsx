import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-8">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#E7E5E0] bg-white">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A3A29E" strokeWidth="1">
            <path d="M3 3h18v18H3z" />
            <path d="M3 9h18M9 3v18" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="absolute -right-2 -top-2 rounded-full bg-[#E76F51] px-2 py-1 text-xs font-bold text-white">404</span>
      </div>

      <h1 className="font-[Manrope] text-3xl font-semibold">Spatial Coordinate Not Found</h1>
      <p className="mt-4 max-w-md text-sm text-neutral-600">
        The studio listing or page you are looking for has been relocated, unlisted, or does not exist.
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/studios">
          <Button size="lg">Return to Explore Studios</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg">Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}

