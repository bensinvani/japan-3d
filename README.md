# HANAMI — Chasing the Blossom 花見

A cinematic, scroll-driven 3D website celebrating Japan's cherry-blossom spring.
See [`DESIGN.md`](./DESIGN.md) for the design brief and scroll storyboard.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · GSAP + ScrollTrigger +
SplitText · Lenis smooth scroll · React Three Fiber + drei (instanced sakura petals) ·
zustand (scroll→canvas bridge).

## Scroll behavior — image-sequence scrub

The hero and the three story scenes are **scroll-scrubbed image sequences** (Apple
AirPods-style): a tall section + a `sticky` viewport + a `<canvas>` whose frame index is
a **direct function of the Lenis-lerped scroll position** (one smoothing layer — no GSAP
scrub stacked on Lenis). See `src/lib/use-frame-sequence.ts` + `src/components/sequence-canvas.tsx`.

Footage was generated with Higgsfield (Seedance 2.0, 1080p) from the four reference
photos, then converted to webp frames:

```bash
ffmpeg -y -i source.mp4 -vf "fps=16,scale=1500:-2" -c:v libwebp -q:v 52 \
  public/sequences/<name>/frame_%04d.webp
# first frame doubles as the LCP poster:
cp public/sequences/<name>/frame_0001.webp public/media/<name>-poster.webp
```

Frame counts live in `src/lib/scenes.ts` (`frames`). Mobile / reduced-motion get the
poster only (no frame download). Source mp4s live in `.video-src/` (gitignored); the
committed `public/sequences/**` webp frames are what ship.

## Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (passes TS + SSR checks)
npm run start    # serve the production build
```

## Structure

```
src/
├─ app/                     layout (fonts, metadata, global atmosphere) + page
├─ components/
│  ├─ providers/            Lenis smooth scrolling + GSAP ticker sync
│  ├─ canvas/               R3F sakura-petal field (dynamic, ssr:false)
│  ├─ sections/             hero · story-panel · gallery · cta
│  ├─ nav · cursor · loader · magnetic-button
│  └─ ui/                   shadcn components
│  └─ sequence-canvas         sticky-canvas frame scrubber wrapper
├─ lib/                     gsap · store (scroll + preload) · scenes (content + frame counts)
│  └─ use-frame-sequence     the scrub hook (frame = f(lerped scroll))
public/
├─ sequences/<name>/         frame_0001.webp … (hero · fuji · stream · garden)
└─ media/                    *-poster.webp (LCP/mobile) · fuji*.jpg (gallery stills)
```

## Re-generating or swapping footage

1. Generate a slow continuous-camera clip (Higgsfield Seedance 2.0, 1080p, ~5–8 s,
   16:9, clean first frame) from the scene's reference photo.
2. Extract frames with the ffmpeg command above into `public/sequences/<name>/`.
3. Copy `frame_0001.webp` → `public/media/<name>-poster.webp`.
4. Update the scene's `frames` count in `src/lib/scenes.ts`.
