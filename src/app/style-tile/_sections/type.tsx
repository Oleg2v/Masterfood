import { Fragment, type ReactNode } from "react";
import { StatusChip } from "@/components/ui/chip";
import { TrendGlyph } from "@/components/ui/icon";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { Typeset } from "@/components/ui/typeset";
import { BiLabel, Section } from "../_components/frame";
import { TypeScaleTable } from "../_components/type-scale-table";

const NB = " ";

/** Words that never part at a line end: a figure and its unit, or a prefix and its figure (כ־20). */
function NoBreak({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/**
 * A Latin label set from parts that never break inside ("Frank Ruhl Libre", "400 / 500 / 600"):
 * a long label wraps only after a separator, and the separator ends the line.
 */
function Parts({ parts }: { parts: readonly string[] }) {
  return parts.map((p, i) => (
    <Fragment key={p}>
      {i > 0 ? " " : null}
      <span className="whitespace-nowrap">{i < parts.length - 1 ? `${p}${NB}·` : p}</span>
    </Fragment>
  ));
}

const rules = [
  ["בלי ריווח אותיות בעברית", "ריווח רק לתוויות מונו לטיניות (OSL, HACCP). עברית נשארת בצפיפות שלה."],
  [
    "גרשיים אמיתיים",
    <>
      ק״ג עם ״ (<Num>U+05F4</Num>), לא מירכאות. ומקף עברי בצירוף מספר:{" "}
      <NoBreak>
        כ־<Num joined>20</Num>
      </NoBreak>
      .
    </>,
  ],
  [
    "כל מספר ב־bdi",
    <>
      מחיר, משקל, שעה וטמפרטורה{NB}– ריצת LTR מבודדת, כך ש־<Money joined value={62.9} /> לעולם לא מתהפך.
    </>,
  ],
  ["ספרות טבלאיות", "tabular-nums בכל עמודה, ואפס מנוקד של Plex Mono, כדי שהמספרים יעמדו בשורה כמו בלוח מסחר."],
  [
    "שורה של 1.6 לגוף",
    <>
      Heebo בגוף טקסט:{" "}
      <NoBreak>
        <Num>16</Num> פיקסל
      </NoBreak>{" "}
      לפחות, שורה של <Num>1.6</Num> שנצמדת לרשת של <Num>4</Num>, עד{" "}
      <NoBreak>
        <Num>68</Num> תווים
      </NoBreak>
      . עברית לעולם לא קטנה{" "}
      <NoBreak>
        מ־<Num joined>14</Num> פיקסל
      </NoBreak>
      .
    </>,
  ],
  [
    "קו מפריד, לא מינוס",
    <>
      במשפט: מילה{NB}– מילה, עם רווח משני צדי הקו ורווח קשיח לפניו. במספר שלילי: מינוס אמיתי, <Num>−0.8%</Num>.
    </>,
  ],
] as const satisfies readonly (readonly [string, ReactNode])[];

/** The marks a keyboard does not give, each drawn big in the face that sets it in the portal. */
const glyphs: { glyph: string; name: string; code: string; face: string; family: string[]; sample: ReactNode }[] = [
  { glyph: "״", name: "גרשיים", code: "U+05F4", face: "font-display font-light", family: ["Frank Ruhl", "Heebo"], sample: "ק״ג · מע״מ · מק״ט" },
  { glyph: "׳", name: "גרש", code: "U+05F3", face: "font-display font-light", family: ["Frank Ruhl", "Heebo"], sample: "מס׳ הזמנה" },
  {
    glyph: "־",
    name: "מקף",
    code: "U+05BE",
    face: "font-display font-light",
    family: ["Frank Ruhl", "Heebo"],
    sample: (
      <>
        <NoBreak>
          כ־<Num joined>20</Num>
        </NoBreak>{" "}
        ·{" "}
        <NoBreak>
          ב־<Num joined>14:00</Num>
        </NoBreak>
      </>
    ),
  },
  { glyph: "−", name: "מינוס", code: "U+2212", face: "font-mono", family: ["Plex Mono"], sample: <Num>−0.8%</Num> },
  { glyph: "–", name: "קו מפריד", code: "U+2013", face: "font-sans", family: ["Heebo", "Plex Mono"], sample: <Num>06:00–08:00</Num> },
  { glyph: "₪", name: "סימן השקל", code: "U+20AA", face: "font-sans", family: ["Heebo", "0.75em"], sample: <Money value={62.9} /> },
];

const trends = [
  { dir: "up", name: "עלייה" },
  { dir: "down", name: "ירידה" },
  { dir: "flat", name: "ללא שינוי" },
] as const;

/**
 * The glyph sheet, where the typesetting choices get locked: the Hebrew marks, the true minus,
 * the dash and the shekel, then what no loaded face contains (▲ ▼ = and the status lamps),
 * which is therefore drawn.
 */
function GlyphSheet() {
  const cell = "flex flex-col gap-3 bg-deep-ice p-4 sm:p-5";
  return (
    <div className="flex flex-col gap-4">
      <BiLabel as="h3" en="Glyph sheet" he="סימני דפוס" />
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-edge border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-6">
        {glyphs.map((g) => (
          <li key={g.code} className={cell}>
            <p className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="text-caption font-medium text-frost">{g.name}</span>
              <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
                {g.code}
              </bdi>
            </p>
            <span aria-hidden="true" className={`grid h-24 place-items-center text-headline leading-none text-frost ${g.face}`}>
              {g.glyph}
            </span>
            <p className="flex flex-col items-start gap-1">
              <span className="text-body text-frost-2">{g.sample}</span>
              <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
                <Parts parts={g.family} />
              </bdi>
            </p>
          </li>
        ))}
        <li className={`${cell} col-span-2 sm:col-span-3`}>
          <p className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="text-caption font-medium text-frost">חיצי מגמה</span>
            <span lang="en" className="label-latin text-frost-3">
              SVG
            </span>
          </p>
          <ul className="flex min-h-24 flex-wrap items-center gap-x-8 gap-y-3">
            {trends.map((t) => (
              <li key={t.dir} className="flex items-center gap-3">
                <span aria-hidden="true" className="text-section leading-none">
                  <TrendGlyph dir={t.dir} />
                </span>
                <span className="text-body text-frost-2">{t.name}</span>
              </li>
            ))}
          </ul>
          <p className="max-w-[60ch] text-caption text-pretty text-frost-2">
            אף אחד משלושת הגופנים לא מכיל אותם, ולכן הם מצוירים. תמיד בכפור 2 ותמיד לפני המספר: שינוי מחיר הוא מידע, לא
            חדשות טובות או רעות.
          </p>
        </li>
        <li className={`${cell} col-span-2 sm:col-span-3`}>
          <p className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="text-caption font-medium text-frost">נוריות סטטוס</span>
            <span lang="en" className="label-latin text-frost-3">
              CSS
            </span>
          </p>
          <div className="flex min-h-24 flex-wrap content-center items-center gap-2">
            <StatusChip status="transit" />
            <StatusChip status="landed" />
            <StatusChip status="release" />
            <StatusChip status="stock" />
          </div>
          <p className="max-w-[60ch] text-caption text-pretty text-frost-2">
            גם הנוריות מצוירות. הנורית מתמלאת ככל שהסחורה מתקרבת לקונה, מטבעת ריקה ועד עיגול מלא, כך שהסטטוס נקרא גם בלי
            צבע. רק ״במלאי״ ירוק.
          </p>
        </li>
      </ul>
    </div>
  );
}

export function TypeSection() {
  return (
    <Section
      id="type"
      index="02"
      en="Typography"
      he="סריף לשם הנתח, מונו לאמת"
      lede={
        <>
          שלושה גופנים, שני קולות. Frank Ruhl Libre בגדלים מונומנטליים לרגש, IBM Plex Mono לכל מספר{NB}– ו־Heebo לממשק
          השקט שביניהם. סולם של תשע דרגות, שגדל בהדרגה בין <Num>360</Num>{" "}
          <NoBreak>
            ל־<Num joined>1440</Num> פיקסל
          </NoBreak>
          .
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="flex flex-col justify-between gap-8 rounded-edge bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8 lg:col-span-6">
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 lang="en" className="label-latin text-frost-3">
              <bdi dir="ltr">
                <Parts parts={["Display", "Frank Ruhl Libre", "300–900"]} />
              </bdi>
            </h3>
            <span className="text-caption text-frost-2">כותרות, שמות נתחים, השעון</span>
          </header>
          {/* Step 5, not 6: the only step-6 line in view is the clock, in the scale below. */}
          <p className="type-headline text-frost">פיקנייה</p>
          <div className="flex flex-col gap-2">
            {/* The alef-bet in its two halves, א–כ and ל–ת: it breaks between them, never inside one. */}
            <p className="font-display text-title font-normal text-frost">
              <span className="whitespace-nowrap">אבגדהוזחטיכך</span>
              <wbr />
              <span className="whitespace-nowrap">למםנןסעפףצץקרשת</span>
            </p>
            <p className="font-display text-dish font-medium text-frost-2">
              אנטריקוט · סינטה · שייטל · <bdi dir="ltr">0123456789</bdi>
            </p>
          </div>
        </article>

        <div className="grid gap-6 lg:col-span-6">
          <article className="flex flex-col gap-6 rounded-edge bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 lang="en" className="label-latin text-frost-3">
                <bdi dir="ltr">
                  <Parts parts={["UI", "Heebo", "400 / 500 / 700"]} />
                </bdi>
              </h3>
              <span className="text-caption text-frost-2">ממשק, גוף, פקדים</span>
            </header>
            <div className="flex flex-col gap-2">
              <p className="text-title font-medium text-frost">הוספה להזמנה</p>
              <p className="text-body text-frost">
                <span className="font-normal">כמו ביום חמישי שעבר</span> ·{" "}
                <span className="font-medium">חלון אספקה למחר</span> · <span className="font-bold">שליחה</span>
              </p>
              <p className="max-w-[60ch] text-body text-frost-2">
                מוצרים במשקל משתנה יחויבו לפי שקילה בפועל. החשבונית מציגה שתי עמודות: משוער ובפועל.
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-6 rounded-edge bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 lang="en" className="label-latin text-frost-3">
                <bdi dir="ltr">
                  <Parts parts={["Data", "IBM Plex Mono", "400 / 500 / 600"]} />
                </bdi>
              </h3>
              <span className="text-caption text-frost-2">מחיר, משקל, שעה, טמפרטורה</span>
            </header>
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-frost">
              <Money value={62.9} className="text-section font-medium" />
              <span className="text-body whitespace-nowrap">
                <bdi dir="ltr" className="num">
                  312
                </bdi>{" "}
                <span className="text-frost-2">ק״ג</span>
              </span>
              <bdi dir="ltr" className="num text-data text-ice">
                1.8°
              </bdi>
              <bdi dir="ltr" className="num text-data">
                05:40
              </bdi>
            </div>
            <p lang="en" className="label-latin text-frost-2">
              <bdi dir="ltr">
                <Parts parts={["OSL–TLV", "RTM–ASH", "HACCP", "ISO 9001", "0123456789"]} />
              </bdi>
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
              <p className="text-body font-medium text-frost">
                <Typeset text={title} />
              </p>
              <p className="text-caption text-frost-2">{body}</p>
            </li>
          ))}
        </ul>
      </div>

      <GlyphSheet />
    </Section>
  );
}
