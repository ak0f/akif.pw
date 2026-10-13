"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/** Gap between two frames, as a share of one frame's height. */
const GAP = 0.035;
/** Share of the scroll range the reel rests on each frame. */
const HOLD = 0.2;

interface ReelProps {
  frames: string[];
  href: string;
  /** Accessible name of the link, e.g. "Visit SLIDE Agentur". */
  label: string;
  /** Word shown in the pointer label, e.g. "Visit". */
  cursorLabel: string;
}

/* ---------------------------------------------------------------------------
   Project reel.

   A window onto the real site. The frames are stacked into one strip behind a
   16:10 opening, and scrolling the page winds the strip through it: the reel
   rests on a frame, glides to the next, rests again. So moving down the page
   is also moving down the project, and each screen holds still long enough to
   be looked at.

   The window is sticky inside a taller track, so it stays centred on screen
   for as long as it takes to wind through its frames and then lets go. That
   is plain CSS: the page keeps scrolling at its own speed and nothing is
   hijacked. Two scroll ranges drive the motion on top of it. The first grows
   the window into place as it enters; the second winds the strip while the
   window is held. The geometry lives in globals.css under `.reel`.

   The window is a link. Over it, a fine pointer becomes a label saying what a
   click does, which is the hover state: nothing scales or lifts.
--------------------------------------------------------------------------- */
export default function Reel({ frames, href, label, cursorLabel }: ReelProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const count = frames.length;

  const { scrollYProgress: entering } = useScroll({
    target: ref,
    offset: ["start end", "start 0.45"],
  });
  const scale = useTransform(entering, [0, 1], [0.93, 1]);

  const { scrollYProgress: crossing } = useScroll({
    target: ref,
    // Inside the held phase on a phone, a little ahead of it on a desktop,
    // where the first rest absorbs the difference.
    offset: ["start 0.2", "end 0.8"],
  });

  // Rest, travel, rest. Each frame gets a HOLD-wide plateau and the travel
  // shares out what is left.
  const stops: number[] = [];
  const offsets: number[] = [];
  const stripHeight = count + (count - 1) * GAP;
  const travel = count > 1 ? (1 - HOLD * count) / (count - 1) : 0;
  for (let i = 0; i < count; i++) {
    const start = i * (HOLD + travel);
    // Percent of the strip's own height that brings frame i into the window.
    const position = (-i * (1 + GAP) * 100) / stripHeight;
    stops.push(start, start + HOLD);
    offsets.push(position, position);
  }

  const wound = useTransform(crossing, stops, offsets);
  const eased = useSpring(wound, { stiffness: 110, damping: 26, mass: 0.6 });
  const y = useTransform(eased, (value) => `${value}%`);

  // Pointer label.
  const [hovering, setHovering] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const lx = useSpring(px, { stiffness: 460, damping: 36, mass: 0.5 });
  const ly = useSpring(py, { stiffness: 460, damping: 36, mass: 0.5 });

  const locate = (e: PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onEnter = (e: PointerEvent<HTMLAnchorElement>) => {
    // Only a mouse has a cursor to replace.
    if (reduce || e.pointerType !== "mouse") return;
    const at = locate(e);
    // Start the label where the pointer came in, not where it last left.
    lx.jump(at.x);
    ly.jump(at.y);
    px.set(at.x);
    py.set(at.y);
    setHovering(true);
  };

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!hovering) return;
    const at = locate(e);
    px.set(at.x);
    py.set(at.y);
  };

  const animated = !reduce && count > 1;

  return (
    <div ref={ref} className="reel">
      <motion.div
        style={reduce ? undefined : { scale }}
        className={`origin-top will-change-transform ${
          animated ? "reel-held" : ""
        }`}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          // The same destination is one tab stop earlier, on the visit link.
          tabIndex={-1}
          onPointerEnter={onEnter}
          onPointerMove={onMove}
          onPointerLeave={() => setHovering(false)}
          className={`reel-window relative block overflow-hidden rounded-media bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-white/10 after:ring-inset ${
            hovering ? "cursor-none" : ""
          }`}
        >
          {/* The strip is as tall as all its frames and gaps together, in
              units of the window, and each frame is placed inside it by
              percentage, so the layout holds whatever height the window
              ends up with. */}
          <motion.div
            style={{
              height: `${(animated ? stripHeight : 1) * 100}%`,
              ...(animated ? { y } : null),
            }}
            className="absolute inset-x-0 top-0 will-change-transform"
          >
            {(animated ? frames : frames.slice(0, 1)).map((src, i) => (
              <div
                key={src}
                className="absolute inset-x-0"
                style={
                  animated
                    ? {
                        top: `${((i * (1 + GAP)) / stripHeight) * 100}%`,
                        height: `${100 / stripHeight}%`,
                      }
                    : { top: 0, height: "100%" }
                }
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1400px) 1320px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </motion.div>

          <motion.span
            aria-hidden="true"
            style={{ x: lx, y: ly }}
            className="pointer-events-none absolute top-0 left-0 z-10"
          >
            <motion.span
              initial={false}
              animate={{
                scale: hovering ? 1 : 0.5,
                opacity: hovering ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="flex h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-fg px-5 text-[0.9375rem] font-medium whitespace-nowrap text-bg"
            >
              {cursorLabel}
              <ArrowUpRight size={15} weight="bold" />
            </motion.span>
          </motion.span>
        </a>
      </motion.div>

      {/* The rest of the track: the scroll distance the window is held for. */}
      {animated && (
        <div
          aria-hidden="true"
          className="reel-run"
          style={{ "--steps": count - 1 } as CSSProperties}
        />
      )}
    </div>
  );
}
