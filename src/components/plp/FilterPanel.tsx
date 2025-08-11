'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Facet = { name: string; values: { value: string; count: number; disabled?: boolean }[] };

export function FilterPanel({ facets }: { facets: Facet[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const toggle = (name: string, value: string) => {
    const params = new URLSearchParams(search.toString());
    const key = `f_${name}`;
    const current = new Set(params.getAll(key));
    if (current.has(value)) current.delete(value); else current.add(value);
    params.delete(key);
    [...current].forEach((v) => params.append(key, v));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="glass rounded-xl p-4 h-fit sticky top-20">
      {facets.map((f) => (
        <div key={f.name} className="mb-4">
          <div className="font-medium mb-2">{f.name}</div>
          <div className="flex flex-wrap gap-2">
            {f.values.map((v) => (
              <button
                key={v.value}
                disabled={v.disabled}
                className={`px-3 py-1 rounded-full border ${search.getAll(`f_${f.name}`).includes(v.value) ? 'bg-black text-white' : 'bg-white/50'} disabled:opacity-40`}
                onClick={() => toggle(f.name, v.value)}
              >
                {v.value} <span className="opacity-60">({v.count})</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
