import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MonFlow - Personal Ledger',
    short_name: 'MonFlow',
    description: 'Smart Finance Tracker with AI Scanner',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1120',
    theme_color: '#004D57',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}