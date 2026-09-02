"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { locales, localeLabels } from "@/i18n/dictionaries";
import { PRELOADER_EXIT } from "@/lib/timing";
import Logo from "@/components/ui/Logo";

const SECTIONS = ["projects", "skills", "about", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

/* ---------------------------------------------------------------------------
   Header.

   Three things it has to do, in order: say where you are, stay legible, and
   get out of the way.

   Where you are is a scroll spy. The active link carries a filled marker that
   travels between links under a shared layoutId, so the header answers "which
   section am I in" without the reader having to look at the page behind it.

   Legible is a real scrim. The previous version leaned on
   mix-blend-difference, which inverts against whatever is underneath and
   holds contrast only while the backdrop stays near-black or near-white. Over
   the ASCII field it lands mid-grey and the labels get hard to read, so the
   header now sits on its own tinted, blurred surface once the page has moved,
   and is transparent over the hero where there is nothing behind it.
--------------------------------------------------------------------------- */
export default function Nav() {
  const { locale, setLocale, t } = useLanguage();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  const { scrollY } = useScroll();

  // Collapse the header on scroll down, restore on scroll up. Reading the
  // motion value rather than a scroll listener keeps this off the main thread.
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    if (open) return;
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 220);
  });

  // Scroll spy. rootMargin pins the trigger line to the upper third of the
  // viewport so a section becomes active as it takes over the screen, not as
  // its first pixel appears.
  useEffect(() => {
    const nodes = SECTIONS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null
    );
    if (!nodes.length) return;

    // The observer only reports sections that changed, so the set of what is
    // currently in the band is tracked across callbacks. Reading a single
    // callback would leave the last match highlighted once every section has
    // left the band, which is what the hero is: no section, no active link.
    const inBand = new Set<SectionId>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        setActive(SECTIONS.find((id) => inBand.has(id)) ?? null);
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const links: { href: string; id: SectionId; label: string }[] = [
    { href: "#projects", id: "projects", label: t.nav.projects },
    { href: "#skills", id: "skills", label: t.nav.skills },
    { href: "#about", id: "about", label: t.nav.about },
    { href: "#contact", id: "contact", label: t.nav.contact },
  ];

  const languageSwitcher = (
    <div className="type-meta flex items-center gap-2">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-fg-faint">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            aria-label={localeLabels[l]}
            className={`rounded-sm px-1 py-0.5 transition-colors ${
              locale === l ? "text-fg" : "text-fg-faint hover:text-fg"
            }`}
          >
            {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <>
      <motion.header
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduce ? 0 : PRELOADER_EXIT - 0.2 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <motion.nav
          animate={{ y: hidden ? "-110%" : "0%" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto relative transition-colors duration-500 ${
            scrolled
              ? "border-b border-line bg-bg/85 backdrop-blur-md"
              : "border-b border-transparent"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 sm:h-20 sm:px-10">
            <a
              href="#top"
              aria-label={t.nav.brand}
              className="shrink-0 text-fg transition-opacity hover:opacity-70"
            >
              <Logo className="text-xl sm:text-2xl" />
            </a>

            <div className="hidden items-center gap-8 md:flex lg:gap-12">
              <ul className="flex items-center gap-1">
                {links.map((link) => {
                  const isActive = active === link.id;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={isActive ? "true" : undefined}
                        className={`type-meta relative block px-3 py-2 transition-colors ${
                          isActive ? "text-fg" : "text-fg-dim hover:text-fg"
                        }`}
                      >
                        {/* Travelling marker. One element shared across the
                            links, so it slides rather than cross-fades. */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute inset-x-2 -bottom-0.5 h-px bg-fg"
                            transition={{
                              duration: 0.45,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          />
                        )}
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <span aria-hidden="true" className="h-4 w-px bg-line" />

              {languageSwitcher}
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="type-meta -mr-1 px-1 py-2 text-fg md:hidden"
            >
              {t.nav.menu}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-bg px-5 py-5 md:hidden"
          >
            <div className="flex h-6 items-center justify-between">
              <span aria-label={t.nav.brand} className="text-fg">
                <Logo className="text-xl" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="type-meta px-1"
              >
                {t.nav.close}
              </button>
            </div>

            <ul className="mt-auto mb-auto flex flex-col gap-1">
              {links.map((link, i) => (
                <li key={link.href} className="line-mask block">
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="type-display block text-[13vw]"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="rule-soft pt-5">{languageSwitcher}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
