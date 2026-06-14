import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrolling } from "@/components/providers/smooth-scrolling";
import { SceneMount } from "@/components/canvas/scene-mount";
import { Nav } from "@/components/nav";
import { Loader } from "@/components/loader";
import { Cursor } from "@/components/cursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://japan-3d.vercel.app"),
  title: "HANAMI — Chasing the Blossom · A Cinematic Journey Through Spring in Japan",
  description:
    "An immersive scroll experience through Japan's fleeting cherry-blossom spring — from the torii gate to Mt. Fuji, still canals, and quiet gardens.",
  keywords: [
    "Japan",
    "cherry blossom",
    "sakura",
    "hanami",
    "Mt Fuji",
    "cinematic",
    "3D website",
  ],
  openGraph: {
    title: "HANAMI — Chasing the Blossom",
    description:
      "A cinematic descent through Japan's fleeting spring.",
    images: ["/media/fuji4.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Noto Serif JP, subset to ONLY the kanji used on the page (a few KB) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700&text=%E8%8A%B1%E8%A6%8B%E5%AF%8C%E5%A3%AB%E5%B0%8F%E5%B7%9D%E5%BA%AD%E5%9C%92%E9%B3%A5%E5%B1%85%E5%9B%9B%E3%81%A4%E3%81%AE%E7%9E%AC%E9%96%93%E6%97%A5%E6%9C%AC%E6%A1%9C&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-foreground">
        <Loader />
        <Cursor />
        <SmoothScrolling>
          <Nav />
          <SceneMount />
          <main>{children}</main>
        </SmoothScrolling>
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
