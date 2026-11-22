"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import { portfolioImage } from "@/lib/portfolio-media";
import { THUMBNAIL_FILENAMES, getThumbnailSrc, getShortLabel } from "@/lib/thumbnails";

const CATEGORIES = [
  { value: "GENSHIN", label: "Genshin Impact" },
  { value: "HSR", label: "Honkai: Star Rail" },
  { value: "WUWA", label: "Wuthering Waves" },
  { value: "VALORANT", label: "Valorant" },
  { value: "PUBG", label: "PUBG" },
  { value: "NTE", label: "Neverness to Everness" },
  { value: "FORZA", label: "Forza Horizon" },
  { value: "OTHER", label: "Other" },
];

export default function ThumbnailCategoryManager() {
  const [config, setConfig] = useState(null);
  const [canWrite, setCanWrite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [bulkCategory, setBulkCategory] = useState("GENSHIN");

  useEffect(() => {
    fetch("/api/admin/media", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Admin login required. Open the main admin panel and sign in first.");
        setConfig(data.config);
        setCanWrite(Boolean(data.canWrite));
      })
      .catch((failure) => setError(failure.message || "Could not load thumbnails."))
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => {
    if (!config) return [];
    const builtIn = THUMBNAIL_FILENAMES.map((filename) => ({
      id: "built-in:" + filename,
      filename,
      title: filename,
      src: config.overrides?.[filename]?.src || getThumbnailSrc(filename),
      category: CATEGORIES.some((item) => item.value === config.overrides?.[filename]?.category)
        ? config.overrides[filename].category
        : (CATEGORIES.some((item) => item.value === getShortLabel(filename)) ? getShortLabel(filename) : "OTHER"),
      type: "Built-in",
    }));
    const uploaded = (config.thumbnails || []).map((thumbnail) => ({
      id: "uploaded:" + thumbnail.filename,
      filename: thumbnail.filename,
      title: thumbnail.title || thumbnail.filename,
      src: config.overrides?.[thumbnail.filename]?.src || thumbnail.src,
      category: thumbnail.category || "OTHER",
      type: "Uploaded",
    }));
    const query = search.trim().toLowerCase();
    return [...builtIn, ...uploaded].filter((item) =>
      (filter === "ALL" || item.category === filter) &&
      (item.title + " " + item.filename + " " + item.category).toLowerCase().includes(query)
    );
  }, [config, search, filter]);

  const changeCategory = (id, category) => {
    setConfig((previous) => {
      const next = { ...previous, overrides: { ...(previous.overrides || {}) }, thumbnails: [...(previous.thumbnails || [])] };
      if (id.startsWith("built-in:")) {
        const filename = id.slice("built-in:".length);
        const current = next.overrides[filename] || {
          label: filename, group: "Thumbnail archive", description: "Image override for " + filename,
          src: getThumbnailSrc(filename), fit: "cover", positionX: 50, positionY: 50,
          scale: 1, opacity: 1, overlayColor: "#a8271b", overlayOpacity: 0, visible: true,
        };
        next.overrides[filename] = { ...current, category };
      } else {
        const filename = id.slice("uploaded:".length);
        next.thumbnails = next.thumbnails.map((item) => item.filename === filename ? { ...item, category } : item);
      }
      return next;
    });
    setHasChanges(true);
    setNotice("");
    setError("");
  };

  const applyBulk = () => {
    if (!selected.length) {
      setError("Select at least one thumbnail first.");
      return;
    }
    selected.forEach((id) => changeCategory(id, bulkCategory));
    setNotice("Category changes staged for " + selected.length + " thumbnails. Publish to apply them.");
    setError("");
  };

  const save = async () => {
    if (!canWrite) {
      setError("GitHub write access is not connected. Add GITHUB_TOKEN in Vercel and redeploy.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save category changes.");
      setConfig(data.config);
      setSelected([]);
      setHasChanges(false);
      setNotice(data.message || "Categories saved. The public gallery updates after deployment.");
    } catch (failure) {
      setError(failure.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  function toggleVisible(checked) {
    const visible = new Set(items.map((item) => item.id));
    setSelected((previous) => checked ? Array.from(new Set([...previous, ...visible])) :
      previous.filter((id) => !visible.has(id)));
  }

  if (loading) return <main className="studio-organizer"><p role="status">Loading thumbnails…</p></main>;
  if (!config) return <main className="studio-organizer"><div className="studio-organizer-inner">
    <Link href="/admin" className="studio-button">Back to studio</Link>
    <h1>Thumbnail <em>organizer.</em></h1>
    <p role="alert">{error}</p>
  </div></main>;

  return (
    <main className="studio-organizer">
      <div className="studio-organizer-inner">
        <Link href="/admin" className="studio-button">Back to studio</Link>
        <header className="studio-organizer-header">
          <div>
            <h1>Thumbnail <em>organizer.</em></h1>
            <p>Move published thumbnails between categories. Changes stay in your draft until you publish.</p>
          </div>
          <button type="button" className="studio-button studio-button-primary" onClick={save} disabled={saving || !canWrite || !hasChanges}>
            {saving ? "Publishing…" : "Publish categories"}
          </button>
        </header>

        <section className="studio-organizer-tools" aria-label="Thumbnail filters and bulk actions">
          <div className="studio-organizer-filters">
            <label><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, file or game" /></label>
            <label><span>Category filter</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="ALL">All categories</option>
              {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select></label>
            <label><span>Move to category</span><select value={bulkCategory} onChange={(event) => setBulkCategory(event.target.value)}>
              {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select></label>
            <button type="button" className="studio-button" onClick={applyBulk} disabled={!selected.length}>Move selected</button>
          </div>
          <div className="studio-organizer-summary">
            <label><input type="checkbox" checked={items.length > 0 && items.every((item) => selected.includes(item.id))}
              onChange={(event) => toggleVisible(event.target.checked)} /> Select visible thumbnails</label>
            <span role="status">{selected.length} selected · {items.length} shown</span>
          </div>
        </section>
        {error && <p role="alert" className="studio-organizer-error">{error}</p>}
        {notice && <p role="status" className="studio-organizer-notice">{notice}</p>}
        {!canWrite && <p className="studio-organizer-readonly">Preview only. Connect GitHub publishing from your deployment settings to save category changes.</p>}

        <div className="studio-organizer-grid">
          {items.map((item) => {
            const image = portfolioImage(item.src, {}, "contain");
            const checked = selected.includes(item.id);
            return (
              <article key={item.id} className="studio-organizer-card" data-selected={checked}>
                <label className="studio-organizer-card-check"><input type="checkbox" checked={checked}
                  aria-label={`Select ${item.title}`}
                  onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id))} />{item.type}</label>
                <div className="studio-organizer-image">
                  {image && <PortfolioImage {...image} fill alt="" sizes="(max-width:540px) 45vw, 240px" quality={72} />}
                </div>
                <h2>{item.title}</h2>
                <label><span>Category</span><select aria-label={`Category for ${item.title}`} value={item.category}
                  onChange={(event) => changeCategory(item.id, event.target.value)}>
                  {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select></label>
              </article>
            );
          })}
        </div>
        {items.length === 0 && <p role="status">No thumbnails match your search.</p>}
      </div>
    </main>
  );
}
