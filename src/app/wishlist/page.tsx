'use client';

import { useEffect, useState } from 'react';
import MarketingPage from '@/components/common/MarketingPage';

type Wish = { id: string; title: string; image?: string };

export default function WishlistPage() {
  const [items, setItems] = useState<Wish[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mkidz_wishlist_v1');
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem('mkidz_wishlist_v1', JSON.stringify(next));
  };

  return (
    <MarketingPage title="Wishlist" subtitle="Saved for later">
      {items.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border p-3 bg-white/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {it.image ? <img src={it.image} alt="" className="w-full h-40 object-cover rounded-lg"/> : <div className="w-full h-40 bg-gray-100 rounded-lg"/>}
              <div className="mt-2 text-sm font-medium">{it.title}</div>
              <div className="mt-2 flex gap-2">
                <a href={`/product/${it.id}`} className="px-3 py-1 rounded border">View</a>
                <button onClick={() => remove(it.id)} className="px-3 py-1 rounded border">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MarketingPage>
  );
}


