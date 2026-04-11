import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["dimsumwrap3d.berkahost.biz.id"],
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://dimsumwrap3d.berkahost.biz.id/api/:path*",
      },
    ];
  },
};

export default nextConfig;