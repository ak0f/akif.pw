"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

const ZONE = "Europe/Zurich";

/* ---------------------------------------------------------------------------
   The time where I am. It answers the question someone has before they write
   or call: is it a sensible hour over there.

   Rendered empty on the server and filled in after mount, because the server
   and the visitor do not share a clock and a mismatch would break hydration.
--------------------------------------------------------------------------- */
export default function Clock({ label }: { label: string }) {
  const { locale } = useLanguage();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat(locale, {
      timeZone: ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(format.format(new Date()));

    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <span className="tabular" aria-label={time ? `${label} ${time}` : undefined}>
      {time ?? "--:--"}
    </span>
  );
}
