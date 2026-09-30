import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import IntroOverlay from "@/components/IntroOverlay";
import CustomCursor from "@/components/CustomCursor";
import AudioSyncBackground from "@/components/AudioSyncBackground";
import MotionTraceBackdrop from "@/components/MotionTraceBackdrop";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
const playfair=Playfair_Display({variable:"--font-playfair",subsets:["latin"],weight:["400","500","600","700"],style:["normal","italic"]});
const spaceGrotesk=Space_Grotesk({variable:"--font-space-grotesk",subsets:["latin"],weight:["400","500","600","700"]});
export const metadata={title:"KRISHNA / Creative Developer + Visual Artist",description:"Krishna's experimental portfolio: software, AI systems, gaming visuals and sound."};
export default function RootLayout({children}){return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${spaceGrotesk.variable} h-full antialiased`}><body className="bg-background text-foreground min-h-screen relative overflow-x-hidden paper-texture"><AudioSyncBackground/><MotionTraceBackdrop/><CustomCursor/><IntroOverlay/><div className="fixed inset-0 z-0 pointer-events-none"><div className="absolute inset-0 bg-[#070a12]"/><div className="absolute top-[-20vh] right-[-10vw] w-[45vw] h-[45vw] bg-primary/12 blur-[120px] music-bloom-glow"/><div className="absolute bottom-[-20vh] left-[-10vw] w-[40vw] h-[40vw] bg-hot/7 blur-[120px] music-bloom-glow"/></div><Navbar/><SmoothScroll><div className="relative z-10 min-h-screen"><PageTransition>{children}</PageTransition></div></SmoothScroll></body></html>}