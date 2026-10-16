import seed from "@/lib/site-media-seed";

const API_BASE = "https://api.github.com";
export const SITE_REPOSITORY = process.env.GITHUB_REPO || "krishna3251/porfolio-test-33";
export const WRITE_BRANCH = process.env.GITHUB_BRANCH || "main";

function encodedPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function githubHeaders(write = false) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Krishna-Portfolio-Admin",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;
  if (write && !process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured in Vercel.");
  return headers;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, { ...options, cache: "no-store" });
  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    let message = raw;
    try { message = JSON.parse(raw)?.message || raw; } catch {}
    const lower = String(message).toLowerCase();

    if (response.status === 401) {
      throw new Error("GitHub rejected GITHUB_TOKEN as invalid or expired. Create a new fine-grained token for " + SITE_REPOSITORY + ", update GITHUB_TOKEN in Vercel Production, then redeploy.");
    }
    if (response.status === 403 && (lower.includes("resource not accessible by personal access token") || lower.includes("fine-grained"))) {
      throw new Error("GitHub accepted the token but denied repository writes. Fix: GitHub → Settings → Developer settings → Fine-grained tokens → open this token → select " + SITE_REPOSITORY + " under Repository access → set Repository permissions → Contents to Read and write. Save or regenerate the token, replace GITHUB_TOKEN in Vercel Production, then redeploy. This save was not published.");
    }
    if (response.status === 403) {
      throw new Error("GitHub blocked the write (403). Check Contents: Read and write on the token and confirm branch rules allow this commit. GitHub detail: " + String(message).slice(0, 180));
    }
    if (response.status === 404) {
      throw new Error("GitHub could not find this repository/file. Confirm GITHUB_REPO is krishna3251/porfolio-test-33 and that your token includes this repository.");
    }
    throw new Error("GitHub API returned " + response.status + ": " + String(message).slice(0, 240));
  }
  return response.json();
}

export async function readSiteMedia() {
  const branch = process.env.GITHUB_TOKEN ? WRITE_BRANCH : (process.env.VERCEL_GIT_COMMIT_REF || WRITE_BRANCH);
  const url = API_BASE + "/repos/" + SITE_REPOSITORY + "/contents/public/site-media.json?ref=" + encodeURIComponent(branch);
  try {
    const file = await apiRequest(url, { headers: githubHeaders(false) });
    if (file.encoding === "base64" && file.content) {
      return { config: JSON.parse(Buffer.from(file.content, "base64").toString("utf8")), canWrite: Boolean(process.env.GITHUB_TOKEN), branch };
    }
  } catch {}
  return { config: seed, canWrite: Boolean(process.env.GITHUB_TOKEN), branch };
}

export async function writeGitHubFile(path, content, message) {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured in Vercel.");
  const url = API_BASE + "/repos/" + SITE_REPOSITORY + "/contents/" + encodedPath(path);
  let sha;
  try {
    const existing = await apiRequest(url + "?ref=" + encodeURIComponent(WRITE_BRANCH), { headers: githubHeaders(true) });
    if (existing && existing.sha) sha = existing.sha;
  } catch {}
  const body = {
    message,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content, "utf8").toString("base64"),
    branch: WRITE_BRANCH,
  };
  if (sha) body.sha = sha;
  return apiRequest(url, {
    method: "PUT",
    headers: { ...githubHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
