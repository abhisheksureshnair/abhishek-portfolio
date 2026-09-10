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
      // Secure the resume from bot crawlers and search indexers
      {
        source: '/resume.pdf',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
          { key: 'Cache-Control', value: 'private, no-store, no-cache, must-revalidate' },
          { key: 'Content-Disposition', value: 'attachment; filename="Abhishek_S_Nair_Resume.pdf"' },
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
