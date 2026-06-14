"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Canvas is dynamic-imported with ssr:false → no "window is not defined" crash,
// and the WebGL bundle stays out of the first paint (LCP never waits for WebGL).
const PetalField = dynamic(() => import("./petal-field"), { ssr: false });

export function SceneMount() {
  const [cfg, setCfg] = useState<{
    show: boolean;
    count: number;
    reduce: boolean;
    dpr: number;
  } | null>(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // tier the particle count by device capability
    const lowPower =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
    const count = reduce ? 70 : mobile ? 150 : lowPower ? 240 : 360;
    setCfg({ show: true, count, reduce, dpr: mobile ? 1.25 : 1.5 });
  }, []);

  if (!cfg?.show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 animate-[fadein_1.4s_ease-out_forwards] opacity-0"
      aria-hidden
      style={{ willChange: "contents" }}
    >
      <PetalField count={cfg.count} reduce={cfg.reduce} dpr={cfg.dpr} />
      <style>{`@keyframes fadein{to{opacity:1}}`}</style>
    </div>
  );
}
