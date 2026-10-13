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
import Logo from "@/components/ui/Logo";

const SECTIONS = ["projects", "skills", "about", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

/* ---------------------------------------------------------------------------
   Header.

   Three things it has to do, in order: say where you are, stay legible, and
   get out of the way.

   Where you are is a scroll spy. The active link carries the square from the
   mark, and that one square travels between links under a shared layoutId, so
   the header answers "which section am I in" without the reader having to
   look at the page behind it.

   Legible is a real scrim: transparent over the hero, where there is nothing
   behind it, and a blurred black bar once content is scrolling underneath.
   This is the one place on the page that uses backdrop blur, because it is
   the one surface that sits over moving content.
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

  // The open menu covers the page, so the page behind it must not scroll, and
  // Escape has to close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links: { href: string; id: SectionId; label: string }[] = [
    { href: "#projects", id: "projects", label: t.nav.projects },
    { href: "#skills", id: "skills", label: t.nav.skills },
    { href: "#about", id: "about", label: t.nav.about },
    { href: "#contact", id: "contact", label: t.nav.contact },
  ];

  const languageSwitcher = (
    <div className="flex items-center gap-1 text-[0.875rem] font-medium">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-fg-faint">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            lang={l}
            className={`flex min-h-9 min-w-9 items-center justify-center rounded-full transition-colors ${
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
      <header className="intro-fade pointer-events-none fixed inset-x-0 top-0 z-50">
        <motion.nav
          aria-label={t.nav.brand}
          animate={{ y: hidden ? "-110%" : "0%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto border-b transition-colors duration-500 ${
            scrolled
              ? "border-line-soft bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent"
          }`}
        >
          <div className="wrap flex h-14 items-center justify-between gap-6 sm:h-16">
            <a
              href="#top"
              aria-label={t.nav.brand}
              className="-ml-2 flex h-11 shrink-0 items-center px-2 text-fg"
            >
              <Logo className="text-xl sm:text-[1.375rem]" />
            </a>

            <div className="hidden items-center gap-6 md:flex lg:gap-10">
              <ul className="flex items-center">
                {links.map((link) => {
                  const isActive = active === link.id;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={isActive ? "true" : undefined}
                        className={`relative flex h-11 items-center px-3.5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                          isActive ? "text-fg" : "text-fg-dim hover:text-fg"
                        }`}
                      >
                        {link.label}
                        {/* One square shared across the links, so it slides
                            from one to the next rather than cross-fading. */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute bottom-1 left-1/2 -ml-[2.5px] size-[5px] bg-fg"
                            transition={{
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          />
                        )}
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
              aria-controls="mobile-menu"
              className="-mr-2 flex h-11 items-center px-2 text-[0.9375rem] font-medium md:hidden"
            >
              {t.nav.menu}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-bg md:hidden"
          >
            <div className="wrap flex h-14 shrink-0 items-center justify-between">
              <span className="text-fg">
                <Logo className="text-xl" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                autoFocus
                className="-mr-2 flex h-11 items-center px-2 text-[0.9375rem] font-medium"
              >
                {t.nav.close}
              </button>
            </div>

            <ul className="wrap my-auto flex flex-col">
              {links.map((link, i) => (
                <li key={link.href} className="line-mask block">
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.8,
                      delay: 0.12 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="block py-1.5 text-[clamp(2.5rem,13vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.045em]"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="wrap shrink-0 border-t border-line-soft py-4">
              {languageSwitcher}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
