"use client";

import { setMotionStopped, useMotionStopped } from "@/lib/use-motion";

/**
 * "עצירת אנימציה" — IS 5568 asks for a way to stop moving content. A real toggle
 * button with a constant name; aria-pressed carries the state. Every instance
 * reads one shared store (html[data-motion]), so two toggles can never disagree.
 * The choice is restored before first paint by the script in the root layout.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const off = useMotionStopped();

  return (
    <button
      type="button"
      aria-pressed={off}
      onClick={() => setMotionStopped(!off)}
      className={
        "relative inline-flex h-10 items-center gap-2 rounded-pill px-4 text-small font-medium text-frost inset-ring inset-ring-boundary " +
        "transition-[background-color,color,scale] duration-fast ease-glide active:scale-press " +
        "after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] " + // 44px hit area
        "hover:bg-steel hover:inset-ring-mist aria-pressed:bg-frost aria-pressed:text-deep-ice " +
        className
      }
    >
      <span aria-hidden="true" className="flex h-3 w-[9px] items-center gap-[3px]">
        {off ? (
          /* stopped → the glyph offers play (media glyphs are not mirrored in RTL) */
          <span className="size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
        ) : (
          /* running → the glyph offers pause */
          <>
            <span className="h-3 w-[3px] rounded-hair bg-current" />
            <span className="h-3 w-[3px] rounded-hair bg-current" />
          </>
        )}
      </span>
      עצירת אנימציה
    </button>
  );
}
