"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

// A quiet cut-to-poetry after the cinematic descent — the last frame scene exits
// clean into a single Bashō haiku. A breath before the gallery.
export function Interlude() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // no line-mask: italic descenders would clip against the tight leading
        const split = SplitText.create(".interlude-line", { type: "lines" });
        gsap.set(split.lines, { yPercent: 110, opacity: 0 });
        gsap.set(".interlude-fade", { autoAlpha: 0, y: 20 });

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 62%" } })
          .to(split.lines, {
            yPercent: 0,
            opacity: 1,
            stagger: 0.14,
            duration: 1.1,
            ease: "power4.out",
          })
          .to(
            ".interlude-fade",
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.9,
              ease: "power3.out",
            },
            "-=0.6"
          );

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section
      id="interlude"
      ref={root}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-[var(--space-gutter)] text-center"
    >
      <span
        className="writing-vertical pointer-events-none absolute right-[8vw] top-1/2 -translate-y-1/2 font-jp text-[26vh] leading-none text-washi/[0.05]"
        aria-hidden
      >
        桜
      </span>

      <span className="interlude-fade mb-9 font-mono text-eyebrow uppercase tracking-[0.5em] text-sakura">
        間 · Interlude
      </span>

      <blockquote className="relative z-10">
        {/* width lives on the <p> so `ch` resolves at the haiku's own (large) font */}
        <p className="interlude-line mx-auto max-w-[22ch] font-display text-[clamp(1.85rem,1rem+3vw,3.7rem)] font-medium italic leading-[1.14] text-washi">
          So many things
          <br />
          they bring to mind —
          <br />
          these cherry blossoms.
        </p>
      </blockquote>

      <div className="interlude-fade mt-11 flex flex-col items-center gap-2">
        <span className="font-jp text-lg text-washi/70">
          さまざまの事おもひ出す桜かな
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-washi/45">
          Matsuo Bashō
        </span>
      </div>
    </section>
  );
}
