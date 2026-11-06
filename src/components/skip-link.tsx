export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className="fixed start-3 top-3 z-skip -translate-y-[200%] rounded-edge bg-frost px-4 py-3 text-body font-medium text-deep-ice shadow-float transition-[translate] duration-hover ease-glide focus-visible:translate-y-0"
    >
      דילוג לתוכן הראשי
    </a>
  );
}
