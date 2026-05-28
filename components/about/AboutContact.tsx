export function AboutContact() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.25rem] bg-neutral-950 text-white lg:grid-cols-[0.92fr_1.08fr]">
        <div className="min-h-[360px] bg-[radial-gradient(circle_at_30%_24%,rgba(239,95,24,0.58),transparent_34%),linear-gradient(140deg,#02674f,#111827_62%,#ef5f18)] p-8 sm:p-12 lg:p-14">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-white/70">Partner CTA</p>
          <h2 className="mt-6 text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
            Bring K-Sauce to the next table
          </h2>
        </div>
        <div className="p-8 sm:p-12 lg:p-14">
          <p className="max-w-2xl text-xl font-semibold leading-9 text-white/78">
            Use this area for B2B inquiries, distributor proposals, retail buyer contact, or a direct WhatsApp Business entry point.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-black uppercase tracking-wide text-[#ef5f18]">Primary market</p>
              <p className="mt-3 text-2xl font-black">Mexico / Peru</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-black uppercase tracking-wide text-[#ef5f18]">Channel</p>
              <p className="mt-3 text-2xl font-black">Retail / HORECA</p>
            </div>
          </div>
          <a
            href="mailto:hello@mokda.example"
            className="mt-10 inline-flex rounded-full bg-[#ef5f18] px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950"
          >
            Start partnership
          </a>
        </div>
      </div>
    </section>
  );
}
