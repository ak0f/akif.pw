"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "motion/react";
import { PRELOADER_EXIT } from "@/lib/timing";

const WORDS = ["Hello", "Bonjour", "Ciao", "Olá", "Hallo", "Merhaba", "Grüezi"];

/* ---------------------------------------------------------------------------
   Entrance curtain.

   Two jobs: cover the first paint of the WebGL field so it resolves off-screen
   rather than popping in, and set the pace of the site before any content
   appears. The curtain exits on a curved path so the reveal reads as a sheet
   being pulled rather than a box sliding.
--------------------------------------------------------------------------- */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Reduced motion gets no curtain at all: content is simply there.
    if (reduce) {
      setDone(true);
      return;
    }

    const root = rootRef.current;
    const word = wordRef.current;
    const count = countRef.current;
    const path = pathRef.current;
    if (!root || !word || !count || !path) return;

    document.body.style.overflow = "hidden";

    const size = { w: window.innerWidth, h: window.innerHeight };

    const curved = () =>
      `M0 0 L${size.w} 0 L${size.w} ${size.h} Q${size.w / 2} ${size.h + 320} 0 ${size.h} L0 0`;
    const flat = () =>
      `M0 0 L${size.w} 0 L${size.w} ${size.h} Q${size.w / 2} ${size.h} 0 ${size.h} L0 0`;

    path.setAttribute("d", curved());

    const onResize = () => {
      size.w = window.innerWidth;
      size.h = window.innerHeight;
      path.setAttribute("d", curved());
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      // Greetings cycle, decelerating into the last one.
      const step = (PRELOADER_EXIT - 1.1) / WORDS.length;
      WORDS.forEach((w, i) => {
        tl.call(
          () => {
            if (wordRef.current) wordRef.current.textContent = w;
          },
          undefined,
          i === 0 ? 0.15 : 0.15 + i * step
        );
      });

      tl.fromTo(
        word,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.15
      );

      // Counter is written straight to the node, not through state.
      const progress = { v: 0 };
      tl.to(
        progress,
        {
          v: 100,
          duration: PRELOADER_EXIT - 0.9,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
            }
          },
        },
        0.15
      );

      // Exit.
      tl.to([word, count], { opacity: 0, duration: 0.3 }, PRELOADER_EXIT - 0.75);
      tl.to(
        root,
        { y: "-100dvh", duration: 0.9, ease: "power4.inOut" },
        PRELOADER_EXIT - 0.6
      );
      tl.to(
        path,
        { attr: { d: flat() }, duration: 0.7, ease: "power4.inOut" },
        PRELOADER_EXIT - 0.6
      );
    }, root);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
    >
      {/* The curve hangs below the viewport and flattens as the sheet lifts. */}
      <svg
        className="absolute top-0 left-0 w-full"
        style={{ height: "calc(100% + 320px)" }}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} fill="#050505" />
      </svg>

      <span
        ref={wordRef}
        className="relative z-[1] text-2xl tracking-tight tabular-nums text-fg sm:text-3xl"
      >
        {WORDS[0]}
      </span>

      <span
        ref={countRef}
        className="absolute right-6 bottom-6 z-[1] text-xs tracking-[0.2em] text-fg-faint sm:right-10 sm:bottom-8"
      >
        000
      </span>
    </div>
  );
}
