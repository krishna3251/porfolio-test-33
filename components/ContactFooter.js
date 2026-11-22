"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const linkedInProfile = "https://www.linkedin.com/in/krishna-soni-a00910279";

export default function ContactFooter() {
  const { media } = useSiteMedia();
  const settings = media.slots?.contactBackground;
  const backdrop = portfolioImage(settings?.src, settings);

  return (
    <footer className="atlas-contact" id="contact" aria-labelledby="contact-title">
      {backdrop && <div className="atlas-contact-backdrop" aria-hidden="true">
        <Image {...backdrop} fill alt="" sizes="100vw" quality={72} />
        {settings.overlayOpacity > 0 && <span className="atlas-media-overlay" style={{ backgroundColor: settings.overlayColor, opacity: settings.overlayOpacity }} />}
      </div>}
      <div className="atlas-contact-inner atlas-container" data-atlas-reveal>
        <div><h2 id="contact-title">Let’s <em>talk.</em></h2><p>Have a web, AI or visual project in mind? I’d like to hear about it.</p></div>
        <div className="atlas-actions">
          {contactEmail && <a href={`mailto:${contactEmail}`} className="atlas-button atlas-button-primary">Email me</a>}
          <a href={linkedInProfile} target="_blank" rel="noreferrer" className={contactEmail ? "atlas-button" : "atlas-button atlas-button-primary"}>Connect on LinkedIn</a>
          <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="atlas-button">GitHub</a>
          {contactPhone && <a href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`} className="atlas-button">Call</a>}
        </div>
      </div>
      <div className="atlas-contact-bottom atlas-container">
        <span>© {new Date().getFullYear()} Krishna Soni</span>
        <Link href="#top">Back to top</Link>
      </div>
    </footer>
  );
}
