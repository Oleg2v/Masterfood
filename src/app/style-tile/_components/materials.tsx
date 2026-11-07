import type { ReactNode } from "react";
import type { Photo } from "@/components/ui/graded-photo";
import { Money } from "@/components/ui/money";

/** A same-origin, resized image URL. */
const local = (src: string, w = 640) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

function Swatch({
  title,
  en,
  note,
  credit,
  children,
}: {
  title: string;
  en: string;
  note: string;
  /** the photographer, for a swatch that is a photograph */
  credit?: Photo;
  children: ReactNode;
}) {
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
        {credit ? (
          <a
            href={credit.page}
            className="self-start text-caption text-frost-2 underline decoration-hairline underline-offset-4 transition-colors duration-hover ease-glide hover:text-frost hover:decoration-frost-2"
          >
            צילום:{" "}
            <span className="whitespace-nowrap">
              <bdi dir="ltr" lang="en">
                {credit.photographer}
              </bdi>{" "}
              / <span lang="en">Unsplash</span>
            </span>
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * The four materials of the cold room, each with one job. Steel is every
 * surface. Frost, inside the app, only ever means "estimated" (the hero glass is
 * on the cover). Fog is the display case's cold air, never a loading state; it
 * drifts only on the cover, so its swatch is a still frame. Ice is the light of
 * the photographs.
 */
export function Materials({ icePhoto }: { icePhoto?: Photo }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
      <Swatch title="פלדה" en="Steel · surface" note="כל משטח: לוחות, כרטיסים, שורות. אטום, עם קו אור של פיקסל בקצה העליון; העומק בא מאור, לא מצל.">
        <div className="absolute inset-0 bg-steel shadow-rim inset-ring inset-ring-hairline">
          {/* brushed: a cold light falling from the top edge over a fine vertical grain */}
          <div className="absolute inset-4 rounded-hair bg-[linear-gradient(180deg,rgb(232_243_247/0.06),transparent_45%),repeating-linear-gradient(90deg,rgb(232_243_247/0.04)_0_1px,transparent_1px_3px)] shadow-[inset_0_1px_0_0_rgb(232_243_247/0.08),inset_0_0_0_1px_var(--color-hairline)]" />
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
      <Swatch title="ערפל" en="Fog · display case" note="האוויר הקר של הוויטרינה. בשער הוא נע לאט לאורך תחתית הזכוכית, וכאן הוא דומם. אף פעם לא מצב טעינה: טעינה היא קווי שיער סטטיים.">
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-steel),var(--color-deep-ice))]">
          {/* a still frame of the cover's fog: two soft layers pooled in the lower 40% of the glass,
              a little denser than the drifting ones, so that a still can carry them */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[radial-gradient(60%_55%_at_30%_70%,rgb(232_243_247/0.14),transparent_70%),radial-gradient(50%_45%_at_74%_82%,rgb(232_243_247/0.1),transparent_70%)]" />
        </div>
      </Swatch>
      <Swatch title="קרח" en="Ice · light" note="קרח אמיתי הוא האור של הצילום – לא קישוט, ולא פתיתי שלג מצוירים." credit={icePhoto}>
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
