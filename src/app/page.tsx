import Link from "next/link";
import { DemoStrip } from "@/components/demo-badge";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-bar">
        <DemoStrip>
          <p className="hidden text-caption text-frost-2 sm:block">מחירי דמו · לפני מע״מ</p>
        </DemoStrip>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-3xl flex-col justify-center gap-6 px-4 py-24 outline-none">
        <p className="label-latin text-frost-3">
          <bdi dir="ltr" lang="en">
            Masterfood · Stage 0
          </bdi>
        </p>
        <h1 className="type-display text-balance text-frost">השוק של מחר</h1>
        <p className="text-data font-sans text-frost-2">המחירים של היום, מה שנחת הבוקר, וההזמנה למחר – בדקה.</p>
        <Link
          href="/style-tile"
          className="inline-flex h-12 w-fit items-center rounded-edge bg-frost px-5 text-body font-medium text-deep-ice shadow-rim transition-colors duration-hover ease-glide hover:bg-frost-hover active:bg-frost-press"
        >
          לסטייל־טייל
        </Link>
      </main>
    </>
  );
}
