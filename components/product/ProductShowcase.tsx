import { ProductCard } from './ProductCard';

export interface Product {
  category: string;
  title: string;
  titleColor: string;
  imageUrl: string;
  descLine1: string;
  descLine2: string;
  bottleShadow?: string;
  stageShadow?: string;
  stageGlow?: string;
}

const products: Product[] = [
  {
    category: '오리지널 고추장 소스',
    title: 'Original',
    titleColor: 'text-red-600',
    imageUrl: '/assets/bottle-original.webp',
    descLine1: '할라페뇨의 산뜻함을 더한,',
    descLine2: '깔끔하게 올라오는 한국식 매콤함',
  },
  {
    category: '쌈장 바비큐 소스',
    title: 'Para Carne',
    titleColor: 'text-yellow-500',
    imageUrl: '/assets/bottle-ssamjang.webp',
    descLine1: '고기와 그릴 요리에 맞춘,',
    descLine2: '깊고 진한 감칠맛의 바비큐 소스',
  },
  {
    category: '간장 베이스 소스',
    title: 'Soy Sauce',
    titleColor: 'text-[#2d1a11]',
    imageUrl: '/assets/bottle-sweetsoy.webp',
    descLine1: '달콤함과 짭짤함이 균형 잡힌,',
    descLine2: '매일 쓰기 좋은 퓨전 데일리 소스',
  },
];

export function ProductShowcase() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 break-keep text-sm font-extrabold uppercase tracking-[0.24em] text-gray-500">
          Salsa Coreana
        </p>
        <h2 className="break-keep text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          MOKDA Sauce Lineup
        </h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </section>
  );
}
