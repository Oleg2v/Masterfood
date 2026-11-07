import type { NextConfig } from "next";

/**
 * A fully static site: `next build` writes plain files to /out, served by a Cloudflare Worker
 * with static assets (wrangler.jsonc) at masterfood.kikkey.com. Photos are resized by
 * Unsplash's CDN through a custom image loader, so no image server is needed.
 *
 * Demo hygiene: this is an unlisted pitch concept, never to be indexed. public/_headers sends
 * X-Robots-Tag on every response, backing up the <meta name="robots"> in the root layout and
 * the Disallow-all robots.txt in /public.
 */
const nextConfig: NextConfig = {
  output: "export",
  // Lets a second build (e.g. NEXT_DIST_DIR=.next-alt) run beside a live one during reviews.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
