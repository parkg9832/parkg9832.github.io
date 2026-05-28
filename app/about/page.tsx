import { AboutContact } from '@/components/about/AboutContact';
import { AboutFeatures } from '@/components/about/AboutFeatures';
import { AboutHero } from '@/components/about/AboutHero';
import { BrandStory } from '@/components/about/BrandStory';
import { OurStory } from '@/components/about/OurStory';
import { ProductShowcase } from '@/components/product/ProductShowcase';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <AboutHero />
      <BrandStory />
      <OurStory />
      <ProductShowcase />
      <AboutFeatures />
      <AboutContact />
    </main>
  );
}
