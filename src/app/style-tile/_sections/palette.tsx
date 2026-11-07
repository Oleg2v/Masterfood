import { colors, type ColorToken } from "@/design/tokens";
import { contrastRatio, formatRatio, grade } from "@/design/contrast";
import { Typeset } from "@/components/ui/typeset";
import { BiLabel, Section } from "../_components/frame";
import { PaletteBoard } from "../_components/palette-board";

const NB = " ";

const hex = (id: string) => colors.find((c) => c.id === id)!.hex;
const DEEP = hex("deep-ice");
const STEEL = hex("steel");
const FROST = hex("frost");

/** text: a reading pair. ui: a control boundary (3:1, WCAG 1.4.11). fill: a colour that only ever fills. */
type Kind = "text" | "ui" | "fill";
type Pair = { label: string; fg: string; bg: string; kind?: Kind };

/** The pairs that matter for each colour's job. */
function pairsFor(c: ColorToken): Pair[] {
  if (c.text)
    return [
      { label: "על קרח עמוק", fg: c.hex, bg: DEEP },
      { label: "על פלדה", fg: c.hex, bg: STEEL },
    ];
  switch (c.id) {
    case "bordeaux":
      return [
        { label: "כפור עליו", fg: FROST, bg: c.hex },
        { label: "על קרח עמוק", fg: c.hex, bg: DEEP, kind: "fill" },
      ];
    case "edge":
      return [
        { label: "מול קרח עמוק", fg: c.hex, bg: DEEP, kind: "ui" },
        { label: "מול פלדה", fg: c.hex, bg: STEEL, kind: "ui" },
      ];
    case "hairline":
      return [{ label: "מול קרח עמוק", fg: c.hex, bg: DEEP, kind: "ui" }];
    default:
      return [{ label: "כפור עליו", fg: FROST, bg: c.hex }];
  }
}

/** The verdict as a word: AAA / AA, "AA large" (display sizes only), UI 3:1, or why it fails. */
function verdictFor(r: number, kind: Kind): { word: string; pass: boolean } {
  if (kind === "ui") return r >= 3 ? { word: "UI 3:1", pass: true } : { word: "דקורטיבי", pass: false };
  const g = grade(r);
  if (g === "AAA" || g === "AA") return { word: g, pass: true };
  if (kind === "text" && g === "AA large") return { word: g, pass: false };
  return { word: "לא לטקסט", pass: false };
}

/**
 * The words say pass or fail, never a hue: the four accents carry data only, so a pass is not
 * green. A pass is Frost-2 on an Edge ring, a fail Frost-3 on a Hairline ring. Latin verdicts
 * are mono micro-labels; a Hebrew one stays at the caption floor.
 */
function Verdict({ r, kind = "text" }: { r: number; kind?: Kind }) {
  const { word, pass } = verdictFor(r, kind);
  const latin = /[A-Z]/.test(word);
  return (
    <span
      lang={latin ? "en" : undefined}
      className={`rounded-hair px-1.5 py-0.5 whitespace-nowrap ${latin ? "label-latin" : "text-caption/5"} ${
        pass ? "text-frost-2 inset-ring inset-ring-edge" : "text-frost-3 inset-ring inset-ring-hairline"
      }`}
    >
      {word}
    </span>
  );
}

function Ratio({ fg, bg, label, kind }: Pair) {
  const r = contrastRatio(fg, bg);
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
      <span className="text-caption text-frost-2">{label}</span>
      <span className="flex flex-wrap items-center gap-2">
        <bdi dir="ltr" className="num text-caption text-frost">
          {formatRatio(r)}
        </bdi>
        <Verdict r={r} kind={kind} />
      </span>
    </li>
  );
}

function Slab({ c }: { c: ColorToken }) {
  // Pick the label colour that reads best on the slab; mid-tones get a Deep Ice label plate.
  const frostR = contrastRatio(FROST, c.hex);
  const deepR = contrastRatio(DEEP, c.hex);
  const plate = Math.max(frostR, deepR) < 4.5;
  const onSlab = plate ? FROST : frostR >= deepR ? FROST : DEEP;
  return (
    // three subgrid rows (slab, role, ledger) shared by every slab in the row, so the role texts
    // and the ratio rules line up across the row whatever each text's length
    <li className="row-span-3 grid grid-cols-[minmax(0,1fr)] grid-rows-subgrid gap-y-3">
      <div
        className={`relative flex h-48 flex-col justify-end rounded-edge shadow-[inset_0_0_0_1px_rgb(232_243_247/0.08)] sm:h-64 ${plate ? "p-2" : "p-4"}`}
        style={{ backgroundColor: c.hex }}
      >
        <div className={`flex flex-col gap-1 ${plate ? "rounded-hair bg-deep-ice p-2" : ""}`} style={{ color: onSlab }}>
          <span className="type-dish" lang="he">
            {c.he}
          </span>
          <span className="flex flex-wrap items-baseline justify-between gap-x-2">
            <bdi dir="ltr" lang="en" className="label-latin">
              {c.en}
            </bdi>
            <bdi dir="ltr" className="num text-caption">
              {c.hex}
            </bdi>
          </span>
        </div>
      </div>
      <p className="text-caption text-frost-2">
        <Typeset text={c.role} />
      </p>
      <ul className="divide-y divide-hairline border-y border-hairline">
        {pairsFor(c).map((p) => (
          <Ratio key={p.label} {...p} />
        ))}
      </ul>
    </li>
  );
}

