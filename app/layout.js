import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import IntroOverlay from "@/components/IntroOverlay";
import CustomCursor from "@/components/CustomCursor";
import AudioSyncBackground from "@/components/AudioSyncBackground";
import MotionTraceBackdrop from "@/components/MotionTraceBackdrop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "KRISHNA | Creative Developer",
  description: "Cinematic digital portfolio. Crafting immersive digital experiences through cinematic visuals, intelligent workflows, and interactive design.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-screen relative overflow-x-hidden selection:bg-primary/10 selection:text-primary paper-texture">
        {/* Background visual engines */}
        <AudioSyncBackground />
        <MotionTraceBackdrop />
        <CustomCursor />
        <IntroOverlay />

        {/* Cinematic Backdrop Lighting */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a090d] via-[#110f15] to-[#070608]"></div>
          {/* Theme-colored light blooms */}
          <div className="absolute top-0 right-0 w-[70vw] h-[70vw] rounded-full bg-primary/12 transform translate-x-1/4 -translate-y-1/4 music-bloom-glow"></div>
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-primary/18 transform -translate-x-1/4 translate-y-1/4 music-bloom-glow"></div>
        </div>

        {/* Subtle Paper Grain Noise */}
        <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.02] mix-blend-multiply">
          <filter id="noise">
            <feTurbulence baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" type="fractalNoise" />
          </filter>
          <rect filter="url(#noise)" height="100%" width="100%" />
        </svg>

        {/* Global Navigation */}
        <Navbar />

        {/* Smooth Scroll Content */}
        <SmoothScroll>
          <div className="relative z-10 min-h-screen flex flex-col justify-between">
            <PageTransition>{children}</PageTransition>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
