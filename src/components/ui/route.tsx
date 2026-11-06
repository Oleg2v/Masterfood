import { Icon } from "./icon";
import { Num } from "./num";

/**
 * A shipment route, read the way a map reads: an LTR island, west to east, with
 * the origin on the left, the destination on the right and the plane or ship
 * between them pointing east, never mirrored (OSL ✈ TLV, RTM ⛴ ASH). The Hebrew
 * around it keeps running right to left; the route is geography, not a sentence.
 * One component, so the board, the toasts and the arrivals strip can never
 * disagree about which way OSL–TLV runs. The vehicle is named for assistive tech
 * ("בטיסה" / "בהפלגה").
 */
export function Route({
  from,
  to,
  mode,
  size = 14,
  className = "",
}: {
  from: string;
  to: string;
  mode: "air" | "sea";
  size?: number;
  className?: string;
}) {
  return (
    <bdi dir="ltr" className={`inline-flex items-center gap-1.5 ${className}`}>
      <Num className="label-latin" lang="en">
        {from}
      </Num>
      <Icon name={mode === "air" ? "plane" : "ship"} size={size} mirror={false} title={mode === "air" ? "בטיסה" : "בהפלגה"} />
      <Num className="label-latin" lang="en">
        {to}
      </Num>
    </bdi>
  );
}
