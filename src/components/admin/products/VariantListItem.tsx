'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { z } from 'zod';
import Uploader from '@/components/admin/Uploader';
import { deleteMedia, deleteVariant, updateMedia, updateVariant } from '@/app/admin/products/actions';

const variantSchema = z.object({
  sku: z.string().trim().min(1, { message: 'SKU is required' }),
  optionSize: z.string().optional(),
  optionColor: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be positive' }),
  compareAt: z.coerce.number().min(0).optional().nullable(),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  saleStart: z.coerce.date().optional().nullable(),
  saleEnd: z.coerce.date().optional().nullable(),
  stock: z.coerce.number().int({ message: 'Stock must be an integer' }),
});

type State = {
  message?: string | null;
  errors?: {
    sku?: string[];
    price?: string[];
    stock?: string[];
    compareAt?: string[];
    salePrice?: string[];
    saleStart?: string[];
    saleEnd?: string[];
  };
  success?: boolean;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button className="bg-blue-600 text-white rounded px-4 py-2 text-sm" type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save'}
        </button>
    );
}

export function VariantListItem({ product, variant: v }: { product: any, variant: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const updateVariantWithIds = updateVariant.bind(null, product.id, v.id) as unknown as (state: State, formData: FormData) => Promise<State>;
  const [state, formAction] = useFormState(updateVariantWithIds, { message: '', errors: {} as Record<string, string[]>, success: false });
  const deleteVariantAction = deleteVariant.bind(null, product.id, v.id);

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
    }
  }, [state]);

  return (
    <li className="border rounded p-3 space-y-3 bg-white">
      {isEditing ? (
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor={`sku-${v.id}`} className="text-sm font-medium text-gray-700">SKU</label>
              <input id={`sku-${v.id}`} name="sku" defaultValue={v.sku || ''} placeholder="SKU" className="mt-1 block w-full border rounded px-3 py-2" />
              {state.errors?.sku && <p className="text-red-500 text-sm mt-1">{state.errors.sku.join(', ')}</p>}
            </div>
            <div>
              <label htmlFor={`size-${v.id}`} className="text-sm font-medium text-gray-700">Size</label>
              <input id={`size-${v.id}`} name="optionSize" defaultValue={v.optionSize || ''} placeholder="Size" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor={`color-${v.id}`} className="text-sm font-medium text-gray-700">Color</label>
              <input id={`color-${v.id}`} name="optionColor" defaultValue={v.optionColor || ''} placeholder="Color" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
                <label htmlFor={`stock-${v.id}`} className="text-sm font-medium text-gray-700">Stock</label>
                <input id={`stock-${v.id}`} name="stock" defaultValue={String(v.inventory?.stock ?? 0)} placeholder="Stock" type="number" className="mt-1 block w-full border rounded px-3 py-2" />
                {state.errors?.stock && <p className="text-red-500 text-sm mt-1">{state.errors.stock.join(', ')}</p>}
            </div>
            <div>
              <label htmlFor={`price-${v.id}`} className="text-sm font-medium text-gray-700">Price</label>
              <input id={`price-${v.id}`} name="price" defaultValue={String(v.price ?? 0)} placeholder="Price" type="number" step="0.01" className="mt-1 block w-full border rounded px-3 py-2" />
              {state.errors?.price && <p className="text-red-500 text-sm mt-1">{state.errors.price.join(', ')}</p>}
            </div>
            <div>
                <label htmlFor={`compareAt-${v.id}`} className="text-sm font-medium text-gray-700">Compare At Price</label>
                <input id={`compareAt-${v.id}`} name="compareAt" defaultValue={String(v.compareAt ?? '')} placeholder="Compare At Price" type="number" step="0.01" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
                <label htmlFor={`salePrice-${v.id}`} className="text-sm font-medium text-gray-700">Sale Price</label>
                <input id={`salePrice-${v.id}`} name="salePrice" defaultValue={String(v.salePrice ?? '')} placeholder="Sale Price" type="number" step="0.01" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div></div>
            <div>
                <label htmlFor={`saleStart-${v.id}`} className="text-sm font-medium text-gray-700">Sale Start</label>
                <input id={`saleStart-${v.id}`} name="saleStart" defaultValue={v.saleStart ? new Date(v.saleStart).toISOString().slice(0, 16) : ''} type="datetime-local" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
            <div>
                <label htmlFor={`saleEnd-${v.id}`} className="text-sm font-medium text-gray-700">Sale End</label>
                <input id={`saleEnd-${v.id}`} name="saleEnd" defaultValue={v.saleEnd ? new Date(v.saleEnd).toISOString().slice(0, 16) : ''} type="datetime-local" className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SubmitButton />
            <button onClick={() => setIsEditing(false)} className="text-gray-600" type="button">Cancel</button>
          </div>
          {state.message && !state.success && <p className="text-red-500 text-sm">{state.message}</p>}
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">SKU: {v.sku || '-'}</div>
            <div className="text-sm text-gray-600">
              {v.optionSize || 'N/A'} / {v.optionColor || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              Price: ${String(v.price)} | Stock: {v.inventory?.stock ?? 0}
            </div>
            {v.salePrice && (
                <div className="text-sm text-red-600">
                    Sale: ${String(v.salePrice)} (was ${String(v.compareAt || v.price)})
                </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(true)} className="bg-gray-200 text-gray-800 rounded px-3 py-1 text-sm" type="button">Edit</button>
            <form action={deleteVariantAction}>
              <button className="bg-red-600 text-white rounded px-3 py-1 text-sm" type="submit">Delete</button>
            </form>
          </div>
        </div>
      )}

      <div>
        <Uploader variantId={v.id} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(v.media || []).map((m: any) => (
            <div key={m.id} className="relative border rounded p-2 text-xs">
              <div className="truncate">{m.url}</div>
              <div className="mt-1 flex gap-2">
                <form action={() => updateMedia(product.id, m.id, true)}>
                  <button className={`px-2 py-1 rounded border ${m.isPrimary ? 'bg-green-600 text-white' : ''}`} type="submit">Primary</button>
                </form>
                <form action={() => deleteMedia(product.id, m.id)}>
                  <button className="px-2 py-1 rounded border text-red-600" type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
