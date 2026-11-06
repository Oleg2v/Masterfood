"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Display-case glass: a frosted copy of the photo on a 2D canvas that a finger
 * or cursor wipes clear, and that slowly freezes over again.
 *
 * This is the style-tile material sample, a cheap stand-in for the Stage 1
 * WebGL shader: one blurred bitmap is built once; wiping is a soft
 * destination-out stroke; refreezing redraws that bitmap at low alpha until
 * the glass is opaque again, then the loop sleeps. Horizontal drags wipe,
 * vertical drags scroll (touch-action: pan-y). With reduced motion, or the
 * "עצירת אנימציה" toggle, it is a still: a composed, pre-wiped arc.
 */
export function FrostGlass({
  src,
  alt,
  className = "",
  hint = "נגבו את הכפור",
}: {
  /** A same-origin URL (e.g. /_next/image?...) so the canvas is not tainted. */
  src: string;
  alt: string;
  className?: string;
  hint?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const still = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    let frost: HTMLCanvasElement | null = null;
    let raf = 0;
    let lastWipe = 0;
    let prev: { x: number; y: number } | null = null;
    let dpr = 1;

    const cover = (c: CanvasRenderingContext2D, w: number, h: number) => {
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
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

    const composedArc = () => {
      // The still frame: one diagonal finger-stroke, as if someone just checked the fish.
      const w = cv.width;
      const h = cv.height;
      const pts = Array.from({ length: 24 }, (_, i) => {
        const t = i / 23;
        return { x: w * (0.92 - 0.8 * t), y: h * (0.72 - 0.42 * Math.sin(t * Math.PI * 0.9)) };
      });
      for (let i = 1; i < pts.length; i++) stroke(pts[i - 1]!, pts[i]!, Math.min(w, h) * 0.12);
    };

    const build = () => {
      if (!img.complete || !img.naturalWidth) return;
      const rect = el.getBoundingClientRect();
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(rect.width * dpr));
      cv.height = Math.max(1, Math.round(rect.height * dpr));
      frost = document.createElement("canvas");
      frost.width = cv.width;
      frost.height = cv.height;
      const f = frost.getContext("2d");
      if (!f) return;
      f.filter = `blur(${Math.round(16 * dpr)}px) saturate(0.55) brightness(1.08)`;
      cover(f, cv.width, cv.height);
      f.filter = "none";
      // a pale condensation veil, brighter toward the top like cold air settling
      const g = f.createLinearGradient(0, 0, 0, cv.height);
      g.addColorStop(0, "rgba(232,243,247,0.34)");
      g.addColorStop(1, "rgba(232,243,247,0.18)");
      f.fillStyle = g;
      f.fillRect(0, 0, cv.width, cv.height);
      // crystal speckle
      const n = Math.round((cv.width * cv.height) / 900);
      for (let i = 0; i < n; i++) {
        f.fillStyle = `rgba(244,251,253,${0.05 + Math.random() * 0.12})`;
        const s = (0.6 + Math.random() * 1.4) * dpr;
        f.fillRect(Math.random() * cv.width, Math.random() * cv.height, s, s);
      }
      paintFrost();
      if (still()) composedArc();
    };

    const refreeze = () => {
      if (!frost) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.045;
      ctx.drawImage(frost, 0, 0);
      ctx.globalAlpha = 1;
      if (performance.now() - lastWipe < 2800) raf = requestAnimationFrame(refreeze);
      else {
        paintFrost();
        raf = 0;
      }
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
      lastWipe = performance.now();
      setTouched(true);
      if (!raf) raf = requestAnimationFrame(refreeze);
    };
    const onLeave = () => {
      prev = null;
    };

    img.onload = build;
    if (img.complete) build();
    const ro = new ResizeObserver(() => build());
    ro.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerup", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerup", onLeave);
    };
  }, [src]);

  return (
    <div ref={wrap} className={`relative isolate touch-pan-y select-none overflow-hidden ${className}`}>
      {/* The sharp photo underneath: the accessible image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover [filter:saturate(0.92)_contrast(1.06)_brightness(0.9)]" />
      <span aria-hidden="true" className="absolute inset-0 bg-deep-ice mix-blend-lighten" />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
      <p
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-4 text-center text-small text-deep-ice transition-opacity duration-slow ease-glide ${touched ? "opacity-0" : "opacity-100"}`}
      >
        <span className="rounded-pill bg-frost/90 px-3 py-1.5">{hint}</span>
      </p>
    </div>
  );
}
