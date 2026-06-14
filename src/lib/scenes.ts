// Content model for the journey. fuji4 (the torii street) opens the experience,
// per Ben's request, then the descent flows mountain → water → garden.
// Each scene is a scroll-scrubbed image sequence (frames extracted from the
// Higgsfield footage). `frames` is set to the exact extracted count.

export type Beat = { k: string; line: string };

export type Scene = {
  id: string;
  seq: string; // /public/sequences/<seq>/
  frames: number;
  poster: string;
  kanji: string;
  romaji: string;
  index: string;
  title: string;
  beats: Beat[];
  align: "left" | "right";
  accent: "vermilion" | "sakura" | "gold";
};

export const HERO = {
  id: "top",
  seq: "hero",
  frames: 129,
  poster: "/media/hero-poster.webp",
  kanji: "花見",
  romaji: "hanami",
};

export const SCENES: Scene[] = [
  {
    id: "fuji",
    seq: "fuji",
    frames: 81,
    poster: "/media/fuji-poster.webp",
    kanji: "富士",
    romaji: "Fuji-san",
    index: "01",
    title: "The Sentinel",
    align: "left",
    accent: "gold",
    beats: [
      { k: "Dawn", line: "Before the first train, the mountain wears the sun like a crown." },
      { k: "Stillness", line: "Five storeys of cedar and lacquer keep watch over a sleeping lake." },
    ],
  },
  {
    id: "stream",
    seq: "stream",
    frames: 129,
    poster: "/media/stream-poster.webp",
    kanji: "小川",
    romaji: "ogawa",
    index: "02",
    title: "Still Water",
    align: "right",
    accent: "sakura",
    beats: [
      { k: "Drift", line: "A canal narrow enough to whisper, lined with two hundred years of doorways." },
      { k: "Koi", line: "Beneath the weeping cherry, carp trace slow calligraphy in the current." },
    ],
  },
  {
    id: "garden",
    seq: "garden",
    frames: 81,
    poster: "/media/garden-poster.webp",
    kanji: "庭園",
    romaji: "teien",
    index: "03",
    title: "The Garden",
    align: "left",
    accent: "vermilion",
    beats: [
      { k: "Cross", line: "An arched bridge folds the sky into the pond and back again." },
      { k: "Bloom", line: "Spring is not a season here — it is a single, deliberate breath." },
    ],
  },
];

// Gallery uses all four moments (stills), hero first.
export const GALLERY = [
  { src: "/media/fuji4.jpg", kanji: "鳥居", romaji: "torii", label: "The Threshold" },
  { src: "/media/fuji.jpg", kanji: "富士", romaji: "fuji", label: "The Sentinel" },
  { src: "/media/fuji2.jpg", kanji: "小川", romaji: "ogawa", label: "Still Water" },
  { src: "/media/fuji3.jpg", kanji: "庭園", romaji: "teien", label: "The Garden" },
];
