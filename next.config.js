/** @type {import('next').NextConfig} */

// Keep production builds isolated from an active `next dev` process.
// `next build` sets NODE_ENV=production before this file is evaluated, while
// `next dev` uses development. Pointing each at its own distDir stops a
// production build from leaving stale chunk manifests in the directory the
// dev server is actively writing to (which caused "Cannot find module
// './<chunk>.js'" MODULE_NOT_FOUND errors at runtime).
const isProductionBuild = process.env.NODE_ENV === 'production';

const nextConfig = {
  distDir: isProductionBuild ? '.next-build' : '.next',
  experimental: {
    cpus: 1,
  },
  images: { unoptimized: true },

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
