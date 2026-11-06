"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { KG } from "@/lib/format";
import { ScrollRegion } from "./scroll-region";

const kg = (n: number) => n.toFixed(1);
const signed = (n: number) => (n > 0 ? `+${n.toFixed(1)}` : n < 0 ? `−${Math.abs(n).toFixed(1)}` : "0.0");
const cents = (n: number) => Math.round(n * 100) / 100;

const ROWS = [
  { id: "picanha", name: "פיקנייה", origin: "דרום אמריקה", est: 20, actual: 19.4, price: 89 },
  { id: "salmon", name: "סלמון נורבגי טרי", origin: "נורבגיה", est: 12, actual: 12.3, price: 62.9 },
] as const;

/**
 * A value on the static frost tile while it is provisional; the frost thaws (600ms) when it becomes final.
 * The tile bleeds into the cell's start padding (-ms-2), so the figure keeps the column's start edge.
 */
function Frosted({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span className="relative -ms-2 inline-flex items-center px-2 py-1">
      <span
        aria-hidden="true"
        className={`frost-band absolute inset-0 rounded-hair shadow-frost transition-opacity duration-thaw ease-thaw ${on ? "opacity-100" : "opacity-0"}`}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/**
 * The invoice row: משוער against בפועל. Frost marks what is not final yet. Once the
 * delivery note records the real weight, the frost thaws and the row is exact.
 */
export function InvoiceSpecimen() {
  const [weighed, setWeighed] = useState<Record<string, boolean>>({ picanha: true, salmon: false });
  const th = "px-3 pb-3 text-start text-caption font-medium text-frost-3";
  const salmon = ROWS[1];

  return (
    <div className="flex flex-col gap-4">
      <ScrollRegion label="חשבונית לדוגמה" className="relative -mx-4 overflow-x-auto sm:mx-0">
        <table className="w-full min-w-[42rem] border-collapse text-start">
          <caption className="sr-only">חשבונית לדוגמה: משקל משוער מול משקל בפועל. מחירי דמו, לפני מע״מ.</caption>
          <thead>
            <tr className="border-b border-edge">
              <th scope="col" className={`${th} ps-4`}>
                מוצר
              </th>
              <th scope="col" className={th}>
                משוער · {KG}
              </th>
              <th scope="col" className={th}>
                בפועל · {KG}
              </th>
              <th scope="col" className={th}>
                הפרש · {KG}
              </th>
              <th scope="col" className={th}>
                ₪ ל{KG}
              </th>
              <th scope="col" className={`${th} pe-4`}>
                סה״כ · ₪
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const done = weighed[r.id] ?? false;
              return (
                <tr key={r.id} className="border-b border-hairline">
                  <th scope="row" className="py-4 ps-4 pe-3 text-start font-normal">
                    <span className="block text-body font-medium text-frost">{r.name}</span>
                    <span className="text-caption text-frost-2">{r.origin}</span>
                  </th>
                  <td className="px-3 py-4 text-start text-data text-frost-2">
                    <Frosted on={!done}>
                      כ־<Num joined>{kg(r.est)}</Num>
                    </Frosted>
                  </td>
                  <td className="px-3 py-4 text-start">
                    {done ? (
                      <Num className="text-data font-medium text-frost">{kg(r.actual)}</Num>
                    ) : (
                      <span className="text-caption text-frost-3">ממתין לשקילה</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-start text-caption text-frost-2">
                    {done ? <Num>{signed(cents(r.actual - r.est))}</Num> : <span>—</span>}
                  </td>
                  <td className="px-3 py-4 text-start text-caption text-frost-2">
                    <Num>{r.price.toFixed(2)}</Num>
                  </td>
                  <td className="py-4 ps-3 pe-4 text-start text-data">
                    <Frosted on={!done}>
                      {done ? (
                        <Money value={cents(r.actual * r.price)} className="font-medium text-frost" />
                      ) : (
                        <span className="text-frost-2">
                          כ־<Money joined value={cents(r.est * r.price)} />
                          <span className="sr-only"> (משוער)</span>
                        </span>
                      )}
                    </Frosted>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollRegion>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setWeighed((w) => ({ ...w, salmon: !w.salmon }))}
        >
          {weighed.salmon ? "איפוס ההדגמה" : "קליטת תעודת משלוח · סלמון"}
        </Button>
        <p className="text-caption text-frost-2" aria-live="polite">
          {weighed.salmon ? (
            <>
              {salmon.name}: נשקל{" "}
              <span className="whitespace-nowrap">
                <Num>{kg(salmon.actual)}</Num> {KG}
              </span>
              . הכפור הפשיר, והסכום סופי.
            </>
          ) : (
            "על הכפור: ערך משוער. השקילה בפועל מפשירה אותו."
          )}
        </p>
      </div>
    </div>
  );
}
