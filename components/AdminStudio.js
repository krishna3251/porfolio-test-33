"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { THUMBNAIL_FILENAMES, getThumbnailSrc } from "@/lib/thumbnails";

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(0.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      if (comma < 0) return reject(new Error("The image could not be read."));
      resolve(result.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("The browser could not read that image."));
    reader.readAsDataURL(file);
  });
}

function thumbnailDefault(filename) {
  return {
    label: filename,
    group: "Thumbnail archive",
    description: "Override the image used for " + filename,
    src: getThumbnailSrc(filename),
    fit: "cover",
    positionX: 50,
    positionY: 50,
    scale: 1,
    opacity: 1,
    overlayColor: "#a8271b",
    overlayOpacity: 0,
    visible: true
  };
}

const THUMBNAIL_CATEGORIES = [
  { value: "GENSHIN", label: "Genshin Impact" },
  { value: "HSR", label: "Honkai: Star Rail" },
  { value: "WUWA", label: "Wuthering Waves" },
  { value: "VALORANT", label: "Valorant" },
  { value: "PUBG", label: "PUBG" },
  { value: "NTE", label: "Neverness to Everness (NTE)" },
  { value: "FORZA", label: "Forza Horizon" },
  { value: "OTHER", label: "Other" }
];

export default function AdminStudio() {
  const fileRef = useRef(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null);
  const [canWrite, setCanWrite] = useState(false);
  const [repo, setRepo] = useState("krishna3251/porfolio-test-33");
  const [branch, setBranch] = useState("main");
  const [selectedKey, setSelectedKey] = useState("heroPortrait");
  const [pendingFile, setPendingFile] = useState(null);
  const [sidebarFilter, setSidebarFilter] = useState("All images");
  const [assetSearch, setAssetSearch] = useState("");
  const [workspaceTab, setWorkspaceTab] = useState("images");
  const [hasChanges, setHasChanges] = useState(false);
  const [savedConfig, setSavedConfig] = useState(null);
  const [newThumbnail, setNewThumbnail] = useState({ category: "GENSHIN", title: "", subtitle: "" });
  const searchInputRef = useRef(null);
  const saveActionRef = useRef(null);

  const readMedia = async () => {
    const response = await fetch("/api/admin/media", { cache: "no-store", credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Could not load the media manifest.");
    setConfig(data.config);
    setSavedConfig(data.config);
    setHasChanges(false);
    setCanWrite(Boolean(data.canWrite));
    setRepo(data.repository || "krishna3251/porfolio-test-33");
    setBranch(data.branch || "main");
    setAuthenticated(true);
    return data;
  };

  useEffect(() => {
    readMedia().catch((failure) => {
      if (failure.message && !failure.message.toLowerCase().includes("login")) setError(failure.message);
      setAuthenticated(false);
    }).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!pendingFile?.previewUrl) return;
    return () => URL.revokeObjectURL(pendingFile.previewUrl);
  }, [pendingFile?.previewUrl]);

  const slotEntries = useMemo(() => {
    const slots = Object.entries(config?.slots || {}).map(([key, value]) => ({ key, kind: "slot", label: value.label || key, group: value.group || "Other", value }));
    const thumbs = THUMBNAIL_FILENAMES.map((filename) => ({
      key: "thumb:" + filename,
      kind: "thumbnail",
      label: filename,
      group: "Thumbnail archive",
      value: config?.overrides?.[filename] || thumbnailDefault(filename)
    }));
    const uploaded = (config?.thumbnails || [])
      .filter((thumbnail) => thumbnail?.filename && !THUMBNAIL_FILENAMES.includes(thumbnail.filename))
      .map((thumbnail) => ({
        key: "thumb:" + thumbnail.filename,
        kind: "thumbnail",
        label: thumbnail.title || thumbnail.filename,
        group: "Thumbnail archive",
        value: config?.overrides?.[thumbnail.filename] || {
          ...thumbnailDefault(thumbnail.filename),
          label: thumbnail.title || thumbnail.filename,
          description: "Uploaded " + (thumbnail.category || "OTHER") + " thumbnail",
          src: thumbnail.src || ""
        }
      }));
    return slots.concat(thumbs, uploaded);
  }, [config]);

  const visibleEntries = slotEntries.filter((entry) => (sidebarFilter === "All images" || entry.group === sidebarFilter) && (entry.label + " " + entry.key + " " + entry.group).toLowerCase().includes(assetSearch.trim().toLowerCase()));
  const groups = ["All images", ...Array.from(new Set(slotEntries.map((entry) => entry.group)))];
  const isThumbnail = selectedKey.startsWith("thumb:");
  const thumbName = isThumbnail ? selectedKey.slice(6) : "";
  const settings = isThumbnail
    ? (config?.overrides?.[thumbName] || thumbnailDefault(thumbName))
    : (config?.slots?.[selectedKey] || {});
  const selectedEntry = slotEntries.find((entry) => entry.key === selectedKey);
  const selectedGroup = selectedEntry?.group || "Media";
  const currentSrc = settings.src || "";

  const updateSettings = (patch) => {
    setConfig((previous) => {
      if (!previous) return previous;
      if (isThumbnail) {
        const current = previous.overrides?.[thumbName] || thumbnailDefault(thumbName);
        return { ...previous, overrides: { ...previous.overrides, [thumbName]: { ...current, ...patch } } };
      }
      return { ...previous, slots: { ...previous.slots, [selectedKey]: { ...previous.slots[selectedKey], ...patch } } };
    });
    setHasChanges(true);
    setNotice("");
    setError("");
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setNotice("");
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      setError("Use a PNG, JPEG, WebP or AVIF image. SVG uploads are blocked for safety.");
      event.target.value = "";
      return;
    }
    if (file.size > 3.4 * 1024 * 1024) {
      setError("Keep uploads below 3.4 MB so Vercel can process and commit them reliably.");
      event.target.value = "";
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPendingFile({ filename: file.name, contentType: file.type, file, previewUrl });
    setHasChanges(true);
    setNotice("Image ready. Preview updates immediately; publish when you're happy with the crop.");
  };

  const save = async () => {
    if (workspaceTab === "thumbnails" && !pendingFile) {
      setError("Choose a thumbnail image before publishing.");
      return;
    }
    if (workspaceTab === "thumbnails" && !newThumbnail.title.trim()) {
      setError("Add a title so the thumbnail is easy to identify in the archive.");
      return;
    }
    if (!canWrite) {
      setError("GitHub is not connected yet. Add GITHUB_TOKEN in the Vercel project environment settings, then redeploy.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("Saving the media manifest to GitHub…");
    try {
      const target = workspaceTab === "thumbnails"
        ? { kind: "new-thumbnail", category: newThumbnail.category, title: newThumbnail.title.trim(), subtitle: newThumbnail.subtitle.trim() }
        : isThumbnail ? { kind: "thumbnail", key: thumbName } : { kind: "slot", key: selectedKey };
      const upload = pendingFile ? {
        filename: pendingFile.filename,
        contentType: pendingFile.contentType,
        data: await fileToBase64(pendingFile.file)
      } : undefined;
      const response = await fetch("/api/admin/media", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, target, upload })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setConfig(data.config);
      setSavedConfig(data.config);
      setHasChanges(false);
      setPendingFile(null);
      if (workspaceTab === "thumbnails") {
        setNewThumbnail((previous) => ({ ...previous, title: "", subtitle: "" }));
      }
      setNotice(data.message || "Saved. Vercel will deploy the changes from GitHub.");
      if (fileRef.current) fileRef.current.value = "";
    } catch (failure) {
      setError(failure.message || "Save failed.");
      setNotice("");
    } finally {
      setBusy(false);
    }
  };

  saveActionRef.current = save;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!authenticated) return;
      const target = event.target;
      const typing = target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!busy) saveActionRef.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [authenticated, busy]);

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setLoginError("");
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Access denied.");
      setPassword("");
      await readMedia();
    } catch (failure) {
      setLoginError(failure.message || "Access denied.");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" }).catch(() => {});
    setAuthenticated(false);
    setConfig(null);
    setPendingFile(null);
    setNotice("");
    setError("");
  };

  const switchWorkspaceTab = (nextTab) => {
    if (nextTab !== workspaceTab) {
      setPendingFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setNotice("");
      setError("");
    }
    setWorkspaceTab(nextTab);
  };

  const updateCopy = (key, value) => {
    setConfig((previous) => ({ ...previous, copy: { ...previous.copy, [key]: value } }));
    setHasChanges(true);
    setNotice("");
    setError("");
  };
  const updateDesign = (key, value) => {
    setConfig((previous) => ({ ...previous, design: { ...previous.design, [key]: value } }));
    setHasChanges(true);
    setNotice("");
    setError("");
  };
  const discardDraft = () => {
    if (savedConfig) setConfig(savedConfig);
    setHasChanges(false);
    setPendingFile(null);
    setNewThumbnail({ category: "GENSHIN", title: "", subtitle: "" });
    if (fileRef.current) fileRef.current.value = "";
    setError("");
    setNotice("Draft changes discarded.");
  };
  const resetCrop = () => updateSettings({ fit: "cover", positionX: 50, positionY: 50, scale: 1, opacity: 1, overlayOpacity: 0 });

  if (checking) {
    return <div className="admin-gate"><div className="admin-gate-panel"><div className="admin-mark">K<span>.</span></div><p className="admin-eyebrow">KRISHNA / PRIVATE STUDIO</p><h1>Opening your<br /><em>workspace.</em></h1><div className="admin-loading-line"><span /></div><small>CHECKING SECURE SESSION</small></div></div>;
  }

  if (!authenticated) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-art" aria-hidden="true"><span>KR</span><i /><b>01 / DESIGN STUDIO</b></div>
        <div className="admin-gate-panel">
          <div className="admin-mark">K<span>.</span></div>
          <p className="admin-eyebrow">PRIVATE WORKSPACE / ACCESS CONTROL</p>
          <h1>Your site.<br /><em>Your rules.</em></h1>
          <p className="admin-gate-copy">Sign in to adjust image crops, replace artwork, upload fresh assets, and tune the look of the portfolio.</p>
          <form onSubmit={login} className="admin-login-form">
            <label htmlFor="admin-password">ADMIN PASSWORD</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required autoFocus />
            {loginError && <p className="admin-error" role="alert">{loginError}</p>}
            <button type="submit" disabled={busy}>{busy ? "VERIFYING…" : "ENTER STUDIO"} <span>↗</span></button>
          </form>
          <div className="admin-gate-foot"><span>ENCRYPTED SESSION</span><span>KRISHNA® / 2026</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand" aria-label="Return to site">K<span>.</span><small>CREATIVE STUDIO</small></a>
        <div className="admin-side-label">WORKSPACE</div>
        <div className="admin-side-status"><i /> SESSION SECURE <span>12H</span></div>
        <div className="admin-side-label">MEDIA LIBRARY <b>{visibleEntries.length}/{slotEntries.length}</b></div>
        <label className="admin-search-wrap"><span aria-hidden="true">⌕</span><input aria-label="Search media assets" value={assetSearch} onChange={(event) => setAssetSearch(event.target.value)} placeholder="Search images…" /><kbd>/</kbd></label>
        <div className="admin-filters">
          {groups.map((group) => <button type="button" key={group} className={sidebarFilter === group ? "active" : ""} onClick={() => setSidebarFilter(group)}>{group}<span>{group === "All images" ? slotEntries.length : slotEntries.filter((entry) => entry.group === group).length}</span></button>)}
        </div>
        <div className="admin-side-bottom"><span>REPOSITORY</span><a href={"https://github.com/" + repo} target="_blank" rel="noreferrer">{repo} ↗</a><button type="button" onClick={logout}>LOCK STUDIO ↗</button></div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-eyebrow">CONTROL ROOM / 01</span><h1>Visual <em>designer.</em></h1></div>
          <div className="admin-topbar-right"><span className={canWrite ? "admin-connection is-ready" : "admin-connection"}><i />{canWrite ? "TOKEN PRESENT / WRITE CHECK ON SAVE" : "READ-ONLY MODE"}</span><span className={hasChanges || pendingFile ? "admin-draft-status is-dirty" : "admin-draft-status"}><i />{pendingFile ? "IMAGE STAGED" : hasChanges ? "UNSAVED CHANGES" : "ALL CHANGES SAVED"}</span><a href="/" target="_blank" rel="noreferrer">VIEW LIVE SITE ↗</a></div>
        </header>

        <nav className="admin-mode-nav" aria-label="Admin editor mode">
          <button type="button" className={workspaceTab === "images" ? "active" : ""} aria-pressed={workspaceTab === "images"} onClick={() => switchWorkspaceTab("images")}><span>01</span><strong>Images</strong><small>Replace, crop & position</small></button>
          <button type="button" className={workspaceTab === "design" ? "active" : ""} aria-pressed={workspaceTab === "design"} onClick={() => switchWorkspaceTab("design")}><span>02</span><strong>Site design</strong><small>Theme & corner style</small></button>
          <button type="button" className={workspaceTab === "content" ? "active" : ""} aria-pressed={workspaceTab === "content"} onClick={() => switchWorkspaceTab("content")}><span>03</span><strong>Text & content</strong><small>Homepage copy</small></button>
          <button type="button" className={workspaceTab === "thumbnails" ? "active" : ""} aria-pressed={workspaceTab === "thumbnails"} onClick={() => switchWorkspaceTab("thumbnails")}><span>04</span><strong>Thumbnail uploads</strong><small>Add work by category</small></button>
        </nav>

        {!canWrite && <section className="admin-setup-alert">
          <div className="admin-setup-icon">!</div>
          <div><strong>One-time GitHub connection required</strong><p>The studio can preview your settings now. To upload pictures and commit changes, add <code>GITHUB_TOKEN</code> as an encrypted environment variable in Vercel, with Contents read/write access to this repository, then redeploy. Do not paste the token into this page.</p><a href="https://vercel.com/krishna3251s-projects/tests/settings/environment-variables" target="_blank" rel="noreferrer">OPEN VERCEL ENVIRONMENT SETTINGS ↗</a></div>
        </section>}

        <div className={`admin-workspace-grid ${workspaceTab !== "images" ? "admin-workspace-grid-single" : ""}`}>
          {workspaceTab === "images" && <section className="admin-image-panel">
            <div className="admin-panel-head"><div><span className="admin-eyebrow">ASSET SELECTOR / LIVE PREVIEW</span><h2>Media <em>library.</em></h2><p className="admin-panel-subtitle">Pick an asset, preview your changes, then publish once.</p></div><span className="admin-count">{visibleEntries.length} / {slotEntries.length} ASSETS</span></div>
            <label className="admin-field-label" htmlFor="media-target">CHOOSE ANY IMAGE IN THE SITE</label>
            <select id="media-target" value={selectedKey} onChange={(event) => { setSelectedKey(event.target.value); setPendingFile(null); setNotice(""); setError(""); if (fileRef.current) fileRef.current.value = ""; }}>
              {groups.slice(1).map((group) => <optgroup label={group} key={group}>{visibleEntries.filter((entry) => entry.group === group).map((entry) => <option key={entry.key} value={entry.key}>{entry.label}</option>)}</optgroup>)}
              {visibleEntries.filter((entry) => entry.group === "Thumbnail archive").length === 0 && sidebarFilter !== "All images" ? null : null}
            </select>

            <div className="admin-preview-stage">
              <div className="admin-preview-grid" aria-hidden="true" />
              {(pendingFile?.previewUrl || currentSrc) ? <img src={pendingFile?.previewUrl || currentSrc} alt="" className="admin-preview-img" style={imageStyle(settings)} /> : <div className="admin-preview-empty"><span>+</span><strong>NO IMAGE SET</strong><small>Upload a transparent cutout or background.</small></div>}
              {settings.overlayOpacity > 0 && <span className="admin-preview-overlay" style={{ backgroundColor: settings.overlayColor || "#a8271b", opacity: settings.overlayOpacity }} />}
              <span className="admin-preview-index">{selectedGroup.toUpperCase()} / PREVIEW</span>
              {settings.visible === false && <span className="admin-hidden-pill">HIDDEN ON SITE</span>}
              <span className="admin-preview-frame top-left" /><span className="admin-preview-frame top-right" /><span className="admin-preview-frame bottom-left" /><span className="admin-preview-frame bottom-right" />
            </div>
            <div className="admin-preview-caption"><div><strong>{selectedEntry?.label || selectedKey}</strong><span>{isThumbnail ? "THUMBNAIL OVERRIDE" : "SITE IMAGE SLOT"}</span></div><span className="admin-caption-dot" /></div>

            <div className="admin-upload-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (!file) return; if (fileRef.current) { const transfer = new DataTransfer(); transfer.items.add(file); fileRef.current.files = transfer.files; fileRef.current.dispatchEvent(new Event("change", { bubbles: true })); } }}>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleFile} />
              <div className="admin-upload-icon">↑</div>
              <div><strong>{pendingFile ? pendingFile.filename : "Drop a new image here"}</strong><p>PNG, JPG, WebP or AVIF · max 3.4 MB</p></div>
              <button type="button" onClick={() => fileRef.current?.click()}>BROWSE</button>
            </div>
            <div className="admin-source-block">
              <label className="admin-field-label" htmlFor="media-source">OR USE AN IMAGE URL</label>
              <input id="media-source" type="url" placeholder="/uploads/your-image.webp or https://…" value={settings.src || ""} onChange={(event) => updateSettings({ src: event.target.value })} />
              <p>Local images should begin with <code>/</code>. Uploading creates a file in the repo and updates this slot automatically.</p>
            </div>
          </section>}

          <section className="admin-controls-panel">
            <div className="admin-panel-head">
              <div>
                <span className="admin-eyebrow">{workspaceTab === "images" ? "EDIT SELECTED ASSET" : workspaceTab === "design" ? "GLOBAL ART DIRECTION" : workspaceTab === "thumbnails" ? "THUMBNAIL ARCHIVE" : "SITE CONTENT"}</span>
                <h2>{workspaceTab === "images" ? <>Crop & <em>tune.</em></> : workspaceTab === "design" ? <>Set the <em>mood.</em></> : workspaceTab === "thumbnails" ? <>Add a <em>thumbnail.</em></> : <>Words that <em>fit.</em></>}</h2>
                <p className="admin-panel-subtitle">{workspaceTab === "images" ? "Adjust crop and position, with an instant preview." : workspaceTab === "design" ? "Change the visual direction of the entire site." : workspaceTab === "thumbnails" ? "Upload new artwork and place it in the right archive category." : "Edit homepage text without touching the code."}</p>
              </div>
              <span className="admin-current-tag">{workspaceTab === "images" ? selectedKey : workspaceTab === "design" ? (config.design?.theme || "editorial") : workspaceTab === "thumbnails" ? "ARCHIVE / UPLOAD" : "HOME / COPY"}</span>
            </div>

            {workspaceTab === "images" && <>
              <div className="admin-quick-actions">
                <button type="button" onClick={() => updateSettings({ positionX: 50, positionY: 50, scale: 1 })}>CENTER CROP</button>
                <button type="button" onClick={resetCrop}>RESET IMAGE SETTINGS</button>
              </div>
              <div className="admin-image-controls">
            <div className="admin-control-group">
              <div className="admin-control-title"><label htmlFor="media-fit">FIT MODE</label><span>FRAME BEHAVIOR</span></div>
              <select id="media-fit" value={settings.fit || "cover"} onChange={(event) => updateSettings({ fit: event.target.value })}><option value="cover">Cover / fill frame</option><option value="contain">Contain / show whole image</option></select>
            </div>
            <div className="admin-control-group">
              <div className="admin-control-title"><label htmlFor="media-position-x">HORIZONTAL POSITION</label><output>{settings.positionX ?? 50}%</output></div>
              <input id="media-position-x" type="range" min="0" max="100" value={settings.positionX ?? 50} onChange={(event) => updateSettings({ positionX: Number(event.target.value) })} />
            </div>
            <div className="admin-control-group">
              <div className="admin-control-title"><label htmlFor="media-position-y">VERTICAL POSITION</label><output>{settings.positionY ?? 50}%</output></div>
              <input id="media-position-y" type="range" min="0" max="100" value={settings.positionY ?? 50} onChange={(event) => updateSettings({ positionY: Number(event.target.value) })} />
            </div>
            <div className="admin-control-group">
              <div className="admin-control-title"><label htmlFor="media-scale">IMAGE SCALE</label><output>{Number(settings.scale || 1).toFixed(2)}×</output></div>
              <input id="media-scale" type="range" min="0.5" max="2.5" step="0.05" value={settings.scale || 1} onChange={(event) => updateSettings({ scale: Number(event.target.value) })} />
            </div>
            <div className="admin-control-group">
              <div className="admin-control-title"><label htmlFor="media-opacity">IMAGE OPACITY</label><output>{Math.round((settings.opacity ?? 1) * 100)}%</output></div>
              <input id="media-opacity" type="range" min="0" max="1" step="0.05" value={settings.opacity ?? 1} onChange={(event) => updateSettings({ opacity: Number(event.target.value) })} />
            </div>
            <div className="admin-control-group">
              <div className="admin-control-title"><label htmlFor="media-overlay">COLOR OVERLAY</label><span>OPTIONAL</span></div>
              <div className="admin-color-row"><input id="media-overlay" type="color" value={settings.overlayColor || "#a8271b"} onChange={(event) => updateSettings({ overlayColor: event.target.value })} /><input type="range" aria-label="Overlay opacity" min="0" max="1" step="0.05" value={settings.overlayOpacity || 0} onChange={(event) => updateSettings({ overlayOpacity: Number(event.target.value) })} /><output>{Math.round((settings.overlayOpacity || 0) * 100)}%</output></div>
            </div>
            <label className="admin-toggle-row"><span><strong>Show this image</strong><small>Hide without deleting the saved asset.</small></span><input type="checkbox" checked={settings.visible !== false} onChange={(event) => updateSettings({ visible: event.target.checked })} /></label>
              </div>
            </>}

            {workspaceTab === "design" && <div className="admin-design-extra admin-design-tab">
              <span className="admin-eyebrow">GLOBAL DESIGN</span>
              <div className="admin-control-title"><label htmlFor="admin-theme">SITE COLOR DIRECTION</label><span>THEME PRESETS</span></div>
              <select id="admin-theme" value={config.design?.theme || "editorial"} onChange={(event) => updateDesign("theme", event.target.value)}>
                <option value="editorial">Editorial / paper + ink</option>
                <option value="darkroom">Darkroom / cinematic</option>
                <option value="sunset">Sunset / warm</option>
                <option value="minimalism">Minimal / quiet</option>
                <option value="custom">Custom palette</option>
              </select>
              {config.design?.theme === "custom" && <div className="admin-theme-colors">{[["paper","Paper"],["surface","Panels"],["ink","Ink"],["muted","Muted text"],["accent","Accent"],["orange","Orange"],["border","Borders"]].map(([key,label]) => <label key={key}><span>{label}</span><input type="color" value={config.design[key] || "#eeeadf"} onChange={(event) => updateDesign(key, event.target.value)} /></label>)}</div>}
              <div className="admin-radius-control">
                <div className="admin-control-title"><label htmlFor="admin-radius">CARD CORNER RADIUS</label><output>{config.design?.radius || 12}px</output></div>
                <input id="admin-radius" type="range" min="4" max="28" value={config.design?.radius || 12} onChange={(event) => updateDesign("radius", Number(event.target.value))} />
                <div className="admin-radius-preview"><span style={{ borderRadius: (config.design?.radius || 12) + "px" }}>CARD PREVIEW</span><span style={{ borderRadius: (config.design?.radius || 12) + "px" }}>IMAGE FRAME</span></div>
              </div>
              <p className="admin-editor-help">Theme changes are saved with your site configuration and appear on the live site after deployment.</p>
            </div>}

            {workspaceTab === "content" && <div className="admin-design-extra admin-content-tab">
              <span className="admin-eyebrow">HOMEPAGE COPY</span>
              <p className="admin-editor-help">Keep the main lines focused so they remain readable on mobile screens.</p>
              <label className="admin-copy-field"><span>Eyebrow / short tagline</span><input value={config.copy?.heroEyebrow || ""} onChange={(event) => updateCopy("heroEyebrow", event.target.value)} maxLength={180} /></label>
              <label className="admin-copy-field"><span>Hero description</span><textarea value={config.copy?.heroDescription || ""} onChange={(event) => updateCopy("heroDescription", event.target.value)} rows={3} maxLength={500} /></label>
              <label className="admin-copy-field"><span>Profile lead</span><textarea value={config.copy?.profileLead || ""} onChange={(event) => updateCopy("profileLead", event.target.value)} rows={2} maxLength={180} /></label>
              <label className="admin-copy-field"><span>Profile description</span><textarea value={config.copy?.profileBody || ""} onChange={(event) => updateCopy("profileBody", event.target.value)} rows={4} maxLength={500} /></label>
              <div className="admin-copy-counter"><span>CONTENT STATUS</span><strong>{hasChanges ? "DRAFT HAS CHANGES" : "SAVED VERSION"}</strong></div>
            </div>}

            {workspaceTab === "thumbnails" && <div className="admin-design-extra admin-thumbnail-upload-tab">
              <span className="admin-eyebrow">NEW THUMBNAIL ENTRY</span>
              <p className="admin-editor-help">Each upload becomes a new card in the public thumbnail archive. Choose a category to make it appear under that category filter.</p>
              <label className="admin-copy-field">
                <span>THUMBNAIL TITLE *</span>
                <input value={newThumbnail.title} onChange={(event) => { setNewThumbnail((previous) => ({ ...previous, title: event.target.value })); setHasChanges(true); setError(""); setNotice(""); }} placeholder="e.g. Furina Cinematic Thumbnail" maxLength={120} required />
              </label>
              <label className="admin-copy-field">
                <span>ARCHIVE CATEGORY *</span>
                <select value={newThumbnail.category} onChange={(event) => { setNewThumbnail((previous) => ({ ...previous, category: event.target.value })); setHasChanges(true); setError(""); setNotice(""); }}>
                  {THUMBNAIL_CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </label>
              <label className="admin-copy-field">
                <span>SHORT DESCRIPTION / OPTIONAL</span>
                <input value={newThumbnail.subtitle} onChange={(event) => { setNewThumbnail((previous) => ({ ...previous, subtitle: event.target.value })); setHasChanges(true); setError(""); setNotice(""); }} placeholder="e.g. Blue-hour character composition" maxLength={180} />
              </label>
              <div className="admin-preview-stage admin-new-thumbnail-preview">
                <div className="admin-preview-grid" aria-hidden="true" />
                {pendingFile?.previewUrl ? <img src={pendingFile.previewUrl} alt="" className="admin-preview-img" style={{ objectFit: "contain" }} /> : <div className="admin-preview-empty"><span>+</span><strong>THUMBNAIL PREVIEW</strong><small>Choose an image to preview it here.</small></div>}
                <span className="admin-preview-index">{newThumbnail.category} / NEW WORK</span>
                <span className="admin-preview-frame top-left" /><span className="admin-preview-frame top-right" /><span className="admin-preview-frame bottom-left" /><span className="admin-preview-frame bottom-right" />
              </div>
              <div className="admin-upload-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (!file) return; if (fileRef.current) { const transfer = new DataTransfer(); transfer.items.add(file); fileRef.current.files = transfer.files; fileRef.current.dispatchEvent(new Event("change", { bubbles: true })); } }}>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleFile} />
                <div className="admin-upload-icon">↑</div>
                <div><strong>{pendingFile ? pendingFile.filename : "Choose a thumbnail image"}</strong><p>PNG, JPG, WebP or AVIF · max 3.4 MB · 16:9 recommended</p></div>
                <button type="button" onClick={() => fileRef.current?.click()}>BROWSE</button>
              </div>
              <div className="admin-thumbnail-existing">
                <div className="admin-thumbnail-existing-head"><span>YOUR UPLOADED THUMBNAILS</span><strong>{(config.thumbnails || []).length}</strong></div>
                {(config.thumbnails || []).length === 0 ? <p className="admin-editor-help">No custom thumbnails yet. Your next upload will show up here.</p> : (config.thumbnails || []).slice().reverse().slice(0, 8).map((thumbnail) => <div className="admin-thumbnail-existing-row" key={thumbnail.filename}><span>{thumbnail.title}</span><b>{thumbnail.category}</b></div>)}
              </div>
            </div>}

            <div className="admin-save-area">
              <div className="admin-save-summary"><span className={hasChanges || pendingFile ? "admin-save-indicator is-dirty" : "admin-save-indicator"} /><div><strong>{workspaceTab === "thumbnails" ? (pendingFile ? "Thumbnail ready to publish" : "Create a thumbnail entry") : pendingFile ? "New image ready to upload" : hasChanges ? "You have unpublished changes" : "Everything is saved"}</strong><small>{workspaceTab === "thumbnails" ? "The thumbnail will be added to its selected category after deployment." : canWrite ? "Publishing saves to GitHub; Vercel then deploys the updated site." : "Connect GITHUB_TOKEN in Vercel to enable publishing."}</small></div></div>
              {error && <p className="admin-error" role="alert">{error}</p>}
              {notice && <p className="admin-notice" role="status">{notice}</p>}
              <div className="admin-publish-actions"><button type="button" className="admin-discard-button" disabled={busy || (!hasChanges && !pendingFile)} onClick={discardDraft}>DISCARD DRAFT</button><button type="button" className="admin-save-button" disabled={busy || !canWrite || (workspaceTab === "thumbnails" ? (!pendingFile || !newThumbnail.title.trim()) : (!hasChanges && !pendingFile))} onClick={save}>{busy ? "PUBLISHING…" : workspaceTab === "thumbnails" ? "UPLOAD THUMBNAIL + PUBLISH" : pendingFile ? "UPLOAD + PUBLISH" : hasChanges ? "PUBLISH CHANGES" : "ALL CHANGES SAVED"} <span>↗</span></button></div>
              <div className="admin-save-foot"><span>REPO / {repo}</span><span>BRANCH / {branch}</span></div>
            </div>
          </section>
        </div>

        <footer className="admin-footer"><span>KRISHNA® / PRIVATE VISUAL STUDIO</span><span>NO SITE BUILDER LOCK-IN / CONFIG LIVES IN YOUR REPOSITORY</span><a href="/">EXIT STUDIO ↗</a></footer>
      </main>
    </div>
  );
}

