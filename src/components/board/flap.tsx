import type { CSSProperties, ReactNode } from "react";

/**
 * Split-flap material, static. Stage 0 shows the plates; Stage 1 animates them
 * (falling top leaf, landing bottom leaf, Hebrew drum in reading order).
 *
 * Hebrew letters don't join, so a Hebrew word splits into one-letter flaps without
 * breaking its shaping: the boards set Hebrew values letter by letter (0.66em cells
 * of Frank Ruhl Libre 500, whose widest letter, ש, is 0.619em). Solari boards also
 * used whole-word plates, for destinations, and so do we: <FlapCells> for codes,
 * figures and hex values (Plex Mono, one glyph per 0.72em cell), <FlapWord> for a
 * Hebrew word that reads as a label rather than a value (a token's meaning, or a
 * name on a narrow board), where one plate keeps the word to its natural width.
 *
 * The plates carry no ink of their own: each board sets its colour (Frost for
 * values, Frost-2 for a change column, Salmon for the urgent clock).
 */

export const flapPlate =
  "relative inline-flex items-center justify-center overflow-hidden rounded-hair bg-well " +
  "shadow-[inset_0_1px_0_0_rgb(232_243_247/0.07),inset_0_-1px_0_0_rgb(1_6_10/0.9),0_1px_0_0_rgb(1_6_10/0.9)] " +
  // upper half catches the overhead light, lower half sits in shadow; the seam is a 1px cut
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-[linear-gradient(to_bottom,rgb(232_243_247/0.06),rgb(232_243_247/0.015))] before:content-[''] " +
  "after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:bg-shadow-ink after:shadow-[0_1px_0_0_rgb(232_243_247/0.05)] after:content-['']";

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
  // Visual only, and hidden from assistive tech by itself: read cell by cell, a value comes out one
  // glyph at a time ("0 4 : 1 2"). Callers render the same text once more, whole, in an sr-only span.
  return (
    <bdi dir="ltr" aria-hidden="true" className={`inline-flex gap-px ${className}`}>
      {[...text].map((ch, i) => (
        /* a space is a blank flap, exactly as wide as a glyph flap */
        <span
          key={i}
          className={`${flapPlate} h-[1.5em] w-[0.72em] font-mono font-medium [font-variant-numeric:tabular-nums] ${cellClassName}`}
        >
          {/* blank flaps carry an invisible glyph so every row shares one baseline */}
          {ch === " " ? <span className="invisible">0</span> : <span className="relative">{ch}</span>}
        </span>
      ))}
    </bdi>
  );
}

/** A whole-word plate, for a Hebrew word that reads as a label (a name, a meaning), not as a value. */
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
    <span className={`${flapPlate} h-[1.5em] px-[0.4em] ${className}`} style={style}>
      <span className="relative whitespace-nowrap">{children}</span>
    </span>
  );
}
