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
    <footer className="bg-neutral-950 py-12 text-white border-t border-neutral-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-5 px-4 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white/90">
          {current.follow}
        </h2>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/salsa_coreana/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/80 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:opacity-100"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@salsa_coreana"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-white/80 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:opacity-100"
          >
            TikTok
          </a>
        </div>
        <p className="text-sm font-semibold text-white/40 mt-3">
          {current.copyright}
        </p>
      </div>
    </footer>
  );
}
