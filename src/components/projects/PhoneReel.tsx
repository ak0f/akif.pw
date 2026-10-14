"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { MOBILE_VIEWPORT, type MobileCapture } from "@/data/projects";

/** Share of the held range the screen rests at the top, and again at the end. */
const REST = 0.1;

interface PhoneReelProps {
  capture: MobileCapture;
  href: string;
  /** Accessible name of the link, e.g. "Visit SLIDE Agentur". */
  label: string;
}

/* ---------------------------------------------------------------------------
   The project on a phone, as a phone.

   On a small screen the desktop frames shrink to the size of a stamp, so a
   phone visitor gets the site the way they would actually use it: the phone
   version, in a phone, scrolling. The capture is one tall image of the site's
   mobile layout; the phone is held in the middle of the screen while the page
   scrolls, and the site scrolls inside it, resting on its first screen before
   it starts and on its last before it lets go.

   Same mechanics as the desktop reel: a sticky element inside a taller track,
   and a transform on a spring. Nothing is pinned by script.
--------------------------------------------------------------------------- */
export default function PhoneReel({ capture, href, label }: PhoneReelProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress: entering } = useScroll({
    target: ref,
    offset: ["start end", "start 0.5"],
  });
  const scale = useTransform(entering, [0, 1], [0.9, 1]);
  const lift = useTransform(entering, [0, 1], [0.35, 1]);

  const { scrollYProgress: held } = useScroll({
    target: ref,
    offset: ["start 0.15", "end 0.85"],
  });

  // How far the image has to travel, as a share of its own height, for its
  // last screen to end at the bottom of the phone.
  const screenRatio = MOBILE_VIEWPORT.height / MOBILE_VIEWPORT.width;
  const stripRatio = capture.height / capture.width;
  const travel = Math.max(0, (1 - screenRatio / stripRatio) * 100);

  const scrolled = useTransform(held, [0, REST, 1 - REST, 1], [0, 0, -travel, -travel]);
  const eased = useSpring(scrolled, { stiffness: 120, damping: 28, mass: 0.5 });
  const y = useTransform(eased, (value) => `${value}%`);

  const animated = !reduce && travel > 0;

  return (
    <div ref={ref} className="phone-reel">
      <motion.div
        style={reduce ? undefined : { scale, opacity: lift }}
        className={`flex justify-center ${animated ? "phone-held" : ""}`}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          // The same destination is one tab stop earlier, on the visit link.
          tabIndex={-1}
          className="phone-body block"
        >
          <span className="phone-screen relative block overflow-hidden bg-surface">
            <motion.span
              style={animated ? { y } : undefined}
              className="absolute inset-x-0 top-0 block will-change-transform"
            >
              <Image
                src={capture.src}
                alt=""
                width={capture.width}
                height={capture.height}
                sizes="(max-width: 767px) 70vw, 19rem"
                className="block h-auto w-full"
              />
            </motion.span>
          </span>
        </a>
      </motion.div>

      {animated && <div aria-hidden="true" className="phone-run" />}
    </div>
  );
}
