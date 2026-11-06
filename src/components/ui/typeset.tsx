import { Fragment } from "react";
import { Shekel } from "./money";
import { Num } from "./num";

/* A figure: optional ₪ or sign, digits with separators, optional % or °. It ends on a digit
   (or % / °), so sentence punctuation after it ("01:", "5568,") stays outside the LTR isolate. */
const FIGURE = /(₪?[−+]?\d(?:[\d.,:–]*\d)?[%°]?)/g;

/**
 * Plain strings with figures in them (concept lines, decisions, notes): every figure becomes
 * an isolated LTR <Num> in Plex Mono, a leading ₪ is the same small Heebo <Shekel> that
 * <Money> sets, and a figure that follows a maqaf (כ־₪1,780.00, כ־20) hugs it. Text stays
 * text; nothing else is touched.
 */
export function Typeset({ text }: { text: string }) {
  const parts = text.split(FIGURE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <Num key={i} joined={parts[i - 1]?.endsWith("־")}>
            {p.startsWith("₪") ? (
              <>
                <Shekel />
                {p.slice(1)}
              </>
            ) : (
              p
            )}
          </Num>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
