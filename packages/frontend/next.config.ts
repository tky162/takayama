import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
