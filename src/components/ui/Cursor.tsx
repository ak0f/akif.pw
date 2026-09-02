"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

/* ---------------------------------------------------------------------------
   Physics cursor.

   A dot on a stiff spring tracks the pointer almost exactly, while a ring on a
   much looser spring trails behind it. Because the ring lags, it carries real
   velocity, and that velocity drives squash and stretch along the direction of
   travel: the ring elongates into a lozenge when thrown across the screen and
   rounds out as it settles. Over interactive elements it opens up and the dot
   drops out, so the cursor reports what is clickable.

   Only mounts for fine pointers with motion enabled, and the native cursor is
   hidden from script, so a touch device, a reduced-motion visitor, or a
   no-JavaScript visitor all keep the normal system cursor.
--------------------------------------------------------------------------- */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [reduce]);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // Two masses on the same input. The gap between them is the whole effect.
  const dotX = useSpring(x, { stiffness: 1500, damping: 65, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1500, damping: 65, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 210, damping: 21, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 210, damping: 21, mass: 0.7 });

  const vx = useVelocity(ringX);
  const vy = useVelocity(ringY);

  // Last travel direction is held so the ring does not snap back to 0deg
  // whenever it momentarily stops.
  const angle = useRef(0);
  const rotate = useTransform<number, number>([vx, vy], ([a, b]) => {
    if (Math.hypot(a, b) > 70) {
      angle.current = (Math.atan2(b, a) * 180) / Math.PI;
    }
    return angle.current;
  });

  const stretch = useTransform<number, number>([vx, vy], ([a, b]) =>
    Math.min(Math.hypot(a, b) / 2000, 0.55)
  );
  const scaleX = useTransform(stretch, (s) => 1 + s);
  const scaleY = useTransform(stretch, (s) => 1 - s * 0.72);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      setHovering(
        !!target?.closest?.("a, button, [data-cursor-hover]")
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] mix-blend-difference">
      {/* Trailing ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.div
          animate={{ scale: hovering ? 2.3 : 1, opacity: visible ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="-mt-5 -ml-5 h-10 w-10"
        >
          <motion.div
            style={{ rotate, scaleX, scaleY }}
            className="h-full w-full rounded-full border border-fg"
          />
        </motion.div>
      </motion.div>

      {/* Leading dot */}
      <motion.div style={{ x: dotX, y: dotY }} className="absolute top-0 left-0">
        <motion.div
          animate={{ scale: hovering ? 0 : 1, opacity: visible ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="-mt-[3px] -ml-[3px] h-1.5 w-1.5 rounded-full bg-fg"
        />
      </motion.div>
    </div>
  );
}
