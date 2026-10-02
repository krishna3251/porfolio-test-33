export default function ContactFooter(){
  return <footer className="contact">
    <div className="contact-grid-glow" aria-hidden="true"/>
    <div className="contact-inner">
      <div className="section-marker light"><span>06</span><span>CONTACT</span></div>
      <span className="eyebrow">LET&apos;S MAKE SOMETHING</span>
      <h2>Have an idea?<br/><em>Build it.</em></h2>
      <div className="contact-row">
        <p>Open to software projects, visual work, collaborations and experiments.</p>
        <div>
          <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="btn btn-light">GitHub <span>↗</span></a>
          <a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer" className="btn btn-dark">Repositories <span>↗</span></a>
        </div>
      </div>
      <div className="contact-bottom"><span>KRISHNA / DEVELOPER + VISUAL DESIGNER</span><span>INDIA / 2026</span></div>
    </div>
  </footer>;
}