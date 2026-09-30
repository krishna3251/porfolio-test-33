import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import AudioSyncBackground from "@/components/AudioSyncBackground";
import MotionTraceBackdrop from "@/components/MotionTraceBackdrop";

const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"],display:"swap"});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"],display:"swap"});
const playfair=Playfair_Display({variable:"--font-playfair",subsets:["latin"],weight:["400","500","600","700"],style:["normal","italic"],display:"swap"});

export const metadata={
  title:"KRISHNA / Creative Developer + Visual Artist",
  description:"Krishna's portfolio: software, AI systems, gaming visuals and sound.",
};

export const viewport={
  width:"device-width",
  initialScale:1,
  viewportFit:"cover",
  themeColor:"#08090b",
  colorScheme:"dark",
};

export default function RootLayout({children}){
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
    <body className="min-h-screen relative overflow-x-hidden site-body">
      <AudioSyncBackground/>
      <MotionTraceBackdrop/>
      <CustomCursor/>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#090a0d]"/>
        <div className="absolute -top-[18vw] -left-[10vw] w-[52vw] h-[52vw] rounded-full bg-[#ff6a2a]/16 blur-[100px] animate-drift-a"/>
        <div className="absolute -bottom-[18vw] -right-[5vw] w-[42vw] h-[42vw] rounded-full bg-[#f5f1e8]/[.035] blur-[110px] animate-drift-b"/>
        <div className="absolute inset-0 opacity-[.035] paper-grain"/>
      </div>
      <Navbar/>
      <SmoothScroll>
        <div className="relative z-10 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </div>
      </SmoothScroll>
    </body>
  </html>;
}