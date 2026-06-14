"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { SequenceCanvas } from "@/components/sequence-canvas";
import { usePreload } from "@/lib/store";
import { HERO } from "@/lib/scenes";

export function Hero() {
  const copy = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  // Title entrance plays once, after the loader curtain lifts (usePreload.ready).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // no line-mask: the tight leading clips descenders (the "g") when masked.
        const split = SplitText.create(".hero-title", { type: "lines" });
        gsap.set(split.lines, { yPercent: 110, opacity: 0 });
        gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });

        const play = () => {
          gsap
            .timeline({ delay: 0.4 })
            .to(split.lines, {
              yPercent: 0,
              opacity: 1,
              stagger: 0.12,
              duration: 1.1,
              ease: "power4.out",
            })
            .to(
              ".hero-fade",
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.9,
                ease: "power3.out",
              },
              "-=0.7"
            );
        };

        if (usePreload.getState().ready) play();
        else {
          const unsub = usePreload.subscribe((s) => {
            if (s.ready) {
              unsub();
              play();
            }
          });
          return () => unsub();
        }
      });
    },
    { scope: copy }
  );

  // Exit fades follow the LERPED scroll directly (one smoothing layer, direct DOM).
  const onProgress = (p: number) => {
    if (hint.current) {
      hint.current.style.opacity = String(Math.max(0, 1 - p / 0.06));
    }
    if (copy.current) {
      const t = Math.min(1, Math.max(0, (p - 0.5) / 0.35));
      copy.current.style.opacity = String(1 - t);
      copy.current.style.transform = `translateY(${-30 * t}vh)`;
    }
  };

  return (
    <SequenceCanvas
      id="top"
      name={HERO.seq}
      frames={HERO.frames}
      poster={HERO.poster}
      heightVh={420}
      onProgress={onProgress}
      fadeIn={false}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/5 to-ink" />

      <div
        ref={copy}
        className="absolute inset-0 flex flex-col items-center justify-center px-[var(--space-gutter)] text-center"
      >
        <span className="hero-fade mb-6 font-mono text-eyebrow uppercase tracking-[0.5em] text-sakura">
          花見 · Hanami
        </span>
        <h1 className="hero-title font-display text-[length:var(--text-display)] font-medium leading-[0.92] tracking-tight text-washi [text-wrap:balance]">
          Chasing
          <br />
          the Blossom
        </h1>
        <p className="hero-fade mt-8 max-w-[42ch] text-balance text-[length:var(--text-body)] leading-relaxed text-washi/75">
          A cinematic descent through Japan&apos;s fleeting spring — from the
          torii&apos;s threshold to the mountain&apos;s crown.
        </p>
      </div>

      <div
        ref={hint}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-washi"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.4em] opacity-70">
          Scroll
        </span>
        <span className="block h-12 w-px overflow-hidden bg-washi/20">
          <span className="block h-1/2 w-full animate-[cue_1.8s_ease-in-out_infinite] bg-vermilion" />
        </span>
        <style>{`@keyframes cue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
      </div>
    </SequenceCanvas>
  );
}
