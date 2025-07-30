import type { NextConfig } from 'next';

/* webpack config from https://react-svgr.com/docs/next/ */

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  }
};

export default nextConfig;
