"use client";
const rows=[["01","Understand","Start with the problem, the person using it, and what actually needs to exist."],["02","Build","Turn the idea into small, understandable pieces with a clear path from input to result."],["03","Test","Use the real thing, find the weak parts, and remove complexity that does not earn its place."],["04","Improve","Ship, learn, iterate. A working version teaches more than an immaculate plan." ]];
export default function HowIBuild(){
 return <section className="portfolio-process" id="process">
  <span className="portfolio-kicker">My approach</span>
  <h2 className="mt-5">How I <em>build.</em></h2>
  <div className="portfolio-process-list">{rows.map(([n,t,d])=><div className="portfolio-process-row" key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>)}</div>
 </section>;
}