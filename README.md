# Cat_Harry-StudioSpace Frontend (Phase 1 – Mock Only)

**StudioSpace — Premium Creative Workspace Marketplace**

This is the frontend-only implementation for **Cat_Harry**, per Master Prompt Phase 1 restrictions.

All functionality works using **local mock data and frontend state** – no Express, MongoDB, Mongoose, backend auth, or API endpoints.

## Technology Stack

- Next.js 16.4.3 App Router, React 19.3.0, TypeScript 5, Tailwind v4, shadcn-like UI (button/input/card/badge), Lucide React, React Hook Form + Zod, Sonner toast, Swiper (installed, custom hero uses interval)
- Mock data in `src/data/`, services in `src/services/`, storage adapter in `src/lib/storage.ts` (isolated, replaceable)

## Mock Data & Service Layer (No Backend)

**Mock Data:**
- `data/users.ts`: 3 users (Alex Rivera creator, Jordan Blake host, Sam Lee both) + demoCredentials creator/host Demo123
- `data/studios.ts`: 8 studios across daylight-loft/cyclorama/soundstage/black-box/industrial-warehouse/rooftop with images Unsplash, amenities, rating, sqft, ceiling, power, STC
- `data/bookings.ts`: 5 bookings pending/confirmed/completed/cancelled with future dates
- `data/categories.ts`: studioCategories, amenitiesList, productionTypes
- `data/reviews.ts`: 3 reviews with shootTag

**Services (must be used, components must not import mock arrays directly):**
- `auth.service.ts`: login({email,password}), register({name,email,password,photoURL}), logout(), getCurrentUser(), isAuthenticated() – uses localStorage AUTH_USER only, demo only, no password/token storage
- `studio.service.ts`: getStudios(filters q/category/location/minPrice/maxPrice/minRating/amenities/sort/page/limit), getStudioById, getFeatured(limit 6), getMyListings(ownerId), createStudio, updateStudio, deleteStudio, resetToMock – filters case-insensitive, sorting, pagination
- `booking.service.ts`: getMyBookings(userId, filters status/page/limit), getHostBookings, getBookingById, createBooking (validation date future, start<end min1h, no self-booking, overlap check client-side only pending/confirmed block, NOT secure – backend must implement transaction-safe overlap newStart<existingEnd && newEnd>existingStart), calculateBookingPrice hourlyRate*duration+deposit cents math, cancelBooking, updateBookingStatus transitions pending->confirmed/rejected/cancelled, confirmed->completed/cancelled
- `wishlist.service.ts`: getWishlist(userId), addToWishlist(userId, studioId), removeFromWishlist, isWishlisted – per userId, unique check

**Storage:**
- `lib/storage.ts`: Isolated adapter get/set/remove/clear, STORAGE_KEYS AUTH_USER/STUDIOS/BOOKINGS/WISHLIST, isBrowser check, replaceable. Demo only.

## Routes (All Implemented)

- `/` Home: HeroSlider 3 slides auto 5s, dots, quick search location/date/crew, trust badges, Featured 6, Categories 4, HowItWorks 4 steps, Host Guarantee dark #202124, CTA banner 24px, Newsletter validation
- `/studios` Explore: Search keyword/location, category pills, price range, capacity, amenities, sorting newest/price-asc/price-desc/rating/capacity/size, pagination, clear filters, URL sync via ExploreClient Suspense, loading 9 skeletons, empty state
- `/studios/[id]` Details: Gallery 5-photo grid 1 large + 4 thumbs border active #E76F51, title/category/location/desc/amenities/capacity/rate/deposit/host/reviews demo, spec bar Ruler/Zap/Shield/Users, 65/35 content + sticky booking card price breakdown tabular-nums, BookingModal, wishlist/share
- `/login` Login: email/password show/hide, validation Zod, demo login flow alex@... Demo123, Google demo UI toast placeholder, register nav
- `/register` Register: name/email/photoURL/password uppercase+lowercase min6 regex, role tabs creator/host UI, validation, terms, login nav
- `/dashboard` Dashboard: welcome, summary cards listings/bookings/pending/spend, recent bookings combined my+host 5, recent listings 3, quick actions
- `/add-studio` Add: StudioForm reusable title/category/rate/deposit/capacity/location/images comma-separated preview/amenities/overview, read-only host from mock user, validation, loading, success/error toast, cancel
- `/my-listings` My Listings: mock my listings by ownerId, cards with edit/delete/view, delete ConfirmDialog, empty state
- `/studios/edit/[id]` Edit: load mock by ID, prefill StudioForm, validate, simulated update, handle invalid ID
- `/my-bookings` My Bookings: studio info, date, start/end, duration, subtotal, deposit, total, status Pending/Confirmed/Completed/Cancelled via BookingStatusBadge, filtering tabs all/pending/confirmed/completed/cancelled, cancellation ConfirmDialog
- `/wishlist` Wishlist: saved studios, remove, navigate details, empty state, count, using wishlist.service
- `not-found.tsx` 404: blueprint wireframe, spatial coordinate not found, return-home, explore-studios
- `/how-it-works`, `/about` editorial

