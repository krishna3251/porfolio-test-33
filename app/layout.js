import { Space_Grotesk, Instrument_Serif, DM_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import "./refinement.css";
import "./kinetic-hero.css";
import "./portfolio-polish.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import AudioPlayer from "@/components/AudioPlayer";
import CustomCursor from "@/components/CustomCursor";
import SiteMediaTheme from "@/components/SiteMediaTheme";

const spaceGrotesk=Space_Grotesk({variable:"--font-space",subsets:["latin"],display:"swap"});
const dmMono=DM_Mono({variable:"--font-dm-mono",subsets:["latin"],weight:["300","400","500"],display:"swap"});
const instrumentSerif=Instrument_Serif({variable:"--font-instrument",subsets:["latin"],weight:"400",style:["normal","italic"],display:"swap"});
const barlowCondensed=Barlow_Condensed({variable:"--font-barlow",subsets:["latin"],weight:["500","600","700","800","900"],display:"swap"});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tests-two-nu.vercel.app";
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
  openGraph:{type:"website",siteName:"KRISHNA",title:"KRISHNA / Creative Developer + Visual Designer",description:"Software, AI systems, gaming visuals and experiments by Krishna.",images:[{url:heroImage,alt:"Krishna portfolio"}]},
  twitter:{card:"summary_large_image",title:"KRISHNA / Creative Developer + Visual Designer",description:"Software, AI systems, gaming visuals and experiments by Krishna.",images:[heroImage]},
};

export const viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#241917",colorScheme:"light"};

export default function RootLayout({children}){
  return <html lang="en" className={`${spaceGrotesk.variable} ${dmMono.variable} ${instrumentSerif.variable} ${barlowCondensed.variable} h-full antialiased`}>
    <body id="top" className="site-body">
      <a className="skip-link" href="#route-content">Skip to content</a>
      <SiteMediaTheme/>
      <Navbar/>
      <CustomCursor/>
      <SmoothScroll><PageTransition>{children}</PageTransition></SmoothScroll>
      <div className="site-audio"><AudioPlayer/></div>
    </body>
  </html>;
}
