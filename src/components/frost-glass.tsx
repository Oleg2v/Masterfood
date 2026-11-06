"use client";

import { useEffect, useRef } from "react";
import { durations } from "@/design/tokens";
import { isPinned } from "@/lib/use-motion";

const REFREEZE_MS = durations.find((d) => d.id === "refreeze")!.ms;
/* Exponential return: 98% of the frost is back by REFREEZE_MS, whatever the frame rate. */
const TAU = REFREEZE_MS / 4;
const DEMO_MS = 900;

/* The house grade (see GradedPhoto), applied to the photo under the glass. */
const grade = {
  flesh: "[filter:brightness(0.92)_contrast(1.1)_saturate(1.14)]",
  cold: "[filter:brightness(0.9)_contrast(1.24)_saturate(0.55)]",
} as const;

/**
 * Display-case glass: a frosted copy of the photo on a 2D canvas that a finger
 * or cursor wipes clear, and that freezes over again in 2.4s.
 *
 * The Stage 0 stand-in for the Stage 1 WebGL shader: one frosted bitmap is built
 * once (the only blur, baked, never per frame); a wipe is a soft destination-out
 * stroke; refreezing redraws that bitmap with a time-based alpha until the glass
 * is whole, then the loop sleeps. On first view one 900ms stroke shows the
 * gesture. Horizontal drags wipe, vertical drags scroll (touch-action: pan-y).
 * With reduced motion or "עצירת אנימציה" it is a still: a composed, pre-wiped arc.
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
  /** Same-origin URLs (e.g. /_next/image?...) so the canvas is not tainted. */
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

  useEffect(() => {
    const el = wrap.current;
    const img = photo.current;
    const cv = canvas.current;
    if (!el || !img || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const still = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "off" ||
      isPinned();

    let frost: HTMLCanvasElement | null = null;
    let raf = 0;
    let lastFrame = 0;
    let lastWipe = 0;
    let prev: { x: number; y: number } | null = null;
    let dpr = 1;
    let demoed = false;
    let disposed = false;

    // object-fit: cover, overscanned by `pad` px so the blur never pulls transparent edges in
    const cover = (c: CanvasRenderingContext2D, w: number, h: number, pad = 0) => {
      const W = w + pad * 2;
      const H = h + pad * 2;
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      c.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const paintFrost = () => {
      if (!frost) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(frost, 0, 0);
    };

    const stroke = (from: { x: number; y: number }, to: { x: number; y: number }, r: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = r * 2;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = r * 0.9;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x + 0.01, to.y);
      ctx.stroke();
      ctx.restore();
    };

    // One diagonal finger-stroke, as if someone had just checked the fish: the still
    // frame, and the path of the first-view demonstration.
    const arc = () => {
      const w = cv.width;
      const h = cv.height;
      return Array.from({ length: 32 }, (_, i) => {
        const t = i / 31;
        return { x: w * (0.9 - 0.78 * t), y: h * (0.7 - 0.4 * Math.sin(t * Math.PI * 0.9)) };
      });
    };
    const arcRadius = () => Math.min(cv.width, cv.height) * 0.12;

    const composedArc = () => {
      const pts = arc();
      for (let i = 1; i < pts.length; i++) stroke(pts[i - 1]!, pts[i]!, arcRadius());
    };

    const build = () => {
      if (disposed || !img.complete || !img.naturalWidth) return;
      const rect = el.getBoundingClientRect();
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(rect.width * dpr));
      cv.height = Math.max(1, Math.round(rect.height * dpr));
      frost = document.createElement("canvas");
      frost.width = cv.width;
      frost.height = cv.height;
      const f = frost.getContext("2d");
      if (!f) return;
      const blur = Math.round(18 * dpr);
      f.filter = `blur(${blur}px) saturate(0.38) brightness(1.04)`;
      cover(f, cv.width, cv.height, blur * 2);
      f.filter = "none";
      // a pale condensation veil, brighter toward the top like cold air settling
      const g = f.createLinearGradient(0, 0, 0, cv.height);
      g.addColorStop(0, "rgba(232,243,247,0.5)");
      g.addColorStop(1, "rgba(200,220,230,0.32)");
      f.fillStyle = g;
      f.fillRect(0, 0, cv.width, cv.height);
      // crystal speckle, seeded so every build of the glass looks the same
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      const n = Math.round((cv.width * cv.height) / 900);
      for (let i = 0; i < n; i++) {
        f.fillStyle = `rgba(244,251,253,${0.05 + rnd() * 0.12})`;
        const s = (0.6 + rnd() * 1.4) * dpr;
        f.fillRect(rnd() * cv.width, rnd() * cv.height, s, s);
      }
      paintFrost();
      if (still()) composedArc();
    };

    const refreeze = (now: number) => {
      if (!frost) return;
      const dt = lastFrame ? Math.min(64, now - lastFrame) : 16;
      lastFrame = now;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1 - Math.exp(-dt / TAU);
      ctx.drawImage(frost, 0, 0);
      ctx.globalAlpha = 1;
      if (performance.now() - lastWipe < REFREEZE_MS) raf = requestAnimationFrame(refreeze);
      else {
        paintFrost();
        raf = 0;
        lastFrame = 0;
      }
    };
    const wake = () => {
      lastWipe = performance.now();
      if (!raf) raf = requestAnimationFrame(refreeze);
    };

    const point = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
    };

    const onMove = (e: PointerEvent) => {
      if (!frost || still()) return;
      if (e.pointerType === "touch" && e.buttons === 0) return;
      const p = point(e);
      const radius = (e.pointerType === "touch" ? 44 : 56) * dpr;
      stroke(prev ?? p, p, radius);
      prev = p;
      demoed = true; // a real hand got there first
      wake();
    };
    const onLeave = () => {
      prev = null;
    };

    // The first-view demonstration: the arc drawn once over 900ms, then it refreezes.
    const runDemo = () => {
      if (demoed || !frost || still()) return;
      demoed = true;
      const pts = arc();
      const r = arcRadius() * 0.8;
      const t0 = performance.now();
      let i = 1;
      const step = (now: number) => {
        if (disposed) return;
        const k = Math.min(1, (now - t0) / DEMO_MS);
        const eased = 1 - Math.pow(1 - k, 3);
        const upto = Math.floor(eased * (pts.length - 1));
        for (; i <= upto; i++) stroke(pts[i - 1]!, pts[i]!, r);
        wake();
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = demo
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io?.disconnect();
              window.setTimeout(runDemo, 400);
            }
          },
          { threshold: 0.6 },
        )
      : null;

    const onLoad = () => {
      build();
      io?.observe(el);
    };
    if (img.complete && img.naturalWidth) onLoad();
    else img.addEventListener("load", onLoad, { once: true });
    const ro = new ResizeObserver(() => build());
    ro.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerup", onLeave);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      img.removeEventListener("load", onLoad);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerup", onLeave);
    };
  }, [src, srcSet, demo]);

  return (
    <div ref={wrap} className={`${fill ? "absolute inset-0" : "relative"} isolate touch-pan-y select-none overflow-hidden ${className}`}>
      {/* The sharp, graded photo underneath: the accessible image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={photo}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        decoding="async"
        className={`absolute inset-0 size-full object-cover ${grade[tone]}`}
      />
      <span aria-hidden="true" className={`absolute inset-0 bg-steel mix-blend-soft-light ${tone === "flesh" ? "opacity-70" : ""}`} />
      <span aria-hidden="true" className="absolute inset-0 bg-deep-ice mix-blend-lighten" />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
    </div>
  );
}
