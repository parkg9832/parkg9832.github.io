'use client';

import { useLanguage } from '@/app/LanguageContext';
import { translations } from '@/translations';

export function BrandStory() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            {t.brandStory.kicker}
          </p>
          <h2 className="mb-8 break-keep text-3xl font-bold leading-tight text-neutral-950 md:text-4xl">
            {t.brandStory.title}
          </h2>
          <div className="space-y-4 text-gray-700">
            {t.brandStory.paragraphs.map((paragraph, index) => (
              <p key={index} className="break-keep leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full shadow-lg">
          <img
            src="/assets/story-vibe.png"
            alt="Brand Story"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
