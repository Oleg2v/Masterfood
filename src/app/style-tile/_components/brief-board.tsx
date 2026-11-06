import { Fragment, type ReactNode } from "react";
import { flapPlate } from "@/components/board/flap";
import { TrendGlyph } from "@/components/ui/icon";
import { Num } from "@/components/ui/num";
import { KG } from "@/lib/format";

/**
 * The brief's three board lines, set as typed segments in columns, never as one
 * literal string (a bidi-naive board prints 312 as 213). Every cell is the same
 * plate: Hebrew letters in Frank Ruhl Libre 500 (widest letter ש = 0.619em), figures
 * in Plex Mono 500 (0.6em), both in 0.66em cells, so the board reads as one machine.
 * Hebrew runs right to left, figures left to right, each segment isolated.
 *
 * Static in Stage 0; the Stage 1 engine riffles each changed cell through the drum
 * (alef-bet, finals after their base letter, then 0–9), from the inline-start edge.
 * The visual board is aria-hidden; the table beside it is the text equivalent.
 */
type Dir = "up" | "down" | "flat";
const LINES: {
  name: string;
  origin: string;
  landed: string;
  kg: string;
  price: string;
  change: string;
  dir: Dir;
  spoken: string;
}[] = [
  {
    name: "סלמון נורבגי טרי",
    origin: "נורווגיה",
    landed: "05:40",
    kg: "312",
    price: "62.90",
    change: "1.2%",
    dir: "up",
    spoken: "עלייה של 1.2 אחוז",
  },
  {
    name: "פיקנייה",
    origin: "דרום אמריקה",
    landed: "",
    kg: "140",
    price: "89.00",
    change: "0.8%",
    dir: "down",
    spoken: "ירידה של 0.8 אחוז",
  },
  {
    name: "דניס",
    origin: "קפריסין",
    landed: "06:15",
    kg: "220",
    price: "41.50",
    change: "0.0%",
    dir: "flat",
    spoken: "ללא שינוי",
  },
];

/* Column widths in cells: the longest value in each column. */
const W = {
  name: 16,
  origin: 11,
  landed: 5,
  kg: 3,
  price: 5,
  change: 4,
} as const;

const cell = `${flapPlate} h-[1.36em] w-[0.66em] shrink-0`;

/** A Hebrew segment: one letter per plate, right to left, blank plates after the word. */
function Letters({ text, width }: { text: string; width: number }) {
  const chars = [...text.padEnd(width, " ")];
  return (
    <span dir="rtl" className="flex gap-[2px] font-display font-medium">
      {chars.map((ch, i) => (
        <span key={i} className={cell}>
          {ch === " " ? null : <span className="relative">{ch}</span>}
        </span>
      ))}
    </span>
  );
}

/** A figure segment: one glyph per plate, left to right. */
function Figures({ text, width, center = false }: { text: string; width: number; center?: boolean }) {
  const t = center
    ? text.padStart(Math.ceil((width + text.length) / 2), " ").padEnd(width, " ")
    : text.padStart(width, " ");
  return (
    <span dir="ltr" className="flex gap-[2px] font-mono font-medium [font-variant-numeric:tabular-nums]">
      {[...t].map((ch, i) => (
        <span key={i} className={cell}>
          {ch === " " ? null : <span className="relative">{ch}</span>}
        </span>
      ))}
    </span>
  );
}

function Head({ children }: { children: ReactNode }) {
  return <span className="self-end pb-1 text-caption font-medium whitespace-nowrap text-frost-3">{children}</span>;
}

export function BriefBoard() {
  return (
    <div className="relative rounded-edge bg-well p-4 shadow-[inset_0_2px_12px_0_rgb(2_8_12/0.9)] inset-ring inset-ring-hairline sm:p-6">
      {/* the text equivalent: one real table for assistive technology. The clip lives on a
          wrapper, because a table never shrinks below its content and would widen the page. */}
      <div className="sr-only">
        <table>
          <caption>לוח השוק של הבוקר: שלוש השורות מהבריף. מחירי דמו, לפני מע״מ.</caption>
          <thead>
            <tr>
              <th scope="col">מוצר</th>
              <th scope="col">מקור</th>
              <th scope="col">נחת</th>
              <th scope="col">זמין, {KG}</th>
              <th scope="col">₪ ל{KG}</th>
              <th scope="col">שינוי</th>
            </tr>
          </thead>
          <tbody>
            {LINES.map((l) => (
              <tr key={l.name}>
                <th scope="row">{l.name}</th>
                <td>{l.origin}</td>
                <td>{l.landed || "—"}</td>
                <td>{l.kg}</td>
                <td>₪{l.price}</td>
                <td>{l.spoken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* desktop: the board itself, cells sized to fit the container (cap: step 3) */}
      <div aria-hidden="true" className="@container hidden lg:block">
        <div
          className="grid grid-cols-[repeat(6,auto)] justify-start gap-x-[0.5em] gap-y-2 text-frost"
          style={{
            fontSize: "min(var(--text-title), calc((100cqi - 78px) / 32.2))",
          }}
        >
          {["מוצר", "מקור", "נחת", KG, `₪ ל${KG}`, "שינוי"].map((label) => (
            <Head key={label}>{label}</Head>
          ))}
          {LINES.map((l) => (
            <Fragment key={l.name}>
              <Letters text={l.name} width={W.name} />
              <Letters text={l.origin} width={W.origin} />
              <Figures text={l.landed || "—"} width={W.landed} center={!l.landed} />
              <Figures text={l.kg} width={W.kg} />
              <Figures text={l.price} width={W.price} />
              <span dir="ltr" className="flex gap-[2px] text-frost-2">
                <span className={cell}>
                  <TrendGlyph dir={l.dir} className="relative" />
                </span>
                <Figures text={l.change} width={W.change} />
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      {/* phones and tablets: every line stays visible as a stacked carte row; figures keep their plates */}
      <ol aria-hidden="true" className="flex flex-col lg:hidden">
        {LINES.map((l) => (
          <li
            key={l.name}
            className="flex flex-col gap-2 border-t border-hairline py-4 first:border-t-0 first:pt-0 last:pb-0"
          >
            <div className="flex items-end gap-2">
              <span className="text-body font-medium text-frost">{l.name}</span>
              <span className="leader mb-2 flex-1" />
              <span className="text-data text-frost">
                <Figures text={l.price} width={W.price} />
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-caption text-frost-2">
              <span>
                {l.origin} · נחת <Num>{l.landed || "—"}</Num> · <Num>{l.kg}</Num> {KG}
              </span>
              <span className="inline-flex items-center gap-1">
                <TrendGlyph dir={l.dir} />
                <Num>{l.change}</Num>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-hairline pt-3 text-caption text-frost-2">מחירי דמו · ₪ ל{KG}, לפני מע״מ</p>
    </div>
  );
}
