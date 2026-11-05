import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-neutral-900">Studio</span>
                <span className="text-[#E76F51]">Space</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-600 break-words">
              The architectural creative workspace network. Curated production studios, cycloramas, soundstages, and daylight lofts for visionary projects.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Follow on X" className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 transition-colors">
                𝕏
              </a>
              <a href="#" aria-label="Follow on Instagram" className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 transition-colors">
                IG
              </a>
              <a href="#" aria-label="Follow on LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 transition-colors">
                in
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900">Explore Spaces</h4>
            <ul className="mt-4 space-y-1 text-sm text-neutral-600">
              <li><Link href="/studios" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Explore Studios</Link></li>
              <li><Link href="/studios?category=daylight-loft" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Daylight Lofts</Link></li>
              <li><Link href="/studios?category=soundstage" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Soundstages</Link></li>
              <li><Link href="/studios?category=cyclorama" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Cycloramas</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900">Hosting</h4>
            <ul className="mt-4 space-y-1 text-sm text-neutral-600">
              <li><Link href="/add-studio" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">List a Workspace</Link></li>
              <li><Link href="#" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Host Guarantee</Link></li>
              <li><Link href="#" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Production Insurance</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900">Legal</h4>
            <ul className="mt-4 space-y-1 text-sm text-neutral-600">
              <li><Link href="#" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="flex min-h-[36px] items-center hover:text-neutral-900 transition-colors">Architecture Directory</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-6 sm:pt-8 md:mt-12 md:flex-row md:items-center">
          <p className="text-xs leading-5 text-neutral-500 break-words">
            © 2025 StudioSpace Inc. All rights reserved. Curated for visionary productions.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-neutral-600">All Studios Verified Available</span>
            </span>
            <span className="text-neutral-400">USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

