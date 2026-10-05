import TerminalBar from "@/components/TerminalBar";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";

export default function ContactFooter(){
  const year = new Date().getFullYear();

  return <footer className="contact">
    <div className="contact-grid-glow" aria-hidden="true"/>
    <TerminalBar command="printf build" status="READY" meta="CHANNEL / OPEN" />
    <div className="contact-inner">
      <div className="section-marker light"><span>06</span><span>CONTACT</span><em>OPEN / {year}</em></div>
      <span className="eyebrow">LET&apos;S MAKE SOMETHING</span>
      <h2>Have an idea?<br/><em>Build it.</em></h2>
      <div className="contact-row">
        <div className="contact-copy">
          <span>01 / START HERE</span>
          <p>Open to software projects, visual work, collaborations and experiments.</p>
          <div className="contact-methods" aria-label="Contact methods">
            {contactEmail && <a href={`mailto:${contactEmail}`} className="text-link" data-cursor="EMAIL">Email <span>↗</span></a>}
            {contactPhone && <a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`} className="text-link" data-cursor="PHONE">Phone <span>↗</span></a>}
          </div>
        </div>
        <div>
          <a href="https://github.com/krishna3251" target="_blank" rel="noopener noreferrer" className="btn btn-light" data-cursor="GITHUB">GitHub <span>↗</span></a>
          <a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noopener noreferrer" className="btn btn-dark" data-cursor="REPOSITORIES">Repositories <span>↗</span></a>
        </div>
      </div>
      <div className="contact-bottom">
        <span>© {year} KRISHNA / DEVELOPER + VISUAL DESIGNER</span>
        <a href="#top" data-cursor="TOP">BACK TO TOP ↑</a>
        <span>INDIA / {year}</span>
      </div>
    </div>
  </footer>;
}
