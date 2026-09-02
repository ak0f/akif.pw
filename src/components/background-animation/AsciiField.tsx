"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion, useScroll } from "motion/react";

/* ---------------------------------------------------------------------------
   Fixed full-bleed ASCII field.

   A single fullscreen quad renders a domain-warped fBm field, quantises it per
   character cell into a density index, and samples that index out of a glyph
   atlas baked on a 2D canvas. The result is real ASCII art generated on the
   GPU rather than a grid of DOM nodes, so it stays at 60fps while every
   section scrolls over the top of it.

   Scroll progress and pointer position both feed the field, which is what ties
   the background to the page instead of leaving it as ambient wallpaper.
--------------------------------------------------------------------------- */

// Ordered low density to high density. The leading space is deliberate: it
// gives the field negative space instead of a wall of solid glyphs.
const RAMP = " .,:;=+*#%@";
const TILE = 32; // px per glyph tile in the atlas
const CELL_CSS = 13; // on-screen size of one character cell, in CSS px
const MAX_DPR = 1.5;

function buildGlyphAtlas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TILE * RAMP.length;
  canvas.height = TILE;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Glyphs sit at ~70% of the tile so the empty margin absorbs any linear
  // filtering bleed between neighbouring tiles at sample time.
  ctx.font = `${Math.round(TILE * 0.72)}px ui-monospace, "SF Mono", Menlo, monospace`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < RAMP.length; i++) {
    ctx.fillText(RAMP[i], i * TILE + TILE / 2, TILE / 2 + 1);
  }

  return canvas;
}

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2      uResolution;
  uniform float     uTime;
  uniform vec2      uPointer;
  uniform float     uScroll;
  uniform float     uCell;
  uniform float     uGlyphCount;
  uniform float     uIntensity;
  uniform sampler2D uAtlas;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Snap to the character grid, then work from the centre of each cell so
    // every glyph in a cell shares one density value.
    vec2 cell       = floor(gl_FragCoord.xy / uCell);
    vec2 inCell     = fract(gl_FragCoord.xy / uCell);
    vec2 cellCentre = (cell + 0.5) * uCell;

    // Aspect-correct field coordinates.
    vec2 p = cellCentre / uResolution.y;

    float t = uTime * 0.05;

    // Two rounds of domain warping. This is what gives the field its slow
    // marbled drift instead of reading as flat animated noise.
    vec2 q = vec2(
      fbm(p * 2.1 + t),
      fbm(p * 2.1 + vec2(5.2, 1.3) - t)
    );
    vec2 r = vec2(
      fbm(p * 2.1 + 2.6 * q + vec2(1.7, 9.2) + t * 1.3),
      fbm(p * 2.1 + 2.6 * q + vec2(8.3, 2.8) - t * 1.1)
    );
    float f = fbm(p * 2.1 + 2.6 * r);

    // Scroll drags the field and lifts its density, so the background visibly
    // responds to the page moving rather than looping independently.
    f += sin(p.y * 3.0 - uScroll * 6.2) * 0.10;
    f += uScroll * 0.10;

    // Pointer swell, plus concentric ripples travelling out of it. The field
    // is the surface the physics cursor is moving over, so it has to answer.
    float d = distance(cellCentre, uPointer) / uResolution.y;
    float halo = exp(-d * d * 6.0);
    f += 0.34 * halo;
    f += 0.12 * sin(d * 26.0 - uTime * 3.0) * halo;

    // Edge falloff keeps the frame quiet where content sits.
    vec2 ndc = cellCentre / uResolution;
    float vignette = smoothstep(0.0, 0.42, ndc.x) * smoothstep(1.0, 0.58, ndc.x)
                   * smoothstep(0.0, 0.38, ndc.y) * smoothstep(1.0, 0.62, ndc.y);
    vignette = 0.55 + 0.45 * vignette;

    float density = clamp(f, 0.0, 1.0);
    // Gamma below the midpoint pushes more cells into the middle of the ramp,
    // so the field resolves as characters rather than as mostly blank space.
    density = pow(density, 1.15);

    float index = min(floor(density * uGlyphCount), uGlyphCount - 1.0);
    vec2 atlasUv = vec2((index + inCell.x) / uGlyphCount, 1.0 - inCell.y);

    float glyph = texture2D(uAtlas, atlasUv).r;

    // Denser glyphs also read brighter, which gives the field depth rather
    // than a uniform sheet of characters.
    float shade = glyph * (0.38 + 0.62 * density) * vignette * uIntensity;

    gl_FragColor = vec4(vec3(shade), shade);
  }
`;

export default function AsciiField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  // Continuous values are written to refs, never React state, so scrolling and
  // pointer movement never re-render the tree.
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      // No WebGL. The section backgrounds below still read fine on their own.
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const atlas = new THREE.CanvasTexture(buildGlyphAtlas());
    atlas.minFilter = THREE.LinearFilter;
    atlas.magFilter = THREE.LinearFilter;
    atlas.generateMipmaps = false;
    atlas.wrapS = THREE.ClampToEdgeWrapping;
    atlas.wrapT = THREE.ClampToEdgeWrapping;

    const uniforms = {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
      },
      uTime: { value: 0 },
      uPointer: {
        value: new THREE.Vector2(window.innerWidth * dpr * 0.5, window.innerHeight * dpr * 0.5),
      },
      uScroll: { value: 0 },
      uCell: { value: CELL_CSS * dpr },
      uGlyphCount: { value: RAMP.length },
      uIntensity: { value: 0 },
      uAtlas: { value: atlas },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };

    const onPointerMove = (e: PointerEvent) => {
      // Flip Y: pointer events are top-left origin, gl_FragCoord is bottom-left.
      pointerRef.current.tx = e.clientX * dpr;
      pointerRef.current.ty = (window.innerHeight - e.clientY) * dpr;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    let running = true;
    const started = performance.now();

    const TARGET_INTENSITY = 0.92;

    const renderFrame = () => {
      const p = pointerRef.current;
      // Ease the pointer so the swell trails the cursor instead of snapping.
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      uniforms.uPointer.value.set(p.x, p.y);
      uniforms.uScroll.value = scrollRef.current;
      uniforms.uTime.value = (performance.now() - started) / 1000;
      renderer.render(scene, camera);
    };

    if (reduce) {
      // Static single frame: no loop, no drift, no pointer tracking.
      uniforms.uIntensity.value = TARGET_INTENSITY;
      uniforms.uTime.value = 12;
      renderer.render(scene, camera);
    } else {
      const loop = () => {
        if (!running) return;
        // Fade the field up on first paint so it resolves rather than pops.
        uniforms.uIntensity.value +=
          (TARGET_INTENSITY - uniforms.uIntensity.value) * 0.02;
        renderFrame();
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(function loop() {
          if (!running) return;
          renderFrame();
          frame = requestAnimationFrame(loop);
        });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      atlas.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [reduce]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-bg [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
