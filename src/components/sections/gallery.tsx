"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { GALLERY } from "@/lib/scenes";

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useGSAP(
    () => {
      const isReduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (isReduce) {
        setReduce(true);
        return;
      }

      const el = track.current!;
      const xTween = gsap.to(el, {
        x: () => -(el.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${el.scrollWidth - window.innerWidth}`,
        },
      });

      // each card's caption rises in as it enters the horizontal track
      // (tied to the track tween via containerAnimation). End position must be
      // reachable by EVERY card — the last one only reaches ~mid-viewport.
      gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card) => {
        const cap = card.querySelector(".gallery-cap");
        if (!cap) return;
        gsap.from(cap, {
          yPercent: 70,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: xTween,
            start: "left 90%",
            end: "left 60%",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="gallery"
      ref={root}
      className="relative h-dvh w-full overflow-hidden bg-ink"
    >
      <div
        ref={track}
        className={`flex h-full items-center gap-[3vw] px-[12vw] ${
          reduce ? "overflow-x-auto" : "w-max will-change-transform"
        }`}
      >
        {/* heading rides at the start of the track — scrolls away, never overlaid */}
        <div className="shrink-0 pe-[4vw]">
          <span className="mb-3 block font-mono text-eyebrow uppercase tracking-[0.4em] text-sakura">
            四つの瞬間
          </span>
          <h2 className="max-w-[8ch] font-display text-[length:var(--text-h2)] font-medium leading-[0.95] text-washi">
            Four Moments
          </h2>
        </div>

        {GALLERY.map((g) => (
          <figure
            key={g.src}
            data-cursor
            className="gallery-card group relative h-[64vh] w-[78vw] shrink-0 overflow-hidden rounded-sm sm:w-[46vw] lg:w-[32vw]"
          >
            <Image
              src={g.src}
              alt={g.label}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 32vw"
              quality={85}
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <figcaption className="gallery-cap absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <div>
                <span className="font-jp text-2xl text-sakura">{g.kanji}</span>
                <p className="mt-1 font-display text-xl text-washi">{g.label}</p>
              </div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-washi/60">
                {g.romaji}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
