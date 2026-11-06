"use client";

import { useEffect, useState } from "react";
import { flapPlate } from "@/components/board/flap";
import { Num } from "@/components/ui/num";
import { usePinned, useStill } from "@/lib/use-motion";

const START = 4 * 3600 + 12 * 60 + 33; // 04:12:33, from the brief
const URGENT_START = 27 * 60 + 48; // 00:27:48 — under 30 minutes

const pad = (n: number) => String(n).padStart(2, "0");

/* Frank Ruhl digits measure 0.458–0.559em, so a 0.62em plate makes them tabular by construction. */
function Plates({ value }: { value: string }) {
  return (
    <>
      {[...value].map((d, i) => (
        <span key={i} className={`${flapPlate} h-[1.12em] w-[0.62em] rounded-hair`}>
          <span className="relative">{d}</span>
        </span>
      ))}
    </>
  );
}
const Colon = () => <span className="w-[0.32em] text-center text-frost-3">:</span>;

function parts(total: number) {
  return { h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

/**
 * The monument step in its natural habitat: the cutoff countdown. Frank Ruhl
 * Libre with tabular figures (its Latin subset has `tnum`), so the seconds never
 * jitter. Under 30 minutes it turns Salmon and SAYS so in words; a glow layer
 * behind the plates breathes, the digits never dim.
 * With reduced motion or "עצירת אנימציה" it updates once a minute and drops the
 * seconds (WCAG 2.2.2): HH:MM, still and quiet.
 */
export function CountdownSpecimen() {
  const still = useStill();
  const pinned = usePinned();
  const seconds = pinned || !still;
  const [urgent, setUrgent] = useState(false);
  const [left, setLeft] = useState(START);

  useEffect(() => {
    if (pinned) return;
    if (still) {
      const t = window.setInterval(() => setLeft((v) => Math.max(0, v - 60)), 60_000);
      return () => window.clearInterval(t);
    }
    const t = window.setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [still, pinned]);

  const { h, m, s } = parts(left);
  const spoken = h > 0 ? `${h} שעות ו־${m} דקות` : `${m} דקות`;

  return (
    <div className="flex flex-col gap-4">
      <p className="type-section hang-section flex flex-wrap items-baseline gap-x-3 text-frost-2" id="cutoff-label">
        ההזמנה למחר נסגרת בעוד
        {urgent ? (
          <span className="text-caption font-medium text-salmon">
            נסגרת בקרוב · פחות מ־<Num joined>30</Num> דקות
          </span>
        ) : null}
      </p>
      <p
        role="timer"
        aria-labelledby="cutoff-label"
        aria-describedby="cutoff-spoken"
        className={
          "type-display relative isolate self-start tracking-numerals [font-variant-numeric:tabular-nums_lining-nums] transition-colors duration-thaw ease-glide " +
          (urgent ? "text-salmon" : "text-frost")
        }
      >
        {/* under 30 minutes a Salmon glow breathes behind the plates; the digits themselves never dim */}
        {urgent ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[3%] inset-y-[14%] -z-10 rounded-edge shadow-glow-salmon motion-ok:animate-glow"
          />
        ) : null}
        {/* eight steel plates; the colons stand free between them */}
        <bdi dir="ltr" className="inline-flex items-center gap-[0.04em]">
          <Plates value={pad(h)} />
          <Colon />
          <Plates value={pad(m)} />
          {seconds ? (
            <>
              <Colon />
              <Plates value={pad(s)} />
            </>
          ) : null}
        </bdi>
      </p>
      <p id="cutoff-spoken" className="sr-only">
        {spoken}
      </p>
      {/* the absolute time: a butcher plans by the clock, not by a difference */}
      <p className="text-body text-frost-2">
        נסגרת היום ב־<Num joined>14:00</Num> · אספקה מחר, יום שישי, מ־<Num joined>06:00</Num>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={urgent}
          onClick={() => {
            setUrgent((u) => !u);
            setLeft(urgent ? START : URGENT_START);
          }}
          className={
            "group relative inline-flex h-10 items-center gap-2 rounded-edge px-4 text-caption font-medium inset-ring inset-ring-edge " +
            "transition-[background-color,color,scale] duration-hover ease-glide active:scale-press " +
            "after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] " + // 44px hit area
            "hover:bg-steel hover:inset-ring-frost-2 " +
            "aria-pressed:bg-salmon aria-pressed:text-deep-ice aria-pressed:inset-ring-0"
          }
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-salmon group-aria-pressed:bg-deep-ice" />
          <span>
            מצב דחיפות: פחות מ־<Num joined>30</Num> דקות
          </span>
        </button>
        <span className="text-caption text-frost-2">
          הספרות בסלמון, והילה נושמת מאחוריהן, <Num>2.4</Num> שניות למחזור
        </span>
      </div>
    </div>
  );
}
