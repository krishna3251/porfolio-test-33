"use client";
const principles=[["01","Start with the problem","Understand what needs to exist before choosing the stack."],["02","Keep systems understandable","Small pieces, clear naming, predictable behavior."],["03","Design for the real user","Performance and clarity matter more than decorative complexity."],["04","Ship, test, improve","Build a working version, learn from it, then make it better."]];
export default function HowIBuild(){
 return <div className="home-section">
  <div className="section-number">04</div>
  <div className="border-b border-black/10 pb-6 mb-2"><p className="mono-metadata text-hot mb-3">04 / PROCESS</p><h2 className="editorial-heading-sm">How I build</h2></div>
  <div className="divide-y divide-black/10 border-b border-black/10">{principles.map(([n,t,d])=><div key={n} className="process-row grid md:grid-cols-12 gap-5 py-8"><span className="mono-metadata text-hot md:col-span-1">{n}</span><h3 className="font-mono font-bold text-xl md:text-2xl md:col-span-4 tracking-[-.04em]">{t}</h3><p className="text-sm text-black/50 leading-7 md:col-span-5 md:col-start-8">{d}</p></div>)}</div>
 </div>;
}