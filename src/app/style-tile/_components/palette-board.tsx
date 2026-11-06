import { FlapCells, FlapWord } from "@/components/board/flap";
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

/**
 * The palette as a departure board: the brief's eight colours as eight board
 * lines (swatch · name · code · hex · ratio · meaning). Static in Stage 0; the
 * flap engine that riffles them in, right to left, arrives in Stage 1.
 */
export function PaletteBoard() {
  const rows = colors.filter((c) => c.group === "base" || c.group === "accent");
  return (
    <div className="rounded-md bg-abyss p-3 shadow-[inset_0_0_0_1px_var(--color-hairline),inset_0_2px_12px_0_rgb(1_6_10/0.9)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <p className="flex items-center gap-2 text-small text-mist">
          <span aria-hidden="true" className="size-2 rounded-full bg-fresh" />
          לוח הצבעים
        </p>
        <p className="label-latin hidden text-fog sm:block">
          <bdi dir="ltr">Departures · Palette · 8 lines</bdi>
        </p>
      </div>
      <table className="w-full border-separate border-spacing-y-1.5 text-start">
        <caption className="sr-only">שמונת צבעי הבריף: שם, קוד, ערך הקסדצימלי, יחס ניגודיות ותפקיד</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">צבע</th>
            <th scope="col">שם</th>
            <th scope="col">קוד</th>
            <th scope="col">ערך</th>
            <th scope="col">ניגודיות</th>
            <th scope="col">תפקיד</th>
          </tr>
        </thead>
        <tbody className="type-lead lg:text-title">
          {rows.map((c) => {
            const r = ratioFor(c.id);
            const ratio = (Math.floor(r.value * 100) / 100).toFixed(2);
            return (
              <tr key={c.id} className="align-middle">
                <td className="w-[3.25em] pe-2">
                  <span
                    aria-hidden="true"
                    className="block h-[1.5em] w-[3em] rounded-xs shadow-[inset_0_0_0_1px_rgb(232_243_247/0.1)]"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="sr-only">{c.en}</span>
                </td>
                <th scope="row" className="pe-3 text-start font-normal">
                  <FlapWord className="min-w-[5.5em] justify-start! font-display font-medium">{c.he}</FlapWord>
                </th>
                <td className="hidden pe-3 xl:table-cell">
                  <span className="sr-only">{c.en}</span>
                  <span aria-hidden="true">
                    <FlapCells text={c.en.toUpperCase().padEnd(11, " ")} className="text-[0.8em]" />
                  </span>
                </td>
                <td className="pe-3">
                  <span className="sr-only">{c.hex}</span>
                  <span aria-hidden="true">
                    <FlapCells text={c.hex.toUpperCase()} className="text-[0.8em]" />
                  </span>
                </td>
                <td className="hidden pe-3 md:table-cell">
                  <span className="sr-only">
                    {ratio}:1 {r.note}
                  </span>
                  <span aria-hidden="true">
                    <FlapCells text={ratio.padStart(5, " ")} className="text-[0.8em]" />
                  </span>
                </td>
                <td className="hidden lg:table-cell">
                  <FlapWord className="font-sans text-[0.8em]">{meaning[c.id]}</FlapWord>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
