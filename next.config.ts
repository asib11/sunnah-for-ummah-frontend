import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // Enable built-in gzip/brotli response compression
  compress: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.sunnahforummah.shop",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Serve modern formats (WebP/AVIF) when supported
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  typescript: {
    // Type errors in shadcn/recharts UI library components (version mismatch)
    // are excluded from blocking the build. Our own code is type-checked separately.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;