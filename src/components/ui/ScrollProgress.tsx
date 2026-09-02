"use client";

import { motion, useScroll, useSpring } from "motion/react";

/* ---------------------------------------------------------------------------
   Reading position indicator. On a page built almost entirely from pinned and
   scrubbed sections, the native scrollbar stops being a reliable signal of how
   far through the page you are, so this restores that.
--------------------------------------------------------------------------- */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-40 h-px origin-left bg-fg"
    />
  );
}
