import type { HTMLAttributes, ReactNode } from "react";

/**
 * Every price, weight, time and temperature goes through <Num>: an isolated LTR
 * run (<bdi dir="ltr">) in IBM Plex Mono with tabular numerals.
 */
export function Num({
  children,
  className = "",
  joined = false,
  ...rest
}: { children: ReactNode; className?: string; joined?: boolean } & Omit<HTMLAttributes<HTMLElement>, "dir" | "children" | "className">) {
  // `joined`: the figure follows a maqaf (כ־20). In RTL the maqaf sits on the figure's right,
  // so a hair of negative right margin closes Plex Mono's side bearing.
  return (
    <bdi dir="ltr" className={`num ${joined ? "-mr-[0.08em]" : ""} ${className}`} {...rest}>
      {children}
    </bdi>
  );
}
