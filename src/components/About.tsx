"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { useLanguage } from "@/i18n/LanguageProvider";
import RevealText from "@/components/text-animation/RevealText";

/* ---------------------------------------------------------------------------
   About.

   The portrait and the standing facts pin while the prose scrolls past them,
   so the reader keeps the face and the summary in frame for the whole section.
   The copy brightens word by word on scrub, from a floor of 0.5 that still
   clears AA on its own: it paces the read and marks how
   far through the section you are, which is the one place on the page where
   text is dense enough to need that.

   The dimming is applied by script, so with JavaScript disabled or reduced
   motion on, the paragraphs are simply fully legible from the start.
--------------------------------------------------------------------------- */
export default function About() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const proseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const prose = proseRef.current;
    if (!prose) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      if (!words.length) return;

      gsap.fromTo(
        words,
        { opacity: 0.5 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: prose,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    }, prose);

    return () => ctx.revert();
  }, [reduce, t]);

  const renderWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span key={i} data-word className="inline-block">
        {word}&nbsp;
      </span>
    ));

  return (
    <section id="about" className="relative z-10 py-28 sm:py-44">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          {/* Sticky column */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="md:sticky md:top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-bg-elev">
                <Image
                  src="/akif.webp"
                  alt="Akif Yaylaci"
                  fill
                  priority={false}
                  sizes="(min-width: 768px) 34vw, 100vw"
                  className="object-cover grayscale contrast-[1.08]"
                />
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
                {t.about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="type-label">{fact.label}</dt>
                    <dd className="mt-2 text-sm leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Prose column */}
          <div className="md:col-span-6 md:col-start-7">
            <RevealText
              as="h2"
              text={t.about.heading}
              className="type-display text-[clamp(1.8rem,4.4vw,3.8rem)]"
            />

            <div
              ref={proseRef}
              className="mt-10 space-y-8 text-lg leading-relaxed sm:mt-14 sm:text-xl md:text-2xl"
            >
              <p>{renderWords(t.about.p1)}</p>
              <p>{renderWords(t.about.p2)}</p>
              <p>{renderWords(t.about.p3)}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
