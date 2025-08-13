"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/shell/Header';
import { useDevice } from '@/components/shell/DeviceContext';
import { Footer } from '@/components/shell/Footer';
import { CartProvider } from '@/components/cart/CartContext';
import BottomNav from '@/components/shell/BottomNav';

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith('/admin/login');
  const { isMobile } = useDevice();

  if (hideChrome) return <main className="min-h-[70vh]">{children}</main>;

  return (
    <CartProvider>
  <Header key={isMobile ? 'mobile' : 'desktop'} />
  <main className="min-h-[70vh] pb-14 md:pb-0">{children}</main>
  {isMobile && <BottomNav />}
      <Footer />
    </CartProvider>
  );
}
