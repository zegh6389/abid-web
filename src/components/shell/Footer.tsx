import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-7xl px-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Links column */}
          <nav aria-label="Primary footer links" className="space-y-3 text-center md:text-left">
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="space-y-2 text-sm text-black/80">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            </ul>
          </nav>

          {/* Policies column */}
          <nav aria-label="Policies" className="space-y-3 text-center md:text-left">
            <h3 className="text-lg font-semibold">Policies</h3>
            <ul className="space-y-2 text-sm text-black/80">
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link href="/size-guide" className="hover:underline">Size Guide</Link></li>
            </ul>
          </nav>

          {/* Newsletter column */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Join our mailing list!</h3>
            <p className="mt-2 text-sm text-black/70">Sign up for new stories and personal offers!</p>

            <form className="mt-4 flex w-full items-center gap-2 justify-center md:justify-start" noValidate>
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Email"
                className="h-10 flex-1 rounded-full bg-gray-100 px-4 text-sm outline-none focus:ring-2 focus:ring-yellow-500 max-w-[18rem] md:max-w-none"
              />
              <button type="button" className="h-10 rounded-full px-5 text-white text-sm font-semibold gradient-cta">
                Join
              </button>
            </form>
            <div className="mt-3 flex items-center gap-2.5 justify-center md:justify-start" aria-label="Social links">
              {/* Instagram (monochrome) */}
              <a href="#" aria-label="Instagram" title="Instagram" className="h-9 w-9 rounded-full bg-white ring-1 ring-black/15 flex items-center justify-center hover:ring-black/25 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#111" strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17" cy="7" r="1.2" fill="#111" stroke="none" />
                </svg>
              </a>
              {/* Facebook (monochrome) */}
              <a href="#" aria-label="Facebook" title="Facebook" className="h-9 w-9 rounded-full bg-white ring-1 ring-black/15 flex items-center justify-center hover:ring-black/25 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#111">
                  <path d="M13.5 9h2V6.5h-2c-1.38 0-2.5 1.12-2.5 2.5V11h-2v2.2h2V20h2.3v-6.8h1.95l.3-2.2h-2.25V9.82c0-.48.39-.82.9-.82Z" />
                </svg>
              </a>
              {/* TikTok (monochrome) */}
              <a href="#" aria-label="TikTok" title="TikTok" className="h-9 w-9 rounded-full bg-white ring-1 ring-black/15 flex items-center justify-center hover:ring-black/25 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#111">
                  <path d="M14 6.5c.7 1.1 1.9 1.9 3.2 2v1.6c-1.3-.1-2.5-.5-3.6-1.2v3.9c0 2.6-2.1 4.7-4.7 4.7S4.2 15.4 4.2 12.8c0-2.4 1.8-4.4 4.1-4.7v1.8c-1.3.3-2.3 1.5-2.3 2.9 0 1.7 1.4 3 3 3s3-1.3 3-3V6.5H14Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
