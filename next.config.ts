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
  webpack(config) {
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
