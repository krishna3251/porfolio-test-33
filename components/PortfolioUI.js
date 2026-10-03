"use client";

export function CommandButton({href,label,accent=false,cursor,labelSuffix=""}) {
  return <a href={href} className={`command-button ${accent ? "command-button-accent" : ""}`} data-cursor={cursor || label.toUpperCase()}>
    <span className="command-button-bracket">[</span>
    <span className="command-button-prefix">./</span>
    <span>{label}</span>
    {labelSuffix && <span className="command-button-suffix">{labelSuffix}</span>}
    <span className="command-button-arrow">↗</span>
    <span className="command-button-bracket">]</span>
  </a>;
}

export function StatusChip({children="[ACTIVE]"}) {
  return <span className="portfolio-status-chip"><i aria-hidden="true"/>{children}</span>;
}
