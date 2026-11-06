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
  /** object-position for the photo crop. */
  photoPosition?: string;
}

export type CardState = "default" | "hover" | "focus" | "selected" | "soldout" | "loading";

/**
 * Product card. The category is a 2px edge on the inline-start side (Bordeaux for
 * meat, Salmon for fish) and a word in the corner tag; the name is set like a
 * menu item; the price is a menu line with a dot leader; numbers are mono.
 * Sold out drains the photo (frost is reserved for "estimated").
 */
export function ProductCard({
  product,
  state = "default",
  headingLevel = "h3",
}: {
  product: CardProduct;
  state?: CardState;
  headingLevel?: "h3" | "h4";
}) {
  if (state === "loading") return <ProductCardSkeleton />;

  const H = headingLevel;
  const change = formatChange(product.changePct);
  const soldOut = state === "soldout";
  const pinned = state === "hover" || state === "focus";
  const force = state === "hover" ? "hover" : state === "focus" ? "within" : undefined;

  return (
    <article
      data-force={force}
      aria-label={product.name}
      className={
        "group/card relative flex flex-col overflow-hidden rounded-md bg-steel shadow-rim inset-ring inset-ring-hairline " +
        "transition-[box-shadow,translate] duration-base ease-glide hover:-translate-y-0.5 hover:shadow-raise " +
        "focus-within:shadow-frost " +
        (state === "selected" ? "shadow-frost! " : "")
      }
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 start-0 z-10 w-0.5 ${product.category === "meat" ? "bg-bordeaux" : "bg-salmon"} ${soldOut ? "opacity-40" : ""}`}
      />
      <div className="relative aspect-[4/3]">
        {product.photo ? (
          <GradedPhoto
            photo={product.photo}
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
            fill
            muted={soldOut}
            vignette={false}
            position={product.photoPosition}
            imgClassName={soldOut ? "" : "transition-[scale] duration-calm ease-glide group-hover/card:scale-[1.035]"}
          />
        ) : (
          <div className="fog absolute inset-0 overflow-hidden" />
        )}
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-center gap-2">
          <Tag tone={product.category === "meat" ? "meat" : "fish"}>{product.category === "meat" ? "בשר" : "דג"}</Tag>
          <Tag tone={product.fresh ? "chilled" : "frozen"}>
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
          <p className="absolute bottom-3 start-3 rounded-oval bg-deep-ice/85 px-3 py-1.5 inset-ring inset-ring-mist">
            <bdi dir="ltr" lang="en" className="label-latin text-frost">
              {product.stamp}
            </bdi>
          </p>
        ) : null}
        {product.arrival ? (
          <Tag tone="neutral" className="absolute bottom-3 end-3">
            <Icon name="plane" size={14} />
            נחת <Num>{product.arrival}</Num>
          </Tag>
        ) : null}
        {soldOut ? (
          <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            <span className="rounded-xs bg-deep-ice/90 px-3 py-1.5 text-small font-medium text-frost inset-ring inset-ring-boundary">
              אזל להיום
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <H className={`type-title ${soldOut ? "text-mist" : "text-frost"}`}>{product.name}</H>
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
              className={`type-lead font-medium ${soldOut ? "text-fog line-through decoration-1" : "text-frost"}`}
            />
          </p>
          <p className="flex items-center justify-end gap-1 text-small text-mist">
            <TrendGlyph dir={change.dir} />
            <Num>{change.text}</Num>
            <span>{change.dir === "flat" ? "ללא שינוי" : "מאתמול"}</span>
          </p>
        </div>

        <footer className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
          {soldOut ? (
            <p className="flex items-center gap-2 text-small text-mist">
              <span aria-hidden="true" className="size-2 rounded-full inset-ring-[1.5px] inset-ring-fog" />
              <span>
                חוזר מחר ב־<Num>05:40</Num>
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
          <Button
            variant={state === "selected" ? "primary" : "secondary"}
            size="sm"
            disabled={soldOut}
            force={state === "focus" ? "focus" : undefined}
            tabIndex={pinned ? -1 : undefined}
            aria-label={`${state === "selected" ? "בהזמנה" : "הוספה"} – ${product.name}`}
          >
            {state === "selected" ? "בהזמנה" : "הוספה"}
          </Button>
        </footer>
      </div>
    </article>
  );
}

/** Built from the card's own structure, so heights match and nothing jumps when data arrives. */
export function ProductCardSkeleton() {
  const bar = "fog relative overflow-hidden rounded-xs";
  return (
    <div aria-hidden="true" className="flex flex-col overflow-hidden rounded-md bg-steel shadow-rim inset-ring inset-ring-hairline">
      <div className="fog relative aspect-[4/3] overflow-hidden" />
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <div className={`${bar} h-9 w-2/5`} />
            <div className={`${bar} h-5 w-3/5`} />
          </div>
          <div className={`${bar} h-7 w-14`} />
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${bar} h-8 w-full`} />
          <div className={`${bar} h-5 w-1/4 self-end`} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
          <div className={`${bar} h-5 w-1/3`} />
          <div className={`${bar} h-10 w-20 rounded-sm`} />
        </div>
      </div>
    </div>
  );
}
