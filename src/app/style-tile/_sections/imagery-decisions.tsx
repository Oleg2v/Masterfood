import Image from "next/image";
import { GradedPhoto } from "@/components/ui/graded-photo";
import { Typeset } from "@/components/ui/typeset";
import { cliches, decisions } from "../_content";
import { photoSet } from "../_photos";
import { BiLabel, Container, Section } from "../_components/frame";
import { Materials } from "../_components/materials";

const trio = [
  { photo: photoSet.marbling, caption: "שיש של שומן, מקרוב" },
  { photo: photoSet.salmonFlesh, caption: "בשר סלמון, קווי השומן" },
  { photo: photoSet.crushedIce, caption: "קרח כתוש – האור, לא קישוט" },
] as const;

function Credit({ name, page }: { name: string; page?: string }) {
  return (
    <a
      href={page}
      className="text-small text-mist underline decoration-hairline underline-offset-4 transition-colors duration-fast ease-glide hover:text-frost hover:decoration-mist"
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
      en="Imagery · materials"
      he="רק החלבון חם"
      lede="צילומי מאקרו כהים של מוצר נא: שיש של שומן, בשר סלמון, קרח כתוש. בלי ידיים, בלי קרש עץ, בלי קישוט. טיפול צבע אחד מאחד צילומים מעדשות שונות: השחורים עולים לקרח עמוק, והחלבון לבדו שומר על החום."
    >
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {trio.map((s, i) => (
          <li key={s.photo.src} className={`flex flex-col gap-3 ${i === 1 ? "md:translate-y-12" : ""}`}>
            <GradedPhoto photo={s.photo} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[4/5] rounded-sm" />
            <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-small text-frost">{s.caption}</span>
              <Credit name={s.photo.photographer} page={s.photo.page} />
            </p>
          </li>
        ))}
      </ul>

      {/* The grade, before and after, on one photograph. */}
      <figure className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
            <Image src={photoSet.marbling.src} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <BiLabel en="Raw" he="המקור, כפי שצולם" />
        </div>
        <div className="flex flex-col gap-2">
          <GradedPhoto
            photo={{ ...photoSet.marbling, alt: "" }}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-[16/10] rounded-sm"
            vignette={false}
          />
          <BiLabel en="Graded · flesh" he="שחורים בקרח עמוק, שטיפת פלדה, הבשר נשאר חם" />
        </div>
      </figure>

      <div className="mt-12 flex flex-col gap-6">
        <BiLabel en="Materials" he="ארבעה חומרים של חדר הקירור" as="h3" />
        <Materials frostPhoto={photoSet.salmonFlesh} icePhoto={photoSet.lakeIce} />
      </div>
    </Section>
  );
}

export function DecisionsSection() {
  return (
    <Section
      id="decisions"
      index="08"
      en="Commitments"
      he="חמש החלטות, חמש קלישאות"
      lede="מה אנחנו מתחייבים לעשות עד הסוף, ומה לא ייכנס לפורטל בשום שלב."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
        <ol className="flex flex-col lg:col-span-7">
          {decisions.map((d, i) => (
            <li key={d.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-hairline py-6 sm:grid-cols-[4rem_1fr]">
              <bdi dir="ltr" className="num pt-2 text-small text-fog">
                0{i + 1}
              </bdi>
              <div className="flex flex-col gap-2">
                <h3 className="type-heading text-balance text-frost">{d.title}</h3>
                <p className="max-w-[60ch] text-body text-pretty text-mist">
                  <Typeset text={d.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <BiLabel en="Clichés we will not use" he="לא אצלנו" as="h3" />
          <ul className="flex flex-col">
            {cliches.map((c) => (
              <li key={c.title} className="flex flex-col gap-1 border-t border-hairline py-5">
                <p className="text-lead font-medium text-mist line-through decoration-salmon decoration-1">{c.title}</p>
                <p className="text-small text-pretty text-mist">
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
      <Container className="grid grid-cols-1 gap-6 text-small text-mist lg:grid-cols-12">
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
          ). צילומים: <span lang="en">Unsplash</span>, בקרדיט ליד כל תמונה.
        </p>
        <p className="lg:col-span-3 lg:text-end">
          <bdi dir="ltr" lang="en" className="num">
            Stage 0 · v0.1 · 6.11.2026
          </bdi>
        </p>
      </Container>
    </footer>
  );
}
