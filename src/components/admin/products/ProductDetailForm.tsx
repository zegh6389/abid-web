'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { z } from 'zod';
import { deleteProduct, updateProduct } from '@/app/admin/products/actions';

const productSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  tags: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)).optional(),
});

type State = {
  message?: string | null;
  errors?: {
    title?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="bg-black text-white px-4 py-2 rounded w-max" type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <button className="bg-red-600 text-white px-4 py-2 rounded" type="submit" disabled={pending}>
            {pending ? 'Deleting...' : 'Delete Product'}
        </button>
    );
}

export function ProductDetailForm({ product }: { product: any }) {
  const updateProductWithId = updateProduct.bind(null, product.id) as unknown as (state: State, formData: FormData) => Promise<State>;
  const deleteProductWithId = deleteProduct.bind(null, product.id);
  const [state, formAction] = useFormState(updateProductWithId, { message: '', errors: {} as Record<string, string[]> });

  return (
    <div className="space-y-6">
      <form action={formAction} className="grid gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" name="title" defaultValue={product.title} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Title" />
          {state.errors?.title && <p className="text-red-500 text-sm mt-1">{state.errors.title.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
          <input id="subtitle" name="subtitle" defaultValue={product.subtitle || ''} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Subtitle" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" defaultValue={product.description || ''} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Description" rows={5} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">SEO Title</label>
            <input id="seoTitle" name="seoTitle" defaultValue={product.seoTitle || ''} className="mt-1 block w-full border rounded px-3 py-2" placeholder="SEO Title" />
          </div>
          <div>
            <label htmlFor="seoDesc" className="block text-sm font-medium text-gray-700">SEO Description</label>
            <input id="seoDesc" name="seoDesc" defaultValue={product.seoDesc || ''} className="mt-1 block w-full border rounded px-3 py-2" placeholder="SEO Description" />
          </div>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
          <input id="tags" name="tags" defaultValue={(product.tags || []).join(', ')} className="mt-1 block w-full border rounded px-3 py-2" placeholder="tag1, tag2" />
        </div>
        <SubmitButton />
        {state.message && <p className="text-sm text-gray-600">{state.message}</p>}
      </form>

      <form action={deleteProductWithId}>
        <DeleteButton />
      </form>
    </div>
  );
}
