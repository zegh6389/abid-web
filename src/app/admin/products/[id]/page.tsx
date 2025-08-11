import { revalidatePath } from 'next/cache';
import Uploader from '@/components/admin/Uploader';

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, { cache: 'no-store' });
  return (await res.json()).product as any;
}

export default async function AdminProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  async function updateProduct(formData: FormData) {
    'use server';
    const id = String(formData.get('id'));
    const payload = {
      title: String(formData.get('title') || ''),
      subtitle: String(formData.get('subtitle') || ''),
      description: String(formData.get('description') || ''),
      seoTitle: String(formData.get('seoTitle') || ''),
      seoDesc: String(formData.get('seoDesc') || ''),
      tags: String(formData.get('tags') || '').split(',').map(s => s.trim()).filter(Boolean),
    };
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    revalidatePath(`/admin/products/${id}`);
  }

  async function deleteProduct(formData: FormData) {
    'use server';
    const id = String(formData.get('id'));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, { method: 'DELETE' });
    revalidatePath('/admin/products');
    const { redirect } = await import('next/navigation');
    redirect('/admin/products');
  }

  if (!product) return <div className="p-6">Not found</div>;
  return (
    <div className="space-y-6">
      <form action={updateProduct} className="grid gap-3">
        <input type="hidden" name="id" value={product.id} />
        <input name="title" defaultValue={product.title} className="border rounded px-3 py-2" placeholder="Title" />
        <input name="subtitle" defaultValue={product.subtitle || ''} className="border rounded px-3 py-2" placeholder="Subtitle" />
        <textarea name="description" defaultValue={product.description || ''} className="border rounded px-3 py-2" placeholder="Description" rows={5} />
        <div className="grid grid-cols-2 gap-3">
          <input name="seoTitle" defaultValue={product.seoTitle || ''} className="border rounded px-3 py-2" placeholder="SEO Title" />
          <input name="seoDesc" defaultValue={product.seoDesc || ''} className="border rounded px-3 py-2" placeholder="SEO Description" />
        </div>
        <input name="tags" defaultValue={(product.tags || []).join(', ')} className="border rounded px-3 py-2" placeholder="tag1, tag2" />
        <button className="bg-black text-white px-4 py-2 rounded w-max" type="submit">Save</button>
      </form>

      <form action={deleteProduct}>
        <input type="hidden" name="id" value={product.id} />
        <button className="bg-red-600 text-white px-4 py-2 rounded" type="submit">Delete Product</button>
      </form>
  <div>
        <h2 className="font-semibold mb-2">Variants</h2>
        <ul className="space-y-2">
          {(product.variants || []).map((v: any) => (
            <li key={v.id} className="border rounded p-2 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">SKU: {v.sku || '-'} | Size: {v.optionSize || '-'} | Color: {v.optionColor || '-'}</div>
                  <div className="text-xs text-gray-500">Price: ${String(v.price)}</div>
                  <div className="text-xs text-gray-500">Stock: {v.inventory?.stock ?? 0}</div>
                </div>
                <div className="flex items-center gap-2">
                  <form action={async (formData: FormData) => {
                    'use server';
                    const payload = {
                      sku: String(formData.get('sku') || ''),
                      optionSize: String(formData.get('optionSize') || ''),
                      optionColor: String(formData.get('optionColor') || ''),
                      price: Number(formData.get('price') || 0),
                      stock: Number(formData.get('stock') || 0),
                    };
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/variants/${v.id}`, {
                      method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
                    });
                    const { revalidatePath } = await import('next/cache'); revalidatePath(`/admin/products/${product.id}`);
                  }} className="flex flex-wrap items-center gap-2">
                    <input name="sku" defaultValue={v.sku || ''} placeholder="SKU" className="border rounded px-2 py-1 w-28" />
                    <input name="optionSize" defaultValue={v.optionSize || ''} placeholder="Size" className="border rounded px-2 py-1 w-20" />
                    <input name="optionColor" defaultValue={v.optionColor || ''} placeholder="Color" className="border rounded px-2 py-1 w-24" />
                    <input name="price" defaultValue={String(v.price ?? 0)} placeholder="Price" className="border rounded px-2 py-1 w-24" />
                    <input name="stock" defaultValue={String(v.inventory?.stock ?? 0)} placeholder="Stock" className="border rounded px-2 py-1 w-20" />
                    <button className="bg-black text-white rounded px-3 py-1" type="submit">Update</button>
                  </form>
                  <form action={async () => {
                    'use server';
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/variants/${v.id}`, { method: 'DELETE' });
                    const { revalidatePath } = await import('next/cache'); revalidatePath(`/admin/products/${product.id}`);
                  }}>
                    <button className="bg-red-600 text-white rounded px-3 py-1" type="submit">Delete</button>
                  </form>
                </div>
              </div>
              <div>
                <Uploader variantId={v.id} />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(v.media || []).map((m: any) => (
                    <div key={m.id} className="relative border rounded p-2 text-xs">
                      <div className="truncate">{m.url}</div>
                      <div className="mt-1 flex gap-2">
                        <form action={async () => {
                          'use server';
                          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/media/${m.id}`, {
                            method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ isPrimary: true })
                          });
                          const { revalidatePath } = await import('next/cache'); revalidatePath(`/admin/products/${product.id}`);
                        }}>
                          <button className={`px-2 py-1 rounded border ${m.isPrimary ? 'bg-green-600 text-white' : ''}`} type="submit">Primary</button>
                        </form>
                        <form action={async () => {
                          'use server';
                          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/media/${m.id}`, { method: 'DELETE' });
                          const { revalidatePath } = await import('next/cache'); revalidatePath(`/admin/products/${product.id}`);
                        }}>
                          <button className="px-2 py-1 rounded border text-red-600" type="submit">Delete</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <VariantCreator productId={product.id} />
      </div>
    </div>
  );
}

function VariantCreator({ productId }: { productId: string }) {
  async function createVariant(formData: FormData) {
    'use server';
    const payload = {
      sku: String(formData.get('sku') || ''),
      optionSize: String(formData.get('optionSize') || ''),
      optionColor: String(formData.get('optionColor') || ''),
      price: Number(formData.get('price') || 0),
      stock: Number(formData.get('stock') || 0),
    };
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${productId}/variants`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/admin/products/${productId}`);
  }
  return (
    <form action={createVariant} className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2">
      <input name="sku" placeholder="SKU" className="border rounded px-2 py-1" />
      <input name="optionSize" placeholder="Size" className="border rounded px-2 py-1" />
      <input name="optionColor" placeholder="Color" className="border rounded px-2 py-1" />
      <input name="price" placeholder="Price" className="border rounded px-2 py-1" />
      <input name="stock" placeholder="Stock" className="border rounded px-2 py-1" />
      <button className="bg-black text-white rounded px-3 py-1" type="submit">Add</button>
    </form>
  );
}

// eslint-disable-next-line @next/next/no-assign-module-variable
export const dynamic = 'force-dynamic';

