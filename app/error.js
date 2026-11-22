"use client";

import Link from "next/link";

export default function PortfolioError({ reset }) {
  return (
    <main className="atlas-container atlas-empty-page">
      <h1>Page <em>interrupted.</em></h1>
      <p>A loading error interrupted this page. Try again or return to the map.</p>
      <div className="atlas-actions">
        <button type="button" onClick={reset} className="atlas-button atlas-button-primary">Try again</button>
        <Link href="/" className="atlas-button">Back to the map</Link>
      </div>
    </main>
  );
}
