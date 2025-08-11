import Image from 'next/image';
import { formatCurrencyPKR } from '@/lib/utils/currency';

type MinimalProduct = { id: string; slug?: string; title: string; media: string[]; price?: number };

// Window-box listing card with hover preview swap
export function ProductCard({ prod }: { prod: MinimalProduct }) {
  const primary = prod.media?.[0];
  const secondary = prod.media?.[1] ?? primary;
  return (
    <a
      data-testid="product-card"
      href={`/product/${prod.slug ?? prod.id}`}
      className="group block rounded-xl border border-black/5 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-xl bg-gray-50">
        {/* Base image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={prod.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:opacity-0"
        />
        {/* Hover image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={secondary}
          alt={prod.title + ' alternate'}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 ease-out group-hover:opacity-100"
        />

        {/* Quick add affordance like the reference UI */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="mx-3 mb-3 rounded-md bg-black/70 py-2 text-center text-xs font-medium uppercase tracking-wide text-white">
            Quick Add
          </div>
        </div>
      </div>
      <div className="px-3 py-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">{prod.title}</h3>
        {prod.price != null && (
          <div className="mt-1 text-sm text-gray-700">{formatCurrencyPKR(prod.price)}</div>
        )}
      </div>
    </a>
  );
}
