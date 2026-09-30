"use client";

const principles=[
  ["01","Start with the problem","Understand what needs to exist before choosing the stack."],
  ["02","Keep systems understandable","Small pieces, clear naming, predictable behavior."],
  ["03","Design for the real user","Performance and clarity matter more than decorative complexity."],
  ["04","Ship, test, improve","Build a working version, learn from it, then make it better."]
];

export default function HowIBuild(){
  return <div>
    <div className="border-b border-white/10 pb-6 mb-10">
      <p className="mono-metadata text-primary mb-3">04 / Process</p>
      <h2 className="serif-display text-5xl md:text-7xl">How I build</h2>
    </div>
    <div className="divide-y divide-white/10 border-y border-white/10">
      {principles.map(([n,t,d])=><div key={n} className="grid md:grid-cols-12 gap-5 py-7">
        <span className="mono-metadata text-primary md:col-span-1">{n}</span>
        <h3 className="serif-display text-2xl md:text-3xl md:col-span-4">{t}</h3>
        <p className="text-sm text-muted leading-relaxed md:col-span-5 md:col-start-8">{d}</p>
      </div>)}
    </div>
  </div>
}
