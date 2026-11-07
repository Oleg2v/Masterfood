import { Fragment, type ReactNode } from "react";
import { StatusChip } from "@/components/ui/chip";
import { TrendGlyph } from "@/components/ui/icon";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { Typeset } from "@/components/ui/typeset";
import { BiLabel, LabelParts, Section } from "../_components/frame";
import { TypeScaleTable } from "../_components/type-scale-table";

const NB = " ";

/** Words that never part at a line end: a figure and its unit, or a prefix and its figure (כ־20). */
function NoBreak({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
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

/** A face as the portal sets it: Frank Ruhl Libre light at display sizes, Heebo for text, Plex Mono 500 for figures. */
type Face = { name: string; className: string };
const FRANK: Face = { name: "Frank Ruhl", className: "font-display font-light" };
const HEEBO: Face = { name: "Heebo", className: "font-sans" };
const PLEX: Face = { name: "Plex Mono", className: "font-mono font-medium" };

/** The marks a keyboard does not give, each drawn in every face that sets it in the portal. */
const glyphs: { glyph: string; name: string; code: string; faces: readonly Face[]; sample: ReactNode }[] = [
  { glyph: "״", name: "גרשיים", code: "U+05F4", faces: [FRANK, HEEBO], sample: "ק״ג · מע״מ · מק״ט" },
  { glyph: "׳", name: "גרש", code: "U+05F3", faces: [FRANK, HEEBO], sample: "מס׳ הזמנה" },
  {
    glyph: "־",
    name: "מקף",
    code: "U+05BE",
    faces: [FRANK, HEEBO],
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
  { glyph: "−", name: "מינוס", code: "U+2212", faces: [PLEX], sample: <Num>−0.8%</Num> },
  { glyph: "–", name: "קו מפריד", code: "U+2013", faces: [HEEBO, PLEX], sample: <Num>06:00–08:00</Num> },
  // One shekel only: Heebo 500 at 0.75em of the figure it leads. Plex Mono's own sign is a full cell and shouts.
  { glyph: "₪", name: "סימן השקל", code: "U+20AA", faces: [{ name: "Heebo · 0.75em", className: "font-sans font-medium" }], sample: <Money value={62.9} /> },
];

const trends = [
  { dir: "up", name: "עלייה" },
  { dir: "down", name: "ירידה" },
  { dir: "flat", name: "ללא שינוי" },
] as const;

/**
 * The glyph sheet, where the typesetting choices get locked: the Hebrew marks, the true minus,
 * the dash and the shekel, each in every face that sets it, then the marks that are drawn: ▲ and ▼
 * are in no loaded face, so the three trend marks (with =, to match their weight) and the status
 * lamps are SVG and CSS.
 *
 * Three marks to a row until xl, so two faces and their names always fit side by side in a cell
 * (down to a 360px phone); six to a row from xl.
 */
function GlyphSheet() {
  const cell = "flex flex-col gap-3 bg-deep-ice p-4 sm:p-5";
  return (
    <div className="flex flex-col gap-4">
      <BiLabel as="h3" en="Glyph sheet" he="סימני דפוס" />
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-edge border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-6">
        {glyphs.map((g) => (
          <li key={g.code} className={`${cell} lg:col-span-2 xl:col-span-1`}>
            <p className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="text-caption font-medium text-frost">{g.name}</span>
              <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
                {g.code}
              </bdi>
            </p>
            {/* The mark once per face, on one shared baseline, each over its face's name; the first face is on the right. */}
            <div className="grid h-28 grid-flow-col grid-rows-[auto_auto] place-content-center items-baseline justify-items-center gap-x-3 gap-y-2 min-[375px]:gap-x-4 sm:gap-x-6">
              {g.faces.map((f) => (
                <Fragment key={f.name}>
                  <span aria-hidden="true" className={`text-headline leading-none text-frost ${f.className}`}>
                    {g.glyph}
                  </span>
                  <bdi dir="ltr" lang="en" className="label-latin whitespace-nowrap text-frost-3">
                    {f.name}
                  </bdi>
                </Fragment>
              ))}
            </div>
            <p className="text-body text-frost-2">{g.sample}</p>
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
            המשולשים ▲ ו־▼ חסרים בשלושת הגופנים, ולכן שלושת הסימנים מצוירים יחד, באותו משקל. תמיד בכפור 2 ותמיד לפני
            המספר: שינוי מחיר הוא מידע, לא חדשות טובות או רעות.
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
            <h3 lang="en" className="label-latin text-balance text-frost-3">
              <bdi dir="ltr">
                <LabelParts text="Display · Frank Ruhl Libre · 300–900" />
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
              אנטריקוט · סינטה · שייטל · <bdi dir="ltr">0123456789</bdi>
            </p>
          </div>
        </article>

        <div className="grid gap-6 lg:col-span-6">
          <article className="flex flex-col gap-6 rounded-edge bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 lang="en" className="label-latin text-balance text-frost-3">
                <bdi dir="ltr">
                  <LabelParts text="UI · Heebo · 400 / 500 / 700" />
                </bdi>
              </h3>
              <span className="text-caption text-frost-2">ממשק, גוף, פקדים</span>
            </header>
            <div className="flex flex-col gap-2">
              <p className="text-title font-medium text-frost">הוספה להזמנה</p>
              {/* The three weights, each kept whole: the line breaks only after a "·", and balances, so the last never stands alone. */}
              <p className="text-body text-balance text-frost">
                <span className="whitespace-nowrap">
                  <span className="font-normal">כמו ביום חמישי שעבר</span>
                  {NB}·
                </span>{" "}
                <span className="whitespace-nowrap">
                  <span className="font-medium">חלון אספקה למחר</span>
                  {NB}·
                </span>{" "}
                <span className="font-bold">שליחה</span>
              </p>
              <p className="max-w-[60ch] text-body text-frost-2">
                מוצרים במשקל משתנה יחויבו לפי שקילה בפועל. החשבונית מציגה שתי עמודות: ״משוער״ ו״בפועל״.
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-6 rounded-edge bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 lang="en" className="label-latin text-balance text-frost-3">
                <bdi dir="ltr">
                  <LabelParts text="Data · IBM Plex Mono · 400 / 500 / 600" />
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
            <p lang="en" className="label-latin text-balance text-frost-2">
              <bdi dir="ltr">
                <LabelParts text="OSL–TLV · RTM–ASH · HACCP · ISO 9001 · 0123456789" />
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
