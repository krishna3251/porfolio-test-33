"use client";

const groups=[
  ["Languages","Python","JavaScript","SQL","Java","C++"],
  ["Systems","Discord API","REST APIs","Automation","Backend"],
  ["AI","AI Applications","OpenRouter","Prompt Engineering","Chatbots"],
  ["Creative","Photoshop","Digital Art","Thumbnail Design","Visual Direction"]
];

export default function SkillsMarquee(){
  return <div>
    <div className="border-b border-white/10 pb-6 mb-10">
      <p className="mono-metadata text-primary mb-3">04 / Capabilities</p>
      <h2 className="serif-display text-5xl md:text-7xl">What I work with</h2>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
      {groups.map(([title,...skills])=><div key={title} className="p-6 border-r border-b border-white/10 min-h-52">
        <p className="mono-metadata text-muted mb-6">{title}</p>
        <ul className="space-y-3 text-sm">{skills.map(s=><li key={s}>{s}</li>)}</ul>
      </div>)}
    </div>
  </div>
}
