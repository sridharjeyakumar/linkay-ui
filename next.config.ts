import type { NextConfig } from 'next';

const GATEWAY = process.env.API_GATEWAY_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${GATEWAY}/api/v1/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${GATEWAY}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
