"use client";

import { useEffect, useState } from "react";

const EMPTY_MEDIA = { version: 1, design: { theme: "editorial" }, copy: {}, slots: {}, overrides: {} };

export default function useSiteMedia() {
  const [media, setMedia] = useState(EMPTY_MEDIA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/site-media.json?v=latest", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load media configuration");
        return response.json();
      })
      .then((data) => {
        if (alive && data && typeof data === "object") setMedia({ ...EMPTY_MEDIA, ...data });
      })
      .catch(() => {})
      .finally(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  return { media, loaded };
}
