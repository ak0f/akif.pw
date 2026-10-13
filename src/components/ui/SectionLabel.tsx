/* ---------------------------------------------------------------------------
   The small line above a section heading. It opens with the square from the
   mark, which is how every section announces itself in the same voice.
--------------------------------------------------------------------------- */
export default function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`type-label flex items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className="square text-fg" />
      {children}
    </p>
  );
}
