import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MANTECH Nexus — Internships & Jobs Cameroon',
    short_name: 'MANTECH',
    description:
      'Verified internships, host enterprises, universities, and job placements across Cameroon.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    dir: 'ltr',
    categories: ['education', 'business', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Internships',
        short_name: 'Internships',
        description: 'Explore verified student & graduate internships',
        url: '/internships',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Jobs',
        short_name: 'Jobs',
        description: 'Browse career & job openings across Cameroon',
        url: '/jobs',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Intern Passport',
        short_name: 'Passport',
        description: 'Register or view your verified Intern Passport',
        url: '/intern-passports',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'For Companies',
        short_name: 'Companies',
        description: 'Post positions and discover pre-screened talent',
        url: '/services/companies',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}

