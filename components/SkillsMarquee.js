const groups = [
  ["Software", "Python", "JavaScript", "Java", "C++", "SQL"],
  ["AI & automation", "LLM apps", "OpenRouter", "REST APIs", "Discord API"],
  ["Web", "Next.js", "React", "Tailwind", "Framer Motion", "GitHub"],
  ["Visual design", "Photoshop", "Thumbnail design", "Composition", "Art direction"],
];

export default function SkillsMarquee() {
  return (
    <section className="atlas-content-section atlas-container" id="skills" aria-labelledby="skills-title">
      <div className="atlas-heading-row"><h2 id="skills-title">Tools I <em>work with.</em></h2></div>
      <div className="atlas-skills-grid">
        {groups.map(([title, ...items]) => <div className="atlas-skill-group" key={title} data-atlas-reveal>
          <h3>{title}</h3>
          <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>)}
      </div>
    </section>
  );
}
