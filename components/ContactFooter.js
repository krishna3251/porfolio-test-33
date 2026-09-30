"use client";
export default function ContactFooter(){
 return <footer className="contact-block mt-0">
  <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-28 md:py-40 relative">
   <span className="portfolio-kicker">Let’s work together</span>
   <h2 className="portfolio-display mt-5">Have an idea?<br/><em>Let’s build it.</em></h2>
   <p className="mt-8 max-w-xl text-base md:text-lg leading-8 text-white/55">Open to software projects, visual work, collaborations and experiments.</p>
   <div className="mt-9 flex flex-wrap gap-3">
    <a className="hero-button hero-button-filled" href="https://github.com/krishna3251" target="_blank" rel="noreferrer">GitHub ↗</a>
    <a className="hero-button" href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer">All repositories ↗</a>
   </div>
   <div className="mt-24 pt-5 border-t border-white/10 flex justify-between gap-4 text-[9px] uppercase tracking-[.15em] text-white/35"><span>Krishna / Developer + Visual Designer</span><span>India / 2026</span></div>
  </div>
 </footer>;
}