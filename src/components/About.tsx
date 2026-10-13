"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import RevealText from "@/components/text-animation/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";

/* ---------------------------------------------------------------------------
   About.

   The portrait and the standing facts hold their place while the prose
   scrolls past, so the reader keeps the face and the summary in frame for the
   whole section. The portrait is the one photograph on the page and it stays
   in colour: blue hour in the old town of Bern, on a page that is otherwise
   black and white.

   The copy brightens word by word as it is read, from a floor that still
   clears AA on its own. It paces the read and marks how far through the
   section you are, which is the one place on the page where text is dense
   enough to need that. Scroll position is written to a single custom property
   and CSS does the rest per word, so three paragraphs cost one style write a
   frame instead of a hundred and fifty animated values.

   With JavaScript off or reduced motion on, the property is never written and
   every word is simply fully legible from the start.
--------------------------------------------------------------------------- */
export default function About() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  const proseRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: reading } = useScroll({
    target: proseRef,
    offset: ["start 0.82", "end 0.55"],
  });

  useEffect(() => {
    const prose = proseRef.current;
    if (!prose || reduce) return;
    prose.style.setProperty("--p", reading.get().toFixed(4));
    return () => {
      prose.style.removeProperty("--p");
    };
  }, [reduce, reading]);

  useMotionValueEvent(reading, "change", (value) => {
    if (reduce) return;
    proseRef.current?.style.setProperty("--p", value.toFixed(4));
  });

  // The photograph drifts inside its frame, slower than the page.
  const { scrollYProgress: passing } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(passing, [0, 1], ["-5%", "5%"]);

  // Words are numbered straight through all three paragraphs, so the sweep
  // runs on from one into the next.
  const { paragraphs, total } = useMemo(() => {
    let offset = 0;
    const list = [t.about.p1, t.about.p2, t.about.p3].map((text) => {
      const words = text.split(" ");
      const start = offset;
      offset += words.length;
      return { words, start };
    });
    return { paragraphs: list, total: offset };
  }, [t.about.p1, t.about.p2, t.about.p3]);

  return (
    <section id="about" className="py-28 sm:py-44">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12">
          {/* Sticky column */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="md:sticky md:top-24">
              <div
                ref={frameRef}
                className="relative aspect-[4/5] overflow-hidden rounded-media bg-surface"
              >
                <motion.div
                  style={reduce ? undefined : { y: drift }}
                  className="absolute inset-0 scale-[1.12] will-change-transform"
                >
                  <Image
                    src="/akif.webp"
                    alt="Akif Yaylaci"
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>

              <dl className="mt-8">
                {t.about.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-6 border-t border-line-soft py-3 last:border-b"
                  >
                    <dt className="type-label shrink-0">{fact.label}</dt>
                    <dd className="text-right text-[0.9375rem] leading-snug">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Prose column */}
          <div className="md:col-span-6 md:col-start-7">
            <SectionLabel>{t.about.eyebrow}</SectionLabel>
            <RevealText
              as="h2"
              text={t.about.heading}
              className="type-display mt-7"
            />

            <div
              ref={proseRef}
              style={{ "--n": total } as CSSProperties}
              className="scrub-words mt-12 space-y-8 text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.36] tracking-[-0.022em] sm:mt-16"
            >
              {paragraphs.map(({ words, start }, p) => (
                <p key={p}>
                  {words.map((word, w) => (
                    <span key={w} style={{ "--i": start + w } as CSSProperties}>
                      {word}
                      {w < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
