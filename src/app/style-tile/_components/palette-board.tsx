import { FlapCells, FlapWord, flapPlate } from "@/components/board/flap";
import { contrastRatio } from "@/design/contrast";
import { colors } from "@/design/tokens";

const hex = (id: string) => colors.find((c) => c.id === id)!.hex;

/** What each brief colour is for, said the way the board would say it. */
const meaning: Record<string, string> = {
  "deep-ice": "לילה · רקע",
  steel: "משטח",
  frost: "טקסט · פעולה",
  hairline: "קו",
  salmon: "דגים · דחיפות",
  bordeaux: "בשר · מילוי",
  ice: "טמפרטורה",
  fresh: "במלאי",
};

/** The ratio that matters for each colour's job. */
function ratioFor(id: string): { value: number; note: string } {
  const H = hex(id);
  switch (id) {
    case "deep-ice":
    case "steel":
      return { value: contrastRatio(hex("frost"), H), note: "כפור עליו" };
    case "bordeaux":
      return { value: contrastRatio(hex("frost"), H), note: "כפור עליו" };
    case "hairline":
      return { value: contrastRatio(H, hex("deep-ice")), note: "דקורטיבי" };
    default:
      return { value: contrastRatio(H, hex("deep-ice")), note: "על קרח עמוק" };
  }
}

const rows = colors.filter((c) => c.group === "base" || c.group === "accent");

/** Every name is padded with blank plates to the longest one, as on a real board. */
const NAME_CELLS = Math.max(...rows.map((c) => [...c.he].length));

/**
 * A Hebrew name one letter per plate, in the cover board's metal: Frank Ruhl Libre 500 in
 * 0.66em cells (its widest letter, ש, is 0.619em), right to left, blank plates after the word.
 * Desktop only, where the board sets at step 2 or more (Frank Ruhl never goes below 24px).
 */
function Letters({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`gap-px font-display font-medium ${className}`}>
      {[...text.padEnd(NAME_CELLS, " ")].map((ch, i) => (
        <span key={i} className={`${flapPlate} h-[1.5em] w-[0.66em] shrink-0`}>
          {ch === " " ? null : <span className="relative">{ch}</span>}
        </span>
      ))}
    </span>
  );
}

/**
 * The palette as a departure board: the brief's eight colours as eight board lines (swatch and
 * name · code · hex · ratio · meaning). Static in Stage 0; the flap engine that riffles them in,
 * right to left, arrives in Stage 1.
 *
 * Every column stays in the table at every width, so the headers read the same for assistive
 * tech on a phone and on a desktop: a narrow screen hides only a column's plates (its cell
 * collapses to zero width), never the cell or its text. Below lg the meaning moves visually
 * under the name, as a smaller second line, so the board still says what each colour is for.
 */
export function PaletteBoard() {
  return (
    <div className="rounded-edge bg-well p-3 shadow-[inset_0_0_0_1px_var(--color-hairline),inset_0_2px_12px_0_rgb(1_6_10/0.9)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <p className="flex items-center gap-2 text-caption text-frost-2">
          {/* An unlit lamp: the board is static until the Stage 1 engine drives it. Green means stock, never "live". */}
          <span aria-hidden="true" className="size-2 rounded-full inset-ring-[1.5px] inset-ring-frost-3" />
          לוח הצבעים
        </p>
        <p lang="en" className="label-latin hidden text-frost-3 sm:block">
          <bdi dir="ltr">Departures · Palette · 8 lines</bdi>
        </p>
      </div>
      <table className="w-full border-separate border-spacing-y-3 text-start lg:border-spacing-y-1.5">
        <caption className="sr-only">שמונת צבעי הבריף: שם, קוד, ערך הקסדצימלי, יחס ניגודיות ותפקיד</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">שם</th>
            <th scope="col">קוד</th>
            <th scope="col">ערך</th>
            <th scope="col">ניגודיות</th>
            <th scope="col">תפקיד</th>
          </tr>
        </thead>
        <tbody className="type-data text-frost lg:text-dish">
          {rows.map((c) => {
            const r = ratioFor(c.id);
            const ratio = (Math.floor(r.value * 100) / 100).toFixed(2);
            return (
              /* Below lg a row is two lines high: the plates hang from its top, centred on the name plate. */
              <tr key={c.id} className="align-top lg:align-middle">
                <th scope="row" className="pe-3 text-start font-normal">
                  <span className="sr-only">{c.he}</span>
                  <span aria-hidden="true" className="flex items-start gap-[0.4em]">
                    <span
                      className="h-[1.5em] w-[3em] shrink-0 rounded-hair shadow-[inset_0_0_0_1px_rgb(232_243_247/0.1)]"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="flex flex-col items-start gap-1 lg:hidden">
                      <FlapWord className="min-w-[5.5em] justify-start! font-sans font-medium">{c.he}</FlapWord>
                      <FlapWord className="font-sans text-[0.8em]">{meaning[c.id]}</FlapWord>
                    </span>
                    <Letters text={c.he} className="hidden lg:flex" />
                  </span>
                </th>
                <td className="max-xl:w-0 max-xl:p-0 xl:pe-3">
                  <span lang="en" className="sr-only">
                    {c.en}
                  </span>
                  <span aria-hidden="true" className="flex max-xl:hidden">
                    <FlapCells text={c.en.toUpperCase().padEnd(11, " ")} className="text-[0.8em]" />
                  </span>
                </td>
                <td className="pe-3 max-lg:pt-[0.15em]">
                  <span className="sr-only">{c.hex}</span>
                  <span aria-hidden="true" className="flex">
                    <FlapCells text={c.hex.toUpperCase()} className="text-[0.8em]" />
                  </span>
                </td>
                <td className="max-md:w-0 max-md:p-0 md:pe-3 max-lg:pt-[0.15em]">
                  <span className="sr-only">
                    {ratio}:1 {r.note}
                  </span>
                  <span aria-hidden="true" className="flex max-md:hidden">
                    <FlapCells text={ratio.padStart(5, " ")} className="text-[0.8em]" />
                  </span>
                </td>
                <td className="max-lg:w-0 max-lg:p-0">
                  <span className="sr-only">{meaning[c.id]!.replace(" · ", ", ")}</span>
                  <span aria-hidden="true" className="flex max-lg:hidden">
                    <FlapWord className="font-sans text-[0.8em]">{meaning[c.id]}</FlapWord>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
