"use client";

import { useEffect, useRef } from "react";
import { durations } from "@/design/tokens";
import { usePinned, useStill } from "@/lib/use-motion";

const REFREEZE_MS = durations.find((d) => d.id === "refreeze")!.ms;
/* Exponential return: 98% of the frost is back by REFREEZE_MS, whatever the frame rate. */
const TAU = REFREEZE_MS / 4;
const DEMO_MS = 900;
/* The frost is soft, so a sharper bitmap would only cost memory (iOS caps canvas memory). */
const MAX_DPR = 1.5;

/* The house grade (see GradedPhoto), applied to the photo under the glass. */
const grade = {
  flesh: "[filter:brightness(0.92)_contrast(1.1)_saturate(1.14)]",
  cold: "[filter:brightness(0.9)_contrast(1.24)_saturate(0.55)]",
} as const;

/*
 * The glass itself. Behind it the fish keeps its shape and its light but none of its colour:
 * the blurred photo is recoloured Frost-2 (hue 203°), drained a little more, dimmed, then
 * veiled in Frost, so the glass measures hue 198–203° at HSL saturation ≈ 0.12, cold whatever
 * lies behind it. Only a wipe shows the warm, graded photo underneath.
 */
const GLASS = {
  /** blur σ in CSS px: the fat lines stay a ghost, never a picture */
  blur: 12,
  /** Frost-2: the photo keeps only its light, in this hue */
  tint: "#93AAB8",
  drain: "rgba(128,128,128,0.3)",
  /** ×0.8, so the veil reads as light on it */
  dim: "#CCCCCC",
  /** condensation, brighter toward the top like cold air settling */
  veil: ["rgba(232,243,247,0.52)", "rgba(200,220,230,0.4)"],
  /** the frost is thicker toward the frame, where the glass is coldest */
  rim: ["rgba(232,243,247,0)", "rgba(232,243,247,0.12)"],
  grain: 0.1,
} as const;

type Pt = { x: number; y: number };
type Dab = Pt & { r: number };

const canvasOf = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
};
/* Empty a canvas at once: iOS caps the total memory of live canvases. */
const free = (c: HTMLCanvasElement) => {
  c.width = 0;
  c.height = 0;
};

