const heroHighlights = ['K-Sauce', 'LATAM', 'Comer Corea'];

export function AboutHero() {
  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden bg-neutral-950 px-5 py-28 text-white sm:px-8 lg:min-h-screen lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(239,95,24,0.62),transparent_34%),linear-gradient(125deg,rgba(2,103,79,0.88),rgba(10,10,10,0.96)_58%,rgba(239,95,24,0.7))]" />
      <div className="absolute inset-x-5 bottom-5 top-24 rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-[2px] sm:inset-x-8 lg:inset-x-12" />
      <div className="absolute right-[-5rem] top-28 h-72 w-72 rounded-full border border-white/15 bg-white/10 blur-sm sm:h-96 sm:w-96 lg:right-24 lg:top-36" />
      <div className="absolute bottom-16 left-[-4rem] h-48 w-48 rounded-full bg-[#ef5f18]/35 blur-2xl sm:h-64 sm:w-64" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[#ef5f18] sm:text-sm">
            MOKDA Brand Essence
          </p>
          <h1 className="text-balance text-6xl font-black leading-[0.86] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            Comer Corea,
            <span className="block text-[#ef5f18]">taste the culture.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg font-semibold leading-8 text-white/82 sm:text-xl">
            MOKDA turns Korean fermented sauce culture into a bold, everyday flavor language for Latin American tables.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-black uppercase tracking-wide text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-neutral-950"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[2.25rem] border border-white/15 bg-white shadow-2xl shadow-black/30 sm:min-h-[460px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(239,95,24,0.18),transparent_34%),linear-gradient(180deg,#fff7ed,#ffffff_52%,#ecfdf5)]" />
          <div className="absolute left-1/2 top-12 h-64 w-28 -translate-x-1/2 rounded-t-[3rem] rounded-b-2xl bg-[#ef5f18] shadow-2xl shadow-orange-900/20 sm:h-80 sm:w-36">
            <div className="mx-auto mt-8 h-20 w-20 rounded-full border-4 border-white bg-[#02674f] sm:h-24 sm:w-24" />
            <div className="mx-auto mt-8 h-4 w-20 rounded-full bg-white/90 sm:w-24" />
            <div className="mx-auto mt-4 h-4 w-14 rounded-full bg-white/70 sm:w-16" />
          </div>
          <div className="absolute bottom-10 left-6 right-6 rounded-3xl bg-neutral-950 p-6 text-white sm:left-10 sm:right-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ef5f18]">Hero visual placeholder</p>
            <p className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
              Korean sauce bottle over a shared LATAM table.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
