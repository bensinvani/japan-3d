"use client";

import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useScrollStore } from "@/lib/store";

function ScrollBridge() {
  // ONE Lenis subscriber: notify ScrollTrigger of the lerped scroll AND publish
  // progress/velocity to the zustand store the canvas reads. Single smoothing layer.
  const lenis = useLenis((l) => {
    ScrollTrigger.update();
    useScrollStore.setState({
      progress: l.progress ?? 0,
      velocity: l.velocity ?? 0,
    });
    // expose the instance for tooling
    (window as unknown as { __lenis?: unknown }).__lenis = l;
  });

  useEffect(() => {
    // Choreographed pages must start at beat 1, not a restored scroll position.
    window.history.scrollRestoration = "manual";
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Smart in-page anchor scrolling. Lenis' built-in `anchors` jumps to an element's
  // box top — but our image-sequence scenes begin ~1.65 viewports early (the overlap
  // negative margin), so a raw jump lands mid-crossfade. We resolve the real target
  // here: for a sequence scene, scroll a third into its runway so the scene is fully
  // dissolved-in and showing its first beat. One delegated listener covers the nav,
  // the brand mark, and the CTA button.
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();

      let target =
        hash === "#top" ? 0 : el.getBoundingClientRect().top + window.scrollY;
      // A sequence scene's box starts before it visually settles; jump past the
      // crossfade so the scene is full-screen with its first beat showing.
      if (hash !== "#top" && el.dataset.sequence !== undefined) {
        const runway = el.offsetHeight - window.innerHeight;
        target += runway * 0.32;
      }
      lenis.scrollTo(target, { duration: 1.5 });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  // Safari/iOS stutters with aggressive syncTouch; a higher lerp smooths it.
  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <ReactLenis
      root
      options={{
        // slightly lower than the 0.08 default → a touch more cinematic glide
        lerp: isSafari ? 0.1 : 0.075,
        smoothWheel: true,
        syncTouch: !isSafari,
        anchors: false, // handled by the offset-aware resolver in ScrollBridge
      }}
    >
      <ScrollBridge />
      {children}
    </ReactLenis>
  );
}
