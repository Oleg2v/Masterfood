import type { CSSProperties, ReactNode } from "react";

/**
 * Split-flap material, static. Stage 0 shows the plates; Stage 1 animates them
 * (falling top leaf, landing bottom leaf, Hebrew drum in reading order).
 *
 * Solari boards used two kinds of flap: one glyph per cell for times and
 * figures, and whole-word plates for destinations. We do the same: <FlapCells>
 * for codes, figures and hex values (Plex Mono, fixed 0.66em cells), <FlapWord>
 * for Hebrew words, whose shaping must never be split across cells.
 */

const plate =
  "relative inline-flex items-center justify-center overflow-hidden rounded-xs bg-abyss text-frost " +
  "shadow-[inset_0_1px_0_0_rgb(232_243_247/0.07),inset_0_-1px_0_0_rgb(1_6_10/0.9),0_1px_0_0_rgb(1_6_10/0.9)] " +
  // upper half catches the overhead light, lower half sits in shadow; the seam is a 1px cut
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-[linear-gradient(to_bottom,rgb(232_243_247/0.06),rgb(232_243_247/0.015))] before:content-[''] " +
  "after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:bg-seam after:shadow-[0_1px_0_0_rgb(232_243_247/0.05)] after:content-['']";

/** One glyph per cell, for Latin codes and figures. Rendered LTR and isolated. */
export function FlapCells({
  text,
  className = "",
  cellClassName = "",
}: {
  text: string;
  className?: string;
  cellClassName?: string;
}) {
  // Visual only: callers render the same text for assistive tech (sr-only) and hide this.
  return (
    <bdi dir="ltr" className={`inline-flex gap-px ${className}`}>
      {[...text].map((ch, i) => (
        /* a space is a blank flap, exactly as wide as a glyph flap */
        <span
          key={i}
          aria-hidden={ch === " " ? true : undefined}
          className={`${plate} h-[1.5em] w-[0.72em] font-mono font-medium [font-variant-numeric:tabular-nums] ${cellClassName}`}
        >
          {/* blank flaps carry an invisible glyph so every row shares one baseline */}
          {ch === " " ? <span className="invisible">0</span> : <span className="relative">{ch}</span>}
        </span>
      ))}
    </bdi>
  );
}

/** A whole-word plate, for Hebrew (never split a shaped word across cells). */
export function FlapWord({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`${plate} h-[1.5em] px-[0.4em] ${className}`} style={style}>
      <span className="relative whitespace-nowrap">{children}</span>
    </span>
  );
}
