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
        "group/card relative flex flex-col overflow-hidden rounded-edge bg-steel shadow-rim inset-ring inset-ring-hairline " +
        "transition-[box-shadow,translate] duration-state ease-glide hover:-translate-y-0.5 hover:shadow-rim-lift " +
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-frost " +
        (state === "selected" ? "inset-ring-frost! " : "")
      }
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 start-0 z-10 w-0.5 ${product.category === "meat" ? "bg-bordeaux" : "bg-salmon"} ${soldOut ? "opacity-40" : ""}`}
      />
      {/* the protein lights the steel: a 1px top rim mixed toward the category ink */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 z-10 h-px ${soldOut ? "bg-hairline" : product.category === "meat" ? "bg-[color-mix(in_oklab,var(--color-meat-ink)_50%,var(--color-steel))]" : "bg-[color-mix(in_oklab,var(--color-salmon)_50%,var(--color-steel))]"}`}
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
            imgClassName={soldOut ? "" : "transition-[scale] duration-thaw ease-glide group-hover/card:scale-[1.035]"}
          />
        ) : (
          <div className="absolute inset-0 bg-steel-2" />
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
          <p className="absolute bottom-3 start-3 rounded-oval bg-deep-ice/85 px-3 py-1.5 inset-ring inset-ring-frost-2">
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
            <span className="rounded-hair bg-deep-ice/90 px-3 py-1.5 text-caption font-medium text-frost inset-ring inset-ring-edge">
              אזל להיום
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className={`text-caption font-medium ${soldOut ? "text-frost-3" : product.category === "meat" ? "text-meat-ink" : "text-salmon"}`}>
              {product.category === "meat" ? "בשר" : "דגי יבוא"} · {product.origin}
            </p>
            <H className={`type-dish ${soldOut ? "text-frost-2" : "text-frost"}`}>{product.name}</H>
          </div>
          <Tag tone={product.kashrut === "מהדרין" ? "mehadrin" : "rabbinate"}>{product.kashrut}</Tag>
        </header>

        <div className="flex flex-col gap-1">
          {/* A menu line: label, dot leader, price. */}
          <p className="flex items-baseline gap-2">
            <span className="text-caption text-frost-2">מחיר ל{KG}</span>
            <span aria-hidden="true" className="leader flex-1" />
            <Money
              value={product.pricePerKg}
              className={`type-data font-medium ${soldOut ? "text-frost-3 line-through decoration-1" : "text-frost"}`}
            />
          </p>
          <p className="flex items-center justify-end gap-1 text-caption text-frost-2">
            <TrendGlyph dir={change.dir} />
            <Num>{change.text}</Num>
            <span>{change.dir === "flat" ? "ללא שינוי" : "מאתמול"}</span>
          </p>
        </div>

        <footer className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
          {soldOut ? (
            <p className="flex items-center gap-2 text-caption text-frost-2">
              <span aria-hidden="true" className="size-2 rounded-full inset-ring-[1.5px] inset-ring-frost-3" />
              <span>
                חוזר מחר ב־<Num joined>05:40</Num>
              </span>
            </p>
          ) : (
            <p className="flex items-center gap-2 text-caption text-frost">
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

/**
 * Loading: a static hairline skeleton built from the card's own structure, one
 * outline per line, so heights match and nothing jumps when data arrives. No
 * shimmer, no fog, no motion of any kind.
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
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <div className={`${line} h-7 w-2/5`} />
            <div className={`${line} h-4 w-3/5`} />
          </div>
          <div className={`${line} h-7 w-14`} />
        </div>
        <div className="flex flex-col gap-2">
          <div className={`${line} h-8 w-full`} />
          <div className={`${line} h-4 w-1/4 self-end`} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
          <div className={`${line} h-5 w-1/3`} />
          <div className={`${line} h-10 w-20 rounded-edge`} />
        </div>
      </div>
    </div>
  );
}
