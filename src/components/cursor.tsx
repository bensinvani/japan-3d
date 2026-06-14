"use client";

import { useEffect, useRef } from "react";

// Desktop-only custom cursor: a lerped ring that swells over interactive elements,
// plus a crisp dot. Skipped entirely on touch (coarse pointer).
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let hovering = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor]"
      );
      hovering = !!el;
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${hovering ? 2 : 1})`;
        ring.current.style.opacity = hovering ? "0.9" : "0.55";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.classList.add("has-cursor");
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-el cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-el cursor-dot" aria-hidden />
      <style>{`
        .has-cursor, .has-cursor * { cursor: none !important; }
        .cursor-el {
          position: fixed; top: 0; left: 0; z-index: 70;
          pointer-events: none; will-change: transform;
        }
        .cursor-ring {
          width: 38px; height: 38px; border-radius: 9999px;
          border: 1.5px solid var(--color-sakura);
          transition: opacity .3s ease, background-color .3s ease;
          mix-blend-mode: difference;
        }
        .cursor-dot {
          width: 5px; height: 5px; border-radius: 9999px;
          background: var(--color-vermilion);
        }
        @media (pointer: coarse) { .cursor-el { display: none; } }
      `}</style>
    </>
  );
}
