import type { ReactNode } from "react";
import type { Photo } from "@/components/ui/graded-photo";
import { Money } from "@/components/ui/money";

/** A same-origin, resized image URL. */
const local = (src: string, w = 640) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

function Swatch({ title, en, note, children }: { title: string; en: string; note: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-edge inset-ring inset-ring-hairline">{children}</div>
      <figcaption className="flex flex-col gap-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="type-dish text-frost">{title}</span>
          <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
            {en}
          </bdi>
        </span>
        <span className="text-caption text-pretty text-frost-2">{note}</span>
      </figcaption>
    </figure>
  );
}

/**
 * The four materials of the cold room, each with one job. Steel is every
 * surface. Frost, inside the app, only ever means "estimated" (the hero glass is
 * on the cover). Fog is the display case's cold air, never a loading state.
 * Ice is the light of the photographs.
 */
export function Materials({ icePhoto }: { icePhoto?: Photo }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
      <Swatch title="פלדה" en="Steel · surface" note="כל משטח: לוחות, כרטיסים, שורות. אטום, עם קו אור של פיקסל בקצה העליון; העומק בא מאור, לא מצל.">
        <div className="absolute inset-0 bg-steel shadow-rim inset-ring inset-ring-hairline">
          <div className="absolute inset-4 rounded-hair bg-[repeating-linear-gradient(90deg,rgb(232_243_247/0.018)_0_1px,transparent_1px_3px)] shadow-[inset_0_1px_0_0_rgb(232_243_247/0.08),inset_0_0_0_1px_var(--color-hairline)]" />
        </div>
      </Swatch>
      <Swatch title="כפור" en="Frost · estimate" note="בתוך הפורטל כפור הוא תמיד ערך משוער: אריח קריסטל סטטי על פלדה אטומה, בלי טשטוש. כשהשקילה נרשמת הוא מפשיר לערך בפועל צלול.">
        <div className="absolute inset-0 flex items-end bg-steel p-4">
          <div className="frost-band flex w-full flex-col gap-1 rounded-hair px-3 py-3 shadow-frost">
            <span className="text-caption text-frost-2">משוער</span>
            <Money value={1780} className="text-data font-medium text-frost" />
          </div>
        </div>
      </Swatch>
      <Swatch title="ערפל" en="Fog · display case" note="האוויר הקר של הוויטרינה, נע לאט לאורך תחתית הזכוכית בשער. אף פעם לא מצב טעינה: טעינה היא קווי שיער סטטיים.">
        <div className="fog absolute inset-0 overflow-hidden bg-[linear-gradient(to_top,var(--color-steel),var(--color-deep-ice))]" />
      </Swatch>
      <Swatch title="קרח" en="Ice · light" note="קרח אמיתי הוא האור של הצילום – לא קישוט, ולא פתיתי שלג מצוירים.">
        {icePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={local(icePhoto.src)}
            alt={icePhoto.alt}
            loading="lazy"
            className="absolute inset-0 size-full object-cover [filter:brightness(1.04)_contrast(1.04)_saturate(0.55)]"
          />
        ) : (
          <div className="absolute inset-0 bg-steel" />
        )}
      </Swatch>
    </div>
  );
}
