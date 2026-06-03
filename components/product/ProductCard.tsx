import type { Product } from './ProductShowcase';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex min-w-0 flex-col items-center px-4 py-8 text-center sm:px-6">
      <p className="mb-1 break-keep text-sm font-bold leading-tight text-slate-700">
        {product.category}
      </p>
      <h3 className={`mb-6 break-keep text-2xl font-bold leading-tight ${product.titleColor}`}>
        {product.title}
      </h3>

      <div className="relative flex h-64 w-full items-center justify-center overflow-visible sm:h-72">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-bottle relative z-10 h-full w-full object-contain"
        />
      </div>

      <p className="mt-6 break-keep text-sm font-medium leading-relaxed text-slate-800">
        {product.descLine1}
      </p>
      <p className="mt-1 break-keep text-base font-bold leading-relaxed text-gray-900">
        {product.descLine2}
      </p>
    </article>
  );
}
