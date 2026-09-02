"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLanguage } from "@/i18n/LanguageProvider";
import { GITHUB_URL, SITE_PROJECTS } from "@/i18n/dictionaries";
import type { Repo } from "@/lib/github";
import RevealText from "@/components/text-animation/RevealText";
import ScrambleText from "@/components/text-animation/ScrambleText";

interface Panel {
  key: string;
  title: string;
  tag: string;
  desc: string;
  href: string;
  meta: string;
  image: string | null;
}

/* ---------------------------------------------------------------------------
   Projects.

   Vertical scroll drives a horizontal pan. The lateral movement is the point:
   work wants to be compared side by side, and panning holds the whole body of
   it in one continuous frame instead of stacking it into a dozen separate
   scroll events. The images counter-drift inside their frames on the same
   scrub, so the images and their frames sit on visibly different planes.

   Two sources feed one track. The design and client work from akif.pw comes
   first and carries real imagery; the repositories follow, read live from
   GitHub. A repository has no picture, so it gets a typographic plate in the
   same frame rather than a gap, which keeps the rhythm of the pan intact.

   Below md the hijack is switched off entirely and the panels stack, because
   trading vertical scroll for horizontal is hostile on a touch device. The
   position readout is desktop-only for the same reason: on mobile the page
   scrollbar already does that job.
--------------------------------------------------------------------------- */
export default function Projects({ repos }: { repos: Repo[] }) {
  const reduce = useReducedMotion();
  const { locale, t } = useLanguage();

  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const panels = useMemo<Panel[]>(() => {
    const formatDate = (iso: string) =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "numeric",
      }).format(new Date(iso));

    const site: Panel[] = SITE_PROJECTS.map((project, i) => ({
      key: `site-${project.title}`,
      title: project.title,
      tag: t.projects.site[i].tag,
      desc: t.projects.site[i].desc,
      href: project.href,
      meta: project.meta,
      image: project.image,
    }));

    const code: Panel[] = repos.map((repo) => ({
      key: `repo-${repo.name}`,
      title: repo.name,
      tag: repo.language ?? t.projects.repoLabel,
      desc: repo.description ?? t.projects.noDescription,
      href: repo.homepage ?? repo.url,
      meta: `${t.projects.updatedLabel} ${formatDate(repo.updated)}`,
      image: null,
    }));

    return [...site, ...code];
  }, [repos, t, locale]);

  const total = panels.length;

  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          // The readout is written straight to the DOM. Routing scroll
          // progress through React state would re-render every panel a frame.
          onUpdate: (self) => {
            const p = self.progress;
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${p})`;
            }
            if (counterRef.current) {
              const current = Math.min(total, Math.floor(p * total) + 1);
              counterRef.current.textContent = String(current).padStart(2, "0");
            }
          },
        },
      });

      tl.to(track, { x: () => -distance(), ease: "none" }, 0);
      // Opposing drift inside each frame. Images are pre-scaled so the offset
      // never exposes an edge.
      tl.to(
        track.querySelectorAll<HTMLElement>("[data-parallax]"),
        { xPercent: 8, ease: "none" },
        0
      );
    });

    // Fonts and images settling can change scrollWidth after the trigger is built.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      mm.revert();
      window.removeEventListener("load", refresh);
    };
  }, [reduce, t, total]);

  return (
    <section
      id="projects"
      ref={wrapRef}
      className="relative z-10 overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex w-full flex-col gap-16 px-5 py-24 md:h-[100dvh] md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:py-0"
      >
        {/* Intro panel: the section header travels with the pan. */}
        <div className="shrink-0 md:w-[58vw] md:px-10 lg:w-[44vw]">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <ScrambleText text={t.projects.eyebrow} className="type-label" />
            <ScrambleText text={t.projects.source} className="type-label" />
          </div>
          <RevealText
            as="h2"
            text={t.projects.heading}
            className="type-display mt-6 max-w-[12ch] text-[clamp(2rem,5.5vw,4.6rem)]"
          />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-9 inline-flex items-center gap-3 text-fg-dim transition-colors hover:text-fg"
          >
            <span className="type-meta">{t.projects.viewAll}</span>
            <ArrowUpRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>

        {panels.map((panel, i) => (
          <a
            key={panel.key}
            href={panel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block shrink-0 md:w-[42vw] md:px-6 lg:w-[32vw]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-bg-elev md:aspect-auto md:h-[46vh]">
              {panel.image ? (
                <div
                  data-parallax
                  className="absolute inset-0 scale-[1.18] will-change-transform"
                >
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    sizes="(min-width: 768px) 34vw, 100vw"
                    className="object-cover object-center grayscale contrast-[1.15] brightness-[0.85] transition-[filter] duration-700 group-hover:brightness-100"
                  />
                </div>
              ) : (
                /* Repositories have no imagery. Rather than leave a hole in
                   the pan, the frame carries an outlined index, on the same
                   hollow-versus-solid device the footer wordmark uses. The
                   name is not repeated here: the caption below already has it,
                   and a single long repo name cannot wrap to fit a frame. */
                <div
                  data-parallax
                  className="absolute inset-0 flex scale-[1.08] flex-col justify-between p-7 will-change-transform"
                >
                  <span className="type-meta text-fg-faint">{panel.tag}</span>
                  <span
                    aria-hidden="true"
                    className="type-display type-outline text-[clamp(3.5rem,8vw,6rem)] leading-none transition-colors duration-700 group-hover:text-fg"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            <div className="rule mt-5 flex items-start justify-between gap-6 pt-4">
              <div className="min-w-0">
                <p className="type-label">{panel.tag}</p>
                <h3 className="type-display mt-2 text-[clamp(1.4rem,2.6vw,2.2rem)]">
                  {panel.title}
                </h3>
                <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-fg-dim">
                  {panel.desc}
                </p>
                <p className="type-meta mt-4 text-fg-faint">{panel.meta}</p>
              </div>
              <ArrowUpRight
                size={20}
                weight="light"
                aria-hidden="true"
                className="mt-1 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </a>
        ))}

        {/* Trailing gutter so the last panel clears the right edge. */}
        <div aria-hidden="true" className="hidden shrink-0 md:block md:w-[10vw]" />
      </div>

      {/* Position readout. Losing your place is the standard failure of a
          horizontal section, and this is what the section pays for the hijack. */}
      {!reduce && total > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 hidden px-10 md:block"
        >
          <div className="mx-auto flex max-w-[1600px] items-center gap-5">
            <span className="type-meta tabular-nums text-fg-dim">
              <span ref={counterRef}>01</span>
              <span className="mx-1 text-fg-faint">/</span>
              {String(total).padStart(2, "0")}
            </span>
            <span className="relative h-px flex-1 bg-line">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left scale-x-0 bg-fg"
              />
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
