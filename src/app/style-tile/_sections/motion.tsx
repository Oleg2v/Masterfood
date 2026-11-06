import { durations } from "@/design/tokens";
import { MotionToggle } from "@/components/motion-toggle";
import { Section } from "../_components/frame";
import { MotionLab } from "../_components/motion-lab";

const flap = durations.find((d) => d.id === "flap")!.ms;

/** The split-flap cycle, drawn as a timing strip (built for real in Stage 1). */
function FlapTiming() {
  const steps = [
    { label: "החצי העליון נופל", en: "drop", ms: flap, tone: "bg-frost" },
    { label: "פגיעה ורעד", en: "settle", ms: 60, tone: "bg-mist" },
    { label: "האריח הבא", en: "stagger", ms: 40, tone: "bg-fog" },
  ];
  const total = steps.reduce((a, s) => a + s.ms, 0);
  return (
    <figure className="flex flex-col gap-4 rounded-md bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="type-title text-frost">מחזור של אריח בלוח</span>
        <bdi dir="ltr" lang="en" className="num text-small text-mist">
          {total}ms / flip · max 8 flips / char
        </bdi>
      </figcaption>
      <div className="flex h-10 overflow-hidden rounded-xs shadow-[inset_0_0_0_1px_var(--color-hairline)]">
        {steps.map((s) => (
          <div
            key={s.en}
            className={`flex items-center justify-center ${s.tone} text-micro font-medium text-deep-ice`}
            style={{ width: `${(s.ms / total) * 100}%` }}
          >
            <bdi dir="ltr" className="num">
              {s.ms}
            </bdi>
          </div>
        ))}
      </div>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s.en} className="flex items-center gap-2 text-small text-mist">
            <span aria-hidden="true" className={`size-2 rounded-hair ${s.tone}`} />
            {s.label}
            <bdi dir="ltr" className="num text-fog">
              {s.en}
            </bdi>
          </li>
        ))}
      </ol>
      <p className="text-small text-mist">
        רק <code className="num">transform</code> ו־<code className="num">opacity</code> זזים, כדי להישאר ב־60 פריימים. שורות
        הלוח נכנסות במדרגות של <bdi dir="ltr" className="num">120ms</bdi>, מלמעלה למטה.
      </p>
    </figure>
  );
}

export function MotionSection() {
  return (
    <Section
      id="motion"
      index="05"
      en="Motion"
      he="תנועה קרה ואיטית"
      lede="שום דבר לא קופץ. הדברים מאטים ונעצרים כמו אדים על זכוכית. מהיר לממשק, איטי לאווירה – ובחירה אחת של עקומה לכל תפקיד."
    >
      <MotionLab />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FlapTiming />
        </div>
        <aside className="flex flex-col gap-4 rounded-md p-6 shadow-[inset_0_0_0_1px_var(--color-hairline)] sm:p-8 lg:col-span-5">
          <h3 className="type-title text-frost">כשמבקשים לעצור</h3>
          <p className="text-body text-mist">
            <bdi dir="ltr" className="num text-small">prefers-reduced-motion</bdi> או הכפתור "עצירת אנימציה" – שניהם
            אותו כלל: הלוח הופך לטבלה סטטית, הכפור והערפל קופאים כתמונה, המעברים נעלמים והמספרים פשוט מתחלפים.
            שום מידע לא תלוי בתנועה.
          </p>
          <MotionToggle className="self-start" />
        </aside>
      </div>
    </Section>
  );
}
