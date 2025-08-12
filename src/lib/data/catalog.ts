export type Product = {
  id: string;
  slug: string;
  title: string;
  media: string[];
  price: number; // PKR price
  brand?: string;
  sizes?: string[];
  priceFormatted?: string;
  variants?: any[];
};

// Use the two provided local images (primary and alternate)
const PRIMARY_IMAGE = '/WhatsApp%20Image%202025-08-07%20at%2021.04.20_dc68f485.jpg';
const ALT_IMAGE = '/WhatsApp%20Image%202025-08-05%20at%2019.13.10_5a748e7a.jpg';

const BRANDS = ['Brand A', 'Brand B'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const USD_TO_PKR = 280; // Base conversion for mock data
const MOCK: Product[] = Array.from({ length: 24 }).map((_, i): Product => {
  const brand = BRANDS[i % BRANDS.length];
  const baseUsd = 19.99 + (i % 8) * 5;
  const pricePkr = Math.round(baseUsd * USD_TO_PKR);
  const sizes = ALL_SIZES.slice(0, 3 + (i % 3));
  return {
    id: `prod-${i + 1}`,
    slug: `mock-${i + 1}`,
    title: `Mock Product ${i + 1}`,
    media: [PRIMARY_IMAGE, ALT_IMAGE],
    price: pricePkr,
    brand,
    sizes,
  };
});

export async function getProducts({ category, filters }: { category: string; filters?: any }): Promise<Product[]> {
  // Apply simple facet filters from URL params: f_brand, f_size
  let list = [...MOCK];
  if (filters) {
    const getAll = (key: string): string[] => {
      const val = filters[key];
      if (!val) return [];
      return Array.isArray(val) ? (val as string[]) : [String(val)];
    };
    const brandFilters = getAll('f_brand');
    const sizeFilters = getAll('f_size');
    if (brandFilters.length) list = list.filter((p) => brandFilters.includes(p.brand ?? ''));
    if (sizeFilters.length)
      list = list.filter((p) => (p.sizes ?? []).some((s) => sizeFilters.includes(s)));
  }
  return list;
}

export async function getKidsProducts(limit = 8): Promise<Product[]> {
  return MOCK.slice(0, limit);
}

export async function getFacetSummary({ category }: { category: string }) {
  // Derive counts from MOCK
  const brands = BRANDS.map((b) => ({ value: b, count: MOCK.filter((p) => p.brand === b).length }));
  const sizes = ALL_SIZES.map((s) => ({ value: s, count: MOCK.filter((p) => (p.sizes ?? []).includes(s)).length }));
  return [
    { name: 'brand', values: brands },
    { name: 'size', values: sizes },
  ];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/slug/${encodeURIComponent(slug)}`, {
    // Force dynamic to avoid ISR caching bugs for admin-updated content
    cache: 'no-store',
  });

  if (!res.ok) {
    // Let Next.js error boundary handle it
    throw new Error(`Failed to fetch product: ${res.statusText}`);
  }

  const json = await res.json();
  if (json?.product) {
    const p = json.product;
    const media = Array.isArray(p?.variants)
      ? (p.variants.flatMap((v: any) => (Array.isArray(v.media) ? v.media.map((m: any) => m.url) : [])) as string[])
      : [];
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      media: media.length ? media : ['/logo.png'],
      price: Number(p.variants?.[0]?.price ?? 0),
      brand: p.brand ?? undefined,
      sizes: undefined,
    } as Product;
  }
  return null;
}
