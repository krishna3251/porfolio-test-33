import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import AudioPlayer from "@/components/AudioPlayer";
import CustomCursor from "@/components/CustomCursor";

const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"],display:"swap"});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"],display:"swap"});
const playfair=Playfair_Display({variable:"--font-playfair",subsets:["latin"],weight:["400","500","600","700"],style:["normal","italic"],display:"swap"});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tests-krishna3251s-projects.vercel.app";
const heroImage = "https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/hero_krishna_vertical.jpg";

export const metadata={
  metadataBase:new URL(siteUrl),
  title:{default:"KRISHNA / Creative Developer + Visual Designer",template:"%s / KRISHNA"},
  description:"Software, AI systems, gaming visuals and experiments by Krishna.",
  applicationName:"KRISHNA Portfolio",
  authors:[{name:"Krishna"}],
  creator:"Krishna",
  publisher:"Krishna",
  robots:{index:true,follow:true},
  openGraph:{
    type:"website",
    siteName:"KRISHNA",
    title:"KRISHNA / Creative Developer + Visual Designer",
    description:"Software, AI systems, gaming visuals and experiments by Krishna.",
    images:[{url:heroImage,alt:"Krishna portfolio"}],
  },
  twitter:{
    card:"summary_large_image",
    title:"KRISHNA / Creative Developer + Visual Designer",
    description:"Software, AI systems, gaming visuals and experiments by Krishna.",
    images:[heroImage],
  },
};

export const viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#10110f",colorScheme:"dark"};

export default function RootLayout({children}){
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
    <body id="top" className="site-body">
      <Navbar/>
      <CustomCursor/>
      <SmoothScroll><PageTransition>{children}</PageTransition></SmoothScroll>
      <div className="site-audio"><AudioPlayer/></div>
    </body>
  </html>;
}