"use client";

import { useEffect, useState } from "react";

const START = 4 * 3600 + 12 * 60 + 33; // 04:12:33, from the brief
const URGENT_START = 27 * 60 + 48; // 00:27:48 — under 30 minutes

const pad = (n: number) => String(n).padStart(2, "0");

function parts(total: number) {
  return { h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

/**
 * The monument step in its natural habitat: the cutoff countdown. Frank Ruhl
 * Libre with tabular figures (its Latin subset has `tnum`), so the seconds never
 * jitter. Under 30 minutes it turns Salmon and breathes, slowly.
 */
export function CountdownSpecimen() {
  const [urgent, setUrgent] = useState(false);
  const [left, setLeft] = useState(START);

  useEffect(() => {
    const t = window.setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const { h, m, s } = parts(left);
  const spoken = h > 0 ? `${h} שעות ו־${m} דקות` : `${m} דקות`;

  return (
    <div className="flex flex-col gap-4">
      <p className="type-lead text-mist" id="cutoff-label">
        ההזמנה למחר נסגרת בעוד
      </p>
      <p
        role="timer"
        aria-labelledby="cutoff-label"
        aria-describedby="cutoff-spoken"
        className={
          "type-monument tracking-numerals [font-variant-numeric:tabular-nums_lining-nums] transition-colors duration-calm ease-glide " +
          (urgent ? "text-salmon motion-ok:animate-breath" : "text-frost")
        }
      >
        <bdi dir="ltr">
          {pad(h)}
          <span className="text-fog">:</span>
          {pad(m)}
          <span className="text-fog">:</span>
          {pad(s)}
        </bdi>
      </p>
      <p id="cutoff-spoken" className="sr-only">
        {spoken}
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
            "group inline-flex h-10 items-center gap-2 rounded-pill px-4 text-small font-medium " +
            "shadow-[inset_0_0_0_1px_var(--color-boundary)] transition-[background-color,box-shadow,color] duration-fast ease-glide " +
            "hover:bg-steel hover:shadow-[inset_0_0_0_1px_var(--color-mist)] " +
            "aria-pressed:bg-salmon aria-pressed:text-deep-ice aria-pressed:shadow-ember"
          }
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-salmon group-aria-pressed:bg-deep-ice" />
          מצב דחיפות: פחות מ־30 דקות
        </button>
        <span className="text-small text-mist">סלמון ופעימה איטית, 2 שניות למחזור</span>
      </div>
    </div>
  );
}
