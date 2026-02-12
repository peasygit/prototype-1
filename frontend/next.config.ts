import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for Zeabur/Docker
  // distDir: 'dist', // Remove custom distDir to use default .next
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
