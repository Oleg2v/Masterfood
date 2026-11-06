# השוק של מחר — Masterfood ordering portal (pitch concept)

> **קונספט של Kikkey – לא האתר הרשמי של מאסטרפוד.** An unlisted pitch demo. Every price,
> quantity and time is demo data ("מחירי דמו"). Pages are `noindex` (meta, `X-Robots-Tag`
> header and a disallow-all `robots.txt`).

A B2B ordering portal for an Israeli importer and distributor of meat and fish, in Hebrew and RTL,
designed mobile-first. The aim is a premium cold-chain trading floor: a Bloomberg terminal for
fresh protein, dressed like a Michelin menu.

## Status

| Stage | Scope | State |
| --- | --- | --- |
| 0 | Art direction: concept, `/style-tile`, decisions and clichés | **in review** |
| 1 | Signature moment (market board) on `/hero-lab` | not started |
| 2 | App flows on demo data | not started |
| 3 | Polish pass | not started |
| 4 | QA (Lighthouse, axe, RTL) and the 30-second demo path | not started |

## Run it

```bash
npm install
npm run dev          # http://localhost:3000/style-tile
```

| Script | What it does |
| --- | --- |
| `npm run tokens` | Regenerates `src/app/tokens.css` (Tailwind v4 `@theme`) from `src/design/tokens.ts`. Runs before `dev` and `build`. |
| `npm run check:contrast` | Fails if any text pair drops below 4.5:1, or any control boundary below 3:1. |
| `npm run typecheck` | `tsc --noEmit` |
| `node scripts/axe.mjs` | axe-core audit (WCAG 2.0/2.1 A and AA) at 1440 and 390, with and without reduced motion, against a running server (`--base`, default `http://localhost:3100`). |
| `node scripts/screenshots.mjs` | Playwright screenshots (`--routes`, `--viewports`, `--scroll 0,25,50,75,100`, `--full`, `--reduced`). |

## Design system in one paragraph

All tokens live in [`src/design/tokens.ts`](src/design/tokens.ts): colour (the brief's eight plus
derived tints that keep AA), a 9-step fluid type scale (`clamp()` between 360 and 1440px), the 4px
spacing scale, radii, light-based elevation, and motion durations and easings. A generator turns
them into Tailwind utilities (`bg-steel`, `type-display`, `rounded-sm`, `shadow-rim`, `ease-glide`,
`duration-flap` …). The `/style-tile` page renders its documentation from the same objects, and
its contrast ratios are computed at build time. The full art-direction rationale is in
[`docs/art-direction.md`](docs/art-direction.md).

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4. Fonts are self-hosted through
`next/font`: Frank Ruhl Libre, Heebo and IBM Plex Mono, all under the SIL Open Font License.
Framer Motion and GSAP arrive in Stage 1 with the split-flap board. Photography is from Unsplash
as credited placeholders.

## Credits

Concept, design and build: Kikkey. Photographs: Unsplash contributors, credited next to each image.
