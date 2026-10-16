import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { createGitHubBlob, readSiteMedia, SITE_REPOSITORY, WRITE_BRANCH, writeGitHubBatch, writeGitHubFile } from "@/lib/admin-github";
import seed from "@/lib/site-media-seed";
import { THUMBNAIL_FILENAMES } from "@/lib/thumbnails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const thumbnailSet = new Set(THUMBNAIL_FILENAMES);
const THUMBNAIL_CATEGORIES = new Set(["GENSHIN", "HSR", "WUWA", "VALORANT", "PUBG", "NTE", "FORZA", "OTHER"]);
const allowedMime = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function validSrc(src) {
  if (typeof src !== "string" || src.length > 2048) return false;
  if (src === "") return true;
  if (src.startsWith("/") && !src.startsWith("//") && !src.startsWith("/\\") && !src.includes("..")) return true;
  try { return new URL(src).protocol === "https:"; } catch { return false; }
}

function normalizedSettings(value, fallback) {
  const item = { ...fallback, ...(value && typeof value === "object" ? value : {}) };
  if (!validSrc(item.src)) item.src = fallback.src || "";
  item.fit = item.fit === "contain" ? "contain" : "cover";
  item.positionX = Math.max(0, Math.min(100, Number(item.positionX ?? 50) || 0));
  item.positionY = Math.max(0, Math.min(100, Number(item.positionY ?? 50) || 0));
  item.scale = Math.max(0.5, Math.min(2.5, Number(item.scale ?? 1) || 1));
  item.opacity = Math.max(0, Math.min(1, Number(item.opacity ?? 1)));
  item.overlayOpacity = Math.max(0, Math.min(1, Number(item.overlayOpacity ?? 0)));
  item.overlayColor = /^#[0-9a-f]{6}$/i.test(item.overlayColor || "") ? item.overlayColor : "#a8271b";
  item.visible = item.visible !== false;
  return item;
}

