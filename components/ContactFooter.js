import TerminalBar from "@/components/TerminalBar";

export default function ContactFooter(){
  return <footer className="contact">
    <div className="contact-grid-glow" aria-hidden="true"/>
    <TerminalBar command="printf build" status="READY" meta="CHANNEL / OPEN" />
    <div className="contact-inner">
      <div className="section-marker light"><span>06</span><span>CONTACT</span><em>OPEN / 2026</em></div>
      <span className="eyebrow">LET&apos;S MAKE SOMETHING</span>
      <h2>Have an idea?<br/><em>Build it.</em></h2>
      <div className="contact-row">
        <div className="contact-copy"><span>01 / START HERE</span><p>Open to software projects, visual work, collaborations and experiments.</p></div>
        <div>
          <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="btn btn-light" data-cursor="GITHUB">GitHub <span>↗</span></a>
          <a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer" className="btn btn-dark" data-cursor="REPOSITORIES">Repositories <span>↗</span></a>
        </div>
      </div>
      <div className="contact-bottom"><span>KRISHNA / DEVELOPER + VISUAL DESIGNER</span><a href="#top" data-cursor="TOP">BACK TO TOP ↑</a><span>INDIA / 2026</span></div>
    </div>
  </footer>;
}