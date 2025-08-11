'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartContext';
import { formatCurrencyPKR } from '@/lib/utils/currency';

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const placeOrder = async () => {
    setPlacing(true);
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0); // PKR
    // 1) Create order server-side
    let orderId: string | null = null;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: Math.round(total),
          currency: 'PKR',
          items: items.map((it) => ({
            productId: it.productId,
            title: it.title,
            quantity: it.quantity,
            price: it.price,
            image: it.image,
            variantId: it.variantId ?? null,
          })),
          provider: 'card',
          email: '',
          name: '',
          address: { line1: '', line2: '', city: '', state: '', postalCode: '' },
        }),
      });
      const data = await res.json();
      if (data?.order?.id) orderId = data.order.id as string;
      // Simulate provider webhook confirmation (demo only)
      if (orderId) {
        await fetch('/api/payments/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, success: true }) });
      }
    } catch {}
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total), currency: 'PKR', method: 'card', cart: items, orderId }),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || 'payment error');
      // If Stripe checkout session URL is provided, redirect
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
    } catch {
      // continue to success for demo
    }
    await new Promise((r) => setTimeout(r, 500));

    // Save order to localStorage so it appears on /orders
    try {
      const orderId = Math.random().toString(36).slice(2);
      const existingRaw = typeof window !== 'undefined' ? window.localStorage.getItem('mkidz_orders_v1') : null;
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newOrder = {
        id: orderId,
        placedAt: new Date().toISOString(),
        total: Math.round(total),
        items: items.map((it) => ({
          productId: it.productId,
          title: it.title,
          quantity: it.quantity,
          price: it.price,
          image: it.image,
        })),
      };
      const next = [newOrder, ...existing];
      if (typeof window !== 'undefined') window.localStorage.setItem('mkidz_orders_v1', JSON.stringify(next));
    } catch {
      // ignore persistence errors
    }

    clear();
    setPlacing(false);
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Thank you!</h1>
        <p className="opacity-80">Your order has been placed. A confirmation email will be sent shortly.</p>
        <a href="/kids" className="px-4 py-2 rounded-full text-white gradient-cta inline-block">Continue shopping</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        <form className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Full name" />
          <input className="w-full border rounded p-2" placeholder="Email" />
          <input className="w-full border rounded p-2" placeholder="Address" />
          <input className="w-full border rounded p-2" placeholder="City" />
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border rounded p-2" placeholder="State" />
            <input className="w-full border rounded p-2" placeholder="ZIP" />
          </div>
        </form>
      </div>
      <div>
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="text-lg font-semibold">Order Summary</div>
          {items.map((it) => (
            <div key={`${it.productId}:${it.variantId ?? 'base'}`} className="flex items-center justify-between text-sm">
              <span>{it.title} × {it.quantity}</span>
              <span>${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2 mt-2">
            <span className="font-semibold">Subtotal</span>
            <span className="font-semibold">{formatCurrencyPKR(subtotal)}</span>
          </div>
          <button disabled={placing || items.length === 0} onClick={placeOrder} className="w-full px-4 py-2 rounded-md text-white gradient-cta disabled:opacity-50">
            {placing ? 'Placing order…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}


