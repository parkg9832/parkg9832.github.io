import Link from 'next/link';
import type { Product } from './ProductShowcase';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={product.href}
      className="group flex min-w-0 flex-col items-center px-4 py-8 text-center no-underline transition-transform duration-300 hover:-translate-y-1 sm:px-6"
      aria-label={`View ${product.title} products`}
    >
      <p className="mb-1 break-keep text-sm font-semibold leading-tight text-gray-500">
        {product.category}
      </p>
      <h3 className={`mb-6 break-keep text-2xl font-bold leading-tight ${product.titleColor}`}>
        {product.title}
      </h3>

      <div className="flex h-64 w-full items-center justify-center sm:h-72">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <p className="mt-6 break-keep text-sm font-normal leading-relaxed text-gray-600">
        {product.descLine1}
      </p>
      <p className="mt-1 break-keep text-base font-bold leading-relaxed text-gray-900">
        {product.descLine2}
      </p>
    </Link>
  );
}
