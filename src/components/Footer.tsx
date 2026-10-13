"use client";

import { useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { CONTACT_EMAIL, SOCIALS } from "@/i18n/dictionaries";
import Clock from "@/components/ui/Clock";

/* ---------------------------------------------------------------------------
   Footer.

   The name, at the width of the page, comes up out of the dark as the last
   screen arrives: it is barely there when the footer enters and fully lit
   once you have reached the end. The page opened by building a mark out of
   nothing; it closes by lighting the name it stands for.
--------------------------------------------------------------------------- */
export default function Footer() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const nameRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: nameRef,
    offset: ["start end", "end end"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);

  const profiles = [
    ...SOCIALS,
    { label: "Email", handle: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  ];

  return (
    <footer className="overflow-x-clip border-t border-line-soft pt-12 pb-8 sm:pt-16">
      <div className="wrap">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Each profile carries its handle, because three of the four are
              the same handle and a bare platform name would not say so. */}
          <ul className="grid grid-cols-2 gap-x-10 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-12">
            {profiles.map((profile) => {
              const external = profile.href.startsWith("http");
              return (
                <li key={profile.label}>
                  <a
                    href={profile.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group block py-1"
                  >
                    <span className="link-draw text-[0.9375rem] font-medium">
                      {profile.label}
                    </span>
                    <span className="type-label mt-1 block font-normal transition-colors duration-300 group-hover:text-fg-dim">
                      {profile.handle}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <a href="#top" className="btn group self-start">
            <ArrowUp
              size={15}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5"
            />
            {t.footer.back}
          </a>
        </div>

        <motion.p
          ref={nameRef}
          aria-hidden="true"
          style={reduce ? undefined : { opacity }}
          className="mt-16 text-[clamp(2.75rem,16.4vw,16.75rem)] leading-none font-medium tracking-[-0.045em] whitespace-nowrap sm:mt-24"
        >
          {t.nav.brand}
          <span className="square-stop" />
        </motion.p>

        <div className="type-label mt-8 flex flex-col gap-2 border-t border-line-soft pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <span className="tabular">
            © {year} {t.nav.brand}. {t.footer.rights}
          </span>
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="square text-fg" />
            {t.hero.place}
            <span aria-hidden="true">·</span>
            <Clock label={t.hero.time} />
          </span>
        </div>
      </div>
    </footer>
  );
}
