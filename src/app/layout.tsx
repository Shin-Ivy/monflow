// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monflow.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070b14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'MonFlow',
  title: {
    default: 'MonFlow - Smart Financial Hub',
    template: '%s | MonFlow',
  },
  description: 'Smart Personal Ledger & Wealth Management',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'MonFlow - Smart Financial Hub',
    description: 'Smart Personal Ledger & Wealth Management',
    url: siteUrl,
    siteName: 'MonFlow',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'MonFlow Logo',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MonFlow',
    alternateName: ['MonFlow App', 'MonFlow Hub'],
    url: siteUrl,
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen selection:bg-[#00838F]/30`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}