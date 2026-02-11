import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone', // Disabled to fix 404 on static assets in Zeabur
  // distDir: 'dist', // Remove custom distDir to use default .next
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
