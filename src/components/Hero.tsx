"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { gsap } from "@/lib/gsap";
import { useLanguage } from "@/i18n/LanguageProvider";
import { HERO_ENTRANCE } from "@/lib/timing";

const ENTRANCE_DURATION = 1.15;
/** Cursor influence radius, in px. */
const RADIUS = 190;
/** Peak displacement at the centre of that radius, in px. */
const STRENGTH = 46;

/* ---------------------------------------------------------------------------
   Hero.

   One line of Helvetica Light, bottom-anchored, with nothing else in the
   frame. The ASCII field owns the space above it and the greeting sits on that
   field like a caption.

   Each character is independently sprung away from the cursor, so the line
   parts as the pointer moves through it and settles back with a real
   overshoot. Springs are driven with GSAP quickTo rather than per-character
   React state: the character count changes with locale, and one motion value
   per glyph would mean a variable number of hooks.
--------------------------------------------------------------------------- */
export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  // The entrance clips against a mask; the physics must not. Once the letters
  // have landed the mask is released so displaced glyphs are never cut off.
  const [settled, setSettled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);

  const entrance = reduce ? 0 : HERO_ENTRANCE;
  const chars = Array.from(t.hero.greeting);

  useEffect(() => {
    if (reduce) {
      setSettled(true);
      return;
    }
    const id = window.setTimeout(
      () => setSettled(true),
      (entrance + ENTRANCE_DURATION) * 1000
    );
    return () => window.clearTimeout(id);
  }, [reduce, entrance, t]);

  useEffect(() => {
    if (reduce || !settled) return;
    const line = lineRef.current;
    if (!line) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const glyphs = Array.from(line.querySelectorAll<HTMLElement>("[data-char]"));
    if (!glyphs.length) return;

    // elastic.out gives the settle its overshoot. quickTo reuses one tween per
    // property per glyph instead of allocating a tween on every pointer event.
    const springs = glyphs.map((glyph) => ({
      x: gsap.quickTo(glyph, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" }),
      y: gsap.quickTo(glyph, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" }),
    }));

    // Offsets are measured once, relative to the line box. Each pointer event
    // then costs a single rect read for the line itself rather than one per
    // glyph, which keeps this off the layout-thrash path.
    let offsets: { x: number; y: number }[] = [];
    const measure = () => {
      const base = line.getBoundingClientRect();
      offsets = glyphs.map((glyph) => {
        const r = glyph.getBoundingClientRect();
        return {
          x: r.left - base.left + r.width / 2,
          y: r.top - base.top + r.height / 2,
        };
      });
    };
    measure();

    const onMove = (e: PointerEvent) => {
      const base = line.getBoundingClientRect();
      const px = e.clientX - base.left;
      const py = e.clientY - base.top;

      for (let i = 0; i < glyphs.length; i++) {
        const dx = offsets[i].x - px;
        const dy = offsets[i].y - py;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS) {
          // Falloff is squared so the push concentrates near the cursor
          // instead of nudging the whole line.
          const falloff = (1 - dist / RADIUS) ** 2;
          const n = dist || 1;
          springs[i].x((dx / n) * falloff * STRENGTH);
          springs[i].y((dy / n) * falloff * STRENGTH);
        } else {
          springs[i].x(0);
          springs[i].y(0);
        }
      }
    };

    const release = () => {
      for (const spring of springs) {
        spring.x(0);
        spring.y(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", release);
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", release);
      window.removeEventListener("resize", measure);
      gsap.killTweensOf(glyphs);
      gsap.set(glyphs, { x: 0, y: 0 });
    };
  }, [reduce, settled, t]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-10 sm:px-10 sm:pb-14"
    >
      <motion.h1
        style={reduce ? undefined : { opacity, y: lift }}
        className="type-hero text-[clamp(2.2rem,10vw,10rem)]"
      >
        <span
          ref={lineRef}
          className={`block ${settled ? "overflow-visible" : "overflow-hidden"} pb-[0.12em] -mb-[0.12em]`}
        >
          {chars.map((char, i) => (
            <span key={i} data-char className="inline-block will-change-transform">
              <motion.span
                initial={reduce ? false : { y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: ENTRANCE_DURATION,
                  // Letters land left to right rather than all at once.
                  delay: entrance + i * 0.035,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {/* A literal space collapses inside an inline-block. */}
                {char === " " ? " " : char}
              </motion.span>
            </span>
          ))}
        </span>
      </motion.h1>
    </section>
  );
}
