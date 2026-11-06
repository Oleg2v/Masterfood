#!/usr/bin/env node
/**
 * Playwright screenshot rig for design reviews.
 *
 *   node scripts/screenshots.mjs --routes /style-tile --out shots/stage0 \
 *     [--base http://localhost:3100] [--viewports 1440x900,390x844] \
 *     [--scroll 0,25,50,75,100] [--full] [--dpr 1] [--reduced] [--wait 600]
 *
 * --full     one full-page capture per route × viewport
 * --scroll   viewport captures at the given scroll percentages
 * --reduced  emulate prefers-reduced-motion: reduce
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/node-tools/node_modules/playwright"));
}

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};

const base = opt("base", "http://localhost:3100");
const routes = opt("routes", "/style-tile").split(",");
const out = resolve(opt("out", "shots"));
const viewports = opt("viewports", "1440x900,390x844")
  .split(",")
  .map((v) => v.split("x").map(Number));
const scroll = opt("scroll", "")
  .split(",")
  .filter(Boolean)
  .map(Number);
const full = flag("full") || scroll.length === 0;
const dpr = Number(opt("dpr", "1"));
const wait = Number(opt("wait", "600"));
const reduced = flag("reduced");

mkdirSync(out, { recursive: true });

// Lazy images never load in a single capture: make them eager and wait until every one has decoded.
async function loadAllImages(page) {
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((i) => { i.loading = "eager"; i.decoding = "sync"; });
    await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? null : new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); setTimeout(r, 8000); }))));
  });
}

const browser = await chromium.launch();
const files = [];
try {
  for (const [width, height] of viewports) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: dpr,
      reducedMotion: reduced ? "reduce" : "no-preference",
      locale: "he-IL",
      hasTouch: width < 768,
      isMobile: width < 768,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    for (const route of routes) {
      const slug = route.replace(/^\//, "").replace(/[^\w-]+/g, "_") || "home";
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await loadAllImages(page);
      await page.waitForTimeout(wait);

      if (full) {
        const file = `${out}/${slug}-${width}x${height}-full.png`;
        await page.screenshot({ path: file, fullPage: true });
        files.push(file);
      }
      for (const pct of scroll) {
        await page.evaluate((p) => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: Math.round((max * p) / 100), behavior: "instant" });
        }, pct);
        await page.waitForTimeout(wait);
        const file = `${out}/${slug}-${width}x${height}-${String(pct).padStart(3, "0")}.png`;
        await page.screenshot({ path: file });
        files.push(file);
      }
    }
    if (errors.length) console.error(`[${width}x${height}] page errors:\n  ` + errors.join("\n  "));
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(files.join("\n"));
