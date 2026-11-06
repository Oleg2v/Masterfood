import { formatChange, formatKg, KG } from "@/lib/format";
import { Button } from "./button";
import { Icon, TrendGlyph } from "./icon";
import { Money } from "./money";
import { Num } from "./num";

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
 * One line of the market board as a real table row. Category is a 2px inline-start
 * edge; numbers are mono and tabular; a row whose price just changed gets a 2px
 * Frost marker and the words "עודכן 06:15" (never colour or motion alone).
 */
export function MarketRow({ line, state = "default" }: { line: MarketLine; state?: RowState }) {
  const change = formatChange(line.changePct);
  const soldOut = state === "soldout";
  const muted = soldOut ? "text-fog" : "text-frost";
  return (
    <tr
      data-force={state === "hover" ? "hover" : state === "focus" ? "within" : undefined}
      className={
        "group/row relative border-b border-hairline transition-colors duration-fast ease-glide " +
        "hover:bg-steel focus-within:bg-steel " +
        (state === "updated" ? "bg-steel/60 " : "")
      }
    >
      <th scope="row" className="relative py-4 ps-4 pe-3 text-start font-normal">
        <span
          aria-hidden="true"
          className={`absolute inset-y-2 start-0 w-0.5 ${line.category === "meat" ? "bg-bordeaux" : "bg-salmon"} ${soldOut ? "opacity-40" : ""}`}
        />
        <span className={`type-title block ${soldOut ? "text-mist" : "text-frost"}`}>{line.name}</span>
        <span className="text-small text-mist">{line.origin}</span>
      </th>
      <td className="px-3 py-4 text-small text-mist">
        {line.route ? (
          <span className="flex items-center gap-1.5">
            <Num className="label-latin text-mist">{line.route.from}</Num>
            <Icon name={line.route.mode === "air" ? "plane" : "ship"} size={16} className="text-frost" />
            <Num className="label-latin text-mist">{line.route.to}</Num>
          </span>
        ) : (
          <span>—</span>
        )}
        {line.arrival ? (
          <span className="mt-1 block">
            נחת <Num className="text-frost">{line.arrival}</Num>
          </span>
        ) : null}
      </td>
      <td className={`px-3 py-4 text-start ${muted}`}>
        <Num className="text-body">{soldOut ? "0" : formatKg(line.availableKg)}</Num>
        <span className="text-small text-mist"> {KG}</span>
      </td>
      <td className="px-3 py-4 text-start">
        <span className="relative inline-block">
          <Money
            value={line.pricePerKg}
            className={`text-lead font-medium ${soldOut ? "text-fog line-through decoration-1" : "text-frost"}`}
          />
          {state === "updated" ? <span aria-hidden="true" className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-frost" /> : null}
        </span>
        {state === "updated" ? (
          <span className="mt-2 block text-micro text-mist">
            עודכן <Num>06:15</Num>
          </span>
        ) : null}
      </td>
      <td className="px-3 py-4 text-start text-small text-mist">
        <span className="inline-flex items-center gap-1">
          <TrendGlyph dir={change.dir} />
          <Num>{change.text}</Num>
        </span>
      </td>
      <td className="py-4 ps-3 pe-4 text-end">
        <Button variant="secondary" size="sm" disabled={soldOut} force={state === "focus" ? "focus" : undefined}>
          {soldOut ? "אזל" : "הוספה"}
        </Button>
      </td>
    </tr>
  );
}

export function MarketTableHead() {
  const th = "px-3 pb-3 text-micro font-medium text-fog";
  return (
    <thead>
      <tr className="border-b border-boundary">
        <th scope="col" className={`${th} ps-4 text-start`}>מוצר</th>
        <th scope="col" className={`${th} text-start`}>מסלול · נחיתה</th>
        <th scope="col" className={`${th} text-start`}>זמין</th>
        <th scope="col" className={`${th} text-start`}>מחיר ל{KG}</th>
        <th scope="col" className={`${th} text-start`}>שינוי</th>
        <th scope="col" className={`${th} pe-4 text-end`}>
          <span className="sr-only">פעולה</span>
        </th>
      </tr>
    </thead>
  );
}
