"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { usePreload } from "@/lib/store";

// Canvas is dynamic-imported with ssr:false → no "window is not defined" crash,
// and the WebGL bundle stays out of the first paint (LCP never waits for WebGL).
const PetalField = dynamic(() => import("./petal-field"), { ssr: false });

type Cfg = { count: number; reduce: boolean; dpr: number };

export function SceneMount() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [shown, setShown] = useState(false);
  // Petals belong to the cinematic image-sequence scenes only. `active` flips off at
  // the first non-sequence section (#interlude) so the interlude / gallery / practice /
  // CTA scroll free of petals — and the R3F loop freezes there (see PetalField).
  const [active, setActive] = useState(true);
  const ready = usePreload((s) => s.ready);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPower = mem !== undefined && mem <= 4;
    // tier the particle count by device capability (trimmed for a lighter loop)
    const count = reduce ? 60 : mobile ? 130 : lowPower ? 200 : 300;
    setCfg({ count, reduce, dpr: mobile ? 1.25 : 1.5 });
  }, []);

  // Once the loader lifts (keeps WebGL off the critical load path): fade the field in,
  // and gate it to the frame scenes — freeze + hide it from #interlude onward.
  useEffect(() => {
    if (!ready) return;
    const raf = requestAnimationFrame(() => setShown(true));
    const interlude = document.getElementById("interlude");
    const st = interlude
      ? ScrollTrigger.create({
          trigger: interlude,
          start: "top 85%",
          onEnter: () => setActive(false),
          onLeaveBack: () => setActive(true),
        })
      : null;
    return () => {
      cancelAnimationFrame(raf);
      st?.kill();
    };
  }, [ready]);

  if (!ready || !cfg) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-700 ease-out"
      style={{ opacity: active && shown ? 1 : 0, willChange: "opacity" }}
      aria-hidden
    >
      <PetalField count={cfg.count} reduce={cfg.reduce} dpr={cfg.dpr} active={active} />
    </div>
  );
}
