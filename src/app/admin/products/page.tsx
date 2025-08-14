import { revalidatePath } from 'next/cache';

async function createProduct(formData: FormData) {
  'use server';
  const slug = String(formData.get('slug') || '').trim();
  const title = String(formData.get('title') || '').trim();
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug, title })
  });
  revalidatePath('/admin/products');
}

async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products`, { cache: 'no-store' });
  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.products;
  return (Array.isArray(list) ? list : []) as Array<{ id: string; slug: string; title: string }>;
}

export default async function AdminProductsPage() {
  const products = await fetchProducts();
  return (
    <div className="space-y-6">
      <form action={createProduct} className="glass p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="slug" className="border rounded px-3 py-2" placeholder="slug" />
        <input name="title" className="border rounded px-3 py-2" placeholder="title" />
        <button className="bg-black text-white px-4 py-2 rounded" type="submit">Create</button>
      </form>

      <div className="grid gap-2">
        {products?.map((p) => (
          <a key={p.id} href={`/admin/products/${p.id}`} className="glass rounded p-3 flex items-center justify-between hover:bg-gray-50">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-500">/{p.slug}</div>
              
            </div>
            <span className="text-blue-600 text-sm">Edit</span>
          </a>
        ))}
      </div>
    </div>
  );
}
