import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/data/catalog';
import { AddToCart } from '@/components/cart/AddToCart';
import { formatCurrencyPKR } from '@/lib/utils/currency';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const prod = await getProductBySlug(params.slug);
  if (!prod) return notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="glass rounded-2xl p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={prod.media[0]} alt={prod.title} className="w-full h-auto rounded-xl" />
      </div>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">{prod.title}</h1>
        <div className="text-xl">{formatCurrencyPKR( (prod as any).price ?? 27720)}</div>
        <AddToCart productId={prod.id} title={prod.title} price={(prod as any).price ?? 27720} image={prod.media[0]} />
        <div className="glass rounded-xl p-4">
          <details>
            <summary className="cursor-pointer">Shipping & Returns</summary>
            <p className="text-sm opacity-80 mt-2">Free shipping over $100. 30-day returns.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
