export function AboutHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-5 py-28 text-center text-white sm:px-8">
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet="/assets/assetshero-1-desktop.webp" />
        <img
          src="/assets/assetshero-1-mobile.webp"
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-x-0 bottom-0 h-28 rounded-t-[50%] bg-white" />

      <div className="relative z-10 mx-auto max-w-5xl pt-20">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.34em] text-[#ef5f18] sm:text-sm">
          MOKDA Brand Essence
        </p>
        <h1 className="break-keep text-balance text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
          Comer Corea
          <br />
          <span className="text-[#ef5f18]">한국을 먹다</span>
        </h1>
      </div>
    </section>
  );
}
