import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkAdminPassword, createAdminSession, isSameOriginRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cookieHeader(value, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return ADMIN_COOKIE_NAME + "=" + value + "; Path=/; HttpOnly; SameSite=Strict; Max-Age=" + maxAge + secure;
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Admin environment variables are not configured for this deployment. Redeploy after configuring ADMIN_PASSWORD and ADMIN_SESSION_SECRET." }, { status: 503 });
  }
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!checkAdminPassword(body?.password)) {
    return NextResponse.json({ error: "Password not accepted." }, { status: 401 });
  }
  try {
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.headers.set("Set-Cookie", cookieHeader(session.value, session.maxAge));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ error: "Could not start an admin session." }, { status: 503 });
  }
}

export async function DELETE(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", cookieHeader("", 0));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
