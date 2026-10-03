"use client";

import React from "react";

export default function ProjectIndexRail({ items = [] }) {
  return (
    <nav className="project-index-rail" aria-label="Selected work index">
      {items.map((item) => (
        <a
          key={item.no}
          href={`#selected-project-${item.no}`}
          className="project-index-item"
          data-cursor={`PROJECT ${item.no}`}
        >
          <span className="project-index-no">{item.no}</span>
          <span className="project-index-copy">
            <small>{item.label} / 2026</small>
            <strong>{item.title}</strong>
            <em>{item.meta}</em>
          </span>
          <span className="project-index-track" aria-hidden="true">
            <i />
          </span>
          <span className="project-index-arrow" aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}
