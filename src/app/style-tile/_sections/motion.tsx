import { MotionToggle } from "@/components/motion-toggle";
import { Num } from "@/components/ui/num";
import { Section } from "../_components/frame";
import { FlapBench } from "../_components/flap-bench";
import { MotionLab } from "../_components/motion-lab";

/** The split-flap at full size, with the rules every flap in the portal follows. */
function FlapPlate() {
  const rules = [
    <>
      העלה העליון נופל ב־<Num joined>90ms</Num>, החדש נוחת ב־<Num joined>70ms</Num>; שניהם כפול השורש של גובה התא חלקי{" "}
      <Num>40px</Num>. תא גדול נופל לאט יותר, כמו לוח אמיתי.
    </>,
    <>
      תא שהשתנה מדפדף קדימה בתוף – א״ב, כל סופית אחרי האות שלה, ואחר כך <Num>0–9</Num> – ועובר לכל היותר שלוש אותיות לפני
      היעד, <Num>60ms</Num> לכל אחת.
    </>,
    <>
      רק תאים שהשתנו זזים. המפל מתחיל בקצה ההתחלה, מימין: <Num>18ms</Num> בין תאים ו־<Num joined>90ms</Num> בין שורות.
    </>,
    <>
      רק <span lang="en">transform</span> זז, עם פרספקטיבה של <Num>600px</Num>. כשמבקשים לעצור, הערך פשוט מתחלף.
    </>,
  ];
  return (
    <figure className="flex flex-col gap-6 rounded-edge bg-steel/60 p-6 shadow-rim inset-ring inset-ring-hairline sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="type-dish text-frost">תא היפוך אחד, בגודל אמיתי</span>
        <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
          Flap bench · step 6
        </bdi>
      </figcaption>
      <FlapBench />
      <ol className="flex flex-col border-t border-hairline">
        {rules.map((r, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-hairline py-3 text-caption text-pretty text-frost-2 last:border-b-0">
            <bdi dir="ltr" className="num text-micro text-frost-3">
              0{i + 1}
            </bdi>
            <span>{r}</span>
          </li>
        ))}
      </ol>
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
          <FlapPlate />
        </div>
        <aside className="flex flex-col gap-4 rounded-edge p-6 shadow-[inset_0_0_0_1px_var(--color-hairline)] sm:p-8 lg:col-span-5">
          <h3 className="type-dish text-frost">כשמבקשים לעצור</h3>
          <p className="text-body text-pretty text-frost-2">
            <bdi dir="ltr" lang="en" className="num text-caption">
              prefers-reduced-motion
            </bdi>{" "}
            או הכפתור עצירת אנימציה בסרגל העליון{"\u00a0"}– שניהם אותו כלל: הלוח הופך לטבלה סטטית, הכפור והערפל קופאים
            כתמונה, השעון מתעדכן פעם בדקה, המעברים נעלמים והמספרים פשוט מתחלפים. שום מידע לא תלוי בתנועה.
          </p>
          <MotionToggle className="self-start" />
        </aside>
      </div>
    </Section>
  );
}
