import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  async redirects() {
    return [
      // The site restructured around the two divisions. Both old routes were
      // in the sitemap and carried canonical tags, so they are redirected
      // permanently rather than dropped — the equity moves with them.
      { source: '/services', destination: '/web', permanent: true },
      { source: '/approach', destination: '/about#process', permanent: true },
    ]
  },
}

export default nextConfig
