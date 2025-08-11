import Link from 'next/link';

type Item = { label: string; href: string; accent?: boolean };

const girlsCats: Item[] = [
  { label: 'new arrivals', href: '/category/girls/new' },
  { label: 'new dresses & jumpsuits', href: '/category/girls/dresses' },
  { label: 'new tops', href: '/category/girls/tops' },
  { label: 'new bottoms', href: '/category/girls/bottoms' },
];

const boysCats: Item[] = [
  { label: 'new arrivals', href: '/category/boys/new' },
  { label: 'new tops', href: '/category/boys/tops' },
  { label: 'new bottoms', href: '/category/boys/bottoms' },
];

const girlsMenu: Record<'Categories' | 'Collections', Item[]> = {
  Categories: [
    { label: 'new arrivals', href: '/category/girls/new' },
    { label: 'tops', href: '/category/girls/tops' },
    { label: 'bottoms', href: '/category/girls/bottoms' },
    { label: 'dresses & rompers', href: '/category/girls/dresses' },
    { label: 'swimsuits', href: '/category/girls/swim' },
    { label: 'coats & jackets', href: '/category/girls/outerwear' },
    { label: 'matching sets', href: '/category/girls/sets' },
    { label: 'underwear & bralettes', href: '/category/girls/underwear' },
    { label: 'accessories & perfume', href: '/category/girls/accessories' },
    { label: 'clearance', href: '/category/girls/clearance', accent: true },
  ],
  Collections: [
    { label: 'NFL collection', href: '/collections/nfl' },
    { label: 'essentials', href: '/collections/essentials' },
    { label: 'uniform shop', href: '/collections/uniform' },
  ]
};

const boysMenu: Record<'Categories' | 'Collections', Item[]> = {
  Categories: [
    { label: 'new arrivals', href: '/category/boys/new' },
    { label: 'tops', href: '/category/boys/tops' },
    { label: 'bottoms', href: '/category/boys/bottoms' },
    { label: 'swimwear', href: '/category/boys/swim' },
    { label: 'coats & jackets', href: '/category/boys/outerwear' },
    { label: 'matching sets', href: '/category/boys/sets' },
    { label: 'underwear & socks', href: '/category/boys/underwear' },
    { label: 'accessories & cologne', href: '/category/boys/accessories' },
    { label: 'clearance', href: '/category/boys/clearance', accent: true },
  ],
  Collections: [
    { label: 'NFL collection', href: '/collections/nfl' },
    { label: 'essentials', href: '/collections/essentials' },
    { label: 'uniform shop', href: '/collections/uniform' },
  ]
};

export function MegaMenu({ tab }: { tab: string }) {
  if (tab === 'new') {
    return (
      <div className="grid grid-cols-2 gap-10">
        <div>
          <div className="font-semibold mb-3">girls</div>
          <ul className="space-y-2">
            {girlsCats.map((i) => (
              <li key={i.label}><Link className="hover:underline" href="#girls">{i.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">boys</div>
          <ul className="space-y-2">
            {boysCats.map((i) => (
              <li key={i.label}><Link className="hover:underline" href="#boys">{i.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (tab === 'girls') {
    return (
      <div className="grid grid-cols-2 gap-10">
        <div>
          <div className="font-semibold mb-3">Categories</div>
          <ul className="space-y-2">
            {girlsMenu.Categories.map((i) => (
              <li key={i.label}><Link className={`hover:underline ${i.accent ? 'text-red-600' : ''}`} href="#girls">{i.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Collections</div>
          <ul className="space-y-2">
            {girlsMenu.Collections.map((i) => (
              <li key={i.label}><Link className="hover:underline" href="#girls">{i.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (tab === 'boys') {
    return (
      <div className="grid grid-cols-2 gap-10">
        <div>
          <div className="font-semibold mb-3">Categories</div>
          <ul className="space-y-2">
            {boysMenu.Categories.map((i) => (
              <li key={i.label}><Link className={`hover:underline ${i.accent ? 'text-red-600' : ''}`} href="#boys">{i.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Collections</div>
          <ul className="space-y-2">
            {boysMenu.Collections.map((i) => (
              <li key={i.label}><Link className="hover:underline" href="#boys">{i.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (tab === 'jeans' || tab === 'active' || tab === 'sale' || tab === 'purpose') {
    return (
      <div className="grid grid-cols-2 gap-10">
        <div>
          <div className="font-semibold mb-3">girls</div>
          <ul className="space-y-2">
            <li><Link className="hover:underline" href="#">the viral denim sale</Link></li>
            <li><Link className="hover:underline" href="#">clearance</Link></li>
            <li><Link className="hover:underline" href="#">view all</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">boys</div>
          <ul className="space-y-2">
            <li><Link className="hover:underline" href="#">the viral denim sale</Link></li>
            <li><Link className="hover:underline" href="#">clearance</Link></li>
            <li><Link className="hover:underline" href="#">view all</Link></li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
