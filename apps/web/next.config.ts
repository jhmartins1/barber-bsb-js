import "@barberjs/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://barber-bsb-js-production.up.railway.app/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;