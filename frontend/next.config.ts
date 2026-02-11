import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled for dynamic routes
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
