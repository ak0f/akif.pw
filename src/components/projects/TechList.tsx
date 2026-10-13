import { TECH, type Tech, type TechId } from "@/data/tech";

/** One technology mark. Without a path, the brand square stands in. */
export function TechIcon({
  id,
  className = "size-[1.125rem]",
}: {
  id: TechId;
  className?: string;
}) {
  const tech: Tech = TECH[id];

  if (!tech.path) {
    return (
      <span
        aria-hidden="true"
        className={`flex items-center justify-center ${className}`}
      >
        <span className="size-[0.4375rem] bg-current" />
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={tech.path} />
    </svg>
  );
}

interface TechListProps {
  stack: readonly TechId[];
  /** Accessible name for the list, e.g. "Built with". */
  label: string;
  /** Icons only. The names stay available to assistive tech and on hover. */
  compact?: boolean;
  className?: string;
}

/* ---------------------------------------------------------------------------
   What a project is built with.

   Each entry is the technology's own mark next to its name, set as a plain
   run of text rather than a row of chips, so it reads as a fact about the
   project and not as a set of tags to click.
--------------------------------------------------------------------------- */
export default function TechList({
  stack,
  label,
  compact = false,
  className = "",
}: TechListProps) {
  if (!stack.length) return null;

  return (
    <ul
      aria-label={label}
      className={`flex flex-wrap items-center ${
        compact ? "gap-3.5" : "gap-x-5 gap-y-2.5"
      } ${className}`}
    >
      {stack.map((id) => (
        <li
          key={id}
          title={compact ? TECH[id].label : undefined}
          className="flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-fg-dim"
        >
          <TechIcon id={id} />
          <span className={compact ? "sr-only" : undefined}>
            {TECH[id].label}
          </span>
        </li>
      ))}
    </ul>
  );
}