/* object-fit: cover onto w×h, overscanned by `pad` px so a blur never pulls transparent edges in. */
function cover(c: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, pad: number) {
  const W = w + pad * 2;
  const H = h + pad * 2;
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  c.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

/*
 * The same cover and blur without ctx.filter, which Safari and every iOS browser ignore: the
 * photo is box-averaged down by k in halving steps, then smoothing scales it back up in
 * doubling steps. That is close to a Gaussian of σ ≈ 0.55k, in every engine.
 */
function coverSoft(c: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, pad: number, sigma: number) {
  const W = w + pad * 2;
  const H = h + pad * 2;
  const k = Math.max(2, sigma / 0.55);
  let cur = canvasOf(W / 2, H / 2);
  const first = cur.getContext("2d");
  if (!first) return free(cur);
  first.imageSmoothingQuality = "high";
  cover(first, img, cur.width, cur.height, 0);
  const resample = (tw: number, th: number) => {
    const next = canvasOf(tw, th);
    const n = next.getContext("2d");
    if (n) {
      n.imageSmoothingQuality = "high";
      n.drawImage(cur, 0, 0, next.width, next.height);
    }
    free(cur);
    cur = next;
  };
  let scale = 2;
  for (; scale * 2 <= k; scale *= 2) resample(cur.width / 2, cur.height / 2);
  if (scale < k) resample(W / k, H / k);
  while (cur.width * 4 < W) resample(cur.width * 2, cur.height * 2);
  c.imageSmoothingQuality = "high";
  c.drawImage(cur, -pad, -pad, W, H);
  free(cur);
}

/* A seeded ~2px frost grain, so every build of the glass looks the same. */
let grainTile: HTMLCanvasElement | null = null;
function grain() {
  if (grainTile) return grainTile;
  const n = 64;
  const seed = canvasOf(n, n);
  const s = seed.getContext("2d");
  if (!s) return null;
  const px = s.createImageData(n, n);
  let x = 11;
  for (let i = 0; i < px.data.length; i += 4) {
    x = (x * 16807) % 2147483647;
    px.data[i] = 244;
    px.data[i + 1] = 251;
    px.data[i + 2] = 253;
    px.data[i + 3] = Math.round((255 * Math.max(0, (x - 1) / 2147483646 - 0.45)) / 0.55);
  }
  s.putImageData(px, 0, 0);
  grainTile = canvasOf(n * 2, n * 2);
  const g = grainTile.getContext("2d");
  if (g) {
    g.imageSmoothingQuality = "high";
    g.drawImage(seed, 0, 0, n * 2, n * 2);
  }
  free(seed);
  return grainTile;
}

/* Bake the frost for a w×h bitmap into `into`: the only blur, once per size, never per frame. */
function bake(into: HTMLCanvasElement, img: HTMLImageElement, w: number, h: number, dpr: number, nativeBlur: boolean) {
  into.width = w;
  into.height = h;
  const f = into.getContext("2d");
  if (!f) return false;
  const sigma = GLASS.blur * dpr;
  const pad = Math.round(sigma * 2);
  if (nativeBlur) {
    f.filter = `blur(${Math.round(sigma)}px)`;
    cover(f, img, w, h, pad);
    f.filter = "none";
  } else {
    coverSoft(f, img, w, h, pad, sigma);
  }
  const fill = (op: GlobalCompositeOperation, style: string | CanvasGradient | CanvasPattern) => {
    f.globalCompositeOperation = op;
    f.fillStyle = style;
    f.fillRect(0, 0, w, h);
  };
  // composites, not filters: blend modes work in every engine (Safari since 7)
  fill("color", GLASS.tint);
  fill("saturation", GLASS.drain);
  fill("multiply", GLASS.dim);
  const veil = f.createLinearGradient(0, 0, 0, h);
  veil.addColorStop(0, GLASS.veil[0]);
  veil.addColorStop(1, GLASS.veil[1]);
  fill("source-over", veil);
  const rim = f.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) / 2);
  rim.addColorStop(0, GLASS.rim[0]);
  rim.addColorStop(1, GLASS.rim[1]);
  fill("source-over", rim);
  const tile = grain();
  const pattern = tile && f.createPattern(tile, "repeat");
  if (pattern) {
    f.globalAlpha = GLASS.grain;
    fill("source-over", pattern);
    f.globalAlpha = 1;
  }
  // crystal speckle, seeded like the grain
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const n = Math.round((w * h) / 900);
  for (let i = 0; i < n; i++) {
    f.fillStyle = `rgba(244,251,253,${0.05 + rnd() * 0.12})`;
    const s = (0.6 + rnd() * 1.4) * dpr;
    f.fillRect(rnd() * w, rnd() * h, s, s);
  }
  return true;
}

/*
 * One fingertip stamp: clear to 40% of its radius, then a falloff that, stamped every 0.15
 * of the radius, adds up to an edge going from clear to frost between 0.65 and 0.95 of it,
 * so a trail is soft but never haloed, at any pointer rate.
 */
