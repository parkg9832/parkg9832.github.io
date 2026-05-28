'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/LanguageContext';
import { Header } from '@/components/layout/Header';
import { translations } from '@/translations';

export default function ProductsPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Map subpage general copy dynamically by locale
  const subpageGeneralCopy = {
    es: {
      kicker: 'Historia del Producto',
      headline: 'LÍNEA PREMIUM MOKDA',
      subtitle: 'La profundidad de la salsa coreana, embotellada para cocinas, restaurantes y mesas de América Latina.',
      btnText: 'Ver Producto ↗',
      footer: '© 2026 MOKDA. Todos los derechos reservados.',
    },
    en: {
      kicker: 'Product Story',
      headline: 'MOKDA PREMIUM LINEUP',
      subtitle: 'Korean sauce depth, bottled for Latin American kitchens, restaurants, and everyday tables.',
      btnText: 'View Product ↗',
      footer: '© 2026 MOKDA. All rights reserved.',
    },
    ko: {
      kicker: 'Product Story',
      headline: '프리미엄 라인업',
      subtitle: '라틴아메리카의 일상 식탁에 딱 맞춘 트렌디한 한국의 소스 맛.',
      btnText: '상품보기 ↗',
      footer: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  const copy = subpageGeneralCopy[lang] || subpageGeneralCopy.es;

  // Fully bind products content to translations.ts global dictionary
  const productsList = [
    {
      kicker: t.products.items.original.category,
      name: t.products.items.original.title,
      desc: `${t.products.items.original.descLine1} ${t.products.items.original.descLine2}`,
      btn: copy.btnText,
      color: 'text-red-600',
      image: '/assets/bottle-original.png.png',
    },
    {
      kicker: t.products.items.ssamjang.category,
      name: t.products.items.ssamjang.title,
      desc: `${t.products.items.ssamjang.descLine1} ${t.products.items.ssamjang.descLine2}`,
      btn: copy.btnText,
      color: 'text-yellow-500',
      image: '/assets/bottle-ssamjang.png.png',
    },
    {
      kicker: t.products.items.soySauce.category,
      name: t.products.items.soySauce.title,
      desc: `${t.products.items.soySauce.descLine1} ${t.products.items.soySauce.descLine2}`,
      btn: copy.btnText,
      color: 'text-[#2d1a11]',
      image: '/assets/bottle-sweetsoy.png.png',
    },
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Encapsulated Header using global context */}
      <Header />

      {/* Hero Section */}
      <section className="bg-white bg-[radial-gradient(rgba(229,231,235,0.45)_1px,transparent_1px)] [background-size:20px_20px] pt-32 pb-14 sm:py-20 sm:pt-40">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.34em] text-[#ef5f18]">
            {copy.kicker}
          </p>
          <h1 className="max-w-5xl break-keep text-balance text-5xl font-black leading-none tracking-tight text-neutral-950 sm:text-7xl md:text-8xl">
            {copy.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg font-semibold leading-relaxed text-gray-600 sm:text-xl">
            {copy.subtitle}
          </p>
        </div>
      </section>

      {/* Product Showcase alternated layout */}
      <section className="bg-white bg-[radial-gradient(rgba(229,231,235,0.45)_1px,transparent_1px)] [background-size:20px_20px] pb-16">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {productsList.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <article
                key={item.name}
                className={`flex flex-col-reverse items-center justify-between gap-12 py-12 md:py-16 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                } ${
                  !isEven
                    ? 'bg-stone-50 bg-[radial-gradient(rgba(229,231,235,0.35)_1px,transparent_1px)] [background-size:20px_20px] px-6 py-12 rounded-[3rem] rounded-tl-[6rem] rounded-br-[6rem] md:px-14 md:rounded-tl-[12rem] md:rounded-br-[10rem] md:rounded-tr-[3rem] md:rounded-bl-[3rem]'
                    : ''
                }`}
              >
                {/* Text Block */}
                <div className="w-full md:w-1/2">
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-[#ef5f18]">
                    {item.kicker}
                  </p>
                  <h2 className={`mb-4 text-4xl font-black tracking-tight ${item.color} md:text-5xl`}>
                    {item.name}
                  </h2>
                  <p className="mb-8 text-base leading-relaxed text-gray-600 max-w-lg">
                    {item.desc}
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-yellow-500 text-sm"
                  >
                    {item.btn}
                  </Link>
                </div>

                {/* Image Block */}
                <div className="flex w-full justify-center md:w-1/2">
                  <img
                    src={item.image}
                    alt={`Salsa MOKDA ${item.name}`}
                    className="w-full max-w-xs max-h-[360px] object-contain transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Social Banner */}
      <section id="socialBanner" className="bg-[#ef5f18] py-8 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center gap-6 px-4">
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-2xl font-black tracking-tight uppercase">SÍGUENOS</h2>
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
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-neutral-950 py-12 text-white border-t border-neutral-800">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-white/60">
            {copy.footer}
          </p>
        </div>
      </footer>
    </main>
  );
}
