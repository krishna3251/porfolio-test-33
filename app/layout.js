import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import AudioPlayer from "@/components/AudioPlayer";

const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"],display:"swap"});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"],display:"swap"});
const playfair=Playfair_Display({variable:"--font-playfair",subsets:["latin"],weight:["400","500","600","700"],style:["normal","italic"],display:"swap"});

export const metadata={
  title:"KRISHNA / Creative Developer + Visual Designer",
  description:"Krishna's portfolio of software, AI systems and visual design.",
};

export const viewport={
  width:"device-width",
  initialScale:1,
  viewportFit:"cover",
  themeColor:"#10110f",
  colorScheme:"dark",
};

export default function RootLayout({children}){
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
    <body className="site-body">
      <Navbar/>
      <SmoothScroll>
        <PageTransition>{children}</PageTransition>
      </SmoothScroll>
      <div className="site-audio"><AudioPlayer/></div>
    </body>
  </html>;
}