import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/upload", destination: "/workspace", permanent: true },
      { source: "/review-queue", destination: "/workspace/review", permanent: true },
      { source: "/dashboard", destination: "/workspace/dashboard", permanent: true },
      { source: "/review", destination: "/workspace/review", permanent: true },
    ];
  },
};

export default nextConfig;
