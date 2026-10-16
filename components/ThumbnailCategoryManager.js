"use client";

import { useEffect, useMemo, useState } from "react";
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
      src: getThumbnailSrc(filename),
      category: CATEGORIES.some((item) => item.value === config.overrides?.[filename]?.category)
        ? config.overrides[filename].category
        : (CATEGORIES.some((item) => item.value === getShortLabel(filename)) ? getShortLabel(filename) : "OTHER"),
      type: "Built-in",
    }));
    const uploaded = (config.thumbnails || []).map((thumbnail) => ({
      id: "uploaded:" + thumbnail.filename,
      filename: thumbnail.filename,
      title: thumbnail.title || thumbnail.filename,
      src: thumbnail.src,
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
      setNotice(data.message || "Categories saved. The public gallery updates after deployment.");
    } catch (failure) {
      setError(failure.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAll = (checked) => setSelected(checked ? items.map((item) => item.id) : []);
  const styles = {
    page: { minHeight: "100vh", background: "#101010", color: "#f3f0e9", padding: "clamp(18px, 4vw, 48px)", fontFamily: "Arial, sans-serif" },
    wrap: { maxWidth: 1440, margin: "0 auto" },
    muted: { color: "#a8a49d" },
    panel: { background: "#191919", border: "1px solid #343434", borderRadius: 16, padding: 18 },
    button: { border: "1px solid #5a5146", background: "#d9b887", color: "#17130f", borderRadius: 9, padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
    input: { width: "100%", background: "#101010", color: "#f3f0e9", border: "1px solid #444", borderRadius: 9, padding: 12 },
    select: { width: "100%", background: "#101010", color: "#f3f0e9", border: "1px solid #444", borderRadius: 9, padding: 10 },
  };

  if (loading) return <main style={styles.page}><p>Loading thumbnail archive…</p></main>;
  if (!config) return <main style={styles.page}><div style={styles.wrap}><a href="/admin" style={{ color: "#d9b887" }}>← Back to admin</a><h1>Thumbnail organizer</h1><p role="alert">{error}</p><p>Sign in at the main admin page, then open this organizer again.</p></div></main>;

  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <a href="/admin" style={{ color: "#d9b887", textDecoration: "none" }}>← BACK TO STUDIO</a>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap", margin: "24px 0" }}>
          <div><p style={{ ...styles.muted, letterSpacing: 3, fontSize: 12 }}>KRISHNA / MEDIA MANAGEMENT</p><h1 style={{ fontSize: "clamp(32px, 6vw, 58px)", margin: "8px 0" }}>Thumbnail <span style={{ color: "#d9b887" }}>organizer.</span></h1><p style={styles.muted}>Move existing artwork between categories without re-uploading the images.</p></div>
          <button style={styles.button} onClick={save} disabled={saving || !canWrite}>{saving ? "PUBLISHING…" : "PUBLISH CATEGORY CHANGES ↗"}</button>
        </header>
        <section style={{ ...styles.panel, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <input style={styles.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search thumbnails…" aria-label="Search thumbnails" />
            <select style={styles.select} value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by category">
              <option value="ALL">All categories</option>{CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
            <select style={styles.select} value={bulkCategory} onChange={(event) => setBulkCategory(event.target.value)} aria-label="Bulk destination category">
              {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
            <button style={styles.button} onClick={applyBulk}>MOVE {selected.length || ""} SELECTED</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={items.length > 0 && items.every((item) => selected.includes(item.id))} onChange={(event) => toggleAll(event.target.checked)} /> Select all visible ({items.length})</label>
            <span style={styles.muted}>{selected.length} selected · {items.length} shown</span>
          </div>
        </section>
        {error && <p role="alert" style={{ color: "#ff8d85" }}>{error}</p>}
        {notice && <p role="status" style={{ color: "#a9e5b0" }}>{notice}</p>}
        {!canWrite && <p style={{ color: "#ffcf8b" }}>Read-only: connect GITHUB_TOKEN in Vercel to publish changes.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))", gap: 14 }}>
          {items.map((item) => (
            <article key={item.id} style={{ ...styles.panel, padding: 12, borderColor: selected.includes(item.id) ? "#d9b887" : "#343434" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12, ...styles.muted }}><input type="checkbox" checked={selected.includes(item.id)} onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id))} />{item.type}</label>
              <div style={{ aspectRatio: "16 / 9", background: "#0b0b0b", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                <img src={item.src} alt={item.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <strong style={{ display: "block", fontSize: 13, overflowWrap: "anywhere", minHeight: 34 }}>{item.title}</strong>
              <label style={{ display: "block", fontSize: 11, letterSpacing: 1, ...styles.muted, margin: "12px 0 6px" }}>CATEGORY</label>
              <select style={styles.select} value={item.category} onChange={(event) => changeCategory(item.id, event.target.value)}>
                {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
            </article>
          ))}
        </div>
        {items.length === 0 && <p style={styles.muted}>No thumbnails match that search or category.</p>}
        <footer style={{ margin: "28px 0", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><span style={styles.muted}>Changes are drafts until published.</span><button style={styles.button} onClick={save} disabled={saving || !canWrite}>{saving ? "PUBLISHING…" : "PUBLISH CATEGORY CHANGES ↗"}</button></footer>
      </div>
    </main>
  );
}
