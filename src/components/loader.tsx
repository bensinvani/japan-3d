"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { usePreload } from "@/lib/store";

// Branded loader with REAL progress — mirrors the hero frame-sequence eager load,
// then reveals with a vertical curtain and flips usePreload.ready (hero entrance).
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  // displayed % eases toward the real "hero" preload progress
  useEffect(() => {
    const shown = { v: 0 };
    const apply = (s: { progress: Record<string, number> }) => {
      const real = Math.round((s.progress["hero"] ?? 0) * 100);
      gsap.to(shown, {
        v: real,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => setPct(Math.round(shown.v)),
      });
    };
    apply(usePreload.getState());
    return usePreload.subscribe(apply);
  }, []);

  useGSAP(
    () => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        setPct(100);
        gsap
          .timeline({
            onComplete: () => {
              setDone(true);
              usePreload.getState().setReady();
              ScrollTrigger.refresh();
            },
          })
          .to(".loader-num, .loader-brand, .loader-bar", {
            autoAlpha: 0,
            y: -20,
            duration: 0.6,
            ease: "power2.in",
            stagger: 0.05,
          })
          .to(
            ".loader-panel",
            {
              scaleY: 0,
              transformOrigin: "top",
              duration: 0.9,
              ease: "power4.inOut",
              stagger: 0.08,
            },
            "-=0.2"
          )
          .set(root.current, { display: "none" });
      };

      const check = (s: { progress: Record<string, number> }) => {
        if ((s.progress["hero"] ?? 0) >= 1) finish();
      };
      check(usePreload.getState());
      const unsub = usePreload.subscribe(check);
      // safety net: never trap the user behind a stalled sequence
      const safety = window.setTimeout(finish, 9000);

      return () => {
        unsub();
        window.clearTimeout(safety);
      };
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <div className="loader-panel absolute inset-y-0 left-0 w-1/2 bg-ink" />
      <div className="loader-panel absolute inset-y-0 right-0 w-1/2 bg-ink" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="loader-brand flex flex-col items-center gap-3">
          <span className="font-jp text-4xl text-sakura">花見</span>
          <span className="font-display text-2xl font-semibold tracking-[0.3em] text-washi">
            HANAMI
          </span>
        </div>

        <div className="loader-bar h-px w-44 overflow-hidden bg-washi/15">
          <div
            className="h-full bg-vermilion transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <span className="loader-num font-mono text-xs tracking-[0.3em] text-muted-foreground">
          {String(pct).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
