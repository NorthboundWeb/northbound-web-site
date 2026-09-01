import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * The site moved from a single-division layout to Northbound the parent
   * brand, so the old top-level URLs now live under /web. These are permanent
   * so search engines transfer the old pages rather than indexing both.
   */
  async redirects() {
    return [
      { source: '/services', destination: '/web/services', permanent: true },
      { source: '/approach', destination: '/web/process', permanent: true },
      { source: '/work', destination: '/web/work', permanent: true },
      { source: '/jarvis', destination: '/ai', permanent: true },
      // Northbound.AI is a division of employees now, not one assistant, so
      // "Full Access" no longer names anything.
      { source: '/ai/full-access', destination: '/ai/access', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
