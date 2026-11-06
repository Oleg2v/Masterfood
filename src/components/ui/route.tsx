import { Icon } from "./icon";
import { Num } from "./num";

/**
 * A shipment route, read the way Hebrew reads: origin at the inline start
 * (right), destination at the inline end (left), with the plane or ship
 * mirrored to face the direction of travel. One component, so the board, the
 * toasts and the arrivals strip can never disagree about which way OSL–TLV runs.
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
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Num className="label-latin" >{from}</Num>
      <Icon name={mode === "air" ? "plane" : "ship"} size={size} title={mode === "air" ? "בטיסה" : "בהפלגה"} />
      <Num className="label-latin">{to}</Num>
    </span>
  );
}
