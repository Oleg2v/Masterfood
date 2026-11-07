import { DemoStrip } from "@/components/demo-badge";
import { MotionToggle } from "@/components/motion-toggle";
import { RailHeight } from "@/components/rail-height";
import { Num } from "@/components/ui/num";
import { Typeset } from "@/components/ui/typeset";
import { hebrewDateline } from "@/lib/hebrew-date";
import { concept } from "../_content";
import { BriefBoard } from "../_components/brief-board";
import { CountdownSpecimen } from "../_components/countdown-specimen";
import { CoverGlass } from "../_components/cover-glass";
import { BiLabel, Container, LabelParts } from "../_components/frame";

const nav = [
  ["palette", "01", "פלטה"],
  ["type", "02", "אותיות"],
  ["space", "03", "מרווח"],
  ["surface", "04", "רדיוס וצל"],
  ["motion", "05", "תנועה"],
  ["components", "06", "רכיבים"],
  ["imagery", "07", "צילום ומפה"],
  ["decisions", "08", "החלטות"],
] as const;

/**
 * The top rail: the demo disclaimer and "מחירי דמו" (at every width), then the brand, the contents
 * and "עצירת אנימציה". Opaque and sticky, nothing floats (.rail in globals.css; on a short screen
 * only the bar stays). It publishes its height, so focus and anchors always land clear of it.
 */
export function TopBar() {
  return (
    <header className="rail">
      <RailHeight />
      <DemoStrip>
        <p className="text-caption text-frost-2">מחירי דמו · לפני מע״מ</p>
      </DemoStrip>
      <div className="border-b border-hairline bg-deep-ice">
        <Container className="flex h-14 items-center justify-between gap-6">
          <a href="#top" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-hair">
            <span className="font-display text-dish font-medium leading-none text-frost">מאסטרפוד</span>
            <span className="hidden text-caption text-frost-2 sm:inline">השוק של מחר</span>
          </a>
          <nav aria-label="תוכן לוח הסגנון" className="hidden min-w-0 xl:block">
            <ol className="flex items-center gap-1">
              {nav.map(([id, n, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex h-10 items-center gap-1.5 rounded-edge px-2.5 text-caption text-frost-2 transition-colors duration-hover ease-glide hover:bg-steel hover:text-frost"
                  >
                    <bdi dir="ltr" className="num text-micro text-frost-3">
                      {n}
                    </bdi>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <MotionToggle className="shrink-0" />
        </Container>
      </div>
    </header>
  );
}

/**
 * 01 · The cover. Everything hangs from one rule: "השוק של מחר" at inline-start,
 * the cutoff clock (the one giant) in the inline-end corner. Beneath them the
 * concept in three columns, the display-case glass, and the brief's board lines.
 */
export function Masthead() {
  // The demo morning is a Thursday (09:47, cutoff 14:00): "למחר" is Friday, never Shabbat.
  const date = hebrewDateline(new Date("2026-11-05T09:47:27+02:00"));
  return (
    <section id="top" aria-labelledby="tile-title" className="pt-8 pb-16 sm:pt-12 sm:pb-24">
      <Container className="flex flex-col gap-16 sm:gap-24">
        <div className="flex flex-col gap-8 sm:gap-10">
          {/* the folio above the first rule, like a newspaper's dateline */}
          <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-caption text-frost-2">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>{date.weekday}</span>
              <span aria-hidden="true" className="text-frost-3">
                ·
              </span>
              <span>{date.hebrew}</span>
              <span aria-hidden="true" className="text-frost-3">
                ·
              </span>
              <bdi dir="ltr" className="num">
                {date.civil}
              </bdi>
            </span>
            <bdi dir="ltr" lang="en" className="label-latin text-balance text-frost-3">
              <LabelParts text="Stage 0 · Art direction · Style tile" />
            </bdi>
          </p>

          <div className="cover-grid border-t border-hairline">
            <div className="flex flex-col gap-6 [grid-area:head]">
              <h1 id="tile-title" className="type-headline hang-headline text-balance text-frost max-md:font-normal">
                השוק של מחר
              </h1>
              <p className="max-w-[30ch] text-data font-sans text-pretty text-frost-2">
                המחירים של היום, מה שנחת הבוקר, וההזמנה למחר – בדקה.
              </p>
            </div>
            <div className="[grid-area:clock] xl:max-w-[calc(var(--text-display)*4.8)] xl:justify-self-end">
              <CountdownSpecimen />
            </div>
            <div className="flex flex-col gap-4 [grid-area:concept]">
              <BiLabel as="h2" en="The concept in three lines" he="הרעיון בשלוש שורות" />
              <ol className="grid grid-cols-1 border-t border-hairline lg:grid-cols-3 lg:gap-x-6">
                {concept.map((line, i) => (
                  <li key={i} className="flex flex-col gap-2 border-b border-hairline py-5 lg:border-b-0">
                    {/* self-start: the LTR numeral shrinks to its digits at the column's start (right) edge */}
                    <bdi dir="ltr" className="num self-start text-micro text-frost-3">
                      0{i + 1}
                    </bdi>
                    <p className="max-w-[46ch] text-body text-pretty text-frost">
                      <Typeset text={line} />
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <CoverGlass />

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <BiLabel as="h2" en="The board · the brief's three lines" he="שלוש השורות מהבריף, בעמודות" />
            <p className="max-w-[60ch] text-caption text-pretty text-frost-2">
              כל שורה בנויה משדות נפרדים, ולכל שדה סוג וכיוון משלו: המילים העבריות <span className="whitespace-nowrap">אות־אות</span>, המספרים{" "}
              <span className="whitespace-nowrap">ספרה־ספרה</span>,
              והיחידות בראש העמודה. <span className="whitespace-nowrap">
                בשלב <Num>0</Num>
              </span>{" "}
              הלוח סטטי;{" "}
              <span className="whitespace-nowrap">
                בשלב <Num>1</Num>
              </span>{" "}
              התאים מדפדפים, מימין לשמאל.
            </p>
          </div>
          <BriefBoard />
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6 text-caption sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <dt className="text-frost-3">לקוח</dt>
            <dd className="text-frost">מאסטרפוד · חולון</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-frost-3">שלב</dt>
            <dd className="text-frost">
              <bdi dir="ltr" className="num">
                0
              </bdi>{" "}
              · כיוון אמנותי
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-frost-3">גרסה</dt>
            <dd className="text-frost">
              <bdi dir="ltr" lang="en" className="num">
                v0.2 · 6.11.2026
              </bdi>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-frost-3">מצב</dt>
            <dd className="flex items-center gap-2 text-frost">
              <span aria-hidden="true" className="size-2 rounded-full inset-ring-[1.5px] inset-ring-frost-2" />
              ממתין לאישור
            </dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