const SPACING = 0.15;
/* The visible half-width of a trail (its 50% point), as a share of the stamp's radius. */
const EDGE = 0.85;
const TIP: readonly (readonly [at: number, alpha: number])[] = [
  [0, 1],
  [0.4, 1],
  [0.5, 0.65],
  [0.6, 0.52],
  [0.7, 0.35],
  [0.8, 0.18],
  [0.9, 0.05],
  [1, 0],
];
let tipSprite: HTMLCanvasElement | null = null;
function fingertip() {
  if (tipSprite) return tipSprite;
  const c = canvasOf(128, 128);
  const g = c.getContext("2d");
  if (!g) return null;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  for (const [at, alpha] of TIP) r.addColorStop(at, `rgba(0,0,0,${alpha})`);
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return (tipSprite = c);
}
/* Call between destination-out and source-over: a stamp of radius r clears the frost under it. */
function dab(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const tip = fingertip();
  if (tip) c.drawImage(tip, x - r, y - r, r * 2, r * 2);
}
/* Stamps from a to b, carrying the distance since the last stamp so the trail stays even. */
function trail(c: CanvasRenderingContext2D, a: Pt, b: Pt, r: number, since: number) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (!len) return since;
  const step = r * SPACING;
  let d = step - since;
  for (; d <= len; d += step) dab(c, a.x + ((b.x - a.x) * d) / len, a.y + ((b.y - a.y) * d) / len, r);
  return len - (d - step);
}

/* A fingertip's visible half-width in CSS px: 5% of the glass's short side, 16–30px. */
const fingerCss = (cssW: number, cssH: number) => Math.min(30, Math.max(16, 0.05 * Math.min(cssW, cssH)));

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
/* The finger lands a little narrow, presses, and lifts off thinner. */
const pressure = (t: number) => (0.85 + 0.15 * smooth(0, 0.2, t)) * (1 - 0.4 * smooth(0.6, 1, t));

/*
 * One finger-stroke, as if someone had just checked the fish: right to left (the reading
 * direction), rising gently with the slight bow of a wrist, and longer on a tall phone glass
 * than on the wide desktop one. The still frame, and the path of the first-view demonstration.
 * `px` is bitmap pixels per CSS pixel.
 */
function swipe(w: number, h: number, px: number): Dab[] {
  const wide = Math.min(1, Math.max(0, (w / h - 0.8) / 1.53)); // 0 at 4:5, 1 at 21:9
  const len = w * (0.68 - 0.18 * wide);
  const rise = 0.18;
  const bow = 0.05;
  const r = (fingerCss(w / px, h / px) * px) / EDGE;
  const dabs: Dab[] = [];
  for (let t = 0; t <= 1; ) {
    const tr = r * pressure(t);
    dabs.push({
      x: w * 0.52 + len * (0.5 - t),
      y: h * 0.52 + len * (rise * (0.5 - t) - bow * Math.sin(Math.PI * t)),
      r: tr,
    });
    const speed = len * Math.hypot(1, rise + bow * Math.PI * Math.cos(Math.PI * t));
    t += (tr * SPACING) / speed;
  }
  return dabs;
}

/**
 * Display-case glass: a frosted copy of the photo on a 2D canvas that a finger
 * or cursor wipes clear, and that freezes over again in 2.4s.
 *
 * The Stage 0 stand-in for the Stage 1 WebGL shader. One frost bitmap is baked per
 * size (the only blur, never per frame) and it is cold whatever the photo: see GLASS.
 * It blurs with ctx.filter where that works and by resampling where it does not
 * (Safari, every iOS browser). A wipe is a trail of soft fingertip stamps cut out with
 * destination-out; refreezing mixes the bitmap back in with a time-based alpha until
 * the glass is whole, then the loop sleeps. On first view one 900ms stroke shows the
 * gesture. Horizontal drags wipe, vertical drags scroll (touch-action: pan-y).
 * With reduced motion or "עצירת אנימציה" it is a still, a composed pre-wiped arc that
 * ignores the hand, and it follows the switch live. ?still=1 starts from the same arc
 * for screenshots, but a real hand can still wipe it, and it refreezes back to the arc.
 * No text ever sits on the glass; the caption beside it carries the instruction.
 */
