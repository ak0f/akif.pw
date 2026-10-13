"use client";

import { useRef, type CSSProperties } from "react";
import { ArrowDown } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import Clock from "@/components/ui/Clock";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/* ---------------------------------------------------------------------------
   Hero.

   A greeting, set as large as two lines will go, and closed with the square
   from the mark instead of a full stop. What I do sits beside the first line
   in the space the short word leaves open; where I am and the one action sit
   under it. Everything above is left empty on purpose.

   The section is twice the height of the screen and its content is sticky,
   so the rest of the page rises over it like a sheet while the greeting
   settles back and dims. The entrance itself is pure CSS, keyed off the
   data-intro state the opening sequence drives (see globals.css).
--------------------------------------------------------------------------- */
export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The sheet has fully covered the hero at 0.5.
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.42], [1, 0.16]);

  const [first, second] = t.hero.greeting;

  return (
    <div id="top" ref={ref} className="relative h-[200svh]">
      <section className="sticky top-0 flex h-[100svh] min-h-[34rem] flex-col justify-end pb-7 sm:pb-10">
        <motion.div
          style={reduce ? undefined : { scale, opacity }}
          className="wrap origin-bottom-left"
        >
          <div className="grid grid-cols-1">
            <h1 className="type-hero col-start-1 row-start-1 max-lg:text-[clamp(3.25rem,15.5vw,9rem)]">
              <span className="line-mask block">
                <span className="intro-rise block" style={stagger(0)}>
                  {first}
                </span>
              </span>
              <span className="line-mask block">
                <span className="intro-rise block" style={stagger(1)}>
                  {second}
                  <span
                    data-hero-stop
                    aria-hidden="true"
                    className="square-stop hero-stop"
                  />
                </span>
              </span>
            </h1>

            {/* Shares the heading's grid cell from lg up, pinned to its top
                right, which is the gap the short first line leaves. Below
                that it simply follows the heading. */}
            <p
              className="intro-fade type-lead col-start-1 row-start-2 mt-8 max-w-[26ch] text-fg lg:row-start-1 lg:mt-[0.5em] lg:max-w-[20rem] lg:justify-self-end xl:max-w-[24rem]"
              style={stagger(3)}
            >
              {t.hero.statement}
            </p>
          </div>

          <div
            className="intro-fade mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-line-soft pt-5 sm:mt-10 sm:pt-6"
            style={stagger(5)}
          >
            <p className="type-label flex items-center gap-2.5">
              <span aria-hidden="true" className="square text-fg" />
              <span>{t.hero.place}</span>
              <span aria-hidden="true">·</span>
              <Clock label={t.hero.time} />
            </p>

            <a href="#projects" className="btn btn-solid group">
              {t.hero.cta}
              <ArrowDown
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
