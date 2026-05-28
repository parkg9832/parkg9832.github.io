'use client';

import { useLanguage } from '@/app/LanguageContext';
import { translations } from '@/translations';
import { ProductCard } from './ProductCard';

export interface Product {
  category: string;
  title: string;
  titleColor: string;
  imageUrl: string;
  href: string;
  descLine1: string;
  descLine2: string;
}


export function ProductShowcase() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const productsList = [
    {
      ...t.products.items.original,
      titleColor: 'text-red-600',
      imageUrl: '/assets/bottle-original.png.png',
      href: '/products/',
    },
    {
      ...t.products.items.ssamjang,
      titleColor: 'text-yellow-500',
      imageUrl: '/assets/bottle-ssamjang.png.png',
      href: '/products/',
    },
    {
      ...t.products.items.soySauce,
      titleColor: 'text-[#2d1a11]',
      imageUrl: '/assets/bottle-sweetsoy.png.png',
      href: '/products/',
    },
  ];

  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 break-keep text-sm font-bold uppercase tracking-[0.24em] text-gray-500">
          {t.products.kicker}
        </p>
        <h2 className="break-keep text-4xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          {t.products.title}
        </h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {productsList.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </section>
  );
}
