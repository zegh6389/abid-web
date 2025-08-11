export function CategoryTiles() {
  const tiles = [
    { id: 'girls', label: 'Girls', href: '#girls', img: 'https://picsum.photos/seed/girls/800/600' },
    { id: 'boys', label: 'Boys', href: '#boys', img: 'https://picsum.photos/seed/boys/800/600' },
    { id: 'toddler', label: 'Toddler', href: '#toddler', img: 'https://picsum.photos/seed/toddler/800/600' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-4">
      {tiles.map((t) => (
        <a key={t.id} id={t.id} href={t.href} className="group relative rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.img} alt={t.label} className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 glass px-3 py-1.5 rounded-full text-white">{t.label}</div>
        </a>
      ))}
    </section>
  );
}
