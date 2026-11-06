# Art direction — Stage 0

> Concept by Kikkey. Not the official Masterfood website. All prices are demo prices.

_Draft: the concept, decisions and clichés sections are finalised after the art-direction panel's
synthesis._

## How this direction was made

1. **Constraints first.** The brief's palette was measured against WCAG before any design work
   (Bordeaux on Deep Ice is 2.06:1, Hairline is 1.56:1), and so were the self-hosted font subsets:
   Frank Ruhl Libre's Latin subset carries tabular figures, and no family carries ▲ ▼ → or ≈.
2. **An independent panel.** Four art directors (an editorial typographer, a motion and material
   director, a trading-terminal product designer and a luxury food brand director) each proposed
   the whole direction. Three judges scored them: an Awwwards juror, a customer-and-sales pair, and
   an accessibility and performance engineer. A lead synthesised the final spec from the winner,
   grafting in the best of the others.
3. **Built, then critiqued.** The `/style-tile` page is built from the token source. Critics
   reviewed it through three lenses (Hebrew/RTL, accessibility, component craft), every finding
   was independently verified, and the verified fixes were applied.

## The system

Everything below is generated from [`src/design/tokens.ts`](../src/design/tokens.ts) and rendered
on `/style-tile`.

- **Colour.** The brief's eight colours, plus derived tints that keep text at AA or better on both
  Deep Ice and Steel and keep control boundaries at 3:1 or better. `npm run check:contrast` fails
  the build when any pair drops below that.
- **Type.** Nine fluid steps, `clamp()` between 360 and 1440px, with the maximum held at 2.5× the
  minimum or less so 200% zoom still works. Line boxes snap up to the 4px grid with
  `round(up, …, 4px)`. Hebrew is never letter-spaced, and Frank Ruhl Libre is never set below 24px.
- **Space.** A 4px base (`--spacing: 0.25rem`), so every Tailwind spacing utility lands on the grid.
- **Elevation.** Built from light rather than shadow: a rim light, a hairline, a cold glow, and a
  salmon ember only when the cutoff is close.
- **Motion.** Durations and easings are tokens: flap, fast, base, slow, calm, thaw and drift. Only
  `transform` and `opacity` animate. Reduced motion and the in-app "עצירת אנימציה" control share
  one rule.

## Accessibility commitments (verified on the tile)

- axe-core (WCAG 2.0/2.1 A and AA, plus best practice) reports 0 violations at 1440 and 390, with
  and without reduced motion.
- A skip link, labelled landmarks, a correct heading order, and a real `<table>` with a caption.
- Focus is a 2px Frost ring offset from the element, shown instantly with no animation.
- Every figure (prices, weights, times) sits in `<bdi dir="ltr">`.
- Status is carried by shape and words, never by colour alone.
