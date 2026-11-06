import { Num } from "./num";

const fmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * The shekel sign, set the one way the portal sets it: Heebo 500 at 0.75em, a hair before
 * the Plex Mono figure, inside the figure's LTR isolate. Plex Mono's own shekel is a full
 * monospace cell and shouts; the small Heebo sign sits like a menu's currency mark.
 * <Money> and <Typeset> both use it, so a price reads the same in a row and in a sentence.
 */
export function Shekel() {
  return <span className="me-[0.06em] font-sans text-[0.75em] font-medium">₪</span>;
}

/**
 * A price: the <Shekel> sign before Plex Mono figures, isolated LTR. A credit reads "−₪12.40":
 * a true minus (U+2212), ahead of the sign, and never on a figure that rounds to zero.
 */
export function Money({ value, round = false, joined = false, className = "" }: { value: number; round?: boolean; joined?: boolean; className?: string }) {
  const figure = (round ? fmt0 : fmt).format(Math.abs(value));
  const minus = value < 0 && /[1-9]/.test(figure);
  return (
    <Num className={className} joined={joined}>
      {minus ? "−" : null}
      <Shekel />
      {figure}
    </Num>
  );
}
