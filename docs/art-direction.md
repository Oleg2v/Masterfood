# Art direction — Stage 0

> Concept by Kikkey. Not the official Masterfood website. Every price, quantity and time is a demo
> value.

The style tile at `/style-tile` is the working version of this document: every token, rule and
component below is rendered there from the same source (`src/design/tokens.ts`).

## The concept in three lines

1. **השוק של מחר (Tomorrow's market).** Every morning the portal opens like a trading floor.
   Today's prices, what landed overnight and a countdown to tomorrow's order cutoff flip in on a
   Hebrew split-flap board.
2. **Cold and exact, dressed like a Michelin carte.** Deep Ice and brushed steel, and frost that a
   finger wipes away. Frank Ruhl Libre hangs from hairlines over Plex Mono figures. Only the
   protein is warm.
3. **The 45-second order.** קצביית הכרמל in Haifa reads the board and taps פיקנייה. It orders
   כ־20 ק״ג at an estimated ₪1,780.00, picks 06:00–08:00 and sends the order in under 45 seconds.
   Its Masterfood agent sees the order the same second.

## Five decisions we commit to

Each decision can already be seen on the tile. The **On the tile** line says where.

### 1. A bidi-correct Hebrew split-flap, with the cutoff as its one giant

- **What.** One flap primitive renders every number that moves: the board, the countdown, the
  figure inside the primary button, the weight estimate and the order number.
  - Board lines are typed segments in columns (מוצר · מקור · נחת · ק״ג · ₪ לק״ג · שינוי), never
    one string.
  - The Hebrew drum is the alef-bet with each final form after its base letter, then 0–9.
  - A changed cell riffles through at most the three drum glyphs before its target.
  - The countdown is the only giant on the board screen. It sits on eight steel plates, with the
    absolute time beside it.
- **Why.** A naive RTL board prints 312 as 213 and −0.8% as %8.0−, and one wrong price ends the
  pitch. Hebrew letters don't join, so per-letter flaps keep their shapes intact, and a Hebrew
  reader watches real letters riffle in alef-bet order.
- **On the tile.**
  - The cover clock and the brief's three board lines, with letters and figures in identical
    0.66em cells.
  - The palette as a departure board.
  - A full-size flap bench: fall 90ms and land 70ms, each × √(h/40px); riffles 60ms.
- **Risk.** Jank on mid-range Android. Only changed cells animate, transforms only. A
  long-animation-frame watchdog drops the riffles, then falls back to an opacity swap. Reduced
  motion shows the static table.

### 2. Typeset, not decorated: Hebrew hangs from the שרטוט, and every list is a carte

- **What.** The portal is one ruled sheet.
  - Display Hebrew hangs from full-bleed hairlines, its letter roofs touching the rule; ל rises
    through it.
  - Lists are set like a menu: rubric, dish name, dot leader, decimal-stacked price.
  - All copy goes through a typesetting pass: ״ ׳ ־ − –, a no-break space between figure and unit,
    and gender-neutral action nouns.
  - The wording is wholesale: הזמנה, never סל.
- **Why.** The hanging line is native to Hebrew writing. Leaders with stacked decimals let a
  butcher compare fifty prices in seconds. Straight quotes and masculine imperatives make a site
  read as translated.
- **On the tile.**
  - The cover headline and every section title hang from their rules. The offset is computed from
    the font: the measured roof height minus half of the line box plus 0.623em.
  - The type scale is set as a carte.
  - The dateline reads יום חמישי · כ״ה בחשוון תשפ״ז · 5.11.2026.
- **Risk.** A roof that drifts off its rule looks careless. The offset is computed from Frank Ruhl
  Libre's measured roofs, and a Stage 1 Playwright overlay will fail the build on a drift above
  1px.

### 3. Only the protein is warm

- **What.** One grade for every photograph and one colour law for every pixel.
  - Photo blacks land on Deep Ice. Salmon flesh lands on the Salmon accent and marbling on
    Bordeaux, while ice, skin and steel go cold.
  - The accents carry data only:
    - Salmon = fish, plus the last 30 minutes before the cutoff.
    - Bordeaux = meat.
    - Ice Blue = temperature.
    - Fresh Green = in stock.
  - Actions are Frost, and price moves are grey glyphs.
  - Errors are Thaw amber, because in a cold chain the alarm is heat.
- **Why.** Masterfood began as an ice factory in 1950, and only the product is allowed warmth.
  Trader green/red would tell a buyer that a price rise is good news, and it would collide with
  stock and meat.
- **On the tile.**
  - The palette board names each colour by its meaning.
  - A raw and a graded marbling plate sit side by side.
  - The trio sets marbling, salmon and a whole fish on ice.
- **Risk.** Selective colour is close to the "colour splash" cliché. The grade works per tone, not
  through a hue mask, and no meaning ever rests on hue alone.

### 4. Frost means "not final yet"

- **What.** Frost appears in exactly two places, with one meaning:
  - The hero is display-case glass over a salmon macro. It wipes clear and refreezes in 2.4s.
  - Inside the app, frost marks estimated values only: the variable-weight band, the order
    estimate and the invoice's משוער column. It thaws to a clear בפועל in 600ms when the delivery
    note records the real weight.
  - Product photos are never frosted, and sold-out drains to monochrome.
- **Why.** It turns the brief's most decorative effect into the information a variable-weight buyer
  needs most, estimate versus actual.
- **On the tile.**
  - The cover glass with its legend כפור = משוער.
  - The estimate band in the weight field.
  - An invoice row that thaws when a delivery note is received.
- **Risk.** Legibility. No text sits on the glass. The in-app frost tile is toned so that its
  brightest texel (#253744 over Steel) keeps Frost at 10.88:1 and Frost-2 at 5.08:1; this is
  measured on the rendered tile and checked by `npm run check:contrast`. There is no
  `backdrop-filter` anywhere.

### 5. The cut map is an engraving, and its typeset labels are the controls

- **What.** The beef carcass and the whole fish are drawn like a 1900s butcher's chart: 1px
  contours, 45° hatching and dashed seams. A list of typeset labels drives the regions:
  - The labels are native radios in one group, 48px rows that a wet thumb and a keyboard can both
    use.
  - Selecting פיקנייה fills the region Bordeaux under a 1.5px Frost outline and draws a Meat-ink
    leader to the name.
  - The matching products then appear as carte lines.
- **Why.** It replaces the category's cartoon cow with an object a butcher recognises. Moving the
  hit targets from thin SVG paths to label rows makes the brief's touch criterion achievable.
- **On the tile.** An engraved hindquarter specimen with פיקנייה selected, to lock stroke weights
  before the full drawing.
- **Risk.** Butchers spot anatomical errors. The full drawing will be traced from a public-domain
  chart, checked against an Israeli cut chart, and signed off by Masterfood.

## Five clichés we will not use

| Cliché | Why it fails here | Instead |
| --- | --- | --- |
| **Translated RTL**: an LTR template flipped with `dir="rtl"`; ק"ג with ASCII quotes, כ-20 with a hyphen-minus, masculine imperatives (הוסף לסל), −0.8% printed as 0.8%− | Israeli buyers read it as an outsourced site, the opposite of a market leader trading since 1950 | A typesetting pass: gershayim, geresh and maqaf, U+2212 inside an LTR isolate, ₪ placed by hand, action nouns, a Hebrew dateline |
| **The Israeli overlay look**: a floating wheelchair toolbar beside a floating WhatsApp bubble, and on a demo a fixed corner badge on top | An overlay does not make inaccessible markup meet IS 5568, and floating things cover the order rail at 390px | Accessibility in the markup. Nothing floats; the Kikkey disclaimer lives in the sticky top rail and the footer |
| **Trading-floor cosplay and its twin, the SaaS template**: neon green/red tickers, a marquee, candlesticks; KPI tiles, donuts, zebra tables, scarcity badges | Green/red says a price rise is good news. A marquee hides prices behind a timer, and KPI tiles bury the one number that matters at 05:50 | A board-first home whose only KPI is the countdown. Flaps move only when a value changes, and every line is visible on a phone |
| **The Awwwards default kit**: glassmorphism as "frost", mesh orbs, noise, scroll-jacking, SplitText reveals, preloaders, magnetic cursors | Blur is the lazy reading of a frost brief and the costliest paint on mid-range Android. SplitText breaks Hebrew words for screen readers | Frost is one material with one meaning. Everything else is opaque steel, scrolling is native, words arrive whole, and the board's first flip is the loading state |
| **Food-blog styling and brochure heritage**: steak on wood with rosemary, flames, a chef with a cleaver, a cartoon cow, "Since 1950" badge rows, drawn kashrut seals | Garnish drops the register from Michelin to menu board. Warm wood breaks the colour law, and a drawn hechsher on an unofficial demo looks real | Raw product only, graded cold. An engraved cut map. Kashrut as plain text, and heritage as one factual line |

## The system

All values live in [`src/design/tokens.ts`](../src/design/tokens.ts). A generator writes them into
Tailwind v4's `@theme` (`src/app/tokens.css`), and the tile renders its documentation from the
same objects.

**Colour.** The brief's eight colours sit unchanged. Derived tints keep text at AA or better on
both Deep Ice and Steel, and keep control boundaries at 3:1 or better:

- Frost-2 `#93AAB8` and Frost-3 `#7A93A3` for secondary and tertiary text.
- Edge `#5F7A8B` for control boundaries.
- Meat-ink `#D9849A` for meat as text or line.
- Thaw `#FFB547` for errors.

Material tones cover hover and press states, the flap well and the washes. Bordeaux (2.06:1) is a
fill only, and Hairline (1.56:1) is decorative only.

**Type.** Nine fluid steps. Each `clamp()` runs between 360 and 1440px, every maximum is at most
2.5× its minimum, and line boxes snap up to the 4px grid with `round(up, …, 4px)`.

| Step | Token | Size (px) | Leading | Face |
| --- | --- | --- | --- | --- |
| −2 | micro | 12–13 | 1.33 | IBM Plex Mono 500, Latin labels only |
| −1 | caption | 14–15 | 1.6 | Heebo 400; the Hebrew floor |
| 0 | body | 16–18 | 1.6 | Heebo 400 |
| 1 | data | 18–22 | 1.25 | IBM Plex Mono 500, every traded figure |
| 2 | dish | 24–30 | 1.25 | Frank Ruhl Libre 500, product names |
| 3 | title | 28–40 | 1.2 | Frank Ruhl Libre 500 |
| 4 | section | 32–56 | 1.1 | Frank Ruhl Libre 400, chapter heads, the cutoff label |
| 5 | headline | 44–88 | 1.05 | Frank Ruhl Libre 300 (400 below 768px) |
| 6 | display | 60–148 | 1.0 | Frank Ruhl Libre 300, the countdown: one giant per viewport |

- Hebrew is never letter-spaced, slanted or synthesised.
- Every figure sits in `<bdi dir="ltr">` in Plex Mono with tabular numerals.
- ₪ comes from Plex Mono's latin-ext subset.
- Glyphs no font carries (▲ ▼ ≈ ←) are drawn as SVG.

**Space.** A 4px base (`--spacing: 0.25rem`). Targets are at least 44px, controls 48px, and the
variable-weight field and its steppers 56px.

**Radii.**

| Radius | Used for |
| --- | --- |
| 0 | Board, rows, ledgers, photos |
| 2px | Flap cells, plates, tags |
| 4px | Buttons, inputs, cards, toasts |
| 12px | Phone sheets only |
| Full | Status lamps only |

**Elevation is light, not shadow.** Surfaces get a 1px rim light, a pressed inset, a blue-black
float for toasts, and a frost edge for estimate surfaces. Glows are limited to two meanings:

- A Salmon glow behind the countdown, under 30 minutes only. The glow layer breathes; the digits
  never dim.
- An Ice glow for temperatures in range.

**Motion.**

| Kind | Tokens |
| --- | --- |
| Interface durations | tap 80, hover 140, state 220, panel 320, exit 200ms |
| Flap timings | fall 90, land 70, riffle 60ms; fall and land × √(h/40px) |
| Atmosphere | thaw 600ms, breathe 2.4s, refreeze 2.4s, toast 6s |
| Easings | glide, exit, move, flap-fall, flap-land, thaw, breathe |

Only `transform` and `opacity` animate. The OS reduced-motion setting and the in-app
"עצירת אנימציה" control share one rule. Under it, the clock updates once a minute as HH:MM and the
glass is a still.

## Imagery

Credited Unsplash placeholders, all raw product: marbling, salmon flesh, a salmon steak on slate,
whole fish on crushed ice, and lake ice. One CSS grade unifies them:

1. A per-tone filter: flesh keeps saturation 1.14, while cold subjects drop to 0.55.
2. A Steel wash in soft-light.
3. A Deep Ice `lighten` clamp, so no black is darker than the page.
4. A radial vignette.

Measured, salmon hue moves from 29° to 11.7° (the brand Salmon is 11.9°), and beef moves from 3°
to 355° (Bordeaux is 352°). Stage 2 bakes the same stack at build time for the catalogue.

## Accessibility (WCAG 2.0 AA / IS 5568), verified on the tile

- axe-core reports 0 violations at 1440 and 390, with and without reduced motion.
- `npm run check:contrast` passes all 29 text, boundary and fill pairs. These include the frost
  tile's brightest texel.
- A skip link and labelled landmarks.
- A real `<table>` behind every visual board.
- A Frost focus ring that appears in 0ms and survives forced colours.
- Live regions that speak only after an interaction.
- `role="timer"` on the countdown.
- 44px targets throughout.
- "עצירת אנימציה" in the top rail.
- Every figure inside `<bdi dir="ltr">`.

## How the direction was made

1. **Constraints first.** The brief's palette and the self-hosted font subsets were measured
   before any design work.
2. **An independent panel.** Four art directors proposed complete directions:
   - an editorial typographer;
   - a motion and material director;
   - a trading-terminal product designer;
   - a luxury food brand director.

   Three judges scored them: an Awwwards juror, a customer-and-sales pair, and an accessibility and
   performance engineer. The final spec is the winning direction, with the best of the others
   grafted in.
3. **Built, then critiqued twice.** Reviewers checked the tile through several lenses: Hebrew and
   RTL, accessibility, craft, spec fidelity and code. Every finding was independently re-checked
   before a fix was applied.

## Open questions for Masterfood

1. **Cutoff and calendar.** Is 14:00 the real cutoff for next-day delivery? Do you deliver on
   Fridays, and until when can a Friday order still make Sunday's truck?
2. **Variable weight and billing.** What tolerance should each product show? We assume ±5% on
   primals and whole fish. Should prices read "לפני מע״מ", with each customer's credit terms on the
   invoice?
3. **Agents.** May the portal name each customer's sales agent on the order and send them a copy?
4. **Photography.** Can you supply raw-product shots, picanha above all? Otherwise we stay on
   credited Unsplash placeholders.
