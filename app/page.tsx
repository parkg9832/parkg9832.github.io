'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/LanguageContext';
import { translations } from '@/translations';
import { Header } from '@/components/layout/Header';
import { ProductShowcase } from '@/components/product/ProductShowcase';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedStoreId, setSelectedStoreId] = useState('mexico');
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const heroSlides = [
    {
      desktopImage: '/assets/assetshero-1-desktop.jpg.png',
      mobileImage: '/assets/assetshero-1-mobile.jpg.png',
      href: '/products',
      copy: {
        en: {
          kicker: 'PRODUCT LINEUP',
          title: 'The New Standard of Korean Flavor',
          subtitle: 'Explore our premium lineup of authentic sauces crafted to captivate global palates.',
          button: 'Explore Lineup',
        },
        es: {
          kicker: 'LÍNEA PREMIUM',
          title: 'El Estándar del Sabor Coreano',
          subtitle: 'Descubre nuestra línea premium de salsas auténticas diseñadas para cautivar paladares globales.',
          button: 'Explorar Línea',
        },
        ko: {
          kicker: 'COMER COREA',
          title: 'K-컬쳐를 가장 맛있게 경험하는 방법',
          subtitle: '익숙한 음식 위에 더해지는 한 방울로, 더 가까워지는 한국',
          button: '라인업 보기',
        },
      },
    },
    {
      desktopImage: '/assets/assetshero-2-desktop.jpg.png',
      mobileImage: '/assets/assetshero-2-mobile.jpg.png',
      href: '#map',
      copy: {
        en: {
          kicker: 'KOREA NEAR ME',
          title: 'MOKDA Across Latin America',
          subtitle: 'Find official retailers and dining spots near you experiencing the taste of MOKDA.',
          button: 'View Spots Map',
        },
        es: {
          kicker: 'SPOTS OFICIALES',
          title: 'MOKDA en América Latina',
          subtitle: 'Encuentra los puntos de venta oficiales y restaurantes aliados que ya comparten la experiencia MOKDA.',
          button: 'Ver Mapa de Spots',
        },
        ko: {
          kicker: 'MOKDA SPOT',
          title: '라틴아메리카 전역에서 만나는 MOKDA',
          subtitle: '지금 가장 핫한 현지 공식 판매처에서 한국의 맛을 직접 경험해보세요.',
          button: '스팟 지도 보기',
        },
      },
    },
    {
      desktopImage: '/assets/assetshero-3-desktop.jpg.png',
      mobileImage: '/assets/assetshero-3-mobile.jpg.png',
      href: '#partnership',
      copy: {
        en: {
          kicker: 'B2B PARTNERSHIP',
          title: 'Partner with MOKDA for Success',
          subtitle: 'Elevate your menu and drive business growth with authentic Korean flavors. Discover our B2B solutions.',
          button: 'Contact B2B',
        },
        es: {
          kicker: 'SOLUCIONES B2B',
          title: 'Lleva MOKDA a tu Negocio',
          subtitle: 'Impulsa tus ventas y transforma tu menú con el auténtico sabor coreano. Conoce nuestras soluciones B2B.',
          button: 'Iniciar Consulta B2B',
        },
        ko: {
          kicker: 'B2B 파트너십',
          title: '성공적인 비즈니스를 위한 파트너십',
          subtitle: '새로운 월드 트렌드 K-컬쳐,\nMOKDA의 맞춤형 B2B 파트너십을 제안합니다.',
          button: '비즈니스 문의하기',
        },
      },
    },
  ];

  const stores = [
    {
      id: 'mexico',
      name: 'MOKDA Seoul Market',
      address: 'Av. Insurgentes Sur 1458, CDMX',
      tag: 'Open',
      mapUrl: 'https://maps.google.com/maps?q=Av.+Insurgentes+Sur+1458,+CDMX&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    {
      id: 'peru',
      name: 'K-Food Corner Lima',
      address: 'Av. José Larco 812, Miraflores',
      tag: 'Open',
      mapUrl: 'https://maps.google.com/maps?q=Av.+Jos%C3%A9+Larco+812,+Miraflores&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    {
      id: 'colombia',
      name: 'Casa Corea Gourmet',
      address: 'Cra. 13 #82-19, Bogotá',
      tag: 'Soon',
      mapUrl: 'https://maps.google.com/maps?q=Cra.+13+%2382-19,+Bogot%C3%A1&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
  ];

  const countries = {
    es: [
      { code: 'MX', name: 'México' },
      { code: 'PE', name: 'Perú' },
      { code: 'CO', name: 'Colombia' },
      { code: 'CL', name: 'Chile' },
      { code: 'AR', name: 'Argentina' },
      { code: 'OTHER', name: 'Otro' },
    ],
    en: [
      { code: 'MX', name: 'Mexico' },
      { code: 'PE', name: 'Peru' },
      { code: 'CO', name: 'Colombia' },
      { code: 'CL', name: 'Chile' },
      { code: 'AR', name: 'Argentina' },
      { code: 'OTHER', name: 'Other' },
    ],
    ko: [
      { code: 'MX', name: '멕시코' },
      { code: 'PE', name: '페루' },
      { code: 'CO', name: '콜롬비아' },
      { code: 'CL', name: '칠레' },
      { code: 'AR', name: '아르헨티나' },
      { code: 'OTHER', name: '기타' },
    ],
  };

  const b2bLabels = {
    es: {
      kicker: 'WHOLESALE / CONSULTA B2B',
      title: 'Alianzas Comerciales / B2B',
      description: 'Lleva el auténtico sabor coreano a tu anaquel, menú o portafolio de distribución con MOKDA.',
      company: 'Empresa',
      companyPlaceholder: 'Nombre de la empresa',
      name: 'Contacto',
      namePlaceholder: 'Nombre completo',
      email: 'Correo corporativo',
      emailPlaceholder: 'tu@email.com',
      market: 'Mercado',
      marketPlaceholder: 'Selecciona un país',
      message: 'Necesidad comercial',
      messagePlaceholder: 'Cuéntanos sobre tu canal, volumen o propuesta de alianza',
      submit: 'Enviar Consulta B2B',
      footer: '© 2026 MOKDA. Todos los derechos reservados.',
    },
    en: {
      kicker: 'WHOLESALE / B2B INQUIRY',
      title: 'Business Partnership',
      description: 'Bring authentic Korean flavor into your retail shelf, restaurant menu, or distribution portfolio with MOKDA.',
      company: 'Company',
      companyPlaceholder: 'Company name',
      name: 'Contact Name',
      namePlaceholder: 'Your full name',
      email: 'Business Email',
      emailPlaceholder: 'you@email.com',
      market: 'Market',
      marketPlaceholder: 'Select your country',
      message: 'Business Needs',
      messagePlaceholder: 'Tell us about your channel, volume, or partnership request',
      submit: 'Send Business Inquiry',
      footer: '© 2026 MOKDA. All rights reserved.',
    },
    ko: {
      kicker: 'B2B PARTNERSHIP',
      title: '비즈니스 파트너십',
      description: '새로운 월드 트렌드 K-컬쳐, MOKDA의 맞춤형 B2B 파트너십을 제안합니다.',
      company: '회사명',
      companyPlaceholder: '회사명을 입력해주세요',
      name: '담당자명',
      namePlaceholder: '성함을 입력해주세요',
      email: '비즈니스 이메일',
      emailPlaceholder: '이메일을 입력해주세요',
      market: '진출 국가',
      marketPlaceholder: '국가를 선택해주세요',
      message: '문의 내용',
      messagePlaceholder: '유통 채널, 예상 물량, 파트너십 제안을 알려주세요',
      submit: 'B2B 문의 보내기',
      footer: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  useEffect(() => {
    // Autoplay carousel slides
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, []);

  const handleSlideSelect = (idx: number) => {
    setCurrentSlide(idx);
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
    }
  };

  const currentB2b = b2bLabels[lang] || b2bLabels.es;
  const currentCountries = countries[lang] || countries.es;
  const selectedStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* Encapsulated Header */}
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative h-screen min-h-[560px] overflow-hidden bg-neutral-950 text-white sm:min-h-[620px]">
        <div className="relative h-full w-full overflow-hidden">
          {heroSlides.map((slide, index) => {
            const isVisible = index === currentSlide;
            const slideCopy = slide.copy[lang] || slide.copy.es;

            return (
              <div
                key={index}
                className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
                  isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Responsive background image */}
                <img src={slide.mobileImage} alt="" className="absolute inset-0 block h-full w-full object-cover md:hidden" />
                <img src={slide.desktopImage} alt="" className="absolute inset-0 hidden h-full w-full object-cover md:block" />
                <div className="absolute inset-0 bg-black/60" />

                {/* Hero text */}
                <div className="relative z-20 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-4 pt-28 pb-20 sm:px-6 lg:px-8 lg:pt-36 lg:pb-28">
                  <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[#ef5f18] [text-shadow:_0_3px_8px_rgba(0,0,0,0.9)] sm:text-sm">
                    {slideCopy.kicker}
                  </p>
                  <h1 className="max-w-5xl break-keep text-balance text-5xl font-black leading-[0.9] tracking-tight text-white [font-family:Urbanist,sans-serif] [text-shadow:_0_6px_24px_rgba(0,0,0,0.9)] sm:text-7xl md:text-8xl lg:text-9xl">
                    {slideCopy.title}
                  </h1>
                  <p className="mt-6 max-w-2xl break-keep text-pretty text-base font-semibold leading-relaxed text-white/85 [text-shadow:_0_3px_12px_rgba(0,0,0,0.75)] sm:text-xl">
                    {slideCopy.subtitle}
                  </p>
                  <Link
                    href={slide.href}
                    className="mt-8 inline-flex w-fit items-center rounded-full bg-[#ef5f18] px-7 py-3 text-sm font-black text-white shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl"
                  >
                    {slideCopy.button}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSlideSelect(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-[#ef5f18] w-6' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Products Showcase */}
      <ProductShowcase />

      {/* Marquee Banner */}
      <section className="bg-orange-500 text-white py-4 overflow-hidden relative border-y border-orange-600">
        <div className="flex w-max animate-marquee space-x-16 px-4 text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white [font-family:'Syne',sans-serif]">
          <div className="flex items-center space-x-16 shrink-0">
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
          </div>
          <div className="flex items-center space-x-16 shrink-0">
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
            <span>Corea, más cerca de ti</span>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="bg-stone-50 bg-[radial-gradient(rgba(229,231,235,0.35)_1px,transparent_1px)] [background-size:20px_20px] py-20 sm:py-28">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="mb-5 text-sm font-black uppercase tracking-wide text-[#ef5f18]">
                {t.ourStory.kicker}
              </p>
              <h2
                className="break-keep text-4xl font-black leading-tight tracking-tight text-neutral-950 md:text-6xl"
                dangerouslySetInnerHTML={{ __html: t.ourStory.title }}
              />
            </div>
            <div className="md:flex md:items-center md:pt-8">
              <div className="flex flex-col justify-center space-y-5 break-keep text-gray-700 leading-relaxed md:text-lg">
                {t.ourStory.paragraphs.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>
            </div>
          </div>

          <div className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl shadow-neutral-950/10 md:h-[600px]">
            <img
              src="/assets/story-vibe.png"
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <Link
              href="/about"
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 no-underline group-hover:opacity-100"
            >
              <span className="text-xl font-medium tracking-wide text-white md:text-3xl">
                {t.nav.about} <span className="ml-1">&gt;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latin American Spots Map Section */}
      <section id="map" className="relative bg-[#ef5f18] py-20 text-white sm:py-28">
        <svg className="pointer-events-none absolute -top-12 left-0 h-12 w-full text-[#ef5f18] md:-top-20 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0,80 C160,20 320,20 480,70 C640,120 800,120 960,62 C1080,18 1160,26 1200,42 L1200,120 L0,120 Z" />
        </svg>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:px-8">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-white/70">MOKDA SPOT</p>
            <h2 className="break-keep text-balance text-5xl font-black leading-none tracking-tight sm:text-6xl md:text-7xl">
              Where to Find MOKDA
            </h2>
            <div className="mt-8 max-h-[300px] overflow-y-auto rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:mt-10 md:max-h-[400px] md:p-5">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`w-full text-left mb-3 p-4 rounded-2xl transition-all border duration-200 flex items-center justify-between ${
                    selectedStoreId === store.id
                      ? 'bg-white text-neutral-950 border-white shadow-lg'
                      : 'border-white/10 hover:bg-white/5 text-white'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-lg">{store.name}</h4>
                    <p className={`text-sm ${selectedStoreId === store.id ? 'text-gray-500' : 'text-white/70'}`}>
                      {store.address}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    store.tag === 'Open'
                      ? 'bg-[#02674f] text-white'
                      : 'bg-yellow-400 text-black'
                  }`}>
                    {store.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative min-h-[460px] w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-orange-950/20">
            <iframe
              src={selectedStore.mapUrl}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MOKDA LATAM map"
              className="absolute inset-0 h-full w-full rounded-3xl border-0"
            />
          </div>
        </div>
      </section>

      {/* B2B / Partnership Section */}
      <section id="partnership" className="bg-stone-50 bg-[radial-gradient(rgba(229,231,235,0.35)_1px,transparent_1px)] [background-size:20px_20px] py-20 sm:py-28">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-[#ef5f18]">{currentB2b.kicker}</p>
            <h2 className="break-keep text-balance text-4xl font-black leading-none tracking-tight text-neutral-950 sm:text-5xl md:text-6xl">
              {currentB2b.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl break-keep text-pretty text-lg font-semibold leading-relaxed text-neutral-600 sm:text-xl">
              {currentB2b.description}
            </p>
          </div>
          <form className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl shadow-orange-900/5 md:p-12">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">{currentB2b.company}</span>
                <input
                  type="text"
                  placeholder={currentB2b.companyPlaceholder}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">{currentB2b.name}</span>
                <input
                  type="text"
                  placeholder={currentB2b.namePlaceholder}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">{currentB2b.email}</span>
                <input
                  type="email"
                  placeholder={currentB2b.emailPlaceholder}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">{currentB2b.market}</span>
                <select
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-orange-500 focus:bg-white"
                >
                  <option value="">{currentB2b.marketPlaceholder}</option>
                  {currentCountries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-gray-700">{currentB2b.message}</span>
                <textarea
                  rows={6}
                  placeholder={currentB2b.messagePlaceholder}
                  required
                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef5f18] px-9 py-4 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg focus:outline-none"
              >
                <span>{currentB2b.submit}</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" stroke-width="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
