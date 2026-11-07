/**
 * Unsplash's own image CDN (imgix) resizes, re-encodes (AVIF/WebP via auto=format) and crops
 * at the edge, so the static site needs no image server of its own. Focal-point crops already
 * on a photo's URL (fit=crop, crop=focalpoint, fp-*, with a w×h box) are kept, and the box is
 * scaled to the requested width. Unsplash answers with Access-Control-Allow-Origin: *, so these
 * URLs can also feed a canvas (the frost glass) when loaded with crossOrigin="anonymous".
 */
export function unsplash(src: string, width: number, quality = 75): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (url.hostname !== "images.unsplash.com") return src;
  const w0 = Number(url.searchParams.get("w"));
  const h0 = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(Math.round(width)));
  if (w0 > 0 && h0 > 0) url.searchParams.set("h", String(Math.round((width * h0) / w0)));
  url.searchParams.set("q", String(quality));
  url.searchParams.set("auto", "format");
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  return url.toString();
}
