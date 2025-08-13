import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import RootShell from '@/components/shell/RootShell';
import { headers } from 'next/headers';
import { DeviceProvider } from '@/components/shell/DeviceContext';
import { isMobileUserAgent } from '@/lib/utils/device';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: { default: 'Margin Kidz', template: '%s | Margin Kidz' },
  description: 'Premium apparel with vibrant aesthetics and smooth UX',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const ua = headers().get('user-agent');
  const initialIsMobile = isMobileUserAgent(ua);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black antialiased">
        <DeviceProvider initialIsMobile={initialIsMobile}>
          <RootShell>{children}</RootShell>
        </DeviceProvider>
      </body>
    </html>
  );
}
