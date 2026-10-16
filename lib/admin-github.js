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
  const file = await apiRequest(url, { headers: githubHeaders(false) });

  if (file.encoding !== "base64" || !file.content) {
    throw new Error("GitHub returned an empty or unsupported media manifest. No changes were made.");
  }

  let config;
  try {
    config = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  } catch {
    throw new Error("The saved media manifest on GitHub is not valid JSON. No changes were made.");
  }

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("The saved media manifest on GitHub has an invalid structure. No changes were made.");
  }

  return { config, canWrite: Boolean(process.env.GITHUB_TOKEN), branch };
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


// Create an uncommitted Git blob so multiple image files can be staged and
// published with the media manifest in one atomic branch update.
export async function createGitHubBlob(content) {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured in Vercel.");
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
  return apiRequest(API_BASE + "/repos/" + SITE_REPOSITORY + "/git/blobs", {
    method: "POST",
    headers: { ...githubHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({ content: bytes.toString("base64"), encoding: "base64" }),
  });
}

export async function writeGitHubBatch(files, message) {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not configured in Vercel.");
  if (!Array.isArray(files) || files.length < 1 || files.length > 25) {
    throw new Error("A batch must contain between 1 and 25 files.");
  }

  const refUrl = API_BASE + "/repos/" + SITE_REPOSITORY + "/git/ref/heads/" + encodeURIComponent(WRITE_BRANCH);
  const ref = await apiRequest(refUrl, { headers: githubHeaders(true) });
  const parentSha = ref?.object?.sha;
  if (!parentSha) throw new Error("Could not read the current GitHub branch head.");

  const parentCommit = await apiRequest(API_BASE + "/repos/" + SITE_REPOSITORY + "/git/commits/" + parentSha, {
    headers: githubHeaders(true),
  });
  const baseTree = parentCommit?.tree?.sha;
  if (!baseTree) throw new Error("Could not read the current GitHub tree.");

  const treeEntries = [];
  for (const file of files) {
    if (!file || typeof file.path !== "string" || !file.path || file.path.startsWith("/") || file.path.split("/").includes("..")) {
      throw new Error("A batch file path is invalid.");
    }
    let sha = file.sha;
    if (!sha) {
      if (typeof file.content !== "string" && !Buffer.isBuffer(file.content)) {
        throw new Error("Each batch file needs content or an existing blob SHA.");
      }
      const blob = await createGitHubBlob(file.content);
      sha = blob.sha;
    }
    if (!/^[a-f0-9]{40}$/i.test(String(sha))) throw new Error("A batch file has an invalid blob SHA.");
    treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha });
  }

  const tree = await apiRequest(API_BASE + "/repos/" + SITE_REPOSITORY + "/git/trees", {
    method: "POST",
    headers: { ...githubHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({ base_tree: baseTree, tree: treeEntries }),
  });
  const commit = await apiRequest(API_BASE + "/repos/" + SITE_REPOSITORY + "/git/commits", {
    method: "POST",
    headers: { ...githubHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] }),
  });

  await apiRequest(API_BASE + "/repos/" + SITE_REPOSITORY + "/git/refs/heads/" + encodeURIComponent(WRITE_BRANCH), {
    method: "PATCH",
    headers: { ...githubHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { commit: { sha: commit.sha, html_url: commit.html_url } };
}
