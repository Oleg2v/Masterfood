import { unsplash } from "./unsplash";

/** next/image loader for the static export: every photo is resized by Unsplash's CDN. */
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return unsplash(src, width, quality ?? 75);
}
