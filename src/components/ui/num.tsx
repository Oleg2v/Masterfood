import type { HTMLAttributes, ReactNode } from "react";

/**
 * Every price, weight, time and temperature goes through <Num>: an isolated LTR
 * run (<bdi dir="ltr">) in IBM Plex Mono with tabular numerals.
 */
export function Num({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLElement>, "dir" | "children" | "className">) {
  return (
    <bdi dir="ltr" className={`num ${className}`} {...rest}>
      {children}
    </bdi>
  );
}
