import Link from "next/link";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-4 py-24">
      <p className="label-latin text-fog">Masterfood · Stage 0</p>
      <h1 className="type-display text-balance">השוק של מחר</h1>
      <p className="type-lead text-mist">המחירים של היום, מה שנחת הבוקר, וההזמנה למחר – בדקה.</p>
      <Link href="/style-tile" className="type-body w-fit rounded-sm bg-frost px-5 py-3 font-medium text-deep-ice">
        לסטייל־טייל
      </Link>
    </main>
  );
}
