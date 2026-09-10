import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Block direct requests to the public image file that was previously exposed
      {
        source: '/abhisheksnair.jpg',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      // Secure the photo API route
      {
        source: '/api/photo',
        headers: [
          // Don't expose in CDN or browser cache
          { key: 'Cache-Control', value: 'private, no-store, no-cache, must-revalidate' },
          // Don't allow this endpoint to be framed or hotlinked cross-origin
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
          // Only same-origin scripts can fetch this
          { key: 'Access-Control-Allow-Origin', value: 'self' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Anyone who tries the old direct URL gets a 404 (permanent)
      {
        source: '/abhisheksnair.jpg',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
