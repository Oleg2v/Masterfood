import { formatChange, formatKg, KG } from "@/lib/format";
import { Button } from "./button";
import { Tag } from "./chip";
import { GradedPhoto, type Photo } from "./graded-photo";
import { Icon, TrendGlyph } from "./icon";
import { Money } from "./money";
import { Num } from "./num";

export interface CardProduct {
  name: string;
  category: "meat" | "fish";
  origin: string;
  /** ISO country + port/airport, e.g. "NO · OSL": set as an inspection-oval stamp. */
  stamp?: string;
  kashrut: "רבנות" | "מהדרין";
  fresh: boolean;
  pricePerKg: number;
  changePct: number;
  availableKg: number;
  arrival?: string;
  photo?: Photo;
}

export type CardState = "default" | "hover" | "focus" | "selected" | "soldout" | "loading";

/**
 * Product card. The category is a 2px edge on the inline-start side (Bordeaux for
 * meat, Salmon for fish); the name is set like a menu item; the numbers are mono.
 */
export function ProductCard({ product, state = "default" }: { product: CardProduct; state?: CardState }) {
  if (state === "loading") return <ProductCardSkeleton />;

  const change = formatChange(product.changePct);
  const soldOut = state === "soldout";
  const force = state === "hover" ? "hover" : state === "focus" ? "within" : undefined;

  return (
    <article
      data-force={force}
      aria-label={product.name}
      className={
        "group/card relative flex flex-col overflow-hidden rounded-md bg-steel shadow-rim " +
        "transition-[box-shadow,translate] duration-base ease-glide hover:-translate-y-0.5 hover:shadow-raise " +
        "focus-within:shadow-frost " +
        (state === "selected" ? "shadow-frost! " : "")
      }
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 start-0 z-10 w-0.5 ${product.category === "meat" ? "bg-bordeaux" : "bg-salmon"}`}
      />
      <div className="relative aspect-[4/3]">
        {product.photo ? (
          <GradedPhoto
            photo={product.photo}
            sizes="(min-width: 1024px) 360px, 90vw"
            className="absolute inset-0"
            frosted={soldOut}
            imgClassName={soldOut ? "" : "transition-[scale] duration-calm ease-glide group-hover/card:scale-[1.035]"}
          />
        ) : (
          <div className="fog absolute inset-0 overflow-hidden" />
        )}
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-center gap-2">
          <Tag tone={product.category === "meat" ? "meat" : "fish"} className="bg-deep-ice/85">
            {product.category === "meat" ? "בשר" : "דג"}
          </Tag>
          <Tag tone={product.fresh ? "chilled" : "frozen"} className="bg-deep-ice/85">
            {product.fresh ? (
              <>
                טרי <Num>0–2°</Num>
              </>
            ) : (
              <>
                קפוא <Num>−18°</Num>
              </>
            )}
          </Tag>
        </div>
        {product.stamp ? (
          <p className="absolute bottom-3 start-3 rounded-[50%] bg-deep-ice/85 px-3 py-1.5 shadow-[inset_0_0_0_1px_var(--color-mist)]">
            <bdi dir="ltr" className="label-latin text-frost">
              {product.stamp}
            </bdi>
          </p>
        ) : null}
        {product.arrival ? (
          <p className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-xs bg-deep-ice/85 px-2 py-1 text-small text-frost">
            <Icon name="plane" size={14} />
            נחת <Num>{product.arrival}</Num>
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className={`type-title ${soldOut ? "text-mist" : "text-frost"}`}>{product.name}</h3>
            <p className="text-small text-mist">{product.origin}</p>
          </div>
          <Tag tone={product.kashrut === "מהדרין" ? "mehadrin" : "rabbinate"}>{product.kashrut}</Tag>
        </header>

        <div className="flex flex-col gap-1">
          {/* A menu line: label, dot leader, price. */}
          <p className="flex items-baseline gap-2">
            <span className="text-small text-mist">מחיר ל{KG}</span>
            <span aria-hidden="true" className="leader flex-1" />
            <Money
              value={product.pricePerKg}
              className={`type-lead font-medium ${soldOut ? "text-mist line-through decoration-1" : "text-frost"}`}
            />
          </p>
          <p className="flex items-center justify-end gap-1 text-small text-mist">
            <TrendGlyph dir={change.dir} />
            <Num>{change.text}</Num>
            <span>{change.dir === "up" ? "מאתמול" : change.dir === "down" ? "מאתמול" : "ללא שינוי"}</span>
            <span className="sr-only">
              {change.dir === "up" ? "עלייה" : change.dir === "down" ? "ירידה" : ""}
            </span>
          </p>
        </div>

        <footer className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
          {soldOut ? (
            <p className="flex items-center gap-2 text-small text-mist">
              <span aria-hidden="true" className="size-2 rounded-full shadow-[inset_0_0_0_1.5px_var(--color-fog)]" />
              <span>
                אזל · חוזר מחר <Num>05:40</Num>
              </span>
            </p>
          ) : (
            <p className="flex items-center gap-2 text-small text-frost">
              <span aria-hidden="true" className="size-2 rounded-full bg-fresh" />
              <span>
                <Num>{formatKg(product.availableKg)}</Num> {KG} במלאי
              </span>
            </p>
          )}
          <Button variant={state === "selected" ? "primary" : "secondary"} size="sm" disabled={soldOut} force={state === "focus" ? "focus" : undefined}>
            {state === "selected" ? "בהזמנה" : "הוספה"}
          </Button>
        </footer>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col overflow-hidden rounded-md bg-steel shadow-rim">
      <div className="fog relative aspect-[4/3] overflow-hidden" />
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="fog relative h-6 w-2/5 overflow-hidden rounded-xs" />
        <div className="fog relative h-4 w-3/5 overflow-hidden rounded-xs" />
        <div className="fog relative mt-2 h-7 w-1/3 overflow-hidden rounded-xs" />
        <div className="mt-2 h-px bg-hairline" />
        <div className="flex items-center justify-between">
          <div className="fog relative h-4 w-1/3 overflow-hidden rounded-xs" />
          <div className="fog relative h-10 w-20 overflow-hidden rounded-sm" />
        </div>
      </div>
    </div>
  );
}
