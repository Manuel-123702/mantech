/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    cpus: 1,
  },

  // ─── Image Optimization ──────────────────────────────────────────────────────
  // Enable Next.js built-in image optimization: auto WebP/AVIF conversion,
  // responsive sizes, blur placeholders. Huge data savings for Cameroon mobile
  // users on MTN/Orange limited data plans.
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days browser cache
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      // Supabase storage for user uploads
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      // Any external org logo CDN
      { protocol: 'https', hostname: '**' },
    ],
  },

  // ─── HTTP Response Headers ────────────────────────────────────────────────────
  // Long cache for static assets, security headers, compression hints.
  async headers() {
    return [
      {
        // Static assets: images, fonts, icons — cache 1 year
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=86400' },
          { key: 'Vary', value: 'Accept' },
        ],
      },
      {
        // JS/CSS bundles: immutable (Next.js hashes them)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // API responses: short cache, revalidate quickly
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=30, stale-while-revalidate=60' },
        ],
      },
      {
        // All pages: security headers
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  /**
   * Addresses that have been renamed.
   *
   * These are handled here rather than with a page that redirects, because this
   * produces a real HTTP status that a browser follows straight away — including
   * with JavaScript turned off — instead of rendering a page that only then
   * navigates away.
   */
  async redirects() {
    return [
      // The internship marketplace is /internships.
      { source: '/intern-opportunities', destination: '/internships', permanent: true },
    ];
  },
};

module.exports = nextConfig;
