/** @type {import('next').NextConfig} */

const nextConfig = {
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
