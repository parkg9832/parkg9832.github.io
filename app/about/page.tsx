import { AboutContact } from '@/components/about/AboutContact';
import { AboutFeatures } from '@/components/about/AboutFeatures';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutStory } from '@/components/about/AboutStory';
import { ProductShowcase } from '@/components/product/ProductShowcase';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <AboutHero />
      <AboutStory />
      <ProductShowcase />
      <AboutFeatures />
      <AboutContact />
    </main>
  );
}
