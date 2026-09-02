"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%@";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Milliseconds each character stays scrambled before locking in. */
  speed?: number;
}

/* ---------------------------------------------------------------------------
   Character decode, resolving left to right.

   This is the one effect on the page that exists purely to echo the ASCII
   background, so it is reserved for the small mono labels rather than applied
   to body copy. Text is written straight to the DOM node: running a decode
   through React state would re-render on every frame.
--------------------------------------------------------------------------- */
export default function ScrambleText({
  text,
  className,
  speed = 28,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (reduce) {
      node.textContent = text;
      return;
    }

    let settled = 0;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now;
        settled += 1;
      }

      const locked = Math.min(Math.floor(settled / 2), text.length);
      let out = text.slice(0, locked);

      for (let i = locked; i < text.length; i++) {
        out += text[i] === " " ? " " : CHARS[(Math.random() * CHARS.length) | 0];
      }

      node.textContent = out;

      if (locked < text.length) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text, speed]);

  return (
    <span ref={ref} className={className}>
      {/* Server-rendered value is the resolved text, so the label is correct
          for crawlers and before hydration. */}
      {text}
    </span>
  );
}
