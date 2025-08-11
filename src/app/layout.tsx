import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import RootShell from '@/components/shell/RootShell';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: { default: 'Margin Kidz', template: '%s | Margin Kidz' },
  description: 'Premium apparel with vibrant aesthetics and smooth UX',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black antialiased">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
