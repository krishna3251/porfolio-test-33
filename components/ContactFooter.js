"use client";
export default function ContactFooter(){
 return <footer id="contact" className="contact-block mt-16">
  <div className="max-w-[1500px] mx-auto px-5 md:px-8 lg:px-10 py-24 md:py-36 relative overflow-hidden">
   <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full border-[1px] border-hot/25"/>
   <p className="mono-metadata text-hot mb-6">05 / CONTACT</p>
   <h2 className="editorial-heading contact-heading">Let’s make<br/><span className="editorial-italic">something good.</span></h2>
   <div className="mt-12 flex flex-wrap gap-3"><a className="hero-button hero-button-filled" href="https://github.com/krishna3251" target="_blank" rel="noreferrer">GitHub ↗</a><a className="hero-button" href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer">Repositories ↗</a></div>
   <div className="mt-20 pt-5 border-t border-black/10 flex flex-col sm:flex-row justify-between gap-3 text-[10px] uppercase tracking-[.16em] text-black/35"><span>Krishna / Developer & Visual Designer</span><span>India / 2026</span></div>
  </div>
 </footer>;
}