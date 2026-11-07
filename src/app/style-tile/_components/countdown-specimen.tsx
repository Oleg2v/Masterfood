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

/** The time left as a Hebrew speaker says it: "4 שעות ו־12 דקות", "שעתיים ודקה", "27 דקות". */
function inWords(h: number, m: number) {
  if (h === 0) return m === 0 ? "פחות מדקה" : m === 1 ? "דקה אחת" : `${m} דקות`;
  const hours = h === 1 ? "שעה" : h === 2 ? "שעתיים" : `${h} שעות`;
  if (m === 0) return hours;
  return m === 1 ? `${hours} ודקה` : `${hours} ו־${m} דקות`;
}

/**
 * The monument step in its natural habitat: the cutoff countdown. Frank Ruhl
 * Libre with tabular figures (its Latin subset has `tnum`), so the seconds never
 * jitter. Under 30 minutes it turns Salmon and SAYS so in words; a glow layer
 * behind the plates breathes, the digits never dim.
 * With reduced motion or "עצירת אנימציה" it updates once a minute and drops the
 * seconds (WCAG 2.2.2): HH:MM, still and quiet. CSS hides the seconds, so the
 * server markup is already right for every visitor and the giant never jumps.
 * Assistive tech reads the time in words; the plates are for the eye.
 */
export function CountdownSpecimen() {
  const still = useStill();
  const pinned = usePinned();
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

  return (
    <div className="flex flex-col gap-4">
      <p className="type-section hang-section flex flex-wrap items-baseline gap-x-3 text-frost-2">
        <span id="cutoff-label">ההזמנה למחר נסגרת בעוד</span>
        {/* always rendered: at rest it is invisible and only reserves its width where the clock's
            column is sized by its content (xl), so switching urgency never moves the giant */}
        <span
          aria-hidden={urgent ? undefined : true}
          className={`whitespace-nowrap text-caption font-medium text-salmon ${urgent ? "" : "invisible max-xl:hidden"}`}
        >
          נסגרת בקרוב · פחות מ־<Num joined>30</Num> דקות
        </span>
      </p>
      {/* role="timer" is aria-live="off" by default: the time is there to be read, never announced */}
      <p
        role="timer"
        aria-labelledby="cutoff-label"
        className={
          "type-display relative isolate self-start tracking-numerals [font-variant-numeric:tabular-nums_lining-nums] transition-colors duration-state ease-glide " +
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
        <span className="sr-only">{inWords(h, m)}</span>
        {/* six steel plates, one per digit; the colons stand free between them */}
        <bdi dir="ltr" aria-hidden="true" className="inline-flex items-center gap-[0.04em]">
          <Plates value={pad(h)} />
          <Colon />
          <Plates value={pad(m)} />
          {/* the seconds stand down whenever motion is still; ?still=1 keeps them for the screenshot */}
          <span className={pinned ? "contents" : "contents motion-still:hidden"}>
            <Colon />
            <Plates value={pad(s)} />
          </span>
        </bdi>
      </p>
      {/* the absolute time: a butcher plans by the clock, not by a difference; on a phone, one fact per line */}
      <p className="text-body text-frost-2">
        <span className="whitespace-nowrap">
          נסגרת היום ב־<Num joined>14:00</Num>
        </span>
        <span className="max-sm:hidden"> · </span>
        <span className="whitespace-nowrap max-sm:block">
          אספקה מחר, יום שישי, מ־<Num joined>06:00</Num>
        </span>
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
            "group relative inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-edge px-4 text-caption font-medium text-frost inset-ring inset-ring-edge " +
            "transition-[background-color,color,translate] duration-hover ease-glide active:translate-y-px active:shadow-pressed active:duration-tap " +
            "after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] " + // 44px hit area
            "hover:bg-steel hover:inset-ring-frost-2 " +
            // the one selected style: Frost fill, Deep Ice label. Salmon stays in the digits this switches.
            "aria-pressed:bg-frost aria-pressed:text-deep-ice " +
            // forced colours: the system Highlight pair, unforced, so no Canvas backplate hides the label
            "forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:text-[HighlightText] forced-colors:aria-pressed:forced-color-adjust-none"
          }
        >
          {/* a lamp in the button's own ink: an empty ring at rest, filled while pressed */}
          <span
            aria-hidden="true"
            className="size-2 rounded-full inset-ring-[1.5px] inset-ring-frost-2 group-aria-pressed:bg-current group-aria-pressed:inset-ring-current"
          />
          <span>
            מצב דחיפות: פחות מ־<Num joined>30</Num> דקות
          </span>
        </button>
        <span className="text-caption text-pretty text-frost-2 motion-still:hidden">
          הספרות בסלמון, והילה נושמת מאחוריהן,{" "}
          <span className="whitespace-nowrap">
            <Num>2.4</Num> שניות
          </span>{" "}
          למחזור
        </span>
        <span className="hidden text-caption text-pretty text-frost-2 motion-still:inline">הספרות בסלמון, והילה קבועה מאחוריהן</span>
      </div>
    </div>
  );
}
