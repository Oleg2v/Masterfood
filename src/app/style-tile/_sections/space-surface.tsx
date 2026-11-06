import { radii, shadows, spacing, SPACING_BASE_PX } from "@/design/tokens";
import { Money } from "@/components/ui/money";
import { Section } from "../_components/frame";

export function SpaceSection() {
  const max = Math.max(...spacing.map((s) => s.px));
  return (
    <Section
      id="space"
      index="03"
      en="Space · 4px grid"
      he="הכול נופל על רשת של 4"
      lede={
        <>
          כל מרווח, גובה ורוחב בפורטל הוא כפולה של <bdi dir="ltr" className="num">{SPACING_BASE_PX}px</bdi>. ב־Tailwind
          המספר הוא המכפיל: <bdi dir="ltr" className="num">p-6</bdi> הוא <bdi dir="ltr" className="num">24px</bdi>. גובה
          מינימלי למטרת מגע: <bdi dir="ltr" className="num">44px</bdi>.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
        <ol className="flex flex-col lg:col-span-8">
          {spacing.map((s) => (
            <li
              key={s.key}
              className="grid grid-cols-[3.5rem_4rem_1fr] items-center gap-4 border-b border-hairline py-3 sm:grid-cols-[4rem_5rem_1fr_14rem]"
            >
              <bdi dir="ltr" className="num text-small text-frost">
                {s.key}
              </bdi>
              <bdi dir="ltr" className="num text-small text-mist">
                {s.px}px
              </bdi>
              <span className="relative h-4">
                <span
                  className="absolute inset-y-0 start-0 bg-mist/30 shadow-[inset_0_0_0_1px_var(--color-mist)]"
                  style={{ width: `${(s.px / max) * 100}%`, minWidth: s.px }}
                />
              </span>
              <span className="col-span-3 text-small text-mist sm:col-span-1">{s.usage}</span>
            </li>
          ))}
        </ol>

        {/* A live specimen on a visible 4px grid. */}
        <figure className="flex flex-col gap-3 lg:col-span-4">
          <div className="grid-4 relative rounded-md bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline">
            <div className="flex flex-col gap-4 rounded-sm bg-deep-ice p-4 shadow-[inset_0_0_0_1px_var(--color-hairline)]">
              <div className="flex items-center justify-between">
                <span className="font-display text-title font-medium text-frost">סינטה</span>
                <Money value={112} className="text-body text-frost" />
              </div>
              <div className="h-px bg-hairline" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-small text-mist">אורוגוואי · טרי</span>
                <span className="grid h-10 place-items-center rounded-sm bg-frost px-4 text-small font-medium text-deep-ice">
                  הוספה
                </span>
              </div>
            </div>
          </div>
          <figcaption className="text-small text-mist">
            ריפוד <bdi dir="ltr" className="num">16</bdi> · מרווח <bdi dir="ltr" className="num">16</bdi> · כפתור{" "}
            <bdi dir="ltr" className="num">40</bdi> (יעד מגע <bdi dir="ltr" className="num">44</bdi>) · קו שיער <bdi dir="ltr" className="num">1</bdi>. כל קצה נוגע ברשת.
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}

export function SurfaceSection() {
  return (
    <Section
      id="surface"
      index="04"
      en="Radius · Shadow"
      he="פינות של פלדה, אור במקום צל"
      lede="פינות כמעט חדות – כמו להב ומגש נירוסטה. ובמסך כהה צל לא נראה, אז העומק נבנה מאור: קו קצה בהיר, הילה קרה, וזוהר סלמון רק כשהזמן אוזל."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <h3 lang="en" className="label-latin text-fog">Radii</h3>
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-3">
            {radii.map((r) => (
              <li key={r.id} className="flex flex-col gap-2">
                <div
                  className="aspect-square bg-steel shadow-[inset_0_0_0_1px_var(--color-boundary)]"
                  style={{ borderRadius: r.px >= 999 ? 9999 : r.px }}
                />
                <bdi dir="ltr" className="num text-small text-frost">
                  rounded-{r.id} · {r.px >= 999 ? "full" : `${r.px}px`}
                </bdi>
                <span className="text-small text-mist">{r.usage}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-7">
          <h3 lang="en" className="label-latin text-fog">Elevation · light, not shadow</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:gap-6">
            {shadows.map((s) => (
              <li key={s.id} className="flex flex-col gap-3">
                <div className="grid h-28 place-items-center rounded-md bg-steel" style={{ boxShadow: s.css }}>
                  <bdi dir="ltr" className="num text-small text-mist">
                    shadow-{s.id}
                  </bdi>
                </div>
                <span className="text-small text-mist">{s.usage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