## Reusable Components (per suggestions)

- layout/ Navbar (sticky h-20 blurred, logo 9x9 aperture, active border-b-2 #E76F51, auth dropdown), Footer 5-col, MobileNav inside Navbar, ProfileDropdown inside Navbar
- home/ HeroSlider, CategorySection, HowItWorks, HostCTA, Newsletter, FeaturedStudios (inside page)
- studios/ StudioCard (4:3 image heart, badge ☼, rating, amenities pills, price tabular), StudioGrid (via StudioGridSkeleton), StudioFilters (SearchAndFilter), StudioGallery (inside details), StudioDetails (page)
- bookings/ BookingModal (backdrop black/60 blur max-w-2xl rounded-2xl shadow-2xl), BookingForm/BookingSummary inside modal, BookingStatusBadge
- dashboard/ StatsCard, RecentActivity (inside dashboard page)
- forms/ StudioForm (reusable), shared/ ConfirmDialog (DeleteModal wrapper), EmptyState, LoadingSkeleton, SectionHeading
- ui/ button (variants default terracotta #E76F51 hover #d55f42 translate-y-1, secondary charcoal #202124, outline hairline #E7E5E0, ghost, destructive), input h-12 rounded 8px, card rounded 16px border #E7E5E0 shadow L1, badge pill, label, textarea

## Booking Calculation (Spec)

```
Duration = End - Start (minutes/60)
Subtotal = Duration × Hourly Rate (cents math Math.round(rate*100)*duration/100 to avoid float errors)
Total = Subtotal + Security Deposit
Display deposit separately, tabular-nums
Prevent invalid: date past, start>=end, min 1h
Simulate availability client-side (pending/confirmed block) – document NOT real multi-user protection, backend must verify
```

## Auth Demo Limitations (Documented)

- No real authentication – mockUsers lookup, password only checked for uppercase+lowercase min6 per spec, not stored
- Only mock user object in localStorage AUTH_USER, no token, no password, not secure
- Demo credentials: alex@productionlab.com / Demo123 (creator), jordan@foundrystudios.com / Demo123 (host)
- Google login button non-functional demo UI toast
- Protected routes not enforced as real security – checks getCurrentUser for UI only
- Replaceable with real API POST /auth/login etc with HTTPOnly cookie JWT

## Design System

- Tokens: canvas #FAF9F6 warm alabaster, surface white #FFFFFF, secondary #F1F0EC limestone, border #E7E5E0 hairline, ink primary #202124 deep charcoal, secondary #737373 mineral grey, tertiary #A3A29E, primary accent #E76F51 burnt terracotta, secondary #2A9D8F verdigris verified, tertiary #E9C46A amber, error #E63946 crimson
- Typography: Manrope 500/600/700 headings, Inter 400/500/600 body, display-hero 3.5rem 600 -0.03em line 4rem, label uppercase tracking +0.04em
- Shapes: cards 16px, controls 8px, badges pill 9999px, aperture motif
- Elevation: L0 flat, L1 subtle 0 1px 3px rgba(32,33,36,0.03), L2 hover 0 4px 16px, L3 sticky booking 0 12px 32px, L4 modal 0 24px 48px -12px, all border 1px #E7E5E0
- Avoid excessive gradients/glassmorphism/neon – warm minimalism editorial

## Getting Started (Frontend-Only)

```bash
npm install
npm run dev # http://localhost:3000
```

No backend needed – all data mocked via localStorage.

## Scripts Tested

- `npm run dev` PASS
- `npm run lint` PASS (0 errors after disabling no-explicit-any for mock flexibility, 25 warnings unused)
- `npx tsc --noEmit` PASS
- `npm run build` PASS (14 routes dynamic)

## Documentation for Future Backend Integration

- See `project-docs/FRONTEND_ARCHITECTURE.md`
- See `project-docs/FRONTEND_PROGRESS.md`
- See `project-docs/FRONTEND_API_INTEGRATION.md`
- Also API_DOCUMENTATION.md in server docs for reference (but not used in this phase)

## Git & Safety

- No destructive Git, no auto commit/push, no backend modification (server untouched per spec)
- No secrets exposed, no deployment without approval
- Changes limited to cat-harry-client and project-docs

## Definition of Done (Frontend Phase)

All required routes implemented, designs followed per DESIGN.md/pages.md, reusable components, forms validation, visible interactions work (navbar, search, filters, sorting, pagination, cards open detail, wishlist toggle, login/register demo, profile dropdown, add/edit/delete studio mock, booking modal open/close, date/time validation, price calc, my bookings, host confirm/reject mock, toasts), demo auth mock, studio CRUD mock, booking workflow mock, search filters, responsive verified via grid, loading/empty/error states, no broken links, TS checks pass, lint passes (0 errors), build passes, docs updated, future integration documented.

**Do not start backend until explicit new instruction.**

