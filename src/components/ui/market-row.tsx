import { formatChange, formatKg, KG } from "@/lib/format";
import { Button } from "./button";
import { TrendGlyph } from "./icon";
import { Money } from "./money";
import { Num } from "./num";
import { Route } from "./route";

export interface MarketLine {
  name: string;
  category: "meat" | "fish";
  origin: string;
  route?: { from: string; to: string; mode: "air" | "sea" };
  arrival?: string;
  availableKg: number;
  pricePerKg: number;
  changePct: number;
}

export type RowState = "default" | "hover" | "focus" | "updated" | "soldout";

/**
 * One line of the market board as a real table row. The category is said in
 * words (בשר / דג) and echoed by a 2px inline-start edge; figures are mono,
 * start-aligned so fixed decimals stack; a price that just changed gets a 2px
 * Frost marker and the words "עודכן 06:15" (never colour or motion alone).
 */
export function MarketRow({ line, state = "default" }: { line: MarketLine; state?: RowState }) {
  const change = formatChange(line.changePct);
  const soldOut = state === "soldout";
  const pinned = state === "hover" || state === "focus";
  return (
    <tr
      data-force={state === "hover" ? "hover" : state === "focus" ? "within" : undefined}
      className={
        "group/row border-b border-hairline transition-colors duration-hover ease-glide " +
        "hover:bg-steel focus-within:bg-steel " +
        (state === "updated" ? "bg-steel/60 " : "")
      }
    >
      <th scope="row" className="relative py-4 ps-4 pe-3 text-start font-normal">
        <span
          aria-hidden="true"
          className={`absolute inset-y-2 start-0 w-0.5 ${line.category === "meat" ? "bg-bordeaux" : "bg-salmon"} ${soldOut ? "opacity-40" : ""}`}
        />
        <span className={`block text-body font-medium ${soldOut ? "text-frost-2" : "text-frost"}`}>{line.name}</span>
        <span className="text-caption text-frost-2">
          {line.category === "meat" ? "בשר" : "דג"} · {line.origin}
        </span>
      </th>
      <td className="px-3 py-4 text-caption text-frost-2">
        {line.route ? <Route {...line.route} size={16} className="text-frost" /> : <span>—</span>}
        {line.arrival ? (
          <span className="mt-1 block">
            נחת <Num className="text-frost">{line.arrival}</Num>
          </span>
        ) : null}
      </td>
      <td className={`whitespace-nowrap px-3 py-4 text-start ${soldOut ? "text-frost-3" : "text-frost"}`}>
        <Num className="text-body">{soldOut ? "0" : formatKg(line.availableKg)}</Num>
        <span className="text-caption text-frost-2"> {KG}</span>
      </td>
      <td className="px-3 py-4 text-start">
        {/* sold out keeps its price, in Frost-3: a strike-through would read as a markdown */}
        <span className="relative inline-block">
          <Money value={line.pricePerKg} className={`text-data font-medium ${soldOut ? "text-frost-3" : "text-frost"}`} />
          {state === "updated" ? <span aria-hidden="true" className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-frost" /> : null}
        </span>
        {state === "updated" ? (
          <span className="mt-2 block text-caption text-frost-2">
            עודכן <Num>06:15</Num>
          </span>
        ) : null}
      </td>
      <td className="px-3 py-4 text-start text-caption text-frost-2">
        <span className="inline-flex items-center gap-1">
          <TrendGlyph dir={change.dir} />
          <Num>{change.text}</Num>
        </span>
      </td>
      <td className="py-4 ps-3 pe-4 text-end">
        {soldOut ? (
          <span className="inline-flex h-10 items-center gap-2 text-caption text-frost-2">
            <span aria-hidden="true" className="size-2 rounded-full inset-ring-[1.5px] inset-ring-frost-3" />
            אזל
          </span>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            force={state === "focus" ? "focus" : undefined}
            tabIndex={pinned ? -1 : undefined}
            aria-label={`הוספה – ${line.name}`}
          >
            הוספה
          </Button>
        )}
      </td>
    </tr>
  );
}

export function MarketTableHead() {
  // Hebrew never drops below the caption step (14px): micro is for Latin labels only.
  const th = "px-3 pb-3 text-start text-caption font-medium text-frost-3";
  return (
    <thead>
      <tr className="border-b border-edge">
        <th scope="col" className={`${th} ps-4`}>
          מוצר
        </th>
        <th scope="col" className={th}>
          מסלול · נחיתה
        </th>
        <th scope="col" className={th}>
          זמין
        </th>
        <th scope="col" className={th}>
          מחיר ל{KG}
        </th>
        <th scope="col" className={th}>
          שינוי
        </th>
        <th scope="col" className={`${th} pe-4 text-end`}>
          <span className="sr-only">פעולה</span>
        </th>
      </tr>
    </thead>
  );
}
