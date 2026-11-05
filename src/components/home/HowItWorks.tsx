export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-12 md:py-20 lg:py-24 overflow-x-hidden">
      <div className="grid gap-8 sm:gap-10 md:grid-cols-3 lg:gap-12">
        <div className="md:col-span-1 min-w-0">
          <h2 className="font-[Manrope] text-[24px] sm:text-3xl font-semibold break-words leading-tight">How Booking Works</h2>
          <p className="mt-3 sm:mt-4 text-[13px] sm:text-sm leading-6 text-neutral-600 break-words">From discovery to call sheet in four deliberate steps.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 min-w-0">
          {[
            { step: "01", title: "Discover & Filter", desc: "Search by daylight orientation, power specs, ceiling height, and acoustic rating." },
            { step: "02", title: "Verify & Inspect", desc: "High-res gallery, CAD floor plans, and electrical rigging sheets." },
            { step: "03", title: "Reserve & Insure", desc: "Instant booking, COI verification, and security deposit handling." },
            { step: "04", title: "Create & Wrap", desc: "Gate codes, tech contacts, and post-shoot invoicing." },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 sm:gap-4 min-w-0">
              <span className="font-[Manrope] text-2xl sm:text-3xl font-bold text-[#E7E5E0] shrink-0">{item.step}</span>
              <div className="min-w-0">
                <h4 className="font-semibold break-words text-[14px] sm:text-[15px]">{item.title}</h4>
                <p className="mt-1 text-[13px] sm:text-sm text-neutral-600 break-words leading-5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

