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

/** A price: the <Shekel> sign before Plex Mono figures, isolated LTR. */
export function Money({ value, round = false, joined = false, className = "" }: { value: number; round?: boolean; joined?: boolean; className?: string }) {
  return (
    <Num className={className} joined={joined}>
      <Shekel />
      {(round ? fmt0 : fmt).format(value)}
    </Num>
  );
}
