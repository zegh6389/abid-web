export function KidsHero() {
  return (
    <section className="relative gradient-hero overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-24 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Margin Kidz</h1>
        <p className="mt-4 max-w-xl text-white/90">Fresh fits for school days, play days, and everything in between.</p>
        <div className="mt-8 flex gap-3">
          <a href="#girls" className="px-6 py-3 rounded-full bg-white text-black">Shop Girls</a>
          <a href="#boys" className="px-6 py-3 rounded-full glass">Shop Boys</a>
        </div>
      </div>

      {/* Right-side big promo text (white + hero-yellow), not clickable */}
      <div className="hidden md:flex items-center absolute right-6 top-1/2 -translate-y-1/2">
        <div
          className="whitespace-nowrap font-extrabold uppercase tracking-tight leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)] text-[44px] md:text-[68px] lg:text-[92px]"
        >
          <span className="text-white">FLAT</span>
          <span className="mx-3" style={{ color: `rgb(var(--surface-hero-end))` }}>
            30% & 40%
          </span>
          <span className="text-white">OFF</span>
        </div>
      </div>
    </section>
  );
}
