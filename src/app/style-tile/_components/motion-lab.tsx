"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Typeset } from "@/components/ui/typeset";
import { cubicBezier, durations, easings } from "@/design/tokens";

const NB = " ";

function Curve({ bezier }: { bezier: readonly [number, number, number, number] }) {
  const [x1, y1, x2, y2] = bezier;
  const S = 96;
  // A graph, not a movement: time runs left to right on x, as on any number line and as
  // cubic-bezier() is written, so the curve matches the values printed beside it.
  const X = (t: number) => t * S;
  const Y = (v: number) => S - v * S;
  const d = `M${X(0)},${Y(0)} C${X(x1)},${Y(y1)} ${X(x2)},${Y(y2)} ${X(1)},${Y(1)}`;
  return (
    <svg viewBox={`-4 -4 ${S + 8} ${S + 8}`} className="size-20 shrink-0 overflow-visible sm:size-24" aria-hidden="true">
      <rect x="0" y="0" width={S} height={S} fill="none" stroke="var(--color-hairline)" />
      <path d={`M${X(0)},${Y(0)} L${X(x1)},${Y(y1)} M${X(1)},${Y(1)} L${X(x2)},${Y(y2)}`} stroke="var(--color-edge)" strokeDasharray="2 3" />
      <path d={d} fill="none" stroke="var(--color-frost)" strokeWidth="1.5" />
      <circle cx={X(x1)} cy={Y(y1)} r="2.5" fill="var(--color-frost-2)" />
      <circle cx={X(x2)} cy={Y(y2)} r="2.5" fill="var(--color-frost-2)" />
    </svg>
  );
}

/* Bar length on a log scale from the shortest token to the longest, so 60ms and a fog loop both read. */
const MIN_MS = Math.min(...durations.map((d) => d.ms));
const MAX_MS = Math.max(...durations.map((d) => d.ms));
const barPct = (ms: number) => (MAX_MS > MIN_MS ? Math.max(8, (Math.log(ms / MIN_MS) / Math.log(MAX_MS / MIN_MS)) * 100) : 100);

/**
 * Durations and easings, playable. Everything that moves travels start → end (right → left in
 * RTL); the easing plots are graphs, so their time axis runs left to right like any number line.
 * With reduced motion or "עצירת אנימציה" the transitions collapse to ~0ms and the end state
 * simply appears.
 */
export function MotionLab() {
  const [play, setPlay] = useState(false);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => setPlay((p) => !p)}
          icon={
            /* media glyphs are not mirrored in RTL: play points right */
            play ? (
              <svg aria-hidden="true" viewBox="0 0 10 10" width="10" height="10" fill="currentColor" className="shrink-0">
                <rect width="10" height="10" rx="1" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 9 12" width="9" height="12" fill="currentColor" className="shrink-0">
                <path d="M0 0 9 6 0 12Z" />
              </svg>
            )
          }
        >
          {play ? "איפוס" : "הפעלת ההדגמה"}
        </Button>
        <p className="text-caption text-pretty text-frost-2">
          כל תנועה הולכת מההתחלה אל הסוף{NB}– מימין לשמאל. רק בגרפים הזמן רץ משמאל לימין, כמו על כל ציר מספרים.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 lang="en" className="label-latin text-frost-3">
            Durations
          </h3>
          <ul className="flex flex-col">
            {durations.map((d) => (
              <li key={d.id} className="grid grid-cols-[6.5rem_1fr] items-center gap-4 border-b border-hairline py-3">
                {/* LTR names shrink-wrap at the start (right) edge of their column */}
                <div className="flex flex-col items-start">
                  <bdi dir="ltr" className="num text-caption text-frost">
                    {d.id}
                  </bdi>
                  <bdi dir="ltr" className="num text-micro text-frost-2">
                    {d.ms >= 1000 ? `${d.ms / 1000}s` : `${d.ms}ms`}
                  </bdi>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="relative block h-1 overflow-hidden rounded-round bg-hairline" style={{ width: `${barPct(d.ms)}%` }}>
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
                  <span className="text-caption text-frost-2">
                    <Typeset text={d.usage} />
                  </span>
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
                  {/* the token over its value, like the durations: nothing is cut off at any width */}
                  <div className="flex flex-col items-start gap-0.5">
                    <bdi dir="ltr" className="num text-caption text-frost">
                      ease-{e.id}
                    </bdi>
                    <code dir="ltr" className="num text-micro whitespace-normal text-frost-2 [overflow-wrap:anywhere]">
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
                  <span className="text-caption text-frost-2">
                    <Typeset text={e.usage} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
