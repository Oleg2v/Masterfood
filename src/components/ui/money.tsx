import { Num } from "./num";

const fmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * A price: the ₪ set in Heebo at 0.75em before Plex Mono figures, isolated LTR.
 * Plex Mono's own shekel is a full monospace cell and shouts; the small Heebo
 * sign sits like a menu's currency mark.
 */
export function Money({ value, round = false, className = "" }: { value: number; round?: boolean; className?: string }) {
  return (
    <Num className={className}>
      <span className="me-[0.06em] font-sans text-[0.75em] font-medium">₪</span>
      {(round ? fmt0 : fmt).format(value)}
    </Num>
  );
}
