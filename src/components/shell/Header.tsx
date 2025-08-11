'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MegaMenu } from '@/components/shell/MegaMenu';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/components/cart/CartContext';

const TABS = ['new', 'girls', 'boys', 'toddler', 'jeans', 'active', 'sale', 'purpose'] as const;

export function Header() {
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50">
  <div className="glass glass-ios border-b">
  <div className="w-full pl-2 md:pl-4 pr-2 md:pr-4 py-3 flex items-center justify-between">
          <Link href="/kids#girls" className="flex items-center gap-3">
            <Image
              src="/logo.png?v=2"
              alt="Margin Kidz"
              width={56}
              height={56}
              className="h-12 w-auto rounded transform scale-110 md:scale-125 origin-left"
              unoptimized
            />
            <span className="font-bold text-lg hidden sm:inline">Margin Kidz</span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center relative">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`capitalize pb-1 hover:opacity-90 focus-visible:ring-2 ${
                  openTab === tab ? 'text-black' : 'text-black/80'
                }`}
                onMouseEnter={() => setOpenTab(tab)}
                onFocus={() => setOpenTab(tab)}
                onMouseLeave={() => setOpenTab(null)}
              >
                {tab}
                <span
                  className={`block h-[2px] mt-1 rounded ${
                    openTab === tab ? 'bg-black w-6' : 'bg-transparent w-0'
                  } transition-all`}
                />
              </button>
            ))}
            <Link href="/about" className="capitalize pb-1 text-black/80 hover:opacity-90">About</Link>
            <Link href="/contact" className="capitalize pb-1 text-black/80 hover:opacity-90">Contact</Link>
            <Link href="/faq" className="capitalize pb-1 text-black/80 hover:opacity-90">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              title="Search"
              className="gradient-cta text-white rounded-full p-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.116 12.132l4.251 4.251a.75.75 0 1 0 1.06-1.06l-4.25-4.252A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Account */}
            {/* User dropdown */}
            {(() => {
              // Local block to keep related logic together
              // Hooks must stay at top level; we declare them above component return
              return null;
            })()}
            <UserMenu />

            <button className="px-3 py-1 rounded-full text-white gradient-cta relative" onClick={() => setCartOpen(true)}>
              Cart
              {count > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[1.25rem] px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">{count}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openTab && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            onMouseEnter={() => setOpenTab(openTab)}
            onMouseLeave={() => setOpenTab(null)}
            className="absolute inset-x-0 top-full bg-transparent"
          >
            <div className="mx-auto max-w-7xl px-4">
              <div className="glass glass-ios p-6 rounded-xl">
                <MegaMenu tab={openTab} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}

// Lightweight user menu with click-outside close and subtle animation
function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account"
        title="Account"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="gradient-cta text-white rounded-full p-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2.25a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
          <path fillRule="evenodd" d="M4.5 20.25a7.5 7.5 0 1 1 15 0 .75.75 0 0 1-1.5 0 6 6 0 1 0-12 0 .75.75 0 0 1-1.5 0Z" clipRule="evenodd" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            role="menu"
            className="absolute right-0 mt-2 w-56 z-50"
          >
            <div className="glass glass-ios p-6 rounded-xl">
              <MenuLink href="/account/sign-in" label="Sign in / Create account" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M16.5 2.25h-9A2.25 2.25 0 0 0 5.25 4.5v15A2.25 2.25 0 0 0 7.5 21.75h9a2.25 2.25 0 0 0 2.25-2.25v-15A2.25 2.25 0 0 0 16.5 2.25Z" />
                </svg>
              } />
              <MenuLink href="/orders" label="Orders" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" />
                </svg>
              } />
              <MenuLink href="/wishlist" label="Wishlist" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M11.645 20.87a.75.75 0 0 0 .71 0c1.23-.676 7.145-4.11 7.145-10.12a4.995 4.995 0 0 0-8.155-3.86 4.995 4.995 0 0 0-8.155 3.86c0 6.01 5.915 9.443 7.145 10.12Z" />
                </svg>
              } />
              <MenuLink href="/addresses" label="Addresses" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M11.47 3.84a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1-1.06 1.06L12 5.56 5.03 12.4a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                </svg>
              } />
              <MenuLink href="/help" label="Help & Support" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm-.75 14.25a.75.75 0 0 1 1.5 0 .75.75 0 0 1-1.5 0ZM12 6.75a3.75 3.75 0 0 0-3.75 3.75.75.75 0 0 0 1.5 0 2.25 2.25 0 1 1 3.119 2.07c-.957.41-1.869 1.2-1.869 2.43v.75a.75.75 0 0 0 1.5 0v-.75c0-.47.3-.86.97-1.156A3.75 3.75 0 0 0 12 6.75Z" clipRule="evenodd" />
                </svg>
              } />
              <div className="my-1 h-px bg-black/10" />
              <MenuLink href="/account/sign-out" label="Sign out" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M15.75 3.75A2.25 2.25 0 0 1 18 6v12a2.25 2.25 0 0 1-2.25 2.25H9a2.25 2.25 0 0 1-2.25-2.25V6A2.25 2.25 0 0 1 9 3.75h6Zm-2.69 6.28a.75.75 0 0 0-1.06 1.06l1.47 1.47-1.47 1.47a.75.75 0 0 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z" clipRule="evenodd" />
                </svg>
              } />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/50 active:bg-white/60 transition-colors"
    >
      <span className="text-black/70">{icon}</span>
      <span className="text-sm font-medium text-black">{label}</span>
    </Link>
  );
}
