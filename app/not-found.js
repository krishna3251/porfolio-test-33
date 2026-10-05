export const metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found on the KRISHNA portfolio.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 py-32 bg-[#08090b] text-[#f7f4ed]">
      <section className="w-full max-w-3xl border border-white/10 bg-white/[0.02] p-8 md:p-14">
        <div className="mono-metadata text-[#ff6a2a] mb-5">ERROR / 404</div>
        <h1 className="text-5xl md:text-8xl font-semibold tracking-[-0.06em]">
          Page not found<span className="text-[#ff6a2a]">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/60 leading-relaxed">
          This route does not exist, or the link has wandered off into the void.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/" className="command-button command-button-accent">[ ./home ↗ ]</a>
          <a href="/thumbnails" className="command-button">[ ./work ↗ ]</a>
        </div>
      </section>
    </main>
  );
}
