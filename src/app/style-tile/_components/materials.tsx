import { FrostGlass } from "@/components/frost-glass";
import type { Photo } from "@/components/ui/graded-photo";

/** A same-origin, resized image URL, so the frost canvas is never tainted. */
const local = (src: string, w = 828) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

function Swatch({ title, en, note, children }: { title: string; en: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm inset-ring inset-ring-hairline">{children}</div>
      <figcaption className="flex flex-col gap-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="type-title text-frost">{title}</span>
          <bdi dir="ltr" lang="en" className="label-latin text-fog">
            {en}
          </bdi>
        </span>
        <span className="text-small text-mist">{note}</span>
      </figcaption>
    </figure>
  );
}

/**
 * The four materials of the cold room. Steel is the surface, glass-with-frost is
 * the hero and the "not available" state, fog is loading, ice is the photograph.
 */
export function Materials({ frostPhoto, icePhoto }: { frostPhoto?: Photo; icePhoto?: Photo }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
      <Swatch title="פלדה" en="Steel plate" note="המשטח: לוחות, כרטיסים, שורות. עומק מאור קצה, לא מצל.">
        <div className="absolute inset-0 bg-steel shadow-rim inset-ring inset-ring-hairline">
          <div className="absolute inset-4 rounded-xs bg-[repeating-linear-gradient(90deg,rgb(232_243_247/0.018)_0_1px,transparent_1px_3px)] shadow-[inset_0_1px_0_0_rgb(232_243_247/0.08),inset_0_0_0_1px_var(--color-hairline)]" />
        </div>
      </Swatch>
      <Swatch title="כפור" en="Frost · wipe" note="הזכוכית של הוויטרינה: האצבע מנגבת והכפור חוזר לאט. בתוך האפליקציה לכפור משמעות אחת בלבד – ערך משוער.">
        {frostPhoto ? (
          <FrostGlass src={local(frostPhoto.src)} alt={frostPhoto.alt} fill />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_40%_45%,#ff8a63_0%,#b6503a_45%,#07141c_100%)]">
            <div className="frost-veil absolute inset-0 [filter:blur(0px)]" />
          </div>
        )}
      </Swatch>
      <Swatch title="ערפל" en="Fog · loading" note="טעינה: שתי שכבות ערפל נעות לאט על פלדה. בלי ספינר ובלי הבהוב.">
        <div className="fog absolute inset-0 overflow-hidden" />
      </Swatch>
      <Swatch title="קרח" en="Ice · light" note="קרח אמיתי הוא האור של הצילום – לא קישוט ולא פתיתי שלג מצוירים.">
        {icePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={local(icePhoto.src, 640)}
            alt={icePhoto.alt}
            className="absolute inset-0 size-full object-cover [filter:saturate(0.8)_brightness(0.9)]"
          />
        ) : (
          <div className="fog absolute inset-0 overflow-hidden" />
        )}
      </Swatch>
    </div>
  );
}
