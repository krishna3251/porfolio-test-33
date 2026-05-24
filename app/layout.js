import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import IntroOverlay from "@/components/IntroOverlay";
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
      <body className="bg-[#121014] text-on-surface min-h-screen relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        {/* Noise Texture Overlay */}
        <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay">
          <filter id="noise">
            <feTurbulence baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" type="fractalNoise" />
          </filter>
          <rect filter="url(#noise)" height="100%" width="100%" />
        </svg>

        {/* Cinematic Backdrop Lighting */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#18141d_0%,#0b090d_46%,#050406_100%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.025)_33%,transparent_34%,transparent_63%,rgba(215,186,255,0.035)_64%,transparent_66%)] bg-[length:220px_220px] opacity-45"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[length:100%_4px] opacity-20"></div>
          {/* Theme-colored light blooms */}
          <div className="absolute top-0 right-0 w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[150px] mix-blend-screen opacity-40 transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-secondary-dark/15 blur-[120px] mix-blend-screen opacity-35 transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Dark motion tracing layer */}
        <MotionTraceBackdrop />

        {/* Global Particles System */}
        <Particles count={25} />

        {/* Audio-Synchronized Border Waves and Snowfall */}
        <AudioSyncBackground />

        {/* GSAP Custom trailing cursor */}
        <CustomCursor />

        {/* First-visit Autoplay Intro Overlay */}
        <IntroOverlay />

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
