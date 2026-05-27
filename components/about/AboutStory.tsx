const storyParagraphs = [
  'In 2024, a young Korean founder left for South America with one bag and a question: how can Korean flavor become part of everyday Latin meals?',
  'In a small shared kitchen, the answer became clear. The easiest way to experience a culture is to eat together.',
  'MOKDA began for people who love Korea, and for Koreans who love Latin America. It is not just sauce. It is a bridge between tables, habits, and cravings.',
];

export function AboutStory() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="absolute left-0 right-0 top-0 h-20 rounded-b-[50%] bg-white" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.32em] text-[#ef5f18]">
            About Brand
          </p>
          <h2 className="text-balance text-5xl font-black leading-none tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            A story born in a student kitchen.
          </h2>
        </div>

        <div className="mx-auto max-w-prose lg:mx-0">
          <blockquote className="border-l-4 border-[#ef5f18] pl-6 text-3xl font-black leading-tight tracking-tight text-neutral-950 sm:text-4xl">
            The simplest way to experience a culture is to eat together.
          </blockquote>
          <div className="mt-10 space-y-7 text-lg font-semibold leading-8 text-neutral-600">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {['Korean heritage', 'Latin appetite', 'Everyday fusion'].map((item) => (
              <div key={item} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-sm font-black uppercase tracking-wide text-[#02674f]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
