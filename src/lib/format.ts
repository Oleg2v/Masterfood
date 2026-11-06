/**
 * Number formatting for a Hebrew RTL trading floor.
 * Shekel sign before the amount (as in the brief: ₪62.90), comma thousands, dot decimals.
 * Render the results inside <bdi dir="ltr"> (see <Num/>) so bidi never reorders them.
 */

const ils = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const ilsRound = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const kg = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export const formatILS = (n: number, { round = false } = {}) => `₪${(round ? ilsRound : ils).format(n)}`;

export const formatKg = (n: number) => kg.format(n);

/** Signed, one decimal, true minus (U+2212): "+1.2%", "−0.8%", "0.0%". The glyph is drawn by <TrendGlyph>. */
export function formatChange(pct: number): { text: string; dir: "up" | "down" | "flat" } {
  if (Math.abs(pct) < 0.05) return { text: "0.0%", dir: "flat" };
  return pct > 0 ? { text: `+${pct.toFixed(1)}%`, dir: "up" } : { text: `−${Math.abs(pct).toFixed(1)}%`, dir: "down" };
}

/** Kilogram unit with a real gershayim (U+05F4), never a double quote. */
export const KG = "ק״ג";
