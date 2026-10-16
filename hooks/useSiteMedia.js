"use client";

import { useEffect, useState } from "react";

const EMPTY_MEDIA = { version: 1, design: { theme: "editorial" }, copy: {}, slots: {}, overrides: {} };

// The home page uses media config in several sections. Share a single in-flight
// request and cache the parsed result for this browser session instead of
// requesting the same JSON independently from every component.
let siteMediaValue = null;
let siteMediaPromise = null;

export function loadSiteMedia({ force = false } = {}) {
  if (force) {
    siteMediaPromise = null;
    siteMediaValue = null;
  }
  if (siteMediaValue) return Promise.resolve(siteMediaValue);
  if (siteMediaPromise) return siteMediaPromise;

  siteMediaPromise = fetch("/site-media.json?v=latest", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Could not load media configuration");
      return response.json();
    })
    .then((data) => {
      siteMediaValue = data && typeof data === "object" ? { ...EMPTY_MEDIA, ...data } : EMPTY_MEDIA;
      return siteMediaValue;
    })
    .catch(() => {
      siteMediaPromise = null;
      return EMPTY_MEDIA;
    });
  return siteMediaPromise;
}

export default function useSiteMedia() {
  const [media, setMedia] = useState(() => siteMediaValue || EMPTY_MEDIA);
  const [loaded, setLoaded] = useState(Boolean(siteMediaValue));

  useEffect(() => {
    let alive = true;
    loadSiteMedia().then((data) => {
      if (!alive) return;
      setMedia(data);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  return { media, loaded };
}
