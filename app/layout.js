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
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#08090b]"/>
      <Navbar/>
      <SmoothScroll>
        <div className="relative z-10 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </div>
      </SmoothScroll>
    </body>
  </html>;
}