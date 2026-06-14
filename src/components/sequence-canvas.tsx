"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useFrameSequence } from "@/lib/use-frame-sequence";
import { usePreload } from "@/lib/store";

const subscribeMedia = (cb: () => void) => {
  const a = matchMedia("(min-width: 768px)");
  const b = matchMedia("(prefers-reduced-motion: reduce)");
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
};
const getMediaSnapshot = () =>
  matchMedia("(min-width: 768px)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Props {
  id?: string;
  name: string; // sequence folder under /sequences
  frames: number;
  poster: string; // LCP poster; also the mobile / reduced-motion art
  heightVh?: number; // tall-section scroll runway (sticky architecture)
  /** Scroll progress 0..1 every tick — threshold overlays + direct-DOM fades. */
  onProgress?: (p: number) => void;
  /** Cross-dissolve at the scene edges (no hard cuts). */
  fadeIn?: boolean;
  fadeOut?: boolean;
  /** Pull this section up over the previous one so both pin at once and crossfade. */
  overlapTop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Adjacent scenes overlap so two sticky canvases are full-screen-pinned at the
// same time, then cross-dissolve — a true "one video fades into the next" handoff
// (no seam, no black). The overlap must exceed one viewport (100vh) for both to be
// pinned simultaneously; the surplus (CROSS_VH) is the cross-dissolve window.
const CROSS_VH = 65;
const OVERLAP_VH = 100 + CROSS_VH;

export function SequenceCanvas({
  id,
  name,
  frames,
  poster,
  heightVh = 400,
  onProgress,
  fadeIn = true,
  fadeOut = true,
  overlapTop = false,
  className,
  children,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sticky = useRef<HTMLDivElement>(null);

  // The dissolve spans the simultaneously-pinned window, expressed as a fraction
  // of THIS scene's scroll runway (heightVh − one viewport).
  const fadeFrac = Math.min(0.5, Math.max(0.05, CROSS_VH / (heightVh - 100)));

  // Crossfade the whole scene so one video dissolves into the next while both are
  // full-screen-pinned. Runs on the scroll tick (direct DOM, no React state).
  const handleProgress = (p: number) => {
    const el = sticky.current;
    if (el) {
      let o = 1;
      if (fadeIn) o = Math.min(o, p / fadeFrac);
      if (fadeOut) o = Math.min(o, (1 - p) / fadeFrac);
      el.style.opacity = String(Math.max(0, Math.min(1, o)));
    }
    onProgress?.(p);
  };
  const report = usePreload((s) => s.report);
  // full tier = desktop + motion OK; SSR snapshot false (poster tier first paint)
  const enabled = useSyncExternalStore(
    subscribeMedia,
    getMediaSnapshot,
    () => false
  );

  useEffect(() => {
    if (!enabled) report(name, 1); // poster tier loads nothing
  }, [enabled, name, report]);

  const framePath = useCallback(
    (i: number) =>
      `/sequences/${name}/frame_${String(i).padStart(4, "0")}.webp`,
    [name]
  );
  const onLoadProgress = useCallback(
    (p: number) => report(name, p),
    [name, report]
  );

  const { loaded } = useFrameSequence({
    sectionRef: section,
    canvasRef: canvas,
    frameCount: frames,
    framePath,
    onProgress: handleProgress,
    enabled,
    onLoadProgress,
    eagerCount: Math.min(80, frames), // interactive fast; rest streams behind
  });

  return (
    <section
      id={id}
      ref={section}
      style={{
        height: enabled ? `${heightVh}vh` : "100dvh",
        marginTop: enabled && overlapTop ? `-${OVERLAP_VH}vh` : undefined,
      }}
      className={className}
    >
      <div
        ref={sticky}
        className="sticky top-0 h-dvh overflow-hidden"
        style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- intentional plain img: LCP poster under the canvas */}
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <canvas
          ref={canvas}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ willChange: "contents" }}
        />
        {/* cinematic vignette, anchored to the viewport-sized sticky wrapper */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 95% at 50% 42%, transparent 38%, rgba(7,5,9,0.55) 88%, rgba(7,5,9,0.82) 100%)",
          }}
          aria-hidden
        />
        {children}
      </div>
    </section>
  );
}
