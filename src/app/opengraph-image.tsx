import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded 1200×630 social share card (Open Graph + Twitter). Generated at build
// time from the torii photo + two tiny subsetted serif fonts. This is what
// unfurls when the link is pasted into WhatsApp / X / iMessage / Slack / LinkedIn.
export const alt =
  "HANAMI — Chasing the Blossom · A cinematic journey through spring in Japan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE = "A cinematic descent through Japan's fleeting spring.";

export default async function Image() {
  const [bg, playfair, notoJp] = await Promise.all([
    readFile(join(process.cwd(), "public/media/fuji4.jpg"), "base64"),
    readFile(join(process.cwd(), "src/app/og/playfair-600.ttf")),
    readFile(join(process.cwd(), "src/app/og/notoserifjp-600.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "'Playfair Display', 'Noto Serif JP'",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${bg}`}
          width={1200}
          height={630}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* legibility wash: dark on the left + bottom where the text sits */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(7,5,9,0.88) 0%, rgba(7,5,9,0.45) 52%, rgba(7,5,9,0.12) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, rgba(7,5,9,0.85) 0%, rgba(7,5,9,0.05) 58%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "62px 72px",
          }}
        >
          <div style={{ display: "flex", color: "#f5b9ca", fontSize: 30, letterSpacing: 8 }}>
            花見 · HANAMI
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", width: 760, fontSize: 92, lineHeight: 1.04, color: "#f3ecdf" }}>
              Chasing the Blossom
            </div>
            <div style={{ display: "flex", width: 720, marginTop: 24, fontSize: 32, color: "rgba(243,236,223,0.82)" }}>
              {TAGLINE}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", width: 54, height: 3, background: "#df4726", marginRight: 18 }} />
              <div style={{ display: "flex", fontSize: 24, color: "rgba(243,236,223,0.72)", letterSpacing: 3 }}>
                Spring in Japan
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#f5b9ca", letterSpacing: 2 }}>
              japan-3d.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, weight: 600, style: "normal" },
        { name: "Noto Serif JP", data: notoJp, weight: 600, style: "normal" },
      ],
    }
  );
}
