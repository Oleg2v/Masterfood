"use client";

import { setMotionStopped, useStill } from "@/lib/use-motion";

/**
 * "עצירת אנימציה" — IS 5568 asks for a way to stop moving content. A real toggle
 * button with a constant name; aria-pressed says whether the page is still, for
 * whatever reason: it starts from the OS reduced-motion setting, and a press
 * overrides that in either direction (html[data-motion], see use-motion). Every
 * instance reads one shared store, so two toggles can never disagree. The choice
 * is restored before first paint by the script in the root layout.
 *
 * The pressed look is also painted from the motion-still CSS condition, which is
 * the store's own rule, so a reduced-motion visitor sees the right state in the
 * server markup instead of a flip at hydration.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const still = useStill();

  return (
    <button
      type="button"
      aria-pressed={still}
      onClick={() => setMotionStopped(!still)}
      className={
        "group relative inline-flex h-10 items-center gap-2 rounded-edge px-4 text-caption font-medium text-frost inset-ring inset-ring-edge " +
        "transition-[background-color,color,translate] duration-hover ease-glide active:translate-y-px active:shadow-pressed active:duration-tap " +
        "after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] " + // 44px hit area
        "hover:bg-steel hover:inset-ring-frost-2 " +
        "aria-pressed:bg-frost aria-pressed:text-deep-ice motion-still:bg-frost motion-still:text-deep-ice " +
        // Forced colours repaint the Frost fill as Canvas. Pressed opts out of forcing and paints the system
        // Highlight pair itself (forcing would also lay a Canvas backplate under the HighlightText label).
        "forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:text-[HighlightText] forced-colors:aria-pressed:forced-color-adjust-none " +
        "forced-colors:motion-still:bg-[Highlight] forced-colors:motion-still:text-[HighlightText] forced-colors:motion-still:forced-color-adjust-none " +
        className
      }
    >
      {/* SVG in currentColor, so the glyphs survive forced colours; media glyphs are not mirrored in RTL */}
      {/* moving → the glyph offers pause */}
      <svg aria-hidden="true" viewBox="0 0 9 12" width="9" height="12" fill="currentColor" className="shrink-0 group-aria-pressed:hidden motion-still:hidden">
        <rect width="3" height="12" rx="1" />
        <rect x="6" width="3" height="12" rx="1" />
      </svg>
      {/* still → the glyph offers play */}
      <svg aria-hidden="true" viewBox="0 0 9 12" width="9" height="12" fill="currentColor" className="hidden shrink-0 group-aria-pressed:block motion-still:block">
        <path d="M0 0 9 6 0 12Z" />
      </svg>
      עצירת אנימציה
    </button>
  );
}
