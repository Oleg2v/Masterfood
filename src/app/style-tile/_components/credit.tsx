/**
 * A photo credit: "צילום: Name / Unsplash", linked to the photo's page. The name and
 * "/ Unsplash" never part across lines, so a narrow cell breaks after "צילום:" instead.
 */
export function Credit({ name, page }: { name: string; page?: string }) {
  return (
    <a
      href={page}
      className="text-caption text-frost-2 underline decoration-hairline underline-offset-4 transition-colors duration-hover ease-glide hover:text-frost hover:decoration-frost-2"
    >
      צילום:{" "}
      <span className="whitespace-nowrap">
        <bdi dir="ltr" lang="en">
          {name}
        </bdi>{" "}
        / <span lang="en">Unsplash</span>
      </span>
    </a>
  );
}
