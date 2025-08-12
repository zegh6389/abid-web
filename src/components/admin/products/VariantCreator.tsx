'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { useRef, useEffect } from 'react';

const variantSchema = z.object({
  sku: z.string().trim().min(1, { message: 'SKU is required' }),
  optionSize: z.string().optional(),
  optionColor: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be positive' }),
  stock: z.coerce.number().int({ message: 'Stock must be an integer' }),
});

type State = {
  message?: string | null;
  errors?: {
    sku?: string[];
    price?: string[];
    stock?: string[];
  };
};

async function createVariant(productId: string, prevState: State, formData: FormData): Promise<State> {
  'use server';
  const validatedFields = variantSchema.safeParse({
    sku: formData.get('sku'),
    optionSize: formData.get('optionSize'),
    optionColor: formData.get('optionColor'),
    price: formData.get('price'),
    stock: formData.get('stock'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${productId}/variants`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(validatedFields.data)
  });

  if (!res.ok) {
    return { message: 'Failed to create variant.' };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { message: 'Variant created successfully.' };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="bg-black text-white rounded px-3 py-2" type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Variant'}
    </button>
  );
}

export function VariantCreator({ productId }: { productId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const createVariantWithId = createVariant.bind(null, productId);
  const [state, formAction] = useFormState(createVariantWithId, { message: null, errors: {} });

  useEffect(() => {
    if (state.message?.includes('successfully')) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-6 p-4 border rounded bg-gray-50 space-y-4">
      <h3 className="font-semibold">Add New Variant</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
          <input id="sku" name="sku" placeholder="SKU" className="mt-1 block w-full border rounded px-3 py-2" />
          {state.errors?.sku && <p className="text-red-500 text-sm mt-1">{state.errors.sku.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="optionSize" className="block text-sm font-medium text-gray-700">Size</label>
          <input id="optionSize" name="optionSize" placeholder="Size" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor="optionColor" className="block text-sm font-medium text-gray-700">Color</label>
          <input id="optionColor" name="optionColor" placeholder="Color" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input id="price" name="price" placeholder="Price" type="number" step="0.01" className="mt-1 block w-full border rounded px-3 py-2" />
          {state.errors?.price && <p className="text-red-500 text-sm mt-1">{state.errors.price.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input id="stock" name="stock" placeholder="Stock" type="number" className="mt-1 block w-full border rounded px-3 py-2" />
          {state.errors?.stock && <p className="text-red-500 text-sm mt-1">{state.errors.stock.join(', ')}</p>}
        </div>
      </div>
      <SubmitButton />
      {state.message && !state.errors && <p className="text-green-500 text-sm">{state.message}</p>}
    </form>
  );
}
