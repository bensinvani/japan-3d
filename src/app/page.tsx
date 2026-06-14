import { Hero } from "@/components/sections/hero";
import { StoryScene } from "@/components/sections/story-scene";
import { Gallery } from "@/components/sections/gallery";
import { CTA } from "@/components/sections/cta";
import { SCENES } from "@/lib/scenes";

export default function Home() {
  return (
    <>
      <Hero />
      {SCENES.map((scene, i) => (
        <StoryScene key={scene.id} scene={scene} last={i === SCENES.length - 1} />
      ))}
      <Gallery />
      <CTA />
    </>
  );
}
