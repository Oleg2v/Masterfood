import { MotionToggle } from "@/components/motion-toggle";
import { hebrewDateline } from "@/lib/hebrew-date";
import { concept } from "../_content";
import { CountdownSpecimen } from "../_components/countdown-specimen";
import { BiLabel, Container } from "../_components/frame";

const nav = [
  ["palette", "01", "פלטה"],
  ["type", "02", "טיפוגרפיה"],
  ["space", "03", "מרווח"],
  ["surface", "04", "רדיוס וצל"],
  ["motion", "05", "תנועה"],
  ["components", "06", "רכיבים"],
  ["imagery", "07", "צילום"],
  ["decisions", "08", "החלטות"],
] as const;

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-deep-ice/95">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xs">
          <span className="font-display text-title font-medium leading-none text-frost">מאסטרפוד</span>
          <span className="hidden text-small text-mist sm:inline">השוק של מחר</span>
        </a>
        <nav aria-label="תוכן הסטייל־טייל" className="hidden min-w-0 lg:block">
          <ol className="flex items-center gap-1">
            {nav.map(([id, n, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex h-10 items-center gap-1.5 rounded-sm px-2.5 text-small text-mist transition-colors duration-fast ease-glide hover:bg-steel hover:text-frost"
                >
                  <bdi dir="ltr" className="num text-micro text-fog">
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
    </header>
  );
}

export function Masthead() {
  // The demo morning is a Thursday (09:47, cutoff 14:00): "למחר" is Friday, never Shabbat.
  const date = hebrewDateline(new Date("2026-11-05T09:47:27+02:00"));
  return (
    <section id="top" aria-labelledby="tile-title" className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Container className="flex flex-col gap-12 sm:gap-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-small text-mist">
              <span>{date.weekday}</span>
              <span aria-hidden="true" className="text-fog">·</span>
              <span>{date.hebrew}</span>
              <span aria-hidden="true" className="text-fog">·</span>
              <bdi dir="ltr" className="num">{date.civil}</bdi>
            </p>
            <h1 id="tile-title" className="type-display text-balance text-frost">
              השוק של מחר
            </h1>
            <p className="type-lead max-w-[34ch] text-pretty text-mist">
              המחירים של היום, מה שנחת הבוקר, וההזמנה למחר – בדקה.
            </p>
          </div>
          <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-3 self-end border-t border-hairline pt-4 text-small lg:col-span-4 lg:grid-cols-[auto_1fr]">
            <dt className="text-fog">לקוח</dt>
            <dd className="text-frost">מאסטרפוד · חולון</dd>
            <dt className="text-fog">שלב</dt>
            <dd className="text-frost">
              <bdi dir="ltr" className="num">0</bdi> · כיוון אמנותי
            </dd>
            <dt className="text-fog">גרסה</dt>
            <dd className="text-frost">
              <bdi dir="ltr" lang="en" className="num">v0.1 · 6.11.2026</bdi>
            </dd>
            <dt className="text-fog">מצב</dt>
            <dd className="flex items-center gap-2 text-frost">
              <span aria-hidden="true" className="size-2 rounded-full bg-salmon" />
              ממתין לאישור
            </dd>
          </dl>
        </div>

        <div className="grid grid-cols-1 gap-12 border-t border-hairline pt-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <CountdownSpecimen />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <BiLabel as="h2" en="The concept in three lines" he="הרעיון בשלוש שורות" />
            <ol className="flex flex-col">
              {concept.map((line, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-hairline py-4 first:border-t">
                  <bdi dir="ltr" className="num pt-1 text-small text-fog">
                    0{i + 1}
                  </bdi>
                  <p className="text-lead text-pretty text-frost">{line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