export function FrostGlass({
  src,
  srcSet,
  sizes,
  alt,
  tone = "flesh",
  demo = false,
  className = "",
  fill = false,
}: {
  /** URLs served with CORS (Unsplash's CDN) or same-origin, so the canvas is never tainted. */
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  tone?: "flesh" | "cold";
  /** Draw one demonstration stroke the first time the glass is in view. */
  demo?: boolean;
  className?: string;
  /** Fill a positioned parent (absolute inset-0) instead of sizing itself. */
  fill?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  /* Reduced motion or the switch: a still glass. Pinned (?still=1): the arc, still wipeable. */
  const still = useStill();
  const pinned = usePinned();
  /* Once per page view, whatever the switch does later. */
  const demoed = useRef(false);
  const wasStill = useRef(still);

  useEffect(() => {
    const el = wrap.current;
    const img = photo.current;
    const cv = canvas.current;
    if (!el || !img || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const live = !still; // a hand can wipe, and the demonstration can play
    const composed = still || pinned; // the glass rests with the arc wiped
    // Motion just came back: the arc of the still frame freezes over once, instead of the demo.
    let thaw = wasStill.current && !still && !pinned;
    wasStill.current = still;
    if (thaw) demoed.current = true;
    const nativeBlur = "filter" in CanvasRenderingContext2D.prototype;

    let rest: HTMLCanvasElement | null = null; // the whole frost, which refreezing returns to
    let arc: HTMLCanvasElement | null = null; // when composed: the arc, cut again after every paint
    let built = ""; // size and source of the current bitmap
    let gen = 0; // bumped by every rebuild, which ends a demonstration in flight
    let px = 1; // bitmap pixels per CSS pixel at the last build
    let raf = 0;
    let pending = 0;
    let demoRaf = 0;
    let demoTimer = 0;
    let lastFrame = 0;
    let lastWipe = 0;
    let prev: Pt | null = null;
    let since = 0;
    let io: IntersectionObserver | null = null;
    let disposed = false;

    const cut = (dabs: Dab[]) => {
      ctx.globalCompositeOperation = "destination-out";
      for (const d of dabs) dab(ctx, d.x, d.y, d.r);
      ctx.globalCompositeOperation = "source-over";
    };
    const cutArc = () => {
      if (!arc) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(arc, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    };
    const paint = () => {
      if (!rest) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(rest, 0, 0);
      cutArc();
    };

    const refreeze = () => {
      if (!rest) {
        raf = 0;
        return;
      }
      const now = performance.now();
      const age = (now - lastWipe) / REFREEZE_MS;
      const dt = Math.min(96, now - lastFrame);
      // One source-over blend, exact wherever the glass is whole. A blend this slow stalls short
      // of whole in 8-bit, leaving a ghost trail that pops at the end, so it steps every 32ms or
      // more (not every 8ms on a 120Hz screen), and the last stretch speeds up.
      if (dt < 32 && age < 1) {
        raf = requestAnimationFrame(refreeze);
        return;
      }
      lastFrame = now;
      ctx.globalAlpha = Math.max(1 - Math.exp(-dt / TAU), 0.3 * smooth(0.55, 1, age));
      ctx.drawImage(rest, 0, 0);
      ctx.globalAlpha = 1;
      cutArc();
      if (age < 1) raf = requestAnimationFrame(refreeze);
      else {
        paint();
        raf = 0;
      }
    };
    const wake = () => {
      lastWipe = performance.now();
      if (raf) return;
      lastFrame = lastWipe;
      raf = requestAnimationFrame(refreeze);
    };

    // The first-view demonstration: the arc drawn once over 900ms, then it refreezes.
    const runDemo = () => {
      if (disposed || demoed.current || !rest) return;
      demoed.current = true;
      const g = gen;
      const dabs = swipe(cv.width, cv.height, px);
      const t0 = performance.now();
      let i = 0;
      const step = (now: number) => {
        if (disposed || g !== gen) return;
        const k = Math.min(1, (now - t0) / DEMO_MS);
        const upto = Math.round((1 - Math.pow(1 - k, 3)) * dabs.length);
        cut(dabs.slice(i, upto));
        i = Math.max(i, upto);
        wake();
        if (k < 1) demoRaf = requestAnimationFrame(step);
      };
      demoRaf = requestAnimationFrame(step);
    };
    // Armed after the first build, so the stroke never meets an empty canvas.
    const armDemo = () => {
      if (io || !demo || !live || pinned || demoed.current) return;
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          demoTimer = window.setTimeout(runDemo, 400);
        },
        { threshold: 0.6 },
      );
      io.observe(el);
    };

    // Runs on mount, on every resize (once per frame) and on every image load: a srcset switch
    // fires its own load. While a new candidate loads, the current image still draws.
    const build = () => {
      pending = 0;
      if (disposed || !img.naturalWidth) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const w = Math.round(r.width * dpr);
      const h = Math.round(r.height * dpr);
      const key = `${w}x${h} ${img.currentSrc || img.src}`;
      if (key === built) return;
      rest ??= document.createElement("canvas");
      if (!bake(rest, img, w, h, dpr, nativeBlur)) return;
      built = key;
      gen++;
      px = dpr;
      if (composed) {
        // Stamped source-over, the mask's alpha adds up exactly as destination-out takes it away.
        arc ??= document.createElement("canvas");
        arc.width = w;
        arc.height = h;
        const a = arc.getContext("2d");
        if (a) for (const d of swipe(w, h, px)) dab(a, d.x, d.y, d.r);
      }
      cv.width = w;
      cv.height = h;
      paint();
      if (thaw) {
        thaw = false;
        cut(swipe(w, h, px));
        wake();
      }
      armDemo();
    };

    // Map by the bitmap's real scale, which stays right even while a rebuild is pending.
    const point = (e: PointerEvent, r: DOMRect): Pt => ({
      x: (e.clientX - r.left) * (cv.width / r.width),
      y: (e.clientY - r.top) * (cv.height / r.height),
    });
    const onMove = (e: PointerEvent) => {
      if (!rest) return;
      if (e.pointerType === "touch" && e.buttons === 0) return;
      const r = cv.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const p = point(e, r);
      const radius = (fingerCss(r.width, r.height) * (cv.width / r.width)) / EDGE;
      ctx.globalCompositeOperation = "destination-out";
      if (prev) since = trail(ctx, prev, p, radius, since);
      else {
        dab(ctx, p.x, p.y, radius);
        since = 0;
      }
      ctx.globalCompositeOperation = "source-over";
      prev = p;
      demoed.current = true; // a real hand got there first
      wake();
    };
    const onLift = () => {
      prev = null;
    };

    img.addEventListener("load", build);
    build();
    const ro = new ResizeObserver(() => {
      if (!pending) pending = requestAnimationFrame(build);
    });
    ro.observe(el);
    // Still: the glass ignores the hand, and the caption says so.
    if (live) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onMove);
      el.addEventListener("pointerleave", onLift);
      el.addEventListener("pointerup", onLift);
      el.addEventListener("pointercancel", onLift);
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      cancelAnimationFrame(demoRaf);
      window.clearTimeout(demoTimer);
      ro.disconnect();
      io?.disconnect();
      img.removeEventListener("load", build);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLift);
      el.removeEventListener("pointerup", onLift);
      el.removeEventListener("pointercancel", onLift);
      if (rest) free(rest);
      if (arc) free(arc);
    };
  }, [src, srcSet, demo, still, pinned]);

  return (
    <div
      ref={wrap}
      className={`${fill ? "absolute inset-0" : "relative"} isolate select-none overflow-hidden ${still ? "" : "touch-pan-y"} ${className}`}
    >
      {/* The sharp, graded photo underneath: the accessible image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={photo}
        crossOrigin="anonymous"
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        decoding="async"
        className={`absolute inset-0 size-full object-cover ${grade[tone]}`}
      />
      {/* Forced colours would paint these washes Canvas, and `lighten` with white blanks the photo. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-steel mix-blend-soft-light forced-colors:hidden ${tone === "flesh" ? "opacity-70" : ""}`}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-deep-ice mix-blend-lighten forced-colors:hidden" />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
    </div>
  );
}
