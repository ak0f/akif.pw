"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
} from "@/i18n/dictionaries";
import SectionLabel from "@/components/ui/SectionLabel";

/* ---------------------------------------------------------------------------
   Closing call to action.

   The page ends the way it began: two lines at full size, closed with the
   square. Under it the address is spelled out and is itself the link, because
   a button that hides the address is one more click between a reader and a
   reply. Copying it is offered next to sending, for the visitor whose mail
   lives in a browser tab and for whom a mailto link opens nothing.
--------------------------------------------------------------------------- */
export default function Contact() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      // Clipboard access denied. The address is on screen to select by hand.
      return;
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  // The sentence ends in the square, so its own full stop comes off.
  const lines = t.contact.heading.map((line, i, all) =>
    i === all.length - 1 ? line.replace(/\.$/, "") : line
  );

  return (
    <section id="contact" className="pt-28 pb-24 sm:pt-44 sm:pb-36">
      <div className="wrap">
        <SectionLabel>{t.nav.contact}</SectionLabel>

        <motion.h2
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.09 }}
          className="type-hero mt-8 text-[clamp(3rem,12.5vw,12.5rem)]"
        >
          {lines.map((line, i) => (
            <span key={i} className="line-mask block">
              <motion.span
                variants={{ hidden: { y: "112%" }, visible: { y: "0%" } }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
                {i === lines.length - 1 && (
                  <span aria-hidden="true" className="square-stop" />
                )}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 border-t border-line pt-8 sm:mt-20 sm:pt-10 md:grid-cols-12">
          <p className="type-lead max-w-[34ch] md:col-span-5">
            {t.contact.body}
          </p>

          <div className="md:col-span-6 md:col-start-7">
            <p className="type-label">{t.contact.emailLabel}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link-draw mt-3 inline-block text-[clamp(1.5rem,4.4vw,3.5rem)] leading-[1.1] font-medium tracking-[-0.03em]"
            >
              {CONTACT_EMAIL}
            </a>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-solid group">
                {t.contact.cta}
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <button type="button" onClick={copy} className="btn">
                {copied ? (
                  <Check size={15} weight="bold" aria-hidden="true" />
                ) : (
                  <Copy size={15} weight="bold" aria-hidden="true" />
                )}
                <span aria-live="polite">
                  {copied ? t.contact.copied : t.contact.copy}
                </span>
              </button>
            </div>

            <div className="mt-12 flex items-baseline justify-between gap-6 border-t border-line-soft py-4">
              <p className="type-label">{t.contact.phoneLabel}</p>
              <a
                href={CONTACT_PHONE_HREF}
                className="link-draw tabular text-[1.0625rem]"
              >
                {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
