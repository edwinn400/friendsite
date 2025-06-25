import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure static assets are properly generated
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
