"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#fuji", label: "Journey" },
  { href: "#gallery", label: "Moments" },
  { href: "#begin", label: "Begin" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
      style={{ paddingInline: "var(--space-gutter)" }}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between mix-blend-difference">
        <a
          href="#top"
          className="group flex items-baseline gap-2 text-washi"
          aria-label="HANAMI — back to top"
        >
          <span className="font-display text-xl font-semibold tracking-tight">
            HANAMI
          </span>
          <span className="font-jp text-sm text-sakura/90">花見</span>
        </a>

        <ul className="hidden items-center gap-8 text-[0.78rem] uppercase tracking-[0.22em] text-washi md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative py-1 transition-opacity hover:opacity-60"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-washi">
          <span className="opacity-90">EN</span>
          <span className="h-3 w-px bg-washi/40" />
          <span className="opacity-40">日本</span>
        </div>
      </nav>
    </header>
  );
}
