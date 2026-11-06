import { FrostGlass } from "@/components/frost-glass";
import { Num } from "@/components/ui/num";
import { photoSet } from "../_photos";

/** Same-origin, resized URLs from the image optimiser, so the frost canvas is never tainted. */
const local = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
const widths = [828, 1200, 1920] as const;

/**
 * The display-case glass on the cover: the graded salmon macro under the frost,
 * faint fog drifting along its base, and the legend that gives frost its single
 * meaning. No text sits on the glass itself.
 */
export function CoverGlass() {
  const p = photoSet.salmonFlesh;
  return (
    <figure className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-edge inset-ring inset-ring-hairline sm:aspect-[16/9] lg:aspect-[21/9]">
        <FrostGlass
          src={local(p.src, 1200)}
          srcSet={widths.map((w) => `${local(p.src, w)} ${w}w`).join(", ")}
          sizes="(min-width: 1440px) 1344px, 100vw"
          alt={p.alt}
          tone="flesh"
          demo
          fill
        />
        <div aria-hidden="true" className="fog pointer-events-none absolute inset-x-0 bottom-0 h-2/5 overflow-hidden" />
      </div>
      <figcaption className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-3 text-body font-medium text-frost">
            <span aria-hidden="true" className="frost-band size-6 shrink-0 rounded-hair shadow-frost inset-ring inset-ring-hairline" />
            כפור = משוער
          </p>
          <p className="max-w-[62ch] text-caption text-pretty text-frost-2">
            נגבו את הזכוכית באצבע או בעכבר; הכפור חוזר תוך <Num>2.4</Num> שניות. בשער זו ויטרינה, ובתוך הפורטל לכפור יש
            משמעות אחת: ערך שעדיין אינו סופי – משקל משתנה, אומדן הזמנה, עמודת משוער בחשבונית.
          </p>
        </div>
        <a
          href={p.page}
          className="shrink-0 text-caption text-frost-2 underline decoration-hairline underline-offset-4 transition-colors duration-hover ease-glide hover:text-frost hover:decoration-frost-2"
        >
          צילום:{" "}
          <bdi dir="ltr" lang="en">
            {p.photographer}
          </bdi>{" "}
          / <span lang="en">Unsplash</span>
        </a>
      </figcaption>
    </figure>
  );
}
