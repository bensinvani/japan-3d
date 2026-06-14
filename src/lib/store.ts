import { create } from "zustand";

// ── Scroll → canvas bridge (drives the R3F sakura-petal wind) ──────────────
// Written from one Lenis subscriber; read inside useFrame via getState().
type ScrollState = {
  /** 0..1 progress through the whole page */
  progress: number;
  /** raw Lenis velocity; drives the petal "wind gust" */
  velocity: number;
};

export const useScrollStore = create<ScrollState>(() => ({
  progress: 0,
  velocity: 0,
}));

// ── Sequence preload registry (drives the branded loader) ──────────────────
// Each named frame-sequence reports its eager-load progress 0..1; the loader
// waits on "hero" only.
interface PreloadState {
  progress: Record<string, number>;
  ready: boolean;
  report: (name: string, value: number) => void;
  setReady: () => void;
}

export const usePreload = create<PreloadState>((set) => ({
  progress: {},
  ready: false,
  report: (name, value) =>
    set((s) => ({ progress: { ...s.progress, [name]: value } })),
  setReady: () => set({ ready: true }),
}));
