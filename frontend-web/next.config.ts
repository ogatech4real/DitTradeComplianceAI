import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/upload", destination: "/", permanent: true },
      { source: "/review-queue", destination: "/review", permanent: true },
    ];
  },
};

export default nextConfig;
