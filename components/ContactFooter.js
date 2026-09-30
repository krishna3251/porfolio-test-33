"use client";

export default function ContactFooter(){
  return <footer id="contact" className="border-t border-white/10 mt-10">
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
      <p className="mono-metadata text-primary mb-6">07 / Contact</p>
      <h2 className="serif-display text-[clamp(3.5rem,9vw,8rem)] leading-[.82] max-w-5xl">Let’s make<br/><i>something good.</i></h2>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm">
        <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub ↗</a>
        <a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer" className="hover:text-primary">Repositories ↗</a>
      </div>
      <div className="mt-20 pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-[10px] uppercase tracking-[.16em] text-muted">
        <span>Krishna / Developer & Visual Designer</span><span>India / 2026</span>
      </div>
    </div>
  </footer>
}
