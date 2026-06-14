# HANAMI — Design Brief & Scroll Storyboard

A cinematic, scroll-driven journey through Japan's fleeting cherry-blossom spring.
Built on the `3d-web-builder` stack and informed by the `ui-ux-pro-max` design engine
(pattern: *Scroll-Triggered Storytelling*; reference photography overrides the generic
palette per the design-direction rule).

## Brief (derived from the four reference photos)

| Aspect | Direction |
|---|---|
| Palette | Sumi-ink night `#0b090d` · vermilion torii `#df4726` · sakura pink `#f5b9ca` · sunset gold `#f0c463` · washi `#f3ecdf` |
| Type | Playfair Display (cinematic editorial serif) + Inter (body) + Noto Serif JP (kanji accents, glyph-subset) |
| Motion | Cinematic inertia — Lenis lerp 0.08, scrub 1.2, `ease:"none"` on scrubbed tweens |
| Depth | Layered parallax + persistent WebGL sakura-petal field (instanced, scroll-velocity wind) |
| Density | Minimal, whitespace-heavy, oversized kinetic type; ≤6-word headlines |

## Scroll storyboard

| # | Section | Scroll | Pinned | Beats | Mobile |
|---|---|---|---|---|---|
| 0 | Loader | — | — | Real progress (preloads 4 photos) → curtain reveal | full |
| 1 | Hero — `fuji4` torii | 100dvh + 130% | yes | SplitText title in → ken-burns zoom → copy parallaxes out | full |
| 2 | The Sentinel — `fuji` | 200% | yes | DAWN / STILLNESS beats toggle at threshold | lighter |
| 3 | Still Water — `fuji2` | 200% | yes | DRIFT / KOI beats (right-aligned) | lighter |
| 4 | The Garden — `fuji3` | 200% | yes | CROSS / BLOOM beats | lighter |
| 5 | Four Moments | horizontal | yes | All 4 scenes as portrait cards | swipe/scroll |
| 6 | Begin your hanami | 100dvh | no | SplitText reveal + magnetic CTA + footer | full |

> `fuji4` opens the experience, per request — the swap-in target for the Higgsfield
> hero video (drop a `<video>` into `.hero-media` in `src/components/sections/hero.tsx`).

## Award-site signatures used

Branded loader · oversized kinetic typography (SplitText masked reveals) · persistent 3D
petal atmosphere · custom magnetic cursor (desktop) · film-grain overlay · cinematic
vignette · vertical kanji watermarks · single-accent dark palette.

## Non-negotiables honored

One smoothing layer (Lenis) · `gsap.registerPlugin` once at module scope · scrubbed
tweens `ease:"none"`, overlay copy toggles at thresholds with CSS transitions ·
`prefers-reduced-motion` fallbacks via `matchMedia` · fluid clamp type scale · `dvh`
sticky viewports · particle count tiered by device · canvas dynamic-imported `ssr:false`.
