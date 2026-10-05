"use client";

import Link from "next/link";

export function CommandButton({href,label,accent=false,cursor,labelSuffix=""}) {
  const content = <>
    <span className="command-button-bracket">[</span>
    <span className="command-button-prefix">./</span>
    <span>{label}</span>
    {labelSuffix && <span className="command-button-suffix">{labelSuffix}</span>}
    <span className="command-button-arrow">↗</span>
    <span className="command-button-bracket">]</span>
  </>;

  const className = `command-button ${accent ? "command-button-accent" : ""}`;
  const dataCursor = cursor || label.toUpperCase();

  if (href?.startsWith("/")) {
    return <Link href={href} className={className} data-cursor={dataCursor}>{content}</Link>;
  }

  return <a href={href} className={className} data-cursor={dataCursor}>{content}</a>;
}

export function StatusChip({children="[ACTIVE]"}) {
  return <span className="portfolio-status-chip"><i aria-hidden="true"/>{children}</span>;
}
