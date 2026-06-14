"use client";

import { useRef, useState } from "react";
import { SequenceCanvas } from "@/components/sequence-canvas";
import type { Scene } from "@/lib/scenes";

const ACCENT: Record<Scene["accent"], string> = {
  vermilion: "text-vermilion",
  sakura: "text-sakura",
  gold: "text-gold",
};

export function StoryScene({ scene, last = false }: { scene: Scene; last?: boolean }) {
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);
  const right = scene.align === "right";

  // Each beat owns a scroll zone; the visible beat flips at thresholds while the
  // MOTION runs on a CSS-transition clock — smooth regardless of scroll velocity.
  // (Matches the robo-site "turn" section's directional reveal.)
  const zones = scene.beats.map((_, i) => {
    const span = 0.8 / scene.beats.length; // leave 0.1 head + 0.1 tail for the scene fade
    return { show: 0.1 + i * span, hide: 0.1 + (i + 1) * span };
  });

  const onProgress = (p: number) => {
    const idx = zones.findIndex((z) => p >= z.show && p < z.hide);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  };

  return (
    <SequenceCanvas
      id={scene.id}
      name={scene.seq}
      frames={scene.frames}
      poster={scene.poster}
      heightVh={360}
      onProgress={onProgress}
      overlapTop
      fadeOut={!last}
    >
      <div
        className={`absolute inset-0 ${
          right
            ? "bg-gradient-to-l from-ink/85 via-ink/25 to-transparent"
            : "bg-gradient-to-r from-ink/85 via-ink/25 to-transparent"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />

      <span
        className={`writing-vertical pointer-events-none absolute top-1/2 -translate-y-1/2 font-jp text-[22vh] leading-none text-washi/[0.06] ${
          right ? "left-[6vw]" : "right-[6vw]"
        }`}
        aria-hidden
      >
        {scene.kanji}
      </span>

      <div
        className={`absolute inset-y-0 flex w-full max-w-[40rem] flex-col justify-center gap-6 px-[var(--space-gutter)] ${
          right ? "right-0 items-end text-right" : "left-0 items-start text-left"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm tracking-[0.3em] text-washi/60">
            {scene.index}
          </span>
          <span className="h-px w-12 bg-washi/30" />
          <span className={`font-jp text-lg ${ACCENT[scene.accent]}`} aria-hidden>
            {scene.kanji}
          </span>
        </div>

        <h2 className="w-full font-display text-[length:var(--text-h2)] font-medium leading-[0.95] text-washi [text-wrap:balance]">
          {scene.title}
        </h2>

        <div className="relative w-full max-w-[44ch] min-h-[9rem]">
          {scene.beats.map((b, i) => (
            <div
              key={b.k}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                i === active
                  ? "translate-y-0 opacity-100"
                  : i < active || active === -1
                    ? "pointer-events-none -translate-y-8 opacity-0"
                    : "pointer-events-none translate-y-8 opacity-0"
              }`}
            >
              <span
                className={`mb-2 block font-mono text-eyebrow uppercase tracking-[0.35em] ${ACCENT[scene.accent]}`}
              >
                {b.k}
              </span>
              <p className="text-[length:var(--text-body)] leading-relaxed text-washi/85">
                {b.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SequenceCanvas>
  );
}
