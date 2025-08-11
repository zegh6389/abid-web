"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { CartProvider } from '@/components/cart/CartContext';

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith('/admin/login');

  if (hideChrome) return <main className="min-h-[70vh]">{children}</main>;

  return (
    <CartProvider>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </CartProvider>
  );
}
