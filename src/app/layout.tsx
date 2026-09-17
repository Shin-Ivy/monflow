import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'MonFlow - Smart Financial Hub',
  description: 'Smart Personal Ledger & Wealth Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} antialiased min-h-screen selection:bg-[#00838F]/30`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}