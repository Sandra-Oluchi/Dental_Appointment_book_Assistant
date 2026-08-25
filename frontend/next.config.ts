import type { NextConfig } from "next";

function normalizeBackendApiUrl(value?: string) {
  return value?.trim().replace(/^Value:\s*/i, "");
}

const backendApiUrl =
  normalizeBackendApiUrl(process.env.BACKEND_API_URL) ||
  normalizeBackendApiUrl(process.env.NEXT_PUBLIC_API_URL) ||
  "http://127.0.0.1:8001";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
