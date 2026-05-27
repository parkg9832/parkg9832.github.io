import { Flame, Handshake, Leaf, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Feature = {
  title: string;
  description: string;
  label: string;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: 'Authentic Flavor',
    description: 'Traditional Korean fermentation depth, adjusted for Latin American eating moments.',
    label: '01',
    icon: Flame,
  },
  {
    title: 'Latin Fusion',
    description: 'Built for tacos, asados, bowls, snacks, and fast recipe experiments.',
    label: '02',
    icon: Sparkles,
  },
  {
    title: 'Trend Partner',
    description: 'A vibrant K-Culture brand system for distributors, creators, and retail partners.',
    label: '03',
    icon: Handshake,
  },
  {
    title: 'Dip Green Identity',
    description: 'Burning Orange and Dip Green create a sharp, memorable sauce category signal.',
    label: '04',
    icon: Leaf,
  },
];

export function AboutFeatures() {
  return (
    <section className="bg-neutral-50 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-4xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.32em] text-[#ef5f18]">
            Brand Highlights
          </p>
          <h2 className="text-balance text-5xl font-black leading-none tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Four reasons MOKDA can travel.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group min-h-[300px] rounded-[2rem] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#ef5f18]/40 hover:shadow-2xl hover:shadow-orange-900/10 sm:p-9"
              >
                <div className="mb-14 flex items-start justify-between gap-5">
                  <span className="text-6xl font-black leading-none text-[#ef5f18]">{feature.label}</span>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#02674f] text-white transition-colors duration-300 group-hover:bg-[#ef5f18]">
                    <Icon className="h-7 w-7" strokeWidth={2.4} />
                  </span>
                </div>
                <h3 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
                  {feature.title}
                </h3>
                <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-neutral-600 sm:text-lg">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
