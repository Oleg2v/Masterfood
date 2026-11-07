import { FrostGlass } from "@/components/frost-glass";
import { Num } from "@/components/ui/num";
import { unsplash } from "@/lib/unsplash";
import { photoSet } from "../_photos";

/** Resized by Unsplash's CDN, which sends CORS headers, so the frost canvas is never tainted. */
const local = (src: string, w: number) => unsplash(src, w);
const widths = [828, 1200, 1920] as const;

/**
 * The display-case glass on the cover: the graded salmon macro under the frost,
 * faint fog drifting along its base, and the legend that gives frost its single
 * meaning. No text sits on the glass itself. The caption's first sentence follows
 * the motion switch in CSS (this stays a server component): it asks for a wipe
 * only while the glass can take one.
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
            {/* The in-app frost tile, on the opaque Steel it always sits on there. */}
            <span aria-hidden="true" className="size-6 shrink-0 rounded-hair bg-steel">
              <span className="frost-band block size-full rounded-hair shadow-frost inset-ring inset-ring-hairline" />
            </span>
            כפור = משוער
          </p>
          <p className="max-w-[62ch] text-caption text-pretty text-frost-2">
            {/* The glass takes a hand only while motion is on, so only then does the caption ask for one. */}
            <span className="hidden motion-ok:inline">
              נגבו את הזכוכית באצבע או בעכבר; הכפור חוזר תוך{" "}
              <span className="whitespace-nowrap">
                <Num>2.4</Num> שניות
              </span>
              .
            </span>
            <span className="motion-ok:hidden">
              הזכוכית קפואה כי התנועה עצורה, ומישהו כבר העביר עליה אצבע. כשהתנועה פועלת, אפשר לנגב אותה בעצמכם.
            </span>{" "}
            בשער זו ויטרינה, ובתוך הפורטל לכפור יש משמעות אחת: ערך שעדיין אינו סופי{"\u00a0"}– משקל משתנה, אומדן הזמנה
            ועמודת ״משוער״ בחשבונית.
          </p>
        </div>
        <a
          href={p.page}
          className="shrink-0 text-caption text-frost-2 underline decoration-hairline underline-offset-4 transition-colors duration-hover ease-glide hover:text-frost hover:decoration-frost-2"
        >
          צילום:{" "}
          <span className="whitespace-nowrap">
            <bdi dir="ltr" lang="en">
              {p.photographer}
            </bdi>{" "}
            / <span lang="en">Unsplash</span>
          </span>
        </a>
      </figcaption>
    </figure>
  );
}
