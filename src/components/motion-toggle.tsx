"use client";

import { useEffect, useState } from "react";

const KEY = "mf-motion";

/**
 * "עצירת אנימציה" — IS 5568 asks for a way to stop moving content. Sets
 * html[data-motion="off"], which globals.css treats exactly like
 * prefers-reduced-motion: reduce. Remembered per viewer when storage allows.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const [off, setOff] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "off") setOff(true);
    } catch {
      /* storage blocked: default on */
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (off) html.dataset.motion = "off";
    else delete html.dataset.motion;
    try {
      localStorage.setItem(KEY, off ? "off" : "on");
    } catch {
      /* ignore */
    }
  }, [off]);

  return (
    <button
      type="button"
      aria-pressed={off}
      onClick={() => setOff((v) => !v)}
      className={
        "inline-flex h-10 items-center gap-2 rounded-pill px-4 text-small font-medium text-frost " +
        "shadow-[inset_0_0_0_1px_var(--color-boundary)] transition-[background-color,box-shadow] duration-fast ease-glide " +
        "hover:bg-steel hover:shadow-[inset_0_0_0_1px_var(--color-mist)] aria-pressed:bg-frost aria-pressed:text-deep-ice " +
        className
      }
    >
      <span aria-hidden="true" className="flex h-3 items-center gap-[3px]">
        {off ? (
          /* stopped → offer play (media glyphs are not mirrored in RTL) */
          <span className="size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
        ) : (
          /* running → offer pause */
          <>
            <span className="h-3 w-[3px] rounded-[1px] bg-current" />
            <span className="h-3 w-[3px] rounded-[1px] bg-current" />
          </>
        )}
      </span>
      {off ? "הפעלת אנימציה" : "עצירת אנימציה"}
    </button>
  );
}
