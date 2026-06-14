"use client";

import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useScrollStore } from "@/lib/store";

function ScrollBridge() {
  // ONE Lenis subscriber: notify ScrollTrigger of the lerped scroll AND publish
  // progress/velocity to the zustand store the canvas reads. Single smoothing layer.
  useLenis((lenis) => {
    ScrollTrigger.update();
    useScrollStore.setState({
      progress: lenis.progress ?? 0,
      velocity: lenis.velocity ?? 0,
    });
    // expose the instance for anchor scrolling / tooling
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
  });

  useEffect(() => {
    // Choreographed pages must start at beat 1, not a restored scroll position.
    window.history.scrollRestoration = "manual";
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

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
        lerp: isSafari ? 0.1 : 0.08,
        smoothWheel: true,
        syncTouch: !isSafari,
        anchors: true,
      }}
    >
      <ScrollBridge />
      {children}
    </ReactLenis>
  );
}
