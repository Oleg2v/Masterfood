import { Money } from "@/components/ui/money";
import { BiLabel, Section } from "../_components/frame";
import { TypeScaleTable } from "../_components/type-scale-table";

const rules = [
  ["בלי ריווח אותיות בעברית", "ריווח רק לתוויות מונו לטיניות (OSL, HACCP). עברית נשארת בצפיפות שלה."],
  ["גרשיים אמיתיים", "ק״ג עם ״ (U+05F4), לא מירכאות. ומקף עברי בצירוף מספר: כ־20."],
  ["כל מספר ב־bdi", <>מחיר, משקל, שעה וטמפרטורה – ריצת LTR מבודדת, כך ש־<Money joined value={62.9} /> לעולם לא מתהפך.</>],
  ["ספרות טבלאיות", "tabular-nums בכל עמודה, ואפס מנוקד של Plex Mono, כדי שהמספרים יעמדו בשורה כמו בלוח מסחר."],
  ["שורה של 1.6 לגוף", "Heebo בגוף טקסט: 16 פיקסל לפחות, שורה 1.6 שנצמדת לרשת של 4, עד 68 תווים. עברית לעולם לא קטנה מ־14."],
  ["קו מפריד, לא מינוס", "רווח–קו מפריד–רווח (–) במשפט, מינוס אמיתי (−) במספרים שליליים."],
] as const satisfies readonly (readonly [string, React.ReactNode])[];

export function TypeSection() {
  return (
    <Section
      id="type"
      index="02"
      en="Typography"
      he="סריף לשם הנתח, מונו לאמת"
      lede="שלושה גופנים, שני קולות. Frank Ruhl Libre בגדלים מונומנטליים לרגש, IBM Plex Mono לכל מספר – ו־Heebo לממשק השקט שביניהם. סולם של תשעה צעדים, נוזלי בין 360 ל־1440 פיקסל."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="flex flex-col justify-between gap-8 rounded-md bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8 lg:col-span-6">
          <header className="flex items-baseline justify-between gap-4">
            <h3 className="label-latin text-fog">
              <bdi dir="ltr" lang="en">Display · Frank Ruhl Libre · 300–900</bdi>
            </h3>
            <span className="text-small text-mist">כותרות, שמות נתחים, השעון</span>
          </header>
          <p className="type-monument text-frost">פיקנייה</p>
          <div className="flex flex-col gap-2">
            <p className="font-display text-heading font-normal text-frost [overflow-wrap:anywhere]">אבגדהוזחטיכךלמםנןסעפףצץקרשת</p>
            <p className="font-display text-title font-medium text-mist">
              אנטריקוט · סינטה · שייטל · <bdi dir="ltr">0123456789</bdi>
            </p>
          </div>
        </article>

        <div className="grid gap-6 lg:col-span-6">
          <article className="flex flex-col gap-6 rounded-md bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
            <header className="flex items-baseline justify-between gap-4">
              <h3 className="label-latin text-fog">
                <bdi dir="ltr" lang="en">UI · Heebo · 400 / 500 / 700</bdi>
              </h3>
              <span className="text-small text-mist">ממשק, גוף, פקדים</span>
            </header>
            <div className="flex flex-col gap-2">
              <p className="text-heading font-medium text-frost">הוספה להזמנה</p>
              <p className="text-lead text-frost">
                <span className="font-normal">כמו ביום חמישי שעבר</span> ·{" "}
                <span className="font-medium">חלון אספקה למחר</span> · <span className="font-bold">שליחה</span>
              </p>
              <p className="max-w-[60ch] text-body text-mist">
                מוצרים במשקל משתנה יחויבו לפי שקילה בפועל. החשבונית מציגה שתי עמודות: משוער ובפועל.
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-6 rounded-md bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
            <header className="flex items-baseline justify-between gap-4">
              <h3 className="label-latin text-fog">
                <bdi dir="ltr" lang="en">Data · IBM Plex Mono · 400 / 500 / 600</bdi>
              </h3>
              <span className="text-small text-mist">מחיר, משקל, שעה, טמפרטורה</span>
            </header>
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-frost">
              <Money value={62.9} className="text-headline font-medium" />
              <span className="text-lead">
                <bdi dir="ltr" className="num">312</bdi> <span className="text-mist">ק״ג</span>
              </span>
              <bdi dir="ltr" className="num text-lead text-ice">
                1.8°
              </bdi>
              <bdi dir="ltr" className="num text-lead">
                05:40
              </bdi>
            </div>
            <p className="label-latin text-mist">
              <bdi dir="ltr" lang="en">OSL–TLV · RTM–ASH · HACCP · ISO 9001 · 0123456789</bdi>
            </p>
          </article>
        </div>
      </div>

      <TypeScaleTable />

      <div className="flex flex-col gap-4">
        <BiLabel as="h3" en="Hebrew typesetting rules" he="כללי סדר" />
        <ul className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map(([title, body]) => (
            <li key={title} className="flex flex-col gap-1 border-t border-hairline py-4">
              <p className="text-body font-medium text-frost">{title}</p>
              <p className="text-small text-mist">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
