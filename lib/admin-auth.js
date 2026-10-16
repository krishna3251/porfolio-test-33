import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "krishna_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function signature(payload) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function checkAdminPassword(password) {
  return safeEqual(password, process.env.ADMIN_PASSWORD || "");
}

export function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
  return { value: expires + "." + signature(expires), maxAge: SESSION_TTL_SECONDS };
}

export function isAdminRequest(request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) return false;
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(ADMIN_COOKIE_NAME + "="));
  if (!cookie) return false;
  const raw = cookie.slice(ADMIN_COOKIE_NAME.length + 1);
  const dot = raw.indexOf(".");
  if (dot < 1) return false;
  const expires = raw.slice(0, dot);
  const supplied = raw.slice(dot + 1);
  if (!/^\d{9,12}$/.test(expires) || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  try {
    return safeEqual(supplied, signature(expires));
  } catch {
    return false;
  }
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!forwardedHost) return false;
  try {
    const parsed = new URL(origin);
    return parsed.host.toLowerCase() === forwardedHost.toLowerCase();
  } catch {
    return false;
  }
}
