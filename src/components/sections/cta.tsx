"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { MagneticButton } from "../magnetic-button";

export function CTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const split = SplitText.create(".cta-title", { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.04,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: root.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(".cta-fade", {
        autoAlpha: 0,
        y: 28,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="begin"
      ref={root}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-[var(--space-gutter)] text-center"
    >
      {/* warm horizon glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 120%, rgba(223,71,38,0.35), rgba(240,196,99,0.12) 40%, transparent 70%)",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute left-1/2 top-[12vh] -translate-x-1/2 font-jp text-[26vh] leading-none text-washi/[0.05]"
        aria-hidden
      >
        桜
      </span>

      <div className="relative z-10 flex flex-col items-center">
        <span className="cta-fade mb-6 font-mono text-eyebrow uppercase tracking-[0.5em] text-sakura">
          The blossom is brief
        </span>

        <h2 className="cta-title font-display text-[length:var(--text-h2)] font-medium leading-[0.95] text-washi [text-wrap:balance]">
          Begin your hanami
        </h2>

        <p className="cta-fade mt-7 max-w-[46ch] text-[length:var(--text-body)] leading-relaxed text-washi/75">
          Spring in Japan lasts barely two weeks. Plan the journey while the
          petals are still on the branch.
        </p>

        <div className="cta-fade mt-12">
          <MagneticButton
            href="#top"
            className="group inline-flex items-center gap-3 rounded-full border border-vermilion/60 bg-vermilion px-9 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors duration-300 hover:bg-vermilion-soft"
          >
            Plan the trip
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
        </div>
      </div>

      <footer className="cta-fade relative z-10 mt-[18vh] flex w-full max-w-[1600px] flex-col items-center gap-3 border-t border-washi/10 pt-8 text-washi/50 sm:flex-row sm:justify-between">
        <span className="font-display text-lg text-washi/80">
          HANAMI <span className="font-jp text-sakura/80">花見</span>
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.25em]">
          A cinematic study · Spring 2026
        </span>
      </footer>
    </section>
  );
}
