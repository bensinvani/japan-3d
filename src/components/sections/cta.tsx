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
            className="group inline-flex items-center gap-3 rounded-full bg-sakura px-9 py-4 text-sm font-medium uppercase tracking-[0.2em] text-ink shadow-[0_12px_44px_-12px_rgba(245,185,202,0.75)] transition-colors duration-300 hover:bg-sakura-deep"
          >
            Plan the trip
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
        </div>
      </div>

      <footer className="cta-fade relative z-10 mt-[16vh] w-full max-w-[1100px] border-t border-washi/12 pt-12 text-left">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          {/* brand + tagline */}
          <div className="max-w-[34ch]">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl text-washi">HANAMI</span>
              <span className="font-jp text-sakura/80">花見</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-washi/50">
              A cinematic study of Japan&apos;s fleeting cherry-blossom spring — from
              the torii&apos;s threshold to the quiet garden.
            </p>
          </div>

          {/* anchor columns (use the smart in-page resolver) */}
          <nav className="flex gap-12 sm:gap-16">
            <ul className="space-y-2.5">
              <li className="mb-1 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-sakura/70">
                Explore
              </li>
              {[
                { href: "#fuji", label: "Journey" },
                { href: "#gallery", label: "Moments" },
                { href: "#practice", label: "The Practice" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-washi/55 transition-colors duration-300 hover:text-washi"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              <li className="mb-1 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-sakura/70">
                Begin
              </li>
              <li>
                <a
                  href="#begin"
                  className="text-sm text-washi/55 transition-colors duration-300 hover:text-washi"
                >
                  Plan the trip
                </a>
              </li>
              <li>
                <a
                  href="#top"
                  className="group inline-flex items-center gap-1.5 text-sm text-washi/55 transition-colors duration-300 hover:text-washi"
                >
                  Back to top
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                    ↑
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-washi/[0.07] pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.25em] text-washi/40">
            © 2026 HANAMI · A cinematic study
          </span>
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.25em] text-washi/40">
            <span className="font-jp text-sakura/60">桜</span> · Crafted with sunlight
            &amp; sakura
          </span>
        </div>
      </footer>
    </section>
  );
}
