import { NextResponse } from "next/server";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { readSiteMedia, SITE_REPOSITORY, WRITE_BRANCH, writeGitHubFile } from "@/lib/admin-github";
import seed from "@/lib/site-media-seed";
import { THUMBNAIL_FILENAMES } from "@/lib/thumbnails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const thumbnailSet = new Set(THUMBNAIL_FILENAMES);
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
      if (!thumbnailSet.has(filename)) return;
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
  const { config, canWrite, branch } = await readSiteMedia();
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
  if (!body?.config || JSON.stringify(body.config).length > 220000) return fail("Configuration is invalid or too large.");

  const latest = await readSiteMedia();
  const config = sanitizeConfig(body.config);
  config.version = Math.max(latest.config.version || 1, config.version || 1) + 1;

  const upload = body.upload;
  if (upload) {
    const mime = String(upload.contentType || "");
    if (!Object.prototype.hasOwnProperty.call(allowedMime, mime)) return fail("Use a PNG, JPEG, WebP or AVIF image.");
    if (typeof upload.data !== "string" || upload.data.length < 16 || upload.data.length > 4700000) return fail("Image is too large. Please upload an image under 3.4 MB.");
    const target = body.target || {};
    let settings;
    let name;
    if (target.kind === "slot" && Object.prototype.hasOwnProperty.call(seed.slots, target.key)) {
      settings = config.slots[target.key];
      name = target.key;
    } else if (target.kind === "thumbnail" && thumbnailSet.has(target.key)) {
      settings = config.overrides[target.key] || normalizedSettings(null, {
        label: target.key, group: "Thumbnail archive", description: target.key, src: "",
        fit: "cover", positionX: 50, positionY: 50, scale: 1, opacity: 1,
        overlayColor: "#a8271b", overlayOpacity: 0, visible: true,
      });
      config.overrides[target.key] = settings;
      name = target.key.replace(/\.[^.]+$/, "");
    } else {
      return fail("Select a valid image slot before uploading.");
    }

    const ext = allowedMime[mime];
    const slug = String(name).toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "portfolio-image";
    const fileName = slug + "-" + Date.now() + "." + ext;
    const path = "public/uploads/" + fileName;
    const bytes = Buffer.from(upload.data, "base64");
    if (bytes.length > 3500000) return fail("Image is too large. Please upload an image under 3.4 MB.");
    try {
      await writeGitHubFile(path, bytes, "Upload portfolio media: " + fileName);
      settings.src = "/uploads/" + fileName;
      if (target.kind === "slot") config.slots[target.key] = settings;
      else config.overrides[target.key] = settings;
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
