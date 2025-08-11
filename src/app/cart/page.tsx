'use client';

import { useCart } from '@/components/cart/CartContext';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="opacity-70">Your cart is empty.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={`${it.productId}:${it.variantId ?? 'base'}`} className="flex gap-3 items-center rounded-lg border p-2 bg-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {it.image ? <img src={it.image} alt="" className="h-16 w-16 rounded object-cover" /> : <div className="h-16 w-16 rounded bg-gray-100" />}
              <div className="flex-1">
                <div className="text-sm font-medium">{it.title}</div>
                <div className="text-xs opacity-70">${it.price.toFixed(2)}</div>
                <div className="mt-1 flex items-center gap-2">
                  <button className="px-2 py-1 rounded border" onClick={() => updateQuantity(it.productId, it.quantity - 1, it.variantId)}>-</button>
                  <span className="min-w-[2ch] text-center">{it.quantity}</span>
                  <button className="px-2 py-1 rounded border" onClick={() => updateQuantity(it.productId, it.quantity + 1, it.variantId)}>+</button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
                <button className="text-xs underline mt-1" onClick={() => removeItem(it.productId, it.variantId)}>Remove</button>
              </div>
            </div>
          ))}

          <div className="pt-3 border-t mt-3 flex items-center justify-between">
            <div className="text-lg font-semibold">Subtotal</div>
            <div className="text-lg font-semibold">${subtotal.toFixed(2)}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-md border" onClick={clear}>Clear</button>
            <a href="/checkout" className="flex-1 px-3 py-2 rounded-md text-center text-white gradient-cta">Checkout</a>
          </div>
        </div>
      )}
    </div>
  );
}


