"use client";
const groups=[["Software","Python","JavaScript","Java","C++","SQL"],["AI + Systems","AI applications","OpenRouter","REST APIs","Discord API","Automation"],["Web","Next.js","React","Tailwind","Framer Motion","GitHub"],["Visual","Photoshop","Thumbnail design","Digital art","Composition","Art direction"]];
export default function SkillsMarquee(){
 return <section className="portfolio-skills" id="skills">
  <span className="portfolio-kicker">Capabilities</span>
  <h2 className="mt-5">What I <em>work with.</em></h2>
  <div className="portfolio-skill-grid">{groups.map(([title,...items])=><div className="portfolio-skill" key={title}><h3>{title}</h3><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></div>)}</div>
 </section>;
}