import { getKidsProducts, type Product } from '@/lib/data/catalog';
import { ProductCard } from '@/components/product/ProductCard';

export async function BestSellers() {
  const prods: Product[] = await getKidsProducts(8);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-xl font-semibold mb-4">Best Sellers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {prods.map((p: Product) => <ProductCard key={p.id} prod={p} />)}
      </div>
    </section>
  );
}
