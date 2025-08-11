'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCart } from '@/components/cart/CartContext';
import { formatCurrencyPKR } from '@/lib/utils/currency';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, subtotal, removeItem, updateQuantity, clear } = useCart();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[60]">
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>
        <div className="fixed inset-y-0 right-0 max-w-md w-full">
          <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-200" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-150" leaveFrom="translate-x-0" leaveTo="translate-x-full">
            <Dialog.Panel className="glass h-full p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-medium">Your Cart</Dialog.Title>
                <button onClick={onClose} className="text-sm underline">Close</button>
              </div>

              <div className="mt-4 flex-1 overflow-auto space-y-3">
                {items.length === 0 ? (
                  <div className="text-sm opacity-70">Cart is empty.</div>
                ) : (
                  items.map((it) => (
                    <div key={`${it.productId}:${it.variantId ?? 'base'}`} className="flex gap-3 items-center rounded-lg border p-2 bg-white/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {it.image ? <img src={it.image} alt="" className="h-16 w-16 rounded object-cover" /> : <div className="h-16 w-16 rounded bg-gray-100" />}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{it.title}</div>
                        <div className="text-xs opacity-70">{formatCurrencyPKR(it.price)}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <button className="px-2 py-1 rounded border" onClick={() => updateQuantity(it.productId, it.quantity - 1, it.variantId)}>-</button>
                          <span className="min-w-[2ch] text-center">{it.quantity}</span>
                          <button className="px-2 py-1 rounded border" onClick={() => updateQuantity(it.productId, it.quantity + 1, it.variantId)}>+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-semibold">{formatCurrencyPKR(it.price * it.quantity)}</div>
                        <button className="text-xs underline mt-1" onClick={() => removeItem(it.productId, it.variantId)}>Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">Subtotal</span>
                  <span className="font-semibold">{formatCurrencyPKR(subtotal)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 rounded-md border" onClick={clear}>Clear</button>
                  <button className="flex-1 px-3 py-2 rounded-md text-white gradient-cta">Checkout</button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
