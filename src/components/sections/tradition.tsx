"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Editorial substance between the gallery and the CTA — what hanami actually is,
// plus a row of scroll-counted facts. Gives the piece weight beyond the visuals.
const FACTS = [
  { prefix: "", to: 1200, suffix: "+", label: "years of hanami", jp: "歴史" },
  { prefix: "~", to: 2, suffix: " wks", label: "the bloom lasts", jp: "儚さ" },
  { prefix: "", to: 100, suffix: "+", label: "sakura varieties", jp: "品種" },
  { prefix: "~", to: 700, suffix: " km", label: "the bloom front climbs", jp: "前線" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export function Tradition() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nums = gsap.utils.toArray<HTMLElement>(".tr-num");

      if (reduce) {
        nums.forEach((el) => (el.textContent = fmt(Number(el.dataset.to))));
        return;
      }

      gsap.from(".tr-fade", {
        autoAlpha: 0,
        y: 26,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });

      // count each stat up as it enters (numbers stay visible; the "0" only shows
      // while the row is still below the fold)
      nums.forEach((el) => {
        const end = Number(el.dataset.to);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = fmt(Math.round(obj.v))),
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="practice"
      ref={root}
      className="relative overflow-hidden bg-ink px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <span
        className="writing-vertical pointer-events-none absolute left-[4vw] top-[8vh] font-jp text-[22vh] leading-none text-washi/[0.04]"
        aria-hidden
      >
        作法
      </span>

      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[0.85fr_1.15fr] md:items-end">
        <div>
          <span className="tr-fade mb-5 block font-mono text-eyebrow uppercase tracking-[0.4em] text-sakura">
            花見の作法 · The Practice
          </span>
          <h2 className="tr-fade font-display text-[length:var(--text-h2)] font-medium leading-[0.98] text-washi [text-wrap:balance]">
            A thousand years
            <br />
            of looking up
          </h2>
        </div>

        <div className="space-y-5 text-[length:var(--text-body)] leading-relaxed text-washi/75">
          <p className="tr-fade">
            Hanami —{" "}
            <span className="text-washi/90">&ldquo;flower viewing&rdquo;</span> — began
            in the courts of the eighth century and turned to the cherry by the Heian
            age. For more than a millennium, Japan has stopped each spring to sit
            beneath the blossom and simply watch.
          </p>
          <p className="tr-fade">
            The bloom holds for barely two weeks, and a single night of rain can end it.
            That brevity is the point —{" "}
            <span className="italic text-washi/90">mono no aware</span>, the tender
            awareness of things that do not last. To watch the petals fall is to
            practice letting go.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-[clamp(3rem,7vw,6rem)] grid max-w-[1180px] grid-cols-2 gap-y-12 border-t border-washi/12 pt-12 md:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} className="flex flex-col gap-2">
            <span className="font-display text-[length:var(--text-beat)] font-medium leading-none text-washi">
              {f.prefix}
              <span className="tr-num" data-to={f.to}>
                0
              </span>
              <span className="text-sakura">{f.suffix}</span>
            </span>
            <span className="flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.16em] text-washi/55">
              <span className="font-jp text-sakura/70">{f.jp}</span>
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
