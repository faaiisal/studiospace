import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-600">
              The architectural creative workspace network. Curated production studios, cycloramas, soundstages, and daylight lofts for visionary projects.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400">
                𝕏
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400">
                IG
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400">
                in
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Explore Spaces</h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li><Link href="/studios" className="hover:text-neutral-900">Explore Studios</Link></li>
              <li><Link href="/studios?category=daylight-loft" className="hover:text-neutral-900">Daylight Lofts</Link></li>
              <li><Link href="/studios?category=soundstage" className="hover:text-neutral-900">Soundstages</Link></li>
              <li><Link href="/studios?category=cyclorama" className="hover:text-neutral-900">Cycloramas</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Hosting</h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li><Link href="/add-studio" className="hover:text-neutral-900">List a Workspace</Link></li>
              <li><Link href="#" className="hover:text-neutral-900">Host Guarantee</Link></li>
              <li><Link href="#" className="hover:text-neutral-900">Production Insurance</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li><Link href="#" className="hover:text-neutral-900">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-neutral-900">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-neutral-900">Architecture Directory</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 md:flex-row">
          <p className="text-xs text-neutral-500">
            © 2025 StudioSpace Inc. All rights reserved. Curated for visionary productions.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-600">All Studios Verified Available</span>
            </span>
            <span className="text-neutral-400">USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

