import { colors, type ColorToken } from "@/design/tokens";
import { contrastRatio, formatRatio, grade } from "@/design/contrast";
import { BiLabel, Section } from "../_components/frame";
import { PaletteBoard } from "../_components/palette-board";

const hex = (id: string) => colors.find((c) => c.id === id)!.hex;
const DEEP = hex("deep-ice");
const STEEL = hex("steel");
const FROST = hex("frost");

function Ratio({ fg, bg, label, kind = "text" }: { fg: string; bg: string; label: string; kind?: "text" | "ui" | "fill" }) {
  const r = contrastRatio(fg, bg);
  const pass = kind === "ui" ? r >= 3 : r >= 4.5;
  const verdict = kind === "ui" ? (pass ? "UI 3:1" : "—") : kind === "fill" && !pass ? "לא לטקסט" : grade(r) === "decorative" ? "—" : grade(r);
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
      <span className="text-small text-mist">{label}</span>
      <span className="flex items-center gap-2">
        <bdi dir="ltr" className="num text-small text-frost">
          {formatRatio(r)}
        </bdi>
        <span
          lang={/[A-Z]/.test(verdict) ? "en" : undefined}
          className={`rounded-xs px-1.5 py-0.5 ${/[A-Z]/.test(verdict) ? "label-latin" : "text-micro"} ${pass ? "text-fresh inset-ring inset-ring-fresh/40" : "text-fog inset-ring inset-ring-hairline"}`}
        >
          {verdict}
        </span>
      </span>
    </li>
  );
}

function Slab({ c, tall = false }: { c: ColorToken; tall?: boolean }) {
  // Pick the label colour that reads best on the slab; mid-tones get a Deep Ice label plate.
  const frostR = contrastRatio(FROST, c.hex);
  const deepR = contrastRatio(DEEP, c.hex);
  const plate = Math.max(frostR, deepR) < 4.5;
  const onSlab = plate ? FROST : frostR >= deepR ? FROST : DEEP;
  return (
    <li className="flex flex-col gap-3">
      <div
        className={`relative flex flex-col justify-end rounded-sm shadow-[inset_0_0_0_1px_rgb(232_243_247/0.08)] ${plate ? "p-2" : "p-4"} ${tall ? "h-48 sm:h-64" : "h-32"}`}
        style={{ backgroundColor: c.hex }}
      >
       <div className={`flex flex-col gap-1 ${plate ? "rounded-xs bg-deep-ice p-2" : ""}`} style={{ color: onSlab }}>
        <span className="type-title" lang="he">
          {c.he}
        </span>
        <span className="flex items-baseline justify-between gap-2">
          <bdi dir="ltr" lang="en" className="label-latin">
            {c.en}
          </bdi>
          <bdi dir="ltr" className="num text-small">
            {c.hex}
          </bdi>
        </span>
       </div>
      </div>
      <p className="min-h-[3em] text-small text-mist">{c.role}</p>
      <ul className="divide-y divide-hairline border-y border-hairline">
        {c.text ? (
          <>
            <Ratio fg={c.hex} bg={DEEP} label="על קרח עמוק" />
            <Ratio fg={c.hex} bg={STEEL} label="על פלדה" />
          </>
        ) : c.id === "bordeaux" ? (
          <>
            <Ratio fg={FROST} bg={c.hex} label="כפור עליו" />
            <Ratio fg={c.hex} bg={DEEP} label="על קרח עמוק" kind="fill" />
          </>
        ) : c.id === "boundary" ? (
          <>
            <Ratio fg={c.hex} bg={DEEP} label="מול קרח עמוק" kind="ui" />
            <Ratio fg={c.hex} bg={STEEL} label="מול פלדה" kind="ui" />
          </>
        ) : c.id === "hairline" ? (
          <Ratio fg={c.hex} bg={DEEP} label="מול קרח עמוק" kind="ui" />
        ) : (
          <Ratio fg={FROST} bg={c.hex} label="כפור עליו" />
        )}
      </ul>
    </li>
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
      lede="ארבעה ניטרליים שבונים את הלילה של השוק, ארבעה צבעי הדגשה שכל אחד מהם הוא מילה. כל זוג טקסט־רקע נבדק מול WCAG – המספרים מחושבים בזמן הבנייה."
    >
      <PaletteBoard />

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Neutrals" he="בסיס" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {base.map((c) => (
            <Slab key={c.id} c={c} tall />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Category accents" he="ארבע מילים" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {accent.map((c) => (
            <Slab key={c.id} c={c} tall />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Derived" he="הנגזרות שמחזיקות את AA" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {derived.map((c) => (
            <Slab key={c.id} c={c} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
