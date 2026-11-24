/** @type {import('next').NextConfig} */

const nextConfig = {
  // Transpile and optimize modern package exports
  transpilePackages: ['lucide-react'],
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
      // Direct employer & institute requests route directly to opportunities
      { source: '/companies', destination: '/jobs', permanent: true },
      { source: '/companies/:path*', destination: '/jobs', permanent: true },
      { source: '/universities', destination: '/internships', permanent: true },
      { source: '/universities/:path*', destination: '/internships', permanent: true },
      // Obsolete company & university dashboards redirect to post & candidate dashboard
      { source: '/dashboard/company', destination: '/post', permanent: false },
      { source: '/dashboard/company/:path*', destination: '/post', permanent: false },
      { source: '/dashboard/university', destination: '/post', permanent: false },
      { source: '/dashboard/university/:path*', destination: '/post', permanent: false },
      { source: '/dashboard/student', destination: '/dashboard/intern', permanent: false },
      { source: '/dashboard/student/:path*', destination: '/dashboard/intern', permanent: false },
    ];
  },
};

module.exports = nextConfig;
