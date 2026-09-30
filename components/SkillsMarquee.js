"use client";
const groups=[["Languages","Python","JavaScript","SQL","Java","C++"],["Systems","Discord API","REST APIs","Automation","Backend"],["AI","AI Applications","OpenRouter","Prompt Engineering","Chatbots"],["Creative","Photoshop","Digital Art","Thumbnail Design","Visual Direction"]];
export default function SkillsMarquee(){
 return <div className="home-section">
  <div className="section-number">03</div>
  <div className="border-b border-black/10 pb-6 mb-8"><p className="mono-metadata text-hot mb-3">03 / CAPABILITIES</p><h2 className="editorial-heading-sm">What I work with</h2></div>
  <div className="grid md:grid-cols-2 lg:grid-cols-4 border-l border-t border-black/10">{groups.map(([title,...items])=><div key={title} className="p-6 md:p-7 border-r border-b border-black/10 min-h-56 hover:bg-white/60 transition-colors"><p className="mono-metadata text-black/35 mb-7">{title}</p><ul className="space-y-3 text-sm">{items.map((s,i)=><li key={s} className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-hot"/>{s}</li>)}</ul></div>)}</div>
 </div>;
}