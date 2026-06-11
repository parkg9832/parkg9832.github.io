import type { Product } from './ProductShowcase';
import type { CSSProperties } from 'react';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const shadowByTitle: Record<string, Pick<Product, 'bottleShadow' | 'stageShadow' | 'stageGlow'>> = {
    Original: {
      bottleShadow: 'rgba(126,38,18,0.22)',
      stageShadow: 'rgba(126,38,18,0.24)',
      stageGlow: 'rgba(239,95,24,0.12)',
    },
    'Para Carne': {
      bottleShadow: 'rgba(126,74,24,0.2)',
      stageShadow: 'rgba(126,74,24,0.23)',
      stageGlow: 'rgba(214,143,54,0.12)',
    },
    'Soy Sauce': {
      bottleShadow: 'rgba(50,24,15,0.22)',
      stageShadow: 'rgba(50,24,15,0.24)',
      stageGlow: 'rgba(2,103,79,0.1)',
    },
  };
  const shadow = { ...shadowByTitle[product.title], ...product };
  const stageStyle = {
    '--bottle-shadow': shadow.bottleShadow,
    '--stage-shadow': shadow.stageShadow,
    '--stage-glow': shadow.stageGlow,
  } as CSSProperties;

  return (
    <article className="product-card flex min-w-0 flex-col items-center rounded-[1.25rem] px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 sm:px-6">
      <p className="mb-1 break-keep text-sm font-extrabold leading-tight text-slate-700">
        {product.category}
      </p>
      <h3 className={`mb-6 break-keep text-2xl font-extrabold leading-tight ${product.titleColor}`}>
        {product.title}
      </h3>

      <div
        className="product-stage relative flex h-64 w-full items-center justify-center overflow-visible sm:h-72"
        style={stageStyle}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-bottle relative z-10 h-full w-full object-contain"
        />
      </div>

      <p className="mt-6 break-keep text-sm font-medium leading-relaxed text-slate-800">
        {product.descLine1}
      </p>
      <p className="mt-1 break-keep text-base font-extrabold leading-relaxed text-gray-900">
        {product.descLine2}
      </p>
    </article>
  );
}
