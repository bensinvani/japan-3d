import { Hero } from "@/components/sections/hero";
import { StoryScene } from "@/components/sections/story-scene";
import { Interlude } from "@/components/sections/interlude";
import { Gallery } from "@/components/sections/gallery";
import { Tradition } from "@/components/sections/tradition";
import { CTA } from "@/components/sections/cta";
import { SCENES } from "@/lib/scenes";

export default function Home() {
  return (
    <>
      <Hero />
      {SCENES.map((scene, i) => (
        <StoryScene key={scene.id} scene={scene} last={i === SCENES.length - 1} />
      ))}
      <Interlude />
      <Gallery />
      <Tradition />
      <CTA />
    </>
  );
}
