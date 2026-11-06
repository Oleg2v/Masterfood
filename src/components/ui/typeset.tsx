import { Fragment } from "react";
import { Shekel } from "./money";
import { Num } from "./num";

/* A figure: an optional sign and ₪ in either order (₪1,780.00, −₪12.40, ₪−12.40), digits with
   separators, an optional % or °. The sign travels inside the LTR isolate, so a bidi pass can
   never move it to the far side of the figure. It ends on a digit (or % / °), so sentence
   punctuation after it ("01:", "5568,") stays outside. */
const FIGURE = /([−+]?₪?[−+]?\d(?:[\d.,:–]*\d)?[%°]?)/g;

/** A figure's text, with its ₪ (if any) set as the small Heebo <Shekel>. */
function figure(p: string) {
  const at = p.indexOf("₪");
  if (at < 0) return p;
  return (
    <>
      {p.slice(0, at)}
      <Shekel />
      {p.slice(at + 1)}
    </>
  );
}

/**
 * Plain strings with figures in them (concept lines, decisions, notes): every figure becomes
 * an isolated LTR <Num> in Plex Mono, a ₪ in it is the same small Heebo <Shekel> that <Money>
 * sets, and a figure that follows a maqaf (כ־₪1,780.00, כ־20) hugs it. Text stays text;
 * nothing else is touched.
 */
export function Typeset({ text }: { text: string }) {
  const parts = text.split(FIGURE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <Num key={i} joined={parts[i - 1]?.endsWith("־")}>
            {figure(p)}
          </Num>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
