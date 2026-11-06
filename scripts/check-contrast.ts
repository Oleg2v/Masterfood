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
pairs.push({ fg: "deep-ice", bg: "frost-hover", min: 4.5, why: "primary button, hover" });
pairs.push({ fg: "deep-ice", bg: "frost-press", min: 4.5, why: "primary button, active" });
pairs.push({ fg: "frost-3", bg: "steel-2", min: 4.5, why: "disabled button label" });
pairs.push({ fg: "frost", bg: "steel-2", min: 4.5, why: "toast title" });
pairs.push({ fg: "frost-2", bg: "steel-2", min: 4.5, why: "toast detail" });
// UI boundaries (inputs, outlined buttons, chips)
for (const g of textGrounds) pairs.push({ fg: "edge", bg: g, min: 3, why: "control boundary" });

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

// The estimate tile ("frost = משוער", the frost-band utility): Frost at 4.5% over Steel, plus
// crystal texels of Frost at up to 0.095·1 − 0.037 = 5.8%. Text is checked on the brightest texel.
const tileBase = composite(hex("frost"), 0.045, hex("steel"));
const tileWorst = composite(hex("frost"), 0.095 - 0.037, tileBase);
for (const fg of ["frost", "frost-2"]) {
  const r = contrastRatio(hex(fg), tileWorst);
  if (r < 4.5) failed++;
  rows.push(`${r >= 4.5 ? "ok  " : "FAIL"}  ${fg.padEnd(9)} on ${tileWorst.padEnd(9)} ${formatRatio(r).padStart(8)}  (min 4.5:1, estimate on the frost tile, brightest texel)`);
}

console.log(rows.join("\n"));
if (failed) {
  console.error(`\n${failed} pair(s) below AA`);
  process.exit(1);
}
console.log(`\nall ${rows.length} pairs pass`);
