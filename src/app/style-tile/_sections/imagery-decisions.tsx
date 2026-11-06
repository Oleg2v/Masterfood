import Image from "next/image";
import { GradedPhoto } from "@/components/ui/graded-photo";
import { Num } from "@/components/ui/num";
import { Typeset } from "@/components/ui/typeset";
import { cliches, decisions } from "../_content";
import { photoSet } from "../_photos";
import { BiLabel, Container, Plate, Section } from "../_components/frame";
import { CutMapSpecimen } from "../_components/cut-map-specimen";
import { Materials } from "../_components/materials";

const trio = [
  { photo: photoSet.marbling, caption: "שיש של שומן: הבשר נוחת על הבורדו" },
  { photo: photoSet.salmonFlesh, caption: "בשר סלמון: נוחת על צבע הסלמון" },
  { photo: photoSet.mackerelIce, caption: "דג שלם על קרח כתוש: העור מתקרר לכסף" },
] as const;

function Credit({ name, page }: { name: string; page?: string }) {
  return (
    <a
      href={page}
      className="text-caption text-frost-2 underline decoration-hairline underline-offset-4 transition-colors duration-hover ease-glide hover:text-frost hover:decoration-frost-2"
    >
      צילום: <bdi dir="ltr" lang="en">{name}</bdi> / <span lang="en">Unsplash</span>
    </a>
  );
}

export function ImagerySection() {
  return (
    <Section
      id="imagery"
      index="07"
      en="Imagery · materials · map"
      he="רק החלבון חם"
      lede="צילומי מאקרו כהים של מוצר נא: שיש של שומן, בשר סלמון, דג על קרח כתוש. בלי ידיים, בלי קרש עץ, בלי קישוט. דירוג אחד מאחד צילומים מעדשות שונות: השחורים נוחתים על קרח עמוק, והחלבון לבדו שומר על החום. ובמקום פרה מצוירת – תחריט."
    >
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {trio.map((s, i) => (
          <li key={s.photo.src} className={`flex flex-col gap-3 ${i === 1 ? "md:translate-y-12" : ""}`}>
            <GradedPhoto photo={s.photo} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[4/5] rounded-edge" />
            <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-caption text-frost">{s.caption}</span>
              <Credit name={s.photo.photographer} page={s.photo.page} />
            </p>
          </li>
        ))}
      </ul>

      {/* The grade, before and after, on one photograph. */}
      <figure className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-edge">
            <Image src={photoSet.marbling.src} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <BiLabel en="Raw" he="המקור, כפי שצולם" />
        </div>
        <div className="flex flex-col gap-2">
          <GradedPhoto
            photo={{ ...photoSet.marbling, alt: "" }}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-[16/10] rounded-edge"
            vignette={false}
          />
          <BiLabel en="Graded · flesh" he="שחורים בקרח עמוק, שטיפת פלדה, הבשר נשאר חם" />
        </div>
      </figure>

      <div className="mt-12 flex flex-col gap-6">
        <BiLabel en="Materials" he="ארבעה חומרים של חדר הקירור" as="h3" />
        <Materials icePhoto={photoSet.lakeIce} />
      </div>

      <Plate
        id="cut-map"
        className="mt-12"
        title="מפת נתחים בתחריט"
        en="Cut map · engraved specimen"
        note={
          <>
            התוויות המסודרות הן הפקדים: כפתורי רדיו בגובה{" "}
            <span className="whitespace-nowrap">
              <Num>48</Num> פיקסל
            </span>
            , חיצי המקלדת עוברים ביניהם, ונגיעה באזור בוחרת את אותה תווית. הבחירה צובעת את האזור בבורדו, מוסיפה קו מתאר
            בהיר ומותחת קו מוביל אל שם הנתח.
          </>
        }
      >
        <CutMapSpecimen />
      </Plate>
    </Section>
  );
}

