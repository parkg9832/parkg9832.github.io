'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/translations';
import { useLanguage } from '@/app/LanguageContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, changeLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLangIndex = (currentLang: Locale) => {
    const indices: Record<Locale, number> = { es: 0, ko: 1, en: 2 };
    return indices[currentLang] ?? 0;
  };

  // Determine styles based on scroll state
  const headerBgClass = isScrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100'
    : 'bg-transparent';
  
  const logoSrc = '/assets/assetlogo-1-.png';

  return (
    <header
      id="main-header"
      className={`fixed left-0 top-0 z-50 h-20 w-full transition-all duration-300 ${headerBgClass}`}
    >
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="inline-flex flex-shrink-0 items-center" aria-label="MOKDA home">
            <img src={logoSrc} alt="MOKDA" className="h-6 w-auto sm:h-9" />
          </Link>
        </div>

        <div className="flex items-center">
          {/* Language Switcher */}
          <div
            id="lang-selector"
            className="relative flex items-center bg-stone-100/90 rounded-full p-1 cursor-pointer w-fit shadow-sm border border-stone-200/50"
            aria-label="Language switcher"
          >
            <div
              id="lang-bg"
              className="absolute left-1 top-1 bottom-1 w-10 sm:w-12 bg-[#ef5f18] rounded-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(${getLangIndex(lang) * 100}%)` }}
            />
            <button
              onClick={() => changeLanguage('es')}
              type="button"
              className={`relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black transition-colors duration-300 ${
                lang === 'es' ? 'text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => changeLanguage('ko')}
              type="button"
              className={`relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black transition-colors duration-300 ${
                lang === 'ko' ? 'text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              KR
            </button>
            <button
              onClick={() => changeLanguage('en')}
              type="button"
              className={`relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black transition-colors duration-300 ${
                lang === 'en' ? 'text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
