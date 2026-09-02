/* ---------------------------------------------------------------------------
   Wordmark.

   akif.pw ships no logo file: the mark there is live type, "AK" set bold and
   tight with the full stop picked out in the accent colour. This rebuilds it
   for a strictly two-colour page, so the stop becomes a filled square instead
   of a coloured period. That keeps the one accented element of the original
   without introducing a hue the rest of the site does not have.

   Set as real type rather than an inline SVG so it stays crisp at any size and
   inherits currentColor from whatever it sits on. `src/app/icon.svg` draws the
   same mark for the browser tab.
--------------------------------------------------------------------------- */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-end gap-[0.18em] leading-none font-bold tracking-[-0.03em] ${className}`}
    >
      AK
      <span className="mb-[0.06em] block size-[0.2em] bg-current" />
    </span>
  );
}