function Arrow() {
  // forward in a Hebrew line points inline-end (left); no loaded font has "←"
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" className="shrink-0 text-frost-3">
      <path d="M13 5H1.5M5 1.5 1.5 5 5 8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function DecisionsSection() {
  return (
    <Section
      id="decisions"
      index="08"
      en="On the menu · off the menu"
      he="בתפריט, ולא בתפריט"
      lede="חמש החלטות שנעשה עד הסוף, וכל אחת מהן כבר נראית בעמוד הזה; וחמש קלישאות שלא ייכנסו לפורטל בשום שלב."
    >
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-12 xl:gap-6">
        <div className="flex flex-col gap-4 xl:col-span-7">
          <BiLabel as="h3" en="Five decisions" he="בתפריט" />
          <ol className="flex flex-col">
            {decisions.map((d, i) => (
              <li key={d.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-hairline py-8 sm:grid-cols-[4rem_1fr]">
                <bdi dir="ltr" className="num pt-3 text-micro text-frost-3">
                  0{i + 1}
                </bdi>
                <div className="flex flex-col gap-3">
                  <h4 className="type-title text-balance text-frost">{d.title}</h4>
                  <p className="max-w-[62ch] text-body text-pretty text-frost-2">
                    <Typeset text={d.body} />
                  </p>
                  <p className="max-w-[62ch] border-s-2 border-edge ps-3 text-caption text-pretty text-frost">
                    <span className="font-medium text-frost-3">בעמוד הזה · </span>
                    <Typeset text={d.tile} />{" "}
                    <a
                      href={d.href}
                      className="whitespace-nowrap text-frost-2 underline decoration-hairline underline-offset-4 transition-colors duration-hover ease-glide hover:text-frost hover:decoration-frost-2"
                    >
                      מעבר לדוגמה
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-4 xl:col-span-5">
          <BiLabel as="h3" en="Five clichés" he="לא בתפריט" />
          <ul className="flex flex-col">
            {cliches.map((c) => (
              <li key={c.title} className="flex flex-col gap-3 border-t border-hairline py-6">
                <h4 className="text-body font-medium text-frost line-through decoration-frost-3 decoration-1">{c.title}</h4>
                <p className="text-caption text-pretty text-frost-2">
                  <Typeset text={c.what} />
                </p>
                {c.pairs ? (
                  <ul className="flex flex-wrap gap-2" aria-label="דוגמאות: שגוי, ואחריו נכון">
                    {c.pairs.map((p) => (
                      <li key={p.wrong} className="inline-flex h-8 items-center gap-2 rounded-hair px-2.5 text-caption inset-ring inset-ring-hairline">
                        <del className="text-frost-3 decoration-frost-3">
                          {p.ltr ? (
                            <bdi dir="ltr" className="num">
                              {p.wrong}
                            </bdi>
                          ) : (
                            <Typeset text={p.wrong} />
                          )}
                        </del>
                        <Arrow />
                        <ins className="text-frost no-underline">
                          {p.ltr ? (
                            <bdi dir="ltr" className="num">
                              {p.right}
                            </bdi>
                          ) : (
                            <Typeset text={p.right} />
                          )}
                        </ins>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="text-caption text-pretty text-frost-2">
                  <span className="font-medium text-frost-3">למה לא · </span>
                  <Typeset text={c.why} />
                </p>
                <p className="text-body text-pretty text-frost">
                  <span className="font-medium text-frost-3">במקום · </span>
                  <Typeset text={c.instead} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function TileFooter() {
  return (
    <footer className="border-t border-hairline py-12 pb-28">
      <Container className="grid grid-cols-1 gap-6 text-caption text-frost-2 lg:grid-cols-12">
        <p className="text-pretty lg:col-span-5">
          קונספט של <span lang="en">Kikkey</span> – לא האתר הרשמי של מאסטרפוד. כל המחירים, הכמויות והזמנים בעמוד הם נתוני
          דמו; המחירים לפני מע״מ.
        </p>
        <p className="text-pretty lg:col-span-4">
          גופנים:{" "}
          <bdi dir="ltr" lang="en">
            Frank Ruhl Libre, Heebo, IBM Plex Mono
          </bdi>{" "}
          (רישיון{" "}
          <bdi dir="ltr" lang="en">
            SIL OFL
          </bdi>
          ). צילומים: <span lang="en">Unsplash</span>, בקרדיט ליד כל תמונה. הצהרת נגישות ושם רכז הנגישות יפורסמו עם הפורטל, בשלב{" "}
          <bdi dir="ltr" className="num">
            1
          </bdi>
          .
        </p>
        <p className="lg:col-span-3 lg:text-end">
          <bdi dir="ltr" lang="en" className="num">
            Stage 0 · v0.2 · 6.11.2026
          </bdi>
        </p>
      </Container>
    </footer>
  );
}