/**
 * The derived ramp as a ruled ledger, one line per token: chip, name (with code and hex), the
 * job, then the ratio on each ground. Every line shares one set of column tracks (subgrid), so
 * the columns align like a printed ledger. From md up the ratio labels move into the column
 * heads (each cell keeps its own for assistive tech); from lg up the job joins the line.
 */
function Ledger({ rows }: { rows: readonly ColorToken[] }) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[1.5rem_minmax(0,1fr)_auto_auto] md:gap-x-6 lg:grid-cols-[1.5rem_auto_minmax(0,1fr)_auto_auto] lg:gap-x-8">
      <div
        aria-hidden="true"
        className="col-span-full hidden grid-cols-subgrid border-b border-edge pb-3 text-caption font-medium text-frost-3 md:grid"
      >
        <span className="col-start-3 lg:col-start-4">על קרח עמוק</span>
        <span>על פלדה</span>
      </div>
      <ul className="col-span-full grid grid-cols-subgrid border-t border-hairline md:border-t-0">
        {rows.map((c) => (
          <li key={c.id} className="col-span-full grid grid-cols-subgrid items-baseline gap-y-2 border-b border-hairline py-4">
            <span
              aria-hidden="true"
              className="col-start-1 row-start-1 size-6 self-center rounded-hair shadow-[inset_0_0_0_1px_rgb(232_243_247/0.1)]"
              style={{ backgroundColor: c.hex }}
            />
            <p className="col-start-2 row-start-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="type-dish text-frost">{c.he}</span>
              <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
                {c.en}
              </bdi>
              <bdi dir="ltr" className="num text-caption text-frost-2">
                {c.hex}
              </bdi>
            </p>
            <p className="col-start-2 max-w-[68ch] text-caption text-pretty text-frost-2 md:col-end-5 lg:col-start-3 lg:col-end-4 lg:row-start-1">
              <Typeset text={c.role} />
            </p>
            {pairsFor(c)
              .slice(0, 2)
              .map((p, i) => {
                const r = contrastRatio(p.fg, p.bg);
                return (
                  <p
                    key={p.label}
                    className={`col-start-2 flex items-center justify-between gap-3 md:row-start-1 md:justify-start ${i === 0 ? "md:col-start-3 lg:col-start-4" : "md:col-start-4 lg:col-start-5"}`}
                  >
                    <span className="text-caption text-frost-2 md:sr-only">{p.label}</span>
                    <span className="flex items-center gap-2">
                      <bdi dir="ltr" className="num text-caption text-frost">
                        {formatRatio(r)}
                      </bdi>
                      <Verdict r={r} kind={p.kind} />
                    </span>
                  </p>
                );
              })}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PaletteSection() {
  const base = colors.filter((c) => c.group === "base");
  const accent = colors.filter((c) => c.group === "accent");
  const derived = colors.filter((c) => c.group === "derived");

  return (
    <Section
      id="palette"
      index="01"
      en="Palette"
      he="קר כמו פלדה, צלול כמו קרח"
      lede={`ארבעה ניטרליים שבונים את הלילה של השוק, ארבעה צבעי הדגשה שכל אחד מהם הוא מילה. כל זוג טקסט־רקע נבדק מול WCAG${NB}– המספרים מחושבים בזמן הבנייה.`}
    >
      <PaletteBoard />

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Neutrals" he="בסיס" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-4 xl:gap-x-6">
          {base.map((c) => (
            <Slab key={c.id} c={c} />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Category accents" he="ארבע מילים" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-4 xl:gap-x-6">
          {accent.map((c) => (
            <Slab key={c.id} c={c} />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Derived" he="הנגזרות שמחזיקות את AA" />
        <Ledger rows={derived} />
      </div>
    </Section>
  );
}
