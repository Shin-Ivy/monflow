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
  title: 'MonFlow - Smart Financial Hub',
  description: 'Smart Personal Ledger & Wealth Management',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: 'MonFlow - Smart Financial Hub',
    description: 'Smart Personal Ledger & Wealth Management',
    url: siteUrl,
    siteName: 'MonFlow',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema JSON-LD agar Google mengenali nama situs sebagai "MonFlow", bukan "Vercel"
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MonFlow',
    alternateName: ['MonFlow App', 'MonFlow Financial Hub'],
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