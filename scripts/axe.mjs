#!/usr/bin/env node
/**
 * axe-core audit (WCAG 2.0/2.1 A + AA rules) for one or more routes, at desktop
 * and phone widths, with motion on and with reduced motion.
 *
 *   node scripts/axe.mjs [--base http://localhost:3100] [--routes /style-tile,/]
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/node-tools/node_modules/playwright"));
}
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const argv = process.argv.slice(2);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : d;
};
const base = opt("base", "http://localhost:3100");
const routes = opt("routes", "/style-tile").split(",");

const browser = await chromium.launch();
let total = 0;
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  for (const reduced of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(async () =>
        // @ts-ignore
        window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }),
      );
      const label = `${r} @${w}${reduced ? " reduced" : ""}`;
      if (!res.violations.length) console.log(`ok   ${label}: 0 violations (${res.passes.length} rules pass)`);
      for (const v of res.violations) {
        total += v.nodes.length;
        console.log(`FAIL ${label}: [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length})`);
        for (const n of v.nodes.slice(0, 4)) console.log(`       ${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
      }
    }
    await ctx.close();
  }
}
await browser.close();
process.exit(total ? 1 : 0);
