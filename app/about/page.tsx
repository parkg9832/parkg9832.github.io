'use client';

// MOKDA About Us page with dynamic translations
import { Header } from '@/components/layout/Header';
import { AboutContact } from '@/components/about/AboutContact';
import { BrandLogo } from '@/components/about/BrandLogo';
import { AboutHero } from '@/components/about/AboutHero';
import { BrandStory } from '@/components/about/BrandStory';
import { ProductShowcase } from '@/components/product/ProductShowcase';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <Header />
      <AboutHero />
      <BrandStory />
      <BrandLogo />
      <ProductShowcase />
      <AboutContact />
    </main>
  );
}
