import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mn86.tonkotsu.jp',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-64fb0bfdf1794163b59576eb362601e9.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable server-side features for static export
  experimental: {
    // Disable features that require server
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
