"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { CONTACT_EMAIL, SOCIALS } from "@/i18n/dictionaries";

/* ---------------------------------------------------------------------------
   Footer.

   The wordmark is set hollow and fills on scroll, which closes the page on the
   same outline-versus-solid device the kinetic band opened it with.
--------------------------------------------------------------------------- */
export default function Footer() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-bg-footer px-5 pt-16 pb-8 sm:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          {/* Each profile carries its handle, because three of the four are
              the same handle and a bare platform name would not say so. */}
          <ul className="flex flex-wrap items-start gap-x-10 gap-y-5">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block type-meta text-fg-dim transition-colors hover:text-fg"
                >
                  <span className="relative">
                    {social.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </span>
                  <span className="mt-2 block normal-case tracking-[0.1em] text-fg-faint transition-colors group-hover:text-fg-dim">
                    {social.handle}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group block type-meta text-fg-dim transition-colors hover:text-fg"
              >
                <span className="relative">
                  Email
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                  />
                </span>
                <span className="mt-2 block normal-case tracking-[0.1em] text-fg-faint transition-colors group-hover:text-fg-dim">
                  {CONTACT_EMAIL}
                </span>
              </a>
            </li>
          </ul>

          <a
            href="#top"
            className="group inline-flex items-center gap-2 type-meta text-fg-dim transition-colors hover:text-fg"
          >
            <ArrowUp
              size={14}
              weight="bold"
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
            />
            {t.footer.back}
          </a>
        </div>

        {/* Oversized wordmark, hollow until it enters the frame. */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
          className="type-display mt-14 text-[clamp(3rem,15vw,14rem)] leading-[0.8]"
        >
          {/* The stroke is held by .type-outline; only the fill animates in. */}
          <motion.span
            initial={reduce ? false : { color: "rgba(244,244,244,0)" }}
            whileInView={{ color: "rgba(244,244,244,1)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="type-outline block"
          >
            {t.nav.brand}
          </motion.span>
        </motion.p>

        <div className="rule-soft mt-10 flex flex-col gap-2 pt-6 type-meta text-fg-faint sm:flex-row sm:justify-between">
          <span>
            {year} {t.nav.brand}
          </span>
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
