import type { NextConfig } from 'next';

const GATEWAY = process.env.API_GATEWAY_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Serve the Decap CMS admin panel at /admin
        { source: '/admin', destination: '/admin/index.html' },
      ],
      afterFiles: [
        {
          source: '/api/v1/:path*',
          destination: `${GATEWAY}/api/v1/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${GATEWAY}/uploads/:path*`,
        },
      ],
      fallback: [],
    };
  },
  webpack(config) {
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