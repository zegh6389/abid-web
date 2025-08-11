'use client';

import { useEffect, useState } from 'react';
import MarketingPage from '@/components/common/MarketingPage';

type Address = { id: string; name: string; line1: string; city: string; phone?: string };

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({ id: '', name: '', line1: '', city: '', phone: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mkidz_addresses_v1');
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const save = () => {
    const id = form.id || Math.random().toString(36).slice(2);
    const next = form.id ? items.map((a) => (a.id === form.id ? { ...form, id } : a)) : [...items, { ...form, id }];
    setItems(next);
    localStorage.setItem('mkidz_addresses_v1', JSON.stringify(next));
    setForm({ id: '', name: '', line1: '', city: '', phone: '' });
  };

  const edit = (a: Address) => setForm(a);
  const remove = (id: string) => {
    const next = items.filter((a) => a.id !== id);
    setItems(next);
    localStorage.setItem('mkidz_addresses_v1', JSON.stringify(next));
  };

  return (
    <MarketingPage title="Addresses" subtitle="Manage your shipping info">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Saved</h3>
          <div className="space-y-3">
            {items.map((a) => (
              <div key={a.id} className="rounded-xl border p-3 bg-white/70 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{a.name}</div>
                  <div className="opacity-80">{a.line1}, {a.city}</div>
                  {a.phone ? <div className="opacity-80">{a.phone}</div> : null}
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded border" onClick={() => edit(a)}>Edit</button>
                  <button className="px-3 py-1 rounded border" onClick={() => remove(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Add / Edit</h3>
          <div className="space-y-2">
            <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
            <input className="w-full border rounded px-3 py-2" placeholder="Address line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })}/>
            <input className="w-full border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}/>
            <input className="w-full border rounded px-3 py-2" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
            <button className="px-4 py-2 rounded bg-black text-white" onClick={save}>{form.id ? 'Update' : 'Save'}</button>
          </div>
        </div>
      </div>
    </MarketingPage>
  );
}


