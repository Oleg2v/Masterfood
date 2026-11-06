"use client";

import { useState } from "react";
import { cubicBezier, durations, easings } from "@/design/tokens";

function Curve({ bezier }: { bezier: readonly [number, number, number, number] }) {
  const [x1, y1, x2, y2] = bezier;
  const S = 96;
  // RTL: time runs from the right edge to the left edge.
  const X = (t: number) => S - t * S;
  const Y = (v: number) => S - v * S;
  const d = `M${X(0)},${Y(0)} C${X(x1)},${Y(y1)} ${X(x2)},${Y(y2)} ${X(1)},${Y(1)}`;
  return (
    <svg viewBox={`-4 -4 ${S + 8} ${S + 8}`} className="size-24 shrink-0 overflow-visible" aria-hidden="true">
      <rect x="0" y="0" width={S} height={S} fill="none" stroke="var(--color-hairline)" />
      <path d={`M${X(0)},${Y(0)} L${X(x1)},${Y(y1)} M${X(1)},${Y(1)} L${X(x2)},${Y(y2)}`} stroke="var(--color-edge)" strokeDasharray="2 3" />
      <path d={d} fill="none" stroke="var(--color-frost)" strokeWidth="1.5" />
      <circle cx={X(x1)} cy={Y(y1)} r="2.5" fill="var(--color-frost-2)" />
      <circle cx={X(x2)} cy={Y(y2)} r="2.5" fill="var(--color-frost-2)" />
    </svg>
  );
}

/**
 * Durations and easings, playable. Everything travels start → end (right → left in
 * RTL). With reduced motion or "עצירת אנימציה" the transitions collapse to ~0ms and
 * the end state simply appears.
 */
export function MotionLab() {
  const [play, setPlay] = useState(false);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setPlay((p) => !p)}
          className="inline-flex h-12 items-center gap-3 rounded-edge bg-frost px-5 text-body font-medium text-deep-ice transition-[box-shadow,scale] duration-hover ease-glide hover:bg-frost-hover active:scale-press"
        >
          <span aria-hidden="true" className="size-0 border-y-[6px] border-e-[9px] border-y-transparent border-e-current" />
          {play ? "איפוס" : "הפעלת ההדגמה"}
        </button>
        <p className="text-caption text-frost-2">כל תנועה נעה מההתחלה לסוף – מימין לשמאל.</p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 lang="en" className="label-latin text-frost-3">
            Durations
          </h3>
          <ul className="flex flex-col">
            {durations.map((d) => (
              <li key={d.id} className="grid grid-cols-[5.5rem_1fr] items-center gap-4 border-b border-hairline py-3">
                <div className="flex flex-col">
                  <bdi dir="ltr" className="num text-caption text-frost">
                    {d.id}
                  </bdi>
                  <bdi dir="ltr" className="num text-micro text-frost-2">
                    {d.ms >= 1000 ? `${d.ms / 1000}s` : `${d.ms}ms`}
                  </bdi>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className="relative block h-1 overflow-hidden rounded-round bg-hairline"
                    style={{ width: `${Math.max(8, (Math.log(d.ms / 60) / Math.log(24000 / 60)) * 100)}%` }}
                  >
                    <span
                      className="absolute inset-0 origin-right bg-frost"
                      style={{
                        scale: play ? "1 1" : "0 1",
                        transitionProperty: "scale",
                        transitionDuration: play ? `${d.ms}ms` : "0ms",
                        transitionTimingFunction: "linear",
                      }}
                    />
                  </span>
                  <span className="text-caption text-frost-2">{d.usage}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 lang="en" className="label-latin text-frost-3">
            Easings
          </h3>
          <ul className="flex flex-col">
            {easings.map((e) => (
              <li key={e.id} className="flex items-center gap-5 border-b border-hairline py-4">
                <Curve bezier={e.bezier} />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <bdi dir="ltr" className="num text-caption text-frost">
                      ease-{e.id}
                    </bdi>
                    <code dir="ltr" className="num truncate text-micro text-frost-2">
                      {cubicBezier(e)}
                    </code>
                  </div>
                  <span className="relative block h-3">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-hairline" />
                    {/* The mover is exactly as wide as the travel, so translate(-100%) lands the dot on the end edge. */}
                    <span
                      className="absolute inset-y-0 right-0 w-[calc(100%-0.75rem)]"
                      style={{
                        translate: play ? "-100% 0" : "0 0",
                        transitionProperty: "translate",
                        transitionDuration: play ? "1200ms" : "0ms",
                        transitionTimingFunction: cubicBezier(e),
                      }}
                    >
                      <span className="absolute top-0 right-0 size-3 rounded-full bg-frost" />
                    </span>
                  </span>
                  <span className="text-caption text-frost-2">{e.usage}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
