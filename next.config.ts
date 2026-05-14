import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_GATEWAY_URL || 'http://localhost:4000'}/api/v1/:path*`,
      },
    ];
  },
  webpack(config, { dev }) {
    // Use memory cache in dev to avoid .pack.gz ENOENT race conditions
    if (dev) config.cache = { type: 'memory' };

    // Silence missing optional peer deps pulled in by @metamask/sdk and @walletconnect
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      lokijs: false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;
