'use server';

import { VariantListItem } from './VariantListItem';

export function VariantList({ product }: { product: any }) {
  if (!product?.variants?.length) return null;

  return (
    <div>
      <h2 className="font-semibold mb-2">Variants</h2>
      <ul className="space-y-2">
        {product.variants.map((v: any) => (
          <VariantListItem key={v.id} product={product} variant={v} />
        ))}
      </ul>
    </div>
  );
}
