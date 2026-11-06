import { useId } from "react";
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
  /** ISO country + port/airport, e.g. "NO · OSL": a plain Latin micro-label that closes the provenance line. */
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
 * Product card. The plate carries the product and nothing else: no tag, stamp or
 * badge is ever printed on it. The category is a 2px edge on the inline-start side
 * (Bordeaux for meat, Salmon for fish) and a word in the rubric; the name is set
 * like a menu item; under it, the provenance line says what a badge would have:
 * kashrut, temperature, arrival and the origin code. The price is a menu line with
 * a dot leader, and with the stock line it sits at the foot of the card, so a row
 * of cards lines up however long the names run. Numbers are mono. Sold out drains
 * the photo (frost is reserved for "estimated") and offers a quiet way to hear
 * when it is back, never a dead button.
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
  const id = useId();
  if (state === "loading") return <ProductCardSkeleton />;

  const H = headingLevel;
  const change = formatChange(product.changePct);
  const soldOut = state === "soldout";
  const pinned = state === "hover" || state === "focus";
  const force = state === "hover" ? "hover" : state === "focus" ? "within" : undefined;
  const meat = product.category === "meat";

  return (
    <article
      data-force={force}
      aria-label={product.name}
      className={
        "group/card relative flex flex-col overflow-hidden rounded-edge bg-steel shadow-rim inset-ring inset-ring-hairline " +
        "transition-[box-shadow,translate] duration-state ease-glide hover:-translate-y-0.5 hover:shadow-rim-lift " +
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-frost " +
        (state === "selected" ? "inset-ring-frost! " : "")
      }
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 start-0 z-10 w-0.5 ${meat ? "bg-bordeaux" : "bg-salmon"} ${soldOut ? "opacity-40" : ""}`}
      />
      {/* the protein lights the steel: a 1px top rim mixed toward the category ink */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 z-10 h-px ${soldOut ? "bg-hairline" : meat ? "bg-[color-mix(in_oklab,var(--color-meat-ink)_50%,var(--color-steel))]" : "bg-[color-mix(in_oklab,var(--color-salmon)_50%,var(--color-steel))]"}`}
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
            imgClassName={soldOut ? "" : "transition-[scale] duration-panel ease-thaw motion-ok:group-hover/card:scale-[1.02]"}
          />
        ) : (
          <div className="absolute inset-0 bg-steel-2" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <header className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className={`text-caption font-medium ${soldOut ? "text-frost-3" : meat ? "text-meat-ink" : "text-salmon"}`}>
              {meat ? "בשר" : "דגי יבוא"} · {product.origin}
            </p>
            <H className={`type-dish text-balance ${soldOut ? "text-frost-2" : "text-frost"}`}>{product.name}</H>
          </div>
          {/* Provenance: kashrut as text, the cold chain in Ice, the landing time, and the origin code at the end. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-caption text-frost-2">
            <Tag tone={product.kashrut === "מהדרין" ? "mehadrin" : "rabbinate"}>{product.kashrut}</Tag>
            <span className={`inline-flex items-center gap-1 whitespace-nowrap ${soldOut ? "" : "text-ice"}`}>
              <Icon name="thermometer" size={14} />
              {product.fresh ? (
                <>
                  טרי <Num>0–2°</Num>
                </>
              ) : (
                <>
                  קפוא <Num>−18°</Num>
                </>
              )}
            </span>
            {product.arrival ? (
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Icon name="plane" size={14} mirror={false} />
                נחת <Num>{product.arrival}</Num>
              </span>
            ) : null}
            {product.stamp ? (
              <bdi dir="ltr" lang="en" className="label-latin ms-auto text-frost-3">
                {product.stamp}
              </bdi>
            ) : null}
          </div>
        </header>

        <div className="mt-auto flex flex-col gap-1">
          {/* A menu line: label, dot leader, price. */}
          <p className="flex items-baseline gap-2">
            <span className="text-caption text-frost-2">מחיר ל{KG}</span>
            <span aria-hidden="true" className="leader flex-1" />
            <Money value={product.pricePerKg} className={`type-data font-medium ${soldOut ? "text-frost-3" : "text-frost"}`} />
          </p>
          <p className="flex items-center justify-end gap-1 text-caption text-frost-2">
            <TrendGlyph dir={change.dir} />
            <Num>{change.text}</Num>
            <span>{change.dir === "flat" ? "ללא שינוי" : "מאתמול"}</span>
          </p>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-hairline pt-4">
          {soldOut ? (
            <p id={`${id}-out`} className="flex items-center gap-2 text-caption text-frost">
              <span aria-hidden="true" className="size-2 rounded-full inset-ring-[1.5px] inset-ring-frost-3" />
              אזל להיום
            </p>
          ) : (
            <p className="flex items-center gap-2 text-caption text-frost">
              <span aria-hidden="true" className="size-2 rounded-full bg-fresh" />
              <span>
                <span className="whitespace-nowrap">
                  <Num>{formatKg(product.availableKg)}</Num> {KG}
                </span>{" "}
                במלאי
              </span>
            </p>
          )}
          {soldOut ? (
            <Button variant="quiet" size="sm" aria-label={`עדכון כשיחזור – ${product.name}`} aria-describedby={`${id}-out`}>
              עדכון כשיחזור
            </Button>
          ) : (
            <Button
              variant={state === "selected" ? "primary" : "secondary"}
              size="sm"
              force={state === "focus" ? "focus" : undefined}
              tabIndex={pinned ? -1 : undefined}
              aria-label={`${state === "selected" ? "בהזמנה" : "הוספה"} – ${product.name}`}
            >
              {state === "selected" ? "בהזמנה" : "הוספה"}
            </Button>
          )}
        </footer>
      </div>
    </article>
  );
}

/**
 * Loading: a static hairline skeleton built from the card's own structure, one
 * outline per line, with the price and stock at the foot as on the card, so
 * nothing jumps when data arrives. No shimmer, no fog, no motion of any kind.
 */
export function ProductCardSkeleton() {
  const line = "rounded-hair inset-ring inset-ring-hairline";
  return (
    <div aria-hidden="true" className="flex flex-col overflow-hidden rounded-edge bg-steel shadow-rim inset-ring inset-ring-hairline">
      <div className="relative aspect-[4/3] border-b border-hairline">
        {/* the plate's diagonal, like an empty frame on a contact sheet */}
        <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M0 100L100 0" className="stroke-hairline" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className={`${line} h-4 w-2/5`} />
            <div className={`${line} h-7 w-3/5`} />
          </div>
          <div className="flex items-center gap-3">
            <div className={`${line} h-7 w-14`} />
            <div className={`${line} h-4 w-1/4`} />
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <div className={`${line} h-8 w-full`} />
          <div className={`${line} h-4 w-1/4 self-end`} />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-hairline pt-4">
          <div className={`${line} h-5 w-1/3`} />
          <div className={`${line} h-10 w-20 rounded-edge`} />
        </div>
      </div>
    </div>
  );
}
