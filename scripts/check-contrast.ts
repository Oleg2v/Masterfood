/**
 * Fails (exit 1) if any text or UI colour pair in the token set drops below
 * WCAG 2.x AA: 4.5:1 for text, 3:1 for UI boundaries.
 *
 *   npm run check:contrast
 */
import { colors, textGrounds } from "../src/design/tokens.ts";
import { composite, contrastRatio, formatRatio } from "../src/design/contrast.ts";

const hex = (id: string) => {
  const c = colors.find((x) => x.id === id);
  if (!c) throw new Error(`unknown colour token: ${id}`);
  return c.hex;
};

type Pair = { fg: string; bg: string; min: number; why: string };
const pairs: Pair[] = [];

for (const c of colors.filter((x) => x.text)) {
  for (const g of textGrounds) pairs.push({ fg: c.id, bg: g, min: 4.5, why: "text" });
}
// Fills that carry text
pairs.push({ fg: "frost", bg: "bordeaux", min: 4.5, why: "label on meat fill" });
pairs.push({ fg: "deep-ice", bg: "frost", min: 4.5, why: "primary button label" });
pairs.push({ fg: "deep-ice", bg: "salmon", min: 4.5, why: "urgent toggle label" });
pairs.push({ fg: "deep-ice", bg: "mist", min: 4.5, why: "primary button, active" });
// UI boundaries (inputs, outlined buttons, chips)
for (const g of textGrounds) pairs.push({ fg: "boundary", bg: g, min: 3, why: "control boundary" });

const rows: string[] = [];
let failed = 0;
for (const p of pairs) {
  const r = contrastRatio(hex(p.fg), hex(p.bg));
  const ok = r >= p.min;
  if (!ok) failed++;
  rows.push(`${ok ? "ok  " : "FAIL"}  ${p.fg.padEnd(9)} on ${p.bg.padEnd(9)} ${formatRatio(r).padStart(8)}  (min ${p.min}:1, ${p.why})`);
}

// Translucent cases rendered in the UI
const deepOnFrost70 = composite(hex("deep-ice"), 0.7, hex("frost"));
const r70 = contrastRatio(deepOnFrost70, hex("frost"));
if (r70 < 4.5) failed++;
rows.push(`${r70 >= 4.5 ? "ok  " : "FAIL"}  deep-ice/70 on frost      ${formatRatio(r70).padStart(8)}  (min 4.5:1, count on a pressed filter chip)`);

console.log(rows.join("\n"));
if (failed) {
  console.error(`\n${failed} pair(s) below AA`);
  process.exit(1);
}
console.log(`\nall ${rows.length} pairs pass`);
