import type { NextConfig } from "next";

/**
 * Demo hygiene: this is an unlisted pitch concept, never to be indexed.
 * The X-Robots-Tag header backs up the <meta name="robots"> in the root layout
 * and the Disallow-all robots.txt in /public.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" }],
      },
    ];
  },
};

export default nextConfig;
