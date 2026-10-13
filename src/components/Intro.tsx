"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const SEEN_KEY = "akif-intro-seen";

declare global {
  interface Window {
    /** Set by the gate script in the root layout. */
    __introGate?: number;
  }
}

/* ---------------------------------------------------------------------------
   Opening sequence.

   The mark is "AK" and a square full stop, and the square is the one element
   of it that travels through the whole site. So the opening is that square's
   entrance: it appears alone, the letters arrive beside it, and then it flies
   out of the mark and lands as the full stop at the end of the greeting. The
   curtain and the first screen share an element instead of cutting from one
   to the other.

   The state lives on <html data-intro>, set before first paint by the gate
   script in the layout, so the hero never flashes ahead of the curtain. This
   component only moves that state forward: pending -> reveal -> done.

   It plays in full once per session. A second page load, or a reload half way
   down the page where there is no greeting on screen to land on, gets a short
   fade instead.
--------------------------------------------------------------------------- */
export default function Intro() {
  const veilRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const squareRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const state = html.dataset.intro;
    if (state !== "pending" && state !== "reveal") return;

    // From here this component owns the state, so the layout's safety timer
    // must not release the page half way through the sequence.
    window.clearTimeout(window.__introGate);

    const veil = veilRef.current;
    const lockup = lockupRef.current;
    const letters = lettersRef.current;
    const slot = slotRef.current;
    const square = squareRef.current;
    if (!veil || !lockup || !letters || !slot || !square) {
      html.dataset.intro = "done";
      return;
    }

    const finish = () => {
      html.dataset.intro = "done";
      document.body.style.overflow = "";
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode. The sequence simply plays again next time.
      }
    };

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }

    const target = document.querySelector<HTMLElement>("[data-hero-stop]");
    const rise = target?.closest<HTMLElement>(".intro-rise") ?? null;

    if (seen || state === "reveal" || window.scrollY > 24 || !target) {
      gsap.set(lockup, { autoAlpha: 0 });
      html.dataset.intro = "reveal";
      const fade = gsap.to(veil, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: finish,
      });
      return () => {
        fade.kill();
      };
    }

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // The flying square is fixed to the viewport and laid over its slot in
      // the mark, so it can leave the mark without the letters reflowing.
      const slotRect = slot.getBoundingClientRect();
      const lockupRect = lockup.getBoundingClientRect();
      gsap.set(square, {
        left: slotRect.left,
        top: slotRect.top,
        width: slotRect.width,
        height: slotRect.height,
        transformOrigin: "0 0",
      });

      // Shift that puts the square, on its own, at the centre of the screen.
      const centred =
        lockupRect.left +
        lockupRect.width / 2 -
        (slotRect.left + slotRect.width / 2);

      gsap.set([lockup, square], { x: centred });
      gsap.set(letters, { y: 0, yPercent: 110 });
      gsap.set(square, { opacity: 1, scale: 0, transformOrigin: "50% 50%" });

      // Where the square has to land. The greeting is still below its mask
      // at this point, so its current offset is taken back out.
      const flight = () => {
        const from = slot.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const lift = rise
          ? new DOMMatrixReadOnly(getComputedStyle(rise).transform).m42
          : 0;
        return {
          x: to.left - from.left,
          y: to.top - lift - from.top,
          scale: to.width / from.width,
        };
      };

      const tl = gsap.timeline({ onComplete: finish });

      tl.to(
        square,
        { scale: 1, duration: 0.7, ease: "back.out(2.6)" },
        0.2
      )
        .to(
          [lockup, square],
          { x: 0, duration: 0.85, ease: "expo.inOut" },
          0.75
        )
        .to(letters, { yPercent: 0, duration: 0.8, ease: "expo.out" }, 0.95)
        .addLabel("fly", 1.9)
        .set(square, { transformOrigin: "0 0" }, "fly")
        .call(
          () => {
            html.dataset.intro = "reveal";
          },
          undefined,
          "fly"
        )
        .to(
          letters,
          { yPercent: -110, duration: 0.55, ease: "expo.in" },
          "fly-=0.2"
        )
        .to(veil, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "fly")
        .to(
          square,
          {
            x: () => flight().x,
            y: () => flight().y,
            scale: () => flight().scale,
            duration: 1,
            ease: "expo.inOut",
          },
          "fly"
        );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div aria-hidden="true" className="intro">
      <div ref={veilRef} className="intro-veil" />
      <div className="intro-centre">
        <div ref={lockupRef} className="intro-lockup">
          <span className="intro-letters">
            <span ref={lettersRef}>AK</span>
          </span>
          <span ref={slotRef} className="intro-slot" />
        </div>
      </div>
      <span ref={squareRef} className="intro-square" />
    </div>
  );
}
