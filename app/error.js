"use client";

import { useEffect } from "react";

export default function GlobalError({ reset }) {
  useEffect(() => {
    console.error("Portfolio route error.");
  }, []);

  return (
    <main className="min-h-screen grid place-items-center px-6 py-32 bg-[#08090b] text-[#f7f4ed]">
      <section className="w-full max-w-3xl border border-white/10 bg-white/[0.02] p-8 md:p-14">
        <div className="mono-metadata text-[#ff6a2a] mb-5">ERROR / 500</div>
        <h1 className="text-5xl md:text-8xl font-semibold tracking-[-0.06em]">
          Something broke<span className="text-[#ff6a2a]">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/60 leading-relaxed">
          The page hit an unexpected error. The interface has been notified instead of silently pretending everything is fine.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={() => reset()} className="command-button command-button-accent">
            [ ./retry ↻ ]
          </button>
          <a href="/" className="command-button">[ ./home ↗ ]</a>
        </div>
      </section>
    </main>
  );
}
