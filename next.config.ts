import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Quiet workspace root warnings by pinning Turbopack root to this project
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
