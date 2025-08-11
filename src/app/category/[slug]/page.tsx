import { FilterPanel } from '@/components/plp/FilterPanel';
import { ProductCard } from '@/components/product/ProductCard';
import { Pagination } from '@/components/plp/Pagination';
import { SearchBar } from '@/components/plp/SearchBar';
import { SortDropdown } from '../../../components/plp/SortDropdown';

type SearchParams = { [key: string]: string | string[] | undefined };

async function fetchProducts(searchParams: SearchParams) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, String(x)));
    else if (typeof v !== 'undefined') qs.append(k, String(v));
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products?${qs.toString()}`, { cache: 'no-store' });
  const data = await res.json();
  if (Array.isArray(data)) return { items: [], total: 0, page: 1, limit: 24 }; // legacy
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 24,
  } as { items: Array<{ id: string; slug: string; title: string; variants?: any[] }>; total: number; page: number; limit: number };
}

async function fetchFacets(searchParams: SearchParams) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, String(x)));
    else if (typeof v !== 'undefined') qs.append(k, String(v));
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products?${qs.toString()}`, { cache: 'no-store' });
  const data = await res.json();
  const facets = data?.facets || { brand: [], size: [] };
  return [
    { name: 'brand', values: facets.brand },
    { name: 'size', values: facets.size },
  ];
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: SearchParams }) {
  const [productsData, facets] = await Promise.all([fetchProducts(searchParams), fetchFacets(searchParams)]);
  const { items: products, total, page, limit } = productsData;
  const totalPages = Math.ceil(total / limit);
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-[260px_1fr] gap-6">
      <FilterPanel facets={facets as any} />
      <div className="space-y-6">
        <div className="mb-6 space-y-4">
          <SearchBar />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {total} product{total !== 1 ? 's' : ''} found
            </div>
            <SortDropdown />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const media: string[] = Array.isArray(p.variants)
              ? (p.variants.flatMap((v: any) => (Array.isArray(v.media) ? v.media.map((m: any) => m.url) : [])) as string[])
              : [];
            return (
              <ProductCard
                key={p.id}
                prod={{ id: p.id, title: p.title, media: media.length ? media : ['/logo.png'], price: Number(p.variants?.[0]?.price ?? 0) }}
              />
            );
          })}
        </div>
        
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
        />
      </div>
    </div>
  );
}