function sanitizeConfig(input) {
  const config = input && typeof input === "object" ? input : seed;
  const result = {
    version: Math.max(seed.version, Number(config.version) || seed.version),
    design: { ...seed.design, ...(config.design || {}) },
    copy: { ...seed.copy, ...(config.copy || {}) },
    slots: {},
    overrides: {},
    thumbnails: Array.isArray(config.thumbnails) ? config.thumbnails.slice(-200).map((thumbnail, index) => {
      const filename = typeof thumbnail?.filename === "string" && /^[a-z0-9][a-z0-9._-]{0,150}\.(?:jpg|jpeg|png|webp|avif)$/i.test(thumbnail.filename) ? thumbnail.filename : "";
      const category = THUMBNAIL_CATEGORIES.has(thumbnail?.category) ? thumbnail.category : "OTHER";
      const src = validSrc(thumbnail?.src) ? thumbnail.src : "";
      const createdAt = typeof thumbnail?.createdAt === "string" && Number.isFinite(Date.parse(thumbnail.createdAt)) ? new Date(thumbnail.createdAt).toISOString() : "";
      const id = typeof thumbnail?.id === "string" && /^[a-z0-9-]{1,100}$/i.test(thumbnail.id) ? thumbnail.id : "uploaded-" + (filename || index);
      const title = typeof thumbnail?.title === "string" ? thumbnail.title.trim().slice(0, 120) : "";
      const subtitle = typeof thumbnail?.subtitle === "string" ? thumbnail.subtitle.trim().slice(0, 180) : "";
      return { id, filename, src, category, title: title || filename, subtitle, createdAt };
    }).filter((thumbnail) => thumbnail.filename && thumbnail.src) : [],
  };
  const themes = ["editorial", "darkroom", "sunset", "minimalism", "custom"];
  if (!themes.includes(result.design.theme)) result.design.theme = "editorial";
  ["paper", "surface", "ink", "muted", "accent", "orange", "border"].forEach((key) => {
    if (!/^#[0-9a-f]{6}$/i.test(result.design[key] || "")) result.design[key] = seed.design[key];
  });
  result.design.radius = Math.max(4, Math.min(28, Number(result.design.radius) || seed.design.radius));
  Object.keys(seed.slots).forEach((key) => {
    result.slots[key] = normalizedSettings(config.slots?.[key], seed.slots[key]);
    result.slots[key].label = seed.slots[key].label;
    result.slots[key].group = seed.slots[key].group;
    result.slots[key].description = seed.slots[key].description;
  });
  if (config.overrides && typeof config.overrides === "object") {
    Object.entries(config.overrides).forEach(([filename, value]) => {
      if (!thumbnailSet.has(filename) && !result.thumbnails.some((thumbnail) => thumbnail.filename === filename)) return;
      result.overrides[filename] = normalizedSettings(value, {
        label: filename,
        group: "Thumbnail archive",
        description: "Image override for " + filename,
        src: "",
        fit: "cover",
        positionX: 50,
        positionY: 50,
        scale: 1,
        opacity: 1,
        overlayColor: "#a8271b",
        overlayOpacity: 0,
        visible: true,
      });
    });
  }
  ["heroEyebrow", "heroDescription", "profileLead", "profileBody"].forEach((key) => {
    const value = result.copy[key];
    result.copy[key] = typeof value === "string" ? value.slice(0, key === "heroDescription" || key === "profileBody" ? 500 : 180) : seed.copy[key];
  });
  return result;
}

function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request) {
  if (!isAdminRequest(request)) return fail("Admin login required.", 401);

  let media;
  try {
    media = await readSiteMedia();
  } catch (error) {
    return fail("Could not read the saved media manifest from GitHub. No changes were made. " + String(error.message || "").slice(0, 450), 502);
  }

  const { config, canWrite, branch } = media;
  return NextResponse.json({
    ok: true,
    config: sanitizeConfig(config),
    canWrite,
    repository: SITE_REPOSITORY,
    branch: canWrite ? WRITE_BRANCH : branch,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  if (!isAdminRequest(request)) return fail("Admin login required.", 401);
  if (!isSameOriginRequest(request)) return fail("Request origin rejected.", 403);
  if (!process.env.GITHUB_TOKEN) return fail("GitHub upload is not connected yet. Add GITHUB_TOKEN as an encrypted Vercel environment variable, then redeploy.", 503);

  let body;
  try { body = await request.json(); } catch { return fail("Invalid request body."); }

  if (body?.action === "stage-thumbnail") {
    const upload = body.upload || {};
    const mime = String(upload.contentType || "");
    if (!Object.prototype.hasOwnProperty.call(allowedMime, mime)) return fail("Use a PNG, JPEG, WebP or AVIF image.");
    if (typeof upload.data !== "string" || upload.data.length < 16 || upload.data.length > 4700000) return fail("Image is too large. Please upload an image under 3.4 MB.");
    const bytes = Buffer.from(upload.data, "base64");
    if (!bytes.length || bytes.length > 3500000) return fail("Image is too large. Please upload an image under 3.4 MB.");
    const name = String(body.title || upload.filename || "thumbnail")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 42) || "thumbnail";
    const filename = "thumbnail-" + randomUUID() + "-" + name + "." + allowedMime[mime];
    try {
      const blob = await createGitHubBlob(bytes);
      return NextResponse.json({
        ok: true,
        staged: { filename, blobSha: blob.sha },
        message: "Image staged. It will remain unpublished until you publish the batch.",
      }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      return fail("Could not stage image. " + String(error.message || "").slice(0, 500), 502);
    }
  }

  if (!body?.config || JSON.stringify(body.config).length > 220000) return fail("Configuration is invalid or too large.");

  let latest;
  try {
    latest = await readSiteMedia();
  } catch (error) {
    return fail("Could not read the saved media manifest from GitHub. No changes were made. " + String(error.message || "").slice(0, 450), 502);
  }

  const config = sanitizeConfig(body.config);
  config.version = Math.max(latest.config.version || 1, config.version || 1) + 1;

  if (body.action === "publish-thumbnail-batch") {
    if (!Array.isArray(body.thumbnails) || body.thumbnails.length < 1 || body.thumbnails.length > 20) {
      return fail("Choose between 1 and 20 thumbnails to publish.");
    }
    const knownNames = new Set([
      ...THUMBNAIL_FILENAMES,
      ...(config.thumbnails || []).map((thumbnail) => thumbnail.filename),
    ]);
    const entries = [];
    for (const item of body.thumbnails) {
      const filename = typeof item?.filename === "string" ? item.filename : "";
      const blobSha = typeof item?.blobSha === "string" ? item.blobSha : "";
      const category = THUMBNAIL_CATEGORIES.has(item?.category) ? item.category : "";
      const title = typeof item?.title === "string" ? item.title.trim().slice(0, 120) : "";
      const subtitle = typeof item?.subtitle === "string" ? item.subtitle.trim().slice(0, 180) : "";
      if (!/^thumbnail-[a-f0-9-]{36}-[a-z0-9-]{1,42}\.(?:jpg|png|webp|avif)$/i.test(filename)) return fail("A staged thumbnail filename is invalid.");
      if (!/^[a-f0-9]{40}$/i.test(blobSha)) return fail("A staged thumbnail blob is invalid.");
      if (!category) return fail("Choose a category for every thumbnail.");
      if (!title) return fail("Add a title for every thumbnail.");
      if (knownNames.has(filename)) return fail("A thumbnail with the same filename already exists. Please select the files again.");
      knownNames.add(filename);
      entries.push({
        id: "upload-" + randomUUID(),
        filename,
        src: "/uploads/" + filename,
        category,
        title,
        subtitle,
        createdAt: new Date().toISOString(),
      });
    }
    config.thumbnails = [...(config.thumbnails || []), ...entries].slice(-200);
    try {
      const files = [
        ...body.thumbnails.map((item) => ({ path: "public/uploads/" + item.filename, sha: item.blobSha })),
        { path: "public/site-media.json", content: JSON.stringify(config, null, 2) + "\n" },
      ];
      const commit = await writeGitHubBatch(files, "Publish " + entries.length + " portfolio thumbnails");
      return NextResponse.json({
        ok: true,
        config,
        commit: commit.commit?.html_url || commit.commit?.sha || "",
        message: "Published " + entries.length + " thumbnail" + (entries.length === 1 ? "" : "s") + " in one GitHub commit. Vercel will deploy the archive update.",
      }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      return fail("Could not publish the thumbnail batch. " + String(error.message || "").slice(0, 650), 502);
    }
  }

  const upload = body.upload;
  if (body.target?.kind === "new-thumbnail" && !upload) return fail("Choose an image before adding a thumbnail.");
  if (upload) {
    const mime = String(upload.contentType || "");
    if (!Object.prototype.hasOwnProperty.call(allowedMime, mime)) return fail("Use a PNG, JPEG, WebP or AVIF image.");
    if (typeof upload.data !== "string" || upload.data.length < 16 || upload.data.length > 4700000) return fail("Image is too large. Please upload an image under 3.4 MB.");
    const target = body.target || {};
    let settings;
    let name;
    let newThumbnail = null;
    const uploadedEntry = Array.isArray(config.thumbnails) ? config.thumbnails.find((thumbnail) => thumbnail.filename === target.key) : null;
    if (target.kind === "slot" && Object.prototype.hasOwnProperty.call(seed.slots, target.key)) {
      settings = config.slots[target.key];
      name = target.key;
    } else if (target.kind === "thumbnail" && (thumbnailSet.has(target.key) || uploadedEntry)) {
      settings = config.overrides[target.key] || normalizedSettings(null, {
        label: uploadedEntry?.title || target.key,
        group: "Thumbnail archive",
        description: "Image override for " + (uploadedEntry?.title || target.key),
        src: uploadedEntry?.src || "",
        fit: "cover", positionX: 50, positionY: 50, scale: 1, opacity: 1,
        overlayColor: "#a8271b", overlayOpacity: 0, visible: true,
      });
      name = target.key.replace(/\.[^.]+$/, "");
    } else if (target.kind === "new-thumbnail") {
      const category = THUMBNAIL_CATEGORIES.has(target.category) ? target.category : "";
      const title = typeof target.title === "string" ? target.title.trim().slice(0, 120) : "";
      if (!category) return fail("Choose a valid thumbnail category.");
      if (!title) return fail("Add a title for this thumbnail.");
      newThumbnail = {
        id: "upload-" + Date.now(),
        category,
        title,
        subtitle: typeof target.subtitle === "string" ? target.subtitle.trim().slice(0, 180) : "",
        createdAt: new Date().toISOString(),
      };
      name = "thumb-upload-" + category.toLowerCase();
    } else {
      return fail("Select a valid image slot or thumbnail category before uploading.");
    }

    const ext = allowedMime[mime];
    const slug = String(name).toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "portfolio-image";
    const fileName = slug + "-" + Date.now() + "." + ext;
    const path = "public/uploads/" + fileName;
    const bytes = Buffer.from(upload.data, "base64");
    if (bytes.length > 3500000) return fail("Image is too large. Please upload an image under 3.4 MB.");
    try {
      await writeGitHubFile(path, bytes, "Upload portfolio media: " + fileName);
      if (newThumbnail) {
        newThumbnail.filename = fileName;
        newThumbnail.src = "/uploads/" + fileName;
        config.thumbnails = [...(config.thumbnails || []), newThumbnail].slice(-200);
      } else {
        settings.src = "/uploads/" + fileName;
        if (target.kind === "slot") config.slots[target.key] = settings;
        else config.overrides[target.key] = settings;
      }
    } catch (error) {
      return fail(String(error.message || "Image upload failed.").slice(0, 750), 502);
    }
  }

  try {
    const content = JSON.stringify(config, null, 2) + "\n";
    const commit = await writeGitHubFile("public/site-media.json", content, "Update portfolio media and design settings");
    return NextResponse.json({
      ok: true,
      config,
      commit: commit.commit?.html_url || commit.commit?.sha || "",
      message: upload ? "Image and settings saved to GitHub. The site will update after Vercel finishes deploying." : "Settings saved to GitHub. The site will update after Vercel finishes deploying.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return fail("Could not save the media manifest. " + String(error.message || "").slice(0, 750), 502);
  }
}
