'use client';

import { useLanguage } from '@/app/LanguageContext';
import { translations } from '@/translations';
import { motion } from 'framer-motion';

export function BrandLogo() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Internal dictionary specifically for the Brand Logo cards to support KR, EN, ES
  const copy = {
    es: {
      motiveKicker: 'Motivo',
      motiveTitle: 'La primera inspiración que se despliega en tu cocina',
      motiveDesc: 'La silueta de la botella en el logo significa que MOKDA puede ser el primer paso en cada receta K.',
      orangeTitle: 'Pasión y Energía Picante',
      greenTitle: 'Equilibrio de Frescura',
    },
    en: {
      motiveKicker: 'Motive',
      motiveTitle: 'The first inspiration unfolding in your kitchen',
      motiveDesc: 'The bottle silhouette in the logo signifies that MOKDA can be the first step in every K-recipe.',
      orangeTitle: 'Passion & Spicy Energy',
      greenTitle: 'Balance of Freshness',
    },
    ko: {
      motiveKicker: 'Motive',
      motiveTitle: '당신의 주방에서 펼쳐질 첫 번째 영감',
      motiveDesc: '로고 속 보틀 실루엣은 MOKDA가 모든 K-레시피의 첫 단추가 될 수 있다는 의미를 담고 있습니다.',
      orangeTitle: '열정과 매운맛의 에너지',
      greenTitle: '신선함과 일상성의 균형',
    },
  };

  const currentCopy = copy[lang] || copy.es;

  return (
    <section className="bg-neutral-50 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.28em] text-neutral-500">
            {t.brandLogo.kicker}
          </p>
          <h2 
            className="break-keep text-balance text-5xl font-black leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
            dangerouslySetInnerHTML={{ __html: t.brandLogo.title }}
          />
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.1fr_0.95fr] lg:items-center">
          {/* Motive Card */}
          <motion.article 
            className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-neutral-950/5 h-full flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#ef5f18]">
              {currentCopy.motiveKicker}
            </p>
            <h3 className="break-keep text-3xl font-black leading-tight text-neutral-950">
              {currentCopy.motiveTitle}
            </h3>
            <p className="mt-5 break-keep text-base font-semibold leading-7 text-gray-500">
              {currentCopy.motiveDesc}
            </p>
          </motion.article>

          {/* Central Logo Box */}
          <motion.div 
            className="flex min-h-[360px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-10 shadow-xl shadow-neutral-950/5 ring-1 ring-neutral-950/5 h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <img src="/assets/Favicon.png" alt="MOKDA symbol" className="h-28 w-28 object-contain transition-transform duration-300 hover:scale-110" />
            <img src="/assets/assetlogo-1-.png" alt="MOKDA wordmark" className="mt-10 h-10 w-auto object-contain" />
          </motion.div>

          {/* Color Identity Card */}
          <article className="grid gap-4 h-full">
            <motion.div 
              className="rounded-[2rem] bg-[#ef5f18] p-8 text-white shadow-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">
                Burning Orange · #ef5f18
              </p>
              <h3 className="mt-3 text-3xl font-black">
                {currentCopy.orangeTitle}
              </h3>
            </motion.div>
            <motion.div 
              className="rounded-[2rem] bg-[#02674f] p-8 text-white shadow-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">
                Dip Green · #02674f
              </p>
              <h3 className="mt-3 text-3xl font-black">
                {currentCopy.greenTitle}
              </h3>
            </motion.div>
          </article>
        </div>
      </div>
    </section>
  );
}
