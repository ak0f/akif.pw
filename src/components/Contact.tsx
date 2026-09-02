"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
} from "@/i18n/dictionaries";
import RevealText from "@/components/text-animation/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

/* ---------------------------------------------------------------------------
   Closing call to action.

   Full-bleed and centred: this is the one section where the message is the
   whole composition, so the anti-centre rule that governs the rest of the page
   does not apply. The section settles into place on scrub, which lands the
   page rather than letting it trail off.
--------------------------------------------------------------------------- */
export default function Contact() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative z-10 flex min-h-[86dvh] items-center py-28 sm:py-40"
    >
      <motion.div
        style={reduce ? undefined : { scale }}
        className="mx-auto w-full max-w-[1600px] px-5 text-center sm:px-10"
      >
        <RevealText
          as="h2"
          text={t.contact.heading}
          className="type-display text-[clamp(2.4rem,9vw,8rem)]"
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-9"
        >
          <p className="max-w-[44ch] text-sm leading-relaxed text-fg-dim">
            {t.contact.body}
          </p>

          <MagneticButton href={`mailto:${CONTACT_EMAIL}`} variant="filled">
            {t.contact.cta}
          </MagneticButton>

          {/* The direct details, spelled out. A button that hides the address
              is one more click between a reader and a reply. */}
          <dl className="flex flex-col items-center gap-6 sm:flex-row sm:gap-14">
            <div className="text-center">
              <dt className="type-label">{t.contact.emailLabel}</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group relative text-sm text-fg-dim transition-colors hover:text-fg"
                >
                  {CONTACT_EMAIL}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                  />
                </a>
              </dd>
            </div>

            <div className="text-center">
              <dt className="type-label">{t.contact.phoneLabel}</dt>
              <dd className="mt-2">
                <a
                  href={CONTACT_PHONE_HREF}
                  className="group relative text-sm text-fg-dim transition-colors hover:text-fg"
                >
                  {CONTACT_PHONE}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                  />
                </a>
              </dd>
            </div>
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
