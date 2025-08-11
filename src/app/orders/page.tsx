'use client';

import { useEffect, useState } from 'react';
import MarketingPage from '@/components/common/MarketingPage';
import { formatCurrencyPKR } from '@/lib/utils/currency';

type OrderItem = { productId: string; title: string; quantity: number; price: number; image?: string };
type Order = { id: string; placedAt: string; total: number; items: OrderItem[] };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mkidz_orders_v1');
      setOrders(raw ? JSON.parse(raw) : []);
    } catch {
      setOrders([]);
    }
  }, []);

  return (
    <MarketingPage title="Your Orders" subtitle="Track your recent purchases">
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border p-4 bg-white/70">
              <div className="flex items-center justify-between text-sm">
                <div>Order <span className="font-semibold">#{o.id}</span></div>
                <div className="opacity-80">{new Date(o.placedAt).toLocaleString()}</div>
              </div>
              <div className="mt-3 space-y-2">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {it.image ? <img src={it.image} alt="" className="h-10 w-10 rounded object-cover"/> : <div className="h-10 w-10 rounded bg-gray-100"/>}
                      <div>{it.title} × {it.quantity}</div>
                    </div>
                    <div className="font-medium">{formatCurrencyPKR(it.price * it.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <div className="opacity-80">Total</div>
                <div className="font-semibold">{formatCurrencyPKR(o.total)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MarketingPage>
  );
}


