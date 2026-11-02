export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="font-[Manrope] text-3xl font-semibold">How Booking Works</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-600">From discovery to call sheet in four deliberate steps.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            { step: "01", title: "Discover & Filter", desc: "Search by daylight orientation, power specs, ceiling height, and acoustic rating." },
            { step: "02", title: "Verify & Inspect", desc: "High-res gallery, CAD floor plans, and electrical rigging sheets." },
            { step: "03", title: "Reserve & Insure", desc: "Instant booking, COI verification, and security deposit handling." },
            { step: "04", title: "Create & Wrap", desc: "Gate codes, tech contacts, and post-shoot invoicing." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <span className="font-[Manrope] text-3xl font-bold text-[#E7E5E0]">{item.step}</span>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

