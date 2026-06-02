import type { Product } from './ProductShowcase';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const pairingMap: Record<string, string[]> = {
    Original: [
      '/assets/pairing-photos/red-chili.jpg',
      '/assets/pairing-photos/jalapeno.jpg',
      '/assets/pairing-photos/taco.jpg',
      '/assets/pairing-photos/fries.jpg',
    ],
    'Para Carne': [
      '/assets/pairing-photos/pork-belly.jpg',
      '/assets/pairing-photos/asado.jpg',
      '/assets/pairing-photos/lomo-saltado.jpg',
      '/assets/pairing-photos/pollo-brasa.jpg',
    ],
    'Soy Sauce': [
      '/assets/pairing-photos/bbq.jpg',
      '/assets/pairing-photos/chicken-wings.jpg',
      '/assets/pairing-photos/rice-bowl.jpg',
      '/assets/pairing-photos/salad.jpg',
    ],
  };
  const shapeMap: Record<string, string> = {
    Original: 'is-original',
    'Para Carne': 'is-ssamjang',
    'Soy Sauce': 'is-soy',
  };
  const pairings = pairingMap[product.title] || [];
  const shapeClass = shapeMap[product.title] || '';

  return (
    <article className="product-pairing-card flex min-w-0 flex-col items-center px-4 py-8 text-center sm:px-6">
      <p className="mb-1 break-keep text-sm font-semibold leading-tight text-gray-500">
        {product.category}
      </p>
      <h3 className={`mb-6 break-keep text-2xl font-bold leading-tight ${product.titleColor}`}>
        {product.title}
      </h3>

      <div className="relative flex h-64 w-full items-center justify-center overflow-visible sm:h-72">
        <span className={`product-pop-shape ${shapeClass}`} aria-hidden="true" />
        {pairings.map((pairing) => (
          <img
            key={pairing}
            src={pairing}
            alt=""
            className="product-pairing-illustration"
            aria-hidden="true"
          />
        ))}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-bottle relative z-10 h-full w-full object-contain"
        />
      </div>

      <p className="mt-6 break-keep text-sm font-normal leading-relaxed text-gray-600">
        {product.descLine1}
      </p>
      <p className="mt-1 break-keep text-base font-bold leading-relaxed text-gray-900">
        {product.descLine2}
      </p>
    </article>
  );
}
