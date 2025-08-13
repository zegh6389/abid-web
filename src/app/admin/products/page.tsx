'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { z } from 'zod';
import { createProduct } from './actions';
import { useEffect, useState } from 'react';

const productSchema = z.object({
  slug: z.string().trim().min(1, { message: 'Slug is required' }),
  title: z.string().trim().min(1, { message: 'Title is required' }),
});

type State = {
  message?: string | null;
  errors?: {
    slug?: string[];
    title?: string[];
  };
};

// moved to server actions in ./actions

async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.products;
  return (Array.isArray(list) ? list : []) as Array<{ id: string; slug: string; title: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="bg-black text-white px-4 py-2 rounded" type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create'}
    </button>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Array<{ id: string; slug: string; title: string }>>([]);
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useFormState(
    createProduct as unknown as (state: State, formData: FormData) => Promise<State>,
    initialState,
  );

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (state.message?.includes('successfully')) {
      fetchProducts().then(setProducts);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="glass p-4 rounded grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        <div>
          <input name="slug" className="border rounded px-3 py-2 w-full" placeholder="slug" />
          {state.errors?.slug && <p className="text-red-500 text-sm mt-1">{state.errors.slug.join(', ')}</p>}
        </div>
        <div>
          <input name="title" className="border rounded px-3 py-2 w-full" placeholder="title" />
          {state.errors?.title && <p className="text-red-500 text-sm mt-1">{state.errors.title.join(', ')}</p>}
        </div>
        <SubmitButton />
        {state.message && !state.errors && <p className="text-green-500 text-sm">{state.message}</p>}
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
