import Image from "next/image";
import { GradedPhoto, type Photo } from "@/components/ui/graded-photo";
import { cliches, decisions, photos } from "../_content";
import { Container, Section } from "../_components/frame";

const imageryOrder: { key: keyof typeof photos; caption: string }[] = [
  { key: "marbling", caption: "שומן תוך־שרירי, מקרוב" },
  { key: "salmon", caption: "בשר סלמון, קווי השומן" },
  { key: "ice", caption: "קרח כתוש, בלי שלג מצויר" },
];

export function ImagerySection() {
  const shots = imageryOrder.map((o) => ({ ...o, photo: photos[o.key] })).filter((o): o is typeof o & { photo: Photo } => Boolean(o.photo));
  const first = shots[0];
  return (
    <Section
      id="imagery"
      index="07"
      en="Imagery · cold grade"
      he="דירוג קר, בשר חם"
      lede="צילומי מאקרו כהים: שיש של שומן, בשר סלמון, קרח כתוש. טיפול צבע אחד מאחד צילומים מעדשות שונות – השחורים עולים לקרח עמוק, והחלבון לבדו שומר על החום."
    >
      {shots.length ? (
        <>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {shots.map((s, i) => (
              <li key={s.key} className="flex flex-col gap-3">
                <GradedPhoto
                  photo={s.photo}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={`aspect-[4/5] rounded-sm ${i === 1 ? "md:translate-y-12" : ""}`}
                />
                <p className={`flex items-baseline justify-between gap-3 text-small ${i === 1 ? "md:translate-y-12" : ""}`}>
                  <span className="text-frost">{s.caption}</span>
                  <a href={s.photo.page} className="text-mist underline decoration-hairline underline-offset-4 hover:decoration-mist">
                    צילום: <bdi dir="ltr">{s.photo.photographer}</bdi> / Unsplash
                  </a>
                </p>
              </li>
            ))}
          </ul>
          {first ? (
            <figure className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                  <Image src={first.photo.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <span className="label-latin text-fog">Raw</span>
              </div>
              <div className="flex flex-col gap-2">
                <GradedPhoto photo={{ ...first.photo, alt: "" }} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10] rounded-sm" />
                <span className="label-latin text-fog">Graded · lighten Deep Ice · soft-light steel · vignette</span>
              </div>
            </figure>
          ) : null}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {imageryOrder.map((o) => (
            <div key={o.key} className="flex flex-col gap-3">
              <div className="fog relative aspect-[4/5] overflow-hidden rounded-sm" />
              <p className="text-small text-mist">{o.caption}</p>
            </div>
          ))}
        </div>
      )}
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
                <h3 className="type-heading text-frost">{d.title}</h3>
                <p className="max-w-[60ch] text-body text-mist">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <h3 className="label-latin text-fog">Clichés we will not use · לא אצלנו</h3>
          <ul className="flex flex-col">
            {cliches.map((c) => (
              <li key={c.title} className="flex flex-col gap-1 border-t border-hairline py-5">
                <p className="text-lead font-medium text-mist line-through decoration-salmon decoration-1">{c.title}</p>
                <p className="text-small text-mist">{c.instead}</p>
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
        <p className="lg:col-span-5">
          קונספט של <span lang="en">Kikkey</span> – לא האתר הרשמי של מאסטרפוד. כל המחירים, הכמויות והזמנים בעמוד הם
          מחירי דמו.
        </p>
        <p className="lg:col-span-4">
          גופנים: <bdi dir="ltr">Frank Ruhl Libre, Heebo, IBM Plex Mono</bdi> (רישיון <bdi dir="ltr">SIL OFL</bdi>). צילומים:
          Unsplash, בקרדיט ליד כל תמונה.
        </p>
        <p className="lg:col-span-3 lg:text-end">
          <bdi dir="ltr" className="num">
            Stage 0 · v0.1 · 06.11.2026
          </bdi>
        </p>
      </Container>
    </footer>
  );
}
