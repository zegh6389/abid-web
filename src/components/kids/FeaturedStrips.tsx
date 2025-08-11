export function FeaturedStrips() {
  const strips = [
    { label: 'Back‑to‑School Essentials', href: '/collections/back-to-school' },
    { label: 'Graphic Tees', href: '/collections/graphic-tees' },
    { label: 'Active & Play', href: '/collections/active' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 grid gap-3">
      {strips.map((s) => (
        <a key={s.label} href={s.href} className="glass rounded-xl p-4 font-medium">
          {s.label} →
        </a>
      ))}
    </section>
  );
}
