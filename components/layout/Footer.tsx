'use client';

import { useLanguage } from '@/app/LanguageContext';

export function Footer() {
  const { lang } = useLanguage();

  const footerContent = {
    es: {
      follow: 'SÍGUENOS',
      copyright: '© 2026 MOKDA. Todos los derechos reservados.',
    },
    en: {
      follow: 'FOLLOW US',
      copyright: '© 2026 MOKDA. All rights reserved.',
    },
    ko: {
      follow: 'SÍGUENOS',
      copyright: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  const current = footerContent[lang] || footerContent.es;

  return (
    <footer className="text-white">
      <section className="bg-[#ef5f18] py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-5 px-4 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {current.follow}
          </h2>
          <div className="flex items-center gap-8">
            <a
              href="https://www.instagram.com/salsa_coreana/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:opacity-75"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-9 w-9 fill-none stroke-current stroke-2 md:h-10 md:w-10"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@salsa_coreana"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:opacity-75"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-9 w-9 fill-current md:h-10 md:w-10"
              >
                <path d="M16.55 3c.24 2.08 1.42 3.55 3.45 4.13v3.16a7.45 7.45 0 0 1-3.36-.86v5.91c0 3.48-2.31 5.66-5.63 5.66-3.03 0-5.01-1.88-5.01-4.72 0-3.12 2.42-4.95 5.77-4.62v3.22c-1.49-.27-2.42.29-2.42 1.31 0 .85.66 1.42 1.63 1.42 1.1 0 1.82-.69 1.82-2.17V3h3.75Z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section className="border-t border-neutral-900 bg-neutral-950 py-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-white/60">
            {current.copyright}
          </p>
        </div>
      </section>
    </footer>
  );
}
