"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  /** Filled inverts to a white surface with black label. */
  variant?: "outline" | "filled";
  className?: string;
}

/* ---------------------------------------------------------------------------
   Primary CTA.

   The pull is feedback: it confirms the cursor has acquired the target before
   the click. Driven by motion values so the pointer never re-renders React,
   and collapsed entirely under reduced motion.
--------------------------------------------------------------------------- */
export default function MagneticButton({
  href,
  children,
  variant = "outline",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 190, damping: 16, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Travel is capped at a third of the offset so the button stays anchored
    // to its layout slot.
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.32);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.32);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const filled = variant === "filled";

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { x: sx, y: sy }}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-fg px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-500 active:scale-[0.98] ${
        filled ? "bg-fg text-bg" : "bg-transparent text-fg hover:text-bg"
      } ${className}`}
    >
      {/* Wipe fill. Outline variant only: the filled variant is already solid. */}
      {!filled && (
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 motion-reduce:hidden"
        />
      )}
      <span className="relative">{children}</span>
      <ArrowUpRight
        size={15}
        weight="bold"
        className="relative shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </motion.a>
  );
}
