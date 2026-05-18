import { Suspense } from 'react';
import type { Metadata } from 'next';
import ReduxProvider from '@/components/providers/ReduxProvider';
import MuiProvider from '@/components/providers/MuiProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Linkay',
  description: 'Invest in tokenized real-world assets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReduxProvider>
          <MuiProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </MuiProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
