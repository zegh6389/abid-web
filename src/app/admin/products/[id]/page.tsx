import { ProductDetailForm } from '@/components/admin/products/ProductDetailForm';
import { VariantCreator } from '@/components/admin/products/VariantCreator';
import { VariantList } from '@/components/admin/products/VariantList';

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product as any;
}

export default async function AdminProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <ProductDetailForm product={product} />
      <VariantList product={product} />
      <VariantCreator productId={product.id} />
    </div>
  );
}

// eslint-disable-next-line @next/next/no-assign-module-variable
export const dynamic = 'force-dynamic';
