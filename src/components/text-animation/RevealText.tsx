"use client";

import { createElement, Fragment, type ElementType } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

interface RevealTextProps {
  /** A string reveals word by word. An array reveals line by line. */
  text: string | string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "inView";
}

/* ---------------------------------------------------------------------------
   Masked reveal used for the section headings.

   Display headlines pass an array so each line clears its own mask, which
   reads far better at 10vw than words popping individually. Body-scale
   headings pass a string and reveal per word.
--------------------------------------------------------------------------- */
export default function RevealText({
  text,
  as = "p",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.07,
  trigger = "inView",
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const byLine = Array.isArray(text);
  const parts = byLine ? text : text.split(" ");

  if (reduce) {
    return createElement(
      as,
      { className },
      byLine
        ? (text as string[]).map((line, i) => (
            <span key={i} className={`block ${lineClassName ?? ""}`}>
              {line}
            </span>
          ))
        : text
    );
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: { y: "112%" },
    visible: {
      y: "0%",
      transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const viewportProps =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.5 },
        };

  return createElement(
    as,
    { className },
    <motion.span
      variants={container}
      {...viewportProps}
      className={byLine ? "block" : "inline"}
    >
      {parts.map((part, i) => (
        <Fragment key={i}>
          <span
            className={
              byLine
                ? `line-mask block ${lineClassName ?? ""}`
                : "line-mask inline-block align-bottom"
            }
          >
            <motion.span variants={child} className="inline-block">
              {part}
            </motion.span>
          </span>
          {/* The word space sits between the masks. Inside one it would be
              trailing whitespace in an inline-block, which collapses. */}
          {!byLine && i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
