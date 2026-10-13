import { gsap } from "gsap";

// One import site for GSAP, so the timeline in the opening sequence and
// anything added later share a single instance. Scroll-linked motion on this
// page runs on Motion's scroll values, not ScrollTrigger: nothing is pinned,
// and those values re-measure on their own when a project panel opens and the
// page below it moves.

// The opening sequence holds the page until it has played, so it has to run
// on the wall clock. With lag smoothing on, a browser that is only painting
// now and then (a window behind another one, a machine under load) would
// stretch a three-second sequence into minutes.
gsap.ticker.lagSmoothing(0);

export { gsap };
